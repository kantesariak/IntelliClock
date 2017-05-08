'use strict';

if (module.exports.settings == null) {
    module.exports = {
        photoresistor: {
            average: 0,
            entries: 0
        },
        coffeemaker: {
            automaticBrewing: false
        },
        debug: {
            transit: {
                enabled: false,
                time: 0
            },
            accumulation: {
                enabled: false,
                amount: 0
            }
        },
        settings: {
            useAnalytics: true,
            alarmTime: {
                hour: 0,
                minutes: 0
            },
            customTime: {
                hour: 7,
                minutes: 30
            },
            arrivalTime: {
                hour: 7,
                minutes: 30
            },
            prepTime: 30, // minutes
            home: {
                address: "Raleigh, NC",
                latitude: 35.7796,
                longitude: -78.6382
            },
            work: {
                address: "Durham, NC",
                latitude: 0,
                longitude: 0
            },
            transitType: "driving",
            photoresistor: {
                threshold: 0.07 // normalized value
            },
            coffeemaker: {
                brewTime: 15 // in seconds
            }
        }
    };
}
