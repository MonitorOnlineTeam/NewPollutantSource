import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router'; // 这里应该使用 antd 的 404 result 组件，
import { connect } from 'dva'
import Cookie from 'js-cookie'

// 但是还没发布，先来个简单的。

const NoFoundPage = (props) => {
  const response = props.currentMenu;
  
  let defaultNavigateUrl;
  if(response&&response[0]){
    defaultNavigateUrl = response[0].children && response[0].children.length ? response[0].children[0].NavigateUrl : response[0].NavigateUrl;
  }
 return <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button type="primary" onClick={() => router.push(defaultNavigateUrl? defaultNavigateUrl : '/404')}>
        Back Home
      </Button>
    }
  ></Result>
  };

export default connect(({ user }) => ({
  currentMenu: user.currentMenu,
}))(NoFoundPage);