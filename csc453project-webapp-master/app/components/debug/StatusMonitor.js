import React from 'react';
import { Row, Col, Panel, Image, Label } from 'react-bootstrap';

export default class StatusMonitor extends React.Component {

    // props
    // status
    // name

    getRed() {
        if (this.props.status) {
            return "/images/LED_red_off.png";
        } else {
            return "/images/LED_red_on.png"
        }
    }

    getGreen() {
        if (this.props.status) {
            return "/images/LED_green_on.png";
        } else {
            return "/images/LED_green_off.png"
        }
    }

    getLabel() {
        if (this.props.status) {
            return <Label bsStyle="success">Online</Label>
        } else {
            return <Label>Offline</Label>
        }
    }

    render() {
        return (
            <Panel>
                <Row>
                    <Col xs={9}>
                        <p style={{ fontWeight: "bold" }}>{this.props.name}</p>
                    </Col>
                    <Col xs={3}>
                        {this.getLabel()}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Image src={this.getRed()} style={{ width: "100%", height: "auto" }} />
                    </Col>
                    <Col xs={6}>
                        <Image src={this.getGreen()} style={{ width: "100%", height: "auto" }} />
                    </Col>
                </Row>
            </Panel>
        );
    }

}