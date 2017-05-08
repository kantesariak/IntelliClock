import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AbstractTimeButton from './AbstractTimeButton';
import { setArrivalTime } from '../../reducers/alarm/alarmActions';

class ArrivalTimeButton extends React.Component {

    render() {
        return <AbstractTimeButton
            buttonID="arrival_time"
            postAddr="arrivaltime"
            time={this.props.arrivalTime}
            setTime={this.props.setArrivalTime}
            title={this.props.title}
        />
    }

}

function mapStateToProps(state) {
    return {
        arrivalTime: state.alarm.arrivalTime
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setArrivalTime: setArrivalTime
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ArrivalTimeButton);