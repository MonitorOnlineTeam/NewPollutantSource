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
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './video.less';
import config from '@/config';
import HkRealVideoData from './components/HkRealVideoData';
import HkHisVideoData from './components/HkHisVideoData';
import MonitorContent from '@/components/MonitorContent/index';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

@connect(({
      hkvideo,
    }) => ({
    realtimevideofullurl: hkvideo.videoListParameters.realtimevideofullurl,
}))
class HkShowVideo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayR: true,
            beginDate: moment(),
              endDate: moment(),
        };
    }

   componentWillMount = () => {
       window.addEventListener('message', this.receiveMessage, false);
       this.getVideoIp(1);
   }

   componentWillUnmount() {
     window.removeEventListener('message', this.receiveMessage);
     clearInterval(this.timerID);
   }

   receiveMessage = event => {
       if (event !== undefined) {
            if (event.data.key === '0' && event.data.flag === false) {
                message.error(event.data.value);
            }
       }
   }

   getVideoIp=type => {
       const { match, dispatch } = this.props;
       dispatch({
           type: 'hkvideo/hkvideourl',
           payload: {
               DGIMN: match.params.pointcode,
               type,
            },
       });
   }

    /** 历史视频 */
    onRef1 = ref => {
    this.child = ref;
    };

   /** 回放操作 */
   backplay = opt => {
       const {
         beginDate,
         endDate,
       } = this.state;
     if (beginDate !== '' && !endDate !== '') {
         const obj = {
           beginDate,
           endDate,
           opt,
         };
         const frame = document.getElementById('ifm').contentWindow;
         frame.postMessage(obj, config.hisvideourl);
         this.child.startPlay(
           moment(beginDate, 'YYYY-MM-DD HH:mm:ss'),
           moment(endDate, 'YYYY-MM-DD HH:mm:ss'),
         );
     } else {
       message.error('请选择时间间隔');
     }
   };

   /** 历史视频操作 */
   btnHisClick = opt => {
        if (opt === 7) {
            // this.child.startPlay();
        }
        if (opt === 8) {
            // this.child.endPlay();
        }
        let obj = { opt };
        const { beginDate, endDate } = this.state;
        obj = { opt, beginDate, endDate };
        const frame = document.getElementById('ifm').contentWindow;
        frame.postMessage(obj, config.hisvideourl);
    }

   /** 实时视频操作 */
   btnClick=opt => {
       let obj = { opt };
       obj = { opt };
       const frame = document.getElementById('ifm').contentWindow;
       frame.postMessage(obj, config.realtimevideourl);
   }

   /** tabs切换 */
  tabsChange = key => {
       if (key === '1') {
         this.getVideoIp(1);
       }
       if (key === '2') {
         this.getVideoIp(2);
       }
  };

  /** 时间控件 */
  rangepickerOnChange = (date, dateString) => {
    if (date.length > 1) {
      this.setState({
         beginDate: dateString[0],
           endDate: dateString[1],
      });
    } else {
      this.setState({
         beginDate: dateString[0],
           endDate: dateString[1],
      });
    }
  }

   render() {
       const { realtimevideofullurl } = this.props;
       if (!realtimevideofullurl) {
           return (<Spin
               style={{ width: '100%',
                   height: 'calc(100vh - 225px)',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center' }}
               size="large"
           />);
       }
       if (realtimevideofullurl === 'nodata') {
           return (
               <table align="center" style={{ height: 'calc(100vh - 225px)', width: '100%' }}>
                   <tbody>
                       <tr>
                           <td align="center">
                            暂无视频配置
                           </td>
                       </tr>
                   </tbody>
               </table>
           );
       }
       return (
           <MonitorContent
        {...this.props}
        breadCrumbList={[
          { Name: '首页', Url: '/' },
          { Name: '系统管理', Url: '' },
          { Name: '视频', Url: '' },
        ]}
      >
           <div style={{ height: 'calc(100vh - 157px)', width: '100%' }}>
               <Row gutter={24} style={{ height: '100%' }}>
                   <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ height: '100%' }}>
                       <iframe title="实时视频" id="ifm" src={realtimevideofullurl} frameBorder="1" width="100%" height="100%" scrolling="no"/>
                   </Col>
                   <Col xl={6} lg={24} md={24} sm={24} xs={24}>

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
                                            <Tooltip placement="top" title="抓取图片">
                                                <Button
                                                    type="primary"
                                                    icon="file-image"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 10)}
                                                > 抓图
                                                </Button>
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                    <Divider type="horizontal" />
                                    <Row style={{ textAlign: 'center' }}>
                                        <Col span={24}>
                                            <Row>
                                                <Col className={styles.gutterleft} span={8}>
                                                 <Button
                                                    type="primary"
                                                    icon = "radius-upleft"
                                                    size="Small"
                                                    onClick = {this.btnClick.bind(this, 5)}
                                                > 左上
                                                </Button>
                                                </Col>
                                                <Col className={styles.gutterleft} span={8}>
                                                  <Button
                                                    type = "primary"
                                                    icon = "border-top"
                                                    size="Small"
                                                    onClick = {this.btnClick.bind(this, 1)}
                                                >上&nbsp;&nbsp;&nbsp;
                                                </Button>
                                                </Col>
                                                <Col className={styles.gutterleft} span={8}>
                                                  <Button
                                                    type = "primary"
                                                    icon = "radius-upright"
                                                    size="Small"
                                                    onClick = {this.btnClick.bind(this, 7)}
                                                > 右上
                                                </Button>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Button
                                                    type = "primary"
                                                    icon="border-left"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 3)}
                                                >左&nbsp;&nbsp;&nbsp;</Button>
                                                </Col>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Button
                                                    type = "primary"
                                                    icon = "border-inner"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 9)}
                                                >自动</Button>
                                                </Col>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Button
                                                    type = "primary"
                                                    icon="border-right"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 4)}
                                                >右&nbsp;&nbsp;&nbsp;</Button>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Button
                                                    type = "primary"
                                                    icon="radius-bottomleft"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 6)}
                                                >左下</Button>
                                                </Col>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Button
                                                    type = "primary"
                                                    icon="border-bottom"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 2)}
                                                >下&nbsp;&nbsp;&nbsp;</Button>
                                                </Col>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Button
                                                    type = "primary"
                                                    icon="radius-bottomright"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 8)}
                                                >右下</Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Divider type="horizontal" />
                                    <Row>
                                        <Col span={24}>
                                            <Row style={{ textAlign: 'center' }}>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Tooltip placement="top" title="加">
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    icon="zoom-in"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 11)}
                                                />
                                                </Tooltip>
                                                </Col>
                                                <Col className={styles.gutterleft} span={8}>变倍</Col>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Tooltip placement="top" title="减">
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    icon="zoom-out"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 12)}
                                                />
                                                </Tooltip>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px', textAlign: 'center' }}>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Tooltip placement="top" title="加">
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    icon="zoom-in"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 15)}
                                                />
                                                </Tooltip>
                                                </Col>
                                                <Col className={styles.gutterleft} span={8}>变焦</Col>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Tooltip placement="top" title="减">
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    icon="zoom-out"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 16)}
                                                />
                                                </Tooltip>
                                                </Col>
                                            </Row>
                                            <Row style={{ marginTop: '10px', textAlign: 'center' }}>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Tooltip placement="top" title="加">
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    icon="zoom-in"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 19)}
                                                />
                                                </Tooltip>
                                                </Col>
                                                <Col className={styles.gutterleft} span={8}>光圈</Col>
                                                <Col className={styles.gutterleft} span={8}>
                                                 <Tooltip placement="top" title="减">
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    icon="zoom-out"
                                                    size="Small"
                                                    onClick={this.btnClick.bind(this, 20)}
                                                />
                                                </Tooltip>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Divider type="dashed" />
                                    <Row gutter={48}>
                                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                        {this.state.displayR && <HkRealVideoData {...this.props} />}
                                    </Col>
                                    </Row>
                                </Card>
                            </TabPane>
                            <TabPane tab="历史" key="2">
                                <Card className={styles.hisYunStyle}>
                                    <Row>
                                        <Col span={24}>
                                            <RangePicker
                                                showTime={{ format: 'HYYYY-MM-DD HH:mm:ss' }}
                                                format="YYYY-MM-DD HH:mm:ss"
                                                onChange={this.rangepickerOnChange}
                                            />
                                        </Col>
                                    </Row>
                                    <Divider type="horizontal" />
                                    <Row>
                                        <Col span={24}>
                                            <Row style={{ marginTop: '10px' }}>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Button type="primary" icon="play-circle" onClick={this.backplay.bind(this, 7)}>开始回放</Button>
                                                </Col>
                                                <Col className={styles.gutterleft} span={8}>
                                                <Button type="primary" icon="close-circle" onClick={this.backplay.bind(this, 8)}>停止回放</Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Divider type="horizontal" />
                                    <Row>
                                        <Col span={24}>
                                            <Row>

                                                <Col className={styles.gutterleft} span={8}><Button type="primary" icon="pause-circle" onClick={this.btnHisClick.bind(this, 2)}>暂停</Button></Col>
                                                <Col className={styles.gutterleft} span={8}><Button type="primary" icon="check-circle" onClick={this.btnHisClick.bind(this, 3)}>恢复</Button></Col>
                                                <Col className={styles.gutterleft} span={8}><Button type="primary" icon="picture" onClick={this.btnHisClick.bind(this, 6)}>抓图</Button></Col>
                                            </Row>
                                            <Row style={{ marginTop: '30px' }}>
                                                <Col className={styles.gutterleft} span={8}><Button type="primary" icon="step-forward" onClick={this.btnHisClick.bind(this, 4)}>慢放</Button></Col>
                                                <Col className={styles.gutterleft} span={8}><Button type="primary" icon="fast-forward" onClick={this.btnHisClick.bind(this, 5)}>快放</Button></Col>
                                                 <Col className={styles.gutterleft} span={8}><Button type="primary" icon="fast-backward" onClick={this.btnHisClick.bind(this, 1)}> 倒放</Button></Col>
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
                                                beginDate={moment(this.state.startdateString, 'YYYY-MM-DD HH:mm:ss')}
                                                endDate={moment(this.state.enddateString, 'YYYY-MM-DD HH:mm:ss')}
                                            />
                                            )}
                                        </Col>
                                    </Row>
                                </Card>
                            </TabPane>
                        </Tabs>

                   </Col>
               </Row>
           </div>
           </MonitorContent>
       );
   }
}
export default HkShowVideo;
