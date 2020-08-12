/*
 * @desc: 自定义Icon
 * @Author: Jiaqi
 * @Date: 2019-09-12 11:08:48
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-12-06 11:08:23
 */
import React, { PureComponent } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import config from '@/config'

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      scriptUrl: config.iconFontUrl,
    }
  }
  render() {
    const IconConfig = createFromIconfontCN({
      scriptUrl: this._SELF_.scriptUrl,
    })
    return (
      <IconConfig  style={{ fontSize: 16 }} {...this.props} />
    );
  }
}

export default index;
