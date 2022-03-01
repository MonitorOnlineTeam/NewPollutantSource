/**
 * 功  能：运营企业监测点
 * 创建人：jab
 * 创建时间：2021.3.2
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

const namespace = 'operatingInfo'




const dvaPropsData =  ({ loading,operatingInfo,global }) => ({
  tableDatas:operatingInfo.tableDatas,
  tableLoading:loading.effects[`${namespace}/getOperateRIHPointList`],
  exportLoading: loading.effects[`${namespace}/exportOperateRIHPointList`],
  clientHeight: global.clientHeight,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getOperateRIHPointList:(payload)=>{ // 列表
      dispatch({
        type: `${namespace}/getOperateRIHPointList`,
        payload:payload,
      })
    },
    exportOperateRIHPointList:(payload)=>{ // 导出
      dispatch({
        type: `${namespace}/exportOperateRIHPointList`,
        payload:payload,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [dates, setDates] = useState([]);
  const  { tableDatas,tableLoading,exportLoading,clientHeight,pollutantType } = props; 
  
  
  useEffect(() => {
    initData();
  
  },[]);


  const initData =  () => {
      props.getOperateRIHPointList({
        regionCode:regionCode,
        pollutantType:pollutantType,
        pointType:2,
    })
 };


  const exports = async  () => {
      props.exportOperateRIHPointList({
        regionCode:regionCode,
        pollutantType:pollutantType,
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
  },
  {
    title: '企业名称',
    dataIndex: 'entName',
    key:'entName',
    align:'center',
    render:(text,record,index)=>{
      return  <div style={{textAlign:'left'}} >{text}</div>
    }
  },
  {
    title: '监测点名称',
    dataIndex: 'pointName',
    key:'pointName',
    align:'center',
  },
]
 pollutantType==2&&columns.splice(columns.length,0,{
  title: '排口类型',
  dataIndex: 'outputTypeName',
  key:'outputTypeName',
  align:'center',
})
  const [regionCode,setRegionCode ] = useState()
  return (
    <div  className={styles.operatingInfoSty}>
      <Form layout='inline'>
      <Form.Item style={{ paddingBottom: '16px' }}>
      <RegionList levelNum={2}  selectType={'2,是'} style={{ width: 200 }}  changeRegion={(val)=>{setRegionCode(val)}} />
        </Form.Item>
        <Form.Item style={{ paddingBottom: '16px' }}>
        <Button type='primary' loading={tableLoading} style={{ margin: '0 8px', }} onClick={() => { initData() }}>
          查询
     </Button>
        <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
          导出
    </Button>
      </Form.Item>
      </Form>
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