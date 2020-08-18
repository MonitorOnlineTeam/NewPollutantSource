


import React from 'react';

import { Card,Row,Col,Empty} from 'antd';

import { connect } from 'dva';

import moment from 'moment'

import PageLoading from '@/components/PageLoading'
import ReactEcharts from 'echarts-for-react';

import styles from "../index.less";
import ColorBlock from './ColorBlock'
import { ConsoleSqlOutlined } from '@ant-design/icons';
/**
 * 单图表数据组件
 * jab 2020.07.30
 */

// import { green } from '@ant-design/colors';
const COLOR = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

@connect(({ loading, historyData }) => ({
    isloading: loading.effects['historyData/getAllChatDataList'],
    timeList:historyData.timeList,
    chartList:historyData.chartList,
    chartparams:historyData.chartparams
}))
class SingleChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          format:"YYYY-MM-DD HH",
          timeList:[],
          totalList:[{"name":"同比","DataList":[]},{"name":"环比","DataList":[]},{"name":"标准","DataList":[]}],
          chartList:[],
          monthChartList:[],
          yearChartList:[],
          selectedIndex:0,
          tcompare: false,
          hcompare:false,
          selectItem:'',
          alreadySelect:[]
        };
    }
    static getDerivedStateFromProps(props, state) {
      if (props.timeList !== state.timeList) {

          const chartLists = [],monthChartList=[],yearChartList=[],alreadySelect=[];
          props.chartList.map(item=>{
            chartLists.push({ PollutantName:item.PollutantName,PollutantCode:item.PollutantCode,DataList:item.DataList })
            monthChartList.push({ PollutantName:item.PollutantName,PollutantCode:item.PollutantCode,DataList:item.LastMonData })
            yearChartList.push({ PollutantName:item.PollutantName,PollutantCode:item.PollutantCode,DataList:item.LastYearData })
            alreadySelect.push({ PollutantName:item.PollutantName,PollutantCode:item.PollutantCode })
         })
         props.dispatch({type: 'historyData/updateState', payload: { alreadySelect } }); 
         return {
          timeList: props.timeList,
          chartList: chartLists,
          monthChartList:monthChartList
        };
      
      }
      return null;
    }

 
  // 图表Option
  getOptions = () => {
    // const { siteParamsData: { timeList, tableList, chartList } } = this.props;
    const { dataType,totalList,timeList} = this.state;

    const { chartparams : {DataType }} = this.props;
  
    const yName = "监测值";
    const legendData = ['同比', '环比', '标准'];
    let _this = this;
    let  formatDate = "YYYY-MM-DD HH";
    // series
    const series = totalList.map((item, index) => {
      
      return {
        name: item.name,
        type: 'line',
        data: item.DataList,
        markPoint: item.name == "标准"? {  data:[{type:'min',name:'最小值'},{type:'max',name:'最大值'}　]  } : null,
        markLine: item.name == "标准"? {data: [ {yAxis: 145 ,name:'标准值',lineStyle:{type:"solid",color:"red" }} ,{type:'average',name:'平均值' }  ]} : null
        }
    })
    const yAxis = {
        type: 'value',
        name: yName,
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
      let appendText = "";
      if(DataType === "hour"){
        appendText = "时"
        formatDate  = 'YYYY-MM-DD HH'
       
      }else {
        appendText = ""
        formatDate  =  'YYYY-MM-DD';
      }   
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
          trigger: 'item',
          // trigger: 'axis',
          formatter: function (params, ticket, callback) {
            let formats = `${params.marker} `
            if (params.seriesName === "同比") {
              formats += `${moment(params.name.replace(/时/, "")).add(-1, 'y').format(formatDate) + appendText}: ${params.value}`
            } else if(params.seriesName === "环比") {
              formats += `${moment(params.name.replace(/时/, "")).add(-1, 'month').format(formatDate) + appendText}: ${params.value}`
            }else{
              formats += `${params.name}: ${params.value}`
            }
            return formats;
          }
        },
        legend: { // 图例 标题样式修改,lenged 对象里的修改
          data: legendData,
          bottom: 0,
          selected: { '标准':true, '同比': false, '环比': false }
        },
        xAxis: [
          {
            name: "时间",
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: false },
            data: timeList.map(item => moment(item).format(formats) + appendText),
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

onChartLegendselectchanged=(e)=>{ 
  if(e.name != '标准'){
    this.echartsReact.props.option.legend.selected[e.name] = !this.echartsReact.props.option.legend.selected[e.name];
    // const {monthChartList,yearChartList,selectItem} = this.state;
    // if(e.name == "同比"){
    //   const selectData =[];
    //   yearChartList.map(items=>{
    //     if(items.PollutantName == this.selectItem ){
    //       selectData.push(items)  
    //     }
    //  })
    //  const total = [ ...selectData]
    //  const series = total.map((item, index) => {
    //   return {  name: e.name, type: 'line', data: item.DataList }
    // })
    // this.echartsReact.props.option.series = [this.echartsReact.props.option.series,...series]
   
    // }
    // if(e.name == "环比"){
    //   const selectData =[];
    //   monthChartList.map(items=>{
    //     if(items.PollutantName == this.selectItem ){
    //       selectData.push(items)  
    //     }
    //  })
    //  const total = [ ...selectData]
    //  const series = total.map((item, index) => {
    //   return {  name: e.name, type: 'line', data: item.DataList }
    // })
    // this.echartsReact.props.option.series = [this.echartsReact.props.option.series,...series]
    // }
    // this.echartsReact.getEchartsInstance().setOption(this.echartsReact.props.option) // 重新渲染

  }else{
    this.echartsReact.props.option.legend.selected[e.name] = true;
    this.echartsReact.getEchartsInstance().setOption(this.echartsReact.props.option) // 重新渲染
  }

}
pollutantSelect=(selectedIndex,item)=>{ //自定义图例点击事件
   const {chartList,monthChartList,yearChartList,selectItem} = this.state;
   let  selectData = [],selecMonthtData = [],yearChartData=[];
   let _this = this;
    chartList.map(items=>{
      if(items.PollutantCode == item.PollutantCode ){
        selectData = items.DataList;
        this.echartsReact.props.option.yAxis[0].name =  `${yName}(${item.PollutantCode})`;
      // _this.setState({selectItem:item}) //记录选中的值    
      }
   })
   monthChartList.map(items=>{
    if(items.PollutantCode == item.PollutantCode ){
      selecMonthtData = items.DataList;
    }
   })
   yearChartList.map(items=>{
    if(items.PollutantCode == item.PollutantCode ){
      yearChartData = items.DataList; 
    }
   })
  this.echartsReact.props.option.series.map((item,index)=>{
      if(item.name == "标准"){
        this.echartsReact.props.option.series[index].data = selectData;
      }
      if(item.name == "同比"){
        this.echartsReact.props.option.series[index].data = yearChartData;
      }
      if(item.name == "环比"){
        this.echartsReact.props.option.series[index].data = selecMonthtData;
      }
  })
  this.echartsReact.getEchartsInstance().setOption(this.echartsReact.props.option) // 重新渲染

}
 


componentDidMount(){
  const {chartList,selectedIndex} = this.state;
  chartList.length>0 ? this.pollutantSelect(selectedIndex,chartList[0]) : null; //默认显示标准
}
static getDerivedStateFromProps(props, state) {
     
  // 只要当前 tableDatas 变化，
  // 重置所有跟 tableDatas 相关的状态。
  // if (props.tableDatas !== state.tableDatas) {
  //   return {
  //     tableDatas: props.tableDatas,
  //     columns: props.columns,
  //     tableloading:props.tableloading,
  //     // summary:props.summary
  //   };
  // }
  // return null;

}
  render() {

    let onEvents = {
      'legendselectchanged': this.onChartLegendselectchanged.bind(this)
    }
    const {  chartList , isloading ,timeList} = this.props;
    return (
        <> 
               { isloading ?
                 <PageLoading />: 
                  <div>
                  
                  {
                  chartList.length > 0 && timeList.length >0 ? 
                  <div>
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
             </div>
             : 
              <div style={{ textAlign: 'center' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div> 
                } 
              </div> 
                
              }
        
        </>
    );
  }
}

export default SingleChart;