/*
 * @Author: JiaQi
 * @Date: 2023-04-19 10:49:21
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-04-24 15:06:46
 * @Description: 回访客户
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tooltip, Popconfirm, Divider } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DelIcon, EditIcon } from '@/utils/icon';
import FromsModal from '@/pages/workSupervision/Forms/FromsModal';
import Cookie from 'js-cookie';
import { getCurrentUserId } from '@/utils/utils';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/GetReturnVisitCustomersList'],
  exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
});

const HFKH = props => {
  const [form] = Form.useForm();
  const { flag, type, queryLoading, exportLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [currentEditData, setCurrentEditData] = useState({});
  const [taskInfo, setTaskInfo] = useState({});
  const [formsModalVisible, setFormsModalVisible] = useState(false);

  // 获取当前登录人id
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    onFinish();
  }, []);

  // 获取请求参数
  const getParams = values => {
    const beginTime = moment(values.date)
      .startOf('month')
      .format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(values.date)
      .endOf('month')
      .format('YYYY-MM-DD HH:mm:ss');

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
      type: 'wordSupervision/GetReturnVisitCustomersList',
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
        apiName: 'ExportReturnVisitCustomersList',
      },
    });
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteReturnVisitCustomers',
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
      TaskType: type ? 4 : 3,
      ID: record.DailyTaskID,
    });
    setFormsModalVisible(true);
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
        title: !type ? '省区' : '大区',
        dataIndex: 'UserGroup_Name',
        key: 'UserGroup_Name',
        // sorter: (a, b) => a.dataConstantRate - b.dataConstantRate,
      },
      {
        title: '省份',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
      },
      {
        title: '客户名称（全称）',
        dataIndex: 'CustomFullName',
        key: 'CustomFullName',
      },
      {
        title: '客户姓名',
        dataIndex: 'CustomName',
        key: 'CustomName',
      },
      {
        title: '部门',
        dataIndex: 'Depart',
        key: 'Depart',
      },
      {
        title: '客户满意度（1-5）',
        children: [
          {
            title: '服务态度',
            dataIndex: 'ServeManner',
            key: 'ServeManner',
            width: 100,
            align: 'center',
          },
          {
            title: '技术水平',
            dataIndex: 'TechnicalLevel',
            key: 'TechnicalLevel',
            width: 100,
            align: 'center',
          },
          {
            title: '服务响应',
            dataIndex: 'ServiceResponse',
            key: 'ServiceResponse',
            width: 100,
            align: 'center',
          },
          {
            title: '问题解决率',
            dataIndex: 'ProblemSolvingEfficiency',
            key: 'ProblemSolvingEfficiency',
            width: 100,
            align: 'center',
          },
        ],
      },
      {
        title: '问题及建议',
        dataIndex: 'ProblemsAndAdvice',
        key: 'ProblemsAndAdvice',
      },
      {
        title: '回访人',
        dataIndex: 'ReturnUserName',
        key: 'ReturnUserName',
      },
      {
        title: '回访日期',
        dataIndex: 'ReturnTime',
        key: 'ReturnTime',
        render: text => {
          return moment(text).format('YYYY-MM-DD');
        },
      },
    ];

    if (flag === 'oneself') {
      columns.push({
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record) => {
          // 本人并状态为进行中才可操作
          if (record.TaskStatus === 1 && record.ReturnUser === currentUserId) {
            return (
              <>
                <Tooltip title="编辑">
                  <a
                    onClick={() => {
                      onEdit(record);
                    }}
                  >
                    <EditIcon />
                  </a>
                </Tooltip>
                <Divider type="vertical" />
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
    <Card title="回访客户记录" style={{ marginTop: -24 }}>
      <Form
        name="basic"
        form={form}
        layout="inline"
        style={{ padding: '10px 0 20px' }}
        initialValues={{
          date: moment(),
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="时间" name="date">
          <DatePicker picker="month" allowClear={false} />
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
        visible={formsModalVisible}
        taskInfo={taskInfo}
        editData={currentEditData}
        onCancel={() => {
          setFormsModalVisible(false);
        }}
        onSubmitCallback={() => {
          onFinish();
        }}
      />
    </Card>
  );
};

export default connect(dvaPropsData)(HFKH);
