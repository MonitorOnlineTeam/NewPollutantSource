import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

@connect(state => ({
}))
export default class AutoLogin extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { username, password } = this.props.location.query;
    // const hostname = window.location.hostname;
    // const begin = hostname.split(".")[0];
    // begin !== "61" ? this.props.dispatch({
    //   type: "userLogin/login",
    //   payload: {
    //     userName: "system",
    //     password: "system",
    //     redirctUrl:'/homepage'
    //   }
    // }) : router.push("/user/login")

    this.props.dispatch({
      type: "userLogin/login",
      payload: {
        userName: username || "system",
        password: password || "system",
      }
    })
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
