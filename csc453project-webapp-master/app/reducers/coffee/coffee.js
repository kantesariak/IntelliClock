import initCoffee from './init';
import { FILTER, TYPE_AUTOMATIC_BREWING, TYPE_IS_ON } from './actions';

let defaultState = {
    isOn: false,
    automaticBrewing: true
}

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
        case TYPE_IS_ON:
            newState.isOn = action.payload;
            break;
        case TYPE_AUTOMATIC_BREWING:
            newState.automaticBrewing = action.payload;
            break;
    }
    return newState;
}

initCoffee();