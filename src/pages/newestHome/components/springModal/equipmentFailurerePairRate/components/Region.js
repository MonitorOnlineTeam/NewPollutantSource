/**
 * 功  能：设备故障修复率
 * 创建人：jab
 * 创建时间：2021.2.25
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Spin, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Checkbox,   } from 'antd';
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
import point from '@/models/point';

const namespace = 'equipmentFailurerePairRate'



const dvaPropsData =  ({ loading,equipmentFailurerePairRate,global,point }) => ({
  tableDatas:equipmentFailurerePairRate.regTableDatas,
  tableLoading: loading.effects[`${namespace}/regGetRepairRateList`],
  exportLoading: equipmentFailurerePairRate.exportRegLoading,
  clientHeight: global.clientHeight,
  queryPar:equipmentFailurerePairRate.queryPar,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    regGetRepairRateList:(payload)=>{ // 行政区
      dispatch({
        type: `${namespace}/regGetRepairRateList`,
        payload:payload,
      })
    },
    exportRepairRateList:(payload)=>{ // 导出
      dispatch({
        type: `${namespace}/exportRepairRateList`,
        payload:payload,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [dates, setDates] = useState([]);
  const  { tableDatas,tableLoading,exportLoading,clientHeight,type,time,queryPar } = props; 
  
  
  useEffect(() => {
    initData();
  
  },[]);


  
  const [parType,setParType] = useState([])
  const initData = () =>{
      onFinish();
  }

  const exports = async  () => {
    const values = await form.validateFields();
    const par = {
      ...values,
      time:undefined,
      beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
      endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
      parameterCategory:values.parameterCategory? values.parameterCategory.toString() :'',
      pointType:1,
    }
      props.exportRepairRateList(par)

 };

 const columns = [
  {
    title: '序号',
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
    title: '故障总数(维修工单数)',
    dataIndex: 'repairCount',
    key:'repairCount',
    align:'center',
    sorter: (a, b) => a.repairCount - b.repairCount,
  },
  {
    title: '完成数(完成工单数)',
    dataIndex: 'repariComCount',
    key:'repariComCount',
    align:'center',
    sorter: (a, b) => a.repariComCount - b.repariComCount,
  },
  {
    title: '故障修复率',
    dataIndex: 'repairRate',
    key: 'repairRate',
    width: 150,
    align:'center',
    sorter: (a, b) => a.repairRate - b.repairRate,
    render: (text, record) => {
      return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
    }
  }
]


  const onFinish  = async () =>{  //查询

    try {
      const values = await form.validateFields();
      const par = {
        ...values,
        time:undefined,
        beginTime:moment(values.time[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime:moment(values.time[1]).format("YYYY-MM-DD HH:mm:ss"),
        parameterCategory:values.parameterCategory? values.parameterCategory.toString() :'',
        pointType:1,
      }
        props.regGetRepairRateList({ ...par  })
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
        ...queryPar,
        regionCode:row.regionCode
      }
    })
  }

  

  


  
  return (
    <div  className={styles.equipmentFailurerePairRateSty}>
   {!regionDetailVisible? <><Form
    form={form}
    name="advanced_search"
    onFinish={onFinish}
    initialValues={{
      pollutantType:type,
      time:time,
    }}
    style={{paddingBottom:15}}
    loading={tableLoading}
  >  
  <Row>
     <Form.Item label='日期' name='time'  style={{paddingRight:'16px'}}>
         <RangePicker allowClear={false} style={{width:'100%'}} 
          showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}/>
    </Form.Item> 
    <Form.Item label='监测点类型' name='pollutantType'  style={{paddingRight:'16px'}}>
        <Select placeholder='请选择' style={{width:150}}>
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
    </Row>
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