/*
 * @Author: Jiaqi
 * @Date: 2019-11-26 10:41:03
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-17 17:09:08
 */
import React, { Component } from 'react';
import { Card, Alert, Row, Col, Select, Button, message, Radio, Spin, Icon } from 'antd'
import { connect } from 'dva'
import RangePicker_ from '@/components/RangePicker'
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable'
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import CustomIcon from '@/components/CustomIcon'
import styles from '../remoteControl/index.less'

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
  end: qualityControlModel.end,
  QCAResult: qualityControl.QCAResult,
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
        left: '10px',
        right: '10px',
        bottom: '10px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeList,
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
      case "0":
        return <Spin style={{ position: 'absolute', right: 20 }} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} />
      case "1":
        return <CustomIcon className={styles.QCResult} type="icon-hege" />
      case "2":
        return <CustomIcon className={styles.QCResult} type="icon-buhege" />
      case "3":
        return <CustomIcon className={styles.QCResult} type="icon-wuxiao" />
    }
  }

  render() {
    const { valueList, timeList, tableData, PollutantCode } = this.props;
    const { showType } = this.state;
    return (
      <Card title={this.searchWhere()} extra={
        <Radio.Group defaultValue="chart" buttonStyle="solid" onChange={(e) => {
          this.setState({
            showType: e.target.value
          })
        }}>
          <Radio.Button value="chart">图表</Radio.Button>
          <Radio.Button value="data">数据</Radio.Button>
        </Radio.Group>
      }>
        {this.getQCAResult()}
        {
          showType === "chart" ? <ReactEcharts
            theme="line"
            // option={() => { this.lightOption() }}
            option={this.lineOption()}
            lazyUpdate={true}
            notMerge
            id="rightLine"
            style={{ width: '100%', height: 'calc(100vh - 600px)', minHeight: '300px' }}
          /> : <SdlTable dataSource={tableData} columns={columns} />
          // scroll={{ y: '200px' }}
        }
      </Card>
    );
  }
}

export default index;
