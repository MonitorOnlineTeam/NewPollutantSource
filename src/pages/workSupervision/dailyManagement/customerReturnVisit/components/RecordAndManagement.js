/*
 * @Author: outman0611
 * @Date: 2024-06-11 14:29:06
 * @LastEditors: outman0611
 * @LastEditTime: 2024-12-04 17:05:52
 * @Description: 管理部门拜访记录
 */
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
  message,
} from 'antd';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { getCurrentUserId } from '@/utils/utils';
import { DelIcon, EditIcon } from '@/utils/icon';
import CustomerInterview from '@/pages/workSupervision/Forms/CustomerInterview';
import LargeRegionSelect from '@/pages/workSupervision/dailyManagement/components/LargeRegionSelect';
import styles from '../../siteInspecTempSet/style.less';

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, provinceAllList, common }) => ({
  loading: loading.effects[`wordSupervision/GetCustomerVisitInfo`],
  exportLoading: loading.effects[`wordSupervision/ExportCustomerVisitInfo`],
  addFlagLoading: loading.effects[`wordSupervision/GetCustomerVisitDailyWorks`],
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
  const [addData, setAddData] = useState({});

  const {
    dispatch,
    loading,
    exportLoading,
    open,
    onCancel,
    mode,
    taskInfo,
    type,
    addFlagLoading,
  } = props;

  useEffect(() => {
    getPageData();
    mode === 'management' && !taskInfo.ID && getCustomerVisitDailyWorksData();
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
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
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

  const getCustomerVisitDailyWorksData = () => {
    //获取客户回访当月的任务
    dispatch({
      type: 'wordSupervision/GetCustomerVisitDailyWorks',
      payload: {},
      callback: res => {
        setAddData(res.Datas || {});
      },
    });
  };
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
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
      },
      {
        title: '城市',
        dataIndex: 'CityName',
        key: 'CityName',
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
      {
        title: '回访人',
        dataIndex: 'UserName',
        key: 'UserName',
      },
      {
        title: '客户名称（全称）',
        dataIndex: 'CustomerName',
        key: 'CustomerName',
      },
      {
        title: '会谈人姓名',
        dataIndex: 'CustomRealName',
        key: 'CustomRealName',
      },
      {
        title: '职务',
        dataIndex: 'Post',
        key: 'Post',
      },
      {
        title: '手机',
        dataIndex: 'Phone',
        key: 'Phone',
      },
      {
        title: '回访目的',
        dataIndex: 'VisitPurposeName',
        key: 'VisitPurposeName',
        width: 120,
        align: 'center',
      },
      {
        title: '取得效果',
        dataIndex: 'EvaluateName',
        key: 'EvaluateName',
        width: 100,
        align: 'center',
        render: (text, record) => {
          return record?.OtherPurpose || text;
        },
      },
      {
        title: '具体成果',
        dataIndex: 'SpecificResults',
        key: 'SpecificResults',
        width: 120,
        align: 'center',
      },
      {
        title: (
          <div>
            客户满意度 <br />
            ①非常满意 / ②满意 / ③不满意
          </div>
        ),
        children: [
          {
            title: '问题解决能力',
            dataIndex: 'ServiceResponseName',
            key: 'ServiceResponServiceResponseNamese',
            width: 100,
            align: 'center',
          },
          {
            title: '沟通能力',
            dataIndex: 'ProblemSolvingEfficiencyName',
            key: 'ProblemSolvingEfficiencyName',
            width: 100,
            align: 'center',
          },
          {
            title: '响应速度',
            dataIndex: 'TechnicalLevelName',
            key: 'TechnicalLevelName',
            width: 100,
            align: 'center',
          },
        ],
      },
      {
        title: '问题及建议',
        dataIndex: 'ProblemsAndAdvice',
        key: 'ProblemsAndAdvice',
        ellipsis: true,
      },
      {
        title: '运维人员',
        dataIndex: 'OperationUserName',
        key: 'OperationUserName',
        ellipsis: true,
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
  const data = taskInfo.ID ? taskInfo : addData;
  const getPageContent = () => {
    let initialValues = {
      time: [moment().startOf('months'), moment().endOf('months')],
    };
    if (taskInfo.ID) {
      initialValues.time = [moment(data.BeginTime), moment(data.EndTime)];
      // initialValues.regionCode = taskInfo.RegionCode;
    }
    return (
      <>
        {taskInfo.ID && (
          <Alert
            message={`任务类型：客户回访任务单，派发时间：${data.BeginTime} ，有效期：${
              data.EndTime
            } ，任务单派发频次1次/月，每个任务单最少有（${data.standNum || 0}次/月）记录。`}
            type="info"
            showIcon
            style={{ marginRight: 30 }}
          />
        )}
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          headStyle={{ display: taskInfo.ID ? 'none' : 'block', padding: 0 }}
          className={styles.manageRecordCardWrapper}
          title={
            <Form
              form={form}
              layout="inline"
              initialValues={initialValues}
              autoComplete="off"
              style={{ marginTop: 12 }}
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
                  <Space>
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
          {mode !== 'record' && (
            <Button
              type="primary"
              style={{ margin: '8px 0' }}
              loading={addFlagLoading}
              onClick={() => {
                if (data.ID) {
                  setEditOpen(true);
                  // setEditData({DailyTaskID: data.ID,RegionalArea:data.largeCode,LargeRegion:data.LargeName });
                  setEditData({ DailyTaskID: data.ID });
                } else {
                  message.error('本月没有派工单，不允许添加！');
                }
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
      bodyStyle={{
        // padding: data.ID ? '12px 12px 0 12px' : '0 12px'
        padding: '0 12px',
      }}
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
