/*
 * @Author: Jiaqi
 * @Date: 2019-12-06 17:17:23
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-12-06 17:17:45
 * @desc: 质控仪流程图页面
 */
import React, { PureComponent } from 'react';
import { Button, Card, notification, Modal, Tooltip, Select, message, Badge, Icon, Alert } from 'antd'
import router from 'umi/router';
import { MapInteractionCSS } from 'react-map-interaction';
import styles from './index.less'
import { connect } from 'dva';
import RealTimeContrastPage from '../realTimeContrast/RealTimeContrastPage'


const { Option } = Select;
// 质控仪状态 - 颜色
// 0 离线 1 在线 3 异常 4质控中 5吹扫中
const QCStatusColor = {
  0: "#999999",
  1: "#34c066",
  3: "#e94",
  4: "#1E90FF",
  5: "#FFC1C1"
}

@connect(({ loading, qualityControl, qualityControlModel }) => ({
  gasData: qualityControl.gasData,
  cemsList: qualityControl.cemsList,
  valveStatus: qualityControl.valveStatus,
  p2Pressure: qualityControl.p2Pressure,
  p1Pressure: qualityControl.p1Pressure,
  flowList: qualityControl.flowList,
  standardValue: qualityControl.standardValue,
  qualityControlName: qualityControl.qualityControlName,
  standardValueUtin: qualityControl.standardValueUtin,
  QCStatus: qualityControl.QCStatus,
  currentDGIMN: qualityControlModel.currentDGIMN,
  realtimeStabilizationTime: qualityControl.realtimeStabilizationTime,
  totalFlow: qualityControl.totalFlow,
  DeviceStatus: qualityControl.DeviceStatus,
}))

class ImagePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      QCAMN: props.QCAMN,
      visible: false,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: "qualityControl/getCemsAndStandGasState",
      payload: {
        QCAMN: this.state.QCAMN
      }
    })
  }

  componentWillUnmount() {
    notification.close("QCAnotification")
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.QCAMN !== nextProps.QCAMN) {
      this.setState({
        QCAMN: nextProps.QCAMN
      })
      this.props.dispatch({
        type: "qualityControl/getCemsAndStandGasState",
        payload: {
          QCAMN: nextProps.QCAMN
        }
      })
    }
    if (this.props.QCStatus !== nextProps.QCStatus && nextProps.QCStatus === "4") {
      if (nextProps.QCAMN && nextProps.currentDGIMN)
        // 获取稳定时间
        this.props.dispatch({
          type: "qualityControl/getStabilizationTime",
          payload: {
            DGIMN: nextProps.currentDGIMN,
            QCAMN: nextProps.QCAMN,
            Type: "Real"
          },
          form: "realtime"
        })
    }
    // 吹扫状态时，关闭查看实时比对提示
    if (this.props.QCStatus !== nextProps.QCStatus && nextProps.QCStatus !== "4") {
      notification.close("QCAnotification");
      // // 重置model数据
      // this.props.dispatch({
      //   type: "qualityControlModel/changeRealTimeThanData",
      //   payload: {
      //     valueList: [],
      //     timeList: [],
      //     tableData: [],
      //     standardValueList: [],
      //     start: 0,
      //     end: 20,
      //     flag: true
      //   }
      // })
    }

    // 状态从指控中变为吹扫，获取质控结果
    // if (this.props.QCStatus === "4" && nextProps.QCStatus === "5") {
    //   this.props.dispatch({
    //     type: "qualityControl/getQCAResult",
    //     payload: {
    //       QCAMN: nextProps.QCAMN
    //     }
    //   })
    // }

    // 状态从吹扫变为空时，清空所有流量和浓度数据
    if (this.props.QCStatus === "5" && nextProps.QCStatus === "6") {
      this.props.dispatch({
        type: "qualityControl/updateState",
        payload: {
          flowList: {},
          cemsList: this.props.cemsList.map(item => ({ ...item, monitorValue: undefined }))
        }
      })
    }
    // 控制查看实时比对提示显示隐藏
    if (this.props.QCStatus === "4" && nextProps.realtimeStabilizationTime.StabilizationTime && nextProps.realtimeStabilizationTime.StartTime) {
    // if (true) {
      notification.close("QCAnotification")
      notification.open({
        message: '查看质控实时比对',
        key: "QCAnotification",
        duration: null,
        top: 50,
        className: styles.QCnotification,
        description:
          "点击查看质控实时结果比对信息",
        onClick: () => {
          let filterCemsList = nextProps.cemsList.filter(item => item.MNHall != null)
          if (filterCemsList.length > 1) {
            Modal.confirm({
              icon: null,
              zIndex: 99999,
              content: (
                <>
                  请选择CEMS：
                  <Select style={{ width: 200 }} defaultValue={filterCemsList[0].DGIMN} onChange={(value, option) => {
                    this.setState({
                      currentDGIMN: value
                    })
                  }}>
                    {
                      filterCemsList.map(item => {
                        return <Option key={item.DGIMN}>{item.CemsName}</Option>
                      })
                    }
                  </Select>
                </>
              ),
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                if (!this.state.currentDGIMN && !filterCemsList[0].DGIMN) {
                  message.error("请选择CEMS");
                  return;
                }
                this.props.dispatch({
                  type: "qualityControlModel/updateState",
                  payload: {
                    currentDGIMN: this.state.currentDGIMN
                  }
                })
                setTimeout(() => {
                  this.setState({
                    visible: true,
                  })
                }, 0)
              }
            });
          } else {
            this.setState({
              visible: true,
            })
          }
        },
      });
    }
  }

  returnQCStatus = () => {
    let text = "";
    switch (this.props.QCStatus) {
      case "3":
        text = "，工作状态异常";
        break;
      case "4":
        text = "，工作状态质控中"
        break;
      case "5":
        text = "，工作状态吹扫中"
        break;
      case "6":
        text = ""
        break;
      default:
        text = "";
        break;
    }
    switch (this.props.DeviceStatus) {
      case "0":
        return <Alert type="error" icon={<Icon type="stop" />} style={{ background: "#ddd", marginBottom: 10 }} message={`质控仪离线中${text}`} banner />
      case "1":
        return <Alert type="success" style={{ marginBottom: 10 }} message={`质控仪在线中${text}`} banner />
      case "3":
        return <Alert type="warning" style={{ marginBottom: 10 }} message={`质控仪状态异常${text}`} banner />
      default:
        return "";
    }
  }

  pageContent = (type) => {
    const { gasData, cemsList, QCStatus, valveStatus, totalFlow, standardValueUtin, p1Pressure, p2Pressure, realtimeStabilizationTime, flowList, standardValue, qualityControlName } = this.props;
    let props = {};
    if (type === "modal") {
      props = {
        defaultScale: 1.3
      }
    }
    return <MapInteractionCSS style={{ position: 'relative' }} {...props}>
      {/* <div style={{ width: '100%', height: '100%' }}> */}
      <img src="/qualityControl/lct.jpg" />
      {/* O2 */}
      <div className={styles.gasInfoBox}>
        <ul>
          <li>
            气瓶浓度：{gasData.O2Info.Concentration != undefined && `${gasData.O2Info.Concentration}%`}
          </li>
          <li>
            <span>过期时间：</span>
            <span className={styles.time} title={gasData.O2Info.ExpirationDate}>{gasData.O2Info.ExpirationDate}</span>
          </li>
          <li>
            {
              gasData.O2Info.msg ?
                <Tooltip title={gasData.O2Info.msg}>
                  <span style={{ color: "#FF9800" }}>余量：{gasData.O2Info.VolumeValue != undefined ? `${gasData.O2Info.VolumeValue} L` : undefined}</span>
                </Tooltip> :
                <span>余量：{gasData.O2Info.VolumeValue != undefined ? `${gasData.O2Info.VolumeValue} L` : undefined}</span>
            }
          </li>
          <li>
            流量：{flowList["s01"] != undefined ? `${flowList["s01"]} ml/min` : undefined}
          </li>
        </ul>
      </div>
      {
        (p1Pressure.pollutantCode == "s01" && p1Pressure.isException == "1") ?
          <div className={styles.gasImgBox}>
            <img src="/qualityControl/gasException.png" alt="" />
            <p>O₂</p>
          </div> : null
      }

      <img className={styles.valve} src="/qualityControl/valveClose.jpg" alt="" />
      {valveStatus.O2 ?
        <>
          <img className={styles.line} src="/qualityControl/O2.png" alt="" />
          <img className={styles.valve} src="/qualityControl/valveOpen.jpg" alt="" />
        </> : null
      }

      {/* NOx */}
      <div className={styles.gasInfoBox} style={{ top: "calc(63px + (121px + 30px) * 1" }}>
        <ul>
          <li>
            气瓶浓度：{gasData.NOxInfo.Concentration != undefined ? `${gasData.NOxInfo.Concentration} mg/m3` : undefined}
          </li>
          <li>
            <span>过期时间：</span>
            <span className={styles.time} title={gasData.NOxInfo.ExpirationDate}>{gasData.NOxInfo.ExpirationDate}</span>
          </li>
          <li>
            {
              gasData.NOxInfo.msg ?
                <Tooltip title={gasData.NOxInfo.msg}>
                  <span style={{ color: "#FF9800" }}>余量：{gasData.NOxInfo.VolumeValue != undefined ? `${gasData.NOxInfo.VolumeValue} L` : undefined}</span>
                </Tooltip> :
                <span>余量：{gasData.NOxInfo.VolumeValue != undefined ? `${gasData.NOxInfo.VolumeValue} L` : undefined}</span>
            }
          </li>
          <li>
            流量：{flowList["03"] != undefined ? `${flowList["03"]} ml/min` : undefined}
          </li>
        </ul>
      </div>
      {
        (p1Pressure.pollutantCode == "03" && p1Pressure.isException == "1") ?
          <div className={styles.gasImgBox} style={{ top: "calc(86px +  152px)" }}>
            <img src="/qualityControl/gasException.png" alt="" />
            <p style={{ fontSize: 15, left: 1 }}>NOx</p>
          </div> : null
      }

      <img className={styles.valve} style={{ top: "calc(90px + 130px + 30px)" }} src="/qualityControl/valveClose.jpg" alt="" />
      {valveStatus.NOx ?
        <>
          <img className={styles.line} src="/qualityControl/NOx.png" alt="" />
          <img className={styles.valve} style={{ top: "calc(90px + 130px + 30px)" }} src="/qualityControl/valveOpen.jpg" alt="" />
        </> : null
      }

      {/* SO2 */}
      <div className={styles.gasInfoBox} style={{ top: "calc(63px + (121px + 30px) *2)" }}>
        <ul>
          <li>
            气瓶浓度：{gasData.SO2Info.Concentration !== undefined ? `${gasData.SO2Info.Concentration} mg/m3` : undefined}
          </li>
          <li>
            <span>过期时间：</span>
            <span className={styles.time} title={gasData.SO2Info.ExpirationDate}>{gasData.SO2Info.ExpirationDate}</span>
          </li>
          <li>
            {
              gasData.SO2Info.msg ?
                <Tooltip title={gasData.SO2Info.msg}>
                  <span style={{ color: "#FF9800" }}>余量：{gasData.SO2Info.VolumeValue != undefined ? `${gasData.SO2Info.VolumeValue} L` : undefined}</span>
                </Tooltip> :
                <span>余量：{gasData.SO2Info.VolumeValue != undefined ? `${gasData.SO2Info.VolumeValue} L` : undefined}</span>
            }
          </li>
          <li>
            流量：{flowList["02"] != undefined ? `${flowList["02"]} ml/min` : undefined}
          </li>
        </ul>
      </div>
      {
        (p1Pressure.pollutantCode == "02" && p1Pressure.isException == "1") ?
          <div className={styles.gasImgBox} style={{ top: "calc(86px +  152px * 2)" }}>
            <img src="/qualityControl/gasException.png" alt="" />
            <p style={{ fontSize: 15, left: 2 }}>SO₂</p>
          </div> : null
      }
      <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px)* 2)" }} src="/qualityControl/valveClose.jpg" alt="" />
      {valveStatus.SO2 ?
        <>
          <img className={styles.line} src="/qualityControl/SO2.png" alt="" />
          <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px) * 2)" }} src="/qualityControl/valveOpen.jpg" alt="" />
        </> : null
      }
      {/* N2 */}
      <div className={styles.gasInfoBox} style={{ top: "calc(63px + (121px + 30px) *3)" }}>
        <ul>
          {/* <li>
                浓度：{gasData.N2Info.Concentration}
              </li> */}
          <li>
            <span>过期时间：</span>
            <span className={styles.time} title={gasData.N2Info.ExpirationDate}>{gasData.N2Info.ExpirationDate}</span>
          </li>
          <li>
            {
              gasData.N2Info.msg ?
                <Tooltip title={gasData.N2Info.msg}>
                  <span style={{ color: "#FF9800" }}>余量：{gasData.N2Info.VolumeValue != undefined ? `${gasData.N2Info.VolumeValue} L` : undefined}</span>
                </Tooltip> :
                <span>余量：{gasData.N2Info.VolumeValue != undefined ? `${gasData.N2Info.VolumeValue} L` : undefined}</span>
            }

          </li>
          <li>
            流量：{flowList["N2"] != undefined ? `${flowList["N2"]} ml/min` : undefined}
          </li>
        </ul>
      </div>
      {
        (p2Pressure.pollutantCode == "065" && p2Pressure.isException == "1") ?
          <div className={styles.gasImgBox} style={{ top: "calc(86px +  152px * 3)" }}>
            <img src="/qualityControl/gasException.png" alt="" />
            <p>N₂</p>
          </div> : null
      }
      <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px)* 3)" }} src="/qualityControl/valveClose.jpg" alt="" />
      {valveStatus.N2 ?
        <>
          <img className={styles.line} src="/qualityControl/N2.png" alt="" />
          <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px) * 3)" }} src="/qualityControl/valveOpen.jpg" alt="" />
        </> : null
      }
      {/* 吹扫 */}
      <img className={styles.valve} style={{ top: "496px", left: "384px" }} src="/qualityControl/valveClose2.jpg" alt="" />
      {
        !!valveStatus.purge ? <>
          <img className={styles.line} src="/qualityControl/purge.png" alt="" />
          <img className={styles.valve} style={{ top: "496px", left: "384px" }} src="/qualityControl/valveOpen2.jpg" alt="" />
        </> : null
      }

      {/* CEMS */}
      {
        cemsList.map((item, index) => {
          let top = 0;
          if (index === 0) {
            top = 245;
          }
          if (index === 1) {
            top = 358;
          }
          if (index === 2) {
            top = 468;
          }
          if (index === 3) {
            top = 586;
          }
          let lineSrc = `/qualityControl/CEMS${index + 1}.png`
          // if (item.MNHall !== undefined) {
          return <>
            <div className={styles.CEMSInfoBox} style={{ top: `calc(232px + 112px * ${index})` }}>
              <div className={styles.CEMSName}>
                {
                  <>
                    {item.CemsName ?
                      <p title={item.CemsName}>{item.CemsName}</p>
                      : "未连接"} <br />
                    CEMS
                      </>
                }
              </div>
              {/* CEMS状态: 1.离线 2.异常 0.正常 */}
              {item.isException == 1 ? <img className={styles.CEMSImg} src="/qualityControl/cemsStatus1.png" alt="" /> : null}
              {item.isException == 2 ? <img className={styles.CEMSImg} src="/qualityControl/cemsStatus2.png" alt="" /> : null}
              {(item.isException == undefined && !item.CemsName) && <img className={styles.CEMSImg} src="/qualityControl/cemsStatus1.png" alt="" />}

              <div className={styles.concentration}>
                {
                  item.monitorValue != undefined ?
                    <>
                      <p>浓度</p>
                      <span>{item.monitorValue} {standardValueUtin}</span>
                    </> : null
                }
              </div>
            </div>
            <img src="/qualityControl/valveClose.jpg" className={styles.CEMSvalve} style={{ top: top }} alt="" />
            {
              item.valve === "1" ?
                <>
                  <img className={styles.CEMSLine} src={lineSrc} />
                  <img className={styles.CEMSvalve} style={{ top: top }} src="/qualityControl/valveOpen.jpg" alt="" />
                </> : undefined
            }
          </>
          // }
          // return <img src="/qualityControl/valveClose.jpg" className={styles.CEMSvalve} style={{ top: top }} alt="" />
        })
      }

      {/* 压力p1 */}
      <div className={styles.pressure}>
        {p1Pressure.value != undefined ? `${p1Pressure.value}MPa` : undefined}
      </div>
      {
        p1Pressure.isException ? <img className={styles.exceptionPressure} src="p1Exception.png" /> : null
      }
      {/* 压力p2 */}
      <div className={styles.pressure} style={{ top: 518 }}>
        {p2Pressure.value != undefined ? `${p2Pressure.value}MPa` : undefined}
      </div>
      {
        p2Pressure.isException ? <img className={styles.exceptionPressure} style={{ top: 568 }} src="p2Exception.png" /> : null
      }
      {/* 质控仪 */}
      <div className={styles.qualityControl}>
        {
          // 开门状态
          valveStatus.door == "0" ? <img className={styles.doorOpen} src="/qualityControl/doorOpen.png" alt="" /> : null
        }
        <div className={styles.title}>
          {qualityControlName}
        </div>
        {/* 质控仪状态 */}
        <div className={styles.status}>
          <Badge color={QCStatusColor[this.props.QCStatus]} />
        </div>
        {/* 标气浓度 */}
        <div className={styles.gasConcentration}>
          <p>配比标气浓度</p>
          <span>{standardValue} {standardValueUtin}</span>
        </div>

        {/* 标气浓度 */}
        <div className={styles.sum}>
          <p>总流量</p>
          <span>
            {totalFlow ? `${totalFlow}ml/min` : undefined}
          </span>
        </div>
      </div>
    </MapInteractionCSS>
  }

  render() {
    const { p1Pressure, realtimeStabilizationTime } = this.props;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Tooltip title="全屏查看">
          <Icon type="fullscreen" className={styles.fullscreen} onClick={() => { this.setState({ fullscreenVisible: true }) }} />
        </Tooltip>
        {this.pageContent()}
        <Modal
          title="查看结果实时比对"
          visible={this.state.visible}
          footer={[]}
          // okText={"开始质控"}
          // onClick={this.onSubmitForm}
          width={"90%"}
          destroyOnClose
          zIndex={1001}
          style={{ top: 130 }}
          // style={{ width: "90%", height: 600 }}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}>
          <RealTimeContrastPage PollutantCode={p1Pressure.pollutantCode} insert startTime={realtimeStabilizationTime.StartTime} stabilizationTime={realtimeStabilizationTime.StabilizationTime} />
        </Modal>
        <Modal
          // title="全屏查看"
          visible={this.state.fullscreenVisible}
          footer={[]}
          // okText={"开始质控"}
          // onClick={this.onSubmitForm}
          width={"98%"}
          destroyOnClose
          style={{ top: 10 }}
          bodyStyle={{ height: "calc(100vh - 40px - 21px)" }}
          onCancel={() => {
            this.setState({
              fullscreenVisible: false
            })
          }}>
          <>
            {this.returnQCStatus()}
            {this.pageContent("modal")}
          </>
        </Modal>
      </div>
    );
  }
}

export default ImagePage;

