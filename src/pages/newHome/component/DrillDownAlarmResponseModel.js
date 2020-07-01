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
  alarmResponseVisible: newHome.alarmResponseVisible,
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
  taskModelType: newHome.taskModelType,
  modelTitle: newHome.modelTitle,
  currentDivisionName: newHome.currentDivisionName,
  currentEntName: newHome.currentEntName,
}))
class DrillDownAlarmResponseModel extends PureComponent {
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.alarmResponseModalData !== this.props.alarmResponseModalData && !this.zr) {
      if (this.echartsReactRef) {
        this.echartsInstance = this.echartsReactRef.getEchartsInstance();
        this.zr = this.echartsInstance.getZr();

        this.zr.on('click', (...rest) => {
          var xIndex = this.echartsInstance.convertFromPixel({ seriesIndex: 0 }, [rest[0].offsetX, rest[0].offsetY]);
          var index = parseInt(xIndex);


          if (this.props.level === 1) {
            // 点击师，显示企业
            this.props.dispatch({
              type: "newHome/updateState",
              payload: {
                regionCode: this.props.codeList[index],
                currentDivisionName: this.props.alarmResponseModalData.x[index]
              }
            })
          }
          if (this.props.level === 2) {
            // 点击企业，显示排口
            this.props.dispatch({
              type: "newHome/updateState",
              payload: {
                entCode: this.props.codeList[index],
                currentEntName: this.props.alarmResponseModalData.x[index]
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
            this.setState({ showBack: true, dataIndex: index })
            this.props.chartClick();
          }

        })
      }
    }
  }

  close = () => {
    this.zr = undefined;
    this.props.dispatch({
      type: "newHome/updateState",
      payload: {
        alarmResponseVisible: false,
        level: this.props.LEVEL,
        startTime: this.props.START_TIME,
        endTime: this.props.END_TIME,
        entName: "",
      }
    })
    this.props.onClose && this.props.onClose();
  }

  getOption = () => {
    const { taskModelType, startTime, alarmResponseModalData, taskCountModalData, taskClassifyModalData, modelTitle } = this.props;
    const month = moment(startTime).get('month');
    let series = [];
    if (modelTitle === "异常报警响应") {
      series = [
        {
          name: `${month}月异常报警响应`,
          type: 'bar',
          itemStyle: {
            color: "#FF9800"
          },
          // barWidth: '40%',
          barMaxWidth: 60,
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              if (params.value) {
                return params.value
              }
            }
          },
          data: alarmResponseModalData.execptionYearCount
        },
        {
          name: `${month + 1}月异常报警响应`,
          type: 'bar',
          itemStyle: {
            color: "#ffd065"
          },
          // barWidth: '40%',
          barMaxWidth: 60,
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              if (params.value) {
                return params.value
              }
            }
          },
          data: alarmResponseModalData.execptionCount
        },]
    } else {
      // 超标报警核实
      series = [
        {
          name: `${month}月超标报警核实`,
          type: 'bar',
          itemStyle: {
            color: "#fd6c6c"
          },
          // barWidth: '40%',
          barMaxWidth: 60,
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              if (params.value) {
                return params.value
              }
            }
          },
          data: alarmResponseModalData.taskYearCount
        },
        {
          name: `${month + 1}月超标报警核实`,
          type: 'bar',
          itemStyle: {
            color: "#FF5722"
          },
          // barWidth: '40%',
          barMaxWidth: 60,
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              if (params.value) {
                return params.value
              }
            }
          },
          data: alarmResponseModalData.taskCount
        },
      ]
    }

    return {
      // color: ["#f6b322", "#0edaad"],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter(params, ticket, callback) {
          let res = `${params[0].axisValue}<br/>`;
          params.map(item => {
            res += item.marker + `${item.seriesName}：${item.value}次<br />`;
          });
          return res;
        },
      },
      legend: {
        data: [`${month}月异常报警响应`, `${month + 1}月异常报警响应`, `${month}月超标报警核实`, `${month + 1}月超标报警核实`,]
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '0%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: alarmResponseModalData.x,
          axisLabel: {
            interval: 0,
            rotate: 40
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '（次）',
          minInterval: 1
        }
      ],
      series: series
    };
  }

  chartEvents = {
    click: (params) => {
      if (this.props.level === 1) {
        // 点击师，显示企业
        this.props.dispatch({
          type: "newHome/updateState",
          payload: {
            regionCode: this.props.codeList[params.dataIndex],
            currentDivisionName: params.name
          }
        })
      }
      if (this.props.level === 2) {
        // 点击企业，显示排口
        this.props.dispatch({
          type: "newHome/updateState",
          payload: {
            entCode: this.props.codeList[params.dataIndex],
            currentEntName: params.name
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
        this.props.chartClick();
      }
    }
  }

  back = () => {
    const { dataIndex } = this.state;
    if (this.props.level === 2) {
      this.props.form.setFieldsValue({ entName: undefined });
      // 点击企业，显示排口
      this.props.dispatch({
        type: "newHome/updateState",
        payload: {
          regionCode: this.props.codeList[dataIndex],
          entName: undefined
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
    this.props.chartClick();
  }



  render() {
    const { currentDivisionName, currentEntName, taskClassifyModalData, alarmResponseVisible, taskModelType, startTime, endTime, modelTitle, level, LEVEL, loading, form: { getFieldDecorator } } = this.props;
    const { formItemLayout, showBack } = this.state;
    console.log('modelTitle=', modelTitle)
    let levelText, afterText = "";
    switch (level) {
      case 1:
        levelText = "(师)"
        afterText = ""
        break;
      case 2:
        levelText = "(监控目标)"
        afterText = currentDivisionName ? currentDivisionName + " - " : ""
        break;
      case 3:
        levelText = "(排口)"
        afterText = currentEntName ? currentEntName + " - " : ""
        break;
    }
    let title = `${afterText}${modelTitle}${levelText}`;
    return (
      <Modal
        title={<div>
          {title}
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
        visible={alarmResponseVisible}
        // visible={true}
        destroyOnClose
        footer={null}
        width={"80%"}
        onCancel={this.close}
      >
        <Spin spinning={loading}>
          <Form>
            <Row>
              {/* {
                level === 2 && */}
              <Col span={6} style={{ display: level === 2 ? "block" : "none" }}>
                <Form.Item {...formItemLayout} label="监控目标">
                  {getFieldDecorator("entName", {
                  })(
                    <Input allowClear placeholder="请输入监控目标" onChange={(e) => {
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
              {/* } */}
              <Col span={8}>
                <Form.Item {...formItemLayout} label="日期" style={{ width: '100%' }}>
                  {getFieldDecorator("time", {
                    initialValue: moment(startTime)
                  })(
                    <MonthPicker allowClear={false} onChange={(date, dateString) => {
                      this.setState({ date })
                    }} />
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  <Button type="primary" onClick={() => {
                    this.props.dispatch({
                      type: "newHome/updateState",
                      payload: {
                        startTime: this.state.date.format("YYYY-MM-01 00:00:00"),
                        endTime: this.state.date.endOf("month").format("YYYY-MM-DD HH:mm:ss")
                      }
                    })
                    this.props.chartClick();
                  }}>查询</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Divider style={{ margin: 0 }} />
          <ReactEcharts
            option={this.getOption()}
            style={{ height: '60vh' }}
            ref={(e) => {
              this.echartsReactRef = e;
            }}
            // onEvents={this.chartEvents}
            className="echarts-for-echarts"
            theme="my_theme"
          />
        </Spin>
      </Modal>
    );
  }
}

export default DrillDownAlarmResponseModel;
