'use strict';

if (exports.state == null) {
    exports.state = {
        alarm: {
            time: "?:??",
            accumulation: 0,
            transitTime: 15,
            transitType: "Driving",
            useAnalytics: true,
            customTime: "7:00",
            arrivalTime: "8:45",
            backupTime: "7:00",
            savedBackupTime: "7:00", // used for when switching between use analytics and not
            prepTime: "30",
            location: {
                address: "Raleigh, NC",
                latitude: 0.0,
                longitude: 0.0
            },
            workLocation:  {
                address: "Raleigh, NC",
                latitude: 0.0,
                longitude: 0.0
            }
        },
        coffee: {
            isOn: false,
            automatic: true
        },
        debug: {
            status: {
                server: false,
                photoResistor: false,
                alarmClock: false,
                coffee: false
            },
            accumulation: {
                enabled: false,
                amount: 0
            },
            transit: {
                enabled: false,
                time: 30
            }
        }
    };
}