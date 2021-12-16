import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Breadcrumb } from "antd"
import webConfig from '../../../public/webConfig'
import { connect } from "dva"

@connect(({ components, loading }) => ({
  selectTreeItem: components.selectTreeItem,
}))
class BreadcrumbWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTreeItem: {}
    };
  }

  componentWillUnmount() {
    // this.props.dispatch({
    //   type: "components/updateState",
    //   payload: {
    //     selectTreeItem: {}
    //   }
    // })
    this.setState({
      selectTreeItem: {}
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectTreeItem !== this.props.selectTreeItem) {
      this.setState({
        selectTreeItem: this.props.selectTreeItem
      })
    }
  }

  pageHeaderRender = (props) => {
    const { selectTreeItem } = this.state;
    if (props.breadcrumb.routes) {
      return <div>
        当前位置：
        <Breadcrumb>
          {
            props.breadcrumb.routes.map(item => {
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
        {(selectTreeItem && selectTreeItem.EntName && selectTreeItem.title) ? `【${selectTreeItem.EntName} - ${selectTreeItem.title}】` : ""}
        {/* {this.props.extraName ? `【${this.props.extraName}】` : ""} */}
      </div>
    }
  }

  render() {
    let title = this.props.title + this.props.extraName
    if (this.props.hide) {
      return <>
        {this.props.children}
      </>
    }
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
