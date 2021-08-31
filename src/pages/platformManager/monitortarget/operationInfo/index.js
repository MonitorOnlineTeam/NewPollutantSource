/**
 * 功  能：企业下运维信息管理
 * 创建人：贾安波
 * 创建时间：2021.08.24
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Popover    } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,RollbackOutlined  } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import styles from "./style.less"
const { Option } = Select;

const namespace = 'operationInfo'




const dvaPropsData =  ({ loading,operationInfo }) => ({
  tableDatas:operationInfo.tableDatas,
  projectTableDatas:operationInfo.projectTableDatas,
  loadingConfirm: loading.effects[`${namespace}/getParametersInfo`],
  loadingPoint: loading.effects[`${namespace}/getParametersInfo`],
  exportLoading: loading.effects[`${namespace}/getParametersInfo`],
  projectTableLoading: loading.effects[`${namespace}/getParametersInfo`],
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

  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(513);
  const [DGIMN,setDGIMN] =  useState('')
  const [expand,setExpand] = useState(false)
  const [fromVisible,setFromVisible] = useState(true)
  const [tableVisible,setTableVisible] = useState(false)
  const [popVisible,setPopVisible] = useState(false)

  const [type,setType] = useState('add')
  
  
  const isEditing = (record) => record.key === editingKey;
  
  const  { tableDatas,projectTableDatas,loadingConfirm,loadingPoint,tableLoading,exportLoading,projectTableLoading } = props; 

  
  useEffect(() => {
      getEquipmentParametersInfo({DGIMN:props.DGIMN})
      getParametersInfos();
    console.log(props)
    
  },[props.DGIMN]);
 
  const getEquipmentParametersInfo=()=>{
    props.getEquipmentParametersInfo({PolltantType:type==='smoke'?2:1})
  }

  const getParametersInfos=()=>{
    props.getParametersInfo({PolltantType:type==='smoke'?2:1})
  }
  const columns = [
    {
      title: '监测点',
      dataIndex: 'EquipmentParametersCode',
      align:'center'
    },
    {
      title: '运维单位',
      dataIndex: 'EquipmentParametersCode',
      align:'center'
    },
    {
      title: '项目编号',
      dataIndex: 'Range1',
      align:'center',
    },
    {
      title: '省区名称',
      dataIndex: 'DetectionLimit',
      align:'center',
    },
    {
      title: '运营起始日期',
      dataIndex: 'Unit',
      align:'center',
      sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
    },
    {
      title: '运营结束日期',
      dataIndex: 'operations',
      align:'center',
      sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
      
    },
    {
      title: '实际开始日期',
      dataIndex: 'Unit',
      align:'center',
      sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
    },
    {
      title: '实际结束日期',
      dataIndex: 'operations',
      align:'center',
      sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
      
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) =>{
        return  <span>
               <Fragment><Tooltip title="编辑"> <a href="#" onClick={()=>{edit(record)}} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
               

               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="确定要删除此条信息吗？"   style={{paddingRight:5}}  onConfirm={del(record)} okText="是" cancelText="否">
                  <a href="#" ><DelIcon/></a>
               </Popconfirm>
               </Tooltip>
               </Fragment> 
             </span>
      }
    },
  ];

const projectNumCol =[
  {
    title: '项目编号',
    dataIndex: 'Range1',
    align:'center',
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
    dataIndex: 'operations',
    align:'center',
    
  },
  {
    title: <span>操作</span>,
    dataIndex: 'x',
    key: 'x',
    align: 'center',
    render: (text, record) =>{
      return<Button size='small' type="primary" onClick={()=>{ choice()}} >选择</Button>
    }
  },
  ]

  const choice = () =>{

  }

  const del = async (record) => {
    // const dataSource = [...data];
    // let newData = dataSource.filter((item) => item.ID !== ID)
    // setTableLoading(true)
    // props.deleteEquipmentParametersInfo({ID:ID},()=>{
    //    setTableLoading(false)
    //    setData(newData)
    // })
  };


  const save = async (record) => {

    try {


      
    } catch (errInfo) {
      message.warning("请输入测量参数和设置量程范围1")
      console.log('错误信息:', errInfo);
    }
  };

  
  const add = () => {

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
    // setFromVisible(true)

  };
  const edit = async (record) => {
    form.setFieldsValue({ username3: undefined,username4:'1' });
    setFromVisible(true)
    try {
    //   const row = await form.validateFields();//触发校验

    } catch (errInfo) {
    console.log('Validate Failed:', errInfo);
    }
  };

  const exports = () => {

 };
 

  const onFinish  = async () =>{  //查询
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk  = async () =>{ //添加 or 编辑弹框
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const  projectNumQuery = ()=>{
    console.log(1111)
 }
  
  const searchComponents = () =>{
     return  <Form
    name="advanced_search"
    className={styles['ant-advanced-search-form']}
    onFinish={onFinish}
  >  
   <Row> 
  <span className='ant-modal-title'>{props.location.query.entName}</span>
   </Row>
         <Row> 
         <Form.Item name='customAdress' label='客户所在地' >
            <Select placeholder="请输入客户所在地" >
              <Option> </Option>
            </Select>
          </Form.Item>
          <Form.Item name='projectNum' style={{margin:'20px 12px'}}  label='项目编号' >
            <Input placeholder="请输入项目编号" />
          </Form.Item>
        <Form.Item>
        <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{  margin: '0 8px',}} onClick={() => {  form.resetFields(); }}  >
            重置
          </Button>
          <Button onClick={() => {props.history.go(-1);   }} ><RollbackOutlined />返回</Button>
          </Form.Item>
      </Row>  
      <Row  align='middle'>
     <Button  icon={<PlusOutlined />} type="primary" onClick={()=>{ add()}} >
          添加
     </Button>
       <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
            导出
          </Button> 
      </Row>   
     </Form>
  }
  return (
    <div  className={styles.entOperationInfo}>
    <BreadcrumbWrapper>
    <Card title={searchComponents()}>
      <SdlTable
        loading = {tableLoading}
        bordered
        // dataSource={tableDatas}
        dataSource={data}
        columns={columns}
      />
   </Card>
   </BreadcrumbWrapper>
   
   <Modal
        title={type==='edit'? '编辑合同':'添加合同'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={loadingConfirm}
        onCancel={()=>{setFromVisible(false)}}
        className={styles.fromModal}
        destroyOnClose
        centered
      >
    <Form
      name="basic2"
      form={form}
    >
      <Row>
        <Col span={12}>
        <Form.Item label="监测点列表" name="username" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Select placeholder="请选择监测点列表">
          <Option value="1">小学</Option>
        </Select>
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="运维单位" name="username2" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Select placeholder="请选择运维单位">
          <Option value="1">小学</Option>
        </Select>
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="项目编号" name="username3"  rules={[  { required: true, message: 'Please input your username!',  },]} >
          <Popover
            content={<>
              <Row>
              <Form.Item  style={{marginRight:8}}  label='项目编号' >
                  <Input placeholder="请输入项目编号" />
                </Form.Item>
              <Form.Item>
               <Button type="primary" onClick={projectNumQuery}>
               查询
             </Button>
             </Form.Item>
             </Row>
               <SdlTable style={{width:800}} loading = {projectTableLoading} bordered    dataSource={projectTableDatas}   columns={projectNumCol}  />
               </>}
            title=""
            trigger="click"
            visible={popVisible}
            onVisibleChange={(visible )=>{setPopVisible(visible)}}
            placement="bottom"
          >
           <Select value={form.getFieldValue('username3')} dropdownClassName={styles.projectNumSty} placeholder="请选择省份名称"> </Select>
      </Popover>
      </Form.Item> 
      </Col>
      <Col span={12}>
      <Form.Item label="省份名称" name="username4" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Select placeholder="请选择省份名称">
          <Option value="1">小学</Option>
        </Select>
      </Form.Item>
      </Col>
      </Row>



      <Row>
        <Col span={12}>
        <Form.Item label="实际起始日期" name="username5" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <DatePicker />
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="实际结束日期" name="username6" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <DatePicker />
      </Form.Item>
      </Col>
      </Row>
      <Form.Item label="ID"  name="username7" hidden>
          <Input />
      </Form.Item> 
    </Form>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);