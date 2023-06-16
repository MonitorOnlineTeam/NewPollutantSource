import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  InputNumber,
  Row,
  Col,
  Space,
  Button,
  Divider,
  message,
  Spin,
  Tooltip,
} from 'antd';
import styles from '../styles.less';
import NavigationTree from '@/components/NavigationTree';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { QuestionCircleOutlined } from '@ant-design/icons';
import PollutantImages from './components/PollutantImages';

const PollutantList = [
  {
    pollutantCode: '02',
    pollutantName: '实测SO2',
    unit: 'mg/m³',
  },
  {
    pollutantCode: 's03',
    pollutantName: '烟气温度',
    unit: '℃',
  },
  {
    pollutantCode: '03',
    pollutantName: '实测NOx',
    unit: 'mg/m³',
  },
  {
    pollutantCode: 's05',
    pollutantName: '烟气湿度',
    unit: '%',
  },
  {
    pollutantCode: '01',
    pollutantName: '实测烟尘',
    unit: 'mg/m³',
  },
  {
    pollutantCode: 's08',
    pollutantName: '烟气静压',
    unit: 'KPa',
  },
  {
    pollutantCode: 's01',
    pollutantName: 'O2',
    unit: '%',
  },
  {
    pollutantCode: 's02',
    pollutantName: '烟气流速',
    unit: 'm/s',
  },
];

const dvaPropsData = ({ loading, dataModel }) => ({
  loadLoading: loading.effects['dataModel/GetPointParamsRange'],
  saveLoading: loading.effects['dataModel/SavePointParamsRange'],
});

const PointParams = props => {
  const [form] = Form.useForm();
  const { dispatch, loadLoading, saveLoading } = props;
  const [DGIMN, setDGIMN] = useState();
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [currentPoint, setCurrentPoint] = useState();

  useEffect(() => {
    loadData();
  }, [DGIMN]);

  // 加载数据
  const loadData = () => {
    if (DGIMN) {
      form.resetFields();
      dispatch({
        type: 'dataModel/GetPointParamsRange',
        payload: {
          DGIMN,
        },
        callback: res => {
          let range = {};
          PollutantList.map(item => {
            let pollutantValue = res.range[item.pollutantCode];
            if (pollutantValue) {
              let min = pollutantValue[0];
              let max = pollutantValue[1];
              range[item.pollutantCode + 'Min'] = min;
              range[item.pollutantCode + 'Max'] = max;
            }
          });

          console.log('range', range);
          form.setFieldsValue({
            ...range,
            ...res.paramsObj,
          });
          setImages(res.image);
        },
      });
    }
  };

  // 提交任务单
  const onFinish = async () => {
    const values = await form.validateFields();
    let isError = false;
    let range = {};
    PollutantList.map(item => {
      let min = values[item.pollutantCode + 'Min'];
      let max = values[item.pollutantCode + 'Max'];

      if ((min != null && max == null) || (max != null && min == null)) {
        message.error(`${item.pollutantName}波动范围请填写完整！`);
        isError = true;
      }

      if (max < min) {
        message.error(`${item.pollutantName}波动范围上限不能小于下限，请检查！`);
        isError = true;
      }

      range[item.pollutantCode] = [min != null ? min : '', max != null ? max : ''];
    });
    if (isError) {
      return;
    }
    let paramsObj = {
      area: values.area,
      atmos: values.atmos,
      s01ref: values.s01ref,
    };
    let body = {
      dgimn: DGIMN,
      range,
      paramsObj,
    };
    console.log('body', body);
    // return;
    props.dispatch({
      type: 'dataModel/SavePointParamsRange',
      payload: body,
      callback: () => {
        loadData();
      },
    });
  };

  return (
    <>
      <NavigationTree
        propsParams={{
          // ModelFlag: 'ModelFlag',
          industryTypeCode: '1',
          outputType: 0,
        }}
        checkpPol="2"
        polShow
        domId="#PointParams"
        onItemClick={value => {
          console.log('value', value);
          if (value[0].IsEnt === false) {
            setDGIMN(value[0].key);
            setCurrentPoint(`${value[0].entName}_${value[0].pointName}`);
          }
        }}
      />
      <div id="PointParams">
        <BreadcrumbWrapper>
          <div className={styles.CardPageWrapper}>
            <Form
              name="basic"
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
              style={{ paddingTop: '10px' }}
              initialValues={{}}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Spin spinning={loadLoading}>
                <Card
                  bordered={false}
                  // loading={loadLoading}
                  bodyStyle={{ paddingTop: 20 }}
                  title={
                    <div className={styles.title}>
                      污染物波动范围
                      <Tooltip
                        title={'点击查看监测因子波动范围'}
                        // overlayStyle={this.props.overlayStyle}
                      >
                        <QuestionCircleOutlined
                          style={{ marginLeft: 6, color: '#808080', cursor: 'pointer' }}
                          onClick={() => {
                            setVisible(true);
                          }}
                        />
                      </Tooltip>
                    </div>
                  }
                >
                  <Row>
                    {PollutantList.map(item => {
                      return (
                        <Col span={12}>
                          <Form.Item
                            label={item.pollutantName}
                            style={{
                              marginBottom: 0,
                            }}
                          >
                            <Form.Item
                              name={item.pollutantCode + 'Min'}
                              style={{
                                display: 'inline-block',
                                width: 'calc(50% - 40px)',
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
                              name={item.pollutantCode + 'Max'}
                              style={{
                                display: 'inline-block',
                                width: 'calc(50% - 40px)',
                              }}
                            >
                              <InputNumber
                                min={item.pollutantCode + 'Min' || 0}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '48px',
                                lineHeight: '32px',
                                marginLeft: 8,
                                fontSize: 13,
                              }}
                            >
                              {item.unit}
                            </span>
                          </Form.Item>
                        </Col>
                      );
                    })}
                  </Row>
                </Card>
                {/* <Divider /> */}
                <Card
                  style={{ marginTop: 16 }}
                  bordered={false}
                  bodyStyle={{ paddingTop: 20, height: 'calc(100vh - 530px)' }}
                  title={<div className={styles.title}>排口参数</div>}
                  // loading={loadLoading}
                >
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label="烟道截面积"
                        style={{
                          marginBottom: 0,
                        }}
                      >
                        <Form.Item
                          name="area"
                          style={{
                            display: 'inline-block',
                            width: 'calc(100% - 40px)',
                          }}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '24px',
                            lineHeight: '32px',
                            textAlign: 'center',
                            marginLeft: 8,
                          }}
                        >
                          m³
                        </span>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="当地标准大气压"
                        style={{
                          marginBottom: 0,
                        }}
                      >
                        <Form.Item
                          name="atmos"
                          style={{
                            display: 'inline-block',
                            width: 'calc(100% - 40px)',
                          }}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '24px',
                            lineHeight: '32px',
                            textAlign: 'center',
                            marginLeft: 8,
                          }}
                        >
                          kPa
                        </span>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="基准氧含量"
                        style={{
                          marginBottom: 0,
                        }}
                      >
                        <Form.Item
                          name="s01ref"
                          style={{
                            display: 'inline-block',
                            width: 'calc(100% - 40px)',
                          }}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '24px',
                            lineHeight: '32px',
                            textAlign: 'center',
                            marginLeft: 8,
                          }}
                        >
                          %
                        </span>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider orientation="right" style={{ color: '#d9d9d9' }}>
                    <Space>
                      <Button type="primary" htmlType="submit" loading={saveLoading}>
                        提交
                      </Button>
                    </Space>
                  </Divider>
                </Card>
              </Spin>
            </Form>
          </div>
        </BreadcrumbWrapper>
        <PollutantImages
          title={currentPoint}
          visible={visible}
          onCancel={() => setVisible(false)}
          images={images}
        />
      </div>
    </>
  );
};

export default connect(dvaPropsData)(PointParams);
