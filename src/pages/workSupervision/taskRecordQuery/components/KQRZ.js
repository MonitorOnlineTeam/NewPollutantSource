/*
 * @Author: JiaQi
 * @Date: 2023-04-24 14:57:09
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-08 16:59:41
 * @Description: 检查考勤和日志
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Button, Space, Tooltip, Popconfirm, Divider } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon';
import FromsModal from '@/pages/workSupervision/Forms/FromsModal';
import { getCurrentUserId } from '@/utils/utils';
import AttachmentView from '@/components/AttachmentView';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // formsModalVisible: wordSupervision.formsModalVisible,
  queryLoading: loading.effects['wordSupervision/GetCheckAttendanceRecordList'],
  exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
});

const KQRZ = props => {
  const [form] = Form.useForm();
  const { flag, type, queryLoading, exportLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [currentEditData, setCurrentEditData] = useState({});
  const [taskInfo, setTaskInfo] = useState({});
  const [formsModalVisible, setFormsModalVisible] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  // 获取当前登录人id
  const currentUserId = getCurrentUserId();
  useEffect(() => {
    onFinish();
  }, [type]);

  // 获取请求参数
  const getParams = values => {
    const beginTime = moment(values.date)
      .startOf('year')
      .format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(values.date)
      .endOf('year')
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
      type: 'wordSupervision/GetCheckAttendanceRecordList',
      payload: body,
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteCheckAttendanceRecord',
      payload: { ID },
      callback: res => {
        onFinish();
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
        apiName: 'ExportCheckAttendanceRecordList',
      },
    });
  };

  //
  const onEdit = record => {
    // 根据记录ID获取详细数据
    props.dispatch({
      type: 'wordSupervision/GetCheckAttendanceLogList',
      payload: {
        ID: record.ID,
        RegionName: record.RegionName,
      },
      callback: res => {
        debugger;
        setCurrentEditData({
          ...record,
          dataSource: res,
        });
        setTaskInfo({
          TaskType: 7,
          ID: record.DailyTaskID,
          RegionName: record.RegionName,
          RegionCode: record.RegionCode,
        });
        setFormsModalVisible(true);
        // props.dispatch({
        //   type: 'wordSupervision/updateState',
        //   payload: {
        //     formsModalVisible: true,
        //   },
        // });
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
        title: !type ? '省区' : '大区',
        dataIndex: 'RegionName',
        key: 'RegionName',
      },
      {
        title: '填表人',
        dataIndex: 'User_Name',
        key: 'User_Name',
      },
      {
        title: '填表日期',
        dataIndex: 'RecordTime',
        key: 'RecordTime',
        sorter: (a, b) => a.RecordTime - b.RecordTime,
        render: (text, record) => {
          console.log('text', text);
          return moment(text).format('YYYY-MM-DD');
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record) => {
          return (
            <>
              {record.TaskStatus === 1 && record.UserID === currentUserId && flag === 'oneself' && (
                <>
                  <Tooltip title="编辑">
                    <a
                      onClick={() => {
                        setIsDetail(false);
                        onEdit(record);
                      }}
                    >
                      <EditIcon />
                    </a>
                  </Tooltip>
                  <Divider type="vertical" />
                </>
              )}
              <Tooltip title="详情">
                <a
                  onClick={() => {
                    setIsDetail(true);
                    onEdit(record);
                  }}
                >
                  <DetailIcon />
                </a>
              </Tooltip>
              {record.TaskStatus === 1 && record.UserID === currentUserId && flag === 'oneself' && (
                <>
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
              )}
            </>
          );
        },
      },
    ];

    return columns;
  };

  // 获取附件列表数据
  const getAttachmentDataSource = value => {
    const fileInfo = value ? value.split(',') : [];
    return fileInfo.map(item => {
      const itemList = item.split('/');
      return {
        name: itemList.slice(-1),
        attach: item,
      };
    });
  };

  return (
    <Card title="检查考勤和日志记录" style={{ marginTop: -24 }}>
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
          <DatePicker picker="year" allowClear={false} />
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
        isDetail={isDetail}
        onCancel={() => {
          setFormsModalVisible(false);
        }}
        onSubmitCallback={() => {
          // setFormsModalVisible(false);
          setCurrentEditData({});
          onFinish();
        }}
      />
    </Card>
  );
};

export default connect(dvaPropsData)(KQRZ);
