const SHA256 = require('crypto-js/sha256');
const MINE_RATE = 120000;
// We can vary mine rate to get how much time one block should take to mine

class Block {
  constructor(timestamp, lastHash, hash, data, difficulty, nonce) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }

  toString() {
    return `Block -
        timestamp = ${this.timestamp}
        lastHash  = ${this.lastHash.substring(0, 10)}
        hash      = ${this.hash.substring(0, 10)}
        data      = ${this.data}
        difficulty= ${this.difficulty}
        nonce     = ${this.nonce}`;
  }

  static genesis() {
    return new this(1, '---', '000000', 'NULL', 2, 0);
  }

  static mineBlock(lastBlock, data) {
    // const difficulty = lastBlock.difficulty;
    const lastHash = lastBlock.hash;
    let nonce = 0;
    let timestamp, hash;
    let difficulty;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(
        lastBlock.timestamp,
        timestamp,
        lastBlock.difficulty
      );
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, difficulty, nonce);
  }

  static adjustDifficulty(LastTimestamp, timestamp, difficulty) {
    const difference = timestamp - LastTimestamp;

    if (difficulty < 1) {
      return 1;
    }

    if (difference > MINE_RATE) {
      return difficulty - 1;
    } else {
      return difficulty + 1;
    }
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return SHA256(
      `${timestamp}${lastHash}${data}${difficulty}${nonce}`
    ).toString();
  }

  static hashBlock(block) {
    return Block.hash(
      block.timestamp,
      block.lastHash,
      block.data,
      block.nonce,
      block.difficulty
    );
  }

  static cryptoHash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }
}

module.exports = Block;
