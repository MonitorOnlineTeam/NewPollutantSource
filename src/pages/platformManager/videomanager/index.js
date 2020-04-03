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
import NavigationTree from '@/components/NavigationTree'
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
        };
    }


    render() {
        const { pollutantType, dgimn } = this.state;
        const { configInfo } = this.props;
        console.log('configInfo=', configInfo);
        return (
            <div id="record">
                {/* selKeys="31011537961003" */}
                <NavigationTree domId="#record" choice={false} onItemClick={value => {
                    console.log(value);
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.setState({
                            dgimn: value[0].key,
                            pollutantType: value[0].Type,
                        })
                    }
                }} />
                <BreadcrumbWrapper>
                {dgimn && (configInfo.VideoType == 0 ? <HkCameraIndex DGIMN={dgimn}></HkCameraIndex> : <YSYManagerIndex DGIMN={dgimn}></YSYManagerIndex>)}
                </BreadcrumbWrapper>

            </div>
        );
    }
}
export default Index;
