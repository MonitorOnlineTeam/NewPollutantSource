/*
 * @Author: JiaQi
 * @Date: 2024-04-01 10:18:03
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-22 14:28:22
 * @Description:  服务热线电话页面内容
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Popconfirm,
  Select,
  Space,
  Row,
  Col,
  message,
  Divider,
  Tooltip,
  DatePicker,
  Modal,
  Typography,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import AllViewModal from './AllViewModal';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon';
import styles from '../../index.less';
import Cookie from 'js-cookie';

const { Text } = Typography;
const { TextArea } = Input;

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`customer/GetServiceHotlineList`],
  exportLoading: loading.effects[`customer/ExportServiceHotline`],
  saveLoading: loading.effects['customer/AddOrUpdateServiceHotline'],
});

const HotPhoneContentPage = props => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isAllViewModalOpen, setIsAllViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addOrEditModalOpen, setAddOrEditModalOpen] = useState(false);
  const [currentID, setCurrentID] = useState();
  const [isView, setIsView] = useState(false);

  const { isAll, queryLoading, saveLoading, dispatch, exportLoading } = props;

  useEffect(() => {
    getTableDataSource();
  }, []);

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      btime: values.time ? values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      etime: values.time ? values.time[1].endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      allData: isAll ? 1 : 0,
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'customer/GetServiceHotlineList',
      payload: {
        ...body,
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 删除
  const onDelete = id => {
    dispatch({
      type: 'customer/DeleteServiceHotline',
      payload: {
        id: id,
      },
      callback: res => {
        handleTableChange(1, 20);
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'customer/ExportServiceHotline',
      payload: {
        ...body,
        // isExport: 1,
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        fixed: 'left',
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '接听人姓名',
        dataIndex: 'RecipientName',
        key: 'RecipientName',
        ellipsis: true,
      },
      {
        title: '来电日期',
        dataIndex: 'RecipientDate',
        key: 'RecipientDate',
        ellipsis: true,
        width: 200,
      },
      {
        title: '来电人姓名',
        dataIndex: 'CallerName',
        key: 'CallerName',
        ellipsis: true,
      },
      {
        title: '联系方式',
        dataIndex: 'ContactPhone',
        key: 'ContactPhone',
        ellipsis: true,
      },
      {
        title: '单位名称',
        dataIndex: 'CorporateName',
        key: 'CorporateName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '需求类别',
        dataIndex: 'DemandClassName',
        key: 'DemandClassName',
        ellipsis: true,
      },
      {
        title: '问题描述',
        dataIndex: 'ProblemDescription',
        key: 'ProblemDescription',
        ellipsis: true,
        width: 220,
      },
      {
        title: '处理方案',
        dataIndex: 'Treatment',
        key: 'Treatment',
        ellipsis: true,
        width: 220,
      },
      {
        title: '处理完成日期',
        dataIndex: 'ProcessingCompletion',
        key: 'ProcessingCompletion',
        ellipsis: true,
        width: 200,
      },
      {
        title: '来源',
        dataIndex: 'Source',
        key: 'Source',
        ellipsis: true,
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'handle',
        align: 'center',
        fixed: 'right',
        width: 120,
        ellipsis: true,
        render: (text, record) => {
          return (
            <>
              {record.IsFlag && (
                <>
                  <Tooltip title="编辑">
                    <a
                      onClick={() => {
                        setIsView(false);
                        setCurrentID(record.ID);
                        // onAddOrEdit(record.ID);
                        form1.setFieldsValue({
                          ...record,
                          ProcessingCompletion: moment(record.ProcessingCompletion),
                          RecipientDate: moment(record.RecipientDate),
                        });
                        setAddOrEditModalOpen(true);
                      }}
                    >
                      <EditIcon />
                    </a>
                  </Tooltip>
                  <Divider type="vertical" />
                </>
              )}
              <Tooltip title="详情">
                <a
                  onClick={() => {
                    setIsView(true);
                    form1.setFieldsValue({
                      ...record,
                      // ProcessingCompletion: moment(record.ProcessingCompletion),
                      // RecipientDate: moment(record.RecipientDate),
                    });
                    // onAddOrEdit(record.ID);

                    setAddOrEditModalOpen(true);
                  }}
                >
                  <DetailIcon />
                </a>
              </Tooltip>
              {record.IsFlag && (
                <>
                  <Divider type="vertical" />
                  <Tooltip title="删除">
                    <Popconfirm
                      placement="left"
                      title="确定要删除吗？"
                      onConfirm={() => onDelete(record.ID)}
                      okText="是"
                      cancelText="否"
                    >
                      <a>
                        <DelIcon />
                      </a>
                    </Popconfirm>
                  </Tooltip>
                </>
              )}
            </>
          );
        },
      },
    ];

    // 查看全部过滤掉操作列和“离开现场时间”
    if (isAll) {
      columns = columns.filter(
        item => item.dataIndex !== 'handle' && item.dataIndex !== 'LeaveDate',
      );
    }

    return columns;
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getTableDataSource(PageIndex, PageSize);
  };

  // 搜索组件
  const SearchComponents = () => {
    return (
      <div>
        <Form
          id="searchForm"
          form={form}
          // layout="inline"
          initialValues={
            {
              // demandClass: '1',
            }
          }
          autoComplete="off"
          labelCol={{
            flex: '110px',
          }}
          wrapperCol={{
            flex: 1,
          }}
        >
          <Row align="middle">
            <Col span={8}>
              <Form.Item name="recipientName" label="接听人姓名">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="callerName" label="来电人姓名">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="demandClass" label="需求类别">
                <Select placeholder="需求类别" style={{ width: '100%' }} allowClear>
                  <Option value={'1'}>业务咨询类</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="contactPhone" label="联系方式">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="corporateName" label="单位名称">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="来电日期">
                <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Space style={{ marginLeft: 10 }}>
          {!isAll && (
            <Button
              type="primary"
              loading={queryLoading}
              onClick={() => {
                setIsView(false);
                setCurrentID();
                setAddOrEditModalOpen(true);
                form1.resetFields();
              }}
            >
              登记
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={queryLoading}
            onClick={() => {
              handleTableChange(1, 20);
            }}
          >
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              handleTableChange(1, 20);
            }}
          >
            重置
          </Button>
          <Button
            type="primary"
            icon={<ExportOutlined />}
            loading={exportLoading}
            onClick={() => {
              onExport();
            }}
          >
            导出
          </Button>
          {!isAll && (
            <Button
              type="primary"
              // icon={<ExportOutlined />}
              onClick={() => {
                setIsAllViewModalOpen(true);
              }}
            >
              查看全部
            </Button>
          )}
        </Space>
      </div>
    );
  };

  // 保存添加或编辑
  const onAddOrEdit = () => {
    form1
      .validateFields()
      .then(values => {
        console.log('values', values);
        // return;
        dispatch({
          type: 'customer/AddOrUpdateServiceHotline',
          payload: {
            id: currentID,
            ...values,
            recipientDate: values.RecipientDate.format('YYYY-MM-DD HH:mm:ss'),
            processingCompletion: values.ProcessingCompletion.format('YYYY-MM-DD HH:mm:ss'),
          },
          callback: res => {
            message.success('操作成功！');
            setAddOrEditModalOpen(false);
            getTableDataSource();
          },
        });
      })
      .catch(errorInfo => {
        console.log('errorInfo', errorInfo);
        message.warning('请输入完整的数据');
        return;
      });
  };

  const getPageContent = () => {
    const modalProps = isView ? { footer: false } : {};
    const currentUser = JSON.parse(Cookie.get('currentUser'));

    return (
      <Card bordered={isAll ? false : true} title={<SearchComponents />}>
        <SdlTable
          loading={queryLoading}
          align="center"
          dataSource={dataSource}
          columns={getColumns()}
          pagination={{
            total: tableTotal,
            pageSize: pageSize,
            current: pageIndex,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handleTableChange,
          }}
        />
        <AllViewModal
          isModalOpen={isAllViewModalOpen}
          onCancel={() => {
            setIsAllViewModalOpen(false);
          }}
        />
        {/* 添加、编辑弹窗 */}
        <Modal
          title={isView ? '详情' : currentID ? '编辑' : '登记'}
          visible={addOrEditModalOpen}
          width={1100}
          destroyOnClose
          confirmLoading={saveLoading}
          onOk={() => {
            onAddOrEdit();
          }}
          onCancel={() => {
            setAddOrEditModalOpen(false);
          }}
          {...modalProps}
        >
          <Form
            className={styles.hotPhoneForm}
            form={form1}
            layout="horizontal"
            initialValues={{
              RecipientName: currentUser.UserName,
              RecipientDate: moment(),
            }}
            labelCol={{
              flex: '110px',
            }}
            wrapperCol={{
              flex: 1,
            }}
            requiredMark={isView ? false : true}
          >
            <Row align="middle">
              <Col span={12}>
                <Form.Item
                  name="RecipientName"
                  label="接听人姓名"
                  rules={[
                    {
                      required: true,
                      message: '请填写接听人姓名！',
                    },
                  ]}
                >
                  <Input
                    placeholder="请输入"
                    allowClear
                    bordered={isView ? false : true}
                    disabled={isView}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="RecipientDate"
                  label="来电日期"
                  rules={[
                    {
                      required: true,
                      message: '请填写来电日期！',
                    },
                  ]}
                >
                  {isView ? (
                    <Input bordered={false} disabled={true} />
                  ) : (
                    <DatePicker placeholder="请选择" style={{ width: '100%' }} allowClear />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CallerName"
                  label="来电人姓名"
                  rules={[
                    {
                      required: true,
                      message: '请填写来电人姓名！',
                    },
                  ]}
                >
                  <Input
                    placeholder="请输入"
                    allowClear
                    bordered={isView ? false : true}
                    disabled={isView}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ContactPhone"
                  label="联系方式"
                  rules={[
                    {
                      required: true,
                      message: '请填写联系方式！',
                    },
                  ]}
                >
                  <Input
                    placeholder="请输入"
                    allowClear
                    bordered={isView ? false : true}
                    disabled={isView}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CorporateName"
                  label="单位名称"
                  rules={[
                    {
                      required: true,
                      message: '请填写单位名称！',
                    },
                  ]}
                >
                  <Input
                    placeholder="请输入"
                    allowClear
                    bordered={isView ? false : true}
                    disabled={isView}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="DemandClass"
                  label="需求类别"
                  rules={[
                    {
                      required: true,
                      message: '请选择需求类别！',
                    },
                  ]}
                >
                  {isView ? (
                    <Text style={{ padding: '0 11px' }}>业务咨询类</Text>
                  ) : (
                    <Select placeholder="需求类别" style={{ width: '100%' }} allowClear>
                      <Option value={'1'}>业务咨询类</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ProcessingCompletion"
                  label="处理完成日期"
                  rules={[
                    {
                      required: true,
                      message: '请选择处理完成日期！',
                    },
                  ]}
                >
                  {isView ? (
                    <Input bordered={false} disabled={true} />
                  ) : (
                    <DatePicker placeholder="请选择" style={{ width: '100%' }} allowClear />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Source"
                  label="来源"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '请填写来源！',
                  //   },
                  // ]}
                >
                  {isView ? <Input bordered={false} disabled={true} /> : <TextArea rows={1} />}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ProblemDescription"
                  label="问题描述"
                  rules={[
                    {
                      required: true,
                      message: '请填写问题描述！',
                    },
                  ]}
                >
                  {isView ? (
                    <TextArea bordered={false} rows={3} disabled={true} />
                  ) : (
                    <TextArea rows={3} />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Treatment"
                  label="处理方案"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '请填写处理方案！',
                  //   },
                  // ]}
                >
                  {isView ? (
                    <TextArea bordered={false} rows={3} disabled={true} />
                  ) : (
                    <TextArea rows={3} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Card>
    );
  };

  return getPageContent();
};

export default connect(dvaPropsData)(HotPhoneContentPage);
