import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AbstractTimeButton from './AbstractTimeButton';
import { setCustomTime } from '../../reducers/alarm/alarmActions';

class CustomTimeButton extends React.Component {

    render() {
        return <AbstractTimeButton
            buttonID="custom_time"
            postAddr="customtime"
            time={this.props.customTime}
            setTime={this.props.setCustomTime}
            title={this.props.title}
        />
    }

}

function mapStateToProps(state) {
    return {
        customTime: state.alarm.customAlarmTime,
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setCustomTime: setCustomTime
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(CustomTimeButton);