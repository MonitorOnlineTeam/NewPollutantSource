import React, { PureComponent } from 'react';
import { Card, Form, Input, InputNumber, Select, Row, Col, Modal, Button, Popover, Divider, Spin, DatePicker } from 'antd'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { router } from 'umi';
import { connect } from 'dva'
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'

const { Option } = Select;
const { Search } = Input;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const layout2 = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const SELECT_LIST = {
  statusList: [{ "key": 1, "value": "新增" }, { "key": 2, "value": "既有" }],
  FossilTypeList: [{ "key": 1, "value": "燃煤" }, { "key": 2, "value": "原油" }, { "key": 3, "value": "燃料油" }, { "key": 4, "value": "汽油" }, { "key": 5, "value": "柴油" }, { "key": 6, "value": "炼厂干气" }, { "key": 7, "value": "其它石油制品" }, { "key": 8, "value": "天然气" }, { "key": 9, "value": "焦炉煤气" }, { "key": 10, "value": "其它煤气" }]
}
const CONFIG_ID = 'CO2SupplementaryData';

@connect(({ loading, autoForm, global }) => ({
  // loading: loading.effects['autoForm/getAutoFormData'],
  loading: loading.effects['autoForm/getFormData'],
  configIdList: autoForm.configIdList,
}))
class AddOrEditPage extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isModalVisible: false,
      editData: {
        SlagYield: 0,
        SlagAvgCO2: 0,
        FlyAshYield: 0,
        FlyAshAvgCO2: 0,
        RemoveDustRate: 0
      }
    };
  }

  componentDidMount() {
    let KEY = this.props.history.location.query.key;
    if (KEY) {
      this.getFormData(KEY)
    }
  }

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  // 计算化石燃料燃烧排放量
  onModalOk = () => {
    let values = this.formRef.current.getFieldsValue();
    const { Consumption = 0, LowFever = 0, UnitCarbonContent = 0, CO2OxidationRate = 0 } = values;
    let value1 = Consumption * LowFever;
    let value2 = UnitCarbonContent * CO2OxidationRate * 44 / 12;
    // let value3 = UnitCarbonContent * CO2OxidationRate * 44;
    // let value4 = UnitCarbonContent * CO2OxidationRate * 12;
    // if (value4) {
    //   let value2 = value3 / value4;
    let count = (value1 * value2).toFixed(2);
    //   this.formRef.current.setFieldsValue({ 'FossilFuel_tCO2': count });
    // } else {
    this.formRef.current.setFieldsValue({ 'FossilFuel_tCO2': count });
    // }
    this.setState({ isModalVisible: false })
    this.countCrew_tCO2();
    // (消耗量 × 低位发热量 × 10⁻⁶ × (单位热值含碳量  × 碳氧化率  × 12 ÷ 44))
    // （消耗量*低位发热量*0.000001）*(（单位热值含碳量*碳氧化率*44）/（单位热值含碳量*碳氧化率*12）)
    // （消耗量*低位发热量*0.000001）*(单位热值含碳量*碳氧化率*12/44)

    // name = "Consumption"
    // label = "消耗量(t或万Nm3)"
    // name = "LowFever"
    // label = "低位发热量(GJ/t或GJ/万Nm3)"
    // name = "UnitCarbonContent"
    // label = "单位热值含碳量(tC/GJ)"
  }

  // 计算碳氧化率
  countCO2Rate = () => {
    let values = this.formRef.current.getFieldsValue();
    const { editData } = this.state;
    console.log('values=', values)
    // const { Consumption = 0, LowFever = 0, UnitCarbonContent = 0 } = values;
    const { SlagYield = 0, SlagAvgCO2 = 0, FlyAshYield = 0, FlyAshAvgCO2 = 0, RemoveDustRate = 0, Consumption = 0, LowFever = 0, UnitCarbonContent = 0 } = values;

    let value3 = 0;
    if (RemoveDustRate) {
      value3 = FlyAshYield * FlyAshAvgCO2 / RemoveDustRate;
    }
    let value1 = SlagYield * SlagAvgCO2 + value3;
    let value2 = Consumption * LowFever * UnitCarbonContent;
    console.log('value1=', value1, 'value2=', value2)
    let count = 0;
    if (value2) {
      count = (1 - (value1 * 1000000 / value2)).toFixed(2);
    }
    this.formRef.current.setFieldsValue({ 'CO2OxidationRate': count });
    // name = "Consumption"
    // label = "消耗量(t或万Nm3)"
    // name = "LowFever"
    // label = "低位发热量(GJ/t或GJ/万Nm3)"
    // name = "UnitCarbonContent"
    // label = "单位热值含碳量(tC/GJ)"

    // name = "SlagYield"
    // label = "全年炉渣产量（t）"
    // name = "SlagAvgCO2"
    // label = "炉渣平均含碳量（%）"
    // name = "FlyAshYield"
    // label = "全年飞灰产量（t）"
    // name = "FlyAshAvgCO2"
    // label = "飞灰平均含碳量（%）"
    // name = "RemoveDustRate"
    // label = "系统平均除尘效率（%）"
    // 1 -（（全年炉渣产量*炉渣平均含碳量+全年飞灰产量*飞灰平均含碳量/除尘效率）*100w/(消耗量*低位发热量*单位热值含碳量)）
    // 1 - ((全年炉渣产量 × 炉渣平均含碳量 + 全年飞灰产量 × 飞灰平均含碳量 ÷ 除尘效率) × 10⁶) ÷ (消耗量 × 低位发热量 × 单位热值含碳量)
    // let qnlzcl =

  }

  // 计算机组二氧化碳排放量
  countCrew_tCO2 = () => {
    let values = this.formRef.current.getFieldsValue();
    const { FossilFuel_tCO2 = 0, PowerDischarge_tCO2 = 0 } = values;
    let count = FossilFuel_tCO2 + PowerDischarge_tCO2;
    this.formRef.current.setFieldsValue({ 'Crew_tCO2': count });
  }

  // 保存
  onHandleSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      let KEY = this.props.history.location.query.key;
      const { editData } = this.state;
      console.log('KEY=', KEY)
      let actionType = KEY ? 'autoForm/saveEdit' : 'autoForm/add';
      console.log('values=', values)
      // return;
      this.props.dispatch({
        type: actionType,
        payload: {
          configId: CONFIG_ID,
          FormData: {
            ...editData,
            ...values,
            MonitorTime: moment(values.MonitorTime).format("YYYY-MM-01 00:00"),
            SupplementaryDataCode: KEY
          },
          reload: KEY ? true : undefined,
        }
      }).then(() => {
        router.push('/Intelligentanalysis/CO2Material/supplementData')
      })
    })
  }

  // 获取编辑数据
  getFormData = (KEY) => {
    this.props.dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: CONFIG_ID,
        'dbo.T_Bas_CO2SupplementaryData.SupplementaryDataCode': KEY,
      },
      callback: (res) => {

        this.setState({
          editData: {
            ...res,
          },
        })
        // , () => {
        //   this.formRef.current.setFieldsValue({
        //     ...res,
        //     'SlagYield': res.SlagYield,
        //     'SlagAvgCO2': res.SlagAvgCO2,
        //     'FlyAshYield': res.FlyAshYield,
        //     'FlyAshAvgCO2': res.FlyAshAvgCO2,
        //     'RemoveDustRate': res.RemoveDustRate,
        //   });
        // })
      }
    })
  }

  render() {
    const { isModalVisible, editData } = this.state;
    const { loading } = this.props;
    const { Output_Enterprise = [] } = this.props.configIdList;
    let KEY = this.props.history.location.query.key;
    console.log('editData=', editData)
    return (
      <BreadcrumbWrapper title="添加">
        <Card>
          {
            loading ?
              <div className="example"><Spin></Spin></div> :
              <Form
                {...layout}
                ref={this.formRef}
                initialValues={{
                  ...editData,
                  MonitorTime: moment(editData.MonitorTime),
                  EntCode: editData['dbo.T_Bas_Enterprise.EntCode'],
                }}
              >
                <Row>
                  <Col span={12}>
                    <Form.Item
                      name="EntCode"
                      label="企业"
                      rules={[{ required: true, message: '请选择企业!' }]}
                    >
                      <Select placeholder="请选择企业">
                        {
                          Output_Enterprise.map(item => {
                            return <Option value={item["dbo.T_Bas_Enterprise.EntCode"]} key={item["dbo.T_Bas_Enterprise.EntCode"]}>{item["dbo.T_Bas_Enterprise.EntName"]}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="MonitorTime"
                      label="时间"
                      rules={[{ required: true, message: '请选择时间!' }]}
                    >
                      <DatePicker picker="month" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="Status"
                      label="状态"
                      rules={[{ required: true, message: '请选择状态!' }]}
                    >
                      <Select placeholder="请选择状态">
                        {
                          SELECT_LIST.statusList.map(item => {
                            return <Option value={item.key} key={item.key}>{item.value}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="FossilType"
                      label="发电燃料类型"
                      rules={[{ required: true, message: '请选择发电燃料类型!' }]}
                    >
                      <Select placeholder="请选择发电燃料类型">
                        {
                          SELECT_LIST.FossilTypeList.map(item => {
                            return <Option value={item.key} key={item.key}>{item.value}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="Capacity"
                      label="装机容量（MW）"
                      rules={[{ required: true, message: '请填写装机容量!' }]}
                    >
                      <InputNumber min={0} placeholder={'请填写装机容量'} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="PressureParams"
                      label="压力参数"
                    >
                      <Input placeholder="请填写压力参数" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="CrewType"
                      label="机组类型"
                    >
                      <Input placeholder="请填写机组类型" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="CoolingMethod"
                      label="冷却方式"
                    >
                      <Input placeholder="请填写冷却方式" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="FossilFuel_tCO2"
                      label={
                        <span>
                          化石燃料燃烧排放量(tCO₂)
                          <QuestionTooltip content="化石燃料燃烧排放量 = 消耗量 × 低位发热量 × (单位热值含碳量 × 碳氧化率 × 44 ÷ 12) " />
                        </span>
                      }
                      rules={[{ required: true, message: '请填写化石燃料燃烧排放量!' }]}
                    >
                      <Input style={{ width: 'calc(100% - 88px)' }} onChange={(val) => { this.countCrew_tCO2() }} placeholder="请填写化石燃料燃烧排放量" />
                    </Form.Item>
                    <Button style={{ position: 'absolute', top: 0, right: 0 }} type="primary" onClick={() => {
                      this.setState({ isModalVisible: true })
                    }}>计算排放</Button>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="PowerDischarge_tCO2"
                      // label="购入电力产生的排放(tCO2)"
                      label={
                        <span>
                          购入电力产生的排放(tCO₂)
                          <QuestionTooltip content="购入电力产生的排放 = 购入电量 × 排放因子" />
                        </span>
                      }
                      rules={[{ required: true, message: '请填写购入电力产生的排放!' }]}
                    >
                      <Input style={{ width: 'calc(100% - 88px)' }} onChange={(val) => { this.countCrew_tCO2() }} placeholder="请填写购入电力产生的排放" />
                    </Form.Item>
                    <Popover
                      title="计算购入电力产生的排放"
                      trigger="click"
                      content={
                        <>
                          <Form.Item
                            {...layout2}
                            name="BuyPower"
                            label="购入电量"
                          >
                            <InputNumber onChange={(value) => {
                              let val2 = this.formRef.current.getFieldValue('Emission') || 0;
                              let count = (value * val2).toFixed(2);
                              this.formRef.current.setFieldsValue({ 'PowerDischarge_tCO2': count });
                              this.countCrew_tCO2();
                            }} style={{ width: '100%' }} placeholder="请填写元素含碳量" />
                          </Form.Item>
                          <Form.Item
                            {...layout2}
                            name="Emission"
                            label={<span>排放因子<br />(tCO₂/MWh)</span>}
                          >
                            <InputNumber onChange={(value) => {
                              let val2 = this.formRef.current.getFieldValue('BuyPower') || 0;
                              let count = (value * val2).toFixed(2);
                              this.formRef.current.setFieldsValue({ 'PowerDischarge_tCO2': count });
                              this.countCrew_tCO2();
                            }} style={{ width: '100%' }} placeholder="请填写排放因子" />
                          </Form.Item>
                        </>
                      }
                    >
                      <Button style={{ position: 'absolute', top: 0, right: 0 }} type="primary">计算排放</Button>
                    </Popover>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="Crew_tCO2"
                      label={
                        <span>
                          机组二氧化碳排放量(tCO₂)
                          <QuestionTooltip content="机组二氧化碳排放量 = 化石燃料燃烧排放量 + 购入电力产生的排放" />
                        </span>
                      }
                      rules={[{ required: true, message: '请填写机组二氧化碳排放量!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写机组二氧化碳排放量" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="Generating"
                      label="发电量(MWh)"
                      rules={[{ required: true, message: '请填写发电量!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写发电量!" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="PowerSupply"
                      label="供电量(MWh)"
                      rules={[{ required: true, message: '请填写供电量!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写供电量!" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="Heating"
                      label="供热量(MWh)"
                      rules={[{ required: true, message: '请填写供热量!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写供热量!" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="HeatingRate"
                      label="供热比"
                      rules={[{ required: true, message: '请填写供热比!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写供热比!" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="WireCoalConsumption"
                      label="供电煤耗/气耗（万Nm³,tce/MWH）"
                      rules={[{ required: true, message: '请填写供电煤耗/气耗!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写供电煤耗/气耗!" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="HeatCoalConsumption"
                      label="供热煤耗/气耗(万Nm³,tce/TJ)"
                      rules={[{ required: true, message: '请填写供热煤耗/气耗!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写供热煤耗/气耗!" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="WireDisStrength"
                      label="供电碳排放强度"
                      rules={[{ required: true, message: '请填写供电碳排放强度!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写供电碳排放强度!" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="HeatDisStrength"
                      label="供热碳排放强度"
                      rules={[{ required: true, message: '请填写供热碳排放强度!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写供热碳排放强度!" />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider orientation="right">
                  <Button type="primary" loading={false} onClick={this.onHandleSubmit}>保存</Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      router.push('/Intelligentanalysis/CO2Material/supplementData')
                    }}
                  >返回</Button>
                </Divider>
                <Modal title="计算化石燃料燃烧排放量" visible={isModalVisible} maskClosable={false} onOk={this.onModalOk} onCancel={this.handleCancel}>
                  <Col span={24}>
                    <Form.Item
                      {...layout2}
                      name="Consumption"
                      label="消耗量(t或万Nm³)"
                    // rules={[{ required: isModalVisible, message: '请填写消耗量!' }]}
                    >
                      <InputNumber onChange={(value) => {
                        this.countCO2Rate()
                      }} min={0} style={{ width: '100%' }} placeholder="请填写消耗量" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      {...layout2}
                      name="LowFever"
                      label="低位发热量(GJ/t或GJ/万Nm³)"
                    // rules={[{ required: isModalVisible, message: '请填写低位发热量!' }]}
                    >
                      <InputNumber onChange={(value) => {
                        let val2 = this.formRef.current.getFieldValue('ElementalCarbonContent') || 0;
                        let count = (value * val2).toFixed(2);
                        this.formRef.current.setFieldsValue({ 'UnitCarbonContent': count });
                        this.countCO2Rate()
                      }} min={0} style={{ width: '100%' }} placeholder="请填写低位发热量" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      {...layout2}
                      name="UnitCarbonContent"
                      label={
                        <span>
                          单位热值含碳量(tC/GJ)
                          <QuestionTooltip content="单位热值含碳量 = 低位发热量 × 元素含碳量" />
                        </span>
                      }
                    // rules={[{ required: isModalVisible, message: '请填写单位热值含碳量!' }]}
                    >
                      {/* <Input.Group compact> */}
                      <InputNumber onChange={(value) => {
                        this.countCO2Rate()
                      }} style={{ width: 'calc(100% - 64px)' }} placeholder="请填写单位热值含碳量" />
                      {/* </Input.Group> */}
                    </Form.Item>
                    <Popover
                      trigger="click"
                      content={
                        <>
                          <Form.Item
                            {...layout2}
                            name="ElementalCarbonContent"
                            label="元素含碳量"
                          >
                            <InputNumber onChange={(value) => {
                              let val2 = this.formRef.current.getFieldValue('LowFever') || 0;
                              let count = (value * val2).toFixed(2);
                              this.formRef.current.setFieldsValue({ 'UnitCarbonContent': count });
                              this.countCO2Rate()
                            }} style={{ width: '100%' }} placeholder="请填写元素含碳量" />
                          </Form.Item>
                        </>
                      }
                      title="计算单位热值含碳量"
                    >
                      <Button style={{ position: 'absolute', top: 0, right: 0 }} type="primary">计算</Button>
                    </Popover>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      {...layout2}
                      name="CO2OxidationRate"
                      // label="碳氧化率(%)"
                      label={
                        <span>
                          碳氧化率(%)
                          <QuestionTooltip content="碳氧化率 = 1 - ((全年炉渣产量 × 炉渣平均含碳量 + 全年飞灰产量 × 飞灰平均含碳量 ÷ 除尘效率) × 10⁶) ÷ (消耗量 × 低位发热量 × 单位热值含碳量)" />
                        </span>
                      }
                    // rules={[{ required: isModalVisible, message: '请填写碳氧化率!' }]}
                    >
                      <InputNumber style={{ width: 'calc(100% - 64px)' }} placeholder="请填写碳氧化率" />
                    </Form.Item>
                    <Popover
                      title="计算碳氧化率"
                      trigger="click"
                      content={
                        <>
                          <Form.Item
                            {...layout2}
                            name="SlagYield"
                            label="全年炉渣产量（t）"
                          >
                            <InputNumber onChange={(value) => {
                              this.countCO2Rate()
                            }} style={{ width: '100%' }} placeholder="请填写全年炉渣产量" />
                          </Form.Item>
                          <Form.Item
                            {...layout2}
                            name="SlagAvgCO2"
                            label="炉渣平均含碳量（%）"
                          >
                            <InputNumber onChange={(value) => {
                              this.countCO2Rate()
                            }} style={{ width: '100%' }} placeholder="请填写炉渣平均含碳量" />
                          </Form.Item>
                          <Form.Item
                            {...layout2}
                            name="FlyAshYield"
                            label="全年飞灰产量（t）"
                          >
                            <InputNumber onChange={(value) => {
                              this.countCO2Rate()
                            }} style={{ width: '100%' }} placeholder="请填写全年飞灰产量" />
                          </Form.Item>
                          <Form.Item
                            {...layout2}
                            name="FlyAshAvgCO2"
                            label="飞灰平均含碳量（%）"
                          >
                            <InputNumber onChange={(value) => {
                              this.countCO2Rate()
                            }} style={{ width: '100%' }} placeholder="请填写飞灰平均含碳量" />
                          </Form.Item>
                          <Form.Item
                            {...layout2}
                            name="RemoveDustRate"
                            label="系统平均除尘效率（%）"
                          >
                            <InputNumber onChange={(value) => {
                              this.countCO2Rate()
                            }} style={{ width: '100%' }} placeholder="请填写除尘系统平均除尘效率" />
                          </Form.Item>
                        </>
                      }
                    >
                      <Button style={{ position: 'absolute', top: 0, right: 0 }} type="primary">计算</Button>
                    </Popover>
                  </Col>
                </Modal>
              </Form>
          }
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default AddOrEditPage;
