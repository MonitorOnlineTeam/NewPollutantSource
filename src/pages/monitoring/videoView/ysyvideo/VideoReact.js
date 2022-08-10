import React, { PureComponent } from 'react';
import VideoContent from './component/VideoContent'
import { connect } from 'dva';

@connect(({ videodata, loading }) => ({
  vIsLoading: loading.effects['videodata/getvideolist'],
  videoList: videodata.videoList,
}))
class VideoReact extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { DGIMN } = this.props;
    return (
      <VideoContent DGIMN={DGIMN} />
    );
  }
}

export default VideoReact;