import axios from 'axios';

import { store } from '../../util/store';
import { socket } from '../../util/socket';

import { setAccumulationAmount, setAccumulationEnabled, setTransitEnabled, setTransitTime } from './actions';

export default () => {

    socket.on("debug-status", (data) => {
        store.dispatch({
            filter: 'DEBUG',
            type: 'STATUS',
            payload: {
                server: data.status.server,
                alarmClock: data.status.alarmClock,
                photoResistor: data.status.photoResistor,
                coffee: data.status.coffee
            }
        });
    });

    socket.on("debug-message", (data) => {
        store.dispatch({
            filter: 'DEBUG',
            type: 'MESSAGE',
            payload: {
                timestamp: data.message.timestamp,
                topic: data.message.topic,
                payload: data.message.payload
            }
        });
    });

    axios.get('/api/debug/transit/enabled').then(res => {
        store.dispatch(setTransitEnabled(res.data.enabled));
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/debug/transit/time').then(res => {
        store.dispatch(setTransitTime(res.data.value));
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/debug/accumulation/enabled').then(res => {
        store.dispatch(setAccumulationEnabled(res.data.enabled));
    }).catch(err => {
        console.log(err);
    });

    axios.get('/api/debug/accumulation/amount').then(res => {
        store.dispatch(setAccumulationAmount(res.data.value));
    }).catch(err => {
        console.log(err);
    });
};