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
import { INDUSTRYS } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'

const { Option } = Select;
const CONFIG_ID = 'CementNonFuel';
const SELECT_LISTGet = [{ "key": 1, "value": "购(产)销存" }];
const SELECT_LISTWhere = [{ "key": 2, "value": "缺省值" }];
const industry = INDUSTRYS.cement;
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
    this.props.dispatch({
      type: 'CO2Emissions/getCO2EnergyType',
      payload: {
        IndustryCode: industry,
        SelectType: 'S'
      },
    })
  }


  // 种类change，填写缺省值
  onTypesChange = (value) => {
    //     化石碳的质量分数: 100
    // 排放因子: 0.07
    // 生物碳的质量分数: 0
    const { cementDictionaries } = this.props;
    this.formRef.current.setFieldsValue({
      'NonFuelCarbonContent': cementDictionaries.one[value]["低位发热量"],
      'CarbonContent': cementDictionaries.one[value]["化石碳的质量分数"],
      'Emission': cementDictionaries.one[value]["排放因子"],
    });
    this.countEmissions();
  }

  // 计算排放量
  countEmissions = () => {
    // 排放量 = 生料的数量 × 非燃料碳含量 × 44 / 12
    let values = this.formRef.current.getFieldsValue();
    let { AnnualConsumption = 0, NonFuelCarbonContent = 0 } = values;
    let count = AnnualConsumption * NonFuelCarbonContent * 44 / 12;
    this.formRef.current.setFieldsValue({ 'tCO2': count.toFixed(2) });
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
            NonFuelCode: KEY
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
        'dbo.T_Bas_CementNonFuel.NonFuelCode': this.state.KEY,
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
    const { EntView = [] } = this.props.configIdList;
    console.log('props=', this.props)
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementNonFuel.tCO2');

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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementNonFuel.AttachmentID')
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
              GetType: 1,
              MonitorTime: moment(editData.MonitorTime),
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
                  name="AnnualConsumption"
                  label="生料的数量(t)"
                  rules={[{ required: true, message: '请填写用量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写用量" onChange={this.countEmissions} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="NonFuelCarbonContentDataType"
                  label="生料中非燃料碳含量数据来源"
                // rules={[{ required: true, message: '请选择生料中非燃料碳含量数据来源!' }]}
                >
                  <Select allowClear placeholder="请选择生料中非燃料碳含量数据来源" onChange={(value) => {
                    let val = cementDictionaries.one['S1']["生料中非燃料碳含量"];
                    this.formRef.current.setFieldsValue({ 'NonFuelCarbonContent': val });
                    this.countEmissions();
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
                  name="NonFuelCarbonContent"
                  label="生料中非燃料碳含量(%)"
                  rules={[{ required: true, message: '请填写生料中非燃料碳含量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写生料中非燃料碳含量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label={
                    <span>
                      排放量（tCO₂）
                      <QuestionTooltip content="排放量 = 生料的数量 × 非燃料碳含量 × 44 ÷ 12" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <InputNumber  stringMode style={{ width: '100%' }} placeholder="请填写排放量" />
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
