/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Spin, Typography, Card, Cascader, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Upload, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, UploadOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "./style.less"
import OperationInspectoUserList from '@/components/OperationInspectoUserList'
import Detail from './Detail';


const { TextArea } = Input;
const { Option } = Select;

const namespace = 'provincialManager'




const dvaPropsData = ({ loading, provincialManager }) => ({
  tableDatas: provincialManager.tableDatas,
  tableTotal: provincialManager.tableTotal,
  tableLoading: loading.effects[`${namespace}/GetProvinceManagerList`],
  tableTotal: provincialManager.tableTotal,
  loadingConfirm: loading.effects[`${namespace}/AddorUpdateProvinceManager`],
  delLoading: loading.effects[`${namespace}/DeleteProvinceManager`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetProvinceManagerList: (payload) => { //列表
      dispatch({
        type: `${namespace}/GetProvinceManagerList`,
        payload: payload,
      })
    },
    AddorUpdateProvinceManager: (payload, callback) => { // 添加修改
      dispatch({
        type: `${namespace}/AddorUpdateProvinceManager`,
        payload: payload,
        callback: callback
      })

    },
    DeleteProvinceManager: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/DeleteProvinceManager`,
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


  const [type, setType] = useState('add')





  const { tableDatas, tableTotal, tableLoading, loadingConfirm, delLoading, } = props;


  useEffect(() => {
    onFinish();
  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '省区经理',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
    },
    {
      title: '行政区',
      dataIndex: 'ReagionName',
      key: 'ReagionName',
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'CreateUserName',
      key: 'CreateUserName',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
    },
    {
      title: '更新人',
      dataIndex: 'UpdateUserName',
      key: 'UpdateUserName',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'UpdateTime',
      key: 'UpdateTime',
      align: 'center',
    },
    {
      title: <span>操作</span>,
      align: 'center',
      width: 180,
      render: (text, record) => {
        return <span>
          <Fragment><Tooltip title="编辑"> <a onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
          <Fragment><Tooltip title="详情"> <a onClick={() => { detail(record) }} ><DetailIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>

          <Fragment> <Tooltip title="删除">
            <Popconfirm title="确定要删除此条信息吗？" style={{ paddingRight: 5 }} onConfirm={() => { del(record) }} okText="是" cancelText="否">
              <a><DelIcon /></a>
            </Popconfirm>
          </Tooltip>
          </Fragment>
        </span>
      }
    },
  ];


  const edit = async (record) => {
    setFromVisible(true)
    setType('edit')
    form2.resetFields();
    try {
      form2.setFieldsValue({ ...record,  Region:record.Region?.split(',') })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailTitle, setDetailTitle] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const detail = (record) => {
    setDetailId(record.ID);
    setDetailVisible(true)
    setDetailTitle(`${record.UserName} - 详情`)
  }

  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();
  };

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const onFinish = async (pageIndexs, pageSizes) => {  //查询

    try {
      const values = await form.validateFields();
      pageIndexs && typeof pageIndexs === "number" ? setPageIndex(pageIndexs) : setPageIndex(1); //除分页和编辑  每次查询页码重置为第一页

      props.GetProvinceManagerList({
        pageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : 1,
        pageSize: pageSizes ? pageSizes : pageSize,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();//触发校验
      props.AddorUpdateProvinceManager({
        ...values,
        Region:values.Region?.toString()
      }, () => {
        setFromVisible(false)
        type === 'add' ? onFinish() : onFinish(pageIndex)
      })


    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }

  const del = async (record) => {
    const values = await form.validateFields();
    props.DeleteProvinceManager({ ID: record.ID }, () => {
      setPageIndex(1)
      props.GetProvinceManagerList({
        pageIndex: 1,
        pageSize: pageSize,
        ...values,
      })
    })
  }


  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize)
  }

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      layout='inline'
      onFinish={onFinish}
    >
      <Form.Item label="省区经理" name="UserName"  >
        <Input placeholder='请输入' allowClear style={{ width: 200 }} />
      </Form.Item>
      <Form.Item label="行政区" name="RegionCode"  >
        <RegionList noFilter style={{ width: 200 }} levelNum={1} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={tableLoading} style={{ marginRight: 8 }}>
          查询
     </Button>
        <Button onClick={() => { form.resetFields() }} style={{ marginRight: 8 }}>
          重置
     </Button>
        <Button onClick={() => { add() }} >
          添加
     </Button>
      </Form.Item>
    </Form>
  }
  return (
    <div>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            loading={tableLoading || delLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
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
      </BreadcrumbWrapper>

      <Modal
        title={type === 'add' ? '添加' : '编辑'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={loadingConfirm}
        onCancel={() => { setFromVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
      >
        <Form
          name="basic"
          form={form2}
          className={styles.addEditFormSty}
        >
          <Row>
            <Col span={24}>
              <Form.Item name="ID" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="省区经理" name="UserId" rules={[{ required: true, message: '请选择省区经理' }]} >
                <OperationInspectoUserList type='2' style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="行政区" name="Region" rules={[{ required: true, message: '请选择行政区' }]}>
               <SdlCascader noFilter selectType='2,是' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal //详情
        visible={detailVisible}
        title={detailTitle}
        footer={null}
        wrapClassName='spreadOverModal'
        className={styles.fromModal}
        onCancel={() => { setDetailVisible(false) }}
        destroyOnClose
      >
        <Detail ID={detailId} />
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);