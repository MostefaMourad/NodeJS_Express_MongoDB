const express = require('express');
const http = require('http');
const dishRouter = require('./routes/dishRouter');
const promotionRouter = require('./routes/promotionRouter');


const port = 3000;
const hostname = "localhost";

const app = express();
app.use('/dishes',dishRouter);
app.use('/promotions',promotionRouter);

const server = http.createServer(app);

server.listen(port,hostname,() => {
    console.log(`Server is running at http://${hostname}:${port}`);
});

