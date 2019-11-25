/*
 * @desc: 自定义Icon
 * @Author: Jiaqi
 * @Date: 2019-09-12 11:08:48
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-20 16:54:51
 */
import React, { PureComponent } from 'react';
import { Icon } from 'antd';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      scriptUrl: '//at.alicdn.com/t/font_1298443_weo7upayqrg.js',
    }
  }
  render() {
    const IconConfig = Icon.createFromIconfontCN({
      scriptUrl: this._SELF_.scriptUrl,
    })
    const { style } = this.props;
    return (
      <IconConfig {...this.props} style={{ fontSize: 16, ...style }} />
    );
  }
}

export default index;
