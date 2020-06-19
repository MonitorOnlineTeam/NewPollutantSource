import React, { PureComponent } from 'react'
import styles from '../index.less'
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva'
import DrillDownRunModal from "./DrillDownRunModal"

@connect(({ loading, newHome }) => ({
  runAndAnalysisData: newHome.runAndAnalysisData,
}))
class RunAndAnalysis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: "newHome/getRunAndAnalysisData",
      payload: {

      }
    })
  }

  // 超标率下钻
  getTrippingOverDataList = (title) => {
    this.setState({ title })
    this.props.dispatch({
      type: "newHome/getTrippingOverDataList",
    })
  }

  // 图表点击
  onEchartsClick = (title, servicesName) => {
    this.setState({ title, servicesName })
    this.props.dispatch({
      type: "newHome/getEChartsDrillDown",
      payload: {
        servicesName
      }
    })
  }

  getOption = (type) => {
    // const { rateData } = this.props.rateStatisticsByEnt;
    // if (!rateData)
    //   return;
    // let networkeRate = rateData.NetworkeRate === undefined ? 0 : (parseFloat(rateData.NetworkeRate) * 100).toFixed(0);
    // let runningRate = rateData.RunningRate === undefined ? 0 : (parseFloat(rateData.RunningRate) * 100).toFixed(0);
    // let transmissionEffectiveRate = rateData.TransmissionEffectiveRate === undefined ? 0 : (parseFloat(rateData.TransmissionEffectiveRate) * 100).toFixed(0);
    const { runAndAnalysisData: { transmissionEfficiencyRate, overDataRate, operationRate, exceptionRate } } = this.props;
    let AccuracyRate = 100;
    let color = [];
    let seriesName = '';
    let seriesData = [];
    if (type === 1) {
      color = ["#0edaad", "#85edb4"];
      seriesName = '有效传输率';
      seriesData = [
        { value: transmissionEfficiencyRate, name: '正常' },
        { value: 100 - transmissionEfficiencyRate, name: '离线' }
      ];
    } else if (type === 2) {
      color = ["#fe6d6b", "#fdb7b5"];
      seriesName = '传输准确率';
      seriesData = [
        { value: AccuracyRate, name: '达标' },
        { value: 100 - AccuracyRate, name: '未达标' }
      ];
    } else if (type === 3) {
      color = ['#f6b41f', '#fad98d'];
      seriesName = '运转率';
      seriesData = [
        { value: operationRate, name: '达标' },
        { value: 100 - operationRate, name: '未达标' }
      ];
    } else {
      color = ['#67a2ef', '#b2d1f6'];
      seriesName = '故障率';
      seriesData = [
        { value: exceptionRate, name: '达标' },
        { value: 100 - exceptionRate, name: '未达标' }
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
      // tooltip: {
      //   show: true,
      //   trigger: 'item',
      //   formatter: "{b}:{d}%",
      //   position: [10, 20]
      // },

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
                  return `${transmissionEfficiencyRate}%`;
                }
                if (type === 2) {
                  return `${AccuracyRate}%`;
                }
                if (type === 3) {
                  return `${operationRate}%`;
                }
                return `${exceptionRate}%`;
              },
              textStyle: {
                fontSize: 14,
                color: '#333',
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
    console.log("option=", option)
    return option;
  }

  modelOption = () => {
    const { seriesData, xData } = this.props;
    return {
      color: ['#3398DB'],
      legend: {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '（%）',
          position: 'left',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        }
      ],
      series: [
        {
          name: this.props.title,
          type: 'bar',
          barMaxWidth: "60px",
          barWidth: '40%',
          data: seriesData
        }
      ]
    };

  }


  render() {
    const { runAndAnalysisData } = this.props;
    const { title, servicesName } = this.state;
    return (
      <div className={styles["group-item"]}>
        <div className={styles["item-title"]}>
          运行分析
            </div>
        <div className={styles["item-content"]}>
          <div className={styles["over-rate"]} onClick={() => this.getTrippingOverDataList("超标率")}>
            <p>超标率</p>
            <div className={styles.bg} style={{ width: `${runAndAnalysisData.overDataRate}%` }}>
            </div>
            <p className={styles.value}>{runAndAnalysisData.overDataRate} <span>%</span></p>
          </div>
          <div className={styles.pieContent}>
            <div className={styles.pieItem}>
              <ReactEcharts
                option={this.getOption(1)}
                onEvents={{
                  click: (event) => {
                    // 传输有效率下钻
                    this.onEchartsClick("传输有效率", "getTransmissionEfficiencyRateDrillDown")
                  }
                }}
                style={{ height: '110px', width: '100%' }}
                theme="my_theme"
              />
              <div className={styles.echartsTitle}>传输有效率</div>
            </div>
            <div className={styles.pieItem}>
              <ReactEcharts
                option={this.getOption(2)}
                // onEvents={{
                //   click: (event) => {
                //     // 传输准确率下钻
                //     this.onEchartsClick("传输准确率", "getTransmissionEfficiencyRateDrillDown")
                //   }
                // }}
                style={{ height: '110px', width: '100%' }}
                theme="my_theme"
              />
              <div className={styles.echartsTitle}>传输准确率</div>
            </div>
            <div className={styles.pieItem}>
              <ReactEcharts
                option={this.getOption(3)}
                onEvents={{
                  click: (event) => {
                    // 运转率下钻
                    this.onEchartsClick("运转率", "getTrippingOperationRateRate")
                  }
                }}
                style={{ height: '110px', width: '100%' }}
                theme="my_theme"
              />
              <div className={styles.echartsTitle}>运转率</div>
            </div>
            <div className={styles.pieItem}>
              <ReactEcharts
                option={this.getOption(4)}
                onEvents={{
                  click: (event) => {
                    // 故障率下钻
                    this.onEchartsClick("故障率", "getTrippingGetFailureRate")
                  }
                }}
                style={{ height: '110px', width: '100%' }}
                theme="my_theme"
              />
              <div className={styles.echartsTitle}>故障率</div>
            </div>
          </div>
        </div>
        <DrillDownRunModal title={this.state.title} chartClick={() => {
          title === "超标率" ? this.getTrippingOverDataList(title) : this.onEchartsClick(title, servicesName)
        }} />
      </div>
    );
  }
}

export default RunAndAnalysis;