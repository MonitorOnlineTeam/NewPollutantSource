import React, { PureComponent } from 'react'
import YSYPTZ from './YSY/YSYPTZ'
// import PrivateCloudPTZ from './PrivateCloud/PTZ'
// import LCYPTZ from './LCY/PTZ'
// import HKPTZ from './HK/PTZ'

class PTZControl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  switchVideo = () => {
    const { videoInfo } = this.props;
    console.log('videoInfo=', videoInfo);
    if (videoInfo.IsShowControl === 1) {
      switch (videoInfo.InputType) {
        case 1:
          // 萤石云
          return <YSYPTZ
            appKey={videoInfo.AppKey}
            appSecret={videoInfo.AppSecret}
            deviceSerial={videoInfo.VedioCamera_No} channelNo={videoInfo.ChannelNo} />
        // case 2:
          // 乐橙云
          // return <LCYPTZ
          //   appKey={videoInfo.AppKey}
          //   appSecret={videoInfo.AppSecret}
          //   deviceSerial={videoInfo.VedioCamera_No}
          //   channelNo={videoInfo.ChannelNo}
          //   AccessToken={videoInfo.AccessToken}
          //   type={1}
          // />
        // case 3:
          // 私有云
          // return <PrivateCloudPTZ deviceSerial={videoInfo.VedioCamera_No} channelNo={videoInfo.ChannelNo} />
        // case 4:
          // 海康IE
          // break;
        // case 5:
          // 大华IE
          // break;
        // case 6:
          // 海康平台
          // return <HKPTZ CameraCode={videoInfo.VedioCamera_No} />
      }
    } else {
      return null;
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

export default PTZControl;
