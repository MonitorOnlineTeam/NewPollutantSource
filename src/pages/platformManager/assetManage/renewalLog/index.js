/**
 * 功  能：续费日志
 * 创建人：jab
 * 创建时间：2022.07.08
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag,Tabs, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Tree,Drawer,Empty,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,CaretLeftFilled,CaretRightFilled, CreditCardFilled,ProfileFilled,DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "./style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import NumTips from '@/components/NumTips'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import UserList from '@/components/UserList'
const { TextArea } = Input;
const { Option } = Select;
const { TabPane }  = Tabs;
const namespace = 'renewalLog'




const dvaPropsData =  ({ loading,renewalLog,global }) => ({
  tableDatas:renewalLog.tableDatas,
  tableTotal:renewalLog.tableTotal,
  customerOrderUserList:renewalLog.customerOrderUserList,
  tableLoading: loading.effects[`${namespace}/getCustomerOrderLogs`],
  tableDetailDatas:renewalLog.tableDetailDatas,
  tableDetailTotal:renewalLog.tableDetailTotal,
  tableDetailLoading: loading.effects[`${namespace}/getCustomerOrderLogsDetail`],
  
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getCustomerOrderLogs:(payload)=>{ //列表  客户订单日志  客户订单详细日志
      dispatch({
        type: `${namespace}/getCustomerOrderLogs`,
        payload:payload,
      })
    },

    getCustomerOrderLogsDetail : (payload,) =>{//详情
      dispatch({
        type: `${namespace}/getCustomerOrderLogsDetail`,
        payload:payload,
      })
      
    },
   
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [data, setData] = useState([]);


  const [tableVisible,setTableVisible] = useState(false)



  const  { tableDatas,tableTotal,tableLoading,tableDetailDatas,tableDetailTotal,tableDetailLoading,} = props; 
  const [logType, setLogType ] = useState('1')


//  const userId = Cookie.get('currentUser') && JSON.parse(Cookie.get('currentUser')) && JSON.parse(Cookie.get('currentUser')).UserId
 
 useEffect(()=>{  
      onFinish();
  },[logType])


  const columns = [
    {
      title: '操作类型',
      dataIndex: 'OprationType',
      key:'OprationType',
      align:'center',
    },
    {
      title: '操作人',
      dataIndex: 'CreateUserName',
      key:'CreateUserName',
      align:'center',
    },
    {
      title: '操作时间',
      dataIndex: 'CreateTime',
      key:'CreateTime',
      align:'center',
    },
    {
      title: '操作内容',
      dataIndex: 'OprationContent',
      key:'OprationContent',
      align:'center',
      width:200,
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    // {
    //   title: <span>操作</span>,
    //   dataIndex: 'x',
    //   key: 'x',
    //   align: 'center',
    //   width:80,
    //   render: (text, record) =>{
    //     return  <span>
    //            <Fragment><Tooltip title="详情"> <a onClick={()=>{detail(record)}} ><DetailIcon /></a> </Tooltip>
    //            </Fragment> 
    //          </span>
    //   }
    // },
  ];
 
  const columns2 = [
    {
      title: '操作类型',
      dataIndex: 'OprationType',
      key:'OprationType',
      align:'center',
    },
    {
      title: '操作人',
      dataIndex: 'CreateUserName',
      key:'CreateUserName',
      align:'center',
    },
    {
      title: '操作时间',
      dataIndex: 'CreateTime',
      key:'CreateTime',
      align:'center',
    },
    {
      title: '操作内容',
      dataIndex: 'OprationContent',
      key:'OprationContent',
      align:'center',
      width:200,
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
  ];
  const  getCustomerOrderLogsDetailFun = (id,pageIndex,pageSize) =>{
    setPageIndex2(pageIndex)
    props.getCustomerOrderLogsDetail({ ID:id, LogType:logType, pageIndex: pageIndex? pageIndex : 1,  pageSize: pageSize? pageSize : pageSize2})

   }
  const [id,setId] = useState() 
  const [ detailTitle,setDetailTitle ] = useState()
  const [ detailVisible, setDetailVisible,] = useState(false)
  const detail = async (record) => {
    setDetailVisible(true)
    setId(record.ID)
    setDetailTitle(record.CreateUserName)
    getCustomerOrderLogsDetailFun(record.ID)
  };


  const [pageIndex2,setPageIndex2 ] = useState(1)
  const [pageSize2,setPageSize2 ] = useState(20)
  const handleTableChange2 =    (PageIndex, PageSize)=>{ //分页 详情
  setPageSize2(PageSize)
  setPageIndex2(PageIndex)
  props.getCustomerOrderLogsDetailFun(id,PageIndex,PageSize)
}

  


  const onFinish  = async (pageIndexs,pageSizes) =>{  //查询

    try {
      const values = await form.validateFields();

      if(!(pageIndexs&& typeof  pageIndexs === "number")){ //不是分页的情况
        setPageIndex(1)
      }
      props.getCustomerOrderLogs({
        ...values,
        BTime: values.Time&&moment(values.Time[0]).format("YYYY-MM-DD HH:mm:ss"),
        ETime: values.Time&&moment(values.Time[1]).format("YYYY-MM-DD HH:mm:ss"),
        Time:undefined,
        LogType:logType,                          // 客户订单日志 2客户订单详细日志
        pageIndex:pageIndexs&& typeof  pageIndexs === "number" ?pageIndexs:1,
        pageSize:pageSizes?pageSizes:pageSize,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  



  const searchComponents = () =>{
    return  <Form
    form={form}
    name="advanced_search"
    layout='inline'
    className={styles["ant-advanced-search-form"]}
    onFinish={onFinish}
  >  
      <Form.Item label="操作类型" name="OprationType"  >
 
              <Select placeholder='请选择' allowClear style={{width:200}}>
                  <Option value={'新增'}>新增</Option>
                  <Option value={'删除'}>删除</Option>
                  <Option value={'续费'}>续费</Option>
              </Select>
      </Form.Item>
      <Form.Item label="操作时间" name="Time" >
      <RangePicker_   style={{width:350}}  format="YYYY-MM-DD HH:mm:ss"  showTime="YYYY-MM-DD HH:mm:ss" allowClear />
      </Form.Item>
      <Form.Item>
      <Button loading={tableLoading}  type="primary" htmlType='submit' style={{marginRight:8}}>
          查询
     </Button>
     <Button    style={{marginRight:8}} onClick={()=>{form.resetFields()}}>
          重置
     </Button>
     </Form.Item>
     </Form>
  }

  const handleTableChange = (PageIndex, PageSize) =>{
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex,PageSize)
  }
  const [pageSize,setPageSize]=useState(20)
  const [pageIndex,setPageIndex]=useState(1)


  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // const onSelectChange = (newSelectedRowKeys,newSelectedRow) => {

  //     setSelectedRowKeys(newSelectedRowKeys);

  // };
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };
  




 
  //  rowSelection={rowSelection} 
  const tabContent =  <Card title={searchComponents()}>
    <SdlTable
   loading = {tableLoading}
   bordered
   dataSource={tableDatas}
   columns={columns}
   pagination={{
     total:tableTotal,
     pageSize: pageSize,
     current: pageIndex,
     onChange: handleTableChange,
   }}
 />
</Card>
    const onTabChange = (key) => {
      setLogType(key)
     
    };
   return (
    <div  className={styles.renewalLogSty} >
    <BreadcrumbWrapper>
    <Tabs activeKey={logType } tabPosition='left'   style={{paddingTop:16}} onChange={onTabChange}>
    <TabPane tab="客户订单日志" key="1">
        { tabContent}
      </TabPane>
      <TabPane tab="客户订单明细日志" key="2" >
      { tabContent}
      </TabPane>
      </Tabs>

   </BreadcrumbWrapper>

      <Modal
        title={`${detailTitle} - 详情`}
        visible={detailVisible}
        onCancel={()=>{setDetailVisible(false)}}
        destroyOnClose
        footer={null}
        wrapClassName='spreadOverModal'
        // width={'90%'}
      >
      <SdlTable
        loading = {tableDetailLoading}
        bordered
        dataSource={tableDetailDatas}
        columns={columns2}
        pagination={{
          total:tableDetailTotal,
          pageSize: pageSize2,
          current: pageIndex2,
          onChange: handleTableChange2,
        }}
      />
        </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);