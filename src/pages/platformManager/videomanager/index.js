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
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import NavigationTree from '@/components/NavigationTree'
// import RecordEchartTable from '@/components/recordEchartTable'

// import hkManagerIndex from '@/components/VideoView/hk/hkManagerIndex';
import YSYManagerIndex from '@/components/VideoView/ysy';

// @connect(({ loading, exceptionrecord }) => ({

// }))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: "",
            pollutantType: ''
        };
    }


    render() {
        const { pollutantType, dgimn } = this.state;

        return (
            <div id="record">
                {/* selKeys="31011537961003" */}
                <NavigationTree domId="#record" choice={false} onItemClick={value => {
                    console.log(value);
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.setState({
                            dgimn: value[0].key,
                            pollutantType: value[0].Type
                        })
                    }
                }} />
                <PageHeaderWrapper>
                    {dgimn && <YSYManagerIndex DGIMN={dgimn}></YSYManagerIndex>}
                </PageHeaderWrapper>

            </div>
        );
    }
}
export default Index;
