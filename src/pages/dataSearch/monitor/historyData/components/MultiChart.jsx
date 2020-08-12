


import React from 'react';

import { Card} from 'antd';

import { connect } from 'dva';

import moment from 'moment'

import ReactEcharts from 'echarts-for-react';


/**
 * 多图表数据组件
 * jab 2020.07.30
 */
const COLOR = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

@connect(({ loading, dataquery,historyData }) => ({
    pollutantlist: dataquery.pollutantlist,
    dataloading: loading.effects['dataquery/queryhistorydatalist'],
    exportLoading: loading.effects['dataquery/exportHistoryReport'],
    option: dataquery.chartdata,
    selectpoint: dataquery.selectpoint,
    isloading: loading.effects['dataquery/querypollutantlist'],
    columns: dataquery.columns,
    datatable: dataquery.datatable,
    total: dataquery.total,
    tablewidth: dataquery.tablewidth,
    historyparams: dataquery.historyparams,
    testData:historyData.testData
}))

class MultiChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          format:"YYYY-MM-DD",
          dataType: "Hour",
          timeList:["2020-07-06 00:00:00","2020-07-07 00:00:00","2020-07-08 00:00:00","2020-07-09 00:00:00","2020-07-10 00:00:00","2020-07-11 00:00:00","2020-07-12 00:00:00","2020-07-13 00:00:00"],
          chartList:[{"PollutantName":"AQI","PollutantCode":"AQI","DataList":["75","56","57","76","85","103","103","98"]},{"PollutantName":"O3","DataList":["157","163","163","141","130","101","106","129"]},{"PollutantName":"CO","DataList":["0.3","0.7","0.8","0.4","0.4","0.5","0.4","0.7"]},{"PollutantName":"SO2","DataList":["7","7","6","3","3","3","3","10"]},{"PollutantName":"NO2","DataList":["24","34","26","15","16","22","13","19"]},{"PollutantName":"PM10","DataList":["40","66","71","39","58","48","20","42"]},{"PollutantName":"PM2.5","DataList":["16","36","54","31","55","40","12","22"]}]
        };
    }
    static getDerivedStateFromProps(props, state) {
      // 只要当前 testData 变化，
      // 重置所有跟 testData 相关的状态。
      if (props.testData !== state.testData) {
        return {
          testData: props.testData,
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
    return (
      <>
      <p>这是多参数图表</p>
       <ReactEcharts
       option={this.getOptions()}
       lazyUpdate={true}
       style={{ height: 'calc(100vh - 400px)', width: '100%' }}
       className="echarts-for-echarts"
       theme="my_theme"
   />  
  </>
    );
  }
}

export default MultiChart;