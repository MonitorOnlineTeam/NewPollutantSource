/*
 * @Author: JiaQi
 * @Date: 2023-06-19 09:10:50
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-06-19 09:11:30
 * @Description：模型参数配置
 */
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, InputNumber, Row, Col, Divider, message } from 'antd';
import styles from '../../styles.less';

const PollutantList = {
  // 机组停运
  '928ec327-d30d-4803-ae83-eab3a93538c1': [
    {
      pollutantCode: 's02',
      pollutantName: '流速',
      unit: 'm/s',
    },
    {
      pollutantCode: 's01',
      pollutantName: 'O2',
      unit: '%',
    },
    {
      pollutantCode: 's03',
      pollutantName: '温度',
      unit: '℃',
    },
  ],
  // 检测样品为空气（拔管）
  '9104ab9f-d3f3-4bd9-a0d9-898d87def4dd': [
    {
      pollutantCode: 's01',
      pollutantName: 'O2',
      unit: '%',
    },
  ],
};

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const ModelParamsConfig = props => {
  const [form] = Form.useForm();
  const {
    ModelID,
    Data: { dataAttribute, modelInfo },
  } = props;
  const _PollutantList = PollutantList[ModelID] || [];

  useEffect(() => {
    let range = {};
    _PollutantList.map(item => {
      let pollutantValue = dataAttribute[item.pollutantCode];
      if (pollutantValue) {
        let min = pollutantValue[0];
        let max = pollutantValue[1];
        range[item.pollutantCode + 'Min'] = min;
        range[item.pollutantCode + 'Max'] = max;
      }
    });

    form.setFieldsValue({
      ...range,
      AbnormalNum: modelInfo.AbnormalNum,
      IsCAbnormal: modelInfo.IsCAbnormal,
    });
  }, [props.Data]);

  //
  const loadData = () => {};

  const onFinish = async () => {
    // let data = {};
    try {
      const values = await form.validateFields();
      let isError = false;
      let data = {};
      _PollutantList.map(item => {
        let min = values[item.pollutantCode + 'Min'];
        let max = values[item.pollutantCode + 'Max'];

        // if ((min != null && max == null) || (max != null && min == null)) {
        //   message.error(`${item.pollutantName}波动范围请填写完整！`);
        //   isError = true;
        // }
        debugger;
        if (max != null && min != null && max < min) {
          message.error(`${item.pollutantName}监测范围上限不能小于下限，请检查！`);
          isError = true;
        }

        data[item.pollutantCode] = [min != null ? min : '', max != null ? max : ''];
      });
      if (isError) {
        data = false;
      }
      return {
        AbnormalNum: values.AbnormalNum,
        IsCAbnormal: values.IsCAbnormal,
        dataAttribute: data,
      };
    } catch (errorInfo) {
      console.log('errorInfo', errorInfo);
      // message.warning('请输入完整的数据');
      return false;
    }
  };

  useImperativeHandle(props.onRef, () => {
    return {
      onFinish: onFinish,
    };
  });

  const renderPage = () => {
    switch (ModelID) {
      // 机组停运
      case '928ec327-d30d-4803-ae83-eab3a93538c1':
      // 检测样品为空气（拔管）
      case '9104ab9f-d3f3-4bd9-a0d9-898d87def4dd':
        return (
          <>
            <Divider style={{ margin: 0 }} />
            <Card title={<div className={styles.title}>模型参数配置</div>} bordered={false}>
              <Form
                name="basic"
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                // layout={'vertical'}
                style={{ paddingTop: '10px' }}
                initialValues={{}}
                // onFinish={onFinish}
                autoComplete="off"
                colon={false}
              >
                <Row gutter={16}>
                  <Col span={20}>
                    <Form.Item
                      labelCol={{ span: 3 }}
                      wrapperCol={{ span: 18 }}
                      label="异常数据符合"
                      style={{
                        marginBottom: 0,
                      }}
                    >
                      <Form.Item
                        name="IsCAbnormal"
                        style={{
                          display: 'inline-block',
                          // width: 'calc(100% - 40px)',
                        }}
                        rules={[
                          {
                            required: true,
                            message: '请选择是否连续',
                          },
                        ]}
                      >
                        <Select placeholder="请选择是否连续" style={{ width: '100px' }}>
                          <Option value={false}>不连续</Option>
                          <Option value={true}>连续</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="AbnormalNum"
                        style={{
                          display: 'inline-block',
                          marginLeft: 14,
                          // width: 'calc(100% - 40px)',
                        }}
                        rules={[
                          {
                            required: true,
                            message: '不能为空',
                          },
                        ]}
                      >
                        <InputNumber min={0} style={{ width: '100px', marginLeft: 10 }} />
                      </Form.Item>
                      <span
                        style={{
                          display: 'inline-block',
                          lineHeight: '32px',
                          textAlign: 'center',
                          marginLeft: 8,
                        }}
                      >
                        小时数据符合模型数据特征
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  {PollutantList[ModelID].map(item => {
                    return (
                      <Col span={10}>
                        <Form.Item
                          label={item.pollutantName + '监测范围为'}
                          style={{
                            marginBottom: 0,
                          }}
                        >
                          <Form.Item
                            name={item.pollutantCode + 'Min'}
                            style={{
                              display: 'inline-block',
                              // width: 'calc(50% - 40px)',
                            }}
                          >
                            <InputNumber style={{ width: '100px' }} />
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
                              // width: 'calc(50% - 40px)',
                            }}
                          >
                            <InputNumber
                              min={item.pollutantCode + 'Min' || 0}
                              style={{ width: '100px' }}
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
              </Form>
            </Card>
          </>
        );
      default:
        return <></>;
    }
  };

  // const PageContent = renderPage();

  return <>{renderPage()}</>;
};

export default connect(dvaPropsData)(ModelParamsConfig);
