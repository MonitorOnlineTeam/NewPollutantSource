import React, { Component } from 'react';
import DeviceExceptionHistoryListContent from './DeviceExceptionHistoryListContent';

class DeviceExceptionHistoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <div>
                <DeviceExceptionHistoryListContent {...match.params} height="calc(100vh - 465px)" />
            </div>
        );
    }
}
export default DeviceExceptionHistoryList;