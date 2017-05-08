"use strict";
const express = require('express');
const path = require('path');

let router = express.Router();

const alarmRouter = require('./alarmapi');
const coffeeRouter = require('./coffeeapi');
const debugRouter = require('./debugapi');

router.use('/alarm', alarmRouter);
router.use('/coffee', coffeeRouter);
router.use('/debug', debugRouter);

module.exports = router;