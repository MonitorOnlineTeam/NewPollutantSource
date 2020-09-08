/*
 * @Author: lzp
 * @Date: 2019-07-25 16:26:11
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:33:07
 * @Description: 异常记录
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Table,
} from 'antd';
import { PointIcon } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import styles from './index.less';
import NavigationTree from '@/components/NavigationTreeNew'
import RecordEchartTable from '@/components/recordEchartTable'
import PageLoading from '@/components/PageLoading'
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn:"",
            title:""
        };
    }

    changeDgimn = (value, selectItem)=> {
        this.setState({
            dgimn: value,
            title: selectItem.title,
        })
    }
    render() {
        const { dgimn,title } = this.state;
        return (
            <div id="record">
                <NavigationTree onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />
                <BreadcrumbWrapper extraName={ `${ title}`}>
                    
                    {dgimn ?    <RecordEchartTable initLoadData DGIMN={this.state.dgimn}    location={this.props.location}/>: <PageLoading /> }  
                </BreadcrumbWrapper> 
            </div>
        );
    }
}
export default Index;
