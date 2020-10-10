import React, { PureComponent } from 'react';
import { Card, DatePicker, Row, Col, Space, Button, ConfigProvider, Modal, Spin, Select, Tag, Empty } from 'antd'
import QuestionTooltip from "@/components/QuestionTooltip"
import styles from './index.less';
import { LoadingOutlined } from "@ant-design/icons"
import { connect } from "dva"
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/locale/zh_CN';
import { gasPollutantList } from "@/utils/CONST"
import { router } from "umi"

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;

// SO2、NOx、O2、N2
// const gasPollutantList = [
//   { value: "a21026", label: "SO2", },
//   { value: "a21002", label: "NOx", },
//   { value: "a19001", label: "O2", },
//   { value: "n00000", label: "N2", },
// ]

@connect(({ dataExtract, loading }) => ({
  QCLogsStart: dataExtract.QCLogsStart,
  QCLogsAnswer: dataExtract.QCLogsAnswer,
  QCLogsResult: dataExtract.QCLogsResult,
  loading: loading.effects["dataExtract/resetState"]
}))
class DataExtractPage extends PureComponent {
  constructor(props) {
    super(props);
    // 分钟：mins 小时 hour  日 day  系统参数：system 质控标气信息：qcainfo
    this.state = {
      currentPollutantCode: "a21026",
      mins: [moment().subtract(1, "hour"), moment()],
      hour: [moment().subtract(1, "hour"), moment()],
      day: [moment().subtract(1, "days"), moment()],
      qcainfo: {
        pollutantCode: "a21026"
      }
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: "dataExtract/updateState",
      payload: {
        currentDGIMN: this.props.DGIMN
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    // 重置modal - state
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.props.dispatch({
        type: "dataExtract/resetModalState"
      })
      this.props.dispatch({
        type: "dataExtract/updateState",
        payload: {
          currentDGIMN: this.props.DGIMN
        }
      })
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: "dataExtract/resetModalState"
    })
  }



  sendDataExtract = (type) => {
    //  清空数据
    this.props.dispatch({
      type: "dataExtract/resetModalState"
    })
    const { mins, hour, day, currentPollutantCode } = this.state;
    let beginTime = undefined, endTime = undefined;
    switch (type) {
      case "mins":
        beginTime = mins[0].format("YYYY-MM-DD HH:mm:00");
        endTime = mins[1].format("YYYY-MM-DD HH:mm:00");
        break;
      case "hour":
        beginTime = hour[0].format("YYYY-MM-DD HH:00:00");
        endTime = hour[1].format("YYYY-MM-DD HH:00:00");
        break;
      case "day":
        beginTime = day[0].format("YYYY-MM-DD 00:00:00");
        endTime = day[1].format("YYYY-MM-DD 00:00:00");
        break;
      default: break;
    }
    console.log("beginTime=", beginTime)
    console.log("endTime=", endTime);
    // return;
    this.props.dispatch({
      type: "dataExtract/sendDataExtract",
      payload: {
        BeginTime: beginTime,
        EndTime: endTime,
        Type: type,
        PollutantCode: (type === "qcainfo" || type === "qcaflow") ? currentPollutantCode : undefined,
        DGIMN: this.props.DGIMN
      }
    })
  }

  getAnswer = (QCLogsAnswer) => {
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
          {QCLogsAnswer.Str}。
        </span>
      }
    }
  }

  getLogResult = (QCLogsResult) => {
    const { pointName } = this.props;
    // 通讯超时
    if (QCLogsResult.ErrorStr == "通讯超时") {
      return <span>{`【${pointName}】`}<span style={{ color: "#f81d22" }}>通讯超时</span></span>
    }
    // 异常
    if (QCLogsResult.Result == 2) {
      return <span>{`【${pointName}】`}<span style={{ color: "#f81d22" }}>{QCLogsResult.ErrorStr}</span></span>
    }
    // 正常
    if (QCLogsResult.Result != 2 && QCLogsResult.Type) {
      return <>
        {`【${pointName}】向平台反馈数据提取`}
        {
          QCLogsResult.Result == 1 ?
            <>
              <Tag color="#87d068">成功</Tag>
              {`, 提取结果。`}
              <Tag color="#87d068"
                onClick={() => {
                  if (QCLogsResult.Type === "data") {
                    router.push("/dataSearch/monitor/history") // 历史数据
                  }
                  if (QCLogsResult.Type === "system") {
                    router.push("/dataSearch/monitor/datavisualization") // 数据可视化
                  }
                  if (QCLogsResult.Type === "qcainfo") {
                    router.push("/qualityCheck/qualityMange/standardAtmosMange") // 标准气体管理页面
                  }
                }}
              >查看提取结果</Tag>
            </>
            :
            <Tag color="#f81d22">失败</Tag>
        }
      </>
    }
  }


  render() {
    const { mins, hour, day, loading, currentPollutantCode } = this.state;
    const { QCLogsStart, QCLogsAnswer, QCLogsResult, pointName } = this.props;
    return (
      <Spin spinning={!!loading}>
        <Card title="监测数据提取">
          {/* <Space direction="vertical" align="center"> */}
          <Row className={styles.row}>
            <Col className={styles.label} flex="200px">
              提取分钟数据
            </Col>
            <Col flex="auto">
              <Space>
                <RangePicker
                  defaultValue={mins}
                  style={{ width: 340 }}
                  showTime
                  locale={locale}
                  format="YYYY-MM-DD HH:mm"
                  onChange={(date, dateString) => {
                    this.setState({ mins: date })
                  }}
                />
                <Button type="primary" onClick={() => this.sendDataExtract("mins")}>提取</Button>
              </Space>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col className={styles.label} flex="200px">
              提取小时数据
            </Col>
            <Col flex="auto">
              <Space>
                <RangePicker
                  defaultValue={hour}
                  style={{ width: 340 }}
                  showTime
                  locale={locale}
                  format="YYYY-MM-DD HH"
                  onChange={(date, dateString) => {
                    this.setState({ hour: date })
                  }}
                />
                <Button type="primary" onClick={() => this.sendDataExtract("hour")}>提取</Button>
              </Space>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col className={styles.label} flex="200px">
              提取日数据
            </Col>
            <Col flex="auto">
              <Space>
                <RangePicker
                  defaultValue={day}
                  style={{ width: 340 }}
                  showTime
                  locale={locale}
                  format="YYYY-MM-DD"
                  onChange={(date, dateString) => {
                    this.setState({ day: date })
                  }}
                />
                <Button type="primary" onClick={() => this.sendDataExtract("day")}>提取</Button>
              </Space>
            </Col>
          </Row>
          {/* </Space> */}
        </Card>
        <Card title="现场参数信息提取">
          <Row className={styles.row}>
            <Col className={styles.label} flex="200px">
              提取系统参数信息
              <QuestionTooltip content="远程调取CEMS系统运行参数信息，包括烟道截面积、皮托管系数、标准过量空气系数、速度场系数、颗粒物斜率、颗粒物截距、稀释比" />
            </Col>
            <Col flex="auto">
              <Button type="primary" onClick={() => this.sendDataExtract("system")}>提取</Button>
            </Col>
            <Col className={styles.label} flex="200px">
              提取配气流量信息
              <QuestionTooltip content="提取质控仪SO2、NOx、O2的配气信息，用于计算质控仪配气范围" />
            </Col>
            <Col flex="auto">
              <Button type="primary" onClick={() => {
                const that = this;
                confirm({
                  title: '请选择污染物',
                  okText: "确认",
                  cancelText: "取消",
                  // icon: <ExclamationCircleOutlined />,
                  content: <div>
                    <Select style={{ width: 200 }} defaultValue={this.state.currentPollutantCode} onChange={(val) => {
                      that.setState({ currentPollutantCode: val })
                    }}>
                      {
                        gasPollutantList.map(item => {
                          if (item.value !== "n00000") {
                            return <Option key={item.value} value={item.value}>{item.label}</Option>
                          }
                        })
                      }
                    </Select>
                  </div>,
                  onOk() {
                    that.sendDataExtract("qcaflow");
                  },
                  onCancel() {
                    that.setState({
                      currentPollutantCode: "a21026",
                    })
                  },
                });
              }}>提取</Button>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col className={styles.label} flex="200px">
              提取质控仪标气信息
              <QuestionTooltip content="远程调取质控仪标气变更信息，包括SO2、NOx、O2、N2的标气压力、标气浓度、标气失效日期、标气证书编号、标气生产日期、气瓶体积、制造商、扩展不确定度" />
            </Col>
            <Col flex="auto">
              <Button type="primary" onClick={() => {
                const that = this;
                confirm({
                  title: '请选择污染物',
                  okText: "确认",
                  cancelText: "取消",
                  // icon: <ExclamationCircleOutlined />,
                  content: <div>
                    <Select style={{ width: 200 }} defaultValue={this.state.currentPollutantCode} onChange={(val) => {
                      that.setState({ currentPollutantCode: val })
                    }}>
                      {
                        gasPollutantList.map(item => {
                          return <Option key={item.value} value={item.value}>{item.label}</Option>
                        })
                      }
                    </Select>
                  </div>,
                  onOk() {
                    that.sendDataExtract("qcainfo");
                  },
                  onCancel() {
                    that.setState({
                      currentPollutantCode: "a21026",
                    })
                  },
                });
              }}>提取</Button>
            </Col>
          </Row>
        </Card>
        <Card title="提取日志">
          <div className={styles.qcLogContainer}>
            {false ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : ""}
            {
              (!QCLogsStart.Time && !QCLogsAnswer.Time && !QCLogsResult.Time) ?
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                <>
                  {/* 1 */}
                  <div className={styles.logItem}>
                    <p className={styles.date}>{QCLogsStart.Time}</p>
                    <span className={styles.text}>
                      {QCLogsStart.Str ?
                        <>
                          {`${QCLogsStart.User}向【${pointName}】，${QCLogsStart.Str}`}
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
                      {
                        QCLogsResult.Time && <>
                          {QCLogsResult.Time}
                        </>
                      }
                    </p>
                    <span className={styles.text}>
                      {this.getLogResult(QCLogsResult)}
                      {/* {QCLogsResult.Type ?
                        <>
                          {`【${pointName}】向平台反馈数据提取`}
                          {
                            QCLogsResult.Result == 1 ?
                              <>
                                <Tag color="#87d068">成功</Tag>
                                {`, 提取结果。`}
                                <Tag color="#87d068"
                                  onClick={() => {
                                    if (QCLogsResult.Type === "data") {
                                      router.push("/dataSearch/monitor/history") // 历史数据
                                    }
                                    if (QCLogsResult.Type === "system") {
                                      router.push("/dataSearch/monitor/datavisualization") // 数据可视化
                                    }
                                    if (QCLogsResult.Type === "qcainfo") {
                                      router.push("/qualityCheck/qualityMange/standardAtmosMange") // 标准气体管理页面
                                    }
                                  }}
                                >查看提取结果</Tag>
                              </>
                              :
                              <Tag color="#f81d22">失败</Tag>
                          }
                        </>
                        : ""} */}
                    </span>
                  </div>
                </>
            }

          </div>
        </Card>
      </Spin>
    );
  }
}

export default DataExtractPage;