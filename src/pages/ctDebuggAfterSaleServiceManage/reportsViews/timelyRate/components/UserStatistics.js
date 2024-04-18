import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Typography,
  Input,
  Button,
  Card,
  Space,
  Tooltip,
  Modal,
  Row,
  Col,
  Select,
} from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { FileSearchOutlined } from '@ant-design/icons';
import BasicData from './BasicData';
import styles from '../index.less';

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, timelyRate, autoForm }) => ({
  autoForm: autoForm,
  loading: loading.effects[`timelyRate/GetTimelyRateByUserList`],
  exportLoading: loading.effects['timelyRate/ExportTimelyRateByUserList'],
});

const UserStatistics = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState({});

  const { dispatch, loading, exportLoading, date, autoForm } = props;

  useEffect(() => {
    getUserList();
    GetTimelyRateByUserList();
  }, []);

  // 获取在职人员
  const getUserList = () => {
    dispatch({
      type: 'autoForm/getAutoFormData',
      payload: { configId: 'View_UserOperation', pageIndex: 1, pageSize: 9999999 },
    });
  };

  // 按人员统计
  const GetTimelyRateByUserList = (_pageIndex, _pageSize) => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'timelyRate/GetTimelyRateByUserList',
      payload: {
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
        ...values,
        beginTime: values.time && values.time[0].format('YYYY-MM-DD 00:00:00'),
        endTime: values.time && values.time[1].format('YYYY-MM-DD 23:59:59'),
        time: undefined,
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
      type: 'timelyRate/ExportTimelyRateByUserList',
      payload: {
        pageIndex: 0,
        pageSize: 0,
        ...values,
        beginTime: values.time && values.time[0].format('YYYY-MM-DD 00:00:00'),
        endTime: values.time && values.time[1].format('YYYY-MM-DD 23:59:59'),
        time: undefined,
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
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '工号',
        dataIndex: 'userAccount',
        key: 'userAccount',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '服务响应次数',
        dataIndex: 'allCount',
        key: 'allCount',
        align: 'center',
        ellipsis: true,
        sorter: (a, b) => a.allCount - b.allCount,
      },
      {
        title: '及时响应',
        dataIndex: 'timelyCount',
        key: 'timelyCount',
        align: 'center',
        ellipsis: true,
        sorter: (a, b) => a.timelyCount - b.timelyCount,
      },
      {
        title: '不及时响应',
        dataIndex: 'nottimelyCount',
        key: 'nottimelyCount',
        align: 'center',
        ellipsis: true,
        sorter: (a, b) => a.nottimelyCount - b.nottimelyCount,
      },
      {
        title: '服务响应及时率',
        dataIndex: 'rate',
        key: 'rate',
        align: 'center',
        ellipsis: true,
        sorter: (a, b) => a.rate - b.rate,
        render: (text, record) => {
          return text !== undefined ? text + '%' : text;
        },
      },
      {
        title: <span>操作</span>,
        align: 'center',
        fixed: 'right',
        width: 60,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip title="明细">
              <a
                onClick={() => {
                  setCurrentUserInfo({
                    userName: record.userName,
                    userID: record.userID,
                  });
                  setIsModalOpen(true);
                }}
              >
                <FileSearchOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
          );
        },
      },
    ];
  };

  //分页
  const handleTableChange = (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    GetTimelyRateByUserList(PageIndex, PageSize);
  };
  console.log('autoform', autoForm);

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
          isModalOpen={isModalOpen}
          title={`${currentUserInfo.userName}服务响应基础数据`}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          type="user"
          defaultTime={form.getFieldValue('time')}
          userID={currentUserInfo.userID}
        />
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(UserStatistics);
