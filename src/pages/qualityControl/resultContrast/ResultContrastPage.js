/*
 * @Author: Jiaqi
 * @Date: 2019-11-15 15:15:09
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-27 16:16:20
 * @desc: 质控比对页面
 */
import React, { Component } from 'react';
import { Card, Alert, Row, Col, Select, Button, message, Input, Form } from 'antd'
import { connect } from 'dva'
import RangePicker_ from '@/components/RangePicker'
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable'
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import styles from './ResultContrastPage.less';
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
    title: '配比标气浓度',
    dataIndex: 'StandValue',
    key: 'StandValue',
  },
];
@Form.create()

@connect(({ loading, qualityControl }) => ({
  // standardGasList: qualityControl.standardGasList,
  resultContrastData: qualityControl.resultContrastData,
  // resultContrastTimeList: qualityControl.resultContrastTimeList,
  standardGasLoading: loading.effects["qualityControl/getStandardGas"],
  QCAResultCheckByDGIMNLoading: loading.effects["qualityControl/QCAResultCheckByDGIMN"],
  QCAResultCheckSelectListLoading: loading.effects["qualityControl/QCAResultCheckSelectList"],
}))
class ResultContrastPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateValue: props.dateValue || [],
      DGIMN: props.DGIMN,
      PollutantCode: props.PollutantCode,
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
          PollutantCode: PollutantCode,
          // BeginTime: moment(dateValue[0]).format("YYYY-MM-DD HH:mm:ss"),
          // EndTime: moment(dateValue[1]).format("YYYY-MM-DD HH:mm:ss"),
          ID: dateValue
        },
        otherParams: {
          isSearch
        }
      })
    }
  }

  // 顶部查询条件
  searchWhere = () => {
    const { StandardPollutantName, QCTime, StopTime, QCType, QCExecuType } = this.props;
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
      <Form>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="时间">
              <Input style={{ width: 300 }} defaultValue={QCTime + " - " + StopTime} readOnly={true} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="污染物名称">
              <Input defaultValue={StandardPollutantName} readOnly={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="质控类型">
              <Input defaultValue={getQCTypes.find(n => n.id === QCType).description} readOnly={true} />
            </Form.Item >
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label="质控执行类型">
              <Input defaultValue={getQCExecuTypes.find(n => n.id === QCExecuType).description} readOnly={true} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
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
    const { resultContrastData } = this.props;
    return {
      color: ["#c23531", "#56f485"],
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
        data: resultContrastData.timeList,
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
        name: '测量浓度',
        data: resultContrastData.valueList,
        smooth: true,
        type: 'line',
        label: {
          normal: {
            show: true,
          }
        },
      },
      {
        name: '配比标气浓度',
        data: resultContrastData.standValue,
        smooth: true,
        type: 'line',
        lineStyle: {
          color: "#56f485"
        },
        label: {
          normal: {
            show: true,
          }
        },
      }]
    };
  }

  render() {
    const { resultContrastData, resultContrastTimeList, standardGasLoading, QCAResultCheckByDGIMNLoading, QCAResultCheckSelectListLoading } = this.props;
    const { dateValue } = this.state;
    if (standardGasLoading || QCAResultCheckByDGIMNLoading || QCAResultCheckSelectListLoading) {
      return <PageLoading />
    }
    return (
      <>
        <div style={{ marginBottom: 10 }}>
          {
            (resultContrastData.errorStr === "合格" && dateValue) ? (
              <Alert
                type="success"
                message="本次结果比对合格!"
                onClose={this.onAlertClose}
                banner
                closable
              />
            ) : ((resultContrastData.errorStr === "不合格" && dateValue) ?
              <Alert
                type="error"
                message="本次结果比对不合格!"
                onClose={this.onAlertClose}
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
