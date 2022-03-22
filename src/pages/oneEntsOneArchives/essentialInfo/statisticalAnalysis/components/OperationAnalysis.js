import React, { Component } from 'react';
import styles from '../index.less';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import config from "@/config";
const { RunningRate, TransmissionEffectiveRate } = config;

@connect(({ loading, home }) => ({
  rateStatisticsByEntLoading: loading.effects['home/getRateStatisticsByEnt'],
  rateStatisticsByEnt: home.rateStatisticsByEnt,
}))

class OperationAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let entCode = sessionStorage.getItem('oneEntCode')
    this.getData(entCode);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.DGIMN !== nextProps.DGIMN || this.props.entCode !== nextProps.entCode) {
      this.getData(nextProps.entCode, nextProps.DGIMN);
    }
  }
  getData = (entCode, DGIMN) => {
    const { dispatch } = this.props;
    // 获取智能质控数据
    dispatch({
      type: "home/getRateStatisticsByEnt",
      payload: {
        entCode,
        DGIMN
      }
    })
  }



  // 智能质控
  getOption = (type) => {
    const { rateData } = this.props.rateStatisticsByEnt;
    if (!rateData)
      return;
    let networkeRate = rateData.NetworkeRate === undefined ? 0 : (parseFloat(rateData.NetworkeRate) * 100).toFixed(0);
    let runningRate = rateData.RunningRate === undefined ? 0 : (parseFloat(rateData.RunningRate) * 100).toFixed(0);
    let transmissionEffectiveRate = rateData.TransmissionEffectiveRate === undefined ? 0 : (parseFloat(rateData.TransmissionEffectiveRate) * 100).toFixed(0);

    let legendData = [];
    let color = [];
    let seriesName = '';
    let seriesData = [];
    if (type === 1) {
      legendData = ['正常', '离线'];
      color = ['rgb(0, 221, 223)', 'rgb(246, 248, 251)'];
      seriesName = '实时联网率';
      seriesData = [
        { value: networkeRate, name: '正常' },
        { value: 100 - networkeRate, name: '离线' }
      ];
    } else if (type === 2) {
      legendData = ['达标', '未达标'];
      if (parseFloat(runningRate) >= RunningRate) {
        color = ['rgb(86,244,133)', 'rgb(32,99,81)'];
      } else {
        color = ['rgb(255,78,78)', 'rgb(32,99,81)'];
      }
      seriesName = '设备运转率';
      seriesData = [
        { value: runningRate, name: '达标' },
        { value: (100 - runningRate).toFixed(2), name: '未达标' }
      ];
    } else {
      legendData = ['达标', '未达标'];
      if (parseFloat(transmissionEffectiveRate) >= TransmissionEffectiveRate) {
        color = ['rgb(255, 198, 4)', 'rgb(246, 248, 251)'];//达标
      } else {
        color = ['rgb(255, 78, 78)', 'rgb(246, 248, 251)'];
      }
      seriesName = '传输有效率';
      seriesData = [
        { value: transmissionEffectiveRate, name: '达标' },
        { value: (100 - transmissionEffectiveRate).toFixed(2), name: '未达标' }
      ];
    }
    let option = {
      color: color,
      // animation: false,
      title: {
        show: false,
        text: seriesName,
        textAlign: 'center',
        x: '65',
        y: '115',
        padding: 0,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bolder',
          color: '#72A0BA',
        }
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{b}:{d}%",
        position: [10, 20]
      },

      legend: {
        orient: 'vertical',
        x: 'left',
        data: []
      },
      series: [
        {
          name: '智能质控',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          hoverAnimation: true,
          // silent: true,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: function () {
                if (type === 1) {
                  return `${networkeRate}%`;
                }
                if (type === 2) {
                  return `${runningRate}%`;
                }
                return `${transmissionEffectiveRate}%`;
              },
              textStyle: {
                fontSize: 14,
                // color: `${styles.circularText}`,
                color: '#8591a9',
                // fontWeight: 'bold'
              }
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold'
              }
            }
          },
          data: seriesData
        }
      ]
    };
    return option;
  }
  render() {
    const { currentMonth } = this.props;
    return (
      <>
        <div className={styles.title}>
          <p>运行分析</p>
        </div>
        <div className={styles.echartsContent}>
          <div className={styles.echartItem}>
            <ReactEcharts
              option={this.getOption(1)}
              style={{ height: '94px', width: '100%' }}
              theme="my_theme"
            />
            <div className={styles.echartsTitle}>实时联网率</div>
          </div>
          {/* <div className={styles.echartItem}>
              <ReactEcharts
                option={this.getOption(2)}
                style={{ height: '94px', width: '100%' }}
                theme="my_theme"
              />
              <div className={styles.echartsTitle}>{currentMonth}月设备运转率</div>
            </div> */}
          <div className={styles.echartItem}>
            <ReactEcharts
              option={this.getOption(3)}
              style={{ height: '94px', width: '100%' }}
              theme="my_theme"
            />
            <div className={styles.echartsTitle}>{currentMonth}月传输有效率</div>
          </div>
        </div>
      </>
    );
  }
}

export default OperationAnalysis;