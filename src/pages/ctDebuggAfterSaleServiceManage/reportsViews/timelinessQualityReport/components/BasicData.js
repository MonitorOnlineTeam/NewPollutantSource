import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Typography,
  Input,
  Button,
  Descriptions,
  Space,
  Tooltip,
  Modal,
  Row,
  Col,
  Select,
  Empty,
} from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { ProfileOutlined } from '@ant-design/icons';
import styles from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/timelyRate/index.less';
import ServiceReportModal from './ServiceReportModal';

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, reportsAndViews, common }) => ({
  largeRegionList: common.CtLargeRegionList,
  basicsLoading:
    loading.effects['reportsAndViews/GetTimelyPassRateListByArea'] ||
    loading.effects['reportsAndViews/GetTimelyPassRateListByUser'],
  exportLoading:
    loading.effects['reportsAndViews/ExportTimelyPassRateListByArea'] ||
    loading.effects['reportsAndViews/ExportTimelyPassRateListByUser'],
});

const BasicData = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [serviceReportOpen, setServiceReportOpen] = useState(false);
  const [descriptionList, setDescriptionList] = useState([]);

  const {
    dispatch,
    basicsLoading,
    exportLoading,
    title,
    defaultTime,
    isModalOpen,
    onCancel,
    largeRegionList,
    type, // 1：按大区统计  2：按人员统计
    level, // 2: 及时率 3：合格率
    wrapClassName,
  } = props;
  console.log('basicsLoading', basicsLoading);
  useEffect(() => {
    getBasicsData();
    getLargeRegion();
  }, []);

  // 获取基础数据
  const getBasicsData = (_pageIndex, _pageSize) => {
    const actionType =
      type === 1
        ? 'reportsAndViews/GetTimelyPassRateListByArea'
        : 'reportsAndViews/GetTimelyPassRateListByUser';
    const values = form.getFieldsValue();
    dispatch({
      type: actionType,
      payload: {
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
        userID: props.userID,
        ...values,
        beginLeaveDate: values.time && values.time[0].format('YYYY-MM-DD 00:00:00'),
        endLeaveDate: values.time && values.time[1].format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        level: level,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 获取大区及省份
  const getLargeRegion = () => {
    dispatch({
      type: 'common/getCTLargeRegion',
      payload: {},
    });
  };

  // 导出
  const onExport = () => {
    const actionType =
      type === 1
        ? 'reportsAndViews/ExportTimelyPassRateListByArea'
        : 'reportsAndViews/ExportTimelyPassRateListByUser';
    const values = form.getFieldsValue();
    dispatch({
      type: actionType,
      payload: {
        pageIndex: 0,
        pageSize: 0,
        ...values,
        beginLeaveDate: values.time && values.time[0].format('YYYY-MM-DD 00:00:00'),
        endLeaveDate: values.time && values.time[1].format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        level: level,
      },
    });
  };

  //
  const getBasicsColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '派工单号',
        dataIndex: 'Num',
        key: 'Num',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '合同编号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '立项号',
        dataIndex: 'ItemCode',
        key: 'ItemCode',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        align: 'center',
        ellipsis: true,
        width: 260,
      },
      {
        title: '服务大区',
        dataIndex: 'Region',
        key: 'Region',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '合同类型',
        dataIndex: 'ProjectType',
        key: 'ProjectType',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '最终用户',
        dataIndex: 'CustomEnt',
        key: 'CustomEnt',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '项目所在省',
        dataIndex: 'Province',
        key: 'Province',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '服务工程师',
        dataIndex: 'WorkerName',
        key: 'WorkerName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '下单日期',
        dataIndex: 'OrderDate',
        key: 'OrderDate',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '离开现场时间',
        dataIndex: 'LeaveDate',
        key: 'LeaveDate',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '及时状态',
        dataIndex: 'TimelyTip',
        key: 'TimelyTip',
        align: 'center',
        ellipsis: true,
        render: (text, record) => {
          if (record.TimelyTip === '不及时') {
            return <Text type="danger">{text}</Text>;
          }
          return text;
        },
      },
      {
        title: '审核状态',
        dataIndex: 'CheckStatuTip',
        key: 'CheckStatuTip',
        ellipsis: true,
      },
      {
        title: '合格状态',
        dataIndex: 'AuditTip',
        key: 'AuditTip',
        ellipsis: true,
      },
      {
        title: '审核后报告状态',
        dataIndex: 'CheckReportStatuTip',
        key: 'CheckReportStatuTip',
        ellipsis: true,
      },
      {
        title: <span>操作</span>,
        align: 'center',
        fixed: 'right',
        width: 60,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip title="详情">
              <a
                onClick={() => {
                  setServiceReportOpen(true);
                  setCurrentRow(record);
                  let descriptionList = [];
                  if (level === '2') {
                    descriptionList = [
                      { name: '离开现场时间', value: record.LeaveDate },
                      { name: '及时状态', value: record.TimelyTip },
                      { name: '审核状态', value: record.CheckStatuTip },
                      { name: '审核后报告状态', value: record.CheckReportStatuTip },
                    ];
                  } else {
                    descriptionList = [
                      { name: '离开现场时间', value: record.LeaveDate },
                      { name: '审核状态', value: record.CheckStatuTip },
                      { name: '审核后报告状态', value: record.AuditTip },
                    ];
                  }
                  setDescriptionList(descriptionList);
                }}
              >
                <ProfileOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
          );
        },
      },
    ];

    if (level === '2') {
      // 及时率不显示合格状态
      columns = columns.filter(item => item.dataIndex !== 'AuditTip');
    } else {
      // 合格率不显示大区、及时状态、审核后报告状态
      columns = columns.filter(
        item =>
          item.dataIndex !== 'Region' &&
          item.dataIndex !== 'TimelyTip' &&
          item.dataIndex !== 'CheckReportStatuTip',
      );
    }

    return columns;
  };

  //分页
  const handleTableChange = (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getBasicsData(PageIndex, PageSize);
  };

  const TitleComponents = props => {
    return (
      <div
        style={{
          display: 'inline-block',
          fontSize: 15,
          fontWeight: 'bold',
          marginTop: 4,
          padding: '2px 0',
          marginBottom: 12,
          borderBottom: '1px solid rgba(0,0,0,.1)',
          ...props.style,
        }}
      >
        {props.text}
      </div>
    );
  };
  return (
    <Modal
      title={title}
      wrapClassName={wrapClassName || `spreadOverModal`}
      open={isModalOpen}
      destroyOnClose
      footer={null}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        id="searchForm"
        form={form}
        initialValues={{
          time: defaultTime || [moment().startOf('month'), moment()],
        }}
        autoComplete="off"
        style={{ marginTop: 10, marginBottom: 10 }}
        labelCol={{
          flex: '120px',
        }}
        wrapperCol={{
          flex: 1,
        }}
      >
        <Row gutter={8} align="middle">
          <Col span={8}>
            <Form.Item name="num" label="派工单号">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="projectCode" label="项目编号">
              <Input placeholder="请输入合同编号/立项号" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="projectName" label="项目名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          {type === 1 && (
            <Col span={8}>
              <Form.Item name="region" label="服务大区">
                <Select placeholder="请选择服务大区" style={{ width: '100%' }} allowClear>
                  {largeRegionList.map(item => {
                    return (
                      <Option value={item.ID} key={item.ID} data-childList={item.ChildList}>
                        {item.LargeRegion}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          )}
          {level === '2' && (
            <Col span={8}>
              <Form.Item name="timelyStatus" label="及时状态">
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value={undefined} key={undefined}>
                    全部
                  </Option>
                  <Option value={0} key={0}>
                    及时
                  </Option>
                  <Option value={1} key={1}>
                    不及时
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          )}
          {level === '3' && (
            <Col span={8}>
              <Form.Item name="passStatus" label="合格状态">
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value={1} key={1}>
                    合格
                  </Option>
                  <Option value={2} key={2}>
                    不合格
                  </Option>
                  <Option value={3} key={3}>
                    /
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col span={8}>
            <Form.Item name="time" label="离开现场时间">
              <RangePicker_
                style={{ width: '100%' }}
                allowClear={false}
                showTime={false}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Space>
                <Button
                  loading={basicsLoading}
                  type="primary"
                  onClick={() => handleTableChange(1, 20)}
                >
                  查询
                </Button>
                <Button
                  loading={basicsLoading}
                  onClick={() => {
                    form.resetFields();
                    handleTableChange(1, 20);
                  }}
                >
                  重置
                </Button>
                <Button
                  loading={exportLoading}
                  icon={<ExportOutlined />}
                  onClick={() => onExport()}
                >
                  导出
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <SdlTable
        resizable
        loading={basicsLoading}
        dataSource={dataSource}
        columns={getBasicsColumns()}
        align="center"
        pagination={{
          total: tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />

      <ServiceReportModal
        wrapClassName={wrapClassName}
        descriptionColumn={4}
        descriptionList={descriptionList}
        isModalOpen={serviceReportOpen}
        data={currentRow}
        onCancel={() => {
          setServiceReportOpen(false);
        }}
      />
    </Modal>
  );
};

export default connect(dvaPropsData)(BasicData);
