import React, { PureComponent } from 'react';
import styles from '../index.less'
import { Divider, Popover, Icon } from 'antd';
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.modelTitle !== nextProps.modelTitle) {
      return false;
    }
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
            { value: UnInsidePlan, name: '计划外运维' },
            { value: insidePlan, name: '计划运维' },
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
              return `${params.name}${params.value}次`
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
              this.getTrippingTaskStatistics()
            }
          }}
          style={{ height: '180px', width: '100%' }}
          theme="my_theme"
        />
        <div className={styles.taskCount}>
          <span>实际完成运维任务{taskStatisticsData.completeTaskCount}次</span>
        </div>
        <DrillDownTaskStatisticsModal chartClick={() => {
          this.getTrippingTaskStatistics()
        }}
        />
      </div>
    );
  }
}

export default TaskStatistics;