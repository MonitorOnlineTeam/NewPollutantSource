/*
 * @Author: Jiaqi 
 * @Date: 2020-01-10 10:45:15 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-01-10 16:17:32
 * @Description: 数据详情
 */
import React, { PureComponent } from 'react';
import { Button, Card, Checkbox, Row, Col, Radio, Select, DatePicker, Empty, message, Spin } from 'antd'
import moment from 'moment'
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';


const { RangePicker } = DatePicker;


@connect(({ loading, dataAnalyze, dataquery }) => ({
  pollutantlist: dataAnalyze.pollutantlist,
  // chartAndTableData: dataAnalyze.chartAndTableData,
  option: dataquery.chartdata,
  selectpoint: dataquery.selectpoint,
  loading: loading.effects['dataquery/queryhistorydatalist'],
  columns: dataquery.columns,
  datatable: dataquery.datatable,
  total: dataquery.total,
  tablewidth: dataquery.tablewidth,
  historyparams: dataquery.historyparams,
}))
class DataDetailPage extends PureComponent {
  constructor(props) {
    console.log('time=', props.time)
    super(props);
    this.state = {
      time: props.time,
      dataType: props.dataType,
      showType: "chart",
      format: "YYYY-MM-DD HH",
      DGIMN: props.DGIMN,
      // time: [props.time, moment()],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'dataAnalyze/querypollutantlist',
      payload: {
        DGIMNs: this.state.DGIMN,
      },
    });
  }

  getPageData = () => {
    this.props.dispatch({
      type: "dataquery/queryhistorydatalist",
      payload: {
        datatype: this.state.dataType,
        DGIMNs: this.state.DGIMN,
        pageIndex: null,
        pageSize: null,
        beginTime: moment(this.state.time[0]).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(this.state.time[1]).format("YYYY-MM-DD HH:mm:ss"),
        pollutantCodes: this.state.pollutantValue.toString(),
        pollutantNames: this.state.pollutantNames.toString(),
        unit: "μg/m3",
        isAsc: true,
        DGIMN: this.state.DGIMN
      },
      from: true
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pollutantlist !== nextProps.pollutantlist) {
      console.log('12313123123')
      this.props.dispatch({
        type: 'dataquery/updateState',
        payload: {
          pollutantlist: nextProps.pollutantlist
        }
      })
      const pollutantValue = nextProps.pollutantlist.map(item => item.PollutantCode);
      const pollutantNames = nextProps.pollutantlist.map(item => item.PollutantName);
      this.setState({
        pollutantValue: pollutantValue,
        pollutantNames: pollutantNames
      }, () => {
        this.getPageData()
      })
    }
  }

  getOption = () => {
    return {
      "title": {},
      "tooltip": {
        "trigger": "axis"
      },
      "legend": {
        "data": ["PM2.5", "PM10", "O3", "CO"]
      },
      "toolbox": {
        "show": true,
        "feature": {
          "saveAsImage": {}
        }
      },
      "xAxis": {
        "type": "category",
        "name": "时间",
        "boundaryGap": false,
        "data": ["2020-01-09 14:00", "2020-01-09 15:00", "2020-01-09 16:00", "2020-01-09 17:00", "2020-01-09 18:00", "2020-01-09 19:00", "2020-01-09 20:00", "2020-01-09 21:00", "2020-01-09 22:00", "2020-01-09 23:00", "2020-01-10 00:00", "2020-01-10 01:00", "2020-01-10 02:00", "2020-01-10 03:00", "2020-01-10 04:00", "2020-01-10 05:00", "2020-01-10 06:00", "2020-01-10 07:00", "2020-01-10 08:00", "2020-01-10 09:00", "2020-01-10 10:00", "2020-01-10 11:00", "2020-01-10 12:00", "2020-01-10 13:00", "2020-01-10 14:00"]
      },
      "yAxis": {
        "type": "value",
        "name": "浓度值(μg/m3)",
        "axisLabel": {
          "formatter": "{value}"
        }
      },
      "grid": {
        "x": 60,
        "y": 45,
        "x2": 45,
        "y2": 20
      },
      "series": [{
        "type": "line",
        "name": "PM2.5",
        "data": [96.192, 95.453, 80.815, 70.164, 76.176, 83.712, 85.75, 91.049, 102.891, 102.231, 99.55, 113.086, 123.487, 121.846, 127.829, 124.15, 114.5, 118.394, 119.896, 28.306, 137.791, 140.004, 125.77, 107.819, 102.846],
        "markLine": {}
      }, {
        "type": "line",
        "name": "PM10",
        "data": [177.225, 175.044, 131.611, 93.854, 101.923, 109.825, 115.032, 122.939, 129.63, 125.73, 126.163, 145.28, 153.511, 147.359, 149.132, 149.133, 142.18, 147.575, 154.891, 549.75, 174.152, 177.876, 155.085, 127.341, 122.231],
        "markLine": {}
      }, {
        "type": "line",
        "name": "O3",
        "data": [64.563, 65.669, 58.104, 40.529, 15.168, 3.529, 1.059, 1.162, 1.37, 3.327, 11.263, 8.536, 5.297, 9.205, 9.406, 10.96, 12.382, 42.818, 38.458, 900.07, 33.237, 38.34, 52.225, 59.356, 66.512],
        "markLine": {}
      }, {
        "type": "line",
        "name": "CO",
        "data": [0.876, 1.258, 1.337, 1.484, 1.661, 1.7, 1.871, 1.94, 2.03, 2.022, 2.1, 2.188, 2.069, 2.143, 2.374, 2.236, 2.211, 1.892, 2.006, 280.3, 1.925, 1.747, 1.467, 1.595, 1.444],
        "markLine": {}
      }]
    }
  }

  getCardTitle = () => {
    const { pollutantlist } = this.props;
    console.log("props=", this.props)
    const { pollutantValue, time, dataType, format } = this.state;
    return (
      <Row gutter={16}>
        <Col span={8}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            value={pollutantValue}
            placeholder="请选择污染物"
            maxTagCount={4}
            maxTagPlaceholder="..."
            onChange={(value, option) => {
              console.log('option=', option)
              this.setState({
                pollutantValue: value,
                pollutantNames: option.map(item => item.props.pollutantName)
              })
            }}
          >
            {
              pollutantlist.map((item, index) => {
                return <Option key={item.PollutantCode} pollutantName={item.PollutantName}>{item.PollutantName}</Option>
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
        <Col span={4}>
          <Button type="primary" style={{ marginRight: 10 }} onClick={this.getPageData}>查询</Button>
        </Col>
      </Row>
    )
  }

  render() {
    const { option, datatable, columns, loading } = this.props;
    const { showType } = this.state;
    console.log('loading=',loading)
    return (
      <Card
        title={this.getCardTitle()}
        extra={
          <>
            <Radio.Group defaultValue={this.state.dataType} style={{ marginRight: 10 }} onChange={(e) => {
              this.setState({
                dataType: e.target.value,
                format: e.target.value === "hour" ? "YYYY-MM-DD HH" : "YYYY-MM-DD"
              }, () => {
                this.getPageData()
              })
            }}>
              {/* <Radio.Button value="minute">分钟</Radio.Button> */}
              <Radio.Button value="hour">小时</Radio.Button>
              {/* <Radio.Button value="day">日均</Radio.Button> */}
            </Radio.Group>
            <Radio.Group defaultValue="chart" buttonStyle="solid" onChange={(e) => { this.setState({ showType: e.target.value }) }}>
              <Radio.Button value="chart">图表</Radio.Button>
              <Radio.Button value="data">数据</Radio.Button>
            </Radio.Group>
          </>
        }
      >
        <Spin spinning={loading}>
          {
            option &&
            (
              showType === "chart" ?
                <ReactEcharts
                  theme="light"
                  option={option}
                  style={{ minHeight: 400 }}
                  lazyUpdate
                  notMerge
                  id="rightLine"
                // style={{ width: '98%', height: this.props.style ? '100%' : 'calc(100vh - 330px)', padding: 20 }}
                /> : <SdlTable
                  rowKey={(record, index) => `complete${index}`}
                  dataSource={datatable}
                  columns={columns}
                  scroll={{ y: this.props.tableHeight }}
                  Pagination={null}
                />
            )
          }
        </Spin>
      </Card>
    );
  }
}

export default DataDetailPage;