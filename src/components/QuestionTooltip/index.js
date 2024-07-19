/*
 * @Author: Jiaqi
 * @Date: 2020-08-19 11:10:12
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-07-18 16:33:58
 * @Description: 问号提示组件
 */
import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

class index extends PureComponent {
  state = {};
  render() {
    const { content, color } = this.props;
    return (
      <Tooltip {...this.props} title={content}>
        <QuestionCircleOutlined
          {...this.props}
          style={{ marginLeft: 6, color: '#808080', ...this.props.style }}
        />
      </Tooltip>
    );
  }
}

export default index;
