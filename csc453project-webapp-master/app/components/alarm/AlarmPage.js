import React from 'react';
import { Button, FormGroup, ControlLabel, Panel, Row, Grid, Col, ButtonToolbar, DropdownButton, MenuItem, FormControl, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import ArrivalTimeButton from './ArrivalTimeButton';
import PrepTimeButton from './PrepTimeButton'
import WorkLocationButton from './WorkLocationButton';
import HomeLocationButton from './HomeLocationButton';
import CustomTimeButton from './CustomTimeButton';
import BackupTimeButton from './BackupTimeButton';
import TransitTypeButton from './TransitTypeButton';

import { setUseAnalytics, setTransitType } from '../../reducers/alarm/alarmActions';

class AlarmPage extends React.Component {

    useAnalyticsChanged() {
        axios.post('/api/alarm/useanalytics', {
            useAnalytics: !this.props.useAnalytics
        }).then(res => {
            this.props.setUseAnalytics(res.data.useAnalytics);
        }).catch(err => {

        })
    }

    renderComponents() {
        if (this.props.useAnalytics) {
            return (
                <div>
                    <ArrivalTimeButton title="Arrival Time" />
                    <PrepTimeButton title="Prep Time" />
                    <HomeLocationButton title="Home Location" />
                    <WorkLocationButton title="Work Location" />
                    <FormGroup>
                        <ControlLabel>Transit Type</ControlLabel>
                        <TransitTypeButton />
                    </FormGroup>
                    <hr />
                    <BackupTimeButton title="Backup Time" />
                </div>
            );
        } else {
            return <CustomTimeButton title="Custom Alarm Time" />
        }
    }

    renderAnalyticsButton() {
        if (this.props.useAnalytics) {
            return <Button
                bsSize="large"
                bsStyle="success"
                onClick={this.useAnalyticsChanged.bind(this)}
                block>Analytics Enabled</Button>
        } else {
            return <Button
                bsSize="large"
                bsStyle="danger"
                onClick={this.useAnalyticsChanged.bind(this)}
                block>Analytics Disabled</Button>
        }
    }

    renderHeader() {
        if (this.props.useAnalytics) {
            return (
                <div>
                    <h1 style={{ textAlign: "center", fontFamily: '"Lucida Console", Monaco, monospace' }}>{this.props.alarmTime}</h1>
                    <h5 style={{ textAlign: "center", marginTop: 20 }}>
                        Expect {this.props.accumulation}" of accumulation and a {this.props.transitTime} minute transit time
                    </h5>
                    <hr />
                </div>
            );
        } else {
            return (
                <div>
                    <h1 style={{ textAlign: "center", fontFamily: '"Lucida Console", Monaco, monospace' }}>{this.props.alarmTime}</h1>
                    <hr />
                </div>
            );
        }
    }

    render() {
        if (!this.props.finishedLoading) {
            return <div></div>;
        }

        return (
            <div>
                <br />
                <Panel style={{ maxWidth: 600, margin: '0 auto 10px' }}>
                    {this.renderHeader()}
                    <FormGroup>
                        <ControlLabel>Use Analytics</ControlLabel>
                        {this.renderAnalyticsButton()}
                    </FormGroup>
                    {this.renderComponents()}
                </Panel>
            </div >
        );
    }

}

function mapStateToProps(state) {
    return {
        alarmTime: state.alarm.alarmTime,
        accumulation: state.alarm.accumulation,
        transitTime: Math.round(state.alarm.transitTime),
        useAnalytics: state.alarm.useAnalytics,
        finishedLoading: state.alarm.finishedLoading
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setUseAnalytics: setUseAnalytics
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AlarmPage);