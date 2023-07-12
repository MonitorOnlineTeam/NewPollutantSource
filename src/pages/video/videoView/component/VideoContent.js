import React, { PureComponent } from 'react';
import { Card, Tabs, Row, Select, DatePicker, Button, Empty, Divider, message } from 'antd';
import { connect } from 'dva';
import styles from '../index.less';
import RealVideoData from '@/components/ysyvideo/YsyRealVideoData';
import HistoryVideoData from '@/components/ysyvideo/YsyHisVideoData';
// import RealVideoData from './RealData'
// import HistoryVideoData from './HisData'
import PTZControl from '@/components/Video/PTZControl';
import moment from 'moment';
import LiveVideo from '@/components/Video/LiveVideo';
import PlaybackVideo from '@/components/Video/PlaybackVideo';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ video, loading,videoNew, }) => ({
  loading: loading.effects['video/getvideolist'],
  // videoList: video.videoList,
  videoList:videoNew.videoList,
}))
class VideoContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentVideo:props.videoList[0],
      template: 'standard',
      currentKey: '1',
    };
  }

  componentDidMount() {
    // this.getVideoList();
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.DGIMN !== prevProps.DGIMN) {
    //   this.setState({ currentKey: '1' });
    //   this.getVideoList();
    // }
  }

  // 获取摄像头列表
  getVideoList = () => {
    this.props.dispatch({
      type: 'video/getVideoList',
      payload: {
        DGIMN: this.props.DGIMN,
      },
      callback: res => {
        if (res && res.length) {
          this.setState({
            currentVideo: res[0],
          });
        }
        console.log('res=', res);
      },
    });
  };

  // 根据id获取选中的摄像头信息
  getVideoIp = id => {
    this.props.dispatch({
      type: 'videodata/ysyvideourl',
      payload: {
        VedioCameraID: id,
      },
      callback: res => {
        if (res && res.length) {
          this.setState({
            currentVideo: { ...res[0], VedioID: id },
          });
        }
      },
    });
  };

  /** 时间控件 */
  onDateChange = (value, dateString) => {
    if (value && value.length > 1) {
      this.setState({
        startDate: value[0],
        endDate: value[1],
      });
      this.child.startPlay(
        moment(value[0], 'YYYY-MM-DD HH:mm:ss'),
        moment(value[1], 'YYYY-MM-DD HH:mm:ss'),
      );
    } else {
      this.setState({
        startDate: '',
        endDate: '',
      });
    }
  };

  onDateChange2 = (value, dateString) => {
    if (value) {
      this.setState({
        startDate: value,
        endDate: value,
      });
      this.child.startPlay(
        moment(value, 'YYYY-MM-DD 00:00:00'),
        moment(value, 'YYYY-MM-DD 23:59:59'),
      );
    } else {
      this.setState({
        startDate: '',
        endDate: '',
      });
    }
  };

  onRef1 = ref => {
    this.child = ref;
  };

  onPlaybackClick = () => {
    const { startDate, endDate } = this.state;
    if (startDate && endDate) {
      this.playbackVideo.onPlaybackVideo();
    } else {
      message.error('请选择时间后播放！');
    }
  };

  render() {
    const { currentVideo, endDate, startDate, currentKey } = this.state;
    const { DGIMN, videoList, loading } = this.props;
    if (videoList.length === 0) {
      return (
        <Card
          loading={loading}
          style={{ width: '100%', height: 'calc(100vh - 230px)', ...this.props.style }}
        >
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {' '}
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无视频数据" />
          </div>
        </Card>
      );
    }

    return (
      <Card bordered={false} bodyStyle={{ display: 'flex' }} loading={loading}>
        <div className={styles.videoContainer}>
          {currentVideo.VedioCamera_ID ? (
            currentKey === '1' ? (
              <LiveVideo videoInfo={{...currentVideo,InputType:1}}/>
            ) : (
              <PlaybackVideo
                onRef={ref => (this.playbackVideo = ref)}
                startDate={startDate}
                endDate={endDate}
                videoInfo={{...currentVideo,InputType:1}}
              />
            )
          ) : (
            ''
          )}
        </div>
        <div className={styles.rightContent}>
          <Tabs
            defaultActiveKey="1"
            activeKey={currentKey}
            onChange={key => {
              this.setState({ currentKey: key });
            }}
          >
            <TabPane tab="实时" key="1">
              <Row>
                <label htmlFor="" style={{ lineHeight: '32px', marginRight: 10 }}>
                  选择摄像头：
                </label>
                <Select
                  style={{ width: '200px' }}
                  value={currentVideo.VedioCamera_ID}
                  onChange={(value, option) => {
                    this.setState({ currentVideo: option['data-item'] });
                  }}
                >
                  {videoList.map(item => {
                    return (
                      <Option value={item.VedioCamera_ID} data-item={item}>
                        {item.VedioCamera_Name}
                      </Option>
                    );
                  })}
                </Select>
              </Row>
              <PTZControl videoInfo={currentVideo} />
              <RealVideoData isShowControl={currentVideo.IsShowControl} dgimn={DGIMN} />
            </TabPane>
            <TabPane tab="历史" key="2">
              <Row>
                <label htmlFor="" style={{ lineHeight: '32px', marginRight: 10 }}>
                  选择摄像头：
                </label>
                <Select
                  style={{ width: '260px' }}
                  value={currentVideo.VedioCamera_ID}
                  onChange={(value, option) => {
                    this.setState({ currentVideo: option['data-item'] });
                  }}
                >
                  {videoList.map(item => {
                    return (
                      <Option value={item.VedioCamera_ID} data-item={item}>
                        {item.VedioCamera_Name}
                      </Option>
                    );
                  })}
                </Select>
              </Row>
              {/* <Row style={{ marginTop: 10 }}>
                <label htmlFor="" style={{ lineHeight: '32px', marginRight: 10 }}>
                  选择时间段：
                </label>
                <RangePicker
                  style={{ width: '260px', marginRight: 10 }}
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  onChange={this.onDateChange}
                />
              </Row> */}
              <Row style={{ marginTop: 10 }}>
                <label htmlFor="" style={{ lineHeight: '32px', marginRight: 10 }}>
                  请选择时间：
                </label>
                <DatePicker
                  onChange={this.onDateChange2}
                  style={{ width: '260px', marginRight: 10 }}
                />
              </Row>
              <Divider orientation="right">
                <Button type="primary" onClick={this.onPlaybackClick}>
                  播放
                </Button>
              </Divider>
              <HistoryVideoData
                onRef={this.onRef1}
                // {...this.props}
                dgimn={DGIMN}
                beginDate={moment(startDate, 'YYYY-MM-DD 00:00:00')}
                endDate={moment(endDate, 'YYYY-MM-DD 23:59:59')}
              />
            </TabPane>
          </Tabs>
        </div>
      </Card>
    );
  }
}

export default VideoContent;
