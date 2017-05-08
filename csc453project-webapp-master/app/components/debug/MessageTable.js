import React from 'react';
import { Panel, Table } from 'react-bootstrap';

export default class MessageTable extends React.Component {

    render() {
        return (
            <Panel>
                <Table striped hover>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Topic</th>
                            <th>Payload</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.messages.map((message, i) => {
                                return (
                                    <tr key={`${message.timestamp}-${i}`}>
                                        <td>{new Date(message.timestamp).toLocaleString()}</td>
                                        <td>{message.topic}</td>
                                        <td>{message.payload}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </Panel>
        );
    }

} 