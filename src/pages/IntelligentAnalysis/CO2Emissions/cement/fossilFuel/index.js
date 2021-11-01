import React, { Component } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Button, Input, DatePicker } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'
import ConsumptionModal from '@/pages/IntelligentAnalysis/CO2Emissions/components/ConsumptionModal';
import { InfoCircleOutlined } from '@ant-design/icons'

const industry = INDUSTRYS.electricity;
const { Option } = Select;
const { TextArea } = Input;
const CONFIG_ID = 'CementFossilFuel';
const SELECT_LIST = [{ "key": 1, "value": "燃煤" }, { "key": 2, "value": "原油 " }, { "key": 3, "value": "燃料油" }, { "key": 4, "value": "汽油" }, { "key": 5, "value": "柴油" }, { "key": 6, "value": "炼厂干气" }, { "key": 7, "value": "其它石油制品" }, { "key": 8, "value": "天然气" }, { "key": 9, "value": "焦炉煤气" }, { "key": 10, "value": "其它煤气" }]
const SELECT_LISTGet = [{ "key": 1, "value": "购(产)销存" }];
const SELECT_LISTWhere = [{ "key": 1, "value": "计算" }, { "key": 2, "value": "缺省值" }];
const SELECT_LISTOnly = [{ "key": 2, "value": "缺省值" }];
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

@connect(({ loading, autoForm, CO2Emissions }) => ({
  loading: loading.effects['autoForm/getAutoFormData'],
  getConfigLoading: loading.effects['autoForm/getPageConfig'],
  fileList: autoForm.fileList,
  tableInfo: autoForm.tableInfo,
  configIdList: autoForm.configIdList,
  cementDictionaries: CO2Emissions.cementDictionaries,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isModalVisible: false,
      TYPES: [],
      editData: {},
      KEY: undefined,
      FileUuid: undefined,
      FileUuid2: undefined,
      UnitCarbonContentState: 2,
      totalData: {},
      editTotalData: {},
      RateVisible: false,
      UnitVisible: false,
      disabled1: true,
      disabled2: true,
      disabled3: true,
      currentTypeData: {},
      typeUnit: '',
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'CO2Emissions/getCO2EnergyType',
      payload: {
        IndustryCode: industry
      },
    })
  }


  // 种类change，填写缺省值
  onTypesChange = (value, option) => {
    console.log('option=', option)
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
    this.countEmissions();
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


  handleCancel = () => {
    this.setState({
      isModalVisible: false,
      // UnitCarbonContentState: 2,
      // CO2OxidationRateState: 2,
    })
  };

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
            MonitorTime: moment(values.MonitorTime).format("YYYY-MM-01 00:00:00"),
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
        'dbo.T_Bas_CementFossilFuel.FossilFuelCode': this.state.KEY,
      },
      callback: (res) => {
        // Deviation, GetType

        this.setState({
          // CO2OxidationRateState: res.CO2OxidationRateDataType,
          // UnitCarbonContentState: res.UnitCarbonContentDataType,
          editData: res,
          isModalVisible: true,
          editTotalData: {
            MonVolume: res.MonVolume,
            ReportVolume: res.ReportVolume,
            BuyVolume: res.BuyVolume,
            TransferVolume: res.TransferVolume,
            Consumption: res.Consumption,
            deviation: res.Deviation,
            total: res.AnnualConsumption,
          }
        })
      }
    })
  }

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

  // onSourceChange = (value, index, name, label) => {
  //   let key = 'disabled' + index;
  //   this.setState({ [key]: !this.state[key] })
  //   this.formRef.current.setFieldsValue({
  //     [name]: cementDictionaries.one[value][label],
  //     // 'UnitCarbonContent': cementDictionaries.one[value]["含碳量"],
  //     // 'CO2OxidationRate': cementDictionaries.one[value]["碳氧化率"],
  //   });

  // }


  onSourceChange = (value, index, name, label) => {
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
    this.setState({ [key]: !this.state[key] })
  }

  render() {
    const { isModalVisible, editData, FileUuid, FileUuid2, typeUnit, totalVisible, editTotalData, KEY, disabled1, disabled2, disabled3, currentTypeData } = this.state;
    const { tableInfo, cementDictionaries } = this.props;
    const { EntView = [] } = this.props.configIdList;
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementFossilFuel.tCO2');

    const TYPES = cementDictionaries.two || [];
    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      console.log('values=', values)
      var { Deviation, GetType } = values;
    }
    console.log('currentTypeData=', currentTypeData)

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
                FileUuid2: undefined,
              })
            }}
            onEdit={(record, key) => {
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementFossilFuel.AttachmentID')
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CementFossilFuel.DevAttachmentID')
              this.setState({ KEY: key, FileUuid: FileUuid, FileUuid2: FileUuid2 }, () => {
                this.getFormData();
              })
            }}
            footer={() => <div className="">排放量合计：{count.toFixed(2)}</div>}
          />
        </Card>
        <Modal destroyOnClose width={1000} title="添加" visible={isModalVisible} onOk={this.onHandleSubmit} onCancel={this.handleCancel}>
          {this.showDeviation()}
          <Form
            {...layout}
            style={{ marginTop: 24 }}
            ref={this.formRef}
            initialValues={{
              ...editData,
              LowFeverDataType: editData.LowFeverDataType || 2,
              UnitCarbonContentDataType: editData.UnitCarbonContentDataType || 2,
              CO2OxidationRateDataType: editData.CO2OxidationRateDataType || 2,
              // GetType: 1,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
              FossilType: editData['dbo.T_Bas_CementFossilFuel.FossilType'] ? editData['dbo.T_Bas_CementFossilFuel.FossilType'] + '' : undefined,
              // Deviation: '-'
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
                  <InputNumber disabled style={{ width: 'calc(100% - 64px)' }} placeholder="消耗量" onChange={this.countEmissions} />
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
                  <Select placeholder="请选择低位发热量数据来源" onChange={(value) => this.onSourceChange(value, 1, 'LowFever', '低位发热量')}>
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
                  <InputNumber disabled={disabled1} style={{ width: '100%' }} placeholder="请填写低位发热量"
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
                    onChange={(value) => this.onSourceChange(value, 2, 'UnitCarbonContent', '含碳量')}
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
                  label={<p>单位热值含碳量{currentTypeData['含碳量Unit'] ? <span>({currentTypeData['含碳量Unit']})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写单位热值含碳量!' }]}
                >
                  <InputNumber disabled={disabled2} style={{ width: '100%' }} placeholder="请填写单位热值含碳量" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CO2OxidationRateDataType"
                  label="碳氧化率数据来源"
                >
                  <Select placeholder="请选择碳氧化率数据来源"
                    onChange={(value) => this.onSourceChange(value, 3, 'CO2OxidationRate', '碳氧化率')}
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
                  label="碳氧化率(%)"
                  rules={[{ required: true, message: '请填写碳氧化率!' }]}
                >
                  <InputNumber disabled={disabled3} style={{ width: '100%' }} placeholder="请填写碳氧化率" onChange={this.countEmissions} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label={
                    <span>
                      排放量（tCO₂）
                      <QuestionTooltip content="排放量 = 消耗量 × 低位发热量 × (单位热值含碳量 × 碳氧化率 × 44 ÷ 12) " />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写排放量" />
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
      </BreadcrumbWrapper >
    );
  }
}

export default index;
