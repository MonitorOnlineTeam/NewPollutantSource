import React, { PureComponent } from 'react';
import styles from '../index.less'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Divider, Popover } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import DrillDownTaskModal from "./DrillDownTaskModal"
import isEqual from 'lodash/isEqual';
import DrillDownTaskStatisticsModal from './DrillDownTaskStatisticsModal'
const TASK_TYPE = ["cooperationInspectionComplete, cooperationInspectionUnfinished,配合检查", "matchingComplete, matchingUnfinished, 配合对比", "manualComparisonComplete, manualComparisonUnfinished, 手工对比", "verificationTestComplete, verificationTestUnfinished, 检验测试", "maintenanceRepairComplete, maintenanceRepairUnfinished, 维修维护", "calibrationComplete, calibrationUnfinished, 校准", "onSiteInspectionComplete, onSiteInspectionUnfinished, 巡检"];

let dataIndex = undefined;

@connect(({ loading, newHome }) => ({
  taskStatisticsData: newHome.taskStatisticsData,
  modelTitle: newHome.modelTitle,
}))
class TaskStatistics extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // 获取任务统计数据
    this.props.dispatch({
      type: "newHome/getTaskStatisticsData",
      payload: {
        
      }
    })

    this.echartsInstance = this.echartsReactRef.getEchartsInstance();
    this.zr = this.echartsInstance.getZr();

    this.zr.on('click', (...rest) => {
      this.getTrippingTaskStatistics()
    });



  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.modelTitle !== nextProps.modelTitle) {
      return false;
    }
    return true;
  }

  option = () => {
    const { taskStatisticsData: { insidePlan, UnInsidePlan, insidePlanRate, completeTaskCount } } = this.props;
    return {
      color: ["#f6b322", "#0edaad"],
      tooltip: {
        trigger: 'axis',
        formatter: '{b} : {c}' + "次",
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: '0',
        right: '0',
        bottom: '3%',
        top: "18%",
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['计划运维', '实际运维'],
          // axisTick: {
          //   alignWithLabel: true
          // }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: "（次）",
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        }
      ],
      series: [
        {
          name: '任务统计',
          type: 'bar',
          // radius: '55%',
          barWidth: '50',
          data: [insidePlan, completeTaskCount],
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              if (params.value) {
                return `${params.value}`
              }
            }
          },
          itemStyle: {
            color: function (params) {
              var colorList = ["#f6b322", "#0edaad"];
              return colorList[params.dataIndex]
            }
          },
          // emphasis: {
          //   itemStyle: {
          //     shadowBlur: 10,
          //     shadowOffsetX: 0,
          //     shadowColor: 'rgba(0, 0, 0, 0.5)'
          //   }
          // }
        }
      ]
    }
  };

  // 任务统计
  getTrippingTaskStatistics = () => {
    this.props.dispatch({
      type: "newHome/updateState",
      payload: {
        taskStatisticsVisible: true,
      }
    })
    this.props.dispatch({
      type: "newHome/getTrippingTaskStatistics",
    })
  }



  render() {
    const { modelTitle, taskStatisticsData, operationAnalysis } = this.props;
    return (
      <div>
        <div className={styles.innerTitle}>
          任务统计
            <Popover content={
            <div>
              1、计划运维：计划巡检、校准、校验测试次数;<br />
              2、实际运维：实际完成巡检、校准、校验测试次数;<br />
            </div>
          }>
            <ExclamationCircleOutlined style={{ marginLeft: 6, fontSize: '15px' }} />
          </Popover>
        </div>
        <ReactEcharts
          option={this.option()}
          ref={(e) => {
            this.echartsReactRef = e;
          }}
          // onEvents={{
          //   click: () => {
          //     this.getTrippingTaskStatistics()
          //   }
          // }}
          style={{ height: '220px', width: '100%' }}
          theme="my_theme"
        />
        {/* <div className={styles.taskCount}>
          <span>实际完成运维任务{taskStatisticsData.completeTaskCount}次</span>
        </div> */}
        <DrillDownTaskStatisticsModal chartClick={() => {
          this.getTrippingTaskStatistics()
        }}
        />
      </div>
    );
  }
}

export default TaskStatistics;
