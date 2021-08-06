import React, { PureComponent } from 'react';
import { Card, Tabs, Row, Select, DatePicker, Button, Empty, Divider, message } from 'antd'
import { connect } from 'dva';
import styles from '../index.less'
import LiveVideo from "@/components/YSYVideo-React/Live"
import PlaybackVideo from "@/components/YSYVideo-React/Playback"
import YsyRealVideoData from '@/components/ysyvideo/YsyRealVideoData'
import HistoryVideo from '@/components/ysyvideo/YsyHisVideoData'
import moment from 'moment'

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ videodata, loading }) => ({
  vIsLoading: loading.effects['videodata/getvideolist'],
  videoList: videodata.videoList,
}))
class VideoContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentVideo: {},
      template: 'standard',
      currentKey: '1'
    };
  }

  componentDidMount() {
    this.getVideoList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.setState({ currentKey: '1' })
      this.getVideoList();
    }
  }

  // 获取摄像头列表
  getVideoList = () => {
    this.props.dispatch({
      type: 'videodata/getvideolist',
      payload: {
        DGIMN: this.props.DGIMN,
        callback: data => {
          if (data && data.length) {
            this.getVideoIp(data[0].VedioID);
          } else {
            this.setState({
              currentVideo: {}
            })
          }
          console.log('data=', data)
        },
      },
    });
  }

  // 根据id获取选中的摄像头信息
  getVideoIp = (id) => {
    this.props.dispatch({
      type: 'videodata/ysyvideourl',
      payload: {
        VedioCameraID: id,
      },
      callback: (res) => {
        if (res && res.length) {
          this.setState({
            currentVideo: { ...res[0], VedioID: id }
          })
        }
      }
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

  onRef1 = ref => {
    this.child = ref;
  };

  onPlaybackClick = () => {
    const { startDate, endDate } = this.state;
    console.log('startDate=', startDate)
    console.log('endDate=', endDate)
    if (startDate && endDate) {
      this.playbackVideo.onPlayClick(startDate.format('YYYYMMDDHHmmss'), endDate.format('YYYYMMDDHHmmss'))
    } else {
      message.error('请选择时间后播放！')
    }
  }

  render() {
    const { currentVideo, endDate, startDate, currentKey } = this.state;
    const { DGIMN, videoList } = this.props;
    if (videoList.length === 0) {
      return (<Card style={{ width: '100%', height: 'calc(100vh - 230px)', ...this.props.style }}>< div style={
        {
          textAlign: 'center',
        }
      } > <Empty image={
        Empty.PRESENTED_IMAGE_SIMPLE
      } description="暂无视频数据"
        /></div ></Card>);
    }
    return (
      <Card
        bordered={false}
        bodyStyle={{ display: 'flex' }}
      >
        <div className={styles.videoContainer}>
          {
            currentVideo.SerialNumber ?
              (
                currentKey === '1' ? <LiveVideo channelNo={currentVideo.SerialNumber} HD={currentVideo.PortNum} /> :
                  <PlaybackVideo onRef={ref => this.playbackVideo = ref} channelNo={currentVideo.SerialNumber} HD={currentVideo.PortNum} />
              ) : ""
          }
        </div>
        <div className={styles.rightContent}>
          <Tabs defaultActiveKey="1" activeKey={currentKey} onChange={(key) => {
            this.setState({ currentKey: key })
          }}>
            <TabPane tab="实时" key="1">
              <Row>
                <label htmlFor="" style={{ lineHeight: "32px", marginRight: 10 }}>选择摄像头：</label>
                <Select style={{ width: "200px" }} value={currentVideo.VedioID} onChange={(value) => {
                  this.getVideoIp(value)
                }}>
                  {
                    videoList.map(item => {
                      return <Option value={item.VedioID}>{item.VedioName}</Option>
                    })
                  }
                </Select>
              </Row>
              <Divider />
              <YsyRealVideoData dgimn={DGIMN} />
            </TabPane>
            <TabPane tab="历史" key="2">
              <Row>
                <label htmlFor="" style={{ lineHeight: "32px", marginRight: 10 }}>选择摄像头：</label>
                <Select style={{ width: "260px" }} value={currentVideo.VedioID}>
                  {
                    videoList.map(item => {
                      return <Option value={item.VedioID}>{item.VedioName}</Option>
                    })
                  }
                </Select>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <label htmlFor="" style={{ lineHeight: "32px", marginRight: 10 }}>选择时间段：</label>
                <RangePicker
                  style={{ width: '260px', marginRight: 10 }}
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  onChange={this.onDateChange}
                />
              </Row>
              <Divider orientation="right">
                <Button type="primary" onClick={this.onPlaybackClick}>播放</Button>
              </Divider>
              <HistoryVideo
                onRef={this.onRef1}
                // {...this.props}
                dgimn={DGIMN}
                beginDate={moment(startDate, 'YYYY-MM-DD HH:mm:ss')}
                endDate={moment(endDate, 'YYYY-MM-DD HH:mm:ss')}
              />
            </TabPane>
          </Tabs>
        </div>
      </Card>
    );
  }
}

export default VideoContent;