/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:54:18
 * @Last Modified by:   JiaQi
 * @Last Modified time: 2023-04-23 09:54:18
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
import { taskType } from '../CONST';
import moment from 'moment';

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
      DailyTaskID: taskInfo.ID,
      ID: editData.ID,
    };
    console.log('body', body);
    // return;
    props.dispatch({
      type: 'wordSupervision/InsOrUpdOtherWork',
      payload: body,
      callback: () => {
        onSubmitCallback();
      },
    });
  };

  return (
    <>
      {taskInfo.CreateTime && (
        <Alert
          message={
            <>
              {`任务类型：${taskType[taskInfo.TaskType]}，`}此任务为
              <Tag color="processing">手动创建</Tag>，可手动撤销！。
              <Popconfirm
                title="撤销后次任务单将作废，是否确认撤销?"
                // onConfirm={confirm}
                okText="是"
                cancelText="否"
              >
                <Button type="primary" danger size="small">
                  撤销
                </Button>
              </Popconfirm>
            </>
          }
          type="info"
          showIcon
          style={{ marginRight: 30 }}
        />
      )}
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
            <DatePicker style={{ width: '100%' }} />
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
