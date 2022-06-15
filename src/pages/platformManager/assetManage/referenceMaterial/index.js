/**
 * 功  能：标准气体 试剂信息
 * 创建人：贾安波
 * 创建时间：2022.02.21 02.28
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
  loadingAddConfirm: loading.effects[`${namespace}/addStandardGas`],
  loadingEditConfirm: loading.effects[`${namespace}/editStandardGas`],
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
    getStandardGasList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getStandardGasList`,
        payload:payload,
      })
    },
    addStandardGas : (payload,callback) =>{ // 添加
      dispatch({
        type: `${namespace}/addStandardGas`,
        payload:payload,
        callback:callback
      })
      
    },
    editStandardGas : (payload,callback) =>{ // 修改
      dispatch({
        type: `${namespace}/editStandardGas`,
        payload:payload,
        callback:callback
      })
      
    },
    delStandardGas:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/delStandardGas`, 
        payload:payload,
        callback:callback
      }) 
    },
    
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();



  const [fromVisible,setFromVisible] = useState(false)


  const [type,setType] = useState('add')

  
  

  
  const [ manufacturerId, setManufacturerId] = useState(undefined)

  const  { tableDatas,tableTotal,tableLoading,loadingAddConfirm,loadingEditConfirm,match:{path} } = props;
  
  const typeRemark = path==='/platformconfig/assetManage/referenceMaterial'? 1 : 2
  useEffect(() => {
   onFinish()
  },[]);

  const columns = [
    {
      title: '存货编号',
      dataIndex: 'StandardGasCode',
      key:'StandardGasCode',
      align:'center',
    },
    {
      title: `${typeRemark ==1?"标准气体名称": "试剂名称"}`,
      dataIndex: 'StandardGasName',
      key:'StandardGasName',
      align:'center',
    },
    {
      title: '规格型号',
      dataIndex: 'Component',
      key:'Component',
      align:'center',
    },
    {
      title: '单位',
      dataIndex: 'Unit',
      key:'Unit',
      align:'center',
    },
    {
      title: '供应商',
      dataIndex: 'Manufacturer',
      key:'Manufacturer',
      align:'center',
    },  
    {
      title: '使用状态',
      dataIndex: 'IsUsed',
      key:'IsUsed', 
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

  const del =  async(record) => {
    const values = await form.validateFields();
    props.delStandardGas({ID:record.ID},()=>{
      setPageIndex(1)
      props.getStandardGasList({
        ...values,
        PageIndex:1,
        PageSize:pageSize
      })
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
      
      pageIndexs&& typeof  pageIndexs === "number"? setPageIndex(pageIndexs) : setPageIndex(1); //除分页和编辑  每次查询页码重置为第一页

      props.getStandardGasList({
        ...values,
        ManufacturerId:manufacturerId,
        pageIndex:pageIndexs&& typeof  pageIndexs === "number" ?pageIndexs:1,
        pageSize:pageSizes?pageSizes:pageSize
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk  = async () =>{ //添加 or 编辑弹框
  
    try {
      const values = await form2.validateFields();//触发校验
      type==='add'? props.addStandardGas({
        ...values,
        ManufacturerId:manufacturerId
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      :
     props.editStandardGas({
        ...values,
        ManufacturerId:manufacturerId
      },()=>{
        setFromVisible(false)
        onFinish(pageIndex)
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
      // IsUsed:1,
      Remark:typeRemark,
    }}
    className={styles["ant-advanced-search-form"]}
    onFinish={onFinish}
    onValuesChange={onValuesChange}
  >  
      <Row>
      <Form.Item label="存货编号" name="StandardGasCode" >
        <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label={typeRemark ==1?"标准气体名称": "试剂名称"} name="StandardGasName"   style={{marginLeft:16,marginRight:16}}>
            <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="规格型号" name="Component"  >
         <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      </Row>
      <Row>
      <Form.Item label="供应商" name="Manufacturer">
         <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="使用状态" name="IsUsed" style={{marginLeft:16,marginRight:16}} className={typeRemark ==1? styles.status : ''} >
      <Select placeholder='请选择状态' allowClear style={{width:200}}>
           <Option key={1} value={1}>启用</Option>
           <Option key={2} value={2}>停用</Option>
        </Select>
      </Form.Item>
      <Form.Item hidden label="类型"  name="Remark" >
        <Radio.Group style={{width:200}}>
            <Radio value={1}>标准气体</Radio>
            <Radio value={2}>试剂信息</Radio>
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
     <Form.Item hidden label="类型"  name="Remark" >
        <Radio.Group style={{width:200}}>
            <Radio value={1}>标准气体</Radio>
            <Radio value={2}>试剂信息</Radio>
        </Radio.Group>
      </Form.Item>
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
    如果{typeRemark==1? '标准气体':'试剂信息'}没有编码，则按以下规则定义编码，格式: B+年+
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
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />
   </Card>
   </BreadcrumbWrapper>
   <Modal
        title={`${type==='add'? '添加':'编辑'}` }
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
        IsUsed:1,
        Remark:typeRemark,
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
        <Form.Item label="存货编号" name="StandardGasCode" rules={[  { required: true, message: '请输入存货编号'  }]} >
          <Input placeholder="请输入"  allowClear/>
      </Form.Item>
       <NumTips content={codeContent}/>
      </Col>
      <Col span={12}>
        <Form.Item label={typeRemark==1?"标准气体名称" :"试剂名称"} name="StandardGasName" rules={[  { required: true, message: '请输入标准气体名称'  }]} >
        <Input placeholder="请输入"  allowClear/>
      </Form.Item>
      </Col>
      </Row>


      <Row>
      <Col span={12}>
        <Form.Item label="规格型号" name="Component"  rules={[  { required: true, message: '请输入规格型号'  }]}>
        <Input placeholder="请输入"  allowClear/>
      </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="单位" name="Unit" >
             <Input placeholder='请输入' allowClear/>
      </Form.Item>     
      </Col>
      </Row>

       <Row>
      <Col span={12}>
         <Form.Item label="供应商" name="Manufacturer" rules={[  { required: true, message: '请输入供应商'  }]} >
             <Input placeholder='请输入' allowClear/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="使用状态" name="IsUsed" >
           <Radio.Group>
             <Radio value={1}>启用</Radio>
             <Radio value={2}>停用</Radio>
         </Radio.Group>
         </Form.Item>
      </Col>
        </Row>
        <Form.Item hidden label="类型"  name="Remark" >
        <Radio.Group style={{width:200}}>
            <Radio value={1}>标准气体</Radio>
            <Radio value={2}>试剂信息</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);