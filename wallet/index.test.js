const Transaction = require('./transaction')
const Wallet = require('./index');
const {verifySignature} = require('../util/index');
const Blockchain = require('../blockchain/index');
const { STARTING_BALANCE } = require('../util/index');

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

    describe('createTransaction()',()=>{
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

            it('calls `Wallet.calcluateBalance` when `chain` is passed',()=>{
                const Mock = jest.fn();
                const originalBalance = Wallet.calculateBalance;
                Wallet.calculateBalance = Mock;

                wallet.createTransaction({
                    amount : 10,
                    recipient : 'test',
                    chain : new Blockchain().chain
                })

                expect(Mock).toHaveBeenCalled();

                Wallet.calculateBalance = originalBalance;
            });
        });
    });

    describe('calculateBalance()',()=>{
        let blockchain;

        beforeEach(()=>{
            blockchain = new Blockchain();
        });

        describe('no Transactions are made',()=>{
            let transactionOne, transactionTwo;

            beforeEach(()=>{
                transactionOne = new Wallet().createTransaction({
                    amount : 5,
                    recipient : 'test1'
                });

                transactionTwo = new Wallet().createTransaction({
                    amount : 10,
                    recipient : 'test2'
                });

                blockchain.addBlock({ data : [transactionOne, transactionTwo]});
            });

            it('balance should be `STARTING_BALANCE`',()=>{
                expect(
                    Wallet.calculateBalance({
                        chain : blockchain.chain,
                        address : wallet.publicKey
                    })
                ).toEqual(STARTING_BALANCE);
            });
        });

        describe('transactions are made where recipient is user',()=>{
            let transactionOne, transactionTwo, transactionThree;

            beforeEach(()=>{
                transactionOne = new Wallet().createTransaction({
                    amount : 5,
                    recipient : wallet.publicKey
                });

                transactionTwo = new Wallet().createTransaction({
                    amount : 10,
                    recipient : 'test1'
                });

                transactionThree = new Wallet().createTransaction({
                    amount : 10,
                    recipient : wallet.publicKey
                });

                blockchain.addBlock({ data : [transactionOne, transactionTwo, transactionThree]});
            });

            it('balance should be sum of `transactionOne` + `transactionThree`',()=>{

                expect(
                    Wallet.calculateBalance({
                        chain : blockchain.chain,
                        address : wallet.publicKey
                    })
                ).toEqual(
                    STARTING_BALANCE +
                    transactionOne.outputMap[wallet.publicKey] +
                    transactionThree.outputMap[wallet.publicKey]
                    );
            });
        });

        describe('`transaction` is made by user',()=>{

            let transactionOne;

            beforeEach(()=>{

                transactionOne = wallet.createTransaction({
                    amount : 10,
                    recipient : 'test-masoom'
                });

                blockchain.addBlock({ data : [transactionOne] });
            });

            describe('there is only one `transaction`',()=>{

                it('outputs correct balance',()=>{
                    expect(
                        Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address : wallet.publicKey})
                        ).toEqual(transactionOne.outputMap[wallet.publicKey]);
                });    
            });

            describe('it is surrounded by other transactions',()=>{
                let transactionTwo, transactionThree, transactionFour ,bc2;

                beforeEach(()=>{
                    bc2 = new Blockchain();

                    transactionTwo = new Wallet().createTransaction({
                        amount : 10,
                        recipient : wallet.publicKey
                    });

                    transactionThree = wallet.createTransaction({
                        amount : 20,
                        recipient : "test1"
                    });

                    bc2.addBlock({ data : [transactionTwo, transactionThree ]});

                    transactionFour = new Wallet().createTransaction({
                        amount : 30,
                        recipient : wallet.publicKey
                    });

                    bc2.addBlock({ data : [transactionFour]});

                });

                it('should have correct balance',()=>{
                    
                    expect(
                        Wallet.calculateBalance({
                            chain : bc2.chain,
                            address : wallet.publicKey
                        })
                    ).toEqual(
                        transactionFour.outputMap[wallet.publicKey] +
                        transactionTwo.outputMap[wallet.publicKey] +
                        transactionThree.outputMap[wallet.publicKey]
                    );
                });
            });

        });
    });
});