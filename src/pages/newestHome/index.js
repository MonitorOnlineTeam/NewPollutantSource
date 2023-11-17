/**
 * 功能：首页
 * 创建人：jab
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
import styles from "./style.less"
const { Option } = Select;
import WasteWater from './wasteWater'
import WasteGas from './wasteGas'
import SurfaceWater from './surfaceWater'
import ActoryBoundary from './actoryBoundary'
import Air from './air'

const namespace = 'newestHome'




const dvaPropsData =  ({ loading,newestHome }) => ({
  tabType:newestHome.tabType
})

const  dvaDispatch = (dispatch) => {
  return {
    getnewestHomeList : (payload,callback) =>{ 
      dispatch({
        type: `${namespace}/getnewestHomeList`,
        payload:payload,
        callback:callback
      })
      
    },
    updateState:(payload)=>{ //更新代码
      dispatch({
        type: `${namespace}/updateState`, 
        payload:{...payload},
      }) 
    },
  }
}
const Index = (props) => {






  
  useEffect(() => {
  
  },[]);

  const [type,setType] = useState('wasteGas')

 const [selectkey,SetSelectkey] = useState('wasteGas')


 const tabList = [
  {text:'废气',val:"wasteGas"},
  {text:'废水',val:"wasteWater"},
  // {text:'空气站',val:"air"},
  // {text:'地表水',val:"surfaceWater"},
  // {text:'厂界',val:"actoryBoundary"},
]
 const tabClick = (val) =>{
  SetSelectkey(val)
  setTimeout(()=>{
    setType(val)
  },200)
 
}

const typeObj={
  wasteWater:<WasteWater/>,
  wasteGas:<WasteGas/>,
  surfaceWater:<SurfaceWater/>,
  air:<Air/>,
  actoryBoundary:<ActoryBoundary/>
 }
  return (
    <div>
    <div className={styles.homeContent}>
      <div className={styles.headerTabSty}>
         {tabList.map(item=>{
           return <span  key={item.val}  className={selectkey === item.val? `${styles.selectSty}` : `${styles.normalSty}` }  onClick={()=>{tabClick(item.val)}}>{item.text}</span>
         })}
       </div>
     { typeObj[type]}
     </div>
    </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);