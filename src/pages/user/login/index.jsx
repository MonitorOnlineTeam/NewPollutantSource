import { Alert, Checkbox, Button, message, Modal, Row } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import LoginComponents from './components/Login';
import Agreement from './components/Agreement';
import styles from './style.less';
import config from '@/config';
import router from 'umi/router';
import ResetPassword from '../resetPassword'

const { Tab, UserName, Password, Mobile, Captcha, VerificaCode, Submit } = LoginComponents;
@connect(({ userLogin, global, loading }) => ({
  userLogin,
  configInfo: global.configInfo,
  // submitting: loading.effects['userLogin/login'],
  submitting: userLogin.loginLoading,
  isAgree: userLogin.isAgree,
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'web',
    autoLogin: true,
    verificaCode: undefined,
    agreementVisible: false,
    loginSuccess: true,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  // 登录
  handleSubmit = (err, values) => {
    const { type } = this.state;
    const { isAgree } = this.props;
    // ;
    console.log('handleSubmit-values=', values);
    if (!err) {
      const { dispatch } = this.props;
      if (!this.state.loginSuccess) {
        if (values.verificaCode.toLowerCase() != verificaCode) {
          message.error('请输入正确的验证码');
          this.child && this.child.current && this.child.current.click(); //刷新验证码
          return;
        }
      }
      if (!isAgree) {
        message.error('请勾选阅读并接受用户监测数据许可协议');
        return;
      }
      let payload = {
        ...values,
        IsAgree: isAgree,
        LoginType: type,
      };
      if (type === 'phone') {
        payload.userName = values.mobile;
        payload.password = values.captcha;
      }

      dispatch({
        type: 'userLogin/login',
        payload: payload,
        callback: isSuccess => {
          if (!isSuccess) {
            this.child && this.child.current && this.child.current.click();
          } //请求错误刷新验证码
          this.setState({ loginSuccess: isSuccess });
          this.clearCommonData();
        },
      });
    }
  };
  clearCommonData = () => {
    //清除公共组件数据
    const { dispatch } = this.props;
    dispatch({
      type: 'common/updateState',
      payload: {
        noFilterRegionList: [],
        testRegionList: [],
        ctRegionList: [],
        operationUserList: [],
        inspectorUserList: [],
        roleList: [],
        entList: [],
        enableEntList:[],
        noFilterEntList: [],
        atmoStationList: [],
      },
    });
    dispatch({
      type: 'autoForm/updateState',
      payload: { regionList: [] },
    });
    dispatch({
      type: 'operations/updateState',
      payload: { operationCompanyList: [] },
    });
  };
  onTabChange = type => {
    this.setState({
      type,
    });
  };

  // 发送验证码
  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          console.log('values=', values);
          const { dispatch } = this.props;
          dispatch({
            type: 'userLogin/getCaptcha',
            payload: {
              UserAccount: values.mobile,
            },
          })
            // .then(resolve)
            .then(() => {
              if (this.props.userLogin.status !== 'error') {
                resolve();
              }
            })
            .catch(reject);
        }
      });
    });
  clearData = () => {
    // 系统列表数据和用户信息 清除
    const { dispatch } = this.props;
    Cookie.remove(config.cookieName);
    Cookie.remove('currentUser');
    Cookie.remove('newToken');
    Cookie.remove('sysMenuId');
    sessionStorage.clear();
    dispatch({ type: 'global/updateState', payload: { sysPollutantTypeList: [] } });
  };

  reloadPage = () => {
    var version = document.getElementsByTagName('meta')['version'].content; //缓存问题处理
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/pageInfo.json?t=' + Date.now(), true);
    xhr.onreadystatechange = function() {
      if ((xhr.readyState == 4 && xhr.status == 200) || xhr.status == 304) {
        if (xhr.responseText && JSON.parse(xhr.responseText).version !== version) {
          if (window.location.href.indexOf('#reloaded') == -1) {
            location.href = location.href + '#reloaded';
            window.location.reload();
          }
        }
      }
    };
    xhr.send();
  };
  componentDidMount() {
    // this.reloadPage()
    this.timer = setInterval(() => {
      this.child && this.child.current && this.child.current.click(); // 3分钟刷新一次
    }, 1000 * 60 * 3);
    this.clearData();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'userLogin/changeLoginStatus',
      payload: { status: '', type: '', message: '' },
    });
    clearInterval(this.timer);
  }
  verificaCodeChange = code => {
    this.setState({ verificaCode: code });
  };
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

  render() {
    const {
      userLogin,
      submitting,
      configInfo,
      configInfo: { IsOpera },
    } = this.props;
    const { status, type: loginType, message, mobileMessage } = userLogin;
    const { type, autoLogin, agreementVisible, loginSuccess } = this.state;
    const provinceShow = configInfo?.IsShowProjectRegion; //是否为宝武
    // 是否显示手机号登录
    let IsPhoneLogin = configInfo.IsPhoneLogin === 'true';

    return (
      <div className={`${styles.main} ${IsPhoneLogin && styles.phone}`}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
          verificaCodeChange={this.verificaCodeChange}
          handleRef={ref => {
            this.child = ref;
          }}
        >
          <Tab key="web" tab="账户密码登录">
            {status === 'error' &&
              loginType === 'account' &&
              message &&
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
            {/* <Captcha
              name="verificationCode"
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
            />   */}
            {IsOpera && (
              <VerificaCode //运维 图片验证码
                name="verificaCode"
                loginSuccess={this.state.loginSuccess}
              />
            )}
          </Tab>
          {IsPhoneLogin && (
            <Tab key="phone" tab="手机号登录">
              {status === 'error' &&
                loginType === 'account' &&
                mobileMessage &&
                !submitting &&
                this.renderMessage(mobileMessage)}
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
                getCaptchaButtonText={'获取验证码'}
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
            </Tab>
          )}
          <Submit loading={submitting} style={{ marginTop: 0, marginBottom: 0 }}>
            登录
          </Submit>
          {type === 'web' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {!provinceShow && (
                <Checkbox
                  checked={this.props.isAgree}
                  onChange={e => {
                    this.props.dispatch({
                      type: 'userLogin/changeLoginStatus',
                      payload: { isAgree: e.target.checked },
                    });
                  }}
                >
                  阅读并接受
                  <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => {
                      this.setState({ agreementVisible: true });
                    }}
                  >
                    《用户监测数据许可协议》
                  </Button>
                </Checkbox>
              )}
              {/* <ResetPassword /> */}
            </div>
          )}
        </LoginComponents>
        <Modal
          footer={false}
          visible={agreementVisible}
          onCancel={() => {
            this.setState({ agreementVisible: false });
          }}
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
