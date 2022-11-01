import React, { PureComponent } from 'react';
import { connect } from 'dva'
import styles from '../index.less'

const style = {
  color: '#fff',
  fontSize: '16px',
  fontWeight: 500,
  textAlign: 'center',
  paddingTop: '20%',
}

@connect(({ loading, global }) => ({
  configInfo: global.configInfo,
}))
class PrivateCloud_Playback extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playData: {},
      showTips: true,
    };
  }

  componentDidMount() {

  }


  render() {
    const { deviceSerial, channelNo } = this.props;
    const { showTips } = this.state;
    return (
      <>
        <div className={styles.playbackWrapper} id="ysyPlaybackWrapper" style={{ height: '100%', backgroundColor: '#000' }}>
          <p style={style}>无视频信息</p>
        </div>
      </>
    );
  }
}


export default PrivateCloud_Playback;