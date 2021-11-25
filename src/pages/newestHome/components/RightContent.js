/**
 * 功能：首页
 * 创建人：贾安波
 * 创建时间：2021.11.03
 */
import React, { useState,useEffect,Fragment, useRef,useMemo  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Popover,Radio    } from 'antd';
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




const dvaPropsData =  ({ loading,newestHome }) => ({
  tableLoading:newestHome.tableLoading,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ //更新参数
        dispatch({
          type: `${namespace}/updateState`, 
          payload:{...payload},
        }) 
      },
    getnewestHomeList : (payload,callback) =>{ //列表
      dispatch({
        type: `${namespace}/getnewestHomeList`,
        payload:payload,
        callback:callback
      })
      
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();

  
 const [tableDatas,setTableDatas] = useState([])
 const [pollutantType,setPollutantType] = useState('')


  const  { tableLoading } = props; 

  useEffect(() => {
      getnewestHomeList()
  },[]);


  const getnewestHomeList = (value) =>{
    props.getnewestHomeList({PollutantType:value},(res)=>{
      setTableDatas(res.notExpired7List)
    })
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
  const effectiveTransOption = {

    color:'#298CFB',
    tooltip: {
      trigger: 'item',   //触发类型；轴触发，axis则鼠标hover到一条柱状图显示全部数据，item则鼠标hover到折线点显示相应数据，
      formatter: function (params, ticket, callback) {
        //x轴名称
        let name = params.name
        //值
          let value = ''

          value = params.marker + params.seriesName+": "+params.value.toFixed(2)+'%' + '<br />'

        
        return  name + '<br />' + value
    },
    backgroundColor: "rgba(46, 57, 80, 1)", // 提示框浮层的背景颜色。
    // position:'inside',
    padding: [14, 12, 14, 10],
    axisPointer: { // 坐标轴指示器配置项。
      type: 'none', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
      snap: true, // 坐标轴指示器是否自动吸附到点上
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
      data: ['09/26', '09/26', '09/26', '09/26', '09/26', '09/26', '09/26'],
        axisLine: { //x轴
          lineStyle: {
            color: '#545555',
            width: 1
          },
        },
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false, }, //y轴
      axisTick: { show: false },
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
        data: [10.20, 32.20, 91.10, 93.00, 12.20, 33.20, 13.20],
        type: 'line',
        smooth: true,
        symbol: 'circle',     //设定为实心点
        symbolSize: 10,   //设定实心点的大小
      },
      
    ]
  };
 


 const moreBtnClick = (type) =>{
   console.log(type)
 }

 const [effectiveTransBtnCheck ,setEffectiveTransBtnCheck] = useState(2)
 const  effectiveTransClick = (key) =>{ //有效传输率 切换日期
    setEffectiveTransBtnCheck(key)
 }
  return (
      <div>
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

    <div className={styles.effectiveTrans}>
    <CardHeader btnClick={effectiveTransClick} showBtn type='week' btnCheck={effectiveTransBtnCheck} title='有效传输率' />
     <div style={{height:'100%',padding:'36px 19px 0 0' }}>
        <ReactEcharts
            option={effectiveTransOption}
            style={{ height: '100%', width: '100%' }}
          />
     </div>
     <MoreBtn  className={styles.moreBtnAbsoluteSty} type='realTime'  moreBtnClick={moreBtnClick}/>
     </div>
  </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);