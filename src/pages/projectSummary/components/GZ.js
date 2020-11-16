import React, { PureComponent } from 'react';
import styles from '../Home.less';
import ReactEcharts from 'echarts-for-react';

class GZ extends PureComponent {
  state = {
    option: {}
  }

  componentDidMount() {
    this.getChartOption();
  }

  getChartOption = (type) => {
    if (this.myChart) {
      let option = {
        // backgroundColor: '#232d36',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(0, 255, 233,0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(255, 255, 255,1)',
                }, {
                  offset: 1,
                  color: 'rgba(0, 255, 233,0)'
                }],
                global: false
              }
            },
          },
        },
        grid: {
          top: '15%',
          left: '12%',
          right: '5%',
          bottom: '15%',
          // containLabel: true
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            show: false,
            color: '#A582EA'
          },

          axisLabel: {
            color: '#fff',
            width: 100
          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          data: ["10.17", "10.18", "10.19", "10.20", "10.21", "10.22", "10.23", "10.24", "10.25", "10.26", "10.27", "10.28", "10.29", "10.30", "10.31", "11.01", "11.02", "11.03", "11.04", "11.05", "11.06", "11.07", "11.08", "11.09", "11.10", "11.11", "11.12", "11.13", "11.14", "11.15"],
        }],

        yAxis: [{
          type: 'value',
          min: 0,
          // max: 140,
          splitNumber: 4,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#00BFF3',
              opacity: 0.23
            }
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}%',
            show: true,
            margin: 20,
            textStyle: {
              color: '#fff',

            },
          },
          axisTick: {
            show: false,
          },
        }],
        series: [
          {
            name: '液位异常报警',
            type: 'line',
            showAllSymbol: true,
            symbol: 'none',
            // symbolSize: 6,
            lineStyle: {
              normal: {
                color: "#2CABE3",
              },
            },
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#2CABE3',
              }
            },
            itemStyle: {
              color: "#fff",
              borderColor: "#2CABE3",
              borderWidth: 2,
            },
            areaStyle: {
              normal: {
                color: new this.myChart.echartsLib.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(81,150,164,0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(81,150,164,0)'
                  }
                ], false),
              }
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.04, 0.18, 0, 0.36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
        ]
      };

      this.setState({
        option: option
      })
    }
  }

  render() {
    return (
      <ReactEcharts
        ref={echart => { this.myChart = echart }}
        option={this.state.option}
        className="echarts-for-echarts"
        theme="my_theme"
        style={{ width: '100%', height: '98%' }}
      />
    );
  }
}

export default GZ;