/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:54:18
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-12 16:17:09
 * @Description：部门内其他工作事项
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Tag,
  Alert,
  Button,
  Popconfirm,
  Form,
  Select,
  Radio,
  DatePicker,
  Input,
  Divider,
  Space,
} from 'antd';
import styles from './styles.less';
import { taskType } from '../workSupervisionUtils';
import moment from 'moment';
import TaskAlartManual from './TaskAlartManual';

const { TextArea } = Input;

const dvaPropsData = ({ loading, wordSupervision }) => ({
  submitLoading: loading.effects['wordSupervision/InsOrUpdOtherWork'],
});

const Branch_Inside = props => {
  const [form] = Form.useForm();
  const { taskInfo, editData, submitLoading, onCancel, onSubmitCallback } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});

  useEffect(() => {}, []);

  // 提交任务单
  const onFinish = async () => {
    const values = await form.validateFields();
    console.log('values', values);
    let body = {
      ...values,
      WorkTime: moment(values.WorkTime).format('YYYY-MM-DD HH:mm:ss'),
      DailyTaskID: taskInfo.ID,
      ID: editData.ID,
    };
    console.log('body', body);
    // return;
    props.dispatch({
      type: 'wordSupervision/InsOrUpdOtherWork',
      payload: body,
      callback: () => {
        onCancel();
        onSubmitCallback();
      },
    });
  };

  return (
    <>
      <TaskAlartManual taskInfo={taskInfo} onCancel={() => onCancel()} />
      <h2 className={styles.formTitle}>部门内其他工作事项</h2>
      <div className={styles.formContent}>
        <Form
          form={form}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 10 }}
          initialValues={{
            WorkResults: 1,
            ...editData,
            WorkTime: moment(editData.WorkTime),
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="工作时间"
            name="WorkTime"
            rules={[
              {
                required: true,
                message: '请选择工作时间！',
              },
            ]}
          >
            <DatePicker
              disabledDate={current => {
                return current && current > moment().endOf('day');
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="内容项"
            name="Content"
            rules={[
              {
                required: true,
                message: '内容项不能为空！',
              },
            ]}
          >
            <Input placeholder="请输入内容项" />
          </Form.Item>
          <Form.Item
            label="工作结果"
            name="WorkResults"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group>
              <Radio value={1}>完成</Radio>
              <Radio value={0}>未完成</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="内容描述" name="ContentDes">
            <TextArea rows={3} placeholder="请输入内容描述" />
          </Form.Item>
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

export default connect(dvaPropsData)(Branch_Inside);