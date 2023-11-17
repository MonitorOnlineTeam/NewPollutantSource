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
import NavigationTree from '../../../components/NavigationTree'
import RecordEchartTable from '../../../components/recordEchartTable'

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn:""
        };
    }
    render() {
        return (
            <div id="record">
                {/* selKeys="31011537961003" */}
                <NavigationTree runState='1'  domId="#record" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.setState({
                            dgimn:value[0].key
                        })
                    }
                }} />
                <BreadcrumbWrapper>
                    <RecordEchartTable  DGIMN={this.state.dgimn}    />
                </BreadcrumbWrapper>
                
            </div>
            // <Table
            // columns={columns}
            // dataSource={data}
            // />
        );
    }
}
export default Index;
