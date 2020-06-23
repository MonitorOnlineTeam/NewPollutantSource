import React, { PureComponent } from 'react';
import styles from '../index.less'
import { Divider, Popover, Icon } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import DrillDownTaskModal from "./DrillDownTaskModal"
import isEqual from 'lodash/isEqual';
const TASK_TYPE = ["cooperationInspectionComplete, cooperationInspectionUnfinished,配合检查", "matchingComplete, matchingUnfinished, 配合对比", "manualComparisonComplete, manualComparisonUnfinished, 手工对比", "verificationTestComplete, verificationTestUnfinished, 检验测试", "maintenanceRepairComplete, maintenanceRepairUnfinished, 维修维护", "calibrationComplete, calibrationUnfinished, 校准", "onSiteInspectionComplete, onSiteInspectionUnfinished, 巡检"];

let dataIndex = undefined;

@connect(({ loading, newHome }) => ({
  taskStatisticsData: newHome.taskStatisticsData,
  operationAnalysis: newHome.operationAnalysis,
  modelTitle: newHome.modelTitle,
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
    // 获取任务统计数据
    this.props.dispatch({
      type: "newHome/getTaskStatisticsData",
      payload: {

      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.modelTitle !== nextProps.modelTitle) {
      return false;
    }
    // if (this.props.taskModelType !== nextProps.taskModelType) {
    //   return false;
    // }
    return true;
  }

  option = () => {
    const { taskStatisticsData: { insidePlan, UnInsidePlan, insidePlanRate } } = this.props;
    return {
      color: ["#f6b322", "#0edaad"],
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}' + "次"
      },
      series: [
        {
          name: '',
          type: 'pie',
          // radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: UnInsidePlan, name: '计划外' },
            { value: insidePlan, name: '计划' },
          ],
          label: {
            show: true,
            textStyle: {
              fontSize: 13,
              color: '#333',
            },
            padding: [0, 10, 0, 0],
            textShadowOffsetX: 100,
            formatter: (params) => {
              return `${params.name}运维${params.value}次`
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  };

  option1 = () => {
    const { taskStatisticsData, operationAnalysis: {
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
        left: '-16%',
        top: "6%",
        right: '4%',
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
          margin: 70,
        },
        data: ['配合检查', '配合对比', '手工对比', '校验测试', '维修维护', '校准', '巡检',]
      },
      series: [
        {
          name: '已完成',
          type: 'bar',
          stack: '总量',
          color: "#67a2ef",
          barWidth: "24px",
          label: {
            show: true,
            position: 'insideRight',
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
          barWidth: "24px",
          label: {
            show: true,
            position: 'insideRight',
            formatter: (params) => {
              if (params.value === 0) { return "" } else { return params.value }
            }
          },
          data: [cooperationInspectionUnfinished, matchingUnfinished, manualComparisonUnfinished, verificationTestUnfinished, maintenanceRepairUnfinished, calibrationUnfinished, onSiteInspectionUnfinished]
        },

      ]
    };
  }


  // 图表点击
  getTrippingOperationAnalysis = (title, dataIndex, taskType) => {
    // this.setState({ title })
    this.props.dispatch({
      type: "newHome/updateState",
      payload: {
        drillDownTaskVisible: true,
        taskModelType: "taskClassify",
        modelTitle: title,
      }
    })
    this.props.dispatch({
      type: "newHome/getTrippingOperationAnalysis",
      payload: {
        taskType: TASK_TYPE[dataIndex]
      }
    })
  }

  getTrippingTaskStatistics = (title) => {
    // this.setState({ title })
    this.props.dispatch({
      type: "newHome/updateState",
      payload: {
        drillDownTaskVisible: true,
        taskModelType: undefined,
        modelTitle: title,
      }
    })
    this.props.dispatch({
      type: "newHome/getTrippingTaskStatistics",
    })
  }



  render() {
    const { modelTitle, taskStatisticsData, operationAnalysis } = this.props;
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
            option={this.option1()}
            onEvents={{
              click: (params) => {
                dataIndex = params.dataIndex
                this.getTrippingOperationAnalysis("任务分类统计", params.dataIndex)
              }
            }}
            style={{ height: '260px', width: '100%' }}
            theme="my_theme"
          />
          <Divider style={{ margin: "10px 0", marginTop: 4 }} />
          <div className={styles.innerTitle}>
            任务统计
            <Popover content={
              <div>
                1、次数：巡检、校准、校验测试次数；<br />
                2、计划运维：计划执行次数；<br />
                3、计划外运维：完成计划运维次数外，额外完成次数；<br />
                4、实际完成运维任务：实际完成次数。<br />
              </div>
            }>
              <Icon style={{ marginLeft: 6, fontSize: '15px' }} type="exclamation-circle" />
            </Popover>
          </div>
          <ReactEcharts
            option={this.option()}
            onEvents={{
              click: () => {
                this.getTrippingTaskStatistics("任务统计")
              }
            }}
            style={{ height: '180px', width: '100%' }}
            theme="my_theme"
          />
          <div className={styles.taskCount}>
            <span>实际完成运维任务{taskStatisticsData.completeTaskCount}次</span>
          </div>
        </div>
        <DrillDownTaskModal chartClick={(index) => {
          this.getTrippingOperationAnalysis(modelTitle, index !== undefined ? index : dataIndex)
        }}
        />
        <DrillDownTaskModal chartClick={(index) => {
          this.getTrippingTaskStatistics(modelTitle);
        }}
        />
      </div>
    );
  }
}

export default Operations;