const Block = require('./block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/index');
const {REWARD_INPUT , MINING_REWARD} = require('../util/index');

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
            console.log("Chain is smaller. Thus can't be replaced");
            return;
        }
        else if(!this.isValidChain(newChain))
        {
            console.log("Chain is not a valid chain. Corrupt chain. Can't replace.")
            return;
        }

        if(validateTransaction && !this.validTransactionData({ chain : newChain })){
            console.log("Chain has invalid transaction data.")
            return;
        }

        if(onSuccess){
            onSuccess();
        }

        console.log("Replacing New Chain");
        this.chain = newChain;
        return;
    }

    validTransactionData({ chain }){
        for(let i=1; i<chain.length ; i++){
            const block = chain[i];
            const transactionSet = new Set();
            let numberRewardTransaction = 0;

            for(let transaction of block.data){
                if(transaction.input.address === REWARD_INPUT.address){
                    numberRewardTransaction+=1;

                    if(numberRewardTransaction > 1){
                        return false;
                    }

                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD){
                        return false;
                    }
                }else{
                    if(!Transaction.validTransaction(transaction)){
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain : this.chain,
                        address : transaction.input.address
                    });

                    if(transaction.input.amount !== trueBalance){
                        return false;
                    }

                    if(transactionSet.has(transaction)){
                        return false;
                    }else{
                        transactionSet.add(transaction);
                    }
                }

            }
        }

        return true;
    }
}

module.exports = BlockChain;