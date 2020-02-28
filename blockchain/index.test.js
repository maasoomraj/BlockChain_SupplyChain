const Blockchain = require('./index');
const Block = require('./block');

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
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length -1].data).toEqual(data);
    });

    it('invalidates a chain with corrupt genesis block',()=>{
        bc2.addBlock("masoom");
        bc2.chain[0].data = "hello";

        expect(bc2.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a corrupt chain',()=>{
        bc2.addBlock("masoom");
        bc2.addBlock("hello");
        bc2.chain[1].data = "masoom1";

        expect(bc2.isValidChain(bc2.chain)).toBe(false);
    });

    it('is Valid Chain',()=>{
        bc2.addBlock("1st Block");

        // console.log(bc2.chain[0].toString());
        // console.log(bc2.chain[1].toString());

        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('replaces a legit chain',()=>{
        bc2.addBlock("masoom");
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it('cannot replace chain of same length',()=>{
        bc.addBlock("masoom");
        bc2.addBlock("hello");

        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });

    it('cannot replace chain of length smaller than current length',()=>{
        bc.addBlock("masoom");

        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });

    it('cannot replace invalid chain',()=>{
        bc2.addBlock("hello");
        bc2.chain[1].data = "masoom";

        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);

    });
});