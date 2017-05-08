import axios from 'axios';
import { store } from '../../util/store';
import { socket } from '../../util/socket';

import { FILTER, doneLoading, setTransitType, setAccumulation, setTransitTime, setArrivalTime, setBackupTime, setPrepTime, setHomeLocationText, setWorkLocationText, setCustomTime, setUseAnalytics, setTime } from './alarmActions';

let count = 0;

function finishedLoading() {
    count += 1;
    if (count >= 11) {
        store.dispatch({
            filter: FILTER,
            type: 'ALARM_DONE_LOADING'
        });
    }
}

export default () => {

    socket.on('alarm', (data) => {
        store.dispatch(setTime(data.message.alarm));
        store.dispatch(setAccumulation(data.message.accumulation));
        store.dispatch(setTransitTime(data.message.transitTime));
    });

    axios.get('/api/alarm/accumulation').then(res => {
        if(res.status == 200) {
            store.dispatch(setAccumulation(res.data.amount));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/alarm/transit/time').then(res => {
        if(res.status == 200) {
            store.dispatch(setTransitTime(res.data.time));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });

     axios.get('/api/alarm/transit/type').then(res => {
        if(res.status == 200) {
            store.dispatch(setTransitType(res.data.type));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/alarm/time').then(res => {
        if (res.status == 200) {
            store.dispatch(setTime(res.data.time));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/alarm/useanalytics').then(res => {
        if (res.status == 200) {
            store.dispatch(setUseAnalytics(res.data.useAnalytics));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/alarm/customtime').then(res => {
        if (res.status == 200) {
            store.dispatch(setCustomTime(res.data.time));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/alarm/backuptime').then(res => {
        if (res.status == 200) {
            store.dispatch(setBackupTime(res.data.time));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/alarm/arrivaltime').then(res => {
        if (res.status == 200) {
            store.dispatch(setArrivalTime(res.data.time));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/alarm/preptime').then(res => {
        if (res.status == 200) {
            store.dispatch(setPrepTime(res.data.prepTime));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });


    axios.get('/api/alarm/homelocation').then(res => {
        if (res.status == 200) {
            store.dispatch(setHomeLocationText(res.data.location));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/alarm/worklocation').then(res => {
        if (res.status == 200) {
            store.dispatch(setWorkLocationText(res.data.location));
            finishedLoading();
        } else {
            throw res;
        }
    }).catch(err => {
        console.log(err);
    });
}