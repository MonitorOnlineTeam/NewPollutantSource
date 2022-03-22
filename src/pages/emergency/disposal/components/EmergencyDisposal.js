import React, { PureComponent } from 'react';
import { Modal, Form, Row, Col, Card, Input, Button, Radio, Spin, message, Select, Space, DatePicker, InputNumber } from "antd"
import moment from 'moment';
import { connect } from 'dva';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, emergency }) => ({
  loading: loading.effects['emergency/getRelationTable'],
}))
class EmergencyDisposal extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      dataInfo: {},
    };

    this._SELF_ = {
      AlarmInfoCode: this.props.AlarmInfoCode
    }
  }

  componentDidMount() {
    //获取数据
    this._dispatch(
      'emergency/getRelationTable',
      {
        AlarmInfoCode: this._SELF_.AlarmInfoCode, Type: 11
      },
      (res) => {
        this.setState({
          dataInfo: res.length ? res[0] : {}
        })
      }
    )
  }

  _dispatch = (actionType, payload, callback) => {
    this.props.dispatch({
      type: actionType,
      payload: payload || {},
      callback: (res) => {
        callback && callback(res)
      }
    })
  }

  // 保存甄别基本信息
  onSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      console.log("values=", values)
      let postData = {
        Dispose: {
          ...values,
          // DisposeTime: moment
          DisposeCode: this.state.dataInfo.DisposeCode
        },
        AlarmInfoCode: this._SELF_.AlarmInfoCode,
        Type: 11,
      }
      this._dispatch('emergency/saveSamplingData', postData)
    })
    // let values = this.formRef.current.getFieldsValue();
  }

  render() {
    const { loading } = this.props;
    const { AlarmInfoCode } = this._SELF_;
    const { dataInfo } = this.state;

    return (
      <Card bodyStyle={{ paddingBottom: 20, paddingTop: 20, overflow: 'auto', height: 'calc(100vh - 200px)' }} title="应急处置信息" extra={
        <Space>
          <Button type="primary" onClick={() => this.onSubmit()}>保存</Button>
          <Button onClick={() => history.back()}>返回</Button>
        </Space>
      }>
        {
          loading ? <div className="example"><Spin></Spin></div> :
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
              ref={this.formRef}
              // layout="horizontal"
              scrollToFirstError
              initialValues={{
                ...dataInfo,
                DisposeTime: moment(dataInfo.DisposeTime)
              }}
            // onValuesChange={onFormLayoutChange}
            // size={componentSize}
            >
              <Row gutter={[0, 12]}>
                <Col span={12}>
                  <Form.Item
                    label="责任方"
                    name="Responsible"
                    rules={[{ required: true, message: '请输入责任方!' }]}
                  >
                    <Input placeholder="请输入责任方" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="处置单位"
                    name="DisposeUnit"
                  >
                    <Input placeholder="请输入处置单位" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="处置时间"
                    name="DisposeTime"
                  >
                    {/* <RangePicker showTime /> */}
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="处置费用（万）"
                    name="DisposeCost"
                  >
                    <InputNumber placeholder="请输入处置费用（万）" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 19 }}
                    label="处置方式"
                    name="DisposeMethod"
                  >
                    <TextArea placeholder="请输入处置方式" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 19 }}
                    label="费用来源"
                    name="CostFrom"
                  >
                    <TextArea placeholder="请输入费用来源" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 19 }}
                    label="处置结果"
                    name="DisposeResult"
                  >
                    <TextArea placeholder="请输入处置结果" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
        }
      </Card>
    );
  }
}

export default EmergencyDisposal;