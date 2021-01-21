import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Breadcrumb } from 'antd';
import config from '@/config'
import defaultSettings from '../../../config/defaultSettings'
import webConfig from '../../../public/webConfig'

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  pageHeaderRender = (pageHeaderWrapperProps) => {
    if (pageHeaderWrapperProps.unfoldMenuList.length) {
      let currentMenu = pageHeaderWrapperProps.unfoldMenuList.find(item => item.path === location.pathname)
      // url和菜单能匹配到
      if (currentMenu) {
        // 面包屑名称
        let breadcrumbNames = currentMenu.breadcrumbNames;
        // 面包屑地址
        let breadcrumbPaths = currentMenu.parentUrl.split(',');
        return <div className="ant-page-header">
          <div className="ant-page-header-heading">
            <div className="ant-page-header-heading-title">
              {this.props.title || pageHeaderWrapperProps.title}
            </div>
          </div>
          <Breadcrumb>
            {
              breadcrumbNames.split('/').map((item, index) => {
                if (item.breadcrumbName !== "首页") {
                  return <Breadcrumb.Item key={breadcrumbPaths[index]}>
                    <a href={breadcrumbPaths[index]}>{item}</a>
                  </Breadcrumb.Item>
                }
              })
            }
            {
              this.props.title ?
                <Breadcrumb.Item key={this.props.title}>
                  <a>{this.props.title}</a>
                </Breadcrumb.Item>
                : ""
            }
          </Breadcrumb>
        </div>
      } else if (pageHeaderWrapperProps.breadcrumb.routes) {
        return <div className="ant-page-header">
          <div className="ant-page-header-heading">
            <div className="ant-page-header-heading-title">
              {this.props.title || (pageHeaderWrapperProps.breadcrumb.routes[pageHeaderWrapperProps.breadcrumb.routes.length - 1].breadcrumbName)}
            </div>
          </div>
          <Breadcrumb>
            {
              pageHeaderWrapperProps.breadcrumb.routes.map(item => {
                if (item.breadcrumbName !== "首页") {
                  return <Breadcrumb.Item key={item.path}>
                    <a href={item.path}>{item.breadcrumbName}</a>
                  </Breadcrumb.Item>
                }
              })
            }
            {
              this.props.title ?
                <Breadcrumb.Item key={this.props.title}>
                  <a>{this.props.title}</a>
                </Breadcrumb.Item>
                : ""
            }
          </Breadcrumb>
        </div>
      }
    }
  }

  render() {
    // 多标签 - 不显示面包屑
    if (config.isShowTabs && defaultSettings.layout === "sidemenu") {
      return <>{this.props.children}</>
    }
    return (
      <PageHeaderWrapper
        title={this.props.title}
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

export default index;
