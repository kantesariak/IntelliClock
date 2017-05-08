import React from 'react';

import AlarmPage from './alarm/AlarmPage';
import CoffeePage from './coffee/CoffeePage';
import DebugPage from './debug/DebugPage';

export default class Page extends React.Component {

    render() {
        switch (this.props.selected) {
            case "1":
                return <AlarmPage />
            case "2":
                return <CoffeePage />
            case "3":
                return <DebugPage />
        }
        return <p>Error</p>
    }

}