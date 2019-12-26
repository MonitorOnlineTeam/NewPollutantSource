/*
 * @Author: Jiaqi
 * @Date: 2019-11-26 10:41:03
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-12-05 17:42:21
 */
import React, { Component } from 'react';
import { Card, Alert, Row, Col, Select, Button, message } from 'antd'
import { connect } from 'dva'
import RangePicker_ from '@/components/RangePicker'
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable'
import moment from 'moment';
import PageLoading from '@/components/PageLoading'

const Option = Select.Option;

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
  valueList: qualityControlModel.valueList,
  timeList: qualityControlModel.timeList,
  tableData: qualityControlModel.tableData,
  dataSource: qualityControlModel.dataSource,
  standardValueList: qualityControlModel.standardValueList,
  start: qualityControlModel.start,
  end: qualityControlModel.end
  // chartMax: qualityControlModel.chartMax,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PollutantCode: props.PollutantCode
    };
  }

  componentDidMount() {
    // 获取污染物
    this.props.dispatch({ type: "qualityControl/getStandardGas", payload: { QCAMN: "" } });
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
    this.props.dispatch({
      type: "qualityControlModel/updateRealtimeData",
      payload: {}
    })
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
    const maxVal = chartYMaxValue > chartYMaxValue2 ? chartYMaxValue : chartYMaxValue2;
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
      xAxis: {
        type: 'category',
        // type: 'time',
        boundaryGap: false,
        data: timeList,
        // axisPointer: {
        //   // type: "none",
        //   value: '2016-10-7',
        //   snap: true,
        //   // triggerTooltip: false,
        //   lineStyle: {
        //     color: '#004E52',
        //     opacity: 0.5,
        //     width: 2
        //   },
        //   label: {
        //     show: true,
        //     // formatter: function (params) {
        //     //   return echarts.format.formatTime('yyyy-MM-dd', params.value);
        //     // },
        //     backgroundColor: '#004E52'
        //   },
        //   handle: {
        //     show: true,
        //     color: 'transparent'
        //   }
        // },
      },
      // dataZoom: [{
      //   type: 'inside',
      //   start: start,
      //   end: end
      // }, {
      //   start: 0,
      //   end: 10,
      //   handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      //   handleSize: '80%',
      //   handleStyle: {
      //     color: '#fff',
      //     shadowBlur: 3,
      //     shadowColor: 'rgba(0, 0, 0, 0.6)',
      //     shadowOffsetX: 2,
      //     shadowOffsetY: 2
      //   }
      // }],
      yAxis: [
        {
          type: 'value',
          name: '',
          min: 0,
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

  render() {
    const { valueList, timeList, tableData, PollutantCode } = this.props;
    return (
      <Card title={this.searchWhere()}>
        <ReactEcharts
          theme="line"
          // option={() => { this.lightOption() }}
          option={this.lineOption()}
          lazyUpdate={true}
          notMerge
          id="rightLine"
          style={{ width: '100%', height: '60%', minHeight: '400px' }}
        />
        <SdlTable dataSource={tableData} columns={columns} scroll={{ y: 'calc(100vh - 900px)' }} />
      </Card>
    );
  }
}

export default index;
