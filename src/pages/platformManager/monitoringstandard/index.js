/*
 * @Author: wjw
 * @Date: 2019-10-17
 * @Description: 监测点-检测标准
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

import MonitoringStandard from '@/components/MonitoringStandard';

// @connect(({ loading, exceptionrecord }) => ({

// }))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: "",
            pollutantType: '',
            title:''
        };
    }


    render() {
        const { pollutantType, dgimn,title } = this.state;

        return (
            <div id="record">
                {/* selKeys="31011537961003" */}
                <NavigationTree domId="#record" choice={false} onItemClick={value => {
                    console.log(value[0]);
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.setState({
                            dgimn: value[0].key,
                            title:`${value[0].entName} - ${value[0].pointName}`,
                            pollutantType: value[0].Type
                        })
                    }
                }} />
           {dgimn&&<BreadcrumbWrapper titles={`【${title}】` }>
                   <MonitoringStandard DGIMN={dgimn} pollutantType={pollutantType}></MonitoringStandard>
                </BreadcrumbWrapper>
               }
            </div>
            // <Table
            // columns={columns}
            // dataSource={data}
            // />
        );
    }
}
export default Index;
