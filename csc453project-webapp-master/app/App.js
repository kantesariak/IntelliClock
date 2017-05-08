import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {store} from './util/store';
import Layout from './Layout';


export default class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <Layout />
            </Provider>
        );
    }

}

ReactDOM.render(<App />, document.getElementById("App"));