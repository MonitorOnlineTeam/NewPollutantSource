import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '../../../components/NavigationTree'
import CommandDispatchReport from './components/index'
import PageLoading from '@/components/PageLoading'
/**
 * 指挥调度报表页面
 * xpy 2019.07.26
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
            < div id = "CommandDispatchReport" >
                <PageHeaderWrapper>
                 {this.state.dgimn ? <CommandDispatchReport DGIMN={this.state.dgimn} initLoadData/> : <PageLoading/>}
                </PageHeaderWrapper>
                <NavigationTree domId="#CommandDispatchReport" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                            }
                        }} />
            </div>
        );
    }
}
export default Index;
