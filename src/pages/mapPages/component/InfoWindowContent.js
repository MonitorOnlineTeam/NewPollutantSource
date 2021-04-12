import React, { PureComponent } from 'react'
import styles from '../index.less'
import { Button, Divider, Tooltip } from 'antd';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';

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
  }

  getAirChartOptions = () => {
    const { chartData } = this.props;
    return {
      // color: ['#3398DB'],
      title: {
        text: this.state.currentDescItem.label ? `${this.state.currentDescItem.label} 24小时IAQI柱状图` : '24小时AQI柱状图',
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
    const { selectedPointInfo, curPointData, tableList } = this.props;
    console.log('props=', this.props)
    return (
      <div className={styles.infoWindowContent} style={{ width: 340, minHeight: 360 }}>
        <div className={styles.header}>
          <h2>
            {selectedPointInfo.Abbreviation || curPointData.entName} - {selectedPointInfo.title}
          </h2>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              this.props.onShowPointDetails();
            }}
          >
            进入站点
          </Button>
          <p>
            站点状态：
                <span style={{ color: this.getColor(selectedPointInfo.status) }}>
              {this.getStatusText(selectedPointInfo.status)}
            </span>
          </p>
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
          <ReactEcharts
            className={styles.echartdiv}
            style={{ width: '100%', height: '200px', textAlign: 'center', marginTop: -10 }}
            option={selectedPointInfo == 5 ? this.getAirChartOptions() : this.getPointChartOptions()}
            notMerge
            lazyUpdate />
          <p>监控时间：{curPointData.MonitorTime}</p>
        </div>
      </div>
    );
  }
}

export default InfoWindowContent;