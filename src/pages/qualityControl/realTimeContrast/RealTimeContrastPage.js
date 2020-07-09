/*
 * @Author: Jiaqi
 * @Date: 2019-11-26 10:41:03
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-23 14:34:03
 */
import React, { Component } from 'react';
import { Card, Alert, Row, Col, Select, Button, message, Radio, Spin, Icon, Popover } from 'antd'
import { connect } from 'dva'
import RangePicker_ from '@/components/RangePicker'
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable'
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import CustomIcon from '@/components/CustomIcon'
import styles from '../remoteControl/index.less'

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

@connect(({ loading, qualityControl, qualityControlModel }) => ({
  standardGasList: qualityControl.standardGasList,
  qcaReportList: qualityControl.qcaReportList,
  valueList: qualityControlModel.valueList,
  timeList: qualityControlModel.timeList,
  tableData: qualityControlModel.tableData,
  dataSource: qualityControlModel.dataSource,
  standardValueList: qualityControlModel.standardValueList,
  start: qualityControlModel.start,
  end: qualityControlModel.end,
  QCAResult: qualityControl.QCAResult,
  qcaLoading: loading.effects['qualityControl/GetQCAReport']
  // chartMax: qualityControlModel.chartMax,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PollutantCode: props.PollutantCode,
      showType: "chart"
    };
  }

  componentDidMount() {
    // 获取污染物
    !this.props.insert && this.props.dispatch({ type: "qualityControl/getStandardGas", payload: { QCAMN: "" } });
    this.props.dispatch({
      type: "qualityControlModel/updateState",
      payload: {
        currentPollutantCode: this.props.PollutantCode
      }
    })
  }

  componentWillUnmount() {
    // this.props.dispatch({
    //   type: "qualityControlModel/updateState",
    //   payload: {
    //     currentDGIMN: value[0].key,
    //     DGIMNList: []
    //   }
    // })
    // this.props.dispatch({
    //   type: "qualityControlModel/updateRealtimeData",
    //   payload: {}
    // })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.insert && this.props.standardGasList !== nextProps.standardGasList) {
      this.setState({
        PollutantCode: nextProps.standardGasList[0].PollutantCode
      })
    }
    // 获取稳定时间
    if (this.props.timeList !== nextProps.timeList) {
      let timeData = [...nextProps.timeList];
      if (timeData) {
        let n = moment(nextProps.startTime).add(nextProps.stabilizationTime, "minutes").valueOf()
        timeData.sort(function (a, b) {
          return Math.abs(moment(a).valueOf() - n) - Math.abs(moment(b).valueOf() - n);
        })[0];
      }
      this.setState({
        stabilizationTime: timeData[0]
      })
    }

    // 获取最大值
    if (this.props.valueList !== nextProps.valueList) {
      let chartYMaxValue = undefined;
      chartYMaxValue = _.max(nextProps.valueList) * 1 + 10;
      this.setState({
        chartYMaxValue
      })
    }

    if (this.props.standardValueList !== nextProps.standardValueList) {
      let chartYMaxValue2 = undefined;
      chartYMaxValue2 = _.max(nextProps.standardValueList) * 1 + 10;
      this.setState({
        chartYMaxValue2
      })
    }

    if (this.props.QCAResult !== nextProps.QCAResult && nextProps.QCAResult != "0") {
      // this.setState({
      //   showType: "data"
      // })
      this.props.dispatch({
        type: "qualityControl/GetQCAReport",
        payload: {
          QCTime: nextProps.startTime,
          StandardGasCode: this.state.PollutantCode,
        }
      })
    }
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

  searchWhere = () => {
    const { dateValue, PollutantCode, chartYMaxValue } = this.state;
    const { standardGasList, insert, } = this.props;
    if (insert) {
      return null;
    }
    return (
      <Row>
        <Select placeholder="请选择污染物" value={PollutantCode} style={{ width: 200 }} onChange={(value) => {
          this.setState({
            PollutantCode: value
          })
          this.props.dispatch({
            type: "qualityControlModel/updateState",
            payload: {
              currentPollutantCode: value
            }
          })
          this.props.dispatch({
            type: "qualityControlModel/updateRealtimeData",
            payload: {
              message: []
            }
          })
        }}>
          {
            standardGasList.map(item => {
              return <Option key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
            })
          }
        </Select>
      </Row>
    )
  }

  // 折线图配置项
  lineOption = () => {
    const { valueList, timeList, tableData, start, end, standardValueList } = this.props;
    const { stabilizationTime, chartYMaxValue, chartYMaxValue2 } = this.state;
    let maxVal = chartYMaxValue > chartYMaxValue2 ? chartYMaxValue : chartYMaxValue2;
    maxVal = Math.trunc(maxVal)
    // if(stabilizationTime)
    let markLineVal = stabilizationTime ? stabilizationTime + "" : undefined;
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
      yAxis: [
        {
          type: 'value',
          // name: '',
          // min: 0,
          max: maxVal,
          // interval: 50,
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '',
          // min: 0,
          // max: 25,
          // interval: 5,
          // axisLabel: {
          //     formatter: '{value} °C'
          // }
        }
      ],
      series: [{
        name: '测量浓度',
        data: valueList,
        type: 'line',
        // label: {
        //   normal: {
        //     show: true,
        //   }
        // },
      },
      {
        name: '配比标气浓度',
        data: standardValueList,
        smooth: true,
        type: 'line',
        // lineStyle: {
        //   color: "#56f485"
        // },
      },
      {
        name: '稳定时间',
        type: 'bar',
        markLine: {
          name: 'aa',
          data: [[
            { coord: [markLineVal, 0] },
            { coord: [markLineVal, maxVal] }
            // { coord: ["2019/12/6 19:26:24", 0] },
            // { coord: ["2019/12/6 19:26:24", 115] }
          ]],
          label: {
            normal: {
              formatter: '稳定时间' // 基线名称
            }
          },
        }
      }]
    };
  }

  // 获取质控结果
  getQCAResult = () => {
    switch (this.props.QCAResult) {
      // switch ('1') {
      case "0":
        return <Spin style={{ position: 'absolute', right: 20 }} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
      // return <CustomIcon className={styles.QCResult} type="icon-hege" />
      case "1":
        return <CustomIcon className={styles.QCResult} type="icon-hege" />
      case "2":
        return <CustomIcon className={styles.QCResult} type="icon-buhege" />
      case "3":
        return <CustomIcon className={styles.QCResult} type="icon-wuxiao" />
    }
  }

  render() {
    const { valueList, standardValueList, timeList, tableData, PollutantCode, QCAResult, qcaLoading } = this.props;
    const { showType } = this.state;
    return (
      <Card
        bodyStyle={{ maxHeight: 'calc(100vh - 400px)', overflowY: "auto", padding: "10px 14px 10px" }}
      >
        {/* <div style={{ position: "relative"}}> */}
        {this.getQCAResult()}
        {
          QCAResult != "0" ?
            // true ?
            <Radio.Group defaultValue="chart"
              style={{
                position: "absolute",
                right: 10,
                zIndex: 1,
                float: "right",
                height: 8,
                position: "relative",
                marginTop: -2
              }}
              buttonStyle="solid" onChange={(e) => {
                this.setState({
                  showType: e.target.value
                })


              }}>
              <Radio.Button value="chart">图表</Radio.Button>
              <Radio.Button value="data">报表</Radio.Button>
            </Radio.Group>
            : <></>

        }
        {
          showType === "chart" ?
            <>
              <div className={styles.legendNumBox}>
                <span>
                  <span style={{ color: "#56f485", paddingLeft: 10 }}>{valueList[valueList.length - 1]}</span>
                  <span style={{ color: "#c23531" }}>{standardValueList[standardValueList.length - 1]}</span>
                  {/* <span style={{ color: "#56f485", paddingLeft: 10 }}>123</span>
                  <span style={{ color: "#c23531" }}>33.22</span> */}
                </span>
              </div>
              <ReactEcharts
                theme="line"
                // option={() => { this.lightOption() }}
                option={this.lineOption()}
                lazyUpdate={true}
                notMerge
                id="rightLine"
                style={{ width: '100%', height: 'calc(100vh - 430px)', minHeight: '300px' }}
              />
            </>
            : (qcaLoading ? <Spin
              style={{
                width: '100%',
                height: 'calc(100vh/2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              size="large"
            /> : <table
              className={styles.FormTable} style={{ width: '100%', height: 'calc(100vh - 400px)', minHeight: '300px', marginTop: 38 }}
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
              </table>
            )
          // scroll={{ y: '200px' }}
        }
        {/* </div> */}
      </Card>
    );
  }
}

export default index;
