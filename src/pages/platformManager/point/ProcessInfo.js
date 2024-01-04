import React, { useState, useEffect, useImperativeHandle } from 'react';
import { connect } from 'dva';
import { Card, Form, Select, Radio, Row, Col, Input, message, Spin, Empty } from 'antd';

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};

const dvaPropsData = ({ loading, point }) => ({
  craftByIndustry: point.craftByIndustry,
  // todoList: wordSupervision.todoList,
  getLoading: loading.effects['point/GetCraftByPoint'],
});

const ProcessInfo = props => {
  const [form] = Form.useForm();
  const { dispatch, IndustryCode, EntCode, DGIMN, craftByIndustry, getLoading } = props;
  const [craftDatas, setCraftDatas] = useState({});
  const [RenderRandom, setRenderRandom] = useState();
  // 水泥
  const [associationPointList, setAssociationPointList] = useState([]); // 窑尾关联的排口
  // 钢铁
  const [SCSSDataList, setSCSSDataList] = useState([]); // 生产设施数据源
  const [PFYDataList, setPFYDataList] = useState([]); // 排放源数据源
  console.log('DGIMN', DGIMN);
  useImperativeHandle(props.onRef, () => {
    return {
      onSubmit: _dgimn => {
        return onSubmit(_dgimn);
      },
      validateFields: () => {
        return validateFields();
      },
    };
  });

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  useEffect(() => {
    GetCraftByIndustry();
  }, [IndustryCode]);

  useEffect(() => {
    initPageLoad();
  }, [craftDatas]);

  // 初始化
  const initPageLoad = () => {
    switch (IndustryCode) {
      case '6': // 水泥
        craftDatas.SCCJ === '2' && getEntAndPointList();
        break;
      case '4': // 钢铁
        // 匹配SCSS数据源
        let filterSCSSData = getFormItemInfo('SCSS').datas.filter(
          item => item.ParentNode === craftDatas.SCGX,
        );
        setSCSSDataList(filterSCSSData);
        // 匹配PFY数据源
        let filterPFYData = getFormItemInfo('PFY').datas.filter(
          item => item.ParentNode === craftDatas.SCSS,
        );
        setPFYDataList(filterPFYData);
        break;
    }
  };

  // 根据企业获取排口
  const getEntAndPointList = () => {
    dispatch({
      type: 'common/getEntAndPointList',
      payload: {
        EntCode: EntCode,
        Status: [],
        RunState: '',
        PollutantTypes: '2',
        StopPointFlag: true,
      },
      callback: res => {
        if (res.length) {
          setAssociationPointList(res[0].children);
        }
      },
    });
  };

  // 获取工艺信息
  const GetCraftByPoint = () => {
    DGIMN &&
      dispatch({
        type: 'point/GetCraftByPoint',
        payload: {
          DGIMN: DGIMN,
        },
        callback: res => {
          setCraftDatas(res);
          form.setFieldsValue({ ...res });
        },
      });
  };

  // 根据行情获取工艺label和数据源
  const GetCraftByIndustry = () => {
    dispatch({
      type: 'point/GetCraftByIndustry',
      payload: {
        IndustryTypeCode: IndustryCode,
      },
      callback: res => {
        GetCraftByPoint();
      },
    });
  };

  // 获取FormItem信息，返回label和数据源
  const getFormItemInfo = field => {
    return craftByIndustry[field] || { Lable: '', datas: [] };
  };

  // 根据行业渲染form
  const renderFormItemByIndustry = () => {
    console.log('form.getFieldValue', form.getFieldValue('SCCJ'));
    switch (IndustryCode) {
      case '6': // 水泥
        return (
          <Row>
            <Col span={12}>
              <Form.Item
                label={getFormItemInfo('SCCJ').Label}
                name="SCCJ"
                rules={[
                  {
                    required: true,
                    message: '不能为空',
                  },
                ]}
              >
                <Radio.Group
                  onChange={e => {
                    let value = e.target.value;
                    if (value === '2') {
                      getEntAndPointList();
                    } else {
                      form.setFieldsValue({ GLDYYT: undefined });
                      setRenderRandom(Math.random());
                    }
                  }}
                >
                  {getFormItemInfo('SCCJ').datas.map(item => {
                    return (
                      <Radio value={item.BaseCode} key={item.BaseCode}>
                        {item.BaseCnName}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            </Col>
            {form.getFieldValue('SCCJ') == '2' && (
              <Col span={12}>
                <Form.Item
                  label={getFormItemInfo('GLDYYT').Label}
                  name="GLDYYT"
                  rules={[
                    {
                      required: true,
                      message: '不能为空',
                    },
                  ]}
                >
                  <Select placeholder="请选择">
                    {associationPointList.map(item => {
                      return (
                        <Option key={item.DGIMN} value={item.DGIMN}>
                          {item.title}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
        );
      case '4': // 钢铁
        return (
          <Row>
            <Col span={12}>
              <Form.Item
                label={getFormItemInfo('SCGX').Label}
                name="SCGX"
                rules={[
                  {
                    required: true,
                    message: '不能为空',
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  allowClear
                  onChange={value => {
                    form.setFieldsValue({ SCSS: undefined, PFY: undefined });
                    if (!value) {
                      setSCSSDataList([]);
                      setPFYDataList([]);
                    } else {
                      // 匹配SCSS数据源
                      let filterSCSSData = getFormItemInfo('SCSS').datas.filter(
                        item => item.ParentNode === value,
                      );
                      setSCSSDataList(filterSCSSData);
                    }
                  }}
                >
                  {getFormItemInfo('SCGX').datas.map(item => {
                    return (
                      <Option key={item.BaseCode} value={item.BaseCode}>
                        {item.BaseCnName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={getFormItemInfo('SCSS').Label}
                name="SCSS"
                rules={[
                  {
                    required: true,
                    message: '不能为空',
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  allowClear
                  onChange={value => {
                    form.setFieldsValue({ PFY: undefined });
                    if (!value) {
                      setPFYDataList([]);
                    } else {
                      // 匹配PFY数据源
                      let filterPFYData = getFormItemInfo('PFY').datas.filter(
                        item => item.ParentNode === value,
                      );
                      setPFYDataList(filterPFYData);
                    }
                  }}
                >
                  {SCSSDataList.map(item => {
                    return (
                      <Option key={item.BaseCode} value={item.BaseCode}>
                        {item.BaseCnName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={getFormItemInfo('PFY').Label}
                name="PFY"
                rules={[
                  {
                    required: true,
                    message: '不能为空',
                  },
                ]}
              >
                <Select placeholder="请选择" allowClear>
                  {PFYDataList.map(item => {
                    return (
                      <Option key={item.BaseCode} value={item.BaseCode}>
                        {item.BaseCnName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        );
      default:
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无工艺信息"/>
        break;
    }
  };

  // 验证表单
  const validateFields = async () => {
    try {
      const values = await form.validateFields();
      return true;
    } catch (errorInfo) {
      message.warning('请输入完整的数据');
      return false;
    }
  };

  // 提交表单
  const onSubmit = _dgimn => {
    let values = form.getFieldsValue();
    console.log('_dgimn', _dgimn || DGIMN);
    // let err = form.getFieldError();
    // console.log('err', err)
    dispatch({
      type: 'point/AddOrUptCraftByPoint',
      payload: {
        dgimn: _dgimn || DGIMN,
        ...values,
      },
    });
  };
  console.log('craftDatas', craftDatas);
  return (
    <Spin spinning={getLoading}>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ paddingTop: '10px' }}
        {...formLayout}
        initialValues={{
          ...craftDatas,
        }}
        // onFinish={onFinish}
        // autoComplete="off"
      >
        {renderFormItemByIndustry()}
      </Form>
    </Spin>
  );
};

export default connect(dvaPropsData)(ProcessInfo);
