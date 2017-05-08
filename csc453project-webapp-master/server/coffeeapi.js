'use strict';
const router = require('express').Router();
const state = require('./state').state;
const publishIsOn = require('./mqtt').publishCoffeeMakerOn;
const publishAutomatic = require('./mqtt').publishCoffeeMakerAutomatic;

router.get("/ison", (req, res) => {
    res.status(200).json({
        isOn: state.coffee.isOn
    });
});

router.get("/automatic", (req, res) => {
    res.status(200).json({
        automatic: state.coffee.automatic
    });
});

router.post("/ison", (req, res) => {
    if (req.body == null || req.body.isOn == null) {
        return res.status(400).json({ message: "error" });
    }

    state.coffee.isOn = req.body.isOn;
    publishIsOn();

    res.status(200).json({
        isOn: state.coffee.isOn
    });
});

router.post("/automatic", (req, res) => {
    if (req.body == null || req.body.automatic == null) {
        return res.status(400).json({ message: "error" });
    }

    state.coffee.automatic = req.body.automatic;
    publishAutomatic();

    res.status(200).json({
        automatic: state.coffee.automatic
    });
});

module.exports = router;