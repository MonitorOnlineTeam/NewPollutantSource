


import React from 'react';

import { Card,Row,Col,Empty} from 'antd';

import { connect } from 'dva';

import moment from 'moment'

import PageLoading from '@/components/PageLoading'
import ReactEcharts from 'echarts-for-react';

import styles from "../index.less";
import ColorBlock from './ColorBlock'
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
/**
 * 单图表数据组件
 * jab 2020.07.30
 */
const COLOR = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
let yName = "监测值";
@connect(({ loading, historyData }) => ({ //这里面任何一个数据发生变化  页面就会刷新
    isloading: loading.effects['historyData/getAllChatDataList'],
    timeList:historyData.timeList,
    chartList:historyData.chartList,
    // chartparams:historyData.chartparams,
    title:historyData.title,
    singFlag:historyData.singFlag
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
            chartLists.push({ PollutantName:item.PollutantName,PollutantCode:item.PollutantCode,DataList:item.DataList, Unit:item.Unit,StandardValue:item.StandardValue })
            monthChartList.push({ PollutantName:item.PollutantName,PollutantCode:item.PollutantCode,DataList:item.LastMonData,Unit:item.Unit,StandardValue:item.StandardValue })
            yearChartList.push({ PollutantName:item.PollutantName,PollutantCode:item.PollutantCode,DataList:item.LastYearData, Unit:item.Unit,StandardValue:item.StandardValue })
            alreadySelect.push({ PollutantName:item.PollutantName,PollutantCode:item.PollutantCode, Unit:item.Unit,StandardValue:item.StandardValue })
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
    const { totalList,timeList} = this.state;
  
    const { title} = this.props;
    const DataType = sessionStorage.getItem("dataType");
    const legendData = ['同比', '环比', '标准'];
    let _this = this;
    let  formatDate = "YYYY-MM-DD HH";
    // series
    const series = totalList.map((item, index) => {
      
      return {
        name: item.name,
        type: 'line',
        data: item.DataList,
        itemStyle:item.name == "标准"? { normal: {lineStyle:{color:'#1890ff'} }  } : null,
        markPoint: item.name == "标准"? {  data:[{type:'min',name:'最小值',itemStyle:{color:'#1890ff' } },{type:'max',name:'最大值',itemStyle:{color:'#1890ff'}  }　],silent:true  } : null,
        markLine: item.name == "标准"? {data: [ {type:'average',name:'平均值',lineStyle:{color:'#1890ff'}}  ]} : null
        }
    })
    const yAxis = {
        type: 'value',
        name: yName,
        axisLine: {
          lineStyle: {
            color: COLOR[1],
            width: 2
          },
        },

        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
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
            saveAsImage: {name:`${title}-历史单参趋势图`},
            // dataView: {}
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
            data:timeList.length >0? timeList.map(item => moment(item).format(formatDate) + appendText) : null,
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
    
    // return {}
  }

onChartLegendselectchanged=(e)=>{ 

  if(e.name != '标准'){
    this.echartsReact.props.option.legend.selected[e.name] = !this.echartsReact.props.option.legend.selected[e.name]

  }else{
    this.echartsReact.props.option.legend.selected[e.name] = true;
    this.echartsReact.getEchartsInstance().setOption(this.echartsReact.props.option) // 重新渲染
  }

}
pollutantSelect=(selectedIndex,item)=>{ //自定义图例点击事件

   const {chartList,monthChartList,yearChartList,selectItem} = this.state;
   let  selectData = [],selecMonthtData = [],yearChartData=[];
   chartList.length>0? chartList.map(items=>{
      if(items.PollutantCode == item.PollutantCode ){
        selectData = items.DataList;
        this.echartsReact.props.option.yAxis[0].name =  `${yName}(${item.Unit})`;
      // _this.setState({selectItem:item}) //记录选中的值    
      }
   }):null;
   monthChartList.length>0? monthChartList.map(items=>{
    if(items.PollutantCode == item.PollutantCode ){
      selecMonthtData = items.DataList;
    }
   }):null
   yearChartList.length>0? yearChartList.map(items=>{
    if(items.PollutantCode == item.PollutantCode ){
      yearChartData = items.DataList; 
    }
   }):null
  this.echartsReact.props.option.series.map((eitem,index)=>{
      if(eitem.name == "标准"){
        this.echartsReact.props.option.series[index].data = selectData;
        if(item.StandardValue.length>0){
          // {yAxis: 0,name:'标准值',lineStyle:{type:"solid",color:"#f5222d" }},

          item.StandardValue.map(standItem=>{
            if(item.StandardValue.length == 1){
              this.echartsReact.props.option.series[index].markLine.data.length<2? this.echartsReact.props.option.series[index].markLine.data.push({yAxis: standItem,name:'标准值',lineStyle:{type:"solid",color:"#f5222d" }}) : null;

            }
            if(item.StandardValue.length == 2){
              this.echartsReact.props.option.series[index].markLine.data.length<3? this.echartsReact.props.option.series[index].markLine.data.push({yAxis: standItem,name:'标准值',lineStyle:{type:"solid",color:"#f5222d" }}) : null;

            }
          })
        }
       
      }
      if(eitem.name == "同比"){
        this.echartsReact.props.option.series[index].data = yearChartData;
      }
      if(eitem.name == "环比"){
        this.echartsReact.props.option.series[index].data = selecMonthtData;
      }
  })
  this.echartsReact.getEchartsInstance().setOption(this.echartsReact.props.option) // 重新渲染

}
 
// 在componentDidUpdate中进行异步操作，驱动数据的变化
componentDidUpdate(prevProps) {

  if( prevProps.singFlag !==  this.props.singFlag) {
      const {selectedIndex} = this.state;
      const { chartList,timeList} = this.state;
      chartList.length>0&&timeList.length>0 ? setTimeout(()=>{this.pollutantSelect(selectedIndex,chartList[0])},300)  : null; //默认显示标准
    }
}  

componentDidMount(){
  const {chartList,selectedIndex,timeList} = this.state;
  
  chartList.length>0&&timeList.length>0 ? setTimeout(()=>{this.pollutantSelect(selectedIndex,chartList[0])},0)  : null; //默认显示标准
}

  render() {
    let onEvents = {
      'legendselectchanged': this.onChartLegendselectchanged.bind(this)
    }
    const {  isloading} = this.props;
    const {chartList,timeList} = this.state;
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
             style={{ height: 'calc(100vh - 340px)', width: '100%'}}
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