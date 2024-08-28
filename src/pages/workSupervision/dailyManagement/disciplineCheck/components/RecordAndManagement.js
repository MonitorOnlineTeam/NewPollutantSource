import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Modal,
  Radio,
  Space,
  DatePicker,
  Typography,
  Tooltip,
  Tag,
  Divider,
} from 'antd';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { getCurrentUserId } from '@/utils/utils';
import { DelIcon, EditIcon } from '@/utils/icon';
import CustomerInterview from '@/pages/workSupervision/Forms/CustomerInterview';
import LargeRegionSelect from '@/pages/workSupervision/dailyManagement/components/LargeRegionSelect';
const { Text, Link } = Typography;

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, provinceAllList, common }) => ({
  loading: loading.effects[`wordSupervision/GetDisciplineCheckInfo`],
  exportLoading: loading.effects[`wordSupervision/ExportDisciplineCheckInfo`],
});

const RecordAndManagement = props => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentID, setCurrentID] = useState();

  const { dispatch, loading, exportLoading, open, onCancel, mode, taskInfo, type } = props;

  useEffect(() => {
    getPageData();
  }, []);

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      dailyTaskID: taskInfo.ID,
      systemType: type, // 1：运维 2：成套
      isFlag: mode === 'management' ? true : false, // 区分管理
      beginTime: values.time
        ? moment(values.time[0])
            .startOf('weeks')
            .format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: values.time
        ? moment(values.time[1])
            .endOf('weeks')
            .format('YYYY-MM-DD 23:59:59')
        : undefined,
    };
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getPageData(PageIndex, PageSize);
  };

  // 获取页面数据
  const getPageData = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'wordSupervision/GetDisciplineCheckInfo',
      payload: {
        ...body,
        pageIndex: taskInfo.ID ? _pageIndex || pageIndex : undefined,
        pageSize: taskInfo.ID ? _pageSize || pageSize : undefined,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'wordSupervision/ExportDisciplineCheckInfo',
      payload: body,
    });
  };

  // 获取纪律检查详情
  const GetRecordLogInfor = ID => {
    dispatch({
      type: 'wordSupervision/GetRecordLogInfor',
      payload: {
        ID,
      },
      callback: res => {
        form1.setFieldsValue({
          checkInState: res.CheckInState,
          unqualifiedDate: res.UnqualifiedDate,
          unqualifiedReason: res.UnqualifiedReason,
          recordUnqualifiedDate: res.RecordUnqualifiedDate,
        });
      },
    });
  };

  // 编辑
  const onUpdate = () => {
    form1
      .validateFields()
      .then(values => {
        dispatch({
          type: 'wordSupervision/UpdateDisciplineCheckManage',
          payload: {
            ...values,
            logID: currentID,
          },
          callback: res => {
            setIsEditModalOpen(false);
            getPageData();
          },
        });
      })
      .catch(error => {
        message.error('请将数据填写完整！');
      });
  };

  // // 删除
  // const onDelete = ID => {
  //   props.dispatch({
  //     type: 'wordSupervision/DeleteReturnVisitCustomers',
  //     payload: { ID },
  //     callback: res => {
  //       handleTableChange(1, 20);
  //     },
  //   });
  // };

  // const updateType = () => {
  //   dispatch({
  //     type: 'wordSupervision/updateState',
  //     payload: {
  //       TYPE: type === '1' ? '' : 1,
  //     },
  //   });
  // };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        width: 60,
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
        ellipsis: true,
        width: 120,
      },
      {
        title: '省份',
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
        width: 120,
      },

      {
        title: '姓名',
        dataIndex: 'UserName',
        key: 'UserName',
        ellipsis: true,
        width: 120,
      },
      {
        title: '签到是否合格',
        dataIndex: 'CheckInStateName',
        key: 'CheckInStateName',
        ellipsis: true,
        width: 100,
        render: (text, record) => {
          if (record.CheckInState === 1) {
            return <Tag color="success">{text}</Tag>;
          }
          return <Tag color="error">{text}</Tag>;
        },
      },
      {
        title: '签到不合格日期',
        dataIndex: 'UnqualifiedDate',
        key: 'UnqualifiedDate',
        ellipsis: true,
        width: 200,
      },
      {
        title: '签到不合格原因',
        dataIndex: 'UnqualifiedReason',
        key: 'UnqualifiedReason',
        ellipsis: true,
        width: 200,
      },
      {
        title: '日志不合格日期',
        dataIndex: 'RecordUnqualifiedDate',
        key: 'RecordUnqualifiedDate',
        ellipsis: true,
        width: 200,
      },
      {
        title: '检查人',
        dataIndex: 'CheckName',
        key: 'CheckName',
        ellipsis: true,
        width: 120,
      },
      {
        title: '检查时间',
        dataIndex: 'RecordTime',
        key: 'RecordTime',
        ellipsis: true,
        render: (text, record) => {
          return text ? moment(text).format('YYYY-MM-DD') : text;
        },
      },
    ];

    if (type === '2') {
      // 成套不显示省份
      columns = columns.filter(item => item.dataIndex !== 'RegionName');
    }

    if (mode !== 'record') {
      columns.push({
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        fixed: 'right',
        render: (text, record) => {
          if (record.IsEdit) {
            // if (true) {
            return (
              <>
                <Tooltip title="编辑">
                  <a
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setCurrentID(record.ID);
                      GetRecordLogInfor(record.ID);
                    }}
                  >
                    <EditIcon />
                  </a>
                </Tooltip>
              </>
            );
          }
          return '-';
        },
      });
    }

    return columns;
  };

  const getPageContent = () => {
    return (
      <>
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          headStyle={{ display: taskInfo.ID ? 'none' : 'block' }}
          title={
            <Form
              // id="searchForm"
              form={form}
              layout="inline"
              initialValues={{
                isQualify: 0,
                time: [
                  moment()
                    .subtract(1, 'week')
                    .startOf('weeks'),
                  moment()
                    .subtract(1, 'week')
                    .endOf('weeks'),
                ],
              }}
              autoComplete="off"
              // style={{ display: taskInfo.ID ? 'none' : 'block' }}
            >
              <Space wrap>
                <LargeRegionSelect
                  name={type == 2 ? 'LargeRegionCode' : 'RegionCode'}
                  type={type == 2 ? 'ct' : ''}
                  formItemStyle={{ display: mode === 'record' ? 'block' : 'none' }}
                />
                <Form.Item name="userName" label="姓名">
                  <Input style={{ width: 200 }} placeholder="姓名" allowClear />
                </Form.Item>
                <Form.Item name="isQualify" label="是否合格">
                  <Radio.Group>
                    <Radio value={0}>全部</Radio>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                {mode === 'record' && (
                  <Form.Item name="checkName" label="检查人">
                    <Input style={{ width: 200 }} placeholder="检查人" allowClear />
                  </Form.Item>
                )}
                <Form.Item name="time" label="检查时间">
                  <RangePicker picker="week" allowClear={false} />
                </Form.Item>
                <Form.Item>
                  <Space style={{ marginLeft: 10 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
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
                  </Space>
                </Form.Item>
              </Space>
            </Form>
          }
        >
          {/* {taskInfo.ID && (
            <Button
              type="primary"
              style={{ margin: '10px 0' }}
              onClick={() => {
                setEditData({});
                setEditOpen(true);
              }}
            >
              添加
            </Button>
          )} */}
          <SdlTable
            style={{ marginTop: 16 }}
            loading={loading}
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
        </Card>
        <Modal
          title="编辑"
          destroyOnClose
          open={isEditModalOpen}
          onOk={onUpdate}
          onCancel={() => {
            setIsEditModalOpen(false);
          }}
          okText="保存"
        >
          <Form
            // id="searchForm"
            form={form1}
            // layout="inline"
            initialValues={{
              checkInState: 2,
            }}
            autoComplete="off"
            style={{ marginTop: 10, marginBottom: 10 }}
            labelCol={{
              flex: '130px',
            }}
          >
            <Form.Item
              name="checkInState"
              label="签到是否合格"
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="unqualifiedDate" label="签到不合格日期">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="unqualifiedReason" label="签到不合格原因">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="recordUnqualifiedDate" label="日志不合格日期">
              <Input placeholder="请输入" />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  };

  if (taskInfo.ID) {
    return getPageContent();
  }

  return (
    <Modal
      title={mode === 'record' ? '纪律检查记录' : '纪律检查管理'}
      wrapClassName={`spreadOverModal`}
      mask={false}
      open={open}
      destroyOnClose
      footer={null}
      onCancel={() => {
        onCancel();
      }}
      bodyStyle={{ padding: '0px 16px' }}
    >
      {getPageContent()}
    </Modal>
  );
};

RecordAndManagement.defaultProps = {
  taskInfo: {},
};

export default connect(dvaPropsData)(RecordAndManagement);
