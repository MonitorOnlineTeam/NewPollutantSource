/**
 * 功  能：耗材统计
 * 创建人：贾安波
 * 创建时间：2021.1.21
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tabs   } from 'antd';
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
const { TabPane } = Tabs;
import Point from './Point'




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
    onFinish();
  
  },[]);


 const onFinish  = async () =>{  //查询

    try {
      const values = await form.validateFields();
        props.regDetailGetConsumablesRIHList({ 
            ...props.queryPar,
            ...values, 
            pointType:4,
            articlesType:1,
            
         })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

//   const exports = async  () => {
//     const values = await form.validateFields();
//       props.exportTaskWorkOrderList({
//         ...queryPar,
//         pointType:2,
//     })

//  };
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
    render:(text,record,index)=>{
      return  <Button type="link" onClick={()=>{ pointDetail(record)  }} >{text}</Button>
    }
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
   const [pointVisible,setPointVisible] = useState(false)

   const pointDetail = (row) =>{
    setPointVisible(true)
    props.updateState({
      queryPar:{
        ...props.queryPar,
        regionCode:row.regionCode
      }
    })
  }


  return (
    <div  className={styles.consumablesStatisticsSty}>
  <Tabs defaultActiveKey="1" style={{ marginBottom: 32 }} type="card">
          <TabPane tab="汇总" key="1">

          <Form
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
     <Form.Item label='仓库名称' name='time'  style={{paddingRight:'16px'}}>
      <Input placeholder='请输入'/>
    </Form.Item> 
    <Form.Item label='存货编号' name='time'  style={{paddingRight:'16px'}}>
      <Input placeholder='请输入'/>
    </Form.Item> 
    <Form.Item label='备品备件名称' name='time'  style={{paddingRight:'16px'}}>
      <Input placeholder='请输入'/>
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
        scroll={{ y: clientHeight - 500}}
        pagination={false}
      />
          </TabPane>
          <TabPane tab="明细" key="2">
            明细
          </TabPane>
        </Tabs>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);