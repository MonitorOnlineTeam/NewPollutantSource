import React, { Component } from 'react';
import OperationAnalysis from './OperationAnalysis';
import Commonpoints from './Commonpoints';
import AlarmMessage from './AlarmMessage';
import MonitoringDevice from './MonitoringDevice';
import EmissionsAnalysis from './EmissionsAnalysis';
import SolveDevice from './SolveDevice';
import moment from 'moment';
class HomeCommon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMonth: moment().format('MM') * 1,
        };
    }

    componentWillMount = () => {
        const { onRef } = this.props;
        onRef && onRef(this);
    };

    getDomRender = () => {
        const { assembly, entCode, DGIMN } = this.props;
        const { currentMonth } = this.state;
        let res;
        switch (assembly) {
            //运维分析
            case "OperationAnalysis":
                return <OperationAnalysis currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />
                break;
            //环保点位
            case "Commonpoints":
                return <Commonpoints currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />
                break;
            //报警信息
            case "AlarmMessage":
                return <AlarmMessage currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />
                break;
            //监控设备情况
            case "MonitoringDevice":
                return <MonitoringDevice currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />
                break;
            //治理情况
            case "SolveDevice":
                return <SolveDevice currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />
                break;
            //监控现状
            case "EmissionsAnalysis":
                return <EmissionsAnalysis currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />
                break;
            default:
                break;

        }
        return res;
    }

    getloading = () => {
        return true;
    }


    render() {
        return (
            <>{this.getDomRender()}</>
        );
    }
}

export default HomeCommon;
