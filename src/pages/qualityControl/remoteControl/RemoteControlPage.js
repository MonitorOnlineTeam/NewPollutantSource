/*
 * @Author: Jiaqi
 * @Date: 2019-11-13 15:15:00
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-23 14:36:48
 * @desc: 远程质控
 */
import React, { Component } from 'react';
import { StopOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Button,
  Spin,
  Input,
  Select,
  InputNumber,
  Alert,
  Tabs,
  Row,
  Col,
  Divider,
  Modal,
  message,
  List,
  Statistic,
  Collapse,
} from 'antd';
import { connect } from 'dva';
import NavigationTree from '@/components/NavigationTree'
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import styles from './index.less'
import { DianliangIcon } from '@/utils/icon'
import CustomIcon from '@/components/CustomIcon'
import ImagePage from './ImagePage'

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;
const { Countdown } = Statistic;
const { Panel } = Collapse;


@Form.create()
@connect(({ loading, qualityControl }) => ({
  standardGasList: qualityControl.standardGasList,
  standardGasListLoading: loading.effects["qualityControl/getStandardGas"],
  CEMSList: qualityControl.CEMSList,
  autoQCAInfo: qualityControl.autoQCAInfo,
  sendQCACmd3Loading: qualityControl.sendQCACmd3Loading,
  sendQCACmd4Loading: qualityControl.sendQCACmd4Loading,
  sendQCACmd5Loading: qualityControl.sendQCACmd5Loading,
  QCStatus: qualityControl.QCStatus,
  loading: loading.effects["qualityControl/SendQCACmd"],
  DeviceStatus: qualityControl.DeviceStatus,
}))
class RemoteControlPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      QCAMN: props.QCAMN,
      // visible: false,
      stopDGIMN: [],
      stopMNHall: [],
      activeKey: 1
      // stopStandardPollutantName: "",
      // stopStandardPollutantCode: ""
    };
    this._SELF_ = {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
    }
  }

  componentDidMount() {
    // 获取质控仪CEMS
    this.props.dispatch({
      type: "qualityControl/getCEMSList",
      payload: {
        QCAMN: this.state.QCAMN
      },
      callback: (res) => {
        // 获取标气列表
        this.props.dispatch({
          type: "qualityControl/getStandardGas",
          payload: {
            QCAMN: this.state.QCAMN, DGIMN: res[0].DGIMN
          }
        });
      }
    });
    // 获取自动质控信息
    this.props.dispatch({ type: "qualityControl/getAutoQCAInfo", payload: { qcamn: this.state.QCAMN } });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.QCAMN !== nextProps.QCAMN) {
      this.setState({ QCAMN: nextProps.QCAMN }, () => {
        // 获取质控仪CEMS
        this.props.dispatch({
          type: "qualityControl/getCEMSList",
          payload: {
            QCAMN: this.state.QCAMN
          },
          callback: (res) => {
            // 获取标气列表
            this.props.dispatch({
              type: "qualityControl/getStandardGas",
              payload: {
                QCAMN: this.state.QCAMN, DGIMN: res[0].DGIMN
              }
            });
          }
        });
        // 获取自动质控信息
        this.props.dispatch({ type: "qualityControl/getAutoQCAInfo", payload: { qcamn: this.state.QCAMN } });
      });
    }
    if (this.props.CEMSList !== nextProps.CEMSList) {
      this.setState({
        MNHall: nextProps.CEMSList.length && nextProps.CEMSList[0].MNHall
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
        StabilizationTime: fieldsValue.StabilizationTime || 0,
        MatchStandardValue: fieldsValue.MatchStandardValue || 0,
        OldStandardUnit: fieldsValue.OldStandardUnit === "mg/m3" ? 0 : 1,
        MatchStandardUnit: fieldsValue.MatchStandardUnit === "mg/m3" ? 0 : 1,
        DGIMN: fieldsValue.DGIMN.toString(),
        DeliPollutantName: "N2",
        StandardPollutantName: StandardPollutantName,
        QCAMN: this.state.QCAMN,
        MNHall: this.state.MNHall.toString(),
        QCTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        QCExecuType: 1,
        QCType: 1,
        PumpValve: fieldsValue.StandardPollutantCode === "P" ? 1 : 0,
        flag: true
      }
      console.log('postData=', postData)
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
      payload: payload,
      success: () => {
        if (payload.flag) {
          // 重置实时结果比对数据
          // this.props.dispatch({
          //   type: "qualityControlModel/updateRealtimeData",
          //   payload: {}
          // })
          // 重置model数据
          this.props.dispatch({
            type: "qualityControlModel/changeRealTimeThanData",
            payload: {
              valueList: [],
              timeList: [],
              tableData: [],
              standardValueList: [],
              start: 0,
              end: 20,
              flag: true
            }
          })
          this.props.dispatch({
            type: "qualityControl/updateState",
            payload: {
              QCAResult: "0"
            }
          })
          // 将isReceiveData重置为true，接受实时比对数据
          this.props.dispatch({
            type: "qualityControlModel/updateState",
            payload: {
              isReceiveData: true
            }
          })
          this.setState({ visible: false });
        }
      }
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
  getResidueIcon = (VolumeValue, GasInitPower) => {
    if (!GasInitPower) {
      return;
    }
    let icon = null;
    let value = parseInt((VolumeValue / GasInitPower) * 100)
    if (value <= 25) {
      icon = <CustomIcon type="icon-dianliang" style={{ fontSize: 20, margin: "0 10px", color: "red" }} />
    } else if (value > 25 && value <= 50) {
      icon = <CustomIcon type="icon-dianliang1" style={{ fontSize: 20, margin: "0 10px", color: "#32c066" }} />
    } else if (value > 50 && value <= 75) {
      icon = <CustomIcon type="icon-dianliang2" style={{ fontSize: 20, margin: "0 10px", color: "#32c066" }} />
    } else if (value > 75) {
      icon = <CustomIcon type="icon-dianliang3" style={{ fontSize: 20, margin: "0 10px", color: "#32c066" }} />
    }
    return <>
      {icon}
      <span style={{ fontSize: 12, color: "#7d7d7d" }}>余：{VolumeValue}（L）</span>
    </>
  }

  returnQCStatus = () => {
    let text = "";
    switch (this.props.QCStatus) {
      case "3":
        text = "，工作状态异常";
        break;
      case "4":
        text = "，工作状态质控中"
        break;
      case "5":
        text = "，工作状态吹扫中"
        break;
      case "6":
        text = ""
        break;
      default:
        text = "";
        break;
    }
    switch (this.props.DeviceStatus) {
      case "0":
        return <Alert type="error" icon={<StopOutlined />} style={{ background: "#ddd", marginBottom: 10 }} message={`质控仪离线中${text}`} banner />;
      case "1":
        return <Alert type="success" style={{ marginBottom: 10 }} message={`质控仪在线中${text}`} banner />
      case "3":
        return <Alert type="warning" style={{ marginBottom: 10 }} message={`质控仪状态异常${text}`} banner />
      default:
        return "";
    }
  }

  getTimeOptions = () => {
    let i = 0;
    const timeList = [];
    while (i < 60) {
      timeList.push(<Option key={i + 1}>{i + 1}分钟</Option>)
      i++;
    }
    return timeList;
  }

  render() {
    const { formItemLayout } = this._SELF_;
    const { QCAMN, activeKey } = this.state;
    const {
      form: { getFieldDecorator, setFieldsValue, getFieldValue },
      form, standardGasList, standardGasListLoading, CEMSList, loading, autoQCAInfo, QCStatus
    } = this.props;
    let VolumeValue = 0;
    let GasInitPower = 0;
    let danqi = standardGasList.filter(itm => itm.PollutantCode === "065");
    if (danqi.length !== 0) {
      VolumeValue = danqi[0].VolumeValue;
      GasInitPower = danqi[0].GasInitPower;
    }
    // if (loading) {
    //   return <PageLoading />
    // }
    return (
      <>
        {this.returnQCStatus()}
        <Card className="contentContainer">
          <Spin spinning={loading || false}>
            <Tabs defaultActiveKey={activeKey} onChange={(activeKey) => {
              this.setState({ activeKey: activeKey })
            }}>
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
                      DGIMN: getFieldValue("DGIMN")
                    })
                  }}>质控仪吹扫</Button>
                  {/* <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                    this.SendQCACmd({
                      QCType: 5,
                      QCAMN: QCAMN,
                      QCTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    })
                  }}>质控仪开门</Button> */}
                  <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                    this.setState({
                      visible: true,
                    })
                  }}>手动质控</Button>
                </div>
                <Divider />
                {this.state.QCAMN && <ImagePage QCAMN={this.state.QCAMN} />}
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
            <Modal
              title="手动质控"
              visible={this.state.visible}
              onOk={this.onSubmitForm}
              confirmLoading={loading}
              okText={"开始质控"}
              destroyOnClose
              // onClick={this.onSubmitForm}
              width={900}
              onCancel={() => {
                this.setState({
                  visible: false
                })
              }}
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
                        <Select placeholder="请选择标气组分" style={{ width: '100%' }} onChange={(value, option) => {
                          form.setFieldsValue({ "OldStandardValue": option.props["data-concentration"] })
                          this.setState({
                            StandardPollutantName: option.props.children ? option.props.children[0] : undefined
                          })
                          if (value == "02" || value == "03") {
                            form.setFieldsValue({ "OldStandardUnit": "mg/m3", "MatchStandardUnit": "mg/m3" })
                          } else {
                            form.setFieldsValue({ "OldStandardUnit": "%", "MatchStandardUnit": "%" })
                          }
                        }}>
                          {
                            standardGasList.filter(itm => itm.PollutantCode !== "065").map(item => {
                              return <Option key={item.PollutantCode} value={item.PollutantCode} data-concentration={item.Concentration} data-totalFlowSetVal={item.TotalFlowSetVal}>
                                {item.PollutantName}
                                {this.getResidueIcon(item.VolumeValue, item.GasInitPower)}
                              </Option>
                            })
                          }
                          <Option key={"P"} value={"P"} data-concentration={"0"} data-totalFlowSetVal={"0"}>
                            空气
                            <span></span>
                          </Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="总流量设定值">
                      {getFieldDecorator('FlowValue', {
                        rules: [{
                          required: form.getFieldValue("StandardPollutantCode") !== "P" ? true : false,
                          message: '建议设为取样流量的1.5倍-2倍!',
                        },],
                      })(
                        <InputNumber
                          disabled={form.getFieldValue("StandardPollutantCode") == "P"}
                          // formatter={value => `${value}${form.getFieldValue("OldStandardUnit")}`}
                          // parser={value => value.replace(`${form.getFieldValue("OldStandardUnit")}`, '')}
                          placeholder="建议设为取样流量的1.5倍-2倍" style={{ width: '70%' }} min={0} precision={1} />
                      )}
                      <span className="ant-form-text">ml/min</span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="通气时间">
                      {getFieldDecorator('VentilationTime', {
                        rules: [{
                          required: true,
                          message: '请选择通气时间!',
                        },],
                      })(
                        <Select
                          placeholder="请选择通气时间"
                        // onChange={value => { this.changeStandardGasData('StabilizationTime', value, idx) }}
                        >
                          {
                            this.getTimeOptions().map(item => item)
                          }
                        </Select>,

                      )}
                    </Form.Item>
                  </Col>
                  {
                    form.getFieldValue("StandardPollutantCode") !== "P" && <Col span={12}>
                      <Form.Item label="稳定时间">
                        {getFieldDecorator('StabilizationTime', {
                          rules: [{
                            required: true,
                            message: '请选择稳定时间!',
                          },],
                        })(
                          <Select
                            placeholder="请选择稳定时间"
                          // onChange={value => { this.changeStandardGasData('StabilizationTime', value, idx) }}
                          >
                            {
                              this.getTimeOptions().map(item => item)
                            }
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                  }
                  <Col span={12}>
                    <Form.Item label="配比标气浓度设定值">
                      {getFieldDecorator('MatchStandardValue', {
                        rules: [{
                          required: form.getFieldValue("StandardPollutantCode") !== "P" ? true : false,
                          message: '请输入配比标气浓度设定值!',
                        }],
                      })(
                        // min={50} max={5000}
                        <InputNumber disabled={form.getFieldValue("StandardPollutantCode") == "P"} placeholder="请输入配比标气浓度设定值" style={{ width: '70%' }} min={0} max={form.getFieldValue("OldStandardValue")} precision={1} />
                      )}
                      <span className="ant-form-text">{form.getFieldValue("OldStandardUnit")}</span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
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
                              MNHall: option.props.MNHall
                            })
                            // 获取标气列表
                            this.props.dispatch({
                              type: "qualityControl/getStandardGas",
                              payload: {
                                QCAMN: this.state.QCAMN, DGIMN: value
                              }
                            });
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
                  <Col span={12} style={{ display: "none" }}>
                    <Form.Item label="原标气浓度值单位">
                      {getFieldDecorator('OldStandardUnit', {
                        // rules: [{
                        //   required: true,
                        //   message: '请选择原标气浓度值单位!',
                        // },],
                        initialValue: "mg/m3"
                      })(
                        <p>{form.getFieldValue("OldStandardUnit")}</p>
                        // <Input disabled/>
                        // <Select placeholder="请选择原标气浓度值单位">
                        //   <Option key="0" disabled={form.getFieldValue("OldStandardUnit") != "0"} >mg/m3</Option>
                        //   <Option key="1" disabled={form.getFieldValue("OldStandardUnit") != "1"}>%</Option>
                        // </Select>
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={12} style={{ display: "none" }}>
                    <Form.Item label="配比标气浓度单位">
                      {getFieldDecorator('MatchStandardUnit', {
                        // rules: [{
                        //   required: true,
                        //   message: '请选择配比标气浓度单位!',
                        // },],
                        initialValue: "mg/m3"
                      })(
                        <p>{form.getFieldValue("MatchStandardUnit")}</p>
                        // <Input disabled/>
                        // <Select placeholder="请选择配比标气浓度单位">
                        //   <Option key="0" disabled={form.getFieldValue("MatchStandardUnit") != "0"}>mg/m3</Option>
                        //   <Option key="1" disabled={form.getFieldValue("MatchStandardUnit") != "1"}>%</Option>
                        // </Select>
                      )}
                    </Form.Item>
                  </Col>
                  {
                    form.getFieldValue("StandardPollutantCode") !== "P" && <Col span={12}>
                      <Form.Item label="稀释气组分名称">
                        {getFieldDecorator('DeliPollutantCode', {
                          // rules: [{
                          //   required: true,
                          //   message: '请选择稀释气组分名称!',
                          // },],
                          initialValue: "0"
                        })(
                          // <p>{"N2"} {this.getResidueIcon(VolumeValue, GasInitPower)}</p>
                          <Select disabled placeholder="请选择稀释气组分名称">
                            <Option key="0">
                              N2
                            {/*  TODO (WJQ) :
                            替换成
                            {this.getResidueIcon(standardGasList.filter(itm => itm.PollutantCode === "065")[0]["余量字段名"])}
                            */}
                              {this.getResidueIcon(VolumeValue, GasInitPower)}
                            </Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  }
                  {
                    form.getFieldValue("StandardPollutantCode") !== "P" &&
                    <Col span={12}>
                      <Form.Item label="原标气浓度">
                        {getFieldDecorator('OldStandardValue', {
                          // rules: [{
                          //   required: true,
                          //   message: '请输入原标气浓度!',
                          // },],
                        })(
                          <>
                            {
                              form.getFieldValue("OldStandardValue") ?
                                <p>
                                  {form.getFieldValue("OldStandardValue")}
                                  {form.getFieldValue("OldStandardUnit")}
                                </p> : undefined
                            }
                          </>
                          // min={500} max={5000}
                          // <InputNumber placeholder="请输入原标气浓度" style={{ width: '100%' }} min={0} precision={1} />
                        )}
                      </Form.Item>
                    </Col>
                  }
                </Row>
                {/* <Row>
                  <div>
                    <CustomIcon type="icon-dianliang" />
                    <span>余量剩余：12.13, 预计可用至2019-11-20 14:23:15</span>
                  </div>
                </Row> */}
                {/* <Divider orientation="right">

                </Divider> */}
                {/* <Row>
                  <Button type="primary" style={{ float: "right" }}>开始质控</Button>
                </Row> */}
              </Form>
            </Modal>
          </Spin>
        </Card>
      </>
    );
  }
}

export default RemoteControlPage;
