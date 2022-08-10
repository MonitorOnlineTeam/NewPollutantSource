import React, { PureComponent } from 'react';
import DPlayer from 'dplayer'
const Hls = require('hls.js')

class Test extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let video = new DPlayer({
      container: document.getElementById('video'),  // 注意：这里一定要写div的dom
      lang: 'zh-cn',
      video: {
        url: 'http://223.84.203.227:8088/record/cam/47568770720087/02/20220804/out.m3u8',  // 这里填写.m3u8视频连接
        type: 'customHls',
        customType: {
          customHls: function (video) {
            const hls = new Hls()
            hls.loadSource(video.src)
            hls.attachMedia(video)
          }
        }
      }
    })
    video.play() // 播放
    video.on('ended', function () {
      // 监听函数
    })
  }


  render() {
    return (
      <div id="video"></div>
    );
  }
}

export default Test;