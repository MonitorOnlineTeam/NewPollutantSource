/*
 * @Author: outman0611
 * @Date: 2024-12-18 15:10:07
 * @LastEditors: outman0611
 * @LastEditTime: 2024-12-23 16:26:15
 * @Description: 现场检查记录
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Radio,
  Tag,
  Divider,
  Select,
  Modal,
  Row,
  Col,
  DatePicker,
  Alert,
  message,
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import LargeRegionList from '@/components/largeRegionList';
import SiteQualityInspection from '@/pages/workSupervision/Forms/SiteQualityInspection';

const { TextArea } = Input;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  exportLoading: loading.effects['wordSupervision/ExportOnsiteInspectionRecord'],
  queryLoading: loading.effects['wordSupervision/GetOnsiteInspectionRecordList'],
});

const RecordAndManagement = props => {
  const [form] = Form.useForm();
  const { open, onCancel, modalType, queryLoading, exportLoading, taskInfo } = props;

  // useEffect(() => {
  //   form.setFieldsValue({
  //     ...editData,
  //     WorkTime: editData.WorkTime ? moment(editData.WorkTime) : undefined,
  //   });
  // }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([1]);
  const [addData, setAddData] = useState({});
  const [editDetailDataOpen, setEditDetailDataOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    getPageData();
  }, []);

  const getParams = async () => {
    const values = await form.validateFields();
    const beginTime = values?.date
      ? moment(values.date[0]).format('YYYY-MM-DD 00:00:00')
      : undefined;
    const endTime = values?.date ? moment(values.date[1]).format('YYYY-MM-DD 23:59:59') : undefined;
    return {
      ...values,
      BeginTime: beginTime,
      EndTime: endTime,
    };
  };

  const getPageData = async (_pageIndex, _pageSize) => {
    try {
      let payload = {};
      if (modalType === 2) {
        // 现场检查记录需要表单参数和分页
        let params = await getParams();
        payload = {
          ...params,
          pageIndex: _pageIndex || pageIndex,
          pageSize: _pageSize || pageSize,
        };
      }
      props.dispatch({
        type: 'wordSupervision/GetOnsiteInspectionRecordList',
        payload: {
          ...payload,
          dailyTaskID: taskInfo.ID,
          isFlag: modalType == 1,
        },
        callback: res => {
          if (res?.IsSuccess) {
            setDataSource(res.Datas || []);
            if (modalType === 2) {
              setTableTotal(res.Total);
            }
          }
        },
      });
    } catch (error) {
      console.error('Get page data error:', error);
    }
  };

  // 删除现场检查
  const onDelete = async id => {
    await props.dispatch({
      type: 'wordSupervision/DeleteOnsiteInspectionRecord',
      payload: { ID: id },
      callback: res => {
        if (res?.IsSuccess) {
          message.success('删除成功');
          getPageData();
        }
      },
    });
  };

  // 记录导出
  const onExport = async () => {
    let params = await getParams();
    props.dispatch({
      type: 'wordSupervision/ExportOnsiteInspectionRecord',
      payload: params,
    });
  };

  const onEditOrView = (record, type) => {
    setEditDetailDataOpen(true);
    setMode(type);
    setRowData(record);
  };

  // 获取列头
  const getColumns = () => {
    const columns = [
      {
        title: '序号',
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
      },
      {
        title: '项目编号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        ellipsis: true,
      },
      {
        title: '用户单位',
        dataIndex: 'EntName',
        key: 'EntName',
        ellipsis: true,
      },
      {
        title: '监测点位',
        dataIndex: 'PointName',
        key: 'PointName',
        ellipsis: true,
      },
      {
        title: '系统型号',
        dataIndex: 'CemsModelName',
        key: 'CemsModelName',
        ellipsis: true,
      },
      {
        title: '安装日期',
        dataIndex: 'InstallDate',
        key: 'InstallDate',
        ellipsis: true,
      },
      {
        title: '检查人员',
        dataIndex: 'VerificationUserName',
        key: 'VerificationUserName',
        ellipsis: true,
      },
      {
        title: '检查日期',
        dataIndex: 'VerificationDate',
        key: 'VerificationDate',
        ellipsis: true,
      },
      {
        title: '服务人员',
        dataIndex: 'ServerUser',
        key: 'ServerUser',
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
        render: (text, record) => {
          if (taskInfo?.ID && record.IsEdit) {
            return (
              <>
                <Tooltip title="编辑">
                  <a
                    onClick={() => {
                      onEditOrView(record, 'edit');
                    }}
                  >
                    <EditIcon />
                  </a>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="详情">
                  <a
                    onClick={() => {
                      onEditOrView(record, 'view');
                    }}
                  >
                    <DetailIcon />
                  </a>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="删除">
                  <Popconfirm
                    placement="left"
                    title="确认是否删除?"
                    okText="是"
                    cancelText="否"
                    onConfirm={() => {
                      onDelete(record.ID);
                    }}
                  >
                    <a>
                      <DelIcon />
                    </a>
                  </Popconfirm>
                </Tooltip>
              </>
            );
          } else if (modalType == 1 && record.IsEdit) {
            return (
              <Tooltip title="编辑">
                <a
                  onClick={() => {
                    onEditOrView(record, 'edit');
                  }}
                >
                  <EditIcon />
                </a>
              </Tooltip>
            );
          } else if (modalType == 2) {
            return (
              <Tooltip title="详情">
                <a
                  onClick={() => {
                    onEditOrView(record, 'view');
                  }}
                >
                  <DetailIcon />
                </a>
              </Tooltip>
            );
          }
        },
      },
    ];

    return columns;
  };

  //分页
  const handleTableChange = (PageIndex, PageSize) => {
    if (modalType === 2) {
      setPageSize(PageSize);
      setPageIndex(PageIndex);
      getPageData(PageIndex, PageSize);
    }
  };

  const SearchComponents = () => {
    return (
      <Form
        name="basic"
        form={form}
        initialValues={{
          date: [moment().add(-1, 'months'), moment()],
        }}
        autoComplete="off"
        labelCol={{
          flex: '69px',
        }}
      >
        <Row>
          <Col span={6}>
            <LargeRegionList name="largeRegionCode" label="大区" />
          </Col>
          <Col span={6}>
            <Form.Item label="项目编号" name="projectCode">
              <Input placeholder="请输入项目编号" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="项目名称" name="projectName">
              <Input placeholder="请输入项目名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="系统型号" name="cemsModelName">
              <Input placeholder="请输入系统型号" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="用户单位" name="entName">
              <Input placeholder="请输入用户单位" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="检查人员" name="verificationUserName">
              <Input placeholder="请输入检查人员" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="检查时间" name="date">
              <RangePicker_ picker="day" format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                onClick={() => handleTableChange(1, 20)}
                loading={queryLoading}
              >
                查询
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  handleTableChange(1, 20);
                }}
                loading={queryLoading}
              >
                重置
              </Button>
              <Button loading={exportLoading} onClick={() => onExport()}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    );
  };

  const data = taskInfo?.ID ? taskInfo : addData;

  return (
    <>
      <div className="queryCriterTitleSty">
        {// 工作台 - 现场检查任务单
        taskInfo?.ID && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message={`任务类型：现场检查任务单，派发时间：${data.BeginTime} ，有效期：${
                data.EndTime
              } ，任务单派发频次1次/月，应至少覆盖监测点${data.standMNNum ||
                0}个，服务人员${data.standPersonNum || 0}人`}
              type="info"
              showIcon
              style={{ marginRight: 30 }}
            />
            <Button
              type="primary"
              onClick={() => {
                setMode('add');
                setRowData({});
                setEditDetailDataOpen(true);
              }}
            >
              添加
            </Button>
          </Space>
        )}
        {// 现场检查记录
        modalType == 2 && <SearchComponents />}
      </div>
      <SdlTable
        style={{ marginTop: 10 }}
        loading={queryLoading}
        align="center"
        columns={getColumns()}
        dataSource={dataSource}
        pagination={
          modalType === 2
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
      <Modal
        centered
        open={editDetailDataOpen}
        footer={null}
        wrapClassName="spreadOverModal noTitleSty"
        mask={false}
        destroyOnClose
        onCancel={() => setEditDetailDataOpen(false)}
      >
        <SiteQualityInspection
          taskInfo={taskInfo}
          mode={mode}
          rowData={rowData}
          onCancel={() => {
            setEditDetailDataOpen(false);
            setRowData({});
          }}
          onSubmitCallback={() => {
            getPageData();
            setEditDetailDataOpen(false);
            setRowData({});
          }}
        />
      </Modal>
    </>
  );
};
RecordAndManagement.defaultProps = {
  taskInfo: {},
};

export default connect(dvaPropsData)(RecordAndManagement);
