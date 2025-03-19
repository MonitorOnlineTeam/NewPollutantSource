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

let timer;

const dvaPropsData = ({ loading, dataModel }) => ({});

const ModelExecutive = props => {
  const [form] = Form.useForm();
  const { dispatch } = props;
  const [isSelectPointModalOpen, setIsSelectPointModalOpen] = useState(false);
  const [keysName, setKeysName] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [executionLoading, setExecutionLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsList, setLogsList] = useState([]);
  const [runProgress, setRunProgress] = useState(0);
  const [isAll, setIsAll] = useState(false);
  const [isStudy, setIsStudy] = useState();

  useEffect(() => {
    getRunLogs();
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 开始执行
  const startExecution = () => {
    form.validateFields().then(values => {
      setExecutionLoading(true);
      let body = {
        IsStudy: values.IsStudy === '1',
        DGIMN: !isAll ? selectedKeys.toString() : undefined,
        BeginTime: values.runTime[0].format('YYYY-MM-DD HH:00:00'), // 模型执行时间
        EndTime: values.runTime[1].format('YYYY-MM-DD HH:59:59'), // 模型执行时间
        RangeBeginTime: values.learnTime
          ? values.learnTime[0].format('YYYY-MM-DD HH:00:00')
          : undefined, // 学习时间
        RangeEndTime: values.learnTime
          ? values.learnTime[1].format('YYYY-MM-DD HH:59:59')
          : undefined, // 学习时间
      };
      // console.log('body', body)
      // return
      dispatch({
        type: 'AbnormalIdentifyModel/GenericPostRequest',
        url: API.AbnormalIdentifyModel.AutoOpeModel,
        payload: body,
        callback: res => {
          setTimeout(() => {
            setExecutionLoading(false);
            getRunLogs();
          }, 10000);
        },
      });
    });
  };

  // 运行日志
  const getRunLogs = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GenericPostRequest',
      url: API.AbnormalIdentifyModel.GetModelRunStatusLogs,
      payload: {},
      callback: res => {
        console.log('res', res);
        let isLoading = res.Datas.roundedProgress !== 100;
        setLogsLoading(isLoading);
        setLogsList(res.Datas.rtnStr);
        setRunProgress(res.Datas.roundedProgress);
        clearTimeout(timer);
        if (isLoading) {
          timer = setTimeout(() => {
            getRunLogs();
          }, 120000);
        }
      },
    });
  };

  return (
    <BreadcrumbWrapper>
      <Card title="模型执行管理">
        <Row>
          <Form
            form={form}
            labelCol={{
              flex: '300px',
            }}
            wrapperCol={{
              flex: 1,
            }}
            initialValues={{
              IsAll: 2,
            }}
            autoComplete="off"
            style={{ width: '100%' }}
          >
            <Form.Item
              name="IsAll"
              label="是否对所有排口执行模型"
              rules={[
                {
                  required: true,
                  message: '不能为空!',
                },
              ]}
            >
              <Radio.Group
                onChange={e => {
                  setIsAll(e.target.value === 1);
                }}
              >
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </Form.Item>
            {!isAll && (
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
            )}

            <Form.Item
              label="是否学习排口数据特征"
              name="IsStudy"
              rules={[
                {
                  required: true,
                  message: '不能为空!',
                },
              ]}
            >
              <Space>
                <Radio.Group
                  onChange={e => {
                    setIsStudy(e.target.value === '1');
                  }}
                >
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
                {isStudy && (
                  <span style={{ fontSize: 14, color: 'red' }}>
                    （选"是"将会重新计算波动范围、振幅、陡变系数等数据特征，请反复确认是否必需）
                  </span>
                )}
              </Space>
            </Form.Item>
            {(isStudy === true || isStudy === undefined) && (
              <Form.Item label="特征学习时间范围" required>
                <Space direction="vertical">
                  <Form.Item
                    name="learnTime"
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
            )}
            <Form.Item
              label="模型执行时间范围"
              name="runTime"
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
                <Button
                  type="primary"
                  loading={executionLoading}
                  onClick={() => startExecution()}
                  disabled={logsLoading}
                >
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
            {logsLoading && (
              <Tag style={{ marginLeft: 8 }} icon={<SyncOutlined spin />} color="processing">
                正在运行，进度{runProgress}%，请等待...
              </Tag>
            )}
          </span>
        }
        bordered={false}
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 0,
          height: 'calc(100vh - 648px)',
          overflowY: 'auto',
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={logsList}
          renderItem={item => (
            <List.Item key={item.Index}>
              <List.Item.Meta title={item.Time} description={item.ParamsStr} />
            </List.Item>
          )}
        />
      </Card>
      {isSelectPointModalOpen && (
        <SelectPointModal
          open={isSelectPointModalOpen}
          checkedKeys={selectedKeys}
          checkedKeysName={keysName}
          onCancel={() => setIsSelectPointModalOpen(false)}
          onOk={(keys, keysName) => {
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
