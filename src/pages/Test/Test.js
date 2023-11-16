import React, { PureComponent } from 'react';
import { Button } from 'antd';
import Cookies from 'js-cookie';
import EZUIKit from 'ezuikit-js';
class Test extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
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
    fetch(
      `https://open.ys7.com/api/lapp/token/get?appKey=${'35ca29dba6714724be8fd7331548cc37'}&appSecret=${'699b15a37df6ba5f6115c4e5b23bde55'}`,
      {
        method: 'POST', // or 'PUT'
      },
    )
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        Cookies.set('YSYAccessToken', response.data.accessToken, { expires: 7 });
        // this.onPlayClick(response.data.accessToken);
      });
  };

  onPlayClick = (beginTime, endTime) => {
    const { deviceSerial, channelNo } = this.props;
    if (true) {
      // this.setState({ showTips: false })
      let url = `ezopen://open.ys7.com/${'AC4881066'}/${'1'}.rec?begin=${'20230714000000'}&end=${'20230714235959'}`;
      if (this.playr) {
        this.playr.play({
          url: url,
        });
      } else {
        this.playr = new EZUIKit.EZUIKitPlayer({
          id: 'video-container', // 准备的dom元素的id，画面就在这里面播放
          autoplay: true, // 开启自动播放
          accessToken: Cookies.get('YSYAccessToken'),
          url: url,
          template: 'security', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
          width: 600,
        height: 400,
        });
      }
    }
  };
  render() {
    const { visible } = this.state;
    return (
      <>
        <Button onClick={() => this.onPlayClick()}>播放</Button>
        <div id="video-container" style={{ width: 800, height: 300 }}></div>
      </>
    );
  }
}

export default Test;
