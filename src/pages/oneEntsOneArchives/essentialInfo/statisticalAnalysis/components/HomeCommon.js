import React, { Component } from 'react';
import OperationAnalysis from './OperationAnalysis';
import OperationStatistics from './OperationStatistics';
import AlarmMessage from './AlarmMessage';
import MonitoringStatus from './MonitoringStatus';
import EmissionsAnalysis from './EmissionsAnalysis';
import EmissionTax from './EmissionTax';
import AlarmTotal from './AlarmTotal'
import EntAttributes from './EntAttributes'
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

    getDomRender=()=>{
        const {assembly,entCode,DGIMN}=this.props;
        const {currentMonth}=this.state;
        let res;
        switch(assembly)
        {
            //运维分析
            case "OperationAnalysis":
                 return<OperationAnalysis currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN}/>
                break;
                //运维统计
            case "OperationStatistics":
                return<OperationStatistics currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN}/>
                break;
                //报警信息
            case "AlarmMessage":
                return<AlarmMessage currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN}/>
                break;
                //监控现状
            case "MonitoringStatus":
                return<MonitoringStatus currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN}/>
                break;
                //排放量分析
            case "EmissionsAnalysis":
                return<EmissionsAnalysis currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN}/>
                break;
                //排污税
            case "EmissionTax":
                return<EmissionTax currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN}/>
                break;
                //月超标报警统计
            case "AlarmTotal":
                return<AlarmTotal currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN}/>
               //企业属性
            case "EntAttributes":
                return<EntAttributes currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN}/>                
               break;
                default:
                    break;

        }
        return res;
    }
    
    getloading=()=>{
        return true;
    }

    
    render() {
        return (
        <>{this.getDomRender()}</>
        );
    }
}

export default HomeCommon;
