/*
 * @Author: JiaQi
 * @Date: 2023-04-19 16:22:59
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-11 09:07:16
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
import config from '@/config';
import LargeRegionSelect from '@/pages/workSupervision/dailyManagement/components/LargeRegionSelect';
import cuid from 'cuid';
import { API } from '@config/API';

const { Dragger } = Upload;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  TYPE: wordSupervision.TYPE, // 1：成套 “”：运维
  todoList: wordSupervision.todoList,
  messageList: wordSupervision.messageList,
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const Training = props => {
  const [form] = Form.useForm();
  const { dispatch, taskInfo, submitLoading, onCancel, editData, onSubmitCallback, TYPE } = props;
  const [fileList, setFileList] = useState([]);
  const [uploadId, setUploadId] = useState(cuid());

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

    props.dispatch({
      type: 'wordSupervision/InsOrUpdPersonTrain',
      payload: {
        AttachId: editData.ID,
        FileName: uploadId,
        DailyTaskID: taskInfo.ID,
        TrainTime: moment(values.TrainTime).format('YYYY-MM-DD 00:00:00'),
        largeRegionCode: values.regionCode,
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
    action: API.UploadApi.UploadFiles,
    headers: {
      Authorization: 'Bearer ' + Cookie.get(config.cookieName),
    },
    // onChange(info) {
    //   console.log('info', info);
    //   const { status } = info.file;
    //   if (status !== 'uploading') {
    //     let fileList_temp = [...info.fileList];
    //     fileList_temp.map(item => {
    //       if (item.response) {
    //         item.url = '/' + item.response.Datas;
    //       }
    //     });
    //     setFileList(fileList_temp);
    //   }
    //   if (status === 'done') {
    //     message.success(`${info.file.name} 上传成功！.`);
    //   } else if (status === 'error') {
    //     message.error(`${info.file.name} 上传失败！`);
    //   }
    // },
    data: {
      FileUuid: uploadId,
      FileActualType: '0',
    },
    onChange(info) {
      const fileArr = [];
      info.fileList.forEach(file => {
        const { status, uid, name, response, url, percent } = file;

        if (status === 'done') {
          fileArr.push({
            uid,
            name,
            status,
            url: response?.Datas || url,
          });
        } else if (status === 'uploading') {
          fileArr.push({
            uid,
            name,
            status,
            percent,
          });
        }
      });
      setFileList(fileArr);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    onRemove(file) {
      console.log('file', file);
      if (!file.error) {
        dispatch({
          type: 'autoForm/deleteAttach',
          payload: {
            // FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
            Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
          },
        });
      }
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
            <Space size={30}>
              <Col>
                <LargeRegionSelect type={TYPE == 1 ? 'ct' : undefined} required />
              </Col>
              <Col>
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
            </Space>
            <Col span={24} className={styles.uploadWrapper}>
              <Dragger {...uploadProps}>
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
