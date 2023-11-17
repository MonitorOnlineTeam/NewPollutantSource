/**
 * 功  能：设备故障修复率
 * 创建人：jab
 * 创建时间：2021.2.25
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

const namespace = 'equipmentFailurerePairRate'




const dvaPropsData =  ({ loading,equipmentFailurerePairRate,global }) => ({
  tableDatas:equipmentFailurerePairRate.regDetailTableDatas,
  tableLoading:loading.effects[`${namespace}/regDetailGetRepairRateList`],
  exportLoading: equipmentFailurerePairRate.exportRegDetailLoading,
  clientHeight: global.clientHeight,
  queryPar:equipmentFailurerePairRate.queryPar,
  tableTotal:equipmentFailurerePairRate.regDetailTableTotal,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    regDetailGetRepairRateList:(payload)=>{ // 行政区详情
      dispatch({
        type: `${namespace}/regDetailGetRepairRateList`,
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
  const  { tableDatas,tableLoading,exportLoading,clientHeight,type,time,queryPar,tableTotal } = props; 
  
  
  useEffect(() => {
    initData();
  
  },[]);


  const initData =  () => {
      props.regDetailGetRepairRateList({
        ...queryPar,
         pointType:2,
         pageIndex:pageIndex,
         pageSize:pageSize,
    })
 };


  const exports = async  () => {
    const values = await form.validateFields();
      props.exportRepairRateList({
        ...queryPar,
        pointType:2,
    })

 };

 const [pageIndex,setPageIndex] = useState(1)
 const [pageSize,setPageSize] = useState(20)

 const handleTableChange = (PageIndex, PageSize )=>{ //分页
  setPageIndex(PageIndex)
  setPageSize(PageSize)
  props.regDetailGetRepairRateList({
    ...queryPar,
    pointType:2,
    pageIndex:PageIndex,
    pageSize:PageSize,
  })
 }

 const columns = [
  {
    title: '序号',
    align:'center',
    render:(text,record,index)=>{
     return (index + 1) + (pageIndex-1)*pageSize
    }
  },
  {
    title: '省/市',
    dataIndex: 'regionName',
    key:'regionName',
    align:'center',
    ellipsis: true,
    width:150,
    render:(text,record,index)=>{
      return  <a onClick={()=>{ pointDetail(record)  }} >{text}</a>
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
  return (
    <div  className={styles.equipmentFailurerePairRateSty}>

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
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          current:pageIndex,
          pageSize:pageSize,
          total:tableTotal,
          onChange: handleTableChange,
      }}
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
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);