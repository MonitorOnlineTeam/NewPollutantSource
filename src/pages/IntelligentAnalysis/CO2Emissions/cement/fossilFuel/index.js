import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Button, Popover, DatePicker } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'

const { Option } = Select;
const CONFIG_ID = 'CementFossilFuel';
const SELECT_LIST = [{ "key": 1, "value": "燃煤" }, { "key": 2, "value": "原油 " }, { "key": 3, "value": "燃料油" }, { "key": 4, "value": "汽油" }, { "key": 5, "value": "柴油" }, { "key": 6, "value": "炼厂干气" }, { "key": 7, "value": "其它石油制品" }, { "key": 8, "value": "天然气" }, { "key": 9, "value": "焦炉煤气" }, { "key": 10, "value": "其它煤气" }]
const SELECT_LISTGet = [{ "key": 1, "value": "购(产)销存" }];
const SELECT_LISTWhere = [{ "key": 2, "value": "缺省值" }];
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
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isModalVisible: false,
      TYPES: [],
      editData: {},
      KEY: undefined,
      FileUuid: undefined,
      UnitCarbonContentState: 2,
      CO2OxidationRateState: 2,
      RateVisible: false,
      UnitVisible: false,
    };
  }

  componentDidMount() {
    console.log(' this.props=', this.props)
    if (!this.props.cementDictionaries.one) {
      this.props.dispatch({
        type: 'CO2Emissions/getCO2EnergyType',
        payload: {
          IndustryCode: this.props.location.query.industry
        },
      })
    }
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
      const { editData, KEY } = this.state;
      console.log('KEY=', KEY)
      let actionType = KEY ? 'autoForm/saveEdit' : 'autoForm/add';

      this.props.dispatch({
        type: actionType,
        payload: {
          configId: CONFIG_ID,
          FormData: {
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
        this.setState({
          // CO2OxidationRateState: res.CO2OxidationRateDataType,
          // UnitCarbonContentState: res.UnitCarbonContentDataType,
          editData: res,
          isModalVisible: true,
        })
      }
    })
  }

  render() {
    const { isModalVisible, editData, FileUuid, } = this.state;
    const { tableInfo, cementDictionaries } = this.props;
    const { EntBase = [] } = this.props.configIdList;
    console.log('props=', this.props)
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementFossilFuel.tCO2');

    const TYPES = cementDictionaries.two || [];

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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementFossilFuel.AttachmentID')
              this.setState({ KEY: key, FileUuid: FileUuid }, () => {
                this.getFormData(FileUuid);
              })
            }}
            footer={() => <div className="">排放量合计：{count.toFixed(2)}</div>}
          />
        </Card>
        <Modal destroyOnClose width={1000} title="添加" visible={isModalVisible} onOk={this.onHandleSubmit} onCancel={this.handleCancel}>
          <Form
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              LowFeverDataType: 2,
              UnitCarbonContentDataType: 2,
              CO2OxidationRateDataType: 2,
              GetType: 1,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.T_Bas_Enterprise.EntCode'],
              FossilType: editData['FossilType'] + '',
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
                      EntBase.map(item => {
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
                      {/* <QuestionTooltip content="碳氧化率(%) = 1 - ((全年炉渣产量 × 炉渣平均含碳量 + 全年飞灰产量 × 飞灰平均含碳量 ÷ 除尘效率) × 10⁶) ÷ (消耗量 × 低位发热量 × 单位热值含碳量)" /> */}
                    </span>
                  }
                  rules={[{ required: true, message: '请填写碳氧化率!' }]}
                >
                  <InputNumber step="0.00001" stringMode style={{ width: '100%' }} placeholder="请填写碳氧化率" onChange={this.countEmissions} />
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
