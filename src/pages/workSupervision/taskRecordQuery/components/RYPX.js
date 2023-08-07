/*
 * @Author: JiaQi
 * @Date: 2023-04-20 15:11:41
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-11 11:06:51
 * @Description: 人员培训任务单记录
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
import AttachmentView from '@/components/AttachmentView';
import ImageLightboxView from '@/components/ImageLightboxView';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  queryLoading: loading.effects['wordSupervision/GetPersonTrainList'],
  exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
});

const RYPX = props => {
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
  }, [type, flag]);

  // 查询数据
  const onFinish = async () => {
    const values = await form.validateFields();
    const beginTime = moment(values.date)
      .startOf('year')
      .format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(values.date)
      .endOf('year')
      .format('YYYY-MM-DD HH:mm:ss');

    props.dispatch({
      type: 'wordSupervision/GetPersonTrainList',
      payload: {
        beginTime: beginTime,
        endTime: endTime,
        flag: flag === 'oneself' ? true : false,
        type: type,
      },
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeletePersonTrain',
      payload: { ID },
      callback: res => {
        onFinish();
      },
    });
  };

  // 导出
  const onExport = () => {
    const values = form.validateFields();
    const beginTime = moment(values.date)
      .startOf('year')
      .format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(values.date)
      .endOf('year')
      .format('YYYY-MM-DD HH:mm:ss');

    props.dispatch({
      type: 'wordSupervision/exportTaskRecord',
      payload: {
        beginTime: beginTime,
        endTime: endTime,
        flag: flag === 'oneself' ? true : false,
        type: type,
        apiName: 'ExportPersonTrainList',
      },
    });
  };

  //
  const onEdit = record => {
    setCurrentEditData(record);
    setTaskInfo({
      // TaskType: type ? 4 : 3,
      TaskType: 6,
      ID: record.DailyTaskID,
    });
    setFormsModalVisible(true);
  };

  // 获取列头
  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        // dataIndex: 'index',
        // key: 'index',
        // render: (text, record, index) => {
        //   return index + 1;
        // },
      },
      {
        title: !type ? '省区' : '大区',
        dataIndex: 'RegionName',
        key: 'RegionName',
      },
      {
        title: '培训组织者',
        dataIndex: 'User_Name',
        key: 'User_Name',
      },
      {
        title: '培训日期',
        dataIndex: 'TrainTime',
        key: 'TrainTime',
        sorter: (a, b) => moment(a.TrainTime).valueOf() - moment(b.TrainTime).valueOf(),
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD');
        },
      },
      {
        title: '人员培训记录附件',
        dataIndex: 'FileName',
        key: 'FileName',
        render: (text, record) => {
          // let fileList = getAttachmentDataSource(text);
          // console.log('fileList', fileList);
          // return <AttachmentView dataSource={fileList} />;

          return <ImageLightboxView images={text.split(',')} />;
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
                      onDelete(record.AttachId);
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
    <Card title="人员培训记录" style={{ marginTop: -24 }}>
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
        onCancel={() => {
          setFormsModalVisible(false);
        }}
        onSubmitCallback={() => {
          // setFormsModalVisible(false);
          onFinish();
        }}
      />
    </Card>
  );
};

export default connect(dvaPropsData)(RYPX);
