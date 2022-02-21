/**
 * 功  能：标准物质
 * 创建人：贾安波
 * 创建时间：2022.02.21
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
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
import PageLoading from '@/components/PageLoading'
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'referenceMaterial'




const dvaPropsData =  ({ loading,referenceMaterial,global }) => ({
  tableDatas:referenceMaterial.tableDatas,
  tableLoading:referenceMaterial.tableLoading,
  tableTotal:referenceMaterial.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addEquipmentInfo`],
  loadingEditConfirm: loading.effects[`${namespace}/editEquipmentInfo`],
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

  
  
  const [deveiceName,setDeveiceName] = useState('')
  
  const [ manufacturerId, setManufacturerId] = useState(undefined)

  const  { tableDatas,tableTotal,tableLoading,loadingAddConfirm,loadingEditConfirm, } = props; 
  useEffect(() => {
   onFinish()
  },[]);

  const columns = [
    {
      title: '存货编号',
      dataIndex: 'EquipmentCode',
      key:'EquipmentCode',
      align:'center',
    },
    {
      title: '标准物质名称',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    },
    {
      title: '规格型号',
      dataIndex: 'EquipmentBrand',
      key:'EquipmentBrand',
      align:'center',
    },
    {
      title: '库存数量',
      dataIndex: 'EquipmentName',
      key:'EquipmentName',
      align:'center',
    },
    {
      title: '单位',
      dataIndex: 'AnalyticalMethod',
      key:'AnalyticalMethod',
      align:'center',
    },
    {
      title: '供应商',
      dataIndex: 'EquipmentType',
      key:'EquipmentType',
      align:'center',
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
        MonitoringType:record.MonitoringTypeID
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

  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询
    try {
      const values = await form.validateFields();

      props.getEquipmentInfoList({
        ...values,
        ManufacturerId:manufacturerId,
        PageIndex:pageIndexs&&!pageIndexs instanceof Object ?pageIndexs:pageIndex,
        PageSize:pageSizes?pageSizes:pageSize
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
        ManufacturerId:manufacturerId
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      :
     props.editEquipmentInfo({
        ...values,
        ManufacturerId:manufacturerId
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }


  const onValuesChange = (hangedValues, allValues)=>{
    // if(Object.keys(hangedValues).join() == 'PollutantType'){
    // }
  }
  const searchComponents = () =>{
    return  <Form
    form={form}
    name="advanced_search"
    initialValues={{
      Status:1
    }}
    className={styles["ant-advanced-search-form"]}
    onFinish={onFinish}
    onValuesChange={onValuesChange}
  >  
      <Row>
      <Form.Item label="存货编号" name="PollutantType" >
        <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="标准物质名称" name="EquipmentName"   style={{marginLeft:16,marginRight:16}}>
            <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="规格型号" name="PollutantCode"  >
         <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      </Row>
      <Row>
      <Form.Item label="供应商" name="PollutantCode">
         <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="使用状态" name="Status" style={{marginLeft:16,marginRight:16}} className={styles.status} >
        <Radio.Group style={{width:200}}>
            <Radio value={1}>启用</Radio>
            <Radio value={2}>停用</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
      <Button   type="primary" htmlType='submit' style={{marginRight:8}}>
          查询
     </Button>
     <Button   onClick={()=>{ form.resetFields()}} style={{marginRight:8}} >
          重置
     </Button>
     <Button  icon={<PlusOutlined />} type="primary" onClick={()=>{ add()}} >
          添加
     </Button>
     </Form.Item>
     </Row>
     </Form>
  }

  const onAddEditValuesChange= (hangedValues, allValues)=>{ //添加修改时的监测类型请求
    // if(Object.keys(hangedValues).join() == 'PollutantType'){

    // }
  }
  const handleTableChange = (PageIndex, PageSize) =>{
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex,PageSize)
  }
  const codeContent = <div style={{width:300}}>
    如果标准物质没有编码，则按从下
    规则定义编码，格式: B+年+
    月+日+001 (累计排序)，如:B20200601001、 B20200601002
  </div>

  const [pageSize,setPageSize]=useState(20)
  const [pageIndex,setPageIndex]=useState(1)

  return (
    <div  className={styles.referenceMaterialSty}>
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
          onChange: handleTableChange,
        }}
      />
   </Card>
   </BreadcrumbWrapper>
   <Modal
        title={`${type==='add'? '添加':'编辑'} - ${deveiceName}` }
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
      onValuesChange={onAddEditValuesChange}
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
        <Form.Item label="存货编号" name="EquipmentName" rules={[  { required: true, message: '请输入设备名称'  }]} >
          <Input placeholder="请输入"  allowClear/>
      </Form.Item>
       <NumTips content={codeContent}/>
      </Col>
      <Col span={12}>
        <Form.Item label="标准物质名称" name="PollutantType" rules={[  { required: true, message: '请输入标准物质名称'  }]} >
        <Input placeholder="请输入"  allowClear/>
      </Form.Item>
      </Col>
      </Row>


      <Row>
      <Col span={12}>
        <Form.Item label="规格型号" name="PollutantCode"  rules={[  { required: true, message: '请输入规格型号'  }]}>
        <Input placeholder="请输入"  allowClear/>
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="库存数量" name="EquipmentBrand" rules={[  { required: true, message: '请输入库存数量'  }]} >
             <InputNumber placeholder='请输入' allowClear/>
      </Form.Item>
      
      </Col>
      </Row>
       <Row>
       <Col span={12}>
        <Form.Item label="单位" name="EquipmentType" >
             <Input placeholder='请输入' allowClear/>
      </Form.Item>
      
      </Col>
      <Col span={12}>
      <Form.Item label="使用状态" name="Status" >
           <Radio.Group>
             <Radio value={1}>启用</Radio>
             <Radio value={2}>停用</Radio>
         </Radio.Group>
         </Form.Item>
      </Col>
        </Row>
      <Row>
        <Col span={12}>

         <Form.Item label="供应商" name="AnalyticalMethod" rules={[  { required: true, message: '请输入供应商'  }]} >
             <Input placeholder='请输入' allowClear/>
      
      </Form.Item>
      </Col>
      </Row>
     
    </Form>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);