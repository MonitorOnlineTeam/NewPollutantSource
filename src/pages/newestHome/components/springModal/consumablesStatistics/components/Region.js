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
import SpareParts from './SpareParts'
import Consumables from './Consumables'

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
  const  { tableDatas,tableLoading,exportLoading,clientHeight,type,time } = props; 
  
  
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
    title: '省',
    dataIndex: 'regionName',
    key:'regionName',
    align:'center',
    render:(text,record,index)=>{
      return  <Button type="link" onClick={()=>{ regionDetail(record)  }} >{text}</Button>
    }
  },
  {
    title: '备品备件更换数量',
    dataIndex: 'sparePartCount',
    key:'sparePartCount',
    align:'center',
    render:(text,record,index)=>{
      return  <Button type="link" onClick={()=>{ sparePartsDetail(record)  }} >{text}</Button>
    }
  },
  {
    title: '易耗品更换数量',
    dataIndex: 'consumablesCount',
    key:'consumablesCount',
    align:'center',
    render:(text,record,index)=>{
      return  <Button type="link" onClick={()=>{ consumablesDetail(record)  }} >{text}</Button>
    }
  },
  {
    title: '试剂更换数量',
    dataIndex: 'standardLiquidCount',
    key:'standardLiquidCount',
    align:'center',
  },
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

       <Modal
        title={`${regionName} - 备品备件更换数量`}
        visible={sparePartsVisible}
        onCancel={()=>{setSparePartsVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
        <SpareParts />
        </Modal>
        <Modal
        title={`${regionName} - 备品备件更换数量`}
        visible={consumablesVisible}
        onCancel={()=>{setConsumablesVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
        <Consumables />
        </Modal>
        
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);