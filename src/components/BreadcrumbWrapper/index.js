import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import config from '@/config'
import defaultSettings from '../../../config/defaultSettings'
import webConfig from '../../../public/webConfig'

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // 多标签 - 不显示面包屑
    if (config.isShowTabs && defaultSettings.layout === "sidemenu") {
      return <>{this.props.children}</>
    }
    return (
      <PageHeaderWrapper title={this.props.title} className={this.props.hideBreadcrumb ? "hideBreadcrumb" : ""}>
        {this.props.children}
      </PageHeaderWrapper>
    );
  }
}

export default index;