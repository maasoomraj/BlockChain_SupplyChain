const Block = require('./block');

const masoomBlock = Block.mineBlock(Block.genesis() , "hello");

console.log(masoomBlock.toString());

const masoomBlock1 = Block.mineBlock(masoomBlock, "hello");

console.log(masoomBlock1.toString());