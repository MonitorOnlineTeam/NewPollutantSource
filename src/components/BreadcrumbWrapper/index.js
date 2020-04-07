import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import config from '@/config'
import defaultSettings from '../../../config/defaultSettings'

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if (config.isShowTabs && defaultSettings.layout === "sidemenu") {
      return <>{this.props.children}</>
    }
    return (
      <PageHeaderWrapper title={this.props.title}>
        {this.props.children}
      </PageHeaderWrapper>
    );
  }
}

export default index;