'use strict';
let io;
let mqttClient;
let state = require('./state').state;

exports.init = (server) => {
    io = require('socket.io')(server);
    mqttClient = require('mqtt').connect(process.env.MQTT_SERVER_ADDRESS);

    let initialized = {
        alarm: false,
        debug: false
    };

    mqttClient.on('connect', () => {
        console.log("connected");
        mqttClient.subscribe('#', { qos: 2 });
    });

    mqttClient.on('message', (topic, data) => {
        console.log(`${topic} - ${data}`);

        let message = JSON.parse(data);

        io.sockets.emit('debug-message', {
            message: {
                timestamp: message.timestamp,
                topic: topic,
                payload: JSON.stringify(message.payload, null, " ")
            }
        });

        if (topic.startsWith("status")) {
            if (topic.endsWith("server")) {
                state.debug.status.server = message.payload.online;
            } else if (topic.endsWith("coffeemaker")) {
                state.debug.status.coffee = message.payload.online;
            } else if (topic.endsWith("photoresistor")) {
                state.debug.status.photoResistor = message.payload.online;
            } else if (topic.endsWith("alarmclock")) {
                state.debug.status.alarmClock = message.payload.online;
            }

            io.sockets.emit('debug-status', {
                status: state.debug.status
            });
        } else if (topic == "coffeemaker/on") {
            state.coffee.isOn = message.payload.isOn;

            io.sockets.emit('coffee-isOn', {
                isOn: state.coffee.isOn
            });
        } else if (topic.startsWith('server/debug')) {
            if (!initialized.debug) {
                state.debug.accumulation = message.payload.accumulation;
                state.debug.transit = message.payload.transit;
                initialized.debug = true;
            }
        } else if (topic.startsWith("server")) {
            if (topic.endsWith("alarm")) {
                state.alarm.time = message.payload.time;
            } else if (topic.endsWith("accumulation")) {
                state.alarm.accumulation = message.payload.accumulation;
            } else if (topic.endsWith("transit")) {
                state.alarm.transitTime = message.payload.time;
            }

            io.sockets.emit('alarm', {
                message: {
                    alarm: state.alarm.time,
                    accumulation: state.alarm.accumulation,
                    transitTime: state.alarm.transitTime
                }
            });
        } else if (topic.startsWith("alarmclock/settings")) {
            if (!initialized.alarm) {
                state.alarm.useAnalytics = message.payload.useAnalytics;
                state.alarm.customTime = message.payload.customTime;
                state.alarm.arrivalTime = message.payload.arrivalTime;
                state.alarm.backupTime = message.payload.backupTime;
                state.alarm.prepTime = message.payload.prepTime;
                state.alarm.location = message.payload.home;
                state.alarm.workLocation = message.payload.work;
                state.alarm.transitType = message.payload.transitType;
                initialized.alarm = true;
            }
        }
    });

    io.on('connection', (socket) => {
        socket.emit('debug-status', {
            status: state.debug.status
        });
    });
};


// the same MQTT message options are used for all messages sent from this server
const opts = {
    qos: 2,
    retain: true
};

exports.publishCoffeeMakerOn = () => {
    let msg = {
        timestamp: Date.now(),
        payload: {
            isOn: state.coffee.isOn
        }
    };

    mqttClient.publish('coffeemaker/on', JSON.stringify(msg), opts);
};

exports.publishCoffeeMakerAutomatic = () => {
    let msg = {
        timestamp: Date.now(),
        payload: {
            enabled: state.coffee.automatic
        }
    };

    mqttClient.publish('coffeemaker/automatic', JSON.stringify(msg), opts);
}

exports.publishAlarmSettings = () => {
    let msg = {
        timestamp: Date.now(),
        payload: {
            useAnalytics: state.alarm.useAnalytics,
            customTime: state.alarm.customTime,
            arrivalTime: state.alarm.arrivalTime,
            backupTime: state.alarm.backupTime,
            prepTime: state.alarm.prepTime,
            transitType: state.alarm.transitType,
            home: {
                address: state.alarm.location.address,
                latitude: state.alarm.location.latitude,
                longitude: state.alarm.location.longitude
            },
            work: {
                address: state.alarm.workLocation.address,
                latitude: state.alarm.workLocation.latitude,
                longitude: state.alarm.workLocation.longitude
            }
        }
    }
    mqttClient.publish('alarmclock/settings', JSON.stringify(msg), opts);
};

exports.publishDebugSettings = function () {
    let msg = {
        timestamp: Date.now(),
        payload: {
            accumulation: state.debug.accumulation,
            transit: state.debug.transit
        }
    };

    mqttClient.publish('server/debug', JSON.stringify(msg), opts);
};