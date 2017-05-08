import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, FormGroup, ControlLabel, FormControl, InputGroup } from 'react-bootstrap';
import axios from 'axios';

import { selectButton, setPrepTime } from '../../reducers/alarm/alarmActions';

class PrepTimeButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            validationState: null,
            setValidationState: "default",
            value: this.props.prepTime,
            isValid: false,
            loading: false
        };
    }

    buttonPressed(set) {
        this.props.selectButton(set ? "prep_time" : "");
    }

    valueChanged(event) { let validationState = "error";
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
        return /^\d+$/.test(time);
    }

    timeSet() {
        this.setState({
            loading: true
        });
        axios.post('/api/alarm/preptime', {
            prepTime: Number(this.state.value)
        }).then(res => {
            if (res.status == 200) {
                this.props.setPrepTime(res.data.prepTime);

                this.setState({
                    validationState: null,
                    setValidationState: "default",
                    value: res.data.prepTime,
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

    getValue() {
        if (this.props.currentButton == "prep_time") {
            return this.state.value;
        } else {
            return `${this.state.value} minutes`;
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
                        onChange={this.valueChanged.bind(this)}
                        placeholder={this.props.prepTime}
                        value={this.getValue()}
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
        currentButton: state.alarm.currentButton,
        prepTime: state.alarm.prepTime,
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        selectButton: selectButton,
        setPrepTime: setPrepTime
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(PrepTimeButton);