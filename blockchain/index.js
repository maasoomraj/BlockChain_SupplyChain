const Block = require('./block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/index');
const {REWARD_INPUT , MINING_REWARD, SENDER_INPUT} = require('../util/index');

class BlockChain
{
    constructor()
    {
        this.chain = [Block.genesis()];
    }

    addBlock({data})
    {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block;
    }

    isValidChain(chain)
    {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;


        for(var i=1;i<chain.length;i++)
        {
            const presentBlock = chain[i];
            const lastBlock = chain[i-1];

            if(presentBlock.lastHash !== lastBlock.hash || presentBlock.hash !== Block.hashBlock(presentBlock))
                return false;
        }

        return true;
    }

    replaceChain(newChain, validateTransaction , onSuccess)
    {
        if(newChain.length <= this.chain.length)
        {
            console.log("\nBlockchain -- index -- replaceChain -> FAILS Smaller Chain, Can't replace chain.\n");
            return;
        }
        else if(!this.isValidChain(newChain))
        {
            console.log("\nBlockchain -- index -- replaceChain  -> FAILS isValidChain() method.\n")
            return;
        }

        if(validateTransaction && !this.validTransactionData({ chain : newChain })){
            console.log("\nBlockchain -- index -- replaceChain  -> FAILS validTransactionData() method.\n")
            return;
        }

        if(onSuccess){
            onSuccess();
        }

        console.log("\nBlockchain -- index -- replaceChain  -> SUCCESSFUL Replacing New Chain\n");
        this.chain = newChain;
        return;
    }

    validTransactionData({ chain }){
        let blockNumber = 0;
        for(let i=1; i<chain.length ; i++){
            blockNumber+=1;
            const block = chain[i];
            const transactionSet = new Set();
            let numberRewardTransaction = 0;
            let numberTransactions = 0;

            for(let transaction of block.data){
                // console.log("\n"+transaction.input.address+"\n");
                numberTransactions += 1;
                if(transaction.input.address === SENDER_INPUT.sender_address){
                    console.log("Validating Transaction Data of type `send` ...");
                    if(!Transaction.validTransaction(transaction)){
                        console.log("ERROR 1 : `send` transaction is not valid.");
                        return false;
                    }
                }else if(transaction.input.address === SENDER_INPUT.receiver_address){
                    console.log("Validating Transaction Data of type `receive` ...");
                    if(!Transaction.validTransaction(transaction)){
                        // console.log("\nBlockchain -- index -- validTransactionData  -> FALSE 2\n");
                        console.log("ERROR 1 : `receive` transaction is not valid.");

                        return false;
                    }

                    if(!this.validReceiverData({chain : chain, blockNumber : blockNumber,receiver_transaction : transaction})){
                        // console.log("\nBlockchain -- index -- validTransactionData  -> FALSE 3\n");
                        console.log("ERROR 2 : `receive` transaction is not valid.");

                        return false;
                    }

                    if(!this.onlyOneReceiverData({chain : chain, blockNumber : blockNumber,receiver_transaction : transaction})){
                        // console.log("\nBlockchain -- index -- validTransactionData  -> FALSE 10\n");
                        console.log("ERROR 3 : `receive` transaction is not valid.");

                        return false;
                    }
                }else if(transaction.input.address === REWARD_INPUT.address){
                    console.log("Validating Transaction Data of type `reward` ...");
                    numberRewardTransaction+=1;

                    if(numberRewardTransaction > 1){
                        // console.log("\nBlockchain -- index -- validTransactionData  -> FALSE 4\n");
                        console.log("ERROR 1 : `reward` transaction is not valid.");

                        return false;
                    }

                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD){
                        // console.log("\nBlockchain -- index -- validTransactionData  -> FALSE 5\n");
                        console.log("ERROR 2 : `reward` transaction is not valid.");

                        return false;
                    }
                }else{
                    console.log("Validating Transaction Data of type `transact` ...");

                    if(!Transaction.validTransaction(transaction)){
                        // console.log("\nBlockchain -- index -- validTransactionData  -> FALSE 6\n");
                        console.log("ERROR 1 : `transact` transaction is not valid.");

                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain : this.chain,
                        address : transaction.input.address
                    });

                    if(transaction.input.amount !== trueBalance){
                        // console.log("\nBlockchain -- index -- validTransactionData  -> FALSE 7\n");
                        console.log("ERROR 2 : `transact` transaction is not valid.");

                        return false;
                    }

                    if(transactionSet.has(transaction)){
                        // console.log("\nBlockchain -- index -- validTransactionData  -> FALSE 8\n");
                        console.log("ERROR 3 : `transact` transaction is not valid.");

                        return false;
                    }else{
                        transactionSet.add(transaction);
                    }
                }

            }
            if(numberTransactions<=1){
                // console.log("\nBlockchain -- index -- validTransactionData  -> FALSE 9\n");
                console.log("ERROR : transaction is not valid.");

                return false;
            }
        }

        return true;
    }

    validReceiverData({chain, blockNumber ,receiver_transaction}){
        for(let i=blockNumber-1;i>0;i--){
            const block = chain[i];

            for(let transaction of block.data){
                if(transaction.input.address === SENDER_INPUT.sender_address){
                    if(transaction.input.from === receiver_transaction.input.from){
                        if(transaction.input.product === receiver_transaction.input.product){
                            if(transaction.input.amount === receiver_transaction.input.amount){
                                if(transaction.input.to === receiver_transaction.input.to){
                                    // console.log("\nBlockchain -- index -- validReceiverData  -> PASSED\n");

                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    onlyOneReceiverData({chain, blockNumber ,receiver_transaction}){
        for(let i=blockNumber-1;i>0;i--){
            const block = chain[i];

            for(let transaction of block.data){
                if(transaction.input.address === SENDER_INPUT.receiver_address){
                    if(transaction.input.from === receiver_transaction.input.from){
                        if(transaction.input.product === receiver_transaction.input.product){
                            if(transaction.input.amount === receiver_transaction.input.amount){
                                if(transaction.input.to === receiver_transaction.input.to){
                                    // console.log("\nBlockchain -- index -- onlyOneReceiverData  -> FAILS\n");

                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }

        return true;
    }
}

module.exports = BlockChain;