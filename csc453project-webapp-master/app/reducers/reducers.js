import { combineReducers } from 'redux'

import alarmReducers from './alarm/alarm';
import coffeeReducers from './coffee/coffee';
import debugReducers from './debug/debug';

export default combineReducers({
    alarm: alarmReducers,
    coffee: coffeeReducers,
    debug: debugReducers
});
