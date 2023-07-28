/**
 * 功  能：基础设置 合同变更设置
 * 创建人：jab
 * 创建时间：2023.07.27
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
import OperationInspectoUserList from '@/components/OperationInspectoUserList'

const namespace = 'contractChangeSet'




const dvaPropsData = ({ loading, contractChangeSet }) => ({
  tableDatas: contractChangeSet.tableDatas,
  pointDatas: contractChangeSet.pointDatas,
  tableLoading: loading.effects[`${namespace}/getOperationUserList`],
  tableTotal: contractChangeSet.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/updateOperationUser`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getOperationUserList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getOperationUserList`,
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
    deleteOperationUser: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/deleteOperationUser`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();


  const [fromVisible, setFromVisible] = useState(false)






  const { tableDatas, tableTotal, tableLoading, loadingAddConfirm, } = props;
  useEffect(() => {
    onFinish();

  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return  index + 1;
    }
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      width:'auto',
    },
    {
      title: '员工编号',
      dataIndex: 'userAccount',
      key: 'userAccount',
      align: 'center',
      width:'auto',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      align: 'center',
      width:'auto',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width:'auto',
    },
    {
      title: '操作',
      align: 'center',
      width: 70,
      render: (text, record) => {
        return <span>
          <Fragment>
            <Popconfirm placement='left' title="确定要删除此条信息吗？" onConfirm={() => { del(record) }} okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        </span>
      }
    },
  ];




  const del = async (record) => {
    const values = await form.validateFields();
    props.deleteOperationUser({ ID: record.id }, () => {
      props.getOperationUserList({
        ...values,
      })
    })
  };





  const add = () => {
    setFromVisible(true)
    form2.resetFields();
  };

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const onFinish = async (pageIndexs, pageSizes) => {  //查询

    try {
      const values = await form.validateFields();

      props.getOperationUserList({
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();//触发校验
      props.updateOperationUser({
        ...values,
      }, () => {
        setFromVisible(false)
        onFinish()
      })

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
      <Form.Item label="员工编号" name="ManufactorName"  >
        <Input placeholder='请输入' allowClear style={{ width: 200 }} />
      </Form.Item>
      <Form.Item label="姓名" name="Status" >
       <Input placeholder='请输入' allowClear style={{ width: 200 }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={tableLoading} style={{ marginRight: 8 }}>
          查询
        </Button>
        <Button onClick={()=>{form.resetFields()}}  style={{ marginRight: 8 }} >
          重置
        </Button>
        <Button  icon={<PlusOutlined />}  type="primary" onClick={() => { add() }} style={{ marginRight: 8 }} >
          添加
       </Button>
       <span  className='red'>注：在列表中人员可以编辑系统中项目信息、运维任务信息</span>
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
            pagination={false}
          />
        </Card>
      </BreadcrumbWrapper>

      <Modal
        title={'添加'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={loadingAddConfirm }
        onCancel={() => { setFromVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
      >
        <Form
          name="basic_add"
          form={form2}
          initialValues={{
            Status: 1
          }}
        >
          <Form.Item name="ID" hidden>
            <Input />
          </Form.Item>
          <Form.Item label='姓名' name="UserID" rules={[{ required: true, message: '请选择姓名' }]} >
            <OperationInspectoUserList  filterData={tableDatas} type='2'/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);