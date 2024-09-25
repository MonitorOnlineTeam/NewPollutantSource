import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, Radio, Col, Select, Space, Button, Divider, List, Tag, Row } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { API } from '@config/API';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { InfoCircleOutlined } from '@ant-design/icons';
import SelectPointModal from '@/pages/AbnormalIdentifyModel/ModelBase/SelectPointModal.js';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';

const { Option } = Select;

const dvaPropsData = ({ loading, dataModel }) => ({});

const ModelExecutive = props => {
  const [form] = Form.useForm();
  const { dispatch } = props;
  const [isSelectPointModalOpen, setIsSelectPointModalOpen] = useState(false);
  const [DGIMN, setDGIMN] = useState();
  const [keysName, setKeysName] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  // 加载数据
  const loadData = () => {
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetStopParamList,
      payload: {
        DGIMN,
      },
      callback: res => {
        setLoading(false);
        setDataSource(res.Datas);
      },
    });
  };

  return (
    <BreadcrumbWrapper>
      <Card title="模型执行管理">
        {/* <Row justify="center"> */}
        <Row>
          <Form
            name="basic"
            labelCol={{
              flex: '300px',
            }}
            wrapperCol={{
              flex: 1,
            }}
            initialValues={{}}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            // style={{ width: 800 }}
            style={{ width: '100%' }}
          >
            <Form.Item
              name="username"
              label="是否对所有排口执行模型"
              rules={[
                {
                  required: true,
                  message: '不能为空!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Row style={{ marginLeft: 300, marginBottom: 10 }}>
              <Col span={24}>
                <Button type="primary" onClick={() => setIsSelectPointModalOpen(true)}>
                  选取排口
                </Button>
              </Col>
              <Col span={24} style={{ marginTop: 10 }}>
                {keysName.map(item => {
                  return (
                    <Tag color="processing" key={item}>
                      {item}
                    </Tag>
                  );
                })}
              </Col>
            </Row>
            <Form.Item
              label="是否学习排口数据特征"
              name="password"
              rules={[
                {
                  required: true,
                  message: '不能为空!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="特征学习时间范围" required>
              <Space direction="vertical">
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: '不能为空!',
                    },
                  ]}
                >
                  <RangePicker_
                    style={{ width: 300 }}
                    dataType={'hour'}
                    showTime
                    format={'YYYY-MM-DD HH'}
                    allowClear={false}
                  />
                </Form.Item>
                <Row align="middle" style={{ marginTop: -10, color: '#3888ff' }}>
                  <InfoCircleOutlined style={{ marginRight: 6 }} />
                  特征学习时间范围需要覆盖模型执行时间范围
                </Row>
              </Space>
            </Form.Item>
            <Form.Item
              label="模型执行时间范围"
              name="password"
              style={{ marginTop: 24 }}
              rules={[
                {
                  required: true,
                  message: '不能为空!',
                },
              ]}
            >
              <RangePicker_
                style={{ width: 300 }}
                dataType={'hour'}
                showTime
                format={'YYYY-MM-DD HH'}
                allowClear={false}
              />
            </Form.Item>
            <Form.Item>
              <Divider orientation="right">
                <Button type="primary" htmlType="submit">
                  开始执行
                </Button>
              </Divider>
            </Form.Item>
          </Form>
        </Row>
      </Card>
      <Card
        title={
          <span className="innerCardTitle">
            运行日志
            <Tag style={{ marginLeft: 8 }} icon={<SyncOutlined spin />} color="processing">
              运行中...
            </Tag>
          </span>
        }
        bordered={false}
        bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
      >
        <List
          itemLayout="horizontal"
          dataSource={[
            {
              title: 'Ant Design Title 1',
            },
            {
              title: 'Ant Design Title 2',
            },
            {
              title: 'Ant Design Title 3',
            },
            {
              title: 'Ant Design Title 4',
            },
          ]}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
          )}
        />
      </Card>
      {isSelectPointModalOpen && (
        <SelectPointModal
          open={isSelectPointModalOpen}
          checkedKeys={selectedKeys}
          onCancel={() => setIsSelectPointModalOpen(false)}
          onOk={(keys, keysName) => {
            // bindingPoint(keys);
            console.log('keys', keys);
            console.log('keysName', keysName);
            setSelectedKeys(keys);
            setKeysName(keysName);
            setIsSelectPointModalOpen(false);
          }}
        />
      )}
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(ModelExecutive);
