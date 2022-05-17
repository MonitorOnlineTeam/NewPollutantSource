

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
import styles from "../style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import tableList from '@/pages/list/table-list';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'personalAchiev'




const dvaPropsData =  ({ loading,personalAchiev,global }) => ({
  tableDatas:personalAchiev.systemModelTableDatas,
  tableTotal:personalAchiev.systemModelTableTotal,
  tableLoading: loading.effects[`${namespace}/getSystemModelOfPoint`],
  exportLoading:loading.effects[`${namespace}/exportSystemModelOfPoint`],
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
        type: `${namespace}/getSystemModelOfPoint`,
        payload:payload,
      })
    },
    exportData : (payload,callback) =>{ // 导出
      dispatch({
        type: `${namespace}/exportSystemModelOfPoint`,
        payload:payload,
        callback:callback
      })
      
    },

    
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  
  const [ manufacturerId, setManufacturerId] = useState(undefined)

  const  { tableDatas,tableTotal,tableLoading,exportLoading} = props;
  

  useEffect(() => {
    onFinish(pageIndex,pageSize)
  },[]);

  const columns = [
    {
        title: '序号',
        align: 'center',
        width: 50,
        render: (text, record, index) => {
            return index + 1;
        }
    },
    {
      title: '行政区',
      dataIndex: 'RegionName',
      key:'RegionName',
      align:'center',
    },

    {
      title: '企业名称',
      dataIndex: 'EntName',
      key:'EntName',
      align:'center',
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key:'PointName',
      align:'center',
    },
    {
      title: '污染源类型',
      dataIndex: 'GasManufacturer',
      key:'GasManufacturer',
      align:'center',
      width:120,
    },
    {
      title: '任务单号',
      dataIndex: 'GasEquipment',
      key:'GasEquipment',
      align:'center',
      width:200,
    },
    {
      title: '任务来源',
      dataIndex: 'PMManufacturer',
      key:'PMManufacturer',
      align:'center',
    },  
    {
      title: '任务类型',
      dataIndex: 'PMEquipment',
      key:'PMEquipment', 
      align:'center',
    },
    {
      title: '运维人',
      dataIndex: 'PMEquipment',
      key:'PMEquipment', 
      align:'center',
    },
    {
      title: '完成时间',
      dataIndex: 'PMEquipment',
      key:'PMEquipment', 
      align:'center',
      sorter: (a, b) => moment(a.operationEndTime).valueOf() - moment(b.operationEndTime).valueOf()

    },
  ];

 



  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询
    try {
      const values = await form.validateFields();
      props.getTableData({
        ...values,
        ManufacturerId:manufacturerId,
        pageIndex:pageIndexs,
        pageSize:pageSizes,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }




  const handleTableChange = (PageIndex, PageSize) =>{
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex,PageSize)
  }

  const exports =  async () => {
    const values = await form.validateFields();
    props.exportData({
       ...values,
       pageIndex:undefined,
       pageSize:undefined,
    })
     
 };

  const [pageSize,setPageSize]=useState(20)
  const [pageIndex,setPageIndex]=useState(1)

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
    <div  className={styles.personalAchievSty}>
    <Card title={searchComponents()}>
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
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

