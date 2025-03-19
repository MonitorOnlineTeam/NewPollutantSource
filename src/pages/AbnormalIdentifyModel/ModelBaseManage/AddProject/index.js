import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Divider, Space, Modal } from 'antd';
import SdlMap from '@/pages/AutoFormManager/SdlMap.js';
import RegionList from '@/components/RegionList';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { CheckCircleOutlined } from '@ant-design/icons';

const FormItemStyle = {
  marginBottom: 26,
};

const dvaPropsData = ({ loading, wordSupervision }) => ({
  todoList: wordSupervision.todoList,
  messageList: wordSupervision.messageList,
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
});

const AddProject = props => {
  const [form] = Form.useForm();
  const { dispatch } = props;

  const [currentTodoItem, setCurrentTodoItem] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {};

  const onFinish = values => {
    dispatch({
      type: 'ModelBaseManage/AddMXProject',
      payload: {
        ...values,
        RegionCode: values.RegionCode.toString(),
      },
      callback: res => {
        Modal.confirm({
          // title: 'Confirm',
          icon: <CheckCircleOutlined />,
          content: '创建成功，请退出重新登录！',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            logout();
          },
          onCancel() {
            form.resetFields();
          }
        });
      },
    });
  };

  // 退出登录
  const logout = () => {
    dispatch({
      type: 'login/logout',
    });
  };

  return (
    <BreadcrumbWrapper>
      <Card
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 80 }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            width: 600,
          }}
          initialValues={{}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="项目名称"
            name="ProjectName"
            rules={[{ required: true, message: '请输入项目名称' }]}
            style={FormItemStyle}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item
            label="企业默认行政区划"
            name="RegionCode"
            rules={[{ required: true, message: '请选择企业默认行政区划' }]}
            style={FormItemStyle}
          >
            <RegionList  />
          </Form.Item>
          <Form.Item
            label="经度"
            name="Longitude"
            rules={[{ required: true, message: '请选择经度' }]}
            style={FormItemStyle}
          >
            <SdlMap
              onOk={map => {
                form.setFieldsValue({ Longitude: map.longitude, Latitude: map.latitude });
              }}
              longitude={form.getFieldValue('Longitude')}
              latitude={form.getFieldValue('Latitude')}
              // path={form.getFieldValue(`CoordinateSet`)}
              handleMarker
              placeholder="请输入"
            />
          </Form.Item>
          <Form.Item
            label="纬度"
            name="Latitude"
            rules={[{ required: true, message: '请选择纬度' }]}
            style={FormItemStyle}
          >
            <SdlMap
              onOk={map => {
                form.setFieldsValue({ Longitude: map.longitude, Latitude: map.latitude });
              }}
              longitude={form.getFieldValue('Longitude')}
              latitude={form.getFieldValue('Latitude')}
              // path={form.getFieldValue(`CoordinateSet`)}
              handleMarker
              placeholder="请输入"
            />
          </Form.Item>
          {/* <Form.Item style={{ width: '100%' }}> */}
          <Divider orientation="right" style={{ width: '100%' }}>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={() => form.resetFields()}>重置</Button>
            </Space>
          </Divider>
          {/* </Form.Item> */}
        </Form>
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(AddProject);
