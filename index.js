const bodyParser = require('body-parser');
const express = require('express');
const PubSub = require('./app/pubsub');
const request = require('request');
const path = require('path');
const Blockchain = require('./blockchain/index');
const TransactionPool = require('./wallet/transaction-pool');
const Transaction = require('./wallet/transaction');
const Wallet = require('./wallet/index');
const TransactionMiner = require('./app/transaction-miner');
const {SENDER_INPUT} = require('./util/index');

const app = express();
// let blockchain ;
// let transactionPool ;
// let wallet ;
// let pubsub ;
// let transactionMiner ;

    const blockchain = new Blockchain();
    const transactionPool = new TransactionPool();
    const wallet = new Wallet();
    const pubsub = new PubSub({blockchain , transactionPool});
    const transactionMiner = new TransactionMiner({blockchain,transactionPool, wallet, pubsub});

app.use(express.static(path.join(__dirname,'client/dist')));

const DEFAULT_PORT = 3001;
const ROOT_NODE_ADDRESS = `http://192.168.43.29:${DEFAULT_PORT}`;

app.use(bodyParser.json());

// app.get('/api/createNode',(req,res)=>{
//     blockchain = new Blockchain();
//     transactionPool = new TransactionPool();
//     wallet = new Wallet();
//     pubsub = new PubSub({blockchain , transactionPool});
//     transactionMiner = new TransactionMiner({blockchain,transactionPool, wallet, pubsub});

//     res.json(blockchain.chain);
// });

app.get('/api/blocks', (req,res) => {
    res.json(blockchain.chain);
});

app.post('/api/senderTransaction', (req,res) => {
    const {input} = req.body;
    input.address = SENDER_INPUT.address;
    input.from = wallet.publicKey;

    // console.log(input.address);
    
    const transaction = Transaction.senderTransaction({input : input});
    pubsub.broadcastTransaction(transaction);
    transactionPool.setTransaction(transaction);

    res.json(blockchain.chain);
});

app.post('/api/mine', (req,res) => {
    const {data} = req.body;

    blockchain.addBlock({data : data});

    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res)=>{
    const {amount , recipient } = req.body;

    let transaction = transactionPool.existingTransaction({ inputAddress : wallet.publicKey });

    try{
        if(transaction){
            transaction.update({
                senderWallet : wallet,
                recipient : recipient,
                amount : amount
            });
        }else{
            transaction = wallet.createTransaction({
                amount : amount,
                recipient : recipient,
                chain : blockchain.chain
            });
        }
        
    }catch(error){
        return res.status(400).json({type :'error', message : error.message});
    }

    pubsub.broadcastTransaction(transaction);

    transactionPool.setTransaction(transaction);

    // console.log(transactionPool);

    res.redirect('/api/transactionPoolMap');
});

app.get('/api/transactionPoolMap',(req, res)=>{
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res)=>{
    transactionMiner.mineTransactions();

    res.redirect('/api/blocks');
});

app.get('/api/wallet-info',(req, res)=>{

    const address = wallet.publicKey;

    res.json({
        address : address,
        balance : Wallet.calculateBalance({
            chain : blockchain.chain,
            address : address
        })
    });
});

app.get('*',(req,res)=> {
    res.sendFile(path.join(__dirname,'client/dist/index.html'));
});

const syncChains = ()=>{
    request({ url : `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body)=>{
        if(!error && response.statusCode === 200){
            const rootchain = JSON.parse(body);

            blockchain.replaceChain(rootchain);
        }
    });
};

const syncTransactionPool = ()=>{
    request({ url : `${ROOT_NODE_ADDRESS}/api/transactionPoolMap`}, (error, response, body)=>{
        if(!error && response.statusCode === 200){
            const rootTransactionPool = JSON.parse(body);

            transactionPool.setMap(rootTransactionPool);
        }
    });
};

const walletFoo = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({ wallet,recipient,amount }) => {
    const transaction = wallet.createTransaction({
        recipient,amount,chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);

};

const walletAction = () => generateWalletTransaction({
    wallet, recipient: walletFoo.publicKey, amount:5
});

const walletFooAction = () => generateWalletTransaction({
    wallet: walletFoo , recipient: walletBar.publicKey, amount:10
});

const walletBarAction = () => generateWalletTransaction({
    wallet: walletBar ,  recipient: wallet.publicKey, amount:15
});

for (let i=0; i<3; i++) {
    if (i%3 === 0) {
        walletAction();
        walletFooAction();
    } else if (i%3 === 1) {
        walletAction();
        walletBarAction();
    } else {
        walletFooAction();
        walletBarAction();
    }

    transactionMiner.mineTransactions();
}

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true')
{ 
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT ;
app.listen(`${PORT}` , () => {
    console.log(`Listening at port ${PORT}`);

    // if(PORT !== DEFAULT_PORT){
        syncChains();

        syncTransactionPool();
    // }
});