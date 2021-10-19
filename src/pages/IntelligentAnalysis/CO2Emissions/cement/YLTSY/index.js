import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, DatePicker } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'

const { Option } = Select;
const CONFIG_ID = 'CementCarbonate';
const SELECT_LISTGet = [{ "key": 1, "value": "购(产)销存" }];
const layout = {
  labelCol: { span: 14 },
  wrapperCol: { span: 10 },
};

@connect(({ loading, autoForm, CO2Emissions }) => ({
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
    };
  }

  componentDidMount() {
  }


  // 计算排放量
  countEmissions = () => {
    //   (水泥熟料产量 + 窑炉排气筒(窑头)粉尘重量 + 窑炉旁路防风粉尘的重量) * 
    //  (
    //     (熟料中氧化钙的含量 - 生料中不是以碳酸盐形式存在的氧化钙的含量) × 44 ÷ 56
    //        + 
    //     (熟料中氧化镁的含量 - 生料中不是以碳酸盐形式存在的氧化镁的含量) * 44 ÷ 40
    //  )
    let values = this.formRef.current.getFieldsValue();
    let {
      AnnualConsumption = 0,
      ExhaustWeight = 0,
      FreshWeight = 0,
      CalciumContent = 0,
      MagnesiumContent = 0,
      NoCalciumContent = 0,
      NoMagnesiumContent = 0,
    } = values;
    let value1 = AnnualConsumption + ExhaustWeight + FreshWeight;
    let value2 = (CalciumContent - NoCalciumContent) * 44 / 56;
    let value3 = (MagnesiumContent - NoMagnesiumContent) * 44 / 56;
    let count = value1 * (value2 + value3);
    this.formRef.current.setFieldsValue({ 'tCO2': count.toFixed(2) });
  }

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
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
            CarbonateCode: KEY
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
        'dbo.T_Bas_CementCarbonate.CarbonateCode': this.state.KEY,
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
    const { tableInfo } = this.props;
    const { Output_Enterprise = [] } = this.props.configIdList;
    console.log('props=', this.props)
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementCarbonate.tCO2');

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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementCarbonate.AttachmentID')
              this.setState({ KEY: key, FileUuid: FileUuid }, () => {
                this.getFormData(FileUuid);
              })
            }}
            footer={() => <div className="">排放量合计：{count.toFixed(2)}</div>}
          />
        </Card>
        <Modal destroyOnClose width={1200} title="添加" visible={isModalVisible} onOk={this.onHandleSubmit} onCancel={this.handleCancel}>
          <Form
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              NonFuelCarbonContentDataType: 2,
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
                  name="AnnualConsumption"
                  label="水泥熟料产量(t)"
                  rules={[{ required: true, message: '请填写水泥熟料产量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写水泥熟料产量" onChange={this.countEmissions} />
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
                  name="ExhaustWeight"
                  label="窑炉排气筒(窑头)粉尘重量(t)"
                  rules={[{ required: true, message: '请填写窑炉排气筒粉尘重量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写窑炉排气筒粉尘重量" onChange={this.countEmissions} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="FreshWeight"
                  label="窑炉旁路防风粉尘的重量"
                  rules={[{ required: true, message: '请填写窑炉旁路防风粉尘的重量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写窑炉旁路防风粉尘的重量" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CalciumContent"
                  label="熟料中氧化钙的含量(%)"
                  rules={[{ required: true, message: '请填写熟料中氧化钙的含量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写熟料中氧化钙的含量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="MagnesiumContent"
                  label="熟料中氧化镁的含量(%)"
                  rules={[{ required: true, message: '请填写熟料中氧化镁的含量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写熟料中氧化镁的含量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="NoCalciumContent"
                  label="生料中不是以碳酸盐形式存在的氧化钙(CaO)的含量(%)"
                  rules={[{ required: true, message: '请填写生料中不是以碳酸盐形式存在的氧化钙(CaO)的含量(%)!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写生料中不是以碳酸盐形式存在的氧化钙(CaO)的含量(%)!"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="NoMagnesiumContent"
                  label="生料中不是以碳酸盐形式存在的氧化镁(MgO)的含量(%)"
                  rules={[{ required: true, message: '请填写生料中不是以碳酸盐形式存在的氧化镁(MgO)的含量(%)!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写生料中不是以碳酸盐形式存在的氧化镁(MgO)的含量(%)!"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Loss"
                  label="生料烧失量(%)"
                  rules={[{ required: true, message: '请填写生料烧失量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写生料烧失量!"
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
                      <QuestionTooltip content="排放量 = (水泥熟料产量 + 窑炉排气筒(窑头)粉尘重量 + 窑炉旁路防风粉尘的种类) * ((熟料中氧化钙的含量 - 生料中不是以碳酸盐形式存在的氧化钙的含量) × 44 ÷ 56 + (熟料中氧化镁的含量 - 生料中不是以碳酸盐形式存在的氧化镁的含量) * 44 ÷ 40)" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写排放量" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 5 }}
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
