import React, { Component } from 'react';
import { connect } from 'dva';
import styles from '@/pages/home/index.less';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Progress, Statistic } from 'antd';
import ReactEcharts from 'echarts-for-react';
@connect(({ loading, home }) => ({
  taskCountData: home.taskCountData,
  operationsWarningData: home.operationsWarningData,
  alarmAnalysis: home.alarmAnalysis,
}))
class OperationStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: window.screen.width === 1600 ? 50 : 70,
    };
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
    // 获取运维 - 任务数量统计
    dispatch({
      type: "home/getTaskCount",
      payload: {
        entCode,
        DGIMN
      }
    })
    // 获取运维 - 预警统计
    dispatch({
      type: "home/getExceptionProcessing",
      payload: {
        entCode,
        DGIMN
      }
    })
    // 获取运维 - 异常报警及响应情况
    dispatch({
      type: "home/getAlarmAnalysis",
      payload: {
        entCode,
        DGIMN
      }
    })
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

  render() {
    const { taskCountData, currentMonth, operationsWarningData, alarmAnalysis } = this.props;
    return <>
      <div className={styles.title}>
        <p>运维统计</p>
      </div>
      <div className={styles.content} style={{ height: 'calc(100% - 30px)', overflowY: 'auto' }}>
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
        <div className={styles.line}></div>
        <div className={styles.statisticContent}>
          <p>{currentMonth}月质控智能预警<span>{operationsWarningData.ThisMonthEP}</span>次</p>
          <div className={styles.statisticInfo}>
            {
              operationsWarningData.ThisMonthTB > 0 ? (
                <Statistic title={<span>同比</span>} valueStyle={{ color: "#5bf287", fontSize: 18 }} value={operationsWarningData.ThisMonthTB} prefix={<CaretUpOutlined />} />
              ) : <Statistic title={<span>同比</span>} valueStyle={{ color: "#FF4E4E", fontSize: 18 }} value={operationsWarningData.ThisMonthTB} prefix={<CaretDownOutlined />} />
            }
            {
              operationsWarningData.ThisMonthHB > 0 ? (
                <Statistic title={<span>环比</span>} valueStyle={{ color: "#5bf287", fontSize: 18 }} value={operationsWarningData.ThisMonthHB} prefix={<CaretUpOutlined />} />
              ) : <Statistic title={<span>环比</span>} valueStyle={{ color: "#FF4E4E", fontSize: 18 }} value={operationsWarningData.ThisMonthHB} prefix={<CaretDownOutlined />} />
            }
          </div>
        </div>
        <div className={styles.line}></div>
        {/* 异常报警及响应情况 */}
        <div className={styles.abnormalAlarmContent}>
          <p style={{ marginBottom: 0 }}>{currentMonth}月异常报警及响应情况</p>
          <div className={styles.content}>
            <ReactEcharts
              option={this.getOperationOptions()}
              style={{ height: '180px' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
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
    </>;
  }
}

export default OperationStatistics;