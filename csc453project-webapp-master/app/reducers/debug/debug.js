import initDebug from './init';

import { FILTER, SET_ACCUMULATION_AMOUNT, SET_TRANSIT_TIME, SET_ACCUMULATION_AMOUNT_ENABLED, SET_TRANSIT_TIME_ENABLED } from './actions';

let defaultState = {
    status: {
        server: false,
        alarmClock: false,
        photoResistor: false,
        coffee: false
    },
    messages: [],
    transitTime: 0,
    transitEnabled: false,
    accumulationAmt: 0,
    accumulationEnabled: false
};

function copy(state) {
    let newState = {};
    for (var key in state) {
        newState[key] = state[key];
    }
    return newState;
}

export default function (state = defaultState, action) {
    if (action.filter != FILTER) {
        return state;
    }

    let newState = copy(state);
    switch (action.type) {
        case 'STATUS':
            newState.status = action.payload;
            break;
        case 'MESSAGE':
            let newMessages = [];
            newMessages.push(action.payload);
            state.messages.map(message => {
                newMessages.push(message);
            });
            newState.messages = newMessages;
            break;
        case SET_ACCUMULATION_AMOUNT:
            newState.accumulationAmt = action.payload;
            break;
        case SET_TRANSIT_TIME:
            newState.transitTime = action.payload;
            break;
        case SET_ACCUMULATION_AMOUNT_ENABLED:
            newState.accumulationEnabled = action.payload;
            break;
        case SET_TRANSIT_TIME_ENABLED:
            newState.transitEnabled = action.payload;
            break;
    }
    return newState;
}

initDebug();