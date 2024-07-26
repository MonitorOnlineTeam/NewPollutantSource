/**
 * 功能：左侧
 * 创建人：jab
 * 创建时间：2024.04.12
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
import { Item } from 'gg-editor';
import { color } from 'echarts';

const { Option } = Select;

const namespace = 'resourceOverview'




const dvaPropsData =  ({ loading,resourceOverview }) => ({

})


const Index = (props) => {





  const  {  } = props; 

  useEffect(() => {

  },[]);





  const {index, title, subtitle,num,isStatistics,onClick} = props;
  return (<div style={{paddingTop:4}}>
      <div style={{paddingLeft:32,height:37, background:'url(/currencyResOver/btbk.png)',backgroundSize:'100%',fontSize:16,cursor:'pointer'}} onClick={()=>onClick&&onClick()}>
        {title}
      </div>
    {isStatistics&&<div className='cardBodySty' style={{ padding:'8px 16px'}} onClick={()=>onClick&&onClick()}>
      <Row justify='space-between' align='middle' style={{padding:'0 24px', height:50,  background:'url(/currencyResOver/zs.png)',backgroundSize:'100% 100%'}}>
        <div>
        <img src={`/currencyResOver/cardIcon_${index}.png`} />
        <span style={{paddingLeft:24}}>{subtitle}</span>
        </div>
        <span  style={{fontSize:18}} >{ num || 0}</span>
      </Row>
      </div>}
      </div>

  );
};
export default connect(dvaPropsData)(Index);