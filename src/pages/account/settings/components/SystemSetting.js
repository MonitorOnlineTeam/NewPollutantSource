import React, { Component } from 'react';
import Cookie from 'js-cookie';
import { Form, Input, Button, Row, Col, Card, Radio, Switch, Select, message, Divider } from 'antd';
import { connect } from 'dva';
import { ceshi } from '../../../config';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
@connect(({ loading, login }) => ({
  loading: loading.effects['login/getLoginInfo'],
  pollutantTypeloading: loading.effects['login/getPollutantTypes'],
  getLoginInfoList: login.getLoginInfoList,
  pollutantTypeList: login.pollutantTypeList,
}))
@Form.create()
class SystemSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: null,
      display:
        this.props.getLoginInfoList != null
          ? this.props.getLoginInfoList.VideoServer === '1'
            ? 'block'
            : 'none'
          : 'none',
    };
  }

  componentWillMount = () => {
    const { dispatch } = this.props;
    //刚加载页面时获取一下登陆配置
    dispatch({
      type: 'login/getPollutantTypes',
    });
  };

  //获取下拉污染物类型数据
  SelectOptions = () => {
    const { pollutantTypeList } = this.props;
    const rtnVal = [];
    if (pollutantTypeList.length !== 0) {
      pollutantTypeList.map((item, key) => {
        rtnVal.push(<Option key={item.PollutantTypeCode}>{item.PollutantTypeName}</Option>);
      });
    }
    return rtnVal;
  };

  onChange = bool => {
    this.setState({
      display: bool ? 'block' : 'none',
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        that.props.dispatch({
          type: 'login/editLoginInfo',
          payload: {
            favicon: values.favicon,
            LoginLogo: values.LoginLogo,
            LoginMainTitle: values.LoginMainTitle,
            LoginSubtitle: values.LoginSubtitle,
            LoginFooterMessages: values.LoginFooterMessages,
            PollutantTypes: values.PollutantTypes,
            AppKey: values.AppKey,
            Secret: values.Secret,
            VideoServer: values.VideoServer ? '1' : '0',
            callback: requstresult => {
              if (requstresult === '1') {
                message.success('更新成功！');
              } else {
                message.error('更新失败！');
              }
            },
          },
        });
      }
    });
  };

  render() {
    const { form, getLoginInfoList, pollutantTypeloading } = this.props;
    const { getFieldDecorator } = form;
    const {
      favicon,
      LoginLogo,
      LoginMainTitle,
      LoginSubtitle,
      LoginFooterMessages,
      pTypeList,
      AppKey,
      Secret,
      VideoServer,
    } = getLoginInfoList === null ? {} : getLoginInfoList;
    //表单布局
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
    };
    return (
      <div>
        <Card
          bordered={false}
          title="系统设置"
          style={{ height: 'calc(100vh - 160px)' }}
          loading={this.props.loading}
        >
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="地址栏Logo">
                  {' '}
                  {getFieldDecorator('favicon', {
                    initialValue: favicon ? parseInt(favicon) : 0,
                  })(
                    <RadioGroup>
                      <Radio value={0}>隐藏</Radio>
                      <Radio value={1}>显示</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="登陆界面Logo">
                  {' '}
                  {getFieldDecorator('LoginLogo', {
                    initialValue: LoginLogo ? parseInt(LoginLogo) : 0,
                  })(
                    <RadioGroup>
                      <Radio value={0}>隐藏</Radio>
                      <Radio value={1}>显示</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="登陆界面主标题">
                  {getFieldDecorator('LoginMainTitle', {
                    initialValue: LoginMainTitle,
                  })(<Input placeholder="主标题" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="登陆界面副标题">
                  {getFieldDecorator('LoginSubtitle', {
                    initialValue: LoginSubtitle,
                  })(<Input placeholder="副标题" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="登陆底部说明">
                  {getFieldDecorator('LoginFooterMessages', {
                    initialValue: LoginFooterMessages,
                  })(<Input placeholder="说明" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="污染物类型配置">
                  {getFieldDecorator('PollutantTypes', {
                    initialValue: pTypeList,
                  })(
                    <Select
                      loading={pollutantTypeloading}
                      mode="multiple"
                      placeholder="污染物类型"
                      filterOption={true}
                    >
                      {this.SelectOptions()}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ display: this.state.display }}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="萤石云AppKey">
                  {getFieldDecorator('AppKey', {
                    initialValue: AppKey,
                  })(<Input placeholder="萤石云AppKey" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="萤石云Secret">
                  {getFieldDecorator('Secret', {
                    initialValue: Secret,
                  })(<Input placeholder="萤石云Secret" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="视频服务商">
                  {getFieldDecorator('VideoServer', {
                    initialValue: VideoServer === '1',
                    valuePropName: 'checked',
                  })(
                    <Switch
                      checkedChildren="萤石云"
                      unCheckedChildren="海康威视"
                      onChange={this.onChange}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Divider>
          </Form>
        </Card>
      </div>
    );
  }
}
export default SystemSetting;
