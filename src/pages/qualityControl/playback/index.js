import React, { PureComponent } from 'react';
import NavigationTree from '@/components/NavigationTree'
import NavigationTreeQCA from '@/components/NavigationTreeQCA'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, DatePicker, Badge, Button, Modal, Timeline, Row, Col, Icon, Divider, Empty, Tag, Alert, Spin, Slider, message } from 'antd';
import { connect } from 'dva'
import moment from 'moment';
import styles from './index.less'
import FlowChart from './FlowChart';
import ResultContrastPage from '../resultContrast/ResultContrastPage'


const { RangePicker } = DatePicker;

// 质控类型
const iconTypeByQCType = {
  "1": "check-circle", // 质控
  "5": "unlock", // 开锁
  "3": "reload", // 重启
}

// 质控仪状态 - 颜色
// 0 离线 1 在线 3 异常 4质控中 5吹扫中
const QCStatusColor = {
  1: "#34c066",
  3: "#FF5722",
  5: "#1E90FF",
}

let timer = null; // 质控定时器
let timeout = null; // 重启、开锁定时器
let count = 0;

@connect(({ loading, qualityControl, qualityControlModel }) => ({
  p2Pressure: qualityControl.p2Pressure,
  p1Pressure: qualityControl.p1Pressure,
  playbackPageDate: qualityControl.playbackPageDate,
  QCPlaybackTimeLine: qualityControl.QCPlaybackTimeLine,
  QCAFlowChartAllData: qualityControl.QCAFlowChartAllData,
  oldPlaybackPageDate: qualityControl.oldPlaybackPageDate,
  timeLineLoading: loading.effects['qualityControl/getQCATimelineRecord'],
  flowChartLoading: loading.effects['qualityControl/getCemsAndStandGasState'],
  imgChartLoading: loading.effects['qualityControl/getQCADataForRecord'],
}))
class PlaybackPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTime: [moment().subtract(1, "day"), moment()],
      start: false,
      QCALineItem: {},
      imgShow: false,
      selectIndex: -1,
    };
    this._SELF_ = {
      treeType: this.props.history.location.query.treeType,
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.QCAFlowChartAllData !== nextProps.QCAFlowChartAllData) {
      this.updateFlowChartData(nextProps)
    }
  }

  // 更新流程图数据
  updateFlowChartData = (props) => {
    this.setState({
      start: true
    })
    timer = setInterval(() => {
      let count = this.state.count + 1;
      if (count === props.QCAFlowChartAllData.length) {
        clearInterval(timer);
        this.setState({
          start: false
        })
      } else {
        this.props.dispatch({
          type: "qualityControl/updateFlowChartData",
          payload: props.QCAFlowChartAllData[count]
        })
      }
      this.setState({
        count: count
      })
    }, 1000)

  }

  // 获取质控仪基础数据
  getCemsAndStandGasData = () => {
    this.props.dispatch({
      type: "qualityControl/getCemsAndStandGasState",
      payload: {
        QCAMN: this.state.QCAMN,
      },
      pageType: "playback"
    })
  }

  // 获取时间轴数据
  getQCATimelineRecord = () => {
    this.props.dispatch({
      type: "qualityControl/getQCATimelineRecord",
      payload: {
        QCAMN: this.state.QCAMN,
        beginTime: moment(this.state.selectedTime[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(this.state.selectedTime[1]).format("YYYY-MM-DD HH:mm:ss"),
      }
    })
  }

  // 初始化流程图数据
  initFlowChartData = () => {
    // 开锁
    this.props.dispatch({
      type: "qualityControl/updateState",
      payload: {
        playbackPageDate: {
          ...this.props.oldPlaybackPageDate,
        }
      }
    })
    clearTimeout(timeout)
    clearInterval(timer)
    this.setState({ currentTimeLineItem: undefined, count: 0 });
  }

  clearData = () => {
    this.props.dispatch({
      type: "qualityControl/updateState",
      payload: {
        playbackPageDate: {
          qualityControlName: null, // 质控仪名称
          gasData: {  // 气瓶信息
            N2Info: {},
            NOxInfo: {},
            SO2Info: {},
            O2Info: {},
          },
          cemsList: [{}, {}, {}, {}], // CEMS列表
          QCStatus: undefined, // 质控仪状态
          totalFlow: undefined, // 总流量
          valveStatus: {},
          standardValue: undefined, // 配比标气浓度,
          standardValueUtin: null, // 单位
          p1Pressure: {},
          p2Pressure: {},
          p3Pressure: {},
          p4Pressure: {},
          thisTime: null,
        },
      }
    })
  }

  // 时间轴点击
  onTimeLineItemClick = (item, index) => {
    // 每次点击清空定时器
    clearTimeout(timeout)
    clearInterval(timer)
    this.clearData();
    this.setState({
      selectIndex: index
    })
    let currentTimeLineItem = item;
    if (item.QCType === 1) {
      // 质控
      this.props.dispatch({
        type: "qualityControl/getQCADataForRecord",
        payload: {
          "Time": item.BeginTime,
          "QCAMN": item.QCAMN,
          "DGIMN": item.DGIMN,
          "QCType": item.QCType
        }
      })
      this.setState({
        currentTimeLineItem: item,
        start: true,
        count: 0,// 重置count
        QCALineItem: item,
        imgShow: true
      })
    } else {
      this.setState({ QCALineItem: {} })
    }
    if (item.QCType === 5) {
      // 开锁
      // this.props.dispatch({
      //   type: "qualityControl/updateState",
      //   payload: {
      //     playbackPageDate: {
      //       ...this.props.oldPlaybackPageDate,
      //       valveStatus: {
      //         ...this.props.oldPlaybackPageDate.valveStatus,
      //         door: "0"
      //       }
      //     }
      //   }
      // })
      this.clearData()
      this.setState({
        currentTimeLineItem: item,
        imgShow: true
      })
      timeout = setTimeout(() => {
        this.props.dispatch({
          type: "qualityControl/updateState",
          payload: {
            playbackPageDate: {
              ...this.props.playbackPageDate,
              valveStatus: {
                ...this.props.playbackPageDate.valveStatus,
                door: 1
              }
            }
          }
        })
        this.setState({
          currentTimeLineItem: undefined
        })
        message.success('开锁完成，门已关闭')
      }, 3000)
    }
    if (item.QCType === 3) {
      // this.props.dispatch({
      //   type: "qualityControl/updateState",
      //   payload: {
      //     playbackPageDate: {
      //       ...this.props.oldPlaybackPageDate,
      //     }
      //   }
      // })
      this.clearData()
      // 重启
      this.setState({
        currentTimeLineItem: {
          ...currentTimeLineItem,
          Flag: "质控仪正在重启"
        },
        imgShow: true,
        otherLoading: true
      }, () => {
        timeout = setTimeout(() => {
          message.success("重启成功！")
          this.setState({
            otherLoading: false,
            currentTimeLineItem: undefined
          })
        }, 3000)
      })
    }
    this.setState({
      currentTimeLineItem: currentTimeLineItem
    })
  }

  setSelectHrpFactRowClassName = (index) => {
    return index === this.state.selectIndex ? styles.clickRowStyl : '';
  }


  // 渲染时间轴
  renderTimeLineItem = () => {
    const { QCPlaybackTimeLine } = this.props;
    let timelineItems = []
    // timelineItems.push(
    //   <Timeline.Item
    //     dot={<Icon type="clock-circle" style={{ fontSize: '20px', color: "#52c41a" }} />}
    //     position="left"
    //     style={{ paddingBottom: 50 }}
    //   >
    //     <Tag className={styles.dateContent}>{moment(this.state.selectedTime[0]).format("YYYY-MM-DD")} - {moment(this.state.selectedTime[1]).format("YYYY-MM-DD")}</Tag>
    //   </Timeline.Item>
    // )
    QCPlaybackTimeLine.map((item, index) => {
      timelineItems.push(
        <Timeline.Item
          dot={<Icon type={iconTypeByQCType[item.QCType]} style={{ fontSize: '16px', color: QCStatusColor[item.QCType] }} />}
          color="red"
          style={{ paddingBottom: 30 }}
        >
          <span style={{ fontSize: '13px', cursor: "pointer" }}
            className={this.setSelectHrpFactRowClassName(index)}
            onClick={() => { this.onTimeLineItemClick(item, index) }}>
            {`${item.BeginTime}${item.EndTime ? " - " + item.EndTime : ""}进行`}
            <Tag style={{ cursor: "pointer" }} color={QCStatusColor[item.QCType]}>{item.Flag}</Tag>
          </span>
        </Timeline.Item>
      )
    })
    return timelineItems;
  }

  returnQCStatus = () => {
    const { currentTimeLineItem } = this.state;
    if (currentTimeLineItem) {
      return <Alert
        type={currentTimeLineItem.QCType == 1 ? "success" : (currentTimeLineItem.QCType == 3 ? "error" : "info")}
        icon={<Icon type={iconTypeByQCType[currentTimeLineItem.QCType]} />}
        style={{ marginBottom: 10 }}
        message={<span style={{ color: QCStatusColor[currentTimeLineItem.QCType] }}>{currentTimeLineItem.Flag}</span>}
        banner
      />
    }
    // let DeviceStatus = this.props.oldPlaybackPageDate ? this.props.oldPlaybackPageDate.DeviceStatus
    switch (this.props.oldPlaybackPageDate.DeviceStatus) {
      case "0":
        return <Alert type="error" icon={<Icon type="stop" />} style={{ background: "#ddd", border: "#ddd" }} message={`质控仪离线中`} showIcon />
      case "1":
        return <Alert type="success" message={`质控仪在线中`} showIcon />
      case "3":
        return <Alert type="warning" message={`质控仪状态异常`} showIcon />
      default:
        return "";
    }
    // return <Alert message="质控仪在线中" type="success" showIcon />
  }

  // 开始
  start = () => {
    if (this.state.count === this.props.QCAFlowChartAllData.length) {
      this.setState({ count: 0 }, () => {
        this.updateFlowChartData(this.props);
      })
    } else {
      this.updateFlowChartData(this.props);
    }
  }

  // 暂停
  pause = () => {
    clearInterval(timer);
    this.setState({ start: false })
  }

  // 进度条change
  onSliderChange = (value) => {
    clearInterval(timer);
    this.setState({
      start: false,
      count: value
    })
  }

  // 进度条结束change
  onSliderAfterChange = (value) => {
    this.updateFlowChartData(this.props);
  }

  loadingImg = (loadingImg) => {
    return (loadingImg ? <Spin
      style={{
        width: '100%',
        height: 'calc(100vh/2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      size="large" /> : <FlowChart />)
  }

  render() {
    const { playbackPageDate, timeLineLoading, imgChartLoading, flowChartLoading, QCPlaybackTimeLine, QCAFlowChartAllData, playbackPageDate: { gasData, cemsList, QCStatus, valveStatus, totalFlow, standardValueUtin, p1Pressure, p2Pressure, flowList, standardValue, qualityControlName, thisTime } } = this.props;
    const { selectedTime, currentTimeLineItem, otherLoading, start, count, QCALineItem: { ID, QCType, DGIMN, QCAMN, QCTime, PollutantCode } } = this.state;
    return (
      <>
        {
          this._SELF_.treeType === "MN" ? <NavigationTree domId="#remoteControl" onItemClick={value => {
            if (value.length > 0 && !value[0].IsEnt) {
              this.props.dispatch({
                type: "qualityControl/getQCAMNByDGIMN",
                payload: {
                  DGIMN: value[0].key
                },
                callback: (QCAMN) => {
                  this.setState({
                    QCAMN: QCAMN
                  }, () => {
                    this.getCemsAndStandGasData();
                    this.getQCATimelineRecord();
                    this.initFlowChartData();
                    // this.clearData();
                    this.setState(
                      {
                        imgShow: false,
                        selectIndex: -1
                      }
                    )
                  })
                }
              })
            }
          }} /> :
            <NavigationTreeQCA QCAUse="1" domId="#remoteControl" onItemClick={value => {
              if (value.length > 0 && !value[0].IsEnt && value[0].QCAType == "2") {
                this.setState({
                  QCAMN: value[0].key
                }, () => {
                  this.getCemsAndStandGasData();
                  this.getQCATimelineRecord();
                  this.initFlowChartData();
                  // this.clearData();
                  this.setState(
                    {
                      imgShow: false,
                      selectIndex: -1
                    }
                  )
                })
              }
            }} />
        }
        {/* <div id="remoteControl" className={styles.playbackWrapper}> */}
        <div id="remoteControl" className={styles.playbackWrapper}>
          <BreadcrumbWrapper>
            <Card
              className="contentContainer"
              title={
                <RangePicker
                  value={selectedTime}
                  showTime={true}
                  // format="YYYY-MM-DD HH:mm"
                  placeholder={['开始时间', '结束时间']}
                  onChange={(value) => {
                    this.setState({
                      selectedTime: value
                    })
                  }}
                  onOk={(value) => {
                    this.setState({
                      selectedTime: value
                    }, () => {
                      this.initFlowChartData();
                      this.getQCATimelineRecord();
                    })
                  }}
                // onOk={onOk}
                />
              }
            >
              <Row gutter={10} style={{ height: 'calc(100vh - 284px)' }}>
                <Col xxl={7} xl={9} style={{ height: '100%' }}>
                  <Card type="inner" size="small" title="质控记录" bodyStyle={{ overflowY: "auto", overflowX: "hidden", height: 'calc(100vh - 308px)' }}>
                    <Spin spinning={timeLineLoading}>
                      {
                        !timeLineLoading && !QCPlaybackTimeLine.length ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                          <Timeline style={{ margin: "22px 0 0 22px" }}>
                            {
                              QCPlaybackTimeLine.length && <Timeline.Item
                                dot={<Icon type="clock-circle" style={{ fontSize: '20px', color: "#52c41a" }} />}
                                position="left"
                                style={{ paddingBottom: 50 }}
                              >
                                <Tag className={styles.dateContent}>{moment(this.state.selectedTime[0]).format("YYYY-MM-DD")} - {moment(this.state.selectedTime[1]).format("YYYY-MM-DD")}</Tag>
                              </Timeline.Item>
                            }
                            {this.renderTimeLineItem()}
                          </Timeline>
                      }
                    </Spin>
                  </Card>
                </Col>

                <Col xxl={17} xl={15} style={{ height: '100%' }}>
                  <Card type="inner" size="small" title="质控流程图" bodyStyle={{ height: 'calc(100vh - 308px)', overflow: 'hidden' }}>
                    <Spin spinning={!!(flowChartLoading || otherLoading)} wrapperClassName={styles.spinWrapper} style={{ position: "relative", height: '100%' }}>
                      {this.returnQCStatus()}
                      {
                        PollutantCode && PollutantCode !== "P" && <Button
                          // size="small"
                          style={{ position: 'absolute', right: 0, top: 47, zIndex: 1 }}
                          type="primary"
                          onClick={() => { this.setState({ visible: true }) }}
                        >
                          查看结果比对
                      </Button>
                      }
                      {this.state.imgShow ? this.loadingImg(imgChartLoading) : <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                      {currentTimeLineItem && currentTimeLineItem.QCType == 1 && QCAFlowChartAllData.length ?
                        // {true ?
                        <Row style={{ position: "absolute", bottom: "0", width: "100%" }}>
                          {
                            !start ? <Icon type="play-circle" style={{ fontSize: 24, float: "left", marginTop: 8, marginRight: 12, cursor: "pointer" }} onClick={this.start} /> :
                              <Icon type="pause-circle" style={{ fontSize: 24, float: "left", marginTop: 8, marginRight: 12, cursor: "pointer" }} onClick={this.pause} />
                          }
                          <Slider
                            value={count}
                            max={QCAFlowChartAllData.length}
                            // max={100}
                            style={{ float: 'left', width: 'calc(100% - 60px)' }}
                            tooltipVisible
                            tipFormatter={(value => {
                              return thisTime
                            })}
                            onChange={(value) => { this.onSliderChange(value) }}
                            onAfterChange={(value) => { this.onSliderAfterChange(value) }}
                          />
                        </Row>
                        : ""}
                    </Spin>
                  </Card>
                </Col>
              </Row>
            </Card>
            <Modal
              width={"90%"}
              title="质控结果比对"
              destroyOnClose
              visible={this.state.visible}
              footer={null}
              onOk={this.handleOk}
              onCancel={() => {
                this.setState({ visible: false })
              }}
            >
              {
                (ID && DGIMN && PollutantCode && QCType && QCTime && QCAMN) &&
                <ResultContrastPage dateValue={ID} DGIMN={DGIMN} PollutantCode={PollutantCode} QCType={QCType}
                  QCTime={QCTime} QCAMN={QCAMN} />
              }
            </Modal>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default PlaybackPage;
