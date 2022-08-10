import React, { Component } from "react";
import PropTypes from "prop-types";
import videojs from "video.js";

// // 添加hls插件，以保证播放m3u8格式的视频
import "videojs-contrib-hls";
// // 导入videojs 的样式
// import "video.js/dist/video-js.css";

// 给window上添加videojs, zh-CN.js 语言注册依赖 videojs.addLanguage()方法
// 配置了不生效的话  把public/index.html  里的标签  <html lang="en">  </html>   lang设置为 "zh-CN"
window.videojs = videojs;
import("video.js/dist/lang/zh-CN.js");

class VideoPlayer extends Component {
  componentDidMount() {
    this.initVideo();
  }

  initVideo = () => {
    const that = this;
    console.log('this.videoNode=', this.videoNode);
    const videoProps = {
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
    this.player = videojs(this.videoNode, videoProps, function onPlayerReady() {
      console.log('onPlayerReady', this);
      this.play();

      this.on('suspend', function () {//延迟下载
        console.log("延迟下载")
      });
      this.on('loadstart', function () { //客户端开始请求数据
        console.log("客户端开始请求数据")
      });
      this.on('progress', function () {//客户端正在请求数据
        console.log("客户端正在请求数据")
      });
      this.on('abort', function () {//客户端主动终止下载（不是因为错误引起）
        console.log("客户端主动终止下载")
      });
      this.on('error', function () {//请求数据时遇到错误
        console.log("请求数据时遇到错误")
      });
      this.on('stalled', function () {//网速失速
        console.log("网速失速")
      });
      this.on('play', function () {//开始播放
        console.log("开始播放")
      });
      this.on('pause', function () {//暂停
        console.log("暂停")
      });
      this.on('loadedmetadata', function () {//成功获取资源长度
        console.log("成功获取资源长度")
      });
      this.on('loadeddata', function () {//渲染播放画面
        console.log("渲染播放画面")
      });
      this.on('waiting', function () {//等待数据，并非错误
        console.log("等待数据")
      });
      this.on('playing', function () {//开始回放
        console.log("开始回放")
      });
      this.on('canplay', function () {//可以播放，但中途可能因为加载而暂停
        console.log("可以播放，但中途可能因为加载而暂停")
      });
      this.on('canplaythrough', function () { //可以播放，歌曲全部加载完毕
        console.log("可以播放，歌曲全部加载完毕")
      });
      this.on('seeking', function () { //寻找中
        console.log("寻找中")
      });
      this.on('seeked', function () {//寻找完毕
        console.log("寻找完毕")
      });
      this.on('timeupdate', function () {//播放时间改变
        console.log("播放时间改变")
      });
      this.on('ended', function () {//播放结束
        console.log("播放结束")
        // this.dispose();
        // that.initVideo();
        that.props.mode === 'live' && this.src(that.props.src);
      });
      this.on('ratechange', function () {//播放速率改变
        console.log("播放速率改变")
      });
      this.on('durationchange', function () {//资源长度改变
        console.log("资源长度改变")
      });
      this.on('volumechange', function () {//音量改变
        console.log("音量改变")
      });
    });
    this.player.ready(function () {
      this.play();
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.src !== prevProps.src) {
      if (this.player) {
        // this.player.dispose();
        this.player.src(this.props.src);
      }
    }
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