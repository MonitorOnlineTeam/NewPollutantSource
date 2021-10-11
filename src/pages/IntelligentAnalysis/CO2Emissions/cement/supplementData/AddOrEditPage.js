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
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const layout2 = {
  labelCol: { span: 15 },
  wrapperCol: { span: 9 },
};

const SELECT_LIST = {
  statusList: [{ "key": 1, "value": "新增" }, { "key": 2, "value": "既有" }],
  FossilTypeList: [{ "key": 1, "value": "燃煤" }, { "key": 2, "value": "原油" }, { "key": 3, "value": "燃料油" }, { "key": 4, "value": "汽油" }, { "key": 5, "value": "柴油" }, { "key": 6, "value": "炼厂干气" }, { "key": 7, "value": "其它石油制品" }, { "key": 8, "value": "天然气" }, { "key": 9, "value": "焦炉煤气" }, { "key": 10, "value": "其它煤气" }]
}
const SELECT_LISTWhere = [{ "key": 2, "value": "缺省值" }];
const CONFIG_ID = 'CO2SupplementaryData';

@connect(({ loading, autoForm, CO2Emissions }) => ({
  // loading: loading.effects['autoForm/getAutoFormData'],
  loading: loading.effects['autoForm/getFormData'],
  configIdList: autoForm.configIdList,
  cementDictionaries: CO2Emissions.cementDictionaries,
}))
class AddOrEditPage extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isModalVisible: false,
      TSYVisible: false,
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
    if (!this.props.cementDictionaries.one) {
      this.props.dispatch({
        type: 'CO2Emissions/getCO2EnergyType',
        payload: {
          IndustryCode: this.props.location.query.industry
        },
      })
    }

    let KEY = this.props.history.location.query.key;
    if (KEY) {
      this.getFormData(KEY)
    }
  }

  handleCancel = () => {
    this.setState({ isModalVisible: false, TSYVisible: false });
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
      }
    })
  }

  // 种类change，填写缺省值
  onTypesChange = (value) => {
    const { cementDictionaries } = this.props;
    this.formRef.current.setFieldsValue({
      'LowFever': cementDictionaries.one[value]["低位发热量"],
      'UnitCarbonContent': cementDictionaries.one[value]["含碳量"],
      'CO2OxidationRate': cementDictionaries.one[value]["碳氧化率"],
    });
  }

  // 计算排放量
  countEmissions = () => {
    // 化石燃料燃烧排放量 = 消耗量 × 低位发热量  × (单位热值含碳量  × 碳氧化率  × 44 ÷ 12)
    let values = this.formRef.current.getFieldsValue();
    let { AnnualConsumption = 0, LowFever = 0, UnitCarbonContent = 0, CO2OxidationRate = 0 } = values;
    // let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0; // 年消耗量
    // let LowFever = this.formRef.current.getFieldValue('LowFever') || 0; //低位发热量
    // let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0; //单位热值含碳量
    // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0; //碳氧化率
    let value1 = AnnualConsumption * LowFever;
    let value2 = UnitCarbonContent * CO2OxidationRate * 44 / 12;
    let count = value1 * value2;
    this.formRef.current.setFieldsValue({ 'tCO2': count });
  }

  render() {
    const { isModalVisible, TSYVisible, editData } = this.state;
    const { loading, cementDictionaries } = this.props;
    const { Output_Enterprise = [] } = this.props.configIdList;
    let KEY = this.props.history.location.query.key;
    const TYPES = cementDictionaries.two || [];

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
                  LowFeverDataType: 2,
                  UnitCarbonContentDataType: 2,
                  CO2OxidationRateDataType: 2,
                  // PowerDataType: 1,
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
                      name="Name"
                      label="生产线名称"
                      rules={[{ required: true, message: '请填写生产线名称!' }]}
                    >
                      <Input placeholder="请填写生产线名称" />
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
                      name="FossilFuel_tCO2"
                      label={
                        <span>
                          化石燃料燃烧排放量(tCO₂)
                          <QuestionTooltip content="化石燃料燃烧排放量 = 消耗量 × 低位发热量 × (单位热值含碳量 × 碳氧化率 × 44 ÷ 12) " />
                        </span>
                      }
                      rules={[{ required: true, message: '请填写化石燃料燃烧排放量!' }]}
                    >
                      <InputNumber style={{ width: 'calc(100% - 88px)' }} onChange={(val) => { this.countCrew_tCO2() }} placeholder="请填写化石燃料燃烧排放量" />
                    </Form.Item>
                    <Button style={{ position: 'absolute', top: 0, right: 0 }} type="primary" onClick={() => {
                      this.setState({ isModalVisible: true })
                    }}>计算排放</Button>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="Carbonate_tCO2"
                      label={
                        <span>
                          熟料对应的碳酸盐分解排放量(tCO₂)
                          <QuestionTooltip content="熟料对应的碳酸盐分解排放量 = ((熟料中CaO的含量 - 熟料中不是来源于碳酸盐分解的CaO的含量) × 44 / 56) + ((熟料中MgO的含量 - 熟料中不是来源于碳酸盐分解的MgO的含量) * 44 / 40)" />
                        </span>
                      }
                      rules={[{ required: true, message: '请填写熟料对应的碳酸盐分解排放量!' }]}
                    >
                      <InputNumber style={{ width: 'calc(100% - 88px)' }} onChange={(val) => { this.countCrew_tCO2() }} placeholder="请填写熟料对应的碳酸盐分解排放量" />
                    </Form.Item>
                    <Button style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => this.setState({ TSYVisible: true })} type="primary">计算排放</Button>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="Power_tCO2"
                      label={
                        <span>
                          消耗电力对应的排放量(tCO₂)
                          <QuestionTooltip content="消耗电力对应的排放量 = 消耗电量 × 排放因子" />
                        </span>
                      }
                      rules={[{ required: true, message: '请填写消耗电力对应的排放量!' }]}
                    >
                      <InputNumber style={{ width: 'calc(100% - 88px)' }} onChange={(val) => { this.countCrew_tCO2() }} placeholder="请填写购入电力产生的排放" />
                    </Form.Item>
                    <Popover
                      title="计算消耗电力对应的排放量"
                      trigger="click"
                      content={
                        <>
                          <Form.Item
                            name="Power"
                            label="消耗电量(MWh)"
                          >
                            <InputNumber onChange={(value) => {
                              let val2 = this.formRef.current.getFieldValue('PowerEmission') || 0;
                              let count = (value * val2).toFixed(2);
                              this.formRef.current.setFieldsValue({ 'Power_tCO2': count });
                              // this.countCrew_tCO2();
                            }} style={{ width: '100%' }} placeholder="请填写元素含碳量" />
                          </Form.Item>
                          <Form.Item
                            name="PowerDataType"
                            label="来源"
                          >
                            <Select placeholder="请选择电力来源">
                              <Option value={1}>电网供电</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name="PowerEmission"
                            label={<span>排放因子(tCO₂/MWh)</span>}
                          >
                            <InputNumber onChange={(value) => {
                              let val2 = this.formRef.current.getFieldValue('Power') || 0;
                              let count = (value * val2).toFixed(2);
                              this.formRef.current.setFieldsValue({ 'Power_tCO2': count });
                              // this.countCrew_tCO2();
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
                      name="Heat_tCO2"
                      label={
                        <span>
                          消耗热力对应的排放量(tCO₂)
                          <QuestionTooltip content="消耗热力对应的排放量 = 消耗热量 × 排放因子" />
                        </span>
                      }
                      rules={[{ required: true, message: '请填写消耗热力对应的排放量!' }]}
                    >
                      <InputNumber style={{ width: 'calc(100% - 88px)' }} onChange={(val) => { this.countCrew_tCO2() }} placeholder="请填写购入电力产生的排放" />
                    </Form.Item>
                    <Popover
                      title="计算消耗热力对应的排放量"
                      trigger="click"
                      content={
                        <>
                          <Form.Item
                            name="Heat"
                            label="消耗热量(GJ)"
                          >
                            <InputNumber onChange={(value) => {
                              let val2 = this.formRef.current.getFieldValue('HeatEmission') || 0;
                              let count = (value * val2).toFixed(2);
                              this.formRef.current.setFieldsValue({ 'Heat_tCO2': count });
                              // this.countCrew_tCO2();
                            }} style={{ width: '100%' }} placeholder="请填写消耗热量" />
                          </Form.Item>
                          <Form.Item
                            name="HeatDataType"
                            label="来源"
                          >
                            <Select placeholder="请选择热量来源">
                              <Option value={1}>余热回收</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            name="HeatEmission"
                            label={<span>排放因子(tCO₂/MWh)</span>}
                          >
                            <InputNumber onChange={(value) => {
                              let val2 = this.formRef.current.getFieldValue('Heat') || 0;
                              let count = (value * val2).toFixed(2);
                              this.formRef.current.setFieldsValue({ 'Heat_tCO2': count });
                              // this.countCrew_tCO2();
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
                      name="GuessedYield"
                      label={
                        <span>
                          熟料产量(t)
                        </span>
                      }
                      rules={[{ required: true, message: '请填写熟料产量!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写熟料产量" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="tCO2"
                      label={
                        <span>
                          二氧化碳排放总量(tCO₂)
                          <QuestionTooltip content="二氧化碳排放总量 = 化石燃料燃烧排放量 + 熟料对应的碳酸盐分解排放量 + 消耗电力对应的排放量 + 消耗热力对应的排放量" />
                        </span>
                      }
                      rules={[{ required: true, message: '请填写二氧化碳排放总量!' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="请填写二氧化碳排放总量!" />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider orientation="right">
                  <Button type="primary" loading={false} onClick={this.onHandleSubmit}>保存</Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      router.push('/Intelligentanalysis/cement/supplementData?industry=2')
                    }}
                  >返回</Button>
                </Divider>
                <Modal
                  title="计算化石燃料燃烧排放量"
                  visible={isModalVisible}
                  maskClosable={false}
                  onOk={this.onModalOk}
                  onCancel={this.handleCancel}
                  width={1000}
                >
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        name="FossilType"
                        label="燃料种类"
                        rules={[{ required: true, message: '请选择燃料种类!' }]}
                      >
                        <Select placeholder="请选择燃料种类" onChange={this.onTypesChange}>
                          {
                            TYPES.map(item => {
                              return <Option value={item.code} key={item.code}>{item.name}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="AnnualConsumption"
                        label="年消耗量(t/10⁴Nm³)"
                        rules={[{ required: true, message: '请填写年消耗量!' }]}
                      >
                        <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写消耗量" onChange={this.countEmissions} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="LowFeverDataType"
                        label="低位发热量数据来源"
                        rules={[{ required: true, message: '请选择低位发热量数据来源!' }]}
                      >
                        <Select placeholder="请选择低位发热量数据来源">
                          {
                            SELECT_LISTWhere.map(item => {
                              return <Option value={item.key} key={item.key}>{item.value}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="LowFever"
                        label="低位发热量(GJ/t,GJ/10⁴Nm³)"
                        rules={[{ required: true, message: '请填写低位发热量!' }]}
                      >
                        <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写低位发热量"
                          onChange={this.countEmissions}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="UnitCarbonContentDataType"
                        label="单位热值含碳量数据来源"
                        rules={[{ required: true, message: '请选择单位热值含碳量数据来源!' }]}
                      >
                        <Select placeholder="请选择单位热值含碳量数据来源">
                          {
                            SELECT_LISTWhere.map(item => {
                              return <Option value={item.key} key={item.key}>{item.value}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="UnitCarbonContent"
                        label={
                          <span>
                            单位热值含碳量(tC/GJ)
                            {/* <QuestionTooltip content="单位热值含碳量 = 低位发热量 × 元素含碳量" /> */}
                          </span>
                        }
                        rules={[{ required: true, message: '请填写单位热值含碳量!' }]}
                      >
                        <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写单位热值含碳量" onChange={this.countEmissions} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="CO2OxidationRateDataType"
                        label="碳氧化率数据来源"
                        rules={[{ required: true, message: '请选择碳氧化率数据来源!' }]}
                      >
                        <Select placeholder="请选择碳氧化率数据来源">
                          {
                            SELECT_LISTWhere.map(item => {
                              return <Option value={item.key} key={item.key}>{item.value}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="CO2OxidationRate"
                        label={
                          <span>
                            碳氧化率(%)
                          </span>
                        }
                        rules={[{ required: true, message: '请填写碳氧化率!' }]}
                      >
                        <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写碳氧化率" onChange={this.countEmissions} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="单位"
                        label='单位'
                      >
                        <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写排放量" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="tCO2"
                        label={
                          <span>
                            排放量（tCO₂）
                            <QuestionTooltip content="化石燃料燃烧排放量 = 消耗量 × 低位发热量  × (单位热值含碳量  × 碳氧化率  × 44 ÷ 12) " />
                          </span>
                        }
                        rules={[{ required: true, message: '请填写排放量!' }]}
                      >
                        <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写排放量" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Modal>
                <Modal
                  title="计算碳酸盐分解排放量"
                  visible={TSYVisible}
                  maskClosable={false}
                  onOk={this.onModalOk}
                  onCancel={this.handleCancel}
                  width={1000}
                >
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        name="AnnualConsumption"
                        label="熟料产量(t)"
                        {...layout2}
                        rules={[{ required: true, message: '请填写熟料产量!' }]}
                      >
                        <InputNumber style={{ width: '100%' }} placeholder="请填写熟料产量" onChange={this.onTypesChange} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...layout2}
                        name="CalciumContent"
                        label="熟料中CaO的含量（%）"
                        rules={[{ required: true, message: '请填写熟料中CaO的含量!' }]}
                      >
                        <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写熟料中CaO的含量" onChange={this.countEmissions} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...layout2}
                        name="MagnesiumContent"
                        label="熟料中MgO的含量（%）"
                        rules={[{ required: true, message: '请填写熟料中MgO的含量!' }]}
                      >
                        <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写熟料中MgO的含量" onChange={this.countEmissions} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...layout2}
                        name="NoCalciumContent"
                        label="熟料中不是来源于碳酸盐分解的CaO的含量(%)"
                        rules={[{ required: true, message: '请填写熟料中不是来源于碳酸盐分解的CaO的含量!' }]}
                      >
                        <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写熟料中不是来源于碳酸盐分解的CaO的含量"
                          onChange={this.countEmissions}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...layout2}
                        name="NoMagnesiumContent"
                        label="熟料中不是来源于碳酸盐分解的MgO的含量(%)"
                        rules={[{ required: true, message: '请填写熟料中不是来源于碳酸盐分解的MgO的含量!' }]}
                      >
                        <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写熟料中不是来源于碳酸盐分解的MgO的含量"
                          onChange={this.countEmissions}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Modal>
              </Form>
          }
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default AddOrEditPage;
