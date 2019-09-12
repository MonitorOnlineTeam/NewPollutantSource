import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '../../../components/NavigationTree';
import DataQuery from '../dataquery/components/DataQuery';
import WorkingCondition from './components/WorkingCondition';
/**
 * 实时监控页面
 * zhb 2019.07.26
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
        };
    }

    changeDgimn=dgimn => {
        this.setState({
            dgimn,
        })
    }

    render() {
        return (
            <div id="dataquery">
                <PageHeaderWrapper>
                 <WorkingCondition DGIMN={this.state.dgimn} />

                </PageHeaderWrapper>
                <NavigationTree domId="#dataquery" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
