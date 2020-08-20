import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva'
import styles from '../index.less';

@connect(({ qcaCheck, loading }) => ({
  blindChartData: qcaCheck.blindChartData,
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
    if (this.props.blindChartData !== prevProps.blindChartData) {
      this.setState({ currentPollutant: this.props.blindChartData.PollutantCode })
      console.log('currentPollutant=', this.props.blindChartData.PollutantCode)
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
    this.setState({ pollutantList, currentPollutant: this.props.blindChartData.PollutantCode })
  }

  getOption = () => {
    const { blindChartData } = this.props;
    console.log('blindChartData111=', blindChartData)
    const valueMax = _.max(blindChartData.dataList) ? _.max(blindChartData.dataList) : 0;
    const standardMax = _.max([blindChartData.standard.top, blindChartData.standard.lower]) ? _.max([blindChartData.standard.top, blindChartData.standard.lower]) : 0
    const max =  _.max([valueMin, valueMax]) + 5

    const valueMin = _.min(blindChartData.dataList) ? _.min(blindChartData.dataList) : 0;
    const standardMin = _.min([blindChartData.standard.top, blindChartData.standard.lower]) ? _.min([blindChartData.standard.top, blindChartData.standard.lower]) : 0
    const min = _.min([valueMin, standardMin]) + -5

    console.log('max=', max)
    console.log('min=', min)
    return {
      title: {
        text: "24小时零点漂移历史数据",
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
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
        data: blindChartData.timeList
      },
      yAxis: {
        type: 'value',
        max: Math.ceil(max),
        min: Math.ceil(min)
      },
      series: [{
        data: blindChartData.dataList,
        type: 'line',
        symbol: 'triangle',
        symbolSize: 20,
        lineStyle: {
          color: '#248000',
          width: 2,
          type: 'dashed'
        },
        markLine: {
          silent: true,
          data: [
            {
              yAxis: blindChartData.standard.top,
              label: {
                normal: {
                  formatter: `标准要求${blindChartData.standard.top}%` // 基线名称
                }
              }
            },
            {
              yAxis: blindChartData.standard.lower,
              label: {
                normal: {
                  formatter: `标准要求${blindChartData.standard.lower}%` // 基线名称
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
            if (params.data > blindChartData.standard.top || params.data < blindChartData.standard.lower) {
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
                    type: "blind",
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