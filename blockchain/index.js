const Block = require('./block');

class BlockChain
{
    constructor()
    {
        this.chain = [Block.genesis()];
    }

    addBlock(data)
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

    replaceChain(newChain)
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

        console.log("Replacing New Chain");
        this.chain = newChain;
        return;
    }
}

module.exports = BlockChain;