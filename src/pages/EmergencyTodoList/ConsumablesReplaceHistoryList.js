import React, { Component } from 'react';
import ConsumablesReplaceHistoryListContent from './ConsumablesReplaceHistoryListContent';

class RepairHistoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <div>
                <ConsumablesReplaceHistoryListContent {...match.params} height="calc(100vh - 465px)" />
            </div>
        );
    }
}
export default RepairHistoryList;
