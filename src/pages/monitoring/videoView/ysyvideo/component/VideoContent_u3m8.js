import React, { PureComponent } from 'react';
import { Card, Tabs, Row, Select, DatePicker, Button, Empty, Divider, message } from 'antd'
import { connect } from 'dva';
import styles from '../index.less'
import YsyRealVideoData from '@/components/ysyvideo/YsyRealVideoData'
import HistoryVideo from '@/components/ysyvideo/YsyHisVideoData'
import moment from 'moment'
import VideoPlayer from '@/pages/SC/realtimeLive/VideoPlayer'

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const videoList = [
  {
    VedioID: '01',
    VedioName: '行政楼楼顶',
  },
  {
    VedioID: '02',
    VedioName: '烟气在线室',
  },
]

@connect(({ videodata, loading }) => ({
  vIsLoading: loading.effects['videodata/getvideolist'],
}))
class VideoContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      videoSrc: `http://223.84.203.227:8088/record/cam/47568770720087/01/${moment().format('YYYYMMDD')}/out.m3u8`,
      videoPlaybackTime: '',
      currentVideo: {
        VedioID: '01',
        VedioName: '摄像头1',
      },
      template: 'standard',
      currentKey: '1'
    };
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.setState({ currentKey: '1' })
    }
  }

  /** 时间控件 */
  onDateChange = (value, dateString) => {
    if (value && value.length > 1) {
      this.setState({
        videoPlaybackTime: value[0].format('YYYYMMDD'),
      });
    } else {
      this.setState({
        videoPlaybackTime: '',
      });
    }

  };

  onRef1 = ref => {
    this.child = ref;
  };

  onPlaybackClick = () => {
    const { videoPlaybackTime, currentVideo } = this.state;
    if (videoPlaybackTime) {
      this.setState({
        videoSrc: `http://223.84.203.227:8088/record/cam/47568770720087/${currentVideo.VedioID}/${videoPlaybackTime}/out.m3u8`
      })
    } else {
      message.error('请选择时间后播放！')
    }
  }

  render() {
    const { currentVideo, endDate, startDate, currentKey, videoPlayTime, videoSrc } = this.state;
    const { DGIMN } = this.props;
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
          <VideoPlayer src={videoSrc} mode={currentKey === '1' ? 'live' : 'history'} />
        </div>
        <div className={styles.rightContent}>
          <Tabs defaultActiveKey="1" activeKey={currentKey} onChange={(key) => {
            this.setState({
              currentKey: key
            })
            if (key == '1') {
              this.setState({
                videoSrc: `http://223.84.203.227:8088/record/cam/47568770720087/${currentVideo.VedioID}/${moment().format('YYYYMMDD')}/out.m3u8`
              })
            }
          }}>
            <TabPane tab="实时" key="1">
              <Row>
                <label htmlFor="" style={{ lineHeight: "32px", marginRight: 10 }}>选择摄像头：</label>
                <Select style={{ width: "200px" }} value={currentVideo.VedioID} onChange={(value, option) => {
                  this.setState({
                    currentVideo: option['attr-item'],
                    videoSrc: `http://223.84.203.227:8088/record/cam/47568770720087/${option['attr-item'].VedioID}/${moment().format('YYYYMMDD')}/out.m3u8`
                  })
                }}>
                  {
                    videoList.map(item => {
                      return <Option value={item.VedioID} attr-item={item}>{item.VedioName}</Option>
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
                <Select style={{ width: "260px" }} value={currentVideo.VedioID} onChange={(value, option) => {
                  this.setState({ currentVideo: option['attr-item'] })
                }}>
                  {
                    videoList.map(item => {
                      return <Option value={item.VedioID} attr-item={item}>{item.VedioName}</Option>
                    })
                  }
                </Select>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <label htmlFor="" style={{ lineHeight: "32px", marginRight: 10 }}>选择时间段：</label>
                <RangePicker
                  style={{ width: '260px', marginRight: 10 }}
                  // showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD"
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