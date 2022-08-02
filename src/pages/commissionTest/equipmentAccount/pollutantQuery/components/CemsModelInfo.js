

/**
 * 功  能：调试检测 - 污染源查询  CEMS型号信息
 * 创建人：jab
 * 创建时间：2022.07.20
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

const namespace = 'pollutantQuery'




const dvaPropsData =  ({ loading,pollutantQuery,global }) => ({
  tableDatas:pollutantQuery.testPointSystemTableDatas,
  tableTotal:pollutantQuery.testPointSystemTableTotal,
  tableLoading: loading.effects[`${namespace}/getTestPointSystemList`],
  exportLoading:loading.effects[`${namespace}/exportTestPointSystemList`],
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
        type: `${namespace}/getTestPointSystemList`,
        payload:payload,
      })
    },
    exportData : (payload,callback) =>{ // 导出
      dispatch({
        type: `${namespace}/exportTestPointSystemList`,
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
        ellipsis:true,
        render: (text, record, index) => {
          return  (index + 1) + (pageIndex-1)*pageSize;
      }
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key:'entName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key:'pointName',
      align:'center',
      ellipsis:true,
    },
    {
      title: 'CEMS系统名称',
      dataIndex: 'systemName',
      key:'systemName',
      align:'center',
      ellipsis:true,
    },
    {
      title: 'CEMS生产厂家',
      dataIndex: 'manufactorName',
      key:'manufactorName',
      align:'center',
      ellipsis:true,
    },
    {
      title: 'CEMS型号',
      dataIndex: 'systemModel',
      key:'systemModel',
      align:'center',
      ellipsis:true,
    },
    {
      title: 'CEMS编号',
      dataIndex: 'CEMSNum',
      key:'CEMSNum',
      align:'center',
      width:200,
      ellipsis:true,
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
    onFinish={() => { setPageIndex(1);  onFinish(1, pageSize) }}
    initialValues={{
      month: moment(moment().format('YYYY-MM'))
    }}
    layout='inline'
  >
       <Form.Item label='企业名称' name='EntName'>
       <Input allowClear placeholder='请输入'/>
      </Form.Item>
      <Form.Item>
        <Button   loading={tableLoading} type="primary" loading={tableLoading} htmlType="submit">
          查询
       </Button>
        <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
          重置
        </Button>
        <Button icon={<ExportOutlined />}   loading={exportLoading}  onClick={()=>{ exports()} }>
            导出
         </Button> 
      </Form.Item>
  </Form>
  }
  return (
    <div  className={styles.pollutantQuerySty}>
    <Card title={searchComponents()}>
      <SdlTable
        resizable
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

