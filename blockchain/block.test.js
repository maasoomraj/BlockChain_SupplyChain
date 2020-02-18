const Block = require('./block');

describe('Block', () => {

    let data, lastBlock , block;
    beforeEach(() => {
        data = "masoom";
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('the data passed is same',() => {
        expect(block.data).toEqual(data);
    });

    it('the lasthash is same as latblock hash', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });
});