import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NavigationTree from '@/components/NavigationTree';
import VideoContent from './component/VideoContent';
import { connect } from 'dva';

@connect(({ videodata, loading }) => ({
  vIsLoading: loading.effects['videodata/getvideolist'],
  videoList: videodata.videoList,
}))
class VideoView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { DGIMN, entName, pointName } = this.state;
    const parKey = this.props.match?.params?.key?.split('=')?.[1]
    return (
      <>
        <NavigationTree
          runState="1"
          domId="#VideoReact"
          choice={false}
          onItemClick={value => {
            if (value.length > 0 && !value[0].IsEnt) {
              this.setState(
                {
                  DGIMN: value[0].key,
                  entName: value[0].entName,
                  pointName: value[0].pointName,
                },
                () => {
                  // this.getVideoList();
                },
              );
            }
          }}
        />
        <div id="VideoReact">
          <BreadcrumbWrapper>
            {DGIMN && (
              <VideoContent
                DGIMN={DGIMN}
                defaultActiveKey={ parKey}
                entName={entName}
                pointName={pointName}
                {...this.props}
              />
            )}
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default VideoView;
