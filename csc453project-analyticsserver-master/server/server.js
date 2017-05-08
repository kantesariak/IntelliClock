'use strict';
const regression = require('regression');
require('dotenv').config();

const data = require('./data');
let state = require('./state');
let mqtt = require('./mqtt');
let apis = require('./apis');
mqtt.initialize();

// analytics //

let lightTurnedOn = false;
mqtt.photoresistorValueReceived = (val) => {
	if (val < .5) {
		// its bright
		lightTurnedOn = true;
	} else {
		// its dark
		lightTurnedOn = false;
	}
};

mqtt.settingsUpdated = () => {
	// might want to change this so we dont use a lot of the api calls
	looper();
};

function calcAlarmTime() {
	if (state.settings.useAnalytics) {

		// calculate the desired arrival date
		let arrivalTime = Date.now();

		const currentDate = new Date(Date.now());
		if (currentDate.getHours() > state.settings.arrivalTime.hour) {
			arrivalTime += 1000 * 60 * 60 * 24; // next day
		}

		let arrivalDate = new Date(arrivalTime);
		arrivalDate.setHours(state.settings.arrivalTime.hour, state.settings.arrivalTime.minutes, 0, 0);

		// perform api calls
		apis.getTransitTime(arrivalDate.getUTCSeconds()).then(transitTime => {
			apis.getAccumulation(arrivalDate.getUTCSeconds(), 10).then(accumulation => {
				// publish transit + accumulation for web app
				mqtt.publishAccumulationAmount(accumulation);
				mqtt.publishTransitTime(transitTime);

				// convert to minutes
				transitTime /= 60;

				// calculate alarm time
				let result = regression('logarithmic', data);
				let a = result.equation[0];
				let b = result.equation[1];

				let snowTime = 0;
				if (accumulation > 0) {
					snowTime = a + b * Math.log(accumulation);
				}

				let totalMinutes = state.settings.arrivalTime.hour * 60 + state.settings.arrivalTime.minutes;

				totalMinutes -= snowTime;
				totalMinutes -= transitTime;
				totalMinutes -= state.settings.prepTime;

				state.settings.alarmTime.hour = Math.floor(totalMinutes / 60);
				state.settings.alarmTime.minutes = Math.floor(totalMinutes % 60);

				mqtt.publishAlarmClockTime();
			});
		}).catch(err => {
			console.log(err);
		});
	} else {
		state.settings.alarmTime = state.settings.customTime;
		mqtt.publishAlarmClockTime();
	}
}

function getAlarmTimeDate() {
	let alarmTime = Date.now();

	const currentDate = new Date(Date.now());
	if (currentDate.getHours() > state.settings.alarmTime.hour) {
		alarmTime += 1000 * 60 * 60 * 24; // next day
	}

	let alarmDate = new Date(alarmTime);
	alarmDate.setHours(state.settings.alarmTime.hour, state.settings.alarmTime.minutes, 0, 0);

	return alarmDate;
}

let timeouts = null;
function looper() {
	// calculate the alarm time
	calcAlarmTime();

	if (timeouts != null) {
		for (var i = 0; i < timeouts.length; i++) {
			clearTimeout(timeouts[i]);
		}
	}

	// first get the alarm time as a date
	let alarmDate = getAlarmTimeDate();

	// check if within an hour
	if (new Date(Date.now()).getUTCSeconds() - alarmDate.getUTCSeconds() < 60 * 60) {
		timeouts = [];
		for (var i = 1; i < 59; i++) {
			timeouts.push(setTimeout(calcAlarmTime, 1000 * 60 * i));
		}
	}
}

setInterval(looper, 1000 * 60 * 60);

let lastTimeSent = 0;
function alarmOner() {
	// make sure it wasnt just sent
	if (Date.now() - lastTimeSent > 1000 * 60 * 10) {

		// send alarm on message if it is time
		let alarmDate = getAlarmTimeDate();
		let seconds = new Date(Date.now()).getTime() - alarmDate.getTime();
		seconds /= 1000;
		console.log(seconds);
		if (seconds > -5 * 60 && seconds < 0) {

			if (state.coffeemaker.automaticBrewing) {
				mqtt.publishCoffeeMakerOn();
			}

			setTimeout(() => {
				// use photresistor
				if (!lightTurnedOn) {
					mqtt.publishAlarmClockOn();
				} else {
					// the alarm was not turned on
				}
			}, 1000 * -seconds);

			lastTimeSent = Date.now();
		}
	}
}

setInterval(alarmOner, 1000);

// required web stuff for ibm bluemix
const express = require('express');
const cfenv = require('cfenv');

let app = express();

app.use('/', (req, res) => {
	res.json({ 'ok': true });
});

app.listen(cfenv.getAppEnv().port, "0.0.0.0", () => {
	console.log(`Server started @ ${cfenv.getAppEnv().url}`);
});
