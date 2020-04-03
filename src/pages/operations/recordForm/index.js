/*
 * @Author: lzp
 * @Date: 2019-08-22 11:04:46
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:32:19
 * @Description: 运维记录单详情
 */
import React, { Component } from 'react';
import {
    Table, Divider, Icon
} from 'antd';
import { PointIcon, Right } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import BdTestRecordContent from '@/pages/EmergencyTodoList/BdTestRecordContent'
import CompleteExtractionRecordContent from '@/pages/EmergencyTodoList/CompleteExtractionRecordContent'
import ConsumablesReplaceRecordContent from '@/pages/EmergencyTodoList/ConsumablesReplaceRecordContent'
import DeviceExceptionRecordContent from '@/pages/EmergencyTodoList/DeviceExceptionRecordContent'
import DilutionSamplingRecordContent from '@/pages/EmergencyTodoList/DilutionSamplingRecordContent'
import DirectMeasurementRecordContent from '@/pages/EmergencyTodoList/DirectMeasurementRecordContent'
import RepairRecordContent from '@/pages/EmergencyTodoList/RepairRecordContent'
import StandardGasRepalceRecordContent from '@/pages/EmergencyTodoList/StandardGasRepalceRecordContent'
import StopCemsRecordContent from '@/pages/EmergencyTodoList/StopCemsRecordContent'
import JzRecordContent from '@/pages/EmergencyTodoList/JzRecordContent'
import MaintainRepalceRecord from '@/pages/EmergencyTodoList/MaintainRepalceRecord'
import SparePartReplaceRecord from '@/pages/EmergencyTodoList/SparePartReplaceRecordContent'
import Button from 'antd/es/button/button';
import { FormIcon } from '@/utils/icon';
import { router } from 'umi'




// @connect(({ loading, exceptionrecord }) => ({

// }))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    getrecordForm = () => {
        var form = []
        var key = this.props.match.params.typeID
        switch (key) {
            case "1"://维修记录表
                form = <RepairRecordContent TaskID={this.props.match.params.taskID} />
                break;
            case "2"://停机记录表
                form = <StopCemsRecordContent TaskID={this.props.match.params.taskID} />
                break;
            case "3"://易耗品更换记录表
                form = <ConsumablesReplaceRecordContent TaskID={this.props.match.params.taskID} />
                break;
            case "4"://标准气体更换记录表
                form = <StandardGasRepalceRecordContent TaskID={this.props.match.params.taskID} />
                break;
            case "5"://完全抽取法CEMS日常巡检记录表
                form = <CompleteExtractionRecordContent TaskID={this.props.match.params.taskID} />
                break;
            case "6"://稀释采样法CEMS日常巡检记录表
                form = <DilutionSamplingRecordContent TaskID={this.props.match.params.taskID} />
                break;
            case "7"://直接测量法CEMS日常巡检记录表
                form = <DirectMeasurementRecordContent TaskID={this.props.match.params.taskID} />
                break;
            case "8"://CEMS零点量程漂移与校准记录表
                form = <JzRecordContent TaskID={this.props.match.params.taskID} />
                break;
            case "9"://CEMS校验测试记录
                form = <BdTestRecordContent TaskID={this.props.match.params.taskID} />
                break;
            case "10"://CEMS设备数据异常记录表
                form = <DeviceExceptionRecordContent TaskID={this.props.match.params.taskID} />
                break;
            case "27"://保养项更换记录表
                form = <MaintainRepalceRecord TaskID={this.props.match.params.taskID} />
                break;
            case "28"://备品更换记录表
                form = <SparePartReplaceRecord TaskID={this.props.match.params.taskID} />
                break;
        }
        return form
    }
    render() {
        return (
            <BreadcrumbWrapper breadcrumb={[]} title="记录单详情">
                <div width="70%" style={{ backgroundColor: '#fff' }}>
                    <Button type="primary" ghost style={{ marginTop: 5, marginLeft: '85%' }} onClick={() => {
                        router.push(`/taskdetail/emergencydetailinfolayout/${this.props.match.params.taskID}/21`);
                    }}><FormIcon />任务单</Button>
                    <Button style={{ marginTop: 5, marginLeft: 10 }} onClick={() => {
                        history.go(-1)
                    }}>返回</Button>

                </div>
                {this.getrecordForm()}
                {/* <JzRecordContent TaskID={this.props.match.params.taskID} />  */}
            </BreadcrumbWrapper>
        );
    }
}
export default Index;
