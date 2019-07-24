import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Spin } from 'antd';
import Cookie from 'js-cookie';

const FormItem = Form.Item;
const response = Cookie.get('currentUser');
let user = null;
if (response) {
  user = JSON.parse(response);
}

@connect(({ user, loading }) => ({
  isload: loading.effects['user/changepwd'],
}))
@Form.create()
class ChangePwdView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      showchangepwd: false,
    };
  }

  componentDidMount() {
    //this.props.onRef(this);
  }

  modifyshowchangepwd = () => {
    let showchangepwd = { showchangepwd: true };
    this.setState(showchangepwd);
  };

  sleep = numberMillis => {
    let now = new Date();
    let exitTime = now.getTime() + numberMillis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime) {
        return;
      }
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.changepwd();
      }
    });
  };

  changepwd = () => {
    const form = this.props.form;
    const oldpassword = form.getFieldValue('oldpassword');
    const password = form.getFieldValue('password');
    const confirm = form.getFieldValue('confirm');

    this.props.dispatch({
      type: 'user/changepwd',
      payload: { oldpassword, password, confirm },
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    const confirmDirty = this.state.confirmDirty || !!value;
    this.setState({ confirmDirty: confirmDirty });
  };

  // validateToOldPassword= (rule, value, callback) => {
  //   if (this.changepwd() == 0) {
  //     message.info('旧密码输入错误!');
  //     // callback('旧密码输入错误!');
  //   } else {
  //     // callback();
  //   }
  // }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次新密码输入不一致!');
    } else {
      callback();
    }
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 10 },
      },
    };
    const { getFieldDecorator } = this.props.form;

    const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
    const SCREEN_WIDTH = document.querySelector('body').offsetWidth;

    return (
      <Modal
        title="修改密码"
        visible={this.props.visible}
        width={SCREEN_WIDTH * 0.45}
        wrapClassName="vertical-center-modal"
        onCancel={() => {
          this.setState({
            showchangepwd: false,
          });
        }}
        onOk={this.handleSubmit}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="账户">
            <label value={user == null ? '' : `${user.User_Name}(${user.User_Account})`}>
              {user == null ? '' : `${user.User_Name}(${user.User_Account})`}
            </label>
          </FormItem>
          <FormItem {...formItemLayout} label="旧密码">
            {getFieldDecorator('oldpassword', {
              rules: [
                {
                  required: true,
                  message: '请输入旧密码!',
                },
              ],
            })(<Input type="password" placeholder="请输入旧密码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="新密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input type="password" placeholder="请输入新密码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="确认密码">
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请再次输入新密码!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(
              <Input
                type="password"
                onBlur={this.handleConfirmBlur}
                placeholder="请再次输入新密码"
              />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default ChangePwdView;
