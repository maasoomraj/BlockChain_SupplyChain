const EC = require('elliptic').ec;
const Block = require('../blockchain/block');

const ec = new EC('secp256k1');

const verifySignature = ({publicKey , data, signature})=>{
    const keyFromPublic = ec.keyFromPublic(publicKey,'hex');
    return keyFromPublic.verify(Block.cryptoHash(data), signature);
};

const STARTING_BALANCE = 100;

const REWARD_INPUT = { address : '**authorised-acoount**'};

const SENDER_INPUT = { address : '**authorised-sender-account**'};

const MINING_REWARD = 5;

module.exports = { ec , verifySignature, STARTING_BALANCE, REWARD_INPUT, MINING_REWARD, SENDER_INPUT};