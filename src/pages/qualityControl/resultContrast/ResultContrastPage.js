/*
 * @Author: Jiaqi
 * @Date: 2019-11-15 15:15:09
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-19 17:08:15
 * @desc: 质控比对页面
 */
import React, { Component } from 'react';
import { Card, Alert, Row, Col, Select, Button, message, Input, Form, Radio, Popover, Icon,Spin } from 'antd'
import { connect } from 'dva'
import RangePicker_ from '@/components/RangePicker'
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable'
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import styles from './ResultContrastPage.less';
import stylesFor from '../remoteControl/index.less'
import CustomIcon from '@/components/CustomIcon'

const Option = Select.Option;
const content = (
  <div>
    <img style={{ width: 350, marginRight: 6, marginBottom: 4 }} src="/qcaimg.png" />
    <img style={{ width: 350, marginRight: 6, marginBottom: 4 }} src="/qcaimg1.png" />
    <img style={{ width: 550, marginRight: 6, marginBottom: 4 }} src="/qcaimg2.png" />
  </div>
);
const columns = [
  {
    title: '时间',
    dataIndex: 'Time',
    key: 'Time',
  },
  {
    title: '测量浓度',
    dataIndex: 'Value',
    key: 'Value',
  },
  {
    title: '配比标气浓度',
    dataIndex: 'StandValue',
    key: 'StandValue',
  },
];
@Form.create()

@connect(({ loading, qualityControl }) => ({
  // standardGasList: qualityControl.standardGasList,
  resultContrastData: qualityControl.resultContrastData,
  qcaReportList: qualityControl.qcaReportList,
  qcaLoading: loading.effects['qualityControl/GetQCAReport'],
  // resultContrastTimeList: qualityControl.resultContrastTimeList,
  standardGasLoading: loading.effects["qualityControl/getStandardGas"],
  QCAResultCheckByDGIMNLoading: loading.effects["qualityControl/QCAResultCheckByDGIMN"],
  QCAResultCheckSelectListLoading: loading.effects["qualityControl/QCAResultCheckSelectList"],
  stabilizationTime: qualityControl.stabilizationTime,
  chartMax: qualityControl.chartMax,
}))
class ResultContrastPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateValue: props.dateValue || [],
      DGIMN: props.DGIMN,
      QCAMN: props.QCAMN,
      PollutantCode: props.PollutantCode,
      showType: "chart"
    };
    this._SELF_ = {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
    }
  }

  componentDidMount() {
    // // 获取污染物
    // this.props.dispatch({ type: "qualityControl/getStandardGas", payload: { QCAMN: "" } });
    // // 获取时间列表
    // this.props.dispatch({ type: "qualityControl/QCAResultCheckSelectList", payload: { DGIMN: this.state.DGIMN } });
    this.getPageData();
    // 获取稳定时间
    // this.props.dispatch({
    //   type: "qualityControl/getStabilizationTime",
    //   payload: {
    //     DGIMN: this.state.DGIMN,
    //     QCAMN: this.props.QCAMN,
    //     StandardGasCode: this.state.PollutantCode,
    //   }
    // })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: "qualityControl/updateState",
      payload: {
        // standardGasList: [],
        resultContrastTimeList: [],
        resultContrastData: {
          valueList: [],
          timeList: [],
          tableData: [],
          standValue: 0,
          errorStr: undefined,
        },
      }
    })
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.DGIMN !== nextProps.DGIMN) {
  //     // // 获取时间列表
  //     // this.props.dispatch({ type: "qualityControl/QCAResultCheckSelectList", payload: { DGIMN: nextProps.DGIMN } });
  //     this.props.dispatch({
  //       type: "qualityControl/updateState",
  //       payload: {
  //         resultContrastData: {
  //           ...nextProps.resultContrastData,
  //           errorStr: undefined,
  //         }
  //       }
  //     })
  //   }
  //   if (!this.props.flag) {
  //     if ((this.props.DGIMN !== nextProps.DGIMN) || (this.props.PollutantCode !== nextProps.PollutantCode) || (this.props.dateValue !== nextProps.dateValue)) {
  //       this.setState({
  //         DGIMN: nextProps.DGIMN,
  //         PollutantCode: nextProps.PollutantCode ? nextProps.PollutantCode : this.state.PollutantCode,
  //         // dateValue: (nextProps.dateValue && nextProps.dateValue.length) ? nextProps.dateValue : this.state.dateValue
  //         dateValue: nextProps.dateValue
  //       }, () => {
  //         this.getPageData();
  //       })
  //     }
  //   }
  //   if (this.props.flag) {
  //     if ((this.props.DGIMN !== nextProps.DGIMN) || (this.props.standardGasList !== nextProps.standardGasList) || (this.props.resultContrastTimeList !== nextProps.resultContrastTimeList)) {
  //       this.setState({
  //         DGIMN: nextProps.DGIMN,
  //         PollutantCode: nextProps.standardGasList.length && nextProps.standardGasList[0].PollutantCode,
  //         // dateValue: (nextProps.dateValue && nextProps.dateValue.length) ? nextProps.dateValue : this.state.dateValue
  //         dateValue: nextProps.resultContrastTimeList.length ? nextProps.resultContrastTimeList[0].key : undefined
  //       }, () => {
  //         this.getPageData();
  //       })
  //     }

  //   }
  // }

  // 获取页面数据
  getPageData = (isSearch) => {
    const { dateValue, DGIMN, PollutantCode } = this.state;
    if (isSearch) {
      if (!dateValue) {
        message.error("请选择时间");
        return;
      }
      if (!PollutantCode) {
        message.error("请选择污染物");
        return;
      }
    }
    if (dateValue && DGIMN && PollutantCode) {
      this.props.dispatch({
        type: "qualityControl/QCAResultCheckByDGIMN",
        payload: {
          DGIMN: DGIMN,
          QCAMN: this.props.QCAMN,
          PollutantCode: PollutantCode,
          QCTime: this.props.QCTime,
          // BeginTime: moment(dateValue[0]).format("YYYY-MM-DD HH:mm:ss"),
          // EndTime: moment(dateValue[1]).format("YYYY-MM-DD HH:mm:ss"),
          ID: dateValue
        },
        otherParams: {
          isSearch
        }
      })
      // this.setState({
      //   showType: "data"
      // })
      this.props.dispatch({
        type: "qualityControl/GetQCAReport",
        payload: {
          DGIMN: DGIMN,
          QCAMN: this.props.QCAMN,
          QCTime: this.props.QCTime,
          StandardGasCode: PollutantCode,
        }
      })
    }
  }

  // 顶部查询条件
  searchWhere = () => {
    const { StandardPollutantName, QCTime, StopTime, QCType, QCExecuType, pointName, entName } = this.props;
    const { formItemLayout } = this._SELF_;
    //质控类型
    let getQCTypes = [
      {
        id: 1,
        description: "配气开始质控"
      },
      {
        id: 2,
        description: "配气结束质控"
      },
      {
        id: 3,
        description: "质控仪重启"
      },
      {
        id: 4,
        description: "质控仪吹扫"
      },
      {
        id: 5,
        description: "质控仪开锁"
      },
    ];
    //质控执行类型
    let getQCExecuTypes = [
      {
        id: 1,
        description: "手动"
      },
      {
        id: 2,
        description: "定时"
      },
      {
        id: 3,
        description: "周期"
      },
    ];

    // const type = getQCExecuTypes.find(n => n.id === QCExecuType).description;
    const result = this.props.resultContrastData.errorStr;
    const color = result === "不合格" ? "#f5232d" : "#51c41b";
    return (
      // <Row>
      //   <RangePicker_ style={{ width: 340 }} showTime dateValue={dateValue} placeholder="请选择时间" onChange={(date, dateString) => {
      //     this.setState({
      //       dateValue: date
      //     })
      //   }} />
      //   <Select placeholder="请选择时间" value={dateValue} style={{ width: 340, marginRight: 10 }} onChange={(value) => {
      //     // this.setState({
      //     //   PollutantCode: value
      //     // })
      //     this.setState({
      //       dateValue: value
      //     })
      //   }}>
      //     {
      //       resultContrastTimeList.map(item => {
      //         return <Option key={item.key} value={item.key}>{item.value}</Option>
      //       })
      //     }
      //   </Select>
      //   <Select placeholder="请选择污染物" value={PollutantCode} style={{ width: 200 }} onChange={(value) => {
      //     this.setState({
      //       PollutantCode: value
      //     })
      //   }}>
      //     {
      //       standardGasList.map(item => {
      //         return <Option key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
      //       })
      //     }
      //   </Select>
      //   <Button style={{ margin: 5 }} type="primary" onClick={() => {
      //     this.getPageData(true)
      //   }}>查询</Button>
      // </Row>
      // -------
      // <Form>
      //   <Row>
      //     <Col span={12}>
      //       <Form.Item {...formItemLayout} label="时间">
      //         <Input style={{ width: 300 }} defaultValue={QCTime + " - " + StopTime} readOnly={true} />
      //       </Form.Item>
      //     </Col>
      //     <Col span={12}>
      //       <Form.Item {...formItemLayout} label="污染物名称">
      //         <Input defaultValue={StandardPollutantName} readOnly={true} />
      //       </Form.Item>
      //     </Col>
      //   </Row>
      //   <Row>
      //     <Col span={12}>
      //       <Form.Item {...formItemLayout} label="质控类型">
      //         <Input defaultValue={getQCTypes.find(n => n.id === QCType).description} readOnly={true} />
      //       </Form.Item >
      //     </Col>
      //     <Col span={12}>
      //       <Form.Item {...formItemLayout} label="质控执行类型">
      //         <Input defaultValue={getQCExecuTypes.find(n => n.id === QCExecuType).description} readOnly={true} />
      //       </Form.Item>
      //     </Col>
      //   </Row>
      // </Form>
      //   <Row>
      //     <Col style={{ color: "#524e4e", fontSize: 14 }} span={22}>
      // {entName} - {pointName}排口，在{QCTime} - {StopTime}时间段，进行{StandardPollutantName}{type}质控，正负误差为{this.props.resultContrastData.qcaResultOffset}，质控结果为<span style={{ color: color }}>{result}</span>
      //     </Col>
      //   </Row>
      <></>
    )
  }

  renderData = (record) => {
    const rtnVal = [];
    var count = record.length;
    if (record !== null && record.length > 0) {
      record.map((item, index) => {
        if (index == 0) {
          rtnVal.push(
            <tr>
              <td style={{ width: '12%', minWidth: 100, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                {index + 1}
              </td>
              <td rowSpan={count} style={{ width: '16%', minWidth: 150, textAlign: 'center', fontSize: '14px' }}>
                {item.StandValue}
              </td>
              <td style={{ width: '13%', minWidth: 100, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                {item.ShowValue}
              </td>
              <td rowSpan={count} style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                {item.AvgValue}
              </td>
              <td rowSpan={count} style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                {item.Error}
              </td>
              <td style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>

              </td>
            </tr>
          );
        } else {
          rtnVal.push(
            <tr>
              <td style={{ width: '12%', minWidth: 100, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                {index + 1}
              </td>
              <td style={{ width: '13%', minWidth: 100, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                {item.ShowValue}
              </td>
              {/* <td  style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
              </td>
              <td  style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
              </td> */}
              <td style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>

              </td>
            </tr>
          );
        }

      });
    }

    return rtnVal;
  }

  onAlertClose = () => {
    this.props.dispatch({
      type: "qualityControl/updateState",
      payload: {
        resultContrastData: {
          ...this.props.resultContrastData,
          errorStr: undefined
        }
      }
    })
  }

  // 折线图配置项
  lineOption = () => {
    const { resultContrastData, stabilizationTime, chartMax } = this.props;
    let stabilizationTimeSeries = stabilizationTime ? {
      name: '稳定时间',
      type: 'bar',
      markLine: {
        name: 'aa',
        data: [[
          { coord: [stabilizationTime, 0] },
          { coord: [stabilizationTime, chartMax] }
        ]],
        label: {
          normal: {
            formatter: '稳定时间' // 基线名称
          }
        },
      }
    } : { type: 'bar', };
    let option = {
      color: ["#56f485", "#c23531"],
      legend: {
        data: ["测量浓度", "配比标气浓度"],
      },
      grid: {
        left: '10px',
        right: '10px',
        bottom: '10px',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          }
        }
      },
      xAxis: {
        type: 'category',
        data: resultContrastData.timeList,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
      },
      yAxis: [
        {
          type: 'value',
          // name: '',
          // min: 0,
          max: chartMax ? Math.ceil(chartMax) : 10,
          // interval: 50,
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '',
        }
      ],
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
        data: resultContrastData.valueList,
        smooth: true,
        type: 'line',
      },
      {
        name: '配比标气浓度',
        data: resultContrastData.standValue,
        smooth: true,
        type: 'line',

      },
      { ...stabilizationTimeSeries }
      ]
    };

    return option;
  }

  render() {
    const { resultContrastData, resultContrastTimeList, standardGasLoading, QCAResultCheckByDGIMNLoading, QCAResultCheckSelectListLoading,qcaLoading } = this.props;
    const { dateValue, showType } = this.state;
    if (standardGasLoading || QCAResultCheckByDGIMNLoading || QCAResultCheckSelectListLoading) {
      return <PageLoading />
    }
    const echartEle = document.querySelector(".echarts-for-react");
    const echartsHeight = echartEle ? echartEle.offsetHeight - 96 + "px" : 200 + "px"
    return (
      <>
        {/* <div style={{ marginBottom: 10 }}>
          {
            (resultContrastData.errorStr === "合格" && dateValue) ? (
              <Alert
                type="success"
                message={
                  <div>
                    本次结果比对<span style={{ color: "#51c41b" }}>合格!</span>
                  </div>
                }
                onClose={this.onAlertClose}
                banner
              // closable
              />
            ) : ((resultContrastData.errorStr === "不合格" && dateValue) ?
              <Alert
                type="error"
                message={
                  <div>
                    本次结果比对<span style={{ color: "#f5232d" }}>不合格!</span>
                  </div>
                }
                onClose={this.onAlertClose}
                banner
              // closable
              /> : null
              )
          }
        </div> */}

        <Card
          bodyStyle={{ maxHeight: 520, overflowY: "auto", padding: "10px 14px 10px" }}
          footer={null}
        >
          {

            (resultContrastData.errorStr === "合格" && dateValue) ? (
              <CustomIcon className={styles.QCResult} type="icon-hege" />
            ) : ((resultContrastData.errorStr === "不合格" && dateValue) ?
              <CustomIcon className={styles.QCResult} type="icon-buhege" /> : <CustomIcon className={styles.QCResult} type="icon-wuxiao" />
              )
          }



          <Radio.Group style={{
            position: "absolute",
            right: 10,
            zIndex: 1,
            float: "right",
            height: 8,
            position: "relative",
            marginTop: -2
          }} defaultValue="chart" buttonStyle="solid" onChange={(e) => {
            this.setState({
              showType: e.target.value
            })
          }}>
            <Radio.Button value="chart">图表</Radio.Button>
            <Radio.Button value="data">报表</Radio.Button>
          </Radio.Group>
          {
            showType === "chart" ? <ReactEcharts
              // theme="line"
              // option={() => { this.lightOption() }}
              option={this.lineOption()}
              lazyUpdate
              notMerge
              id="rightLine"
              style={{ width: '100%', height: 'calc(100vh - 600px)', minHeight: '300px' }}
            /> :(qcaLoading ? <Spin
              style={{
                width: '100%',
                height: 'calc(100vh/2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              size="large"
            /> : <table
              className={stylesFor.FormTable} style={{ width: '100%', height: 'calc(100vh - 600px)', minHeight: '300px', marginTop: 38 }}
            > 
                <tbody >
                  <tr>
                    <td style={{ width: '12%', minWidth: 100, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                      序号
                  </td>
                    <td style={{ width: '16%', minWidth: 150, textAlign: 'center', fontSize: '14px' }}>
                      标准气体或校准器件参考值
                  </td>
                    <td style={{ width: '13%', minWidth: 100, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                      CEMS显示值
                  </td>
                    <td style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                      CEMS显示值的平均值
                  </td>
                    <td style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                      示值误差（%）
                    <Popover content={content} title="计算规则" placement="bottom">
                        <Icon type="exclamation-circle" />
                      </Popover>

                    </td>
                    <td style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                      备注
                  </td>
                  </tr>
                  {
                    this.renderData(this.props.qcaReportList !== null ? this.props.qcaReportList : null)
                  }
                  {/* <tr> */}
                  {/* <td colSpan="3" style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                    测定值
                  </td>
                  <td rowSpan="2" style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                    平均值
                  </td> */}
                  {/* </tr> */}
                  {/* <tr> */}
                  {/* <td style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                    T1
                  </td>
                  <td style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                    T2
                  </td>
                  <td style={{ width: '13%', minWidth: 100, textAlign: 'center', fontSize: '14px' }}>
                    T=T1+T2
                  </td> */}
                  {/* </tr> */}
                  {}
                </tbody>
              </table>)
            // scroll={{ y: echartsHeight }}
          }
        </Card>
      </>
    );
  }
}

export default ResultContrastPage;
