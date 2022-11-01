import React, { PureComponent } from 'react'
import { message } from 'antd';
// import YSYPlaybackVideo from './YSY/Playback'
// import LCYPlaybackVideo from './LCY/Live'
// import LCYPlaybackVideo from './LCY/Playback'
import PrivateCloudPlaybackVideo from './PrivateCloud/Playback'


class PlaybackVideo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.startDate !== prevProps.startDate || this.props.endDate !== prevProps.endDate) {
    //   this.onPlay();
    // }
  }

  // 播放按钮调用
  onPlaybackVideo = () => {
    const { startDate, endDate } = this.props;
    if (startDate && endDate) {
      let format = 'YYYYMMDDHHmmss';
      if (this.props.videoInfo.InputType === 2) {
        format = 'YYYY-MM-DD HH:mm:ss';
      }
      this.playbackVideo.onPlayClick(startDate.format(format), endDate.format(format))
    } else {
      message.error('请选择时间后播放！')
    }
  }

  switchVideo = () => {
    const { videoInfo } = this.props;
    const { startDate, endDate } = this.state;
    switch (videoInfo.InputType) {
      case 1:
        // 萤石云
        const YSYPlaybackVideo = require('./YSY/Playback.js').default;
        return <YSYPlaybackVideo onRef={ref => this.playbackVideo = ref} appKey={videoInfo.AppKey} appSecret={videoInfo.AppSecret} deviceSerial={videoInfo.VedioCamera_No} channelNo={videoInfo.ChannelNo} />
      case 2:
        // 乐橙云
        const LCYPlaybackVideo = require('./LCY/Playback.js').default;
        return <LCYPlaybackVideo
          // id="LCYPlaybackVideo"
          onRef={ref => this.playbackVideo = ref}
          appKey={videoInfo.AppKey} appSecret={videoInfo.AppSecret}
          deviceSerial={videoInfo.VedioCamera_No} channelNo={videoInfo.ChannelNo}
          type={1}
          kitToken={videoInfo.KitToken}
          accessToken={videoInfo.AccessToken}
          startDate={startDate} endDate={endDate}
        />
      case 3:
        // 私有云
        return <PrivateCloudPlaybackVideo />
      case 4:
        // 海康IE
        break;
      case 5:
        // 大华IE
        break;
    }
  }

  render() {
    return (
      <>
        {this.switchVideo()}
      </>
    );
  }
}

export default PlaybackVideo;