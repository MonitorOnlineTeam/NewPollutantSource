import React, { PureComponent } from 'react'
import { Card, DatePicker, Space, Col, Select, Button } from 'antd'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva'
import moment from 'moment'
import ReactEcharts from 'echarts-for-react';

const Option = Select.Option;

@connect(({ loading, airQualityAnalysis, common }) => ({
  pollutantList: common.pollutantCode,
  yearAndChainData: airQualityAnalysis.yearAndChainData,
  loading: loading.effects["airQualityAnalysis/GetMonthPoint"]
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      MonitorTime: moment(),
    };
  }

  componentDidMount() {
    this.getAllPollutantCode();
  }


  getAllPollutantCode = () => {
    this.props.dispatch({
      type: 'common/getAllPollutantCode',
      payload: {
        pollutantTypes: 5
      },
      callback: (res) => {
        this.setState({
          pollutantValue: res.Datas[0].field
        }, () => {
          this.getPageData();
        })
      }
    })
  }

  getPageData = () => {
    const { MonitorTime, pollutantValue } = this.state;
    this.props.dispatch({
      type: 'airQualityAnalysis/getYearAndChain',
      payload: {
        MonitorTime: moment(MonitorTime).format('YYYY-MM-01 00:00:00'),
        PollutantCode: pollutantValue,
        PollutantType: 5
      }
    })
  }

  getOptions = () => {
    const { yearAndChainData } = this.props;
    const { MonitorTime } = this.state;
    let dateString = moment(MonitorTime).format("YYYY-MM")
    return {
      // color: ['rgb(91,176,255)', '#fac858', '#fc8452', '#91cc75'],
      color: ['rgb(91,176,255)', '#fac858', '#fc8452', '#fac858', '#fc8452'],
      title: {
        text: `${dateString} 同比、环比分析`,
        // subtext: `多站${chartList.PollutantName}对比分析`,
        left: 'center'
      },
      legend: {
        top: 50,
        // data: legend,
        // left: 60,
        // width: "70%",
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
        trigger: 'item',
      },
      xAxis: {
        type: 'category',
        data: yearAndChainData.xData,
        splitLine: {
          show: false,
          // lineStyle: {
          //   type: 'dashed'
          // }
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true
        },
        // splitLine: {
        //   show: true,
        //   lineStyle: {
        //     type: 'dashed'
        //   }
        // },
      },
      grid: {
        x: 60,
        y: 120,
      },
      series: [
        {
          data: yearAndChainData.current.data,
          type: 'bar',
          name: yearAndChainData.current.date,
          barWidth: 30,
          label: {
            show: true,
            position: 'inside',
            fontWeight: 'bold'
          },
        },
        {
          data: yearAndChainData.year.data,
          type: 'bar',
          name: yearAndChainData.year.date,
          barWidth: 30,
          label: {
            show: true,
            position: 'inside',
            fontWeight: 'bold'
          },
        },
        {
          data: yearAndChainData.chain.data,
          type: 'bar',
          name: yearAndChainData.chain.date,
          barWidth: 30,
          label: {
            show: true,
            position: 'inside'
          },
        },
        {
          data: yearAndChainData.year.data,
          type: 'line',
          name: '同比',
          barWidth: 30,
        },
        {
          data: yearAndChainData.chain.data,
          type: 'line',
          name: '环比',
          barWidth: 30,
        }
      ]
    };
  }

  cardTitle = () => {
    const { pollutantList, loading } = this.props;
    const { pollutantValue, MonitorTime } = this.state;
    return <Space>
      <Select
        // mode="multiple"
        style={{ width: '200px' }}
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
            return <Option key={item.field}>{item.name}</Option>
          })
        }
      </Select>
      <DatePicker value={MonitorTime} onChange={(date) => {
        this.setState({
          MonitorTime: date
        })
      }} picker="month" />
      <Button type="primary" loading={loading} style={{ marginRight: 10 }} onClick={this.getPageData}>查询</Button>
    </Space>
  }

  render() {
    return (
      <BreadcrumbWrapper>
        <Card
          title={this.cardTitle()}
        >
          <ReactEcharts
            option={this.getOptions()}
            lazyUpdate={true}
            style={{ height: 'calc(100vh - 220px)', width: '100%' }}
            className="echarts-for-echarts"
            theme="my_theme"
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;