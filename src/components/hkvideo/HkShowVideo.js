import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  Divider,
  Spin,
  Tabs,
  DatePicker,
  message,
  Icon,
  Empty,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';
import config from '@/config';
import HkRealVideoData from './HkRealVideoData';
import HkHisVideoData from './HkHisVideoData';
import { Top, Down, Left, Right, Adaption, Lefttop, Righttop, Leftdown, Rightdown } from '@/utils/icon'
import {
  InitVideo, clickLogin, clickStartRealPlay, mouseDownPTZControl, mouseUpPTZControl,
  PTZZoomIn, PTZZoomOut, PTZZoomStop,
  PTZFocusIn, PTZFocusOut, PTZFocusStop,
  PTZIrisIn, PTZIrisOut, PTZIrisStop, clickStartPlayback, clickStopPlayback, clickPause, clickResume, clickPlaySlow, clickPlayFast, clickReversePlayback, clickCapturePic,
} from '@/utils/video';

const { TabPane } = Tabs;
/**
 * 海康视频
 * xpy
 * 2019-09-16
 */
@connect(({
  videodata, loading,
}) => ({
  IsLoading: loading.effects['videodata/hkvideourl'],
  hkvideoListParameters: videodata.hkvideoListParameters,
}))
class HkShowVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayR: true,
      beginDate: '',
      endDate: '',
      endOpen: false,
      startValue: null,
      endValue: null,
      dgimn: '',
      IsIE: false,
      tabsKey: '1',

    };
  }

  /** 初始化加载 */
  componentDidMount() {
    this.props.initLoadData && this.changeDgimn(this.props.DGIMN);
  }

  /** 改变排口后加载 */
  componentWillReceiveProps = nextProps => {
    if (nextProps.DGIMN !== this.props.DGIMN) {
      this.setState({
        dgimn: nextProps.DGIMN,
      })
      this.changeDgimn(nextProps.DGIMN);
    }
  }

  /** 根据排口信息初始化视频 */
  changeDgimn = dgimn => {
    this.setState({
      dgimn,
    })
    this.props.dispatch({
      type: 'videodata/hkvideourl',
      payload: {
        DGIMN: dgimn,
      },
    }).then(() => {
      this.initV(this.props.hkvideoListParameters[0])
    })
  }

  /** 视频登陆初始化 */
  initV = loginPara => {
    const divPlugin = document.getElementById('divPlugin');
    if (loginPara != null && divPlugin !== undefined && divPlugin != null) {
      const msg = InitVideo();
      if (msg.flag) {
        this.setState({ IsIE: true });
        message.info(msg.message);
        const msg2 = clickLogin(loginPara);
        if (msg2 !== null && msg2 !== undefined && msg2.flag) {
          debugger;
          message.success(msg2.message);
          // 实时视频立即播放
          if (this.state.tabsKey === '1') {
            console.log('播放');
            const para = loginPara;
            setTimeout(() => {
              clickStartRealPlay(para);
            }, 1000);
          }
        } else {
          message.warning(msg.message, 100000)
        }
      }
    };
  }

  /** 历史视频 */
  onRef1 = ref => {
    this.child = ref;
  };

  /** 回放操作 */
  playBack = () => {
    debugger;
    const {
      beginDate,
      endDate,
    } = this.state;
    console.log(this.props.hkvideoListParameters[0].Device_Port);
    this.child.startPlay(
      moment(beginDate, 'YYYY-MM-DD HH:mm:ss'),
      moment(endDate, 'YYYY-MM-DD HH:mm:ss'),
    );
    if (this.state.IsIE) {
      if (this.props.hkvideoListParameters[0]) {
        const para = {
          beginTime: beginDate,
          endTime: endDate,
          ip: this.props.hkvideoListParameters[0].IP,
          devicePort: this.props.hkvideoListParameters[0].Device_Port,
          userName: this.props.hkvideoListParameters[0].User_Name,
          userPwd: this.props.hkvideoListParameters[0].User_Pwd,
          cameraNo: this.props.hkvideoListParameters[0].VedioCamera_No,
        };
        const msg = clickStartPlayback(para);
        if (msg === '开始回放成功！') {
          this.child.startPlay(
            moment(beginDate, 'YYYY-MM-DD HH:mm:ss'),
            moment(endDate, 'YYYY-MM-DD HH:mm:ss'),
          );
        }
      }
    }
  };

  /** 历史视频操作 */
  btnBackClick = opt => {
    if (this.state.IsIE) {
      switch (opt) {
        case 1:
          clickStopPlayback();
          break;
        case 2:
          clickPause();
          break;
        case 3:
          clickResume();
          break;
        case 4:
          clickPlaySlow();
          break;
        case 5:
          clickPlayFast();
          break;
        default:
          clickStopPlayback();
          break;
      }
    } else {
      message.info('请在IE11浏览器下查看视频');
    }
  }

  /** 截图 */
  CapturePic = () => {
    if (this.state.IsIE && this.props.hkvideoListParameters[0]) {
      const msg = clickCapturePic(this.props.hkvideoListParameters[0].VedioCamera_No);
      if (msg.flag) {
        message.success(msg.message, 5);
      } else {
        message.error(msg.message);
      }
    }
  }

  // 倒放
  reverseBack = () => {
    const {
      beginDate,
      endDate,
    } = this.state;
    if (this.state.IsIE) {
      if (this.props.hkvideoListParameters[0]) {
        const para = {
          beginTime: beginDate,
          endTime: endDate,
          ip: this.props.hkvideoListParameters[0].IP,
          devicePort: this.props.hkvideoListParameters[0].Device_Port,
          userName: this.props.hkvideoListParameters[0].User_Name,
          userPwd: this.props.hkvideoListParameters[0].User_Pwd,
          cameraNo: this.props.hkvideoListParameters[0].VedioCamera_No,
        };
        const msg = clickReversePlayback(para);
        message.info(msg);
      }
    } else {
      message.info('请在IE11浏览器下查看视频');
    }
  }

  /** 实时视频操作 */
  btnClick = opt => {
    this.initV(this.props.hkvideoListParameters[0]);
    if (this.state.IsIE) {
      mouseDownPTZControl(opt);
      mouseUpPTZControl();
    }
  }

  /** 调焦 */
  btnZoomClick = opt => {
    if (this.state.IsIE) {
      if (opt === 11) {
        PTZZoomIn();
        PTZZoomStop();
      } else {
        PTZZoomOut();
        PTZZoomStop();
      }
    }
  }

  /** 聚焦 */
  btnFocusClick = opt => {
    if (this.state.IsIE) {
      if (opt === 15) {
        PTZFocusIn();
        PTZFocusStop();
      } else {
        PTZFocusOut();
        PTZFocusStop();
      }
    }
  }

  /** 光圈 */
  btnIrisClick = opt => {
    if (this.state.IsIE) {
      if (opt === 19) {
        PTZIrisIn();
        PTZIrisStop();
      } else {
        PTZIrisOut();
        PTZIrisStop();
      }
    }
  }

  /** tabs切换 */
  tabsChange = key => {
    console.log('----------------------key', key === '1');
    if (key === '1') {
      this.btnBackClick(1);
      this.setState({
        tabsKey: key,
      }, () => {
        this.btnBackClick(1);
        this.initV(this.props.hkvideoListParameters[0]);
      })
    } else {
      this.setState({
        tabsKey: key,
      }, () => {
        this.initV(this.props.hkvideoListParameters[0]);
      })
    }
  };

  /** 时间控件 */
  disabledStartDate = startValue => {
    const {
      endValue,
    } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  disabledEndDate = endValue => {
    const {
      startValue,
    } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onStartChange = (value, dateString) => {
    this.onChange('startValue', value);
    this.setState({
      beginDate: dateString,
    });
  }

  onEndChange = (value, dateString) => {
    this.onChange('endValue', value);
    this.setState({
      endDate: dateString,
    });
  }

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({
        endOpen: true,
      });
    }
  }

  handleEndOpenChange = open => {
    this.setState({
      endOpen: open,
    });
  }

  render() {
    const { hkvideoListParameters, IsLoading } = this.props;
    const { endOpen, IsIE } = this.state;
    // if (!IsIE) {
    //   return (<Card style={{ width: '100%', height: 'calc(100vh - 230px)', ...this.props.style }}>< div style={
    //     {
    //       textAlign: 'center',
    //     }
    //   } > <Empty image={
    //     Empty.PRESENTED_IMAGE_SIMPLE
    //   } description="请在IE11浏览器中打开网站并观看视频"
    //     /></div ></Card>);
    // }
    if (IsLoading) {
      return (<Spin
        style={{
          width: '100%',
          height: 'calc(100vh - 225px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        size="large"
      />);
    }
    if (IsLoading) {
      return (<Spin
        style={{
          width: '100%',
          height: 'calc(100vh - 225px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        size="large"
      />);
    }
    if (hkvideoListParameters.length === 0) {
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
      <div style={{ height: 'calc(100vh - 210px)', width: '100%' }}>
        <Row gutter={24} style={{ height: '100%' }}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ height: '100%', overflow: 'hidden' }}>
            <div id="divPlugin" style={{ width: '100%', marginRight: '10px', height: '100%', position: 'absolute', zIndex: '-1' }} />
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ height: '100%' }}>
            <Card className={styles.card}>
              <Tabs
                defaultActiveKey="1"
                onChange={key => {
                  this.tabsChange(key);
                }}
              >
                <TabPane tab="实时" key="1">
                  <Card className={styles.hisYunStyle}>
                    <Row style={{ textAlign: 'center' }}>
                      <Col span={8}>
                        <Button
                          icon="file-image"
                          size="Small"
                          onClick={this.CapturePic.bind(this)}
                        > 抓图
                                                </Button>
                      </Col>
                    </Row>
                    <Divider type="horizontal" />
                    <Row style={{ textAlign: 'center' }}>
                      <Col span={24}>
                        <Row>
                          <Col className={styles.gutterleft} span={8}>
                            <Button
                              size="Small"
                              onClick={
                                this.btnClick.bind(this, 5)
                              }
                            > <Lefttop />左上
                                                </Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button
                              size="Small"
                              onClick={this.btnClick.bind(this, 1)}
                            ><Top />上&nbsp;&nbsp;&nbsp;
                                                </Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button
                              size="Small"
                              onClick={this.btnClick.bind(this, 7)}
                            ><Righttop /> 右上
                                                </Button>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                          <Col className={styles.gutterleft} span={8}>
                            <Button
                              size="Small"
                              onClick={this.btnClick.bind(this, 3)}
                            ><Left />左&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button
                              size="Small"
                              onClick={this.btnClick.bind(this, 9)}
                            ><Adaption />自动</Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button
                              size="Small"
                              onClick={this.btnClick.bind(this, 4)}
                            ><Right />右&nbsp;&nbsp;&nbsp;</Button>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                          <Col className={styles.gutterleft} span={8}>
                            <Button
                              size="Small"
                              onClick={this.btnClick.bind(this, 6)}
                            ><Leftdown />左下</Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button
                              size="Small"
                              onClick={this.btnClick.bind(this, 2)}
                            ><Down />下&nbsp;&nbsp;&nbsp;</Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button
                              size="Small"
                              onClick={this.btnClick.bind(this, 8)}
                            ><Rightdown />右下</Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Divider type="horizontal" />
                    <Row>
                      <Col span={24}>
                        <Row style={{ textAlign: 'center' }}>
                          <Col className={styles.gutterleft} span={8}>
                            <Row>
                              <div className={styles.divbtn}>
                                <Col className={styles.gutterleft} span={8}>
                                  <Button
                                    shape="circle"
                                    icon="zoom-in"
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.btnZoomClick.bind(this, 11)}
                                  />
                                </Col>
                                <Col className={styles.gutterleft} span={8}>变倍</Col>
                                <Col className={styles.gutterleft} span={8}>
                                  <Button
                                    shape="circle"
                                    icon="zoom-out"
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.btnZoomClick.bind(this, 12)}
                                  />
                                </Col>
                              </div>
                            </Row>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Row>
                              <div className={styles.divbtn}>
                                <Col className={styles.gutterleft} span={8}>
                                  <Button
                                    shape="circle"
                                    icon="zoom-in"
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.btnFocusClick.bind(this, 15)}
                                  />
                                </Col>
                                <Col className={styles.gutterleft} span={8}>变焦</Col>
                                <Col className={styles.gutterleft} span={8}>
                                  <Button
                                    shape="circle"
                                    icon="zoom-out"
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.btnFocusClick.bind(this, 16)}
                                  />
                                </Col>
                              </div>
                            </Row>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Row>
                              <div className={styles.divbtn}>
                                <Col className={styles.gutterleft} span={8}>
                                  <Button
                                    shape="circle"
                                    icon="zoom-in"
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.btnIrisClick.bind(this, 19)}
                                  />
                                </Col>
                                <Col className={styles.gutterleft} span={8}>光圈</Col>
                                <Col className={styles.gutterleft} span={8}>
                                  <Button
                                    shape="circle"
                                    icon="zoom-out"
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.btnIrisClick.bind(this, 20)}
                                  />
                                </Col>
                              </div>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Divider type="horizontal" />
                    <Row gutter={48}>
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        {this.state.displayR && <HkRealVideoData dgimn={this.state.dgimn} />}
                      </Col>
                    </Row>
                  </Card>
                </TabPane>
                <TabPane tab="历史" key="2">
                  <Card className={styles.hisYunStyle}>
                    <Row>
                      <Col span={24}>
                        <Row>
                          <Col span={10}>
                            <DatePicker
                              style={{ width: '170px', minWidth: '130px' }}
                              disabledDate={
                                this.disabledStartDate
                              }
                              format="YYYY-MM-DD HH:mm:ss"
                              showTime={{ format: 'HH:mm:ss' }}
                              placeholder="开始日期"
                              onChange={
                                this.onStartChange
                              }
                              onOpenChange={
                                this.handleStartOpenChange
                              }
                            />
                          </Col>
                          <Col span={10} style={{ marginLeft: '40px' }}>
                            <DatePicker
                              style={{ width: '170px', minWidth: '130px' }}
                              showTime={{ format: 'HH:mm:ss' }}
                              disabledDate={
                                this.disabledEndDate
                              }
                              format="YYYY-MM-DD HH:mm:ss"
                              placeholder="结束日期"
                              onChange={
                                this.onEndChange
                              }
                              open={
                                endOpen
                              }
                              onOpenChange={
                                this.handleEndOpenChange
                              }
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Divider type="horizontal" />
                    <Row>
                      <Col span={24}>
                        <Row style={{ marginTop: '10px' }}>
                          <Col className={styles.gutterleft} span={12}>
                            <Button icon="play-circle" onClick={this.playBack.bind(this)}>开始回放</Button>
                          </Col>
                          <Col className={styles.gutterleft} span={12}>
                            <Button icon="close-circle" onClick={this.btnBackClick.bind(this, 1)}>停止回放</Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Divider type="horizontal" />
                    <Row>
                      <Col span={24}>
                        <Row>

                          <Col className={styles.gutterleft} span={8}><Button icon="pause-circle" onClick={this.btnBackClick.bind(this, 2)}>暂停</Button></Col>
                          <Col className={styles.gutterleft} span={8}><Button icon="check-circle" onClick={this.btnBackClick.bind(this, 3)}>恢复</Button></Col>
                          <Col className={styles.gutterleft} span={8}><Button icon="picture" onClick={this.CapturePic.bind(this)}>抓图</Button></Col>
                        </Row>
                        <Row style={{ marginTop: '30px' }}>
                          <Col className={styles.gutterleft} span={8}><Button icon="step-forward" onClick={this.btnBackClick.bind(this, 4)}>慢放</Button></Col>
                          <Col className={styles.gutterleft} span={8}><Button icon="fast-forward" onClick={this.btnBackClick.bind(this, 5)}>快放</Button></Col>
                          <Col className={styles.gutterleft} span={8}><Button icon="fast-backward" onClick={this.reverseBack.bind(this)}> 倒放</Button></Col>
                        </Row>
                      </Col>
                    </Row>
                    <Divider type="horizontal" />
                    <Row gutter={48} style={{ display: this.state.displayH }}>
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        {this.state.displayR && (
                          <HkHisVideoData
                            onRef={this.onRef1}
                            {...this.props}
                            dgimn={this.state.dgimn}
                            beginDate={moment(this.state.beginDate, 'YYYY-MM-DD HH:mm:ss')}
                            endDate={moment(this.state.endDate, 'YYYY-MM-DD HH:mm:ss')}
                          />
                        )}
                      </Col>
                    </Row>
                  </Card>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default HkShowVideo;
