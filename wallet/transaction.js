const uuid = require('uuid/v1');
const { verifySignature , REWARD_INPUT , MINING_REWARD, SENDER_INPUT} = require('../util/index');

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

        if(address === SENDER_INPUT.sender_address){
            if(outputMap[SENDER_INPUT.receiver_address] !== SENDER_INPUT.reward){
                console.log("\wallet -- transaction.js -- validTransaction  -> FALSE 1\n");
                return false;
            }

            return true;
        }

        if(address === SENDER_INPUT.receiver_address){
            if(outputMap[SENDER_INPUT.sender_address] !== SENDER_INPUT.reward){
                console.log("\wallet -- transaction.js -- validTransaction  -> FALSE 2\n");
                return false;
            }

            return true;
        }

        // BELOW CODE EXPLANATION
        // outputMap[senderWallet.publicKey]+outputMap[recipient] = amount+senderWallet.balance-amount;
        // total outputMap = senderWallet.balance;
        // input amount = senderWallet.balance;
        // COMMENTS END

        const outputTotal = Object.values(outputMap)
            .reduce((total, outputAmount)=>total+outputAmount);

        if(amount !== outputTotal){
            console.log("\wallet -- transaction.js -- validTransaction  -> FALSE 3\n");
            return false;
        }

        if(!verifySignature({
            publicKey : address,
            data : outputMap,
            signature : signature
        })){
            console.log("\wallet -- transaction.js -- validTransaction  -> FALSE 4\n");
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