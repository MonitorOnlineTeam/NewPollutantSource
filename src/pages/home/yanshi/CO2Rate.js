import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd'
import styles from '@/pages/home/index.less';
import Marquee from '@/components/Marquee'
import ReactSeamlessScroll from 'react-seamless-scroll';
import ReactEcharts from 'echarts-for-react';
import { router } from 'umi';


@connect(({ loading, home }) => ({
  paramsInfo: home.paramsInfo,
  CO2RateAll: home.CO2RateAll,
}))
class CO2Rate extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.getData('62030231rdep11')
    this.getData('62030231rdep12')
  }

  getData = (dgimn) => {
    this.props.dispatch({
      type: 'home/GetProcessFlowChartStatus',
      payload: {
        dgimn: dgimn
      }
    })
  }

  //  计算二氧化碳排放率
  countCO2Rate = (DGIMN) => {
    let CO2Value = 0, flowValue = 0;
    const { paramsInfo, CO2RateAll } = this.props;
    paramsInfo[DGIMN].map(item => {
      if (item.pollutantCode === 'a05001') {
        CO2Value = item.value || 0;
      }
      if (item.pollutantCode === 'b02') {
        flowValue = item.value || 0;
      }
    })

    // 实时CO2*10000*44*标杆流量/22.4/两个1000
    let value = CO2Value * 10000 * 44 * flowValue / 22.4 / 1000 / 1000;
    this.props.dispatch({
      type: 'home/updateState',
      payload: {
        CO2RateAll: {
          ...CO2RateAll,
          [DGIMN]: value.toFixed()
        }
      },
    });
    // return value
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.props.paramsInfo['62030231rdep11']) !== JSON.stringify(prevProps.paramsInfo['62030231rdep11'])) {
      this.countCO2Rate('62030231rdep11');
    }
    if (JSON.stringify(this.props.paramsInfo['62030231rdep12']) !== JSON.stringify(prevProps.paramsInfo['62030231rdep12'])) {
      this.countCO2Rate('62030231rdep12');
    }
  }

  onShowModal = (modalType, title) => {
    this.props.dispatch({
      type: 'home/updateState',
      payload: {
        yanshiVisible: true,
        modalType: modalType,
        yanshiModalTitle: title
      }
    })
  }

  render() {
    const { warningInfoList, CO2RateAll } = this.props;
    return (
      <div className={styles.CO2RateWrapper}>
        <Tooltip title="点击查看系统流程" color={'#2F4F60'}>
          <div className={styles.CO2rateItemContent} onClick={() => {
            this.onShowModal('realtimedata1', '北热1号分析小屋 - 系统流程');
          }}>
            <p className={styles.pointName}>
              <i></i>北热1号分析小屋：
            </p>
            <p className={styles.value}>CO₂排放速率：
              <span className={styles.num}>{CO2RateAll['62030231rdep11']}</span>
              <span className={styles.unit}>kg/h</span>
            </p>
          </div>
        </Tooltip>
        <div className={styles.line}></div>
        <Tooltip title="点击查看系统流程" color={'#2F4F60'}>
          <div className={styles.CO2rateItemContent} onClick={() => {
            this.onShowModal('realtimedata2', '北热2号分析小屋 - 系统流程');
          }}>
            <p className={styles.pointName}>
              <i style={{ background: '#efb314' }}></i>北热2号分析小屋：
            </p>
            <p className={styles.value}>CO₂排放速率：
              <span className={styles.num}>{CO2RateAll['62030231rdep12']}</span>
              <span className={styles.unit}>kg/h</span>
            </p>
          </div>
        </Tooltip>
      </div>
    );
  }
}

export default CO2Rate;