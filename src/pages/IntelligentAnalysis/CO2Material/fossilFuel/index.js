import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Button, Popover, DatePicker } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'

const { Option } = Select;
const CONFIG_ID = 'CO2FossilFuel';
const SELECT_LIST = [{ "key": 1, "value": "燃煤" }, { "key": 2, "value": "原油 " }, { "key": 3, "value": "燃料油" }, { "key": 4, "value": "汽油" }, { "key": 5, "value": "柴油" }, { "key": 6, "value": "炼厂干气" }, { "key": 7, "value": "其它石油制品" }, { "key": 8, "value": "天然气" }, { "key": 9, "value": "焦炉煤气" }, { "key": 10, "value": "其它煤气" }]
const SELECT_LISTGet = [{ "key": 1, "value": "购(产)销存" }];
const SELECT_LISTWhere = [{ "key": 1, "value": "系统计算" }, { "key": 2, "value": "缺省值" }];
const SELECT_LISTOnly = [{ "key": 2, "value": "缺省值" }];
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

@connect(({ loading, autoForm, global }) => ({
  loading: loading.effects['autoForm/getAutoFormData'],
  getConfigLoading: loading.effects['autoForm/getPageConfig'],
  fileList: autoForm.fileList,
  tableInfo: autoForm.tableInfo,
  configIdList: autoForm.configIdList,
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
      UnitVisible: false,
    };
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

  // 保存
  onHandleSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      const { editData, KEY } = this.state;
      console.log('KEY=', KEY)
      let actionType = KEY ? 'autoForm/saveEdit' : 'autoForm/add';

      this.props.dispatch({
        type: actionType,
        payload: {
          configId: CONFIG_ID,
          FormData: {
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
        this.setState({
          CO2OxidationRateState: res.CO2OxidationRateDataType,
          UnitCarbonContentState: res.UnitCarbonContentDataType,
          editData: res,
          isModalVisible: true,
        })
      }
    })
  }


  Ratehide = () => {
    this.setState({
      RateVisible: false,
    });
  };

  RatehandleVisibleChange = RateVisible => {
    console.log('vis=', RateVisible)
    this.setState({ RateVisible: true });
  };

  Unithide = () => {
    this.setState({
      UnitVisible: false,
    });
  };

  UnithandleVisibleChange = visible => {
    this.setState({ UnitVisible });
  };

  getFloat = function (num, n) {
    n = n ? parseInt(n) : 0;
    if (n <= 0) {
      return Math.round(num);
    }
    num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
    num = Number(num).toFixed(n); //补足位数
    return num;
  };


  render() {
    const { isModalVisible, editData, FileUuid } = this.state;
    const { tableInfo } = this.props;
    const { Output_Enterprise = [] } = this.props.configIdList;
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CO2FossilFuel.tCO2');
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
              this.setState({ KEY: key, FileUuid: FileUuid }, () => {
                this.getFormData(FileUuid);
              })
            }}
            footer={() => <div className="">排放量合计：{count}</div>}
          />
        </Card>
        <Modal destroyOnClose width={1000} title="添加" visible={isModalVisible} onOk={this.onHandleSubmit} onCancel={this.handleCancel}>
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
                  name="FossilType"
                  label="燃料种类"
                  rules={[{ required: true, message: '请选择燃料种类!' }]}
                >
                  <Select placeholder="请选择燃料种类">
                    {
                      SELECT_LIST.map(item => {
                        return <Option value={item.key} key={item.key}>{item.value}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="AnnualConsumption"
                  label="消耗量(t/10⁴Nm³)"
                  rules={[{ required: true, message: '请填写消耗量!' }]}
                >
                  <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写消耗量" onChange={(value) => {
                    let SlagYield = this.formRef.current.getFieldValue('SlagYield') || 0;
                    let SlagAvgCO2 = this.formRef.current.getFieldValue('SlagAvgCO2') || 0;
                    let FlyAshYield = this.formRef.current.getFieldValue('FlyAshYield') || 0;
                    let FlyAshAvgCO2 = this.formRef.current.getFieldValue('FlyAshAvgCO2') || 0;
                    let RemoveDustRate = this.formRef.current.getFieldValue('RemoveDustRate') || 0;
                    // let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                    let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                    let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                    if (!RemoveDustRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                    else {
                      let up = ((SlagYield * SlagAvgCO2) + (FlyAshYield * FlyAshAvgCO2 / RemoveDustRate)) * 1000000;
                      let down = value * LowFever * UnitCarbonContent;
                      let count = 1 - up / down;
                      this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 5) });
                    }

                    let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                    // let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                    if (!CO2OxidationRate || !value || !LowFever || !UnitCarbonContent) { }
                    else {
                      let upAll = value * LowFever * 1;
                      let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                      let countAll = upAll * downAll;
                      this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                    }
                  }} />
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item
                  name="LowFeverDataType"
                  label="低位发热量数据来源"
                  rules={[{ required: true, message: '请选择低位发热量数据来源!' }]}
                >
                  <Select placeholder="请选择低位发热量数据来源" onChange={(value) => {
                    this.setState({
                      LowFeverState: value
                    })
                    if (value == 2)//缺省值
                    {
                      var type = this.formRef.current.getFieldValue('FossilType');
                      let count = 0;
                      switch (type) {
                        case 2: count = 41.816; break;
                        case 3: count = 41.816; break;
                        case 4: count = 43.070; break;
                        case 5: count = 42.652; break;
                        case 6: count = 45.998; break;
                        case 8: count = 38.931; break;
                        case 9: count = 12.726; break;
                        case 10: count = 52.270; break;
                      }
                      if (count != 0) {
                        this.formRef.current.setFieldsValue({ 'LowFever': this.getFloat(count, 5) });
                        let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                        let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                        let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                        let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                        if (!CO2OxidationRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                        else {
                          let upAll = AnnualConsumption * LowFever * 1;
                          let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                          let countAll = upAll * downAll;
                          this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                        }
                      }

                    }
                  }}>
                    {
                      SELECT_LISTOnly.map(item => {
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
                  <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写低位发热量" onChange={(value) => {
                    let SlagYield = this.formRef.current.getFieldValue('SlagYield') || 0;
                    let SlagAvgCO2 = this.formRef.current.getFieldValue('SlagAvgCO2') || 0;
                    let FlyAshYield = this.formRef.current.getFieldValue('FlyAshYield') || 0;
                    let FlyAshAvgCO2 = this.formRef.current.getFieldValue('FlyAshAvgCO2') || 0;
                    let RemoveDustRate = this.formRef.current.getFieldValue('RemoveDustRate') || 0;
                    let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                    // let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                    let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                    if (!RemoveDustRate || !AnnualConsumption || !value || !UnitCarbonContent) { }
                    else {
                      let up = ((SlagYield * SlagAvgCO2) + (FlyAshYield * FlyAshAvgCO2 / RemoveDustRate)) * 1000000;
                      let down = AnnualConsumption * value * UnitCarbonContent;
                      let count = 1 - up / down;
                      this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 5) });
                    }
                    let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                    // let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                    if (!CO2OxidationRate || !AnnualConsumption || !value || !UnitCarbonContent) { }
                    else {
                      let upAll = AnnualConsumption * value * 1;
                      let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                      let countAll = upAll * downAll;
                      this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                    }
                  }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="UnitCarbonContentDataType"
                  label="单位热值含碳量数据来源"
                  rules={[{ required: true, message: '请选择单位热值含碳量数据来源!' }]}
                >
                  <Select placeholder="请选择单位热值含碳量数据来源" onChange={(value) => {
                    this.setState({
                      UnitCarbonContentState: value
                    })
                    if (value == 2)//缺省值
                    {
                      var type = this.formRef.current.getFieldValue('FossilType');
                      let count = 0;
                      switch (type) {
                        case 2: count = 0.02008; break;
                        case 3: count = 0.0211; break;
                        case 4: count = 0.0189; break;
                        case 5: count = 0.0202; break;
                        case 6: count = 0.0182; break;
                        case 8: count = 0.01532; break;
                        case 9: count = 0.01358; break;
                        case 10: count = 0.0122; break;
                      }
                      if (count != 0) {
                        this.formRef.current.setFieldsValue({ 'UnitCarbonContent': this.getFloat(count, 5) });
                        let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                        let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                        let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                        let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                        if (!CO2OxidationRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                        else {
                          let upAll = AnnualConsumption * LowFever * 1;
                          let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                          let countAll = upAll * downAll;
                          this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                        }
                      }

                    }
                  }}>
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
                      <QuestionTooltip content="单位热值含碳量 = 低位发热量 × 元素含碳量" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写单位热值含碳量!' }]}
                >
                  <InputNumber step="0.00001" stringMode style={{ width: this.state.UnitCarbonContentState == 2 ? '100%' : 'calc(100% - 64px)' }} placeholder="请填写单位热值含碳量" onChange={(value) => {
                    let SlagYield = this.formRef.current.getFieldValue('SlagYield') || 0;
                    let SlagAvgCO2 = this.formRef.current.getFieldValue('SlagAvgCO2') || 0;
                    let FlyAshYield = this.formRef.current.getFieldValue('FlyAshYield') || 0;
                    let FlyAshAvgCO2 = this.formRef.current.getFieldValue('FlyAshAvgCO2') || 0;
                    let RemoveDustRate = this.formRef.current.getFieldValue('RemoveDustRate') || 0;
                    let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                    let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                    // let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                    if (!RemoveDustRate || !AnnualConsumption || !LowFever || !value) { }
                    else {
                      let up = ((SlagYield * SlagAvgCO2) + (FlyAshYield * FlyAshAvgCO2 / RemoveDustRate)) * 1000000;
                      let down = AnnualConsumption * LowFever * value;
                      let count = 1 - up / down;
                      this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 5) });
                    }
                    let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                    // let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                    if (!CO2OxidationRate || !AnnualConsumption || !LowFever || !value) { }
                    else {

                      let upAll = AnnualConsumption * LowFever *1;
                      let downAll = (value * CO2OxidationRate * 44) / 12;
                      let countAll = upAll * downAll;
                      this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                    }
                  }} />
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
                              <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写元素含碳量" onChange={(value) => {
                                // let SlagYield = this.formRef.current.getFieldValue('SlagYield') || 0;
                                let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                                if (!LowFever) { }
                                else {
                                  let up = value * 1000000;
                                  console.log('LowFever=', LowFever)
                                  let down = LowFever;
                                  let count = up / down;
                                  this.formRef.current.setFieldsValue({ 'UnitCarbonContent': this.getFloat(count, 5) });
                                  //计算排放量
                                  let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                                  let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                                  if (!CO2OxidationRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever *1;
                                    let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                                  }
                                }
                              }} />
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
                  rules={[{ required: true, message: '请选择碳氧化率数据来源!' }]}
                >
                  <Select placeholder="请选择碳氧化率数据来源" onChange={(value) => {
                    console.log('value=', value)
                    this.setState({
                      CO2OxidationRateState: value
                    })
                    if (value == 2)//缺省值
                    {
                      var type = this.formRef.current.getFieldValue('FossilType');
                      let count = 0;
                      console.log('type=', type)
                      switch (type) {
                        case 1: count = 98; break;
                        case 2: count = 98; break;
                        case 3: count = 98; break;
                        case 4: count = 98; break;
                        case 5: count = 98; break;
                        case 6: count = 98; break;
                        case 8: count = 99; break;
                        case 9: count = 99; break;
                        case 10: count = 99; break;
                      }
                      if (count != 0)
                        this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 5) });
                      let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                      let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                      let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                      let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                      if (!CO2OxidationRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                      else {
                        let upAll = AnnualConsumption * LowFever *1;
                        let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                        let countAll = upAll * downAll;
                        this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                      }
                    }
                  }}>
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
                  <InputNumber step="0.00001" stringMode style={{ width: this.state.CO2OxidationRateState == 2 ? '100%' : 'calc(100% - 64px)' }} placeholder="请填写碳氧化率" onChange={(value) => {
                    // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                    let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                    let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                    let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                    if (!value || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                    else {

                      let upAll = AnnualConsumption * LowFever *1;
                      let downAll = (UnitCarbonContent * value * 44) / 12;
                      let countAll = upAll * downAll;
                      console.log('countAll', countAll)
                      this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                    }
                  }} />
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
                              <InputNumber step="0.00001" stringMode style={{ width: '60%' }} placeholder="请填写全年炉渣产量" onChange={(value) => {
                                // let SlagYield = this.formRef.current.getFieldValue('SlagYield') || 0;
                                let SlagAvgCO2 = this.formRef.current.getFieldValue('SlagAvgCO2') || 0;
                                let FlyAshYield = this.formRef.current.getFieldValue('FlyAshYield') || 0;
                                let FlyAshAvgCO2 = this.formRef.current.getFieldValue('FlyAshAvgCO2') || 0;
                                let RemoveDustRate = this.formRef.current.getFieldValue('RemoveDustRate') || 0;
                                let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                                let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                                let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                                if (!RemoveDustRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                else {
                                  let up = ((value * SlagAvgCO2) + (FlyAshYield * FlyAshAvgCO2 / RemoveDustRate)) * 1000000;
                                  let down = AnnualConsumption * LowFever * UnitCarbonContent;
                                  let count = 1 - up / down;
                                  this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 5) });
                                  // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  if (!count || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever *1;
                                    let downAll = (UnitCarbonContent * count * 44) / 12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                                  }
                                }
                              }} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="SlagAvgCO2"
                              label="炉渣平均含碳量(%)"
                            // rules={[{ required: true, message: '请填写炉渣平均含碳量!' }]}
                            >
                              <InputNumber step="0.00001" stringMode style={{ width: '60%' }} placeholder="请填写炉渣平均含碳量" onChange={(value) => {
                                let SlagYield = this.formRef.current.getFieldValue('SlagYield') || 0;
                                // let SlagAvgCO2 = this.formRef.current.getFieldValue('SlagAvgCO2') || 0;
                                let FlyAshYield = this.formRef.current.getFieldValue('FlyAshYield') || 0;
                                let FlyAshAvgCO2 = this.formRef.current.getFieldValue('FlyAshAvgCO2') || 0;
                                let RemoveDustRate = this.formRef.current.getFieldValue('RemoveDustRate') || 0;
                                let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                                let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                                let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                                if (!RemoveDustRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                else {
                                  let up = ((SlagYield * value) + (FlyAshYield * FlyAshAvgCO2 / RemoveDustRate)) * 1000000;
                                  let down = AnnualConsumption * LowFever * UnitCarbonContent;
                                  let count = 1 - up / down;
                                  this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 5) });
                                  // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  if (!count || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever *1;
                                    let downAll = (UnitCarbonContent * count * 44) / 12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                                  }
                                }
                              }} />
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
                              <InputNumber step="0.00001" stringMode style={{ width: '60%' }} placeholder="请填写全年飞灰产量" onChange={(value) => {
                                let SlagYield = this.formRef.current.getFieldValue('SlagYield') || 0;
                                let SlagAvgCO2 = this.formRef.current.getFieldValue('SlagAvgCO2') || 0;
                                // let FlyAshYield = this.formRef.current.getFieldValue('FlyAshYield') || 0;
                                let FlyAshAvgCO2 = this.formRef.current.getFieldValue('FlyAshAvgCO2') || 0;
                                let RemoveDustRate = this.formRef.current.getFieldValue('RemoveDustRate') || 0;
                                let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                                let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                                let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                                if (!RemoveDustRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                else {
                                  let up = ((SlagYield * SlagAvgCO2) + (value * FlyAshAvgCO2 / RemoveDustRate)) * 1000000;
                                  let down = AnnualConsumption * LowFever * UnitCarbonContent;
                                  let count = 1 - up / down;
                                  this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 5) });
                                  // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  if (!count || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever *1;
                                    let downAll = (UnitCarbonContent * count * 44) / 12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                                  }
                                }
                              }} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="FlyAshAvgCO2"
                              label="飞灰平均含碳量(%)"
                            // rules={[{ required: true, message: '请填写飞灰平均含碳量!' }]}
                            >
                              <InputNumber step="0.00001" stringMode style={{ width: '60%' }} placeholder="请填写飞灰平均含碳量" onChange={(value) => {
                                let SlagYield = this.formRef.current.getFieldValue('SlagYield') || 0;
                                let SlagAvgCO2 = this.formRef.current.getFieldValue('SlagAvgCO2') || 0;
                                let FlyAshYield = this.formRef.current.getFieldValue('FlyAshYield') || 0;
                                // let FlyAshAvgCO2 = this.formRef.current.getFieldValue('FlyAshAvgCO2') || 0;
                                let RemoveDustRate = this.formRef.current.getFieldValue('RemoveDustRate') || 0;
                                let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                                let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                                let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                                if (!RemoveDustRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                else {
                                  let up = ((SlagYield * SlagAvgCO2) + (FlyAshYield * value / RemoveDustRate)) * 1000000;
                                  let down = AnnualConsumption * LowFever * UnitCarbonContent;
                                  let count = 1 - up / down;
                                  this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 5) });
                                  // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  if (!count || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever *1;
                                    let downAll = (UnitCarbonContent * count * 44) / 12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                                  }
                                }
                              }} />
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
                              <InputNumber step="0.00001" stringMode style={{ width: '60%' }} placeholder="请填写除尘系统平均除尘效率" onChange={(value) => {
                                let SlagYield = this.formRef.current.getFieldValue('SlagYield') || 0;
                                let SlagAvgCO2 = this.formRef.current.getFieldValue('SlagAvgCO2') || 0;
                                let FlyAshYield = this.formRef.current.getFieldValue('FlyAshYield') || 0;
                                let FlyAshAvgCO2 = this.formRef.current.getFieldValue('FlyAshAvgCO2') || 0;
                                // let RemoveDustRate = this.formRef.current.getFieldValue('RemoveDustRate') || 0;
                                let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                                let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                                let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                                if (!RemoveDustRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                else {
                                  let up = ((SlagYield * SlagAvgCO2) + (FlyAshYield * FlyAshAvgCO2 / value)) * 1000000;
                                  let down = AnnualConsumption * LowFever * UnitCarbonContent;
                                  let count = 1 - up / down;
                                  this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 5) });
                                  // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  if (!count || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever *1;
                                    let downAll = (UnitCarbonContent * count * 44) / 12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 5) });
                                  }
                                }
                              }} />
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
                  <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写排放量" />
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
      </BreadcrumbWrapper>
    );
  }
}

export default index;
