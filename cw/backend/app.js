const express = require('express');

const server = express();
const port = 3000;

// create helper middleware so we can reuse server-sent events
const useServerSentEventsMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    // only if you want anyone to access this endpoint
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.flushHeaders();

    const sendEventStreamData = (data) => {
        const sseFormattedResponse = `data: ${JSON.stringify(data)}\n\n`;
        console.log(`server sending ${sseFormattedResponse}`);
        res.write(sseFormattedResponse);
    }

    // we are attaching sendEventStreamData to res, so we can use it later
    Object.assign(res, {
        sendEventStreamData
    });

    next();
}

const streamRandomNumbers = (req, res) => {
    // We are sending anyone who connects to /stream-random-numbers
    // a random number that's encapsulated in an object
    let interval = setInterval(function generateAndSendRandomNumber(){
        const data = {
            value: Math.random(),
        };

        res.sendEventStreamData(data);
    }, 1000);

    // close
    res.on('close', () => {
        clearInterval(interval);
        console.log("server shutting down sse");
        res.end();
    });
}

server.get('/sseconnect', useServerSentEventsMiddleware, streamRandomNumbers);

server.listen(3000, () => console.log(`Example app listening at http://localhost: 3000`));