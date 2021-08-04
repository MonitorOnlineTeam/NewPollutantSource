import React, { PureComponent } from 'react';
import EZUIKit from 'ezuikit-js'
import { connect } from 'dva'
import request from 'umi-request';
// import styles from './index.less'

@connect(({ loading, global }) => ({
  configInfo: global.configInfo,
}))
class Video extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playData: {}
    };
  }

  componentDidMount() {
    this.playViode();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.channelNo !== prevProps.channelNo || this.props.HD !== prevProps.HD) {
      if (this.playr && this.props.channelNo && this.props.HD) {
        // this.playr.stop();
        let url = `ezopen://open.ys7.com/${this.props.channelNo}/${this.props.HD}.live`
        this.playr.play({
          url: url
        });
      } else {
        this.playViode();
      }
    }
  }

  playViode = () => {
    if (sessionStorage.getItem('YSYAccessToken')) {
      this.onPlayClick()
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
        this.onPlayClick(response.data.accessToken);
      });
  }

  onPlayClick = async (accessToken) => {
    const { channelNo, HD, template } = this.props;
    if (channelNo && HD) {
      let url = `ezopen://open.ys7.com/${channelNo}/${HD}.live` // 高清地址
      this.playr = new EZUIKit.EZUIKitPlayer({
        id: 'ysyLivePlayWrapper', // 准备的dom元素的id，画面就在这里面播放
        autoplay: true, // 开启自动播放
        accessToken: accessToken || sessionStorage.getItem('YSYAccessToken'),
        url: url,
        template: 'standard', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版； 
      })
    }
  }

  render() {
    const { channelNo, HD } = this.props;
    return (
      <>
        {
          channelNo && HD ?
            <div id="ysyLivePlayWrapper" style={{ height: '100%', backgroundColor: '#000' }}>
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


export default Video;