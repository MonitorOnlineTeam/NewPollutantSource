/*
 * @Author: Jiaqi 
 * @Date: 2019-11-13 15:15:00 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-20 17:27:04
 * @desc: 远程质控
 */
import React, { Component } from 'react';
import { Card, Button, Input, Select, InputNumber, Tabs, Form, Row, Col, Divider, Modal, message, List, Statistic, Collapse, Icon } from 'antd';
import { connect } from 'dva';
import NavigationTree from '@/components/NavigationTree'
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import styles from './index.less'
import { DianliangIcon } from '@/utils/icon'
import CustomIcon from '@/components/CustomIcon'

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;
const { Countdown } = Statistic;
const { Panel } = Collapse;


@Form.create()
@connect(({ loading, qualityControl }) => ({
  standardGasList: qualityControl.standardGasList,
  CEMSList: qualityControl.CEMSList,
  autoQCAInfo: qualityControl.autoQCAInfo,
  loading: loading.effects["qualityControl/SendQCACmd"]
}))
class RemoteControlPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QCAMN: props.QCAMN,
      // visible: false,
      stopDGIMN: [],
      stopMNHall: [],
      // stopStandardPollutantName: "",
      // stopStandardPollutantCode: ""
    };
    this._SELF_ = {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
    }
  }

  componentDidMount() {
    // 获取标气列表
    this.props.dispatch({ type: "qualityControl/getStandardGas", payload: { QCAMN: this.state.QCAMN } });
    // 获取质控仪CEMS
    this.props.dispatch({ type: "qualityControl/getCEMSList", payload: { QCAMN: this.state.QCAMN } });
    // 获取自动质控信息
    this.props.dispatch({ type: "qualityControl/getAutoQCAInfo", payload: { qcamn: this.state.QCAMN } });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.QCAMN !== nextProps.QCAMN) {
      this.setState({ QCAMN: nextProps.QCAMN }, () => {
        // 获取质控仪CEMS
        this.props.dispatch({ type: "qualityControl/getCEMSList", payload: { QCAMN: this.state.QCAMN } });
      });
    }
    if (this.props.CEMSList !== nextProps.CEMSList) {
      this.setState({
        MNHall: nextProps.CEMSList[0].MNHall
      })
    }
  }

  // 开始质控
  onSubmitForm = (e) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const { StandardPollutantName } = this.state;
      let postData = {
        ...fieldsValue,
        DGIMN: fieldsValue.DGIMN.toString(),
        DeliPollutantName: "N2",
        StandardPollutantName: StandardPollutantName,
        QCAMN: this.state.QCAMN,
        MNHall: this.state.MNHall.toString(),
        QCTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        QCExecuType: 1,
        QCType: 1,
      }
      console.log("postData=", postData);
      // return;
      this.SendQCACmd(postData);
    })
  }

  // 停止质控
  onStop = () => {
    const { stopDGIMN, stopMNHall, QCAMN } = this.state;
    if (!stopDGIMN.length) {
      message.error("请选择要停止的排口");
      return;
      // } else if (!stopStandardPollutantCode) {
      //   message.error("请选择标气组分");
      //   return;
    } else {
      this.SendQCACmd({
        QCType: 2,
        QCExecuType: 1,
        DGIMN: stopDGIMN.toString(),
        MNHall: stopMNHall.toString(),
        QCAMN: QCAMN,
        QCTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        // StandardPollutantCode: stopStandardPollutantCode,
        // StandardPollutantName: stopStandardPollutantName
      })
      this.setState({
        visible: false
      })
    }
  }

  // 发送指令
  SendQCACmd = (payload) => {
    this.props.dispatch({
      type: "qualityControl/SendQCACmd",
      payload: payload
    })
  }

  // 取消质控计划
  cancelPlan = (DGIMN, StandardPollutantCode) => {
    this.props.dispatch({
      type: "qualityControl/cancelPlan",
      payload: {
        DGIMN: DGIMN,
        QCAMN: this.state.QCAMN,
        StandardPollutantCode: StandardPollutantCode
      }
    })
  }

  // 余量Icon
  getResidueIcon = (value) => {
    debugger
    let icon = null;
    if (value <= 25) {
      icon = <CustomIcon type="icon-dianliang" style={{ fontSize: 20, margin: "0 10px", color: "red" }} />
    } else if (value > 25 && value <= 50) {
      icon = <CustomIcon type="icon-dianliang1" style={{ fontSize: 20, margin: "0 10px", color: "#32c066" }} />
    } else if (value > 50 && value <= 75) {
      icon = <CustomIcon type="icon-dianliang2" style={{ fontSize: 20, margin: "0 10px", color: "#32c066" }} />
    } else if (value > 75 && value <= 100) {
      icon = <CustomIcon type="icon-dianliang3" style={{ fontSize: 20, margin: "0 10px", color: "#32c066" }} />
    }
    return <>
      {icon}
      <span style={{ fontSize: 12, color: "#7d7d7d" }}>余：{value}</span>
    </>
  }


  render() {
    const { formItemLayout } = this._SELF_;
    const { QCAMN } = this.state;
    const { form: { getFieldDecorator, setFieldsValue }, form, standardGasList, CEMSList, loading, autoQCAInfo } = this.props;
    let danqi = standardGasList.filter(itm => itm.PollutantCode === "065");
    debugger
    if (loading) {
      <PageLoading />
    }
    return (
      <Card className="contentContainer">
        <Tabs defaultActiveKey="1">
          <TabPane tab="手动质控" key="1">
            <div>
              <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                Modal.confirm({
                  title: '重启',
                  content: '确认是否重启',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () => {
                    this.SendQCACmd({
                      QCType: 3,
                      QCAMN: QCAMN,
                      QCTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    })
                  }
                });
              }}>质控仪重启</Button>
              <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                this.SendQCACmd({
                  QCType: 4,
                  QCAMN: QCAMN,
                  QCTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                })
              }}>质控仪吹扫</Button>
              <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                this.SendQCACmd({
                  QCType: 5,
                  QCAMN: QCAMN,
                  QCTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                })
              }}>质控仪开门</Button>
            </div>
            {/* <Divider /> */}
            <Card
              style={{ marginTop: 16 }}
              type="inner"
              border={false}
              title="手动质控"
            >
              <Form {...formItemLayout}>
                <Row>
                  <Col span={12}>
                    <Form.Item label="标气组分" style={{ width: '100%' }}>
                      {getFieldDecorator('StandardPollutantCode', {
                        rules: [{
                          required: true,
                          message: '请选择标气组分!',
                        },],
                      })(
                        <>
                          <Select placeholder="请选择标气组分" style={{ width: '100%' }} onChange={(value, option) => {
                            this.setState({
                              StandardPollutantName: option.props.children
                            })
                            if (value == "02" || value == "03") {
                              form.setFieldsValue({ "OldStandardUnit": "0", "MatchStandardUnit": "0" })
                            } else {
                              form.setFieldsValue({ "OldStandardUnit": "1", "MatchStandardUnit": "1" })
                            }
                          }}>
                            {
                              standardGasList.filter(itm => itm.PollutantCode !== "065").map(item => {
                                return <Option key={item.PollutantCode} value={item.PollutantCode}>
                                  {item.PollutantName}
                                  {/* TODO (WJQ) : 将20替换成余量值 */}
                                  {this.getResidueIcon(item.VolumeValue)}
                                </Option>
                              })
                            }
                          </Select>
                          {/* <div style={{ position: "absolute", bottom: 6, fontSize: 12, right: 0 }}>
                            <CustomIcon type="icon-dianliang" style={{ fontSize: 20, position: "absolute" }} />
                            <span>余量剩余：12.13</span>
                          </div> */}
                        </>
                      )}
                    </Form.Item>

                  </Col>
                  <Col span={12}>
                    <Form.Item label="总流量设定值">
                      {getFieldDecorator('FlowValue', {
                        rules: [{
                          required: true,
                          message: '请输入总流量设定值!',
                        },],
                      })(
                        <InputNumber placeholder="请输入总流量设定值" style={{ width: '100%' }} min={0} max={1000} precision={1} />
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="原标气浓度">
                      {getFieldDecorator('OldStandardValue', {
                        rules: [{
                          required: true,
                          message: '请输入原标气浓度!',
                        },],
                      })(
                        <InputNumber placeholder="请输入原标气浓度" style={{ width: '100%' }} min={500} max={5000} precision={1} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="原标气浓度值单位">
                      {getFieldDecorator('OldStandardUnit', {
                        rules: [{
                          required: true,
                          message: '请选择原标气浓度值单位!',
                        },],
                        initialValue: "0"
                      })(
                        <Select placeholder="请选择原标气浓度值单位">
                          <Option key="0" disabled={form.getFieldValue("OldStandardUnit") != "0"} >mg/m3</Option>
                          <Option key="1" disabled={form.getFieldValue("OldStandardUnit") != "1"}>%</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="配比标气浓度设定值">
                      {getFieldDecorator('MatchStandardValue', {
                        rules: [{
                          required: true,
                          message: '请输入配比标气浓度设定值!',
                        },],
                      })(
                        <InputNumber placeholder="请输入配比标气浓度设定值" style={{ width: '100%' }} min={50} max={5000} precision={1} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="配比标气浓度单位">
                      {getFieldDecorator('MatchStandardUnit', {
                        rules: [{
                          required: true,
                          message: '请选择配比标气浓度单位!',
                        },],
                        initialValue: "0"
                      })(
                        <Select placeholder="请选择配比标气浓度单位">
                          <Option key="0" disabled={form.getFieldValue("MatchStandardUnit") != "0"}>mg/m3</Option>
                          <Option key="1" disabled={form.getFieldValue("MatchStandardUnit") != "1"}>%</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="稀释气组分名称">
                      {getFieldDecorator('DeliPollutantCode', {
                        rules: [{
                          required: true,
                          message: '请选择稀释气组分名称!',
                        },],
                        initialValue: "0"
                      })(
                        <Select placeholder="请选择稀释气组分名称">
                          <Option key="0">
                            N2
                            {/*  TODO (WJQ) :  
                            替换成
                            {this.getResidueIcon(standardGasList.filter(itm => itm.PollutantCode === "065")[0]["余量字段名"])}
                            */}
                            {this.getResidueIcon(danqi.length !== 0 ? danqi[0].VolumeValue : 0)}
                          </Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{ display: 'none' }}>
                    <Form.Item label="排口">
                      {getFieldDecorator('DGIMN', {
                        rules: [{
                          required: true,
                          message: '请选择排口!',
                        },],
                        initialValue: CEMSList.length ? CEMSList[0].DGIMN : undefined
                      })(
                        <Select
                          placeholder="请选择排口"
                          // mode="multiple"
                          onChange={(value, option) => {
                            this.setState({
                              MNHall: option.map(item => item.props.MNHall)
                            })
                          }}>
                          {
                            CEMSList.map(item => {
                              return <Option key={item.DGIMN} MNHall={item.MNHall} >{item.PointName}</Option>
                            })
                          }
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                {/* <Row>
                  <div>
                    <CustomIcon type="icon-dianliang" />
                    <span>余量剩余：12.13, 预计可用至2019-11-20 14:23:15</span>
                  </div>
                </Row> */}
                {/* <Divider orientation="right">

                </Divider> */}
                <Row>
                  <Button type="primary" style={{ float: "right" }} onClick={this.onSubmitForm}>开始质控</Button>
                </Row>
              </Form>
            </Card>
            {/* <Card
              style={{ marginTop: 16 }}
              type="inner"
              border={false}
              title="停止质控"
            >
              <Row>
                <Col span={4} className="ant-form-item-required" style={{ textAlign: "right", paddingRight: 10, marginTop: 5 }}>排口:</Col>
                <Col span={14}>
                  <Select placeholder="请选择排口" style={{ width: "80%" }} mode="multiple" onChange={(value, option) => {
                    this.setState({
                      stopDGIMN: value,
                      stopMNHall: option.map(item => item.props.MNHall)
                    })
                  }}>
                    {
                      CEMSList.map(item => {
                        return <Option key={item.DGIMN} MNHall={item.MNHall} >{item.PointName}</Option>
                      })
                    }
                  </Select>
                </Col>
                <Col>
                  <Button type="primary" style={{ float: "right" }} onClick={() => {
                    this.onStop()
                  }}>停止质控</Button>
                </Col>
              </Row>
            </Card> */}
          </TabPane>
          <TabPane tab="自动质控" key="2">
            <Collapse bordered={false} defaultActiveKey={['0', '1', '2', '3']}>
              {
                autoQCAInfo.map((item, index) => {
                  //               font-size: 16px;
                  // font-weight: 500;
                  return <Panel
                    header={
                      <div style={{ fontSize: 16, fontWeight: 500 }}>{item.PointName}</div>}
                    key={index}>
                    <List
                      // header={<div></div>}
                      // footer={<div>Footer</div>}
                      // bordered
                      dataSource={item.Children}
                      renderItem={item => (
                        <List.Item style={{ padding: "30px 10px 10px", position: "relative" }}>
                          <div className={styles.pollutantTitle}>{item.PollutantName}：</div>
                          <Row style={{ width: "100%" }} className="center">
                            <Col span={8}>
                              <Countdown valueStyle={{ fontSize: 18 }} title="距下次质控还剩" value={item.PlanTime} format="D 天 H 时 m 分 s 秒" />
                            </Col>
                            <Col span={10}>
                              <Statistic valueStyle={{ fontSize: 18 }} title="下次质控时间" value={item.PlanTime} precision={2} />
                            </Col>
                            <Col span={4}>
                              <Button type="primary" onClick={() => { this.cancelPlan(item.DGIMN, item.StandardPollutantCode) }}>取消质控</Button>
                            </Col>
                          </Row>
                        </List.Item>
                      )}
                    />
                  </Panel>
                })
              }
            </Collapse>

          </TabPane>
        </Tabs>
        {/* <Modal
          title="停止质控"
          visible={this.state.visible}
          onOk={this.onStop}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
        >
          <Row style={{ marginBottom: 16 }}>
            <Col span="6" className="ant-form-item-required" style={{ textAlign: "right", paddingRight: 10, marginTop: 5 }}>标气组分:</Col>
            <Col span="14">
              <Select style={{ width: "100%" }} placeholder="请选择标气组分" onChange={(value, option) => {
                this.setState({
                  stopStandardPollutantName: option.props.children,
                  stopStandardPollutantCode: value
                })
              }}>
                {
                  standardGasList.map(item => {
                    return <Option key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Option>
                  })
                }
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span="6" className="ant-form-item-required" style={{ textAlign: "right", paddingRight: 10, marginTop: 5 }}>排口:</Col>
            <Col span="14">
              <Select placeholder="请选择排口" style={{ width: "100%" }} mode="multiple" onChange={(value, option) => {
                this.setState({
                  stopDGIMN: value,
                  stopMNHall: option.map(item => item.props.MNHall)
                })
              }}>
                {
                  CEMSList.map(item => {
                    return <Option key={item.DGIMN} MNHall={item.MNHall} >{item.PointName}</Option>
                  })
                }
              </Select>
            </Col>
          </Row>
        </Modal> */}
      </Card>
    );
  }
}

export default RemoteControlPage;