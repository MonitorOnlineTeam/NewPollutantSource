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
  tableLoading:loading.effects[`${namespace}/getProjectAuthorList`],
  tableTotal:projectManageAuthor.tableTotal,
  projectAuthorList:projectManageAuthor.projectAuthorList,
  addProjectAuthorListLoading:loading.effects[`${namespace}/getAddProjectAuthorList`],
  projectAuthorListTotal:projectManageAuthor.projectAuthorListTotal,
  userList:projectManageAuthor.userList,
  loadingUser: loading.effects[`${namespace}/getUserList`],
  loadingAssignPermissions: loading.effects[`${namespace}/addProjectAuthor`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getProjectAuthorList:(payload)=>{ //项目权限列表
      dispatch({
        type: `${namespace}/getProjectAuthorList`,
        payload:payload,
      })
    },
    addProjectAuthor : (payload,callback) =>{ //分配项目权限
      dispatch({
        type: `${namespace}/addProjectAuthor`,
        payload:payload,
        callback:callback
      })
      
    },
    getAddProjectAuthorList : (payload,callback) =>{ // 获取当前人员未分配的项目权限
      dispatch({
        type: `${namespace}/getAddProjectAuthorList`,
        payload:payload,
        callback:callback
      })
      
    },
    deleteProjectAuthor:(payload,callback)=>{ //删除项目权限
      dispatch({
        type: `${namespace}/deleteProjectAuthor`, 
        payload:payload,
        callback:callback
      }) 
    },
    getUserList:(payload,callback)=>{ //角色列表
      dispatch({
        type: `${namespace}/getUserList`, 
        payload:payload,
        callback:callback
      }) 
    },
   
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();



  
  
  
  const [ userId, setUserId] = useState(undefined)

  const  { tableDatas,tableTotal,tableLoading,projectAuthorList,addProjectAuthorListLoading,projectAuthorListTotal,loadingAssignPermissions,} = props; 
  const { loadingUser,userList, } = props;
  useEffect(() => {
    getUserListFun({},(data)=>{
      if(data){
        setUserId(data.ID)
        setUserName(data.userName)
        form.setFieldsValue({UserId:data.ID})
        onFinish();
      }

    })
   
  },[]);

   const getUserListFun= (par,callback) =>{
    props.getUserList({roleListID: "9bcb50c4-9b55-41d6-9f46-c257d58774d8",...par},callback)
   }
  const columns = [
    {
      title: '合同名称',
      dataIndex: 'projectName',
      key:'projectName',
      align:'center',
    },
    {
      title: '项目编号',
      dataIndex: 'projectCode',
      key:'projectCode',
      align:'center',
    },
    {
      title: '客户所在地',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
    },
    {
      title: '运维起始日期',
      dataIndex: 'beginTime',
      key:'beginTime',
      align:'center',
    },
    {
      title: '运维结束日期',
      dataIndex: 'endTime',
      key:'endTime',
      align:'center',
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      key:'createName',
      align:'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key:'createTime',
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
                  <a><DelIcon/></a>
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
      dataIndex: 'projectName',
      key:'projectName',
      align:'center',
    },
    {
      title: '项目编号',
      dataIndex: 'projectCode',
      key:'projectCode',
      align:'center',
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      key:'createName',
      align:'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key:'createTime',
      align:'center',
    },
  ];

  const del =  async (record) => {
    const values = await form.validateFields();
    props.deleteProjectAuthor({ID:record.ID},()=>{
      setPageIndex(1)
      props.getProjectAuthorList({
        ...values,
        PageIndex:1,
        PageSize:pageSize,
        
      })
    })
  };


   const onFinish2 = async (pageIndexs,pageSizes) =>{
    try {
      const values = await form2.validateFields();
      if(!(pageIndexs&& typeof  pageIndexs === "number")){ //不是分页的情况
        setPageIndex(1)
        setSelectedRowKeys([])
      }
     
      props.getAddProjectAuthorList({
        ...values,
        PageIndex:!(pageIndexs&& typeof  pageIndexs === "number") ? 1 : pageIndexs,
        PageSize:pageSizes?pageSizes:pageSize
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
   }

  const [assignPermissionsVisible,setAssignPermissionsVisible ] = useState(false)
  const assignPermissions = () => {
    setAssignPermissionsVisible(true)
    form2.resetFields();
    form2.setFieldsValue({UserId:userId})
    setTimeout(()=>{
      onFinish2();
    })
    
  };

  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询

    try {
      const values = await form.validateFields();

      if(!(pageIndexs&& typeof  pageIndexs === "number")){ //不是分页的情况
        setPageIndex(1)
      }

      props.getProjectAuthorList({
        ...values,
        PageIndex:pageIndexs&& typeof  pageIndexs === "number" ?pageIndexs:1,
        PageSize:pageSizes?pageSizes:pageSize
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
 
  const onSelectChange = (newSelectedRowKeys,newSelectedRow) => {
  //   if(selectedRowKeys.length<1 || newSelectedRowKeys.length==0){ //newSelectedRowKeys.length==0 选中取消时
  //      message.warning('每次最多选择一行')
  //      return;
  // }


      setSelectedRowKeys(newSelectedRowKeys);

     const selectData = newSelectedRow.map(item=>{
        return {
          ID: "",
          UserID: userId,
          ProjectID: item.projectID,
        }
      })
      setSelectedRow(selectData)

 
  };
  const onModalOk  =  () =>{ //分配权限 保存
    if(selectedRow.length<=0){
      message.warning('请先选择一行数据')
      return;
    }
      props.addProjectAuthor(selectedRow,()=>{
        setAssignPermissionsVisible(false)
        // onFinish2();
        onFinish(pageIndex,pageSize)
      })
      
  }
  const [ userName,setUserName ] = useState() 
  const onSelect =  (selectedKeys,e) =>{
    setUserId(selectedKeys.toString())
    form.setFieldsValue({UserId:selectedKeys.toString()})
    onFinish()
    setUserName(e.node.title);
   
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
      <Form.Item label="项目编号" name="ProjectCode"  >
            <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="创建人" name="CreateUserName"  >
            <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item  name="UserId"  hidden>
            <Input />
      </Form.Item>
      <Form.Item>
      <Button   type="primary" htmlType='submit' loading={tableLoading} style={{marginRight:8}}>
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
        title:userList[i].userName ,
        key,
        icon: <UserOutlined  style={{color:'#1890ff'}}/>,
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
   getUserListFun({userName:value})
 }

 

 const rowSelection = {
  selectedRowKeys,
  onChange: onSelectChange,
};

const [pageIndex2,setPageIndex2 ] = useState(1)  
const [pageSize2,setPageSize2 ] = useState(20)
const handleTableChange2 =    (PageIndex, PageSize)=>{ //弹框 分页 详情
setPageSize2(PageSize)
setPageIndex2(PageIndex)
onFinish2(PageIndex,PageSize);
}

  const [ drawerVisible, setDrawerVisible ] = useState(true)

  return (
    <div  className={styles.projectManageAuthorSty} style={{marginLeft:drawerVisible? 320 : 0}}>
    <Drawer
          title={ <Search
            placeholder="请输入角色姓名" allowClear    enterButton    onSearch={onSearch} loading={loadingUser} />}
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
             selectedKeys={[userId]}  blockNode  showIcon  onSelect={onSelect}  treeData={treeDatas()} height={props.clientHeight - 64 - 20}  defaultExpandAll />
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
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
   </Card>
   </BreadcrumbWrapper>
   <Modal
        title={`分配权限 - ${userName}` }
        visible={assignPermissionsVisible}
        onOk={onModalOk}
        confirmLoading={props.loadingAssignPermissions}
        onCancel={()=>{setAssignPermissionsVisible(false)}}
        className={styles.tableModal}
        destroyOnClose
        centered
        width='90%'
        confirmLoading={loadingAssignPermissions}
      >
        <Card 
        title={ <Form  name="basic" form={form2}  layout='inline'  onValuesChange={onAddEditValuesChange} onFinish={onFinish2}  > 
           <Form.Item label="项目编号" name="ProjectCode"  >
             <Input placeholder="请输入" style={{width:200}} allowClear/>
            </Form.Item>
            <Form.Item label="创建人" name="CreateUserName"  >
           <Input placeholder="请输入" style={{width:200}} allowClear/>
           </Form.Item>
           <Form.Item name="UserId"  hidden>
           <Input />
           </Form.Item>
               <Form.Item>
           <Button   type="primary" htmlType='submit' style={{marginRight:8}} loading={addProjectAuthorListLoading}> 查询</Button> </Form.Item> </Form>}  >

   <SdlTable
        rowSelection={rowSelection} 
        loading = {addProjectAuthorListLoading}
        bordered
        dataSource={projectAuthorList}
        columns={columns2}
        scroll={{y:props.clientHeight - 550}}
        pagination={{
          total:projectAuthorListTotal,
          pageSize: pageSize2,
          current: pageIndex2,
          onChange: handleTableChange2,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
   
    </Card>
      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);