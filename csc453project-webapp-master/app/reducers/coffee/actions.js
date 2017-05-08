export const FILTER = "coffee";

export const TYPE_IS_ON = 'IS_ON';
export const TYPE_AUTOMATIC_BREWING = 'AUTOMATIC_BREWING';

export const setIsOn = (isOn) => {
    return {
        filter: FILTER,
        type: TYPE_IS_ON,
        payload: isOn
    };
};

export const setAutomatic = (enabled) => {
    return {
        filter: FILTER,
        type: TYPE_AUTOMATIC_BREWING,
        payload: enabled
    };
}