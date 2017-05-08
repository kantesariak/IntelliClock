import React, {Component} from 'react';
import {Nav, NavItem} from 'react-bootstrap';

import Page from './components/Page';

export default class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "1"
        }
    }

    handleSelect(eventKey) {
        this.setState({
           selectedTab: eventKey 
        });
    }

    render() {
        return (
        <div>
            <Nav bsStyle="tabs" activeKey={this.state.selectedTab} onSelect={this.handleSelect.bind(this)}>
                <NavItem eventKey="1">Alarm Settings</NavItem>
                <NavItem eventKey="2">Coffee Maker Settings</NavItem>
                <NavItem eventKey="3">Debug</NavItem>
            </Nav>
            <Page selected={this.state.selectedTab} />
        </div>
        );
    }

}