import React, { Component } from "react";
import PropTypes from "prop-types";
import videojs from "video.js";

// // 添加hls插件，以保证播放m3u8格式的视频
// import "videojs-contrib-hls";
// // 导入videojs 的样式
// import "video.js/dist/video-js.css";

// 给window上添加videojs, zh-CN.js 语言注册依赖 videojs.addLanguage()方法
// 配置了不生效的话  把public/index.html  里的标签  <html lang="en">  </html>   lang设置为 "zh-CN"
window.videojs = videojs;
import("video.js/dist/lang/zh-CN.js");

class VideoPlayer extends Component {
  componentDidMount() {
    this.props = {
      height: this.props.height || '100%',
      width: '100%',
      autoplay: true,
      controls: true,
      flvjs: {
        mediaDataSource: {
          isLive: true,
          cors: true,
          withCredentials: false,
          enableStashBuffer: false
        },
      },
      sources: [{
        src: this.props.src,
        // src: 'http://223.84.203.227:8088/live_hls/.m3u8',
        type: 'application/x-mpegURL'
      }]
    };
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });
    this.player.play();
  }
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }
  render() {
    return (
      // <div>
      //   <div data-vjs-player>
      <video style={{ width: '100%', height: '100%' }} ref={node => this.videoNode = node} className="video-js vjs-default-skin video"></video>
      //   </div>
      // </div>
    );
  }
}

export default VideoPlayer;