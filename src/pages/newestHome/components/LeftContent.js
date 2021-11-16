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

const subjectFontSize = 14;


const dvaPropsData =  ({ loading,newestHome }) => ({
  operationDataSource:newestHome.operationDataSource,
  operaOrderData:newestHome.operaOrderData,
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




const { operaOrderData } = props;


  
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
  const changeBarData = (data)=>{
    let max = 0, bgBarData = [];
    data.map(item=>{
      if (max < Number(item)) max = item;
    })

    data.map(item=>{
       bgBarData.push(max)
    })
    return bgBarData;
  }
  const  bagBarData = changeBarData(operaOrderData);
  const operaOrderOption = {
    tooltip: {
        show:false
    },
    grid: {
      top:0,
      left: 80,
      right: 65,
      bottom: 0,
  },
    xAxis: {
        show:false,
        type: 'value'
    },
    
    yAxis: {
        type: 'category',
        data: ['巡检', '校准', '校验测试', '维护', '维修', '配合检查','配合对比','参数核对'],
        axisLine: { show: false},
        axisTick: {show: false  },
        axisLabel: {  margin:80, textStyle: { color: '#fff',fontSize:subjectFontSize,align:'left'},
      
      },
        
    },
    series: [
      {
        type: 'bar', //显示背景图 
        data: bagBarData,
        label: {
          normal: {
          show: true,
          position:"right",
          //通过formatter函数来返回想要的数据
          formatter:function(params){
            for(let i=0;i<operaOrderData.length;i++){
              if(params.dataIndex==i){
               return `${operaOrderData[i]} 次`;
             }
            }
           },
           fontSize:subjectFontSize,
           color: '#4BF3F9',
           padding : [0, 0, 0, 5],
          },
        },
        itemStyle:{
         normal:{
           color: '#2f3648',
           barBorderRadius: [15, 15, 15 ,15]
         },
        },
        barWidth: '50%',  // 柱形的宽度
        barGap: '-100%', // Make series be ove
        silent: true //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。  为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面 
    },
        {
            type: 'bar',
            data: operaOrderData,
            label: {
              normal: {
              show: false,
              // position:[100,0],
              // formatter: function (params) {
              //   return `${params.data}次`;
              //  },
              //  fontSize:subjectFontSize,
              //  color: '#4BF3F9'
              }
            },
            itemStyle:{
             normal:{
              color: {
                type: 'linear', // 线性渐变
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
               colorStops: [{
                offset: 0,
                color: '#298CFB' // 0%处的颜色为红色
                 }, {
                offset: 1,
                color: '#29D6FB' // 100%处的颜色为蓝
               }],
              },
               barBorderRadius: [15, 15, 15 ,15]
             },
            },
            barWidth: '50%',   // 柱形的宽度
            // barCategoryGap: '20%',  // 柱形的间距
        },

                        
    ]
};
const  planOperaOption =()=>{

}




  return (
    <div className={styles.leftContent}>
         <div className={styles.pointSty}>
           <CardHeader  title='运营信息统计'/>
          <Table style={{padding:'16px 15px 0 0'}}  columns={OperationColumns} dataSource={props.operationDataSource} pagination={false}/>
         </div>


         <div className={styles.operaOrder}>
           <CardHeader  title='近30日运维工单统计'/>
           <div style={{height:'100%', padding:'26px 10px 0 0'}}>
           <ReactEcharts 
              option={operaOrderOption}
              style={{height:'calc(100% - 26px )',width:'100%'}}
             />
            </div>
          </div>

          <div className={styles.planOpera }>
           <CardHeader  title='近30日计划运维情况'/>
           <div style={{height:'100%', padding:'24px 11px 0 0'}}>
           {/* <ReactEcharts 
              option={planOperaOption}
              style={{height:'calc(100% - 28px )',width:'100%'}}
             /> */}
            </div>
          </div>

        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);