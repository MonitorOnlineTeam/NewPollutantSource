/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:38:17
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-08 16:59:30
 * @Description：部门内其他工作事项
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tooltip, Popconfirm, Divider, Tag } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DelIcon, EditIcon } from '@/utils/icon';
import FromsModal from '@/pages/workSupervision/Forms/FromsModal';
import { getCurrentUserId } from '@/utils/utils';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/GetOtherWorkList'],
  exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
});

const BranchInside = props => {
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
      WorkType: 9,
    };
  };

  // 查询数据
  const onFinish = async () => {
    const values = await form.validateFields();
    const body = getParams(values);

    props.dispatch({
      type: 'wordSupervision/GetOtherWorkList',
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
        apiName: 'ExportOtherWorkList',
      },
    });
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteOtherWork',
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
      TaskType: 9,
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
        title: '经理姓名',
        dataIndex: 'User_Name',
        key: 'User_Name',
      },
      {
        title: '现场工作时间',
        dataIndex: 'WorkTime',
        key: 'WorkTime',
        sorter: (a, b) => a.WorkTime - b.WorkTime,
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD');
        },
      },
      {
        title: '内容项',
        dataIndex: 'Content',
        key: 'Content',
      },
      {
        title: '工作结果',
        dataIndex: 'WorkResults',
        key: 'WorkResults',
        render: (text, record) => {
          if (text === 1) {
            return <Tag color="success">完成</Tag>;
          } else {
            return <Tag color="error">未完成</Tag>;
          }
        },
      },
      {
        title: '内容描述',
        dataIndex: 'ContentDes',
        key: 'ContentDes',
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
    <Card title="部门内其他工作事项" style={{ marginTop: -24 }}>
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

      <FromsModal
        taskInfo={taskInfo}
        editData={currentEditData}
        onSubmitCallback={() => {
          onFinish();
        }}
      />
    </Card>
  );
};

export default connect(dvaPropsData)(BranchInside);
