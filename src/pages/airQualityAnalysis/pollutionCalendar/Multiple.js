import React, { PureComponent } from 'react'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import ReactEcharts from 'echarts-for-react';
import NavigationTree from '@/components/NavigationTree'
import { Card, Space, DatePicker, Button, Spin, Row } from 'antd'
import { connect } from 'dva';
import moment from 'moment';
import echarts from 'echarts/lib/echarts'

const { RangePicker } = DatePicker;

const legendStyle = {
  display: 'inline-block',
  width: 14,
  height: 8,
  verticalAlign: 'middle',
  borderRadius: 0,
  marginRight: 8,
  position: 'relative',
  top: -1
}
@connect(({ loading, airQualityAnalysis, common }) => ({
  pollutantList: common.pollutantCode,
  calendarData: airQualityAnalysis.calendarData,
  loading: loading.effects["airQualityAnalysis/getPolCalendar"]
}))
class Single extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: [],
      time: [moment().subtract(4, 'month'), moment()]
    };
  }

  cardTitle = () => {
    return <Space>
      <RangePicker disabledDate={(current) => {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
      }}
        picker="month" value={this.state.time} onChange={(date, dateStr) => {
          this.setState({ time: date })
        }} />
      <Button type="primary" onClick={this.getPolCalendar}>查询</Button>
    </Space>
  }

  getPolCalendar = () => {
    const { time, DGIMN } = this.state;
    let format = '';
    if (moment().format("YYYY-MM") === moment(time[1]).format('YYYY-MM')) {
      format = 'YYYY-MM-DD 23:59:59'
    } else {
      let days = moment(time[1], "YYYY-MM").daysInMonth()
      format = `YYYY-MM-${days} 23:59:59`
    }
    this.props.dispatch({
      type: 'airQualityAnalysis/getPolCalendar',
      payload: {
        DGIMN: DGIMN,
        BeginTime: moment(time[0]).format('YYYY-MM-01 00:00:00'),
        EndTime: moment(time[1]).format(format),
      }
    })
  }

  getOptions = (groupItemData) => {
    const { calendarData } = this.props;

    // console.log('cardBodyWidth=', cardBodyWidth)
    // var heatmapData = [];
    // var calendarNumData = [];
    // for (var i = 0; i < calendarData.length; i++) {
    //   heatmapData.push([
    //     dateList[i][0],
    //     Math.random() * 300
    //   ]);
    //   calendarNumData.push([
    //     dateList[i][0],
    //     1,
    //   ]);
    // }
    if (groupItemData.Data) {

      let ele = document.querySelector('.ant-card-body');
      let baseLeft = 0;
      if (ele) {
        let cardBodyWidth = document.querySelector('.ant-card-body').clientWidth;
        baseLeft = (cardBodyWidth - 48 - 60) / 3
      }


      let series = [];
      let calendar = [];
      groupItemData.Data.map((item, idx) => {
        let dateList = [];
        let AQIData = [];
        let baseTop = idx < 6 ? 350 : 320;
        item.dateList.map((date, i) => {
          dateList.push([date, 1])
          AQIData.push([date, item.valueList[i], item.colorList[i]])
        })

        series.push({
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 1,
          calendarIndex: idx * 2,
          label: {
            show: true,
            formatter: function (params) {
              let day = moment(params.data[0]).format("DD")
              return day;
            },
            color: '#000'
          },
          data: dateList
        }, {
          name: 'AQI',
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: idx * 2 + 1,
          itemStyle: {
            color: (params) => {
              // console.log("params22=", params)
              // if (params.data[1] > 100) {
              return params.data[2]
              // }
              return item.colorList[params.seriesIndex]

            }
          },
          data: AQIData
        })

        calendar.push({
          orient: 'vertical',
          yearLabel: {
            margin: 40,
            nameMap: 'cn'
          },
          monthLabel: {
            nameMap: 'cn',
            margin: 20
          },
          dayLabel: {
            firstDay: 1,
            nameMap: 'cn'
          },
          cellSize: 36,
          left: idx === 0 ? 60 : baseLeft * (idx % 3) + 60,
          top: idx >= 3 ? Math.floor(idx / 3) * baseTop : 80,
          range: item.date
        },
          {
            orient: 'vertical',
            yearLabel: {
              show: false,
              margin: 40,
              nameMap: 'cn'
            },
            monthLabel: {
              show: false,
              nameMap: 'cn',
              margin: 20
            },
            dayLabel: {
              show: false,
              firstDay: 1,
              nameMap: 'cn'
            },
            cellSize: 36,
            left: idx === 0 ? 60 : baseLeft * (idx % 3) + 60,
            top: idx >= 3 ? Math.floor(idx / 3) * baseTop : 80,
            range: item.date
          })
      })

      console.log("series=", series)
      console.log("calendar=", calendar)
      let option = {
        tooltip: {
          // formatter: function (params) {
          //   return '降雨量: ' + params.value[1].toFixed(2);
          // }
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          }
        },
        calendar: calendar,
        series: series
      }
      return option;
    }
  }


  cardExtra = () => {
    return <Space>
      <div> <i style={{ ...legendStyle, backgroundColor: '#00e400' }}></i>优</div>
      <div> <i style={{ ...legendStyle, backgroundColor: '#f3dd22' }}></i>良</div>
      <div> <i style={{ ...legendStyle, backgroundColor: '#ff7e00' }}></i>轻度污染</div>
      <div> <i style={{ ...legendStyle, backgroundColor: '#ff0000' }}></i>中度污染</div>
      <div> <i style={{ ...legendStyle, backgroundColor: '#99004c' }}></i>重度污染</div>
      <div> <i style={{ ...legendStyle, backgroundColor: '#7e0023' }}></i>严重污染</div>
    </Space>
  }

  render() {
    const { calendarData, loading } = this.props;
    return (
      <>
        <NavigationTree
          // QCAUse="1"
          checkpPol={5}
          polShow
          choice
          domId="#Single"
          onItemClick={value => {
            console.log('value=', value)
            if (value.length) {
              let DGIMNsList = value.filter(item => item.IsEnt === false)
              this.setState({
                DGIMN: DGIMNsList.map(item => item.key)
              }, () => {
                this.getPolCalendar();
              })
            } else {
              message.error("请在左侧勾选监测点")
            }
          }}
        />
        <div id="Single">
          <BreadcrumbWrapper>
            <Card
              title={this.cardTitle()}
              extra={this.cardExtra()}
              bodyStyle={{
                height: 'calc(100vh - 230px)', overflowY: 'auto'
              }}
            >
              {
                loading ?
                  <div className="example">
                    <Spin />
                  </div>
                  :
                  calendarData.map(item => {
                    return <Row>
                      <p style={{ display: 'block', width: '100%', fontSize: '18px', fontWeight: '500', lineHeight: '50px', borderBottom: '1px solid #f0f0f0' }}>{item.PointName}</p>
                      <ReactEcharts
                        option={this.getOptions(item)}
                        lazyUpdate={true}
                        style={{ height: Math.ceil(item.Data.length / 3) * 310, width: '100%' }}
                        className="echarts-for-echarts"
                        theme="my_theme"
                      />
                    </Row>
                  })
              }

            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default Single;