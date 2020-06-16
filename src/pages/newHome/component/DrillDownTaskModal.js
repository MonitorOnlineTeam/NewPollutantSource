import React, { PureComponent } from 'react';
import { Modal, Tabs, Spin, Input, Icon, Button, Row, Col, Form, Divider, DatePicker, Select } from "antd";
import { connect } from 'dva'
import moment from 'moment'
import SdlTable from '@/components/SdlTable'
import styles from '../index.less'
import ReactEcharts from 'echarts-for-react';
const { RangePicker, MonthPicker } = DatePicker;

const Option = Select.Option

@Form.create()
@connect(({ loading, newHome }) => ({
  drillDownTaskVisible: newHome.drillDownTaskVisible,
  level: newHome.level,
  LEVEL: newHome.LEVEL,
  loading: newHome.drillDownLoading,
  taskCountModalData: newHome.taskCountModalData,
  startTime: newHome.startTime,
  endTime: newHome.endTime,
  alarmResponseModalData: newHome.alarmResponseModalData,
  taskClassifyModalData: newHome.taskClassifyModalData,
  codeList: newHome.codeList,
  START_TIME: newHome.START_TIME,
  END_TIME: newHome.END_TIME,
}))
class DrillDownTaskModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formItemLayout: {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 16,
        },
      },
    };
  }

  close = () => {
    this.props.dispatch({
      type: "newHome/updateState",
      payload: {
        drillDownTaskVisible: false,
        level: this.props.LEVEL,
        startTime: this.props.START_TIME,
        endTime: this.props.END_TIME,
        entName: "",
      }
    })
    this.props.onClose && this.props.onClose();
  }

  getOption = () => {
    const { type, alarmResponseModalData, taskCountModalData, taskClassifyModalData } = this.props;
    if (type === "alarmResponse") {
      return {
        color: ["#f6b322", "#0edaad"],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // legend: {
        //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他']
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: alarmResponseModalData.x
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '异常任务',
            type: 'bar',
            itemStyle: {
              color: "#fd6c6c"
            },
            barWidth: '40%',
            barMaxWidth: "60px",
            data: alarmResponseModalData.taskCount
            // data: [11]
          },
          {
            name: '异常任务同比',
            type: 'bar',
            itemStyle: {
              color: "#fd6c6c"
            },
            barWidth: '40%',
            barMaxWidth: "60px",
            data: alarmResponseModalData.taskYearCount
            // data: [22]
          },
          {
            name: '超标报警核实',
            type: 'bar',
            itemStyle: {
              color: "#f6b322"
            },
            barWidth: '40%',
            barMaxWidth: "60px",
            data: alarmResponseModalData.execptionCount            // data: [3]
          },
          {
            name: '超标报警核实同比',
            type: 'bar',
            itemStyle: {
              color: "#f6b322"
            },
            barWidth: '40%',
            barMaxWidth: "60px",
            data: alarmResponseModalData.execptionYearCount
            // data: [33]
          },
        ]
      };

    }
    if (type === "taskClassify") {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: taskClassifyModalData.x,
            axisLabel: {
              interval: 0,
              rotate: 40
            },
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: `${taskClassifyModalData.name}统计 - 已完成`,
            type: 'bar',
            color: "#67a2ef",
            barWidth: '40%',
            barMaxWidth: "60px",
            data: taskClassifyModalData.ywc
          },
          {
            name: `${taskClassifyModalData.name}统计 - 未完成`,
            type: 'bar',
            color: "#0edaad",
            barWidth: '40%',
            barMaxWidth: "60px",
            data: taskClassifyModalData.wwc
          },
        ]
      };

    }
    return {
      color: ["#f6b322", "#0edaad"],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['计划内', '计划外']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: taskCountModalData.x,
          axisLabel: {
            interval: 0,
            rotate: 40
          },
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '计划外',
          type: 'bar',
          barWidth: '40%',
          barMaxWidth: "60px",
          label: {
            show: true,
            position: 'top'
          },
          data: taskCountModalData.unInsidePlan
        },
        {
          name: '计划内',
          type: 'bar',
          barWidth: '40%',
          barMaxWidth: "60px",
          label: {
            show: true,
            position: 'top'
          },
          data: taskCountModalData.insidePlan
        },
      ]
    };
  }

  chartEvents = {
    click: (params) => {
      if (this.props.level === 1) {
        // 点击师，显示企业
        this.props.dispatch({
          type: "newHome/updateState",
          payload: {
            regionCode: this.props.codeList[params.dataIndex]
          }
        })
      }
      if (this.props.level === 2) {
        // 点击企业，显示排口
        this.props.dispatch({
          type: "newHome/updateState",
          payload: {
            entCode: this.props.codeList[params.dataIndex]
          }
        })
      }
      if (this.props.level < 3) {
        this.props.dispatch({
          type: "newHome/updateState",
          payload: {
            level: this.props.level + 1
          }
        })
        this.setState({ showBack: true, dataIndex: params.dataIndex })
        this.props.chartClick(this.state.taskClassifyIndex);
      }
    }
  }

  back = () => {
    const { dataIndex } = this.state;
    if (this.props.level === 2) {
      // 点击企业，显示排口
      this.props.dispatch({
        type: "newHome/updateState",
        payload: {
          regionCode: this.props.codeList[dataIndex]
        }
      })
    }
    if (this.props.level === 3) {
      // 点击企业，显示排口
      this.props.dispatch({
        type: "newHome/updateState",
        payload: {
          entCode: this.props.codeList[dataIndex]
        }
      })
    }

    this.props.dispatch({
      type: "newHome/updateState",
      payload: {
        level: this.props.level - 1
      }
    })
    // this.setState({ showBack: true })
    this.props.chartClick(this.state.taskClassifyIndex);
  }



  render() {
    const { taskClassifyModalData, drillDownTaskVisible, type, startTime, endTime, title, level, LEVEL, loading, form: { getFieldDecorator } } = this.props;
    const { formItemLayout, showBack } = this.state;
    let levelText = level === 1 ? "(师)" : (level === 2 ? "(监控目标)" : "(监测点)")

    return (
      <Modal
        title={<div>
          {`${title}${levelText} - 详情`}
          {
            level !== LEVEL && <Button
              style={{ marginLeft: 10 }}
              onClick={() => {
                this.back()
              }}
              type="link"
              size="small"
            >
              <Icon type="rollback" />
                  返回上级
                </Button>
          }
        </div>}
        // visible={drillDownTaskVisible}
        visible={true}
        destroyOnClose
        footer={null}
        width={"80%"}
        onCancel={this.close}
      >
        <Form>
          <Row>
            {
              level === 2 &&
              <Col span={6}>
                <Form.Item {...formItemLayout} label="企业名称">
                  {getFieldDecorator("entName", {
                  })(
                    <Input allowClear placeholder="请输入企业名称" onChange={(e) => {
                      this.props.dispatch({
                        type: "newHome/updateState",
                        payload: {
                          entName: e.target.value
                        }
                      })
                    }} />
                  )}
                </Form.Item>
              </Col>
            }
            {
              // 任务统计 - 显示任务分类筛选
              type === "taskClassify" &&
              <Col span={6}>
                <Form.Item {...formItemLayout} label="任务分类" style={{ width: '100%' }}>
                  {getFieldDecorator("taskType", {
                    initialValue: taskClassifyModalData.name + ''
                  })(
                    <Select style={{ width: '100%' }} onChange={(val, option) => {
                      this.setState({
                        taskClassifyIndex: option.key
                      })
                    }}>
                      {/* <Option value="检验测试" key="verificationTestComplete, verificationTestUnfinished">检验测试</Option>

                    <Option value="维修维护" key="maintenanceRepairComplete, maintenanceRepairUnfinished">维修维护</Option>
                    <Option value="配合检查" key="cooperationInspectionComplete, cooperationInspectionUnfinished">配合检查</Option>
                    <Option value="配合对比" key="matchingComplete, matchingUnfinished">配合对比</Option>
                    <Option value="手工对比" key="manualComparisonComplete, manualComparisonUnfinished">手工对比</Option>
                    <Option value="校准" key="calibrationComplete, calibrationUnfinished">校准</Option>
                    <Option value="巡逻" key="onSiteInspectionComplete, onSiteInspectionUnfinished">巡逻</Option> */}
                      <Option value="巡检" key="6">巡检</Option>
                      <Option value="校准" key="5">校准</Option>
                      <Option value="维修维护" key="4">维修维护</Option>
                      <Option value="检验测试" key="3">检验测试</Option>
                      <Option value="手工对比" key="2">手工对比</Option>
                      <Option value="配合对比" key="1">配合对比</Option>
                      <Option value="配合检查" key="0">配合检查</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            }

            <Col span={8}>
              <Form.Item {...formItemLayout} label="日期" style={{ width: '100%' }}>
                {getFieldDecorator("time", {
                  initialValue: moment(startTime)
                })(
                  <MonthPicker allowClear={false} onChange={(date, dateString) => {
                    this.props.dispatch({
                      type: "newHome/updateState",
                      payload: {
                        startTime: date.format("YYYY-MM-01 00:00:00"),
                        endTime: date.endOf("month").format("YYYY-MM-DD HH:mm:ss")
                      }
                    })
                  }} />
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button type="primary" onClick={() => {
                  this.props.chartClick(this.state.taskClassifyIndex);
                }}>查询</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider style={{ margin: 0 }} />
        <ReactEcharts
          option={this.getOption()}
          style={{ height: '60vh' }}
          onEvents={this.chartEvents}
          className="echarts-for-echarts"
          theme="my_theme"
        />
      </Modal>
    );
  }
}

export default DrillDownTaskModal;
