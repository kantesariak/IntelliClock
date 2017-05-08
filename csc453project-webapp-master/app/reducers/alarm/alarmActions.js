export const FILTER = 'ALARM';


/** actions */
export const selectButton = (buttonID) => {
    return {
        filter: FILTER,
        type: 'ALARM_BUTTON_SELECTED',
        payload: buttonID
    };
};

export const setTime = (time) => {
    return {
        filter: FILTER,
        type: 'ALARM_TIME_SET',
        payload: time
    };
};

export const setAccumulation = (accumulation) => {
    return {
        filter: FILTER,
        type: 'WEATHER_SET',
        payload: accumulation
    };
};

export const setTransitTime = (time) => {
    return {
        filter: FILTER,
        type: 'TRANSIT_SET',
        payload: time
    };
};

export const setTransitType = (type) => {
    return {
        filter: FILTER,
        type: 'TRANSIT_TYPE_SET',
        payload: type
    };
}

export const setCustomTime = (time) => {
    return {
        filter: FILTER,
        type: 'ALARM_CUSTOM_TIME_SET',
        payload: time
    };
};

export const setArrivalTime = (time) => {
    return {
        filter: FILTER,
        type: 'ALARM_ARRIVAL_TIME_SET',
        payload: time
    };
};

export const setBackupTime = (time) => {
    return {
        filter: FILTER,
        type: 'ALARM_BACKUP_TIME_SET',
        payload: time
    };
};

export const setPrepTime = (time) => {
    return {
        filter: FILTER,
        type: 'ALARM_PREP_TIME_SET',
        payload: time
    };
};

export const setUseAnalytics = (useAnalytics) => {
    return {
        filter: FILTER,
        type: 'ALARM_USE_ANALYTICS',
        payload: useAnalytics
    };
};

export const setHomeLocationText = (location) => {
    return {
        filter: FILTER,
        type: 'ALARM_HOME_LOCATION_TEXT',
        payload: location
    };
};

export const setWorkLocationText = (location) => {
    return {
        filter: FILTER,
        type: 'ALARM_WORK_LOCATION_TEXT',
        payload: location
    };
};