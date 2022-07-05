/**
 * 功  能：项目权限管理
 * 创建人：jab
 * 创建时间：2022.07.05
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,UserOutlined , CaretLeftFilled,CaretRightFilled, CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
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
import PageLoading from '@/components/PageLoading'
import NumTips from '@/components/NumTips'
import settingDrawer from '@/locales/en-US/settingDrawer';
const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;
const namespace = 'projectManageAuthor'




const dvaPropsData =  ({ loading,projectManageAuthor,global }) => ({
  tableDatas:projectManageAuthor.tableDatas,
  tableLoading:loading.effects[`${namespace}/addEquipmentInfo`],
  tableTotal:projectManageAuthor.tableTotal,
  tableDetailDatas:projectManageAuthor.tableDetailDatas,
  tableDetailLoading:loading.effects[`${namespace}/addEquipmentInfo`],
  tableDetailTotal:projectManageAuthor.tableDetailTotal,
  userList:projectManageAuthor.userList,
  loadingAddConfirm: loading.effects[`${namespace}/addEquipmentInfo`],
  loadingUser: loading.effects[`${namespace}/addEquipmentInfo`],
  loadingAssignPermissions: loading.effects[`${namespace}/addEquipmentInfo`],
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
    getPollutantById:(payload)=>{ //监测类型
      dispatch({
        type: `${namespace}/getPollutantById`, 
        payload:payload,

      }) 
    },
    addEditPollutantById:(payload)=>{ //监测类型 添加 or 编辑
      dispatch({
        type: `${namespace}/addEditPollutantById`, 
        payload:payload,

      }) 
    },

    addEditGetEquipmentName:(payload)=>{ //设备名称 添加 or 编辑
      dispatch({
        type: `${namespace}/addEditGetEquipmentName`, 
        payload:payload,

      }) 
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();



  
  
  
  const [ manufacturerId, setManufacturerId] = useState(undefined)

  const  { tableDatas,tableTotal,tableLoading,tableDetailDatas,tableDetailLoading,tableDetailTotal,} = props; 
  const { loadingUser,userList, } = props;
  useEffect(() => {
    props.getManufacturerList({pageIndex:1,pageSize:100000},(data)=>{
      if(data[0]){
        setManufacturerId(data[0].ID)
      }
    })
    props.getMonitoringTypeList({})//监测类别
  },[]);

  
  useEffect(()=>{
   
    if(manufacturerId){
      onFinish();
    }

  },[manufacturerId])
  const columns = [
    {
      title: '合同名称',
      dataIndex: 'EquipmentCode',
      key:'EquipmentCode',
      align:'center',
    },
    {
      title: '项目编号',
      dataIndex: 'PollutantTypeName',
      key:'PollutantTypeName',
      align:'center',
    },
    {
      title: '监测类型',
      dataIndex: 'PollutantName',
      key:'PollutantName',
      align:'center',
    },
    {
      title: '客户所在地',
      dataIndex: 'EquipmentName',
      key:'EquipmentName',
      align:'center',
    },
    {
      title: '设备型号',
      dataIndex: 'EquipmentType',
      key:'EquipmentType',
      align:'center',
    },

    {
      title: '运营起始日期',
      dataIndex: 'AnalyticalMethod',
      key:'AnalyticalMethod',
      align:'center',
    },
    {
      title: '运营结束日期',
      dataIndex: 'EquipmentBrand',
      key:'EquipmentBrand',
      align:'center',
    },
    {
      title: '创建人',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    },
    {
      title: '创建时间',
      dataIndex: 'CISCode',
      key:'CISCode',
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
               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="确定要删除吗？"   style={{paddingRight:5}}  onConfirm={()=>{ del(record)}} okText="是" cancelText="否">
                  <a href="#" ><DelIcon/></a>
               </Popconfirm>
               </Tooltip>
               </Fragment> 
             </span>
      }
    },
  ];

 
  const columns2 = [
    {
      title: '合同名称',
      dataIndex: 'EquipmentCode',
      key:'EquipmentCode',
      align:'center',
    },
    {
      title: '项目编号',
      dataIndex: 'PollutantTypeName',
      key:'PollutantTypeName',
      align:'center',
    },
    {
      title: '创建人',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    },
    {
      title: '创建时间',
      dataIndex: 'CISCode',
      key:'CISCode',
      align:'center',
    },
  ];

  const del =  async (record) => {
    const values = await form.validateFields();
    props.delEquipmentInfo({ID:record.ID},()=>{
      setPageIndex(1)
      props.getEquipmentInfoList({
        ManufacturerId:manufacturerId,
        PageIndex:1,
        PageSize:pageSize,
        ...values,
      })
    })
  };



  
  const [assignPermissionsVisible,setAssignPermissionsVisible ] = useState(false)
  const assignPermissions = () => {
    setAssignPermissionsVisible(true)
    form2.resetFields();
  };

  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询

    try {
      const values = await form.validateFields();

      if(!(pageIndexs&& typeof  pageIndexs === "number")){ //不是分页的情况
        setPageIndex(1)
      }

      props.getEquipmentInfoList({
        ...values,
        ManufacturerId:manufacturerId,
        PageIndex:pageIndexs&& typeof  pageIndexs === "number" ?pageIndexs:1,
        PageSize:pageSizes?pageSizes:pageSize
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk  = async () =>{ //添加 or 编辑弹框
  
    try {
      const values = await form2.validateFields();//触发校验
      props.addEquipmentInfo({
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
  const onSelect = async (selectedKeys,e) =>{
    setManufacturerId(selectedKeys.toString())
    setDeveiceName(e.node.titles)
  }

  // const handleTableChange =   async (PageIndex, )=>{ //分页
  //   const values = await form.validateFields();
  //   setPageSize(PageSize)
  //   setPageIndex(PageIndex)
  //   props.getProjectInfoList({...values,PageIndex,PageSize})
  // }

  const onValuesChange = (hangedValues, allValues)=>{
    if(Object.keys(hangedValues).join() == 'PollutantType'){
      props.getPollutantById({id:hangedValues.PollutantType,type:1}) //监测类别
      form.setFieldsValue({PollutantCode:undefined})

      // props.getEquipmentName({id:hangedValues.PollutantType,type:2}) //设备名称
      // form.setFieldsValue({EquipmentName:undefined})
    }
  }
  const searchComponents = () =>{
    return  <Form
    form={form}
    name="advanced_search"
    layout='inline'
    className={styles["ant-advanced-search-form"]}
    onFinish={onFinish}
    onValuesChange={onValuesChange}
  >  
      <Form.Item label="项目编号" name="EquipmentName"  >
            <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="创建人" name="EquipmentName"  >
            <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item>
      <Button   type="primary" htmlType='submit' style={{marginRight:8}}>
          查询
     </Button>
     <Button   onClick={()=>{ assignPermissions()}} >
          分配权限
     </Button>
     </Form.Item>
     </Form>
  }
  const treeDatas = ()=> {
    
    const list = [];
    for (let i = 0; i < userList.length; i += 1) {
      const key = userList[i].ID;
      const treeNode = {
        title:<div style={{display:'inline-block'}}> {userList[i].ManufacturerName }</div>,
        key,
        icon: <UserOutlined  style={{color:'#1890ff'}}/>,
        titles:userList[i].ManufacturerName
      };
  
      list.push(treeNode);
    }
    return list;
  }
  const onAddEditValuesChange= (hangedValues, allValues)=>{ //添加修改时的监测类型请求
    if(Object.keys(hangedValues).join() == 'PollutantType'){
      props.addEditPollutantById({id:hangedValues.PollutantType,type:1}) //监测类型
      form2.setFieldsValue({PollutantCode:undefined})

      props.addEditGetEquipmentName({id:hangedValues.PollutantType,type:2}) //设备名称
      form2.setFieldsValue({EquipmentName:undefined})
    }
  }
  const handleTableChange = (PageIndex, PageSize) =>{
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex,PageSize)
  }
  const [pageSize,setPageSize]=useState(20)
  const [pageIndex,setPageIndex]=useState(1)

 const onSearch = (value) =>{
  console.log(value)
 }

 
 const [selectedRowKeys, setSelectedRowKeys] = useState([]);
 const [selectedRow, setSelectedRow] = useState([]);

 const onSelectChange = (newSelectedRowKeys,newSelectedRow) => {

   if(selectedRowKeys.length<1 || newSelectedRowKeys.length==0){ //newSelectedRowKeys.length==0 选中取消时
     setSelectedRowKeys(newSelectedRowKeys);
     setSelectedRow(newSelectedRow)
   }else{
     message.warning('每次最多选择一行')
   }

 };
 const rowSelection = {
  selectedRowKeys,
  onChange: onSelectChange,
};

const [pageIndex2,setPageIndex2 ] = useState(1)  
const [pageSize2,setPageSize2 ] = useState(20)
const handleTableChange2 =    (PageIndex, PageSize)=>{ //弹框 分页 详情
setPageSize2(PageSize)
setPageIndex2(PageIndex)
props.getProjectInfoList({PageIndex,PageSize})
}
  const [ drawerVisible, setDrawerVisible ] = useState(true)
  return (
    <div  className={styles.projectManageAuthorSty} style={{marginLeft:drawerVisible? 320 : 0}}>
    <Drawer
          title={ <Search
            placeholder="请输入人员姓名" allowClear    enterButton    onSearch={onSearch} />}
          placement={'left'}
          closable={false}
          onClose={()=>{setDrawerVisible(false)}}
          visible={drawerVisible}
          width={ 320}
          mask={false}
          keyboard={false}
          zIndex={1}
          onClose={()=>{setDrawerVisible(false)}} 
          bodyStyle={{ padding: '18px 8px',}}
          style={{
            marginTop: 64,
            }}       
           height={props.clientHeight} 
           getContainer={false}
           className='drawerNoVirtualSty'
        >
         
         {loadingUser?
        <PageLoading />
         :
         <>
        {userList.length? 
          <Tree   
             virtual={false}
             style={{  maxHeight: 'calc(100vh - 164px)',  overflowY: 'auto', width: '100%' }}  
             selectedKeys={[manufacturerId]}  blockNode  showIcon  onSelect={onSelect}  treeData={treeDatas()} height={props.clientHeight - 64 - 20}  defaultExpandAll />
          :
        <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </>
        }
        
    </Drawer>
      <div onClick={()=>{setDrawerVisible(!drawerVisible)}} style={{position:'absolute',zIndex:999,left:drawerVisible? 'calc(320px - 24px)' : -24,top:'50vh', background:"#1890ff",cursor:'pointer',padding:'5px 0',borderRadius:'0 2px 2px 0',transition:'all .2s'}}> { drawerVisible?<CaretLeftFilled style={{color:'#fff'}}/> : <CaretRightFilled style={{color:'#fff'}}/>}</div>
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
        title={`分配权限` }
        visible={assignPermissionsVisible}
        onOk={onModalOk}
        confirmLoading={props.loadingAssignPermissions}
        onCancel={()=>{setAssignPermissionsVisible(false)}}
        className={styles.tableModal}
        destroyOnClose
        centered
        width='90%'
      >
        <Card 
        title={ <Form  name="basic" form={form2}  layout='inline'  onValuesChange={onAddEditValuesChange}  >    <Form.Item label="项目编号" name="EquipmentName"  >
             <Input placeholder="请输入" style={{width:200}} allowClear/>
            </Form.Item>
            <Form.Item label="创建人" name="EquipmentName"  >
           <Input placeholder="请输入" style={{width:200}} allowClear/>
           </Form.Item>
               <Form.Item>
           <Button   type="primary" htmlType='submit' style={{marginRight:8}}> 查询</Button> </Form.Item> </Form>}
        >

   <SdlTable
        rowSelection={rowSelection} 
        loading = {tableDetailLoading}
        bordered
        dataSource={tableDetailDatas}
        columns={columns2}
        scroll={{y:props.clientHeight - 550}}
        pagination={{
          total:tableDetailTotal,
          pageSize: pageSize2,
          current: pageIndex2,
          onChange: handleTableChange2,
        }}
      />
   
    </Card>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);