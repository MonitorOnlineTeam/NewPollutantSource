/*
 * @Author: Jiaqi 
 * @Date: 2019-11-15 15:15:09 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-15 15:16:16
 * @desc: 质控比对页面
 */
import React, { Component } from 'react';
import { Card, Alert, Row, Col, Select, Button, message } from 'antd'
import { connect } from 'dva'
import RangePicker_ from '@/components/RangePicker'
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable'
import moment from 'moment';

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

@connect(({ loading, qualityControl }) => ({
  standardGasList: qualityControl.standardGasList,
  resultContrastData: qualityControl.resultContrastData,
}))
class ResultContrastPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateValue: props.dateValue || [],
      DGIMN: props.DGIMN,
      PollutantCode: props.PollutantCode,
    };
  }

  componentDidMount() {
    // 获取污染物
    this.props.dispatch({ type: "qualityControl/getStandardGas" });
    this.getPageData();
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.DGIMN !== nextProps.DGIMN) || (this.props.PollutantCode !== nextProps.PollutantCode) || (this.props.dateValue !== nextProps.dateValue)) {
      this.setState({
        DGIMN: nextProps.DGIMN,
        PollutantCode: nextProps.PollutantCode ? nextProps.PollutantCode : this.state.PollutantCode,
        dateValue: (nextProps.dateValue && nextProps.dateValue.length) ? nextProps.dateValue : this.state.dateValue
      }, () => {
        this.getPageData();
      })
    }
  }

  // 获取页面数据
  getPageData = (isSearch) => {
    const { dateValue, DGIMN, PollutantCode } = this.state;
    if (isSearch) {
      if (!dateValue.length) {
        message.error("请选择时间");
        return;
      }
      if (!PollutantCode) {
        message.error("请选择污染物");
        return;
      }
    }
    if (dateValue.length && DGIMN && PollutantCode) {
      this.props.dispatch({
        type: "qualityControl/QCAResultCheckByDGIMN",
        payload: {
          DGIMN: DGIMN,
          PollutantCode: PollutantCode,
          BeginTime: moment(dateValue[0]).format("YYYY-MM-DD HH:mm:ss"),
          EndTime: moment(dateValue[1]).format("YYYY-MM-DD HH:mm:ss"),
        },
        otherParams: {
          isSearch
        }
      })
    }
  }

  // 顶部查询条件
  searchWhere = () => {
    const { dateValue, PollutantCode } = this.state;
    const { standardGasList } = this.props;
    return (
      <Row>
        <RangePicker_ style={{ width: 340 }} showTime dateValue={dateValue} placeholder="请选择时间" onChange={(date, dateString) => {
          this.setState({
            dateValue: date
          })
        }} />
        <Select placeholder="请选择污染物" defaultValue={PollutantCode} style={{ width: 200 }} onChange={(value) => {
          this.setState({
            PollutantCode: value
          })
        }}>
          {
            standardGasList.map(item => {
              return <Option key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
            })
          }
        </Select>
        <Button style={{ margin: 5 }} type="primary" onClick={() => {
          this.getPageData(true)
        }}>开始比对</Button>
      </Row>
    )
  }

  // 折线图配置项
  lineOption = () => {
    const { resultContrastData } = this.props;
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
        data: resultContrastData.timeList
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '浓度',
        data: resultContrastData.valueList,
        type: 'line',
        label: {
          normal: {
            show: true,
          }
        },
        markLine: {
          silent: true,
          lineStyle: {
            normal: {
              color: '#56f485' // 基线颜色
            }
          },
          data: [{
            yAxis: resultContrastData.standValue
          }],
          label: {
            normal: {
              formatter: '标准值' // 基线名称
            }
          },
        },

      }]
    };
  }

  render() {
    const { resultContrastData } = this.props;
    return (
      <>
        <div style={{ marginBottom: 10 }}>
          {
            resultContrastData.errorStr === "合格" ? (
              <Alert
                type="success"
                message="本次结果比对合格!"
                banner
                closable
              />
            ) : (resultContrastData.errorStr === "不合格" ?
              <Alert
                type="error"
                message="本次结果比对不合格!"
                banner
                closable
              /> : null
              )
          }
        </div>
        <Card title={this.searchWhere()}>
          <ReactEcharts
            theme="line"
            // option={() => { this.lightOption() }}
            option={this.lineOption()}
            lazyUpdate
            notMerge
            id="rightLine"
            style={{ width: '100%', height: 'calc(100vh - 600px)', minHeight: '200px' }}
          />
          <SdlTable dataSource={resultContrastData.tableData} columns={columns} scroll={{ y: 'calc(100vh - 900px)' }} />
        </Card>
      </>
    );
  }
}

export default ResultContrastPage;