import React from 'react';

import { Panel, FormControl, FormGroup, ControlLabel, Button, InputGroup } from 'react-bootstrap';

/**
 * @prop {string} title
 * @prop {boolean} enabled
 * @prop {number} value
 * @prop {function(value, callback)} setValue
 * @prop {function(value, callback)} setEnabled
 */
export default class DebugValue extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            loading: false,
            changed: false
        };
    }

    set() {
        this.setState({
            loading: true
        });

        this.props.setValue(this.state.value, (val) => {
            let newStateVals = {
                loading: false

            }

            if (val != null) {
                newStateVals.value = val;
                newStateVals.changed = false;
            }

            this.setState(newStateVals);
        });
    }

    toggleEnabled() {
        this.setState({
            loading: true
        });

        this.props.setEnabled(!this.props.enabled, (val) => {
            this.setState({
                loading: false
            });
        });
    }

    onChange(event) {
        this.setState({
            value: event.target.value,
            changed: event.target.value != this.props.value
        });
    }

    render() {
        return (
            <Panel>
                <FormGroup>
                    <ControlLabel>{this.props.title}</ControlLabel>
                    <InputGroup style={{ margin: 5 }}>
                        <FormControl
                            type="number"
                            min="0"
                            style={{ textAlign: "center" }}
                            value={this.state.value}
                            onChange={this.onChange.bind(this)}
                            disabled={!this.props.enabled || this.state.loading}
                        />
                        <InputGroup.Button>
                            <Button
                                onClick={this.set.bind(this)}
                                disabled={!this.props.enabled || this.state.loading || !this.state.changed}>
                                Set
                            </Button>
                        </InputGroup.Button>
                    </InputGroup>
                    <div className="text-center">
                        <Button
                            bsStyle={this.props.enabled ? "success" : "danger"}
                            style={{ marginTop: 10, marginBottom: -10, width: "50%" }}
                            onClick={this.toggleEnabled.bind(this)}
                            disabled={this.state.loading}>
                            {this.props.enabled ? "Enabled" : "Disabled"}
                        </Button>
                    </div>
                </FormGroup>
            </Panel>
        );
    }

}
