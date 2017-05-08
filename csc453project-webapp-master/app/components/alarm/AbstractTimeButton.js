import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormControl, FormGroup, Button, InputGroup, ControlLabel } from 'react-bootstrap';
import axios from 'axios';

import { selectButton } from '../../reducers/alarm/alarmActions';

class AbstractTimeButton extends React.Component {

    // required props:
    // buttonID
    // postAddr
    // time
    // setTime
    constructor(props) {
        super(props);
        this.state = {
            validationState: null,
            setValidationState: "default",
            value: this.props.time,
            isValid: false,
            loading: false
        };
    }

    buttonPressed(set) {
        this.props.selectButton(set ? this.props.buttonID : "");
    }

    valueChanged(event) {
        let validationState = "error";
        let setValidationState = "danger";
        let isValid = false;

        if (this.isValidTime(event.target.value)) {
            validationState = "success";
            setValidationState = "success";
            isValid = true;
        }

        this.setState({
            validationState: validationState,
            setValidationState: setValidationState,
            isValid: isValid,
            value: event.target.value
        });
    }

    isValidTime(time) {
        return /^((1\d)|(2[0-3])|(0?\d)):[0-5]\d$/.test(time);
    }


    timeSet() {
        this.setState({
            loading: true
        });
        axios.post(`/api/alarm/${this.props.postAddr}`, {
            time: this.state.value
        }).then(res => {
            if (res.status == 200) {
                this.props.setTime(res.data.time);

                this.setState({
                    validationState: null,
                    setValidationState: "default",
                    value: res.data.time,
                    isValid: false,
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
                        onChange={this.valueChanged.bind(this)}
                        placeholder={this.props.time}
                        value={this.state.value}
                        disabled={this.state.loading}
                    />
                    <InputGroup.Button>
                        <Button
                            bsStyle={this.state.setValidationState}
                            disabled={!this.state.isValid || this.state.loading}
                            onClick={this.timeSet.bind(this)}>
                            Set</Button>
                    </InputGroup.Button>
                </InputGroup>
            </FormGroup >
        );
    }

}

function mapStateToProps(state) {
    return {
        currentButton: state.alarm.currentButton
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        selectButton: selectButton
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AbstractTimeButton);