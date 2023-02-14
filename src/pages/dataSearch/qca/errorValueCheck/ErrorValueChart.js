import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva'
import styles from '../index.less';

@connect(({ qcaCheck, loading }) => ({
  errorValueChartData: qcaCheck.errorValueChartData,
  pollutantList: qcaCheck.pollutantList,
  tableLoading: loading.effects['qcaCheck/getZeroCheckTableData'],
}))
class BlindCheckChart extends PureComponent {
  state = {
    pollutantList: []
  }


  componentDidMount() {
    this.matchPollutantCodeList()
  }


  componentDidUpdate(prevProps, prevState) {
    if (this.props.errorValueChartData !== prevProps.errorValueChartData) {
      this.setState({ currentPollutant: this.props.errorValueChartData.PollutantCode })
      console.log('currentPollutant=', this.props.errorValueChartData.PollutantCode)
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
    this.setState({ pollutantList, currentPollutant: this.props.errorValueChartData.PollutantCode })
  }

  getOption = () => {
    const { errorValueChartData } = this.props;
    const valueMax = _.max(errorValueChartData.dataList) ? _.max(errorValueChartData.dataList) : 0;
    const standardMax = _.max([errorValueChartData.standard.top, errorValueChartData.standard.lower]) ? _.max([errorValueChartData.standard.top, errorValueChartData.standard.lower]) : 0
    let max = _.max([valueMin, valueMax]) + 5
    // max = max > 100 ? 100 : max;

    const valueMin = _.min(errorValueChartData.dataList) ? _.min(errorValueChartData.dataList) : 0;
    const standardMin = _.min([errorValueChartData.standard.top, errorValueChartData.standard.lower]) ? _.min([errorValueChartData.standard.top, errorValueChartData.standard.lower]) : 0
    let min = _.min([valueMin, standardMin]) + -5
    // min = min < -100 ? -100 : min;

    return {
      title: {
        text: "示值误差核查数据历史记录",
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
        data: errorValueChartData.timeList
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
          lte: errorValueChartData.standard.top,
          color: '#248000'
        }, {
          gt: errorValueChartData.standard.lower,
          lte: 0,
          color: '#248000'
        }, {
          gt: errorValueChartData.standard.top,
          lte: Math.ceil(max),
          color: '#ff0000'
        }, {
          gt: Math.ceil(min),
          lte: errorValueChartData.standard.lower,
          color: '#ff0000'
        }],
        seriesIndex: 0
      }],
      series: [{
        name: "相对误差",
        data: errorValueChartData.dataList,
        type: 'line',
        symbol: 'triangle',
        symbolSize: 20,
        lineStyle: {
          // color: '#248000',
          width: 2,
          type: 'dashed'
        },
        markLine: {
          silent: true,
          data: [
            {
              yAxis: errorValueChartData.standard.top,
              label: {
                normal: {
                  formatter: `标准要求${errorValueChartData.standard.top}%` // 基线名称
                }
              }
            },
            {
              yAxis: errorValueChartData.standard.lower,
              label: {
                normal: {
                  formatter: `标准要求${errorValueChartData.standard.lower}%` // 基线名称
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
            if (params.data > errorValueChartData.standard.top || params.data < errorValueChartData.standard.lower) {
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
                    type: "errorValue",
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

export default BlindCheckChart;