/*
 * @Author: JiaQi 
 * @Date: 2023-04-25 16:33:51 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-15 09:56:36
 * @Description： 办事处统计
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tag, Radio, Divider, Tabs } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { getMonthColumnsByYear } from '../../workSupervisionUtils';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/getStatisticsData'],
  exportLoading: loading.effects['wordSupervision/exportStatisticsData'],
});

const OfficeCheck = props => {
  const [form] = Form.useForm();
  const { flag, type, queryLoading, exportLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [officeYearDataSource, setOfficeYearDataSource] = useState([]);
  const [userYearDataSource, setUserYearDataSource] = useState([]);
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
        apiName: 'StatisticsOfficeCheck',
      },
      callback: res => {
        if (body.timeType === 'month') {
          setDataSource(res);
        } else {
          setOfficeYearDataSource(res.officeYear);
          setUserYearDataSource(res.userYear);
        }
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
        apiName: 'ExportStatisticsOfficeCheck',
      },
    });
  };

  // 获取月列头
  const getMonthColumns = () => {
    return [
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
        title: '办事处',
        dataIndex: 'OfficeName',
        key: 'OfficeName',
      },
      {
        title: '经理姓名',
        dataIndex: 'User_Name',
        key: 'User_Name',
      },
      {
        title: '应完成数量（个/月）',
        dataIndex: 'standNum',
        key: 'standNum',
      },
      {
        title: '实际完成数量（个/月）',
        dataIndex: 'overNum',
        key: 'overNum',
      },
      {
        title: '达标情况',
        dataIndex: 'qualify',
        key: 'qualify',
        sorter: (a, b) => a.qualify - b.qualify,
        render: text => {
          if (text === 1) {
            return <Tag color="success">已达标</Tag>;
          }
          if (text === 0) {
            return <Tag color="error">未达标</Tag>;
          }
          return text;
        },
      },
    ];
  };

  // 获取年列头
  const getYearColumns = value => {
    const { timeType, date } = form.getFieldsValue();

    // 办事处
    let columns1 = [
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
        title: '办事处',
        dataIndex: 'OfficeName',
        key: 'OfficeName',
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

    // 经理
    let columns2 = [
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
        title: '达标率',
        dataIndex: 'Rate',
        key: 'Rate',
        sorter: (a, b) => a.Rate - b.Rate,
        render: text => {
          return text + '%';
        },
      },
    ];

    if (value === 1) {
      let months = getMonthColumnsByYear(date);
      return columns1.concat(months);
    } else {
      let months = getMonthColumnsByYear(date);
      return columns2.concat(months);
    }
  };

  const timeType = form.getFieldValue('timeType');
  console.log('timeType', timeType);
  return (
    <Card title="办事处检查统计" style={{ marginTop: -24 }}>
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
      {timeType === 'month' && (
        <SdlTable
          loading={queryLoading}
          align="center"
          columns={getMonthColumns()}
          dataSource={dataSource}
        />
      )}
      {timeType === 'year' && (
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="按办事处统计" key="1">
            <SdlTable
              loading={queryLoading}
              align="center"
              columns={getYearColumns(1)}
              dataSource={officeYearDataSource}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="按经理统计" key="2">
            <SdlTable
              loading={queryLoading}
              align="center"
              columns={getYearColumns(2)}
              dataSource={userYearDataSource}
            />
          </Tabs.TabPane>
        </Tabs>
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(OfficeCheck);
