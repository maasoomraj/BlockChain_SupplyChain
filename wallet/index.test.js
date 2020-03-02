const Transaction = require('./transaction')
const Wallet = require('./index');
const {verifySignature} = require('../util/index'); 

describe('Wallet',()=>{

    let wallet;
    let data;

    beforeEach(()=>{
        data = "masoom";
        wallet = new Wallet();
    });

    it('has `balance` property',()=>{
        expect(wallet).toHaveProperty("balance");
    });

    it('has `publicKey` property',()=>{
        expect(wallet).toHaveProperty("publicKey");
    });

    it('has `balance` equal to `STARTING_BALANCE`',()=>{
        expect(wallet.balance).toEqual(100);
    });

    it('verifies a valid signature',()=>{
        expect(verifySignature({
            publicKey : wallet.publicKey,
            data : data,
            signature : wallet.sign(data)
        })).toBe(true);  
    });

    it('invalidates a wrong signature',()=>{
        expect(verifySignature({
            publicKey : wallet.publicKey,
            data : data,
            signature : new Wallet().sign(data)
        })).toBe(false); 
    });

    describe('CreateTransaction()',()=>{
        describe('`amount` is more than `wallet` `balance`',()=>{
            it('throws an error Invalid Transaction',()=>{
                expect(()=>wallet.createTransaction({amount : 1000, recipient : "recipient"}))
                    .toThrow('InvalidTransaction - Amount exceeds balance');
            });
        });

        describe('`amount` is valid',()=>{
            let transaction, amount, recipient;

            beforeEach(()=>{
                amount = 20;
                recipient = "recipient";
                transaction = wallet.createTransaction({amount , recipient});
            });

            it('create an instance of `Transaction`',()=>{
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('`input` of `transaction` has address wallet.publicKey',()=>{
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it('`recipient` receives the `amount`',()=>{
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });
    });
});