/*
 * @Author: Jiaqi
 * @Date: 2020-05-27 10:18:38
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-24 08:52:37
 * @Description: 大屏 - 报警响应情况组件
 */
import React, { PureComponent } from 'react'
import styles from '../index.less'
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva'
import moment from 'moment'
import DrillDownAlarmResponseModel from "./DrillDownAlarmResponseModel"



@connect(({ loading, newHome }) => ({
  alarmResponseData: newHome.alarmResponseData,
  drillDownAlarmResponseVisible: newHome.drillDownAlarmResponseVisible,
  modelTitle: newHome.modelTitle,
}))
class AlarmResponse extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: "newHome/getAlarmResponseData",
      payload: {

      }
    })
  }

  barOptions = () => {
    // color: ["#67a2ef", "#0edaad", "#fd6c6c", "f6b322"],
    const { alarmResponseData: { taskCount, taskYearCount, execptionCount, execptionYearCount } } = this.props;
    const month = moment().get('month');
    return {
      // color: ["#fd6c6c", "#fd6c6c", "#f6b322", "#f6b322"],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top: 20,
        left: '6%',
        right: '6%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        // data: [`${month}月核实`, `${month + 1}月核实`, `${month}月响应`, `${month + 1}月响应`]
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '异常报警响应',
          type: 'bar',
          itemStyle: {
            color: "#f6b322"
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              if (params.value) {
                return `${month + 1}月响应${params.value}次`
              }
            }
          },
          data: [execptionCount]
          // data: [11]
        },
        {
          name: '异常报警响应环比',
          type: 'bar',
          itemStyle: {
            color: "#FF9800"
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              if (params.value) {
                return `${month}月响应${params.value}次`
              }
            }
          },
          data: [execptionYearCount]
          // data: [22]
        },
        {
          name: '超标报警核实',
          type: 'bar',
          itemStyle: {
            color: "#fd6c6c"
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              if (params.value) {
                return `${month + 1}月核实${params.value}次`
              }
            },
          },
          data: [taskCount]
          // data: [3]
        },
        {
          name: '超标报警核实环比',
          type: 'bar',
          itemStyle: {
            color: "#FF5722"
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              if (params.value) {
                return `${month}月核实${params.value}次`
              }
            },
          },
          data: [taskYearCount]
          // data: [33]
        },
      ]
    }
  };

  getTrippingAlarmResponse = (title) => {
    // this.setState({ title })
    this.props.dispatch({
      type: "newHome/updateState",
      payload: {
        alarmResponseVisible: true,
        taskModelType: "alarmResponse",
        modelTitle: title,
      }
    })
    this.props.dispatch({
      type: "newHome/getTrippingAlarmResponse",
    })
  }

  render() {
    const { modelTitle, drillDownAlarmResponseVisible, alarmResponseData: { taskCount, taskYearCount, taskYearRate, execptionCount, execptionYearCount, execptionYearRate } } = this.props;
    const { title } = this.state;
    const month = moment().get('month') + 1;
    return (
      <div className={styles["group-item"]}>
        <div className={styles["item-title"]} style={{ marginBottom: 20 }}>
          报警响应情况
        </div>
        {
          <div className={styles["warningInfo"]}>
            <i style={{ background: "#f6b322" }}></i>
            <span>{`${month}月异常报警响应${execptionCount}次`}{execptionYearRate !== 0 ? (`,环比${execptionYearRate > 0 ? "增长" : "减少"}${execptionYearRate}%`) : ""}</span>
          </div>
        }
        {
          <div className={styles["warningInfo"]}>
            <i></i>
            <span>{`${month}月超标报警核实${taskCount}次`}{taskYearRate !== 0 ? (`，环比${taskYearRate > 0 ? "增长" : "减少"}${taskYearRate}%`) : ""}</span>
          </div>
        }
        <ReactEcharts
          option={this.barOptions()}
          onEvents={{
            click: (e) => {
              this.getTrippingAlarmResponse(e.seriesName)
            }
          }}
          style={{ height: '180px', marginBottom: 20 }}
          className="echarts-for-echarts"
          theme="my_theme"
        />
        <DrillDownAlarmResponseModel chartClick={() => {
          this.getTrippingAlarmResponse(modelTitle);
        }} />}
      </div>
    );
  }
}

export default AlarmResponse;
