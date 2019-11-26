/*
 * @Author: Jiaqi 
 * @Date: 2019-11-26 10:41:03 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-26 17:31:15
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
    title: '浓度',
    dataIndex: 'Value',
    key: 'Value',
  },
  {
    title: '标准值',
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
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // 获取污染物
    this.props.dispatch({ type: "qualityControl/getStandardGas", payload: { QCAMN: "" } });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.standardGasList !== nextProps.standardGasList) {
      this.setState({
        PollutantCode: nextProps.standardGasList[0].PollutantCode
      })
    }
  }

  searchWhere = () => {
    const { dateValue, PollutantCode } = this.state;
    const { standardGasList } = this.props;
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
    const { valueList, timeList, tableData } = this.props;
    return {
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
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '浓度',
        data: valueList,
        type: 'line',
        label: {
          normal: {
            show: true,
          }
        },
        // markLine: {
        //   silent: true,
        //   lineStyle: {
        //     normal: {
        //       color: '#56f485' // 基线颜色
        //     }
        //   },
        //   data: [{
        //     yAxis: resultContrastData.standValue
        //   }],
        //   label: {
        //     normal: {
        //       formatter: '标准值' // 基线名称
        //     }
        //   },
        // },

      }]
    };
  }

  render() {
    const { valueList, timeList, tableData } = this.props;
    return (
      <Card title={this.searchWhere()} className="contentContainer">
        <ReactEcharts
          theme="line"
          // option={() => { this.lightOption() }}
          option={this.lineOption()}
          lazyUpdate={true}
          notMerge
          id="rightLine"
          style={{ width: '100%', height: 'calc(100vh - 600px)', minHeight: '200px' }}
        />
        <SdlTable dataSource={tableData} columns={columns} scroll={{ y: 'calc(100vh - 900px)' }} />
      </Card>
    );
  }
}

export default index;