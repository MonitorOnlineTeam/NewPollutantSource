import React, { PureComponent } from 'react'
import styles from './index.less'
import { Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';

class ElectricYoYAndMoM extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getOption = () => {
    let lineColor = ['#abaeb6', '#394f8e'];
    let option = {
      color: ['#a43db', '#cc6e7a'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '4%',
        right: '4%',
        top: '14%',
        bottom: '6%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: lineColor[0]
          }
        },
        axisLabel: {
          color: lineColor[0],
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: lineColor[1],
            type: 'dashed'
          }
        },
        data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00',
          '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
      },
      yAxis: {
        name: '单位(kW)',
        type: 'value',
        axisLine: {
          // show: false,
          lineStyle: {
            color: lineColor[0]
          }
        },
        axisLabel: {
          color: lineColor[0],
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: lineColor[1],
            type: 'dashed'
          }
        },
      },
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          data: [0, 15, 1, 1, 3, 18, 4, 5, 4, 3, 2, 17, 2, 3, 4, 5, 2, 4, 17]
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          data: [2, 2, 3, 1, 2, 1, 1.4, 2.1, 1.5, 1, 3, 2, 13, 3, 4, 1, 2, 4, 15, 5, 1, 2, 3, 4, 5, 15, 4, 4, 3, 2, 1, 20]
        },
      ]
    };
    return option;
  }

  getBarOption = () => {
    let lineColor = ['#abaeb6', '#394f8e'];
    let option = {
      color: ['#599be7'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '4%',
        right: '4%',
        top: '14%',
        bottom: '6%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: lineColor[0]
          }
        },
        axisLabel: {
          color: lineColor[0],
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: lineColor[1],
            type: 'dashed'
          }
        },
        axisTick: {
          alignWithLabel: true
        },
        data: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
      },
      yAxis: {
        name: 'kW·h',
        type: 'value',
        axisLine: {
          // show: false,
          lineStyle: {
            color: lineColor[0]
          }
        },
        axisLabel: {
          color: lineColor[0],
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: lineColor[1],
            type: 'dashed'
          }
        },
      },
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '40%',
          data: [3, 3.4, 4, 3, 3.9, 4.4, 5, 5.1, 5.5, 6, 6.1]
        }
      ]
    };
    return option;
  }

  render() {
    return (
      <div
        className={styles.pageWrapper}
        ref={(div) => { this.div = div }}
        id="characteristicPollutant"
      >
        <div className={styles.entWrapper}>
          xxx电力企业
        </div>
        <div className={styles.pageContainer}>
          <div className={styles.Up}>
            <div className={styles.UpLeft}>
              <div className={styles.box}>
                <div className={styles.title}>
                  <p>功率峰值<img src="/01.png" alt="" /></p>
                </div>
                <div className={styles.boxContent}>
                  <Row className={styles.groupItem}>
                    <Col flex="90px" style={{ backgroundColor: '#56c384' }}>
                      <p style={{ fontWeight: 500, fontSize: 16 }}>今日</p>
                    </Col>
                    <Col flex="auto">
                      <div>
                        <p style={{ fontSize: 20, color: '#56c384', fontWeight: 500 }}>17.065<span style={{ fontSize: 13 }}>kW</span></p>
                        <p style={{ fontSize: 12 }}>02:15</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className={styles.groupItem}>
                    <Col flex="90px" style={{ backgroundColor: '#56c384' }}>
                      <p style={{ fontWeight: 500, fontSize: 16 }}>昨日</p>
                    </Col>
                    <Col flex="auto">
                      <div>
                        <p style={{ fontSize: 20, color: '#56c384', fontWeight: 500 }}>20.842<span style={{ fontSize: 13 }}>kW</span></p>
                        <p style={{ fontSize: 12 }}>16:45</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className={styles.box}>
                <div className={styles.title}>
                  <p>用电量峰值<img src="/01.png" alt="" /></p>
                </div>
                <div className={styles.boxContent}>
                  <Row className={styles.groupItem}>
                    <Col flex="90px" style={{ backgroundColor: '#5b9ed7' }}>
                      <p style={{ fontWeight: 500, fontSize: 16 }}>今日</p>
                    </Col>
                    <Col flex="auto">
                      <div>
                        <p style={{ fontSize: 20, color: '#5b9ed7', fontWeight: 500 }}>5.09<span style={{ fontSize: 13 }}>kW·h</span></p>
                        <p style={{ fontSize: 12 }}>09:00</p>
                      </div>
                    </Col>
                  </Row>
                  <Row className={styles.groupItem}>
                    <Col flex="90px" style={{ backgroundColor: '#5b9ed7' }}>
                      <p style={{ fontWeight: 500, fontSize: 16 }}>昨日</p>
                    </Col>
                    <Col flex="auto">
                      <div>
                        <p style={{ fontSize: 20, color: '#5b9ed7', fontWeight: 500 }}>7.36<span style={{ fontSize: 13 }}>kW·h</span></p>
                        <p style={{ fontSize: 12 }}>18:00</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div className={styles.UpRight}>
              <div className={styles.box}>
                <div className={styles.title}>
                  <p>功率曲线<img src="/01.png" alt="" /></p>
                </div>
                <div className={styles.boxContent}>
                  <ReactEcharts
                    option={this.getOption()}
                    style={{ height: '100%', width: '100%' }}
                  // theme="my_theme"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.Down}>
            <div className={styles.DownLeft}>
              <div className={styles.box}>
                <div className={styles.title}>
                  <p>电能环比<img src="/01.png" alt="" /></p>
                </div>
                <div className={styles.boxContent}>
                  <Row gutter={[8, 8]}>
                    <Col span={8} >
                      <div className={styles.DownLeftGroupItem}>
                        <p>33.39</p>
                        <span>今日用电量(kWh)</span>
                      </div>
                    </Col>
                    <Col span={8} >
                      <div className={styles.DownLeftGroupItem}>
                        <p>12.39</p>
                        <span>昨日同期(kWh)</span>
                      </div>
                    </Col>
                    <Col span={8} >
                      <div className={styles.DownLeftGroupItem}>
                        <p className={styles.trend}>
                          <span>+172.35%</span>
                          <span>+21.13kWh</span>
                        </p>
                        <span>趋势</span>
                      </div>
                    </Col>
                    <Col span={8} >
                      <div className={styles.DownLeftGroupItem}>
                        <p>4016.33</p>
                        <span>当月用电(kWh)</span>
                      </div>
                    </Col>
                    <Col span={8} >
                      <div className={styles.DownLeftGroupItem}>
                        <p>5039.39</p>
                        <span>上月同期(kWh)</span>
                      </div>
                    </Col>
                    <Col span={8} >
                      <div className={styles.DownLeftGroupItem}>
                        <p className={styles.trend}>
                          <span>-20.29%</span>
                          <span>-1022.51kWh</span>
                        </p>
                        <span>趋势</span>
                      </div>
                    </Col>
                    <Col span={8} >
                      <div className={styles.DownLeftGroupItem}>
                        <p>24451.19</p>
                        <span>当年用电(kWh)</span>
                      </div>
                    </Col>
                    <Col span={8} >
                      <div className={styles.DownLeftGroupItem}>
                        <p>78437.93</p>
                        <span>上年同期(kWh)</span>
                      </div>
                    </Col>
                    <Col span={8} >
                      <div className={styles.DownLeftGroupItem}>
                        <p className={styles.trend}>
                          <span>-68.83%</span>
                          <span>-53986.27kWh</span>
                        </p>
                        <span>趋势</span>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div className={styles.DownRight}>
              <div className={styles.box}>
                <div className={styles.title}>
                  <p>电能趋势<img src="/01.png" alt="" /></p>
                </div>
                <div className={styles.boxContent}>
                  <ReactEcharts
                    option={this.getBarOption()}
                    style={{ height: '100%', width: '100%' }}
                  // theme="my_theme"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ElectricYoYAndMoM;