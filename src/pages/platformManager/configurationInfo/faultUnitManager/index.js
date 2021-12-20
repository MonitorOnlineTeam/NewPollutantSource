/**
 * 功  能：故障单元管理
 * 创建人：贾安波
 * 创建时间：2021.09.24
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
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

const namespace = 'faultUnitManager'




const dvaPropsData =  ({ loading,faultUnitManager }) => ({
  tableDatas:faultUnitManager.tableDatas,
  pointDatas:faultUnitManager.pointDatas,
  tableLoading:faultUnitManager.tableLoading,
  tableTotal:faultUnitManager.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addFaultUnit`],
  loadingEditConfirm: loading.effects[`${namespace}/editFaultUnit`],
  equipmentTypeList:faultUnitManager.equipmentTypeList,
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
    getFaultUnitList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getFaultUnitList`,
        payload:payload,
      })
    },
    addFaultUnit : (payload,callback) =>{ // 添加
      dispatch({
        type: `${namespace}/addFaultUnit`,
        payload:payload,
        callback:callback
      })
      
    },
    editFaultUnit : (payload,callback) =>{ // 修改
      dispatch({
        type: `${namespace}/editFaultUnit`,
        payload:payload,
        callback:callback
      })
      
    },
    delFaultUnit:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/delFaultUnit`, 
        payload:payload,
        callback:callback
      }) 
    },
    getTestingEquipmentList:(payload,callback)=>{ //监测设备类别
      dispatch({
        type: `${namespace}/getTestingEquipmentList`, 
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
  
  const  { tableDatas,tableTotal,tableLoading,equipmentTypeList,loadingAddConfirm,loadingEditConfirm,exportLoading } = props; 
  useEffect(() => {
    onFinish();
    props.getTestingEquipmentList({});
  },[]);

  const columns = [
    {
      title: '编号',
      dataIndex: 'FaultUnitCode',
      key:'FaultUnitCode',
      align:'center',
    },
    {
      title: '故障单元名称',
      dataIndex: 'FaultUnitName',
      key:'FaultUnitName',
      align:'center',
    },
    {
      title: '监测设备类别',
      dataIndex: 'PollutantTypeName',
      key:'PollutantTypeName',
      align:'center'
    },
    {
      title: '是否主机',
      dataIndex: 'IsMaster',
      key:'IsMaster', 
      align:'center',
      render: (text, record) => {
        if (text === 1) {
          return <span>是</span>;
        }
        if (text === 2) {
          return <span>否</span>;
        }
      },
    },  
    {
      title: '使用状态',
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
      })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const del =  (record) => {
    props.delFaultUnit({ID:record.ID},()=>{
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

      props.getFaultUnitList({
        pageIndex: 1,
        pageSize: 10000,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk  = async () =>{ //添加 or 编辑弹框
  
    try {
      const values = await form2.validateFields();//触发校验
      type==='add'? props.addFaultUnit({
        ...values,
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      :
     props.editFaultUnit({
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
    className={styles['ant-advanced-search-form']}
    layout='inline'
    initialValues={{
      IsMaster:1,
      // Status:1
    }}
    onFinish={onFinish}
  >  
      <Form.Item label="监测设备类别" name="PollutantType"   >
       <Select placeholder='请选择监测设备类别' allowClear style={{width:200}}>
              {
               equipmentTypeList[0]&&equipmentTypeList.map(item => {
                    return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                  })
                } 
        </Select>
      </Form.Item>
      <Form.Item label="状态" name="Status" >
        <Select placeholder='请选择状态' allowClear style={{width:200}}>
           <Option key={1} value={1}>启用</Option>
           <Option key={2} value={2}>停用</Option>
        </Select>
      </Form.Item>
      <Form.Item>
      <Button   type="primary" htmlType='submit'  style={{marginRight:8}}>
          查询
     </Button>
     <Button   onClick={()=>{ add()}} >
          添加
     </Button>
     </Form.Item>
     </Form>
  }
  return (
    <div  className={styles.faultUnitManagerSty}>
    <BreadcrumbWrapper>
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
        IsMaster:1,
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
        <Form.Item label="故障单元名称" name="FaultUnitName" rules={[  { required: true, message: '请输入故障单元名称'  }]} >
        <Input placeholder='请输入故障单元名称'/>
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={24}>
        <Form.Item label="监测设备类别" name="PollutantType"  rules={[  { required: true, message: '请选择监测设备类别'  }]}>
              <Select placeholder='请选择监测设备类别' allowClear>
               {
                equipmentTypeList[0]&&equipmentTypeList.map(item => {
                    return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                  })
                } 
            </Select>
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={24}>
        <Form.Item label="是否主机" name="IsMaster" >
           <Radio.Group>
             <Radio value={1}>是</Radio>
             <Radio value={2}>否</Radio>
         </Radio.Group>
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={24}>
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