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
}))
class DrillDownRunModal extends PureComponent {
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
        drillDownRunVisible: false,
        level: this.props.LEVEL,
        startTime: this.props.START_TIME,
        endTime: this.props.END_TIME,
        entName: "",
      }
    })
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
        bottom: '3%',
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
          minInterval:1,
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
          name: this.props.title,
          type: 'bar',
          // barWidth: '40%',
          barMaxWidth: 60,
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
            regionCode: this.props.paramsList[params.dataIndex]
          }
        })
      }
      if (this.props.level === 2) {
        // 点击企业，显示排口
        this.props.dispatch({
          type: "newHome/updateState",
          payload: {
            entCode: this.props.paramsList[params.dataIndex]
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
      // 点击企业，显示排口
      this.props.dispatch({
        type: "newHome/updateState",
        payload: {
          regionCode: this.props.paramsList[dataIndex]
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
    const { drillDownRunVisible, startTime, endTime, title, level, LEVEL, loading, form: { getFieldDecorator } } = this.props;
    const { formItemLayout } = this.state;

    let levelText = level === 1 ? "(师)" : (level === 2 ? "(监测点)" : "(排口)")
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
        visible={drillDownRunVisible}
        destroyOnClose
        footer={null}
        width={"80%"}
        onCancel={this.close}
      >
        <Form>
          <Row>
            {
              level === 2 &&
              <Col span={10}>
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
            <Col span={10}>
              <Form.Item {...formItemLayout} label="日期">
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
                  this.props.chartClick();
                }}>查询</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider style={{ margin: 0 }} />
        {/* <Spin spinning={!!loading}> */}
        <ReactEcharts
          option={this.getOption()}
          style={{ height: '60vh' }}
          onEvents={this.chartEvents}
          className="echarts-for-echarts"
          theme="my_theme"
        />
        {/* </Spin> */}
      </Modal >
    );
  }
}

export default DrillDownRunModal;
