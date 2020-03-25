const Transaction = require('./transaction');
const { ec , STARTING_BALANCE } = require('../util/index');
const Block = require('../blockchain/block');

class Wallet{
    constructor(){
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data){
        return this.keyPair.sign(Block.cryptoHash(data));
    }

    createTransaction({amount , recipient, chain }){

        if(chain){
            this.balance = Wallet.calculateBalance({
                chain : chain,
                address : this.publicKey
            });
        }
        if(amount> this.balance){
            throw new Error('InvalidTransaction - Amount exceeds balance');
        }

        return new Transaction({senderWallet : this, recipient : recipient, amount: amount});
    }

    static calculateBalance({ chain , address }){
        let hasMadeTransaction = false;
        let  outputTotal = 0;

        for(let i =chain.length -1 ;i>0 ; i--){
            const block = chain[i];

            for(let transaction of block.data){

                if(transaction.input.address === address){
                    hasMadeTransaction = true;
                }

                if(transaction.outputMap[address]){
                    outputTotal += transaction.outputMap[address];
                }
            }

            if(hasMadeTransaction === true){
                break;
            }
        }

        return hasMadeTransaction ?outputTotal : STARTING_BALANCE + outputTotal;
    }
}

module.exports = Wallet;