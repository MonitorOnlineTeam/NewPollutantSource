import React, { Component } from 'react';
import StandardGasRepalceHistoryListContent from './StandardGasRepalceHistoryListContent';

class StandardGasRepalceHistoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {match}=this.props;
        return (
            <div>
                <StandardGasRepalceHistoryListContent {...match.params} height="calc(100vh - 465px)" />
            </div>
        );
    }
}
export default StandardGasRepalceHistoryList;
