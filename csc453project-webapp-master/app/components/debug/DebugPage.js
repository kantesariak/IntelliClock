import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import { Grid, Col, Row } from 'react-bootstrap';

import { setAccumulationAmount, setTransitEnabled, setAccumulationEnabled, setTransitTime } from '../../reducers/debug/actions';

import StatusMonitor from './StatusMonitor';
import MessageTable from './MessageTable';
import DebugValue from './DebugValue';

class DebugPage extends React.Component {

    setAccumulationEnabled(enabled, callback) {
        axios.post('/api/debug/accumulation/enabled', {
            enabled: enabled
        }).then(res => {
            this.props.setAccumulationEnabled(enabled);
            callback(enabled);
        }).catch(err => {
            console.log(err);
            callback(null);
        });
    }

    setAccumulationAmount(value, callback) {
        axios.post('/api/debug/accumulation/amount', {
            value: Number(value)
        }).then(res => {
            this.props.setAccumulationAmount(value);
            callback(value);
        }).catch(err => {
            console.log(err);
            callback(null);
        });
    }

    setTransitEnabled(enabled, callback) {
        axios.post('/api/debug/transit/enabled', {
            enabled: enabled
        }).then(res => {
            this.props.setTransitEnabled(enabled);
            callback(enabled);
        }).catch(err => {
            console.log(err);
            callback(null);
        });
    }

    setTransitTime(value, callback) {
        axios.post('/api/debug/transit/time', {
            value: Number(value)
        }).then(res => {
            this.props.setTransitTime(value);
            callback(value);
        }).catch(err => {
            console.log(err);
            callback(null);
        });
    }

    render() {
        return (
            <Grid>
                <br />
                <Row>
                    <Col sm={3}>
                        <StatusMonitor name={"Server"} status={this.props.status.server} />
                    </Col>
                    <Col sm={3}>
                        <StatusMonitor name={"Alarm Clock"} status={this.props.status.alarmClock} />
                    </Col>
                    <Col sm={3}>
                        <StatusMonitor name={"Photoresistor"} status={this.props.status.photoResistor} />
                    </Col>
                    <Col sm={3}>
                        <StatusMonitor name={"Coffeemaker"} status={this.props.status.coffee} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <DebugValue
                            title="Accumulation Amount (inches)"
                            value={this.props.accumulationAmt}
                            enabled={this.props.accumulationEnabled}
                            setEnabled={this.setAccumulationEnabled.bind(this)}
                            setValue={this.setAccumulationAmount.bind(this)}
                        />
                    </Col>
                    <Col sm={6}>
                        <DebugValue
                            title="Manual Transit Time (minutes)"
                            value={this.props.transitTime}
                            enabled={this.props.transitEnabled}
                            setEnabled={this.setTransitEnabled.bind(this)}
                            setValue={this.setTransitTime.bind(this)}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <MessageTable messages={this.props.messages} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        status: state.debug.status,
        messages: state.debug.messages,
        transitTime: state.debug.transitTime,
        transitEnabled: state.debug.transitEnabled,
        accumulationAmt: state.debug.accumulationAmt,
        accumulationEnabled: state.debug.accumulationEnabled
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setAccumulationAmount: setAccumulationAmount,
        setAccumulationEnabled: setAccumulationEnabled,
        setTransitEnabled: setTransitEnabled,
        setTransitTime: setTransitTime
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(DebugPage);