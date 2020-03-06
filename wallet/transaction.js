const uuid = require('uuid/v1');
const { verifySignature , REWARD_INPUT , MINING_REWARD} = require('../util/index');

class Transaction{
    constructor({senderWallet, recipient, amount, outputMap, input}){
        this.id = uuid();
        this.outputMap = outputMap || this.createOutputMap(senderWallet,recipient,amount);
        this.input = input || this.createInput({senderWallet, outputMap : this.outputMap});
    }

    createOutputMap(senderWallet, recipient, amount){
        const outputMap = {};
        
        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        return outputMap;
    }

    createInput({senderWallet, outputMap}){
        return {
            timestamp : Date.now(),
            amount : senderWallet.balance,
            address : senderWallet.publicKey,
            signature  : senderWallet.sign(outputMap)
        };
    }

    update({senderWallet, recipient , amount}){

        if(amount > this.outputMap[senderWallet.publicKey]){
            throw new Error('Amount is more than balance');
        }

        if(!this.outputMap[recipient]){
            this.outputMap[recipient] = amount;
        }else{
            this.outputMap[recipient] += amount;
        }

        this.outputMap[senderWallet.publicKey] -= amount;

        this.input = this.createInput({senderWallet : senderWallet, outputMap : this.outputMap});
    }

    static validTransaction(transaction){
        const {input : {address , amount , signature}, outputMap } = transaction;

        // BELOW CODE EXPLANATION
        // outputMap[senderWallet.publicKey]+outputMap[recipient] = amount+senderWallet.balance-amount;
        // total outputMap = senderWallet.balance;
        // input amount = senderWallet.balance;
        // COMMENTS END

        const outputTotal = Object.values(outputMap)
            .reduce((total, outputAmount)=>total+outputAmount);

        if(amount !== outputTotal){
            return false;
        }

        if(!verifySignature({
            publicKey : address,
            data : outputMap,
            signature : signature
        })){
            return false;
        }

        return true;
    }

    static rewardTransaction({ minerWallet }){
        return new this({
            input : REWARD_INPUT,
            outputMap : {[minerWallet.publicKey] : MINING_REWARD}
        })
    }
}

module.exports = Transaction;