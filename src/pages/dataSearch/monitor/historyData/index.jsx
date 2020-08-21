import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
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
            title: '',
            pollType:""
        };
    }

    changeDgimn = (value, selectItem)=> {
        this.setState({
            dgimn: value,
            title: selectItem.title,
            pollType:selectItem.PointType
        })
        console.log(value, selectItem)
        let { dispatch,pollType,title} = this.props;
         title = selectItem.title;
         dispatch({ type: 'historyData/updateState', payload: { title } })
    }
    render() {
        const { dgimn,title,pollType } = this.state;
        return (
            <div id="historyData">
          <NavigationTree onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />

                <BreadcrumbWrapper extraName={ `${ title}`}>
                 {dgimn ?   <HistoryDatas dgimn={dgimn} polltype={pollType} initLoadData/> : <PageLoading /> }
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
