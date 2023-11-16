import React, { Component } from 'react';
import OperationAnalysis from './OperationAnalysis';
import OperationStatistics from './OperationStatistics';
import AlarmMessage from './AlarmMessage';
import MonitoringStatus from './MonitoringStatus';
import EmissionsAnalysis from './EmissionsAnalysis';
import EmissionTax from './EmissionTax';
import EmissionYears from './EmissionYears';
import QCAPassRate from '@/pages/home_ys/yanshi/QCAPassRate.js';
import ComparisonOfMonChart from '@/pages/home_ys/yanshi/ComparisonOfMonChart.js';
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
      case 'OperationAnalysis':
        return <OperationAnalysis currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />;
        break;
      //运维统计
      case 'OperationStatistics':
        return <OperationStatistics currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />;
        break;
      //报警信息
      case 'AlarmMessage':
        return <AlarmMessage currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />;
        break;
      //监控现状
      case 'MonitoringStatus':
        return <MonitoringStatus currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />;
        break;
      //排放量分析
      case 'EmissionsAnalysis':
        return <EmissionsAnalysis currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />;
        break;
      //年度排放量对比分析
      case 'EmissionTax':
        // return<EmissionTax currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN}/>
        return <EmissionYears currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />;
        break;
      //质控合格率
      case 'QCAPassRate':
        return <QCAPassRate currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />;
        break;
      //排放量对比分析图
      case 'CO2LinearAnalysisChart':
        return <ComparisonOfMonChart currentMonth={currentMonth} entCode={entCode} DGIMN={DGIMN} />;
        break;
      default:
        break;
    }
    return res;
  };

  getloading = () => {
    return true;
  };

  render() {
    return <>{this.getDomRender()}</>;
  }
}

export default HomeCommon;
