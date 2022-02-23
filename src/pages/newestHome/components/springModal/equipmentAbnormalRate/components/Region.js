/**
 * 功  能：耗材统计
 * 创建人：贾安波
 * 创建时间：2021.1.21
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import RegionDetail from './RegionDetail'

const namespace = 'consumablesStatistics'



const dvaPropsData =  ({ loading,consumablesStatistics,global }) => ({
  tableDatas:consumablesStatistics.regTableDatas,
  tableLoading: loading.effects[`${namespace}/regGetConsumablesRIHList`],
  exportLoading: loading.effects[`${namespace}/exportTaskWorkOrderList`],
  clientHeight: global.clientHeight,
  queryPar:consumablesStatistics.queryPar,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    regGetConsumablesRIHList:(payload)=>{ // 行政区
      dispatch({
        type: `${namespace}/regGetConsumablesRIHList`,
        payload:payload,
      })
    },
    // exportTaskWorkOrderList:(payload)=>{ // 导出
    //   dispatch({
    //     type: `${namespace}/exportTaskWorkOrderList`,
    //     payload:payload,
    //   })
    // },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [dates, setDates] = useState([]);
  const  { tableDatas,tableLoading,exportLoading,clientHeight,type,time,queryPar } = props; 
  
  
  useEffect(() => {
    onFinish();
  
  },[]);


  


  const exports = async  () => {
    const values = await form.validateFields();
      props.exportTaskWorkOrderList({
        pageIndex:undefined,
        pageSize:undefined,
    })

 };
 const coommonCol = [
  {
    title: <span>异常类别（率）</span>,
    align:'center',
    children: [
      {
        title: '数据缺失',
        dataIndex: 'age',
        key: 'age',
        width: 150,
        sorter: (a, b) => a.age - b.age,
        render: (text, record) => {
          return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
        }
      },
      {
        title: '在线监测系统停运',
        dataIndex: 'age',
        key: 'age',
        width: 200,
        sorter: (a, b) => a.age - b.age,
        render: (text, record) => {
          return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
        }
      },
      {
        title: '数据恒定值',
        dataIndex: 'age',
        key: 'age',
        width: 150,
        sorter: (a, b) => a.age - b.age,
        render: (text, record) => {
          return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
        }
      },
      {
        title: '数据0值',
        dataIndex: 'age',
        key: 'age',
        width: 150,
        sorter: (a, b) => a.age - b.age,
        render: (text, record) => {
          return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
        }
      },
      {
        title: '数据故障',
        dataIndex: 'age',
        key: 'age',
        width: 150,
        sorter: (a, b) => a.age - b.age,
        render: (text, record) => {
          return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
        }
      },
      {
        title: '系统维护数据',
        dataIndex: 'age',
        key: 'age',
        width: 150,
        sorter: (a, b) => a.age - b.age,
        render: (text, record) => {
          return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
        }
      },
     ]
    },
    {
      title: '异常率',
      dataIndex: 'age',
      key: 'age',
      width: 150,
      sorter: (a, b) => a.age - b.age,
      render: (text, record) => {
        return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
      }
    }
  
 ]
 const columns = [
  {
    title: '序号',
    // dataIndex: 'x',
    // key:'x',
    align:'center',
    render:(text,record,index)=>{
     return  index +1 
    }
  },
  {
    title: '省',
    dataIndex: 'regionName',
    key:'regionName',
    align:'center',
    render:(text,record,index)=>{
      return  <Button type="link" onClick={()=>{ regionDetail(record)  }} >{text}</Button>
    }
  },
  {
    title: '运营企业数',
    dataIndex: 'sparePartCount',
    key:'sparePartCount',
    align:'center',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '运营监测点数',
    dataIndex: 'consumablesCount',
    key:'consumablesCount',
    align:'center',
    sorter: (a, b) => a.age - b.age,

  },
  ...coommonCol
]


  const onFinish  = async () =>{  //查询

    try {
      const values = await form.validateFields();
      const par = {
        ...values,
        time:undefined,
        beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
        pointType:1,
      }
        props.regGetConsumablesRIHList({ ...par  })
        props.updateState({
          queryPar:{ ...par }
        })
        
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  
  const [regionDetailVisible,setRegionDetailVisible] = useState(false)

  const regionDetail = (row) =>{ 
    setRegionDetailVisible(true)
    props.updateState({
      queryPar:{
        ...props.queryPar,
        regionCode:row.regionCode
      }
    })
  }
  const [regionName,setRegionName] = useState()

  const [sparePartsVisible,setSparePartsVisible] = useState(false)
  const sparePartsDetail = (row) =>{  //备品备件详情
    setSparePartsVisible(true)
    props.updateState({
      queryPar:{
        ...props.queryPar,
        regionCode:row.regionCode
      }
    })
    setRegionName(row.regionName)
  }
  
  const [consumablesVisible,setConsumablesVisible ] = useState(false)
  const consumablesDetail = (row) =>{  //易耗品详情
    setConsumablesVisible(true)
    props.updateState({
      queryPar:{
        ...props.queryPar,
        regionCode:row.regionCode
      }
    })
    setRegionName(row.regionName)
  }

  
  const [reagentReplaceVisible,setReagentReplaceVisible ] = useState(false)
  const reagentReplaceDetail = (row) =>{ //试剂更换数量
    setReagentReplaceVisible(true)
    props.updateState({
      queryPar:{
        ...props.queryPar,
        regionCode:row.regionCode
      }
    })
    setRegionName(row.regionName)
  }
  const [referenceMaterialReplaceVisible,setReferenceMaterialReplaceVisible ] = useState(false)
  const referenceMaterialReplaceDetail = (row) =>{ //标准物质更换数量
    setReferenceMaterialReplaceVisible(true)
    props.updateState({
      queryPar:{
        ...props.queryPar,
        regionCode:row.regionCode
      }
    })
    setRegionName(row.regionName)
  }
  
  queryPar.pollutantType==2&&columns.splice(-1,1,
      {
      title: '标准物质更换数量',
      dataIndex: 'standardGasCount',
      key:'standardGasCount',
      align:'center',
      render:(text,record,index)=>{
        return  <Button type="link" onClick={()=>{referenceMaterialReplaceDetail(record)  }} >{text}</Button>
      }
    })
  
  return (
    <div  className={styles.consumablesStatisticsSty}>
   {!regionDetailVisible? <><Form
    form={form}
    name="advanced_search"
    onFinish={onFinish}
    initialValues={{
      pollutantType:type,
      abnormalType:1,
      time:time
    }}
    layout='inline'
    style={{paddingBottom:15}}
  >  
     <Form.Item label='日期' name='time'  style={{paddingRight:'16px'}}>
         <RangePicker allowClear={false} style={{width:'100%'}} 
          showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}/>
    </Form.Item> 
    <Form.Item label='监测点类型' name='pollutantType'  style={{paddingRight:'16px'}}>
        <Select placeholder='监测点类型' style={{width:150}}>
           <Option value={1}>废水</Option>
           <Option value={2}>废气</Option>
           </Select>
       </Form.Item>
       <Form.Item>
           <Button  type="primary" htmlType='submit' >
         查询
    </Button>
    <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
           导出
    </Button> 
    </Form.Item>
  </Form>
  <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={ columns}
        pagination={false}
      />
      </>
      :
   
     <RegionDetail  onGoBack={()=>{setRegionDetailVisible(false)}}/>  // 行政区详情弹框 
    }

        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);