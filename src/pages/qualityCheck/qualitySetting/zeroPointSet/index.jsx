
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import  ZeroPointData from './components/ZeroPointData'
import NavigationTree from '@/components/NavigationTreeNew'
import CycleTable from "../components/CycleTable"

/**
 * 质控核查 零点核查设置
 * jab 2020.08.18
 */
import { connect } from 'dva';
@connect(({ loading,qualitySet }) => ({
    dgimn:qualitySet.dgimn
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
        let { dgimn,pollType, dispatch} = this.props;
         dgimn = value;
         pollType = selectItem.PointType
         dgimn&&pollType? dispatch({ type: 'qualitySet/updateState', payload: { dgimn,pollType } }) : null
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
