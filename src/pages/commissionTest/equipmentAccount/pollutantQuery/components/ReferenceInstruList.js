

/**
 * 功  能：污染源信息 参比仪器设备信息
 * 创建人：jab
 * 创建时间：2022.07.20
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag, Typography,Space,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,FilterFilled,CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
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

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'pollutantQuery'




const dvaPropsData =  ({ loading,pollutantQuery,global }) => ({
  tableDatas:pollutantQuery.monitorParamTableDatas,
  tableTotal:pollutantQuery.monitorParamTableTotal,
  tableLoading: loading.effects[`${namespace}/getMonitorPointParamOfPoint`],
  exportLoading:loading.effects[`${namespace}/exportMonitorPointParamOfPoint`],
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
        type: `${namespace}/getMonitorPointParamOfPoint`,
        payload:payload,
      })
    },
    exportData : (payload,callback) =>{ // 导出
      dispatch({
        type: `${namespace}/exportMonitorPointParamOfPoint`,
        payload:payload,
        callback:callback
      })
      
    },

    
    
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  

  const  { tableDatas,tableTotal,tableLoading,exportLoading} = props;
  

  useEffect(() => {
   onFinish(pageIndex,pageSize)
  },[]);
  const [filteredInfo,setFilteredInfo] = useState(null) 

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
        title: '监测类型',
        dataIndex: 'PollutantTypeName',
        key:'PollutantTypeName',
        align:'center',
        ellipsis:true,
      },
    {
      title: '生产厂家',
      dataIndex: 'ParamName',
      key:'ParamName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '参比方法仪器名称型号',
      dataIndex: 'ParamName',
      key:'ParamName',
      align:'center',
      width:180,
      ellipsis:true,
    },
    {
      title: '检测依据',
      dataIndex: 'ParamName',
      key:'ParamName',
      align:'center',
      ellipsis:true,
    },
    {
      title: '设备编号',
      dataIndex: 'ParamName',
      key:'ParamName',
      align:'center',
      ellipsis:true,
    },
  ];

 



  const onFinish  = async (pageIndexs,pageSizes,) =>{  //查询
    try {
      const values = await form.validateFields();

      props.getTableData({
        ...values,
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
    return <><Form
    form={form}
    name="advanced_search"
    onFinish={() => { setPageIndex(1);  onFinish(1, pageSize,filteredInfo)}}
    initialValues={{
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
  </>
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
