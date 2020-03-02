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

    createTransaction({amount , recipient}){
        if(amount> this.balance){
            throw new Error('InvalidTransaction - Amount exceeds balance');
        }

        return new Transaction({senderWallet : this, recipient : recipient, amount: amount});
    }
}

module.exports = Wallet;