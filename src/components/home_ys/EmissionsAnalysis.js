import React, { Component } from 'react';
import { connect } from 'dva';
import styles from '@/pages/home_ys/index.less';
import Marquee from '@/components/Marquee';
import ReactEcharts from 'echarts-for-react';
import { Empty, Tooltip } from 'antd';
import { router } from 'umi';

@connect(({ loading, home }) => ({
  AllMonthEmissionsByPollutant: home.AllMonthEmissionsByPollutant,
  isOnlyCO2: home.isOnlyCO2,
}))
class MonitoringStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.DGIMN !== nextProps.DGIMN || this.props.entCode !== nextProps.entCode) {
      this.getData(nextProps.entCode, nextProps.DGIMN);
    }
  }
  getData = (entCode, DGIMN) => {
    const { dispatch } = this.props;
    // 获取排污许可情况
    dispatch({
      type: 'home/getAllMonthEmissionsByPollutant',
      payload: {
        EntCode: entCode || undefined,
        DGIMN,
      },
    });
  };

  // 排污情况图表
  getlicense = type => {
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
      eyhtdata,
      eyhtdate,
      eyhtAnalData,
    } = this.props.AllMonthEmissionsByPollutant;
    let currentMonth = this.props.currentMonth;
    let color = [];
    let SumDisplacement = 0; //总排量
    let Displacemented = 0; //已排放
    let SurplusDisplacement = 0; //剩余排量
    let xAxisData = []; //月
    let seriesData = []; //排量
    let title = null;
    let i = 1;
    if (type === 1) {
      let outed = 0;
      // SurplusDisplacement = (ycAnalData.length !== 0 && ycAnalData.Remainder) ? ycAnalData.Remainder.toFixed(2) : 0;
      SurplusDisplacement =
        ycAnalData.length !== 0 && ycAnalData.Remainder ? ycAnalData.Remainder : 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        title = `余${SurplusDisplacement}(t)`;
      } else {
        title = `超${Math.abs(SurplusDisplacement)}(t)`;
      }
      ycdata.map(ele => {
        if (Number.parseInt(currentMonth) < i) {
          // seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
          seriesData.push({
            value: outed,
            itemStyle: {
              normal: {
                color: 'transparent',
                barBorderColor: 'tomato',
                barBorderWidth: 1,
                barBorderRadius: 0,
                borderType: 'dotted',
              },
            },
          });
        } else {
          seriesData.push(
            ele == 0
              ? {
                  value: ele,
                  itemStyle: {
                    normal: {
                      color: '#eb5c45',
                      barBorderColor: 'tomato',
                      barBorderWidth: 1,
                      barBorderRadius: 0,
                      borderType: 'dotted',
                    },
                  },
                }
              : ele,
          );
        }
        i++;
      });
      xAxisData = ycdate;
      color = ['#0edaad'];
    } else if (type === 2) {
      let outed = 0;
      // SurplusDisplacement = (eyhlAnalData.length !== 0 && eyhlAnalData.Remainder) ? eyhlAnalData.Remainder.toFixed(2) : 0;
      SurplusDisplacement =
        eyhlAnalData.length !== 0 && eyhlAnalData.Remainder ? eyhlAnalData.Remainder : 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        //  title = `余${SurplusDisplacement}(t)`;
        title = `余${SurplusDisplacement}(t)`;
      } else {
        title = `超${Math.abs(SurplusDisplacement)}(t)`;
      }
      eyhldata.map(ele => {
        if (Number.parseInt(currentMonth) < i) {
          // seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
          seriesData.push({
            value: outed,
            itemStyle: {
              normal: {
                color: 'transparent',
                barBorderColor: 'tomato',
                barBorderWidth: 1,
                barBorderRadius: 0,
                borderType: 'dotted',
              },
            },
          });
        } else {
          seriesData.push(
            ele == 0
              ? {
                  value: ele,
                  itemStyle: {
                    normal: {
                      color: '#eb5c45',
                      barBorderColor: 'tomato',
                      barBorderWidth: 1,
                      barBorderRadius: 0,
                      borderType: 'dotted',
                    },
                  },
                }
              : ele,
          );
        }
        i++;
      });
      xAxisData = dyhwdate;
      color = ['#03b3ff'];
    } else if (type === 3) {
      // SurplusDisplacement = (dyhwAnalData.length !== 0 && dyhwAnalData.Remainder) ? dyhwAnalData.Remainder.toFixed(2) : 0;
      SurplusDisplacement =
        dyhwAnalData.length !== 0 && dyhwAnalData.Remainder ? dyhwAnalData.Remainder : 0;
      let outed = 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        title = `余${SurplusDisplacement}(t)`;
      } else {
        title = `超${Math.abs(SurplusDisplacement)}(t)`;
      }
      dyhwdata.map(ele => {
        if (Number.parseInt(currentMonth) < i) {
          // seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
          seriesData.push({
            value: outed,
            itemStyle: {
              normal: {
                color: 'transparent',
                barBorderColor: 'tomato',
                barBorderWidth: 1,
                barBorderRadius: 0,
                borderType: 'dotted',
              },
            },
          });
        } else {
          seriesData.push(
            ele == 0
              ? {
                  value: ele,
                  itemStyle: {
                    normal: {
                      color: '#eb5c45',
                      barBorderColor: 'tomato',
                      barBorderWidth: 1,
                      barBorderRadius: 0,
                      borderType: 'dotted',
                    },
                  },
                }
              : ele,
          );
        }
        i++;
      });
      xAxisData = eyhldate;

      color = ['#40ccdd'];
    } else if (type === 4) {
      // SurplusDisplacement = (dyhwAnalData.length !== 0 && dyhwAnalData.Remainder) ? dyhwAnalData.Remainder.toFixed(2) : 0;
      SurplusDisplacement =
        eyhtAnalData.length !== 0 && eyhtAnalData.Remainder ? eyhtAnalData.Remainder : 0;
      let outed = 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        title = `余${SurplusDisplacement}(t)`;
      } else {
        title = `超${Math.abs(SurplusDisplacement)}(t)`;
      }
      eyhtdata.map(ele => {
        if (Number.parseInt(currentMonth) < i) {
          // seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
          seriesData.push({
            value: outed.toFixed(2),
            itemStyle: {
              normal: {
                color: 'transparent',
                barBorderColor: 'tomato',
                barBorderWidth: 1,
                barBorderRadius: 0,
                borderType: 'dotted',
              },
            },
          });
        } else {
          seriesData.push(
            ele == 0
              ? {
                  value: ele.toFixed(2),
                  itemStyle: {
                    normal: {
                      color: '#eb5c45',
                      barBorderColor: 'tomato',
                      barBorderWidth: 1,
                      barBorderRadius: 0,
                      borderType: 'dotted',
                    },
                  },
                }
              : ele.toFixed(2),
          );
        }
        i++;
      });
      xAxisData = eyhtdate;

      color = ['#40ccdd'];
    }
    console.log('seriesData', seriesData);
    title = `总排放 ${eyhtAnalData.monthSum.toFixed(2)} (t)`;
    let option = {
      title: {
        text: this.props.DGIMN ? '' : title,
        x: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bolder',
          color: color,
        },
      },
      color: color,
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow',
        },
        formatter: function(params, ticket, callback) {
          let format = `${params[0].axisValue}: `;
          params.map((item, index) => {
            let value = item.value;
            format += `<br />${item.marker}${item.seriesName}: ${value} t`;
          });
          return format;
        },
      },
      grid: {
        left: '-10%',
        right: '4%',
        bottom: '0%',
        containLabel: true,
      },
      xAxis: [
        {
          // show: false,
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            color: '#21c7de',
            fontSize: 12,
          },
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
        },
      ],
      series: [
        {
          name: '约排放',
          type: 'bar',
          barWidth: '60%',
          data: seriesData,
        },
      ],
    };
    return option;
  };

  getEyhtOptions = () => {
    let color = ['#cddc39'];
    let seriesData = [];
    const { eyhtdate, eyhtdata, eyhtAnalData } = this.props.AllMonthEmissionsByPollutant;
    eyhtdata.map(ele => {
      seriesData.push(
        ele == 0
          ? {
              value: ele,
              itemStyle: {
                normal: {
                  color: '#eb5c45',
                  barBorderColor: 'tomato',
                  barBorderWidth: 1,
                  barBorderRadius: 0,
                  borderType: 'dotted',
                },
              },
            }
          : ele,
      );
    });
    let count = eyhtdata.reduce((n, m) => n + m);
    let option = {
      title: {
        text: `总${count}(t)`,
        x: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bolder',
          color: color,
        },
      },
      // color: color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '-10%',
        right: '4%',
        top: '17%',
        bottom: '-10%',
        containLabel: true,
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          data: eyhtdate,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          name: '（t）',
        },
      ],
      series: [
        {
          name: '约排放',
          type: 'bar',
          barWidth: '60%',
          data: seriesData,
        },
      ],
    };
    return option;
  };

  onShowModal = (modalType, title) => {
    this.props.dispatch({
      type: 'home/updateState',
      payload: {
        yanshiVisible: true,
        modalType: modalType,
        yanshiModalTitle: title,
      },
    });
  };

  render() {
    const { AllMonthEmissionsByPollutant, DGIMN, isOnlyCO2 } = this.props;
    const { ycAnalData, eyhlAnalData, dyhwAnalData, eyhtAnalData } = AllMonthEmissionsByPollutant;
    // 计算排污许可情况
    let ycLink;
    if (ycAnalData && ycAnalData.linkFlag !== undefined && ycAnalData.length !== 0) {
      ycLink = `${Math.abs(ycAnalData.linkFlag.toFixed(2))}% (${ycAnalData.monthSum.toFixed(
        2,
      )} /${ycAnalData.flag.toFixed(2)})`;
    }
    let dyhwLink;
    if (dyhwAnalData && dyhwAnalData.linkFlag !== undefined && dyhwAnalData.length !== 0) {
      dyhwLink = `${Math.abs(dyhwAnalData.linkFlag.toFixed(2))}%(${dyhwAnalData.monthSum.toFixed(
        2,
      )}/${dyhwAnalData.flag.toFixed(2)})`;
    }
    let eyhlLink;
    if (eyhlAnalData && eyhlAnalData.linkFlag !== undefined && eyhlAnalData.length !== 0) {
      eyhlLink = `${Math.abs(eyhlAnalData.linkFlag.toFixed(2))}%(${eyhlAnalData.monthSum.toFixed(
        2,
      )}/${eyhlAnalData.flag.toFixed(2)})`;
    }

    let eyhtLink;
    if (eyhtAnalData && eyhtAnalData.linkFlag !== undefined && eyhtAnalData.length !== 0) {
      eyhtLink = `${Math.abs(eyhtAnalData.linkFlag.toFixed(2))}%(${eyhtAnalData.monthSum.toFixed(
        2,
      )}/${eyhtAnalData.flag.toFixed(2)})`;
    }
    console.log('eyhtAnalData', eyhtAnalData);
    if (DGIMN) {
      ycLink = ycAnalData.monthSum;
      dyhwLink = dyhwAnalData.monthSum;
      eyhlLink = eyhlAnalData.monthSum;
      eyhtLink = eyhtAnalData.monthSum;
    }
    return (
      <>
        <div className={styles.title} style={{ marginBottom: 10 }}>
          <p>排放量分析</p>
        </div>
        {dyhwAnalData.monthList ||
        ycAnalData.monthList ||
        eyhlAnalData.monthList ||
        eyhtAnalData.monthList ? (
          <Tooltip title="点击查看排放量分析统计表" color={'#2F4F60'}>
            <div
              style={{
                height: 'calc(100% - 30px)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
              onClick={() => {
                this.onShowModal('monitorComparaAnalysis', '直测与核算碳排放量比对分析统计表');
              }}
            >
              {/* 氮氧化物排污许可情况 */}
              {dyhwAnalData.monthList && (
                <div className={`${styles.NOx} ${styles.content}`}>
                  <div className={styles.contentTitle}>
                    <p>{!DGIMN ? '氮氧化物排污许可情况' : '氮氧化物排污情况'}</p>
                  </div>
                  <div className={styles.pointcontent}>
                    <div className={styles.echartBox}>
                      <ReactEcharts
                        option={this.getlicense(3)}
                        style={{ height: '100%' }}
                        className="echarts-for-echarts"
                        theme="my_theme"
                      />
                    </div>
                    <div className={styles.desc}>
                      {!DGIMN ? '本年度累计排放量占比' : '本年度累计排放量'}
                      <br />
                      {dyhwLink}
                    </div>
                  </div>
                </div>
              )}
              {/* 烟尘物排污许可情况 */}
              {ycAnalData.monthList && (
                <div className={`${styles.smoke} ${styles.content}`}>
                  <div className={styles.contentTitle}>
                    <p>{!DGIMN ? '烟尘排污许可情况' : '烟尘排污情况'}</p>
                  </div>
                  <div className={styles.pointcontent}>
                    <div className={styles.echartBox}>
                      <ReactEcharts
                        option={this.getlicense(1)}
                        style={{ height: '100%' }}
                        className="echarts-for-echarts"
                        theme="my_theme"
                      />
                    </div>
                    <div className={styles.desc}>
                      {!DGIMN ? '本年度累计排放量占比' : '本年度累计排放量'}
                      <br />
                      {ycLink}
                    </div>
                  </div>
                </div>
              )}

              {/* 二氧化硫排污许可情况 */}
              {eyhlAnalData.monthList && (
                <div className={`${styles.SO2} ${styles.content}`}>
                  <div className={styles.contentTitle}>
                    <p>{!DGIMN ? '二氧化硫排污许可情况' : '二氧化硫排污情况'}</p>
                  </div>
                  <div className={styles.pointcontent}>
                    <div className={styles.echartBox}>
                      <ReactEcharts
                        option={this.getlicense(2)}
                        style={{ height: '100%' }}
                        className="echarts-for-echarts"
                        theme="my_theme"
                      />
                    </div>
                    <div className={styles.desc}>
                      {!DGIMN ? '本年度累计排放量占比' : '本年度累计排放量'}
                      <br />
                      {eyhlLink}
                    </div>
                  </div>
                </div>
              )}
              {/* 二氧化碳排污许可情况 */}
              {eyhtAnalData.monthList && (
                <div className={`${styles.CO2} ${styles.content}`}>
                  <div className={styles.contentTitle}>
                    <p>二氧化碳月度变化趋势</p>
                  </div>
                  <div className={styles.pointcontent}>
                    <div className={styles.echartBox}>
                      <ReactEcharts
                        // option={this.getEyhtOptions()}
                        option={this.getlicense(4)}
                        style={{ height: '100%' }}
                        className="echarts-for-echarts"
                        theme="my_theme"
                      />
                    </div>
                    <div className={styles.desc}>
                      {/* {!DGIMN ? '本年度累计排放量占比' : '本年度累计排放量'}
                      <br />
                      {eyhtLink} */}
                    </div>
                  </div>
                </div>
              )}
              {
                // isOnlyCO2 && <div className={`${styles.smoke} ${styles.content}`}>
                //   <div className={styles.contentTitle}>
                //     <p>甲烷排放量统计情况</p>
                //   </div>
                //   <div className={styles.pointcontent} style={{ paddingBottom: 0 }}>
                //     {/* <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> */}
                //     <div className={styles.notData} style={{ width: '100%' }}>
                //       <img src="/nodata1.png" style={{ width: '70px', dispatch: 'block' }} />
                //       <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
                //     </div>
                //   </div>
                // </div>
              }
              {
                // isOnlyCO2 && <div className={`${styles.SO2} ${styles.content}`}>
                //   <div className={styles.contentTitle}>
                //     <p>氧化亚氮排放量统计情况</p>
                //   </div>
                //   <div className={styles.pointcontent} style={{ paddingBottom: 0 }}>
                //     {/* <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> */}
                //     <div className={styles.notData} style={{ width: '100%' }}>
                //       <img src="/nodata1.png" style={{ width: '70px', dispatch: 'block' }} />
                //       <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
                //     </div>
                //   </div>
                // </div>
              }
            </div>
          </Tooltip>
        ) : (
          <div className={styles.notData}>
            <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
            <p style={{ color: '#d5d9e2', fontSize: 16, fontWeight: 500 }}>暂无数据</p>
          </div>
        )}
      </>
    );
  }
}

export default MonitoringStatus;
