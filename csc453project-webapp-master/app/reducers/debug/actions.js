export const FILTER = "DEBUG";

export const SET_ACCUMULATION_AMOUNT = 'ACCUMULATION_VALUE';
export const SET_ACCUMULATION_AMOUNT_ENABLED = 'ACCUMULATION_AMOUNT_ENABLE';
export const SET_TRANSIT_TIME = 'TRANSIT_TIME';
export const SET_TRANSIT_TIME_ENABLED = 'TRANSIT_TIME_ENABLE';

/**
 * @param {number} value
 */
export const setAccumulationAmount = function (value) {
    return {
        filter: FILTER,
        type: SET_ACCUMULATION_AMOUNT,
        payload: value
    }
};

/**
 * @param {number} value
 */
export const setTransitTime = function (value) {
    return {
        filter: FILTER,
        type: SET_TRANSIT_TIME,
        payload: value
    }
};

/**
 * 
 * @param {boolean} enabled 
 */
export const setAccumulationEnabled = function (enabled) {
    return {
        filter: FILTER,
        type: SET_ACCUMULATION_AMOUNT_ENABLED,
        payload: enabled
    }
};

/**
 * 
 * @param {boolean} enabled 
 */
export const setTransitEnabled = function (enabled) {
    return {
        filter: FILTER,
        type: SET_TRANSIT_TIME_ENABLED,
        payload: enabled
    }
};