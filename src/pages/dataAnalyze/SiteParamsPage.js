/*
 * @Author: Jiaqi
 * @Date: 2020-01-10 10:44:55
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-01-15 18:11:17
 * @Description: 单站多参对比分析
 */
import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Checkbox, Row, Col, Radio, Select, DatePicker, Empty, message } from 'antd'
// import styles from './index.less'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from "dva";
import ReactEcharts from 'echarts-for-react';
import NavigationTree from '@/components/NavigationTree'
import moment from 'moment'
import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading'
import { getDirLevel } from "@/utils/utils"
import { airLevel, AQIPopover, IAQIPopover } from '@/Pages/monitoring/overview/tools'

const { RangePicker } = DatePicker;
const COLOR = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']

@connect(({ loading, dataAnalyze }) => ({
  pollutantList: dataAnalyze.pollutantList,
  defaultPollutant: dataAnalyze.defaultPollutant,
  siteParamsData: dataAnalyze.siteParamsData,
  exportLoading: loading.effects["dataAnalyze/export"],
  loading: loading.effects["dataAnalyze/getChartAndTableData"],
}))
class SiteParamsPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      defalutPollutantType: props.match.params.type,
      pollutantValue: [],
      time: [moment().add(-24, "hour"), moment()],
      dataType: "Hour",
      showType: "chart",
      format: "YYYY-MM-DD HH",
      columns: [
        {
          title: "监测点",
          dataIndex: "PointName",
          fixed: 'left',
        },
        {
          title: "时间",
          dataIndex: "MonitorTime",
          fixed: 'left',
          render: (text, record) => {
            return this.state.dataType === "Hour" ? moment(text).format(this.state.format) + "时" : moment(text).format(this.state.format)
          }
        },
      ],
    };
  }

  componentDidMount() {
  }

  // 获取污染物
  getPollutantList = () => {
    this.props.dispatch({
      type: 'dataAnalyze/getPollutantList',
      payload: {
        DGIMN: this.state.DGIMN,
        // PollutantType: this.state.PollutantType,
        Type: "0",
        PollutantType: this.state.PollutantType,
      }
    })
  }

  // 获取图表及表格数据
  getChartAndTableData = () => {
    if (!this.state.pollutantValue || !this.state.pollutantValue.length) {
      message.error('请选择污染物');
      return;
    }
    let format = this.state.dataType === "Hour" ? "YYYY-MM-DD HH:00:00" : "YYYY-MM-DD 00:00:00"
    this.props.dispatch({
      type: "dataAnalyze/getChartAndTableData",
      payload: {
        DGIMN: [this.state.DGIMN],
        PollutantCode: this.state.pollutantValue,
        BeginTime: moment(this.state.time[0]).format(format),
        EndTime: moment(this.state.time[1]).format(format),
        DataType: this.state.dataType,
        Type: "0",
        PollutantType: this.state.PollutantType,
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultPollutant !== nextProps.defaultPollutant) {
      // columns
      const columns = nextProps.pollutantList.map(item => {
        return {
          title: item.Unit ? `${item.PollutantName}(${item.Unit})` : item.PollutantName,
          dataIndex: item.PollutantCode,
          render: (text, record) => {
            if (item.PollutantName === "AQI") {
              return AQIPopover(text, record, true)
            }
            if (record[item.PollutantCode + "_Value"] !== undefined) {
              // if (item.PollutantCode === "AQI") {
              return IAQIPopover(text, record, item.PollutantCode)
            }
            if (item.PollutantCode == 5) {
              // 风向转换成文字
              return text ? getDirLevel(text) : "-"
            }
            return text ? text : "-"
          }
        }
      })
      // 赋默认值
      this.setState({
        pollutantValue: nextProps.defaultPollutant,
        columns: [
          {
            title: "监测点",
            dataIndex: "PointName",
            fixed: 'left',
          },
          {
            title: "时间",
            dataIndex: "MonitorTime",
            fixed: 'left',
            render: (text, record) => {
              return this.state.dataType === "Hour" ? moment(text).format(this.state.format) + "时" : moment(text).format(this.state.format)
            }
          },
          ...columns
        ]
      }, () => {
        this.getChartAndTableData()
      })
    }
  }

  // 导出
  exportReport = () => {
    if (!this.state.pollutantValue || !this.state.pollutantValue.length) {
      message.error('请选择污染物');
      return;
    }
    let format = this.state.dataType === "Hour" ? "YYYY-MM-DD HH:00:00" : "YYYY-MM-DD 00:00:00"
    this.props.dispatch({
      type: "dataAnalyze/export",
      payload: {
        DGIMN: [this.state.DGIMN],
        PollutantCode: this.state.pollutantValue,
        BeginTime: moment(this.state.time[0]).format(format),
        EndTime: moment(this.state.time[1]).format(format),
        DataType: this.state.dataType,
        Type: "0",
        PollutantType: this.state.PollutantType,
      }
    })
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
          <RangePicker style={{ width: '100%' }} defaultValue={time} showTime={dataType === "Hour"} format={format} onChange={(dates) => {
            this.setState({
              time: dates
            })
          }} />
        </Col>
        <Col span={8}>
          <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
          <Button type="primary" loading={exportLoading} style={{ marginRight: 10 }} onClick={this.exportReport}>导出</Button>

        </Col>
      </Row>
    )
  }


  // 图表Option
  getOptions = () => {
    const { siteParamsData: { timeList, tableList, chartList } } = this.props;
    const { format, dataType } = this.state;
    const legendData = chartList.map(item => item.PollutantName);
    // series
    const series = chartList.map((item, index) => {
      let otherProps = {}
      if (index > 0) {
        otherProps.yAxisIndex = index
      }
      return {
        name: item.PollutantName,
        type: 'line',
        animation: false,
        data: item.DataList,
        ...otherProps
      }
    })
    const yAxis = chartList.map((item, index) => {
      let otherProps = {}
      if (index === 1) {
        otherProps = {
          type: 'value',
          axisLine: { // Y轴线
            // onZero: false,    //核心代码,让第二个Y轴去对面
            lineStyle: {
              color: COLOR[1]
            }
          },
          nameLocation: 'end',
        }
      } else if (index === 2) {
        otherProps = {
          type: 'value',
          nameLocation: 'end',
          position: "left",  //多个Y轴使用
          offset: 60,
        }
      } else if (index === 3) {
        otherProps = {
          type: 'value',
          nameLocation: 'end',
          position: "right",  //多个Y轴使用
          offset: 60,
        }
      } else if (index > 3 && index % 2 === 0) {
        otherProps = {
          type: 'value',
          nameLocation: 'end',
          position: "left",  //多个Y轴使用
          offset: (index - 3) * -50,
        }
      } else if (index > 3 && index % 2 !== 0) {
        otherProps = {
          type: 'value',
          nameLocation: 'end',
          position: "right",  //多个Y轴使用
          offset: (index - 4) * -50,
        }
      }

      return {
        type: 'value',
        name: item.PollutantName,
        axisLine: {
          lineStyle: {
            color: COLOR[index],
            width: 2
          }
        },
        splitLine: {
          show: false
        },
        ...otherProps
      }
    })
    const appendText = dataType === "Hour" ? "时" : "";

    // let formatter = {};
    // if (chartList.PollutantName = == "风向") {
    //   formatter = {
    //     formatter: function (params, ticket, callback) {
    //       let format = `${params[0].axisValue}: `
    //       params.map((item, index) => {
    //         let dirLevel = getDirLevel(item.value);
    //         format += `<br />${item.marker}${item.seriesName}: ${item.value} (${dirLevel})`
    //       })
    //       return format;
    //     }
    //   }
    // }

    if (yAxis.length) {
      return {
        grid: {
          bottom: 80
        },
        toolbox: {
          feature: {
            saveAsImage: {},
            dataView: {}
          }
        },
        tooltip: {
          trigger: 'item',
          // axisPointer: {
          //   type: 'cross',
          //   animation: false,
          // },
          formatter: function (params, ticket, callback) {
            // let format = `${params[0].axisValue}: `
            // params.map((item, index) => {
            //   if (item.seriesName === "风向") {
            //     let dirLevel = getDirLevel(item.value);
            //     format += `<br />${item.marker}${item.seriesName}: ${item.value} (${dirLevel})`
            //   } else {
            //     format += `<br />${item.marker}${item.seriesName}: ${item.value}`
            //   }
            // })
            // return format;
            let format = `${params.name}: `
            if (params.seriesName === "风向") {
              let dirLevel = getDirLevel(params.value);
              format += `<br />${params.marker}${params.seriesName}: ${params.value} (${dirLevel})`
            } else {
              format += `<br />${params.marker}${params.seriesName}: ${params.value}`
            }
            return format;
          }
          // ...formatter
        },
        legend: {
          data: legendData,
        },
        xAxis: [
          {
            name: "时间",
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: false },
            data: timeList.map(item => moment(item).format(format) + appendText),
            splitLine: {
              show: false
            },
          }
        ],
        yAxis: [...yAxis],
        series: [...series]
      };
    }
    return {}
  }

  pageContent = () => {
    const { showType, columns } = this.state;
    const { siteParamsData: { timeList, tableList, chartList }, loading } = this.props;

    if (loading) {
      return <PageLoading />
    }
    return <>{
      chartList.length ? (showType === "chart" ?
        <ReactEcharts
          option={this.getOptions()}
          lazyUpdate={true}
          style={{ height: 'calc(100vh - 310px)', width: '100%' }}
          className="echarts-for-echarts"
          theme="my_theme"
        /> :
        <SdlTable columns={columns} dataSource={tableList} pagination={true} />) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
    </>
  }

  render() {
    const { showType, columns, defalutPollutantType } = this.state;
    const { siteParamsData: { timeList, tableList, chartList } } = this.props;
    return (
      <>
        <NavigationTree
          // QCAUse="1"
          checkpPol={defalutPollutantType}
          polShow
          // choice
          onItemClick={value => {
            if (value.length) {
              let DGIMNs = value.find(item => {
                if (item.IsEnt === false) {
                  return item.key
                }
              })
              this.setState({
                DGIMN: DGIMNs.key,
                PollutantType: DGIMNs.Type
              }, () => {
                this.getPollutantList()
              })
            }
          }}
        />
        <div id="contentWrapper">
          <PageHeaderWrapper>
            <Card
              title={this.cardTitle()}
              extra={
                <>
                  <Radio.Group defaultValue="Hour" style={{ marginRight: 10 }} onChange={(e) => {
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
                  <Radio.Group defaultValue="chart" buttonStyle="solid" onChange={(e) => { this.setState({ showType: e.target.value }) }}>
                    <Radio.Button value="chart">图表</Radio.Button>
                    <Radio.Button value="data">数据</Radio.Button>
                  </Radio.Group>
                </>
              }
              className="contentContainer"
            >
              {this.pageContent()}
            </Card>
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default SiteParamsPage;

