import React, { PureComponent } from 'react';
import { Button, Card, notification, Modal, Spin, Tooltip, Select, message, Badge, Alert, Tabs } from 'antd';
import { MapInteractionCSS } from 'react-map-interaction';
import styles from './index.less'
import { connect } from "dva"
import ReactEcharts from 'echarts-for-react';
import CustomIcon from '@/components/CustomIcon'
import { LoadingOutlined } from "@ant-design/icons"


const { TabPane } = Tabs;

const QCStatusColor = {
  0: "#52c41a",
  1: "#1890ff",
  2: "#faad14",
  3: "#ff4d4f",
  5: "#ff4d4f",
  6: "#d9d9d9"
}
const QCStatusList = {
  0: { text: "空闲", color: "#52c41a" },
  1: { text: "运行", color: "#1890ff" },
  2: { text: "维护", color: "#faad14" },
  3: { text: "故障", color: "#ff4d4f" },
  5: { text: "断电", color: "#ff4d4f" },
  6: { text: "离线", color: "#d9d9d9" },
}

const pollutantCodeList = {
  "a21026": { name: "SO₂", unit: "mg/m³" },
  "a21002": { name: "NOx", unit: "mg/m³" },
  "a19001": { name: "O₂", unit: "%" },
  "30": { name: "CO₂", unit: "mg/m³" },  // 二氧化碳
  "a05002": { name: "CH₄", unit: "mg/m³" },  // 甲烷
  "a24002": { name: "C₃H₈", unit: "mg/m³" },  // 丙烷
  "a05003": { name: "氧化亚氮", unit: "mg/m³" },  // 氧化亚氮
  "065": { name: "N₂", unit: "mg/m³" },
}
@connect(({ loading, qcManual, qualityControlModel }) => ({
  gasData: qcManual.gasData,
  valveStatus: qcManual.valveStatus,
  CEMSOpen: qcManual.CEMSOpen,
  CEMSStatus: qcManual.CEMSStatus,
  p2Pressure: qcManual.p2Pressure,
  p1Pressure: qcManual.p1Pressure,
  p3Pressure: qcManual.p3Pressure,
  p4Pressure: qcManual.p4Pressure,
  p1Exception: qcManual.p1Exception,
  p2Exception: qcManual.p2Exception,
  p3Exception: qcManual.p3Exception,
  p4Exception: qcManual.p4Exception,
  standardValue: qcManual.standardValue,
  qualityControlName: qcManual.qualityControlName,
  standardValueUtin: qcManual.standardValueUtin,
  QCStatus: qcManual.QCStatus,
  // currentDGIMN: qualityControlModel.currentDGIMN,
  pollutantValueListInfo: qcManual.pollutantValueListInfo,
  totalFlow: qcManual.totalFlow,
  DeviceStatus: qcManual.DeviceStatus,
  qcImageVisible: qcManual.qcImageVisible,
  timeList: qcManual.timeList,
  valueList: qcManual.valueList,
  standardValueList: qcManual.standardValueList,
  QCLogsResult: qcManual.QCLogsResult,
  marginData: qcManual.marginData,
  currentPollutantCode: qcManual.currentPollutantCode,
  // isReceiveData: qualityControlModel.isReceiveData,
}))
class ViewQCProcess extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  pageContent = (type) => {
    const { gasData, CEMSStatus, QCStatus, marginData, pollutantValueListInfo, valveStatus, totalFlow, standardValueUtin, CEMSOpen, p1Pressure, p2Pressure, p3Pressure, p4Pressure, p1Exception, p2Exception, p3Exception, p4Exception, realtimeStabilizationTime, standardValue, qualityControlName } = this.props;
    let props = {};
    if (type === "modal") {
      props = {
        defaultScale: 1.3
      }
    }
    return <MapInteractionCSS style={{ position: 'relative' }} {...props}>
      {/* <div style={{ width: '100%', height: '100%' }}> */}
      <img src="/qualityControl/lct.jpg" />
      {/* <div className={styles.CEMS}>
        <img src="/qualityControl/CEMS.jpg" />
      </div> */}
      {/* O2 */}
      <div className={styles.gasInfoBox}>
        <ul>
          <li>
            气瓶浓度：{gasData.O2Info && gasData.O2Info.Concentration != undefined && `${gasData.O2Info.Concentration}%`}
          </li>
          <li>
            <span>过期时间：</span>
            <span className={styles.time} title={gasData.O2Info.ExpirationDate}>{gasData.O2Info.ExpirationDate}</span>
          </li>
          <li>
            {
              gasData.O2Info.msg ?
                <Tooltip title={gasData.O2Info.msg}>
                  <span style={{ color: "#FF9800" }}>余量：{marginData["a19001"] != undefined ? `${marginData["a19001"]} L` : undefined}</span>
                </Tooltip> :
                <span>余量：{marginData["a19001"] != undefined ? `${marginData["a19001"]} L` : undefined}</span>
            }
          </li>
        </ul>
      </div>
      {
        (p4Pressure.pollutantCode == "s01" && p4Pressure.isException == "1") ?
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
                  <span style={{ color: "#FF9800" }}>余量：{marginData["a21002"] != undefined ? `${marginData["a21002"]} L` : undefined}</span>
                </Tooltip> :
                <span>余量：{marginData["a21002"] != undefined ? `${marginData["a21002"]} L` : undefined}</span>
            }
          </li>
        </ul>
      </div>
      {
        (p3Pressure.pollutantCode == "03" && p3Pressure.isException == "1") ?
          <div className={styles.gasImgBox} style={{ top: "calc(86px +  152px)" }}>
            <img src="/qualityControl/gasException.png" alt="" />
            <p style={{ fontSize: 15, left: 1 }}>NOx</p>
          </div> : null
      }

      <img className={styles.valve} style={{ top: "calc(90px + 130px + 30px)" }} src="/qualityControl/valveClose.jpg" alt="" />
      {valveStatus.NOx ?
        // {true ?
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
                  <span style={{ color: "#FF9800" }}>余量：{marginData["a21026"] != undefined ? `${marginData["a21026"]} L` : undefined}</span>
                </Tooltip> :
                <span>余量：{marginData["a21026"] != undefined ? `${marginData["a21026"]} L` : undefined}</span>
            }
          </li>
        </ul>
      </div>
      {
        (p2Pressure.pollutantCode == "02" && p2Pressure.isException == "1") ?
          <div className={styles.gasImgBox} style={{ top: "calc(86px +  152px * 2)" }}>
            <img src="/qualityControl/gasException.png" alt="" />
            <p style={{ fontSize: 15, left: 2 }}>SO₂</p>
          </div> : null
      }
      <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px)* 2)" }} src="/qualityControl/valveClose.jpg" alt="" />
      {valveStatus.SO2 ?
        // {true ?
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
                  <span style={{ color: "#FF9800" }}>余量：{marginData["n00000"] != undefined ? `${marginData["n00000"]} L` : undefined}</span>
                </Tooltip> :
                <span>余量：{marginData["n00000"] != undefined ? `${marginData["n00000"]} L` : undefined}</span>
            }

          </li>
        </ul>
      </div>
      {
        (p1Pressure.pollutantCode == "065" && p1Pressure.isException == "1") ?
          <div className={styles.gasImgBox} style={{ top: "calc(86px +  152px * 3)" }}>
            <img src="/qualityControl/gasException.png" alt="" />
            <p>N₂</p>
          </div> : null
      }
      <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px)* 3)" }} src="/qualityControl/valveClose.jpg" alt="" />
      {valveStatus.N2 && !valveStatus.purge ?
        // {true ?
        <>
          <img className={styles.line} src="/qualityControl/N2.png" alt="" />
          <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px) * 3)" }} src="/qualityControl/valveOpen.jpg" alt="" />
          <img className={styles.valve} style={{ top: "499px", left: "484px" }} src="/qualityControl/valveOpen2.jpg" alt="" />
        </> : null
      }
      {/* 吹扫 */}
      <img className={styles.valve} style={{ top: "499px", left: "484px" }} src="/qualityControl/valveClose2.jpg" alt="" />
      {
        !!valveStatus.purge ? <>
          {/* true ? <> */}
          <img className={styles.line} src="/qualityControl/purge.png" alt="" />
          <img className={styles.valve} style={{ top: "calc(90px + (130px + 30px) * 3)" }} src="/qualityControl/valveOpen.jpg" alt="" />
          <img className={styles.valve} style={{ top: "499px", left: "484px" }} src="/qualityControl/valveOpen2.jpg" alt="" />
        </> : null
      }

      {/* 压力p1 */}
      <div className={styles.pressure}>
        {p1Pressure.value != undefined ? `${p1Pressure.value}MPa` : undefined}
      </div>
      {
        p1Exception === '1' ? <Tooltip placement="bottom" title="压力异常"><img className={styles.exceptionPressure} src="/qualityControl/p1Exception.png" /></Tooltip> : null
        // true ? <img className={styles.exceptionPressure} src="p1Exception.png" /> : null
      }

      {/* 压力p2 */}
      <div className={styles.pressure} style={{ top: 358 }}>
        {p2Pressure.value != undefined ? `${p2Pressure.value}MPa` : undefined}
      </div>
      {
        p2Exception === '1' ? <Tooltip placement="bottom" title="压力异常"><img className={styles.exceptionPressure} style={{ top: 407 }} src="/qualityControl/p2Exception.png" /></Tooltip> : null
        // true ? <img className={styles.exceptionPressure} style={{ top: 407 }} src="p2Exception.png" /> : null
      }

      {/* 压力p3 */}
      <div className={styles.pressure} style={{ top: 196 }}>
        {p3Pressure.value != undefined ? `${p3Pressure.value}MPa` : undefined}
      </div>
      {
        p3Exception === '1' ? <Tooltip placement="bottom" title="压力异常"><img className={styles.exceptionPressure} style={{ top: 247 }} src="/qualityControl/p3Exception.png" /></Tooltip> : null
        // true ? <img className={styles.exceptionPressure} style={{ top: 247 }} src="p3Exception.png" /> : null
      }

      {/* 压力p4 */}
      <div className={styles.pressure} style={{ top: 40 }}>
        {p4Pressure.value != undefined ? `${p4Pressure.value}MPa` : undefined}
      </div>
      {
        p4Exception === '1' ? <Tooltip placement="bottom" title="压力异常"><img className={styles.exceptionPressure} style={{ top: 88 }} src="/qualityControl/p4Exception.png" /></Tooltip> : null
        //  true ? <img className={styles.exceptionPressure} style={{ top: 88 }} src="p4Exception.png" /> : null
      }
      {console.log("CEMSOpen=", CEMSOpen)}
      {/* CEMS连接状态 */}
      {
        CEMSOpen == "1" ? <>
          <img className={styles.CEMSLine} src="/qualityControl/CEMSLine.jpg" alt="" />
          <img className={styles.CEMSvalve} src="/qualityControl/valveOpen.jpg" alt="" />
        </> : null
      }
      <div className={styles.CEMSInfoBox}>
        <div className={styles.CEMSName}>
          CEMS
        </div>
        {/* <div className={styles.CEMSStatus}>
          工作状态：{
            this.props.QCStatus !== undefined && QCStatusList[this.props.QCStatus].text
          }
        </div> */}
        <div className={styles.pollutantListInfo}>
          <p className={styles.title}>气态分析仪</p>
          {
            pollutantValueListInfo.map(item => {
              // if (item.PollutantCode === "a21026") {
              return <p>{pollutantCodeList[item.PollutantCode].name}：{item.MonitorValue}{pollutantCodeList[item.PollutantCode].unit}</p>
              // }
            })
          }
        </div>
      </div>

      {/* 质控仪 */}
      <div className={styles.qualityControl}>
        {
          // 开门状态
          valveStatus.door == "0" ? <img className={styles.doorOpen} src="/qualityControl/doorOpen.png" alt="" /> : null
        }
        <div className={styles.title}>
          {/* {qualityControlName} */}
          质控仪
        </div>
        {/* 质控仪状态 */}
        <div className={styles.status}>
          {
            this.props.QCStatus !== undefined &&
            <Badge color={QCStatusList[this.props.QCStatus].color} />
          }
        </div>
        {/* 标气浓度 */}
        <div className={styles.gasConcentration}>
          <p>配比标气浓度</p>
          <span>{standardValue} {standardValueUtin}</span>
        </div>

        {/* 标气浓度 */}
        <div className={styles.sum}>
          <p>配气流量</p>
        </div>

        <span className={styles.flowNum}>
          {totalFlow ?
            <Tooltip title={`${totalFlow}ml/min`}>
              {`${totalFlow}ml/min`}
            </Tooltip>
            : undefined}
        </span>
      </div>
    </MapInteractionCSS >
  }


  // 折线图配置项
  lineOption = () => {
    const { valueList, timeList, standardValueList, standardValueUtin } = this.props;
    return {
      color: ["#56f485", "#c23531"],
      legend: {
        data: ["测量浓度", "配比标气浓度"],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          }
        },
        // formatter: (params) => {
        //   return `
        //     ${params[0].name}
        //     <br />
        //     ${params[0].marker}
        //     ${params[0].seriesName}：${params[0].value}${standardValueUtin ? standardValueUtin : ""}
        //     <br />
        //     ${params[1].marker}
        //     ${params[1].seriesName}：${params[1].value}${standardValueUtin ? standardValueUtin : ""}
        //   `
        // },
        formatter: (params) => {
          if (params) {
            let params0 = "", params1 = "";
            if (params[0]) {
              params0 = `
              ${params[0].name}
              <br />
              ${params[0].marker}
              ${params[0].seriesName}：${params[0].value}${standardValueUtin ? standardValueUtin : ""}
              <br />`
            }
            if (params[1]) {
              params1 = `${params[1].marker}
${params[1].seriesName} ：${params[1].value} ${standardValueUtin ? standardValueUtin : ""}`
            }
            return params0 + params1;
          }
        }
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          // magicType: {type: ['line', 'bar']},
          // restore: {},
          saveAsImage: {}
        }
      },
      grid: {
        left: '30px',
        right: '30px',
        bottom: '10px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeList,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
      },
      yAxis: {
        type: 'value',
        name: standardValueUtin ? standardValueUtin : "",
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, {
        start: 0,
        end: 100,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: [{
        name: '测量浓度',
        data: valueList,
        type: 'line',
      },
      {
        name: '配比标气浓度',
        data: standardValueList,
        smooth: true,
        type: 'line',
      }]
    };
  }

  onCloseModal = () => {
    this.props.dispatch({
      type: "qcManual/updateState",
      payload: {
        qcImageVisible: false
      }
    })
  }

  // 获取质控结果
  getQCAResult = () => {
    if (this.props.QCLogsResult.Data && this.props.QCLogsResult.Data.Result) {
      console.log("this.props.QCLogsResult.Data.Result=", this.props.QCLogsResult.Data.Result)
      switch (this.props.QCLogsResult.Data.Result + "") {
        case "0":
          return <CustomIcon className={styles.QCResult} type="icon-hege" />
        case "1":
          return <CustomIcon className={styles.QCResult} type="icon-buhege" />
        case "2":
          return <CustomIcon className={styles.QCResult} type="icon-wuxiao" />
        default:
          return <Spin style={{ position: 'absolute', right: 20 }} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
      }
    }
  }

  render() {
    const { qcImageVisible, pointName, pollutantCode, currentPollutantCode, QCATypeName } = this.props;
    console.log("pollutantCode=", pollutantCode)
    let code = pollutantCode || currentPollutantCode;
    return (
      <Modal
        title={`【${pointName}】${pollutantCodeList[code].name}${QCATypeName} - 质控过程`}
        width="80vw"
        footer={false}
        visible={qcImageVisible}
        // visible={true}
        onOk={this.handleOk}
        onCancel={this.onCloseModal}
      >
        <Tabs type="card">
          <TabPane tab="流程图" key="1">
            {this.pageContent()}
          </TabPane>
          <TabPane tab="过程数据" key="2">
            {this.getQCAResult()}
            <ReactEcharts
              theme="line"
              // option={() => { this.lightOption() }}
              option={this.lineOption()}
              lazyUpdate={true}
              notMerge
              id="rightLine"
              style={{ width: '100%', height: 'calc(100vh - 430px)', minHeight: '300px' }}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default ViewQCProcess;
