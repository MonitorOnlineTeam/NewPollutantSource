import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import styles from '../Home.less'

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
    let option = {
      color: ['#3D91F7', '#61BE67'],
      tooltip: {},
      legend: {
        show: true,
        icon: "circle",
        bottom: 0,
        center: 0,
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 21,
        orient: "horizontal",
        data: ['a', 'b'],
        textStyle: {
          fontSize: '70%',
          color: '#8C8C8C'
        },
      },

      radar: {
        // shape: 'circle',
        radius: '80%',
        triggerEvent: true,
        name: {
          textStyle: {
            color: '#fff',
            fontSize: '14',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        nameGap: '2',
        indicator: [{//[4300, 10000, 28000, 35000, 50000, 19000, 21000]
          name: '零点核查', max: 100
        },
        { name: '量程核查', max: 100 },
        { name: '盲样核查', max: 100 },
        { name: '响应时间', max: 100 },
        { name: '线性核查', max: 100 }
        ],
        splitArea: {
          areaStyle: {
            color: [
              'rgba(222,134,85, 0.1)', 'rgba(222,134,85, 0.2)',
              'rgba(222,134,85, 0.4)', 'rgba(222,134,85, 0.6)',
              'rgba(222,134,85, 0.8)', 'rgba(222,134,85, 1)'
            ].reverse()
          }
        },
        // axisLabel:{//展示刻度
        //     show: true
        // },
        axisLine: { //指向外圈文本的分隔线样式
          lineStyle: {
            color: 'rgba(0,0,0,0)'
          }
        },
        splitLine: {
          lineStyle: {
            width: 2,
            color: [
              'rgba(224,134,82, 0.1)', 'rgba(224,134,82, 0.2)',
              'rgba(224,134,82, 0.4)', 'rgba(224,134,82, 0.6)',
              'rgba(224,134,82, 0.8)', 'rgba(224,134,82, 1)'
            ].reverse()
          }
        },

      },

      series: [{
        name: '高一',
        type: 'radar',
        areaStyle: {
          normal: {
            color: 'rgba(252,211,3, 0.3)'
          }
        },
        symbolSize: 0,
        lineStyle: {
          normal: {
            color: 'rgba(252,211,3, 1)',
            width: 1
          }
        },
        data: [{
          value: [43, 90, 80, 53, 78, 89, 77],
          name: '人数',
        }]
      }, {
        name: '高三',
        type: 'radar',
        areaStyle: {
          normal: {
            color: 'rgba(0,255,0, 0.3)'
          }
        },
        symbolSize: 0,
        lineStyle: {
          normal: {
            color: 'rgba(0,255,0, 1)',
            width: 1
          }
        },
        data: [{
          value: [67, 80, 92, 94, 69, 77, 45],
          name: '合格情况',
        }
        ]
      }]
    }
    return option;
  }

  render() {
    return (
      <>
        <ReactEcharts
          ref={echart => { this.myChart = echart }}
          option={this.getOption()}
          style={{ height: '80%', marginTop: 10 }}
          theme="my_theme"
        />
        <div className={styles.QCATypeLegend}>
          <span><i style={{ backgroundColor: "#4ab90a" }}></i>合格率</span>
          <span><i style={{ backgroundColor: "#b99617" }}></i>执行率</span>
        </div>
      </>
    );
  }
}

export default Industry;