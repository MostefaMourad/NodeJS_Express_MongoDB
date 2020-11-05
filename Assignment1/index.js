const express = require('express');
const http = require('http');
const dishRouter = require('./routes/dishRouter');


const port = 3000;
const hostname = "localhost";

const app = express();
app.use('/dishes',dishRouter);
const server = http.createServer(app);

server.listen(port,hostname,() => {
    console.log(`Server is running at http://${hostname}:${port}`);
});

