import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormControl, FormGroup, Button, InputGroup, ControlLabel } from 'react-bootstrap';
import axios from 'axios';

import { selectButton, setWorkLocationText } from '../../reducers/alarm/alarmActions';

class WorkLocationButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validationState: null,
            setValidationState: "default",
            locationIsValid: false,
            value: this.props.locationText,
            loading: false
        };
    }

    buttonPressed(set) {
        this.props.selectButton(set ? "work_location" : "");
    }

    locationTextChange(event) {
        let validationState = "error";
        let setValidationState = "danger";
        let locationIsValid = false;

        if (this.isLocationValid(event.target.value)) {
            validationState = "success";
            setValidationState = "success";
            locationIsValid = true;
        }

        this.setState({
            validationState: validationState,
            locationIsValid: locationIsValid,
            setValidationState: setValidationState,
            value: event.target.value
        });
    }

    isLocationValid(address) {
        if (address.trim().length == 0) {
            return false;
        }

        return true;
    }

    submitLocation() {
        this.setState({
            loading: true
        });
        axios.post('/api/alarm/worklocation', {
            location: this.state.value
        }).then(res => {
            if (res.status == 200) {
                this.props.setWorkLocationText(res.data.location);

                this.setState({
                    validationState: null,
                    locationIsValid: false,
                    value: res.data.location,
                    loading: false
                });
            } else {
                throw res;
            }
        }).catch(err => {
            console.log(err);
            this.setState({
                loading: false
            });
        })
    }

    locate() {
        if (navigator.geolocation) {
            this.setState({
                loading: true
            });
            navigator.geolocation.getCurrentPosition(position => {
                axios.post('/api/alarm/lookup', {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                }).then(res => {
                    this.setState({
                        value: res.data.address,
                        loading: false
                    });
                    let event = {
                        target: {
                            value: res.data.address
                        }
                    };
                    this.locationTextChange(event);
                }).catch(err => {
                    console.log(err);
                    this.setState({
                        loading: false
                    });
                });
            });
        }
    }

    render() {
        return (
            <FormGroup validationState={this.state.validationState}>
                <ControlLabel>{this.props.title}</ControlLabel>
                <InputGroup bsSize="large">
                    <FormControl
                        type="text"
                        style={{ textAlign: "center" }}
                        onFocus={() => { this.buttonPressed.bind(this)(true) }}
                        onBlur={() => { this.buttonPressed.bind(this)(false) }}
                        onChange={this.locationTextChange.bind(this)}
                        placeholder={this.props.locationText}
                        value={this.state.value}
                        disabled={this.state.loading}
                    />
                    <InputGroup.Button >
                        <Button onClick={this.locate.bind(this)} disabled={this.state.loading || !navigator.geolocation}>
                            <span className="glyphicon glyphicon-screenshot" />
                        </Button>
                        <Button
                            bsStyle={this.state.setValidationState}
                            disabled={!this.state.locationIsValid || this.state.loading}
                            onClick={this.submitLocation.bind(this)}>
                            Set</Button>
                    </InputGroup.Button>
                </InputGroup>
            </FormGroup >
        );

    }
}

function mapStateToProps(state) {
    return {
        currentButton: state.alarm.currentButton,
        locationText: state.alarm.workLocationText
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        selectButton: selectButton,
        setWorkLocationText: setWorkLocationText
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(WorkLocationButton);
