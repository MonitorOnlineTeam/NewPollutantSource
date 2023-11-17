import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Spin } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import router from 'umi/router';
import { Input, Tabs, Button, Checkbox, Row, Col, Alert } from 'antd';


@connect(state => ({
}))
export default class hrefLogin extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // const { username, pwd } = this.props.match.params;
    const hostname = window.location.hostname;
    const begin = hostname.split(".")[0];
    begin !== "61" ? this.props.dispatch({
      type: "userLogin/login",
      payload: {
        userName: "datays",
        password: "Password@123@",
        redirctUrl:'/newestHome'
      }
    }) : router.push("/user/login")
    this.props.dispatch({
      type: 'login/newLogin',
      payload: {
        userName: 'datays',
        password: 'Password@123@',
      },
      // callback: () => {
      //   router.push(redirect);
      // },
    });
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
