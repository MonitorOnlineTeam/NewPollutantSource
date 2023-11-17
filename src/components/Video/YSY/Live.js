import React, { PureComponent } from 'react';
import EZUIKit from 'ezuikit-js'
import { connect } from 'dva'
import Cookies from 'js-cookie';
import $ from 'jquery'
// import styles from './index.less'

@connect(({ loading, global }) => ({
  // configInfo: global.configInfo,
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
    if (this.props.appKey !== prevProps.appKey || this.props.appSecret !== prevProps.appSecret) {
      this.playViode();
    } else
      if (this.props.deviceSerial !== prevProps.deviceSerial || this.props.channelNo !== prevProps.channelNo) {
        if (this.playr && this.props.deviceSerial && this.props.channelNo) {
          // this.playr.stop();
          let url = `ezopen://open.ys7.com/${this.props.deviceSerial}/${this.props.channelNo}.live`
          this.playr.play({
            url: url
          });
        } else {
          this.playViode();
        }
      }
  }

  playViode = () => {
   
    const { appKey, appSecret, id } = this.props;
    // $(`#${id}`).innerHTML();
    let el = document.querySelector(`#${id}`);
    el.innerHTML = '';
    let el2 = document.querySelector(`.iframe-btn-container`);
    el2 && el2.remove();
    let accessToken = Cookies.get(`YSYAccessToken-${appKey}-${appSecret}`);
    if (accessToken) {
      this.onPlayClick(accessToken)
    } else {
      this.getAccessToken();
    }
  }

  getAccessToken = () => {
    const { appKey, appSecret } = this.props;
    console.log('111=', this.props)
    fetch(`https://open.ys7.com/api/lapp/token/get?appKey=${appKey}&appSecret=${appSecret}`, {
      method: 'POST', // or 'PUT'
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        Cookies.set(`YSYAccessToken-${appKey}-${appSecret}`, response.data.accessToken, { expires: 7 });
        this.onPlayClick(response.data.accessToken);
      });
  }

  onPlayClick = async (accessToken) => {
    const { deviceSerial, channelNo, template, id } = this.props;
    if (deviceSerial && channelNo) {
      let url = `ezopen://open.ys7.com/${deviceSerial}/${channelNo}.live` // 播放地址，hd：高清
      this.playr = new EZUIKit.EZUIKitPlayer({
        id: id, // 准备的dom元素的id，画面就在这里面播放
        autoplay: true, // 开启自动播放
        accessToken: accessToken,
        url: url,
        template: template || 'standard', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
      })
    }
  }

  render() {
    const { deviceSerial, channelNo, id } = this.props;
    console.log("ysy=", this.props)
    return (
      <>
        {
          deviceSerial && channelNo ?
            <div id={id} style={{ height: '100%', backgroundColor: '#000' }}>
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

Video.defaultProps = {
  id: 'ysyLivePlayWrapper'
}

export default Video;
