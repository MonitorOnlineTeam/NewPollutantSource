import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import styles from '@/pages/home_ys/index.less';
import Marquee from '@/components/Marquee';
import ReactSeamlessScroll from 'react-seamless-scroll';
import ReactEcharts from 'echarts-for-react';
import { router } from 'umi';
import ZeroCheck from '@/pages/dataSearch/qca/zeroCheck';
import RangeCheck from '@/pages/dataSearch/qca/rangeCheck';
import Realtimedata from '@/pages/monitoring/realtimedata';
import MonitorLineAnalysis from '@/pages/IntelligentAnalysis/CO2Emissions/monitorLineAnalysis';
import MonitorCurveAnalysis from '@/pages/IntelligentAnalysis/CO2Emissions/monitorCurveAnalysis';
import ResTimeCheck from '@/pages/dataSearch/qca/resTimeCheck';
import ErrorValueCheck from '@/pages/dataSearch/qca/errorValueCheck';
import MonitorComparaAnalysis from '@/pages/IntelligentAnalysis/CO2Emissions/monitorComparaAnalysis';

@connect(({ loading, home }) => ({
  modalType: home.modalType,
  theme: home.theme,
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
        return <ZeroCheck showMode="modal" />;
      // 量程核查
      case 'rangeCheck':
        return <RangeCheck showMode="modal" location={{ query: {} }} />;
      // 响应时间核查
      case 'resTimeCheck':
        return <ResTimeCheck showMode="modal" location={{ query: {} }} />;
      // 示值误差核查
      case 'errorValueCheck':
        return <ErrorValueCheck showMode="modal" location={{ query: {} }} />;
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
        return <MonitorLineAnalysis showMode="modal" />;
      // 直测与核算碳排放量比对分析图
      case 'monitorCurveAnalysis':
        return <MonitorCurveAnalysis showMode="modal" />;
      // 直测与核算碳排放量比对分析图
      case 'monitorComparaAnalysis':
        return <MonitorComparaAnalysis showMode="modal" />;
    }
  };

  render() {
    const { warningInfoList } = this.props;
    return <>{this.getRenderPageByModalType()}</>;
  }
}

export default ModalContent;
