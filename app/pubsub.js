const redis = require('redis');

const CHANNELS = {
    TEST : 'TEST',
    BLOCKCHAIN : 'BLOCKCHAIN',
    TRANSACTION : 'TRANSACTION'
};

class PubSub
{
    constructor({blockchain, transactionPool})
    {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();


        this.subscriber.subscribe(CHANNELS.TEST);
        this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);
        this.subscriber.subscribe(CHANNELS.TRANSACTION);

        this.subscriber.on(
            'message' , 
            (channel, message)=>{
            this.HandleMessage(channel, message);
            });
    }

    HandleMessage(channel, message)
    {
        console.log(`Message is ${message} on channel ${channel}`);

        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN){
            this.blockchain.replaceChain(parsedMessage, true ,  ()=> {
                this.transactionPool.clearBlockchainTransactions({
                    chain : parsedMessage
                });
            });
        }

        if (channel === CHANNELS.TRANSACTION){
            this.transactionPool.setTransaction(parsedMessage);
        }
    }

    publish({channel, message})
    {
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
}

module.exports = PubSub;