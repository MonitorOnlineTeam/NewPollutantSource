/**
 * 功  能：项目管理
 * 创建人：贾安波
 * 创建时间：2021.08.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import styles from "./style.less"
const { Option } = Select;

const namespace = 'projectManager'




const dvaPropsData =  ({ loading,projectManager }) => ({
  tableDatas:projectManager.tableDatas,
  parametersList:projectManager.parametersList,
  loadingConfirm: loading.effects[`${namespace}/getParametersInfo`],
  loadingPoint: loading.effects[`${namespace}/getParametersInfo`],
  pointLoading: loading.effects[`${namespace}/getParametersInfo`],
  exportLoading: loading.effects[`${namespace}/getParametersInfo`],
  exportPointLoading: loading.effects[`${namespace}/getParametersInfo`],
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
  const [form2] = Form.useForm();

  const [data, setData] = useState([]);

  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(513);
  const [DGIMN,setDGIMN] =  useState('')
  const [expand,setExpand] = useState(false)
  const [fromVisible,setFromVisible] = useState(false)
  const [tableVisible,setTableVisible] = useState(false)

  const [type,setType] = useState('add')

  
  const isEditing = (record) => record.key === editingKey;
  
  const  { tableDatas,parametersList,loadingConfirm,loadingPoint,tableLoading,pointLoading,exportLoading,exportPointLoading } = props; 
  useEffect(() => {
      getEquipmentParametersInfo({DGIMN:props.DGIMN})
      getParametersInfos();

    
  },[props.DGIMN]);
 
  const getEquipmentParametersInfo=()=>{
    props.getEquipmentParametersInfo({PolltantType:type==='smoke'?2:1})
  }

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
      sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
    },
    {
      title: '运营结束日期',
      dataIndex: 'operations',
      align:'center',
      sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
      
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
      defaultSortOrder: 'descend',
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
               
               <Fragment> <Tooltip title="详情">
                 <Link  style={{padding:'0 5px'}} to={{  pathname: '/platformconfig/basicInfo/projectManager/detail',
                       query: { RegionCode: record.RegionCode},
                       }}
                       >
                    <DetailIcon />
                </Link>
                </Tooltip><Divider type="vertical" /></Fragment>

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

  const pointColumns = [
    {
      title: '监控目标',
      dataIndex: 'EquipmentParametersCode',
      align:'center'
    },
    {
      title: '监测点',
      dataIndex: 'Range1',
      align:'center',
    },
    {
      title: '实际运营开始日期',
      dataIndex: 'Range2',
      align:'center',
    },
    {
      title: '实际运营结束日期',
      dataIndex: 'Range2',
      align:'center',
    },
  ]
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


  const operaInfo = async (record) => {
   setTableVisible(true)
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
    setFromVisible(true)

  };
  const exports = () => {

 };
 
 const pointExports = () => {

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
      const values = await form2.validateFields();
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
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
       <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
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
      name="basic"
      form={form2}
    >
      <Row>
        <Col span={12}>
        <Form.Item label="合同名称" name="username" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Input placeholder='请输入合同名称'/>
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="项目编号" name="username2" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Input  placeholder='请输入项目编号'/>
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="客户所在地" name="username3" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Select placeholder="请选择客户所在地">
          <Option value="1">小学</Option>


        </Select>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="卖方公司" name="username4" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Input  placeholder='请输入卖方公司'/>
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
        <Form.Item label="行业" name="username5" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Input placeholder='请输入行业'/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="签订人" name="username6" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Input placeholder='请输入签订人'/>
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
        <Form.Item label="运营起始日期" name="username7" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <DatePicker />
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="运营结束日期" name="username8" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <DatePicker />
      </Form.Item>
      </Col>
      </Row>


      <Row>
        <Col span={12}>
        <Form.Item label="运营套数" name="username9" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <InputNumber placeholder='请输入运营套数'/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="运营月数" name="username99" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <InputNumber placeholder='请输入运营月数'/>
      </Form.Item>
      </Col>
      </Row>

      <Row align='middle'>
        <Col span={12}>

      <Form.Item label="合同总金额(万)" name="username999" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Input placeholder='请输入合同总金额'/>
      </Form.Item>
      </Col>
        <Col span={12}>
        <Form.Item label="备注" name="username998" rules={[  { required: true, message: 'Please input your username!',  },]} >
        <Input placeholder='请输入备注'/>
      </Form.Item>
       </Col>
      </Row> 
      <Form.Item label="ID"  name="username9898" hidden>
          <Input />
      </Form.Item> 
    </Form>
      </Modal>

      <Modal
        title='添加合同'
        visible={tableVisible}
        onCancel={()=>{setTableVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
      <Button style={{marginBottom:10}}  icon={<ExportOutlined />}  loading={exportPointLoading}  onClick={()=>{ pointExports()} }>
            导出
          </Button> 
       <SdlTable
        loading = {pointLoading}
        bordered
        // dataSource={data}
        columns={pointColumns}
      />
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);