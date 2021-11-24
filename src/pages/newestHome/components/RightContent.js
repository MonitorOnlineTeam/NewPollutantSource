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



 const moreBtnClick = (type) =>{

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
     <div style={{height:'100%',paddingRight:19 }}>
     </div>
     </div>
  </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);