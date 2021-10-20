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
const CONFIG_ID = 'CementAlternativeFuels';
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
        SelectType: 'T'
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
      'LowFever': cementDictionaries.one[value]["低位发热量"],
      'CarbonContent': cementDictionaries.one[value]["化石碳的质量分数"],
      'Emission': cementDictionaries.one[value]["排放因子"],
    });
    this.countEmissions();
  }

  // 计算排放量
  countEmissions = () => {
    // 排放量 = 用量*平均低位发热量*排放因子*非生物质碳的含量
    let values = this.formRef.current.getFieldsValue();
    let { AnnualConsumption = 0, LowFever = 0, Emission = 0, CarbonContent = 0 } = values;
    let count = AnnualConsumption * LowFever * Emission * CarbonContent;
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
            AlternativeFuelsCode: KEY
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
        'dbo.T_Bas_CementAlternativeFuels.AlternativeFuelsCode': this.state.KEY,
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
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementAlternativeFuels.tCO2');

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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementAlternativeFuels.AttachmentID')
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
              EmissionDataType: 2,
              CarbonContentDataType: 2,
              GetType: 1,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.T_Bas_Enterprise.EntCode'],
              FossilType: editData['FossilType'] ? editData['FossilType'] + '' : undefined,
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
                  label="替代燃料或废弃物种类"
                  rules={[{ required: true, message: '请选择替代燃料或废弃物种类!' }]}
                >
                  <Select placeholder="请选择替代燃料或废弃物种类" onChange={this.onTypesChange}>
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
                  label="用量(t)"
                  rules={[{ required: true, message: '请填写用量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写用量" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="LowFeverDataType"
                  label="平均低位发热量数据来源"
                  rules={[{ required: true, message: '请选择平均低位发热量数据来源!' }]}
                >
                  <Select placeholder="请选择平均低位发热量数据来源">
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
                  label="平均低位发热量(GJ/t)"
                  rules={[{ required: true, message: '请填写低位发热量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写低位发热量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="EmissionDataType"
                  label="排放因子数据来源"
                  rules={[{ required: true, message: '请选择排放因子数据来源!' }]}
                >
                  <Select placeholder="请选择排放因子数据来源">
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
                  name="Emission"
                  label='排放因子'
                  rules={[{ required: true, message: '请填写排放因子!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写排放因子" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CarbonContentDataType"
                  label="非生物质碳的含量数据来源"
                  rules={[{ required: true, message: '请选择非生物质碳的含量数据来源!' }]}
                >
                  <Select placeholder="请选择非生物质碳的含量数据来源">
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
                  name="CarbonContent"
                  label='非生物质碳的含量(%)'
                  rules={[{ required: true, message: '请填写碳氧化率!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写碳氧化率" onChange={this.countEmissions} />
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
                      <QuestionTooltip content="排放量 = 用量 × 平均低位发热量 × 排放因子 × 非生物质碳的含量 " />
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
      </BreadcrumbWrapper>
    );
  }
}

export default index;
