/*
 * @Author: Jiaqi
 * @Date: 2020-05-27 10:18:38
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-28 16:10:28
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
  startTime: newHome.startTime,

}))
class AlarmResponse extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      dataIndex: 0,
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: "newHome/getAlarmResponseData",
      payload: {

      }
    })

    this.echartsInstance = this.echartsReactRef.getEchartsInstance();
    this.zr = this.echartsInstance.getZr();

    this.zr.on('click', (...rest) => {
      var xIndex = this.echartsInstance.convertFromPixel({ seriesIndex: 0 }, [rest[0].offsetX, rest[0].offsetY]);
      var index = parseInt(xIndex);
      // console.log(index);
      // console.log('App:onClickChart', rest);
      if(index >= 0) {
        this._SELF_.dataIndex = index
        this.getTrippingAlarmResponse(index)
      }
    });
  }

  barOptions = () => {
    // color: ["#67a2ef", "#0edaad", "#fd6c6c", "f6b322"],
    const { month, alarmResponseData: { taskCount, taskYearCount, execptionCount, execptionYearCount } } = this.props;
    // const month = moment(startTime).get('month');
    return {
      // color: ["#fd6c6c", "#fd6c6c", "#f6b322", "#f6b322"],
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (params[0].dataIndex === 0 || params[0].dataIndex === 1) {
            return `${params[0].marker}异常报警响应：${params[0].value}次`
          }
          if (params[0].dataIndex === 2 || params[0].dataIndex === 3) {
            return `${params[0].marker}超标报警核实：${params[0].value}次`
          }
        },
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top: 40,
        left: '3%',
        right: '3%',
        bottom: '6%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: [`${month}月响应`, `${month + 1}月响应`, `${month}月核实`, `${month + 1}月核实`]
      },
      yAxis: {
        type: 'value',
        name: "（次）",
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
          barMaxWidth: 40,
          itemStyle: {
            color: function (params) {
              var colorList = ['#FF9800', '#ffd065', '#fd6c6c', '#FF5722'];
              return colorList[params.dataIndex]
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              if (params.value) {
                return `${params.value}`
              }
            }
          },
          data: [execptionYearCount, execptionCount, taskYearCount, taskCount]
          // data: [20, 11, 44, 32]
        }
      ]
      // series: [
      //   {
      //     name: '异常报警响应',
      //     type: 'bar',
      //     barMaxWidth: 40,
      //     itemStyle: {
      //       color: "#f6b322"
      //     },
      //     label: {
      //       show: true,
      //       position: 'top',
      //       formatter: (params) => {
      //         if (params.value) {
      //           return `${month + 1}月响应${params.value}次`
      //         }
      //       }
      //     },
      //     data: [execptionCount]
      //     // data: [11]
      //   },
      //   {
      //     name: '异常报警响应环比',
      //     type: 'bar',
      //     barMaxWidth: 40,
      //     itemStyle: {
      //       color: "#FF9800"
      //     },
      //     label: {
      //       show: true,
      //       position: 'top',
      //       formatter: (params) => {
      //         if (params.value) {
      //           return `${month}月响应${params.value}次`
      //         }
      //       }
      //     },
      //     data: [execptionYearCount]
      //     // data: [22]
      //   },
      //   {
      //     name: '超标报警核实',
      //     type: 'bar',
      //     itemStyle: {
      //       color: "#fd6c6c"
      //     },
      //     label: {
      //       show: true,
      //       position: 'top',
      //       formatter: (params) => {
      //         if (params.value) {
      //           return `${month + 1}月核实${params.value}次`
      //         }
      //       },
      //     },
      //     data: [taskCount]
      //     // data: [3]
      //   },
      //   {
      //     name: '超标报警核实环比',
      //     type: 'bar',
      //     itemStyle: {
      //       color: "#FF5722"
      //     },
      //     label: {
      //       show: true,
      //       position: 'top',
      //       formatter: (params) => {
      //         if (params.value) {
      //           return `${month}月核实${params.value}次`
      //         }
      //       },
      //     },
      //     data: [taskYearCount]
      //     // data: [33]
      //   },
      // ]
    }
  };

  getTrippingAlarmResponse = (dataIndex) => {
    let title = "";
    switch (dataIndex) {
      case 0:
        title = "异常报警响应";
        break;
      case 1:
        title = "异常报警响应";
        break;
      case 2:
        title = "超标报警核实";
        break;
      case 3:
        title = "超标报警核实";
        break;
    }
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
    const { modelTitle, drillDownAlarmResponseVisible, month, alarmResponseData: { taskCount, taskYearCount, taskYearRate, execptionCount, execptionYearCount, execptionYearRate } } = this.props;
    const { title } = this.state;
    // const month = moment(startTime).get('month') + 1;
    return (
      <div className={styles["group-item"]}>
        <div className={styles["item-title"]} style={{ marginBottom: 20 }}>
          报警响应情况
        </div>
        {
          <div className={styles["warningInfo"]}>
            <i style={{ background: "#ffd065" }}></i>
            <span>{`${month + 1}月异常报警响应${execptionCount}次`}{execptionYearRate !== 0 ? (`,环比${execptionYearRate > 0 ? "增长" : "减少"}${Math.abs(execptionYearRate)}%`) : ""}</span>
          </div>
        }
        {
          <div className={styles["warningInfo"]}>
            <i></i>
            <span>{`${month + 1}月超标报警核实${taskCount}次`}{taskYearRate !== 0 ? (`，环比${taskYearRate > 0 ? "增长" : "减少"}${Math.abs(taskYearRate)}%`) : ""}</span>
          </div>
        }
        <ReactEcharts
          option={this.barOptions()}
          ref={(e) => {
            this.echartsReactRef = e;
          }}
          // onEvents={{
          //   click: (e) => {
          //     this._SELF_.dataIndex = e.dataIndex;
          //     this.getTrippingAlarmResponse(e.dataIndex)
          //   }
          // }}
          style={{ height: '180px', marginBottom: 20 }}
          className="echarts-for-echarts"
          theme="my_theme"
        />
        <DrillDownAlarmResponseModel chartClick={() => {
          this.getTrippingAlarmResponse(this._SELF_.dataIndex);
        }} />
      </div>
    );
  }
}

export default AlarmResponse;
