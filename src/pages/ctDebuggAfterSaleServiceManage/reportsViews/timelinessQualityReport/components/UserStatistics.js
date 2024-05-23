/*
 * @Author: JiaQi
 * @Date: 2024-04-17 17:12:24
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-21 09:02:23
 * @Description: 按人员统计
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Typography, Button, Card, Space, Tooltip, Select } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { FileSearchOutlined } from '@ant-design/icons';
import BasicData from './BasicData';

const dvaPropsData = ({ loading, reportsAndViews, autoForm }) => ({
  autoForm: autoForm,
  loading: loading.effects[`reportsAndViews/GetTimelyPassRateListByUser`],
  exportLoading: loading.effects['reportsAndViews/ExportTimelyPassRateListByUser'],
});

const UserStatistics = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const [level, setLevel] = useState();
  const [basicTitle, setBasicTitle] = useState();

  const { dispatch, loading, exportLoading, date, autoForm } = props;

  useEffect(() => {
    getUserList();
    getUserStatisticsData();
  }, []);

  // 获取在职人员
  const getUserList = () => {
    dispatch({
      type: 'autoForm/getAutoFormData',
      payload: { configId: 'View_UserOperation', pageIndex: 1, pageSize: 9999999 },
    });
  };

  // 按人员统计
  const getUserStatisticsData = (_pageIndex, _pageSize) => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'reportsAndViews/GetTimelyPassRateListByUser',
      payload: {
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
        ...values,
        beginLeaveDate: values.time && values.time[0].format('YYYY-MM-DD 00:00:00'),
        endLeaveDate: values.time && values.time[1].format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        level: 1,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 导出
  const onExport = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'reportsAndViews/ExportTimelyPassRateListByUser',
      payload: {
        pageIndex: 0,
        pageSize: 0,
        ...values,
        beginLeaveDate: values.time && values.time[0].format('YYYY-MM-DD 00:00:00'),
        endLeaveDate: values.time && values.time[1].format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        level: 1,
      },
    });
  };

  //
  const getColumns = () => {
    return [
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '姓名',
        dataIndex: 'WorkerName',
        key: 'WorkerName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '工号',
        dataIndex: 'WorkerID',
        key: 'WorkerID',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '报告及时率',
        dataIndex: 'ReportTimelyRate',
        key: 'ReportTimelyRate',
        align: 'center',
        ellipsis: true,
        sorter: (a, b) => a.ReportTimelyRate - b.ReportTimelyRate,
        render: (text, row) => {
          return text + '%';
        },
      },
      {
        title: '报告合格率',
        dataIndex: 'ReportTimelyRate',
        key: 'ReportTimelyRate',
        align: 'center',
        ellipsis: true,
        sorter: (a, b) => a.ReportTimelyRate - b.ReportTimelyRate,
        render: (text, row) => {
          return text + '%';
        },
      },
      {
        title: '报告及时合格率',
        dataIndex: 'ReportTimelyQualifiedRate',
        key: 'ReportTimelyQualifiedRate',
        align: 'center',
        ellipsis: true,
        sorter: (a, b) => a.nottimelyCount - b.nottimelyCount,
        render: (text, row) => {
          return text + '%';
        },
      },
    ];
  };

  //分页
  const handleTableChange = (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getUserStatisticsData(PageIndex, PageSize);
  };

  return (
    <Card bodyStyle={{ paddingBottom: 20 }}>
      <Form
        id="searchForm"
        form={form}
        initialValues={{
          time: [moment().startOf('month'), moment()],
        }}
        autoComplete="off"
        style={{ marginTop: 10, marginBottom: 10 }}
        // labelCol={{
        //   flex: '120px',
        // }}
        // wrapperCol={{
        //   flex: 1,
        // }}
      >
        <Space align="middle">
          <Form.Item name="userID" label="姓名">
            <Select
              placeholder="请选择"
              showSearch
              optionFilterProp="children"
              style={{ width: 200 }}
              allowClear
            >
              {autoForm.tableInfo?.View_UserOperation?.dataSource?.map(item => {
                return (
                  <Option value={item['dbo.View_User.User_ID']} key={item['dbo.View_User.User_ID']}>
                    {item['dbo.View_User.User_Name']}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="time" label="离开现场时间" style={{ marginLeft: 20 }}>
            <RangePicker_
              style={{ width: '100%' }}
              allowClear={false}
              showTime={false}
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button loading={loading} type="primary" onClick={() => handleTableChange(1, 20)}>
                查询
              </Button>
              <Button
                loading={loading}
                onClick={() => {
                  form.resetFields();
                  handleTableChange(1, 20);
                }}
              >
                重置
              </Button>
              <Button loading={exportLoading} icon={<ExportOutlined />} onClick={() => onExport()}>
                导出
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setIsModalOpen(true);
                  setLevel('2');
                  setBasicTitle('服务报告及时率基础数据');
                }}
              >
                及时率基础数据
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setIsModalOpen(true);
                  setLevel('3');
                  setBasicTitle('服务报告合格率基础数据');
                }}
              >
                合格率基础数据
              </Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
      <SdlTable
        loading={loading}
        dataSource={dataSource}
        columns={getColumns()}
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

      {isModalOpen && (
        <BasicData
          type='2'
          level={level}
          isModalOpen={isModalOpen}
          title={basicTitle}
          defaultTime={form.getFieldValue('time')}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(UserStatistics);
