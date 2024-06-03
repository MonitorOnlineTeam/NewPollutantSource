import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import styles from '@/pages/home_ys/index.less';
import Marquee from '@/components/Marquee';
import ReactSeamlessScroll from 'react-seamless-scroll';
import ReactEcharts from 'echarts-for-react';
import { router } from 'umi';

// const DGIMN = 'cems_202305190935'
const DGIMN = 'cems_202308021036222'

@connect(({ loading, home_ys }) => ({
  paramsInfo: home_ys.paramsInfo,
  CO2RateAll: home_ys.CO2RateAll,
}))
class CO2Rate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getData(DGIMN);
  }

  getData = dgimn => {
    this.props.dispatch({
      type: 'home_ys/GetProcessFlowChartStatus',
      payload: {
        dgimn: dgimn,
      },
    });
  };

  //  计算二氧化碳排放率
  countCO2Rate = DGIMN => {
    let CO2Value = 0,
      flowValue = 0;
    const { paramsInfo, CO2RateAll } = this.props;
    paramsInfo[DGIMN].map(item => {
      if (item.pollutantCode === 'a05001') {
        CO2Value = item.value || 0;
      }
      if (item.pollutantCode === 'b02' || item.pollutantCode === 'a00000') {
        flowValue = item.value || 0;
      }
    });

    // 实时CO2*10000*44*标杆流量/22.4/两个1000
    let value = (CO2Value * 10000 * 44 * flowValue) / 22.4 / 1000 / 1000;
    this.props.dispatch({
      type: 'home_ys/updateState',
      payload: {
        CO2RateAll: {
          ...CO2RateAll,
          [DGIMN]: value.toFixed(),
        },
      },
    });
    // return value
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(this.props.paramsInfo[DGIMN]) !==
      JSON.stringify(prevProps.paramsInfo[DGIMN])
    ) {
      this.countCO2Rate(DGIMN);
    }
    if (
      JSON.stringify(this.props.paramsInfo['62030231rdep12']) !==
      JSON.stringify(prevProps.paramsInfo['62030231rdep12'])
    ) {
      this.countCO2Rate('62030231rdep12');
    }
  }

  onShowModal = (modalType, title) => {
    this.props.dispatch({
      type: 'home_ys/updateState',
      payload: {
        yanshiVisible: true,
        modalType: modalType,
        yanshiModalTitle: title,
      },
    });
  };

  render() {
    const { warningInfoList, CO2RateAll } = this.props;
    return (
      <div className={styles.CO2RateWrapper} style={{ display: 'block' }}>
        <Tooltip title="点击查看系统流程" color={'#2F4F60'}>
          <div
            className={styles.CO2rateItemContent}
            onClick={() => {
              this.onShowModal('realtimedata1', '废气排口 - 系统流程');
            }}
          >
            <p className={styles.pointName} style={{ textAlign: 'center', marginTop: 30, fontSize: 18 }}>
              <i></i>废气排口
            </p>
            <p className={styles.value} style={{ marginTop: 50, fontSize: 16 }}>
              CO₂排放速率：
              <span className={styles.num}>{CO2RateAll[DGIMN]}</span>
              <span className={styles.unit}>kg/h</span>
            </p>
          </div>
        </Tooltip>
      </div>
    );
  }
}

export default CO2Rate;
