/*
 * @Description: 运维小组
 * @Author: outman0611
 * @Date: 2024-09-29 17:13:21
 * @LastEditors: outman0611
 * @LastEditTime: 2024-10-09 15:31:05
 */

import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Space } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, SortAscendingOutlined } from '@ant-design/icons';
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
import OperationCompanyList from '@/components/OperationCompanyList'
import AssigningUsers from '@/components/AssigningUsers';
import SetPointAccessPermissions from '@/components/SetPointAccessPermissions';


const namespace = 'operaGroup'




const dvaPropsData = ({ loading, operaGroup }) => ({
  tableDatas: operaGroup.tableDatas,
  tableLoading: loading.effects[`${namespace}/GetOperationTeamList`],
  loadingAddConfirm: loading.effects[`${namespace}/AddOrUpdOperationTeam`],
  loadingDelConfirm: loading.effects[`${namespace}/DelOperationTeam`],
  getSettingUserLoading: loading.effects[`${namespace}/GetOperationTeamUser`],
  settingUserLoading: loading.effects[`${namespace}/AddSetOperationTeamUser`],
  getSettingPointPointLoading: loading.effects[`${namespace}/GetOperationTeamPoint`],
  settingPointLoading: loading.effects[`${namespace}/AddSetOperationTeamPoint`],
})


const Index = (props) => {

  const [form] = Form.useForm();
  const [form2] = Form.useForm();


  const [formVisible, setFormVisible] = useState(false)

  const [rowData, setRowData] = useState({})

  const [pointPermissionVisible, setPointPermissionVisible] = useState(false)
  const [pointPermissionTitle, setPointPermissionTitle] = useState('')
  const [pointPermissionCheckedKeys, setPointPermissionCheckedKeys] = useState('')

  const [userPermissionVisible, setUserPermissionVisible] = useState(false)
  const [userPermissionTitle, setUserPermissionTitle] = useState('')
  const [userPermissionCheckedKeys, setUserPermissionCheckedKeys] = useState('')

  
  const {dispatch, tableDatas, tableLoading, loadingAddConfirm,loadingDelConfirm, } = props;
  useEffect(() => {
    onFinish();

  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
    },
    {
      title: '运维小组名称',
      dataIndex: 'TeamName',
      key: 'TeamName',
      align: 'center',
      width: 'auto',
    },
    {
      title: '运维单位名称',
      dataIndex: 'CompanyName',
      key: 'CompanyName',
      align: 'center',
      width: 'auto',
    },
    {
      title: '小组成员数量',
      dataIndex: 'UserCount',
      key: 'UserCount',
      align: 'center',
      width: 100,
      render:(text,record) =>{
       return  <a onClick={() => assigningUsers(record,true)}>{text}</a>
      }
    },
    {
      title: '授权点位数量',
      dataIndex: 'PointCount',
      key: 'PointCount',
      align: 'center',
      width: 100,
      render:(text,record) =>{
        return  <a onClick={() => settingPointPermissions(record,true)}>{text}</a>
       }
    },
    {
      title: '排序',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      width: 70,
    },
    {
      title: '操作',
      align: 'center',
      width: 280,
      render: (text, record) => {
        return <Space>
          <Fragment>
            <a onClick={() => addEdit('编辑', record)}>编辑</a>
          </Fragment>
          <Fragment>
            <Popconfirm placement='left' title="确定要删除此条信息吗？" onConfirm={() =>  del(record) } okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
          </Fragment>
          <Fragment>
            <a onClick={() => assigningUsers(record)}>分配小组成员</a>
          </Fragment>
          <Fragment>
            <a onClick={() => settingPointPermissions(record)}>设置点位访问权限</a>
          </Fragment>
        </Space>
      }
    },
  ];
  const [listDisabled,setListDisabled] = useState(false)
  const assigningUsers = (record,type) => { //获取 分配小组成员
    setUserPermissionVisible(true)
    setUserPermissionTitle(record.TeamName)
    setListDisabled(type)
    setRowData(record)
    dispatch({
      type: `${namespace}/GetOperationTeamUser`,
      payload: { id:record.ID},
      callback: (data) => {
        setUserPermissionCheckedKeys(data)
      },
    });
  }
  const assigningUsersOk = (targetUserKeys, state, key) => { //分配小组成员  提交
    dispatch({
      type: `${namespace}/AddSetOperationTeamUser`,
      payload: { teamID:rowData.ID,companyID:rowData.CompanyID,  userList: key, state: state },
      callback: () => {
        setUserPermissionCheckedKeys(targetUserKeys)
        onFinish()
      },
    });
  };

  const settingPointPermissions = (record,type) => {
    setPointPermissionVisible(true)
    setPointPermissionTitle(record.TeamName)
    setListDisabled(type)
    setRowData(record)
    getSettingPointPermission({id:record.ID})
  }
  const getSettingPointPermission = ({ id,pollutantType, regionCode }) => { //获取已设置的点位权限
     dispatch({
      type: `${namespace}/GetOperationTeamPoint`,
      payload: {
        id: id || rowData.ID,
      },
      callback: (data) => {
        setPointPermissionCheckedKeys( data || [])
      }
    });
  }
  const pointPermissionOK = (key, state, callback) => { //已设置的点位权限  提交
    dispatch({
      type: `${namespace}/AddSetOperationTeamPoint`,
      payload: {
        teamID:rowData.ID,
        companyID:rowData.CompanyID,
        mnList: key,
        state: state,
      },
      callback: res => {
        callback()
        onFinish()
      },
    });
  };




  const [formTitle, setFormTitle] = useState()
  const addEdit = (title, record) => {
    setFormVisible(true)
    setFormTitle(title)
    if(title=='编辑'){
      form2.setFieldsValue({...record})
    }
  };

  useEffect(() => {
    if (!formVisible) {
      form2.resetFields();
    }
  }, [formVisible])

  const del =  (record) => {
    return new Promise(resolve => {
      dispatch({
        type: `${namespace}/DelOperationTeam`,
        payload: {  ID: record.ID },
        callback: () => {
          resolve(null)
          onFinish()
        },
      });
    });
  };


  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const onFinish = async (pageIndexs, pageSizes) => {  //查询

    try {
      const values = await form.validateFields();
      dispatch({
        type: `${namespace}/GetOperationTeamList`,
        payload: {  ...values, },
        callback: () => {
        },
      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();//触发校验
      dispatch({
        type: `${namespace}/AddOrUpdOperationTeam`,
        payload: {  ...values, },
        callback: () => {
          setFormVisible(false)
          onFinish()
        },
      });
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
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
      onFinish={onFinish}
    >
      <Form.Item label="运维小组名称" name="UserName" >
        <Input placeholder='请输入' allowClear />
      </Form.Item>
      <Form.Item label="运维小组单位名称" name="UserAccount"  >
        <Input placeholder='请输入' />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType='submit' loading={tableLoading}>
            查询
        </Button>
          <Button htmlType='reset' >
            重置
        </Button>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => addEdit('添加')} >
            添加
       </Button>
        </Space>
      </Form.Item>
    </Form>
  }
  return (
    <div className={styles.operaGroupSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()} className='queryCriterTitleSty'>
          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            size='small'
            scroll={{ y: 'calc(100vh - 288px)' }}
            pagination={false}
          />
        </Card>
      </BreadcrumbWrapper>

      <Modal
        title={formTitle}
        visible={formVisible}
        onOk={onModalOk}
        confirmLoading={loadingAddConfirm}
        onCancel={() => { setFormVisible(false) }}
        className={styles.formModal}
        destroyOnClose
      >
        <Form
          name="basic_add"
          form={form2}
          labelCol={{
            flex: '108px',
          }}
        > 
          <Form.Item name="ID" hidden>
            <Input />
          </Form.Item>
          <Form.Item label='运维小组名称' name="TeamName" rules={[{ required: true, message: '请输入运维小组名称！' }]} >
            <Input placeholder='请输入' allowClear/>
          </Form.Item>
          <Form.Item label='运维单位名称' name="CompanyID" rules={[{ required: true, message: '请选择运维单位名称！' }]} >
            <OperationCompanyList />
          </Form.Item>
          <Form.Item label='排序' name="Sort" rules={[{ required: true, message: '请输入排序！' }]} >
            <InputNumber  placeholder='请输入' allowClear/>
          </Form.Item>
        </Form>
      </Modal>
      <AssigningUsers
        title={userPermissionTitle}
        visible={userPermissionVisible}
        listDisabled={listDisabled}
        onCancel={() => { setUserPermissionVisible(false)}}
        targetKeys={userPermissionCheckedKeys}
        getSettingUserLoading={!!props.getSettingUserLoading}
        settingUserLoading={!!props.settingUserLoading}
        onChange={(targetUserKeys, state, key) => {
          assigningUsersOk(targetUserKeys, state, key)
        }}
      />
      <SetPointAccessPermissions
        title={pointPermissionTitle}
        visible={pointPermissionVisible}
        listDisabled={listDisabled}
        onCancel={() => setPointPermissionVisible(false)}
        checkedKeys={pointPermissionCheckedKeys}
        getSettingPointPointLoading={props.getSettingPointPointLoading}
        settingPointLoading={props.settingPointLoading}
        getSettingPointList={getSettingPointPermission} //获取已设置权限的点位
        targetKeysChange={(key, type, callback) => {
          setPointPermissionCheckedKeys(key)
          pointPermissionOK(key,type == 1 ? 1 : 2, callback)
        }}
      />
    </div>
  );
};
export default connect(dvaPropsData)(Index);