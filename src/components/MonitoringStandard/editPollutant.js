import React, { Component } from 'react';
import {
  Col,
  Row,
  Form,
  message,
  Select,
  Card,
  InputNumber,
  Input,
  Button,
  Divider,
  Collapse,
  Icon,
  Radio,
} from 'antd';
import { connect } from 'dva';
import { isNullOrUndefined } from 'util';

const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;
@connect(({ loading, standardLibrary }) => ({
  isloading: loading.effects['standardLibrary/getMonitorPointPollutantDetails'],
  btnisloading: loading.effects['standardLibrary/editmonitorpointPollutant'],
  reason: standardLibrary.reason,
  requstresult: standardLibrary.requstresult,
  PollutantList: standardLibrary.PollutantList,
  editpollutant: standardLibrary.editpollutant,
}))
@Form.create()
class EditPollutant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PollutantCode: null,
      DGIMN: null,
    };
  }

  componentWillMount() {
    this.setState({
      PollutantCode: this.props.pid,
      DGIMN: this.props.DGIMN,
    });
    this.props.onRef(this);
    const Id = this.props.pid;
    const { DGIMN } = this.props;
    if (Id !== null && DGIMN !== null) {
      this.props.dispatch({
        type: 'standardLibrary/getMonitorPointPollutantDetails',
        payload: {
          DGIMN,
          PollutantCode: Id,
          callback: () => {
            console.log('this.props.editpollutant====', this.props.editpollutant);
            this.props.form.setFieldsValue({
              UpperLimit: this.props.editpollutant.UpperLimit,
              LowerLimit: this.props.editpollutant.LowerLimit,
              AlarmContinuityCount: this.props.editpollutant.AlarmContinuityCount,
              OverrunContinuityCount: this.props.editpollutant.OverrunContinuityCount,
              ZeroContinuityCount: this.props.editpollutant.ZeroContinuityCount,
              SerialContinuityCount: this.props.editpollutant.SerialContinuityCount,
              AlarmType: this.props.editpollutant.AlarmType,
              IsStatisti: this.props.editpollutant.IsStatisti,
              AlarmDescription: this.props.editpollutant.AlarmDescription,
              AbnormalUpperLimit: this.props.editpollutant.AbnormalUpperLimit,
              AbnormalLowerLimit: this.props.editpollutant.AbnormalLowerLimit,
              ExceptionType: this.props.editpollutant.ExceptionType == '' ? [] : this.props.editpollutant.ExceptionType.split(','),
            });
          },
        },
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    let flag = true;
    this.props.form.validateFieldsAndScroll((err, values) => {
      debugger;
      console.log('values=====', values);
      const that = this;
      if (this.state.PollutantCode !== null && this.state.DGIMN !== null) {
        if (values.AbnormalUpperLimit < values.AbnormalLowerLimit) {
          message.error('错误：检出上限小于检出下线！', 3).then(() => {
            flag = false;
          });
          flag = false;
        } else {
          flag = true;
        }
        if (!err && flag === true) {
          that.props.dispatch({
            type: 'standardLibrary/editmonitorpointPollutant',
            payload: {
              PollutantCode: this.state.PollutantCode,
              DGIMN: this.state.DGIMN,
              AlarmType: values.AlarmType,
              UpperLimit: values.UpperLimit === isNullOrUndefined ? 0 : values.UpperLimit,
              LowerLimit: values.LowerLimit === isNullOrUndefined ? 0 : values.LowerLimit,
              AbnormalUpperLimit:
                values.AbnormalUpperLimit === isNullOrUndefined ? 0 : values.AbnormalUpperLimit,
              AbnormalLowerLimit:
                values.AbnormalLowerLimit === isNullOrUndefined ? 0 : values.AbnormalLowerLimit,
              AlarmContinuityCount:
                values.AlarmContinuityCount === isNullOrUndefined ? 0 : values.AlarmContinuityCount,
              OverrunContinuityCount:
                values.OverrunContinuityCount === isNullOrUndefined
                  ? 0
                  : values.OverrunContinuityCount,
              ZeroContinuityCount:
                values.ZeroContinuityCount === isNullOrUndefined ? 0 : values.ZeroContinuityCount,
              SerialContinuityCount:
                values.SerialContinuityCount === isNullOrUndefined
                  ? 0
                  : values.SerialContinuityCount,
              AlarmDescription: values.AlarmDescription,
              IsStatisti: values.IsStatisti,
              ExceptionType: values.ExceptionType.length > 0 ? values.ExceptionType.join(',') : '',
              callback: res => {
                if (res.IsSuccess) {
                  this.props.oncancel();
                  message.success('编辑成功', 1);
                } else {
                  message.error(res.Message);
                }
              },
            },
          });
        }
      }
    });
  };

  success = Id => {
    message.success('保存成功', 3);
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { btnisloading } = this.props;
    const { TextArea } = Input;
    const customPanelStyle = {
      background: '#ffff',
      borderRadius: 4,
      marginBottom: 5,
      border: 0,
      overflow: 'hidden',
    };
    return (
      <Card bordered={false} loading={this.props.isloading}>
        <Form onSubmit={this.handleSubmit}>
          <Collapse
            bordered={false}
            defaultActiveKey={['1', '2']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            <Panel header="报警设置" key="1" style={customPanelStyle}>
              <Row gutter={48}>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="报警类型">
                    {getFieldDecorator('AlarmType', {
                      initialValue: undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择报警类型!',
                        },
                      ],
                    })(
                      <Select placeholder="请选择报警类型">
                        <Option value="0">无报警</Option>
                        <Option value="1">上限报警</Option>
                        <Option value="2">下限报警</Option>
                        <Option value="3">区间报警</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="报警连续计数">
                    {getFieldDecorator('AlarmContinuityCount', {
                      initialValue: 1,
                    })(<InputNumber min={0} max={10000} step={1} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={48}>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="报警上限">
                    {getFieldDecorator('UpperLimit', {
                      initialValue: 0,
                    })(<InputNumber min={0} max={10000} step={0.1} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="报警下限">
                    {getFieldDecorator('LowerLimit', {
                      initialValue: 0,
                    })(<InputNumber min={0} max={10000} step={0.1} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={48}>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="报警描述">
                    {getFieldDecorator('AlarmDescription')(
                      <TextArea rows={2} style={{ width: '100' }} maxLength={50} />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="是否参与考核">
                    {getFieldDecorator('IsStatisti', {
                      initialValue: 1,
                    })(
                      <Radio.Group>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
            <Panel header="异常设置" key="2" style={customPanelStyle}>
              <Row>
                <Col span={24}>
                  <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="异常类型">
                    {getFieldDecorator('ExceptionType', {
                    })(
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="请选择异常类型"
                      >
                        <Option value="1">零值异常</Option>
                        <Option value="2">超量程异常</Option>
                        <Option value="3">连续值异常</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="检出上限">
                    {getFieldDecorator('AbnormalUpperLimit', {
                      initialValue: 0,
                    })(<InputNumber min={-100000} max={100000} step={1} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="检出下限">
                    {getFieldDecorator('AbnormalLowerLimit', {
                      initialValue: 0,
                    })(<InputNumber min={-100000} max={100000} step={1} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="零值计数">
                    {getFieldDecorator('ZeroContinuityCount', {
                      initialValue: 1,
                    })(<InputNumber min={0} max={100000} step={1} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="连续值计数">
                    {getFieldDecorator('SerialContinuityCount', {
                      initialValue: 2,
                    })(<InputNumber min={0} max={100000} step={1} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="超限计数">
                    {getFieldDecorator('OverrunContinuityCount', {
                      initialValue: 1,
                    })(<InputNumber min={0} max={100000} step={1} />)}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          </Collapse>
          <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
            <Button type="primary" htmlType="submit" loading={btnisloading}>
              保存
            </Button>
            <Divider type="vertical" />
            <Button type="dashed" onClick={() => this.props.oncancel()}>
              返回
            </Button>
          </Divider>
        </Form>
      </Card>
    );
  }
}
export default EditPollutant;
