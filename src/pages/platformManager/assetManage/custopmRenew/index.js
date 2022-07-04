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
import UserList from '@/components/UserList'
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'custopmRenew'




const dvaPropsData =  ({ loading,custopmRenew,global }) => ({
  tableDatas:custopmRenew.tableDatas,
  tableLoading:custopmRenew.tableLoading,
  tableTotal:custopmRenew.tableTotal,
  customerOrderUserList:custopmRenew.customerOrderUserList,
  loadingAddConfirm: loading.effects[`${namespace}/addCustomerOrder`],
  tableDetailDatas:custopmRenew.tableDetailDatas,
  tableDetailTotal:custopmRenew.tableDetailTotal,
  userListLoading: loading.effects[`${namespace}/getCustomerOrderUserList`],
  customerOrderPointEntListLoading: loading.effects[`${namespace}/getCustomerOrderPointEntList`] || false,
  
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
    getCustomerOrderPointEntList : (payload,callback) =>{ // 获取客户订单企业与排口列表
      dispatch({
        type: `${namespace}/getCustomerOrderPointEntList`,
        payload:payload,
        callback:callback,
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

  const  { tableDatas,tableTotal,tableLoading,tableDetailDatas,tableDetailTotal, customerOrderUserList,loadingAddConfirm,customerOrderPointEntListLoading,userListLoading,} = props; 


//  const userId = Cookie.get('currentUser') && JSON.parse(Cookie.get('currentUser')) && JSON.parse(Cookie.get('currentUser')).UserId
 
 useEffect(()=>{  
      onFinish();
      props.getCustomerOrderUserList({})
  },[])
  const columns = [
    {
      title: '账号',
      dataIndex: 'UserAccount',
      key:'UserAccount',
      align:'center',
    },
    {
      title: '姓名',
      dataIndex: 'UserName',
      key:'UserName',
      align:'center',
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key:'EntName',
      align:'center',
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key:'PointName',
      align:'center',
    },
    {
      title: '服务器开始时间',
      dataIndex: 'BTime',
      key:'BTime',
      align:'center',
      sorter: (a, b) => moment(a.BTime).valueOf() - moment(b.BTime).valueOf()
    },

    {
      title: '服务器截止时间',
      dataIndex: 'ETime',
      key:'ETime',
      align:'center',
      sorter: (a, b) => moment(a.ETime).valueOf() - moment(b.ETime).valueOf()
    },
    {
      title: '状态',
      dataIndex: 'StatusName',
      key:'StatusName',
      align:'center',
      
    },
    {
      title: '创建人',
      dataIndex: 'CreateUserName',
      key:'CreateUserName',
      align:'center',
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key:'CreateTime', 
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
               <Fragment><Tooltip title="详情"> <a onClick={()=>{detail(record)}} ><DetailIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
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
        pageIndex:1,
        pageSize:pageSize,
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
        BTime: values.Time&&moment(values.Time[0]).format("YYYY-MM-DD HH:mm:ss"),
        ETime: values.Time&&moment(values.Time[1]).format("YYYY-MM-DD HH:mm:ss"),
        Time:undefined,
        Status:values.Status? values.Status : '',
        pageIndex:pageIndexs&& typeof  pageIndexs === "number" ?pageIndexs:1,
        pageSize:pageSizes?pageSizes:pageSize
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk  = async () =>{ //添加
  
    try {
      const values = await form2.validateFields();//触发校验
       props.addCustomerOrder({
        ...values,
        EntCode:undefined,
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
const renewOk = ()  =>{   //续费

  setSelectedRowKeys()
}

  const onValuesChange = (hangedValues, allValues)=>{
    if(Object.keys(hangedValues).join() == 'PollutantType'){
      props.getPollutantById({id:hangedValues.PollutantType,type:1}) //监测类别
      form.setFieldsValue({PollutantCode:undefined})

      // props.getEquipmentName({id:hangedValues.PollutantType,type:2}) //设备名称
      // form.setFieldsValue({EquipmentName:undefined})
    }
  }
    const [pageIndex2,setPageIndex2 ] = useState(1)
    const [pageSize2,setPageSize2 ] = useState(20)
    const handleTableChange2 =    (PageIndex, PageSize)=>{ //分页 详情
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    props.getProjectInfoList({PageIndex,PageSize})
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
                  <Option value={1}>进行中</Option>
                  <Option value={2}>已过期</Option>
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
  const [entList,setEntList ] = useState([])
  const [pointList,setPointList ] = useState([])

  const onAddEditValuesChange= (hangedValues, allValues)=>{
    if(Object.keys(hangedValues).join() == 'UserId'){
      form2.setFieldsValue({DGIMN:undefined})
      props.getCustomerOrderPointEntList({userId:hangedValues.UserId},(data)=>{// 企业 
        setEntList(data)

      })
    }
    if(Object.keys(hangedValues).join() == 'EntCode'){
      form2.setFieldsValue({DGIMN:undefined})
      const pointData = entList.filter(item=>item.EntCode === hangedValues.EntCode) 
      setPointList(pointData[0]?pointData[0].PointList : [])
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
  
  const [ renewETime,setRenewETime ] = useState()

  const [renewDay,setRenewDay] = useState()
  const renewMonthChang = (e) =>{
    let val = e.target.value;
    setRenewETime(moment().add(val.replace('个月',''), "month").format('YYYY-MM-DD 23:59:59'))
    console.log(val,renewDay)
    setRenewDay(val)
  }


  const renewYearChang = (e) =>{
    let val = e.target.value;
    setRenewETime(moment().add(val.replace('年',''), "year").format('YYYY-MM-DD 23:59:59'))
    setRenewDay(val)
  }

  const renewClick = (val) =>{ //双击取消
    if(val==renewDay){
      setRenewDay(undefined)
    }
  }

  const durationList =[{name:'1个月',value:1},{name:'2个月',value:2},{name:'3个月',value:3},{name:'4个月',value:4},{name:'5个月',value:5},{name:'6个月',value:6},
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
      }}
      onValuesChange={onAddEditValuesChange}
    > 
      <Spin spinning={userListLoading}  size='small' style={{marginTop:-9}}>
        <Form.Item label="账号" name="UserId" rules={[  { required: true, }]} >
        
        <Select placeholder='请选择' allowClear >
                  {
                  customerOrderUserList[0]&&customerOrderUserList.map(item => {
                    return <Option key={item.UserId} value={item.UserId}>{item.UserName}</Option>
                  })
                }   
              </Select>
      </Form.Item>
        </Spin>
       <Spin spinning={customerOrderPointEntListLoading} size='small' style={{marginTop:-9}}>
        <Form.Item label="企业" name="EntCode" rules={[  { required: true, }]} >
            <Select placeholder='请选择企业' allowClear >
                  {
                  entList[0]&&entList.map(item => {
                    return <Option key={item.EntCode} value={item.EntCode}>{item.EntName}</Option>
                  })
                }   
              </Select>
      </Form.Item>
      </Spin>
        <Form.Item label="监测点" name="DGIMN" rules={[  { required: true,  }]} >
              <Select placeholder='请选择' allowClear>
                   {
                   pointList[0]&&pointList.map(item => {
                    return <Option key={item.DGIMN} value={item.DGIMN}>{item.PointName}</Option>
                  })
                }   
              </Select>
      </Form.Item>

        <Form.Item label="续费时长" name="Month" rules={[  { required: true, }]} >
        <Select placeholder='请选择' allowClear>
                  {
                   durationList.map(item => {
                    return <Option key={item.name} value={item.name}>{item.name}</Option>
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
    <Radio.Group size="small" value={renewDay}  onChange={renewMonthChang} style={{ marginTop: 16 }}>
      {
        [1,2,3,4,5,6,7,8,9,].map(item=> <Radio.Button onClick={()=>{renewClick(`${item}个月`)}} value={`${item}个月`}>{item}</Radio.Button>)
      }
    </Radio.Group><span style={{paddingLeft:5}}>个月</span>
    <div>
    <Radio.Group value={renewDay}  onChange={renewYearChang} size="small" style={{ marginTop: 5 }}>
      {
        [1,2,3,4,5,].map(item=> <Radio.Button onClick={()=>{renewClick(`${item}年`)}} value={`${item}年`}>{item}</Radio.Button>)
      }
    </Radio.Group><span style={{paddingLeft:5}}>年</span>

    <Row style={{ marginTop: 24 }}>续费后的时间为：<span  className='red'>{renewETime}</span></Row>
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