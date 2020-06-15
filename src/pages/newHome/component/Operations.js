import React, { PureComponent } from 'react';
import styles from '../index.less'
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import DrillDownTaskModal from "./DrillDownTaskModal"
const TASK_TYPE = ["verificationTestComplete, verificationTestUnfinished, 检验测试", "maintenanceRepairComplete, maintenanceRepairUnfinished, 维修维护", "cooperationInspectionComplete, cooperationInspectionUnfinished,配合检查", "matchingComplete, matchingUnfinished, 配合对比", "manualComparisonComplete, manualComparisonUnfinished, 手工对比", "calibrationComplete, calibrationUnfinished, 校准", "onSiteInspectionComplete, onSiteInspectionUnfinished, 巡逻"];

@connect(({ loading, newHome }) => ({
  taskStatisticsData: newHome.taskStatisticsData,
  operationAnalysis: newHome.operationAnalysis,
  drillDownTaskVisible: newHome.drillDownTaskVisible,
  drillDownTaskClassifyVisible: newHome.drillDownTaskClassifyVisible,
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

  option = () => {
    const { taskStatisticsData: { insidePlan, UnInsidePlan, insidePlanRate } } = this.props;
    return {
      color: ["#f6b322", "#0edaad"],
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      series: [
        {
          name: '',
          type: 'pie',
          // radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: UnInsidePlan, name: '计划外' },
            { value: insidePlan, name: '计划内' },
          ],
          label: {
            show: true,
            textStyle: {
              fontSize: 14,
              color: '#333',
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
        bottom: '6%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisTick: {
          show: false
        },
        // axisLine: {
        //   show: false,
        // },
        splitLine: {
          show: false,
        },
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
        data: ['校验测试', '维修维护', '配合检查', '配合对比', '手工对比', '校准', '巡逻',]
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
          data: [verificationTestComplete, maintenanceRepairComplete, cooperationInspectionComplete, matchingComplete, manualComparisonComplete, calibrationComplete, onSiteInspectionComplete]
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
          data: [verificationTestUnfinished, maintenanceRepairUnfinished, cooperationInspectionUnfinished, matchingUnfinished, manualComparisonUnfinished, calibrationUnfinished, onSiteInspectionUnfinished]
        },

      ]
    };
  }


  // 图表点击
  getTrippingOperationAnalysis = (title, dataIndex, taskType) => {
    console.log('title=',title)
    this.setState({ title })
    this.props.dispatch({
      type: "newHome/getTrippingOperationAnalysis",
      payload: {
        taskType: TASK_TYPE[dataIndex]
      }
    })
  }

  getTrippingTaskStatistics = (title) => {
    this.setState({ title })
    this.props.dispatch({
      type: "newHome/getTrippingTaskStatistics",
    })
  }


  render() {
    const { taskStatisticsData, operationAnalysis, drillDownTaskVisible, drillDownTaskClassifyVisible } = this.props;
    const { title, dataIndex } = this.state;
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
                this.setState({
                  dataIndex: params.dataIndex
                }, () => {
                  this.getTrippingOperationAnalysis("任务分类统计", params.dataIndex)
                })
              }
            }}
            style={{ height: '300px', width: '100%' }}
            theme="my_theme"
          />
          <div className={styles.innerTitle}> 任务统计 </div>
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
            <span>共完成运维任务{taskStatisticsData.insidePlan + taskStatisticsData.UnInsidePlan}次</span>
          </div>
        </div>
        {drillDownTaskClassifyVisible && <DrillDownTaskModal type="taskClassify" title={title} chartClick={(index) => {
          console.log("index=", index)
          this.getTrippingOperationAnalysis(title, index !== undefined ? index : dataIndex);
        }}
          onClose={() => {
            this.props.dispatch({
              type: "newHome/updateState",
              payload: { drillDownTaskClassifyVisible: false }
            })
          }}
        />}
        {drillDownTaskVisible && <DrillDownTaskModal title={title} chartClick={() => {
          this.getTrippingTaskStatistics(title);
        }} />}
      </div>
    );
  }
}

export default Operations;