import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tag, Radio, Divider } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/StatisticsAccountsReceivable'],
  exportLoading: loading.effects['wordSupervision/exportStatisticsData'],
});

const ZKCS = props => {
  const [form] = Form.useForm();
  const { flag, type, queryLoading, exportLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  // const [timeType, setTimeType] = useState('month');

  useEffect(() => {
    onFinish();
  }, [type]);

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    const beginTime = moment(values.date[0]).format('YYYY-MM-DD 00:00:00');
    const endTime = moment(values.date[1]).format('YYYY-MM-DD 23:59:59');

    return {
      beginTime: beginTime,
      endTime: endTime,
      // workType: 10,
      type: type,
    };
  };

  // 查询数据
  const onFinish = () => {
    const body = getParams();
    props.dispatch({
      type: 'wordSupervision/StatisticsAccountsReceivable',
      payload: {
        ...body,
      },
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    props.dispatch({
      type: 'wordSupervision/exportStatisticsData',
      payload: {
        ...body,
        apiName: 'ExportStatisticsAccountsReceivable',
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
        title: '经理姓名',
        dataIndex: 'User_Name',
        key: 'User_Name',
      },
      {
        title: '完成次数',
        dataIndex: 'overNum',
        key: 'overNum',
        sorter: (a, b) => a.overNum - b.overNum,
        render: text => {
          return text + '次';
        },
      },
    ];

    return columns;
  };

  return (
    <Card title="应收账款催收统计" style={{ marginTop: -24 }}>
      <Form
        name="basic"
        form={form}
        layout="inline"
        style={{ padding: '10px 0 20px' }}
        initialValues={{
          date: [moment().subtract(1, 'month'), moment()],
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="时间" name="date">
          <RangePicker allowClear={false} />
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
      <SdlTable
        loading={queryLoading}
        align="center"
        columns={getColumns()}
        dataSource={dataSource}
      />
    </Card>
  );
};

export default connect(dvaPropsData)(ZKCS);
