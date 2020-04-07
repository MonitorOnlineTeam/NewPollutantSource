import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import config from '@/config'

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if (config.isShowTabs) {
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