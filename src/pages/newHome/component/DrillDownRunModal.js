import React, { PureComponent } from 'react';
import { Modal, Tabs, Spin, Input, Button, Icon, Row, Col, Form, Divider, DatePicker } from "antd";
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import styles from '../index.less'
import ReactEcharts from 'echarts-for-react';

const { MonthPicker } = DatePicker;


@Form.create()
@connect(({ loading, newHome }) => ({
  drillDownRunVisible: newHome.drillDownRunVisible,
  seriesData: newHome.seriesData,
  xData: newHome.xData,
  paramsList: newHome.paramsList,
  level: newHome.level,
  LEVEL: newHome.LEVEL,
  loading: newHome.drillDownLoading,
  startTime: newHome.startTime,
  endTime: newHome.endTime,
  START_TIME: newHome.START_TIME,
  END_TIME: newHome.END_TIME,
  modelTitle: newHome.modelTitle,
  currentDivisionName: newHome.currentDivisionName,
  currentEntName: newHome.currentEntName,
  REGION_CODE: newHome.REGION_CODE,
}))
class DrillDownRunModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      endTime: "",
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
    this.zr = undefined;
    this.props.dispatch({
      type: "newHome/updateState",
      payload: {
        drillDownRunVisible: false,
        level: this.props.LEVEL,
        startTime: this.props.START_TIME,
        endTime: this.props.END_TIME,
        entName: "",
        regionCode: this.props.REGION_CODE
      }
    })
    this.setState({
      date: undefined,
      endTime: undefined,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.seriesData !== this.props.seriesData && !this.zr) {
      if (this.echartsReactRef) {
        this.echartsInstance = this.echartsReactRef.getEchartsInstance();
        this.zr = this.echartsInstance.getZr();

        this.zr.on('click', (...rest) => {
          var pointInPixel = [rest.offsetX, rest.offsetY];
          var xIndex = this.echartsInstance.convertFromPixel({ seriesIndex: 0 }, [rest[0].offsetX, rest[0].offsetY]);
          var index = parseInt(xIndex);

          if (this.props.level === 1) {
            // 点击师，显示企业
            this.props.dispatch({
              type: "newHome/updateState",
              payload: {
                regionCode: this.props.paramsList[index],
                currentDivisionName: this.props.xData[index]
              }
            })
          }
          if (this.props.level === 2) {
            // 点击企业，显示排口
            this.props.dispatch({
              type: "newHome/updateState",
              payload: {
                entCode: this.props.paramsList[index],
                currentEntName: this.props.xData[index]
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
            this.setState({ dataIndex: index })
            this.props.chartClick();
          }
        });
      }
    }
  }


  getOption = () => {
    const { seriesData, xData } = this.props;
    return {
      color: ['#3398DB'],
      legend: {},
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (params) => {
          var tar = params[0];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value + ' %';
        }
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
          data: xData,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            rotate: 40
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '（%）',
          position: 'left',
          minInterval: 1,
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
          name: this.props.modelTitle,
          type: 'bar',
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
          data: seriesData
        }
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
            regionCode: this.props.paramsList[params.dataIndex],
            currentDivisionName: params.name
          }
        })
      }
      if (this.props.level === 2) {
        // 点击企业，显示排口
        this.props.dispatch({
          type: "newHome/updateState",
          payload: {
            entCode: this.props.paramsList[params.dataIndex],
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
        this.setState({ dataIndex: params.dataIndex })
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
          regionCode: this.props.paramsList[dataIndex],
          entName: undefined
        }
      })
    }
    if (this.props.level === 3) {
      // 点击企业，显示排口
      this.props.dispatch({
        type: "newHome/updateState",
        payload: {
          entCode: this.props.paramsList[dataIndex]
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
    const { currentDivisionName, currentEntName, drillDownRunVisible, startTime, endTime, modelTitle, level, LEVEL, loading, form: { getFieldDecorator } } = this.props;
    const { formItemLayout } = this.state;

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
          {/* {`${modelTitle}${levelText} - 详情`} */}
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
        visible={drillDownRunVisible}
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
              <Col span={10} style={{ display: level === 2 ? "block" : "none" }}>
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
              <Col span={10}>
                <Form.Item {...formItemLayout} label="日期">
                  {getFieldDecorator("time", {
                    initialValue: moment(startTime)
                  })(
                    <MonthPicker allowClear={false} onChange={(date, dateString) => {
                      let endTime = date.endOf("month").format("YYYY-MM-DD HH:mm:ss");
                      if (moment().get('month') === moment(date).get('month')) {
                        endTime = moment().format("YYYY-MM-DD 23:59:59");
                      }
                      this.setState({ date, endTime })
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
                        startTime: this.state.date ? this.state.date.format("YYYY-MM-01 00:00:00") : startTime,
                        endTime: this.state.endTime || endTime
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
      </Modal >
    );
  }
}

export default DrillDownRunModal;
