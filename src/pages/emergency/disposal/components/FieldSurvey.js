import React, { PureComponent } from 'react';
import { Modal, Form, Row, Col, Card, Input, Button, Radio, Spin, message, Select, Space, DatePicker } from "antd"
import moment from 'moment';
import { connect } from 'dva';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, emergency }) => ({
  loading: loading.effects['emergency/getRelationTable'],
  dictionaryList: emergency.dictionaryList,
  dutyOneData: emergency.dutyOneData,
}))
class FieldSurvey extends PureComponent {
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
        AlarmInfoCode: this._SELF_.AlarmInfoCode, Type: 10
      },
      (res) => {
        this.setState({
          dataInfo: res.length ? res[0] : {}
        })
      }
    )
  }

  // 获取下拉列表数据
  getDictionaryList = () => {
    this._dispatch('emergency/getDictionaryList')
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
        ...values,
        Investigation: {
          ...values,
          InvestigationCode: this.state.dataInfo.InvestigationCode
        },
        AlarmInfoCode: this._SELF_.AlarmInfoCode,
        Type: 10,
      }
      this._dispatch('emergency/saveSamplingData', postData)
    })
    // let values = this.formRef.current.getFieldsValue();
  }

  render() {
    const { dutyOneData, loading, dictionaryList } = this.props;
    const { AlarmInfoCode } = this._SELF_;
    const { dataInfo } = this.state;

    return (
      <Card bodyStyle={{ paddingBottom: 20, paddingTop: 10, overflow: 'auto', height: 'calc(100vh - 200px)' }} title="现场调查信息" extra={
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
                ...dataInfo
              }}
            // onValuesChange={onFormLayoutChange}
            // size={componentSize}
            >
              <Row gutter={[0, 6]}>
                <Col span={12}>
                  <Form.Item
                    label="现场处置人员"
                    name="DisposeUser"
                    rules={[{ required: true, message: '请输入现场处置人员!' }]}
                  >
                    <Input placeholder="请输入事件名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="天气"
                    name="Weather"
                    rules={[{ required: true, message: '请输入天气!' }]}
                  >
                    <Input placeholder="请输入天气" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="风速（m/s）"
                    name="WindSpeed"
                  >
                    <Input placeholder="请输入风速（m/s）" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="风向"
                    name="WindDirection"
                  >
                    <Select placeholder="请选择风向">
                      <Option value={'1'}>东</Option>
                      <Option value={'2'}>南</Option>
                      <Option value={'3'}>西</Option>
                      <Option value={'4'}>北</Option>
                      <Option value={'5'}>东南</Option>
                      <Option value={'6'}>东北</Option>
                      <Option value={'7'}>西南</Option>
                      <Option value={'8'}>西北</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="风向切变角（度）"
                    name="WindAngle"
                  >
                    <Input placeholder="请输入风向切变角（度）" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="大气垂直定度"
                    name="Stability"
                  >
                    <Select placeholder="请选择大气垂直定度">
                      <Option value={'1'}>稳定状态</Option>
                      <Option value={'2'}>不稳定状态</Option>
                      <Option value={'3'}>中性平衡状态</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="水文"
                    name="Hydrology"
                  >
                    <TextArea placeholder="请输入水文" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="环境敏感点"
                    name="SensitivePoints"
                  >
                    <TextArea placeholder="请输入环境敏感点" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="地形调查"
                    name="EnvironFunc"
                  >
                    <TextArea placeholder="请输入地形调查" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="事件调查"
                    name="Describe"
                  >
                    <TextArea placeholder="请输入事件调查" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="环境污染物"
                    name="SensitivePollutant"
                    rules={[{ required: true, message: '环境污染物不能为空!' }]}
                  >
                    <TextArea placeholder="请输入环境污染物" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="事故发生经过"
                    name="Happened"
                    rules={[{ required: true, message: '事故发生经过不能为空!' }]}
                  >
                    <TextArea placeholder="请输入事故发生经过" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="现场处置建议"
                    name="Suggestions"
                    rules={[{ required: true, message: '现场处置建议不能为空!' }]}
                  >
                    <TextArea placeholder="请输入现场处置建议" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
        }
      </Card>
    );
  }
}

export default FieldSurvey;