/*
 * @Author: JiaQi
 * @Date: 2023-04-19 10:49:21
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-04-24 15:09:44
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
  queryLoading: loading.effects['wordSupervision/GetOfficeCheckList'],
  exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
});

const OfficeCheck = props => {
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
      type: 'wordSupervision/GetOfficeCheckList',
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
        apiName: 'ExportOfficeCheckList',
      },
    });
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteOfficeCheck',
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
      TaskType: 5,
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
        width: 80,
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '大区',
        dataIndex: 'UserGroup_Name',
        key: 'UserGroup_Name',
        width: 140,
        // sorter: (a, b) => a.dataConstantRate - b.dataConstantRate,
      },
      {
        title: '省份',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        width: 140,
      },
      {
        title: '办事处',
        dataIndex: 'OfficeName',
        key: 'OfficeName',
        width: 200,
      },
      {
        title: '办事处设施',
        children: [
          {
            title: '企业文化是否上墙',
            dataIndex: 'BusinessCulture',
            key: 'BusinessCulture',
            width: 150,
            align: 'center',
            render: text => {
              return text === '0' ? '否' : '是';
            },
          },
          {
            title: '办事处整洁度（1-5分）',
            dataIndex: 'OfficeNeatness',
            key: 'OfficeNeatness',
            width: 160,
            align: 'center',
          },
        ],
      },
      {
        title: '库房',
        children: [
          {
            title: '是否上锁',
            dataIndex: 'IsLock',
            key: 'IsLock',
            width: 100,
            align: 'center',
            render: text => {
              return text === '0' ? '否' : '是';
            },
          },
          {
            title: '库房整洁度（1-5分）',
            dataIndex: 'StorehouseNeatness',
            key: 'StorehouseNeatness',
            width: 160,
            align: 'center',
          },
          {
            title: '出入台账规范（1-5分）',
            dataIndex: 'AccountSpecification',
            key: 'AccountSpecification',
            width: 160,
            align: 'center',
          },
          {
            title: '呆滞物料情况（1-5分）',
            dataIndex: 'SluggishMaterials',
            key: 'SluggishMaterials',
            width: 160,
            align: 'center',
          },
        ],
      },
      {
        title: '车辆',
        children: [
          {
            title: '车牌号',
            dataIndex: 'PlateNumber',
            key: 'PlateNumber',
            width: 150,
            align: 'center',
          },
          {
            title: '整洁度（含后备箱 1-5分）',
            dataIndex: 'CarNeatness',
            key: 'CarNeatness',
            width: 180,
            align: 'center',
          },
          {
            title: '云上管车使用记录（1-5分）',
            dataIndex: 'CarUseRecord',
            key: 'CarUseRecord',
            width: 200,
            align: 'center',
          },
        ],
      },
      {
        title: '备注',
        dataIndex: 'Remark',
        key: 'Remark',
        width: 200,
      },
    ];

    if (flag === 'oneself') {
      columns.push({
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record) => {
          // 本人并状态为进行中才可操作
          if (record.TaskStatus === 1 && record.UserId === currentUserId) {
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
    <Card title="办事处检查记录" style={{ marginTop: -24 }}>
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

export default connect(dvaPropsData)(OfficeCheck);
