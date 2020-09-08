import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';


class Industry extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
    window.addEventListener('resize', this.resize)
  }

  resize = () => {
    console.log("myChart=", this.myChart)
    // this.myChart.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getOption = () => {
    
    let color = ['#FF8700', '#ffc300', '#00e473', '#009DFF'];
    let chartData = [{
      name: "钢铁",
      value: 11,
      unit: '个'
    },
    {
      name: "热点",
      value: 7,
      unit: '个'
    },
    {
      name: "水泥",
      value: 22,
      unit: '个'
    },
    {
      name: "化工",
      value: 10,
      unit: '个'
    }
    ];
    let arrName = [];
    let arrValue = [];
    let sum = 0;
    let pieSeries = [],
      lineYAxis = [];

    // 数据处理
    chartData.forEach((v, i) => {
      arrName.push(v.name);
      arrValue.push(v.value);
      sum = sum + v.value;
    })

    // 图表option整理
    chartData.forEach((v, i) => {
      pieSeries.push({
        name: '行业',
        type: 'pie',
        clockWise: false,
        hoverAnimation: false,
        radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
        center: ["30%", "50%"],
        label: {
          show: false
        },
        data: [{
          value: v.value,
          name: v.name
        }, {
          value: sum - v.value,
          name: '',
          itemStyle: {
            color: "rgba(0,0,0,0)"
          }
        }]
      });
      pieSeries.push({
        name: '',
        type: 'pie',
        silent: true,
        z: 1,
        clockWise: false, //顺时加载
        hoverAnimation: false, //鼠标移入变大
        radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
        center: ["30%", "50%"],
        label: {
          show: false
        },
        data: [{
          value: 7.5,
          itemStyle: {
            color: "#E3F0FF"
          }
        }, {
          value: 2.5,
          name: '',
          itemStyle: {
            color: "rgba(0,0,0,0)"
          }
        }]
      });
      v.percent = (v.value / sum * 100).toFixed(1) + "%";
      lineYAxis.push({
        value: i,
        textStyle: {
          rich: {
            circle: {
              color: color[i],
              padding: [0, 5]
            }
          }
        }
      });
    })

    let option = {
      // backgroundColor: '#fff',
      color: color,
      grid: {
        top: '15%',
        bottom: '54%',
        left: "30%",
        containLabel: false
      },
      yAxis: [{
        type: 'category',
        inverse: true,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          formatter: function (params) {
            let item = chartData[params];
            console.log(item)
            return '{line|}{circle|•}{name|' + item.name + '}{bd||}{percent|' + item.percent + '}{value|' + item.value + '}{unit|个}'
          },
          interval: 0,
          inside: true,
          textStyle: {
            color: "#fff",
            fontSize: 14,
            rich: {
              line: {
                width: 80,
                height: 10,
                borderWidth: 1,
                backgroundColor: { image: "/33.png" },
              },
              name: {
                color: '#fff',
                fontSize: 14,
              },
              bd: {
                color: '#fff',
                padding: [0, 5],
                fontSize: 14,
              },
              percent: {
                color: '#fff',
                fontSize: 14,
              },
              value: {
                color: '#fff',
                fontSize: 16,
                fontWeight: 500,
                padding: [0, 0, 0, 20]
              },
              unit: {
                fontSize: 14
              }
            }
          },
          show: true
        },
        data: lineYAxis
      }],
      xAxis: [{
        show: false
      }],
      series: pieSeries
    };

    return option;
  }

  render() {
    return (
      <ReactEcharts
        ref={echart => { this.myChart = echart }}
        option={this.getOption()}
        style={{ height: '100%' }}
        theme="my_theme"
      />
    );
  }
}

export default Industry;