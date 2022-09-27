/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Spin, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
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
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UserList from '@/components/UserList'
import OperationCompanyList from '@/components/OperationCompanyList'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'noticeManger'

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']                                         // remove formatting button
  ]
}


const dvaPropsData = ({ loading, noticeManger }) => ({
  tableDatas: noticeManger.tableDatas,
  pointDatas: noticeManger.pointDatas,
  tableLoading: loading.effects[`${namespace}/getNoticeContentList`],
  tableTotal: noticeManger.tableTotal,
  loadingConfirm: loading.effects[`${namespace}/addOrUpdNoticeContent`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getNoticeContentList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getNoticeContentList`,
        payload: payload,
      })
    },
    addOrUpdNoticeContent: (payload, callback) => { // 添加 or 修改
      dispatch({
        type: `${namespace}/addOrUpdNoticeContent`,
        payload: payload,
        callback: callback
      })

    },
    delManufacturer: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/delManufacturer`,
        payload: payload,
        callback: callback
      })
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [data, setData] = useState([]);

  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(513);
  const [DGIMN, setDGIMN] = useState('')
  const [expand, setExpand] = useState(false)
  const [fromVisible, setFromVisible] = useState(false)
  const [tableVisible, setTableVisible] = useState(false)

  const [type, setType] = useState('add')



  const isEditing = (record) => record.key === editingKey;

  const { tableDatas, tableTotal, tableLoading, loadingConfirm, } = props;
  useEffect(() => {
    onFinish();

  }, []);

  const columns = [
    {
      title: '公告标题',
      dataIndex: 'ManufacturerCode',
      key: 'ManufacturerCode',
      align: 'center',
    },
    {
      title: '发布人',
      dataIndex: 'ManufacturerName',
      key: 'ManufacturerName',
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'Abbreviation',
      key: 'Abbreviation',
      align: 'center',
    },
    {
      title: '生效时间',
      dataIndex: 'ManufacturerCode',
      key: 'ManufacturerCode',
      align: 'center',
    },
    {
      title: '失效时间',
      dataIndex: 'ManufacturerCode',
      key: 'ManufacturerCode',
      align: 'center',
    },
    {
      title: '公关状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      render: (text, record) => {
        if (text === 1) {
          return <span><Tag color="green">显示</Tag></span>;
        }
        if (text === 2) {
          return <span><Tag color="red">不显示</Tag></span>;
        }
        if (text === 3) {
          return <span><Tag color="blue">置顶</Tag></span>;
        }
      },
    },
    {
      title: '公告状态',
      dataIndex: 'ManufacturerName',
      key: 'ManufacturerName',
      align: 'center',
    },
    {
      title: '查看公告单位',
      dataIndex: 'ManufacturerName',
      key: 'ManufacturerName',
      align: 'center',
    },
    {
      title: '查看公告角色',
      dataIndex: 'ManufacturerName',
      key: 'ManufacturerName',
      align: 'center',
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
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
      form2.setFieldsValue({
        ...record,
      })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const detail = (data) => {

    router.push({ pathname: '/systemManger/noticeManger/detail', query: { data: JSON.stringify(data) } })
  }
  const del = async (record) => {
    const values = await form.validateFields();
    props.delManufacturer({ ID: record.ID }, () => {
      setPageIndex(1)
      props.getNoticeContentList({
        pageIndex: 1,
        pageSize: pageSize,
        ...values,
      })
    })
  };





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
      console.log(values)
      props.getNoticeContentList({
        ...values,
        pageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : 1,
        pageSize: pageSizes ? pageSizes : pageSize,
        title: undefined,
        beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框


    try {
      const values = await form2.validateFields();//触发校验

      const contentVal = values.Content.replaceAll(/<p>|[</p>]/g, '').trim();
      if ((!contentVal) || contentVal === 'br') {
        message.warning('请输入公告内容')
        return;
      }

      props.addOrUpdNoticeContent({
        ...values,
        Content: values.Content,
      }, () => {
        setFromVisible(false)
        onFinish()
      })


    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const onAddEditValuesChange = (hangedValues, allValues) => { //添加修改时
    
 
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
      onFinish={onFinish}
    >
      <Row>
        <Form.Item label="问题名称" name="title"  >
          <Input placeholder='请输入' allowClear style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="发布时间" name="time" style={{ margin: '0 8px' }}>
          <RangePicker allowClear style={{ width: 350 }} showTime={{
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
          }} />
        </Form.Item>
        <Form.Item label="公告状态" name="status"  >
          <Select placeholder='请输入' allowClear style={{ width: 200 }}>
            <Option value={1}>显示</Option>
            <Option value={2}>不显示</Option>
            <Option value={3}>置顶</Option>
          </Select>
        </Form.Item>
      </Row>
      <Row>
        <Form.Item label="查看公告单位" name="company"  >
          <OperationCompanyList style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="查看公关角色" name="role" style={{ margin: '0 8px' }}>
          <UserList  style={{ width: 350 }} />
        </Form.Item>
        <Form.Item style={{ marginLeft: 30 }}>
          <Button type="primary" htmlType='submit' style={{ marginRight: 8 }}>
            查询
     </Button>
          <Button onClick={() => { form.resetFields() }} style={{ marginRight: 8 }}>
            重置
     </Button>
          <Button onClick={() => { add() }} >
            添加
     </Button>
        </Form.Item>
      </Row>
    </Form>
  }
  return (
    <div className={styles.equipmentManufacturListSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            loading={tableLoading}
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
          initialValues={{
            Status: 1
          }}
          onValuesChange={onAddEditValuesChange}
        >
          <Row>
            <Col span={24}>
              <Form.Item name="ID" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="发布标题" name="NoticeTitle" rules={[{ required: true, }]} >
                <TextArea showCount maxLength={50} rows={1} placeholder='请输入' />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label='公告内容' name="Content" rules={[{ required: true, message: '请输入公告内容' }]}>
                <ReactQuill theme="snow" modules={modules} className="ql-editor" style={{ height: 'calc(100% - 500px)' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="公告状态" name="Status" rules={[{ required: true, }]}>
                <Radio.Group>
                  <Radio value={1}>显示</Radio>
                  <Radio value={2}>不显示</Radio>
                  <Radio value={3}>置顶</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="查看公告单位" name="Company" rules={[{ required: true, message: '请选择公告单位' }]}>
                <OperationCompanyList />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="查看公告角色" name="Role" rules={[{ required: true, message: '请选择公告角色' }]}>
                <UserList  />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="生效时间" name="BeginTime" rules={[{ required: true, message: '请选择生效时间' }]} >
                <DatePicker allowClear />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="失效时间" name="EndTime" rules={[{ required: true, message: '请选择失效时间' }]}>
                <DatePicker allowClear />
              </Form.Item>
            </Col>

          </Row>



        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);