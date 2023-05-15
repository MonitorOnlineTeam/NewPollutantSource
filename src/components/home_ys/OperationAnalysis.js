import React, { Component } from 'react';
import styles from '@/pages/home_ys/index.less';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import config from '@/config';
const { RunningRate, TransmissionEffectiveRate } = config;

@connect(({ loading, home }) => ({
  rateStatisticsByEntLoading: loading.effects['home/getRateStatisticsByEnt'],
  rateStatisticsByEnt: home.rateStatisticsByEnt,
  theme: home.theme,
}))
class OperationAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.getData();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.DGIMN !== nextProps.DGIMN || this.props.entCode !== nextProps.entCode) {
      this.getData(nextProps.entCode, nextProps.DGIMN);
    }

    if (this.props.theme !== nextProps.theme) {
      debugger;
      if (this.myChart) {
        let echarts_instance = this.myChart.getEchartsInstance();
        echarts_instance.dispose();
        debugger;
        echarts_instance.setOption(this.getOption);
      }
    }
  }
  getData = (entCode, DGIMN) => {
    const { dispatch } = this.props;
    // 获取智能质控数据
    dispatch({
      type: 'home/getRateStatisticsByEnt',
      payload: {
        entCode,
        DGIMN,
      },
    });
  };

  // 智能质控
  getOption = type => {
    const { rateData } = this.props.rateStatisticsByEnt;
    if (!rateData) return;
    let networkeRate =
      rateData.NetworkeRate === undefined
        ? 0
        : (parseFloat(rateData.NetworkeRate) * 100).toFixed(0);
    let runningRate =
      rateData.RunningRate === undefined ? 0 : (parseFloat(rateData.RunningRate) * 100).toFixed(0);
    let transmissionEffectiveRate =
      rateData.TransmissionEffectiveRate === undefined
        ? 0
        : (parseFloat(rateData.TransmissionEffectiveRate) * 100).toFixed(0);

    let legendData = [];
    let color = [];
    let seriesName = '';
    let seriesData = [];
    if (type === 1) {
      legendData = ['正常', '离线'];
      color = ['#282c40'];
      seriesName = '实时联网率';
      seriesData = [
        {
          value: networkeRate,
          name: '正常',
          itemStyle: {
            normal: {
              color: {
                // 完成的圆环的颜色
                colorStops: [
                  {
                    offset: 0,
                    color: '#02d6fc', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#367bec', // 100% 处的颜色
                  },
                ],
              },
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
            },
          },
        },
        { value: 100 - networkeRate, name: '离线' },
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
        {
          value: runningRate,
          name: '达标',
          itemStyle: {
            normal: {
              color: {
                // 完成的圆环的颜色
                colorStops: [
                  {
                    offset: 0,
                    color: '#f4a545', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#dac534', // 100% 处的颜色
                  },
                ],
              },
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
            },
          },
        },
        { value: (100 - runningRate).toFixed(2), name: '未达标' },
      ];
    } else {
      legendData = ['达标', '未达标'];
      if (parseFloat(transmissionEffectiveRate) >= TransmissionEffectiveRate) {
        color = ['rgb(86,244,133)', 'rgb(32,99,81)'];
      } else {
        color = ['rgb(255,78,78)', 'rgb(32,99,81)'];
      }
      seriesName = '传输有效率';
      seriesData = [
        {
          value: transmissionEffectiveRate,
          name: '达标',
          itemStyle: {
            normal: {
              color: {
                // 完成的圆环的颜色
                colorStops: [
                  {
                    offset: 0,
                    color: '#f4a545', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#dac534', // 100% 处的颜色
                  },
                ],
              },
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
            },
          },
        },
        { value: (100 - transmissionEffectiveRate).toFixed(2), name: '未达标' },
      ];
    }

    let datas = {
      value: 78,
      company: '%',
      ringColor: [
        {
          offset: 0,
          color: '#02d6fc', // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#367bec', // 100% 处的颜色
        },
      ],
    };

    let option = {
      // color: color,
      // color: ['#4b4b4e'],
      color: this.props.theme === 'dark' ? ['#4b4b4e'] : ['rgb(233 233 233)'],
      // animation: false,
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: '{b}:{d}%',
        position: [10, 20],
      },

      legend: {
        orient: 'vertical',
        x: 'left',
        data: [],
      },
      series: [
        {
          name: '智能质控',
          type: 'pie',
          radius: ['66%', '76%'],
          avoidLabelOverlap: false,
          hoverAnimation: true,
          // silent: true,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: function() {
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
                color: this.props.theme === 'dark' ? '#fff' : '#000',
              },
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold',
              },
            },
          },
          data: seriesData,
        },
      ],
    };
    return option;
  };
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
              ref={echart => {
                this.myChart = echart;
              }}
              option={this.getOption(1)}
              lazyUpdate={true}
              style={{ height: '94px', width: '100%' }}
              // theme={this.props.theme === 'dark' ? 'dark' : 'default'}
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
