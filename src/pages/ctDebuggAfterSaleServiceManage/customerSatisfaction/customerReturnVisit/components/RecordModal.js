/*
 * @Author: JiaQi
 * @Date: 2024-03-27 16:18:02
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-29 18:54:22
 * @Description:  客户现场回访记录弹窗
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Popconfirm,
  Input,
  Button,
  Tooltip,
  Select,
  Space,
  Row,
  Col,
  Radio,
  Divider,
  Modal,
  DatePicker,
  message,
  Tag,
  InputNumber,
} from 'antd';
import FromsModal from '@/pages/workSupervision/Forms/FromsModal';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, customer }) => ({
  largeRegionList: customer.largeRegionList,
  queryLoading: loading.effects[`customer/GetCustomerVisitList`],
  exportLoading: loading.effects[`customer/ExportCustomerVisitList`],
});

const RecordModal = props => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [currentEditData, setCurrentEditData] = useState({});
  const [taskInfo, setTaskInfo] = useState({});
  const [formsModalVisible, setFormsModalVisible] = useState(false);

  const {
    dispatch,
    open,
    queryLoading,
    exportLoading,
    largeRegionList,
    dataType,
    title,
    queryParams,
    onCancel,
    reloadPage,
  } = props;

  useEffect(() => {
    form.setFieldsValue({
      ...queryParams,
    });
    setTimeout(() => {
      getTableDataSource();
    }, 0);
  }, []);

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      beginTime: values.time[0].startOf('momth').format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.time[1].endOf('momth').format('YYYY-MM-DD 23:59:59'),
      taskType: '4',
      dataType: dataType,
      systemType: '2',
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'customer/GetCustomerVisitList',
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
  const onDelete = ID => {
    dispatch({
      type: 'customer/DeleteReturnVisitCustomers',
      payload: {
        ID,
      },
      callback: res => {
        handleTableChange(1, 20);
        title === '客户现场回访管理' && reloadPage();
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'customer/ExportCustomerVisitList',
      payload: {
        ...body,
        pageIndex: 0,
        pageSize: 0,
      },
    });
  };

  // 获取客户现场回访详情
  const GetCustomerVisitInfor = (ID, editData) => {
    dispatch({
      type: 'customer/GetCustomerVisitInfor',
      payload: {
        ID,
      },
      callback: res => {
        setCurrentEditData({
          ...res,
          ...editData,
        });
        setTaskInfo({
          TaskType: 4,
          ID: res.DailyTaskID,
        });
        setFormsModalVisible(true);
      },
    });
  };

  const getColumns = () => {
    let columns1 = [
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
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
      },
      {
        title: '任务单派发时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        ellipsis: true,
      },
      {
        title: '是否完成',
        dataIndex: 'IsCompleteTip',
        key: 'IsCompleteTip',
        ellipsis: true,
        width: 100,
        render: (text, record) => {
          if (text === '是') {
            return <Tag color="success">{text}</Tag>;
          }
          return <Tag color="error">{text}</Tag>;
        },
      },
      {
        title: '回访人',
        dataIndex: 'ReturnUserName',
        key: 'ReturnUserName',
        ellipsis: true,
      },
      {
        title: '任务完成时间/派单关闭时间',
        dataIndex: 'ShowTime',
        key: 'ShowTime',
        ellipsis: true,
        render: (text, record) => {
          return text || '-';
        },
      },
    ];

    let columns2 = [
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
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
        width: 120,
      },
      {
        title: '省份',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        ellipsis: true,
        width: 120,
      },
      {
        title: '客户名称（全称）',
        dataIndex: 'CustomName',
        key: 'CustomName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '客户姓名',
        dataIndex: 'CustomRealName',
        key: 'CustomRealName',
        ellipsis: true,
        width: 120,
      },
      {
        title: '部门',
        dataIndex: 'Depart',
        key: 'Depart',
        ellipsis: true,
        width: 100,
      },
      {
        title: '服务态度',
        dataIndex: 'ServeManner',
        key: 'ServeManner',
        ellipsis: true,
        width: 100,
      },
      {
        title: '技术水平',
        dataIndex: 'TechnicalLevel',
        key: 'TechnicalLevel',
        ellipsis: true,
        width: 100,
      },
      {
        title: '服务响应',
        dataIndex: 'ServiceResponse',
        key: 'ServiceResponse',
        ellipsis: true,
        width: 100,
      },
      {
        title: '问题解决率',
        dataIndex: 'ProblemSolvingEfficiency',
        key: 'ProblemSolvingEfficiency',
        ellipsis: true,
        width: 100,
      },
      {
        title: '问题建议',
        dataIndex: 'ProblemsAndAdvice',
        key: 'ProblemsAndAdvice',
        ellipsis: true,
        width: 220,
        render: (text, record) => {
          return text || '-';
        },
      },
      {
        title: '回访人',
        dataIndex: 'ReturnUserName',
        key: 'ReturnUserName',
        ellipsis: true,
      },
      {
        title: '回访时间',
        dataIndex: 'ReturnTime',
        key: 'ReturnTime',
        ellipsis: true,
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record) => {
          return (
            <>
              <Tooltip title="编辑">
                <a
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setEditId(record.ID);
                    GetCustomerVisitInfor(record.ID, {
                      UserGroup_Name: record.RegionName,
                      ProvinceName: record.ProvinceName,
                    });
                  }}
                >
                  <EditOutlined style={{ fontSize: 16 }} />
                </a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  title="确认要删除吗?"
                  onConfirm={() => {
                    onDelete(record.ID);
                  }}
                  // onCancel={this.cancel}
                  okText="是"
                  cancelText="否"
                >
                  <a style={{ cursor: 'pointer' }}>
                    <DeleteOutlined style={{ fontSize: 16 }} />
                  </a>
                </Popconfirm>
              </Tooltip>
            </>
          );
        },
      },
    ];

    if (dataType === 1) {
      return columns1;
    }

    let columns = columns2;
    if (dataType === 2) {
      if (title === '客户现场回访记录') {
        columns = columns2.filter(item => item.dataIndex !== 'handle');
      }
    }

    return columns;
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getTableDataSource(PageIndex, PageSize);
  };

  const disabledDate = current => {
    return (
      current &&
      current >
        moment()
          .add(-1, 'week')
          .endOf('week')
          .add(1, 'day')
    );
  };

  // 搜索组件
  const SearchComponents = () => {
    return (
      <Form
        id="searchForm"
        form={form}
        layout="inline"
        initialValues={{
          isComplete: 0,
          checkInState: 2,
          time: queryParams.time,
        }}
        // autoComplete="off"
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        <Space wrap style={{flexWrap: 'wrap'}}>
          <Form.Item name="regionCode" label="大区">
            <Select
              showSearch
              allowClear
              placeholder="请选择所属大区"
              style={{ width: 160 }}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {largeRegionList.map(item => {
                return (
                  <Option value={item.UserGroup_ID} key={item.UserGroup_ID}>
                    {item.UserGroup_Name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {dataType === 1 && (
            <Form.Item name="time" label="任务完成时间/派单关闭时间">
              <RangePicker
                style={{ width: 220 }}
                disabledDate={disabledDate}
                picker="month"
                allowClear={false}
              />
            </Form.Item>
          )}
          {dataType === 2 && (
            <>
              <Form.Item name="time" label="回访时间">
                <RangePicker
                  style={{ width: 200 }}
                  disabledDate={disabledDate}
                  picker="month"
                  allowClear={false}
                />
              </Form.Item>
              <Form.Item name="searcahUserName" label="客户名称">
                <Input allowClear={true} style={{ width: 200 }} placeholder="请输入" />
              </Form.Item>
            </> 
          )}
          {dataType === 2 && title === '客户现场回访记录' && (
            <Form.Item name="customerScore" label="客户满意度小于">
              <InputNumber allowClear={true} style={{ width: '100%' }} placeholder="请输入" />
            </Form.Item>
          )}
          {dataType === 1 && (
            <Form.Item name="isComplete" label="是否完成">
              <Radio.Group style={{ width: 180 }}>
                <Radio value={0}>全部</Radio>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          <Form.Item>
            <Space style={{ marginLeft: 10 }}>
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
              {title !== '客户现场回访管理' && (
                <Button
                  icon={<ExportOutlined />}
                  loading={exportLoading}
                  type="primary"
                  onClick={() => {
                    onExport();
                  }}
                >
                  导出
                </Button>
              )}
            </Space>
          </Form.Item>
        </Space>
      </Form>
    );
  };
  return (
    <Modal
      title={title}
      wrapClassName="spreadOverModal"
      visible={open}
      destroyOnClose
      footer={null}
      onCancel={() => {
        onCancel();
      }}
    >
      <SearchComponents />
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
      <FromsModal
        visible={formsModalVisible}
        taskInfo={taskInfo}
        editData={currentEditData}
        onCancel={() => {
          setFormsModalVisible(false);
        }}
        onSubmitCallback={() => {
          setFormsModalVisible(false);
          getTableDataSource();
        }}
      />
    </Modal>
  );
};

export default connect(dvaPropsData)(RecordModal);
