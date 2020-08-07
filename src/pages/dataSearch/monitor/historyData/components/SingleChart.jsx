


import React from 'react';

import { Card,Row,Col} from 'antd';

import { connect } from 'dva';

import moment from 'moment'


import ReactEcharts from 'echarts-for-react';

import styles from "../index.less";
import ColorBlock from './ColorBlock'
/**
 * 单图表数据组件
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
class SingleChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          compare:["同比","环比","标准"],
          format:"YYYY-MM-DD",
          dataType: "Hour",
          timeList:["2020-07-06 00:00:00","2020-07-07 00:00:00","2020-07-08 00:00:00","2020-07-09 00:00:00","2020-07-10 00:00:00","2020-07-11 00:00:00","2020-07-12 00:00:00","2020-07-13 00:00:00"],
          chartList:[{"PollutantName":"同比","DataList":["24","34","26","15","16","22","13","19"]},{"PollutantName":"环比","DataList":["40","66","71","39","58","48","20","42"]},{"PollutantName":"标准","DataList":["10","12","23","77","99","58","70","52"]}],
          chartListss:[{"PollutantName":"AQI","PollutantCode":"AQI","DataList":["75","56","57","76","85","103","103","98"]},{"PollutantName":"O3","DataList":["157","163","163","141","130","101","106","129"]},{"PollutantName":"CO","DataList":["0.3","0.7","0.8","0.4","0.4","0.5","0.4","0.7"]}],
          selectedIndex:0,
          tcompare: false,
          hcompare:false,
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
    const { format, dataType,chartList,timeList,tcompare,hcompare} = this.state;
    const legendData = ['同比', '环比', '标准'];

    // series
    const series = chartList.map((item, index) => {
      return {
        name: item.PollutantName,
        type: 'line',
        data: item.DataList,
        // markPoint:{  
        //   　　data:[
        //   　　　　{type:'max',name:'最大值'},
        //   　　　　{type:'min',name:'最小值'}
        //   　　]
        //   },
        //   markLine:{
        //   　　data:[
        //   　　　　{type:'average',name:'平均值'},
        //           {type:'max',name:'最大值', lineStyle:{ type: 'solid',color:"blue"}}
        //   　　]
        //   }
      }
    })
    
    const yAxis = {
        type: 'value',
        name: "监测值",
        axisLine: {
          lineStyle: {
            color: COLOR[1],
            width: 2
          }
        },
        splitLine: {
          show: false
        }
      }
    const appendText = dataType === "Hour" ? "时" : "";
    if (yAxis) {
      // alert(111)
      return {
        grid: {x: 50, y: 50,  x2: 50,  y2: 50  },
        toolbox: {
          feature: {
            saveAsImage: {},
            dataView: {}
          }
        },
        tooltip: {
          // trigger: 'item',
          trigger: 'axis',
          // axisPointer: {
          //   type: 'cross',
          //   animation: false,
          // },
          // formatter: function (params, ticket, callback) {
          //   let format = `${params.name}: `
          //   if (params.seriesName === "风向") {
          //     let dirLevel = getDirLevel(params.value);
          //     format += `<br />${params.marker}${params.seriesName}: ${params.value} (${dirLevel})`
          //   } else {
          //     format += `<br />${params.marker}${params.seriesName}: ${params.value}`
          //   }
          //   return format;
          // }
        },
        legend: { // 图例 标题样式修改,lenged 对象里的修改
          data: legendData,
          // selectedMode:"single",
          // icon:"roundRect",
          bottom: 0,
          selected: { '同比': false, '环比': false }
          // y: 'bottom', // 'center' | 'bottom' |
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
        yAxis: [yAxis],
        series: [...series],
      };
    }
    
    return {}
  }
  onChartout () {

  this.echartsReact.props.option.series = [...series]

  //  this.echartsReact.getEchartsInstance().clear();
  this.echartsReact.getEchartsInstance().setOption(this.echartsReact.props.option) // 重新渲染
 
}
onChartLegendselectchanged=(e)=>{ 

  this.echartsReact.props.option.legend.selected[e.name] = !this.echartsReact.props.option.legend.selected[e.name];
  this.echartsReact.getEchartsInstance().setOption(this.echartsReact.props.option) // 重新渲染
}
pollutantSelect=(index,item)=>{ //自定义图例点击事件
 
   const {chartListss} = this.state;
   const selectData =[];
    chartListss.map(items=>{
      if(items.PollutantName == item.PollutantName ){
        selectData.push(items)      
      }
   })
  //  this.state.chartList.length > 3? this.state.chartList.splice(this.state.chartList.length-1,1) : null;
  //  this.setState({chartList:[...this.state.chartList, ...selectData]})
  //  this.getOptions()

   const total = [...this.state.chartList, ...selectData]
   const series = total.map((item, index) => {
    return {
      name: item.PollutantName,
      type: 'line',
      data: item.DataList
    }
  })
  this.echartsReact.props.option.series = [...series]
  this.echartsReact.getEchartsInstance().setOption(this.echartsReact.props.option) // 重新渲染
}
 


componentDidMount(){
}
  render() {

    let onEvents = {
      'legendselectchanged': this.onChartLegendselectchanged.bind(this)
    }
    return (
        <>
            <p>这是单参数图表</p>
            <ColorBlock pollutantSelect = { this.pollutantSelect.bind(this) }/>
            <ReactEcharts
             option={this.getOptions()}
             onEvents={onEvents}
             lazyUpdate={true}
             style={{ height: 'calc(100vh - 400px)', width: '100%'}}
             className="echarts-for-echarts"
             theme="my_theme"
             ref={(e) => { this.echartsReact = e }}
         />  

        </>
    );
  }
}

export default SingleChart;