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
    const { selectTreeItem } = this.state;
    if (pageHeaderWrapperProps&&pageHeaderWrapperProps.unfoldMenuList&&pageHeaderWrapperProps.unfoldMenuList.length) {
      let currentMenu = pageHeaderWrapperProps.unfoldMenuList.find(item => item.path.split('?')[0] === location.pathname.split('?')[0])
      // url和菜单能匹配到
      if (currentMenu) {
        // 面包屑名称
        let breadcrumbNames = currentMenu.breadcrumbNames;
        // 面包屑地址
        let breadcrumbPaths = currentMenu.parentUrl&&currentMenu.parentUrl.split(',');
        return <div className="ant-page-header">
          当前位置：
          <Breadcrumb>
            {
              breadcrumbNames.split('/').map((item, index) => {
                index = breadcrumbNames.split('/').length - 1 ; //都默认最后一个
                if (item.breadcrumbName !== "首页") {
                  return <Breadcrumb.Item key={breadcrumbPaths[index]}>
                    <a href={breadcrumbPaths[index]}>{item}</a>
                  </Breadcrumb.Item>
                }
              })
            }
             {/* {
              this.props.title ? //路由首页面 title
                <Breadcrumb.Item key={this.props.title}>
                  <a>{this.props.title}</a>
                </Breadcrumb.Item>
                : ""
            }  */}
          </Breadcrumb>
          {this.props.titles ?
            this.props.titles
            :
            (selectTreeItem && selectTreeItem.entName && selectTreeItem.pointName) ? `【${selectTreeItem.entName} - ${selectTreeItem.pointName}】` : ""}
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
             {/* {
              this.props.title ? //路由子页面 title 
                <Breadcrumb.Item key={this.props.title}>
                  <a>{this.props.title}</a>
                </Breadcrumb.Item>
                : ""
            }  */}
          </Breadcrumb>
          {this.props.titles ?
            this.props.titles
            :
            (selectTreeItem && selectTreeItem.entName && selectTreeItem.pointName) ? `【${selectTreeItem.entName} - ${selectTreeItem.pointName}】` : ""}
        </div>
      }else{
        return <div className="ant-page-header">当前位置：
        <Breadcrumb>
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
        // title={this.props.title} 
        title={null}
        className={!webConfig.isShowBreadcrumb || this.props.hideBreadcrumb ? "hideBreadcrumb" : ""}
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