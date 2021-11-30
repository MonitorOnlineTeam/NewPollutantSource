/**
 * 功能：首页
 * 创建人：贾安波
 * 创建时间：2021.11.03
 */
import React, { useState,useEffect,Fragment, useRef,useMemo  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Popover,Radio,Spin    } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'
import moment from 'moment'
import CardHeader from './publicComponents/CardHeader'
import MoreBtn from './publicComponents/MoreBtn'
import styles from "../style.less"

const { Option } = Select;

const namespace = 'newestHome'



const subjectFontSize = 14;


const dvaPropsData =  ({ loading,newestHome }) => ({
  effectiveTransmissionLoading:loading.effects[`${namespace}/GetEffectiveTransmissionRateList`],
  effectiveTransmissionList:newestHome.effectiveTransmissionList,
  dataAlarmResLoading:loading.effects[`${namespace}/GetAlarmResponse`],
  dataAlarmResData:newestHome.dataAlarmResData,
  pollType:newestHome.pollType,
  latelyDays30:newestHome.latelyDays30,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ //更新参数
        dispatch({
          type: `${namespace}/updateState`, 
          payload:{...payload},
        }) 
      },
    GetEffectiveTransmissionRateList : (payload,) =>{ //传输有效率
      dispatch({
        type: `${namespace}/GetEffectiveTransmissionRateList`,
        payload:payload,
      })
    },
    GetAlarmResponse : (payload) =>{ //数据报警响应统计
      dispatch({
        type: `${namespace}/GetAlarmResponse`,
        payload:payload,
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();

  



  const  {pollType, latelyDays30,dataAlarmResData } = props; 

  useEffect(() => {
      initData()
  },[]);


  const initData = (value) =>{
    getEffectiveTransmissionRateList(latelyDays30)
    getAlarmResponse(latelyDays30)
  }

  const pollutantType = pollType[props.type]
  
  const getEffectiveTransmissionRateList = (date) =>{//传输有效率
    props.GetEffectiveTransmissionRateList({ 
      pollutantType: pollutantType,
      ...date
    })
  }

  const getAlarmResponse = (date) =>{//数据报警响应统计
    props.GetAlarmResponse({ 
      pollutantType: pollutantType,
      ...date
    })
  }

 
  const [effectiveTransBtnCheck ,setEffectiveTransBtnCheck] = useState(latelyDays30)
  const  effectiveTransClick = (key) =>{ //有效传输率 切换日期
   setEffectiveTransBtnCheck(key)
   getEffectiveTransmissionRateList(key)

  }
 
  const [dataAlarmResBtnCheck ,setDataAlarmResBtnCheck] = useState(latelyDays30)
  const  dataAlarmResClick = (key) =>{ //数据报警响应 切换日期
    setDataAlarmResBtnCheck(key)
    getAlarmResponse(key)

  }
  

  const moreBtnClick = (type) =>{
    console.log(type)
  }
 const reanTimeNetworkOption = () =>{

    let option = {
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      color: ["#298CFB", "#FCA522"],
      title: {
        text:'90.00%',
        left: "center",
        top: "38%",
        textStyle: {
          color: '#fff',
          fontSize: 18,
          align: "center",
          fontWeight: 'bold',
        }
      },
      series: [
        {
          name: '实时联网率',
          type: 'pie',
          radius: ['84%', '100%'],
          avoidLabelOverlap: false,
          label: { normal: { show: false, position: 'center' }, },
          data: [
            { value:  90.00 , name: '已完成' },
            { value: 100 - 90.00, name: '未完成' },
          ],
          // minAngle: 0,//最小角度
          startAngle:330, //起始角度
          hoverAnimation: false, //悬浮效果
        // silent: true,
        }
      ]
    };
    return option;
 }

  const { effectiveTransmissionList } = props;
 
  const effectiveTransOption = () =>{
 
  let time = effectiveTransmissionList[0]? effectiveTransmissionList.map((item=> moment(item.monitorTime).format('MM/DD'))) : []

  let value = effectiveTransmissionList[0]? effectiveTransmissionList.map(item=> item.effectiveTransmissionRate) : []

  console.log(value)
  const option = { //传输有效率

    color:'#298CFB',
    tooltip: {
      trigger: 'axis',   //触发类型；轴触发，axis则鼠标hover到一条柱状图显示全部数据，item则鼠标hover到折线点显示相应数据，
      formatter: function (params, ticket, callback) {
        // //x轴名称
        // let name = params.name
        // //值
        //   let value = ''
        //   value = params.marker + params.seriesName+": "+params.value +'%' + '<br />'
        // return  name + '<br />' + value

           //x轴名称 params[0].name
           let name = params[0].name;
           //值
             let value = ''
             params.map(item=>{
             value += `${item.marker} ${item.seriesName}: ${item.value} % <br />`
           })
           return  name + '<br />' + value
    },
    backgroundColor: "rgba(46, 57, 80, 1)", // 提示框浮层的背景颜色。
    // position:'inside',
    padding: [14, 12, 14, 10],
    axisPointer: { // 坐标轴指示器配置项。
      type: 'line', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
      snap: true, // 坐标轴指示器是否自动吸附到点上
      lineStyle: {
        color: '#545555',
        opacity: 0.5,
        width: 1
    },
    },
    },
    grid: {
      left: 40,
      right: 20,
      bottom: 45,
      top:10,
      // containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: time,
        axisLine: { //x轴
          lineStyle: {
            color: '#545555',
            width: 1,  
          },
        },
        axisTick: { //x轴 去掉刻度
          show:false
        },
        axisLabel: {
          textStyle: {
            color: '#fff'
          },
          // interval:0,
          // rotate:90
        }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false, }, //y轴
      axisTick: { show: false },
      min:0,
      max:100,
      axisLabel: {
        formatter: '{value}%',
        textStyle: {
          color: '#fff'
        }
      },
      splitLine: {  //x轴分割线
        lineStyle: {
          type: 'dashed',
          color: '#545555',
          width: 1
        }
      }
    },
    series: [
      {
        name: props.type,
        data: value,
        type: 'line',
        smooth: true,
        symbol: 'circle',     //设定为实心点
        symbolSize: 10,   //设定实心点的大小
      },
      
    ]
  }
   return option;
  };

 const dataAlarmResOption = {  //数据报警响应统计
  tooltip: { show:false },
  grid: { top:0,left: 124, right: 68, bottom: 0,},
  xAxis: { show:false,  type: 'value'},
  yAxis: {
      type: 'category',
      data: [ '报警响应超时率','缺失报警响应率','异常报警响应率','超标报警核实率'],
      axisLine: { show: false},
      axisTick: {show: false  },
      axisLabel: {  margin:124, textStyle: { color: '#fff',fontSize:subjectFontSize,align:'left'},   
    },       
  },
  series: [
    {
      type: 'bar', //显示背景图 
      data: [100,100,100,100],
      label: {
        normal: {
        show: true,
        position:"right",
        //通过formatter函数来返回想要的数据
        formatter:function(params){
          for(let i=0;i<dataAlarmResData.length;i++){
            if(params.dataIndex==i){
             return `${dataAlarmResData[i]==100? dataAlarmResData[i].toFixed(1) : dataAlarmResData[i]}%`;
           }
          }
         },
         fontSize:subjectFontSize,
         color: '#fff',
         padding : [0, 0, 0, 12],
        },
      },
      itemStyle:{ normal:{color: '#2E3647' },},
      barWidth: '40%',  // 柱形的宽度
      barGap: '-100%', // Make series be ove
      silent: true //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。  为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面 
  },
      {
          type: 'bar',
          data: dataAlarmResData,
          label: {  normal: { show: false, }},
          itemStyle:{
           normal:{
            color: function(params) {
                var colorList = [ '#4FBCDC','#2E7AEB','#FFCC00','#FF0000'];
                return colorList[params.dataIndex]
            }
           },
          },
          barWidth: '40%',   // 柱形的宽度
      },

                      
  ]
 }

 const operationExpiraEchartsRef = useRef(null);
 const operationExpiraOption = { //点位到期统计
  title: {
    text: '点位统计',  //图形标题，配置在中间对应位置
    left: "center",
    top: "44%",
    textStyle: {
      color: "#fff",
      fontSize: 20,
      align: "center",
      fontWeight:400
    }
  },
  tooltip: { show:false },
  legend: {show:false},
  color:['#FFB900','#F76890','#2D8BCD','#2AFAA4'],
  series: [
    {
      name: '点位统计',
      type: 'pie',
      radius: ['60%', '90%'],
      avoidLabelOverlap: false,
      hoverAnimation:false,
      label: {
        alignTo: 'edge', // 'edge'：文字对齐，文字的边距由 label.margin 决定。
        formatter: '{name|{b}}\n{num|{c} 个}',
        margin: '4%',
        lineHeight: 20,
        rich: {
          name:{
            fontSize:subjectFontSize,
          },
          num: {
            fontSize: 16,
            color: '#fff',
            padding:[0,0,5,0]
          }
        }
      },
      emphasis: {
        label: {
          show: true, //高亮是标签的样式
        }
      },

      labelLine: {
          normal: {
            length: '3%',  // 视觉引导线第一段的长度。
            length2:'28%', //视觉引导线第二段的长度。
          },
      },
      data: [
        { value: 20, name: '0-7日内到期' },
        { value: 20, name: '15-30日内到期' },
        { value: 20, name: '8-14日内到期' },
        { value: 20, name: '过期7日内' },
      ]
    }
  ]
 }
  const {effectiveTransmissionLoading } = props;  //有效传输率
  const {dataAlarmResLoading} = props; //数据报警响应
  return ( 
      <div>

   <Spin spinning={false}>
    <div className={styles.realTimeNetworkSty}>
      <CardHeader  title='实时联网率'/>
       <div style={{paddingTop:30}}>
      <Row align='bottom'>
      <ReactEcharts
                option={reanTimeNetworkOption(1)}
                style={{ width: 98, height: 98 }}
              />
       <div style={{paddingBottom:12,
                width:'calc(100% - 115px)'
                }}>
         <Row align='middle'><div className={styles.realTimeNetworkLegend} style={{background:'#298CFB'}}></div>
         <div style={{width:70}}>联网数：</div>190<span>次</span>
         </Row>
         <Row align='middle' style={{paddingTop:8}}><div className={styles.realTimeNetworkLegend} style={{background:'#FCA522'}}></div>
         <div style={{width:70}}>未联网数：</div>20<span>次</span>
         </Row>
       </div>
     </Row>

     <MoreBtn  className={styles.moreBtnAbsoluteSty} type='realTime'  moreBtnClick={moreBtnClick}/>
    </div>
    </div>
    </Spin>

    <Spin spinning={effectiveTransmissionLoading}>
    <div className={styles.effectiveTrans}> {/**有效传输率 */}
    <CardHeader btnClick={effectiveTransClick} showBtn type='week' btnCheck={effectiveTransBtnCheck} title='有效传输率' />
     <div style={{height:'100%',padding:'36px 19px 0 0' }}>
        <ReactEcharts
            option={effectiveTransOption()}
            style={{ height: '100%', width: '100%' }}
          />
     </div>
     <MoreBtn  className={styles.moreBtnAbsoluteSty} type='realTime'  moreBtnClick={moreBtnClick}/>
     </div>
    </Spin>

    <Spin spinning={dataAlarmResLoading}>
     <div className={styles.dataAlarmRes}>{/**数据报警响应统计 */}
    <CardHeader btnClick={dataAlarmResClick} showBtn type='week' btnCheck={dataAlarmResBtnCheck} title='数据报警响应统计' />
     <div style={{height:'100%',padding:'24px 19px 15px 0' }}>
         <ReactEcharts
            option={dataAlarmResOption}
            style={{ height: '100%', width: '100%' }}
          /> 
     </div>
     </div>
     </Spin>

     <div className={styles.operationExpira}>{/**运营到期点位统计 */}
    <CardHeader btnClick={dataAlarmResClick}   title='运营到期点位统计' />
     <div style={{height:'100%',padding:'33px 17px 36px 0' }}>
         <ReactEcharts
            option={operationExpiraOption}
            style={{ height: '100%', width: '100%' }}
            ref={operationExpiraEchartsRef}
          />  
     </div>
     <MoreBtn  className={styles.moreBtnAbsoluteSty} type='realTime'  moreBtnClick={moreBtnClick}/>
     </div>
  </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);