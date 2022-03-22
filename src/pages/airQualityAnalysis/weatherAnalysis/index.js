import React, { PureComponent } from 'react'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import ReactEcharts from 'echarts-for-react';
import NavigationTree from '@/components/NavigationTree'
import { connect } from 'dva';
import { Card, Space, DatePicker, Button } from 'antd'
import moment from 'moment';
import echarts from 'echarts/lib/echarts'

const { RangePicker } = DatePicker;

@connect(({ loading, airQualityAnalysis, common }) => ({
  pollutantList: common.pollutantCode,
  weatherAnalysisData: airQualityAnalysis.weatherAnalysisData,
  loading: loading.effects["airQualityAnalysis/getPolCalendar"]
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: '',
      time: [moment().subtract(1, 'day'), moment()],
    };
  }

  getWeatherAnalysisData = () => {
    const { time, DGIMN } = this.state
    this.props.dispatch({
      type: 'airQualityAnalysis/getWeatherAnalysis',
      payload: {
        BeginTime: moment(time[0]).format("YYYY-MM-DD HH:00:00"),
        EndTime: moment(time[1]).format("YYYY-MM-DD HH:59:59"),
        DGIMN: DGIMN
        // BeginTime: "2021-07-06 15:00:00",
        // DGIMN: "aq140421002",
        // EndTime: "2021-07-07 15:59:59"
      }
    })
  }

  cardTitle = () => {
    return <Space>
      <RangePicker format="YYYY-MM-DD HH" showTime value={this.state.time} onChange={(date, dateStr) => {
        this.setState({ time: date })
      }} />
      <Button type="primary" onClick={this.getWeatherAnalysisData}>查询</Button>
    </Space>
  }

  renderArrow = (param, api) => {
    var directionMap = {};
    echarts.util.each(
      ['西', '西西南', '西南', '南西南', '南', '南东南', '东南', '东东南', '东', '东东北', '东北', '东北东', '北', '北西北', '西北', '西西北'],
      function (name, index) {
        directionMap[name] = Math.PI / 8 * index;
      }
    );
    // console.log("param=", param)
    var arrowSize = 18;
    var point = api.coord([
      // api.value(0),
      param.dataIndex,
      api.value(1)
    ]);
    // console.log("point=", point)
    // console.log("directionMap=", directionMap)
    return {
      type: 'path',
      shape: {
        pathData: 'M31 16l-15-15v9h-26v12h26v9z',
        x: -arrowSize / 2,
        y: -arrowSize / 2,
        width: arrowSize,
        height: arrowSize
      },
      rotation: directionMap[api.value(2)],
      position: point,
      style: api.style({
        stroke: '#555',
        lineWidth: 1
      })
    };
  }

  getOptions = () => {
    const { weatherAnalysisData: { xData, wind, temp, humi, press } } = this.props;
    // weatherAnalysisData: {
    //   wind: [],
    //   temp: [], // 温度
    //   humi: [], // 湿度
    //   press: [], // 气压
    // },
    let option = {
      // color: ['blue', 'red', '#000'],
      title: {
        text: '气象参数变化趋势',
        // subtext: '数据来自西安兰特水电测控技术有限公司',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        },
        formatter: function (params) {
          let str = params[0].axisValue + '<br>';
          params.map(item => {
            if (item.seriesName === '风向') {
              str += item.marker + '风向：' + item.value[2] + '<br>';
            }  else {
              str += item.marker + item.seriesName + '：' + item.value + '<br>';
            }
          })
          return str;
        }
      },

      legend: {
        top: 40,
        // data: ['流量', '降雨量'],
        left: 'center'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      axisPointer: {
        link: { xAxisIndex: 'all' }
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          // start: 30,
          // end: 70,
          xAxisIndex: [0, 1],
          handleSize: '120%'
        },
        {
          type: 'inside',
          realtime: true,
          start: 30,
          end: 70,
          xAxisIndex: [0, 1]
        }
      ],
      grid: [{
        left: 80,
        right: 50,
        top: 100,
        height: '35%'
      }, {
        left: 80,
        right: 50,
        top: '55%',
        height: '35%'
      }],
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: true },
          data: xData
        },
        {
          gridIndex: 1,
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: true },
          data: xData,
        }
      ],
      yAxis: [
        {
          name: '风速（m/s）、风向',
          type: 'value',
          nameGap: 35,
          nameLocation: 'middle',
        },
        {
          gridIndex: 1,
          name: '温度(°C)、湿度(%)',
          nameGap: 35,
          nameLocation: 'middle',
          type: 'value',
        },
        {
          gridIndex: 1,
          name: '气压（hpa）',
          nameGap: 35,
          nameLocation: 'middle',
          type: 'value',
        },
      ],
      series: [
        {
          name: '风向',
          symbolSize: 8,
          type: 'custom',
          renderItem: this.renderArrow,
          hoverAnimation: false,
          encode: {
            y: 1
          },
          data: wind
        },
        {
          name: '风速',
          type: 'line',
          symbol: 'none',
          encode: {
            y: 1
          },
          lineStyle: {
            normal: {
              color: '#aaa',
              type: 'dotted'
            }
          },
          data: wind.length ? wind.map(item => item[1]) : [],
          z: 1
        },
        {
          name: '温度',
          type: 'line',
          symbolSize: 8,
          xAxisIndex: 1,
          yAxisIndex: 1,
          hoverAnimation: false,
          data: temp
        },
        {
          name: '湿度',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 8,
          hoverAnimation: false,
          data: humi
        },
        {
          name: '气压',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 2,
          symbolSize: 8,
          hoverAnimation: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(88,160,253,1)'
              }, {
                offset: 0.5, color: 'rgba(88,160,253,0.7)'
              }, {
                offset: 1, color: 'rgba(88,160,253,0)'
              }]
            }
          },
          lineStyle: {
            normal: {
              color: 'rgba(88,160,253,1)'
            }
          },
          itemStyle: {
            normal: {
              color: 'rgba(88,160,253,1)'
            }
          },
          data: press
        },

      ]
    };

    return option;
  }

  render() {
    return (<>
      <NavigationTree
        // QCAUse="1"
        checkpPol={5}
        polShow
        // choice
        domId="#weatherAnalysis"
        onItemClick={value => {
          if (value.length && value[0].IsEnt === false) {
            let DGIMNs = value.find(item => {
              if (item.IsEnt === false) {
                return item.key
              }
            })
            this.setState({
              DGIMN: DGIMNs.key,
            }, () => {
              this.getWeatherAnalysisData()
            })
          }
        }}
      />
      <div id="weatherAnalysis">
        <BreadcrumbWrapper>
          <Card
            title={this.cardTitle()}
          >
            <ReactEcharts
              ref={echart => { this.myChart = echart }}
              option={this.getOptions()}
              lazyUpdate={true}
              style={{ height: 'calc(100vh - 260px)', width: '100%' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </BreadcrumbWrapper>
      </div>
    </>
    );
  }
}

export default index;