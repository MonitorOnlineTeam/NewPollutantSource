import React, { PureComponent } from 'react'
import styles from '../index.less'
import { Button, Divider, Tooltip, Empty } from 'antd';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import { airLevel } from '@/pages/monitoring/overView/tools'

class InfoWindowContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentDescItem: {},
    };
  }

  componentDidMount() {
    // this.getInfoWindowData()
  }
  // 获取筛选状态图标颜色
  getColor = status => {
    let color = ''
    switch (status) {
      case 0:// 离线
        color = '#999999'
        break;
      case 1:// 正常
        color = '#34c066'
        break;
      case 2:// 超标
        color = '#f04d4d'
        break;
      case 3:// 异常
        color = '#e94'
        break;
    }
    return color
  }

  getStatusText = status => {
    let statusText = '';
    switch (status) {
      case 0:
        statusText = '离线';
        break;
      case 1:
        statusText = '正常';
        break;
      case 2:
        statusText = '超标';
        break;
      case 3:
        statusText = '异常';
        break;
    }
    return statusText;
  };


  getPollutantGroupContent = () => {
    const { tableList, selectedPointInfo } = this.props;
    let tableList_temp = selectedPointInfo == 5 ? tableList : tableList.filter((itm, index) => index < 6);
    console.log('tableList=', tableList)
    if (tableList && tableList.length) {
      return <ul>
        {tableList.map(item => {
          if (selectedPointInfo.type == 5) {
            return (
              <Tooltip placement="topLeft" title={`${item.label}：${item.value}`}>
                <li
                  onClick={() => {
                    this.setState({
                      currentDescItem: item,
                    })
                    let key = `${item.key}_IAQI`;
                    this.props.onUpdateChart({
                      key,
                      itemKey: item.key,
                      label: item.label,
                      isAirOrSite: true,
                    })
                  }}
                >
                  {item.label}：{item.value}
                </li>
              </Tooltip>
            );
          } else {
            return (
              <Tooltip placement="topLeft" title={`${item.label}：${item.value}`}>
                <li
                  className={styles.point}
                  onClick={() => {
                    console.log('item=', item)
                    this.setState({
                      currentDescItem: item,
                    })
                    this.props.onUpdateChart({
                      key: item.key,
                      label: item.label,
                    })
                  }}
                >
                  {item.label}：{item.value}
                </li>
              </Tooltip>
            )
          }
        })}
      </ul>
    } else {
      return <div style={{ margin: '54px 0' }}>
        <Empty description="暂无数据" imageStyle={{ maring: '50px 0' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    }
  }

  getAirChartOptions = () => {
    const { chartData } = this.props;
    return {
      // color: ['#3398DB'],
      title: {
        text: this.state.currentDescItem.label ? `${this.state.currentDescItem.label} - 24小时IAQI柱状图` : '24小时AQI柱状图',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.75)',
          fontSize: 15,
          fontWeight: '400',
        },
        x: 'center',
        top: 20,
      },
      tooltip: {
        trigger: 'axis',
        formatter(params, ticket, callback) {
          let res = `${params[0].axisValue}时<br/>`;
          params.map(item => {
            res += `${item.seriesName}:${item.value}<br />`;
          });
          return res;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: chartData.xAxisData,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: chartData.legend,
          type: 'bar',
          barWidth: '60%',
          // 10, 52, 200, 334, 390, 330, 220
          data: chartData.seriesData,
        },
      ],
    };
  }

  getPointChartOptions = () => {
    const { chartData } = this.props;
    const { currentDescItem } = this.state;
    console.log('currentDescItem=', currentDescItem)
    let pollutantType = currentDescItem.label ? currentDescItem.label : (this.props.tableList.length && this.props.tableList[0].label);
    return {
      title: {
        text: pollutantType + ' - 24小时趋势图',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.75)',
          fontSize: 15,
          fontWeight: '400',
        },
        x: 'center',
        top: 20,
      },
      // legend: {
      //   data: [chartData.legend],
      //   x: 'left',
      // },
      tooltip: {
        trigger: 'axis',
        formatter(params, ticket, callback) {
          let res = `${params[0].axisValue}时<br/>`;
          params.map(item => {
            res += `${item.seriesName}:${item.value}<br />`;
          });
          return res;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        show: true,
        // right: 15,
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.xAxisData,
      },
      yAxis: {
        type: 'value',
        nameTextStyle: {
          padding: [10, 0, 0, 28],
        },
        name: currentDescItem.unit ? currentDescItem.unit : (this.props.tableList.length && this.props.tableList[0].unit),
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [{
        type: 'line',
        name: chartData.legend,
        data: chartData.seriesData,
        itemStyle: {
          normal: {
            color: '#54A8FF',
            lineStyle: {
              color: '#54A8FF',
            },
          },
        },
      },
      ],
    };
  }

  onClickAQI = () => {
    this.setState({
      currentDescItem: {}
    })
    this.props.onResultData();
  }


  render() {
    const { selectedPointInfo, curPointData, tableList, chartData } = this.props;
    console.log('chartData=', this.props.chartData)
    console.log('props=', this.props)
    return (
      <div className={styles.infoWindowContent} style={{ width: 340, minHeight: 360 }}>
        <div className={styles.header}>
          <h2>
            {selectedPointInfo.Abbreviation || curPointData.entName} - {selectedPointInfo.title}
          </h2>
          <div>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                this.props.onShowPointDetails();
              }}
            >
              进入站点
            </Button>
            {
              selectedPointInfo.BaseType === 1 && <Button
                type="primary"
                size="small"
                style={{ marginTop: 10 }}
                onClick={() => {
                  let params = { ID: "4a805258-b105-49b2-90bb-1189604b589b", Name: "一企一档管理系统", TipsName: "ReactShow", CodeList: "", EntCode: selectedPointInfo.EntCode, EntName: selectedPointInfo.Abbreviation }
                  window.open(`/sessionMiddlePage?sysInfo=${JSON.stringify(params)}`)
                }}
              >
                进入企业
              </Button>
            }
          </div>
          {
            selectedPointInfo.type === '5' && selectedPointInfo.AQI !== '-' ?
              <p>环境质量：
                <span style={{ color: selectedPointInfo.Color }}>
                  {airLevel.find(item => item.value == selectedPointInfo.Level).text}
                </span>
              </p> :
              <p>
                站点状态：
                <span style={{ color: this.getColor(selectedPointInfo.status) }}>
                  {this.getStatusText(selectedPointInfo.status)}
                </span>
              </p>
          }
        </div>
        {/* <div className={styles.desc}>
          <div className={styles['desc-l']}>
            <h3>监测点信息</h3>
            <p>经度：{selectedPointInfo.position.longitude}</p>
            <p>纬度：{selectedPointInfo.position.latitude}</p>
          </div>
        </div> */}
        <div className={styles.data}>
          <h3>
            监测点数据
          </h3>
          {selectedPointInfo.type == 5 && (
            <div style={{ marginBottom: 10, fontSize: 13 }}>
              <span style={{ cursor: 'pointer' }} onClick={this.onClickAQI}>
                AQI：
                <span
                  style={{
                    background: curPointData.AQI_Color,
                    display: 'inline-block',
                    width: 30,
                    textAlign: 'center',
                    height: 20,
                    lineHeight: '20px',
                  }}
                >
                  {curPointData.AQI || '-'}
                </span>
              </span>
              <Divider type="vertical" />
              <span>首要污染物：{curPointData.PrimaryPollutant || '-'}</span>
              <Divider type="vertical" />
              <span>浓度值：{curPointData[curPointData.PrimaryPollutantCode] || '-'}</span>
            </div>
          )}
          {this.getPollutantGroupContent()}
          {
            (tableList && tableList.length && chartData.xAxisData && chartData.xAxisData.length) ?
              <ReactEcharts
                className={styles.echartdiv}
                style={{ width: '100%', height: '200px', textAlign: 'center', marginTop: -10 }}
                option={selectedPointInfo.type == 5 ? this.getAirChartOptions() : this.getPointChartOptions()}
                notMerge
                lazyUpdate /> : ''
          }
          <p>监控时间：{curPointData.MonitorTime}</p>
        </div>
      </div>
    );
  }
}

export default InfoWindowContent;
