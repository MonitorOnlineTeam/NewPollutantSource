import React, { PureComponent } from 'react';
import EZUIKit from 'ezuikit-js';
import { connect } from 'dva';
import styles from './index.less';
import Cookies from 'js-cookie';

const style = {
  color: '#fff',
  fontSize: '16px',
  fontWeight: 500,
  textAlign: 'center',
  paddingTop: '20%',
};

@connect(({ loading, global }) => ({}))
class PlaybackVideo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playData: {},
      showTips: true,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
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
    if (Cookies.get('YSYAccessToken')) {
      // this.onPlayClick()
    } else {
      this.getAccessToken();
    }
  };

  getAccessToken = () => {
    const { appKey, appSecret } = this.props;
    fetch(`https://open.ys7.com/api/lapp/token/get?appKey=${appKey}&appSecret=${appSecret}`, {
      method: 'POST', // or 'PUT'
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        Cookies.set('YSYAccessToken', response.data.accessToken, { expires: 7 });
        // this.onPlayClick(response.data.accessToken);
      });
  };

  onPlayClick = (beginTime, endTime) => {
    const ele = document.querySelector('#backWrapper');
    const height = ele.clientHeight;
    const width = ele.clientWidth;
    const { deviceSerial, channelNo } = this.props;
    if (deviceSerial && channelNo) {
      // this.setState({ showTips: false })
      let url = `ezopen://open.ys7.com/${deviceSerial}/${channelNo}.rec?begin=${beginTime}&end=${endTime}`;
      if (this.playr) {
        // this.playr.play({
        //   url: url,
        // });
        this.playr.stop().then(() => {
          this.playr.play(url);
        });
      } else {
        this.playr = new EZUIKit.EZUIKitPlayer({
          id: 'ysyPlaybackWrapper', // 准备的dom元素的id，画面就在这里面播放
          autoplay: true, // 开启自动播放
          accessToken: Cookies.get('YSYAccessToken'),
          url: url,
          template: 'security', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
          width: width,
          height: height,
        });
      }
    }
  };

  render() {
    const { deviceSerial, channelNo } = this.props;
    const { showTips } = this.state;
    return (
      <>
        {deviceSerial && channelNo ? (
          <div
            id="backWrapper"
            className={styles.playbackWrapper}
            style={{ height: '100%', backgroundColor: '#000' }}
          >
            <div id="ysyPlaybackWrapper"></div>
            {showTips ? <p style={style}>请选择时间后点击播放！</p> : ''}
          </div>
        ) : (
          <div className="notData">
            <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
            <p style={{ color: '#d5d9e2', fontSize: 16, fontWeight: 500 }}>暂无数据</p>
          </div>
        )}
      </>
    );
  }
}

export default PlaybackVideo;
