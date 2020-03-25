const redis = require('redis');

const CHANNELS = {
    TEST : 'TEST',
    BLOCKCHAIN : 'BLOCKCHAIN',
    TRANSACTION : 'TRANSACTION',
    PEER : 'PEER'
};

class PubSub
{
    constructor({blockchain, transactionPool, peer})
    {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.peer = peer;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();


        this.subscriber.subscribe(CHANNELS.TEST);
        this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);
        this.subscriber.subscribe(CHANNELS.TRANSACTION);
        this.subscriber.subscribe(CHANNELS.PEER);

        this.subscriber.on(
            'message' , 
            (channel, message)=>{
            this.HandleMessage(channel, message);
            });
    }

    HandleMessage(channel, message)
    {
        // console.log(`Message is ${message} on channel ${channel}`);

        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN){
            this.blockchain.replaceChain(parsedMessage, true , ()=> {
                this.transactionPool.clearBlockchainTransactions({
                    chain : parsedMessage
                });
            });
        }

        if (channel === CHANNELS.TRANSACTION){
            this.transactionPool.setTransaction(parsedMessage);
        }

        if (channel === CHANNELS.PEER){
            console.log("PEER is here");
            this.peer.addPeer(parsedMessage);
        }
    }

    publish({channel, message})
    {
        // this.publisher.publish(channel,message);
        this.subscriber.unsubscribe(channel,()=>{
            this.publisher.publish(channel,message,()=>{
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain (){
        this.publish({
            channel : CHANNELS.BLOCKCHAIN,
            message : JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction){
        this.publish({
            channel : CHANNELS.TRANSACTION,
            message : JSON.stringify(transaction)
        });
    }

    broadcastPeer(peer){
        this.publish({
            channel : CHANNELS.PEER,
            message : JSON.stringify(peer)
        });
    }
}

module.exports = PubSub;