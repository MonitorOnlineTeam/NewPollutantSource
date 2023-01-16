/*
 * @Author: JiaQi 
 * @Date: 2023-01-16 10:54:36 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-01-16 14:26:47
 * @Description: 治理设施和生产设施数据展示
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Space, Button, DatePicker, Select, Empty, Radio } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment'
import SdlTable from '@/components/SdlTable'


const { RangePicker } = DatePicker;

@connect(({ loading, EPAndProduction, }) => ({
  // loading: loading.effects['EPAndProduction/GetDataByParams'],
}))
class FacilityData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      currentParams: [],
      chartDate: [],
      chartSeries: [],
      loading: {},
      startTime: moment().startOf('day'),
      endTime: moment(),
      showType: 'data',
      columns: [
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
        },
      ],
    };
  }

  componentDidMount() {
    this.initPageData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.facilityCode !== prevProps.facilityCode) {
      this.initPageData();
    }
  }

  // 初始化页面数据
  initPageData = () => {
    const { paramsList } = this.props;
    const _columns = [...this.state.columns];
    console.log('paramsList', paramsList)

    // let currentFacility = '';
    let currentParams = [];
    if (paramsList.length) {
      currentParams = paramsList.map(item => {
        _columns.push({
          title: item.PollutantName,
          dataIndex: item.PollutantCode,
          key: item.PollutantCode,
        })
        return item.PollutantCode;
      });
      console.log('_columns', _columns)
      this.setState({
        currentParams,
        columns: _columns
      }, () => {
        this.onQuery();
      })
    }
  }

  onDateChange = (value, dateString) => {
    this.setState({
      startTime: value[0],
      endTime: value[1]
    })
  };

  // 查询条件
  getCardTitle = () => {
    const { paramsList, type } = this.props;
    const { currentFacility, currentParams, startTime, endTime } = this.state;
    return <Space>
      <RangePicker
        value={[startTime, endTime]}
        showTime={{
          format: 'HH:mm',
        }}
        format="YYYY-MM-DD HH:mm"
        onChange={this.onDateChange}
      />
      <Select
        showSearch
        value={currentParams}
        placeholder="请选择参数"
        mode="multiple"
        maxTagCount={3}
        style={{ width: 400 }}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        onChange={values => {
          this.setState({ currentParams: values })
        }}
      >
        {
          paramsList.map(item => {
            return <Option key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
          })
        }
      </Select>
      <Button type="primary" onClick={this.onQuery}>查询</Button>
    </Space>
  }

  // 查询
  onQuery = () => {
    const { currentParams, loading, startTime, endTime } = this.state;
    const { type, facilityCode } = this.props;
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
        "equCode": facilityCode,
        "type": type,
        startTime: startTime,
        endTime: endTime
      },
      callback: (res) => {
        let dataSource = [];
        let chartSeries = res.data.map(item => {
          return {
            data: item.ValueList,
            type: 'line',
            name: item.Name,
            smooth: true
          }
        })
        // 处理表格数据
        res.date.map((item, index) => {
          let obj = {};
          res.data.map(itm => {
            obj[itm.Code] = itm.ValueList[index]
          })
          dataSource.push({
            time: item,
            ...obj
          })
          console.log('obj', obj)
        })
        console.log('dataSource', dataSource)
        this.setState({
          chartDate: res.date,
          chartSeries: chartSeries,
          dataSource,
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
      legend: {
        top: 10,
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
    let { chartSeries, loading, columns, dataSource, showType } = this.state;
    const { type, title } = this.props;
    return <Card
      title={this.getCardTitle()}
      extra={
        <Radio.Group onChange={e => this.setState({ showType: e.target.value })} defaultValue="data">
          <Radio.Button value="data">数据</Radio.Button>
          <Radio.Button value="chart">表格</Radio.Button>
        </Radio.Group>
      }
      loading={loading[type]}
    >
      {
        showType === 'data' ? <SdlTable columns={columns} dataSource={dataSource} /> :
          <>
            {
              chartSeries.length ? <ReactEcharts
                option={this.getChartOption()}
                style={{ height: '400px' }}
                className="echarts-for-echarts"
                theme="light"
              /> :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ height: 236, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                />
            }
          </>
      }
    </Card>
  }
}

export default FacilityData;