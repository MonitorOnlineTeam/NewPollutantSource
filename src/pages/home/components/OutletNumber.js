import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"
import styles from '../Home.less'

class OutletNumber extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      option: {}
    }
  }

  componentDidMount() {
    this.getOption();
  }

  getOption = () => {
    if (this.myChart) {
      console.log("this.myChart11-", this.myChart)
      let data = [{
        level: '异常报警',
        landArea: 20
      },
      {
        level: '超标报警',
        landArea: 30
      },
      {
        level: '备案不符',
        landArea: 11
      },
      {
        level: '质控不合格',
        landArea: 31
      },
      {
        level: '质控仪报警',
        landArea: 41
      },
      ]
      const CubeLeft = this.myChart.echartsLib.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c0 = [shape.x, shape.y]
          const c1 = [shape.x - 20, shape.y - 4]
          const c2 = [xAxisPoint[0] - 20, xAxisPoint[1] - 4]
          const c3 = [xAxisPoint[0], xAxisPoint[1]]
          ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
        }
      })
      const CubeRight = this.myChart.echartsLib.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c1 = [shape.x, shape.y]
          const c2 = [xAxisPoint[0], xAxisPoint[1]]
          const c3 = [xAxisPoint[0] + 8, xAxisPoint[1] - 4]
          const c4 = [shape.x + 8, shape.y - 4]
          ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        }
      })
      const CubeTop = this.myChart.echartsLib.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function (ctx, shape) {
          // 逆时针 角 y 负数向上  X 负数向左
          const c1 = [shape.x, shape.y]
          const c2 = [shape.x + 8, shape.y - 4]
          const c3 = [shape.x - 11, shape.y - 8]
          const c4 = [shape.x - 20, shape.y - 4]
          ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
        }
      })
      this.myChart.echartsLib.graphic.registerShape('CubeLeft', CubeLeft)
      this.myChart.echartsLib.graphic.registerShape('CubeRight', CubeRight)
      this.myChart.echartsLib.graphic.registerShape('CubeTop', CubeTop)
      let MAX = []
      let VALUE = []
      let LEV = []
      let chartData = [].concat(data)
      chartData.forEach(item => {
        VALUE.push(item.landArea)
        LEV.push(item.level)
      })
      let maxItem = [].concat(VALUE).sort((a, b) => b - a)[0]

      let SUM = 0
      for (let item of VALUE) {
        SUM += item
        MAX.push(maxItem)
      }
      const echartsLib = this.myChart.echartsLib;
      let option = {
        tooltip: {
          trigger: 'item',
          confine: false,
          position: 'top',
          textStyle: {
            fontSize: 12
          },
          // extraCssText: 'box-shadow: 0 0 20px #00C7FF inset',
          // backgroundColor: 'rgba(0,155,206,0.5)',
          backgroundColor: 'transparent',
          formatter: function (params) {
            console.log("params=", params)
            let value = data[params.dataIndex]
            return `<div class="tooltip">${params.name} ${value.landArea}</div>`
          },
          extraCssText: 'box-shadow: 0 0 20px #00C7FF inset;'
        },
        grid: {
          show: false,
          left: 0,
          right: 10,
          bottom: 20,
          top: 10,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: LEV,
          axisLine: {
            show: true,
            lineStyle: {
              color: new echartsLib.graphic.LinearGradient(0, 0, 1, 1, [{
                offset: 0,
                color: '#D2A62E'
              }, {
                offset: 1,
                color: '#C62129'
              }])
            }
          },
          // offset: 10,
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 12,
            color: '#00FFFE'
          }
        },
        yAxis: {
          show: false,
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: 'white'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 12
          },
          boundaryGap: ['20%', '20%']
        },
        series: [{
          type: 'custom',
          renderItem: function (params, api) {
            const location = api.coord([api.value(0), api.value(1)])
            return {
              type: 'group',
              children: [{
                type: 'CubeLeft',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: 'rgba(1,17,33,.5)'
                }
              }, {
                type: 'CubeRight',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: 'rgba(1,17,33,.5)'
                }
              }, {
                type: 'CubeTop',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: 'rgba(1,17,33,.5)'
                }
              }]
            }
          },
          data: MAX
        }, {
          type: 'custom',
          renderItem: (params, api) => {
            const location = api.coord([api.value(0), api.value(1)])
            return {
              type: 'group',
              children: [{
                type: 'CubeLeft',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: new echartsLib.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#1477BD'
                  }, {
                    offset: 1,
                    color: '#00FFFE'
                  }])
                }
              }, {
                type: 'CubeRight',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: new echartsLib.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#002E75' // 顶部
                  }, {
                    offset: 1,
                    color: '#00B0D0' // 底部
                  }])
                }
              }, {
                type: 'CubeTop',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: new echartsLib.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#33F7FB'
                  }, {
                    offset: 1,
                    color: '#00FFFE'
                  }])
                }
              }]
            }
          },
          data: VALUE
        }, {
          type: 'bar',
          label: {
            normal: {
              show: false,
              position: 'top',
              formatter: (e) => {
                switch (e.name) {
                  case '异常报警':
                    return VALUE[0]
                  case '超标报警':
                    return VALUE[1]
                  case '备案不符':
                    return VALUE[2]
                  case '质控不合格':
                    return VALUE[3]
                  case '质控仪报警':
                    return VALUE[4]
                }
              },
              fontSize: 10,
              color: '#fff',
              offset: [0, -5]
            }
          },
          itemStyle: {
            color: 'transparent'
          },
          data: MAX
        }]
      }
      this.setState({
        option: option
      })
    }
  }

  render() {
    return (
      <ReactEcharts
        ref={echart => { this.myChart = echart }}
        // option={this.getOption()}
        option={this.state.option}
        style={{ height: "100%" }}
        theme="my_theme"
      />
    );
  }
}

export default OutletNumber;