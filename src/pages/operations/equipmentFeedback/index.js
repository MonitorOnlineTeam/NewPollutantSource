/**
 * 功  能：设备故障反馈
 * 创建人：贾安波
 * 创建时间：2021.1.21
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,ProfileOutlined,EditOutlined } from '@ant-design/icons';
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
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'equipmentFeedback'




const dvaPropsData =  ({ loading,equipmentFeedback,global,common }) => ({
  tableDatas:equipmentFeedback.faultFeedbackList,
  tableLoading: loading.effects[`${namespace}/getFaultFeedbackList`],
  editLoading: loading.effects[`${namespace}/updateFaultFeedbackIsSolve`],
  exportLoading: loading.effects[`${namespace}/exportFaultFeedback`],
  pointListByEntCode:common.pointListByEntCode,
  pointLoading:loading.effects['common/getPointByEntCode'],
  clientHeight: global.clientHeight,
  tableTotal:global.tableTotal
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getFaultFeedbackList:(payload)=>{ // 列表
      dispatch({
        type: `${namespace}/getFaultFeedbackList`,
        payload:payload,
      })
    },
    updateFaultFeedbackIsSolve:(payload,callback)=>{ // 编辑
      dispatch({
        type: `${namespace}/updateFaultFeedbackIsSolve`,
        payload:payload,
        callback:callback
      })
    },
    getPointByEntCode:(payload)=>{ // 根据企业获取监测点
      dispatch({
        type: 'common/getPointByEntCode',
        payload:payload,
      })
    },
    exportFaultFeedback:(payload)=>{ // 导出
      dispatch({
        type: `${namespace}/exportFaultFeedback`,
        payload:payload,
      })
    },
    
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [showType,setShowType] = useState('1')
  const [dates, setDates] = useState([]);
  const  { tableDatas,tableLoading,exportLoading,clientHeight,type,time,tableTotal } = props; 
  
  
  useEffect(() => {
    onFinish(pageIndex,pageSize);
  
  },[]);


  


  const exports = async  () => {
    const values = await form.validateFields();
      props.exportTaskWorkOrderList({
        ...queryPar,
        pageIndex:undefined,
        pageSize:undefined,
    })

 };
 const [ID,setID] = useState()
 const columns = [
  {
    title: '序号',
    dataIndex: 'x',
    key:'x',
    align:'center',
    render:(text,record,index)=>{
     return  index +1 
    }
  },
  {
    title: '省/市',
    dataIndex: 'RegionName',
    key:'RegionName',
    align:'center',
  },
  {
    title: '企业名称',
    dataIndex: 'ParentName',
    key:'ParentName',
    align:'center',
  },
  {
    title: '监测点名称',
    dataIndex: 'PointName',
    key:'PointName',
    align:'center',
  },
  {
    title: '故障单元',
    dataIndex: 'FaultUnitName',
    key:'FaultUnitName',
    align:'center',
  },
  {
    title: '故障时间',
    dataIndex: 'FaultTime',
    key:'FaultTime',
    align:'center',
  },
  {
    title: '主机名称型号',
    dataIndex: 'EquipmentName',
    key:'EquipmentName',
    align:'center',
  },
  {
    title: '故障现象',
    dataIndex: 'FaultPhenomenon',
    key:'FaultPhenomenon',
    align:'center',
  },
  {
    title: '处理状态',
    dataIndex: 'IsSolve',
    key:'IsSolve',
    align:'center',
    render:(text,record,index)=>{
      if(text == 1){
        return  '待解决'
      } else if(text == 2){
        return  '已解决'
      }
     
     }
  },  
  {
    title: '反馈人',
    dataIndex: 'CreatUserName',
    key:'CreatUserName',
    align:'center',
  },
  {
    title: '反馈时间',
    dataIndex: 'CreatDateTime',
    key:'CreatDateTime', 
    align:'center',
  },
  {
    title: '操作',
    dataIndex: 'pointName',
    key:'pointName',
    align:'center',
    render: (text, record) => {
      return (
        <>
        <Tooltip title="编辑">
          <a onClick={() => {
            setVisible(true) 
            setID(record.ID)
            SetIsSolve(record.IsSolve)
            }}  >
            <EditOutlined style={{ fontSize: 16 }} />
          </a>
        </Tooltip>
            <Divider type="vertical" />
        <Tooltip title="详情">
          <a onClick={ () => {
            router.push({pathname:'/operations/equipmentFeedback/detail', query: {detailData: JSON.stringify(record) }}) 
          }}>
            <ProfileOutlined style={{ fontSize: 16 }} />
          </a>
        </Tooltip>
        </>
      )
          }
        
    }
]

 
  const [outOrInside,setOutOrInside] = useState(1)
  const onFinish  = async (pageIndex,pageSize) =>{  //查询
    try {
      const values = await form.validateFields();
        props.getFaultFeedbackList({
          ...values,
          time:undefined,
          FaultBTime:values.Time? moment(values.Time[0]).format("YYYY-MM-DD HH:mm:ss") : undefined,
          FaultETime:values.Time?moment(values.Time[1]).format("YYYY-MM-DD HH:mm:ss"): undefined,
          pageIndex: pageIndex,
          pageSize: pageSize,
        })
      

    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onExport = async () =>{
    const values = await form.validateFields();
    props.exportFaultFeedback({
      ...values,
      time:undefined,
      FaultBTime:values.Time? moment(values.Time[0]).format("YYYY-MM-DD HH:mm:ss") : undefined,
      FaultETime:values.Time?moment(values.Time[1]).format("YYYY-MM-DD HH:mm:ss"): undefined,
    })
  
  }
  const onEdit = () =>{
    props.updateFaultFeedbackIsSolve({
      ID:ID,
      IsSolve:IsSolve
    },()=>{
      setVisible(false)
      onFinish(pageIndex,pageSize)
    })
  }
  const changeEnt = (val) =>{
  }

  const onValuesChange = (hangedValues, allValues)=>{
    if(Object.keys(hangedValues).join() == 'EntCode'){
      props.getPointByEntCode({EntCode:hangedValues.EntCode})
      form.setFieldsValue({DGIMN:undefined})
    }
  }
  const [expand, setExpand] = useState(true)
  const [visible,setVisible] = useState(false)

  const { pointLoading, pointListByEntCode} = props;

  const [pageSize,setPageSize] = useState(20)
  const [pageIndex,setPageIndex] = useState(1)

  const handleTableChange =   (PageIndex, PageSize )=>{ //分页 打卡异常 响应超时 弹框
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex,PageSize)
  }

  const [ IsSolve, SetIsSolve ] = useState(1)
  return (
    <div  className={styles.equipmentFeedbackSty}>

    <BreadcrumbWrapper>
    <Card title={
    <Form
    form={form} 
    name="advanced_search"
    onFinish={()=>{onFinish(pageIndex,pageSize)}}
    initialValues={{
    }}
    className={styles.queryForm}
    onValuesChange={onValuesChange}
  >  
     <Row>
       <Col span={6}>
     <Form.Item label='行政区' name='RegionCode' >
       <RegionList style={{width:'100%'}} />
       </Form.Item>
       </Col>
       <Col span={6}>
       <Form.Item  label='企业' name='EntCode'>
        <EntAtmoList changeEnt={changeEnt} style={{width:'100%'}} />
       </Form.Item>
       </Col>
       <Col span={6}>
       <Form.Item label='监测点' name='DGIMN' >
         { pointLoading?
           <Spin size='small'/>
           :
          <Select placeholder='请选择' allowClear>
          {
            pointListByEntCode[0]&&pointListByEntCode.map(item => {
              return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
            })
          } 
           </Select> 
        }
       </Form.Item>
       </Col>
       <Col span={6}>
       <Form.Item label='故障单元' name='FaultUnitName'>
         <Input placeholder='请输入' allowClear/>
       </Form.Item>
       </Col>

      </Row>
       {expand&&<Row>
      <Col span={6}>
      <Form.Item label='故障时间' name='Time'>
         <RangePicker allowClear />
      </Form.Item> 
      </Col>
      <Col span={6}>
      <Form.Item label='主机名称型号' name='EquipmentName'>
         <Input placeholder='请输入' allowClear/>
       </Form.Item>
       </Col>
       <Col span={6}>
       <Form.Item label='故障现象' name='FaultPhenomenon'>
         <Input placeholder='请输入' allowClear/>
       </Form.Item>
       </Col>
       <Col span={6}>
          <Form.Item label='处理状态' name='IsSolve' >
            <Radio.Group>
            <Radio value={undefined}>全部</Radio>
            <Radio value={1}>待解决</Radio>
            <Radio value={2}>已解决</Radio>
          </Radio.Group>
       </Form.Item>
       </Col>
       </Row>}
       <Form.Item>
       <Button type="primary" loading={tableLoading}  htmlType="submit">
            查询
          </Button>
          <Button  style={{  margin: '0 8px'}} onClick={() => {  form.resetFields(); }}  >
            重置
          </Button> 
          <Button style={{  marginRight: 8}} loading={exportLoading}  icon={<ExportOutlined />} onClick={onExport}>
              导出
            </Button>
    <a  onClick={() => {setExpand(!expand);  }} >
       {expand ? <>收起 <UpOutlined /></>  : <>展开 <DownOutlined /></>} 
      </a>
    </Form.Item>
  </Form>}>
  <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={ columns}
        scroll={{ y: clientHeight - 500}}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total:tableTotal,
          pageSize:pageSize,
          current:pageIndex,
          onChange: handleTableChange,
      }}
      />
   </Card>
    </BreadcrumbWrapper>
    <Modal
      title='编辑'
      visible={visible}
      onOk={onEdit}
      destroyOnClose={true}
      onCancel={()=>{setVisible(false);SetIsSolve(1)}}
      width='50%'
      confirmLoading={props.editLoading}
    >
          <Row>
            <span>处理状态：</span>
            <Radio.Group value={IsSolve} onChange={(e)=>{{SetIsSolve(e.target.value)}}}>
            <Radio value={1}>待解决</Radio>
            <Radio value={2}>已解决</Radio>
          </Radio.Group>
         </Row>
    </Modal>
    </div>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);