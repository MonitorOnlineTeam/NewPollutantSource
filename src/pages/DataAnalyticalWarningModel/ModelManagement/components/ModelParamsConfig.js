/*
 * @Author: JiaQi
 * @Date: 2023-06-19 09:10:50
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-11-09 16:48:07
 * @Description：模型参数配置
 */
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, InputNumber, Row, Col, Divider, message, Tabs } from 'antd';
import styles from '../../styles.less';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const ModelParamsConfig = props => {
  const [form] = Form.useForm();
  const [changedData, setChangedData] = useState([]);
  const {
    ModelID,
    Data: { dataAttribute, modelInfo },
    industryList,
  } = props;

  useEffect(() => {
    let range = {};
    // _PollutantList.map(item => {
    //   let pollutantValue = dataAttribute[item.pollutantCode];
    //   if (pollutantValue) {
    //     let min = pollutantValue[0];
    //     let max = pollutantValue[1];
    //     range[item.pollutantCode + 'Min'] = min;
    //     range[item.pollutantCode + 'Max'] = max;
    //   }
    // });

    form.setFieldsValue({
      ...range,
      AbnormalNum: modelInfo.AbnormalNum,
      IsCAbnormal: modelInfo.IsCAbnormal,
    });
  }, [props.Data]);

  const onFinish = async () => {
    // let data = {};
    try {
      const values = await form.validateFields();
      console.log('values', values);
      console.log('changedData', changedData);
      // return;
      return {
        AbnormalNum: values.AbnormalNum,
        IsCAbnormal: values.IsCAbnormal,
        dataAttribute: changedData,
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

  const renderIndustryTabs = () => {
    return (
      <Tabs defaultActiveKey="1">
        {dataAttribute.map(item => {
          let currentIndustry = industryList.find(
            a => a['dbo.T_Cod_IndustryType.IndustryTypeCode'] === item.industryCode,
          );
          let industryName = currentIndustry
            ? currentIndustry['dbo.T_Cod_IndustryType.IndustryTypeName']
            : '';
          console.log('industryName', industryName);
          return (
            <Tabs.TabPane tab={industryName} key={item.industryCode}>
              {renderParams(item.params, item.industryCode)}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  };

  const renderParams = (paramsData, industryCode) => {
    return (
      <Row gutter={16}>
        {paramsData.map(item => {
          return renderParamsItem(item, industryCode);
        })}
      </Row>
    );
  };

  const renderParamsItem = (ItemData, industryCode) => {
    let name = industryCode + '-' + ItemData.PollutantCode;
    switch (ItemData.WaveType) {
      case 3:
        // 单值
        return (
          <Col span={10}>
            <Form.Item
              label={ItemData.PollutantName}
              style={{
                marginBottom: 0,
              }}
            >
              <Form.Item
                style={{
                  display: 'inline-block',
                }}
                name={name}
                initialValue={ItemData.Value}
              >
                <InputNumber
                  onChange={value => onFormItemChange(value, 'Value', ItemData)}
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
                {ItemData.Unit}
              </span>
            </Form.Item>
          </Col>
        );

      default:
        // 范围
        return (
          <Col span={10}>
            <Form.Item
              label={ItemData.PollutantName + '监测范围为'}
              style={{
                marginBottom: 0,
              }}
            >
              <Form.Item
                name={name + '-Min'}
                initialValue={ItemData.LowerLimit}
                rules={[{ validator: validateReceiptNumber }]}
                style={{
                  display: 'inline-block',
                  // width: 'calc(50% - 40px)',
                }}
              >
                <InputNumber
                  onChange={value => onFormItemChange(value, 'LowerLimit', ItemData)}
                  style={{ width: '100px' }}
                />
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
                name={name + '-Max'}
                initialValue={ItemData.UpperLimit}
                style={{
                  display: 'inline-block',
                  // width: 'calc(50% - 40px)',
                }}
                rules={[{ validator: validateReceiptNumber }]}
              >
                <InputNumber
                  onChange={value => onFormItemChange(value, 'UpperLimit', ItemData)}
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
                {ItemData.Unit}
              </span>
            </Form.Item>
          </Col>
        );
    }
  };

  const renderPage = () => {
    return (
      <>
        <Divider style={{ margin: 0 }} />
        <Card
          title={<div className={styles.title}>参数配置</div>}
          bordered={false}
          bodyStyle={{ padding: '20px 40px' }}
        >
          <Form
            name="basic"
            form={form}
            // labelCol={{ span: 6 }}
            // wrapperCol={{ span: 18 }}
            // layout={'vertical'}
            style={{ paddingTop: '10px' }}
            initialValues={{}}
            // onFinish={onFinish}
            autoComplete="off"
            colon={false}
          >
            {// 机组停运
            (ModelID === '928ec327-d30d-4803-ae83-eab3a93538c1' ||
              // 机组停运虚假标识
              ModelID === '3568b3c6-d8db-42f1-bbff-e76406a67f7f' ||
              // 检测样品为空气（拔管）
              ModelID === '9104ab9f-d3f3-4bd9-a0d9-898d87def4dd') && (
              <Row gutter={16}>
                <Col span={20}>
                  <Form.Item
                    // labelCol={{ span: 3 }}
                    // wrapperCol={{ span: 18 }}
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
            )}

            {renderIndustryTabs()}
            {/* <Row gutter={16}>
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
            </Row> */}
          </Form>
        </Card>
      </>
    );
  };

  const validateReceiptNumber = (rule, value, callback) => {
    console.log('rule', rule);
    let splitField = rule.field.split('-');
    const { getFieldValue } = form;
    let endField, startField;
    if (splitField.length === 3) {
      startField = splitField.slice(0, 2).join('-') + '-Min';
      endField = splitField.slice(0, 2).join('-') + '-Max';
    }

    if (startField && endField) {
      let startNum = Number.parseInt(getFieldValue(startField));
      let endNum = Number.parseInt(getFieldValue(endField));
      if (!Number.isNaN(startNum) && !Number.isNaN(endNum) && startNum > endNum) {
        callback('监测范围上限不能小于下限！');
      }
    }
    callback();
  };

  // 值改变事件
  const onFormItemChange = (value, key, data) => {
    let temp_changedData = [...changedData];
    // 判断是否存在
    let index = temp_changedData.findIndex(
      item =>
        item.PollutantCode === data.PollutantCode &&
        item.IndustryTypeCode === data.IndustryTypeCode,
    );
    if (index !== -1) {
      // 存在
      temp_changedData[index][key] = value;
    } else {
      // 不存在
      temp_changedData.push({
        ...data,
        [key]: value,
      });
    }

    setChangedData(temp_changedData);
  };
  // const PageContent = renderPage();
  console.log('changedData', changedData);
  return <>{renderPage()}</>;
};

export default connect(dvaPropsData)(ModelParamsConfig);
