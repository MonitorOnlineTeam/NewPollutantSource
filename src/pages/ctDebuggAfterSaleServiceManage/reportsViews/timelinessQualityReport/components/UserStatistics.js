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
import Input from 'antd/lib/input/Input';

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

  const { dispatch, loading, exportLoading, date, autoForm,modalWrapClassName } = props;

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
  const [queryData, setQueryData] = useState({})
  const typeClick = (type, data) => {
    setIsModalOpen(true);
    setLevel(type);
    setBasicTitle(type === '2' ? '服务报告及时率基础数据' : '服务报告合格率基础数据');
    const values = form.getFieldsValue();
    setQueryData({...data, time: values.time})
  }
  const TypeRenderComponents = ({ type, data }) => {
    return <a onClick={() => typeClick(type, data)}>{data?.text || data?.text == 0 ? data.text + '%' : ''}</a>
  }
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
        width:'auto',
      },
      {
        title: '工号',
        dataIndex: 'User_Account',
        key: 'User_Account',
        align: 'center',
        ellipsis: true,
        width:'auto',
      },
      {
        title: '报告及时率',
        dataIndex: 'ReportTimelyRate',
        key: 'ReportTimelyRate',
        align: 'center',
        ellipsis: true,
        width:'auto',
        sorter: (a, b) => a.ReportTimelyRate - b.ReportTimelyRate,
        render: (text, record) => {
          return <TypeRenderComponents type='2' data={{ workerID: record.WorkerID,  text: text,}} />
        }
      },
      {
        title: '报告合格率',
        dataIndex: 'ReportTimelyQualifiedRate',
        key: 'ReportTimelyQualifiedRate',
        align: 'center',
        ellipsis: true,
        width:'auto',
        sorter: (a, b) => a.ReportTimelyQualifiedRate - b.ReportTimelyQualifiedRate,
        render: (text, record) => {
          return <TypeRenderComponents type='3' data={{ workerID: record.WorkerID,  text: text,}} />
        }
      },
      {
        title: '报告及时合格率',
        dataIndex: 'ReportTimelyQualifiedRate',
        key: 'ReportTimelyQualifiedRate',
        align: 'center',
        ellipsis: true,
        width:'auto',
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
    <Card bodyStyle={{ padding: '12px 24px 16px 24px' }}>
      <Form
        id="searchForm"
        form={form}
        initialValues={{
          time: [moment().startOf('month'), moment()],
        }}
        autoComplete="off"
        style={{ marginTop: 6, marginBottom: 6 }}
        // labelCol={{
        //   flex: '120px',
        // }}
        // wrapperCol={{
        //   flex: 1,
        // }}
      >
        <Space align="middle">
          <Form.Item name="userID" label="姓名">
            <Input placeholder='请输入' allowClear/>
            {/* <Select
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
            </Select> */}
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
              {/* <Button
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
              </Button> */}
            </Space>
          </Form.Item>
        </Space>
      </Form>
      <SdlTable
        loading={loading}
        dataSource={dataSource}
        columns={getColumns()}
        scroll={{
          x:710,
          y: `calc(100vh - ${modalWrapClassName? 272: 335}px)`,
        }}
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
          wrapClassName={modalWrapClassName}
          type='2'
          level={level}
          isModalOpen={isModalOpen}
          title={basicTitle}
          defaultTime={form.getFieldValue('time')}
          queryData={queryData}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(UserStatistics);
