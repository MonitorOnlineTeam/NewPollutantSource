import React, { Component } from 'react';
import StopCemsHistoryListContent from './StopCemsHistoryListContent';

class StopCemsHistoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <div>
                <StopCemsHistoryListContent {...match.params} height="calc(100vh - 465px)" />
            </div>
        );
    }
}
export default StopCemsHistoryList;
