const rabbitmq = require("../../rabitmq");
const express = require('express');
const app = express();
const port = 3002;
// Express routes
app.get('/', (req, res) => {
    res.send('Welcome to event-emitter service');
});

app.post('/publish', async (req, res) => {
    // Publishing a message
    const exchangeName = 'event';
    const routingKey = 'event.data';
    // const message = 'Hello from event-emitter Microservice 2!';
    // await rabbitmq.publishMessage(exchangeName, routingKey, message);
    console.log("body---", req.body);
    const message = await rabbitmq.publishMessageRPC( "user.education", req.body);
    res.send(message);
});
// app.get('/consume', async (req, res) => {
//     const exchangeName = 'api';
//     // Consuming messages
//     // const message = await rabbitmq.consumeMessage(exchangeName, "api.*");
//     const message = await rabbitmq.consumeMessageRPC();
//     res.send(message);});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
rabbitmq.consumeMessageRPC().then(d=>console.log()).catch(e=>console.log(e));
