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
            title: ''
        };
    }

    changeDgimn = value => {
        this.setState({
            dgimn: value[0].key,
            pointName: value[0].pointName,
            entName: value[0].entName,
            title: `${value[0].entName} - ${value[0].pointName}`,
            Type: value[0].Type,
        })
    }

    render() {
        const { dgimn, pointName, entName, title, Type } = this.state;
        const { location: { query: { pollutantCode } } } = this.props;
        // 是否显示原始和审核
        const isShowSearchDataType = this.props.location.query.isShowSearchDataType == 1 ? true : false;
        return (
            <div id="dataquery">
                <BreadcrumbWrapper titles={`【${title}】`}>
                    {
                        this.state.dgimn ?
                            (
                                this.props.location.query.type == 1 ? <DataQuery2 DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData /> :
                                    <DataQuery DGIMN={this.state.dgimn} Type={Type} pointName={pointName} entName={entName} isShowSearchDataType={isShowSearchDataType} initLoadData />
                            )
                            : <PageLoading />
                    }
                </BreadcrumbWrapper>
                <NavigationTree checkpPol={pollutantCode} runState='1' domId="#dataquery" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        console.log('value=', value)
                        this.changeDgimn(value)
                    }
                }} />
            </div>
        );
    }
}
export default Index;
