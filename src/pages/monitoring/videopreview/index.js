import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import HKvideo from './hkvideo'
import YSYvideo from './ysyvideo/VideoReact'
import { connect } from 'dva';

@connect(({ global, loading }) => ({
  configInfo: global.configInfo,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { configInfo } = this.props;
    return (
      <>
        {
          configInfo.VideoServer === 0 ? <HKvideo /> : <YSYvideo />
        }
      </>
    );
  }
}

export default index;