/**
 * 功  能：设备故障反馈
 * 创建人：贾安波
 * 创建时间：2021.1.21
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

const namespace = 'equipmentFeedback'




const dvaPropsData =  ({ loading,equipmentFeedback,global }) => ({
  tableDatas:equipmentFeedback.regTableDatas,
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
    regGetConsumablesRIHList:(payload)=>{ // 省级
      dispatch({
        type: `${namespace}/regGetConsumablesRIHList`,
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
  const onExport = () =>{
    console.log('导出')
  }
  const [expand, setExpand] = useState(true)
  return (
    <div  className={styles.equipmentFeedbackSty}>

    <BreadcrumbWrapper>
    <Card title={
    <Form
    form={form}
    name="advanced_search"
    onFinish={onFinish}
    initialValues={{
      pollutantType:type,
      abnormalType:1,
      time:time
    }}
    className={styles.queryForm}
  >  
     <Row>
       <Col span={6}>
     <Form.Item label='行政区' name='pollutantType' >
       <RegionList />
       </Form.Item>
       </Col>
       <Col span={6}>
       <Form.Item  label='企业' name='pollutantType'>
        <Select showSearch placeholder='请选择'>
            {/* {
            options.map(item => {
              return <Option value={item.value}>{item.label}</Option>
            })
          } */}
           </Select>
       </Form.Item>
       </Col>
       <Col span={6}>
       <Form.Item label='监测点' name='pollutantType' >
        <Select placeholder='请选择'>
            {/* {
            options.map(item => {
              return <Option value={item.value}>{item.label}</Option>
            })
          } */}
           </Select>
       </Form.Item>
       </Col>
       <Col span={6}>
       <Form.Item label='故障单元' name='pollutantType'>
         <Input placeholder='请输入'/>
       </Form.Item>
       </Col>

      </Row>
       {expand&&<Row>
      <Col span={6}>
      <Form.Item label='故障时间' name='time'>
         <RangePicker allowClear={false} />
      </Form.Item> 
      </Col>
      <Col span={6}>
      <Form.Item label='主机名称型号' name='pollutantType'>
         <Input placeholder='请输入'/>
       </Form.Item>
       </Col>
       <Col span={6}>
       <Form.Item label='故障现象' name='pollutantType'>
         <Input placeholder='请输入'/>
       </Form.Item>
       </Col>
       <Col span={6}>
          <Form.Item label='处理状态' name='pollutantType' >
            <Radio.Group>
            <Radio value={1}>待解决</Radio>
            <Radio value={2}>已解决</Radio>
          </Radio.Group>
       </Form.Item>
       </Col>
       </Row>}
       <Form.Item>
       <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{  margin: '0 8px'}} onClick={() => {  form.resetFields(); }}  >
            重置
          </Button> 
          <Button style={{  marginRight: 8}}  icon={<ExportOutlined />} onClick={onExport}>
              导出
            </Button>
    <a  onClick={() => {setExpand(!expand);  }} >
       {expand ? <>收起 <UpOutlined /></>  : <>展开 <DownOutlined /></>} 
      </a>
    </Form.Item>
  </Form>}>
  <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={ columns}
        scroll={{ y: clientHeight - 500}}
        pagination={false}
      />
   </Card>
    </BreadcrumbWrapper>
    </div>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);