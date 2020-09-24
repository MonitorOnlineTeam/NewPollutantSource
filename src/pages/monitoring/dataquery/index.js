import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '../../../components/NavigationTree'
import DataQuery2 from './components/DataQuery2'
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
            entName: '',
        };
    }

    changeDgimn = value => {
        this.setState({
            dgimn: value[0].key,
            pointName: value[0].pointName,
            entName: value[0].entName,
        })
    }

    render() {
        const { pointName, entName } = this.state;
        return (
            <div id="dataquery">
                <BreadcrumbWrapper>
                    {
                        this.state.dgimn ?
                            (
                                this.props.location.query.type == 1 ? <DataQuery2 DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData /> :
                                    <DataQuery DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData />
                            )
                            : <PageLoading />
                    }
                </BreadcrumbWrapper>
                <NavigationTree runState='1' domId="#dataquery" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.changeDgimn(value)
                    }
                }} />
            </div>
        );
    }
}
export default Index;
