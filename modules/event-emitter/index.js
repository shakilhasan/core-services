const rabbitmq = require("../../rabitmq");
const express = require('express');
const app = express();
const port = 3001;
// Express routes
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.get('/publish', async (req, res) => {
    // Publishing a message
    const exchangeName = 'my_exchange';
    const routingKey = 'my_routing_key';
    const message = 'Hello from event-emitter Microservice 1!';
    await rabbitmq.publishMessage(exchangeName, routingKey, message);
    res.send('Message published to RabbitMQ');
});
app.get('/consume', async (req, res) => {
    const exchangeName = 'my_exchange';
    // Consuming messages
    await rabbitmq.consumeMessage(exchangeName);
    res.send('Message published to RabbitMQ');
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
