import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Breadcrumb } from "antd"
import webConfig from '../../../public/webConfig'

class BreadcrumbWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  pageHeaderRender = (props) => {
    if (props.breadcrumb.routes) {
      return <div>
        当前位置：
        <Breadcrumb>
          {
            props.breadcrumb.routes.map(item => {
              return <Breadcrumb.Item>
                <a href={item.path}>{item.breadcrumbName}</a>
              </Breadcrumb.Item>
            })
          }
        </Breadcrumb>
        {this.props.extraName ? `【${this.props.extraName}】` : ""}
      </div>
    }
  }

  render() {
    let title = this.props.title + this.props.extraName
    return (
      <PageHeaderWrapper
        title={title}
        className={!webConfig.isShowBreadcrumb ? "hideBreadcrumb" : ""}
        pageHeaderRender={(PageHeaderWrapperProps) => {
          return this.pageHeaderRender(PageHeaderWrapperProps);
        }}
      >
        {this.props.children}
      </PageHeaderWrapper>
    );
  }
}

BreadcrumbWrapper.defaultProps = {
  extraName: "",
}

export default BreadcrumbWrapper;
