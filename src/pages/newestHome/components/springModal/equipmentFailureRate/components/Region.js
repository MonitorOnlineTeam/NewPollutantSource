/**
 * 功  能：设备故障率
 * 创建人：jab
 * 创建时间：2021.2.25
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Spin, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Checkbox,   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,RollbackOutlined } from '@ant-design/icons';
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
import RegionDetail from './RegionDetail'
import point from '@/models/point';

const namespace = 'equipmentFailureRate'



const dvaPropsData =  ({ loading,equipmentFailureRate,global,point }) => ({
  tableDatas:equipmentFailureRate.regTableDatas,
  tableLoading: loading.effects[`${namespace}/regGetFailureRateList`],
  exportLoading: equipmentFailureRate.exportRegLoading,
  clientHeight: global.clientHeight,
  queryPar:equipmentFailureRate.queryPar,
  paramCodeListLoading: loading.effects[`point/getParamCodeList`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    regGetFailureRateList:(payload)=>{ // 行政区
      dispatch({
        type: `${namespace}/regGetFailureRateList`,
        payload:payload,
      })
    },
    getParamCodeList:(payload,callback)=>{ // 设备参数类别
      dispatch({
        type: `point/getParamCodeList`,
        payload:payload,
        callback:callback
      })
    },
    exportFailureRateList:(payload)=>{ // 导出
      dispatch({
        type: `${namespace}/exportFailureRateList`,
        payload:payload,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [dates, setDates] = useState([]);
  const  { tableDatas,tableLoading,exportLoading,clientHeight,type,time,queryPar,paramCodeListLoading } = props; 
  
  
  useEffect(() => {
    initData();
  
  },[]);

  
  const [parType,setParType] = useState([])
  const initData = () =>{
    
    props.getParamCodeList({pollutantType:type},(data)=>{
      setParType(data)
      form.setFieldsValue({parameterCategory:data.map(item=>item.value) })
      onFinish();
    })  
  }

  const exports = async  () => {
    const values = await form.validateFields();
      props.exportFailureRateList({
        ...values,
        time:undefined,
        beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
        parameterCategory:values.parameterCategory? values.parameterCategory.toString() :'',
        pointType:1,
    })

 };

 const columns = [
  {
    title: '序号',
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
    render:(text,record,index)=>{
      return  <Button type="link" onClick={()=>{ regionDetail(record)  }} >{text}</Button>
    }
  },
  {
    title: '运维企业数',
    dataIndex: 'entCount',
    key:'entCount',
    align:'center',
    sorter: (a, b) => a.entCount - b.entCount,
  },
  {
    title: '运维监测点数',
    dataIndex: 'pointCount',
    key:'pointCount',
    align:'center',
    sorter: (a, b) => a.pointCount - b.pointCount,
  },
  {
    title: '故障率',
    dataIndex: 'failureRate',
    key: 'failureRate',
    width: 150,
    align:'center',
    sorter: (a, b) => a.failureRate - b.failureRate,
    render: (text, record) => {
      return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
    }
  }
]


  const onFinish  = async () =>{  //查询

    try {
      const values = await form.validateFields();
      const par = {
        ...values,
        time:undefined,
        beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
        parameterCategory:values.parameterCategory? values.parameterCategory.toString() :'',
        pointType:1,
      }
        props.regGetFailureRateList({ ...par  })
        props.updateState({
          queryPar:{ ...par }
        })
        
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  
  const [regionDetailVisible,setRegionDetailVisible] = useState(false)

  const regionDetail = (row) =>{ 
    setRegionDetailVisible(true)
    props.updateState({
      queryPar:{
        ...props.queryPar,
        regionCode:row.regionCode
      }
    })
  }

  
  const onValuesChange = (hangedValues, allValues)=>{
    if(Object.keys(hangedValues).join() == 'pollutantType'){
      props.getParamCodeList({pollutantType:hangedValues.pollutantType},(data)=>{
        setParType(data)
        form.setFieldsValue({parameterCategory:data.map(item=>item.value) })
      }) 
    }
  }
  


  
  return (
    <div  className={styles.equipmentFailureRateSty}>
   {!regionDetailVisible? <><Form
    form={form}
    name="advanced_search"
    onFinish={onFinish}
    initialValues={{
      pollutantType:type,
      time:time,
    }}
    style={{paddingBottom:15}}
    loading={tableLoading}
    onValuesChange={onValuesChange}
  >  
  <Row>
     <Form.Item label='日期' name='time'  style={{paddingRight:'16px'}}>
         <RangePicker allowClear={false} style={{width:'100%'}} 
          showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}/>
    </Form.Item> 
    <Form.Item label='监测点类型' name='pollutantType'  style={{paddingRight:'16px'}}>
        <Select placeholder='请选择' style={{width:150}}>
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
    </Row>
    <Row style={{paddingTop:8}}>
    <Form.Item label='设备参数类别' name='parameterCategory'>
      {paramCodeListLoading? <Spin size='small'/> :
      <Checkbox.Group  options={parType} />
       } 
       </Form.Item>
    </Row>
  </Form>

  <SdlTable
        loading = {paramCodeListLoading || tableLoading }
        bordered
        dataSource={tableDatas}
        columns={ columns}
        pagination={false}
      />
      </>
      :
   
     <RegionDetail  onGoBack={()=>{setRegionDetailVisible(false)}}/>  // 行政区详情弹框 
    }

        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);