import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
// import NavigationTree from '@/components/NavigationTree'
import PageLoading from '@/components/PageLoading'
import  HistoryDatas from './components/HistoryDatas'

import NavigationTree from '@/components/NavigationTreeNew'
/**
 * 数据查询 历史数据
 * jab 2020.07.30
 */
import { connect } from 'dva';
@connect(({ loading,historyData }) => ({
    dgimn:historyData.dgimn,
    pollType:historyData.pollType
}))
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            pointName: '',
        };
    }

    changeDgimn = (value, selectItem)=> {
        this.setState({
            dgimn: value,
            name: selectItem.name,
        })
        let { dgimn, dispatch,pollType} = this.props;
         dgimn = value;
         pollType = selectItem.PointType;
         dispatch({ type: 'historyData/updateState', payload: { dgimn,pollType } })
    }

    render() {
        const { pointName, entName,dgimn } = this.state;
        return (
            <div id="historyData">

               {/* <NavigationTree  domId="#dataquery" choice={false} runState='1' domId="#dataquery" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.changeDgimn(value)
                    }
                }} />  */}
          <NavigationTree domId="working" onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />

                <BreadcrumbWrapper extraName={ `${entName} - ${ pointName}`}>
                    {/* {
                        this.state.dgimn ?
                            (
                                this.props.location.query.type == 1 ? <DataQuery2 DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData /> :
                                    <DataQuery DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData />
                            )
                            : <PageLoading />
                    } */}
                    <HistoryDatas  DGIMN={dgimn} initLoadData/>
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
