/**
 * 功  能：项目执行进度 短信发送
 * 创建人：jab
 * 创建时间：2024.05
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Popover, Radio, Checkbox, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, DatabaseOutlined, } from '@ant-design/icons';
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
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import CheckPhoto from '@/components/CheckPhoto';
import { permissionButton } from '@/utils/utils';
import SettingPointPermissions from './components/SettingPointPermissions';


const { Option } = Select;

const namespace = 'smsSend'




const dvaPropsData = ({ loading, smsSend, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetUserMessageList`],
  tableDatas: smsSend.tableDatas,
  tableTotal: smsSend.tableTotal,
  queryPar: smsSend.queryPar,
  loadingConfirm: loading.effects[`${namespace}/AddOrUpdUserMessage`],
  delUserMessageLoading: loading.effects[`${namespace}/DelUserMessage`],
  tableLoading2: loading.effects[`${namespace}/GetAuditPhoto`],
  tableDatas2: smsSend.tableDatas,
  tableTotal2: smsSend.tableTotal,
  queryPar2: smsSend.queryPar,
  exportLoading2: loading.effects[`${namespace}/GetAuditPhoto`],
})

const Index = (props) => {



  const [form] = Form.useForm();

  const [form2] = Form.useForm();

  const [form3] = Form.useForm();


  const [title, setTitle] = useState()
  const [formVisible, setFormVisible] = useState(false)
  const [sendLogVisible, setSendLogVisible] = useState(false)


  const { queryPar, tableDatas, tableTotal, tableLoading, exportLoading, delUserMessageLoading, loadingConfirm, queryPar2, tableDatas2, tableTotal2, tableLoading2, exportLoading2 } = props;

  const RegularExpression = {
    PHONE: /^1[3-9]\d{9}$/
  };



  useEffect(() => {
    onFinish(pageIndex, pageSize);

  }, []);

  useEffect(() => {
    if(!formVisible){
      form3.resetFields();
    }

  }, [formVisible]);


  const columns = [
    {
      title: '序号',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '姓名',
      dataIndex: 'UserName',
      key: 'UserName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'Phone',
      key: 'Phone',
      ellipsis: true,
    },
    {
      title: '污染源企业',
      dataIndex: 'EntName',
      key: 'EntName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '监测点',
      dataIndex: 'PointName',
      key: 'PointName',
      ellipsis: true,
    },
    {
      title: '发送报警类型',
      dataIndex: 'AlarmTypeName',
      key: 'AlarmTypeName',
      width: 140,
      ellipsis: true,
    },
    {
      title: '发送状态',
      dataIndex: 'StatusName',
      key: 'StatusName',
      width: 90,
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'CreateUser',
      key: 'CreateUser',
      width: 100,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      ellipsis: true,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 110,
      ellipsis: true,
      render: (text, record, index) => {
        return (<Fragment>
          <SettingPointPermissions record={record} onFinish={()=>{
              onFinish(pageIndex, pageSize,queryPar);
          }} />
          <Divider type="vertical" />
          <Tooltip title="编辑">
            <a onClick={() => addEdit('编辑', record)}><EditIcon /></a>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="删除">
            <Popconfirm placement="left" title="确定要删除这条短信发送信息吗？" onConfirm={() => del(record)} >
              <a> <DelIcon /> </a>
            </Popconfirm>
          </Tooltip>
        </Fragment>
        );

      }
    },
  ];


  const addEdit = (title, record) => {
    setTitle(title)
    setFormVisible(true)
    title == '编辑' && form3.setFieldsValue({ ...record, AlarmType: record.AlarmType?.split(',') })
  }
  const onModalOk = () => { //添加 or 编辑 提交
    form3.validateFields().then(values => {
      props.dispatch({
        type: `${namespace}/AddOrUpdUserMessage`,
        payload: {
          ...values,
          AlarmType: values.AlarmType?.toString(),
        },
        callback: () => {
          setFormVisible(false)
          onFinish(pageIndex, pageSize)
        }
      });
    }).catch((errorInfo) => {
      console.log('Failed:', errorInfo);
    });
  }

  const del = (record) => {
    props.dispatch({
      type: `${namespace}/DelUserMessage`,
      payload: {
        ID: record.ID
      },
      callback: () => {
        setFormVisible(false)
        onFinish(pageIndex, pageSize)
      }
    });
  }
  useEffect(() => {
    if (!formVisible) {
      form2.resetFields();
    }
  }, [formVisible])



  const onFinish = (PageIndex, PageSize, queryPar) => {  //查询
    form.validateFields().then(values => {
      const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
        ...values,
        beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        pageIndex: PageIndex,
        pageSize: PageSize,
      }
      props.dispatch({
        type: `${namespace}/GetUserMessageList`,
        payload: {
          ...par,
        },

      });
    }).catch((errorInfo) => {
      console.log('Failed:', errorInfo);
    });
  }


  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize, queryPar)
  }

  const exportData = () => {
    props.dispatch({
      type: `${namespace}/ExportUserMessageList`,
      payload: queryPar,
    });
  };



  const searchComponents = () => {

    const resetData = () => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }
    return <Form
      form={form}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { resetData() }}
      initialValues={{
        AlarmType: '',
        Status: '',
      }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Form.Item name='UserName' label='姓名' className='form_label_width_55' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='Phone' label='手机号' className='form_label_width_97' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='EntName' label='企业名称' className='minWidth'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='PointName' label='监测点' className='minWidth'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='AlarmType' label='发送报警类型'>
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value={'0'}>超标报警</Radio>
              <Radio value={'2'}>异常报警</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='Status' label='发送状态'>
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value={1}>开启</Radio>
              <Radio value={2}>停止</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={tableLoading}>
                查询
           </Button>
              <Button loading={tableLoading} onClick={() => { form.resetFields(); resetData() }}  >
                重置
            </Button>
              <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exportData() }}>
                导出
             </Button>
              <Button type="primary" onClick={() => addEdit('添加')}>
                添加
              </Button>
              <Button type="primary" onClick={() => setSendLogVisible(true)}>
                短信发送日志
              </Button>
            </Space>
          </Form.Item>

        </Col>
      </Row>
    </Form>
  }
  const columns2 = [
    {
      title: '序号',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '接收人',
      dataIndex: 'projectCode',
      key: 'projectCode',
      ellipsis: true,
    },
    {
      title: '接收手机号',
      dataIndex: 'projectName',
      key: 'projectName',
      ellipsis: true,
    },
    {
      title: '短信内容',
      dataIndex: 'projectName',
      key: 'projectName',
      ellipsis: true,
      width: '60%',
    },
    {
      title: '短信发送时间',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
  ];
  const onFinish2 = (PageIndex, PageSize, queryPar) => {  //查询  短信日志
    form2.validateFields().then(values => {
      const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
        ...values,
        beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        pageIndex: PageIndex,
        pageSize: PageSize,
      }
      props.dispatch({
        type: `${namespace}/GetQuestionList`,
        payload: {
          ...par,
        },

      });
    }).catch((errorInfo) => {
      console.log('Failed:', errorInfo);
    });
  }
  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(20)
  const handleTableChange2 = async (PageIndex, PageSize) => { //分页 发送日志
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    onFinish2(PageIndex, PageSize, queryPar2)
  }
  const exportData2 = () => {
    props.dispatch({
      type: `${namespace}/ExportQuestionList`,
      payload: queryPar,
    });
  };
  const searchComponents2 = () => {

    const resetData = () => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }
    return <Form
      form={form2}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { resetData() }}
      initialValues={{
        aa: '',
        bb: '',
      }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Form.Item name='projectCode' label='接收人' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='projectName' label='接收手机号' className='form_label_width_97'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='itemCode' label='短信内容' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='itemCode' label='监测点' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='itemCode' label='短信发送时间' >
            <RangePicker_ format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={tableLoading}>
                查询
           </Button>
              <Button loading={tableLoading} onClick={() => { form.resetFields(); resetData() }}  >
                重置
            </Button>
              <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exportData2() }}>
                导出
             </Button>
            </Space>
          </Form.Item>

        </Col>
      </Row>
    </Form>
  }
  return (
    <div className={`queryCriterTitleSty`}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading || !!delUserMessageLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            align='center'
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
        <Modal
          title={'短信发送日志'}
          visible={sendLogVisible}
          onCancel={() => { setSendLogVisible(false) }}
          destroyOnClose
          wrapClassName={`spreadOverModal queryCriterTitleSty`}
          footer={null}
          mask={false}
        >
          <div style={{ marginBottom: 8 }}>{searchComponents2()}</div>
          <SdlTable
            resizable
            loading={tableLoading2}
            bordered
            dataSource={tableDatas2}
            columns={columns2}
            align='center'
            pagination={{
              total: tableTotal2,
              pageSize: pageSize2,
              current: pageIndex2,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange2,
            }}
          />
        </Modal>
        <Modal
          title={title}
          visible={formVisible}
          onOk={onModalOk}
          confirmLoading={loadingConfirm}
          onCancel={() => { setFormVisible(false) }}
          destroyOnClose
          okText='提交'
          width={'50%'}
        >
          <Form
            name="basic"
            form={form3}
            labelCol={{ flex: '114px' }}
          >
            <Form.Item label="姓名" name="UserName" rules={[{ required: true, message: '请输入姓名！' }]}>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item label="手机号" name="Phone" rules={[
              {
                required: true,
                message: '请输入手机号！'
              },
              {
                pattern: RegularExpression.PHONE,
                message: '手机号格式不正确！'
              }
            ]}>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item label="发送报警类型" name="AlarmType" rules={[{ required: true, message: '请选择发送报警类型！' }]}>
              <Checkbox.Group>
                <Checkbox value="0">超标报警</Checkbox>
                <Checkbox value="2">异常报警</Checkbox>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item label="发送状态" name="Status" rules={[{ required: true, message: '请选择发送状态！' }]}>
              <Radio.Group>
                <Radio value={1}>开启</Radio>
                <Radio value={2}>停止</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="ID" hidden>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);