import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

@connect(state => ({
  configInfo: global.configInfo,
}))
export default class AutoLogin extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.login();
  }

  login = () => {
    const { redirect } = this.props.location.query;
    const { ID } = this.props.match.params;
    console.log('this.props', this.props);
    // debugger
    this.props.dispatch({
      type: 'userLogin/login',
      payload: {
        userName: 'system',
        password: 'P@ssw0rd_!@#$%',
        butRedirct: true,
      },
    });

    this.props.dispatch({
      type: 'login/newLogin',
      payload: {
        userName: 'system',
        password: 'P@ssw0rd_!@#$%',
      },
      callback: () => {
        router.push(redirect);
      },
    });
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (JSON.stringify(this.props.configInfo) !== JSON.stringify(prevProps.configInfo)) {
  //     this.login();
  //   }
  // }

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
