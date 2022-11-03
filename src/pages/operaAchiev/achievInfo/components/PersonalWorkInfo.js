

/**
 * 功  能：个人绩效查  个人工单信息
 * 创建人：jab
 * 创建时间：2022.05.17
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Card,Space, Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,FilterFilled , CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import NumTips from '@/components/NumTips'
import styles from "../../style.less";
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import tableList from '@/pages/list/table-list';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'operaAchiev'




const dvaPropsData =  ({ loading,operaAchiev,global }) => ({
  tableDatas:operaAchiev.individualTaskInfo,
  tableTotal:operaAchiev.individualTaskTotal,
  tableLoading: loading.effects[`${namespace}/getIndividualTaskInfo`],
  exportLoading:loading.effects[`${namespace}/exportIndividualTaskInfo`],
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
    getTableData:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getIndividualTaskInfo`,
        payload:payload,
      })
    },
    exportData : (payload,callback) =>{ // 导出
      dispatch({
        type: `${namespace}/exportIndividualTaskInfo`,
        payload:payload,
        callback:callback
      })
      
    },

    
  }
}
const Index = (props) => {



  const [form] = Form.useForm();


  const  { tableDatas,tableTotal,tableLoading,exportLoading,detailPar} = props;
  

  useEffect(() => {
    props.getTableData({...detailPar,pageIndex:pageIndex,pageSize:pageSize,})

  },[]);

  const columns = [
    {
        title: '序号',
        align: 'center',
        width: 50,
        ellipsis:true,
        render: (text, record, index) => {
            return index + 1;
        }
    },
    {
      title: '行政区',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
      ellipsis:true,
    },

    {
      title: '企业名称',
      dataIndex: 'EntName',
      key:'EntName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key:'PointName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '污染源类型',
      dataIndex: 'PollutantTypeName',
      key:'PollutantTypeName',
      align:'center',
      width:120,
      ellipsis:true,
    },
    {
      title: '任务单号',
      dataIndex: 'TaskCode',
      key:'TaskCode',
      align:'center',
      width:200,
      ellipsis:true,
    },
    {
      title: '运维状态',
      dataIndex: 'OperationStatus',
      key:'OperationStatus', 
      align:'center',
      ellipsis:true,
    }, 
    {
      title: '任务来源',
      dataIndex: 'TaskFromText',
      key:'TaskFromText',
      align:'center',
      ellipsis:true,
    }, 
    {
      title: '任务类型',
      dataIndex: 'TaskTypeText',
      key:'TaskTypeText', 
      align:'center',
      ellipsis:true,
    },
    {
      title: '任务状态',
      dataIndex: 'TaskStatus',
      key:'TaskStatus', 
      align:'center',
      ellipsis:true,
    },
    {
      title: '运维人',
      dataIndex: 'OperationsUserName',
      key:'OperationsUserName', 
      align:'center',
      ellipsis:true,
    },
    {
      title: '完成时间/系统关闭时间',
      dataIndex: 'CompleteTime',
      key:'CompleteTime', 
      align:'center',
      width:200,
      ellipsis:true,
      sorter: (a, b) => moment(a.CompleteTime).valueOf() - moment(b.CompleteTime).valueOf()

    },
  ];

 





  const [pageIndex,setPageIndex]=useState(1)
  const [pageSize,setPageSize]=useState(20)
  const handleTableChange = (PageIndex, PageSize) =>{
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    props.getTableData({...detailPar,pageIndex:PageIndex,pageSize:PageSize,})

  }

  const exports =  async () => {
    props.exportData({...detailPar})
     
 };



  const searchComponents = () =>{
    return <Form
    form={form}
    name="advanced_search"
    layout='inline'
  >

      <Form.Item>
        <Button icon={<ExportOutlined />}   loading={exportLoading}  onClick={()=>{ exports()} }>
            导出
         </Button> 
      </Form.Item>
  </Form>
  }
  return (
    <div    className={styles.operaAchievSty}>
    <Card title={searchComponents()}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        resizable
        pagination={{
          total:tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />
   </Card>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);

