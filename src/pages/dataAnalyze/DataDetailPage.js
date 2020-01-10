/*
 * @Author: Jiaqi 
 * @Date: 2020-01-10 10:45:15 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-01-10 16:22:41
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
  loading: loading.effects['dataquery/queryhistorydatalist'],
  columns: dataquery.columns,
  datatable: dataquery.datatable,
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

  getCardTitle = () => {
    const { pollutantlist } = this.props;
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