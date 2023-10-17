/**
 * 功  能：系统管理 日志管理
 * 创建人：jab
 * 创建时间：2023.08.01
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, TreeSelect, Card, Tabs, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
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




const dvaPropsData = ({ loading, logManger, usertree }) => ({
  tableDatas: logManger.tableDatas,
  tableLoading: loading.effects[`${namespace}/getSystemExceptionList`] || loading.effects[`${namespace}/deleteSystemException`],
  tableTotal: logManger.tableTotal,
  queryPar: logManger.queryPar,
  rolesList: usertree.RolesTree,
  rolesTreeLoading: loading.effects[`usertree/getRolesTree`],
  tableDatas2: logManger.tableDatas2,
  tableLoading2: loading.effects[`${namespace}/getSystemLongInLogs`],
  deleteSystemLongInLogsLoading: loading.effects[`${namespace}/deleteSystemLongInLogs`],
  tableTotal2: logManger.tableTotal2,
  queryPar2: logManger.queryPar2,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getSystemExceptionList: (payload) => { //异常日志 列表
      dispatch({
        type: `${namespace}/getSystemExceptionList`,
        payload: payload,
      })
    },
    deleteSystemException: (payload, callback) => { //异常日志 删除
      dispatch({
        type: `${namespace}/deleteSystemException`,
        payload: payload,
        callback: callback
      })
    },
    getRolesTree: (payload) => {
      dispatch({
        type: 'usertree/getrolestreeandobj',
        payload: payload,
      })
    },
    getSystemLongInLogs: (payload) => { //登录日志 列表
      dispatch({
        type: `${namespace}/getSystemLongInLogs`,
        payload: payload,
      })
    },
    deleteSystemLongInLogs: (payload, callback) => { //登录日志 删除
      dispatch({
        type: `${namespace}/deleteSystemLongInLogs`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();



  const { tableDatas, tableTotal, tableLoading, queryPar, rolesList, rolesTreeLoading, tableDatas2, tableTotal2, tableLoading2, queryPar2, } = props;
  useEffect(() => {
    onFinish(pageIndex, pageSize);
    onFinish2(pageIndex2, pageSize2);
    if (rolesList?.length <= 0) {
      props.getRolesTree({})
    }
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
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '路由地址',
      dataIndex: 'ExUrl',
      key: 'ExUrl',
      align: 'center',
      width: 'auto',
      render: (text, record) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
      }
    },
    {
      title: '异常信息',
      dataIndex: 'ExMessage',
      key: 'ExMessage',
      align: 'center',
      width: 'auto',
      render: (text, record) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
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
      ellipsis: true,
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
            <Fragment> <Tooltip title="详情">  <a style={{ paddingRight: 5 }} onClick={() => { detail(record) }} ><DetailIcon /></a></Tooltip><Divider type="vertical" /></Fragment>
            <Popconfirm placement='left' title="确定要删除此条信息吗？" onConfirm={() => { del(record) }} okText="是" cancelText="否">
              <Tooltip title="删除">   <a><DelIcon /></a></Tooltip>
            </Popconfirm>
          </Fragment>
        </span>
      }
    },
  ];




  const del = (record) => {
    props.deleteSystemException({ ID: record.ID }, () => {
      onFinish(pageIndex, pageSize)
    })
  };




  const [detailVisible, setDetailVisible] = useState(false)
  const [detailData, setDetailData] = useState()
  const detail = (record) => {
    setDetailVisible(true)
    setDetailData(record)
  };

  const onFinish = async (pageIndexs, pageSizes, par) => {  //异常日志 查询

    try {
      const values = await form.validateFields(); q

      props.getSystemExceptionList(par ? { ...par, pageIndex: pageIndexs, pageSize: pageSizes, } : {
        ...values,
        Btime: values.Time && moment(values.Time[0]).format('YYYY-MM-DD HH:mm:ss'),
        Etime: values.Time && moment(values.Time[1]).format('YYYY-MM-DD HH:mm:ss'),
        pageIndex: pageIndexs,
        pageSize: pageSizes,
        Time: undefined,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize, queryPar)
  }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      layout='inline'
      initialValues={{
        Time: [moment(new Date()).add(-7, 'day').startOf("day"), moment().endOf("day"),]
      }}
      onFinish={() => { setPageIndex(1); onFinish(1, pageSize) }}
    >
      <Form.Item label="异常时间" name="Time"  >
        <RangePicker_ style={{ width: 350 }} showTime={{ format: 'YYYY-MM-DD HH:mm:ss', defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')] }} />
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

  const columns2 = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex2 - 1) * pageSize2;
      }
    },
    {
      title: '登录账号',
      dataIndex: 'UserAccount',
      key: 'UserAccount',
      align: 'center',
      ellipsis: true,
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '角色',
      dataIndex: 'UserRolesName',
      key: 'UserRolesName',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '登录IP',
      dataIndex: 'LoginIP',
      key: 'LoginIP',
      align: 'center',
      ellipsis: true,
      width: 120,
    },
    {
      title: '登录位置',
      dataIndex: 'Attribution',
      key: 'Attribution',
      align: 'center',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: '登录时间',
      dataIndex: 'LoginTime',
      key: 'LoginTime',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '来源',
      dataIndex: 'LoginTypeName',
      key: 'LoginTypeName',
      align: 'center',
      ellipsis: true,
      width: 100,
    },
  ];

  const onFinish2 = async (pageIndexs, pageSizes, par) => {  //登录日志 查询

    try {
      const values = await form2.validateFields();

      props.getSystemLongInLogs(par ? { ...par, pageIndex: pageIndexs, pageSize: pageSizes, } : {
        ...values,
        Btime: values.Time && moment(values.Time[0]).format('YYYY-MM-DD HH:mm:ss'),
        Etime: values.Time && moment(values.Time[1]).format('YYYY-MM-DD HH:mm:ss'),
        pageIndex: pageIndexs,
        pageSize: pageSizes,
        Time: undefined,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(20)
  const handleTableChange2 = (PageIndex, PageSize) => { //分页 打卡异常 响应超时 弹框
    setPageIndex2(PageIndex)
    setPageSize2(PageSize)
    onFinish2(PageIndex, PageSize, queryPar2)
  }
  const searchComponents2 = () => {
    return <Form
      form={form2}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      layout='inline'
      initialValues={{
        Time: [moment(new Date()).startOf("day"), moment().endOf("day")],
        // LoginType: 2,
      }}
      onFinish={() => { setPageIndex2(1); onFinish2(1, pageSize2) }}
    >
      <Row style={{ flex: 1 }}>
        <Col span={8}>
          <Form.Item label="登录账号" name="UserAccount" style={{ marginBottom: 8 }}>
            <Input placeholder='请输入' allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="角色" name="RoleId" style={{ marginBottom: 8 }}>
            {rolesTreeLoading ? <Spin size='small' />
              :
              <TreeSelect
                placeholder="请选择"
                allowClear
                treeData={rolesList}
                showSearch
                treeNodeFilterProp='title'
              />
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="登录时间" name="Time" style={{ marginBottom: 8, marginRight: 0 }} >
            <RangePicker_ style={{ width: '100%' }} showTime={{ format: 'YYYY-MM-DD HH:mm:ss', defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')] }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="来源" name="LoginType" className='minWidthLabel' >
            <Select placeholder='请选择' allowClear>
              <Option value={1}>网页</Option>
              <Option value={2}>APP</Option>
              <Option value={3}>小程序</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item>
            <Button type="primary" htmlType='submit' loading={tableLoading2} style={{ marginRight: 8 }}>
              查询
      </Button>
            <Button onClick={() => { form2.resetFields() }} style={{ marginRight: 8 }} >
              重置
      </Button>
            <Button type="primary" onClick={() => { setFormVisible(true);form3.resetFields(); }}>
              日志清理
           </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  const [formVisible, setFormVisible] = useState(false)
  const onModalOk = async () => {

    try {
      const values = await form3.validateFields();//触发校验
      props.deleteSystemLongInLogs({
        ...values,
      }, () => {
        setFormVisible(false)
        setPageIndex2(1); onFinish2(1, pageSize2)
      })

    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  return (
    <div className={styles.logMangerSty}>
      <BreadcrumbWrapper>
        <Tabs defaultActiveKey="1" tabPosition='left'>
          <Tabs.TabPane tab="登录日志" key="1">
            <Card title={searchComponents2()}>
              <SdlTable
                loading={tableLoading2}
                bordered
                dataSource={tableDatas2}
                columns={columns2}
                size='small'
                scroll={{ x: 810, y: 'calc(100vh - 320px)' }}
                pagination={{
                  total: tableTotal2,
                  pageSize: pageSize2,
                  current: pageIndex2,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handleTableChange2,
                }}
              />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab="异常日志" key="2">
            <Card title={searchComponents()}>
              <SdlTable
                loading={tableLoading}
                bordered
                dataSource={tableDatas}
                columns={columns}
                size='small'
                scroll={{ x: 810, y: 'calc(100vh - 280px)' }}
                resizable
                pagination={{
                  total: tableTotal,
                  pageSize: pageSize,
                  current: pageIndex,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handleTableChange,
                }}
              />
            </Card>
          </Tabs.TabPane>
        </Tabs>
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
            {detailData && detailData.ExUrl}
          </Form.Item>
          <Form.Item label="异常信息">
            {detailData && detailData.ExMessage}
          </Form.Item>
          <Form.Item label="堆栈信息">
            {detailData && <TextArea rows={12} value={detailData.StackTrace} />}
          </Form.Item>
          <Form.Item label="登录人">
            {detailData && detailData.UserName}
          </Form.Item>
          <Form.Item label="异常时间">
            {detailData && detailData.CreateTime}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={'日志清理'}
        visible={formVisible}
        onCancel={() => { setFormVisible(false) }}
        destroyOnClose
        confirmLoading={props.deleteSystemLongInLogsLoading}
        onOk={onModalOk}
      >
        <Form
          name="basic"
          form={form3}
          initialValues={{
            // DeleteType: 1,
          }}
        >
          <Form.Item name='DeleteType' label="来源" rules={[{ required: true, message: '请选择来源' }]}>
            <Select placeholder='请选择'>
              <Option value={1}>清理一周之前日志数据</Option>
              <Option value={2}>清理一个月之前日志数据</Option>
              <Option value={3}>清理三个月之前日志数据</Option>
              <Option value={4}>清理六个月之前日志数据</Option>
              <Option value={5}>清理一年之前日志数据</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);