'use strict';
const express = require('express');
const router = express.Router();
const googleClient = require('@google/maps').createClient({
    key: 'AIzaSyC-2naw1vW48x2MBfWl5WnEt0Ayj3Nt-Dc'
});

const state = require('./state').state;
const publishAlarmSettings = require('./mqtt').publishAlarmSettings;

function validTimeRequest(time) {
    if (time == null) {
        return false;
    }
    return true;
}

function validLocationRequest(location) {
    if (location == null) {
        return false;
    }
    return true;
}

router.get('/time', (req, res) => {
    res.status(200).json({
        time: state.alarm.time
    });
});

router.get('/accumulation', (req, res) => {
    res.status(200).json({
        amount: state.alarm.accumulation
    });
});

router.get('/transit/time', (req, res) => {
    res.status(200).json({
        time: state.alarm.transitTime
    });
});

function sendTransitType(res) {
    res.status(200).json({
        type: state.alarm.transitType
    });
}

function sendUseAnalytics(res) {
    res.status(200).json({
        useAnalytics: state.alarm.useAnalytics
    });
}

function sendCustomTime(res) {
    res.status(200).json({
        time: state.alarm.customTime
    });
}

function sendArrivalTime(res) {
    res.status(200).json({
        time: state.alarm.arrivalTime
    });
}

function sendBackupTime(res) {
    res.status(200).json({
        time: state.alarm.backupTime
    });
}

function sendPrepTime(res) {
    res.status(200).json({
        prepTime: state.alarm.prepTime
    });
}

function sendHomeLocation(res) {
    res.status(200).json({
        location: state.alarm.location.address
    });
}

function sendWorkLocation(res) {
    res.status(200).json({
        location: state.alarm.workLocation.address
    });
}

router.get('/transit/type', (req, res) => sendTransitType(res));
router.get('/useanalytics', (req, res) => sendUseAnalytics(res));
router.get('/customtime', (req, res) => sendCustomTime(res));
router.get('/arrivaltime', (req, res) => sendArrivalTime(res));
router.get('/backuptime', (req, res) => sendBackupTime(res));
router.get('/preptime', (req, res) => sendPrepTime(res));
router.get('/homelocation', (req, res) => sendHomeLocation(res));
router.get('/worklocation', (req, res) => sendWorkLocation(res));

router.post('/transit/type', (req, res) => {
    if (req.body == null) {
        res.status(400).json({ message: "Bad or Missing property: type" });
    } else {
        state.alarm.transitType = req.body.type;

        publishAlarmSettings();
        sendTransitType(res);
    }
});

router.post('/useanalytics', (req, res) => {
    if (req.body == null || typeof (req.body.useAnalytics) !== "boolean") {
        res.status(400).json({ message: "Bad or Missing property: useAnalytics" });
    } else {

        // backup time and custom time are effectively the same without analytics
        if (state.alarm.useAnalytics != req.body.useAnalytics) {
            if (req.body.useAnalytics) {
                state.alarm.backupTime = state.alarm.savedBackupTime;
            } else {
                state.alarm.backupTime = state.alarm.customTime;
            }
        }

        state.alarm.useAnalytics = req.body.useAnalytics;


        publishAlarmSettings();
        sendUseAnalytics(res);
    }
});

router.post('/customtime', (req, res) => {
    if (req.body == null || !validTimeRequest(req.body.time)) {
        res.status(400).json({ message: "Bad or Missing property: time" });
    } else {
        state.alarm.customTime = req.body.time;

        publishAlarmSettings();
        sendCustomTime(res);
    }
});


router.post('/arrivaltime', (req, res) => {
    if (req.body == null || !validTimeRequest(req.body.time)) {
        res.status(400).json({ message: "Bad or Missing property: time" });
    } else {
        state.alarm.arrivalTime = req.body.time;

        publishAlarmSettings();
        sendArrivalTime(res);
    }
});


router.post('/backuptime', (req, res) => {
    if (req.body == null || !validTimeRequest(req.body.time)) {
        res.status(400).json({ message: "Bad or Missing property: time" });
    } else {
        state.alarm.backupTime = req.body.time;
        state.alarm.savedBackupTime = state.alarm.backupTime;

        publishAlarmSettings();
        sendBackupTime(res);
    }
});

router.post('/preptime', (req, res) => {
    if (req.body == null || !Number.isInteger(req.body.prepTime)) {
        res.status(400).json({ message: "Bad or Missing property: prepTime" });
    } else {
        state.alarm.prepTime = req.body.prepTime;

        publishAlarmSettings();
        sendPrepTime(res);
    }
});

router.post('/homelocation', (req, res) => {
    if (req.body == null || !validLocationRequest(req.body.location)) {
        res.status(400).json({ message: "Bad or Missing property: location" });
    } else {

        googleClient.geocode({
            address: req.body.location
        }, (err, response) => {
            if (err || response.json.status != "OK") {
                res.status(400).json({
                    message: "Error w/ google request"
                });
            } else {
                let info = response.json.results[0];

                state.alarm.location.address = info.formatted_address;
                state.alarm.location.latitude = info.geometry.location.lat;
                state.alarm.location.longitude = info.geometry.location.lng;

                publishAlarmSettings();
                sendHomeLocation(res);
            }
        });
    }
});


router.post('/worklocation', (req, res) => {
    if (req.body == null || !validLocationRequest(req.body.location)) {
        res.status(400).json({ message: "Bad or Missing property: location" });
    } else {

        googleClient.geocode({
            address: req.body.location
        }, (err, response) => {
            if (err || response.json.status != "OK") {
                res.status(400).json({
                    message: "Error w/ google request"
                });
            } else {
                let info = response.json.results[0];

                state.alarm.workLocation.address = info.formatted_address;
                state.alarm.workLocation.latitude = info.geometry.location.lat;
                state.alarm.workLocation.longitude = info.geometry.location.lng;

                publishAlarmSettings();
                sendWorkLocation(res);
            }
        });
    }
});

router.post('/lookup', (req, res) => {
    //  if (req.body == null || !validLocationRequest(req.body.location)) {
    //      res.status(400).json({ message: "Bad or Missing property: location" });
    //   } else {

    let location = `${req.body.lat},${req.body.long}`;

    googleClient.reverseGeocode({
        latlng: location
    }, (err, response) => {
        if (err || response.json.status != "OK") {
            res.status(400).json({
                message: "Error w/ google request"
            });
        } else {
            let info = response.json.results[0];

            res.json({
                address: info.formatted_address
            });
        }
    });
    //  }
});

module.exports = router;