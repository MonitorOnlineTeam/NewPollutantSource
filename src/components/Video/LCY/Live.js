import React, { PureComponent } from 'react';
import { connect } from 'dva'
import Cookies from 'js-cookie';
import '@public/js/LeCheng/imouplayer.js'
// import './imouplayer.js'
import styles from '../index.less'


const style = {
  color: '#fff',
  fontSize: '16px',
  fontWeight: 500,
  textAlign: 'center',
  paddingTop: '20%',
} 

@connect(({ loading, global }) => ({
  // configInfo: global.configInfo,
}))
class Live extends PureComponent {
  constructor(props) {
    super(props); 
    this.state = {
      kitToken: ""
    };
  }

  componentDidMount() {
    this.playVideo();
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.destroy()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.deviceSerial !== prevProps.deviceSerial || this.props.channelNo !== prevProps.channelNo) {
      this.playVideo();
    }
  }

  // // 获取乐橙云KitToken
  // getToken = () => {
  //   const { deviceSerial, channelNo, appKey, appSecret, KitToken } = this.props;
  //   this.props.dispatch({
  //     type: 'video/GetLeChengKITToken',
  //     payload: {
  //       "SerialNumber": deviceSerial,
  //       "Appkey": appKey,
  //       "Secret": appSecret,
  //       "ChannelNo": channelNo
  //     },
  //     callback: (res) => {
  //       this.setState({ kitToken: res }, () => { this.playVideo() })
  //     }
  //   })
  // }

  playVideo = () => {
    const { deviceSerial, channelNo, type, id, KitToken } = this.props;
    let url = `imou://open.lechange.com/${deviceSerial}/${channelNo}/${type}?streamId=1`

    if (this.player) {
      this.player.destroy()
    }

    let playerOption = {
      // isEdit: false,
      // // isEdit: false,
      // url: url,
      // kitToken: kitToken,
      // // 是否自动播放
      // autoplay: true,
      // // 是否显示控制台
      // controls: true,
      // // 是否开启静音
      // automute: false,
      themeData: [{
        area: 'header',
        fontColor: '#F18D00',
        backgroundColor: '#FFFFFF',
        activeButtonColor: '#0E72FF',
        buttonList: [{
          show: true,
          id: 'deviceName',
          name: '设备名称',
          position: 'left',
        }, {
          show: true,
          id: 'channalId',
          name: '设备通道',
          position: 'left',
        }, {
          show: true,
          id: 'cloudVideo',
          name: '云录像',
          position: 'right',
        }, {
          show: true,
          id: 'localVideo',
          name: '本地录像',
          position: 'right',
        }]
      }, {
        area: 'footer',
        fontColor: '#F18D00',
        backgroundColor: '#FFFFFF',
        activeButtonColor: '#0E72FF',
        buttonList: [{
          show: true,
          id: 'play',
          name: '播放',
          position: 'left',
        }, {
          show: true,
          id: 'mute',
          name: '音量控制',
          position: 'left',
        }, {
          show: true,
          id: 'talk',
          name: '语音对讲',
          position: 'left',
        }, {
          show: true,
          id: 'capture',
          name: '截图',
          position: 'left',
        }, {
          show: true,
          id: 'definition',
          name: '清晰度控制',
          position: 'right',
        }, {
          show: true,
          id: 'PTZ',
          name: '云台控制',
          position: 'right',
        }, {
          show: true,
          id: 'webExpend',
          name: '网页全屏',
          position: 'right',
        }, {
          show: true,
          id: 'extend',
          name: '全屏控制',
          position: 'right',
        }]
      }],
    };
    console.log("ImouPlayer")
    this.player = new ImouPlayer(`#${id}`);
    const params = {
      src: [{
        url: url,
        kitToken: KitToken,
      }],
      width: '100%',
      height: '100%',
      autoplay: true,
      controls: true,
      themeData: playerOption.themeData
    };
    this.player.setup(params);
  }


  render() {
    const { deviceSerial, channelNo, id, type } = this.props;
    return (
      <>
        {
          deviceSerial && channelNo ? <div id={id} style={{ height: '100%', backgroundColor: '#000', zIndex: 999 }}> </div>
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
  id: 'LCYPlayWrapper'
}

export default Live;