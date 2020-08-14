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
        };
    }

    changeDgimn = (value, selectItem)=> {
        this.setState({
            dgimn: value,
            title: selectItem.title,
        })
        let { dgimn, dispatch,pollType} = this.props;
         dgimn = value;
         pollType = selectItem.PointType;
        //  dispatch({ type: 'historyData/updateState', payload: { dgimn,pollType } })
    }

    render() {
        const { dgimn,title } = this.state;
        return (
            <div id="historyData">
          <NavigationTree domId="history" onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />

                <BreadcrumbWrapper extraName={ `${ title}`}>
                    <HistoryDatas  DGIMN={dgimn} initLoadData/>
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
