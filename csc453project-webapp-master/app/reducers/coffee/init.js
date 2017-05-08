import axios from 'axios';

import { store } from '../../util/store';
import { socket } from '../../util/socket';
import { setIsOn, setAutomatic } from './actions';

export default () => {

    socket.on('coffee-isOn', (data) => {
        store.dispatch(setIsOn(data.isOn))
    });

    axios.get('/api/coffee/ison').then((res) => {
        store.dispatch(setIsOn(res.data.isOn));
    }).catch((err) => {
        console.log(err);
    });

    axios.get('/api/coffee/automatic').then((res) => {
        store.dispatch(setAutomatic(res.data.automatic));
    }).catch((err) => {
        console.log(err);
    });

};