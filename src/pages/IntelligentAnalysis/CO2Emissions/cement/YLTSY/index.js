import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, DatePicker, Input, Button } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { InfoCircleOutlined } from '@ant-design/icons'
import ConsumptionModal from '@/pages/IntelligentAnalysis/CO2Emissions/components/ConsumptionModal';

const { Option } = Select;
const { TextArea } = Input;
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
      editTotalData: {},
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
      const { totalData, KEY } = this.state;
      let actionType = KEY ? 'autoForm/saveEdit' : 'autoForm/add';

      this.props.dispatch({
        type: actionType,
        payload: {
          configId: CONFIG_ID,
          FormData: {
            ...totalData,
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
    const { isModalVisible, editData, FileUuid, FileUuid2, editTotalData, totalVisible, KEY } = this.state;
    const { tableInfo } = this.props;
    const { EntView = [] } = this.props.configIdList;
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementCarbonate.tCO2');

    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      console.log('values=', values)
      var { Deviation } = values;
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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementCarbonate.AttachmentID')
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CementCarbonate.DevAttachmentID')
              this.setState({ KEY: key, FileUuid: FileUuid, FileUuid2: FileUuid2 }, () => {
                this.getFormData();
              })
            }}
            footer={() => <div className="">排放量合计：{count.toFixed(2)}</div>}
          />
        </Card>
        <Modal destroyOnClose width={1200} title="添加" visible={isModalVisible} onOk={this.onHandleSubmit} onCancel={this.handleCancel}>
          {this.showDeviation()}
          <Form
            style={{ marginTop: 24 }}
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              NonFuelCarbonContentDataType: 2,
              Deviation: editData.Deviation || '-',
              GetType: editData.GetType || '-',
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
                  name="AnnualConsumption"
                  label="水泥熟料产量(t)"
                  rules={[{ required: true, message: '请填写水泥熟料产量!' }]}
                >
                  <InputNumber bordered={false} disabled style={{ width: 'calc(100% - 64px)' }} placeholder="请填写水泥熟料产量" onChange={this.countEmissions} />
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
        <ConsumptionModal
          data={KEY ? editTotalData : {}}
          unit={'t'}
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
