const bodyParser = require('body-parser');
const express = require('express');
const PubSub = require('./app/pubsub');
const request = require('request');
const Blockchain = require('./blockchain/index');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

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

const syncChains = ()=>{
    request({ url : `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body)=>{
        if(!error && response.statusCode === 200){
            const rootchain = JSON.parse(body);

            blockchain.replaceChain(rootchain);
        }
    });
};

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true')
{ 
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT ;
app.listen(`${PORT}` , () => {
    console.log(`Listening at port ${PORT}`);

    if(PORT !== DEFAULT_PORT){
        syncChains();
    }
});