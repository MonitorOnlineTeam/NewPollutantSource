import React, { Component } from 'react';
import BdTestHistoryListContent from './BdTestHistoryListContent';

class BdTestHistoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <div>
                <BdTestHistoryListContent {...match.params} height="calc(100vh - 465px)" />
            </div>
        );
    }
}
export default BdTestHistoryList;