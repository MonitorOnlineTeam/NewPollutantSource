import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import VideoContent from './component/VideoContent'
import { connect } from 'dva';

@connect(({ videodata, loading,videoNew }) => ({
  vIsLoading: loading.effects['videodata/getvideolist'],
  videoList: videodata.videoList,
  DGIMN:videoNew.DGIMN,
}))
class VideoView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { DGIMN } = this.state;
    return (
      <>
       {/* <NavigationTree runState='1' domId="#VideoReact" choice={false} onItemClick={value => {
          if (value.length > 0 && !value[0].IsEnt) {
            this.setState({
              DGIMN: value[0].key
            }, () => {
            })
          }
        }} /> */}
        <div id="VideoReact">
          <BreadcrumbWrapper>
            <VideoContent DGIMN={this.props.DGIMN} />
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default VideoView;