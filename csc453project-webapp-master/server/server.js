"use strict";
const express = require('express')
const app = express();
const server = require('http').createServer(app);
const path = require('path')
const bodyParser = require('body-parser');
const cfenv = require('cfenv');
require('dotenv').config();

// init mqtt & socketio
require('./mqtt').init(server);

const apiRouter = require('./api');

app.use(express.static(path.join(__dirname, "../", "/public")));
app.use(bodyParser.json());
app.use('/api', apiRouter);

app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "/public/index.html"));
});

server.listen(cfenv.getAppEnv().port, "0.0.0.0", () => {
    console.log(`Server started @ 0.0.0.0:${cfenv.getAppEnv().port}`);
});

