/*
 * @Author: JiaQi
 * @Date: 2023-04-19 16:22:59
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-15 19:38:51
 * @Description: 人员培训记录表
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Alert,
  Form,
  Button,
  DatePicker,
  Divider,
  Space,
  Row,
  Col,
  Upload,
  message,
  Typography,
} from 'antd';
import styles from './styles.less';
import { taskType } from '../workSupervisionUtils';
import { InboxOutlined } from '@ant-design/icons';
import Cookie from 'js-cookie';
import moment from 'moment';
import config from '@/config';
import cuid from 'cuid';
import { API } from '@config/API';

const { Dragger } = Upload;
const { Text, Link } = Typography;

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
    if (editData.FilesList) {
      let _fileList = editData.FilesList?.ImgList.map((item, index) => {
        return {
          uid: editData.FilesList?.ImgNameList[index],
          name: editData.FilesList?.NameList[index],
          status: 'done',
          url: `/${item}`,
        };
      });
      setUploadId(editData.FilesList.AttachID);
      setFileList(_fileList);
    }
  }, []);

  //
  const onFinish = async () => {
    const values = await form.validateFields();
    if (!fileList.length) {
      message.error('请上传培训记录截图后提交！');
      return;
    }

    props.dispatch({
      type: 'wordSupervision/InsOrUpdPersonTrain',
      payload: {
        AttachId: editData.AttachId,
        FileName: uploadId,
        DailyTaskID: taskInfo.ID || editData.DailyTaskID,
        TrainTime: moment(values.TrainTime).format('YYYY-MM-DD 00:00:00'),
      },
      callback: () => {
        onCancel();
        onSubmitCallback();
      },
    });
  };

  const uploadFileListProps = {};
  if (editData && editData.FilesList) {
    uploadFileListProps.fileList = fileList;
  }
  const uploadProps = {
    name: 'file',
    accept: '.png,.jpg,.gif,.jpeg',
    multiple: true,
    action: API.UploadApi.UploadFiles,
    headers: {
      Authorization: 'Bearer ' + Cookie.get(config.cookieName),
    },
    ...uploadFileListProps,
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
            uid: response?.Datas?.fNameList[0]
              ? response?.Datas?.fNameList[0].split('/').pop()
              : uid,
            name,
            status,
            url: '/' + response?.Datas?.fNameList[0] || url,
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
  console.log('editData', editData);
  return (
    <>
      {taskInfo.CreateTime && (
        <Alert
          message={`任务类型：人员培训记录，派发时间：${taskInfo.CreateTime} ，有效期：${taskInfo.EndTime} ，任务单派发频次1次/月。`}
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
            regionCode: editData.RegionCode,
            TrainTime: moment(editData.TrainTime),
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row style={{ width: '100%' }}>
            <Space size={30}>
              <Col>
                {TYPE == 1 ? (
                  <Form.Item label="大区" name="LargeRegion">
                    <Text>{taskInfo.LargeName || editData.LargeRegion}</Text>
                  </Form.Item>
                ) : (
                  <Form.Item label="省份" name="RegionName">
                    <Text>{taskInfo.RegionName || editData.RegionName}</Text>
                  </Form.Item>
                )}
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
