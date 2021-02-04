import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Breadcrumb } from 'antd';
import config from '@/config'
import defaultSettings from '../../../config/defaultSettings'
import webConfig from '../../../public/webConfig'
import { connect } from "dva"


@connect(({ navigationtree }) => ({
  selectTreeItem: navigationtree.pointInfo,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTreeItem: {}
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectTreeItem !== this.props.selectTreeItem) {
      this.setState({
        selectTreeItem: this.props.selectTreeItem
      })
    }
  }

  pageHeaderRender = (pageHeaderWrapperProps) => {
    const { selectTreeItem } = this.state;
    console.log('selectTreeItem=', selectTreeItem)
    if (pageHeaderWrapperProps.unfoldMenuList.length) {
      let currentMenu = pageHeaderWrapperProps.unfoldMenuList.find(item => item.path === location.pathname)
      // url和菜单能匹配到
      if (currentMenu) {
        // 面包屑名称
        let breadcrumbNames = currentMenu.breadcrumbNames;
        // 面包屑地址
        let breadcrumbPaths = currentMenu.parentUrl.split(',');
        return <div className="ant-page-header">
          当前位置：
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
          {(selectTreeItem && selectTreeItem.entName && selectTreeItem.pointName) ? `【${selectTreeItem.entName} - ${selectTreeItem.pointName}】` : ""}
        </div>
      } else if (pageHeaderWrapperProps.breadcrumb.routes) {
        return <div className="ant-page-header">
          当前位置：
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
          {(selectTreeItem && selectTreeItem.entName && selectTreeItem.pointName) ? `【${selectTreeItem.entName} - ${selectTreeItem.pointName}】` : ""}
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
        title={null}
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
