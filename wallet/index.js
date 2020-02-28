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
}

module.exports = Wallet;