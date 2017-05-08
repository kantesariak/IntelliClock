import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AbstractTimeButton from './AbstractTimeButton';
import { setBackupTime } from '../../reducers/alarm/alarmActions';

class BackupTimeButton extends React.Component {

    render() {
        return <AbstractTimeButton
            buttonID="backup_button"
            postAddr="backuptime"
            time={this.props.backupTime}
            setTime={this.props.setBackupTime}
            title={this.props.title}
        />
    }

}

function mapStateToProps(state) {
    return {
        backupTime: state.alarm.backupTime
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setBackupTime: setBackupTime
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(BackupTimeButton);