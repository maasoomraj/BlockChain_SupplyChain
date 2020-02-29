const Transaction = require('./transaction');
const Wallet = require('./index');
const { verifySignature } = require('../util/index');

describe('Transaction',()=>{
    let transaction, senderWallet, recipient, amount;

    beforeEach(()=>{
        senderWallet = new Wallet();
        recipient = "masoom";
        amount = 20;
        
        transaction = new Transaction({senderWallet : senderWallet, recipient : recipient, amount : amount});
    });

    it('transaction has an unique `id`',()=>{
        // console.log(transaction.id);
        expect(transaction).toHaveProperty('id');
    });


    describe('Output',()=>{
        it('has an `outputMap`',()=>{
            expect(transaction).toHaveProperty('outputMap');
        });
    
        it('`outputMap` deducted amount when transferred',()=>{
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance-amount);
        });
    });
    

    describe('Input',()=>{

        it('has an `input`',()=>{
            expect(transaction).toHaveProperty('input');
        });

        it('has a `timestamp` in the `input`',()=>{
            expect(transaction.input).toHaveProperty('timestamp');
        });

        it('sets the `amount` to `senderWallet` balance',()=>{
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it('set the `address` to `senderWallet` `publicKey`',()=>{
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it('`sign` the `input`',()=>{
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data : transaction.outputMap,
                    signature : transaction.input.signature
                })
            ).toBe(true);
        });
    });

    describe('validTransaction()',()=>{

        describe('transaction is valid',()=>{
            it('validates a valid `transaction`',()=>{
                expect(Transaction.validTransaction(transaction)).toBe(true);
            });
        }); 

        describe('transaction is invalid',()=>{
            it('invalidates a `transaction` whose `outputMap` `senderWallet` is tampered',()=>{
                transaction.outputMap[senderWallet.publicKey] = 500;
                expect(Transaction.validTransaction(transaction)).toBe(false);
            });

            it('invalidates a `transaction` whose `outputMap` `recipient` is tampered',()=>{
                transaction.outputMap[recipient] = 500;
                expect(Transaction.validTransaction(transaction)).toBe(false);
            });
    
            it('invalidates a `transaction` whose `signature` is tampered', ()=>{
                transaction.input.signature = new Wallet().sign('random data');
                expect(Transaction.validTransaction(transaction)).toBe(false);
            });
        });
        
    });
});