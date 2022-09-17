/**
 * 功  能：cems设备清单
 * 创建人：jab
 * 创建时间：2022.07.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,CaretLeftFilled,CaretRightFilled, CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
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

const namespace = 'cemsEquipmentList'




const dvaPropsData =  ({ loading,cemsEquipmentList,global,commissionTest, }) => ({
  tableDatas:cemsEquipmentList.tableDatas,
  pointDatas:cemsEquipmentList.pointDatas,
  tableLoading:cemsEquipmentList.tableLoading,
  tableTotal:cemsEquipmentList.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addEquipmentInfo`],
  loadingEditConfirm: loading.effects[`${namespace}/editEquipmentInfo`],
  manufacturerList:commissionTest.manufacturerList,
  pollutantTypeList:commissionTest.pollutantTypeList,
  clientHeight: global.clientHeight,
  loadingManufacturer: loading.effects[`commissionTest/getManufacturerList`],
  loadingGetPollutantById: loading.effects[`commissionTest/getPollutantById`] || false,
  maxNum:cemsEquipmentList.maxNum,
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
    getManufacturerList:(payload,callback)=>{ //厂家列表
      dispatch({
        type: `commissionTest/getManufacturerList`, 
        payload:payload,
        callback:callback
      }) 
    },
    getPollutantById:(payload)=>{ //监测类型
      dispatch({
        type: `commissionTest/getPollutantById`, 
        payload:payload,

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
  
  const [ manufactorID, setManufactorID] = useState(undefined)

  const  { tableDatas,tableTotal,tableLoading,manufacturerList,loadingManufacturer,pollutantTypeList,loadingAddConfirm,loadingEditConfirm,exportLoading,loadingGetPollutantById,maxNum,equipmentNameList,loadingEquipmentName,addEditEquipmentNameList,loadingAddEditEquipmentName,} = props; 
  useEffect(() => {
    props.getManufacturerList({},(data)=>{
      if(data[0]){
        setManufactorID(data[0].ID)
        setDeveiceName(data[0].ManufactorName)
      }
    })
    props.getPollutantById({}) //监测类别
  },[]);

  
  useEffect(()=>{
   
    if(manufactorID){
      onFinish();
    }

  },[manufactorID])
  const columns = [
    {
      title: '编号',
      dataIndex: 'Num',
      key:'Num',
      align:'center',
    },
    {
      title: '监测类型',
      dataIndex: 'PollutantName',
      key:'PollutantName',
      align:'center',
    },

    {
      title: '设备型号',
      dataIndex: 'EquipmentModel',
      key:'EquipmentModel',
      align:'center',
    },
    {
      title: '测试原理',
      dataIndex: 'TestPrinciple',
      key:'TestPrinciple',
      align:'center',
    },
    {
      title: '设备厂家',
      dataIndex: 'ManufactorName',
      key:'ManufactorName',
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
               <Fragment><Tooltip title="编辑"> <a  onClick={()=>{edit(record)}} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="确定要删除此条信息吗？"   style={{paddingRight:5}}  onConfirm={()=>{ del(record)}} okText="是" cancelText="否">
                  <a><DelIcon/></a>
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

  const del =  async (record) => {
    const values = await form.validateFields();
    props.delEquipmentInfo({ID:record.ID},()=>{
      setPageIndex(1)
      props.getEquipmentInfoList({
        ManufactorID:manufactorID,
        PageIndex:1,
        PageSize:pageSize,
        ...values,
      })
    })
  };



  
  
  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();
    form2.setFieldsValue({Num:maxNum})
    
  };

  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询

    try {
      const values = await form.validateFields();

      if(!(pageIndexs&& typeof  pageIndexs === "number")){ //不是分页的情况
        setPageIndex(1)
      }

      props.getEquipmentInfoList({
        ...values,
        ManufactorID:manufactorID,
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
      type==='add'? props.addEquipmentInfo({
        ...values,
        ManufactorID:manufactorID
      },()=>{
        setFromVisible(false)
        onFinish()
      })
      :
     props.editEquipmentInfo({
        ...values,
        ManufactorID:manufactorID
      },()=>{
        setFromVisible(false)
        onFinish(pageIndex,pageSize)
      })
      
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const onSelect = async (selectedKeys,e) =>{
    setManufactorID(selectedKeys.toString())
    setDeveiceName(e.node.titles)
  }


  const onValuesChange = (hangedValues, allValues)=>{
    if(Object.keys(hangedValues).join() == 'PollutantType'){
  
      form.setFieldsValue({PollutantCode:undefined})

    }
  }
  const searchComponents = () =>{
    return  <Form
    form={form}
    name="advanced_search"
    initialValues={{
      // Status:1,
    }}
    className={styles["ant-advanced-search-form"]}
    onFinish={onFinish}
    onValuesChange={onValuesChange}
    layout='inline'
  >  
      <Form.Item label="监测类型" name="PollutantCode"  >
              {loadingGetPollutantById? <Spin size='small' style={{width:200,textAlign:'left'}}/> 
                :
              <Select placeholder='请选择监测类型' allowClear style={{width:200}}>
                 
                 {
                  pollutantTypeList[0]&&pollutantTypeList.map(item => {
                    return <Option key={item.ChildID} value={item.ChildID}>{item.Name}</Option>
                  })
                }  
              </Select>}
      </Form.Item>
      <Form.Item label="设备型号" name="EquipmentModel" >
         <Input placeholder="请输入设备型号" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="状态" name="Status"  >
       <Select placeholder='请选择状态' allowClear style={{width:150}}>
           <Option key={1} value={1}>启用</Option>
           <Option key={2} value={2}>停用</Option>
        </Select>
      </Form.Item>
      <Form.Item>
      <Button   type="primary" htmlType='submit' style={{marginRight:8}}>
          查询
     </Button>
     <Button   style={{marginRight:8}} onClick={()=>{ form.resetFields()}}>
          重置
     </Button>
     <Button   onClick={()=>{ add()}} >
          添加
     </Button>
     </Form.Item>
     </Form>
  }
  const treeDatas = ()=> {
    const list = [{
      title: '设备厂家',
      key:'1',
      icon:<CreditCardFilled style={{color:'#1890ff'}}/>,
      children:[],
      selectable:false
    }];
    for (let i = 0; i < manufacturerList.length; i += 1) {
      const key = manufacturerList[i].ID;
      const treeNode = {
        title:<div style={{display:'inline-block'}}> {manufacturerList[i].ManufactorName }</div>,
        key,
        icon: <ProfileFilled  style={{color:'#1890ff'}}/>,
        titles:manufacturerList[i].ManufactorName
      };
  
      list[0].children.push(treeNode);
    }
    return list;
  }
  const onAddEditValuesChange= (hangedValues, allValues)=>{ //添加修改时的监测类型请求
  }
  const handleTableChange = (PageIndex, PageSize) =>{
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex,PageSize)
  }
  const [pageSize,setPageSize]=useState(20)
  const [pageIndex,setPageIndex]=useState(1)


  const [ drawerVisible, setDrawerVisible ] = useState(true)
  return (
    <div  className={styles.cemsEquipmentListSty} style={{marginLeft:drawerVisible? 320 : 0}}>
    <Drawer
         // title="导航菜单"
          placement={'left'}
          closable={false}
          onClose={()=>{setDrawerVisible(false)}}
          visible={drawerVisible}
          width={ 320}
          mask={false}
          keyboard={false}
          zIndex={1}
          onClose={()=>{setDrawerVisible(false)}} 
          bodyStyle={{ padding: '18px 8px' }}
          style={{
            marginTop: 64,
          }}
        >
         
         {loadingManufacturer?
        <PageLoading />
         :
         <>
        {manufacturerList.length? 
          <Tree selectedKeys={[manufactorID]}  blockNode  showIcon  onSelect={onSelect}  treeData={treeDatas()} height={props.clientHeight - 64 - 20}  defaultExpandAll />
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
        <Form.Item label="编号" name="Num" rules={[  { required: true, message: '请输入编号'  }]} >
          <InputNumber placeholder="编号从1开始，自动填写，请勿修改"  allowClear/>
      </Form.Item>
      <NumTips />
      </Col>
      <Col span={12}>
      <Form.Item label="监测类型" name="PollutantCode"  rules={[  { required: true, message: '请选择监测类型'  }]}>
              {loadingGetPollutantById? <Spin size='small' style={{textAlign:'left'}}/> 
                :
              <Select placeholder='请选择监测类型' allowClear>
                 
                 {
                  pollutantTypeList[0]&&pollutantTypeList.map(item => {
                    return <Option key={item.ChildID} value={item.ChildID}>{item.Name}</Option>
                  })
                }  
              </Select>}
      </Form.Item>
      </Col>
      </Row>


      <Row>
      <Col span={12}>
        <Form.Item label="设备型号" name="EquipmentModel" rules={[  { required: true, }]} >
             <Input placeholder='请输入' allowClear/>
      </Form.Item>
      
      </Col>
       <Col span={12}>
        <Form.Item label="监测原理" name="TestPrinciple" rules={[  { required: true,   }]} >
             <Input placeholder='请输入' allowClear/>
      </Form.Item>
      
      </Col>
      </Row>

      <Row>
      <Col span={12}>
        <Form.Item label="状态" name="Status"  rules={[  { required: true, message: '请选择状态'  }]}>
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