/*
 * @Author: JiaQi
 * @Date: 2023-04-19 16:22:59
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-12 16:15:24
 * @Description: 人员培训记录表
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Alert, Form, Button, DatePicker, Divider, Space, Row, Col, Upload, message } from 'antd';
import styles from './styles.less';
import { taskType } from '../workSupervisionUtils';
import { InboxOutlined } from '@ant-design/icons';
import Cookie from 'js-cookie';
import moment from 'moment';

const { Dragger } = Upload;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  todoList: wordSupervision.todoList,
  messageList: wordSupervision.messageList,
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const Training = props => {
  const [form] = Form.useForm();
  const { taskInfo, submitLoading, onCancel, editData, onSubmitCallback } = props;
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // 处理附件列表
    if (editData.FileName) {
      let _fileList = editData.FileName.split(',').map((item, index) => {
        let fileName = item.split('/').slice(-1);
        return {
          uid: index,
          name: fileName.toString(),
          status: 'done',
          url: item,
        };
      });

      setFileList(_fileList);
    }
  }, []);

  //
  const onFinish = async () => {
    const values = await form.validateFields();
    console.log('values', values);
    if (!fileList.length) {
      message.error('请上传培训记录截图后提交！');
      return;
    }

    let FileNames = fileList.map(item => {
      return item.url;
    });
    props.dispatch({
      type: 'wordSupervision/InsOrUpdPersonTrain',
      payload: {
        AttachId: editData.AttachId,
        FileName: FileNames.toString(),
        DailyTaskID: taskInfo.ID,
        TrainTime: moment(values.TrainTime).format('YYYY-MM-DD 00:00:00'),
      },
      callback: () => {
        onCancel();
        onSubmitCallback();
      },
    });
  };

  const uploadProps = {
    name: 'file',
    accept: '.png,.jpg,.gif,.jpeg',
    multiple: true,
    action: '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/UploadPersonTrainFiles',
    headers: {
      Authorization: 'Bearer ' + Cookie.get('newToken'),
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        let fileList_temp = [...info.fileList];
        fileList_temp.map(item => {
          if (item.response) {
            item.url = '/' + item.response.Datas;
          }
        });
        setFileList(fileList_temp);
      }
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功！.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败！`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  return (
    <>
      {taskInfo.CreateTime && (
        <Alert
          message={`任务类型：${taskType[taskInfo.TaskType]}，${taskInfo.CreateTime} 开始，于${
            taskInfo.EndTime
          } 结束，每个工单最少有（${taskInfo.standNum}次/月）记录。`}
          type="info"
          showIcon
          style={{ marginRight: 30 }}
        />
      )}
      <h2 className={styles.formTitle}>人员培训记录表</h2>
      <div className={styles.formContent}>
        <Form
          form={form}
          // labelCol={{ span: 6 }}
          // wrapperCol={{ span: 14 }}
          initialValues={{
            ...editData,
            TrainTime: moment(editData.TrainTime),
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <Form.Item
                label="培训日期"
                name="TrainTime"
                rules={[
                  {
                    required: true,
                    message: '请选择培训日期！',
                  },
                ]}
              >
                <DatePicker
                  disabledDate={current => {
                    return current && current > moment().endOf('day');
                  }}
                  style={{ width: '200px' }}
                />
              </Form.Item>
            </Col>
            <Col span={24} className={styles.uploadWrapper}>
              <Dragger {...uploadProps} fileList={fileList}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                <p className="ant-upload-hint">上传CIS培训记录表截图即可，支持单个或批量上传。</p>
              </Dragger>
            </Col>
          </Row>
          <Divider orientation="right" style={{ color: '#d9d9d9' }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                提交
              </Button>
              <Button onClick={onCancel}>取消</Button>
            </Space>
          </Divider>
        </Form>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(Training);
