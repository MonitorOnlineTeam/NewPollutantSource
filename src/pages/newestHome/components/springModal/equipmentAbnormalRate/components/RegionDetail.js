/**
 * 功  能：设备异常率
 * 创建人：jab
 * 创建时间：2021.2.24
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

const namespace = 'equipmentAbnormalRate'




const dvaPropsData =  ({ loading,equipmentAbnormalRate,global }) => ({
  tableDatas:equipmentAbnormalRate.regDetailTableDatas,
  tableLoading:loading.effects[`${namespace}/regDetailGetExecptionRateList`],
  exportLoading: loading.effects[`${namespace}/exportTaskWorkOrderList`],
  clientHeight: global.clientHeight,
  queryPar:equipmentAbnormalRate.queryPar,
  coommonCol:equipmentAbnormalRate.coommonCol,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    regDetailGetExecptionRateList:(payload)=>{ // 行政区详情
      dispatch({
        type: `${namespace}/regDetailGetExecptionRateList`,
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
  const  { tableDatas,tableLoading,exportLoading,clientHeight,type,time,queryPar,coommonCol } = props; 
  
  
  useEffect(() => {
    initData();
  
  },[]);


  const initData =  () => {
      props.regDetailGetExecptionRateList({
        ...props.queryPar,
         pointType:2,
    })
 };


  const exports = async  () => {
    const values = await form.validateFields();
      props.exportTaskWorkOrderList({
        ...queryPar,
        pointType:2,
    })

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
    title: '运营企业数',
    dataIndex: 'entCount',
    key:'entCount',
    align:'center',
    sorter: (a, b) => a.entCount - b.entCount,
  },
  {
    title: '运营监测点数',
    dataIndex: 'pointCount',
    key:'pointCount',
    align:'center',
    sorter: (a, b) => a.pointCount - b.pointCount,

  },
  ...coommonCol
]
   const [pointVisible,setPointVisible] = useState(false)
   const [regionName,setRegionName] = useState()
   const pointDetail = (row) =>{
    setPointVisible(true)
    props.updateState({
         queryPar:{
        ...props.queryPar,
        regionCode:row.regionCode
      }
    })
    setRegionName(row.regionName)
  }

  const [sparePartsVisible,setSparePartsVisible] = useState(false)


 


  return (
    <div  className={styles.equipmentAbnormalRateSty}>

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
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);