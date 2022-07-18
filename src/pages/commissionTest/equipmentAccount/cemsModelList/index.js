/**
 * 功  能：CEMS型号清单
 * 创建人：jab
 * 创建时间：2022.07.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Spin,   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined } from '@ant-design/icons';
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
import NumTips from '@/components/NumTips'
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'cemsModelList'




const dvaPropsData =  ({ loading,cemsModelList }) => ({
  tableDatas:cemsModelList.tableDatas,
  pointDatas:cemsModelList.pointDatas,
  tableLoading:cemsModelList.tableLoading,
  tableTotal:cemsModelList.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addSystemModel`],
  loadingEditConfirm: loading.effects[`${namespace}/editSystemModel`],
  monitoringTypeList:cemsModelList.monitoringTypeList,
  manufacturerList:cemsModelList.manufacturerList,
  // exportLoading: loading.effects[`${namespace}/exportProjectInfoList`],
  maxNum:cemsModelList.maxNum,
  systemModelNameList:cemsModelList.systemModelNameList,
  systemModelNameListLoading: loading.effects[`${namespace}/getSystemModelNameList`],

})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getSystemModelList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getSystemModelList`,
        payload:payload,
      })
    },
    addSystemModel : (payload,callback) =>{ // 添加
      dispatch({
        type: `${namespace}/addSystemModel`,
        payload:payload,
        callback:callback
      })
      
    },
    editSystemModel : (payload,callback) =>{ // 修改
      dispatch({
        type: `${namespace}/editSystemModel`,
        payload:payload,
        callback:callback
      })
      
    },
    delSystemModel:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/delSystemModel`, 
        payload:payload,
        callback:callback
      }) 
    },
    getManufacturerList:(payload,callback)=>{ //厂商列表
      dispatch({
        type: `${namespace}/getManufacturerList`, 
        payload:payload,
        callback:callback
      }) 
    },
    getMonitoringTypeList:(payload,callback)=>{ //监测类别
      dispatch({
        type: `${namespace}/getMonitoringTypeList`, 
        payload:payload,
        callback:callback
      }) 
    },
    getSystemModelNameList:(payload,callback)=>{ //系统名称
      dispatch({
        type: `${namespace}/getSystemModelNameList`, 
        payload:payload,
        callback:callback
      }) 
    },
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
  // const [pageSize,setPageSize] = useState(20)
  // const [pageIndex,setPageIndex] = useState(1)
  
  
  const isEditing = (record) => record.key === editingKey;
  
  const  { tableDatas,tableTotal,tableLoading,monitoringTypeList,manufacturerList,loadingAddConfirm,loadingEditConfirm,exportLoading,maxNum,systemModelNameList,systemModelNameListLoading } = props; 
  useEffect(() => {
    onFinish();
    props.getManufacturerList({pageIndex:1,pageSize:10000})
    props.getMonitoringTypeList({},()=>{})
    props.getSystemModelNameList({})
    
  },[]);

  const columns = [
    {
      title: '编号',
      dataIndex: 'SystemCode',
      key:'SystemCode',
      align:'center',
    },
    {
      title: '设备厂家',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    },
    {
      title: '系统名称',
      dataIndex: 'SystemName',
      key:'SystemName',
      align:'center',
    },
    {
      title: '系统型号',
      dataIndex: 'SystemModel',
      key:'SystemModel',
      align:'center',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key:'Status', 
      align:'center',
      render: (text, record) => {
        if (text === 1) {
          return <span><Tag color="blue">启用</Tag></span>;
        }
        if (text === 2) {
          return <span><Tag color="red">停用</Tag></span>;
        }
      },
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      width:180,
      render: (text, record) =>{
        return  <span>
               <Fragment><Tooltip title="编辑"> <a href="#" onClick={()=>{edit(record)}} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="确定要删除此条信息吗？"   style={{paddingRight:5}}  onConfirm={()=>{ del(record)}} okText="是" cancelText="否">
                  <a href="#" ><DelIcon/></a>
               </Popconfirm>
               </Tooltip>
               </Fragment> 
             </span>
      }
    },
  ];


  const edit = async (record) => {
    setFromVisible(true)
    setType('edit')
    form2.resetFields();
    try {
      form2.setFieldsValue({
        ...record,
        SystemName:record.ChildID,
        MonitoringType:record.MonitoringTypeID.toString()
      })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const del =  async(record) => {
    const values = await form.validateFields();
    props.delSystemModel({ID:record.ID},()=>{
      setPageIndex(1)
      props.getSystemModelList({
        pageIndex: 1,
        pageSize: pageSize,
        ...values,
      })
    })
  };



  
  
  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();
    form2.setFieldsValue({SystemCode:maxNum})
    if(monitoringTypeList&&monitoringTypeList[0]){ //监测类别默认值
      monitoringTypeList.map(item=>{
      if(item.Code==266){
       form2.setFieldsValue({MonitoringType:item.Code})
      }
    })
   }
  };



  const onFinish  = async (pageIndexs) =>{  //查询
      
    try {
      const values = await form.validateFields();
      
      pageIndexs&& typeof  pageIndexs === "number"? setPageIndex(pageIndexs) : setPageIndex(1); //除编辑  每次查询页码重置为第一页

      props.getSystemModelList({
        pageIndex: pageIndexs&& typeof  pageIndexs === "number"? pageIndexs: 1,
        pageSize: pageSize,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk  = async () =>{ //添加 or 编辑弹框
  
    try {
      const values = await form2.validateFields();//触发校验
      type==='add'? props.addSystemModel({
        ...values,
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      :
     props.editSystemModel({
        ...values,
      },()=>{
        setFromVisible(false)
        onFinish(pageIndex)
      })
      
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const [pageIndex,setPageIndex] = useState(1)
  const [pageSize,setPageSize] = useState(20)
  const handleTableChange =   async (PageIndex, PageSize)=>{ //分页
    const values = await form.validateFields();
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    props.getSystemModelList({...values,PageIndex,PageSize})
  }
  const searchComponents = () =>{
    return  <Form
    form={form}
    name="advanced_search"
    initialValues={{
      // Status:1
    }}
    className={styles["ant-advanced-search-form"]}
    onFinish={onFinish}
  >   
      <Row>
        <Form.Item label="设备厂家" name="ManufacturerID" >
             <Select placeholder='请选择设备厂家' allowClear showSearch
             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
             style={{width:200}}>
                {
               manufacturerList[0]&&manufacturerList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                  })
                } 
              </Select>
      </Form.Item>
      <Form.Item label="系统名称" name="SystemName"  style={{margin:'0 16px'}}>
              {systemModelNameListLoading?<Spin size='small'/>
              :
              <Select placeholder='请选择系统名称' allowClear style={{width:200}}>
              {
               systemModelNameList[0]&&systemModelNameList.map(item => {
                 return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
               })
             }   
           </Select>
        }
      </Form.Item>

      </Row>
      <Row>
       <Form.Item label="型号" name="SystemModel" >
        <Input placeholder='请输入系统型号' style={{width:200}} allowClear/>

      </Form.Item>
      <Form.Item label="状态" name="Status"   style={{margin:'0 16px'}}  >
       <Select placeholder='请选择状态' allowClear style={{width:200}}>
           <Option key={1} value={1}>启用</Option>
           <Option key={2} value={2}>停用</Option>
        </Select>
      </Form.Item>
      <Form.Item>
      <Button   type="primary" htmlType='submit' style={{marginRight:8}}>
          查询
     </Button>
     <Button   onClick={()=>{ form.resetFields()}} style={{marginRight:8}}>
          重置
     </Button>
     <Button   onClick={()=>{ add()}} >
          添加
     </Button>
     </Form.Item>
     </Row>
     </Form>
  }

  return (
    <div  className={styles.cemsModelListSty}>
    <BreadcrumbWrapper>
    <Card title={searchComponents()}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={{
          total:tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />
   </Card>
   </BreadcrumbWrapper>
   
   <Modal
        title={type==='add'? '添加':'编辑'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={type==='add'? loadingAddConfirm:loadingEditConfirm}
        onCancel={()=>{setFromVisible(false)}}
        className={styles.fromModal}
        destroyOnClose
        centered
      >
        <Form
      name="basic"
      form={form2}
      initialValues={{
        // Status:1
      }}
    >
      <Row>
        <Col span={24}>
      <Form.Item   name="ID" hidden>
          <Input />
      </Form.Item> 
      </Col>
      </Row>

      <Row>
        <Col span={12}>
        <Form.Item   label="编号" name="SystemCode" >
        <InputNumber placeholder='请输入编号' />
      </Form.Item>
      <NumTips />
      </Col>
        <Col span={12}>
        <Form.Item label="设备厂家" name="ManufacturerID" rules={[  { required: true, message: '请选择设备厂家'  }]} >
             <Select placeholder='请选择' allowClear showSearch
             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
             
             >
                {
               manufacturerList[0]&&manufacturerList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                  })
                } 
              </Select>
      </Form.Item>
      </Col>
      </Row>

      <Row>
      <Col span={12}>
        <Form.Item label="系统名称" name="SystemName" rules={[  { required: true, message: '请选择系统名称'  }]} >
              {systemModelNameListLoading?<Spin size='small'/>
              :
              <Select placeholder='请选择' allowClear>
              {
               systemModelNameList[0]&&systemModelNameList.map(item => {
                 return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
               })
             }   
           </Select>
        }
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="系统型号" name="SystemModel"  rules={[  { required: true,  }]}>
        <Input placeholder='请输入' allowClear/>
      </Form.Item>
      </Col>
      </Row>

      <Row>
 
        <Col span={12}>
        <Form.Item label="状态" name="Status" rules={[  { required: true, message: '请选择状态'  }]} >
           <Radio.Group>
             <Radio value={1}>启用</Radio>
             <Radio value={2}>停用</Radio>
         </Radio.Group>
      </Form.Item>
      </Col>
      </Row>

     
    </Form>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);