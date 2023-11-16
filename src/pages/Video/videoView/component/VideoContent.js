import React, { PureComponent } from 'react';
import { Card, Tabs, Row, Select, DatePicker, Button, Empty, Divider, message } from 'antd';
import { connect } from 'dva';
import styles from '../index.less';
// import LiveVideo from "@/components/Video/YSY/Live"
import RealVideoData from '@/components/ysyvideo/RealVideoData';
import HistoryVideoData from '@/components/ysyvideo/HisVideoData';
// import RealVideoData from './RealData'
// import HistoryVideoData from './HisData'
import PTZControl from '@/components/Video/PTZControl';
import moment from 'moment';
import LiveVideo from '@/components/Video/LiveVideo';
import PlaybackVideo from '@/components/Video/PlaybackVideo';
import Cookie from 'js-cookie';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ video, loading }) => ({
  loading: loading.effects['video/getvideolist'],
  videoList: video.videoList,
}))
class VideoContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentVideo: {},
      template: 'standard',
      currentKey: props.defaultActiveKey || '1',
      showTabsKeys: props.defaultActiveKey ? [props.defaultActiveKey] : ['1', '2'],
    };
  }

  componentDidMount() {
    this.getVideoList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.setState({ currentKey: this.props.defaultActiveKey || '1' });
      this.getVideoList();
    }

    if (prevProps.defaultActiveKey !== this.props.defaultActiveKey) {
      this.setState({
        currentKey: this.props.defaultActiveKey || '1',
        showTabsKeys: this.props.defaultActiveKey ? [this.props.defaultActiveKey] : ['1', '2'],
      });
    }
  }

  // 获取摄像头列表
  getVideoList = () => {
    this.props.dispatch({
      type: 'video/getVideoList',
      payload: {
        DGIMN: this.props.DGIMN,
      },
      callback: res => {
        // if (data && data.length) {
        //   this.getVideoIp(data[0].VedioID);
        // } else {
        //   this.setState({
        //     currentVideo: {}
        //   })
        // }
        if (res && res.length) {
          this.setState(
            {
              currentVideo: res[0],
            },
            () => {
              this.onLogging();
            },
          );
        }
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
    console.log('value', value);
    if (value) {
      this.setState({
        startDate: value.startOf('day'),
        endDate: value.endOf('day'),
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
      this.onLogging();
      // this.setState({ startDate, endDate, num: Math.random() * 100 })
    } else {
      message.error('请选择时间后播放！');
    }
  };

  // 记录日志
  onLogging = () => {
    const { pointName, entName } = this.props;
    const { startDate, endDate, currentVideo, currentKey } = this.state;
    let userCookie = Cookie.get('currentUser');
    debugger;
    if (!userCookie) {
      router.push('/user/login');
      return;
    }

    if (!currentVideo.VedioCamera_ID) {
      return;
    }
    // 【某企业】-【某排口】-【某摄像头】被访问；
    // 【某企业】-【某排口】-【某摄像头】的什么时间到什么时间视频被访问；

    let AccessModuleJson = '';
    if (currentKey === '1') {
      AccessModuleJson = `【${entName}企业】-【${pointName}排口】-【${currentVideo.VedioCamera_Name}摄像头】被访问。`;
    } else {
      AccessModuleJson = `【${entName}企业】-【${pointName}排口】-【${
        currentVideo.VedioCamera_Name
      }摄像头】在${moment(startDate).format('YYYY-MM-DD HH:mm:ss')}到${moment(endDate).format(
        'YYYY-MM-DD HH:mm:ss',
      )}视频被访问。`;
    }

    let body = {
      User_Name: JSON.parse(userCookie).UserName,
      User_Account: JSON.parse(userCookie).UserAccount,
      AccessTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      AccessModule: currentKey === '1' ? '实时视频管理' : '视频录像',
      AccessModuleJson: AccessModuleJson,
      OprationType: '访问',
    };
    console.log('body', body);
    // return;
    this.props.dispatch({
      type: 'common/AddUserAccessLog',
      payload: body,
    });
  };

  render() {
    const { currentVideo, endDate, startDate, currentKey, showTabsKeys } = this.state;
    const { DGIMN, videoList, loading, defaultActiveKey } = this.props;

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
              <LiveVideo videoInfo={currentVideo} />
            ) : (
              <PlaybackVideo
                onRef={ref => (this.playbackVideo = ref)}
                startDate={startDate}
                endDate={endDate}
                videoInfo={currentVideo}
              />
            )
          ) : (
            ''
          )}
        </div>
        <div className={styles.rightContent}>
          <Tabs
            // defaultActiveKey={defaultActiveKey}
            activeKey={currentKey}
            onChange={key => {
              // let el = document.querySelector(`#ysyPlaybackWrapper-wrap`);
              // if (el) el.innerHTML = '';
              this.setState({ currentKey: key });
            }}
          >
            {showTabsKeys.includes('1') && (
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
                {/* <Divider style={{ marginBottom: 0 }} /> */}
                <PTZControl videoInfo={currentVideo} />
                <RealVideoData isShowControl={currentVideo.IsShowControl} dgimn={DGIMN} />
              </TabPane>
            )}
            {showTabsKeys.includes('2') && (
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
                <Row style={{ marginTop: 10 }}>
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
                </Row>
                {/* <Row style={{ marginTop: 10 }}>
                <label htmlFor="" style={{ lineHeight: '32px', marginRight: 10 }}>
                  请选择时间：
                </label>
                <DatePicker
                  onChange={this.onDateChange2}
                  style={{ width: '260px', marginRight: 10 }}
                />
              </Row> */}
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
            )}
          </Tabs>
        </div>
      </Card>
    );
  }
}

export default VideoContent;
