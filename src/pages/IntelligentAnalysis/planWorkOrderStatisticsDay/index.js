/**
 * 功  能：计划工单统计 固定到天
 * 创建人：jab
 * 创建时间：2024.05.20
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
import styles from "./style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import Region from './components/Region'

const namespace = 'planWorkOrderStatisticsDay'




const dvaPropsData =  ({ loading,planWorkOrderStatisticsDay }) => ({
  tableDatas:planWorkOrderStatisticsDay.tableDatas,
  tableLoading:planWorkOrderStatisticsDay.tableLoading,
  exportLoading: loading.effects[`${namespace}/exportTaskWorkOrderList`],
  queryPar:planWorkOrderStatisticsDay.queryPar,
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
  const  {planType, tableDatas,tableTotal,loadingConfirm,pointDatas,tableLoading,exportLoading,queryPar } = props; 
  
  
  useEffect(() => {
    onFinish();
  
  },[]);

  

  const exports = async  () => {
    const values = await form.validateFields();

     const par ={
      ...values,
      time:undefined,
      staticType:showType,
      beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
      endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
      outOrInside:outOrInside,
      regionLevel:showType ==1? 1 : undefined,
      homePageIndex:planType,
      pageIndex: undefined,
      pageSize: undefined,
    }
    props.exportTaskWorkOrderList(par)
  

 };


 
  const [outOrInside,setOutOrInside] = useState(1)
  const onFinish  = () =>{  //查询
      const values =  form.getFieldsValue();
      if(values.time[1].diff(values.time[0], 'days') <= 90){
        
        let par = {
          ...values,
          time:undefined,
          staticType:showType,
          beginTime:values.time[0]&&moment(values.time[0]).format("YYYY-MM-DD 00:00:00"),
          endTime:values.time[1]&&moment(values.time[1]).format("YYYY-MM-DD 23:59:59"),
          outOrInside:outOrInside,
          regionLevel:showType ==1? 1 : undefined,
          homePageIndex:planType,
        }
        props.regEntGetTaskWorkOrderList(par)
      }else{
        message.warning('日期单位不能超过90天，请重新选择')
      }
  }



  const parentCallback = (val) =>{
    // pchildref.current._childFn(values); 
    setOutOrInside(val)
  }
  const sortRate = (a,b,attribute) =>{ //完成率排序 返回值为'-'
    const data1 = a[attribute] == '-'?  0 :  a[attribute]
    const data2 = b[attribute] == '-'?  0 :  b[attribute]
    return data1 - data2;
  }
  const searchComponents = () =>{
     return <Form
    form={form}
    name="advanced_search"
    layout='inline'
    onFinish={onFinish}
    initialValues={{
      pollutantType:props.pollutantTypes? props.pollutantTypes : 2,
      abnormalType:1,
      time:[moment(new Date()).add(-30, 'day').startOf('day'), moment(new Date()).endOf('day')],
    }}
  >  
      <Form.Item name='time' label='日期'>
          <RangePicker_    style={{width:'100%'}} format='YYYY-MM-DD'  allowClear={false} />
     </Form.Item>
      <Form.Item label='监测点类型' name='pollutantType' style={{padding:'0 8px'}}>
         <Select placeholder='请选择' style={{width:120}}>       
            <Option value={2}>废气</Option>
            <Option value={1}>废水</Option>
            </Select>
        </Form.Item>
        <Form.Item>
     <Button  type="primary" htmlType='submit'  loading={tableLoading}>
          查询
     </Button>
     <Button style={{ margin: '0 8px' }} onClick={()=>{form.resetFields();onFinish();}}>
                重置
              </Button>
     <Button icon={<ExportOutlined />} loading={ exportLoading} onClick={()=>{ exports()} }>
            导出
     </Button> 
     </Form.Item>  
     </Form>
    
  }
  return (
    <div  className={styles.planWorkOrderStatisticsDaySty}>
    <BreadcrumbWrapper hideBreadcrumb={props.hideBreadcrumb}>
    <Card title={searchComponents()} bordered={!props.hideBreadcrumb} bodyStyle={{padding:'12px 24px'}}>
      <Region pollutantType={form.getFieldValue('pollutantType')} parentCallback={parentCallback} {...props} ref={pchildref} sortRate={sortRate}/> 
   </Card>
   </BreadcrumbWrapper>
   
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);