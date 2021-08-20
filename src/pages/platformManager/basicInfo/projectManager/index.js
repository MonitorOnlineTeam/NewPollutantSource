/**
 * 功  能：项目管理
 * 创建人：贾安波
 * 创建时间：2021.08.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider  } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'

import styles from "./style.less"
const { Option } = Select;

const namespace = 'projectManager'




const dvaPropsData =  ({ loading,projectManager }) => ({
  tableDatas:projectManager.tableDatas,
  parametersList:projectManager.parametersList
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
        callback:callback
      })
    },
    getParametersInfo:(payload)=>{ //下拉列表测量参数
      dispatch({
        type: `${namespace}/getParametersInfo`,
        payload:payload
      }) 
    },
    deleteEquipmentParametersInfo:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/deleteEquipmentParametersInfo`, 
        payload:payload,
        callback:callback
      }) 
    }
  }
}
const Index = (props) => {



  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(513);
  const [DGIMN,setDGIMN] =  useState('')
  const [expand,setExpand] = useState(false)
  const isEditing = (record) => record.key === editingKey;

  const  { type , tableDatas,parametersList } = props; 
  useEffect(() => {

      setTableLoading(true)
      props.getEquipmentParametersInfo({DGIMN:props.DGIMN},(res)=>{
        setTableLoading(false)
        setData(res)
      })
      getParametersInfos();

    
  },[props.DGIMN]);
 
  const getParametersInfos=()=>{
    props.getParametersInfo({PolltantType:type==='smoke'?2:1})
  }
  const columns = [
    {
      title: '合同名称',
      dataIndex: 'EquipmentParametersCode',
      align:'center'
    },
    {
      title: '项目编号',
      dataIndex: 'Range1',
      align:'center',
    },
    {
      title: '客户所在地',
      dataIndex: 'Range2',
      align:'center',
      render:(text,record)=>{

      }
    },
    {
      title: '卖方公司名称',
      dataIndex: 'DetectionLimit',
      align:'center',
    },
    {
      title: '运营起始日期',
      dataIndex: 'Unit',
      align:'center',
    },
    {
      title: '运营结束日期',
      dataIndex: 'operation',
      align:'center',
      render: (text, record) => {
      },
      
    },
    {
      title: '运营套数',
      dataIndex: 'operation',
      align:'center',
    },
    {
      title: '创建人',
      dataIndex: 'operation',
      align:'center',
    },
    {
      title: '创建时间',
      dataIndex: 'operation',
      align:'center',
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) =>{
        return  <span>
               <Fragment><Tooltip title="编辑"> <a href="#" onClick={()=>{edit(record)}} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
               
               <Fragment> <Tooltip title="详情">  <a href="javasctipt:;"  style={{padding:'0 5px'}} onClick={()=>{this.see(record)}} ><DetailIcon /></a></Tooltip><Divider type="vertical" /></Fragment>

               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="确定要删除此条信息吗？"   style={{paddingRight:5}}  onConfirm={del(record)} okText="是" cancelText="否">
                  <a href="#" ><DelIcon/></a>
               </Popconfirm>
               </Tooltip>
               <Divider type="vertical" />
               <Fragment> <Tooltip title="运维监测点信息">  <a href="javasctipt:;" onClick={()=>{operaInfo(record)}} ><PointIcon /></a></Tooltip></Fragment>
               
               </Fragment> 
             </span>
      }
    },
  ];
  const edit = async (record) => {

    try {
    //   const row = await form.validateFields();//触发校验

   

    } catch (errInfo) {
    console.log('Validate Failed:', errInfo);
    }
  };

  const del = async (record) => {
    // const dataSource = [...data];
    // let newData = dataSource.filter((item) => item.ID !== ID)
    // setTableLoading(true)
    // props.deleteEquipmentParametersInfo({ID:ID},()=>{
    //    setTableLoading(false)
    //    setData(newData)
    // })
  };

  const see = async (record) => {

  };
  const operaInfo = async (record) => {

  };
  
  const save = async (record) => {

    try {


      
    } catch (errInfo) {
      message.warning("请输入测量参数和设置量程范围1")
      console.log('错误信息:', errInfo);
    }
  };

  
  const add = () => {

     setCount(count+1)
     const newData = {
      DetectionLimit: "",
      EquipmentParametersCode: "",
      ID: count,
      Range1: '',
      Range2: '',
      Unit: "",
      editable:true,
      type:'add'
     }
    setData([...data,newData])
   

  };
  const exports = () => {


  

 };

  const onFinish =()=>{

  }
  const searchComponents = () =>{
     return  <Form
    form={form}
    name="advanced_search"
    className={styles['ant-advanced-search-form']}
    onFinish={onFinish}
  >  
         <Row> 
         <Col span={8}>
          <Form.Item   name='filed-1' label='合同名称'>
            <Input placeholder="请输入合同名称" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='filed-2' label='项目编号' >
            <Input placeholder="请输入项目编号" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='filed-3' label='运营起始日期' >
          <RangePicker_  type='simple' style={{width:'100%'}}    showTime="HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
          </Form.Item>
        </Col>  
        {expand&&<><Col span={8}>
          <Form.Item   name='filed-11' label='卖方公司名称'>
            <Input placeholder="请输入卖方公司名称" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='filed-12' label='客户所在地' >
            <Select placeholder="请输入客户所在地" >
              <Option> </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='filed-13' label='运营结束日期' >
          <RangePicker_  type='simple' style={{width:'100%'}}    showTime="HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
          </Form.Item>
        </Col></>}
        </Row>   
        <Row justify='end' align='middle'>  
        <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{  margin: '0 8px',}} onClick={() => {  form.resetFields(); }}  >
            重置
          </Button>
      <a  onClick={() => {setExpand(!expand);  }} >
       {expand ? <>收起 <UpOutlined /></>  : <>展开 <DownOutlined /></>} 
      </a>
      </Row>  
      <Row  align='middle'>
     <Button  icon={<PlusOutlined />} type="primary" onClick={()=>{ add()}} >
          添加
     </Button>
       <Button icon={<ExportOutlined />} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
            导出
          </Button> 
      </Row>   
     </Form>
  }
  return (
    <div  className={styles.projectManagerSty}>
    <BreadcrumbWrapper>
    <Card title={searchComponents()}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={data}
        columns={columns}
      />
   </Card>
   </BreadcrumbWrapper>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);