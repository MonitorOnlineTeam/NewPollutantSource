import React, { PureComponent } from 'react';
import loader from '@/utils/loader'
import { connect } from 'dva';

@connect(({ video, loading }) => ({
  HKLiveVideoUrl: video.HKLiveVideoUrl,
}))
class Live extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.h5player = null;
  }

  componentDidMount() {
    Promise.all([
      this._loadJSPluginFile(),
    ]).then(() => {
      this.getPreviewURLs();
    })
  }

  componentWillUnmount() {
    // window.JSPlugin = undefined;
    this.onStopPlay();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.CameraCode !== prevProps.CameraCode) {
      Promise.all([
        this._loadJSPluginFile(),
      ]).then(() => {
        this.getPreviewURLs();
      })
    }
  }


  // 获取监控点预览取流URL
  getPreviewURLs = () => {
    const { CameraCode } = this.props;
    this.props.dispatch({
      type: 'video/GetPreviewURL',
      payload: {
        CameraCode: CameraCode,
        protocol: 'ws'
      }
    }).then(() => {
      this.initPlugin();
    })
  }


  // 初始化
  initPlugin = () => {
    const { id } = this.props;
    this.h5player = new this.JSPlugin({
      szId: id, //需要英文字母开头 必填
      szBasePath: '/js/video/HK/', // 必填,引用H5player.min.js的js相对路径
      iMaxSplit: 1,
      iCurrentSplit: 2,
      openDebug: true,
      oStyle: {
        borderSelect: '#FFCC00',
      }
    })
    this.realtimePlay();
  }

  // 播放视频
  realtimePlay = () => {
    let { HKLiveVideoUrl } = this.props;
    if (this.h5player) {
      debugger
      let index = this.h5player.currentWindowIndex,
        playURL = HKLiveVideoUrl, mode = 1;
      this.h5player.JS_Play(playURL, { playURL, index }, mode).then(
        () => {
          console.log('realplay success')
        },
        e => {
          console.error(e)
        }
      )
    }
  }

  // 停止播放
  onStopPlay = () => {
    if (this.h5player) {
      this.h5player.JS_Stop().then(
        () => { console.log('stop realplay success') },
        e => { console.error(e) }
      )
    }
  }

  // 文件加载
  _loadJSPluginFile = () => {
    if (window.JSPlugin) {
      if (!this.JSPlugin) this.JSPlugin = window.JSPlugin;
      return Promise.resolve();
    } else {
      return loader('/js/video/HK/h5player.min.js', 'JSPlugin')
        .then(() => {
          this.JSPlugin = window.JSPlugin;
          return Promise.resolve();
        }).catch(error => {
          console.error('Load file fail!');
        });
    }
  }



  render() {
    const { CameraCode, id } = this.props;
    return <>
      {
        CameraCode ?
          <div id={id} style={{ height: '100%', backgroundColor: '#000', zIndex: 999 }}> </div>
          :
          <div className="notData">
            <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
            <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
          </div>
      }
    </>
  }
}

Live.defaultProps = {
  id: 'play_window'
}

export default Live;