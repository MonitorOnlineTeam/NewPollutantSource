import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva'
import styles from '../index.less';

@connect(({ qcaCheck, loading }) => ({
  zeroChartData: qcaCheck.zeroChartData,
  pollutantList: qcaCheck.pollutantList,
  tableLoading: loading.effects['qcaCheck/getZeroCheckTableData'],
}))
class ZeroCheckChart extends PureComponent {
  state = {
    pollutantList: []
  }


  componentDidMount() {
    this.matchPollutantCodeList()
  }


  componentDidUpdate(prevProps, prevState) {
    if (this.props.zeroChartData !== prevProps.zeroChartData) {
      this.setState({ currentPollutant: this.props.zeroChartData.PollutantCode })
      console.log('currentPollutant=', this.props.zeroChartData.PollutantCode)
    }
    if (this.props.pollutantCodeList !== prevProps.pollutantCodeList) {
      this.matchPollutantCodeList()
    }
  }

  matchPollutantCodeList = () => {
    let pollutantList = [];
    this.props.pollutantCodeList.map(item => {
      this.props.pollutantList.map(itm => {
        if (item === itm.PollutantCode) {
          pollutantList.push(itm)
        }
      })
    })
    this.setState({ pollutantList, currentPollutant: this.props.zeroChartData.PollutantCode })
  }

  getOption = () => {
    const { zeroChartData } = this.props;
    console.log('zeroChartData111=', zeroChartData)
    const valueMax = _.max(zeroChartData.dataList) ? _.max(zeroChartData.dataList) : 0;
    const standardMax = _.max([zeroChartData.standard.top, zeroChartData.standard.lower]) ? _.max([zeroChartData.standard.top, zeroChartData.standard.lower]) : 0
    let max = _.max([valueMin, valueMax]) + 5
    // max = max > 100 ? 100 : max;

    const valueMin = _.min(zeroChartData.dataList) ? _.min(zeroChartData.dataList) : 0;
    const standardMin = _.min([zeroChartData.standard.top, zeroChartData.standard.lower]) ? _.min([zeroChartData.standard.top, zeroChartData.standard.lower]) : 0
    let min = _.min([valueMin, standardMin]) + -5
    // min = min < -100 ? -100 : min;

    console.log('max=', max)
    console.log('min=', min)
    return {
      title: {
        text: "24小时零点漂移历史数据",
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params, ticket, callback) => {
          let param = params[0]
          let format = `${param.name}<br />${param.marker}${param.value}%`
          return format
        }
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          // magicType: {type: ['line', 'bar']},
          // restore: {},
          saveAsImage: {}
        }
      },
      grid: {
        left: '5%',
        right: '10%',
        bottom: '80px',
        top: "80px",
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: zeroChartData.timeList
      },
      yAxis: {
        name: '(%)',
        type: 'value',
        max: Math.ceil(max),
        min: Math.ceil(min)
      },
      series: [{
        name: "相对误差",
        data: zeroChartData.dataList,
        type: 'line',
        symbol: 'triangle',
        symbolSize: 20,
        lineStyle: {
          color: function (params) {
            let color;
            if (params.data > zeroChartData.standard.top || params.data < zeroChartData.standard.lower) {
              color = "#ff0000"
            } else {
              color = "#248000"
            }
            return color;
          },
          width: 2,
          type: 'dashed'
        },
        markLine: {
          silent: true,
          data: [
            {
              yAxis: zeroChartData.standard.top,
              label: {
                normal: {
                  formatter: `标准要求${zeroChartData.standard.top}%` // 基线名称
                }
              }
            },
            {
              yAxis: zeroChartData.standard.lower,
              label: {
                normal: {
                  formatter: `标准要求${zeroChartData.standard.lower}%` // 基线名称
                }
              }
            }
          ]
        },
        itemStyle: {
          borderWidth: 3,
          // borderColor: 'yellow',
          color: function (params) {
            let color;
            if (params.data > zeroChartData.standard.top || params.data < zeroChartData.standard.lower) {
              color = "#ff0000"
            } else {
              color = "#248000"
            }
            return color;
          }
        }
      }]
    };
  }

  render() {
    const { pollutantList, currentPollutant } = this.state;
    return (
      <div style={{ position: "relative" }}>
        <div className={styles.legendContainer}>
          {
            pollutantList.map(item => {
              return <div key={item.PollutantCode} className={styles.legendItem} onClick={() => {
                this.setState({
                  currentPollutant: item.PollutantCode
                })
                this.props.dispatch({
                  type: "qcaCheck/updateCheckChartData",
                  payload: {
                    type: "zero",
                    code: item.PollutantCode,
                  }
                })
              }}>
                <i className={currentPollutant === item.PollutantCode ? styles.active : ""}></i>
                {item.PollutantName}
              </div>
            })
          }

        </div>
        <ReactEcharts
          option={this.getOption()}
          style={{ height: "calc(100vh - 270px)" }}
          className="echarts-for-echarts"
          theme="my_theme"
        />
        <div className={styles.bottomLegendContainer}>
          <div className={styles.legendItem}>
            <i className={styles.sanjiao}></i>
            合格
            </div>
          <div className={styles.legendItem}>
            <i className={`${styles.sanjiao} ${styles.bhg}`}></i>
            不合格
            </div>
        </div>
      </div>
    );
  }
}

export default ZeroCheckChart;
