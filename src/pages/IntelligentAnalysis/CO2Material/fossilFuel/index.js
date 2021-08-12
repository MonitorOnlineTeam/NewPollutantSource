import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Button, Popover, message } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

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
      isModalVisible: false
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
        <Modal destroyOnClose width={900} title="添加" visible={isModalVisible} onOk={this.onHandleSubmit} onCancel={this.handleCancel}>
          <Form
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData
            }}
          >
            <Row>
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
                  label="年消耗量(t/104Nm3)"
                  rules={[{ required: true, message: '请填写年消耗量!' }]}
                >
                  <InputNumber step="0.001" stringMode style={{ width: '80%' }} placeholder="请填写年消耗量" onChange={(value) => {
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
                      this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 3) });
                    }

                    let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                    // let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                    if (!CO2OxidationRate || !value || !LowFever || !UnitCarbonContent) { }
                    else {
                      let upAll = value * LowFever * 0.000001;
                      let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                      let countAll = upAll * downAll;
                      this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
                    }
                  }} />
                </Form.Item>
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
                  name="LowFever"
                  label="低位发热量(GJ/t,GJ/104Nm3)"
                  rules={[{ required: true, message: '请填写低位发热量!' }]}
                >
                  <InputNumber step="0.001" stringMode style={{ width: '80%' }} placeholder="请填写低位发热量" onChange={(value) => {
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
                      this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 3) });
                    }
                    let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                    // let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                    if (!CO2OxidationRate || !AnnualConsumption || !value || !UnitCarbonContent) { }
                    else {
                      let upAll = AnnualConsumption * value * 0.000001;
                      let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                      let countAll = upAll * downAll;
                      this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
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
                        case 2: count = 41816; break;
                        case 3: count = 41816; break;
                        case 4: count = 43070; break;
                        case 5: count = 42652; break;
                        case 6: count = 45998; break;
                        case 8: count = 38931; break;
                        case 9: count = 12726; break;
                        case 10: count = 52270; break;
                      }
                      if (count != 0) {
                        this.formRef.current.setFieldsValue({ 'LowFever': this.getFloat(count, 3) });
                        let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                        let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                        let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                        let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                        if (!CO2OxidationRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                        else {
                          let upAll = AnnualConsumption * LowFever * 0.000001;
                          let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                          let countAll = upAll * downAll;
                          this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
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
                  name="UnitCarbonContent"
                  label="单位热值含碳量(tC/GJ)"
                  rules={[{ required: true, message: '请填写单位热值含碳量!' }]}
                >
                  <InputNumber step="0.001" stringMode style={{ width: '80%' }} placeholder="请填写单位热值含碳量" onChange={(value) => {
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
                      this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 3) });
                    }
                    let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                    // let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                    if (!CO2OxidationRate || !AnnualConsumption || !LowFever || !value) { }
                    else {
                     
                      let upAll = AnnualConsumption * LowFever * 0.000001;
                      let downAll = (value * CO2OxidationRate * 44) / 12;
                      let countAll = upAll * downAll;
                      this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
                    }
                  }} />
                </Form.Item>
                {this.state.UnitCarbonContentState == 2 ? '' :
                  <Popover
                    content={
                      <>
                        <Row>
                          <Col span={16}>
                            <Form.Item
                              name="ElementalCarbonContent"
                              label="元素含碳量(%)"
                            // rules={[{ required: true, message: '请填写全年炉渣产量!' }]}
                            >
                              <InputNumber step="0.001" stringMode style={{ width: '60%' }} placeholder="请填写元素含碳量" onChange={(value) => {
                                // let SlagYield = this.formRef.current.getFieldValue('SlagYield') || 0;
                                let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                                if (!LowFever) { }
                                else {
                                  let up = value * 1000000;
                                  console.log('LowFever=', LowFever)
                                  let down = LowFever;
                                  let count = up / down;
                                  this.formRef.current.setFieldsValue({ 'UnitCarbonContent': this.getFloat(count, 3) });
                                  //计算排放量
                                  let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                                  let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                                  if (!CO2OxidationRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever * 0.000001;
                                    let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
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
                    <Button type='link' style={{ marginLeft: 5, display: 'inline' }}>计算</Button>
                  </Popover>}
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
                        case 2: count = 20.08; break;
                        case 3: count = 21.1; break;
                        case 4: count = 18.9; break;
                        case 5: count = 20.2; break;
                        case 6: count = 18.2; break;
                        case 8: count = 15.32; break;
                        case 9: count = 13.58; break;
                        case 10: count = 12.2; break;
                      }
                      if (count != 0) {
                        this.formRef.current.setFieldsValue({ 'UnitCarbonContent': this.getFloat(count, 3) });
                        let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                        let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                        let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                        let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                        if (!CO2OxidationRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                        else {
                          let upAll = AnnualConsumption * LowFever * 0.000001;
                          let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                          let countAll = upAll * downAll;
                          this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
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
                  name="CO2OxidationRate"
                  label="碳氧化率(%)"
                  rules={[{ required: true, message: '请填写碳氧化率!' }]}
                >
                  <InputNumber step="0.001" stringMode style={{ width: '80%' }} placeholder="请填写碳氧化率" onChange={(value) => {
                    // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                    let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                    let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                    let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                    if (!value || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                    else {

                      let upAll = AnnualConsumption * LowFever * 0.000001;
                      let downAll = (UnitCarbonContent * value * 44) / 12;
                      let countAll = upAll * downAll;
                      console.log('countAll',countAll)
                      this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
                    }
                  }} />
                </Form.Item>
                {this.state.CO2OxidationRateState == 2 ? '' :
                  <Popover
                    content={
                      <>
                        <Row>
                          <Col span={16}>
                            <Form.Item
                              name="SlagYield"
                              label="全年炉渣产量(t)"
                            // rules={[{ required: true, message: '请填写全年炉渣产量!' }]}
                            >
                              <InputNumber step="0.001" stringMode style={{ width: '60%' }} placeholder="请填写全年炉渣产量" onChange={(value) => {
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
                                  this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 3) });
                                  // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  if (!count || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever * 0.000001;
                                    let downAll = (UnitCarbonContent * count * 44) /12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
                                  }
                                }
                              }} />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              name="SlagAvgCO2"
                              label="炉渣平均含碳量(%)"
                            // rules={[{ required: true, message: '请填写炉渣平均含碳量!' }]}
                            >
                              <InputNumber step="0.001" stringMode style={{ width: '60%' }} placeholder="请填写炉渣平均含碳量" onChange={(value) => {
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
                                  this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 3) });
                                  // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  if (!count || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever * 0.000001;
                                    let downAll = (UnitCarbonContent * count * 44) / 12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
                                  }
                                }
                              }} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={16}>
                            <Form.Item
                              name="FlyAshYield"
                              label="全年飞灰产量(t)"
                            // rules={[{ required: true, message: '请填写全年飞灰产量!' }]}
                            >
                              <InputNumber step="0.001" stringMode style={{ width: '60%' }} placeholder="请填写全年飞灰产量" onChange={(value) => {
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
                                  this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 3) });
                                  // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  if (!count || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever * 0.000001;
                                    let downAll = (UnitCarbonContent * count * 44) /12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
                                  }
                                }
                              }} />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              name="FlyAshAvgCO2"
                              label="飞灰平均含碳量(%)"
                            // rules={[{ required: true, message: '请填写飞灰平均含碳量!' }]}
                            >
                              <InputNumber step="0.001" stringMode style={{ width: '60%' }} placeholder="请填写飞灰平均含碳量" onChange={(value) => {
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
                                  this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 3) });
                                  // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  if (!count || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever * 0.000001;
                                    let downAll = (UnitCarbonContent * count * 44) / 12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
                                  }
                                }
                              }} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={16}>
                            <Form.Item
                              name="RemoveDustRate"
                              label="除尘系统平均除尘效率(%)"
                            // rules={[{ required: true, message: '请填写除尘系统平均除尘效率!' }]}
                            >
                              <InputNumber step="0.001" stringMode style={{ width: '60%' }} placeholder="请填写除尘系统平均除尘效率" onChange={(value) => {
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
                                  this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 3) });
                                  // let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                                  if (!count || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                                  else {
                                    let upAll = AnnualConsumption * LowFever * 0.000001;
                                    let downAll = (UnitCarbonContent * count * 44) / 12;
                                    let countAll = upAll * downAll;
                                    this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
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
                    <Button type='link' style={{ marginLeft: 5, display: 'inline' }}>计算</Button>
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
                        this.formRef.current.setFieldsValue({ 'CO2OxidationRate': this.getFloat(count, 3) });
                      let CO2OxidationRate = this.formRef.current.getFieldValue('CO2OxidationRate') || 0;
                      let AnnualConsumption = this.formRef.current.getFieldValue('AnnualConsumption') || 0;
                      let LowFever = this.formRef.current.getFieldValue('LowFever') || 0;
                      let UnitCarbonContent = this.formRef.current.getFieldValue('UnitCarbonContent') || 0;
                      if (!CO2OxidationRate || !AnnualConsumption || !LowFever || !UnitCarbonContent) { }
                      else {
                        let upAll = AnnualConsumption * LowFever * 0.000001;
                        let downAll = (UnitCarbonContent * CO2OxidationRate * 44) / 12;
                        let countAll = upAll * downAll;
                        this.formRef.current.setFieldsValue({ 'tCO2': this.getFloat(countAll, 3) });
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
                  name="tCO2"
                  label="排放量（tCO2）"
                  rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <InputNumber step="0.001" stringMode style={{ width: '80%' }} placeholder="请填写排放量" />
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