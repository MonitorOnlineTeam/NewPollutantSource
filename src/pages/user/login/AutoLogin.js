import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

@connect(state => ({
  configInfo: global.configInfo,
}))
export default class AutoLogin extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (window.configInfo) {
      this.login();
    }
  }

  login = () => {
    const { username, password } = this.props.location.query;
    this.props.dispatch({
      type: "userLogin/login",
      payload: {
        userName: username || "system",
        password: password || "system",
      }
    })
  }

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
          justifyContent: 'center'
        }}
        size="large"
      />
    )
  }
}
