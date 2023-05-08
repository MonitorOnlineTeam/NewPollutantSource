/*
 * @Author: JiaQi
 * @Date: 2023-04-25 16:04:28
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-08 17:01:50
 * @Description: 检查考勤和日志统计
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tag, Radio, Divider } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/StatisticsOtherWork'],
  exportLoading: loading.effects['wordSupervision/ExportStatisticsOtherWork'],
});

const KQRZ = props => {
  const [form] = Form.useForm();
  const { flag, type, queryLoading, exportLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    onFinish();
  }, [type]);

  const getWeekItems = () => {
    const { date } = form.getFieldsValue();

    // // 计算周数差
    let start = date[0].startOf('isoWeek');
    let end = date[1].endOf('isoWeek');
    const diffWeek = end.diff(start, 'weeks');

    //
    let WeekDateList = [];
    let WeekDateList2 = [];
    let weekDateStringList = [];
    // 计算每周的开始结束时间
    for (let index = 0; index <= diffWeek; index++) {
      let weekStart = start.clone().add(index * 7, 'day');
      let weekEnd = weekStart.clone().endOf('isoWeek');
      WeekDateList.push({
        begin: weekStart.format('YYYY-MM-DD HH:mm:ss'),
        end: weekEnd.format('YYYY-MM-DD HH:mm:ss'),
      });
      WeekDateList2.push(`${weekStart.format('MM/DD')} ~ ${weekEnd.format('MM/DD')}`);
      weekDateStringList.push(weekStart.format('YYYY-WW周'));
    }

    console.log('WeekDateList', WeekDateList);
    console.log('weekDateStringList', weekDateStringList);
    return { WeekDateList, WeekDateList2, weekDateStringList, start, end };
  };

  // 获取请求参数
  const getParams = () => {
    getColumns();
    const weeks = getWeekItems();
    return {
      Week: weeks.weekDateStringList,
      DateRange: weeks.WeekDateList,
      BeginTime: weeks.start.format('YYYY-MM-DD HH:mm:ss'),
      EndTime: weeks.end.format('YYYY-MM-DD HH:mm:ss'),
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
        apiName: 'StatisticsCheckAttendanceLog',
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
        apiName: 'ExportStatisticsCheckAttendanceLog',
      },
    });
  };

  // 获取列头
  const getColumns = () => {
    const weeks = getWeekItems();
    const weekColums = weeks.weekDateStringList.map((item, index) => {
      return {
        title: weeks.WeekDateList2[index],
        children: [
          {
            title: item,
            dataIndex: item,
            key: index,
            align: 'center',
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
        ],
      };
    });

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
        title: '达标率',
        dataIndex: 'Rate',
        key: 'Rate',
        sorter: (a, b) => a.Rate - b.Rate,
        render: text => {
          return text ? text + '%' : '-';
        },
      },
      ...weekColums,
    ];
    setColumns(columns);
  };

  return (
    <Card title="检查考勤和日志统计" style={{ marginTop: -24 }}>
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
          <RangePicker
            picker="week"
            // format="YYYY-WW"
            // onChange={(date, dateStr) => {
            //   // let startDate = moment(date[0]).startOf("weeks")
            //   // let endDate = moment(date[1]).endOf("weeks")
            //   // console.log('startDate', startDate)
            //   // console.log('date', startDate.format('YYYY-MM-DD HH:mm:ss'));
            //   // console.log('date', endDate.format('YYYY-MM-DD HH:mm:ss'));
            //   // console.log('dateStr', dateStr);
            //   console.log('date', date);
            //   console.log('dateStr', dateStr);
            // }}
          />
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
      <SdlTable loading={queryLoading} align="center" columns={columns} dataSource={dataSource} />
    </Card>
  );
};

export default connect(dvaPropsData)(KQRZ);
