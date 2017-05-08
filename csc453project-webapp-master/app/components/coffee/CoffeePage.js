import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormGroup, ControlLabel, Panel, Button } from 'react-bootstrap';
import axios from 'axios';

import { setIsOn, setAutomatic } from '../../reducers/coffee/actions';

class CoffeePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOnDisabled: false,
            automaticDisabled: false
        };
    }

    toggleIsOn() {
        this.setState({ isOnDisabled: true });

        axios.post('/api/coffee/ison', {
            isOn: !this.props.isOn
        }).then(res => {
            this.props.setIsOn(res.data.isOn);
            this.setState({ isOnDisabled: false });
        }).catch(err => {
            this.setState({ automaticDisabled: false });
        });
    }

    toggleAutomaticBrewing() {
        this.setState({ automaticDisabled: true });

        axios.post('/api/coffee/automatic', {
            automatic: !this.props.automaticBrewing
        }).then(res => {
            this.props.setAutomatic(res.data.automatic);
            this.setState({ automaticDisabled: false });
        }).catch(err => {
            this.setState({ automaticDisabled: false });
        });
    }

    render() {
        return (
            <div>
                <br />
                <Panel style={{ maxWidth: 400, margin: '0 auto 10px' }}>
                    <h3 style={{ textAlign: "center" }}>{this.props.isOn ? "Coffee Maker Is On" : "Coffee Maker Is Off"}</h3>
                    <hr />
                    <FormGroup>
                        <ControlLabel>Turn Coffee Maker</ControlLabel>
                        <Button
                            bsSize="large"
                            disabled={this.state.isOnDisabled}
                            onClick={this.toggleIsOn.bind(this)} block>
                            {this.props.isOn ? "Off" : "On"}
                        </Button>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Configure Automatic Brewing</ControlLabel>
                        <Button
                            bsStyle={this.props.automaticBrewing ? "success" : "danger"}
                            disabled={this.state.automaticDisabled}
                            bsSize="large" onClick={this.toggleAutomaticBrewing.bind(this)} block>
                            Automatic Brewing {this.props.automaticBrewing ? "Enabled" : "Disabled"}
                            </Button>
                    </FormGroup>
                </Panel>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        isOn: state.coffee.isOn,
        automaticBrewing: state.coffee.automaticBrewing
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setIsOn: setIsOn,
        setAutomatic: setAutomatic
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CoffeePage);