
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import NavigationTree from '@/components/NavigationTree'
import CycleTable from "../components/CycleTable"

/**
 * 质控核查 零点核查设置
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
            pollType:"",
           
        };
    }

    changeDgimn = (value)=> {
        this.setState({  title: `${value[0].entName} - ${value[0].pointName}`, dgimn: value[0].key,  pollType:value[0].Type  })
        let { dgimn,pollType, dispatch,cycleListParams,addParams} = this.props;
         dgimn = value[0].key;
         pollType = value[0].Type;
         cycleListParams={...cycleListParams, QCAType: 1026}
         addParams = {...addParams, QCAType: 1026,DGIMN:value[0].key}
         dgimn&&pollType? dispatch({ type: 'qualitySet/updateState', payload: { dgimn,pollType,cycleListParams,addParams } }) : null;
         
    }

    render() {
        const { title,dgimn,pollType } = this.state;
        return (
            <div id="zeroPointData">
          <NavigationTree onItemClick={(value) => {  this.changeDgimn(value) }} />

                <BreadcrumbWrapper extraName={ `${ title}`}>
                 {dgimn&&pollType ?   <CycleTable  initLoadData /> : <PageLoading /> }
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
