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
  Icon,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import {
  PageHeaderWrapper,
} from '@ant-design/pro-layout';
import styles from './index.less';
import HistoryVideo from './components/YsyHisVideoData';
import YsyRealVideoData from './components/YsyRealVideoData';
import config from '@/config';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
/*
页面：萤石云实时视频
描述：可以和数据、参数、报警等联动查看
add by xpy
*/

@connect(({ video }) => ({
  ysyrealtimevideofullurl: video.ysyvideoListParameters.realtimevideofullurl,
}))
class YsyShowVideo extends Component {
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
      displayRStartBtn: 'none',
      displayREndBtn: 'block',
      displayHStartBtn: 'block',
      displayHEndBtn: 'none',
      vIsLoading: false,
      playtime: '',
    };
  }

  componentWillMount = () => {
    window.addEventListener('message', this.receiveMessage, false);
    this.getVideoIp(1);
  };

  componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage);
    clearInterval(this.timerID);
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
  getVideoIp = type => {
    const { match, dispatch } = this.props;
    dispatch({
      type: 'video/ysyvideourl',
      payload: {
        VedioCameraID: match.params.ID,
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
    debugger;
    if (opt === 2) {
      this.setState({
        displayRStartBtn: 'block',
        displayREndBtn: 'none',
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
      });
      this.getVideoIp(1);
    }
    if (key === '2') {
      this.getVideoIp(2);
      const obj = { opt: 2 };
      const frame = document.getElementById('ifm').contentWindow;
      frame.postMessage(obj, config.ysyvideourl);
      this.setState({
        displayR: 'none',
        displayH: 'block',
      });
    }
  };

  render() {
    const { ysyrealtimevideofullurl } = this.props;
    if (ysyrealtimevideofullurl === 'nodata') {
      return (
        <table align="center" style={{ height: 'calc(100vh - 225px)', width: '100%' }}>
          <tbody>
            <tr>
              <td align="center">暂无视频配置</td>
            </tr>
          </tbody>
        </table>
      );
    }
    return (
      <PageHeaderWrapper>
        <div style={{ height: 'calc(100vh - 245px)', width: '100%', margin: '20px 0px 20px 0px' }}>
          <Row gutter={48} style={{ height: '100%' }}>
            <Col
              xl={18}
              lg={24}
              md={24}
              sm={24}
              xs={24}
              style={{ height: '100%' }}
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
            </Col>
            <Col
              xl={6}
              lg={24}
              md={24}
              sm={24}
              xs={24}
              style={{ height: '100%' }}
            >
              <Card className={styles.card} extra={<span><Button
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    history.go(-1);
                  }}
                  type="link"
                  size="small"
                >
                  <Icon type="rollback" />
                  返回上级
                </Button></span>}>
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
                    <Row gutter={48} style={{ display: this.state.displayR }}>
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        {this.state.displayR && <YsyRealVideoData {...this.props} />}
                      </Col>
                    </Row>
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
                    <Row gutter={48} style={{ display: this.state.displayH }}>
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        {this.state.displayR && (
                          <HistoryVideo
                            onRef={this.onRef1}
                            {...this.props}
                            beginDate={moment(this.state.startdateString, 'YYYY-MM-DD HH:mm:ss')}
                            endDate={moment(this.state.enddateString, 'YYYY-MM-DD HH:mm:ss')}
                          />
                        )}
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default YsyShowVideo;
