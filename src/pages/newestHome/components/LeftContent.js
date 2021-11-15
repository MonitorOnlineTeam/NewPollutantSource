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
import styles from "../style.less"
import CardHeader from '../components/CardHeader'
const { Option } = Select;

const namespace = 'newestHome'




const dvaPropsData =  ({ loading,newestHome }) => ({
  operationDataSource:newestHome.operationDataSource
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

  const OperationColumns =  [
    {
      title: '统计类别',
      dataIndex: 'name',
      key: 'name',
      align:'center',
      width:61,
    },
    {
      title: '运营企业',
      dataIndex: 'age',
      key: 'age',
      align:'center',
      width:61,
    },
    {
      title: '排放口',
      dataIndex: 'address',
      key: 'address',
      align:'center',
      width:61,
    },
    {
      title: '非排放口',
      dataIndex: 'tags',
      key: 'tags',
      align:'center',
      width:61,
    },
  ]

  const operaOrderOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
      top:0,
      left: 100,
      right: 0,
      bottom: 0,
  },
    xAxis: {
        show:false,
        type: 'value',
        // boundaryGap: ,
    },
    
    yAxis: {
        type: 'category',
        data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)'],
        axisLine: { show: false},
        axisTick: {show: false  },
        axisLabel: {  textStyle: { color: '#fff'} },
    },
    series: [
        {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230],
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            },
            itemStyle:{
             normal:{
               color:'#0000ff'
             }
            }
        },

                        
    ]
};





  return (
    <div className={styles.leftContent}>
         <div className={styles.pointSty}>
           <CardHeader  title='运营信息统计'/>
          <Table style={{padding:'16px 15px 0 0'}}  columns={OperationColumns} dataSource={props.operationDataSource} pagination={false}/>
         </div>


         <div className={styles.operaOrder}>
           <CardHeader  title='近30日运维工单统计'/>
           <ReactEcharts 
              option={operaOrderOption}
              style={{height:200,width:'100%'}}
             />
          </div>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);