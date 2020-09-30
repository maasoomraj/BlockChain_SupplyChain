const Transaction = require('../wallet/transaction');
const Blockchain = require('../blockchain/index');

class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransactions() {
    const validTransactions = this.transactionPool.validTransactions();

    validTransactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet })
    );

    const chain_copy = new Blockchain();
    chain_copy.chain = JSON.parse(JSON.stringify(this.blockchain.chain));
    chain_copy.addBlock({ data: validTransactions });

    this.blockchain.replaceChain(chain_copy.chain, true);

    this.pubsub.broadcastChain();

    this.transactionPool.clear();
  }
}

module.exports = TransactionMiner;
