import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Modal,
  Alert,
  Space,
  InputNumber,
  Typography,
  Tooltip,
  Popconfirm,
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

const dvaPropsData = ({ loading, provinceAllList, common }) => ({
  loading: loading.effects[`wordSupervision/GetCustomerVisitInfo`],
  exportLoading: loading.effects[`wordSupervision/ExportCustomerVisitInfo`],
});

const RecordAndManagement = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [editData, setEditData] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [largeRegionList, setLargeRegionList] = useState([]);
  const [provinceAllList, setProvinceAllList] = useState([]);

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
        ? values.time[0].startOf('month').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: values.time
        ? values.time[1].endOf('month').format('YYYY-MM-DD HH:mm:ss')
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
      type: 'wordSupervision/GetCustomerVisitInfo',
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
      type: 'wordSupervision/ExportCustomerVisitInfo',
      payload: body,
    });
  };

  //
  const onEdit = record => {
    updateType();
    setEditData(record);
    // setTaskInfo({
    //   // TaskType: type ? 4 : 3,
    //   TaskType: 5,
    //   ID: record.DailyTaskID,
    // });
    setEditOpen(true);
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteReturnVisitCustomers',
      payload: { ID },
      callback: res => {
        handleTableChange(1, 20);
      },
    });
  };

  const updateType = () => {
    dispatch({
      type: 'wordSupervision/updateState',
      payload: {
        TYPE: type === 'ct' ? 1 : '',
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
      },
      {
        title: '省份',
        dataIndex: 'RegionName',
        key: 'RegionName',
      },
      {
        title: '客户名称（全称）',
        dataIndex: 'CustomerName',
        key: 'CustomerName',
      },
      {
        title: '客户姓名',
        dataIndex: 'CustomRealName',
        key: 'CustomRealName',
      },
      {
        title: '部门',
        dataIndex: 'Depart',
        key: 'Depart',
      },
      {
        title: '客户满意度（1-5）',
        children: [
          {
            title: '服务态度',
            dataIndex: 'ServeManner',
            key: 'ServeManner',
            width: 100,
            align: 'center',
          },
          {
            title: '技术水平',
            dataIndex: 'TechnicalLevel',
            key: 'TechnicalLevel',
            width: 100,
            align: 'center',
          },
          {
            title: '服务响应',
            dataIndex: 'ServiceResponse',
            key: 'ServiceResponse',
            width: 100,
            align: 'center',
          },
          {
            title: '问题解决率',
            dataIndex: 'ProblemSolvingEfficiency',
            key: 'ProblemSolvingEfficiency',
            width: 100,
            align: 'center',
          },
        ],
      },
      {
        title: '问题及建议',
        dataIndex: 'Remark',
        key: 'Remark',
        ellipsis: true,
      },
      {
        title: '回访人',
        dataIndex: 'UserName',
        key: 'UserName',
      },
      {
        title: '回访时间',
        dataIndex: 'ReturnTime',
        key: 'ReturnTime',
        sorter: (a, b) => moment(a.ReturnTime).valueOf() - moment(b.ReturnTime).valueOf(),
        render: text => {
          return moment(text).format('YYYY-MM-DD');
        },
      },
    ];
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
                      onEdit(record);
                    }}
                  >
                    <EditIcon />
                  </a>
                </Tooltip>
                {taskInfo.ID && [
                  <Divider type="vertical" />,
                  <Tooltip title="删除">
                    <Popconfirm
                      placement="left"
                      title="确认是否删除?"
                      onConfirm={() => {
                        onDelete(record.ID);
                      }}
                      okText="是"
                      cancelText="否"
                    >
                      <a>
                        <DelIcon />
                      </a>
                    </Popconfirm>
                  </Tooltip>,
                ]}
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
    let initialValues = {
      time: [
        moment()
          .subtract(1, 'month')
          .startOf('months'),
        moment()
          .subtract(1, 'month')
          .endOf('months'),
      ],
    };
    if (taskInfo.ID) {
      initialValues.time = [moment(taskInfo.BeginTime), moment(taskInfo.EndTime)];
      // initialValues.regionCode = taskInfo.RegionCode;
    }
    return (
      <>
        {taskInfo.ID && (
          <Alert
            message={`任务类型：客户回访任务单，派发时间：${taskInfo.CreateTime} ，有效期：${taskInfo.EndTime} ，任务单派发频次1次/月，每个任务单最少有（${taskInfo.standNum || 0}次/月）记录。`}
            type="info"
            showIcon
            style={{ marginRight: 30 }}
          />
        )}
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          headStyle={{ display: taskInfo.ID ? 'none' : 'block' }}
          title={
            <Form
              // id="searchForm"
              form={form}
              layout="inline"
              initialValues={initialValues}
              autoComplete="off"
              // style={{ display: taskInfo.ID ? 'none' : 'block' }}
            >
              <Space wrap>
                <LargeRegionSelect
                  name={type == 2 ? 'LargeRegionCode' : 'RegionCode'}
                  type={type == 2 ? 'ct' : ''}
                  formItemStyle={{ display: mode === 'record' ? 'block' : 'none' }}
                />
                <Form.Item name="searcahUserName" label="回访人">
                  <Input style={{ width: 200 }} placeholder="回访人" allowClear />
                </Form.Item>
                <Form.Item name="time" label="回访时间">
                  <RangePicker_
                    style={{ width: '100%' }}
                    picker="month"
                    format="YYYY-MM"
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item name="customerName" label="客户名称">
                  <Input style={{ width: 200 }} placeholder="客户名称" allowClear />
                </Form.Item>
                <Form.Item
                  name="Score"
                  label="客户满意度小于"
                  style={{ display: mode === 'record' ? 'block' : 'none' }}
                >
                  <InputNumber allowClear={true} style={{ width: '100%' }} placeholder="请输入" />
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
          {taskInfo.ID && (
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
          )}
          <SdlTable
            loading={loading}
            align="center"
            dataSource={dataSource}
            columns={getColumns()}
            pagination={
              !taskInfo.ID
                ? {
                    total: tableTotal,
                    pageSize: pageSize,
                    current: pageIndex,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: handleTableChange,
                  }
                : false
            }
          />
        </Card>
        <Modal
          centered
          open={editOpen}
          footer={null}
          wrapClassName="spreadOverModal"
          mask={false}
          destroyOnClose
          onCancel={() => setEditOpen(false)}
        >
          <CustomerInterview
            type={type === 'ct' ? 1 : ''}
            taskInfo={taskInfo}
            editData={editData}
            onCancel={() => {
              setEditOpen(false);
            }}
            onSubmitCallback={() => {
              getPageData();
            }}
          />
        </Modal>
      </>
    );
  };

  if (taskInfo.ID) {
    return getPageContent();
  }

  return (
    <Modal
      title={mode === 'record' ? '客户现场回访记录' : '客户现场回访管理'}
      wrapClassName={`spreadOverModal`}
      mask={false}
      open={open}
      destroyOnClose
      footer={null}
      onCancel={() => {
        onCancel();
      }}
    >
      {getPageContent()}
    </Modal>
  );
};

RecordAndManagement.defaultProps = {
  taskInfo: {},
};

export default connect(dvaPropsData)(RecordAndManagement);
