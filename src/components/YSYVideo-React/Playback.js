import React, { PureComponent } from 'react';
import EZUIKit from 'ezuikit-js'
import { connect } from 'dva'
import styles from './index.less'

const style = {
  color: '#fff',
  fontSize: '16px',
  fontWeight: 500,
  textAlign: 'center',
  paddingTop: '50%',
}

@connect(({ loading, global }) => ({
  configInfo: global.configInfo,
}))
class PlaybackVideo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playData: {},
      showTips: true,
    };
  }

  componentDidMount() {
    this.props.onRef(this)
    this.playViode();
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.channelNo !== prevProps.channelNo || this.props.HD !== prevProps.HD) {
    //   if (this.playr && this.props.channelNo && this.props.HD) {
    //     let url = `ezopen://open.ys7.com/${channelNo}/${HD}.rec?begin=${beginTime}&end=${endTime}`
    //     this.playr.play({
    //       url: url
    //     });
    //   } else {
    //     this.playViode();
    //   }
    // }
  }

  playViode = () => {
    if (sessionStorage.getItem('YSYAccessToken')) {
      // this.onPlayClick()
    } else {
      this.getAccessToken();
    }
  }

  getAccessToken = () => {
    const { configInfo } = this.props;
    fetch(`https://open.ys7.com/api/lapp/token/get?appKey=${configInfo.YSYAppKey}&appSecret=${configInfo.YSYSecret}`, {
      method: 'POST', // or 'PUT'
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        sessionStorage.setItem('YSYAccessToken', response.data.accessToken)
        // this.onPlayClick(response.data.accessToken);
      });
  }

  onPlayClick = (beginTime, endTime) => {
    console.log('beginTime=', beginTime)
    console.log('endTime=', endTime)
    const { channelNo, HD } = this.props;
    if (channelNo && HD) {
      // this.setState({ showTips: false })
      let url = `ezopen://open.ys7.com/${channelNo}/${HD}.rec?begin=${beginTime}&end=${endTime}`
      if (this.playr) {
        this.playr.play({
          url: url
        });
      } else {
        this.playr = new EZUIKit.EZUIKitPlayer({
          id: 'ysyPlaybackWrapper', // 准备的dom元素的id，画面就在这里面播放
          autoplay: true, // 开启自动播放
          accessToken: sessionStorage.getItem('YSYAccessToken'),
          url: url,
          template: 'security', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版； 
        })
      }
    }
  }

  render() {
    const { channelNo, HD } = this.props;
    const { showTips } = this.state;
    return (
      <>
        {
          channelNo && HD ?
            <div className={styles.playbackWrapper} id="ysyPlaybackWrapper" style={{ height: '100%', backgroundColor: '#000' }}>
              {
                showTips ? <p style={style}>请选择时间后点击播放！</p> : ''
              }
            </div>
            :
            <div className="notData">
              <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
              <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
            </div>
        }
      </>
    );
  }
}


export default PlaybackVideo;