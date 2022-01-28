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

const namespace = 'consumablesStatistics'




const dvaPropsData =  ({ loading,consumablesStatistics,global }) => ({
  tableDatas:consumablesStatistics.regDetailTableDatas,
  tableLoading:loading.effects[`${namespace}/regDetailGetConsumablesRIHList`],
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
    regDetailGetConsumablesRIHList:(payload)=>{ // 行政区详情
      dispatch({
        type: `${namespace}/regDetailGetConsumablesRIHList`,
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
    initData();
  
  },[]);


  const initData =  () => {
      props.regDetailGetConsumablesRIHList({
        ...props.queryPar,
         pointType:3,
    })
  console.log(props.regionCode)
 };


  const exports = async  () => {
    const values = await form.validateFields();
      props.exportTaskWorkOrderList({
        ...queryPar,
        pointType:3,
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
    title: '省/市',
    dataIndex: 'regionName',
    key:'regionName',
    align:'center',
  },
  {
    title: '企业',
    dataIndex: 'entName',
    key:'entName',
    align:'center',
    render:(text,record,index)=>{
      return  <div style={{textAlign:'left'}} >{text}</div>
    }
  },
  {
    title: '监测点',
    dataIndex: 'pointName',
    key:'pointName',
    align:'center',
  },
  {
    title: '备品备件更换数量',
    dataIndex: 'sparePartCount',
    key:'sparePartCount',
    align:'center',
  },
  {
    title: '易耗品更换数量',
    dataIndex: 'consumablesCount',
    key:'consumablesCount',
    align:'center',
  },
  {
    title: '试剂更换数量',
    dataIndex: 'standardLiquidCount',
    key:'standardLiquidCount',
    align:'center',
  },
]



  return (
    <div  className={styles.consumablesStatisticsSty}>

      <Form.Item   style={{paddingBottom:'16px'}}>
    <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
           导出
    </Button>
    </Form.Item>
    <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={ columns}
        scroll={{ y: clientHeight - 500}}
        pagination={false}
      />
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);