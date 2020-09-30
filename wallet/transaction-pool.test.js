const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain/index');

describe('TransactionPool', () => {
  let transaction, transactionPool, senderWallet;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();

    transaction = new Transaction({
      senderWallet: senderWallet,
      recipient: 'test-recipient',
      amount: 10,
    });
  });

  it('adds a new `transaction`', () => {
    transactionPool.setTransaction(transaction);

    expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
  });

  describe('ExistingTransactions()', () => {
    it('returns the `transaction` which is already in the pool', () => {
      transactionPool.setTransaction(transaction);

      expect(
        transactionPool.existingTransaction({
          inputAddress: senderWallet.publicKey,
        })
      ).toBe(transaction);
    });
  });

  describe('ValidTransactions()', () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [];

      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({
          senderWallet: senderWallet,
          recipient: 'recipient',
          amount: 20,
        });

        if (i % 3 === 0) {
          transaction.input.amount = 2000;
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign('masoom');
        } else {
          validTransactions.push(transaction);
        }

        transactionPool.setTransaction(transaction);
      }
    });

    it('returns only `valdiTransactions` from `transactionPool`', () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });
  });

  describe('clear Transaction', () => {
    it('clears the `transactionPool`', () => {
      transactionPool.clear();

      expect(transactionPool.transactionMap).toEqual({});
    });
  });

  describe('clears `transactions` which are there in blockchain', () => {
    it('clears the `transactions` that are already in `blockchain`', () => {
      const blockchain = new Blockchain();
      const remainingTransactionMap = {};

      for (let i = 0; i < 10; i++) {
        const transaction = new Wallet().createTransaction({
          amount: 5,
          recipient: 'test-recipient',
        });

        transactionPool.setTransaction(transaction);

        if (i % 3 === 0) {
          blockchain.addBlock({ data: [transaction] });
        } else {
          remainingTransactionMap[transaction.id] = transaction;
        }
      }

      transactionPool.clearBlockchainTransactions({ chain: blockchain.chain });

      expect(transactionPool.transactionMap).toEqual(remainingTransactionMap);
    });
  });
});
