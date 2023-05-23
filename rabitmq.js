const amqp = require('amqplib');

async function publishMessage(exchangeName, routingKey, message) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertExchange(exchangeName, 'topic', {durable: false});
        await channel.publish(exchangeName, routingKey, Buffer.from(message));

        console.log('Message published successfully.');

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

async function consumeMessage(exchangeName, bindingKey) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertExchange(exchangeName, 'topic', {durable: false});
        const queue = await channel.assertQueue('', {exclusive: true});
        await channel.bindQueue(queue.queue, exchangeName, bindingKey);
        console.log('Waiting for messages...');

        return new Promise((resolve, reject) => {
            channel.consume(queue.queue, (message) => {
                console.log('Received message:', message.content.toString());
                resolve(message.content.toString());
            }, {noAck: true});
        });
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

async function publishMessageRPC(route, body={}) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'rpc_queue';
    const reply = await channel.assertQueue('', { exclusive: true });
    const correlationId = generateUuid();

    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(body)), {
        correlationId: correlationId,
        replyTo: reply.queue,
        headers:{route}
    });
    return new Promise(async (resolve, reject) => {
        await channel.consume(reply.queue, (msg) => {
            if (msg.properties.correlationId === correlationId) {
                const data=JSON.parse(msg.content)
                console.log('RPC-client: Received response data= ',data);
                resolve(data);
                setTimeout(() => {
                    connection.close();
                    // process.exit(0);
                }, 500);
            }
        }, {noAck: true});
    });
}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

async function consumeMessageRPC() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'rpc_queue';
    await channel.assertQueue(queue, { durable: false });
    channel.prefetch(1);
    console.log('RPC-server: Awaiting RPC requests...');

    await channel.consume(queue, async (msg) => {
        const body = JSON.parse(msg.content);
        console.log(`RPC-server: Received RPC request body= ${body}`);
        const result = fn( msg.properties.headers.route);
        await channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify({...result,...body})), {
            correlationId: msg.properties.correlationId,
        });
        channel.ack(msg);
    },);
}
const fn=(route)=>{
    switch (route) {
        case "user.info":
            return {name:"hasan", age:30}
        case "user.education":
            return {name:"CUET", cgpa:4.00}
        default:
            return {name:"default message"}
    }
}

module.exports = {publishMessage, consumeMessage, publishMessageRPC, consumeMessageRPC};
