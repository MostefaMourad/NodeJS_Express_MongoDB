const express = require('express');
const http = require('http');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promotionRouter = require('./routes/promotionRouter');

const port = 3000;
const hostname = "localhost";

const app = express();
app.use('/dishes',dishRouter);
app.use('/promotions',promotionRouter);
app.use('/leaders',leaderRouter);

const server = http.createServer(app);

server.listen(port,hostname,() => {
    console.log(`Server is running at http://${hostname}:${port}`);
});

