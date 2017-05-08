import { FILTER } from './alarmActions';
import initAlarm from './init';

let defaultState = {
    finishedLoading: false,
    currentButton: null,
    alarmTime: null,
    accumulation: null,
    transitTime: null,
    transitType: null,
    customAlarmTime: null,
    arrivalTime: null,
    backupTime: null,
    prepTime: null,
    useAnalytics: null,
    homeLocationText: null,
    workLocationText: null,
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
        case 'ALARM_BUTTON_SELECTED':
            newState.currentButton = action.payload;
            break;
        case 'ALARM_TIME_SET':
            newState.alarmTime = action.payload;
            break;
        case 'WEATHER_SET':
            newState.accumulation = action.payload;
            break;
        case 'TRANSIT_SET':
            newState.transitTime = action.payload;
            break;
        case 'TRANSIT_TYPE_SET':
            newState.transitType = action.payload;
            break;
        case 'ALARM_CUSTOM_TIME_SET':
            newState.customAlarmTime = action.payload;
            break;
        case 'ALARM_ARRIVAL_TIME_SET':
            newState.arrivalTime = action.payload;
            break;
        case 'ALARM_BACKUP_TIME_SET':
            newState.backupTime = action.payload;
            break;
        case 'ALARM_PREP_TIME_SET':
            newState.prepTime = action.payload;
            break;
        case 'ALARM_USE_ANALYTICS':
            if (action.payload != state.useAnalytics) {
                newState.currentButton = '';
            }
            newState.useAnalytics = action.payload;
            break;
        case 'ALARM_HOME_LOCATION_TEXT':
            newState.homeLocationText = action.payload;
            break;
        case 'ALARM_WORK_LOCATION_TEXT':
            newState.workLocationText = action.payload;
            break;
        case 'ALARM_DONE_LOADING':
            newState.finishedLoading = true;
            break;
    }
    return newState;
}

initAlarm();