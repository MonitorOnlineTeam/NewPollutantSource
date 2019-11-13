import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
  Card,
  Divider,
  DatePicker,
  message,
  Tooltip,
  Tabs,
  Empty,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './index.less';
import config from '@/config';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
/*
页面：质控仪萤石云实时视频
描述：可以和数据、参数、报警等联动查看
add by lzp
*/

@connect(({ videodata, loading }) => ({
  vIsLoading: loading.effects['videodata/getvideolist'],
  videoList: videodata.videoList,
  ysyrealtimevideofullurl: videodata.qcaurl,
}))
class QCAYsyShowVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endOpen: false,
      startdateString: '',
      enddateString: '',
      startValue: null,
      endValue: null,
      displayR: 'block',
      displayH: 'none',
      displayRStartBtn: 'block',
      displayREndBtn: 'none',
      displayHStartBtn: 'block',
      displayHEndBtn: 'none',
      vIsLoading: false,
      playtime: '',
      selectDisplay: false,
      dgimn: props.DGIMN,
      VideoNo:"",
      // dgimn: '',
      tabsKey: 1,
      VedioID: '',
    };
  }

  componentWillMount = () => {
    window.addEventListener('message', this.receiveMessage, false);
  };

  componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage);
    clearInterval(this.timerID);
  }

  componentDidMount() {
    this.props.initLoadData && this.changeDgimn(this.props.DGIMN);
    this.getVideoIp(this.state.tabsKey,this.props.VideoNo)

  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.VideoNo !== this.props.VideoNo) {
      this.setState({
        VideoNo: nextProps.VideoNo,
      })
      this.tabsChange('1');
      console.log('video=',nextProps.VideoNo)
      this.getVideoIp(this.state.tabsKey,nextProps.VideoNo)
    }
  }

  receiveMessage = event => {
    if (event !== undefined) {
      if (event.data.key === 'success') {
        // 实时视频
        message.success('播放成功');
        this.setState({
          displayRStartBtn: 'none',
          displayREndBtn: 'block',
        });
      }
      if (event.data.key === 'successhis') {
        // 历史
        message.success('播放成功');
        this.setState({
          displayHStartBtn: 'none',
          displayHEndBtn: 'block',
        });
      }
      if (event.data.key === 'err') {
        this.setState({
          displayRStartBtn: 'block',
          displayREndBtn: 'none',
          displayHStartBtn: 'block',
          displayHEndBtn: 'none',
        });
        message.error(event.data.value);
      }
      if (event.data.key === 'playback') {
        this.backplay();
      }
      if (event.data.key === 'his') {
        this.setState({
          displayHStartBtn: 'block',
          displayHEndBtn: 'none',
        });
      }
      if (event.data.key === 'time') {
        console.log(
          '-------------------------------------',
          moment(event.data.value)
            .format('YYYY-MM-DD HH:mm:ss')
            .toString(),
        );
        const time = moment(event.data.value).format('YYYY-MM-DD HH:mm:ss');
        const etime = moment(this.state.enddateString);
        if (moment(time) < etime) {
          this.setState({
            playtime: moment(event.data.value)
              .format('YYYY-MM-DD HH:mm:ss')
              .toString(),
          });
        } else {
          this.setState({
            playtime: '',
          });
        }
        const obj = { opt: 2 };
        const frame = document.getElementById('ifm').contentWindow;
        frame.postMessage(obj, config.ysyvideourl);
      }
    }
  };

  
  /** 获取url */
  getVideoIp = (type, id) => {
    const { match, dispatch } = this.props;
    dispatch({
      type: 'videodata/qcaysyvideourl',
      payload: {
        VedioCameraID: 1107,//id
        type,
      },
    });
  };

  /** 回放操作 */
  backplay = () => {
    if (this.state.startdateString !== '' && !this.state.enddateString !== '') {
      if (this.state.playtime === '') {
        this.setState({
          displayHStartBtn: 'none',
          displayHEndBtn: 'block',
        });
        const obj = {
          btime: this.state.startdateString,
          etime: this.state.enddateString,
          opt: 5,
        };
        const frame = document.getElementById('ifm').contentWindow;
        frame.postMessage(obj, config.ysyvideourl);

        this.child.startPlay(
          moment(this.state.startdateString, 'YYYY-MM-DD HH:mm:ss'),
          moment(this.state.enddateString, 'YYYY-MM-DD HH:mm:ss'),
        );
      } else {
        this.setState({
          displayHStartBtn: 'none',
          displayHEndBtn: 'block',
        });
        const obj = {
          btime: this.state.playtime,
          etime: this.state.enddateString,
          opt: 5,
        };
        const frame = document.getElementById('ifm').contentWindow;
        frame.postMessage(obj, config.ysyvideourl);

        this.child.startPlay(
          moment(this.state.startdateString, 'YYYY-MM-DD HH:mm:ss'),
          moment(this.state.enddateString, 'YYYY-MM-DD HH:mm:ss'),
        );
      }
    } else {
      message.error('请选择时间间隔');
    }
  };

  /** 回放视频按钮 */

  backbtnClick = opt => {
    if (opt === 2) {
      this.setState({
        displayHStartBtn: 'block',
        displayHEndBtn: 'none',
      });
      let obj = { opt };
      obj = { opt: 4 };
      const frame = document.getElementById('ifm').contentWindow;
      frame.postMessage(obj, config.ysyvideourl);
    }
    if (opt === 1) {
      this.setState({
        displayHStartBtn: 'none',
        displayHEndBtn: 'block',
      });
    }
  };

  /** 实时视频视频按钮 */
  btnClick = opt => {
    if (opt === 2) {
      this.setState({
        displayRStartBtn: 'none',
        displayREndBtn: 'block',
      });
    }
    if (opt === 1) {
      this.setState({
        displayRStartBtn: 'none',
        displayREndBtn: 'block',
      });
    }
    let obj = { opt };
    obj = { opt };
    const frame = document.getElementById('ifm').contentWindow;
    frame.postMessage(obj, config.ysyvideourl);
  };

  /** 时间控件 */
  onChange = (value, dateString) => {
    this.setState({
      stoptime: '',
    });
    if (value.length > 1) {
      this.setState({
        startdateString: dateString[0],
        enddateString: dateString[1],
      });
    } else {
      this.setState({
        startdateString: '',
        enddateString: '',
      });
    }
  };

  /** 历史视频 */
  onRef1 = ref => {
    this.child = ref;
  };

  /** tabs切换 */
  tabsChange = key => {
    if (key === '1') {
      this.setState({
        displayR: 'block',
        displayH: 'none',
        tabsKey: 1,
      });
      this.getVideoIp(1, this.state.VedioID);
    }
    if (key === '2') {
      this.getVideoIp(2, this.state.VedioID);
      const obj = { opt: 2 };
      const frame = document.getElementById('ifm').contentWindow;
      frame.postMessage(obj, config.ysyvideourl);
      this.setState({
        displayR: 'none',
        displayH: 'block',
        tabsKey: 2,
      });
    }
  };


  render() {
    const { ysyrealtimevideofullurl, videoList } = this.props;
    if ( ysyrealtimevideofullurl === '') {
      return (<Card style={{ width: '100%', height: 'calc(100vh - 230px)', ...this.props.style }}>< div style = {
        {
          textAlign: 'center',
        }
      } > <Empty image = {
        Empty.PRESENTED_IMAGE_SIMPLE
      } description="暂无视频数据"
      /></div ></Card>);
    }
    return (
      <div style={{ height: 'calc(100vh - 230px)', width: '100%', margin: '20px 0px 20px 0px', ...this.props.style }}>
        <Row gutter={48} style={{ height: '100%', margin: '0px' }}>
          <div
            className={styles.divv}
          >
            <iframe
              title="实时视频"
              id="ifm"
              src={ysyrealtimevideofullurl}
              frameBorder="0"
              width="100%"
              height="100%"
              scrolling="no"
            />
          </div>
          <div className={styles.divc}
          >
            <Card className={styles.card}>
              <Tabs
                defaultActiveKey="1"
                onChange={key => {
                  this.tabsChange(key);
                }}
              >
                <TabPane tab="实时" key="1">
                  <Row>
                    <Col
                      className={styles.gutterleft}
                      span={8}
                      style={{ display: this.state.displayRStartBtn }}
                    >
                      <Tooltip placement="top" title="开始播放">
                        <Button
                          type="primary"
                          shape="circle"
                          icon="play-circle"
                          size="Small"
                          onClick={this.btnClick.bind(this, 1)}
                        />
                      </Tooltip>
                      <a style={{ marginLeft: '10px' }} onClick={this.btnClick.bind(this, 1)}>
                        开始播放
                      </a>
                    </Col>
                    <Col
                      className={styles.gutterleft}
                      span={8}
                      style={{ display: this.state.displayREndBtn }}
                    >
                      <Tooltip placement="top" title="暂停播放">
                        <Button
                          type="danger"
                          shape="circle"
                          icon="pause-circle"
                          size="Small"
                          onClick={this.btnClick.bind(this, 2)}
                        />
                      </Tooltip>
                      <a
                        style={{ marginLeft: '10px', color: 'red' }}
                        onClick={this.btnClick.bind(this, 2)}
                      >
                        暂停播放
                      </a>
                    </Col>
                    <Col className={styles.gutterleft} span={8}>
                      <Tooltip placement="top" title="刷新视频">
                        <Button
                          type="primary"
                          shape="circle"
                          icon="redo"
                          size="Small"
                          onClick={this.btnClick.bind(this, 1)}
                        />
                      </Tooltip>
                      <a style={{ marginLeft: '10px' }} onClick={this.btnClick.bind(this, 1)}>
                        刷新视频
                      </a>
                    </Col>
                    <Col className={styles.gutterleft} span={8}>
                      <Tooltip placement="top" title="抓取图片">
                        <Button
                          type="dashed"
                          shape="circle"
                          icon="file-image"
                          size="Small"
                          onClick={this.btnClick.bind(this, 3)}
                        />
                      </Tooltip>
                      <a
                        style={{ marginLeft: '10px', color: 'black' }}
                        onClick={this.btnClick.bind(this, 3)}
                      >
                        抓取图片
                      </a>
                    </Col>
                  </Row>
                  <Divider type="dashed" />
                  {/* <Row gutter={48} style={{ display: this.state.displayR }}>
                    <Col xl={24} lg={24} md={24} sm={18} xs={18}>选择摄像头：
                      {!this.props.vIsLoading && this.state.selectDisplay && this.getpollutantSelect()}
                    </Col>
                  </Row> */}
                  <Divider type="dashed" />
                  {/* <Row gutter={48} style={{ display: this.state.displayR }}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                      {this.state.displayR && <YsyRealVideoData dgimn={this.state.dgimn} />}
                    </Col>
                  </Row> */}
                </TabPane>
                <TabPane tab="历史" key="2">
                  <Row>
                    <Col className={styles.gutterleft} span={24}>
                      <RangePicker
                        style={{ width: '350px' }}
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder={['开始时间', '结束时间']}
                        onChange={this.onChange}
                      />
                    </Col>
                  </Row>
                  <Divider dashed />
                  <Row>
                    <Col
                      className={styles.gutterleft}
                      span={8}
                      style={{ display: this.state.displayHStartBtn }}
                    >
                      <Tooltip placement="top" title="开始播放">
                        <Button
                          type="primary"
                          shape="circle"
                          icon="play-circle"
                          size="Small"
                          onClick={this.backplay.bind(this)}
                        />
                      </Tooltip>
                      <a style={{ marginLeft: '10px' }} onClick={this.backplay.bind(this)}>
                        开始播放
                      </a>
                    </Col>
                    <Col
                      className={styles.gutterleft}
                      span={8}
                      style={{ display: this.state.displayHEndBtn }}
                    >
                      <Tooltip placement="top" title="暂停播放">
                        <Button
                          type="danger"
                          shape="circle"
                          icon="pause-circle"
                          size="Small"
                          onClick={this.backbtnClick.bind(this, 2)}
                        />
                      </Tooltip>
                      <a
                        style={{ marginLeft: '10px', color: 'red' }}
                        onClick={this.backbtnClick.bind(this, 2)}
                      >
                        暂停播放
                      </a>
                    </Col>
                    <Col className={styles.gutterleft} span={8}>
                      <Tooltip placement="top" title="刷新视频">
                        <Button
                          type="primary"
                          shape="circle"
                          icon="redo"
                          size="Small"
                          onClick={this.backplay.bind(this)}
                        />
                      </Tooltip>
                      <a style={{ marginLeft: '10px' }} onClick={this.backplay.bind(this)}>
                        刷新视频
                      </a>
                    </Col>
                    <Col className={styles.gutterleft} span={8}>
                      <Tooltip placement="top" title="抓取图片">
                        <Button
                          type="dashed"
                          shape="circle"
                          icon="file-image"
                          size="Small"
                          onClick={this.backbtnClick.bind(this, 3)}
                        />
                      </Tooltip>
                      <a
                        style={{ marginLeft: '10px', color: 'black' }}
                        onClick={this.backbtnClick.bind(this, 3)}
                      >
                        抓取图片
                      </a>
                    </Col>
                  </Row>
                  <Divider type="horizontal" />
                  {/* <Row gutter={48} style={{ display: this.state.displayH }}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                      {this.state.displayR && (
                        <HistoryVideo
                          onRef={this.onRef1}
                          {...this.props}
                          dgimn={this.state.dgimn}
                          beginDate={moment(this.state.startdateString, 'YYYY-MM-DD HH:mm:ss')}
                          endDate={moment(this.state.enddateString, 'YYYY-MM-DD HH:mm:ss')}
                        />
                      )}
                    </Col>
                  </Row> */}
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </Row>
      </div>
    );
  }
}
export default QCAYsyShowVideo;
