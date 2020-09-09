import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';


class AlarmCount extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getOption = () => {
    let option = {
      backgroundColor: '#00000000',
      // legend: {
      //   orient: 'vertical', // 'vertical'
      //   x: 'left', // 'center' | 'left' | {number},
      //   y: '80', // 'center' | 'bottom' | {number}
      //   padding: 10, // [5, 10, 15, 20]
      //   itemGap: 20,
      //   textStyle: {
      //     color: '#c3cad9'
      //   },
      // },
      grid: {
        left: '-10%',
        right: '4%',
        bottom: '-10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
      },
      visualMap: {
        show: false,
        min: 500,
        max: 600,
        inRange: {
          //colorLightness: [0, 1]
        }
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        left: 10,
        top: 10,
        right: 10,
        bottom: 10,
        radius: [0, '75%'],
        selectedMode: 'single',
        // selectedOffset: 10,
        clockwise: true,
        center: ['50%', '50%'],
        color: ['#43cadd', '#3893e5', '#FCC708', '#ff0000', '#03B48E'], //'#FBFE27','rgb(11,228,96)','#FE5050'
        data: [{
          value: 45,
          name: '超标报警',
        },
        {
          value: 50,
          name: '异常报警'
        },
        {
          value: 20,
          name: '备案不符',
        },
        {
          value: 25,
          name: '质控不合格'
        },
        {
          value: 25,
          name: '质控仪报警'
        }
        ].sort(function (a, b) {
          return a.value - b.value
        }),
        roseType: 'radius',
        label: {
          normal: {
            // formatter: ['{c|{b}{d}%}', '{b|{b}}'].join('\n'),
            // formatter: ['{b|{b}{d}%}', '{c|{c}万元}'].join('\n'),
            rich: {
              b: {
                color: '#d9efff',
                fontSize: 15,
                height: 40
              },
              c: {
                color: '#fff',
                fontSize: 14,
                fontWeight: 'bold',
                lineHeight: 5
              },
            },
          }
        },
        itemStyle: {
          borderWidth: '20',
          color: 'pink',
          borderColor: '#FFF',
          normal: {
            borderWidth: '10',
            borderColor: '#00000000',
            label: {
              formatter: function (params) {
                if (params.name !== '') {
                  return params.name + params.value + '次';
                } else {
                  return '';
                }
              },
            }
          },
        },
        labelLine: {
          normal: {
            backgroundColor: 'yellow',
            borderColor: 'skyblue',
            borderWidth: 10,
            lineStyle: {
              borderColor: 'skyblue',
              borderWidth: 10,
              backgroundColor: 'yellow',
            }
          },
        }
      }]
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

export default AlarmCount;