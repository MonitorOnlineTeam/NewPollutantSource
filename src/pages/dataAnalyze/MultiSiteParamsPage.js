/*
 * @Author: Jiaqi 
 * @Date: 2020-01-10 10:44:31 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-01-15 18:10:11
 * @Description: 多站多参对比分析
 */
import React, { PureComponent } from 'react';
import { Button, Card, Checkbox, Row, Col, Radio, Select, DatePicker, Empty, message, Divider } from 'antd'
// import styles from './index.less'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from "dva";
import ReactEcharts from 'echarts-for-react';
import NavigationTree from '@/components/NavigationTree'
import moment from 'moment'
import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { getDirLevel } from "@/utils/utils"

const { RangePicker } = DatePicker;
const COLOR = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

@connect(({ loading, dataAnalyze }) => ({
  pollutantList: dataAnalyze.pollutantList,
  defaultPollutant: dataAnalyze.defaultPollutant,
  multiSiteParamsData: dataAnalyze.multiSiteParamsData,
  exportLoading: loading.effects["dataAnalyze/export"],
  loading: loading.effects["dataAnalyze/getChartAndTableData"]
}))
class MultiSiteParamsPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      defalutPollutantType: props.match.params.type,
      pollutantValue: [],
      time: [moment().add(-24, "hour"), moment()],
      dataType: "Hour",
      DGIMNs: [],
      one: true,
      format: "YYYY-MM-DD HH",
    };
  }

  componentDidMount() {
    // this.getPollutantList()
  }

  // 获取污染物
  getPollutantList = () => {
    this.props.dispatch({
      type: 'dataAnalyze/getPollutantList',
      payload: {
        // DGIMN: this.state.DGIMN,
        PollutantType: this.state.defalutPollutantType,
        Type: "1"
      }
    })
  }

  // 获取图表及表格数据
  getChartAndTableData = () => {
    if (!this.state.pollutantValue || !this.state.pollutantValue.length) {
      message.error('请选择污染物');
      return;
    }
    if (!this.state.DGIMNs || !this.state.DGIMNs.length) {
      message.error('请在左侧勾选监测点');
      return;
    }
    let format = this.state.dataType === "Hour" ? "YYYY-MM-DD HH:00:00" : "YYYY-MM-DD 00:00:00"
    this.props.dispatch({
      type: "dataAnalyze/getChartAndTableData",
      payload: {
        DGIMN: this.state.DGIMNs,
        PollutantCode: this.state.pollutantValue,
        BeginTime: moment(this.state.time[0]).format(format),
        EndTime: moment(this.state.time[1]).format(format),
        DataType: this.state.dataType,
        Type: "1",
        PollutantType: this.state.defalutPollutantType,
      }
    })
  }

  // 导出
  export = () => {
    if (!this.state.pollutantValue || !this.state.pollutantValue.length) {
      message.error('请选择污染物');
      return;
    }
    if (!this.state.DGIMNs || !this.state.DGIMNs.length) {
      message.error('请在左侧勾选监测点');
      return;
    }
    let format = this.state.dataType === "Hour" ? "YYYY-MM-DD HH:00:00" : "YYYY-MM-DD 00:00:00"
    this.props.dispatch({
      type: "dataAnalyze/export",
      payload: {
        DGIMN: this.state.DGIMNs,
        PollutantCode: this.state.pollutantValue,
        BeginTime: moment(this.state.time[0]).format(format),
        EndTime: moment(this.state.time[1]).format(format),
        DataType: this.state.dataType,
        Type: "1",
        PollutantType: this.state.defalutPollutantType,
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultPollutant !== nextProps.defaultPollutant) {
      // 赋默认值
      this.setState({
        pollutantValue: nextProps.defaultPollutant,
        one: false
      }, () => {
        this.getChartAndTableData()
      })
    }
  }

  // componentWillUpdate(nextProps, nextState) {
  //   if (this.props.defaultPollutant !== nextProps.defaultPollutant) {
  //     // 赋默认值
  //     this.setState({
  //       pollutantValue: nextProps.defaultPollutant,
  //     })
  //   }

  //   if(this.state.pollutantValue !== nextProps.pollutantValue){

  //   }

  // }


  getOptions = (chartList) => {
    const { multiSiteParamsData: { timeList } } = this.props;
    const { format, dataType } = this.state;
    const appendText = dataType === "Hour" ? "时" : "";
    let legend = [];
    let series = chartList.DataList.map(item => {
      legend.push(item.PointName)
      return {
        data: item.DataList,
        type: 'line',
        name: item.PointName,
        _dataType: chartList.PollutantName
      }
    })

    let otherProps = {};
    if (chartList.PollutantName === "风向") {
      otherProps = {
        formatter: function (params, ticket, callback) {
          let format = `${params[0].axisValue}: `
          params.map((item, index) => {
            let dirLevel = getDirLevel(item.value);
            format += `<br />${item.marker}${item.seriesName}: ${item.value} (${dirLevel})`
          })
          return format;
        }
      }
    }
    return {
      title: {
        text: `${chartList.PollutantName}对比分析`,
        subtext: `多站${chartList.PollutantName}对比分析`,
        // left: 'center'
      },
      legend: {
        data: legend,
        // left: 60,
        width: "70%",
        // align: 'center',
       // padding: [40, 40, 0, 0],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
      },
      toolbox: {
        feature: {
          dataView: {},
          saveAsImage: {},
        }
      },
      tooltip: {
        trigger: 'axis',
        // trigger: 'item',
        // axisPointer: {
        //   type: 'cross',
        //   animation: false,
        // },
        ...otherProps,
        // formatter: function (params, ticket, callback) {
        //   console.log("params=",params)
        //   let format = `${params[0].axisValue}: `
        //   params.map((item, index) => {
        //     if (item.seriesName === "风向") {
        //       let dirLevel = getDirLevel(item.value);
        //       format += `<br />${item.marker}${item.seriesName}: ${item.value} (${dirLevel})`
        //     }else{
        //       format += `<br />${item.marker}${item.seriesName}: ${item.value}`
        //     }
        //   })
        //   console.log("format=", format)
        //   return format;
        // }
      },
      xAxis: {
        type: 'category',
        data: timeList.map(item => moment(item).format(format) + appendText),
        splitLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
      },
      grid: {
        x: 60,
        y: 60,
        x2: 45,
        y2: 20,
      },
      series: series
    };
  }

  cardTitle = () => {
    const { pollutantList, defaultPollutant, exportLoading } = this.props;
    const { pollutantValue, time, dataType, format } = this.state;
    // const format = dataType === "Hour" ? "YYYY-MM-DD HH" : "YYYY-MM-DD"
    return (
      <Row gutter={16}>
        <Col span={8}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            value={pollutantValue}
            placeholder="请选择污染物"
            maxTagCount={2}
            maxTagTextLength={5}
            maxTagPlaceholder="..."
            onChange={(value) => {
              this.setState({
                pollutantValue: value
              })
            }}
          >
            {
              pollutantList.map((item, index) => {
                return <Option key={item.PollutantCode}>{item.PollutantName}</Option>
              })
            }
          </Select>
        </Col>
        <Col span={8}>
          <RangePicker_ style={{ width: '100%' }} dateValue={time} onRef={this.onRef1} dataType={dataType} callback={(dates, dataType) => {
            this.setState({
              time: dates,
              dataType: dataType
            })
          }} />
        </Col>
        <Col span={4}>
          <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
          <Button type="primary" style={{ marginRight: 10 }} loading={exportLoading} onClick={this.export}>导出</Button>
        </Col>
      </Row>
    )
  }


  pageContent = () => {
    const { multiSiteParamsData: { timeList, tableList, chartList }, loading } = this.props;
    if (loading) {
      return <PageLoading />
    }
    return (
      // <Card.Grid style={{ height: "calc(100vh - 190px - 66px)", width: "100%", overflowY: "auto" }}>
      <>
        {
          chartList.map(item => {
            return <>
              <Row>
                <ReactEcharts
                  option={this.getOptions(item)}
                  lazyUpdate={true}
                  style={{ height: '300px', width: '100%' }}
                  className="echarts-for-echarts"
                  theme="my_theme"
                />
              </Row>
              <Divider />
            </>
          })
        }
      {/* </Card.Grid> */}
      </>
    )
  }

  onRef1 = (ref) => {
    this.children = ref;
  }

  render() {
    const { showType, columns, defalutPollutantType } = this.state;
    const { multiSiteParamsData: { timeList, tableList, chartList } } = this.props;
    return (
      <>
        <NavigationTree
          // QCAUse="1"
          checkpPol={defalutPollutantType}
          polShow
          choice
          domId="#multiSiteParamsPage"
          onItemClick={value => {
            if (value.length) {
              let DGIMNsList = value.filter(item => item.IsEnt === false)
              this.setState({
                DGIMNs: DGIMNsList.map(item => item.key)
              }, () => {
                this.state.one ? this.getPollutantList() : this.getChartAndTableData()
              })
            } else {
              message.error("请在左侧勾选监测点")
            }
          }}
        />
        <div id="multiSiteParamsPage">
          <BreadcrumbWrapper>
            <Card
              title={this.cardTitle()}
              extra={
                <Radio.Group defaultValue="Hour" style={{ marginRight: 10 }} onChange={(e) => {
                  this.children.onDataTypeChange(e.target.value);
                  this.setState({
                    dataType: e.target.value,
                    format: e.target.value === "Hour" ? "YYYY-MM-DD HH" : "YYYY-MM-DD"
                  }, () => {
                    this.getChartAndTableData()
                  })
                }}>
                  <Radio.Button value="Hour">小时</Radio.Button>
                  <Radio.Button value="Day">日均</Radio.Button>
                </Radio.Group>
              }
              className="contentContainer"
            >
              {chartList.length ? this.pageContent() : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default MultiSiteParamsPage;

