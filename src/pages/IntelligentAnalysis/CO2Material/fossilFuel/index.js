import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, Input, InputNumber, Select, Button, Popover, DatePicker } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import ConsumptionModal from '@/pages/IntelligentAnalysis/CO2Emissions/components/ConsumptionModal';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'
import { InfoCircleOutlined } from '@ant-design/icons'

const industry = INDUSTRYS.cement;
const { Option } = Select;
const { TextArea } = Input;
const CONFIG_ID = 'CO2FossilFuel';
const SELECT_LISTGet = [{ "key": 1, "value": "购(产)销存" }];
const SELECT_LISTWhere = [{ "key": 1, "value": "计算" }, { "key": 2, "value": "缺省值" }];
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

@connect(({ loading, autoForm, CO2Material }) => ({
  loading: loading.effects['autoForm/getAutoFormData'],
  getConfigLoading: loading.effects['autoForm/getPageConfig'],
  fileList: autoForm.fileList,
  tableInfo: autoForm.tableInfo,
  configIdList: autoForm.configIdList,
  cementDictionaries: CO2Material.cementDictionaries,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isModalVisible: false,
      editData: {},
      KEY: undefined,
      FileUuid: undefined,
      UnitCarbonContentState: 2,
      CO2OxidationRateState: 2,
      RateVisible: false,
      disabled1: true,
      disabled2: true,
      disabled3: true,
      currentTypeData: {},
      typeUnit: '',
      editTotalData: {},
    };
  }


  componentDidMount() {
    this.props.dispatch({
      type: 'CO2Material/getCO2EnergyType',
      payload: {
        IndustryCode: industry
      },
    })
  }

  onAddClick = () => {

  }

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
      UnitCarbonContentState: 2,
      CO2OxidationRateState: 2,
    })
  };

  // 种类change，填写缺省值
  onTypesChange = (value, option) => {
    const { cementDictionaries } = this.props;
    this.setState({
      currentTypeData: cementDictionaries.one[value],
      typeUnit: option['data-unit']
    })
    let values = this.formRef.current.getFieldsValue();
    const { LowFeverDataType, UnitCarbonContentDataType, CO2OxidationRateDataType } = values;
    if (LowFeverDataType == 2) {
      this.formRef.current.setFieldsValue({
        'LowFever': cementDictionaries.one[value]["低位发热量"],
      });
    }
    if (UnitCarbonContentDataType == 2) {
      this.formRef.current.setFieldsValue({
        'UnitCarbonContent': cementDictionaries.one[value]["含碳量"],
      });
    }
    if (CO2OxidationRateDataType == 2) {
      this.formRef.current.setFieldsValue({
        'CO2OxidationRate': cementDictionaries.one[value]["碳氧化率"],
      });
    }
    // this.countEmissions();
  }

  // 计算排放量
  countEmissions = () => {
    // 化石燃料燃烧排放量 = 消耗量 × 低位发热量  × (单位热值含碳量  × 碳氧化率 / 100 × 44 ÷ 12)
    let values = this.formRef.current.getFieldsValue();
    let { AnnualConsumption = 0, CO2OxidationRate = 0 } = values;
    let { LowFever, UnitCarbonContent } = this.unitConversion();
    // let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0; // 消耗量
    // let LowFever = this.formRef.current.getFieldValue('LowFever') || 0; //低位发热量
    // let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0; //单位热值含碳量
    // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0; //碳氧化率
    let value1 = AnnualConsumption * LowFever;
    let value2 = UnitCarbonContent * (CO2OxidationRate / 100) * 44 / 12;
    let count = value1 * value2;
    this.formRef.current.setFieldsValue({ 'tCO2': count.toFixed(2) });
  }

  // 计算单位热值含碳量
  countHTL = () => {
    // 计算单位热值含碳量 = 低位发热量  × 元素含碳量 / 100
    let values = this.formRef.current.getFieldsValue();
    let { ElementalCarbonContent = 0 } = values;
    let { LowFever } = this.unitConversion();
    let count = ElementalCarbonContent / 100 * LowFever;
    this.formRef.current.setFieldsValue({ 'UnitCarbonContent': count.toFixed(2) });
    this.countEmissions();
  }

  // 计算碳氧化率
  countTYHL = () => {
    // 碳氧化率(%) = 1 - ((全年炉渣产量 × 炉渣平均含碳量 + 全年飞灰产量 × 飞灰平均含碳量 ÷ 除尘效率) × 10⁶) ÷ (消耗量 × 低位发热量 × 单位热值含碳量)
    let values = this.formRef.current.getFieldsValue();
    let { SlagYield = 0, SlagAvgCO2 = 0, FlyAshYield = 0, FlyAshAvgCO2 = 0, RemoveDustRate = 0,
      AnnualConsumption = 0, LowFever = 0, UnitCarbonContent = 0 } = values;
    let value1 = 0;
    let count = 0;
    if (RemoveDustRate) {
      value1 = (SlagYield * SlagAvgCO2 + FlyAshYield * FlyAshAvgCO2 / RemoveDustRate) * 1000000;
    }
    let value2 = AnnualConsumption * LowFever * UnitCarbonContent;
    if (value2) {
      count = 1 - value1 / value2;
    }

    this.formRef.current.setFieldsValue({ 'CO2OxidationRate': count.toFixed(2) });
    this.countEmissions();
  }

  // 单位换算 - 全换成GJ
  unitConversion = () => {
    // 判断单位是tC/TJ 计算的时候 * 1000
    // 判断单位是MJ/t 计算的时候除以1000
    // 判断单位是MJ/m³ 计算的时候除以1000
    // 判断单位是 % 计算的时候除以100
    const { currentTypeData } = this.state;
    const { 低位发热量Unit, 含碳量Unit } = currentTypeData;
    let values = this.formRef.current.getFieldsValue();
    let { LowFever = 0, UnitCarbonContent = 0 } = values;
    switch (低位发热量Unit) {
      case 'tC/TJ':
        LowFever = LowFever * 1000;
        break;
      case 'MJ/t':
        LowFever = LowFever / 1000;
        break;
      case 'MJ/m³':
        LowFever = LowFever / 1000;
        break;
    }
    switch (含碳量Unit) {
      case 'tC/TJ':
        UnitCarbonContent = UnitCarbonContent * 1000;
        break;
      case 'MJ/t':
        UnitCarbonContent = UnitCarbonContent / 1000;
        break;
      case 'MJ/m³':
        UnitCarbonContent = UnitCarbonContent / 1000;
        break;
    }

    return { LowFever, UnitCarbonContent }
  }

  onSourceChange = (value, index, name, label, stateKey) => {
    const { cementDictionaries } = this.props;
    let values = this.formRef.current.getFieldsValue();
    const { FossilType, } = values
    if (FossilType) {
      if (value == 2) {
        // 缺省
        this.formRef.current.setFieldsValue({
          [name]: cementDictionaries.one[FossilType][label],
        });
        this.countEmissions();
      }
    }
    let key = 'disabled' + index;
    this.setState({ [key]: !this.state[key], [stateKey]: value })
  }

  // 保存
  onHandleSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      const { totalData, KEY } = this.state;
      console.log('KEY=', KEY)
      let actionType = KEY ? 'autoForm/saveEdit' : 'autoForm/add';

      this.props.dispatch({
        type: actionType,
        payload: {
          configId: CONFIG_ID,
          FormData: {
            ...totalData,
            ...values,
            MonitorTime: moment(values.MonitorTime).format("YYYY-MM-01 00:00"),
            FossilFuelCode: KEY
          },
          reload: KEY ? true : false,
        }
      }).then(() => {
        this.setState({
          isModalVisible: false,
        })
        this.getTableList();
      })
    })
  }


  getTableList = () => {
    this.props.dispatch({
      type: 'autoform/getAutoFormData',
      payload: {
        configId: CONFIG_ID,
      }
    })
  }

  // 点击编辑获取数据
  getFormData = (FileUuid) => {
    this.props.dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: CONFIG_ID,
        'dbo.T_Bas_CO2FossilFuel.FossilFuelCode': this.state.KEY,
      },
      callback: (res) => {
        console.log('res=', res)
        this.setState({
          CO2OxidationRateState: res.CO2OxidationRateDataType,
          UnitCarbonContentState: res.UnitCarbonContentDataType,
          editData: res,
          isModalVisible: true,
          editTotalData: {
            MonVolume: res.MonVolume,
            ReportVolume: res.ReportVolume,
            BuyVolume: res.BuyVolume,
            TransferVolume: res.TransferVolume,
            Consumption: res.Consumption,
            deviation: res.Deviation,
            SUM: res.AnnualConsumption,
          }
        })
      }
    })
  }


  getFloat = function (num, n) {
    n = n ? parseInt(n) : 0;
    if (n <= 0) {
      return Math.round(num);
    }
    num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
    num = Number(num).toFixed(n); //补足位数
    return num;
  };

  // 显示偏差值
  showDeviation = () => {
    if (this.formRef.current) {
      let Deviation = this.formRef.current.getFieldValue('Deviation');
      if (Deviation > 5) {
        return <p style={{ position: 'absolute', top: 68 }}>
          <InfoCircleOutlined style={{ marginRight: 10 }} />
          <span style={{ color: 'red' }}>偏差值大于5%，请添加偏差原因并上传偏差证明材料！</span>
        </p>
      } else {
        return ''
      }
    }
  }

  render() {
    const { isModalVisible, editData, FileUuid, FileUuid2, disabled1, disabled2, disabled3, currentTypeData, typeUnit, totalVisible, KEY, editTotalData } = this.state;
    const { tableInfo, cementDictionaries } = this.props;

    const { EntView = [] } = this.props.configIdList;
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CO2FossilFuel.tCO2');

    const TYPES = cementDictionaries.two || [];
    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      console.log('values=', values)
      var { Deviation, GetType } = values;
    }
    console.log('editTotalData=', editTotalData)
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper configId={CONFIG_ID} />
          <AutoFormTable
            getPageConfig
            configId={CONFIG_ID}
            onAdd={() => {
              this.setState({
                isModalVisible: true,
                editData: {},
                KEY: undefined,
                FileUuid: undefined,
              })
            }}
            onEdit={(record, key) => {
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CO2FossilFuel.AttachmentID')
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CO2FossilFuel.DevAttachmentID')
              this.setState({ KEY: key, FileUuid: FileUuid, FileUuid2: FileUuid2 }, () => {
                this.getFormData();
              })
            }}
            footer={() => <div className="">排放量合计：{count}</div>}
          />
        </Card>
        <Modal destroyOnClose width={1000} title="添加" visible={isModalVisible} onOk={this.onHandleSubmit} onCancel={this.handleCancel}>
          {this.showDeviation()}
          <Form
            style={{ marginTop: 24 }}
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              LowFeverDataType: editData.LowFeverDataType || 2,
              UnitCarbonContentDataType: editData.UnitCarbonContentDataType || 2,
              CO2OxidationRateDataType: editData.CO2OxidationRateDataType || 2,
              MonitorTime: moment(editData.MonitorTime),
              Deviation: editData.Deviation || '-',
              GetType: editData.GetType || '-',
              EntCode: editData['dbo.EntView.EntCode'],
              FossilType: editData['dbo.T_Bas_CO2FossilFuel.FossilType'] ? editData['dbo.T_Bas_CO2FossilFuel.FossilType'] + '' : undefined,
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
                  name="FossilType"
                  label="燃料种类"
                  rules={[{ required: true, message: '请选择燃料种类!' }]}
                >
                  <Select placeholder="请选择燃料种类" onChange={this.onTypesChange}>
                    {
                      TYPES.map(item => {
                        return <Option value={item.code} key={item.code} data-unit={item.typeUnit}>{item.name}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="AnnualConsumption"
                  label={<p>消耗量{typeUnit ? <span>({typeUnit})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写消耗量!' }]}
                >
                  <InputNumber bordered={false} disabled style={{ width: 'calc(100% - 64px)' }} placeholder="消耗量" onChange={this.countEmissions} />
                </Form.Item>
                <Button onClick={() => this.setState({ totalVisible: true })} style={{ position: 'absolute', top: 0, right: 0 }} type="primary">计算</Button>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="GetType"
                  label="获取方式"
                >
                  <Input style={{ color: 'rgba(0, 0, 0, 0.85)' }} disabled bordered={false} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Deviation"
                  label="消耗量偏差（%）"
                >
                  <Input style={{ color: 'rgba(0, 0, 0, 0.85)' }} disabled bordered={false} />
                  {/* <p>{Deviation !== undefined ? Deviation + '%' : '-'}</p> */}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  // labelCol={{ span: 5 }}
                  // wrapperCol={{ span: 19 }}
                  name="DeviationReson"
                  label="偏差原因"
                  rules={[{ required: Deviation > 5, message: '请填写消耗量!' }]}
                >
                  <TextArea autoSize={{ minRows: 4 }} placeholder="请填写偏差原因" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  // labelCol={{ span: 5 }}
                  // wrapperCol={{ span: 7 }}
                  name="DevAttachmentID"
                  label="偏差证明材料"
                  rules={[{ required: Deviation > 5, message: '请上传偏差证明材料!' }]}
                >
                  <FileUpload fileUUID={FileUuid2} uploadSuccess={(fileUUID) => {
                    this.formRef.current.setFieldsValue({ DevAttachmentID: fileUUID })
                  }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="LowFeverDataType"
                  label="低位发热量数据来源"
                >
                  <Select
                    onChange={(value) => this.onSourceChange(value, 1, 'LowFever', '低位发热量', 'LowFeverState')}
                    placeholder="请选择低位发热量数据来源"
                  >
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
                  label={<p>低位发热量{currentTypeData['低位发热量Unit'] ? <span>({currentTypeData['低位发热量Unit']})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写低位发热量!' }]}
                >
                  <InputNumber disabled={disabled1} step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写低位发热量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="UnitCarbonContentDataType"
                  label="单位热值含碳量数据来源"
                >
                  <Select placeholder="请选择单位热值含碳量数据来源"
                    onChange={(value) => this.onSourceChange(value, 2, 'UnitCarbonContent', '含碳量', 'UnitCarbonContentState')}
                  >
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
                    <p>单位热值含碳量
                      {currentTypeData['含碳量Unit'] ? <span>({currentTypeData['含碳量Unit']})</span> : ''}
                      <QuestionTooltip content="单位热值含碳量 = 低位发热量 × 元素含碳量" />
                    </p>
                  }
                  rules={[{ required: true, message: '请填写单位热值含碳量!' }]}
                >
                  <InputNumber
                    disabled={disabled2}
                    step="0.00001"
                    stringMode
                    style={{ width: this.state.UnitCarbonContentState == 2 ? '100%' : 'calc(100% - 64px)' }} placeholder="请填写单位热值含碳量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
                {this.state.UnitCarbonContentState == 2 ? '' :
                  <Popover
                    content={
                      <>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name="ElementalCarbonContent"
                              label="元素含碳量(%)"
                            // rules={[{ required: true, message: '请填写全年炉渣产量!' }]}
                            >
                              <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写元素含碳量"
                                onChange={this.countHTL}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    }
                    trigger="click"
                    title="单位热值含碳量计算">
                    <Button style={{ position: 'absolute', top: 0, right: 0 }} type="primary">计算</Button>
                  </Popover>}
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CO2OxidationRateDataType"
                  label="碳氧化率数据来源"
                >
                  <Select placeholder="请选择碳氧化率数据来源"
                    onChange={(value) => this.onSourceChange(value, 3, 'CO2OxidationRate', '碳氧化率', 'CO2OxidationRateState')}
                  >
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
                      <QuestionTooltip content="碳氧化率(%) = 1 - ((全年炉渣产量 × 炉渣平均含碳量 + 全年飞灰产量 × 飞灰平均含碳量 ÷ 除尘效率) × 10⁶) ÷ (消耗量 × 低位发热量 × 单位热值含碳量)" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写碳氧化率!' }]}
                >
                  <InputNumber
                    disabled={disabled3}
                    step="0.00001"
                    style={{ width: this.state.CO2OxidationRateState == 2 ? '100%' : 'calc(100% - 64px)' }} placeholder="请填写碳氧化率"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
                {this.state.CO2OxidationRateState == 2 ? '' :
                  <Popover
                    content={
                      <>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name="SlagYield"
                              label="全年炉渣产量(t)"
                            // rules={[{ required: true, message: '请填写全年炉渣产量!' }]}
                            >
                              <InputNumber step="0.00001" style={{ width: '60%' }} placeholder="请填写全年炉渣产量"
                                onChange={this.countTYHL}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="SlagAvgCO2"
                              label="炉渣平均含碳量(%)"
                            // rules={[{ required: true, message: '请填写炉渣平均含碳量!' }]}
                            >
                              <InputNumber step="0.00001" style={{ width: '60%' }} placeholder="请填写炉渣平均含碳量"
                                onChange={this.countTYHL}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name="FlyAshYield"
                              label="全年飞灰产量(t)"
                            // rules={[{ required: true, message: '请填写全年飞灰产量!' }]}
                            >
                              <InputNumber step="0.00001" style={{ width: '60%' }} placeholder="请填写全年飞灰产量"
                                onChange={this.countTYHL}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="FlyAshAvgCO2"
                              label="飞灰平均含碳量(%)"
                            // rules={[{ required: true, message: '请填写飞灰平均含碳量!' }]}
                            >
                              <InputNumber step="0.00001" style={{ width: '60%' }} placeholder="请填写飞灰平均含碳量"
                                onChange={this.countTYHL}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name="RemoveDustRate"
                              label="除尘系统平均除尘效率(%)"
                            // rules={[{ required: true, message: '请填写除尘系统平均除尘效率!' }]}
                            >
                              <InputNumber step="0.00001" style={{ width: '60%' }} placeholder="请填写除尘系统平均除尘效率"
                                onChange={this.countTYHL}
                              />
                            </Form.Item>
                          </Col>
                          {/* <Col span={16}>
                            <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={this.Ratehide} />
                            </Col> */}
                        </Row>
                      </>
                    }
                    trigger="click"
                    // visible={this.state.RateVisible}
                    // onVisibleChange={this.RatehandleVisibleChange}
                    title="碳氧化率计算">
                    <Button style={{ position: 'absolute', top: 0, right: 0 }} type="primary">计算</Button>
                  </Popover>}
              </Col>
              <Col span={12}>
                <Form.Item
                  name="GetType"
                  label="获取方式"
                  rules={[{ required: true, message: '请选择获取方式!' }]}
                >
                  <Select placeholder="请选择获取方式">
                    {
                      SELECT_LISTGet.map(item => {
                        return <Option value={item.key} key={item.key}>{item.value}</Option>
                      })
                    }
                  </Select>
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
                  <InputNumber step="0.00001" style={{ width: '100%' }} placeholder="请填写排放量" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 7 }}
                  name="AttachmentID"
                  label="验证材料"
                // rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <FileUpload fileUUID={FileUuid} uploadSuccess={(fileUUID) => {
                    this.formRef.current.setFieldsValue({ AttachmentID: fileUUID })
                  }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <ConsumptionModal
          data={KEY ? editTotalData : {}}
          unit={typeUnit}
          visible={totalVisible}
          onCancel={() => this.setState({ totalVisible: false })}
          onOk={(data) => {
            console.log('data=', data)
            this.formRef.current.setFieldsValue({ 'AnnualConsumption': data.total, 'Deviation': data.deviation, GetType: data.GetType })
            this.setState({ totalVisible: false, totalData: data })
            this.countEmissions();
          }} />
      </BreadcrumbWrapper>
    );
  }
}

export default index;
