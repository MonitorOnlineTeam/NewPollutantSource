import { Alert, Checkbox, message,Button,Modal,Row, } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';
import FileViewer from 'react-file-viewer';
const { Tab, UserName, Password, Mobile, Captcha,VerificaCode, Submit } = LoginComponents;
import Agreement from '../login/components/Agreement'
@connect(({ userLogin, loading }) => ({
  userLogin,
  submitting: loading.effects['userLogin/login'],
  isAgree:userLogin.isAgree,
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
    verificaCode:undefined,
    agreementVisible:false,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const { type,verificaCode, } = this.state;
    const { isAgree } = this.props;
    console.log('values=', values);

    if (!err) {
      const { dispatch } = this.props;
      if( verificaCode != values.verificaCode.toLowerCase() && verificaCode != values.verificaCode.toUpperCase()){
        message.error('请输入正确的验证码')
        this.child.current.click(); //刷新验证码
        return;
      }
      if(!isAgree){
        message.error('请阅读并勾选用户监测数据许可协议');
        return;
      }
      dispatch({
        type: 'userLogin/login',
        payload: { ...values,IsAgree:isAgree, type },
      });
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'userLogin/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
  verificaCodeChange=(code)=>{  
    console.log('验证码----------------------',code)
    this.setState({verificaCode:code})
  }
  render() {
    const { userLogin, submitting,isAgree, } = this.props;
    const { status, type: loginType, message } = userLogin;
    const { type, autoLogin,agreementVisible, } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
          verificaCodeChange={this.verificaCodeChange}
          handleRef={(ref) => {
            this.child = ref;
          }} 
        >
          <Tab
            key="account"
            tab="账户密码登录"
          >
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(message)}
            <UserName
              name="userName"
              placeholder="请输入用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            />
            <Password
              name="password"
              placeholder="请输入密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
              onPressEnter={() =>
                this.loginForm && this.loginForm.validateFields(this.handleSubmit)
              } 
            />
             <VerificaCode  //验证码
              name="verificaCode"
            />
          </Tab>
          {/* <Tab
            key="mobile"
            tab={formatMessage({
              id: 'user-login.login.tab-login-mobile',
            })}
          >
            {status === 'error' &&
              loginType === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({
                  id: 'user-login.login.message-invalid-verification-code',
                }),
              )}
            <Mobile
              name="mobile"
              placeholder={formatMessage({
                id: 'user-login.phone-number.placeholder',
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'user-login.phone-number.required',
                  }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: formatMessage({
                    id: 'user-login.phone-number.wrong-format',
                  }),
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder={formatMessage({
                id: 'user-login.verification-code.placeholder',
              })}
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={formatMessage({
                id: 'user-login.form.get-captcha',
              })}
              getCaptchaSecondText={formatMessage({
                id: 'user-login.captcha.second',
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'user-login.verification-code.required',
                  }),
                },
              ]}
            />
          </Tab> */}
          <div>

            {/* <a
              style={{
                float: 'right',
              }}
              href=""
            >
              <FormattedMessage id="user-login.login.forgot-password" />
            </a> */}
          </div>
          <Submit loading={submitting}>
            登录
          </Submit>
          {/* <div className={styles.other}>
            <FormattedMessage id="user-login.login.sign-in-with" />
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="user-login.login.signup" />
            </Link>
          </div> */}
         <Row justify='space-between' align='middle'>

           <Checkbox checked={isAgree} onChange={(e)=>{  this.props.dispatch({  type: 'userLogin/changeLoginStatus',payload: {  isAgree:e.target.checked   }});}}>
               阅读并接受<Button type='link'  style={{padding:0}} onClick={()=>{this.setState({agreementVisible:true})}}>《用户监测数据许可协议》</Button>
            </Checkbox>
            
             <Checkbox className={styles.autoLoginSty}  checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox> 
            </Row> 
        </LoginComponents>
        <Modal
        footer={false}
        visible={agreementVisible}
        onCancel={()=>{ this.setState({agreementVisible:false})}}
        width={'55%'}
        wrapClassName={styles.userAgreementSty}
      >
     <Agreement />
      </Modal>
      </div>
    );
  }
}

export default Login;
