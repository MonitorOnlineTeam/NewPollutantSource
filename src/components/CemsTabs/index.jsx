

import React from 'react';

import PropTypes from 'prop-types';

import { Tabs } from 'antd';

const { TabPane } = Tabs;

import TabContent from './TabContent'

class CemsTabs extends React.Component {
    static propTypes = {
        key: PropTypes.string || PropTypes.number,
        title: PropTypes.string
    }
    static defaultProps = {
        key: 0,
        title: '',
        defaultKey:''
    }
    constructor(props) {
        super(props);
        this.state = { panes: '' };
    }
    tabChanges = (key)=> {
         const { tabChange } = this.props;
         tabChange(key)
    }
    componentDidMount() {
        const { defaultKey,tabChange,panes } = this.props;

        const defaultActiveKey = defaultKey || panes[0].key;

        tabChange(defaultActiveKey)
    }
    render() {
        const { panes,defaultKey } = this.props;
        return (
            <>
                <Tabs  type="card" defaultActiveKey={defaultKey} onChange={this.tabChanges}>
                    {panes.length > 0 ? panes.map(pane =>
                        <TabPane tab={pane.title} key={pane.key}>
                              {  pane.name.constructor ? pane.name.constructor == Object? pane.name : <TabContent name={pane.name}/> : null  }
                        </TabPane>
                    ) : null}
                </Tabs>
            </>
        );
    }
}

export default CemsTabs;