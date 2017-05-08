import React from 'react';
import { FormControl, FormGroup, Button, InputGroup, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import { setTransitType, selectButton } from '../../reducers/alarm/alarmActions';

class TransitTypeButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.transitType,
            changed: false,
            loading: false
        };
    }

    buttonPressed(set) {
        this.props.selectButton(set ? "transitType" : "");
    }

    itemPressed() {
        this.setState({
            loading: true
        });
        axios.post('/api/alarm/transit/type', {
            type: this.state.value
        }).then(res => {
            if (res.status == 200) {
                this.props.setTransitType(res.data.type);

                this.setState({
                    changed: false,
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
        });
    }

    selectChange(event) {
        this.setState({
            value: event.target.value,
            changed: event.target.value != this.props.transitType
        });
    }

    render() {
        return (
            <FormGroup>
                <ControlLabel>{this.props.title}</ControlLabel>
                <InputGroup bsSize="large">
                    <FormControl
                        componentClass="select"
                        onFocus={() => { this.buttonPressed.bind(this)(true) }}
                        onBlur={() => { this.buttonPressed.bind(this)(false) }}
                        onChange={this.selectChange.bind(this)}
                        value={this.state.value}
                        disabled={this.state.loading}>
                        <option value="Driving">Driving</option>
                        <option value="Walking">Walking</option>
                        <option value="Bicycling">Bicycling</option>
                        <option value="Transit">Transit</option>
                    </FormControl>
                    <InputGroup.Button>
                        <Button
                            disabled={this.state.loading || !this.state.changed}
                            onClick={this.itemPressed.bind(this)}>
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
        transitType: state.alarm.transitType
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        setTransitType: setTransitType,
        selectButton: selectButton
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(TransitTypeButton);