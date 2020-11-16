import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

class OperationsOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      option: {}
    };
  }

  componentDidMount() {
    this.getChartOption();
  }


  getChartOption = () => {
    if (this.myChart) {
      let option = {
        color: ["#4cadfd", "#f68700"],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['已完成', '未完成'],
          icon: 'rect',
          itemWidth: 20,//图例的宽度
          itemHeight: 10,//图例的高度
          textStyle: { //图例文字的样式
            color: '#fff',
          },
        },
        grid: {
          show: false,
          left: 0,
          right: 10,
          bottom: 30,
          top: 40,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              rotate: 0,
              fontSize: 14,
              color: '#fff'
            },
            data: ['巡检', '校准', '维修维护', '校验测试']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              rotate: 0,
              fontSize: 12,
              color: '#fff'
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: "#113d5e"
              }
            },
          }
        ],
        series: [
          {
            name: '已完成',
            type: 'bar',
            stack: 'one',
            data: [214, 83, 42, 12],
            barMaxWidth: '20%',
            itemStyle: {
              normal: {
                color: new this.myChart.echartsLib.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#4cadfd' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#4cadfd99' // 100% 处的颜色
                }], false),
                // barBorderRadius: [30, 30, 30, 30],
                shadowColor: 'rgba(0,160,221,1)',
                // shadowBlur: 4,
              }
            },
          },
          {
            name: '未完成',
            type: 'bar',
            stack: 'one',
            barMaxWidth: '20%',
            data: [120, 82, 2, 0],
            itemStyle: {
              normal: {
                color: new this.myChart.echartsLib.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#f68700' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#f687009c' // 100% 处的颜色
                }], false),
                // barBorderRadius: [30, 30, 30, 30],
                shadowColor: 'rgba(0,160,221,1)',
                // shadowBlur: 4,
              }
            },
          },
        ]
      };
      this.setState({
        option: option
      })
    }
  }

  render() {
    console.log("option=", this.state.option)
    return (
      <ReactEcharts
        ref={echart => { this.myChart = echart }}
        option={this.state.option}
        // className="echarts-for-echarts"
        theme="my_theme"
        style={{ height: "100%", marginTop: 10 }}
      // style={{ width: '100%', height: '130%' }}
      />
    );
  }
}

export default OperationsOrder;