/**
 * 功  能：系统管理 日志管理
 * 创建人：jab
 * 创建时间：2023.08.01
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import RangePicker_ from '@/components/RangePicker/NewRangePicker';


const namespace = 'logManger'




const dvaPropsData = ({ loading, logManger }) => ({
  tableDatas: logManger.tableDatas,
  pointDatas: logManger.pointDatas,
  tableLoading: loading.effects[`${namespace}/getSystemExceptionList`] || loading.effects[`${namespace}/deleteSystemException`],
  tableTotal: logManger.tableTotal,
  queryPar:logManger.queryPar,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getSystemExceptionList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getSystemExceptionList`,
        payload: payload,
      })
    },
    updateOperationUser: (payload, callback) => { // 添加
      dispatch({
        type: `${namespace}/updateOperationUser`,
        payload: payload,
        callback: callback
      })

    },
    deleteSystemException: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/deleteSystemException`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();



  const { tableDatas,tableTotal, tableLoading,queryPar, } = props;
  useEffect(() => {
    onFinish(pageIndex,pageSize);
  }, []);
//   const get_len = (str) =>{
//     let len=str.length;
//     let realLen=len;
//     for(let i=0;i<len;i++){
//        let code=str.charCodeAt(i);
//         if(!(code>=0&&code<=128)){
//             realLen++;
//         }
//     }
//     return realLen;
// }
// const ellipsis=(text, maxLength) =>{
//     var ret = text;
//     if (get_len(text) > maxLength) {
//         ret = ret.substr(0,maxLength-3) + "...";
//     }
//     return ret;
// }
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '路由地址',
      dataIndex: 'ExUrl',
      key: 'ExUrl',
      align: 'center',
      width: 'auto',
      render:(text,record)=>{
        return <div style={{textAlign:'left'}}>{text}</div>
      }
    },
    {
      title: '异常信息',
      dataIndex: 'ExMessage',
      key: 'ExMessage',
      align: 'center',
      width: 'auto',
      render:(text,record)=>{
        return <div style={{textAlign:'left'}}>{text}</div>
      }
    },
    // {
    //   title: '堆栈信息',
    //   dataIndex: 'StackTrace',
    //   key: 'StackTrace',
    //   align: 'center',
    //   width: 'auto',
    //   render:(text,record)=>{
    //     return text&&<TextArea rows={2}  value={text}/>
    //   }
    // },
    {
      title: '登录人',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
      ellipsis:true,
      width: 150,
    },
    {
      title: '异常时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      width: 150,
    },
    {
      title: '操作',
      align: 'center',
      width: 110,
      render: (text, record) => {
        return <span>
          <Fragment>
          <Fragment> <Tooltip title="详情">  <a style={{paddingRight:5}} onClick={()=>{detail(record)}} ><DetailIcon /></a></Tooltip><Divider type="vertical" /></Fragment>
            <Popconfirm placement='left' title="确定要删除此条信息吗？" onConfirm={() => { del(record) }} okText="是" cancelText="否">
            <Tooltip title="删除">   <a><DelIcon/></a></Tooltip>
            </Popconfirm>
          </Fragment>
        </span>
      }
    },
  ];




  const del =  (record) => {
    props.deleteSystemException({ ID: record.ID }, () => {
      onFinish(pageIndex,pageSize)
    })
  };




  const [detailVisible, setDetailVisible] = useState(false)
  const [detailData, setDetailData] = useState()
  const detail = (record) => {
    setDetailVisible(true)
    setDetailData(record)
  };

  const onFinish = async (pageIndexs, pageSizes,par) => {  //查询

    try {
      const values = await form.validateFields();

      props.getSystemExceptionList(par?{...par,pageIndex:pageIndexs, pageSize:pageSizes,}: {
        ...values,
        Btime:values.time&&moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        Etime:values.time&&moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        pageIndex:pageIndexs,
        pageSize:pageSizes,
        time:undefined,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [pageIndex,setPageIndex] = useState(1)
  const [pageSize,setPageSize] = useState(20)
   const handleTableChange =   (PageIndex, PageSize )=>{ //分页 打卡异常 响应超时 弹框
     setPageIndex(PageIndex)
     setPageSize(PageSize)
     onFinish(PageIndex,PageSize,queryPar)
   }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      layout='inline'
      initialValues={{
        // Status:1
      }}
      onFinish={()=>{setPageIndex(1);onFinish(1,pageSize)}}
    >
      <Form.Item label="异常时间" name="time"  >
        <RangePicker_ style={{width:350}} showTime={{ format: 'YYYY-MM-DD HH:mm:ss', defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')] }} />
      </Form.Item>
      <Form.Item label="方法名称" name="MethodName" >
        <Input placeholder='请输入' allowClear style={{ width: 200 }} />
      </Form.Item>
      <Form.Item label="登录人" name="UserName"  >
        <Input placeholder='请输入' allowClear style={{ width: 200 }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={tableLoading} style={{ marginRight: 8 }}>
          查询
        </Button>
        <Button onClick={() => { form.resetFields() }} style={{ marginRight: 8 }} >
          重置
        </Button>
      </Form.Item>
    </Form>
  }
  return (
    <div className={styles.contractChangeSetSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            size='small'
            scroll={{x:810}}
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
      </BreadcrumbWrapper>

      <Modal
        title={'详情'}
        visible={detailVisible}
        onCancel={() => { setDetailVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
        footer={null}
      >
        <Form name="basic_detail" >
          <Form.Item label="路由地址">
            {detailData&&detailData.ExUrl}
          </Form.Item>
          <Form.Item label="异常信息">
          {detailData&&detailData.ExMessage}
          </Form.Item>
          <Form.Item label="堆栈信息">
          {detailData&&<TextArea rows={10}  value={detailData.StackTrace}/>}
          </Form.Item>
          <Form.Item label="登录人">
          {detailData&&detailData.UserName}
          </Form.Item>
          <Form.Item label="异常时间">
          {detailData&&detailData.CreateTime}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);