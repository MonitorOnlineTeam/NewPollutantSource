import React, { Component } from 'react';
import JzHistoryListContent from './JzHistoryListContent';

class JzHistoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <div>
                <JzHistoryListContent {...match.params} height="calc(100vh - 465px)" />
            </div>
        );
    }
}
export default JzHistoryList;