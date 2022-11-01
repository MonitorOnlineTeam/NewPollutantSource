/*
 * @Author: Jiaqi
 * @Date: 2020-08-24 11:02:20
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2021-10-12 16:18:29
 * @Description: 手动质控 - 页面
 */
import React, { Component } from 'react';
import { Card, Row, Col, Badge, Divider, Tag, Modal, Input, InputNumber, message, Spin, Popconfirm, Radio } from "antd";
import styles from "../index.less"
import { connect } from "dva"
import CheckModal from "@/pages/dataSearch/qca/components/CheckModal"
import ViewQCProcess from "./ViewQCProcess"
import { LoadingOutlined, CheckCircleFilled, CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import PageLoading from "@/components/PageLoading"
import { gasPollutantList } from "@/utils/CONST"
const pollutantCodeList = {
  "a21026": { name: "SO₂", unit: "mg/m³" },
  "a21002": { name: "NOx", unit: "mg/m³" },
  "a19001": { name: "O₂", unit: "%" },
  "30": { name: "CO₂", unit: "mg/m³" },  // 二氧化碳
  "a05001": { name: "CO₂", unit: "mg/m³" },  // 二氧化碳
  "a05002": { name: "CH₄", unit: "mg/m³" },  // 甲烷
  "a24002": { name: "C₃H₈", unit: "mg/m³" },  // 丙烷
  "a05003": { name: "氧化亚氮", unit: "mg/m³" },  // 氧化亚氮
  "065": { name: "N₂", unit: "mg/m³" },
}

const { confirm } = Modal;
// 空闲（绿色），运行（蓝色），维护（黄色），故障（红色），断电（红色），离线（灰色）
// 空闲（待机）（0），运行（1）,维护（2），故障（3），断电（5），离线（6）
const QCStatusList = {
  0: { text: "空闲", color: "#52c41a" },
  1: { text: "运行", color: "#1890ff" },
  2: { text: "维护", color: "#faad14" },
  3: { text: "故障", color: "#ff4d4f" },
  5: { text: "断电", color: "#ff4d4f" },
  6: { text: "离线", color: "#d9d9d9" },
}
// 量程核查为1  盲样核查为2 零点核查：3  响应时间核查为4   线性5

@connect(({ qcManual, qcaCheck, loading }) => ({
  bottleDataList: qcManual.bottleDataList,
  qcImageVisible: qcManual.qcImageVisible,
  QCStatus: qcManual.QCStatus,
  QCAResultLoading: qcManual.QCAResultLoading,
  QCLogsStart: qcManual.QCLogsStart,
  QCLogsAnswer: qcManual.QCLogsAnswer,
  QCLogsResult: qcManual.QCLogsResult,
  currentDGIMN: qcManual.currentDGIMN,
  checkModalVisible: qcaCheck.checkModalVisible,
  loading: loading.effects["qcManual/GetQCDetailRecord"],
  sendLoading: loading.effects["qcManual/sendQCACheckCMD"]
}))
class ManualQualityPage extends Component {
  state = {
    currentRowData: {},
    GasPathMode: 0,
    QCLogsAnswer: {},
  }

  componentDidMount() {
    this.getBottleDataList();
    this.updateModalState({ currentDGIMN: this.props.DGIMN })
    this.getStateAndRecord();
  }

  componentWillUnmount() {
    // 重置数据
    this.props.dispatch({
      type: "qcManual/resetModalState",
      payload: {}
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.updateModalState({ currentDGIMN: this.props.DGIMN })
      // 重置数据
      this.props.dispatch({
        type: "qcManual/resetModalState",
        payload: {}
      })
      this.getStateAndRecord();
      this.getBottleDataList();
    }

    if (this.props.QCLogsAnswer !== prevProps.QCLogsAnswer) {
      this.setState({
        QCLogsAnswer: this.props.QCLogsAnswer,
      })
    }

    // 状态改变后，清空数据
    if (prevProps.QCStatus == 1 && this.props.QCStatus !== prevProps.QCStatus) {
      console.log("状态改变后，清空数据")
      this.props.dispatch({
        type: "qcManual/updateState",
        payload: {
          CEMSOpen: undefined,// CEMS阀门状态
          // CEMSStatus: undefined,
          QCAResultLoading: false,
          valveStatus: {}, // 阀门状态
          p2Pressure: {},
          p1Pressure: {},
          p3Pressure: {},
          p4Pressure: {},
          // QCStatus: undefined, // 质控仪状态
          standardValue: undefined,
          standardValueUtin: null, // 单位
          totalFlow: undefined,
          pollutantValueListInfo: [],
          realtimeStabilizationTime: {},
        }
      })
      // this.getMargin();
    }
  }

  getMargin = () => {
    this.props.dispatch({
      type: "qcManual/getMargin",
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
  }


  // 获取状态和质控日志
  getStateAndRecord = () => {
    // 获取质控仪状态
    this.props.dispatch({
      type: "qcManual/getQCAStatus",
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
    // 获取质控日志
    this.props.dispatch({
      type: "qcManual/getQCDetailRecord",
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
  }



  // 获取气瓶信息
  getBottleDataList = () => {
    this.props.dispatch({
      type: "qcManual/getBottleDataList",
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
  }

  updateModalState = (payload) => {
    this.props.dispatch({
      type: "qcManual/updateState",
      payload: {
        ...payload
      }
    })
  }

  // 发送核查命令
  sendQCACheckCMD = (PollutantCode, QCAType, StandardValue) => {
    // if(this.props.QCStatus == "1") {
    //   message.warning("")
    // }
    this.updateModalState({ currentPollutantCode: PollutantCode })
    this.setState({ QCAType: QCAType })
    this.props.dispatch({
      type: "qcManual/sendQCACheckCMD",
      payload: {
        DGIMN: this.props.DGIMN,
        PollutantCode: PollutantCode,
        QCAType: QCAType,
        Method: 1,
        StandardValue: StandardValue,
        GasPathMode: this.state.GasPathMode,
      },
      callback: () => {
        this.setState({ MYVisible: false })
        // this.updateModalState({ QCAResultLoading: true })
        // // 重置数据
        // this.props.dispatch({
        //   type: "qcManual/resetModalState",
        //   payload: {}
        // })
      }
    })
  }


  onChangeMode = () => {
    this.props.dispatch({
      type: "qcManual/getSampleRangeFlow",
      payload: {
        DGIMN: this.props.DGIMN,
        PollutantCode: this.state.PollutantCode,
        GasPathMode: this.state.GasPathMode
      },
      callback: (res) => {
        this.setState({
          MYMin: res.min,
          MYMax: res.max,
        })
      }
    })
  }

  //
  blindCheckClick = (PollutantCode, QCAType, unit) => {
    this.props.dispatch({
      type: "qcManual/getSampleRangeFlow",
      payload: {
        DGIMN: this.props.DGIMN,
        PollutantCode: PollutantCode,
        GasPathMode: this.state.GasPathMode
      },
      callback: (res) => {
        this.setState({
          MYMin: res.min,
          MYMax: res.max,
          MYVisible: true,
          PollutantCode: PollutantCode,
          QCAType: QCAType,
          MYUnit: unit
        })
        let that = this;
        // confirm({
        //   title: '盲样核查',
        //   okText: "确认",
        //   cancelText: "取消",
        //   icon: <ExclamationCircleOutlined />,
        //   content: <div>
        //     <InputNumber style={{ width: '100%', marginBottom: 4 }} placeholder="请输入盲样核查浓度" onChange={(value) => {
        //       this.setState({
        //         value: value
        //       })
        //     }} />
        //     <span style={{ color: "#656565", fontSize: 13 }}>
        //       <ExclamationCircleOutlined style={{ marginRight: 6 }} />{`浓度范围在【 ${res.min}-${res.max} 】之间`}
        //     </span>
        //   </div>,
        //   onOk() {
        //     if (that.state.value > res.max || that.state.value < res.min) {
        //       message.error(`浓度范围应在【 ${res.min}-${res.max} 】之间，请重新输入`);
        //       return false;
        //     }
        //     if (!that.state.value) {
        //       message.error("请输入盲样核查浓度");
        //       return;
        //     } else {
        //       that.sendQCACheckCMD(PollutantCode, QCAType, that.state.value);
        //     }
        //   },
        //   onCancel() {
        //     that.setState({
        //       value: undefined
        //     })
        //   },
        // });
      }
    })
  }

  onMYClick = () => {
    const { value, MYMin, MYMax, PollutantCode, QCAType } = this.state;
    if (value > MYMax || value < MYMin) {
      message.error(`浓度范围应在【 ${MYMin}-${MYMax} 】之间，请重新输入`);
      return false;
    }
    if (!value) {
      message.error("请输入盲样核查浓度");
      return;
    } else {
      this.sendQCACheckCMD(PollutantCode, QCAType, value);
    }
  }

  getPollutantName = (code) => {
    console.log('code=', code)
    if (code) {
      return pollutantCodeList[code].name
    }
    return "";
  }

  // getAnswer = (QCLogsAnswer) => {
  getAnswer = () => {
    const { QCLogsResult, pointName } = this.props;
    const { QCLogsAnswer } = this.props;
    { console.log("QCLogsAnswer=", QCLogsAnswer) }
    let str = QCLogsAnswer.Str;
    if (str) {
      let ele = '';
      if (str === "通讯超时") {
        ele = <span style={{ color: "#f81d22" }}>通讯超时。</span>
      }
      if (QCLogsAnswer.Result === false) {
        ele = <span>收到{this.getPollutantName(QCLogsAnswer.PollutantCode)}{QCLogsAnswer.Comment}，<span style={{ color: "#f81d22" }}>{str}。</span></span>
      }
      if (QCLogsAnswer.Result) {
        ele = <span>
          {/* 收到{QCLogsAnswer.Comment}，准备执行请求。 */}
          收到{this.getPollutantName(QCLogsAnswer.PollutantCode)}{QCLogsAnswer.Comment}，{QCLogsAnswer.Str}。
          {
            // !QCLogsResult.Str && <Tag color="#87d068" onClick={() => {
            <Tag color="#87d068" onClick={() => {
              this.setState({ modalPollutantCode: QCLogsAnswer.PollutantCode, modalQCAType: QCLogsAnswer.Comment, GasPathMode: QCLogsAnswer.GasPathMode })
              this.updateModalState({ qcImageVisible: true })
            }}>查看质控过程</Tag>
          }
        </span>
      }
      return <>
        {`【${pointName}】`}{ele}
      </>
    } else {
      return ''
    }
  }


  getLogResult = (QCLogsResult) => {
    const { pointName } = this.props;
    let str = QCLogsResult.Str;
    if (QCLogsResult.Data) {
      return <>
        {`【${pointName}】${QCLogsResult.Str}`}
        {
          QCLogsResult.Data.Result == 0 && <Tag color="#87d068" onClick={() => {
            this.setState({
              currentRowData: QCLogsResult.Data,
              QCAType: QCLogsResult.Data.QCAType
            }, () => {
              this.props.dispatch({
                type: "qcaCheck/updateState",
                payload: { checkModalVisible: true }
              })
            })
          }}>合格</Tag>
        }
        {
          QCLogsResult.Data.Result == 1 &&
          <Tag color="#f81d22" onClick={() => {
            this.setState({
              currentRowData: QCLogsResult.Data,
              QCAType: QCLogsResult.Data.QCAType
            }, () => {
              this.props.dispatch({
                type: "qcaCheck/updateState",
                payload: { checkModalVisible: true }
              })
            })
          }}>不合格</Tag>
        }
        {
          QCLogsResult.Data.Result == 2 &&
          <Tag color="#7b7b7b">无效</Tag>
        }
      </>
    } else if (str === "通讯超时") {
      return <span>【{pointName}】<span style={{ color: "#f81d22" }}>通讯超时。</span></span>
    } else {
      return <span>【{pointName}】向平台反馈<span style={{ color: "#f81d22" }}>{str}。</span></span>
    }
    return ""
  }

  render() {
    const {
      checkModalVisible,
      bottleDataList,
      DGIMN,
      pointName,
      qcImageVisible,
      QCStatus,
      QCAResultLoading,
      QCLogsStart,
      QCLogsResult,
      loading,
    } = this.props;
    if (loading) {
      return <PageLoading />
    }
    const { QCAType, currentRowData, MYMax, MYMin, modalQCAType, GasPathMode, QCLogsAnswer, MYUnit } = this.state;
    console.log('QCStatus=', QCStatus);
    return (
      <Card>
        <Row>
          <span style={{ color: "#000" }}>质控仪状态：</span>
          {
            QCStatus && <Badge color={QCStatusList[QCStatus].color} text={QCStatusList[QCStatus].text} style={{ color: QCStatusList[QCStatus].color }} />
          }
          <Divider />
        </Row>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={QCAResultLoading} tip="质控中...">
          <div className={styles.pollutantsContainer}>
            {
              bottleDataList.map((item) => {
                if (item.GasCode !== "n00000") {
                  return <div key={item.pollutantName} className={styles.pollutantContent}>
                    <div className={styles.pollutantInfo}>
                      <p className={styles.pollutantName}>{item.PollutantName}</p>
                      <p style={{ color: "rgb(24, 144, 255)", lineHeight: "44px" }}>标气余量：{item.Allowance} L</p>
                    </div>
                    {
                      item.CNList.map((check, idx) => {
                        if (check.CN === '3105') {
                          let unit = item.GasCode === 'a05001' ? '%' : item.Unit;
                          return <div key={idx} className={styles.button} onClick={() => { this.blindCheckClick(item.GasCode, check.CN, unit) }}> 盲样核查 </div>
                        }
                        if (check.CN === '3103') {
                          return <Popconfirm
                            key={idx}
                            title={
                              <div>
                                <p>
                                  气路模式：
                                  <Radio.Group value={GasPathMode} onChange={(e) => this.setState({ GasPathMode: e.target.value })}>
                                    <Radio value={0}>全程校验</Radio>
                                  </Radio.Group>
                                </p>
                              </div>
                            }
                            onConfirm={() =>
                              this.sendQCACheckCMD(item.GasCode, check.CN)
                            }
                          >
                            <div key={idx} className={styles.button} onClick={() => this.setState({ GasPathMode: 0 })}> {check.Name} </div>
                          </Popconfirm>
                        }
                        return <Popconfirm
                          key={idx}
                          title={
                            <div>
                              <p>
                                气路模式：
                                <Radio.Group value={GasPathMode} onChange={(e) => this.setState({ GasPathMode: e.target.value })}>
                                  <Radio value={0}>全程校验</Radio>
                                  <Radio value={1}>系统校验</Radio>
                                </Radio.Group>
                              </p>
                            </div>
                          }
                          onConfirm={() =>
                            this.sendQCACheckCMD(item.GasCode, check.CN)
                          }
                        >
                          <div key={idx} className={styles.button}> {check.Name} </div>
                        </Popconfirm>
                      })
                    }
                    {/* <div className={styles.button}> 响应时间核查 </div> */}
                  </div>
                }
              })
            }
          </div>
        </Spin>
        <Divider dashed />
        {console.log("QCAResultLoading=", QCAResultLoading)}
        {console.log("QCLogsStart=", QCLogsStart)}
        {console.log("QCLogsResult=", QCLogsResult)}
        {console.log("QCLogsAnswer-render=", QCLogsAnswer)}
        <div className={styles.qcLogContainer} >
          {QCAResultLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : ""}
          {/* 1 */}
          <div className={styles.logItem}>
            <p className={styles.date}>{QCLogsStart.Time}</p>
            <span className={styles.text}>
              {QCLogsStart.Str ?
                <>
                  {`${QCLogsStart.User}向【${pointName}】，发送${this.getPollutantName(QCLogsStart.PollutantCode)}${QCLogsStart.Str}`}
                </> : ""}
            </span>
          </div>
          {/* 2 */}
          <div className={styles.logItem}>
            <p className={styles.date}>{QCLogsAnswer.Time}</p>
            <span className={styles.text}>
              {this.getAnswer()}
            </span>
          </div>
          {/* 3 */}
          <div className={styles.logItem}>
            <p className={styles.date}>
              {QCLogsResult.Time && QCLogsResult.Time}
              {
                (QCLogsResult.Data && QCLogsResult.Data.EndTime) && <>
                  {QCLogsResult.Data.EndTime}
                  {
                    QCLogsResult.Data.Result == 0 && <CheckCircleFilled style={{ color: "#87d068", fontSize: 18, marginLeft: 10 }} />}
                  {
                    QCLogsResult.Data.Result == 1 && <CloseCircleFilled style={{ color: "#f81d22", fontSize: 18, marginLeft: 10 }} />
                  }
                </>
              }
            </p>
            <span className={styles.text}>
              {QCLogsResult.Str ? this.getLogResult(QCLogsResult) : ""}
            </span>
          </div>
        </div>
        {/* 核查结果弹窗 */}
        {checkModalVisible && <CheckModal QCAType={QCAType} DGIMN={DGIMN} currentRowData={currentRowData} pointName={pointName} />}
        {/* 质控过程弹窗 */}
        {qcImageVisible && <ViewQCProcess pointName={pointName} pollutantCode={this.state.modalPollutantCode} QCATypeName={modalQCAType} GasPathMode={GasPathMode} />}
        {/*{true && <ViewQCProcess />}*/}
        <Modal
          title="盲样核查"
          visible={this.state.MYVisible}
          destroyOnClose
          // visible={true}
          onOk={this.onMYClick}
          onCancel={() => this.setState({ MYVisible: false })}
        >
          <div>
            <p style={{ marginBottom: 18 }}>
              气路模式：
              <Radio.Group value={GasPathMode} onChange={(e) => this.setState({ GasPathMode: e.target.value }, () => this.onChangeMode())}>
                <Radio value={0}>全程校验</Radio>
                <Radio value={1}>系统校验</Radio>
              </Radio.Group>
            </p>
          </div>
          <div>
            <span style={{ float: 'left', marginTop: 6 }}>核查浓度({MYUnit})：</span>
            {/* <div style={{ display: 'inline-block', width: '80%' }}> */}
            <div style={{ display: 'inline-block', width: 340 }}>
              <InputNumber
                style={{ width: '100%', marginBottom: 4 }} placeholder="请输入盲样核查浓度" onChange={(value) => {
                  this.setState({
                    value: value
                  })
                }} />
              <br />
              <span style={{ color: "#656565", fontSize: 13 }}>
                <ExclamationCircleOutlined style={{ marginRight: 6 }} />{`浓度范围在【 ${MYMin}${MYUnit} - ${MYMax}${MYUnit} 】之间`}
              </span>
            </div>
          </div>
        </Modal>
      </Card >
    );
  }
}

export default ManualQualityPage;
