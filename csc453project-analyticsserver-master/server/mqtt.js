'use strict';
const mqtt = require('mqtt');

let state = require('./state');

let mqttClient = null;

/**
 * @param {*} payload 
 * @return {string} JSON string of the message
 */
function createMessage(payload) {
    return JSON.stringify({
        timestamp: Date.now(),
        payload: payload
    });
}

const retainOpts = {
    qos: 2,
    retain: true
};

exports.initialize = function () {
    if (mqttClient != null) {
        return;
    }

    mqttClient = mqtt.connect(process.env.MQTT_SERVER_ADDRESS, {
        will: {
            topic: 'status/server',
            payload: createMessage({ online: false }),
            qos: 2,
            retain: true
        }
    });

    mqttClient.on('connect', () => {
        console.log("Connected to broker");
        mqttClient.subscribe(['alarmclock/settings', 'photoresistor/lightvalue', 'server/debug', 'coffeemaker/automatic'], { qos: 2 });

        // publish status and settings messages (brewTime and threshold)
        publishStartUpMessages();
    });

    mqttClient.on('message', (topic, data) => {
        console.log(`${topic} - ${data}`);

        let message = JSON.parse(data);

        switch (topic) {
            case "alarmclock/settings":
                handleAlarmClockMessage(message.payload);
                break;
            case "photoresistor/lightvalue":
                exports.photoresistorValueReceived(message.payload.normalizedValue);
                break;
            case "server/debug":
                state.debug.accumulation = message.payload.accumulation;
                state.debug.transit = message.payload.transit;
                exports.settingsUpdated();
                break;
            case "coffeemaker/automatic":
                state.coffeemaker.automaticBrewing = message.payload.enabled;
                break;
        }
    });
};

function handleAlarmClockMessage(payload) {
    // publish backup time to alarmclock
    mqttClient.publish('alarmclock/backup', createMessage({
        hour: Number(payload.backupTime.split(":")[0]),
        minutes: Number(payload.backupTime.split(":")[1])
    }), retainOpts);

    state.settings.useAnalytics = payload.useAnalytics;
    state.settings.customTime.hour = Number(payload.customTime.split(":")[0]);
    state.settings.customTime.minutes = Number(payload.customTime.split(":")[1]);
    state.settings.arrivalTime.hour = Number(payload.arrivalTime.split(":")[0]);
    state.settings.arrivalTime.minutes = Number(payload.arrivalTime.split(":")[1]);
    state.settings.prepTime = payload.prepTime;
    state.settings.home = payload.home;
    state.settings.work = payload.work;
    state.settings.transitType = payload.transitType;
    exports.settingsUpdated();
}

exports.photoresistorValueReceived = (val) => { };
exports.settingsUpdated = () => { };


exports.publishCoffeeMakerOn = function () {
    mqttClient.publish('coffeemaker/on', createMessage({ isOn: true }), retainOpts);
};

exports.publishAlarmClockOn = function () {
    mqttClient.publish('alarmclock/on', createMessage({}), { qos: 2, retain: false });
};

exports.publishAlarmClockTime = function () {
    let minutes = `${state.settings.alarmTime.minutes}`;
    if (state.settings.alarmTime.minutes < 10) {
        minutes = `0${minutes}`;
    }

    mqttClient.publish('server/alarm', createMessage({
        time: `${state.settings.alarmTime.hour}:${minutes}`
    }), retainOpts);
};

/**
 * @param {number} time seconds
 */
exports.publishTransitTime = function (time) {
    mqttClient.publish('server/transit', createMessage({ time: (time / 60) }), retainOpts);
};

/**
 * @param {number} amount inches
 */
exports.publishAccumulationAmount = function (amount) {
    mqttClient.publish('server/accumulation', createMessage({ accumulation: amount }), retainOpts);
}

function publishStartUpMessages() {
    mqttClient.publish('status/server', createMessage({ online: true }), retainOpts);

    mqttClient.publish('photoresistor/threshold', createMessage({
        normalizedLevel: state.settings.photoresistor.threshold
    }), retainOpts);

    mqttClient.publish('coffeemaker/brewtime', createMessage({
        seconds: state.settings.coffeemaker.brewTime
    }), retainOpts);
}