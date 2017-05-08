'use strict';
const express = require('express');
const router = express.Router();

const publishDebugSettings = require('./mqtt').publishDebugSettings;
let state = require('./state').state;

router.get('/transit/enabled', (req, res) => {
    res.json({
        enabled: state.debug.transit.enabled
    });
});

router.get('/accumulation/enabled', (req, res) => {
    res.json({
        enabled: state.debug.accumulation.enabled
    });
});

router.get('/transit/time', (req, res) => {
    res.json({
        value: state.debug.transit.time
    });
});

router.get('/accumulation/amount', (req, res) => {
    res.json({
        value: state.debug.accumulation.amount
    });
});

//// posts

router.post('/transit/enabled', (req, res) => {
    if (typeof req.body.enabled === "boolean") {
        state.debug.transit.enabled = req.body.enabled;
        publishDebugSettings();
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

router.post('/accumulation/enabled', (req, res) => {
    if (typeof req.body.enabled == "boolean") {
        state.debug.accumulation.enabled = req.body.enabled;
        publishDebugSettings();
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

router.post('/transit/time', (req, res) => {
    if (typeof req.body.value === "number") {
        state.debug.transit.time = req.body.value;
        publishDebugSettings();
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

router.post('/accumulation/amount', (req, res) => {
    if (typeof req.body.value === "number") {
        state.debug.accumulation.amount = req.body.value;
        publishDebugSettings();
        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

module.exports = router;