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
import styles from "./style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import Region from './components/Region'
import Ent from './components/Ent'

const namespace = 'planWorkOrderStatistics'




const dvaPropsData =  ({ loading,planWorkOrderStatistics }) => ({
  tableDatas:planWorkOrderStatistics.tableDatas,
  tableLoading:planWorkOrderStatistics.tableLoading,
  exportLoading: loading.effects[`${namespace}/exportTaskWorkOrderList`],
  queryPar:planWorkOrderStatistics.queryPar,
  exportActualRegLoading:planWorkOrderStatistics.exportActualRegLoading,
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

    /**实际工单统计 */

    regEntActualGetTaskWorkOrderList:(payload)=>{ // 计划工单统计 实际
      dispatch({
        type: `${namespace}/regEntActualGetTaskWorkOrderList`,
        payload:payload,
      })
    },
    exportActualTaskWorkOrderList:(payload)=>{ // 实际 导出
      dispatch({
        type: `${namespace}/exportActualTaskWorkOrderList`,
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
  const  { tableDatas,tableTotal,loadingConfirm,pointDatas,tableLoading,exportLoading,exportActualRegLoading,queryPar,isPlanCalibrationModal,isPlanInspectionModal,isActualCalibrationModal } = props; 
  
  
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

     const par ={
      ...values,
      time:undefined,
      staticType:showType,
      beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
      endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
      outOrInside:outOrInside,
      regionLevel:showType ==1? 1 : undefined,
      pageIndex: undefined,
      pageSize: undefined,
      homePageIndex: isPlanInspectionModal? 1 :isPlanCalibrationModal? 2 : undefined,
    }
     if(!isActualCalibrationModal){
      props.exportTaskWorkOrderList(par)
     }else{ //实际校准完成率
      props.exportActualTaskWorkOrderList(par)
     }
  

 };


 
  const [outOrInside,setOutOrInside] = useState(1)
  const onFinish  = async () =>{  //查询
    try {
      const values = await form.validateFields();
      if(values.time[1].diff(values.time[0], 'days') <= 90){
        
        let par = {
          ...values,
          time:undefined,
          staticType:showType,
          beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
          endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
          outOrInside:outOrInside,
          regionLevel:showType ==1? 1 : undefined,
          pageIndex:showType ==2? 1 : undefined,
          pageSize:showType ==2? 10 : undefined,
          homePageIndex: isPlanInspectionModal? 1 :isPlanCalibrationModal? 2 : undefined,
        }
        !isActualCalibrationModal?  props.regEntGetTaskWorkOrderList(par):
        props.regEntActualGetTaskWorkOrderList(par)
      }else{
        message.warning('日期单位不能超过90天，请重新选择')
      }

    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }



  const parentCallback = (val) =>{
    // pchildref.current._childFn(values); 
    setOutOrInside(val)
  }
  const searchComponents = () =>{
     return <Form
    form={form}
    name="advanced_search"
    onFinish={onFinish}
    initialValues={{
      pollutantType:isPlanCalibrationModal||isPlanInspectionModal||isActualCalibrationModal ? props.pollutantTypes : undefined,
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
      <Form.Item label = '监测点类型' name='pollutantType' style={{padding:'0 8px'}}>
         <Select placeholder='监测点类型' style={{width:120}}>       
            <Option value={2}>废气</Option>
            <Option value={1}>废水</Option>
            </Select>
        </Form.Item>
        <Form.Item>
     <Button  type="primary" htmlType='submit' >
          查询
     </Button>
     <Button icon={<ExportOutlined />} loading={ !isActualCalibrationModal? exportLoading : exportActualRegLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
            导出
     </Button> 
     
     </Form.Item>
     {!isPlanCalibrationModal&&!isPlanInspectionModal&&!isActualCalibrationModal&&<Form.Item>
     <Radio.Group defaultValue="1" onChange={showTypeChange} buttonStyle="solid">
      <Radio.Button value="1">行政区</Radio.Button>
      <Radio.Button value="2">企业</Radio.Button>
    </Radio.Group>
    </Form.Item>}
      </Row> 
      :
      <>
      <Row  align='middle'>
      <Form.Item label='日期' name='time'  style={{paddingRight:'16px'}}>
         <RangePicker allowClear={false} style={{width:'100%'}} 
          showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}/>
    </Form.Item> 
     <Form.Item label='企业名称' name='entName' style={{paddingRight:'16px',width:350}}>
         <Input placeholder='请输入企业名称'  allowClear/>
       </Form.Item>
       <Form.Item label='行政区'  name='regionCode'   style={{paddingRight:'16px'}}>
          <RegionList style={{ width: 165 }}/>
       </Form.Item>
       </Row>
       <Row style={{paddingTop:8}}>
       <Form.Item label='监测点类型' name='pollutantType'  style={{paddingRight:'16px'}}>
        <Select placeholder='监测点类型' style={{width:120}}>      
           <Option value={2}>废气</Option>
           <Option value={1}>废水</Option>
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
    <div  className={styles.planWorkOrderStatisticsSty}>
    <BreadcrumbWrapper hideBreadcrumb={props.hideBreadcrumb}>
    <Card title={searchComponents()}>
      {showType==1? <Region isPlanCalibrationModal={isPlanCalibrationModal} isisPlanInspectionModal={isPlanInspectionModal} isActualCalibrationModal={isActualCalibrationModal} parentCallback={parentCallback} {...props} ref={pchildref}/> : <Ent parentCallback={parentCallback}/>}
   </Card>
   </BreadcrumbWrapper>
   
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);