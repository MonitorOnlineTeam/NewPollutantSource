import React, { Component } from 'react';
import WQCQFInspectionHistoryListContent from './WQCQFInspectionHistoryListContent';

class WQCQFInspectionHistoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <div>
                <WQCQFInspectionHistoryListContent {...match.params} height="calc(100vh - 465px)" />
            </div>
        );
    }
}
export default WQCQFInspectionHistoryList;