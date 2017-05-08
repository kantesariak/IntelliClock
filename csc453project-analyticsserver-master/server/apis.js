'use strict';
const DarkSky = require('dark-sky');
const googleClient = require('@google/maps').createClient({
	key: process.env.GOOGLE_MAPS_API_KEY
});

let state = require('./state');

/**
 * @param {number} time the time in UTC seconds
 * @param {number} numHours number of hours to sum up accumulation
 * @returns {Promise}
 */
exports.getAccumulation = (time, numHours) => {
	// get weather
	return new Promise((resolve, reject) => {
		if (state.debug.accumulation.enabled) {
			resolve(state.debug.accumulation.amount);
		} else {
			let query = new DarkSky(process.env.DARKSKY_API_KEY)
				.latitude(state.settings.home.latitude)
				.longitude(state.settings.home.longitude)
				.time(time)
				.units('us')
				.exclude('currently,minutely,daily,alerts,flags');

			query.get().then(data => {

				let hours = data.hourly.data;
				let accumulation = 0;

				for (var i = 0; i < numHours; i++) {
					if (hours[i].precipAccumulation != null) {
						accumulation += hours[i].precipAccumulation;
					}
				}

				resolve(accumulation);

			}).catch(err => {
				reject(err);
			});
		}
	});
};

/**
 * @param {number} arrivalTime utc time in seconds
 * @returns {Promise}
 */
exports.getTransitTime = (arrivalTime) => {
	return new Promise((resolve, reject) => {
		if (state.debug.transit.enabled) {
			resolve(state.debug.transit.time * 60);
		} else {
			googleClient.directions({
				origin: state.settings.home.address,
				destination: state.settings.work.address,
				mode: String(state.settings.transitType).toLowerCase(),
				arrival_time: arrivalTime
			}, (err, response) => {
				if (err || response.json.status != "OK") {
					reject("Unable to get response from Google Maps");
				} else {
					var totalDuration = 0;
					var legs = response.json.routes[0].legs;

					for (var i = 0; i < legs.length; ++i) {
						totalDuration += legs[i].duration.value;
					}

					resolve(totalDuration);
				}
			});
		}
	});
};