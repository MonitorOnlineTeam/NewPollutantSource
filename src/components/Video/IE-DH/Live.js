import React, { PureComponent } from 'react'
import { initVideo } from './IEDHUtils'
import styles from '../index.less';

class Live extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.initVideoData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.props.videoInfo) !== JSON.stringify(prevProps.videoInfo)) {
      this.initVideoData();
    }
  }

  // 初始化视频
  initVideoData = () => {
    const { videoInfo } = this.props;
    const videoData = {
      szIP: videoInfo.IP,
      szPort: videoInfo.Device_Port * 1,
      szUsername: videoInfo.User_Name,
      szPassword: videoInfo.User_Pwd,
      rtspPort: videoInfo.RTSPPort,
      protocol: 0,
      channels: videoInfo.ChannelNo * 1,
      id: this.props.id,
    };
    initVideo(videoData);
  }

  render() {
    const { videoInfo: { IP, szPort, User_Name, User_Pwd }, id } = this.props;
    return (
      <div id={id} className={styles.Plugin} style={{ height: '100%', backgroundColor: '#000' }}>
      </div>
      // <>
      //   {
      //     IP && szPort ?
           
      //       :
      //       <div className="notData">
      //         <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
      //         <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
      //       </div>
      //   }
      // </>
    );
  }
}


Live.defaultProps = {
  id: 'divPlugin'
}

export default Live;