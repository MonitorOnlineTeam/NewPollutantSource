import React, { Component } from 'react';
import {
  Row,
  Col,
  Spin,
  Progress,
  Radio,
  Button,
  Statistic,
  Icon,
} from 'antd';
import ReactEcharts from 'echarts-for-react';
import { routerRedux } from 'dva/router';
import {
  connect
} from 'dva';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import moment from 'moment';
import { getPointStatusImg } from '@/utils/getStatusImg';
import { onlyOneEnt } from '../../config';
import config from '../../config';
import styles from './index.less';
import Link from 'umi/link';
import Time from '@/components/Time';
import Marquee from '@/components/Marquee'

const RadioButton = Radio.Button;
const { RunningRate, TransmissionEffectiveRate, amapKey } = config;
let _thismap;

@connect(({ loading, home }) => ({
  pollutantTypeList: home.pollutantTypeList,
  AllMonthEmissionsByPollutant: home.AllMonthEmissionsByPollutant,
  rateStatisticsByEnt: home.rateStatisticsByEnt,
  pointData: home.pointData,
  warningInfoList: home.warningInfoList,
  taskCountData: home.taskCountData,
  operationsWarningData: home.operationsWarningData,
  alarmAnalysis: home.alarmAnalysis,
}))
class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: window.screen.width === 1600 ? 50 : 70,
      currentMonth: moment().format('MM') * 1,
      position: [
        0, 0
      ],
      zoom: window.innerWidth > 1600 ? 13 : 12,
      // zoom: 13,
      visible: false,
      pointName: null,
      radioDefaultValue: "",
    };
    this.mapEvents = {
      created(m) {
        _thismap = m;
      },
      zoomchange: (value) => {

      },
      complete: () => {
        //_thismap.setZoomAndCenter(13, [centerlongitude, centerlatitude]);
      }
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取污染物类型
    dispatch({
      type: "home/getPollutantTypeList",
      payload: {
      },
    });
    // 获取排污许可情况
    dispatch({
      type: "home/getAllMonthEmissionsByPollutant",
      payload: {
        entCode: null
      }
    })
    // 获取智能质控数据
    dispatch({
      type: "home/getRateStatisticsByEnt",
      payload: {
        entCode: null
      }
    })
    // 智能监控数据
    dispatch({
      type: "home/getStatisticsPointStatus",
      payload: {
        entCode: null
      },
    });
    // 获取报警信息
    dispatch({
      type: "home/getWarningInfo",
      payload: {
        entCode: null
      }
    })
    // 获取运维 - 任务数量统计
    dispatch({
      type: "home/getTaskCount",
      payload: {
        entCode: null
      }
    })
    // 获取运维 - 预警统计
    dispatch({
      type: "home/getExceptionProcessing",
      payload: {
        entCode: null
      }
    })
    // 获取运维 - 异常报警及响应情况
    dispatch({
      type: "home/getAlarmAnalysis",
      payload: {
        entCode: null
      }
    })
  }

  /**地图 */
  getpolygon = (polygonChange) => {
    let res = [];
    // if (polygonChange) {
    if (true) {
      let arr = [[[[118.475539, 38.972743], [118.556735, 39.013169], [118.567378, 39.001297], [118.592612, 38.968339], [118.519485, 38.918138], [118.510043, 38.918138], [118.487384, 38.938036], [118.496997, 38.944979], [118.475711, 38.971275], [118.474853, 38.971142]]], [[[118.475539, 38.972743], [118.556735, 39.013169], [118.567378, 39.001297], [118.592612, 38.968339], [118.519485, 38.918138], [118.510043, 38.918138], [118.487384, 38.938036], [118.496997, 38.944979], [118.475711, 38.971275], [118.474853, 38.971142]]], [[[118.475539, 38.972743], [118.556735, 39.013169], [118.567378, 39.001297], [118.592612, 38.968339], [118.519485, 38.918138], [118.510043, 38.918138], [118.487384, 38.938036], [118.496997, 38.944979], [118.475711, 38.971275], [118.474853, 38.971142]]]];
      for (let i = 0; i < arr.length; i++) {
        res.push(<Polygon
          key={
            i
          }
          style={
            {
              strokeColor: '#FF33FF',
              strokeOpacity: 0.2,
              strokeWeight: 3,
              fillColor: '#1791fc',
              fillOpacity: 0.1,
            }
          }
          path={
            arr[i]
          }
        />);
      }
    }
    return res;
  }

  mapEvents = {
    created(m) {
      _thismap = m;
    },
    zoomchange: (value) => { },
    complete: () => {
    }
  };

  //地图点位点击
  markersEvents = {
    click: (MapsOption, marker) => {
      const itemdata = marker.F ? marker.F.extData : marker.B.extData;
      this.treeCilck(itemdata);
    }
  };

  // 智能质控
  getOption = (type) => {
    const { rateData } = this.props.rateStatisticsByEnt;
    console.log('rateData-', rateData)
    let networkeRate = rateData.NetworkeRate === undefined ? 0 : (parseFloat(rateData.NetworkeRate) * 100).toFixed(0);
    let runningRate = rateData.RunningRate === undefined ? 0 : (parseFloat(rateData.RunningRate) * 100).toFixed(0);
    let transmissionEffectiveRate = rateData.TransmissionEffectiveRate === undefined ? 0 : (parseFloat(rateData.TransmissionEffectiveRate) * 100).toFixed(0);

    let legendData = [];
    let color = [];
    let seriesName = '';
    let seriesData = [];
    if (type === 1) {
      legendData = ['正常', '离线'];
      color = ['rgb(86,244,133)', 'rgb(32,99,81)'];
      seriesName = '实时联网率';
      seriesData = [
        { value: networkeRate, name: '正常' },
        { value: 100 - networkeRate, name: '离线' }
      ];
    } else if (type === 2) {
      legendData = ['达标', '未达标'];
      if (parseFloat(runningRate) >= RunningRate) {
        color = ['rgb(86,244,133)', 'rgb(32,99,81)'];
      } else {
        color = ['rgb(255,78,78)', 'rgb(32,99,81)'];
      }
      seriesName = '设备运转率';
      seriesData = [
        { value: runningRate, name: '达标' },
        { value: (100 - runningRate).toFixed(2), name: '未达标' }
      ];
    } else {
      legendData = ['达标', '未达标'];
      if (parseFloat(transmissionEffectiveRate) >= TransmissionEffectiveRate) {
        color = ['rgb(86,244,133)', 'rgb(32,99,81)'];
      } else {
        color = ['rgb(255,78,78)', 'rgb(32,99,81)'];
      }
      seriesName = '传输有效率';
      seriesData = [
        { value: transmissionEffectiveRate, name: '达标' },
        { value: (100 - transmissionEffectiveRate).toFixed(2), name: '未达标' }
      ];
    }
    let option = {
      color: color,
      // animation: false,
      title: {
        show: false,
        text: seriesName,
        textAlign: 'center',
        x: '65',
        y: '115',
        padding: 0,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bolder',
          color: '#72A0BA',
        }
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{b}:{d}%",
        position: [10, 20]
      },

      legend: {
        orient: 'vertical',
        x: 'left',
        data: []
      },
      series: [
        {
          name: '智能质控',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          hoverAnimation: true,
          // silent: true,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: function () {
                if (type === 1) {
                  return `${networkeRate}%`;
                }
                if (type === 2) {
                  return `${runningRate}%`;
                }
                return `${transmissionEffectiveRate}%`;
              },
              textStyle: {
                fontSize: 14,
                color: '#fff',
              }
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold'
              }
            }
          },
          data: seriesData
        }
      ]
    };
    return option;
  }

  // 排污情况图表
  getlicense = (type) => {
    const {
      ycdate,
      ycdata,
      ycAnalData,
      eyhldate,
      eyhldata,
      eyhlAnalData,
      dyhwdate,
      dyhwdata,
      dyhwAnalData,
    } = this.props.AllMonthEmissionsByPollutant;
    let currentMonth = this.state.currentMonth;
    let color = [];
    let SumDisplacement = 0;//总排量
    let Displacemented = 0;//已排放
    let SurplusDisplacement = 0;//剩余排量
    let xAxisData = [];//月
    let seriesData = [];//排量
    let title = null;
    let i = 1;
    if (type === 1) {
      let outed = 0;
      SurplusDisplacement = ycAnalData.length !== 0 ? ycAnalData.Remainder.toFixed(2) : 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        title = `余${SurplusDisplacement}(t)`;
      } else {
        title = `超${Math.abs(SurplusDisplacement)}(t)`;
      }
      ycdata.map((ele) => {

        if (Number.parseInt(currentMonth) < i) {
          seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
        } else {
          seriesData.push(ele == 0 ? { value: ele, itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } } : ele);
        }
        i++;
      });
      xAxisData = ycdate;
      color = ['#0edaad'];
    } else if (type === 2) {
      let outed = 0;
      SurplusDisplacement = eyhlAnalData.length !== 0 ? eyhlAnalData.Remainder.toFixed(2) : 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        //  title = `余${SurplusDisplacement}(t)`;
        title = `余${SurplusDisplacement}(t)`;
      } else {
        title = `超${Math.abs(SurplusDisplacement)}(t)`;
      }
      eyhldata.map((ele) => {
        if (Number.parseInt(currentMonth) < i) {
          seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
        } else {
          seriesData.push(ele == 0 ? { value: ele, itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } } : ele);
        }
        i++;
      });
      xAxisData = dyhwdate;
      color = ['#03b3ff'];

    } else {
      SurplusDisplacement = dyhwAnalData.length !== 0 ? dyhwAnalData.Remainder.toFixed(2) : 0;
      let outed = 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        title = `余${SurplusDisplacement}(t)`;
      } else {
        title = `超${Math.abs(SurplusDisplacement)}(t)`;
      }
      dyhwdata.map((ele) => {
        if (Number.parseInt(currentMonth) < i) {
          seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
        } else {
          seriesData.push(ele == 0 ? { value: ele, itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } } : ele);
        }
        i++;
      });
      xAxisData = eyhldate;

      color = ['#40ccdd'];
    }
    let option = {
      title: {
        text: title,
        x: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bolder',
          color: color
        }
      },
      color: color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '-10%',
        right: '4%',
        bottom: '-10%',
        containLabel: true
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value'
        }
      ],
      series: [
        {
          name: '约排放',
          type: 'bar',
          barWidth: '60%',
          data: seriesData,
        }
      ]
    };
    return option;
  }

  // 运维统计图表
  getOperationOptions = () => {
    const { alarmAnalysis } = this.props;
    let seriesData = [];
    seriesData = [
      {
        value: alarmAnalysis.LessThan2Hour,
        name: '二小时内响应'
      },
      {
        value: alarmAnalysis.GreaterThan8Hour,
        name: '超八小时响应'
      },
      {
        value: alarmAnalysis.OtherTime,
        name: '其他'
      }
    ];
    let option = {
      color: ['rgb(77,199,140)', 'rgb(90,203,254)', 'rgb(234,203,0)'],
      // tooltip: false,
      // calculable: false,
      series: [{
        name: '异常报警及响应情况',
        type: 'pie',
        radius: [40, this.state.screenWidth],
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            label: {
              // show: false,
              formatter: "{c}次",
              textStyle: {
                color: 'red',
                fontSize: '18',
                fontFamily: '微软雅黑',
                fontWeight: 'bold'
              }
            }
          }
        },
        data: seriesData
      }]
    };
    return option;
  }

  /**渲染污染物列表 */
  renderPollutantTypelist = () => {
    const { pollutantTypeList } = this.props;
    let res = [];
    if (pollutantTypeList) {
      res.push(<RadioButton value="" style={{ top: -1 }}>全部</RadioButton>);
      pollutantTypeList.map((item, key) => {
        let type = "";
        if (item.pollutantTypeCode == 2) { type = "△" }  // 废气
        if (item.pollutantTypeCode == 1) { type = "○" }  // 废水
        if (item.pollutantTypeCode == 10) { type = "☆" }  // 厂界voc
        if (item.pollutantTypeCode == 12) { type = "□" }  // 厂界扬尘
        res.push(<RadioButton key={key} value={item.pollutantTypeCode}>{item.pollutantTypeName} <span style={{ fontSize: 16 }} >{type}</span></RadioButton>)
      })
    }
    return res;
  }

  render() {
    const {
      pointName,
      position,
      visible,
      currentMonth
    } = this.state;
    const { pointData, warningInfoList, taskCountData, operationsWarningData, alarmAnalysis } = this.props;
    let pointposition = position;
    let pointvisible = visible;
    let polygonChange;
    let mapCenter = [118.525284, 38.971049];
    const ele = document.querySelector(".antd-pro-pages-home-index-excessiveAbnormalWrapper");
    let height = 0;
    if (ele) {
      height = ele.offsetHeight - 30;
    }
    console.log('height=', height)
    console.log('taskCountData=', taskCountData)

    return (
      <div className={styles.homeWrapper} style={{ width: '100%', height: 'calc(100vh - 64px)' }}>
        <header className={styles.homeHeader}>
          <p><span>SDL</span> 污染源智能分析系统</p>
          <a className={styles.backMenu} href="" onClick={() => {
            this.props.dispatch(routerRedux.push("/"))
          }}>返回菜单</a>
        </header>
        <Map
          resizeEnable={true}
          events={this.mapEvents}
          zoom={this.state.zoom}
          mapStyle="amap://styles/darkblue"
          amapkey={amapKey}
          center={mapCenter}
        >
          <div className={styles.leftWrapper}>
            {/* 传输有效率  || 智能质控*/}
            <div className={styles.effectiveRate}>
              <div className={styles.title}>
                <p>智能质控</p>
              </div>
              <div className={styles.echartsContent}>
                <div className={styles.echartItem}>
                  <ReactEcharts
                    loadingOption={this.props.loadingRateStatistics}
                    option={this.getOption(1)}
                    style={{ height: '94px', width: '100%' }}
                    theme="my_theme"
                  />
                  <div className={styles.echartsTitle}>实时联网率</div>
                </div>
                <div className={styles.echartItem}>
                  <ReactEcharts
                    loadingOption={this.props.loadingRateStatistics}
                    option={this.getOption(2)}
                    style={{ height: '94px', width: '100%' }}
                    theme="my_theme"
                  />
                  <div className={styles.echartsTitle}>{currentMonth}月设备运转率</div>
                </div>
                <div className={styles.echartItem}>
                  <ReactEcharts
                    loadingOption={this.props.loadingRateStatistics}
                    option={this.getOption(3)}
                    style={{ height: '94px', width: '100%' }}
                    theme="my_theme"
                  />
                  <div className={styles.echartsTitle}>{currentMonth}月传输有效率</div>
                </div>
              </div>
            </div>
            {/* 运维统计 */}
            <div className={styles.operationsWrapper}>
              <div className={styles.title}>
                <p>运维统计</p>
              </div>
              <div className={styles.content}>
                <p className={styles.operationsNumber}>{currentMonth}月共<span>{taskCountData.TaskSum}</span>次运维任务</p>
                <div className={styles.progressContent}>
                  <div className={styles.startIcon}></div>
                  <div className={styles.progress}>
                    <Progress
                      percent={100}
                      successPercent={100}
                      strokeColor="red"
                      showInfo={false}
                      strokeWidth={8}
                    />
                  </div>
                  <div className={styles.endIcon}></div>
                </div>
                <div className={styles.progressInfo}>
                  <p>已完成<span style={{ color: "#61c302" }}>{taskCountData.CompletedTaskSum}</span>次</p>
                  <p>未完成<span style={{ color: "#f30201" }}>{taskCountData.NoCompletedTaskSum}</span>次</p>
                </div>
                <div className={styles.statisticContent}>
                  <p>{currentMonth}月质控智能预警<span>{operationsWarningData.ThisMonthEP}</span>次</p>
                  <div className={styles.statisticInfo}>
                    {
                      operationsWarningData.ThisMonthTB > 0 ? (
                        <Statistic title={<span style={{ color: "#accdec" }}>同比</span>} valueStyle={{ color: "#5bf287", fontSize: 18 }} value={operationsWarningData.ThisMonthTB} prefix={<Icon type="caret-up" />} />
                      ) : <Statistic title={<span style={{ color: "#accdec" }}>同比</span>} valueStyle={{ color: "#FF4E4E", fontSize: 18 }} value={operationsWarningData.ThisMonthTB} prefix={<Icon type="caret-down" />} />
                    }
                    {
                      operationsWarningData.ThisMonthHB > 0 ? (
                        <Statistic title={<span style={{ color: "#accdec" }}>环比</span>} valueStyle={{ color: "#5bf287", fontSize: 18 }} value={operationsWarningData.ThisMonthHB} prefix={<Icon type="caret-up" />} />
                      ) : <Statistic title={<span style={{ color: "#accdec" }}>环比</span>} valueStyle={{ color: "#FF4E4E", fontSize: 18 }} value={operationsWarningData.ThisMonthHB} prefix={<Icon type="caret-down" />} />
                    }
                  </div>
                </div>
                {/* 异常报警及响应情况 */}
                <div className={styles.abnormalAlarmContent}>
                  <div className={styles.contentTitle}>
                    <p style={{ marginBottom: 0 }}>{currentMonth}月异常报警及响应情况</p>
                  </div>
                  <div className={styles.content}>
                    <ReactEcharts
                      loadingOption={this.props.loadingRateStatistics}
                      option={this.getOperationOptions()}
                      style={{ height: '200px' }}
                      className="echarts-for-echarts"
                      theme="my_theme"
                    />
                    {/* <div className={styles.s2}>两小时内响应({aaData.LessThan2Hour})次</div>
      <div className={styles.s3}>{aaData.LessThan2Hourlink > 0 ? `环比上升${aaData.LessThan2Hourlink}%` : `环比下降${Math.abs(aaData.LessThan2Hourlink)}%`}</div>
      <div className={styles.s4}>超八小时响应({aaData.GreaterThan8Hour})次</div>
      <div className={styles.s5}>{aaData.GreaterThan8Hourlink > 0 ? `环比上升${aaData.GreaterThan8Hourlink}%` : `环比下降${Math.abs(aaData.GreaterThan8Hourlink)}%`}</div>
      <div className={styles.s6}>其它({aaData.OtherTime})次</div> */}
                    <div className={styles.chartDescription}>
                      <div className={styles.twoHours}>两小时内响应({alarmAnalysis.LessThan2Hour})次
                        <br />
                        {
                          alarmAnalysis.LessThan2Hourlink > 0 ? `环比上升${alarmAnalysis.LessThan2Hourlink}%` : `环比下降${Math.abs(alarmAnalysis.LessThan2Hourlink)}%`
                        }
                      </div>
                      <div className={styles.eightHours}>
                        超八小时响应({alarmAnalysis.GreaterThan8Hour})次
                        <br />
                        {
                          alarmAnalysis.GreaterThan8Hourlink > 0 ? `环比上升${alarmAnalysis.GreaterThan8Hourlink}%` : `环比下降${Math.abs(alarmAnalysis.GreaterThan8Hourlink)}%`
                        }
                      </div>
                      <div className={styles.other}>其它({alarmAnalysis.OtherTime})次</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 超标异常 */}
            <div className={styles.excessiveAbnormalWrapper}>
              <div className={styles.title} style={{ marginBottom: 12 }}>
                <p>报警信息</p>
              </div>
              {/* <div className={styles.excessiveAbnormalContent}> */}
              <div className={styles.marqueeContent}>
                {
                  height ? <Marquee
                    data={warningInfoList}
                    speed={30}
                    gap={700}
                    height={height}
                    width={400}
                  /> : ""
                }
              </div>
              {/* </div> */}
            </div>
          </div>
          <div className={styles.rightWrapper}>
            {/* 智能监控 */}
            <div className={styles.monitoringContent}>
              <div className={styles.title}>
                <p>智能监控</p>
              </div>
              <div className={styles.content}>
                <div className={styles.line}>
                  <span className={styles.normal}>运行：{pointData.RuningNum}</span>
                  <span className={styles.abnormal}>异常：{pointData.ExceptionNum}</span>
                </div>
                <div className={styles.line}>
                  <span className={styles.overproof}>离线：{pointData.OffLine}</span>
                  <span className={styles.offline}>关停：{pointData.StopNum}</span>
                </div>
                <div className={styles.circular}>
                  <span>{pointData.PointTotal}</span><br />
                  <span>排放口</span>
                </div>
              </div>
            </div>
            {/* 排放量 */}
            <div className={styles.emissionsContent}>
              {/* 氮氧化物排污许可情况 */}
              <div className={styles.NOx}>
                <div className={styles.contentTitle}>
                  <p>氮氧化物排污许可情况</p>
                </div>
                <div className={styles.content}>
                  <div className={styles.echartBox}>
                    <ReactEcharts
                      loadingOption={this.props.loadingRateStatistics}
                      option={this.getlicense(3)}
                      style={{ height: '100%' }}
                      className="echarts-for-echarts"
                      theme="my_theme"
                    />
                  </div>
                  <div className={styles.desc}>
                    本年度累计排放量占比 <br />
                    151%(0.30/0.20)
                  </div>
                </div>
              </div>
              {/* 烟尘物排污许可情况 */}
              <div className={styles.smoke}>
                <div className={styles.contentTitle}>
                  <p>烟尘物排污许可情况</p>
                </div>
                <div className={styles.content}>
                  <div className={styles.echartBox}>
                    <ReactEcharts
                      loadingOption={this.props.loadingRateStatistics}
                      option={this.getlicense(1)}
                      style={{ height: '100%' }}
                      className="echarts-for-echarts"
                      theme="my_theme"
                    />
                  </div>
                  <div className={styles.desc}>
                    本年度累计排放量占比<br />
                    85.5%(0.17/0.20)
                  </div>
                </div>

              </div>
              {/* 二氧化硫排污许可情况 */}
              <div className={styles.SO2}>
                <div className={styles.contentTitle}>
                  <p>二氧化硫排污许可情况</p>
                </div>
                <div className={styles.content} style={{ paddingBottom: 0 }}>
                  <div className={styles.echartBox}>
                    <ReactEcharts
                      loadingOption={this.props.loadingRateStatistics}
                      option={this.getlicense(2)}
                      style={{ height: '100%' }}
                      className="echarts-for-echarts"
                      theme="my_theme"
                    />
                  </div>
                  <div className={styles.desc}>
                    本年度累计排放量占比<br />
                    58%(0.58/1.00)
                  </div>
                </div>
              </div>
            </div>
            {/* 排污税 */}
            <div className={styles.effluentFeeContent}>
              <div className={styles.title}>
                <p>排污税</p>
              </div>
            </div>
          </div>
          <div className={styles.currentInfoWrapper}>
            <div>
              <span>企业</span> <br />
              <span>中日唐山企业</span>
            </div>
            <div>
              <span>当前时间</span> <br />
              <span><Time /></span>
            </div>
            <div>
              <span>统计时间</span> <br />
              <span>{moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}</span>
            </div>
          </div>
          {/**中间污染物类型*/}
          <div
            style={{
              position: 'absolute',
              top: '2%',
              left: 430,
              zIndex: 100
            }}
          >
            <Radio.Group style={{}} defaultValue={this.state.radioDefaultValue} buttonStyle="solid" size="default" onChange={this.onRadioChange}>
              {this.renderPollutantTypelist()}
            </Radio.Group>
          </div>

          <div className={styles.overproofWrapper}>
            <div className={styles.title}>{currentMonth}月超标汇总</div>
            <div className={styles.content}>
              <ul className={styles.colum}>
                <li>污染物</li>
                <li>超标次数</li>
                <li>超标倍数</li>
              </ul>
              <ul>
                <li>烟尘</li>
                <li>5次</li>
                <li>0.2-0.5</li>
              </ul>
              <ul>
                <li>二氧化硫</li>
                <li>3次</li>
                <li>0.1-0.3</li>
              </ul>
              <ul>
                <li>氮氧化物</li>
                <li>6次</li>
                <li>0.6-0.9</li>
              </ul>
            </div>
          </div>
          <Markers
            markers={this.props.datalist}
            events={this.markersEvents}
            className={this.state.special}
            render={(extData) => {
              return getPointStatusImg(extData.status, extData.stop, extData.pollutantTypeCode, 20, "home");
            }}
          />
          {
            this.getpolygon(polygonChange)
          }
          <InfoWindow
            position={pointposition}
            visible={this.state.visible}
            isCustom={true}
            offset={[0, -25]}
          >
            {pointName}
          </InfoWindow>
        </Map>
      </div >
    );
  }
}
export default index;
