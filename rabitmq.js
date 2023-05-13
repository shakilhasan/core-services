const amqp = require('amqplib');
async function publishMessage(exchangeName, routingKey, message) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertExchange(exchangeName, 'fanout', { durable: false });
        await channel.publish(exchangeName, routingKey, Buffer.from(message));

        console.log('Message published successfully.');

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

async function consumeMessage(exchangeName) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertExchange(exchangeName, 'fanout', { durable: false });
        const queue = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(queue.queue, exchangeName, '');

        console.log('Waiting for messages...');

        channel.consume(queue.queue, (message) => {
            console.log('Received message:', message.content.toString());
        }, { noAck: true });
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

module.exports = { publishMessage, consumeMessage };
