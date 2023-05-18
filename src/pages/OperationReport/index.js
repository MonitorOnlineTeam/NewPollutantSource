import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  DatePicker,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Divider,
  Tag,
  Select,
  Row,
  Col,
} from 'antd';
import moment from 'moment';
import styles from './style.less';
import SdlTable from '@/components/SdlTable';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
  queryLoading: loading.effects['wordSupervision/GetOtherWorkList'],
});

const OperationReport = props => {
  const [form] = Form.useForm();
  const { flag, type, queryLoading, exportLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [currentEditData, setCurrentEditData] = useState({});
  const [taskInfo, setTaskInfo] = useState({});

  useEffect(() => {
    // onFinish();
  }, []);

  // 查询数据
  const onFinish = async () => {
    const values = await form.validateFields();
    // const body = getParams(values);

    // props.dispatch({
    //   type: 'wordSupervision/GetOtherWorkList',
    //   payload: body,
    //   callback: res => {
    //     setDataSource(res);
    //   },
    // });
  };

  // 导出
  const onExport = async () => {
    const values = await form.validateFields();
    const body = getParams(values);
    props.dispatch({
      type: 'wordSupervision/exportTaskRecord',
      payload: {
        ...body,
        apiName: 'ExportOtherWorkList',
      },
    });
  };

  // 获取列头
  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '省',
        dataIndex: 'User_Name',
        key: 'User_Name',
      },
      {
        title: '市',
        dataIndex: 'WorkTime',
        key: 'WorkTime',
      },
      {
        title: '企业',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '行业类型',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '监测点名称',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '排放类型',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '巡检完成率',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '校准完成率',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '超标报警核实率',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '异常报警响应率',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '缺失报警响应率',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '设备异常率',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '故障修复率',
        dataIndex: 'WorkResults',
        key: 'WorkResults',
      },
      {
        title: '有效传输率',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
      },
    ];

    return columns;
  };

  return (
    <BreadcrumbWrapper>
      <Card>
        <Form
          name="basic"
          form={form}
          layout="inline"
          style={{ padding: '10px 0 20px' }}
          initialValues={{
            date: [
              moment()
                .subtract(1, 'month')
                .startOf('day'),
              moment(),
            ],
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="统计范围" name="range">
            <Select placeholder="请选择统计范围" style={{ width: 200 }}>
              <Option value={1}>按企业统计</Option>
              <Option value={2}>按行政区统计</Option>
            </Select>
          </Form.Item>
          <Form.Item label="统计日期" name="date">
            <RangePicker allowClear={false} />
          </Form.Item>
          <Form.Item label="排放类型" name="type">
            <Select placeholder="请选择排放类型" style={{ width: 200 }}>
              <Option value={1}>废气</Option>
              <Option value={2}>废水</Option>
            </Select>
          </Form.Item>
          <Space>
            <Button type="primary" onClick={() => onFinish()} loading={queryLoading}>
              查询
            </Button>
            <Button loading={exportLoading} onClick={() => onExport()}>
              导出
            </Button>
          </Space>
        </Form>
        <h3 className={styles.titleBar}>***化工有限公司2023-04-01 ~ 2023-04-23运维报告</h3>
        <SdlTable
          loading={queryLoading}
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
        />
        <Row border gutter={16}>
          <Col flex={1}>
            <Card title="超标报警核实统计"></Card>
          </Col>
          <Col flex={1}>
            <Card title="异常报警响应统计"></Card>
          </Col>
          <Col flex="300px">
            <Card title="缺失报警响应统计"></Card>
          </Col>
        </Row>
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(OperationReport);
