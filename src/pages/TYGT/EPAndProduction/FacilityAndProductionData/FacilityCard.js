import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Space, Button, DatePicker, Select, Empty } from 'antd';
import DataTypeGroup from '@/components/ButtonGroup'
import ReactEcharts from 'echarts-for-react';

const { RangePicker } = DatePicker;

@connect(({ loading, EPAndProduction, }) => ({
  // loading: loading.effects['EPAndProduction/GetDataByParams'],
}))
class FacilityCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentFacility: '',
      currentFacilityPollList: [],
      currentParams: [],
      chartDate: [],
      chartSeries: [],
      loading: {}
    };
  }

  componentDidMount() {
    this.initPageData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectListData !== prevProps.selectListData) {
      this.initPageData();
    }
  }

  // 初始化页面数据
  initPageData = () => {
    const { selectListData } = this.props;
    let currentFacility = '';
    let currentFacilityPollList = [];
    let currentParams = [];
    if (selectListData.length) {
      currentFacility = selectListData[0].Code;
      currentFacilityPollList = selectListData[0].PollutantList;
      currentParams = selectListData[0].PollutantList.map(item => item.PollutantCode);
    }
    this.setState({
      currentFacility,
      currentFacilityPollList,
      currentParams
    }, () => {
      if (selectListData.length) {
        this.onQuery();
      }
    })
  }

  // 生产设施查询条件
  getExtra = () => {
    const { selectListData, type } = this.props;
    const { currentFacility, currentFacilityPollList, currentParams } = this.state;
    return <Space>
      <Select
        showSearch
        placeholder="请选择设施"
        style={{ width: 200 }}
        value={currentFacility}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        onChange={this.onFacilityChange}
      >
        {
          selectListData.map(item => {
            return <Option key={item.Code} value={item.Code} data-pollutantList={item.PollutantList}>{item.Name}</Option>
          })
        }
      </Select>
      <Select
        showSearch
        value={currentParams}
        placeholder="请选择参数"
        mode="multiple"
        maxTagCount={3}
        style={{ width: 300 }}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        onChange={values => {
          this.setState({ currentParams: values })
        }}
      >
        {
          currentFacilityPollList.map(item => {
            return <Option key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
          })
        }
      </Select>
      <Button type="primary" onClick={this.onQuery}>查询</Button>
    </Space>
  }

  // 设施更改
  onFacilityChange = (value, option) => {
    let pollutantList = option['data-pollutantList'];
    this.setState({
      currentFacility: value,
      currentFacilityPollList: pollutantList,
      currentParams: pollutantList.map(item => item.PollutantCode)
    })
  }

  // 查询
  onQuery = () => {
    const { currentFacility, currentParams, loading } = this.state;
    const { type } = this.props;
    this.setState({
      loading: {
        ...loading,
        [type]: true
      }
    })
    this.props.dispatch({
      type: 'EPAndProduction/GetDataByParams',
      payload: {
        "paramCode": currentParams.toString(),
        "equCode": currentFacility,
        "type": type
      },
      callback: (res) => {
        let chartSeries = res.data.map(item => {
          return {
            data: item.ValueList,
            type: 'line',
            name: item.Name,
            smooth: true
          }
        })
        this.setState({
          chartDate: res.date,
          chartSeries: chartSeries,
          loading: {
            ...loading,
            [type]: false
          }
        })
      }
    })
  }

  // 获取图表配置
  getChartOption = () => {
    const { chartDate, chartSeries } = this.state;
    console.log('chartSeries', chartSeries)
    return {
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params, ticket, callback) {
          let format = `${params[0].axisValue}: `
          params.map((item, index) => {
            let value = item.value;
            if (value === 1 || value === 2 || value === 3) {
              value = '启动'
            }
            format += `<br />${item.marker}${item.seriesName}: ${value}`
          })
          return format;
        }
      },
      grid: {
        left: '2%',
        right: '4%',
        top: '14%',
        bottom: '4%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartDate
      },
      yAxis: [{
        type: 'value'
      },
        // {
        //   type: 'value',
        //   splitNumber: 3,
        //   max: 4,
        //   axisLabel: {
        //     formatter: function (value) {
        //       if (value === 1) {
        //         return '吹氧开始结束'
        //       } else if (value === 2) {
        //         return '兑铁开始结束'
        //       } else if (value === 3) {
        //         return '加废钢开始结束'
        //       }
        //       // return ''
        //     }
        //   }
        // }
      ],
      series: chartSeries
      // series: [
      //   {
      //     data: [820, 932, 901, 934, 1290, 1330, 1320],
      //     type: 'line',
      //     name: 'COD',
      //     smooth: true
      //   },
      //   {
      //     data: [1, '', 1, 1, 1, '', 1],
      //     type: 'line',
      //     name: '吹氧状态',
      //     yAxisIndex: 1,
      //     smooth: true,
      //     lineStyle: {
      //       width: 3
      //     }
      //   },
      //   {
      //     data: [2, '', 2, 2, 2, '', 2],
      //     type: 'line',
      //     name: '兑铁状态',
      //     yAxisIndex: 1,
      //     smooth: true,
      //     lineStyle: {
      //       width: 3
      //     }
      //   },
      //   {
      //     data: [3, '', 3, 3, 3, '', 3],
      //     type: 'line',
      //     name: '加废钢状态',
      //     yAxisIndex: 1,
      //     smooth: true,
      //     lineStyle: {
      //       width: 3
      //     }
      //   }
      // ]
    };
  }
  render() {
    let { chartSeries, loading } = this.state;
    const { type, title } = this.props;
    console.log('loading', loading)
    console.log('chartSeries1', chartSeries)
    return <Card
      title={title}
      extra={
        this.getExtra('pro')
      }
      style={{ marginTop: 20 }}
      bodyStyle={{ height: 310 }}
      loading={loading[type]}
    >
      {
        chartSeries.length ? <ReactEcharts
          option={this.getChartOption()}
          style={{ height: '300px' }}
          className="echarts-for-echarts"
          theme="my_theme"
        /> :
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ height: 236, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          />
      }
    </Card>
  }
}

export default FacilityCard;