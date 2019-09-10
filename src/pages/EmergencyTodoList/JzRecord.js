import React, { Component } from 'react';
import { Button, Icon, Card } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MonitorContent from '../../components/MonitorContent/index';
import JzRecordContent from './JzRecordContent';

@connect()
class JzRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    enterTaskDetail = () => {
        if (this.props.match.params.taskfrom === 'ywdsjlist') {    //运维大事记
            this.props.dispatch(routerRedux.push(`/TaskDetail/emergencydetailinfolayout/${this.props.match.params.viewtype}/${this.props.match.params.taskfrom}/${this.props.match.params.TaskID}/${this.props.match.params.pointcode}`));
        } else if (this.props.match.params.taskfrom === 'qcontrollist') {    //质控记录
            this.props.dispatch(routerRedux.push(`/TaskDetail/emergencydetailinfolayout/${this.props.match.params.viewtype}/${this.props.match.params.taskfrom}-${this.props.match.params.histroyrecordtype}/${this.props.match.params.TaskID}/${this.props.match.params.pointcode}`));
        } else {    //其他
            this.props.dispatch(routerRedux.push(`/TaskDetail/emergencydetailinfolayout/${this.props.match.params.viewtype}/nop/${this.props.match.params.TaskID}/${this.props.match.params.pointcode}`));
        }
    }

    //生成面包屑
    renderBreadCrumb = () => {
        const rtnVal = [];
        let listUrl = this.props.match.params.viewtype;
        let taskID = this.props.match.params.TaskID;
        let DGIMN = this.props.match.params.pointcode;
        let taskfrom = this.props.match.params.taskfrom;
        let histroyrecordtype = this.props.match.params.histroyrecordtype;
        rtnVal.push({ Name: '首页', Url: '/' });
        switch (listUrl) {
            case 'datalistview':    //数据一栏
                rtnVal.push({ Name: '数据一览', Url: `/overview/${listUrl}` });
                break;
            case 'mapview':         //地图一栏
                rtnVal.push({ Name: '地图一览', Url: `/overview/${listUrl}` });
                break;
            case 'pielist': //我的派单
                rtnVal.push({ Name: '我的派单', Url: `/account/settings/mypielist` });
                break;
            case 'workbench':    //工作台
                rtnVal.push({ Name: '工作台', Url: `/${listUrl}` });
                break;
            case 'pointinfo': //监测点管理
                rtnVal.push({ Name: '监测点管理', Url: `/sysmanage/${listUrl}` });
                break;
            default:
                break;
        }
        if (taskfrom === 'ywdsjlist') {    //运维大事记
            rtnVal.push({ Name: '运维大事记', Url: `/pointdetail/${DGIMN}/${listUrl}/${taskfrom}` });
            rtnVal.push({ Name: '任务详情', Url: `/TaskDetail/emergencydetailinfolayout/${listUrl}/${taskfrom}/${taskID}/${DGIMN}` });
        } else if (taskfrom === 'qcontrollist') {    //质控记录
            rtnVal.push({ Name: '质控记录', Url: `/pointdetail/${DGIMN}/${listUrl}/${taskfrom}/${histroyrecordtype}` });
        } else if (taskfrom === 'qualityControlOperation') {    //智能质控
            rtnVal.push({ Name: '智能质控', Url: `` });
        } else if (taskfrom === 'operationywdsjlist') { //运维大事记
            rtnVal.push({ Name: '智能运维', Url: `` });
            rtnVal.push({ Name: '运维大事记', Url: `/operation/ywdsjlist` });
            rtnVal.push({ Name: '任务详情', Url: `/TaskDetail/emergencydetailinfolayout/undefined/operationywdsjlist/${taskID}/${DGIMN}` });
        } else if (taskfrom === 'OperationCalendar') { //运维日历
            rtnVal.push({ Name: '智能运维', Url: `` });
            rtnVal.push({ Name: '运维日历', Url: `/operation/OperationCalendar` });
            rtnVal.push({ Name: '任务详情', Url: `/TaskDetail/emergencydetailinfolayout/undefined/OperationCalendar/${taskID}/${DGIMN}` });
        }else {    //其他
            rtnVal.push({ Name: '任务详情', Url: `/TaskDetail/emergencydetailinfolayout/${listUrl}/nop/${taskID}/${DGIMN}` });
        }
        if (listUrl !== 'menu') {
            rtnVal.push({ Name: 'CEMS零点量程漂移与校准记录表', Url: '' });
        }
        if (listUrl === 'menu') {
            rtnVal.push({ Name: '零点量程偏移与校准记录', Url: `/qualitycontrol/JzHistoryList` });
            rtnVal.push({ Name: '零点量程偏移与校准记录表', Url: `` });
        }
        return rtnVal;
    }

    render() {
        return (
            <MonitorContent  {...this.props} breadCrumbList={this.renderBreadCrumb()}>
                <Card title={<span style={{ fontWeight: '900' }}>运维表单</span>} extra={
                    <p>
                        <Button type="primary" ghost={true} style={{ float: "left", marginRight: 20 }} onClick={this.enterTaskDetail}>
                            <Icon type="file-text" />任务单</Button>
                        <Button style={{ float: "right", marginRight: 30 }} onClick={() => {
                            this.props.history.goBack(-1);
                        }}><Icon type="left" />退回</Button></p>}>
                    <JzRecordContent TaskID={this.props.match.params.TaskID} />
                </Card>
            </MonitorContent>
        );
    }
}
export default JzRecord;