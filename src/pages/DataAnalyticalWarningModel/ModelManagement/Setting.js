import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Divider,
  Button,
  Select,
} from 'antd';
import styles from '../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';

const { TextArea } = Input;

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const Setting = props => {
  const [baseForm] = Form.useForm();
  const [paramsForm] = Form.useForm();
  const { taskInfo } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {};

  const getColumns = () => {
    return [
      {
        title: '编号',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '企业名称',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '排口名称',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '行业',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '操作',
        dataIndex: 'age',
        key: 'age',
      },
    ];
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.ModelSettingWrapper}>
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <Card title="模型基础信息" bodyStyle={{ height: 440 }}>
              <Form
                name="basic"
                form={baseForm}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
                style={{ paddingTop: '10px' }}
                initialValues={{}}
                // onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  label="模型名称"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: '请输入模型名称',
                    },
                  ]}
                >
                  <Input placeholder="请输入模型名称" />
                </Form.Item>
                <Form.Item
                  label="适用场景"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: '请输入适用场景',
                    },
                  ]}
                >
                  <Input placeholder="请输入适用场景" />
                </Form.Item>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="准确度"
                      name="date"
                      labelCol={{ span: 10 }}
                      wrapperCol={{ span: 10 }}
                      rules={[
                        {
                          required: true,
                          message: '请输入准确度',
                        },
                      ]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请输入准确度" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="是否启用"
                      name="date"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Radio.Group>
                        <Radio value={1}>启用</Radio>
                        <Radio value={2}>停用</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label="模型描述"
                  name="date"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  rules={[
                    {
                      required: true,
                      message: '请输入模型描述',
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder="请输入模型描述" maxLength={6} />
                </Form.Item>
                <Form.Item
                  label="数据特征"
                  name="date"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  rules={[
                    {
                      required: true,
                      message: '请输入数据特征',
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder="请输入数据特征" maxLength={6} />
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col className="gutter-row" span={12}>
            <Card title="关联排口" bodyStyle={{ height: 440 }}>
              <SdlTable dataSource={[]} columns={getColumns()} />
            </Card>
          </Col>
        </Row>
        <Card title="模型特征参数配置">
          <Form
            name="basic"
            form={paramsForm}
            layout={'vertical'}
            style={{ paddingTop: '10px' }}
            initialValues={{}}
            // onFinish={onFinish}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={7}>
                <Form.Item
                  label="是否连续"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: '请选择是否连续',
                    },
                  ]}
                >
                  <Select placeholder="请选择是否连续" style={{ width: '90%' }}>
                    <Option key={0}>否</Option>
                    <Option key={1}>是</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label="异常次数"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: '请输入异常次数',
                    },
                  ]}
                >
                  <InputNumber placeholder="请输入异常次数" style={{ width: '90%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ marginTop: 0 }} />
            <Row gutter={16}>
              <Col span={7}>
                <Form.Item label="污染物" name="date">
                  <span>O2</span>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  label="波动类型"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: '请选择波动类型',
                    },
                  ]}
                >
                  <Select placeholder="请选择波动类型" style={{ width: '90%' }}>
                    <Option key={0}>上限</Option>
                    <Option key={1}>下限</Option>
                    <Option key={2}>范围</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="范围值">
                  <Form.Item
                    name="date"
                    rules={[
                      {
                        required: true,
                        message: '请选择上限',
                      },
                    ]}
                    style={{
                      display: 'inline-block',
                      width: '100px',
                    }}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '24px',
                      lineHeight: '32px',
                      textAlign: 'center',
                    }}
                  >
                    -
                  </span>
                  <Form.Item
                    name="date"
                    rules={[
                      {
                        required: true,
                        message: '请选择下限',
                      },
                    ]}
                    style={{
                      display: 'inline-block',
                      width: '100px',
                    }}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card>
          <Divider orientation="right" style={{ color: '#d9d9d9' }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={false}>
                提交
              </Button>
              <Button>取消</Button>
            </Space>
          </Divider>
        </Card>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Setting);
