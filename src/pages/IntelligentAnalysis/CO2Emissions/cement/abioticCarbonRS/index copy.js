import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Button, Popover, DatePicker, Input } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'
import { InfoCircleOutlined } from '@ant-design/icons'
import ConsumptionModal from '@/pages/IntelligentAnalysis/CO2Emissions/components/ConsumptionModal';

const { Option } = Select;
const { TextArea } = Input;
const CONFIG_ID = 'CementAlternativeFuels';
const SELECT_LISTGet = [{ "key": 1, "value": "购(产)销存" }];
const SELECT_LISTWhere = [{ "key": 1, "value": "计算" }, { "key": 2, "value": "缺省值" }];
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
  Dictionaries: CO2Emissions.Dictionaries,
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
      currentTypeData: {},
      typeUnit: 't',
      editTotalData: {},
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
    // var { CarbonContentDataType, EmissionDataType, LowFeverDataType } = values;
  }


  // 种类change，填写缺省值
  onTypesChange = (value, option) => {
    //     化石碳的质量分数: 100
    // 排放因子: 0.07
    // 生物碳的质量分数: 0

    // LowFeverDataType,EmissionDataType,CarbonContentDataType
    const { Dictionaries } = this.props;
    this.setState({
      currentTypeData: Dictionaries.one[value],
      typeUnit: option['data-unit']
    })
    let values = this.formRef.current.getFieldsValue();
    const { LowFeverDataType, EmissionDataType, CarbonContentDataType } = values;
    if (LowFeverDataType == 2) {
      this.formRef.current.setFieldsValue({
        'LowFever': Dictionaries.one[value]["低位发热量"],
      });
    }
    if (EmissionDataType == 2) {
      this.formRef.current.setFieldsValue({
        'Emission': Dictionaries.one[value]["排放因子"],
      });
    }
    if (CarbonContentDataType == 2) {
      this.formRef.current.setFieldsValue({
        'CarbonContent': Dictionaries.one[value]["化石碳的质量分数"],
      });
    }
    this.countEmissions();
  }

  // 计算排放量
  countEmissions = () => {
    // 排放量 = 用量*低位发热量*排放因子*化石碳的质量分数
    let values = this.formRef.current.getFieldsValue();
    let { AnnualConsumption = 0, LowFever = 0, Emission = 0, CarbonContent = 0 } = values;
    let count = AnnualConsumption * LowFever * Emission * (CarbonContent / 100);
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

  onSourceChange = (value, index, name, label) => {
    const { Dictionaries } = this.props;
    let values = this.formRef.current.getFieldsValue();
    const { FossilType, } = values
    if (FossilType) {
      if (value == 2) {
        // 缺省
        this.formRef.current.setFieldsValue({
          [name]: Dictionaries.one[FossilType][label],
        });
        this.countEmissions();
      }
    }
    let key = 'disabled' + index;
    this.setState({ [key]: !this.state[key] })
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

  render() {
    const { isModalVisible, editData, FileUuid, FileUuid2, currentTypeData, typeUnit, totalVisible, editTotalData, KEY } = this.state;
    const { tableInfo, Dictionaries } = this.props;
    const { EntView = [] } = this.props.configIdList;
    console.log('props=', this.props)
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementAlternativeFuels.tCO2');

    const TYPES = Dictionaries.two || [];
    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      console.log('values=', values)
      var { CarbonContentDataType, EmissionDataType, LowFeverDataType, Deviation } = values;
    }
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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementAlternativeFuels.AttachmentID')
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CementAlternativeFuels.DevAttachmentID')
              this.setState({ KEY: key, FileUuid: FileUuid, FileUuid2: FileUuid2 }, () => {
                this.getFormData();
              })
            }}
            footer={() => <div className="">排放量合计（tCO₂）：{count.toFixed(2)}</div>}
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
              EmissionDataType: editData.EmissionDataType || 2,
              CarbonContentDataType: editData.CarbonContentDataType || 2,
              Deviation: editData.Deviation || '-',
              GetType: editData.GetType || '-',
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
              FossilType: editData['dbo.T_Bas_CementAlternativeFuels.FossilType'] ? editData['dbo.T_Bas_CementAlternativeFuels.FossilType'] + '' : undefined,
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
                        return <Option value={item.code} key={item.code} data-unit={item.typeUnit}>{item.name}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="AnnualConsumption"
                  label={<p>用量{typeUnit ? <span>({typeUnit})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写用量!' }]}
                >
                  <InputNumber bordered={false} disabled style={{ width: 'calc(100% - 64px)' }} placeholder="请填写用量" onChange={this.countEmissions} />
                </Form.Item>
                <Button onClick={() => this.setState({ totalVisible: true })} style={{ position: 'absolute', top: 0, right: 0 }} type="primary">来源</Button>
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
                  label="平均低位发热量数据来源"
                  rules={[{ required: true, message: '请选择平均低位发热量数据来源!' }]}
                >
                  <Select
                    onChange={(value) => this.onSourceChange(value, 1, 'LowFever', '低位发热量')}
                    placeholder="请选择平均低位发热量数据来源"
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
                  label={<p>平均低位发热量{currentTypeData['低位发热量Unit'] ? <span>({currentTypeData['低位发热量Unit']})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写低位发热量!' }]}
                >
                  <InputNumber
                    disabled={LowFeverDataType ? LowFeverDataType == 2 : true}
                    style={{ width: '100%' }} placeholder="请填写低位发热量"
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
                  <Select
                    onChange={(value) => this.onSourceChange(value, 2, 'Emission', '排放因子')}
                    placeholder="请选择排放因子数据来源">
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
                  label={<p>排放因子{currentTypeData['排放因子Unit'] ? <span>({currentTypeData['排放因子Unit']})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写排放因子!' }]}
                >
                  <InputNumber
                    disabled={EmissionDataType ? EmissionDataType == 2 : true}
                    style={{ width: '100%' }} placeholder="请填写排放因子" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CarbonContentDataType"
                  label="非生物质碳的含量数据来源"
                  rules={[{ required: true, message: '请选择非生物质碳的含量数据来源!' }]}
                >
                  <Select
                    onChange={(value) => this.onSourceChange(value, 3, 'CarbonContent', '化石碳的质量分数')}
                    placeholder="请选择非生物质碳的含量数据来源">
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
                  label={<p>非生物质碳的含量{currentTypeData['化石碳的质量分数Unit'] ? <span>({currentTypeData['化石碳的质量分数Unit']})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写非生物质碳的含量!' }]}
                >
                  <InputNumber
                    disabled={CarbonContentDataType ? CarbonContentDataType == 2 : true}
                    style={{ width: '100%' }} placeholder="请填写非生物质碳的含量" onChange={this.countEmissions} />
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
