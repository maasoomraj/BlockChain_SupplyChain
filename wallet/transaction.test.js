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

    describe('updateTransaction()',()=>{
        let nextRecipient, nextAmount, originalSignature, latestSenderBalance;

        describe('`amount` is valid',()=>{
            beforeEach(()=>{
                nextRecipient = 'next-recipient';
                nextAmount = 25;
                originalSignature = transaction.input.signature;
                latestSenderBalance = transaction.outputMap[transaction.input.address];
    
                transaction.update({senderWallet : senderWallet, recipient : nextRecipient, amount : nextAmount});
            });
    
            it('sends the `amount` to `nextRecipient`',()=>{
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
            });
    
            it('deducts `nextAmount` from `latestSenderBalance` of `senderWallet`',()=>{
                expect(transaction.outputMap[senderWallet.publicKey]).toEqual(latestSenderBalance - nextAmount);
            });
    
            it('re-signs the `transaction`',()=>{
                expect(transaction.input.signature).not.toEqual(originalSignature);
            });
            
            it('has total `outputMap` value equal to `input.amount`',()=>{
                expect(
                    Object.values(transaction.outputMap)
                    .reduce((total, outputAmount) => total+outputAmount))
                .toEqual(transaction.input.amount);
            });

            describe('update to the same `recipient`',()=>{
                let newAmount;
    
                beforeEach(()=>{
                    newAmount = 10;
                    transaction.update({
                        senderWallet : senderWallet,
                        recipient : nextRecipient,
                        amount : newAmount
                    });
                });

                it('adds `amount` to the `recipient` address for same-recipient',()=>{
                    expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount + newAmount);
                });
    
                it('deducts the `amount` from `senderWallet` address for same-recipient',()=>{
                    expect(transaction.outputMap[senderWallet.publicKey]).toEqual(latestSenderBalance - nextAmount - newAmount);
                });
    
            });
        });

        describe('`amount` is more than `balance`',()=>{
            it('throws an error as amount is more than balance',()=>{
                expect(()=>{
                    transaction.update({
                        senderWallet : senderWallet, 
                        recipient : 'nextRecipient',
                        amount : 9999});
                }).toThrow('Amount is more than balance');
            });
        });

    });
});