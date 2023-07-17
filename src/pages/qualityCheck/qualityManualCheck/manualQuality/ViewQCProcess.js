import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  notification,
  Modal,
  Spin,
  Tooltip,
  Select,
  message,
  Badge,
  Alert,
  Tabs,
} from 'antd';
import { MapInteractionCSS } from 'react-map-interaction';
import styles from './index.less';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import CustomIcon from '@/components/CustomIcon';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TabPane } = Tabs;

const QCStatusColor = {
  0: '#52c41a',
  1: '#1890ff',
  2: '#faad14',
  3: '#ff4d4f',
  5: '#ff4d4f',
  6: '#d9d9d9',
};
const QCStatusList = {
  0: { text: '空闲', color: '#52c41a' },
  1: { text: '运行', color: '#1890ff' },
  2: { text: '维护', color: '#faad14' },
  3: { text: '故障', color: '#ff4d4f' },
  5: { text: '断电', color: '#ff4d4f' },
  6: { text: '离线', color: '#d9d9d9' },
};

const pollutantCodeList = {
  a21026: { name: 'SO₂', unit: 'mg/m³' },
  '02': { name: 'SO₂', unit: 'mg/m³' },
  '03': { name: 'NOx', unit: 'mg/m³' },
  a21002: { name: 'NOx', unit: 'mg/m³' },
  a19001: { name: 'O₂', unit: '%' },
  '30': { name: 'CO₂', unit: 'mg/m³' }, // 二氧化碳
  a05001: { name: 'CO₂', unit: '%' }, // 二氧化碳
  a05002: { name: 'CH₄', unit: 'mg/m³' }, // 甲烷
  a24002: { name: 'C₃H₈', unit: 'mg/m³' }, // 丙烷
  a05003: { name: '氧化亚氮', unit: 'mg/m³' }, // 氧化亚氮
  '065': { name: 'N₂', unit: 'mg/m³' },
};

const gas4 = {
  wrapperPosition: { top: 108, left: 56 },
  gasListStyles: [
    { lineImgName: 'bottleLine1', flag: 'first' },
    { lineTop: 28, pressureContentTop: -78, lineImgName: 'bottleLine2', flag: 'second' },
    { lineTop: -12, pressureContentTop: -28, lineImgName: 'bottleLine3', flag: 'third' },
    {
      lineTop: 39,
      pressureContentTop: -78,
      purgeLineTop: -131,
      lineImgName: 'bottleLine4',
      flag: 'fourth',
      purgeFlag: true,
    },
  ],
};

const gas2 = {
  wrapperPosition: { top: 270, left: 56 },
  gasListStyles: [
    { lineImgName: 'bottleLine2', flag: 'first' },
    {
      lineTop: -18,
      pressureContentTop: -28,
      purgeLineTop: -18,
      lineImgName: 'bottleLine3',
      flag: 'second',
      purgeFlag: true,
    },
  ],
};

@connect(({ loading, qcManual }) => ({
  gasData: qcManual.gasData,
  valveStatus: qcManual.valveStatus,
  CEMSOpen: qcManual.CEMSOpen,
  CEMSStatus: qcManual.CEMSStatus,
  pressure: qcManual.pressure,
  // p2Pressure: qcManual.p2Pressure,
  // p1Pressure: qcManual.p1Pressure,
  // p3Pressure: qcManual.p3Pressure,
  // p4Pressure: qcManual.p4Pressure,
  // p1Exception: qcManual.p1Exception,
  // p2Exception: qcManual.p2Exception,
  // p3Exception: qcManual.p3Exception,
  // p4Exception: qcManual.p4Exception,
  standardValue: qcManual.standardValue,
  qualityControlName: qcManual.qualityControlName,
  standardValueUtin: qcManual.standardValueUtin,
  QCStatus: qcManual.QCStatus,
  pollutantValueListInfo: qcManual.pollutantValueListInfo,
  totalFlow: qcManual.totalFlow,
  door: qcManual.door,
  DeviceStatus: qcManual.DeviceStatus,
  qcImageVisible: qcManual.qcImageVisible,
  timeList: qcManual.timeList,
  valueList: qcManual.valueList,
  standardValueList: qcManual.standardValueList,
  QCLogsResult: qcManual.QCLogsResult,
  currentPollutantCode: qcManual.currentPollutantCode,
}))
class ViewQCProcess extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  pageContent = type => {
    const {
      gasData,
      CEMSStatus,
      QCStatus,
      GasPathMode,
      pollutantValueListInfo,
      valveStatus,
      totalFlow,
      standardValueUtin,
      CEMSOpen,
      pressure,
      realtimeStabilizationTime,
      standardValue,
      qualityControlName,
      door,
    } = this.props;
    console.log('GasPathMode=', GasPathMode);
    const gasLength = gasData.filter(item => item.GasCode).length;
    console.log('gasLength=', gasLength);
    let bottleShowData = gasLength === 2 ? gas2 : gas4;

    let props = {};
    if (type === 'modal') {
      props = {
        defaultScale: 1.3,
      };
    }
    return (
      <MapInteractionCSS style={{ position: 'relative' }} {...props}>
        <img src="/qualityControl/lct2.jpg" />
        <div className={styles.gasMask}></div>
        <div className={styles.gasWrapper} style={bottleShowData.wrapperPosition}>
          <div className={styles.title}>
            <p>标气单元</p>
          </div>
          <div className={styles.gasContent}>
            {/* 气瓶 */}
            {bottleShowData.gasListStyles.map((item, index) => {
              let isShowPurge = false;
              if (item.purgeFlag) {
                isShowPurge = true;
              }
              return (
                <div className={styles.gasInfoBox}>
                  <ul>
                    <li>
                      气瓶浓度：{gasData[index].Value}
                      {gasData[index].Unit}
                    </li>
                    <li>
                      <span>过期时间：</span>
                      <span className={styles.time} title={gasData[index].LoseDate}>
                        {gasData[index].LoseDate
                          ? moment(gasData[index].LoseDate).format('YYYY-MM-DD')
                          : ''}
                      </span>
                    </li>
                    <li>
                      <span>
                        余量：
                        {gasData[index].Allowance != undefined
                          ? `${gasData[index].Allowance} L`
                          : undefined}
                      </span>
                    </li>
                  </ul>
                  <div className={styles.gasImgBox}>
                    <p
                      style={{ top: 18, lineHeight: '16px' }}
                      dangerouslySetInnerHTML={{ __html: gasData[index].bottleName }}
                    ></p>
                  </div>
                  <div className={styles.lineAndPressure} style={{ top: item.lineTop }}>
                    {valveStatus[item.flag] ? (
                      // {true ?
                      <>
                        <img
                          className={styles.line}
                          style={{ position: 'absolute', zIndex: 1 }}
                          src={`/qualityControl/JC/${item.lineImgName}-open.png`}
                          alt=""
                        />
                      </>
                    ) : (
                      <img
                        className={styles.line}
                        src={`/qualityControl/JC/${item.lineImgName}.png`}
                        alt=""
                      />
                    )}
                    {/* 压力 */}
                    <div
                      className={styles.pressureContent}
                      style={{ top: item.pressureContentTop }}
                    >
                      <div className={styles.pressureValue}>
                        <p>压力</p>
                        <span>
                          {pressure[index].value != undefined
                            ? `${pressure[index].value}MPa`
                            : undefined}
                        </span>
                        {/* <span>{`11223MPa`}</span> */}
                      </div>
                      {pressure[index].exception === '1' ? (
                        <Tooltip placement="bottom" title="压力异常">
                          <img
                            className={styles.exceptionPressure}
                            src={`/qualityControl/p${index + 1}Exception.png`}
                          />
                        </Tooltip>
                      ) : (
                        <img
                          className={styles.exceptionPressure}
                          src={`/qualityControl/p${index + 1}.png`}
                        />
                      )
                      // true ? <Tooltip placement="bottom" title="压力异常"><img className={styles.exceptionPressure} src="/qualityControl/p1Exception.png" /></Tooltip> : null
                      }
                    </div>
                  </div>
                  {isShowPurge && (
                    <div div className={styles.lineAndPressure} style={{ top: item.purgeLineTop }}>
                      {valveStatus['purge'] ? (
                        // {true ?
                        <img
                          className={styles.line}
                          src={`/qualityControl/JC/${gasLength}-purge-open.png`}
                          alt=""
                        />
                      ) : (
                        <img
                          className={styles.line}
                          src={`/qualityControl/JC/${gasLength}-purge.png`}
                          alt=""
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {console.log('CEMSOpen=', CEMSOpen)}
        {/* CEMS连接状态 */}
        {// 系统
        GasPathMode == 1 &&
        CEMSOpen == 1 &&
        (this.props.QCStatus == 1 || this.props.QCStatus == 2) ? (
          <>
            {/* true ? <> */}
            <img className={styles.CEMSLine} src="/qualityControl/CEMSLine.jpg" alt="" />
            <img className={styles.CEMSvalve} src="/qualityControl/valveOpen.jpg" alt="" />
          </>
        ) : null}
        {// 全程
        GasPathMode == 0 &&
        CEMSOpen == 0 &&
        (this.props.QCStatus == 1 || this.props.QCStatus == 2) ? (
          <>
            {/* true ? <> */}
            <img className={styles.CEMSLine2} src="/qualityControl/CEMSLine2.png" alt="" />
            <img className={styles.CEMSvalve2} src="/qualityControl/valveOpen2.jpg" alt="" />
          </>
        ) : null}

        {/* 质控单元 */}
        <div className={styles.qualityControl}>
          {// 开门状态
          door == '1' ? (
            <img className={styles.doorOpen} src="/qualityControl/doorOpen.png" alt="" />
          ) : null}
          <div className={styles.title}>质控单元</div>
          {/* 质控仪状态 */}
          <div className={styles.status}>
            {this.props.QCStatus !== undefined && (
              <Badge color={QCStatusList[this.props.QCStatus].color} />
            )}
          </div>
          {/* 标气浓度 */}
          <div className={styles.gasConcentration}>
            <p>配比标气浓度</p>
            <span>
              {standardValue} {standardValueUtin}
            </span>
          </div>

          {/* 标气浓度 */}
          <div className={styles.sum}>
            <p>配气流量</p>
          </div>

          <span className={styles.flowNum}>
            {totalFlow ? (
              <Tooltip title={`${totalFlow}ml/min`}>{`${totalFlow}ml/min`}</Tooltip>
            ) : (
              undefined
            )}
          </span>
        </div>

        <div className={styles.CEMSInfoBox}>
          <div className={styles.CEMSName}>分析单元</div>
          {/* <div className={styles.CEMSStatus}>
          工作状态：{
            this.props.QCStatus !== undefined && QCStatusList[this.props.QCStatus].text
          }
        </div> */}
          <div className={styles.pollutantListInfo}>
            <p className={styles.title}>气态分析仪</p>
            {pollutantValueListInfo.map(item => {
              // if (item.PollutantCode === "a21026") {
              return (
                <p>
                  {pollutantCodeList[item.PollutantCode].name}：{item.MonitorValue}
                  {pollutantCodeList[item.PollutantCode].unit}
                </p>
              );
              // }
            })}
          </div>
        </div>
      </MapInteractionCSS>
    );
  };

  // 折线图配置项
  lineOption = () => {
    const { valueList, timeList, standardValueList, standardValueUtin } = this.props;
    return {
      color: ['#56f485', '#c23531'],
      legend: {
        data: ['测量浓度', '配比标气浓度'],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
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
        formatter: params => {
          if (params) {
            let params0 = '',
              params1 = '';
            if (params[0]) {
              params0 = `
              ${params[0].name}
              <br />
              ${params[0].marker}
              ${params[0].seriesName}：${params[0].value}${
                standardValueUtin ? standardValueUtin : ''
              }
              <br />`;
            }
            if (params[1]) {
              params1 = `${params[1].marker}
${params[1].seriesName} ：${params[1].value} ${standardValueUtin ? standardValueUtin : ''}`;
            }
            return params0 + params1;
          }
        },
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          dataView: { readOnly: false },
          // magicType: {type: ['line', 'bar']},
          // restore: {},
          saveAsImage: {},
        },
      },
      grid: {
        left: '30px',
        right: '30px',
        bottom: '10px',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeList,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: standardValueUtin ? standardValueUtin : '',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
          handleIcon:
            'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
        },
      ],
      series: [
        {
          name: '测量浓度',
          data: valueList,
          type: 'line',
        },
        {
          name: '配比标气浓度',
          data: standardValueList,
          smooth: true,
          type: 'line',
        },
      ],
    };
  };

  onCloseModal = () => {
    this.props.dispatch({
      type: 'qcManual/updateState',
      payload: {
        qcImageVisible: false,
      },
    });
  };

  // 获取质控结果
  getQCAResult = () => {
    if (this.props.QCLogsResult.Data && this.props.QCLogsResult.Data.Result !== undefined) {
      console.log('this.props.QCLogsResult.Data.Result=', this.props.QCLogsResult.Data.Result);
      switch (this.props.QCLogsResult.Data.Result + '') {
        case '0':
          return <CustomIcon className={styles.QCResult} type="icon-hege" />;
        case '1':
          return <CustomIcon className={styles.QCResult} type="icon-buhege" />;
        case '2':
          return <CustomIcon className={styles.QCResult} type="icon-wuxiao" />;
        default:
          return (
            <Spin
              style={{ position: 'absolute', right: 20 }}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          );
      }
    }
  };

  render() {
    const {
      qcImageVisible,
      pointName,
      pollutantCode,
      currentPollutantCode,
      QCATypeName,
    } = this.props;
    console.log('pollutantCode=', pollutantCode);
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
