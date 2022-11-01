import React, { PureComponent } from 'react'
import styles from './index.less'
import { Row, Col, Select, Spin } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva'
import { CaretDownOutlined } from '@ant-design/icons'
@connect(({ loading, common, dataAnalyze }) => ({
  powerData: dataAnalyze.powerData,
  electricChainData: dataAnalyze.electricChainData,
  electricTrendData: dataAnalyze.electricTrendData,
  loading1: loading.effects['dataAnalyze/GetPowerWork'],
  loading2: loading.effects['dataAnalyze/GetPowerCompare'],
  loading3: loading.effects['dataAnalyze/GetPowerTrend'],
}))
class ElectricYoYAndMoM extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      entAndPointList: [],
      selectedPointData: { title: "全部", key: "" },
      selectEntAndPointData: { children: [] },
      entCode: '',
      DGIMNs: '',
      dataType: 0,
      trendShowType: 'Chain'
    };

    this.SELF = {
      dataTypeList: [
        {
          text: '日',
          value: 0
        },
        {
          text: '月',
          value: 1
        },
        {
          text: '年',
          value: 2
        },
      ]
    }
  }

  componentDidMount() {
    this.getEntAndPoint();
  }


  // 获取企业及排口
  getEntAndPoint = () => {
    this.props.dispatch({
      type: 'common/getEntAndPointList',
      payload: {
        "PollutantTypes": "37",
        RunState: "1",
        Status: []
      },
      callback: (res) => {
        console.log('res=', res);
        this.setState({
          entAndPointList: res,
          selectedEntName: res[0].EntName,
          selectEntAndPointData: res[0],
          // entCode: res[0].key,
          // DGIMNs: res[0].children.map(child => child.key),
          // pointCodes: 'fad86752-4d83-4f26-b944-0f7426122462,8400783b-711a-42cb-a7cf-056d9a240e67',
        }, () => { this.getPageAllData() })
      }
    })
  }

  // 初始化页面数据
  getPageAllData = () => {
    this.GetPowerWork();
    this.GetPowerCompare();
    this.GetPowerTrend();
  }

  // 获取功率数据
  GetPowerWork = () => {
    const entCode = this.state.selectEntAndPointData.key;
    const DGIMNs = this.state.selectedPointData.key;
    this.props.dispatch({
      type: 'dataAnalyze/GetPowerWork',
      payload: {
        "entCode": entCode,
        "DGIMNs": DGIMNs ? [DGIMNs] : [],
        // "DGIMNs": [861210050775991, 861210050955775]
      }
    })
  }

  // 获取电能环比
  GetPowerCompare = () => {
    const entCode = this.state.selectEntAndPointData.key;
    const DGIMNs = this.state.selectedPointData.key;
    this.props.dispatch({
      type: 'dataAnalyze/GetPowerCompare',
      payload: {
        "entCode": entCode,
        "DGIMNs": DGIMNs ? [DGIMNs] : []
        // "DGIMNs": [861210050775991, 861210050955775]
      }
    })
  }

  // 获取电能趋势
  GetPowerTrend = () => {
    const { dataType, selectEntAndPointData, selectedPointData } = this.state;
    const entCode = selectEntAndPointData.key;
    const DGIMNs = selectedPointData.key;
    this.props.dispatch({
      type: 'dataAnalyze/GetPowerTrend',
      payload: {
        "entCode": entCode,
        "DGIMNs": DGIMNs ? [DGIMNs] : [],
        // "DGIMNs": [861210050775991, 861210050955775],
        "timeType": dataType,
      }
    })
  }

  // 选择企业
  onEntClick = (selected) => {
    if (this.state.selectEntAndPointData.key !== selected.key) {
      this.setState({ selectEntAndPointData: selected }, () => { this.onPointClick({ key: "", title: '全部' }) })
    }
  }

  // 选择排口
  onPointClick = (selected) => {
    if (this.state.selectedPointData.key !== selected.key) {
      this.setState({ selectedPointData: selected }, () => { this.getPageAllData() })
    }
  }

  getOption = () => {
    const { powerData: { chartData } } = this.props;
    let lineColor = ['#abaeb6', '#394f8e'];
    let option = {
      color: ['#e0747b', '#9baab8'],
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
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
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
        data: chartData.timeList
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
          name: '今日',
          type: 'line',
          // stack: 'Total',
          data: chartData.nlist,
        },
        {
          name: '昨日',
          type: 'line',
          // stack: 'Total',
          data: chartData.ylist,
        },
      ]
    };
    return option;
  }

  getBarOption = () => {
    const { electricTrendData } = this.props;
    const { trendShowType, dataType } = this.state;
    console.log('trendShowType=', trendShowType);
    let seriesName1, seriesName2;

    if (trendShowType === 'Chain') {
      // 环比
      switch (dataType) {
        case 0:
          seriesName1 = '当月';
          seriesName2 = '上月';
          break;
        case 1:
          seriesName1 = '当月';
          seriesName2 = '上月';
          break;
        case 2:
          seriesName1 = '当年';
          seriesName2 = '上年';
          break;
      }
    } else {
      // 同比
      switch (dataType) {
        case 0:
          seriesName1 = '当月';
          seriesName2 = '去年同月';
          break;
        case 1:
          seriesName1 = '当月';
          seriesName2 = '去年同月';
          break;
        case 2:
          seriesName1 = '当年';
          break;
      }
    }

    let lineColor = ['#abaeb6', '#394f8e'];
    let option = {
      color: ['#599be7', '#ffc107'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '4%',
        right: '4%',
        top: '10%',
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
        data: electricTrendData.timeList
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
          name: seriesName1,
          type: 'bar',
          barWidth: '30%',
          data: electricTrendData.baseData,

        },
        {
          name: seriesName2,
          type: 'bar',
          barWidth: '30%',
          data: trendShowType === 'Chain' ? electricTrendData.monthOnMonth : electricTrendData.yearOnYear,

        },
        // {
        //   name: 'Direct1',
        //   type: 'bar',
        //   barWidth: '30%',
        //   data: [3, 3.4, 4, 3, 3.9, 4.4, 5, 5.1, 5.5, 6, 6.1]
        // }
      ]
    };
    return option;
  }

  onDataTypeChange = (data) => {
    if (this.state.dataType !== data.value) {
      this.setState({
        dataType: data.value
      }, () => {
        this.GetPowerTrend();
      })
    }
  }

  render() {
    const { powerData, electricChainData, loading1, loading2, loading3 } = this.props;
    const { entAndPointList, selectedEntName, selectedPointData, selectEntAndPointData, dataType, trendShowType } = this.state;
    console.log('powerData=', powerData);
    return (
      <div
        className={styles.pageWrapper}
      >
        <div className={styles.entAndPointSelectWrapper}>
          <div className={styles.before}>
            <span></span>
            <span></span>
          </div>
          {/* 选择企业 */}
          <div className={styles.selectContent}>
            <span className={styles.text}>
              {selectEntAndPointData.EntName}
              <CaretDownOutlined style={{ marginLeft: 10 }} />
            </span>
            <ul className={styles.selectListBox}>
              {
                entAndPointList.map(item => {
                  return <li
                    onClick={() => this.onEntClick(item)}
                    className={item.EntName === selectEntAndPointData.EntName ? styles.active : ''}
                  >{item.EntName}</li>
                })
              }
            </ul>
          </div>
          {/* 选择排口 */}
          <div className={styles.selectContent}>
            <span className={styles.text}>
              {selectedPointData.title}
              <CaretDownOutlined style={{ marginLeft: 10 }} />
            </span>
            <ul className={styles.selectListBox}>
              <li
                onClick={() => this.onPointClick({ key: "", title: '全部' })}
                className={selectedPointData.key === "" ? styles.active : ''}>
                全部
              </li>
              {
                selectEntAndPointData.children.map(item => {
                  return <li onClick={() => this.onPointClick(item)} className={selectedPointData.key === item.key ? styles.active : ''}>{item.title}</li>
                })
              }
            </ul>
          </div>
        </div>
        <div className={styles.pageContainer}>
          <Spin spinning={loading1} wrapperClassName={styles.spinWrapper}>
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
                          <p style={{ fontSize: 20, color: '#56c384', fontWeight: 500 }}>{powerData.peakPower.peakPowerN.value}<span style={{ fontSize: 13 }}>kW</span></p>
                          <p style={{ fontSize: 12 }}>{powerData.peakPower.peakPowerN.time}</p>
                        </div>
                      </Col>
                    </Row>
                    <Row className={styles.groupItem}>
                      <Col flex="90px" style={{ backgroundColor: '#56c384' }}>
                        <p style={{ fontWeight: 500, fontSize: 16 }}>昨日</p>
                      </Col>
                      <Col flex="auto">
                        <div>
                          <p style={{ fontSize: 20, color: '#56c384', fontWeight: 500 }}>{powerData.peakPower.peakPowerY.value}<span style={{ fontSize: 13 }}>kW</span></p>
                          <p style={{ fontSize: 12 }}>{powerData.peakPower.peakPowerY.time}</p>
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
                          <p style={{ fontSize: 20, color: '#5b9ed7', fontWeight: 500 }}>{powerData.peakYDL.PeackUseElectricityN.value}<span style={{ fontSize: 13 }}>kW·h</span></p>
                          <p style={{ fontSize: 12 }}>{powerData.peakYDL.PeackUseElectricityN.time}</p>
                        </div>
                      </Col>
                    </Row>
                    <Row className={styles.groupItem}>
                      <Col flex="90px" style={{ backgroundColor: '#5b9ed7' }}>
                        <p style={{ fontWeight: 500, fontSize: 16 }}>昨日</p>
                      </Col>
                      <Col flex="auto">
                        <div>
                          <p style={{ fontSize: 20, color: '#5b9ed7', fontWeight: 500 }}>{powerData.peakYDL.PeackUseElectricityY.value}<span style={{ fontSize: 13 }}>kW·h</span></p>
                          <p style={{ fontSize: 12 }}>{powerData.peakYDL.PeackUseElectricityY.time}</p>
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
          </Spin>
          <div className={styles.Down}>
            <div className={styles.DownLeft}>
              <Spin spinning={loading2} wrapperClassName={styles.spinWrapper}>
                <div className={styles.box}>
                  <div className={styles.title}>
                    <p>电能环比<img src="/01.png" alt="" /></p>
                  </div>
                  <div className={styles.boxContent}>
                    <Row gutter={[8, 8]}>
                      <Col span={8} >
                        <div className={styles.DownLeftGroupItem}>
                          <p>{electricChainData.Day.useElectricityN}</p>
                          <span>今日用电量(kWh)</span>
                        </div>
                      </Col>
                      <Col span={8} >
                        <div className={styles.DownLeftGroupItem}>
                          <p>{electricChainData.Day.useElectricityY}</p>
                          <span>昨日同期(kWh)</span>
                        </div>
                      </Col>
                      <Col span={8} >
                        <div className={styles.DownLeftGroupItem}>
                          <p className={styles.trend}>
                            <span>{electricChainData.Day.trend[0]}</span>
                            <span>{electricChainData.Day.trend[1]}kWh</span>
                          </p>
                          <span>趋势</span>
                        </div>
                      </Col>
                      <Col span={8} >
                        <div className={styles.DownLeftGroupItem}>
                          <p>{electricChainData.Month.useElectricityN}</p>
                          <span>当月用电(kWh)</span>
                        </div>
                      </Col>
                      <Col span={8} >
                        <div className={styles.DownLeftGroupItem}>
                          <p>{electricChainData.Month.useElectricityY}</p>
                          <span>上月同期(kWh)</span>
                        </div>
                      </Col>
                      <Col span={8} >
                        <div className={styles.DownLeftGroupItem}>
                          <p className={styles.trend}>
                            <span>{electricChainData.Month.trend[0]}</span>
                            <span>{electricChainData.Month.trend[1]}kWh</span>
                          </p>
                          <span>趋势</span>
                        </div>
                      </Col>
                      <Col span={8} >
                        <div className={styles.DownLeftGroupItem}>
                          <p>{electricChainData.Year.useElectricityN}</p>
                          <span>当年用电(kWh)</span>
                        </div>
                      </Col>
                      <Col span={8} >
                        <div className={styles.DownLeftGroupItem}>
                          <p>{electricChainData.Year.useElectricityY}</p>
                          <span>上年同期(kWh)</span>
                        </div>
                      </Col>
                      <Col span={8} >
                        <div className={styles.DownLeftGroupItem}>
                          <p className={styles.trend}>
                            <span>{electricChainData.Year.trend[0]}</span>
                            <span>{electricChainData.Year.trend[1]}kWh</span>
                          </p>
                          <span>趋势</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Spin>
            </div>
            <div className={styles.DownRight}>
              <Spin spinning={loading3} wrapperClassName={styles.spinWrapper}>
                <div className={styles.box}>
                  <div className={styles.title} style={{ overflow: 'initial' }}>
                    <p>电能趋势<img src="/01.png" alt="" /></p>
                    <p className={styles.titleBtns}>
                      {
                        this.SELF.dataTypeList.map(item => {
                          return <span className={dataType === item.value ? styles.active : ''} onClick={() => this.onDataTypeChange(item)}>{item.text}</span>
                        })
                      }
                    </p>
                  </div>
                  <div className={styles.boxContent}>
                    <div className={styles.btns}>
                      <p>
                        <span onClick={() => this.setState({
                          trendShowType: 'Chain'
                        })} className={trendShowType === 'Chain' ? styles.active : ''}>
                          环比
                        </span>
                        <i></i>
                        <span onClick={() => this.setState({
                          trendShowType: 'Year'
                        })} className={trendShowType === 'Year' ? styles.active : ''}
                        >
                          同比
                        </span>
                      </p>
                    </div>
                    <ReactEcharts
                      option={this.getBarOption()}
                      style={{ height: '90%', width: '100%' }}
                      loading={true}
                    // theme="my_theme"
                    />
                  </div>
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default ElectricYoYAndMoM;