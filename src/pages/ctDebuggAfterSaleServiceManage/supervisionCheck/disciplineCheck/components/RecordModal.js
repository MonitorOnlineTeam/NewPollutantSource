/*
 * @Author: JiaQi
 * @Date: 2024-03-27 16:18:02
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-28 13:47:17
 * @Description:  纪律检查记录弹窗
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
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, disciplineCheck }) => ({
  largeRegionList: disciplineCheck.largeRegionList,
  queryLoading: loading.effects[`disciplineCheck/GetDisciplineCheckList`],
  exportLoading: loading.effects[`disciplineCheck/ExportDisciplineCheckList`],
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
      beginTime: values.time[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.time[1].endOf('day').format('YYYY-MM-DD 23:59:59'),
      taskType: '7',
      dataType: dataType,
      systemType: '2',
    };

    return {
      beginTime: '2024-03-04 00:00:00',
      endTime: '2024-03-24 23:59:00',
      taskType: '',
      systemType: '',
      dataType: dataType,
      regionCode: '',
      isComplete: 0,
      searcahUserName: '',
      pageIndex: 1,
      pageSize: 10,
    };
  };

  // 获取表格数据
  const getTableDataSource = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'disciplineCheck/GetDisciplineCheckList',
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
      type: 'disciplineCheck/DeleteDisciplineCheckManage',
      payload: {
        ID,
      },
      callback: res => {
        handleTableChange(1, 20);
        title === '纪律检查管理' && reloadPage();
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'disciplineCheck/ExportDisciplineCheckList',
      payload: {
        ...body,
        pageIndex: 0,
        pageSize: 0,
      },
    });
  };

  // 获取纪律检查详情
  const GetRecordLogInfor = ID => {
    dispatch({
      type: 'disciplineCheck/GetRecordLogInfor',
      payload: {
        ID,
      },
      callback: res => {
        form1.setFieldsValue({
          checkInState: res.CheckInState,
          unqualifiedDate: res.UnqualifiedDate,
          unqualifiedReason: res.UnqualifiedReason,
          recordUnqualifiedDate: res.RecordUnqualifiedDate,
          logID: res.ID,
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
          type: 'disciplineCheck/UpdateDisciplineCheckManage',
          payload: values,
          callback: res => {
            setIsEditModalOpen(false);
            getTableDataSource();
          },
        });
      })
      .catch(error => {
        message.error('请将数据填写完整！');
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
        title: '检查人',
        dataIndex: 'CheckUserName',
        key: 'CheckUserName',
        ellipsis: true,
      },
      {
        title: '检查时间/派单关闭时间',
        dataIndex: 'ShowTime',
        key: 'ShowTime',
        ellipsis: true,
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
        title: '姓名',
        dataIndex: 'NormalUserName',
        key: 'NormalUserName',
        ellipsis: true,
        width: 120,
      },
      {
        title: '签到是否合格',
        dataIndex: 'CheckIn',
        key: 'CheckIn',
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
        dataIndex: 'CheckUserName',
        key: 'CheckUserName',
        ellipsis: true,
        width: 120,
      },
      {
        title: '检查时间',
        dataIndex: 'RecordTime',
        key: 'RecordTime',
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
                    setEditId(record.LogID);
                    GetRecordLogInfor(record.LogID);
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
                    onDelete(record.LogID);
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
      if (title === '纪律检查记录') {
        columns = columns2.filter(item => item.dataIndex !== 'handle' && item.dataIndex !== 'CheckUserName');
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
        autoComplete="off"
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        <Space>
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
          <Form.Item name="time" label="检查时间">
            <RangePicker disabledDate={disabledDate} picker="week" allowClear={false} />
          </Form.Item>
          <Form.Item name="searcahUserName" label="姓名">
            <Input allowClear={true} style={{ width: '100%' }} placeholder="请输入" />
          </Form.Item>
          {dataType === 1 && (
            <Form.Item name="isComplete" label="是否完成">
              <Radio.Group>
                <Radio value={0}>全部</Radio>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          {dataType === 2 && (
            <Form.Item name="checkInState" label="是否合格">
              <Radio.Group>
                <Radio value={2}>全部</Radio>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
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
              {title !== '纪律检查管理' && (
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
      footer={[]}
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

      <Modal
        title="编辑"
        destroyOnClose
        visible={isEditModalOpen}
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
          <Form.Item name="logID" style={{ display: 'none' }}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
};

export default connect(dvaPropsData)(RecordModal);
