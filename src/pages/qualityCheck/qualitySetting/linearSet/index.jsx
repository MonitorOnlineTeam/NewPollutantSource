
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import NavigationTree from '@/components/NavigationTreeNew'
import CycleTable from "../components/CycleTable"

/**
 * 质控核查 响应时间核查设置
 * jab 2020.08.18
 */
import { connect } from 'dva';
@connect(({ loading,qualitySet }) => ({
    dgimn:qualitySet.dgimn,
    pollType:qualitySet.pollType, 
    cycleListParams:qualitySet.cycleListParams,
    addParams:qualitySet.addParams,
}))
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            title: '',
            pollType:""
        };
    }

    changeDgimn = (value, selectItem)=> {
        this.setState({  title: selectItem.title, dgimn: value,  pollType:selectItem.PointType  })
        let { dgimn,pollType, dispatch,cycleListParams,addParams} = this.props;
         dgimn = value;
         pollType = selectItem.PointType
         cycleListParams={...cycleListParams, QCAType: 1029}
         addParams = {...addParams, QCAType: 1029,DGIMN:value}
         dgimn&&pollType? dispatch({ type: 'qualitySet/updateState', payload: { dgimn,pollType,cycleListParams,addParams} }) : null
    }

    render() {
        const { title,dgimn,pollType } = this.state;
        return (
            <div id="zeroPointData">
          <NavigationTree onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />

                <BreadcrumbWrapper extraName={ `${ title}`}>
                 {dgimn&&pollType ?   <CycleTable  initLoadData/> : <PageLoading /> }
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
