import React, { PureComponent } from 'react';
import styles from '../index.less'
import { Divider, Popover, Icon } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import DrillDownTaskModal from "./DrillDownTaskModal"
import isEqual from 'lodash/isEqual';
import TaskStatistics from './TaskStatistics'
const TASK_TYPE = ["cooperationInspectionComplete,cooperationInspectionUnfinished,配合检查", "matchingComplete,matchingUnfinished,配合对比", "manualComparisonComplete,manualComparisonUnfinished,手工对比", "verificationTestComplete,verificationTestUnfinished,检验测试", "maintenanceRepairComplete,maintenanceRepairUnfinished,维修维护", "calibrationComplete,calibrationUnfinished,校准", "onSiteInspectionComplete,onSiteInspectionUnfinished,巡检"];

let dataIndex = undefined;

@connect(({ loading, newHome }) => ({
  operationAnalysis: newHome.operationAnalysis,
}))
class Operations extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // 获取任务分类统计数据
    this.props.dispatch({
      type: "newHome/getOperationAnalysis",
      payload: {

      }
    })

    this.echartsInstance = this.echartsReactRef.getEchartsInstance();
    this.zr = this.echartsInstance.getZr();

    this.zr.on('click', (...rest) => {
      var indexArr = this.echartsInstance.convertFromPixel({ seriesIndex: 0 }, [rest[0].offsetX, rest[0].offsetY]);
      var index = indexArr[1];
      console.log('index=',index)
      if(index >= 0 && TASK_TYPE[index]) {
        dataIndex = index;
        this.getTrippingOperationAnalysis(index)
      }
    });

  }

  option = () => {
    const { operationAnalysis: {
      verificationTestComplete, verificationTestUnfinished,
      maintenanceRepairComplete, cooperationInspectionComplete, matchingComplete, manualComparisonComplete, calibrationComplete, onSiteInspectionComplete,
      maintenanceRepairUnfinished, cooperationInspectionUnfinished, matchingUnfinished, manualComparisonUnfinished, calibrationUnfinished, onSiteInspectionUnfinished
    } } = this.props;
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '-18%',
        top: "4%",
        right: '9%',
        bottom: '-6%',
        containLabel: true
      },
      xAxis: {
        show: false,
      },
      yAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 14,
          align: "left",
          margin: 86,
        },
        data: ['配合检查', '配合对比', '手工对比', '校验测试', '维修维护', '校准', '巡检',]
      },
      series: [
        {
          name: '已完成',
          type: 'bar',
          stack: '总量',
          color: "#67a2ef",
          // barMinHeight: 10,
          barWidth: "24px",
          label: {
            show: true,
            position: 'left',
            formatter: (params) => {
              if (params.value === 0) { return "" } else { return params.value }
            }
          },
          data: [cooperationInspectionComplete, matchingComplete, manualComparisonComplete, verificationTestComplete, maintenanceRepairComplete, calibrationComplete, onSiteInspectionComplete]
        },
        {
          name: '未完成',
          type: 'bar',
          stack: '总量',
          color: "#0edaad",
          // barMinHeight: 10,
          barWidth: "24px",
          label: {
            show: true,
            position: 'right',
            formatter: (params) => { 
              if (params.value === 0) { return "" } else { return params.value }
            }
          },
          data: [cooperationInspectionUnfinished, matchingUnfinished, manualComparisonUnfinished, verificationTestUnfinished, maintenanceRepairUnfinished, calibrationUnfinished, onSiteInspectionUnfinished]
        },

      ]
    };
  }


  // 任务分类统计
  getTrippingOperationAnalysis = (dataIndex) => {
    // this.setState({ title })
    this.props.dispatch({
      type: "newHome/updateState",
      payload: {
        drillDownTaskVisible: true,
      }
    })
    this.props.dispatch({
      type: "newHome/getTrippingOperationAnalysis",
      payload: {
        taskType: TASK_TYPE[dataIndex]
      }
    })
  }

  clickCallback = (index) => {
    this.getTrippingOperationAnalysis(index !== undefined ? index : dataIndex)
  }


  render() {
    const { operationAnalysis } = this.props;
    return (
      <div className={styles["group-item"]}>
        <div className={styles["item-title"]}>
          运维分析
              </div>
        <div className={styles["item-content"]}>
          <div className={styles.innerTitle}>
            任务分类统计
                <span><i></i>已完成</span>
            <span><i style={{ backgroundColor: "#0edaad" }}></i>未完成</span>
          </div>
          <ReactEcharts
            option={this.option()}
            ref={(e) => {
              this.echartsReactRef = e;
            }}
            // onEvents={{
            //   click: (params) => {
            //     dataIndex = params.dataIndex
            //     this.getTrippingOperationAnalysis(params.dataIndex)
            //   }
            // }}
            style={{ height: '260px', width: '100%' }}
            theme="my_theme"
          />
          <Divider style={{ margin: "10px 0", marginTop: 4 }} />
          <TaskStatistics />
        </div>
        <DrillDownTaskModal chartClick={this.clickCallback} />
      </div>
    );
  }
}

export default Operations;
