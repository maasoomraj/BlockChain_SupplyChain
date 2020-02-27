const bodyParser = require('body-parser');
const express = require('express');
const PubSub = require('./pubsub');
const Blockchain = require('./blockchain/index');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

setTimeout(()=>{
    pubsub.broadcastChain();
},1000);

app.use(bodyParser.json());

app.get('/api/blocks', (req,res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req,res) => {
    const {data} = req.body;

    blockchain.addBlock({data});

    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});

const DEFAULT_PORT = 3002;
let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true')
{ 
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT ;
app.listen(`${PORT}` , () => {
    console.log(`Listening at port ${PORT}`);
});