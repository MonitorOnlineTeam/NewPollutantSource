import React, { Component } from 'react';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FastForwardOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  StepForwardOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';

import { Row, Col, Button, Card, Divider, Spin, Tabs, DatePicker, message, Empty } from 'antd';
import {
  Top,
  Down,
  Left,
  Right,
  Adaption,
  Lefttop,
  Righttop,
  Leftdown,
  Rightdown,
} from '@/utils/icon';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';

const { TabPane } = Tabs;

/**
 * GBS
 * xpy
 * 2020-03-19
 */
@connect(({ videodata, loading, gbsvideo }) => ({
  IsLoading: loading.effects['videodata/hkvideourl'],
  hkvideoListParameters: videodata.hkvideoListParameters,
}))
class GBSVideo extends Component {
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
    // this.props.initLoadData && this.changeDgimn(this.props.DGIMN);
  }

  /** 改变排口后加载 */
  componentWillReceiveProps = nextProps => {
    // if (nextProps.DGIMN !== this.props.DGIMN) {
    //   this.setState({
    //     dgimn: nextProps.DGIMN,
    //   })
    //   this.changeDgimn(nextProps.DGIMN);
    // }
  };

  /** 实时视频云台控制 */
  PTZChange = type => {
    this.props.dispatch({
      type: 'gbsvideo/GetGBSPTZ',
      payload: {
        serial: '34020000001320000510',
        code: '34020000001320000511',
        command: type,
        callback: result => {
          if (result === 'OK') {
            this.props.dispatch({
              type: 'gbsvideo/GetGBSPTZ',
              payload: {
                serial: '34020000001320000510',
                code: '34020000001320000511',
                command: 'stop',
                callback: result => {},
              },
            });
          }
        },
      },
    });
  };

  /** 实时视频光圈控制 */
  FLChange = type => {
    this.props.dispatch({
      type: 'gbsvideo/GetGBSPFL',
      payload: {
        serial: '34020000001320000510',
        code: '34020000001320000511',
        command: type,
        callback: result => {
          if (result === 'OK') {
            this.props.dispatch({
              type: 'gbsvideo/GetGBSPFL',
              payload: {
                serial: '34020000001320000510',
                code: '34020000001320000511',
                command: 'stop',
                callback: result => {},
              },
            });
          }
        },
      },
    });
  };

  /** 根据排口信息初始化视频 */
  changeDgimn = dgimn => {
    this.setState({
      dgimn,
    });
    this.props
      .dispatch({
        type: 'videodata/hkvideourl',
        payload: {
          DGIMN: dgimn,
        },
      })
      .then(() => {});
  };

  /** 历史视频 */
  onRef1 = ref => {
    this.child = ref;
  };

  /** 回放操作 */
  playBack = () => {
    const { beginDate, endDate } = this.state;
    // this.child.startPlay(
    //   moment(beginDate, 'YYYY-MM-DD HH:mm:ss'),
    //   moment(endDate, 'YYYY-MM-DD HH:mm:ss'),
    // );
    if (beginDate !== '' && endDate !== '') {
      this.props.dispatch({
        type: 'gbsvideo/PlaybackStart',
        payload: {
          serial: '34020000001320088888',
          code: '34020000001320088888',
          starttime: moment(beginDate).format('YYYY-MM-DDTHH:mm:ss'),
          endtime: moment(endDate).format('YYYY-MM-DDTHH:mm:ss'),
          callback: result => {
            if (!result) {
              console.log('------------------------', result);
            }
          },
        },
      });
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
  };

  /** tabs切换 */
  tabsChange = key => {
    console.log('----------------------key', key === '1');
    if (key === '1') {
      this.btnBackClick(1);
      this.setState(
        {
          tabsKey: key,
        },
        () => {
          this.btnBackClick(1);
        },
      );
    } else {
      this.setState(
        {
          tabsKey: key,
        },
        () => {},
      );
    }
  };

  /** 时间控件 */
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onStartChange = (value, dateString) => {
    this.onChange('startValue', value);
    this.setState({
      beginDate: dateString,
    });
  };

  onEndChange = (value, dateString) => {
    this.onChange('endValue', value);
    this.setState({
      endDate: dateString,
    });
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({
        endOpen: true,
      });
    }
  };

  handleEndOpenChange = open => {
    this.setState({
      endOpen: open,
    });
  };

  /**
   *  video-url	视频地址	String	-
   *  video-title	视频右上角显示的标题	String	-
   *  snap-url	视频封面图片	String	-
   *  auto-play	自动播放	Boolean	true
   *  live	是否直播, 标识要不要显示进度条	Boolean	true
   *  speed	是否显示倍速播放按钮。注意：当live为true时，此属性不生效	Boolean	true
   *  loop	是否轮播。	Boolean	false
   *  alt	视频流地址没有指定情况下, 视频所在区域显示的文字	String	无信号
   *  muted	是否静音	Boolean	false
   *  aspect	视频显示区域的宽高比	String	16:9
   *  isaspect	视频显示区域是否强制宽高比	Boolean	true
   *  loading	指示加载状态, 支持 sync 修饰符	String	-
   *  fluent	流畅模式	Boolean	true
   *  timeout	加载超时(秒)	Number	20
   *  stretch	是否不同分辨率强制铺满窗口	Boolean	false
   *  show-custom-button	是否在工具栏显示自定义按钮(极速/流畅, 拉伸/标准)	Boolean	true
   *  isresolution	是否在播放 m3u8 时显示多清晰度选择	Boolean	false
   *  isresolution	供选择的清晰度 "yh,fhd,hd,sd", yh:原始分辨率	fhd:超清，hd:高清，sd:标清	-
   *  resolutiondefault	默认播放的清晰度	String	hd
   */
  render() {
    const { hkvideoListParameters, IsLoading } = this.props;
    const { endOpen, IsIE } = this.state;
    return (
      <div style={{ height: 'calc(100vh - 210px)', width: '100%' }}>
        <Row gutter={24} style={{ height: '100%' }}>
          <Col
            xl={18}
            lg={24}
            md={24}
            sm={24}
            xs={24}
            style={{ height: '100%', overflow: 'hidden' }}
          >
            <easy-player
              video-url="http://121.40.50.44:10001/flv/hls/34020000001320000510_0200000511.flv"
              muted="true"
              auto-play="true"
              live="true"
              aspect="600:350"
              debug="true"
              isresolution="true"
              resolution="yh,fhd,hd,sd"
              resolutiondefault="yh"
            ></easy-player>
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
                      <Col span={24}>
                        <Row>
                          <Col className={styles.gutterleft} span={8}>
                            <Button size="Small" onClick={this.PTZChange.bind(this, 'upleft')}>
                              {' '}
                              <Lefttop />
                              左上
                            </Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button size="Small" onClick={this.PTZChange.bind(this, 'up')}>
                              <Top />
                              上&nbsp;&nbsp;&nbsp;
                            </Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button size="Small" onClick={this.PTZChange.bind(this, 'upright')}>
                              <Righttop /> 右上
                            </Button>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                          <Col className={styles.gutterleft} span={8}>
                            <Button size="Small" onClick={this.PTZChange.bind(this, 'left')}>
                              <Left />
                              左&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}></Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button size="Small" onClick={this.PTZChange.bind(this, 4)}>
                              <Right />
                              右&nbsp;&nbsp;&nbsp;
                            </Button>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                          <Col className={styles.gutterleft} span={8}>
                            <Button size="Small" onClick={this.PTZChange.bind(this, 'upright')}>
                              <Leftdown />
                              &nbsp;左下
                            </Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button size="Small" onClick={this.PTZChange.bind(this, 'down')}>
                              <Down />
                              下&nbsp;&nbsp;&nbsp;
                            </Button>
                          </Col>
                          <Col className={styles.gutterleft} span={8}>
                            <Button size="Small" onClick={this.PTZChange.bind(this, 'downright')}>
                              <Rightdown />
                              右下
                            </Button>
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
                                    icon={<ZoomInOutlined />}
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.PTZChange.bind(this, 'zoomin')}
                                  />
                                </Col>
                                <Col className={styles.gutterleft} span={8}>
                                  变倍
                                </Col>
                                <Col className={styles.gutterleft} span={8}>
                                  <Button
                                    shape="circle"
                                    icon={<ZoomOutOutlined />}
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.PTZChange.bind(this, 'zoomout')}
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
                                    icon={<ZoomInOutlined />}
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.FLChange.bind(this, 'focusnear')}
                                  />
                                </Col>
                                <Col className={styles.gutterleft} span={8}>
                                  变焦
                                </Col>
                                <Col className={styles.gutterleft} span={8}>
                                  <Button
                                    shape="circle"
                                    icon={<ZoomOutOutlined />}
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.FLChange.bind(this, 'focusfar')}
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
                                    icon={<ZoomInOutlined />}
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.FLChange.bind(this, 'irisin')}
                                  />
                                </Col>
                                <Col className={styles.gutterleft} span={8}>
                                  光圈
                                </Col>
                                <Col className={styles.gutterleft} span={8}>
                                  <Button
                                    shape="circle"
                                    icon={<ZoomOutOutlined />}
                                    size="Small"
                                    style={{ width: '25px', height: '25px' }}
                                    onClick={this.FLChange.bind(this, 'irisout')}
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
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}></Col>
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
                              disabledDate={this.disabledStartDate}
                              format="YYYY-MM-DD HH:mm:ss"
                              showTime={{ format: 'HH:mm:ss' }}
                              placeholder="开始日期"
                              onChange={this.onStartChange}
                              onOpenChange={this.handleStartOpenChange}
                            />
                          </Col>
                          <Col span={10} style={{ marginLeft: '40px' }}>
                            <DatePicker
                              style={{ width: '170px', minWidth: '130px' }}
                              showTime={{ format: 'HH:mm:ss' }}
                              disabledDate={this.disabledEndDate}
                              format="YYYY-MM-DD HH:mm:ss"
                              placeholder="结束日期"
                              onChange={this.onEndChange}
                              open={endOpen}
                              onOpenChange={this.handleEndOpenChange}
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
                            <Button
                              icon={<PlayCircleOutlined />}
                              onClick={this.playBack.bind(this)}
                            >
                              开始回放
                            </Button>
                          </Col>
                          <Col className={styles.gutterleft} span={12}>
                            <Button
                              icon={<CloseCircleOutlined />}
                              onClick={this.btnBackClick.bind(this, 1)}
                            >
                              停止回放
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Divider type="horizontal" />
                    <Row>
                      <Col span={24}>
                        <Row>
                          <Col className={styles.gutterleft} span={12}>
                            <Button
                              icon={<PauseCircleOutlined />}
                              onClick={this.btnBackClick.bind(this, 2)}
                            >
                              暂停
                            </Button>
                          </Col>
                          <Col className={styles.gutterleft} span={12}>
                            <Button
                              icon={<CheckCircleOutlined />}
                              onClick={this.btnBackClick.bind(this, 3)}
                            >
                              恢复
                            </Button>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: '30px' }}>
                          <Col className={styles.gutterleft} span={12}>
                            <Button
                              icon={<StepForwardOutlined />}
                              onClick={this.btnBackClick.bind(this, 4)}
                            >
                              慢放
                            </Button>
                          </Col>
                          <Col className={styles.gutterleft} span={12}>
                            <Button
                              icon={<FastForwardOutlined />}
                              onClick={this.btnBackClick.bind(this, 5)}
                            >
                              快放
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Divider type="horizontal" />
                    <Row gutter={48} style={{ display: this.state.displayH }}>
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}></Col>
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
export default GBSVideo;
