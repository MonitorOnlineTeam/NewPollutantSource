/**
 * 功  能：耗材统计 备品备件
 * 创建人：贾安波
 * 创建时间：2022.1.28
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
  summaryTableDatas:consumablesStatistics.summaryTableDatas,
  summaryTableLoading:loading.effects[`${namespace}/summaryGetConsumablesRIHList`],
  summaryTableTotal:consumablesStatistics.summaryTableTotal,
  detailedTableDatas:consumablesStatistics.detailedTableDatas,
  detailedTableLoading:loading.effects[`${namespace}/detailedGetConsumablesRIHList`],
  detailedTableTotal:consumablesStatistics.detailedTableTotal,
  // exportLoading: loading.effects[`${namespace}/exportTaskWorkOrderList`],
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
    summaryGetConsumablesRIHList:(payload)=>{ // 备品备件 汇总
      dispatch({
        type: `${namespace}/summaryGetConsumablesRIHList`,
        payload:payload,
      })
    },
    detailedGetConsumablesRIHList:(payload)=>{ // 备品备件 明细
      dispatch({
        type: `${namespace}/detailedGetConsumablesRIHList`,
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
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const  { summaryTableDatas,summaryTableLoading,summaryTableTotal,detailedTableDatas,detailedTableLoading,detailedTableTotal,exportLoading,clientHeight,type,time } = props; 
  
  
  useEffect(() => {
    summaryGetConsumablesRIHLists();
    detailedGetConsumablesRIHLists();
  },[]);



  const summaryGetConsumablesRIHLists =(values,PageIndex,PageSize)=>{ //汇总
    props.summaryGetConsumablesRIHList({ 
      ...props.queryPar,
      ...values, 
      pointType:4,
      articlesType:3,
      pageIndex:PageIndex? PageIndex: pageIndex1,
      pageSize:PageSize? PageSize: pageSize1,
      
   })
  }
  const detailedGetConsumablesRIHLists =(values,PageIndex,PageSize)=>{ //明细
    props.detailedGetConsumablesRIHList({ 
      ...props.queryPar,
      ...values, 
      pointType:5,
      articlesType:3,
      pageIndex:PageIndex? PageIndex: pageIndex1,
      pageSize:PageSize? PageSize: pageSize1,
   })
  }
 const onFinish1  = async () =>{  //查询 汇总

    try {
      const values = await form1.validateFields();
       summaryGetConsumablesRIHLists(values)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onFinish2  = async () =>{  //查询 明细

    try {
      const values = await form2.validateFields();
        detailedGetConsumablesRIHLists(values)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const [pageIndex1,setPageIndex1] = useState(1)
  const [pageSize1,setPageSize1] = useState(10)
  const handleTableChange1 = async (PageIndex, PageSize )=>{ //分页  汇总
    setPageSize1(PageSize)
    setPageIndex1(PageIndex)
    const values = await form1.validateFields();
    summaryGetConsumablesRIHLists(values,PageIndex, PageSize)
  }
  const [pageIndex2,setPageIndex2] = useState(1)
  const [pageSize2,setPageSize2] = useState(10)
  const handleTableChange2 = async (PageIndex, PageSize )=>{ //分页  明细
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    const values = await form2.validateFields();
    detailedGetConsumablesRIHLists(values,PageIndex, PageSize)
  } 
//   const exports = async  () => {
//     const values = await form.validateFields();
//       props.exportTaskWorkOrderList({
//         ...queryPar,
//         pointType:2,
//     })

//  };
const columns1 = [
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
    title: '存货编码',
    dataIndex: 'partCode',
    key:'partCode',
    align:'center',
  },
  {
    title: '标准物质名称',
    dataIndex: 'name',
    key:'name',
    align:'center',
  },
  {
    title: '更换数量',
    dataIndex: 'count',
    key:'count',
    align:'center',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key:'unit',
    align:'center',
  },
]
const columns2 = [
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
  {
    title: '存货编码',
    dataIndex: 'partCode',
    key:'partCode',
    align:'center',
  },
  {
    title: '标准物质名称',
    dataIndex: 'name',
    key:'name',
    align:'center',
  },
  {
    title: '更换数量',
    dataIndex: 'num',
    key:'num',
    align:'center',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key:'unit',
    align:'center',
  },
  {
    title: '更换人员',
    dataIndex: 'operationName',
    key:'operationName',
    align:'center',
  },
  {
    title: '更换时间',
    dataIndex: 'replaceDate',
    key:'replaceDate',
    align:'center',
    width:150,
  },
  {
    title: '有效日期',
    dataIndex: 'overdueDate',
    key:'overdueDate',
    align:'center',
    width:150,
  },
]

  const Content = () =>{
    return <div>
    <>
    {tabsType==1?

    <Form
    form={form1}
    name="advanced_search"
    onFinish={onFinish1}
    initialValues={{
    }}
    layout='inline'
    style={{paddingBottom:15}}
  >  
    <Form.Item label='存货编码' name='stockCode'  style={{paddingRight:'16px'}}>
      <Input placeholder='请输入' allowClear/>
    </Form.Item> 
    <Form.Item label='标准物质名称' name='sparePartsName'  style={{paddingRight:'16px'}}>
      <Input placeholder='请输入' allowClear/>
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
    :
    <Form
    form={form2}
    name="advanced_search"
    onFinish={onFinish2}
    initialValues={{
    }}
    layout='inline'
    style={{paddingBottom:15}}
  >  
     <Form.Item label='企业名称' name='entName'  style={{paddingRight:'16px'}}>
      <Input placeholder='请输入' allowClear/>
     </Form.Item>
    <Form.Item label='存货编码' name='stockCode'  style={{paddingRight:'16px'}}>
      <Input placeholder='请输入' allowClear/>
    </Form.Item> 
    <Form.Item label='标准物质名称' name='sparePartsName'  style={{paddingRight:'16px'}}>
      <Input placeholder='请输入' allowClear/>
    </Form.Item> 
       <Form.Item>
           <Button  type="primary" htmlType='submit' >
         查询
    </Button>
    <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
           导出
    </Button> 
    </Form.Item> 
    </Form>}
    </>
  {tabsType==1?

    <SdlTable
        loading = {summaryTableLoading}
        bordered
        dataSource={summaryTableDatas}
        columns={columns1}
        scroll={{ y: clientHeight - 500}}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total:summaryTableTotal,
          pageSize:pageSize1,
          current:pageIndex1,
          onChange: handleTableChange1,
      }}
      />
      :
      <SdlTable
      loading = {detailedTableLoading}
      bordered
      dataSource={detailedTableDatas}
      columns={ columns2}
      scroll={{ y: clientHeight - 500}}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        total:detailedTableTotal,
        pageSize:pageSize2,
        current:pageIndex2,
        onChange: handleTableChange2,
    }}
    />
    }
      </div>
  }

  const [ tabsType,setTabsType] = useState("1")
  return (
    <div  className={styles.consumablesStatisticsSty}>
  <Tabs defaultActiveKey="1" style={{ marginBottom: 32 }} onChange={(val)=>{setTabsType(val)}} type="card">
          <TabPane tab="汇总" key="1">
          <Content />
          </TabPane>
          <TabPane tab="明细" key="2">
          <Content />
          </TabPane>
        </Tabs>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);