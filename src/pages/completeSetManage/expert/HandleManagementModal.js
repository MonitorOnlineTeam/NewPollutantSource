/*
 * @Author: JiaQi 
 * @Date: 2023-05-23 17:00:01 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-23 17:04:40
 * @Description: 添加、编辑专家弹窗
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Input, Select, Space } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import { checkRules } from '@/utils/validator';

const dvaPropsData = ({ loading, completeSetManage }) => ({
  regionalList: completeSetManage.regionalList,
  submitLoading: loading.effects['completeSetManage/InsOrUpdExpert'],
});

const HandleManagementModal = props => {
  const [form] = Form.useForm();
  const {
    regionalList,
    visible,
    onCancel,
    dispatch,
    reloadDataList,
    editData,
    submitLoading,
  } = props;
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {}, []);

  //
  const onSubmit = () => {
    form.validateFields().then(values => {
      dispatch({
        type: 'completeSetManage/InsOrUpdExpert',
        payload: {
          ID: editData.ID,
          ...values,
        },
        callback: () => {
          reloadDataList();
        },
      });
    });
  };

  return (
    <Modal
      // width={800}
      title="添加专家信息"
      destroyOnClose={true}
      visible={visible}
      onCancel={() => onCancel()}
      onOk={() => {
        onSubmit();
      }}
      confirmLoading={submitLoading}
    >
      <Form
        name="basic"
        form={form}
        // layout="inline"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 13,
        }}
        // style={{ padding: '10px 0 20px' }}
        initialValues={editData}
        // onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="大区"
          name="UserGroup_ID"
          rules={[
            {
              required: true,
              message: '请选择大区!',
            },
          ]}
        >
          <Select placeholder="请选择大区">
            {regionalList.map(item => {
              return (
                <Option key={item.UserGroup_ID} value={item.UserGroup_ID}>
                  {item.UserGroup_Name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="设备型号"
          name="Model"
          rules={[
            {
              required: true,
              message: '请输入设备型号!',
            },
          ]}
        >
          <Input placeholder="请输入设备型号" />
        </Form.Item>
        <Form.Item
          label="专家姓名"
          name="ExpertName"
          rules={[
            {
              required: true,
              message: '请输入专家姓名!',
            },
          ]}
        >
          <Input placeholder="请输入专家姓名" />
        </Form.Item>
        <Form.Item
          label="联系方式"
          name="Phone"
          rules={[
            {
              required: true,
              message: '请输入联系方式!',
            },
            checkRules['mobile'],
          ]}
        >
          <Input placeholder="请输入联系方式" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(dvaPropsData)(HandleManagementModal);
