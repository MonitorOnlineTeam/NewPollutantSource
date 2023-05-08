/*
 * @Author: JiaQi
 * @Date: 2023-04-26 11:30:13
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-08 17:00:01
 * @Description：应收账款催收
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tooltip, Popconfirm, Divider, Tag } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DelIcon, EditIcon } from '@/utils/icon';
import { getCurrentUserId } from '@/utils/utils';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
  queryLoading: loading.effects['wordSupervision/GetAccountsReceivableList'],
});

const ZKCS = props => {
  const [form] = Form.useForm();
  const { flag, type, queryLoading, exportLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [currentEditData, setCurrentEditData] = useState({});
  const [taskInfo, setTaskInfo] = useState({});
  // 获取当前登录人id
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    onFinish();
  }, [type]);

  // 获取请求参数
  const getParams = values => {
    const beginTime = moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(values.date[1]).format('YYYY-MM-DD HH:mm:ss');

    return {
      beginTime: beginTime,
      endTime: endTime,
      flag: flag === 'oneself' ? true : false,
      type: type,
    };
  };

  // 查询数据
  const onFinish = async () => {
    const values = await form.validateFields();
    const body = getParams(values);

    props.dispatch({
      type: 'wordSupervision/GetAccountsReceivableList',
      payload: body,
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // 导出
  const onExport = async () => {
    const values = await form.validateFields();
    const body = getParams(values);
    props.dispatch({
      type: 'wordSupervision/exportTaskRecord',
      payload: {
        ...body,
        apiName: 'ExportAccountsReceivableList',
      },
    });
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteAccountsReceivable',
      payload: { ID },
      callback: res => {
        onFinish();
      },
    });
  };

  //
  const onEdit = record => {
    setCurrentEditData(record);
    setTaskInfo({
      // TaskType: type ? 4 : 3,
      TaskType: 10,
      ID: record.DailyTaskID,
    });
    props.dispatch({
      type: 'wordSupervision/updateState',
      payload: {
        formsModalVisible: true,
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
        title: '项目编号',
        dataIndex: 'ProjectCode',
        key: 'ProjectCode',
      },
      {
        title: '项目名称',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
      },
      {
        title: '行业',
        dataIndex: 'PollutantTypeName',
        key: 'PollutantTypeName',
      },
      {
        title: '最终用户名称',
        dataIndex: 'FinalllserName',
        key: 'FinalllserName',
        render: text => {
          return text || '-';
        },
      },
      {
        title: '项目接洽人',
        children: [
          {
            title: '姓名',
            dataIndex: 'UserName',
            key: 'UserName',
            align: 'center',
            width: 120,
          },
          {
            title: '职务',
            dataIndex: 'UserPost',
            width: 120,
            align: 'center',
            key: 'UserPost',
          },
          {
            title: '联系电话',
            dataIndex: 'UserPhone',
            width: 120,
            align: 'center',
            key: 'UserPhone',
          },
        ],
      },
      {
        title: '欠款金额',
        dataIndex: 'AmountInArear',
        key: 'AmountInArear',
        sorter: (a, b) => a.AmountInArear - b.AmountInArear,
      },
      {
        title: '催收完成金额',
        dataIndex: 'CompletionAmount',
        key: 'CompletionAmount',
        sorter: (a, b) => a.CompletionAmount - b.CompletionAmount,
      },
    ];

    if (flag === 'oneself') {
      columns.push({
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record) => {
          // 本人并时间在30天内可删除
          let diffDay = moment().diff(moment(record.WorkTime), 'days');
          if (diffDay < 30 && record.UserId === currentUserId) {
            return (
              <>
                <Tooltip title="删除">
                  <Popconfirm
                    placement="left"
                    title="确认是否删除?"
                    onConfirm={() => {
                      onDelete(record.ID);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <a>
                      <DelIcon />
                    </a>
                  </Popconfirm>
                </Tooltip>
              </>
            );
          }
          return '-';
        },
      });
    }

    return columns;
  };

  return (
    <Card title="应收账款催收" style={{ marginTop: -24 }}>
      <Form
        name="basic"
        form={form}
        layout="inline"
        style={{ padding: '10px 0 20px' }}
        initialValues={{
          date: [moment().startOf('month'), moment()],
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
