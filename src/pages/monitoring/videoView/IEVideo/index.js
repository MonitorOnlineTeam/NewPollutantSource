import React, { PureComponent } from 'react';
import { Card, Tabs, Row, Select, DatePicker, Button, Empty, Divider, message } from 'antd'
import { connect } from 'dva';
import styles from './index.less'
import YsyRealVideoData from '@/components/ysyvideo/YsyRealVideoData'
import HistoryVideo from '@/components/ysyvideo/YsyHisVideoData'
import moment from 'moment'
import { initVideo } from './IEVideoUtils'

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ videodata, loading }) => ({
  vIsLoading: loading.effects['videodata/getvideolist'],
  // videoList: videodata.videoList,
}))
class IEVideo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      videoList: [],
      currentVideo: {
        szIP: '223.84.203.240',
        szPort: 8081,
        szUsername: 'dshbjk',
        szPassword: 'admin123456',
        rtspPort: 80,
        protocol: 0,
        channels: 13,
      },
      template: 'standard',
      currentKey: '1'
    };
  }

  componentDidMount() {
    this.getVideoList();
  }

  getVideoList = () => {
    this.props.dispatch({
      type: 'videodata/hkvideourl',
      payload: {
        DGIMN: this.props.DGIMN
      },
      callback: (res) => {
        if (res && res.length) {
          this.setState({
            videoList: res,
            currentVideo: res[0] || {},
          }, () => {
            this.initVideoData()
          })
        } else {
          this.setState({
            videoList: []
          })
        }
      }
    })
  }

  initVideoData = () => {
    const { currentVideo } = this.state;
    const videoData = {
      szIP: currentVideo.IP,
      szPort: currentVideo.Device_Port * 1,
      szUsername: currentVideo.User_Name,
      szPassword: currentVideo.User_Pwd,
      rtspPort: 80,
      protocol: 0,
      channels: currentVideo.VedioDevice_No * 1,
    };
    initVideo(videoData);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.setState({ currentKey: '1' })
      this.getVideoList();
    }
  }


  render() {
    const { currentVideo, videoList, startDate, currentKey } = this.state;
    const { DGIMN, } = this.props;
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
          <div id="divPlugin" className={styles.Plugin}></div>
        </div>
        <div className={styles.rightContent}>
          <Tabs defaultActiveKey="1" activeKey={currentKey} onChange={(key) => {
            this.setState({ currentKey: key })
          }}>
            <TabPane tab="实时" key="1">
              <Row>
                <label htmlFor="" style={{ lineHeight: "32px", marginRight: 10 }}>选择摄像头：</label>
                <Select style={{ width: "200px" }} value={currentVideo.VedioDevice_No} onChange={(value, option) => {
                  // this.getVideoIp(value)
                  this.setState({
                    currentVideo: option['data-item']
                  }, () => {
                    this.initVideoData();
                  })
                }}>
                  {
                    videoList.map(item => {
                      return <Option data-item={item} value={item.VedioDevice_No}>{item.VedioDevice_Name}</Option>
                    })
                  }
                </Select>
              </Row>
              <Divider />
              <YsyRealVideoData dgimn={DGIMN} />
            </TabPane>
            {/* <TabPane tab="历史" key="2">
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
            </TabPane> */}
          </Tabs>
        </div>
      </Card>
    );
  }
}

export default IEVideo;