import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '../../../components/NavigationTree'
import DataQuery from './components/DataQuery'
import PageLoading from '@/components/PageLoading'
/**
 * 数据查询页面
 * xpy 2019.07.26
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            pointName: '',
        };
    }

    changeDgimn = value => {
        this.setState({
            dgimn: value[0].key,
            pointName: value[0].pointName,
        })
    }

    render() {
        return (
            <div id="dataquery">
                <BreadcrumbWrapper>
                    {this.state.dgimn ? <DataQuery DGIMN={this.state.dgimn} pointName={this.state.pointName} initLoadData /> : <PageLoading />}
                </BreadcrumbWrapper>
                <NavigationTree domId="#dataquery" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.changeDgimn(value)
                    }
                }} />
            </div>
        );
    }
}
export default Index;
