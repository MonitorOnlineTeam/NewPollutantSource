/**
 * 功  能：客户续费
 * 创建人：贾安波
 * 创建时间：2022.06.29
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
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'custopmRenew'




const dvaPropsData =  ({ loading,custopmRenew,global }) => ({
  tableDatas:custopmRenew.tableDatas,
  pointDatas:custopmRenew.pointDatas,
  tableLoading:custopmRenew.tableLoading,
  tableTotal:custopmRenew.tableTotal,
  customerOrderUserList:custopmRenew.customerOrderUserList,
  customerOrderPointEntList:custopmRenew.customerOrderUserList,
  loadingAddConfirm: loading.effects[`${namespace}/addCustomerOrder`],
  tableDetailDatas:custopmRenew.tableDetailDatas,
  tableDetailTotal:custopmRenew.tableDetailTotal,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getCustomerOrderList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getCustomerOrderList`,
        payload:payload,
      })
    },

    getCustomerOrderUserList : (payload,) =>{//客户订单用户列表
      dispatch({
        type: `${namespace}/getCustomerOrderUserList`,
        payload:payload,
      })
      
    },
    getCustomerOrderPointEntList : (payload,) =>{ // 获取客户订单企业与排口列表
      dispatch({
        type: `${namespace}/getCustomerOrderPointEntList`,
        payload:payload,
      })
      
    },
    addCustomerOrder:(payload,callback)=>{ //添加
      dispatch({
        type: `${namespace}/addCustomerOrder`, 
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

  const  { tableDatas,tableTotal,tableLoading,tableDetailDatas,tableDetailTotal, customerOrderUserList,customerOrderPointEntList,loadingAddConfirm,customerOrderPointEntListLoading,} = props; 


 const userId = Cookie.get('currentUser') && JSON.parse(Cookie.get('currentUser')) && JSON.parse(Cookie.get('currentUser')).UserId
  useEffect(()=>{  
      onFinish();
      props.getCustomerOrderPointEntList({userId:userId})
     
  },[])
  const columns = [
    {
      title: '账号',
      dataIndex: 'EquipmentCode',
      key:'EquipmentCode',
      align:'center',
    },
    {
      title: '姓名',
      dataIndex: 'PollutantTypeName',
      key:'PollutantTypeName',
      align:'center',
    },
    {
      title: '企业名称',
      dataIndex: 'PollutantName',
      key:'PollutantName',
      align:'center',
    },
    {
      title: '监测点名称',
      dataIndex: 'EquipmentName',
      key:'EquipmentName',
      align:'center',
    },
    {
      title: '服务器开始时间',
      dataIndex: 'EquipmentType',
      key:'EquipmentType',
      align:'center',
      sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
    },

    {
      title: '服务器截止时间',
      dataIndex: 'AnalyticalMethod',
      key:'AnalyticalMethod',
      align:'center',
      sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
    },
    {
      title: '状态',
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
               <Fragment><Tooltip title="编辑"> <a onClick={()=>{detail(record)}} ><DetailIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="确定删除吗？"   style={{paddingRight:5}}  onConfirm={()=>{ del(record)}} okText="是" cancelText="否">
                  <a><DelIcon/></a>
               </Popconfirm>
               </Tooltip>
               </Fragment> 
             </span>
      }
    },
  ];
const detailCol = [{
  title: '编号',
  dataIndex: 'EquipmentCode',
  key:'EquipmentCode',
  align:'center',
},
{
  title: '费用类型',
  dataIndex: 'PollutantName',
  key:'PollutantName',
  align:'center',
},
{
  title: '续费时长',
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
  dataIndex: 'Status',
  key:'Status', 
  align:'center',
  sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
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
              <Popconfirm  title="确定删除吗？"   style={{paddingRight:5}}  onConfirm={()=>{ del(record)}} okText="是" cancelText="否">
              <a><DelIcon/></a>
           </Popconfirm>
           </Tooltip>
           </Fragment> 
         </span>
  }
},]
 const [ detailVisible, setDetailVisible,] = useState(false)
  const detail = async (record) => {
    setDetailVisible(true)

  };

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



  
  
  const add = () => {
    setFromVisible(true)
    form2.resetFields();

  };

  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询

    try {
      const values = await form.validateFields();

      if(!(pageIndexs&& typeof  pageIndexs === "number")){ //不是分页的情况
        setPageIndex(1)
      }

      props.getCustomerOrderList({
        ...values,
        BTime: values.time&&moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
        ETime: values.time&&moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
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
        onFinish(pageIndex,pageSize)
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
    initialValues={{
      // Status:1
    }}
    className={styles["ant-advanced-search-form"]}
    onFinish={onFinish}
    onValuesChange={onValuesChange}
  >  
      <Row>
      <Form.Item label="账号" name="UserAccount"  >
            <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="企业名称" name="EntName"  style={{marginLeft:16,marginRight:-10}}>
         <Input placeholder="请输入" style={{width:200}} allowClear/>
      </Form.Item>
      <Form.Item label="状态" name="Status"  >
 
              <Select placeholder='请选择' allowClear style={{width:200}}>
                  <Option>进行中</Option>
                  <Option>已过期</Option>
              </Select>
      </Form.Item>
      </Row>
      <Row>
      <Form.Item label="服务时间" name="Time"  style={{marginRight:16}} >
      <RangePicker_   format="YYYY-MM-DD HH:mm:ss"  showTime="YYYY-MM-DD HH:mm:ss"style={{minWidth:450}}   allowClear />
      </Form.Item>
      <Form.Item>
      <Button loading={tableLoading}  type="primary" htmlType='submit' style={{marginRight:8}}>
          查询
     </Button>
     <Button    style={{marginRight:8}} onClick={()=>{form.resetFields()}}>
          重置
     </Button>
     <Button   onClick={()=>{ add()}} style={{marginRight:8}} >
          添加
     </Button>
     <Button   type="primary"  onClick={()=>{setRenewVisible(true)}}>
          续费
     </Button>
     </Form.Item>
     </Row>
     </Form>
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


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const durationList =[{name:'1个月',value:1},{name:'2个月',value:3},{name:'3个月',value:3},{name:'4个月',value:4},{name:'5个月',value:5},{name:'6个月',value:6},
  {name:'7个月',value:7},{name:'8个月',value:8},{name:'9个月',value:9},{name:'1年',value:12},{name:'2年',value:24},{name:'3年',value:36},{name:'4年',value:48},
  {name:'5年',value:60},]
  const [renewVisible,setRenewVisible ] = useState(false)
   return (
    <div  className={styles.custopmRenewSty} >
    <BreadcrumbWrapper>
    <Card title={searchComponents()}>
      <SdlTable
        rowSelection={rowSelection} 
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
        title={'添加'}
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
      <Form.Item   name="ID" hidden>
          <Input />
      </Form.Item> 
        <Form.Item label="账号" name="EquipmentCode" rules={[  { required: true, }]} >
          <InputNumber placeholder="请输入账号"  allowClear/>
      </Form.Item>
       <NumTips />
        <Form.Item label="企业" name="PollutantType" rules={[  { required: true, }]} >
            <Select placeholder='请选择企业' allowClear >
                 {/* {
                  customerOrderPointEntList[0]&&customerOrderPointEntList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.Name}</Option>
                  })
                }    */}
              </Select>
      </Form.Item>
        <Form.Item label="监测点" name="EquipmentName" rules={[  { required: true,  }]} >
              <Select placeholder='请选择' allowClear>
                          {
                   customerOrderPointEntList[0]&&customerOrderPointEntList.map(item => {
                    return <Option key={item.ID} value={item.Name}>{item.Name}</Option>
                  })
                }   
              </Select>
      </Form.Item>

        <Form.Item label="续费时长" name="EquipmentBrand" rules={[  { required: true, }]} >
        <Select placeholder='请选择' allowClear>
                  {
                   durationList.map(item => {
                    return <Option key={item.value} value={item.value}>{item.name}</Option>
                  })
                }   
              </Select>
      </Form.Item>

    </Form>
      </Modal>
      <Modal
        title={'续费时长'}
        visible={renewVisible}
        onOk={onModalOk}
        confirmLoading={loadingAddConfirm}
        onCancel={()=>{setRenewVisible(false)}}
        className={styles.fromModal}
        destroyOnClose
        
      >
    <div>续费时长:</div>
    <Radio.Group size="small" style={{ marginTop: 16 }}>
      {
        [1,2,3,4,5,6,7,8,9,].map(item=> <Radio.Button value={item}>{item}</Radio.Button>)
      }
    </Radio.Group><span style={{paddingLeft:5}}>个月</span>
    <div>
    <Radio.Group size="small" style={{ marginTop: 5 }}>
      {
        [1,2,3,4,5,].map(item=> <Radio.Button value={item}>{item}</Radio.Button>)
      }
    </Radio.Group><span style={{paddingLeft:5}}>年</span>

    <Row style={{ marginTop: 24 }}>续费后的时间为：<span>{}</span></Row>
    </div>
      </Modal>

      <Modal
        title={'详情'}
        visible={detailVisible}
        onCancel={()=>{setDetailVisible(false)}}
        destroyOnClose
        footer={null}
        wrapClassName='spreadOverModal'
      >
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDetailDatas}
        columns={detailCol}
        pagination={{
          // total:tableDetailTotal,
          // pageSize: pageSize,
          // current: pageIndex,
          // onChange: handleTableChange2,
        }}
      />
        </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);