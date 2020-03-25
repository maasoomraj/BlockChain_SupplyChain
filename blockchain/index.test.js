const Blockchain = require('./index');
const Block = require('./block');
const Wallet = require('../wallet/index');
const Transaction = require('../wallet/transaction');

describe('BlockChain',()=>{
    let bc,bc2;

    beforeEach(()=>{
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('starts with genesis block',()=>{
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block',()=>{
        const data = "masoom";
        bc.addBlock({data : data});

        expect(bc.chain[bc.chain.length -1].data).toEqual(data);
    });

    it('invalidates a chain with corrupt genesis block',()=>{
        bc2.addBlock({data : "masoom"});
        bc2.chain[0].data = "hello";

        expect(bc2.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a corrupt chain',()=>{
        bc2.addBlock({data : "masoom"});
        bc2.addBlock({data : "hello"});
        bc2.chain[1].data = "masoom1";

        expect(bc2.isValidChain(bc2.chain)).toBe(false);
    });

    it('is Valid Chain',()=>{
        bc2.addBlock({data : "1st Block"});

        // console.log(bc2.chain[0].toString());
        // console.log(bc2.chain[1].toString());

        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('replaces a legit chain',()=>{
        bc2.addBlock({data : "masoom"});
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it('cannot replace chain of same length',()=>{
        bc.addBlock({data : "masoom"});
        bc2.addBlock({data : "hello"});

        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });

    it('cannot replace chain of length smaller than current length',()=>{
        bc.addBlock({data : "masoom"});

        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });

    it('cannot replace invalid chain',()=>{
        bc2.addBlock({data : "hello"});
        bc2.chain[1].data = "masoom";

        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);

    });

    describe('ValidTrasnactionData()',()=>{

        let transaction, rewardTransaction, wallet;

        beforeEach(()=>{

            wallet = new Wallet();
            transaction = wallet.createTransaction({
                amount : 20,
                recipient : "test-masoom"
            });
            rewardTransaction = Transaction.rewardTransaction({ minerWallet : wallet });

        });
        describe('transaction data is valid',()=>{
            it('returns true',()=>{
                bc2.addBlock({ data : [transaction, rewardTransaction ]});

                expect(bc.validTransactionData({ chain : bc2.chain })).toBe(true);
            });
        });

        describe('mining reward is tampered',()=>{

            it('returns false',()=>{
            rewardTransaction.outputMap[wallet.publicKey] = 9999;
            bc2.addBlock({ data : [transaction, rewardTransaction ]});

            expect(bc.validTransactionData({ chain : bc2.chain })).toBe(false);
            });
        });

        describe('return multiple reward Transaction',()=>{
            it('returns false',()=>{
            bc2.addBlock({ data : [transaction, rewardTransaction, rewardTransaction ]});

            expect(bc.validTransactionData({ chain : bc2.chain })).toBe(false);
            });
        });

        describe('transaction outputMap is tampered',()=>{
            it('returns false',()=>{
                transaction.outputMap[wallet.publicKey] = 9999;
            bc2.addBlock({ data : [transaction, rewardTransaction ]});

            expect(bc.validTransactionData({ chain : bc2.chain })).toBe(false);
            });
        });

        describe('input is tampered',()=>{

            it('returns false',()=>{
                wallet.balance = 9999;

            const evilOutput = {
                [wallet.publicKey] : 9900,
                testRecipient : 99
            };

            const evilTransaction = {
                input : {
                    timestamp : Date.now(),
                    amount : wallet.balance,
                    address : wallet.publicKey,
                    signature : wallet.sign(evilOutput)
                },
                outputMap : evilOutput
            }

                bc2.addBlock({ data : [evilTransaction, rewardTransaction ]});

                expect(bc.validTransactionData({ chain : bc2.chain })).toBe(false);
            });
        });

        describe('multiple transaction are made',()=>{
            it('returns false',()=>{
                bc2.addBlock({data : [transaction, transaction, transaction, rewardTransaction ]});

                expect(bc.validTransactionData({ chain : bc2.chain })).toBe(false);
            });
        });

    });
});