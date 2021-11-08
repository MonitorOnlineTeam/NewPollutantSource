/**
 * 功能：首页 左侧内容
 * 创建人：贾安波
 * 创建时间：2021.11.08
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
import Content from '../components/Content'
const { Option } = Select;

const namespace = 'newestHome'




const dvaPropsData =  ({ loading,newestHome }) => ({
})

const  dvaDispatch = (dispatch) => {
  return {


    updateState:(payload)=>{ //更新参数
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








  return (
    <div>
         <div style={{padding:'20px 0 9px 20px'}}>
          <span>运营信息统计</span>
          <img style={{width:'100%'}} src='/title_bg2.png'/>
         </div>
         
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);