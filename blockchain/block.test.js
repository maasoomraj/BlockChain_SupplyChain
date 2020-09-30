const Block = require('./block');

describe('Block', () => {
  let data, lastBlock, block;
  beforeEach(() => {
    data = 'masoom';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it('the data passed is same', () => {
    expect(block.data).toEqual(data);
  });

  it('the lasthash is same as latblock hash', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  describe('cryptoHash()', () => {
    it('generates new hash for object values changed', () => {
      const foo = {};
      const originalHash = Block.cryptoHash(foo);
      foo['a'] = 'a';
      expect(Block.cryptoHash(foo)).not.toEqual(originalHash);
    });
  });
});
