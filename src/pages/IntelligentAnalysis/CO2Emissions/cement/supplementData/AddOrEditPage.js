import React, { PureComponent } from 'react';
import { Card, Form, Input, InputNumber, Select, Row, Col, Modal, Button, Popover, Divider, Spin, DatePicker } from 'antd'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { router } from 'umi';
import { connect } from 'dva'
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'

const industry = INDUSTRYS.cement;
const { Option } = Select;
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
const CONFIG_ID = 'CementSupplementaryData';

@connect(({ loading, autoForm, CO2Emissions }) => ({
  // loading: loading.effects['autoForm/getAutoFormData'],
  loading: loading.effects['autoForm/getFormData'],
  configIdList: autoForm.configIdList,
  Dictionaries: CO2Emissions.Dictionaries,
}))
class AddOrEditPage extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isModalVisible: false,
      isSLVisible: false,
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
    this.props.dispatch({
      type: 'CO2Emissions/getCO2EnergyType',
      payload: {
        IndustryCode: industry
      },
    })

    let KEY = this.props.history.location.query.key;
    if (KEY) {
      this.getFormData(KEY)
    }
  }

  handleCancel = () => {
    this.setState({ isModalVisible: false, isSLVisible: false });
  };

  // 计算化石燃料燃烧排放量
  onModalOk = () => {
    // 化石燃料燃烧排放量 = 消耗量 × 低位发热量  × (单位热值含碳量  × 碳氧化率  × 44 ÷ 12)
    let values = this.formRef.current.getFieldsValue();
    let { Consumption = 0, LowFever = 0, UnitCarbonContent = 0, CO2OxidationRate = 0 } = values;

    let value1 = Consumption * LowFever;
    let value2 = UnitCarbonContent * CO2OxidationRate * 44 / 12;
    let count = value1 * value2;
    this.formRef.current.setFieldsValue({ 'FossilFuel_tCO2': count.toFixed(2) });
    this.setState({ isModalVisible: false })
    this.count_tCO2();
  }

  // 计算熟料排放量
  onSLModalOk = () => {
    // 熟料对应的碳酸盐分解排放量 = ((熟料中CaO的含量 - 熟料中不是来源于碳酸盐分解的CaO的含量) × 44 / 56) + ((熟料中MgO的含量 - 熟料中不是来源于碳酸盐分解的MgO的含量) * 44 / 40)
    let values = this.formRef.current.getFieldsValue();
    let { AnnualConsumption = 0, NoCalciumContent = 0, MagnesiumContent = 0, NoMagnesiumContent = 0 } = values;
    let value1 = (AnnualConsumption - NoCalciumContent) * 44 / 56
    let value2 = (MagnesiumContent - NoMagnesiumContent) * 44 / 40;
    let count = value1 + value2;
    this.formRef.current.setFieldsValue({ 'Carbonate_tCO2': count.toFixed(2) });
    this.setState({ isSLVisible: false })
    this.count_tCO2();
  }

  // 计算二氧化碳排放总量
  count_tCO2 = () => {
    let values = this.formRef.current.getFieldsValue();
    const { FossilFuel_tCO2 = 0, Carbonate_tCO2 = 0, Power_tCO2 = 0, Heat_tCO2 = 0 } = values;
    console.log('FossilFuel_tCO2=', FossilFuel_tCO2)
    console.log('Carbonate_tCO2=', Carbonate_tCO2)
    console.log('Power_tCO2=', Power_tCO2)
    console.log('Heat_tCO2=', Heat_tCO2)
    let count = FossilFuel_tCO2 * 1 + Carbonate_tCO2 * 1 + Power_tCO2 * 1 + Heat_tCO2 * 1;
    this.formRef.current.setFieldsValue({ 'tCO2': count.toFixed(2) });
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
        },
      }).then(() => {
        router.push('/Intelligentanalysis/cement/supplementData')
      })
    })
  }

  // 获取编辑数据
  getFormData = (KEY) => {
    this.props.dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: CONFIG_ID,
        'dbo.T_Bas_CementSupplementaryData.SupplementaryDataCode': KEY,
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
    const { Dictionaries } = this.props;
    this.formRef.current.setFieldsValue({
      'LowFever': Dictionaries.one[value]["低位发热量"],
      'UnitCarbonContent': Dictionaries.one[value]["含碳量"],
      'CO2OxidationRate': Dictionaries.one[value]["碳氧化率"],
    });
  }

  render() {
    const { isModalVisible, isSLVisible, editData } = this.state;
    const { loading, Dictionaries } = this.props;
    const { EntView = [] } = this.props.configIdList;
    let KEY = this.props.history.location.query.key;
    const TYPES = Dictionaries.two || [];

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
                  FossilType: editData['dbo.T_Bas_CementSupplementaryData.FossilType'] ? editData['dbo.T_Bas_CementSupplementaryData.FossilType'] + '' : undefined,
                  EntCode: editData['dbo.EntView.EntCode'],
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
                          EntView.map(item => {
                            return <Option value={item["dbo.EntView.EntCode"]} key={item["dbo.EntView.EntCode"]}>{item["dbo.EntView.EntName"]}</Option>
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
                      <InputNumber style={{ width: 'calc(100% - 88px)' }} onChange={(val) => { this.count_tCO2() }} placeholder="请填写化石燃料燃烧排放量" />
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
                      <InputNumber style={{ width: 'calc(100% - 88px)' }} onChange={(val) => { this.count_tCO2() }} placeholder="请填写熟料对应的碳酸盐分解排放量" />
                    </Form.Item>
                    <Button style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => this.setState({ isSLVisible: true })} type="primary">计算排放</Button>
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
                      <InputNumber style={{ width: 'calc(100% - 88px)' }} onChange={(val) => { this.count_tCO2() }} placeholder="请填写购入电力产生的排放" />
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
                              this.count_tCO2()
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
                              this.count_tCO2()
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
                      <InputNumber style={{ width: 'calc(100% - 88px)' }} onChange={(val) => { this.count_tCO2() }} placeholder="请填写购入电力产生的排放" />
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
                              this.count_tCO2();
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
                              this.count_tCO2();
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
                      router.push('/Intelligentanalysis/cement/supplementData')
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
                              return <Option value={item.code * 1} key={item.code}>{item.name}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="Consumption"
                        label="消耗量(t/10⁴Nm³)"
                        rules={[{ required: true, message: '请填写消耗量!' }]}
                      >
                        <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写消耗量" />
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
                        <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写低位发热量" />
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
                        <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写单位热值含碳量" />
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
                        <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写碳氧化率" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Modal>
                <Modal
                  title="计算熟料对应的碳酸盐分解排放量"
                  visible={isSLVisible}
                  maskClosable={false}
                  onOk={this.onSLModalOk}
                  onCancel={this.handleCancel}
                  width={1000}
                >
                  {/* 熟料对应的碳酸盐分解排放量 = ((熟料中CaO的含量 - 熟料中不是来源于碳酸盐分解的CaO的含量) × 44 / 56) + ((熟料中MgO的含量 - 熟料中不是来源于碳酸盐分解的MgO的含量) * 44 / 40) */}
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        name="AnnualConsumption"
                        label="熟料产量(t)"
                        {...layout2}
                        rules={[{ required: true, message: '请填写熟料产量!' }]}
                      >
                        <InputNumber style={{ width: '100%' }} placeholder="请填写熟料产量" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...layout2}
                        name="CalciumContent"
                        label="熟料中CaO的含量（%）"
                        rules={[{ required: true, message: '请填写熟料中CaO的含量!' }]}
                      >
                        <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写熟料中CaO的含量" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...layout2}
                        name="MagnesiumContent"
                        label="熟料中MgO的含量（%）"
                        rules={[{ required: true, message: '请填写熟料中MgO的含量!' }]}
                      >
                        <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写熟料中MgO的含量" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...layout2}
                        name="NoCalciumContent"
                        label="熟料中不是来源于碳酸盐分解的CaO的含量(%)"
                        rules={[{ required: true, message: '请填写熟料中不是来源于碳酸盐分解的CaO的含量!' }]}
                      >
                        <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写熟料中不是来源于碳酸盐分解的CaO的含量" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...layout2}
                        name="NoMagnesiumContent"
                        label="熟料中不是来源于碳酸盐分解的MgO的含量(%)"
                        rules={[{ required: true, message: '请填写熟料中不是来源于碳酸盐分解的MgO的含量!' }]}
                      >
                        <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写熟料中不是来源于碳酸盐分解的MgO的含量" />
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
