import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd'
import styles from '@/pages/home/index.less';
import Marquee from '@/components/Marquee'
import ReactSeamlessScroll from 'react-seamless-scroll';
import ReactEcharts from 'echarts-for-react';
import { router } from 'umi';


@connect(({ loading, home }) => ({
  warningInfoList: home.warningInfoList,
  theme: home.theme,
}))
class QCAPassRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.entCode !== nextProps.entCode) {
    }
  }


  // 智能质控
  getOption = (type) => {
    const { theme } = this.props;
    let legendData = [];
    let color = [];
    let seriesName = '';

    let datas = {
      value: 78,
      company: "%",
      ringColor: [{
        offset: 0,
        color: '#02d6fc' // 0% 处的颜色
      }, {
        offset: 1,
        color: '#367bec' // 100% 处的颜色
      }]
    }

    let option = {
      // color: color,
      // color: ['#4b4b4e'],
      // color: this.props.theme === "dark" ? ['#4b4b4e'] : ['rgb(233 233 233)'],
      // animation: false,
      grid: {
        left: '10px',
        right: '10px',
        bottom: '10px',
        top: '30px',
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{b}:{c}%",
        // position: [10, 20]
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['零点核查', '量程核查', '响应时间核查', '示值误差核查']
      },
      xAxis: {
        type: 'category',
        // axisLabel: {
        //   color: '#fff',
        //   fontSize: 12
        // },
        axisLine: {
          lineStyle: {
            color: theme === 'dark' ? '#fff' : '#000'
          }
        },
        axisLabel: {
          color: theme === 'dark' ? '#fff' : '#000',
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          }
        },
        data: ['零点', '量程', '响应时间', '示值误差']
      },
      yAxis: {
        name: '%',
        type: 'value',
        splitLine: {
          show: false,
        },
        // axisLabel: {
        //   color: '#fff',
        //   fontSize: 12
        // },
        axisLine: {
          // show: false,
          lineStyle: {
            color: theme === 'dark' ? '#fff' : '#000'
          }
        },
        axisLabel: {
          color: theme === 'dark' ? '#fff' : '#000',
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          }
        },
      },
      series: [
        {
          data: [100, 100, 100, 100],
          type: 'bar',
          barWidth: '30%',
          tooltip: {
            valueFormatter: function (value) {
              return value + ' %';
            }
          },
          itemStyle: {
            normal: {
              //这里是重点
              color: function (params) {
                //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                var colorList = ['#21c7de', '#73c0de', '#fac858', '#92cc75'];
                return colorList[params.dataIndex]
              }
            }
          }
          // showBackground: true,
          // backgroundStyle: {
          //   color: 'rgba(180, 180, 180, 0.2)'
          // }
        }
      ]
    };
    return option;
  }

  // 柱状图点击事件
  onChartClick = (opt) => {
    console.log('opt', opt)
    let modalType = '', title = '';
    switch (opt.dataIndex) {
      case 0:
        // 零点
        modalType = 'zeroCheck';
        title = '质控数据查询 - 零点核查'
        break;
      case 1:
        // 量程
        modalType = 'rangeCheck';
        title = '质控数据查询 - 量程核查'
        break;
      case 2:
        // 响应时间
        modalType = 'resTimeCheck';
        title = '质控数据查询 - 响应时间核查'
        break;
      case 3:
        // 示值误差
        modalType = 'errorValueCheck';
        title = '质控数据查询 - 示值误差核查'
        break;
    }
    this.onShowModal(modalType, title);
  }

  onShowModal = (modalType, title) => {
    this.props.dispatch({
      type: 'home/updateState',
      payload: {
        yanshiVisible: true,
        modalType: modalType,
        yanshiModalTitle: title
      }
    })
  }

  render() {
    const { warningInfoList } = this.props;
    return (
      <>
        <div className={styles.title} style={{ marginBottom: 12 }}>
          <p>质控合格率</p>
        </div>
        <div className={styles.marqueeContent}>
          <Tooltip title="点击查看质控记录" color={'#2F4F60'}>
            <div className={styles.passRateContent} onClick={() => {
            }}>
              {/* <div className={styles.topContent}>
                <p className={styles.entPointName}><i></i>华能北京热电厂</p>
              </div> */}
              <div className={styles.chartContent}>
                <ReactEcharts
                  option={this.getOption(3)}
                  style={{ height: '100%', width: '100%' }}
                  theme="light"
                  onEvents={{ 'click': this.onChartClick }}
                />
              </div>
              {/* <p className={styles.rate}>质控合格率</p> */}
            </div>
          </Tooltip>
        </div>
      </>
    );
  }
}

export default QCAPassRate;