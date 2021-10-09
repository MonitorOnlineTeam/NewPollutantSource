/**
 * 功  能：异常工单统计
 * 创建人：贾安波
 * 创建时间：2021.09.27
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
import Region from './components/Region'
import Ent from './components/Ent'

const namespace = 'abnormalWorkStatistics'




const dvaPropsData =  ({ loading,abnormalWorkStatistics }) => ({
  tableDatas:abnormalWorkStatistics.tableDatas,
  tableLoading:abnormalWorkStatistics.tableLoading,
  exportLoading: loading.effects[`${namespace}/exportProjectInfoList`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getProjectInfoList:(payload)=>{ //项目管理列表
      dispatch({
        type: `${namespace}/getProjectInfoList`,
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
  const  { tableDatas,tableTotal,loadingConfirm,pointDatas,tableLoading,pointLoading,exportLoading,exportPointLoading } = props; 
  
  
  useEffect(() => {
    onFinish();
  
  },[]);


  const showTypeChange = (e) =>{
     setShowType(e.target.value)
  }


  const exports =  async () => {
    const values =   await form.validateFields();
    props.exportProjectInfoList({
      ...values,
    })
 };

 const entExports =  async () => {
  const values =   await form.validateFields();
  props.exportProjectInfoList({
    ...values,
  })
};
 

  const onFinish  = async () =>{  //查询
      
    try {
      const values = await form.validateFields();
      console.log (values)
      if(values.time[1].diff(values.time[0], 'days') <= 90){

        // showType==1
       props.updateState({
         abnormalTypes:values.abnormalType
       }) 
        props.getProjectInfoList({
          ...values,
        })
      }else{
        message.warning('日期单位不能超过90天，请重新选择')
      }

    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }




  const abnormalTypeChange = (values) =>{
    // pchildref.current._childFn(values);
  }
  const searchComponents = () =>{
     return <Form
    form={form}
    name="advanced_search"
    onFinish={onFinish}
    initialValues={{
      pointType:1,
      abnormalType:1,
      time:[moment(new Date()).add(-30, 'day').startOf('day'), moment(new Date()).endOf('day')]
    }}
  >  
    {showType==1? <Row  align='middle'>
      <Form.Item name='time' label='日期'>
          <RangePicker   style={{width:'100%'}} 
                        allowClear={false}
                        showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}
           />
     </Form.Item>
      <Form.Item label = '监测点类型' name='pointType' style={{padding:'0 8px'}}>
         <Select placeholder='监测点类型'>
            <Option value={1}>废水</Option>
            <Option value={2}>废气</Option>
            </Select>
        </Form.Item>
        <Form.Item label='异常类型' name='abnormalType'  style={{paddingRight:'8px'}}>
            <Select style={{width:150}} placeholder='异常类型'  onChange={abnormalTypeChange}>
              {/* {
                ss.map(item=>{
                return <Option value={item.ss}>{item.ss}</Option>
                })
              } */}
                <Option value={1}>打卡异常</Option>
                <Option value={2}>报警响应超时率</Option>
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
     <Form.Item>
     <Radio.Group defaultValue="1" onChange={showTypeChange} buttonStyle="solid">
      <Radio.Button value="1">行政区</Radio.Button>
      <Radio.Button value="2">企业</Radio.Button>
    </Radio.Group>
    </Form.Item>
      </Row> 
      :
      <>
      <Row  align='middle'>
      <Form.Item label='日期' name='time'  style={{paddingRight:'16px'}}>
         <RangePicker style={{width:'100%'}} 
          showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}/>
    </Form.Item> 
     <Form.Item label='企业名称' name='entName' style={{paddingRight:'16px'}}>
         <Input placeholder='请输入企业名称'  allowClear/>
       </Form.Item>
       <Form.Item label='行政区'  name='regionCode'   style={{paddingRight:'16px'}}>
          <RegionList />
       </Form.Item>
       </Row>
       <Row style={{paddingTop:12}}>
       <Form.Item name='abnormalType'  label='异常类型' style={{paddingRight:'16px'}}>
           <Select placeholder='异常类型' style={{width:150}} onChange={abnormalTypeChange}>
             <Option value={1}>打卡异常</Option>
             <Option value={2}>报警响应超时率</Option>
           </Select>
       </Form.Item>
       <Form.Item label='监测点类型' name='pointType'  style={{paddingRight:'16px'}}>
        <Select placeholder='监测点类型' style={{width:150}}>
           <Option value={1}>废水</Option>
           <Option value={2}>废气</Option>
           </Select>
       </Form.Item>

       <Form.Item>
    <Button  type="primary" htmlType='submit' >
         查询
    </Button>
    <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ entExports()} }>
           导出
    </Button> 
    
    </Form.Item>
    
    <Form.Item>
    <Radio.Group  value={showType} onChange={showTypeChange} buttonStyle="solid">
     <Radio.Button value="1">行政区</Radio.Button>
     <Radio.Button value="2">企业</Radio.Button>
   </Radio.Group>
   </Form.Item>
            </Row>   
            </>
            }  
     </Form>
    
  }
  return (
    <div  className={styles.abnormalWorkStatisticsSty}>
    <BreadcrumbWrapper>
    <Card title={searchComponents()}>
      {showType==1? <Region {...props} ref={pchildref}/> : <Ent />}
   </Card>
   </BreadcrumbWrapper>
   
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);