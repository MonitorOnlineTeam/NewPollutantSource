import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import { connect } from 'dva'
import { getBrowserInfo } from '@/utils/video'
import PageLoading from '@/components/PageLoading'
// import YSYVideo from './ysyvideo/VideoReact'
import IEVideo from './IEVideo/index'
import { Empty } from 'antd';


/**
 * 视频预览
 * xpy 2019.07.26
 */

let YSYVideo;

@connect()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dgimn: '',
    };
  }

  componentDidMount() {
  }


  changeDgimn = dgimn => {
    this.setState({
      dgimn,
    }, () => { this.getVideoType() })
  }

  getVideoType = () => {
    this.props.dispatch({
      type: 'videodata/GetVideoTypeByDGIMN',
      payload: {
        DGIMN: this.state.dgimn
      },
      callback: (res) => {
        let showVideoType = '';
        const mb = getBrowserInfo();
        const isIE = mb.indexOf('IE') >= 0;
        // if (res === 'hk') {
        //   showVideoType = 'HK'
        // } else if (!isIE && res === 'ysy') {
        //   YSYVideo = require('./ysyvideo/VideoReact');
        //   showVideoType = 'YSY'
        // }
        this.setState({
          isIE: isIE,
          showVideoType: res
        })
      }
    })
  }


  renderPageContent = () => {
    const { showVideoType, dgimn, isIE } = this.state;
    let description = "暂无视频数据"
    if (showVideoType !== undefined && dgimn) {
      if (isIE && showVideoType === 'hk') {
        return <IEVideo DGIMN={dgimn} />;
      }
      if (isIE && showVideoType === 'ysy') {
        description = 'IE不支持此播放模式，请用谷歌chrome浏览器打开此页面观看';
        return <Empty description={description} imageStyle={{ maring: '50px 0' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }

      if (!isIE && showVideoType === 'hk') {
        description = '请用IE11浏览器打开页面观看';
        return <Empty description={description} imageStyle={{ maring: '50px 0' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }

      if (!isIE && showVideoType === 'ysy') {
        const VideoReact = require('./ysyvideo/VideoReact.js');
        YSYVideo = VideoReact.default;
        return <YSYVideo DGIMN={dgimn} />
      }

      if (!showVideoType) {
        return <Empty description={description} imageStyle={{ maring: '50px 0' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
    }
  }

  render() {
    const { showVideoType, dgimn } = this.state;
    console.log('showVideoType=', showVideoType);
    return (
      <div id="ysyvideo">
        <BreadcrumbWrapper>
          {/* {dgimn && <IEVideo />} */}
          {/* {showVideoType === 'HK' ? <IEVideo /> :
            (showVideoType === 'YSY' ? <YSYVideo DGIMN={dgimn} /> :
              <Empty description="暂无数据" imageStyle={{ maring: '50px 0' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )
          } */}
          {this.renderPageContent()}
        </BreadcrumbWrapper>
        <NavigationTree runState='1' domId="#ysyvideo" choice={false} onItemClick={value => {
          if (value.length > 0 && !value[0].IsEnt) {
            this.changeDgimn(value[0].key)
          }
        }} />
      </div>
    );
  }
}
export default Index;
