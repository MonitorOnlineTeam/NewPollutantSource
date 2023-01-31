import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Space, Button, DatePicker, Select, message } from 'antd';
import DataTypeGroup from '@/components/ButtonGroup'
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

const { RangePicker } = DatePicker;

@connect(({ loading, common, EPAndProduction, }) => ({
  loading: loading.effects['EPAndProduction/GetAllTypeDataList'],
  pollutantListByDgimn: common.pollutantListByDgimn,
  startTime: EPAndProduction.startTime,
  endTime: EPAndProduction.endTime,
}))
class PointDataChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataType: 'hour',
      seriesData: [],
      xAxisData: [],
      startTime: moment().startOf('day'),
      endTime: moment(),
    };
  }

  componentDidMount() {
    this.getPollutantListByDgimn();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.getPollutantListByDgimn();
    }

    if (this.props.startTime !== prevProps.startTime || this.props.endTime !== prevProps.endTime) {
      this.getAllTypeDataList();
    }
  }


  // 根据DGIMN获取污染物
  getPollutantListByDgimn = () => {
    debugger
    this.props.dispatch({
      type: "common/getPollutantListByDgimn",
      payload: {
        DGIMNs: this.props.DGIMN
      }
    }).then(e => {
      console.log('this.props.pollutantListByDgimn', this.props.pollutantListByDgimn)
      let pollutantCodes = [], pollutantNames = [];
      this.props.pollutantListByDgimn.map(item => {
        pollutantCodes.push(item.PollutantCode);
        pollutantNames.push(item.PollutantName);
      })
      this.setState({
        pollutantCodes, pollutantNames
      }, () => {
        this.getAllTypeDataList();
      })
    })
  }

  onSearch = () => {
    const { isShowDate } = this.props;
    if (isShowDate) {
      const { startTime, endTime } = this.state;
      this.props.dispatch({
        type: 'EPAndProduction/updateState',
        payload: {
          startTime, endTime
        }
      })
    }
    setTimeout(() => {
      this.getAllTypeDataList()
    }, 0)
  }

  // 获取点位数据
  getAllTypeDataList = () => {
    const { DGIMN, startTime, endTime } = this.props;
    const { dataType, pollutantCodes, pollutantNames } = this.state;
    if (!pollutantCodes.length) {
      message.error('请选择污染物！');
      return;
    }
    this.props.dispatch({
      type: "EPAndProduction/GetAllTypeDataList",
      payload: {
        "datatype": dataType,
        "DGIMNs": DGIMN,
        // "pageIndex": 1,
        // "pageSize": 20,
        // "beginTime": "2023-01-12 09:00:00",
        // "endTime": "2023-01-13 09:59:59",
        beginTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        "pollutantCodes": pollutantCodes,
        "pollutantNames": pollutantNames,
        // "DGIMN": DGIMN,
      },
      callback: ({ seriesData, xAxisData }) => {
        this.setState({
          seriesData, xAxisData
        })
      }
    })
  }

  // 数据类型切换
  onDateTypeChange = (e) => {
    this.setState({
      dataType: e.target.value
    }, () => {
      this.getAllTypeDataList()
    })
  }

  // 获取点位图表
  getPointOption = () => {
    const { seriesData, xAxisData, pollutantNames } = this.state;
    return {
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow'
        },
      },
      grid: {
        left: '2%',
        right: '4%',
        top: '18%',
        bottom: '4%',
        containLabel: true
      },
      legend: {
        type: 'scroll',
        top: 10,
        data: pollutantNames
      },
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        type: 'log'
      },
      series: seriesData
    };
  }

  onChange = (value, dateString) => {
    this.setState({
      startTime: value[0],
      endTime: value[1]
    })
  };

  render() {
    const { dataType, pollutantCodes, startTime, endTime } = this.state;
    const { pollutantListByDgimn, loading, bodyStyle, title } = this.props;
    return <Card
      bodyStyle={bodyStyle}
      loading={loading}
      title={title}
      extra={
        <Space>
          {/* <RangePicker
            value={[startTime, endTime]}
            showTime={{
              format: 'HH:mm',
            }}
            format="YYYY-MM-DD HH:mm"
            onChange={this.onChange}
          /> */}
          <Select
            showSearch
            value={pollutantCodes}
            placeholder="请选择污染物"
            mode="multiple"
            maxTagCount={3}
            style={{ width: 300 }}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={values => {
              this.setState({ pollutantCodes: values })
            }}
          >
            {
              pollutantListByDgimn.map(item => {
                return <Option key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
              })
            }
          </Select>
          <Button type="primary" onClick={this.onSearch}>查询</Button>
          <DataTypeGroup style={{ width: '100%' }} checked={dataType} showOtherTypes="none" onChange={this.onDateTypeChange} />
        </Space>
      }
      style={{ marginTop: 20 }}
    >
      <ReactEcharts
        option={this.getPointOption()}
        style={{ height: '400px' }}
        className="echarts-for-echarts"
        // theme="my_theme"
        theme="light"
      />
    </Card>
  }
}

export default PointDataChart;