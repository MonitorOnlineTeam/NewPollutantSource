/**
 * 功  能：点位匹配设置
 * 创建人： jab
 * 创建时间：2022.08.09
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,SnippetsOutlined,CheckCircleOutlined,CaretLeftFilled,CaretRightFilled, CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
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
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'pointMatchingSet'




const dvaPropsData =  ({ loading,pointMatchingSet,global }) => ({
  tableDatas:pointMatchingSet.tableDatas,
  tableLoading:loading.effects[`${namespace}/getPointStateRelationList`],
  tableTotal:pointMatchingSet.tableTotal,
  tableDetailDatas:pointMatchingSet.tableDetailDatas,
  tableDetailTotal:pointMatchingSet.tableDetailTotal,
  exportLoading: loading.effects[`${namespace}/exportPointStateRelationList`],
  renewOrderLoading: loading.effects[`${namespace}/renewOrder`] || false,
  tableDetailLoading: loading.effects[`${namespace}/getStatePointList`],
  entStateList:pointMatchingSet.entStateList,
  StateEntID:pointMatchingSet.StateEntID,
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
    getPointStateRelationList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getPointStateRelationList`,
        payload:payload,
      })
    },

    getStatePointList : (payload,) =>{//弹框
      dispatch({
        type: `${namespace}/getStatePointList`,
        payload:payload,
      })
      
    },
    operationStatePoint : (payload,callback) =>{ // 操作
      dispatch({
        type: `${namespace}/operationStatePoint`,
        payload:payload,
        callback:callback,
      })
      
    },
    deleteStatePoint:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/deleteStatePoint`, 
        payload:payload,
        callback:callback
      }) 
    },
    exportPointStateRelationList:(payload,callback)=>{ //导出
      dispatch({
        type: `${namespace}/exportPointStateRelationList`, 
        payload:payload,
        callback:callback
      }) 
    },
    getEntStateList : (payload,callback) =>{ // 匹配企业
      dispatch({
        type: `${namespace}/getEntStateList`,
        payload:payload,
        callback:callback,
      })
      
    },
    getPointStateList : (payload,callback) =>{ // 匹配监测点
      dispatch({
        type: `${namespace}/getPointStateList`,
        payload:payload,
        callback:callback,
      })  
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();



  
  


  const  { tableDatas,tableTotal,tableLoading,tableDetailDatas,StateEntID,tableDetailTotal,tableDetailLoading,exportLoading,entStateList,} = props; 
  

  const isRecord =  props.match&&props.match.path ? false : true;

 
 useEffect(()=>{  
      onFinish();
      props.getEntStateList({})
      props.updateState({StateEntID:undefined})
  },[])
  let columns = [
    {
      title: '行政区',
      dataIndex: 'regionName',
      key:'regionName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '企业',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '监测点',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key:'status',
      align:'center',
      ellipsis:true,
      render: (text, record) => {
        return  text=='离线'? <Tag color="red"> 离线 </Tag> : <Tag color="green"> 在线 </Tag>
     },
    },

    {
      title: '企业（重点）',
      dataIndex: 'stateEntName',
      key:'stateEntName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '监测点（重点）',
      dataIndex: 'statePointName',
      key:'statePointName',
      align:'center',
      ellipsis:true,
      
    },
    {
      title: '监测点编号（重点）',
      dataIndex: 'stateID',
      key:'stateID',
      align:'center',
      ellipsis:true,
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      width:180,
      ellipsis:true,
      render: (text, record) =>{
        return  <span>
               <Fragment><Tooltip title="匹配"> <a onClick={()=>{detail(record)}} ><SnippetsOutlined style={{fontSize:16}}/></a> </Tooltip><Divider type="vertical" /> </Fragment>
               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="删除匹配信息吗？"   style={{paddingRight:5}}  onConfirm={()=>{ del(record)}} okText="是" cancelText="否">
                  <a><DelIcon/></a>
               </Popconfirm>
               </Tooltip>
               </Fragment> 
             </span>
      }
    },
  ];
  if(isRecord){
    columns = columns.filter(item=>item.title!='操作')
  }
const detailCol = [{
  title: '行政区',
  dataIndex: 'regionName',
  key:'regionName',
  align:'center',
  ellipsis:true,
},
{
  title: '企业（重点）',
  dataIndex: 'stateEntName',
  key:'stateEntName',
  align:'center',
  ellipsis:true,
},
{
  title: '监测点（重点）',
  dataIndex: 'statePointName',
  key:'statePointName',
  align:'center',
  ellipsis:true,
},
{
  title: '排口编号（重点）',
  dataIndex: 'pointCode',
  key:'pointCode',
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
              <a  onClick={()=>{ choice(record)}}><CheckCircleOutlined  style={{fontSize:16}}/></a>
           </Tooltip>
           </Fragment> 
         </span>
  }
},]


  const [DGIMN,setDGIMN] = useState() 
  const [entName,setEntName] = useState()
  const [pointName,setPointName] = useState()
  const [pollutantType,setPollutantType] = useState()
  const [ detailVisible, setDetailVisible,] = useState(false)
  const detail = async (record) => {
    setDetailVisible(true)
    form2.resetFields();
    form2.setFieldsValue({ StateEntID: StateEntID })
    setDGIMN(record.DGIMN)
    setPollutantType(record.pollutantType)
    setEntName(record.entName)
    setPointName(record.pointName)
    setPageIndex2(1)
    onFinish2(1,pageSize2,record.DGIMN,StateEntID)
  };

  const del =  (record) => {
    if(!record.stateID){
        message.warning('请先选择匹配信息')
        return;
    }
    props.deleteStatePoint({DGIMN:record.DGIMN},()=>{
      onFinish()
    })
  };


  const choice = (record) => {
    props.operationStatePoint({DGIMN:DGIMN,StateID:record.pointCode,PollutantType:pollutantType},()=>{
      setDetailVisible(false)
      onFinish(pageIndex,pageSize);
    })
  };

  


  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询

    try {
      const values = await form.validateFields();

      if(!(pageIndexs&& typeof  pageIndexs === "number")){ //不是分页的情况
        setPageIndex(1)
      }
      props.getPointStateRelationList({
        ...values,
        PageIndex:pageIndexs&& typeof  pageIndexs === "number" ?pageIndexs:1,
        PageSize:pageSizes?pageSizes:pageSize
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const onFinish2 = async (pageIndexs,pageSizes,mn,StateEntID) =>{
    try {
      const values = await form2.validateFields();
      props.getStatePointList({
        ...values,
        StateEntID:StateEntID?StateEntID:values.StateEntID,
        DGIMN:mn?mn:DGIMN,
        PageIndex:pageIndexs,
        PageSize:pageSizes,
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
    props.exportPointStateRelationList({...par})
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
const onDetailValuesChange = (hangedValues, allValues) =>{
  if (Object.keys(hangedValues).join() == 'StateEntID') {
    if (!hangedValues.StateEntID) { //清空时 不走请求
      form2.setFieldsValue({ StateID: undefined })
      setPointList2([])
      props.updateState({StateEntID:undefined})
      return;
    }
    setPointLoading2(true)
    props.getPointStateList({ StateEntID: hangedValues.StateEntID }, (res) => {
      setPointList2(res)
      setPointLoading2(false)
    })
    props.updateState({StateEntID:hangedValues.StateEntID})
    form2.setFieldsValue({ StateID: undefined })
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
      <Form.Item label='匹配状态' name='Status' className='checkSty'>
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
    onFinish={() => {setPageIndex2(1); onFinish2(1, pageSize2) }}
    layout='inline'
    initialValues={{
    }}
    className={styles.queryForm}
    onValuesChange={onDetailValuesChange}
  >
      <Form.Item label='企业' name='StateEntID'>      
        <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 200}}>
            {
              entStateList[0] && entStateList.map(item => {
                return <Option key={item.EntCode} value={item.EntCode} >{item.EntName}</Option>
              })
            }
          </Select>
      </Form.Item>
      <Spin spinning={pointLoading2} size='small' style={{ top: 0, left: 20 }}>
        <Form.Item label='监测点名称' name='StateID' >

          <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 200}}>
            {
              pointList2[0] && pointList2.map(item => {
                return <Option key={item.PointCode} value={item.PointCode} >{item.PointName}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Spin>
        <Button type="primary" loading={tableDetailLoading} htmlType="submit">
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

  const cardComponents = () =>{
    return  <Card title={searchComponents()}>
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
   }
   return (
    <div  className={styles.pointMatchingSetSty} >
     {isRecord?
    <div>{cardComponents()}</div>
    :
    <BreadcrumbWrapper>
       {cardComponents()}
   </BreadcrumbWrapper>
 }
      <Modal
        title={`匹配：${entName} - ${pointName}`}
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