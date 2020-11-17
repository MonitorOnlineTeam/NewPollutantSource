import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';


class QCAQualifiedDays extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getOption = () => {
    var scale = 1;
    var echartData = [{
      value: 31,
      name: '合格30天'
    }, {
      value: 35,
      name: '合格20天-30天'
    }, {
      value: 38,
      name: '合格10天-20天'
    }, {
      value: 21,
      name: '合格0天-10天'
    }]
    var rich = {
      yellow: {
        color: "#3bc7ff",
        fontSize: 13 * scale,
        padding: [8, 0],
        align: 'center'
      },
      total: {
        color: "#A2C7F3",
        fontSize: 60 * scale,
        align: 'center'
      },
      white: {
        // color: "#a2c7f3",
        align: 'center',
        fontSize: 14 * scale,
        padding: [8, 0]
      },
      blue: {
        color: '#3bc7ff',
        fontSize: 14 * scale,
        align: 'center'
      },
      hr: {
        borderColor: '#a2c7f3',
        width: '100%',
        borderWidth: 1,
        height: 0,
      }
    }
    let option = {
      tooltip: {},
      series: [{
        name: '质控合格天数',
        type: 'pie',
        radius: ['32%', '50%'],
        // hoverAnimation: false,
        color: ['#fc962c', '#d83472', '#0F9AF8', '#2B63D5', '#2039C3', '#2ECACE', '#6F81DA'],
        label: {
          normal: {
            formatter: function (params, ticket, callback) {
              var total = 0; //考生总数量
              var percent = 0; //考生占比
              echartData.forEach(function (value, index, array) {
                total += value.value;
              });
              percent = ((params.value / total) * 100).toFixed(1);
              return '{white|' + params.name + '}\n{hr|}\n{yellow|' + params.value + '个/}{blue|' + percent + '%}';
            },
            rich: rich
          },
        },
        labelLine: {
          normal: {
            length: 20 * scale,
            length2: 0,
            lineStyle: {
              color: '#a2c7f3'
            }
          }
        },
        data: echartData
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

export default QCAQualifiedDays;