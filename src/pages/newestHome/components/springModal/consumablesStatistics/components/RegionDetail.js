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
import Point from './Point'
import SpareParts from './SpareParts'
import Consumables from './Consumables'
import ReagentReplace from './ReagentReplace'
import ReferenceMaterialReplace from './ReferenceMaterialReplace'

const namespace = 'consumablesStatistics'




const dvaPropsData =  ({ loading,consumablesStatistics,global }) => ({
  tableDatas:consumablesStatistics.regDetailTableDatas,
  tableLoading:loading.effects[`${namespace}/regDetailGetConsumablesRIHList`],
  exportLoading: consumablesStatistics.exportRegDetailLoading,
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
    regDetailGetConsumablesRIHList:(payload)=>{ // 行政区详情
      dispatch({
        type: `${namespace}/regDetailGetConsumablesRIHList`,
        payload:payload,
      })
    },
    exportConsumablesRIHList:(payload)=>{ // 导出
      dispatch({
        type: `${namespace}/exportConsumablesRIHList`,
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


  const initData =  () => {
      props.regDetailGetConsumablesRIHList({
        ...queryPar,
         pointType:2,
    })
 };


  const exports = async  () => {
    const values = await form.validateFields();
      props.exportConsumablesRIHList({
        ...queryPar,
        pointType:2,
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
  // {
  //   title: '省/市',
  //   dataIndex: 'regionName',
  //   key:'regionName',
  //   align:'center',
  //   render:(text,record,index)=>{
  //     return  <Button type="link" onClick={()=>{ pointDetail(record)  }} >{text}</Button>
  //   }
  // },
    {
      title: '省',
      dataIndex: 'province',
      key:'province',
      align:'center',
      render: (text, record, index) => {
        if (text=='合计') {
            return { props: { colSpan: 0 }, };
        }
        return text;
    },
  },
  {
    title: '市',
    dataIndex: 'city',
    key:'city',
    align:'center',
    render:(text,record,index)=>{
      return { props: { colSpan: text=='合计'? 2 : 1},  children: <Button type="link" onClick={()=>{ pointDetail(record)  }} >{text}</Button>, };
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
    render:(text,record,index)=>{
      return  <Button type="link" onClick={()=>{reagentReplaceDetail(record)  }} >{text}</Button>
    }
  },
]
   const [pointVisible,setPointVisible] = useState(false)
   const [regionName,setRegionName] = useState()
   const pointDetail = (row) =>{
    setPointVisible(true)
        props.updateState({
         queryPar:{
        ...queryPar,
        regionCode:row.regionCode
      }
    })
    setRegionName(row.regionName)
  }

  const [sparePartsVisible,setSparePartsVisible] = useState(false)


  const sparePartsDetail = (row) =>{  //备品备件详情
    setSparePartsVisible(true)
    props.updateState({
      queryPar:{
        ...queryPar,
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
        ...queryPar,
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
        ...queryPar,
        regionCode:row.regionCode
      }
    })
    setRegionName(row.regionName)
  }
  const [referenceMaterialReplaceVisible,setReferenceMaterialReplaceVisible ] = useState(false)
  const referenceMaterialReplaceDetail = (row) =>{ //标准气体更换数量
    setReferenceMaterialReplaceVisible(true)
    props.updateState({
      queryPar:{
        ...queryPar,
        regionCode:row.regionCode
      }
    })
    setRegionName(row.regionName)
  }
  
  queryPar.pollutantType==2&&columns.splice(-1,1,
      {
      title: '标准气体更换数量',
      dataIndex: 'standardGasCount',
      key:'standardGasCount',
      align:'center',
      render:(text,record,index)=>{
        return  <Button type="link" onClick={()=>{referenceMaterialReplaceDetail(record)  }} >{text}</Button>
      }
    })
  return (
    <div  className={styles.consumablesStatisticsSty}>

  <Form.Item   style={{paddingBottom:'16px'}}>
    <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
           导出
    </Button>
    <Button  onClick={() => {props.onGoBack() }}> <RollbackOutlined />返回 </Button>
    </Form.Item>
    <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={ columns}
        pagination={false}
      />
       <Modal
        title={`${regionName} - 监测点`}
        visible={pointVisible}
        onCancel={()=>{setPointVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
        <Point />
        </Modal>
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
        title={`${regionName} - 易耗品更换数量`}
        visible={consumablesVisible}
        onCancel={()=>{setConsumablesVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
        <Consumables />
        </Modal>
        <Modal
        title={`${regionName} - 试剂更换数量`}
        visible={reagentReplaceVisible}
        onCancel={()=>{setReagentReplaceVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
        <ReagentReplace />
        </Modal>

        <Modal
        title={`${regionName} - 标准气体更换数量`}
        visible={referenceMaterialReplaceVisible}
        onCancel={()=>{setReferenceMaterialReplaceVisible(false)}}
        footer={null}
        destroyOnClose
        width='90%'
      >
        <ReferenceMaterialReplace />
        </Modal> 
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);