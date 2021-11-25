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
import styles from "./style.less"
const { Option } = Select;
import WasteWater from './wasteWater'
import WasteGas from './wasteGas'
import WaterQuality from './waterQuality'
import Air from './air'

const namespace = 'newestHome'




const dvaPropsData =  ({ loading,newestHome }) => ({

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

 const typeObj={
  wasteWater:<WasteWater/>,
  wasteGas:<WasteGas/>,
  waterQuality:<WaterQuality/>,
  air:<Air/>
 }

  const  type = props.route.name;
  return (
    <div>
     { typeObj[type]}
    </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);