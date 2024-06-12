import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Modal,
  Select,
  Space,
  Alert,
  Typography,
  Tooltip,
  Popconfirm,
  Divider,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { getCurrentUserId } from '@/utils/utils';
import { DelIcon, EditIcon } from '@/utils/icon';
import OfficeInspection from '@/pages/workSupervision/Forms/OfficeInspection';
const { RangePicker } = DatePicker;

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, provinceAllList, common }) => ({
  provinceAllList: common.provinceList,
  loading: loading.effects[`wordSupervision/GetOfficeCheckStatisticsList`],
  exportLoading: loading.effects[`wordSupervision/ExportOfficeCheckStatisticsList`],
});

const ChecklistRecordAndManagement = props => {
  const [form] = Form.useForm();
  // 获取当前登录人id
  const currentUserId = getCurrentUserId();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [editData, setEditData] = useState({});
  const [officeInspectionOpen, setOfficeInspectionOpen] = useState(false);

  const {
    dispatch,
    loading,
    exportLoading,
    open,
    onCancel,
    provinceAllList,
    mode,
    taskInfo,
  } = props;

  useEffect(() => {
    getLargeRegion();
    getPageData();
  }, []);

  // 获取大区及省份
  const getLargeRegion = () => {
    dispatch({
      type: 'common/getLargeRegion',
      payload: {},
    });
  };

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      isFlag: mode === 'management' ? 1 : undefined,
      beginTime: values.time
        ? values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: values.time
        ? values.time[1].endOf('months').format('YYYY-MM-DD HH:mm:ss')
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
      type: 'wordSupervision/GetOfficeCheckStatisticsList',
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
      type: 'wordSupervision/ExportOfficeCheckStatisticsList',
      payload: body,
    });
  };

  //
  const onEdit = record => {
    setEditData(record);
    // setTaskInfo({
    //   // TaskType: type ? 4 : 3,
    //   TaskType: 5,
    //   ID: record.DailyTaskID,
    // });
    setOfficeInspectionOpen(true);
  };

  // 删除办事处
  const onDelete = id => {
    dispatch({
      type: 'wordSupervision/DeleteOfficeCheckStatistics',
      payload: {
        id,
      },
      callback: res => {
        getPageData();
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        // dataIndex: 'index',
        // key: 'index',
        // width: 60,
        // render: (text, record, index) => {
        //   return index + 1;
        // },
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
        width: 140,
        // sorter: (a, b) => a.dataConstantRate - b.dataConstantRate,
      },
      {
        title: '省份',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 140,
      },
      {
        title: '办事处',
        dataIndex: 'OfficeName',
        key: 'OfficeName',
        width: 200,
      },
      {
        title: '办事处设施',
        children: [
          {
            title: '企业文化是否上墙',
            dataIndex: 'BusinessCulture',
            key: 'BusinessCulture',
            width: 150,
            align: 'center',
            render: text => {
              return text === '0' ? '否' : '是';
            },
          },
          {
            title: '办事处整洁度（1-5分）',
            dataIndex: 'OfficeNeatness',
            key: 'OfficeNeatness',
            width: 160,
            align: 'center',
          },
        ],
      },
      {
        title: '库房',
        children: [
          {
            title: '是否上锁',
            dataIndex: 'IsLock',
            key: 'IsLock',
            width: 100,
            align: 'center',
            render: text => {
              return text === '0' ? '否' : '是';
            },
          },
          {
            title: '库房整洁度（1-5分）',
            dataIndex: 'StorehouseNeatness',
            key: 'StorehouseNeatness',
            width: 160,
            align: 'center',
          },
          {
            title: '出入库台账规范（1-5分）',
            dataIndex: 'AccountSpecification',
            key: 'AccountSpecification',
            width: 180,
            align: 'center',
          },
          {
            title: '呆滞物料情况（1-5分）',
            dataIndex: 'SluggishMaterials',
            key: 'SluggishMaterials',
            width: 160,
            align: 'center',
          },
        ],
      },
      {
        title: '车辆',
        children: [
          {
            title: '车牌号',
            dataIndex: 'PlateNumber',
            key: 'PlateNumber',
            width: 150,
            align: 'center',
          },
          {
            title: '整洁度(含后备箱)（ 1-5分）',
            dataIndex: 'CarNeatness',
            key: 'CarNeatness',
            width: 190,
            align: 'center',
          },
          {
            title: '云上管车使用记录（1-5分）',
            dataIndex: 'CarUseRecord',
            key: 'CarUseRecord',
            width: 200,
            align: 'center',
          },
        ],
      },
      {
        title: '备注',
        dataIndex: 'Remark',
        key: 'Remark',
        width: 200,
        ellipsis: true,
      },
      {
        title: '检查人',
        dataIndex: 'UserName',
        key: 'UserName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '填报时间',
        dataIndex: 'TaskTime',
        key: 'TaskTime',
        width: 200,
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

  // 搜索组件
  const SearchComponents = () => {
    let initialValues = {
      time: [
        moment()
          .subtract(1, 'month')
          .startOf('month'),
        moment()
          .subtract(1, 'month')
          .endOf('month'),
      ],
    };
    if (taskInfo.ID) {
      initialValues.time = [moment(taskInfo.BeginTime), moment(taskInfo.EndTime)];
      initialValues.regionCode = taskInfo.RegionCode;
    }

    return (
      <div>
        <Form
          id="searchForm"
          form={form}
          layout="inline"
          initialValues={initialValues}
          autoComplete="off"
          // style={{ display: taskInfo.ID ? 'none' : 'block' }}
        >
          <Space wrap>
            {mode !== 'management' && (
              <Form.Item name="regionCode" label="省份">
                <Select placeholder="请选择省份" style={{ width: 140 }} allowClear>
                  {provinceAllList.map(item => {
                    return (
                      <Option value={item.RegionCode} key={item.RegionCode}>
                        {item.RegionName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            <Form.Item name="userName" label="检查人">
              <Input style={{ width: 200 }} placeholder="检查人" />
            </Form.Item>
            <Form.Item name="time" label="检查时间">
              <RangePicker
                style={{ width: '100%' }}
                picker="month"
                format="YYYY-MM"
                allowClear={false}
              />
            </Form.Item>
            <Form.Item name="officeName" label="办事处">
              <Input style={{ width: 200 }} placeholder="办事处" allowClear />
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
      </div>
    );
  };

  const getPageContent = () => {
    return (
      <>
        {taskInfo.ID && (
          <Alert
            message={`任务类型：办事处检查任务单，派发时间：${taskInfo.CreateTime} ，有效期：${taskInfo.EndTime} ，任务单派发频次1次/月。`}
            type="info"
            showIcon
            style={{ marginRight: 30 }}
          />
        )}
        <Card
          bordered={false}
          title={<SearchComponents />}
          headStyle={{ display: taskInfo.ID ? 'none' : 'block' }}
        >
          {taskInfo.ID && (
            <Button
              type="primary"
              style={{ margin: '10px 0' }}
              onClick={() => {
                setEditData({});
                setOfficeInspectionOpen(true);
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
          // title="超标报警核实率"
          open={officeInspectionOpen}
          footer={null}
          wrapClassName="spreadOverModal"
          mask={false}
          destroyOnClose
          onCancel={() => setOfficeInspectionOpen(false)}
        >
          <OfficeInspection
            editData={editData}
            taskInfo={taskInfo}
            onCancel={() => {
              setOfficeInspectionOpen(false);
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
      title={mode === 'record' ? '办事处检查记录' : '办事处检查任务完成记录'}
      wrapClassName={`spreadOverModal`}
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

ChecklistRecordAndManagement.defaultProps = {
  taskInfo: {},
};

export default connect(dvaPropsData)(ChecklistRecordAndManagement);
