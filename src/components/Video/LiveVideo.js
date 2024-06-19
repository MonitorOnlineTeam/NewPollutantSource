import React, { PureComponent } from 'react';
// import YSYLiveVideo from './YSY/Live'
import PrivateCloudLiveVideo from './PrivateCloud/Live';
// import LCYLiveVideo from './LCY/Live'
import IEDHLiveVideo from './IE-DH/Live';
import HKHLiveVideo from './HK/Live';
import { getBrowserInfo } from '@/utils/video';
import { Empty } from 'antd';

class Live extends PureComponent {
  constructor(props) {
    super(props);
    const mb = getBrowserInfo();
    const isIE = mb.indexOf('IE') >= 0;
    this.state = {
      isIE: isIE,
    };
  }

  renderPageContent = () => {
    const { isIE } = this.state;
    let description = '暂无视频数据';
    let InputType = this.props.videoInfo.InputType;
    console.log('isIE=', isIE);
    console.log('InputType=', InputType);
    if (isIE && InputType === 5) {
      // 大华IE
      return <IEDHLiveVideo videoInfo={this.props.videoInfo} />;
    }
    if (isIE && InputType !== 5) {
      description = 'IE不支持此播放模式，请用谷歌chrome浏览器打开此页面观看';
      return (
        <Empty
          description={description}
          imageStyle={{ maring: '50px 0' }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    if (!isIE && InputType === 5) {
      description = '请用IE11浏览器打开页面观看';
      return (
        <Empty
          description={description}
          imageStyle={{ maring: '50px 0' }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    if (!isIE && InputType !== 5) {
      return this.switchVideo();
    }
  };

  switchVideo = () => {
    const { videoInfo, id } = this.props;
    switch (videoInfo.InputType) {
      case 1:
        const Live = require('./YSY/Live.js');
        let YSYLiveVideo = Live.default;
        // 萤石云
        return (
          <>
            <YSYLiveVideo
              id={id}
              appKey={videoInfo.AppKey}
              appSecret={videoInfo.AppSecret}
              deviceSerial={videoInfo.VedioCamera_No}
              channelNo={videoInfo.ChannelNo}
            />
          </>
        );
      case 2:
        const LCYLiveVideo = require('./LCY/Live.js').default;
        // 乐橙云
        return (
          <LCYLiveVideo
            id={id}
            appKey={videoInfo.AppKey}
            appSecret={videoInfo.AppSecret}
            deviceSerial={videoInfo.VedioCamera_No}
            channelNo={videoInfo.ChannelNo}
            KitToken={videoInfo.KitToken}
            AccessToken={videoInfo.AccessToken}
            type={1}
          />
        );
      case 3:
        // 私有云
        return (
          <PrivateCloudLiveVideo
            id={id}
            IP={videoInfo.IP}
            port={videoInfo.Device_Port}
            deviceSerial={videoInfo.VedioCamera_No}
            channelNo={videoInfo.ChannelNo}
          />
        );
      case 6:
        // 海康安防视频平台
        // return <HKHLiveVideo CameraCode={'27b812ca24bd46c98cca749c834ecac1'} />
        return <HKHLiveVideo CameraCode={videoInfo.VedioCamera_No} />;
    }
  };

  render() {
    return <>{this.renderPageContent()}</>;
  }
}

export default Live;
