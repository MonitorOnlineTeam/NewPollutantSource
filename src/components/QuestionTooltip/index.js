/*
 * @Author: Jiaqi 
 * @Date: 2020-08-19 11:10:12 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-08-19 11:12:39
 * @Description: 问号提示组件
 */
import React, { PureComponent } from 'react';
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons"

class index extends PureComponent {
  state = {}
  render() {
    const { content } = this.props;
    return (
      <Tooltip title={content} >
        <QuestionCircleOutlined {...this.props} style={{ marginLeft: 6, color: "#808080", ...this.props.style }} />
      </Tooltip>
    );
  }
}

export default index;