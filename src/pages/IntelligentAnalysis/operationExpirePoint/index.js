/**
 * 功  运维到期点位
 * 创建人：贾安波
 * 创建时间：2021.08.26
 */
import React, { useState,useEffect,Fragment, useRef  } from 'react';
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

import styles from "./style.less"
const { Option } = Select;

const namespace = 'operationExpirePoint'




const dvaPropsData =  ({ loading,operationExpirePoint }) => ({
  tableDatas:operationExpirePoint.tableDatas,
  exportLoading: loading.effects[`${namespace}/getParametersInfo`],
  checkName:operationExpirePoint.checkName,
})

const  dvaDispatch = (dispatch) => {
  return {
    addOrUpdateEquipmentParametersInfo : (payload,callback) =>{ //修改 or 添加
      dispatch({
        type: `${namespace}/addOrUpdateEquipmentParametersInfo`,
        payload:payload,
        callback:callback
      })
      
    },
    getEquipmentParametersInfo:(payload,callback)=>{ //参数列表
      dispatch({
        type: `${namespace}/getEquipmentParametersInfo`,
        payload:payload,
      })
    },
    updateState:(payload)=>{ //下拉列表测量参数
      dispatch({
        type: `${namespace}/updateState`, 
        payload:{...payload},
      }) 
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();

  const echartsRef = useRef(null);


  
  
  const isEditing = (record) => record.key === editingKey;
  
  const  { tableDatas,tableLoading,exportLoading,checkName } = props; 

  
  useEffect(() => {
      getEquipmentParametersInfo({DGIMN:props.DGIMN})
      getParametersInfos();
  },[props.DGIMN]);
 
  const getEquipmentParametersInfo=()=>{
    props.getEquipmentParametersInfo({PolltantType:1})
  }

  const getParametersInfos=()=>{
    props.getEquipmentParametersInfo({PolltantType:1})
  }
  const columns = [
    {
      title: '项目号',
      dataIndex: 'EquipmentParametersCode',
      align:'center'
    },
    {
      title: '省份',
      dataIndex: 'EquipmentParametersCode',
      align:'center'
    },
    {
      title: '监控目标',
      dataIndex: 'Range1',
      align:'center',
    },
    {
      title: '监测点',
      dataIndex: 'DetectionLimit',
      align:'center',
    },
    {
      title: '监测点类型',
      dataIndex: 'Unit',
      align:'center',
    },
    {
      title: '运营实际开始日期',
      dataIndex: 'Unit',
      align:'center',
      sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
    },
    {
      title: '运营实际结束日期',
      dataIndex: 'operations',
      align:'center',
      sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
      
    },
  ]

  const getOption = () =>{
   return {
    color: ['#64b0fd'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: 45,
        right: 0,
        bottom: 50,
        // containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
                alignWithLabel: true
            },
            axisLine: { //x轴
              lineStyle: {
                color: '#333',
                width: 1
              },
            },
            axisLabel: {
              textStyle: {
                color: '#333'
              }
            },
        }
    ],
    yAxis: [
        {
            name: '监测点数（个）',
            type: 'value',
            splitLine:{
              show:false
            },
            axisLabel: {
              lineStyle: {
                color: '#333',
                width: 1
              },
              textStyle: {
                color: '#333'
              }
            },
        }
    ],
    series: [
        {
            name: '过期时间',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220],
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#333'
              }
          },
          itemStyle:{
            normal:{
              color:(params)=>{
               return  params.name == checkName ? '#ffa940' : '#64b0fd'
              }
            }
          }
        }
    ]
};
  }
 



  const onChange =(value) => {

  };

  const  onChartClick = (e)=>{
    // props.updateState({checkName:e.name})
   echartsRef.current.props.option.series[0].itemStyle.normal.color = (params)=>{
       return  params.name == e.name ? '#ffa940' : '#64b0fd'
    }
   echartsRef.current.getEchartsInstance().setOption(echartsRef.current.props.option)
  }
  const searchComponents = () =>{
     return  <Form
    name="advanced_search"
    className={styles['ant-advanced-search-form']}
  >  
         <Row> 
         <Form.Item name='' label=''  style={{  marginRight: 8,}} >
             <Radio.Group onChange={onChange} defaultValue="">
                <Radio.Button value="">全部</Radio.Button>
                <Radio.Button value="1">废水</Radio.Button>
                <Radio.Button value="2">废气</Radio.Button>
             </Radio.Group>
          </Form.Item>
          <Form.Item name=''  label='' >
           <Button icon={<ExportOutlined />} loading={exportLoading} onClick={()=>{ exports()} }>
            导出
           </Button>  
          </Form.Item>
      </Row>  


     </Form>
  }
  return (
    <div  className={styles.operationExpirePoint}>
    <BreadcrumbWrapper>
    <Card title={searchComponents()}>
     { tableLoading? <PageLoading /> : <ReactEcharts
                option={getOption()}
                style={{  width: '100%' }}
                theme="my_theme"
                onEvents={{
                  'click': onChartClick,
                }}     
                ref={echartsRef}    
              />}
     <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
      /> 
   </Card>
   </BreadcrumbWrapper>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);