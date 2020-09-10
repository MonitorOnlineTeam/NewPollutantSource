/*
 * @Author: wjw
 * @Date: 2019-10-21
 * @Description: 视频管理
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
import styles from './style.less';
import NavigationTree from '@/components/NavigationTreeNew'
// import RecordEchartTable from '@/components/recordEchartTable'

import HkCameraIndex from '@/components/VideoView/hk/hkManagerIndex';
import YSYManagerIndex from '@/components/VideoView/ysy';

@connect(({
  loading,
  global,
}) => ({
  configInfo: global.configInfo,
}))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            pollutantType: '',
            title:""
        };
    }

    changeDgimn = (value, selectItem)=> {
        this.setState({  title: selectItem.title, dgimn: value,  pollutantType:selectItem.PointType  })

    }
    render() {
        const { pollutantType, dgimn,title } = this.state;
        const { configInfo } = this.props;
        return (
            <div id="videomanager">
                <NavigationTree onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} />
                <BreadcrumbWrapper  extraName={ `${ title}`}>
                {dgimn && (configInfo.VideoType == 0 ? <HkCameraIndex DGIMN={dgimn}></HkCameraIndex> : <YSYManagerIndex DGIMN={dgimn}></YSYManagerIndex>)}
                </BreadcrumbWrapper>

            </div>
        );
    }
}
export default Index;
