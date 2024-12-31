import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import webConfig from '@public/webConfig';

@connect(state => ({
  configInfo: global.configInfo,
}))
export default class AutoLogin extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (window.configInfo) {
      this.login();
    }
  }

  login = () => {
    const { username, password, hideDropdown } = this.props.location.query;
    if (hideDropdown) {
      sessionStorage.setItem('hideDropdown', hideDropdown);
    }else{
      sessionStorage.removeItem('hideDropdown');
    }
    
    this.props.dispatch({
      type: 'userLogin/login',
      payload: {
        userName: username || webConfig.autoLoginUserInfo.username,
        password: password || webConfig.autoLoginUserInfo.password,
      },
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.props.configInfo) !== JSON.stringify(prevProps.configInfo)) {
      this.login();
    }
  }

  render() {
    return (
      <Spin
        style={{
          width: '100%',
          height: 'calc(100vh/2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        size="large"
      />
    );
  }
}
