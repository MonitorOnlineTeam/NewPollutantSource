/**
 * 功  能：点位匹配设置
 * 创建人： jab
 * 创建时间：2022.08.09
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,CheckCircleOutlined,CaretLeftFilled,CaretRightFilled, CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import styles from "./style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import NumTips from '@/components/NumTips'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import UserList from '@/components/UserList'
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'pointMatchingSet'




const dvaPropsData =  ({ loading,pointMatchingSet,global }) => ({
  tableDatas:pointMatchingSet.tableDatas,
  tableLoading:pointMatchingSet.tableLoading,
  tableTotal:pointMatchingSet.tableTotal,
  tableDetailDatas:pointMatchingSet.tableDetailDatas,
  tableDetailTotal:pointMatchingSet.tableDetailTotal,
  exportLoading: loading.effects[`${namespace}/getCustomerOrderUserList`],
  renewOrderLoading: loading.effects[`${namespace}/renewOrder`] || false,
  tableDetailLoading: loading.effects[`${namespace}/getCustomerOrderInfoList`],
  
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getPointByEntCode: (payload, callback) => { // 根据企业获取监测点
      dispatch({
        type: `common/getPointByEntCode`,
        payload: payload,
        callback: callback
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
    deleteCustomerOrder:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/deleteCustomerOrder`, 
        payload:payload,
        callback:callback
      }) 
    },
    renewOrder:(payload,callback)=>{ //续费
      dispatch({
        type: `${namespace}/renewOrder`, 
        payload:payload,
        callback:callback
      }) 
    },
    getCustomerOrderInfoList:(payload)=>{ //客户订单详情
      dispatch({
        type: `${namespace}/getCustomerOrderInfoList`, 
        payload:payload,
      }) 
    },
    deleteCustomerOrderInfo:(payload,callback)=>{ //删除 客户订单详情
      dispatch({
        type: `${namespace}/deleteCustomerOrderInfo`, 
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

  const  { tableDatas,tableTotal,tableLoading,tableDetailDatas,tableDetailTotal,tableDetailLoading,exportLoading,} = props; 


  const isRecord =  props.match.path ==='/operations/remoteSupervisionRecord'? true : false;

 
 useEffect(()=>{  
      onFinish();
      props.getCustomerOrderUserList({})
  },[])
  const columns = [
    {
      title: '行政区',
      dataIndex: 'UserName',
      key:'UserName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '企业',
      dataIndex: 'EntName',
      key:'EntName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '监测点',
      dataIndex: 'PointName',
      key:'PointName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '状态',
      dataIndex: 'BTime',
      key:'BTime',
      align:'center',
      ellipsis:true,
      render: (text, record) => {
        return  text=='正常'? <Tag color="green"> 正常 </Tag> : <Tag color="red"> 已删除 </Tag>
     },
    },

    {
      title: '企业（重点）',
      dataIndex: 'ETime',
      key:'ETime',
      align:'center',
      ellipsis:true,
    },
    {
      title: '监测点（重点）',
      dataIndex: 'StatusName',
      key:'StatusName',
      align:'center',
      ellipsis:true,
      
    },
    {
      title: '监测点编号（重点',
      dataIndex: 'CreateUserName',
      key:'CreateUserName',
      align:'center',
      ellipsis:true,
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      width:180,
      ellipsis:true,
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
  title: '行政区',
  dataIndex: 'regionName',
  key:'regionName',
  align:'center',
  ellipsis:true,
},
{
  title: '企业（重点）',
  dataIndex: 'RenewalTypeName',
  key:'RenewalTypeName',
  align:'center',
  ellipsis:true,
},
{
  title: '监测点（重点）',
  dataIndex: 'RenewalTime',
  key:'RenewalTime',
  align:'center',
  ellipsis:true,
},
{
  title: '排口编号（重点）',
  dataIndex: 'CreateUserName',
  key:'CreateUserName',
  align:'center',
  ellipsis:true,
},

{
  title: <span>操作</span>,
  dataIndex: 'x',
  key: 'x',
  align: 'center',
  width:180,
  ellipsis:true,
  render: (text, record) =>{
    return  <span>
           <Fragment> <Tooltip title="选择">
              <a  onClick={()=>{ choice(record)}}><CheckCircleOutlined /></a>
           </Tooltip>
           </Fragment> 
         </span>
  }
},]

  const  getCustomerOrderInfoListFun = (id,pageIndexs,pageSizes) =>{
    setPageIndex2(pageIndex)
    props.getCustomerOrderInfoList({ ID:id, pageIndexs: pageIndexs? pageIndex : 1,  pageSize: pageSize? pageSizes : pageSize2})

   }
  const [id,setId] = useState() 
  const [entName,setEntName] = useState()
  const [ detailVisible, setDetailVisible,] = useState(false)
  const detail = async (record) => {
    setDetailVisible(true)
    setId(record.ID)
    setEntName(record.EntName)
    getCustomerOrderInfoListFun(record.ID)
  };

  const del =  (record) => {
    props.deleteCustomerOrder({ID:record.ID},()=>{
      onFinish()
    })
  };


  const choice = (record) => {
    props.deleteCustomerOrderInfo({ID:record.ID},()=>{
      getCustomerOrderInfoListFun(id)
      onFinish(pageIndex,pageSize);
    })
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

  const exports = async () => {
    const values = await form.getFieldsValue();
    const par = {
      ...values,
      Month: values.Month && moment(values.Month).format("YYYY-MM-01 00:00:00"),
    }
    props.exportPersonalPerformanceRate({...par})
};

  




 const [pointList,setPointList] = useState([])
 const [pointLoading,setPointLoading] = useState(false)
const onValuesChange = (hangedValues, allValues) => {
 if (Object.keys(hangedValues).join() == 'EntCode') {
   if (!hangedValues.EntCode) { //清空时 不走请求
     form.setFieldsValue({ DGIMN: undefined })
     setPointList([])
     return;
   }
   setPointLoading(true)
   props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
     setPointList(res)
     setPointLoading(false)
   })
   form.setFieldsValue({ DGIMN: undefined })
 }
}

const [pointList2,setPointList2] = useState([])
const [pointLoading2,setPointLoading2] = useState(false)
const onDetailValuesChange = () =>{
  if (Object.keys(hangedValues).join() == 'EntCode') {
    if (!hangedValues.EntCode) { //清空时 不走请求
      form2.setFieldsValue({ DGIMN: undefined })
      setPointList2([])
      return;
    }
    setPointLoading2(true)
    props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
      setPointList2(res)
      setPointLoading2(false)
    })
    form2.setFieldsValue({ DGIMN: undefined })
  }
}

  const searchComponents = () =>{
    return <Form
    form={form}
    name="advanced_search"
    onFinish={() => { onFinish(pageIndex, pageSize) }}
    initialValues={{
    }}
    className={styles.queryForm}
    onValuesChange={onValuesChange}
  >
    <Row align='middle'>
      <Form.Item label='行政区' name='RegionCode' className='regSty'>
        <RegionList levelNum={2} style={{ width: 200}}/>
      </Form.Item>
      <Form.Item label='企业' name='EntCode'>
        <EntAtmoList pollutantType={2} style={{ width: 200}}/>
      </Form.Item>
      <Spin spinning={pointLoading} size='small' style={{ top: -8, left: 20 }}>
        <Form.Item label='监测点名称' name='DGIMN' >

          <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 200}}>
            {
              pointList[0] && pointList.map(item => {
                return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Spin>
    </Row>

    <Row >
      <Form.Item label='匹配状态' name='CheckStatus' className='checkSty'>
        <Select placeholder='请选择' allowClear style={{ marginLeft: 0,width: 200}}>
          <Option key={1} value={1} >已匹配</Option>
          <Option key={2} value={2} >待匹配</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" loading={tableLoading} htmlType="submit">
          查询
       </Button>
        <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
          重置
        </Button>
        <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
          导出
       </Button>
      </Form.Item>
    </Row>
  </Form>
  }


const modalSearchComponents = () =>{
   return <Form
    form={form2}
    name="advanced_search"
    onFinish={() => { onFinish2(pageIndex2, pageSize2) }}
    layout='inline'
    initialValues={{
    }}
    className={styles.queryForm}
    onValuesChange={onDetailValuesChange}
  >
      <Form.Item label='企业' name='EntCode'>
        <EntAtmoList pollutantType={2} style={{ width: 200}}/>
      </Form.Item>
      <Spin spinning={pointLoading2} size='small' style={{ top: -8, left: 20 }}>
        <Form.Item label='监测点名称' name='DGIMN' >

          <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 200}}>
            {
              pointList2[0] && pointList2.map(item => {
                return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Spin>
        <Button type="primary" loading={tableLoading} htmlType="submit">
          查询
       </Button>


  </Form>
  }




  const [pageIndex,setPageIndex]=useState(1)
  const [pageSize,setPageSize]=useState(20)
  const handleTableChange = (PageIndex, PageSize) =>{
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex,PageSize)
  }

  const [pageIndex2,setPageIndex2]=useState(1)
  const [pageSize2,setPageSize2]=useState(20)
  const handleTableChange2 = (PageIndex, PageSize) =>{
    setPageIndex2(PageIndex)
    setPageSize2(PageSize)
    onFinish2(PageIndex,PageSize)
  }


   return (
    <div  className={styles.pointMatchingSetSty} >
    <BreadcrumbWrapper>
    <Card title={searchComponents()}>
      <SdlTable
        loading = {tableLoading}
        bordered
        resizable
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
        title={`匹配：${entName}`}
        visible={detailVisible}
        onCancel={()=>{setDetailVisible(false)}}
        destroyOnClose
        footer={null}
        wrapClassName='spreadOverModal'
      >
         <Card title={modalSearchComponents()}>
      <SdlTable
        loading = {tableDetailLoading}
        bordered
        resizable
        dataSource={tableDetailDatas}
        columns={detailCol}
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