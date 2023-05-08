import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tag, Radio, Divider } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { getMonthColumnsByYear } from '../../workSupervisionUtils';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/getStatisticsData'],
  exportLoading: loading.effects['wordSupervision/exportStatisticsData'],
});

const HFKH = props => {
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
    const beginTime = moment(values.date)
      .startOf(values.timeType)
      .format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(values.date)
      .endOf(values.timeType)
      .format('YYYY-MM-DD HH:mm:ss');

    return {
      beginTime: beginTime,
      endTime: endTime,
      timeType: values.timeType,
      type: type,
    };
  };

  // 查询数据
  const onFinish = () => {
    const body = getParams();
    props.dispatch({
      type: 'wordSupervision/getStatisticsData',
      payload: {
        ...body,
        apiName: 'StatisticsReturnVisitCustomers',
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
        apiName: 'ExportStatisticsReturnVisitCustomers',
      },
    });
  };
  // 获取列头
  const getColumns = () => {
    const { timeType, date } = form.getFieldsValue();

    let monthColumns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: !type ? '省区' : '大区',
        dataIndex: 'RegionName',
        key: 'RegionName',
      },
      {
        title: '经理姓名',
        dataIndex: 'User_Name',
        key: 'User_Name',
      },
      {
        title: '应回访次数',
        dataIndex: 'standNum',
        key: 'standNum',
      },
      {
        title: '实际回访次数',
        dataIndex: 'overNum',
        key: 'overNum',
      },
      {
        title: '达标情况',
        dataIndex: 'qualify',
        key: 'qualify',
        sorter: (a, b) => a.qualify - b.qualify,
        render: text => {
          return text === 1 ? <Tag color="success">已达标</Tag> : <Tag color="error">未达标</Tag>;
        },
      },
    ];

    let yearColumns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: !type ? '省区' : '大区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        sorter: (a, b) => a.RegionName - b.RegionName,
      },
      {
        title: '经理姓名',
        dataIndex: 'User_Name',
        key: 'User_Name',
      },
      {
        title: '达标率',
        dataIndex: 'Rate',
        key: 'Rate',
        sorter: (a, b) => a.Rate - b.Rate,
        render: text => {
          return text ? text + '%' : '-';
        },
      },
    ];

    if (timeType === 'year') {
      let months = getMonthColumnsByYear(date);
      return yearColumns.concat(months);
    } else {
      return monthColumns;
    }
  };

  const timeType = form.getFieldValue('timeType');
  return (
    <Card title="回访客户统计" style={{ marginTop: -24 }}>
      <Form
        name="basic"
        form={form}
        layout="inline"
        style={{ padding: '10px 0 20px' }}
        initialValues={{
          date: moment(),
          timeType: 'month',
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="时间" name="date">
          <DatePicker picker={timeType} allowClear={false} />
        </Form.Item>
        <Space>
          <Button type="primary" onClick={() => onFinish()} loading={queryLoading}>
            查询
          </Button>
          <Button loading={exportLoading} onClick={() => onExport()}>
            导出
          </Button>
          <Form.Item name="timeType" style={{ marginLeft: 20 }}>
            <Radio.Group
              buttonStyle="solid"
              onChange={e => {
                onFinish();
              }}
            >
              <Radio.Button style={{ width: 60, textAlign: 'center' }} value={'month'}>
                月
              </Radio.Button>
              <Radio.Button style={{ width: 60, textAlign: 'center' }} value={'year'}>
                年
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
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

export default connect(dvaPropsData)(HFKH);
