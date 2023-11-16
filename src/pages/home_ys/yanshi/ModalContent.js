import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import styles from '@/pages/home_ys/index.less';
import Marquee from '@/components/Marquee';
import ReactSeamlessScroll from 'react-seamless-scroll';
import ReactEcharts from 'echarts-for-react';
import { router } from 'umi';
import Realtimedata from '@/pages/monitoring/realtimedata';
import MonitorLineAnalysis from '@/pages/IntelligentAnalysis/CO2Emissions/monitorLineAnalysis';
import MonitorCurveAnalysis from '@/pages/IntelligentAnalysis/CO2Emissions/monitorCurveAnalysis';
import MonitorComparaAnalysis from '@/pages/IntelligentAnalysis/CO2Emissions/monitorComparaAnalysis';
import ZeroCheckPage from '@/pages/dataSearch/qca/zeroCheck/ZeroCheckPage';
import RangeCheckPage from '@/pages/dataSearch/qca/rangeCheck/RangeCheckPage';
import ResTimeCheckPage from '@/pages/dataSearch/qca/resTimeCheck/ResTimeCheckPage';
import ErrorValuePage from '@/pages/dataSearch/qca/errorValueCheck/ErrorValuePage';

import moment from 'moment';

const DGIMN = '62030231rdep11';
const pointName = '北热1号分析小屋';
@connect(({ loading, home_ys }) => ({
  modalType: home_ys.modalType,
  theme: home_ys.theme,
}))
class ModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    if (this.props.entCode !== nextProps.entCode) {
    }
  }

  // 根据弹窗类型显示不同页面
  getRenderPageByModalType = () => {
    const { modalType } = this.props;
    switch (modalType) {
      // 零点核查
      case 'zeroCheck':
        return (
          <ZeroCheckPage
            DGIMN={DGIMN}
            pointType={'2'}
            pointName={pointName}
            date={[moment('2023-01-01 00:00:00'), moment()]}
          />
        );
      // 量程核查
      case 'rangeCheck':
        return (
          <RangeCheckPage
            DGIMN={DGIMN}
            pointType={'2'}
            pointName={pointName}
            date={[moment('2023-01-01 00:00:00'), moment()]}
          />
        );
      // 响应时间核查
      case 'resTimeCheck':
        return (
          <ResTimeCheckPage
            DGIMN={DGIMN}
            pointType={'2'}
            pointName={pointName}
            date={[moment('2023-01-01 00:00:00'), moment()]}
          />
        );
      // 示值误差核查
      case 'errorValueCheck':
        return (
          <ErrorValuePage
            DGIMN={DGIMN}
            pointType={'2'}
            pointName={pointName}
            date={[moment('2023-01-01 00:00:00'), moment()]}
          />
        );
      // 工艺流程图1
      case 'realtimedata1':
        return (
          <Realtimedata
            showMode="modal"
            currentTreeItemData={[
              {
                key: '62030231rdep11',
                pointName: '北热1号分析小屋',
                entName: '华能北京热电厂',
                Type: '2',
                EntCode: '7526121f-1229-44dd-9de1-429bf6654664',
              },
            ]}
          />
          // <Realtimedata
          //   showMode="modal"
          //   currentTreeItemData={[
          //     {
          //       key: 'cems_202308021036222',
          //       pointName: '玖龙纸业(沈阳)有限公司',
          //       entName: '废气排口',
          //       Type: '2',
          //       EntCode: '6c4234c6-9978-4d1c-b342-0d40e2ec2678',
          //     },
          //   ]}
          // />
        );
      // 工艺流程图2
      case 'realtimedata2':
        return (
          <Realtimedata
            showMode="modal"
            currentTreeItemData={[
              {
                key: '62030231rdep12',
                pointName: '北热2号分析小屋',
                entName: '华能北京热电厂',
                Type: '2',
                EntCode: '7526121f-1229-44dd-9de1-429bf6654664',
              },
            ]}
          />
        );
      // 线性相关分析图
      case 'monitorLineAnalysis':
        return (
          <MonitorLineAnalysis
            showMode="modal"
            EntCode="c679c8f9-fa71-486b-9c20-0d6d2955b2d9"
            date={[moment('2023-01-01 00:00:00'), moment()]}
          />
        );
      // 直测与核算碳排放量比对分析图
      case 'monitorCurveAnalysis':
        return (
          <MonitorCurveAnalysis
            showMode="modal"
            EntCode="c679c8f9-fa71-486b-9c20-0d6d2955b2d9"
            date={[moment('2023-01-01 00:00:00'), moment()]}
          />
        );
      // 二氧化碳月度变化趋势
      case 'monitorComparaAnalysis':
        return (
          <MonitorComparaAnalysis
            showMode="modal"
            EntCode="c679c8f9-fa71-486b-9c20-0d6d2955b2d9"
            date={moment('2023-07-01 00:00:00')}
          />
        );
    }
  };

  render() {
    const { warningInfoList } = this.props;
    return <>{this.getRenderPageByModalType()}</>;
  }
}

export default ModalContent;
