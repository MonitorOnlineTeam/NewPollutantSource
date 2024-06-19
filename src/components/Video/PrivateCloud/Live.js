/*
 * @Author: Jiaqi 
 * @Date: 2022-09-16 18:06:43 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2022-10-21 09:24:41
 * @desc: 在线云视频 - 实时视频组件
 */
import React, { PureComponent } from 'react'
import '@public/js/video/jessibuca.js'
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import { message } from 'antd'


class Live extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playUrl: '',
    }
  }

  componentDidMount() {
    this.loginGetSession();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.deviceSerial !== prevProps.deviceSerial || this.props.channelNo !== prevProps.channelNo) {
      this.getVideoResourceList();
    }
  }

  // 登录并获取session
  loginGetSession = () => {
    let username = 'admin';
    let password = CryptoJS.MD5("admin").toString();
    fetch(`/api/user/login?username=admin&password=${password}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(res => {
        console.log('res=', res);
        if (res) {
          if (res.code === 0) {
            Cookies.set('session', { "username": username, "roleId": res.data.role.id })
            this.getVideoResourceList();
            //登录成功后
          } else {
            message.error("登录失败，用户名或密码错误")
          }
        } else {
          message.error("视频服务器连接失败，请联系管理员！")
        }

      });
  }

  // 获取视频资源列表
  getVideoResourceList = () => {
    const { deviceSerial, channelNo } = this.props;
    fetch(`/api/play/start/${deviceSerial}/${channelNo}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        if (response) {
          if (response.code === 0) {
            this.setState({ playUrl: response.data.flv }, () => {
              this.create();
            })
          } else {

          }
        } else {
          message.error("视频服务器连接失败，请联系管理员！")
        }
      });
  }

  //创建jessibuca播放器
  create() {
    let $container = document.getElementById(this.props.id);//容器
    this.jessibuca = new window.Jessibuca({
      container: $container,//播放器容器
      videoBuffer: 0.2, // 缓存时长
      isResize: false, //适应浏览器
      isFlv: true,
      text: "",
      loadingText: "加载中....",
      decoder: "/js/video/decoder.js",//必须与引入jessibuca.js在同一个文件夹
      useMSE: false,
      debug: false,
      hasAudio: false,//是否开启声音，谷歌不支持开启声音，
      useWCS: false,
      showBandwidth: true, // 显示网速
      operateBtns: {//配置按钮
        fullscreen: true,
        screenshot: true,
        play: true,
        audio: true,
      },
      //forceNoOffscreen: true,//离屏渲染
      isNotMute: false,//是否开启声音
    });
    debugger
    this.play();
  }

  // 播放视频
  play = () => {
    const { IP, port, deviceSerial, channelNo } = this.props;
    let playUrl = this.state.playUrl;
    if (this.jessibuca && playUrl) {
      this.jessibuca.play(playUrl);
    }
  }

  // 暂停
  pause = () => {
    if (this.jessibuca) {
      this.jessibuca.pause();
    }
  }

  // 销毁后重新初始化播放器
  destroy = () => {
    if (this.jessibuca) {
      this.jessibuca.destroy();
    }
    this.create();
  }


  render() {
    console.log('props=', this.props)
    const { deviceSerial, channelNo, IP, id } = this.props;
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

Live.defaultProps = {
  id: 'container'
}

export default Live;