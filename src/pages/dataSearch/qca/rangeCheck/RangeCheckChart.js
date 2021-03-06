import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva'
import styles from '../index.less';

@connect(({ qcaCheck, loading }) => ({
  rangeChartData: qcaCheck.rangeChartData,
  pollutantList: qcaCheck.pollutantList,
  tableLoading: loading.effects['qcaCheck/getZeroCheckTableData'],
}))
class RangeCheckChart extends PureComponent {
  state = {
    pollutantList: []
  }


  componentDidMount() {
    this.matchPollutantCodeList()
  }


  componentDidUpdate(prevProps, prevState) {
    if (this.props.rangeChartData !== prevProps.rangeChartData) {
      this.setState({ currentPollutant: this.props.rangeChartData.PollutantCode })
      console.log('currentPollutant=', this.props.rangeChartData.PollutantCode)
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
    this.setState({ pollutantList, currentPollutant: this.props.rangeChartData.PollutantCode })
  }

  getOption = () => {
    const { rangeChartData } = this.props;
    console.log('rangeChartData111=', rangeChartData)
    const valueMax = _.max(rangeChartData.dataList) ? _.max(rangeChartData.dataList) : 0;
    const standardMax = _.max([rangeChartData.standard.top, rangeChartData.standard.lower]) ? _.max([rangeChartData.standard.top, rangeChartData.standard.lower]) : 0
    let max = _.max([valueMin, valueMax]) + 5;
    // max = max > 100 ? 100 : max;

    const valueMin = _.min(rangeChartData.dataList) ? _.min(rangeChartData.dataList) : 0;
    const standardMin = _.min([rangeChartData.standard.top, rangeChartData.standard.lower]) ? _.min([rangeChartData.standard.top, rangeChartData.standard.lower]) : 0
    let min = _.min([valueMin, standardMin]) + -5
    // min = min < -100 ? -100 : min;



    console.log('max=', max)
    console.log('min=', min)
    return {
      title: {
        text: "24小时量程漂移图表",
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
        data: rangeChartData.timeList
      },
      yAxis: {
        name: '(%)',
        type: 'value',
        max: Math.ceil(max),
        min: Math.ceil(min)
      },
      visualMap: [{
        show: false,
        pieces: [{
          gt: 0,
          lte: rangeChartData.standard.top,
          color: '#248000'
        }, {
          gt: rangeChartData.standard.lower,
          lte: 0,
          color: '#248000'
        }, {
          gt: rangeChartData.standard.top,
          lte: Math.ceil(max),
          color: '#ff0000'
        }, {
          gt: Math.ceil(min),
          lte: rangeChartData.standard.lower,
          color: '#ff0000'
        }],
        seriesIndex: 0
      }],
      series: [{
        name: "相对误差",
        data: rangeChartData.dataList,
        type: 'line',
        symbol: 'triangle',
        symbolSize: 20,
        lineStyle: {
          // color: {
          //   type: 'linear',
          //   x: 0,
          //   y: 0,
          //   x2: 0,
          //   y2: 1,
          //   colorStops: [{
          //     offset: 0,
          //     color: '#248000'
          //   }, {
          //     offset: 1,
          //     color: '#ff0000'
          //   }],
          //   globalCoord: false // 缺省为 false
          // },
          width: 2,
          type: 'dashed'
        },
        markLine: {
          silent: true,
          data: [
            {
              yAxis: rangeChartData.standard.top,
              label: {
                normal: {
                  formatter: `标准要求${rangeChartData.standard.top}%` // 基线名称
                }
              }
            },
            {
              yAxis: rangeChartData.standard.lower,
              label: {
                normal: {
                  formatter: `标准要求${rangeChartData.standard.lower}%` // 基线名称
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
            if (params.data > rangeChartData.standard.top || params.data < rangeChartData.standard.lower) {
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
                    type: "range",
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

export default RangeCheckChart;