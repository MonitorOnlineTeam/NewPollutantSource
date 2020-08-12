


import React from 'react';

import { Card,Empty } from 'antd';

import { connect } from 'dva';

import moment from 'moment'

import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'

/**
 * 多图表数据组件
 * jab 2020.07.30
 */
const COLOR = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

@connect(({ loading, historyData }) => ({
  isloading: loading.effects['historyData/getAllChatDataList'],
  timeList:historyData.timeList,
  chartList:historyData.chartList
}))

class MultiChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          format:"YYYY-MM-DD",
          dataType: "Hour",
          timeList:[],
          chartList:[]
        };
    }
    static getDerivedStateFromProps(props, state) {
      if (props.timeList !== state.timeList) {

        const chartLists = [];
        props.chartList.map(item=>{
          chartLists.push({ PollutantName:item.PollutantName,PollutantCode:item.PollutantCode,DataList:item.DataList })
       })
   
      return {
        timeList: props.timeList,
        chartList: chartLists,
      };
    
    }
    return null;
    }

    // 图表Option
  getOptions = () => {
    // const { siteParamsData: { timeList, tableList, chartList } } = this.props;
    const { format, dataType,chartList,timeList} = this.state;
    const legendData = chartList.map(item => item.PollutantName);

    // series
    const series = chartList.map((item, index) => {
      let otherProps = {}
      if (index > 0) {
        otherProps.yAxisIndex = index
      }
      return {
        name: item.PollutantName,
        type: 'line',
        animation: false,
        data: item.DataList,
        ...otherProps
      }
    })
    const yAxis = chartList.map((item, index) => {
      let otherProps = {}
      if (index === 1) {
        otherProps = {
          type: 'value',
          axisLine: { // Y轴线
            // onZero: false,    //核心代码,让第二个Y轴去对面
            lineStyle: {
              color: COLOR[1]
            }
          },
          nameLocation: 'end',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
        }
      } else if (index === 2) {
        otherProps = {
          type: 'value',
          nameLocation: 'end',
          position: "left",  //多个Y轴使用
          offset: 60,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
        }
      } else if (index === 3) {
        otherProps = {
          type: 'value',
          nameLocation: 'end',
          position: "right",  //多个Y轴使用
          offset: 60,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
        }
      } else if (index > 3 && index % 2 === 0) {
        otherProps = {
          type: 'value',
          nameLocation: 'end',
          position: "left",  //多个Y轴使用
          offset: (index - 3) * -50,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
        }
      } else if (index > 3 && index % 2 !== 0) {
        otherProps = {
          type: 'value',
          nameLocation: 'end',
          position: "right",  //多个Y轴使用
          offset: (index - 4) * -50,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
        }
      }

      return {
        type: 'value',
        name: item.PollutantName,
        axisLine: {
          lineStyle: {
            color: COLOR[index],
            width: 2
          }
        },
        splitLine: {
          show: false
        },
        ...otherProps
      }
    })
    const appendText = dataType === "Hour" ? "时" : "";

    if (yAxis.length) {
      // alert(111)
      return {
        grid: {x: 90, y: 60,  x2: 90,  y2: 20,  },
        toolbox: {
          feature: {
            saveAsImage: {},
            dataView: {}
          }
        },
        tooltip: {
          trigger: 'item',
          // trigger: 'axis',
          // axisPointer: {
          //   type: 'cross',
          //   animation: false,
          // },
          formatter: function (params, ticket, callback) {
            let format = `${params.name}: `
            if (params.seriesName === "风向") {
              let dirLevel = getDirLevel(params.value);
              format += `<br />${params.marker}${params.seriesName}: ${params.value} (${dirLevel})`
            } else {
              format += `<br />${params.marker}${params.seriesName}: ${params.value}`
            }
            return format;
          }
        },
        legend: { // 图例 标题样式修改,lenged 对象里的修改
          data: legendData,
          icon:"roundRect",
          // padding: [140, 40, 50, 0],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        },
        xAxis: [
          {
            name: "时间",
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: false },
            data: timeList.map(item => moment(item).format(format) + appendText),
            splitLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
          }
        ],
        yAxis: [...yAxis],
        series: [...series]
      };
    }
    return {}
  }
  render() {
    const { isloading,chartList} = this.props;
 
    return (
      <>
                   { isloading ?
                 <PageLoading />:
                 <div>
                 {
                  chartList.length>0 ?        
       <ReactEcharts
       option={this.getOptions()}
       lazyUpdate={true}
       style={{ height: 'calc(100vh - 400px)', width: '100%' }}
       className="echarts-for-echarts"
       theme="my_theme"
   />  : <div style={{ textAlign: 'center' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
                 }
                 </div>
                   }
  </>
    );
  }
}

export default MultiChart;