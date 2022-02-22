/**
 * 功  能：定时器管理
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
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'timerManage'




const dvaPropsData =  ({ loading,timerManage }) => ({
  tableDatas:timerManage.tableDatas,
  pointDatas:timerManage.pointDatas,
  tableLoading:timerManage.tableLoading,
  tableTotal:timerManage.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addOnlineTimerManage`],
  loadingEditConfirm: loading.effects[`${namespace}/editOnlineTimerManage`],
  maxNum:timerManage.maxNum,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getOnlineTimerManageList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getOnlineTimerManageList`,
        payload:payload,
      })
    },
    addOnlineTimerManage : (payload,callback) =>{ // 添加
      dispatch({
        type: `${namespace}/addOnlineTimerManage`,
        payload:payload,
        callback:callback
      })
      
    },
    editOnlineTimerManage : (payload,callback) =>{ // 修改
      dispatch({
        type: `${namespace}/editOnlineTimerManage`,
        payload:payload,
        callback:callback
      })
      
    },
    delOnlineTimerManage:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/delOnlineTimerManage`, 
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

  
  
  const isEditing = (record) => record.key === editingKey;
  
  const  { tableDatas,tableTotal,loadingAddConfirm,loadingEditConfirm,tableLoading,exportLoading,maxNum } = props; 
  useEffect(() => {
    onFinish();
  
  },[]);

  const columns = [
    {
      title: '编号',
      dataIndex: 'Sort',
      key:'Sort',
      align:'center',
    },
    {
      title: '定时器名称',
      dataIndex: 'TimerName',
      key:'TimerName',
      align:'center',
    },
    {
      title: '定时器文件名称',
      dataIndex: 'TimerFileName',
      key:'TimerFileName',
      align:'center',
    },
    {
      title: '状态',
      dataIndex: 'TimerStatus',
      key:'TimerStatus', 
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
      title: '功能描述',
      dataIndex: 'TimerRemark',
      key:'TimerRemark',
      align:'center',
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
    props.delOnlineTimerManage({ID:record.ID},()=>{
        onFinish();
    })
  };



  
  
  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();
    form2.setFieldsValue({Sort:maxNum});

  };


  // const [pageIndex,setPageIndex] = useState(1)
  // const [pageSize,setPageSize] = useState(20)
  const onFinish  = async () =>{  //查询
      
    try {
      const values = await form.validateFields();

      props.getOnlineTimerManageList({
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk  = async () =>{ //添加 or 编辑弹框
  
    try {
      const values = await form2.validateFields();//触发校验
      type==='add'? props.addOnlineTimerManage({
        ...values,
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      :
     props.editOnlineTimerManage({
        ...values,
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const handleTableChange =   async (PageIndex, PageSize)=>{ //分页
          setPageIndex(PageIndex)
          setPageSize(PageSize)
          onFinish(PageIndex,PageSize)
  }
  const searchComponents = () =>{
     return  <Form
    form={form}
    name="advanced_search"
    className={styles['ant-advanced-search-form']}
  >  
      <Row  align='middle'>
     <Button  icon={<PlusOutlined />} type="primary" onClick={()=>{ add()}} >
          添加
     </Button>
      </Row>   
     </Form>
  }
  return (
    <div  className={styles.timerManageSty}>
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
        TimerStatus:1
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
        <Form.Item label="编号" name="Sort" >
        <InputNumber placeholder='请输入编号' />
      </Form.Item>
        <NumTips />
      </Col>
      </Row>
      <Row>
        <Col span={24}>
        <Form.Item label="定时器名称" name="TimerName" rules={[  { required: true, message: '请输入定时器名称'  }]} >
        <Input placeholder='请输入定时器名称'/>
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={24}>
        <Form.Item label="定时器文件名称" name="TimerFileName"  rules={[  { required: true, message: '请输入定时器文件名称'  }]}>
        <Input placeholder='请输入定时器文件名称'/>

      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={24}>
        <Form.Item label="状态" name="TimerStatus" >
           <Radio.Group>
             <Radio value={1}>启用</Radio>
             <Radio value={2}>停用</Radio>
         </Radio.Group>
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={24}>
        <Form.Item label="功能描述" name="TimerRemark" >
        <TextArea rows={4} />
      </Form.Item>
      </Col>
      </Row>

     
    </Form>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);