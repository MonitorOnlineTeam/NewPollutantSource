/**
 * 功  能：计划工单统计
 * 创建人：贾安波
 * 创建时间：2021.10.13
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'consumablesStatistics'




const dvaPropsData =  ({ loading,consumablesStatistics,global }) => ({
  tableDatas:consumablesStatistics.regTableDatas,
  tableLoading: loading.effects[`${namespace}/regGetConsumablesRIHList`],
  exportLoading: loading.effects[`${namespace}/exportTaskWorkOrderList`],
  clientHeight: global.clientHeight,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    regEntGetTaskWorkOrderList:(payload)=>{ // 计划工单统计
      dispatch({
        type: `${namespace}/regEntGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    exportTaskWorkOrderList:(payload)=>{ // 导出
      dispatch({
        type: `${namespace}/exportTaskWorkOrderList`,
        payload:payload,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [showType,setShowType] = useState('1')
  const [dates, setDates] = useState([]);
  const  { tableDatas,tableLoading,exportLoading,clientHeight,type,time } = props; 
  
  
  useEffect(() => {
    onFinish();
  
  },[]);

  const showTypeChange = (e) =>{
     setShowType(e.target.value)
     setOutOrInside(1)
  }
  
  useEffect(()=>{
    onFinish();
  },[showType])

  const exports = async  () => {
    const values = await form.validateFields();
      props.exportTaskWorkOrderList({
        ...queryPar,
        pageIndex:undefined,
        pageSize:undefined,
    })

 };
 const columns = [
  {
    title: '序号',
    dataIndex: 'x',
    key:'x',
    align:'center',
    render:(text,record,index)=>{
     return  index +1 
    }
  },
  {
    title: '省',
    dataIndex: 'regionName',
    key:'regionName',
    align:'center',
  },
  {
    title: '备品备件更换数量',
    dataIndex: 'entName',
    key:'entName',
    align:'center',
    render:(text,record,index)=>{
     return  <div style={{textAlign:"left"}}>{text}</div>
    }
  },
  {
    title: '易耗品更换数量',
    dataIndex: 'pointName',
    key:'pointName',
    align:'center',
  },
  {
    title: '试剂更换数量',
    dataIndex: 'pointName',
    key:'pointName',
    align:'center',
  },
]

 
  const [outOrInside,setOutOrInside] = useState(1)
  const onFinish  = async () =>{  //查询
    try {
      const values = await form.validateFields();
      if(values.time[1].diff(values.time[0], 'days') <= 90){

        props.regEntGetTaskWorkOrderList({
          ...values,
          time:undefined,
          staticType:showType,
          beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
          endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
          outOrInside:outOrInside,
          regionLevel:showType ==1? 1 : undefined,
          pageIndex:showType ==2? 1 : undefined,
          pageSize:showType ==2? 10 : undefined,
        })
      }else{
        message.warning('日期单位不能超过90天，请重新选择')
      }

    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  return (
    <div  className={styles.consumablesStatisticsSty}>
    <Form
    form={form}
    name="advanced_search"
    onFinish={onFinish}
    initialValues={{
      pollutantType:type,
      abnormalType:1,
      time:time
    }}
    layout='inline'
    style={{paddingBottom:15}}
  >  
     <Form.Item label='日期' name='time'  style={{paddingRight:'16px'}}>
         <RangePicker allowClear={false} style={{width:'100%'}} 
          showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}/>
    </Form.Item> 
    <Form.Item label='监测点类型' name='pollutantType'  style={{paddingRight:'16px'}}>
        <Select placeholder='监测点类型' style={{width:150}}>
           <Option value={1}>废水</Option>
           <Option value={2}>废气</Option>
           </Select>
       </Form.Item>
       <Form.Item>
           <Button  type="primary" htmlType='submit' >
         查询
    </Button>
    <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
           导出
    </Button> 
    </Form.Item>
  </Form>
  <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        // columns={ cityDetailOutRegColumns}
        scroll={{ y: clientHeight - 500}}
        pagination={false}
      />
   
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);