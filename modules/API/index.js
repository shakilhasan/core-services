const rabbitmq = require("../../rabitmq");
const express = require('express');
const app = express();
const port = 3001;
// Express routes
app.get('/', (req, res) => {
    res.send('Welcome to API service');
});

app.get('/publish', async (req, res) => {
    // Publishing a message
    const exchangeName = 'api';
    const routingKey = 'api.data';
    // const message = 'Hello from API Microservice 1!';
    // const message = JSON.stringify({
    //     name:"hasan",
    //     age:29
    // })
    // await rabbitmq.publishMessage(exchangeName, routingKey, message);
    const message = await rabbitmq.publishMessageRPC( "user.info");
    res.send(message);
});
// app.get('/consume', async (req, res) => {
//     const exchangeName = 'event';
//     // Consuming messages
//     // const message = await rabbitmq.consumeMessage(exchangeName, "event.*");
//     const message = await rabbitmq.consumeMessageRPC();
//     res.send(message);
// });

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
rabbitmq.consumeMessageRPC().then(d=>console.log()).catch(e=>console.log(e));
