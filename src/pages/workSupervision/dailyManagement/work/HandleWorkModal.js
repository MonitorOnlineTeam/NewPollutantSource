/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:54:18
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-23 16:21:11
 * @Description：部门内其他工作事项
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Select,
  Form,
  Modal,
  Radio,
  DatePicker,
  Input,
} from 'antd';
import moment from 'moment';

const { TextArea } = Input;

const contentList = [
  { name: '技术问题', value: '1' },
  { name: '配合检查', value: '2' },
  { name: '其他工作', value: '3' },
];

const dvaPropsData = ({ loading, wordSupervision }) => ({
  submitLoading: loading.effects['wordSupervision/InsOrUpdOtherWork'],
});

const HandleWorkModal = props => {
  const [form] = Form.useForm();
  const { editData, onCancel, onSubmitCallback, open, WorkType, CTOperation } = props;

  useEffect(() => {
    form.setFieldsValue({
      ...editData,
      WorkTime: editData.WorkTime ? moment(editData.WorkTime) : undefined,
    });
  }, [editData]);

  // 提交任务单
  const onFinish = async () => {
    const values = await form.validateFields();
    let body = {
      ...values,
      WorkTime: moment(values.WorkTime).format('YYYY-MM-DD HH:mm:ss'),
      WorkType: WorkType,
      ID: editData.ID,
      ctOperation: CTOperation,
      UserId: editData.UserId,
    };
    // return;
    props.dispatch({
      type: 'wordSupervision/InsOrUpdOtherWork',
      payload: body,
      callback: () => {
        onCancel();
        onSubmitCallback();
        form.resetFields();
      },
    });
  };
  return (
    <>
      <Modal
        title={editData.ID ? '编辑' : '添加'}
        // wrapClassName={`spreadOverModal`}
        width={800}
        open={open}
        destroyOnClose
        onOk={() => {
          onFinish();
        }}
        onCancel={() => {
          form.resetFields();
          onCancel();
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          initialValues={{}}
          // onFinish={onFinish}
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
            {WorkType == '1' ? (
              <Select placeholder="请选择内容项" style={{ width: '100%' }}>
                {contentList.map(item => {
                  return (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            ) : (
              <Input placeholder="请输入内容项" allowClear />
            )}
          </Form.Item>
          <Form.Item
            label="工作结果"
            name="WorkResults"
            rules={[
              {
                required: true,
                message: '请选择工作结果！',
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
        </Form>
      </Modal>
    </>
  );
};

export default connect(dvaPropsData)(HandleWorkModal);
