/*
 * @Author: JiaQi
 * @Date: 2023-06-19 09:10:50
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-02-05 14:14:03
 * @Description：模型参数配置
 */
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, InputNumber, Row, Col, Divider, message, Tabs } from 'antd';
import styles from '../../styles.less';

const WeekData = [
  {
    name: '周一',
    value: 1,
  },
  {
    name: '周二',
    value: 2,
  },
  {
    name: '周三',
    value: 3,
  },
  {
    name: '周四',
    value: 4,
  },
  {
    name: '周五',
    value: 5,
  },
  {
    name: '周六',
    value: 6,
  },
  {
    name: '周日',
    value: 7,
  },
];

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const ModelParamsConfig = props => {
  const [form] = Form.useForm();
  const [paramsData, setParamsData] = useState(props.Data.dataAttribute);
  const {
    ModelID,
    Data: { dataAttribute, modelInfo },
    industryList,
  } = props;
  console.log('dataAttribute', dataAttribute);
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
    });
    setParamsData(props.Data.dataAttribute);
  }, [props.Data]);

  useImperativeHandle(props.onRef, () => {
    return {
      onFinish: onFinish,
    };
  });

  const onFinish = async () => {
    // let data = {};
    try {
      const values = await form.validateFields();
      console.log('values', values);
      console.log('paramsData', paramsData);
      // return;
      return {
        dataAttribute: [...paramsData['1'], ...paramsData['2'], ...paramsData['3']],
      };
    } catch (errorInfo) {
      console.log('errorInfo', errorInfo);
      // message.warning('请输入完整的数据');
      return false;
    }
  };

  // 处理运行策略参数
  const renderParamsItem = (data, index) => {
    const { WaveType, PollutantName, PollutantCode, ParamType, Unit } = data;
    let Value = /,/.test(data.Value) ? data.Value.split(',') : data.Value;

    switch (WaveType) {
      // 小时
      case 1:
        return (
          <Form.Item
            label=""
            style={{
              marginBottom: 0,
              width: 600,
            }}
          >
            <span className={styles.formItemText_l}>模型每</span>
            <Form.Item
              style={{
                display: 'inline-block',
              }}
              name={PollutantCode}
              initialValue={Value[0]}
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <InputNumber
                onChange={value => onFormItemChange(value, ParamType, index, 0)}
                style={{ width: '80px' }}
              />
            </Form.Item>
            <span className={styles.formItemText_r}>小时，获取</span>
            <Form.Item
              style={{
                display: 'inline-block',
              }}
              name={PollutantCode + '2'}
              initialValue={Value[1]}
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <InputNumber
                onChange={value => onFormItemChange(value, ParamType, index, 1)}
                style={{ width: '80px' }}
              />
            </Form.Item>
            <span className={styles.formItemText_r}>小时的数据，判断是否符合模型数据特征。</span>
          </Form.Item>
        );
      // 周
      case 2:
        return (
          <Form.Item
            label=""
            style={{
              marginBottom: 0,
              width: 800,
            }}
          >
            <span className={styles.formItemText_l}>模型每周的</span>
            <Form.Item
              style={{
                display: 'inline-block',
              }}
              name={PollutantCode}
              initialValue={Value[0]}
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <Select
                onChange={value => onFormItemChange(value, ParamType, index, 0)}
                defaultValue={Value[1]}
                style={{ width: 80 }}
              >
                {WeekData.map((item, index) => {
                  return (
                    <Option key={item.value} value={`${item.value}`}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <span className={styles.formItemText_r}></span>
            <Form.Item
              style={{
                display: 'inline-block',
              }}
              name={PollutantCode + '2'}
              initialValue={Value[1]}
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <Select
                onChange={value => onFormItemChange(value, ParamType, index, 1)}
                defaultValue={Value[1]}
                style={{ width: 80 }}
              >
                {Array.from({ length: 24 }, () => '').map((item, index) => {
                  return (
                    <Option key={index} value={`${index}`}>
                      {index}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <span className={styles.formItemText_r}>
              点，获取上周的数据，判断是否符合模型数据特征。
            </span>
          </Form.Item>
        );
      // 月
      case 3:
        return (
          <Form.Item
            label=""
            style={{
              marginBottom: 0,
              width: 800,
            }}
          >
            <span className={styles.formItemText_l}>模型每月的</span>
            <Form.Item
              style={{
                display: 'inline-block',
              }}
              name={PollutantCode}
              initialValue={Value[0]}
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <Select
                onChange={value => onFormItemChange(value, ParamType, index, 0)}
                defaultValue={Value[1]}
                style={{ width: 80 }}
              >
                {Array.from({ length: 28 }, () => '').map((item, index) => {
                  return (
                    <Option key={index + 1} value={`${index + 1}`}>
                      {index + 1}日
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <span className={styles.formItemText_r}></span>
            <Form.Item
              style={{
                display: 'inline-block',
              }}
              name={PollutantCode + '2'}
              initialValue={Value[1]}
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <Select
                onChange={value => onFormItemChange(value, ParamType, index, 1)}
                defaultValue={Value[1]}
                style={{ width: 80 }}
              >
                {Array.from({ length: 24 }, () => '').map((item, index) => {
                  return (
                    <Option key={index} value={`${index}`}>
                      {index}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <span className={styles.formItemText_r}>点，获取</span>
            <Form.Item
              style={{
                display: 'inline-block',
              }}
              name={PollutantCode + '3'}
              initialValue={Value[2]}
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <InputNumber
                onChange={value => onFormItemChange(value, ParamType, index, 2)}
                style={{ width: '80px' }}
              />
            </Form.Item>
            <span className={styles.formItemText_r}>小时的数据，判断是否符合模型数据特征。</span>
          </Form.Item>
        );
      // 监测样品为空气（取大值）
      case 4:
        return (
          <Form.Item
            label=""
            style={{
              marginBottom: 0,
              width: 600,
            }}
          >
            <span className={styles.formItemText_l}>O2≥【</span>
            <Form.Item
              style={{
                display: 'inline-block',
              }}
              name={PollutantCode}
              initialValue={Value[0]}
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <InputNumber
                onChange={value => onFormItemChange(value, ParamType, index, 0)}
                style={{ width: '80px' }}
              />
            </Form.Item>
            <span className={styles.formItemText_r}> % 或 O2正常波动上限 ×</span>
            <Form.Item
              style={{
                display: 'inline-block',
              }}
              name={PollutantCode + '2'}
              initialValue={Value[1]}
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <InputNumber
                onChange={value => onFormItemChange(value, ParamType, index, 1)}
                style={{ width: '80px' }}
              />
            </Form.Item>
            <span className={styles.formItemText_r}> %】（取大值）</span>
          </Form.Item>
        );
      // name + value + unit
      case 5:
        return (
          <Form.Item
            label={PollutantName}
            style={{
              marginBottom: 0,
            }}
          >
            <Form.Item
              style={{
                display: 'inline-block',
              }}
              name={PollutantCode}
              initialValue={Value}
              rules={[
                {
                  required: true,
                  message: '不能为空',
                },
              ]}
            >
              <InputNumber
                onChange={value => onFormItemChange(value, ParamType, index)}
                style={{ width: '80px' }}
              />
            </Form.Item>
            <span className={styles.formItemText_r}>{Unit}</span>
          </Form.Item>
        );
        return;
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
            layout={'inline'}
            style={{ paddingTop: '10px' }}
            initialValues={{}}
            // onFinish={onFinish}
            autoComplete="off"
            colon={false}
          >
            {dataAttribute['1'].length ? (
              <Card className={styles.paramsCardWrapper}>
                <span className={styles.paramTitle}>运行策略</span>
                {dataAttribute['1'].map((item, index) => {
                  return renderParamsItem(item, index);
                })}
              </Card>
            ) : (
              ''
            )}
            {dataAttribute['3'].length ? (
              <Card className={styles.paramsCardWrapper}>
                <span className={styles.paramTitle}>算法参数</span>
                {dataAttribute['3'].map((item, index) => {
                  return renderParamsItem(item, index);
                })}
              </Card>
            ) : (
              ''
            )}
            {dataAttribute['2'].length ? (
              <Card className={styles.paramsCardWrapper} style={{ marginBottom: 0 }}>
                <span className={styles.paramTitle}>动机判断</span>
                {dataAttribute['2'].map((item, index) => {
                  return renderParamsItem(item, index);
                })}
              </Card>
            ) : (
              ''
            )}
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
  const onFormItemChange = (value, ParamType, index, valueIndex) => {
    let temp_changedData = [...paramsData[ParamType]];

    if (valueIndex != undefined) {
      temp_changedData[index].Value = temp_changedData[index].Value.split(',');
      temp_changedData[index].Value[valueIndex] = value;
      temp_changedData[index].Value = temp_changedData[index].Value.join();
    } else {
      temp_changedData[index].Value = value;
      debugger;
    }

    setParamsData({
      ...paramsData,
      [ParamType]: temp_changedData,
    });
    // setChangedData(temp_changedData);
  };
  console.log('paramsData', paramsData);
  // const PageContent = renderPage();
  // console.log('changedData', changedData);
  return <>{renderPage()}</>;
};

export default connect(dvaPropsData)(ModelParamsConfig);
