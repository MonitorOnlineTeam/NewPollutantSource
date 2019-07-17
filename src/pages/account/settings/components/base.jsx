// import { Button, Form, Input, Select, Upload, message } from 'antd';
// import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
// import React, { Component, Fragment } from 'react';
// import { connect } from 'dva';
// import GeographicView from './GeographicView';
// import PhoneView from './PhoneView';
// import styles from './BaseView.less';
// const FormItem = Form.Item;
// const { Option } = Select; // 头像组件 方便以后独立，增加裁剪之类的功能

// const AvatarView = ({ avatar }) => (
//   <Fragment>
//     <div className={styles.avatar_title}>
//       <FormattedMessage id="account-settings.basic.avatar" defaultMessage="Avatar" />
//     </div>
//     <div className={styles.avatar}>
//       <img src={avatar} alt="avatar" />
//     </div>
//     <Upload fileList={[]}>
//       <div className={styles.button_view}>
//         <Button icon="upload">
//           <FormattedMessage
//             id="account-settings.basic.change-avatar"
//             defaultMessage="Change avatar"
//           />
//         </Button>
//       </div>
//     </Upload>
//   </Fragment>
// );

// const validatorGeographic = (_, value, callback) => {
//   const { province, city } = value;

//   if (!province.key) {
//     callback('Please input your province!');
//   }

//   if (!city.key) {
//     callback('Please input your city!');
//   }

//   callback();
// };

// const validatorPhone = (rule, value, callback) => {
//   const values = value.split('-');

//   if (!values[0]) {
//     callback('Please input your area code!');
//   }

//   if (!values[1]) {
//     callback('Please input your phone number!');
//   }

//   callback();
// };

// @connect(({ accountSettings }) => ({
//   currentUser: accountSettings.currentUser,
// }))
// class BaseView extends Component {
//   view = undefined;

//   componentDidMount() {
//     this.setBaseInfo();
//   }

//   setBaseInfo = () => {
//     const { currentUser, form } = this.props;

//     if (currentUser) {
//       Object.keys(form.getFieldsValue()).forEach(key => {
//         const obj = {};
//         obj[key] = currentUser[key] || null;
//         form.setFieldsValue(obj);
//       });
//     }
//   };

//   getAvatarURL() {
//     const { currentUser } = this.props;

//     if (currentUser) {
//       if (currentUser.avatar) {
//         return currentUser.avatar;
//       }

//       const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
//       return url;
//     }

//     return '';
//   }

//   getViewDom = ref => {
//     this.view = ref;
//   };
//   handlerSubmit = event => {
//     event.preventDefault();
//     const { form } = this.props;
//     form.validateFields(err => {
//       if (!err) {
//         message.success(
//           formatMessage({
//             id: 'account-settings.basic.update.success',
//           }),
//         );
//       }
//     });
//   };

//   render() {
//     const {
//       form: { getFieldDecorator },
//     } = this.props;
//     return (
//       <div className={styles.baseView} ref={this.getViewDom}>
//         <div className={styles.left}>
//           <Form layout="vertical" hideRequiredMark>
//             <FormItem
//               label={formatMessage({
//                 id: 'account-settings.basic.email',
//               })}
//             >
//               {getFieldDecorator('email', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage(
//                       {
//                         id: 'account-settings.basic.email-message',
//                       },
//                       {},
//                     ),
//                   },
//                 ],
//               })(<Input />)}
//             </FormItem>
//             <FormItem
//               label={formatMessage({
//                 id: 'account-settings.basic.nickname',
//               })}
//             >
//               {getFieldDecorator('name', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage(
//                       {
//                         id: 'account-settings.basic.nickname-message',
//                       },
//                       {},
//                     ),
//                   },
//                 ],
//               })(<Input />)}
//             </FormItem>
//             <FormItem
//               label={formatMessage({
//                 id: 'account-settings.basic.profile',
//               })}
//             >
//               {getFieldDecorator('profile', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage(
//                       {
//                         id: 'account-settings.basic.profile-message',
//                       },
//                       {},
//                     ),
//                   },
//                 ],
//               })(
//                 <Input.TextArea
//                   placeholder={formatMessage({
//                     id: 'account-settings.basic.profile-placeholder',
//                   })}
//                   rows={4}
//                 />,
//               )}
//             </FormItem>
//             <FormItem
//               label={formatMessage({
//                 id: 'account-settings.basic.country',
//               })}
//             >
//               {getFieldDecorator('country', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage(
//                       {
//                         id: 'account-settings.basic.country-message',
//                       },
//                       {},
//                     ),
//                   },
//                 ],
//               })(
//                 <Select
//                   style={{
//                     maxWidth: 220,
//                   }}
//                 >
//                   <Option value="China">中国</Option>
//                 </Select>,
//               )}
//             </FormItem>
//             <FormItem
//               label={formatMessage({
//                 id: 'account-settings.basic.geographic',
//               })}
//             >
//               {getFieldDecorator('geographic', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage(
//                       {
//                         id: 'account-settings.basic.geographic-message',
//                       },
//                       {},
//                     ),
//                   },
//                   {
//                     validator: validatorGeographic,
//                   },
//                 ],
//               })(<GeographicView />)}
//             </FormItem>
//             <FormItem
//               label={formatMessage({
//                 id: 'account-settings.basic.address',
//               })}
//             >
//               {getFieldDecorator('address', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage(
//                       {
//                         id: 'account-settings.basic.address-message',
//                       },
//                       {},
//                     ),
//                   },
//                 ],
//               })(<Input />)}
//             </FormItem>
//             <FormItem
//               label={formatMessage({
//                 id: 'account-settings.basic.phone',
//               })}
//             >
//               {getFieldDecorator('phone', {
//                 rules: [
//                   {
//                     required: true,
//                     message: formatMessage(
//                       {
//                         id: 'account-settings.basic.phone-message',
//                       },
//                       {},
//                     ),
//                   },
//                   {
//                     validator: validatorPhone,
//                   },
//                 ],
//               })(<PhoneView />)}
//             </FormItem>
//             <Button type="primary" onClick={this.handlerSubmit}>
//               <FormattedMessage
//                 id="account-settings.basic.update"
//                 defaultMessage="Update Information"
//               />
//             </Button>
//           </Form>
//         </div>
//         <div className={styles.right}>
//           <AvatarView avatar={this.getAvatarURL()} />
//         </div>
//       </div>
//     );
//   }
// }

// export default Form.create()(BaseView);


import React, { Component } from 'react';
import Cookie from 'js-cookie';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  Radio,
  Avatar,
  Select,
  message,
  Divider
} from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const children = [];
for (let i = 0; i < 21; i++) {
  children.push(<Option key={i}>{i}</Option>);
}
@connect(({
  loading,
  user
}) => ({
  userinfoloading: loading.effects['user/getUserInfo'],
  requstresult: user.requstresult,
  editUser: user.editUser,

}))
@Form.create()
class BaseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: null,

    };
  }

  componentWillMount() {
    const userCookie = Cookie.get('token');
    if (userCookie) {
      const user = JSON.parse(userCookie);
      this.props.dispatch({
        type: 'user/getUserInfo',
        payload: {
          UserId: user.User_ID,
          callback: () => {

          }
        },
      });
    }
  }

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const that = this;
    const userCookie = Cookie.get('token');
    let user = '';
    if (userCookie) {
      user = JSON.parse(userCookie);
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        that.props.dispatch({
          type: 'userinfo/editpersonaluser',
          payload: {
            UserId: user.User_ID,
            UserName: values.User_Name,
            UserSex: values.User_Sex,
            Email: values.Email === undefined ? '' : values.Email,
            Phone: values.Phone === undefined ? '' : values.Phone,
            SendPush: values.SendPush === undefined ? '' : values.SendPush.join(','),
            AlarmType: values.AlarmType === undefined ? '' : values.AlarmType,
            AlarmTime: values.AlarmTime === undefined ? '' : values.AlarmTime.join(','),
            UserRemark: values.User_Remark === undefined ? '' : values.User_Remark,
            RolesId: this.state.role_id,
            UserAccount: this.state.user_account,
            DeleteMark: this.state.deletemark,
            callback: () => {
              if (this.props.requstresult === '1') {
                message.success('个人设置更新成功！');
              } else {
                message.error('错误');
              }
            }
          },
        });
      }
    });
  };

  render() {
    const {
      form,
      match,
      editUser
    } = this.props;
    const {
      getFieldDecorator
    } = form;
    // const {
    //   // User_Name: UserName = null,
    //   User_Sex: UserSex,
    //   Email,
    //   Phone,
    //   AlarmType,
    //   SendPush,
    //   AlarmTime,
    // } = editUser === null ? {} : editUser;
    debugger
    return (
      <div>
        <Card bordered={false} title="基本设置" style={{ height: 'calc(100vh - 160px)' }} loading={this.props.userinfoloading}>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={48} />
            {/* <Row gutter={48}>
              <Col span={8}>
                <FormItem
                  label="姓名"
                > {
                    getFieldDecorator('User_Name', {
                      initialValue: UserName,
                      rules: [{
                        required: true,
                        message: '请输入姓名!'
                      }]

                    })
                      (<Input placeholder="姓名" />)
                  }
                </FormItem>
              </Col>
              <Col span={8} />
            </Row>
            <Row gutter={48}>
              <Col span={8}>
                <FormItem
                  label="性别"
                > {
                    getFieldDecorator('User_Sex',
                      {
                        initialValue: UserSex || 1,
                      }
                    )(
                      <RadioGroup>
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                      </RadioGroup>
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={8}>
                <FormItem
                  label="E-mail"
                >
                  {getFieldDecorator('Email',
                    {
                      initialValue: Email,
                      rules: [{ type: 'email', message: '请输入正确的邮箱!' }]
                    })(<Input placeholder="E-mail" />
                    )}
                </FormItem>
              </Col>

            </Row>
            <Row gutter={48}>
              <Col span={8}>
                <FormItem
                  label="手机号"
                >
                  {getFieldDecorator('Phone',
                    {
                      initialValue: Phone,
                      rules: [{ pattern: /^1\d{10}$/, message: '请输入正确的手机号!' }]
                    })(<Input placeholder="手机号" />
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={8}>
                <FormItem
                  label="报警类型"
                >
                  {getFieldDecorator('AlarmType', {
                    initialValue: AlarmType || undefined
                  })(
                    <Select placeholder="请选择">
                      <Option value="1">实时报警</Option>
                      <Option value="2">定时报警</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={8}>
                <FormItem
                  label="报警时间"
                >
                  {getFieldDecorator('AlarmTime', {
                    initialValue: AlarmTime ? AlarmTime.split(',') : undefined
                  })(
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="请选择"
                    >
                      {children}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={8}>
                <FormItem
                  label="推送类型"
                >
                  {getFieldDecorator('SendPush', {
                    initialValue: SendPush ? SendPush.split(',') : undefined,
                  })(
                    <Select
                      mode="multiple"
                      placeholder="请选择"
                    >
                      <Option key={1}>短信推送</Option>
                      <Option key={2}>APP推送</Option>
                      <Option key={3}>网页推送</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row> */}


            <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
              <Button
                type="primary"
                htmlType="submit"
              >更新个人设置
                           </Button>
            </Divider>

          </Form>

        </Card>
      </div>
    );
  }
}
export default BaseView;

