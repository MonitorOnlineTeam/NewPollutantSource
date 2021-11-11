/**
 * 功  能：设备信息
 * 创建人：贾安波
 * 创建时间：2021.11.11
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer    } from 'antd';
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
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'deviceInfo'




const dvaPropsData =  ({ loading,deviceInfo }) => ({
  tableDatas:deviceInfo.tableDatas,
  pointDatas:deviceInfo.pointDatas,
  tableLoading:deviceInfo.tableLoading,
  tableTotal:deviceInfo.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addEquipmentInfo`],
  loadingEditConfirm: loading.effects[`${namespace}/editEquipmentInfo`],
  monitoringTypeList:deviceInfo.monitoringTypeList,
  manufacturerList:deviceInfo.manufacturerList,
  pollutantTypeList:deviceInfo.pollutantTypeList,
  // exportLoading: loading.effects[`${namespace}/exportProjectInfoList`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getEquipmentInfoList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getEquipmentInfoList`,
        payload:payload,
      })
    },
    addEquipmentInfo : (payload,callback) =>{ // 添加
      dispatch({
        type: `${namespace}/addEquipmentInfo`,
        payload:payload,
        callback:callback
      })
      
    },
    editEquipmentInfo : (payload,callback) =>{ // 修改
      dispatch({
        type: `${namespace}/editEquipmentInfo`,
        payload:payload,
        callback:callback
      })
      
    },
    delEquipmentInfo:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/delEquipmentInfo`, 
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
    getPollutantById:(payload,callback)=>{ //监测类型
      dispatch({
        type: `${namespace}/getPollutantById`, 
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
  
  const  { tableDatas,tableTotal,tableLoading,monitoringTypeList,manufacturerList,pollutantTypeList,loadingAddConfirm,loadingEditConfirm,exportLoading } = props; 
  useEffect(() => {
    onFinish();
    props.getManufacturerList({})
    props.getMonitoringTypeList({})
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
      title: '监测类别',
      dataIndex: 'MonitoringType',
      key:'MonitoringType',
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
        MonitoringType:record.MonitoringTypeID.toString()
      })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const del =  (record) => {
    props.delEquipmentInfo({ID:record.ID},()=>{
        onFinish();
    })
  };



  
  
  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();

  };

  const onFinish  = async () =>{  //查询
      
    try {
      const values = await form.validateFields();

      props.getEquipmentInfoList({
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk  = async () =>{ //添加 or 编辑弹框
  
    try {
      const values = await form2.validateFields();//触发校验
      type==='add'? props.addEquipmentInfo({
        ...values,
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      :
     props.editEquipmentInfo({
        ...values,
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  // const handleTableChange =   async (PageIndex, )=>{ //分页
  //   const values = await form.validateFields();
  //   setPageSize(PageSize)
  //   setPageIndex(PageIndex)
  //   props.getProjectInfoList({...values,PageIndex,PageSize})
  // }
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
             <Select placeholder='请选择设备厂家' allowClear style={{width:200}}>
                {
               manufacturerList[0]&&manufacturerList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                  })
                } 
              </Select>
      </Form.Item>
      <Form.Item label="系统名称" name="SystemName" style={{margin:'0 16px'}}  >
            <Input placeholder="请输入系统名称" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="系统型号" name="SystemModel" >
        <Input placeholder='请输入系统型号' style={{width:200}} allowClear/>

      </Form.Item>
      </Row>
      <Row>
      <Form.Item label="监测类型" name="MonitoringType"  >
             <Select placeholder='请选择监测类型' allowClear style={{width:200}}>
                 {
                  monitoringTypeList[0]&&monitoringTypeList.map(item => {
                    return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                  })
                }   
              </Select>
      </Form.Item>
      <Form.Item label="状态" name="Status"   style={{margin:'0 16px'}} >
       <Select placeholder='请选择状态' allowClear style={{width:200}}>
           <Option key={1} value={1}>启用</Option>
           <Option key={2} value={2}>停用</Option>
        </Select>
      </Form.Item>
      <Form.Item>
      <Button   type="primary" htmlType='submit' style={{marginRight:8}}>
          查询
     </Button>
     <Button   onClick={()=>{ add()}} >
          添加
     </Button>
     </Form.Item>
     </Row>
     </Form>
  }
  const dig = (path = '0', level = 3)=> {
    const list = [];
    for (let i = 0; i < 10; i += 1) {
      const key = `${path}-${i}`;
      const treeNode = {
        title: key,
        key,
      };
  
      if (level > 0) {
        treeNode.children = dig(key, level - 1);
      }
  
      list.push(treeNode);
    }
    return list;
  }
  return (
    <div  className={styles.deviceInfoSty}>

    <Drawer
          // title="导航菜单"
          placement={'left'}
          closable={false}
          // onClose={this.onClose}
          visible={true}
          width={320}
          mask={false}
          keyboard={false}
          zIndex={1}
          // getContainer={(Setting.layout === 'sidemenu' && config.isShowTabs) ? false : 'body'}
          bodyStyle={{ padding: '18px 8px' }}
          style={{
            marginTop: 64,
          }}
        >

    <Tree   treeData={dig()} height={233} defaultExpandAll />
    </Drawer>
    <BreadcrumbWrapper style={{marginLeft:320 }}>
    <Card title={searchComponents()}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        // pagination={{
        //   total:tableTotal,
        //   pageSize: pageSize,
        //   current: pageIndex,
        //   onChange: handleTableChange,
        // }}
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
        Status:1
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
        <Col span={24}>
        <Form.Item hidden  label="编号" name="SystemCode" >
        <InputNumber placeholder='请输入编号' />
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="设备厂家" name="ManufacturerID" rules={[  { required: true, message: '请输入设备厂家'  }]} >
             <Select placeholder='请选择设备厂家' allowClear>
                {
               manufacturerList[0]&&manufacturerList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                  })
                } 
              </Select>
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="系统名称" name="SystemName" rules={[  { required: true, message: '请输入系统名称'  }]} >
            <Input placeholder="请输入系统名称" allowClear/>
      </Form.Item>
      </Col>
      </Row>


      <Row>
      <Col span={12}>
        <Form.Item label="系统型号" name="SystemModel"  rules={[  { required: true, message: '请输入系统型号'  }]}>
        <Input placeholder='请输入系统型号' allowClear/>

      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="监测类型" name="MonitoringType" rules={[  { required: true, message: '请选择监测类型'  }]} >
             <Select placeholder='请选择监测类型' allowClear>
                 {
                  monitoringTypeList[0]&&monitoringTypeList.map(item => {
                    return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                  })
                }   
              </Select>
      </Form.Item>
      
      </Col>
      </Row>
      <Row>
        <Col span={12}>
        <Form.Item label="状态" name="Status" >
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