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

const industry = INDUSTRYS.cement;
const { Option } = Select;
const CONFIG_ID = 'CementCollaborativeDischarge';
const SELECT_LISTWhere = [{ "key": 2, "value": "缺省值" }];
const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
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
      currentTypeData: {},
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
    // 废弃物中矿物碳在碳总量中的比例: 2
    // 废弃物中矿物碳在碳总量中的比例Unit: "%"
    // 废弃物焚烧炉的燃烧效率: 3
    // 废弃物焚烧炉的燃烧效率Unit: "%"
    // 废弃物碳含量的比例: 1
    // 废弃物碳含量的比例Unit: "%"
    const { cementDictionaries } = this.props;
    this.setState({
      currentTypeData: value
    })
    this.formRef.current.setFieldsValue({
      'CProp': cementDictionaries.one[value]["化石碳的质量分数"] + cementDictionaries.one[value]["生物碳的质量分数"],
      'Rate': cementDictionaries.one[value]["废弃物焚烧炉的燃烧效率"],
      'Prop': cementDictionaries.one[value]["化石碳的质量分数"],
    });
    this.countEmissions();
  }

  // 计算排放量
  countEmissions = () => {
    // 二氧化碳排放量 = 废弃物的处置量 × 废弃物碳含量的比例  × 废弃物中矿物碳在碳总量中的比例  × 废弃物焚烧炉的燃烧效率  × 44 ÷ 12
    let values = this.formRef.current.getFieldsValue();
    let { Disposal = 0, CProp = 0, Prop = 0, Rate = 0 } = values;
    let count = Disposal * CProp * Prop * Rate * 44 / 12;
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
            CollaborativeCode: KEY
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
        'dbo.T_Bas_CementCollaborativeDischarge.CollaborativeCode': this.state.KEY,
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
    const { isModalVisible, editData, FileUuid, currentTypeData } = this.state;
    const { tableInfo, cementDictionaries } = this.props;
    const { EntView = [] } = this.props.configIdList;
    console.log('props=', this.props)
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementCollaborativeDischarge.tCO2');

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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementCollaborativeDischarge.AttachmentID')
              this.setState({ KEY: key, FileUuid: FileUuid }, () => {
                this.getFormData(FileUuid);
              })
            }}
            footer={() => <div className="">排放量合计：{count}</div>}
          />
        </Card>
        <Modal destroyOnClose width={1100} title="添加" visible={isModalVisible} onOk={this.onHandleSubmit} onCancel={this.handleCancel}>
          <Form
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              CPropSource: 2,
              PropSource: 2,
              RateSource: 2,
              GetType: 1,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
              CollaborativeType: editData['dbo.T_Bas_CementCollaborativeDischarge.CollaborativeType'] ? editData['dbo.T_Bas_CementCollaborativeDischarge.CollaborativeType'] + '' : undefined,
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
                  name="CollaborativeType"
                  label="种类"
                  rules={[{ required: true, message: '请选择种类!' }]}
                >
                  <Select placeholder="请选择种类" onChange={this.onTypesChange}>
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
                  name="Disposal"
                  label="废弃物的处置量(t)"
                  rules={[{ required: true, message: '请填写废弃物的处置量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写废弃物的处置量" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CPropSource"
                  label="废弃物碳含量的比例数据来源"
                >
                  <Select placeholder="请选择废弃物碳含量的比例数据来源">
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
                  name="CProp"
                  label={`废弃物碳含量的比例(${currentTypeData['化石碳的质量分数Unit'] || '%'})`}
                  rules={[{ required: true, message: '请填写废弃物碳含量的比例!' }]}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="请填写废弃物碳含量的比例" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="PropSource"
                  label="废弃物中矿物碳在碳总量中的比例来源"
                >
                  <Select placeholder="请选择废弃物中矿物碳在碳总量中的比例来源">
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
                  name="Prop"
                  label={`废弃物中矿物碳在碳总量中的比例(${currentTypeData['化石碳的质量分数Unit'] || '%'})`}
                  rules={[{ required: true, message: '请填写废弃物中矿物碳在碳总量中的比例!' }]}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="请填写废弃物中矿物碳在碳总量中的比例" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="RateSource"
                  label="废弃物焚烧炉的燃烧效率来源"
                >
                  <Select placeholder="请选择废弃物焚烧炉的燃烧效率来源">
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
                  name="Rate"
                  label={`废弃物焚烧炉的燃烧效率(${currentTypeData['废弃物焚烧炉的燃烧效率Unit'] || '%'})`}
                  rules={[{ required: true, message: '请填写废弃物焚烧炉的燃烧效率!' }]}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="请填写废弃物焚烧炉的燃烧效率" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label={
                    <span>
                      二氧化碳排放量（t）
                      <QuestionTooltip content="二氧化碳排放量 = 废弃物的处置量 × 废弃物碳含量的比例 × 废弃物中矿物碳在碳总量中的比例 × 废弃物焚烧炉的燃烧效率 × 44 ÷ 12" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写排放量" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 6 }}
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
