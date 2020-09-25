/*
 * @Author: Jiaqi
 * @Date: 2020-08-24 11:02:20
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-08-29 10:38:51
 * @Description: 手动质控 - 页面
 */
import React, { Component } from 'react';
import { Card, Row, Col, Badge, Divider, Tag, Modal, Input, InputNumber, message, Spin } from "antd";
import styles from "../index.less"
import { connect } from "dva"
import CheckModal from "@/pages/dataSearch/qca/components/CheckModal"
import ViewQCProcess from "./ViewQCProcess"
import { LoadingOutlined, CheckCircleFilled, CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import PageLoading from "@/components/PageLoading"

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

const CheckTypeList = [
  { id: 3101, name: "零点核查" },
  { id: 3102, name: "量程核查" },
  { id: 3104, name: "线性核查" },
  { id: 3105, name: "盲样核查" },
  { id: 3103, name: "响应时间核查" },
]
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
  marginData: qcManual.marginData,
  loading: loading.effects["qcManual/getStateAndRecord"],
  sendLoading: loading.effects["qcManual/sendQCACheckCMD"]
}))
class ManualQualityPage extends Component {
  state = {
    currentRowData: {}
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
      // 重置数据
      this.props.dispatch({
        type: "qcManual/resetModalState",
        payload: {}
      })
      this.getStateAndRecord();
      this.getBottleDataList();
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
      this.getMargin();
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
    this.props.dispatch({
      type: "qcManual/getStateAndRecord",
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

  // 重置质控日志
  resetQCLog = () => {
    this.props.dispatch({
      type: "qcManual/updateState",
      payload: {
        QCLogsStart: {},
        QCLogsAnswer: {},
        QCLogsResult: {
          Data: {},
        },
      }
    })
  }

  // 发送核查命令
  sendQCACheckCMD = (PollutantCode, QCAType, StandardValue) => {
    // if(this.props.QCStatus == "1") {
    //   message.warning("")
    // }
    this.updateModalState({ currentPollutantCode: PollutantCode })
    // 重置数据
    this.props.dispatch({
      type: "qcManual/resetModalState",
      payload: {}
    })
    this.setState({ QCAType: QCAType })
    this.props.dispatch({
      type: "qcManual/sendQCACheckCMD",
      payload: {
        DGIMN: this.props.DGIMN,
        PollutantCode: PollutantCode,
        QCAType: QCAType,
        Method: 1,
        StandardValue: StandardValue
      },
      callback: () => {

      }
    })
  }

  //
  blindCheckClick = (PollutantCode, QCAType) => {
    this.props.dispatch({
      type: "qcManual/getSampleRangeFlow",
      payload: {
        DGIMN: this.props.DGIMN,
        PollutantCode: PollutantCode
      },
      callback: (res) => {
        let that = this;
        Modal.info({
          title: '盲样核查',
          okText: "确认",
          cancelText: "取消",
          // icon: <ExclamationCircleOutlined />,
          content: <div>
            <InputNumber style={{ width: '100%', marginBottom: 4 }} min={res.min} max={res.max} placeholder="请输入盲样核查浓度" onChange={(value) => {
              this.setState({
                value: value
              })
            }} />
            <span style={{ color: "#656565", fontSize: 13 }}>
              <ExclamationCircleOutlined style={{ marginRight: 6 }} />{`浓度范围在【 ${res.min}-${res.max} 】之间`}
            </span>
          </div>,
          onOk() {
            if (!that.state.value) {
              message.error("请输入盲样核查浓度");
              return;
            } else {
              that.sendQCACheckCMD(PollutantCode, QCAType, that.state.value);
            }
          },
          onCancel() {
            that.setState({
              value: undefined
            })
          },
        });
      }
    })
  }

  getAnswer = (QCLogsAnswer) => {
    const { QCLogsResult } = this.props;
    let str = QCLogsAnswer.Str;
    if (str) {
      if (str === "通讯超时") {
        return <span style={{ color: "#f81d22" }}>通讯超时。</span>
      }
      if (QCLogsAnswer.Result === false) {
        return <span>收到{QCLogsAnswer.Comment}，<span style={{ color: "#f81d22" }}>{str}。</span></span>
      }
      if (QCLogsAnswer.Result) {
        return <span>
          {/* 收到{QCLogsAnswer.Comment}，准备执行请求。 */}
          收到{QCLogsAnswer.Comment}，{QCLogsAnswer.Str}。
          {
            !QCLogsResult.str && <Tag color="#87d068" onClick={() => {
              this.setState({ modalPollutantCode: QCLogsAnswer.PollutantCode })
              this.updateModalState({ qcImageVisible: true })
            }}>查看质控过程</Tag>
          }
        </span>
      }
    }
    // {
    //   QCLogsAnswer.Str ?
    //     (QCLogsAnswer.Result === false ? <span style={{ color: QCLogsAnswer.Str === "" }}></span> : "")
    //     : null
    // }
    // {QCLogsAnswer.str ?
    //   <>
    //     {`【${pointName}】${QCLogsAnswer.str}。`}
    //     <Tag color="#87d068" onClick={() => {
    //       this.setState({ modalPollutantCode: QCLogsAnswer.PollutantCode })
    //       this.updateModalState({ qcImageVisible: true })
    //     }}>查看质控过程</Tag>
    //   </> : ""}
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
      QCLogsAnswer,
      QCLogsResult,
      sendLoading,
      currentDGIMN,
      marginData,
      loading,
    } = this.props;
    if (loading) {
      return <PageLoading />
    }
    const { QCAType, currentRowData } = this.state;
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
                      <p style={{ color: "rgb(24, 144, 255)", lineHeight: "44px" }}>标气余量：{marginData[item.GasCode]} L</p>
                    </div>
                    {
                      CheckTypeList.map((check, idx) => {
                        if (check.id === 3105) {
                          return <div key={idx} className={styles.button} onClick={() => { this.blindCheckClick(item.GasCode, check.id) }}> 盲样核查 </div>
                        }
                        return <div key={idx} onClick={() =>
                          this.sendQCACheckCMD(item.GasCode, check.id)} className={styles.button}> {check.name} </div>
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
        {console.log("QCLogsAnswer=", QCLogsAnswer)}
        {console.log("QCLogsResult=", QCLogsResult)}
        <div className={styles.qcLogContainer}>
          {QCAResultLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : ""}
          {/* 1 */}
          <div className={styles.logItem}>
            <p className={styles.date}>{QCLogsStart.Time}</p>
            <span className={styles.text}>
              {QCLogsStart.Str ?
                <>
                  {`${QCLogsStart.User}向【${pointName}】，发送${QCLogsStart.Str}`}
                </> : ""}
            </span>
          </div>
          {/* 2 */}
          <div className={styles.logItem}>
            <p className={styles.date}>{QCLogsAnswer.Time}</p>
            <span className={styles.text}>
              {QCLogsAnswer.Str ?
                <>
                  {`【${pointName}】`}{this.getAnswer(QCLogsAnswer)}
                </> : ""}
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
              {QCLogsResult.Str ?
                this.getLogResult(QCLogsResult)
                // <>
                //   {`【${pointName}】${QCLogsResult.str}`}
                //   {
                //     QCLogsResult.Data.Result == 0 ?
                //       <Tag color="#87d068" onClick={() => {
                //         this.setState({
                //           currentRowData: QCLogsResult.Data,
                //           QCAType: QCLogsResult.Data.QCAType
                //         }, () => {
                //           this.props.dispatch({
                //             type: "qcaCheck/updateState",
                //             payload: { checkModalVisible: true }
                //           })
                //         })
                //       }}>合格</Tag>
                //       :
                //       <Tag color="#f81d22" onClick={() => {
                //         this.setState({
                //           currentRowData: QCLogsResult.Data
                //         }, () => {
                //           this.props.dispatch({
                //             type: "qcaCheck/updateState",
                //             payload: { checkModalVisible: true }
                //           })
                //         })
                //       }}>不合格</Tag>
                //   }
                // </>
                : ""}
            </span>
          </div>
        </div>
        {/* 核查结果弹窗 */}
        {checkModalVisible && <CheckModal QCAType={QCAType} DGIMN={DGIMN} currentRowData={currentRowData} pointName={pointName} />}
        {/* 质控过程弹窗 */}
        {qcImageVisible && <ViewQCProcess pointName={pointName} pollutantCode={this.state.modalPollutantCode} />}
        {/*{true && <ViewQCProcess />}*/}
      </Card>
    );
  }
}

export default ManualQualityPage;
