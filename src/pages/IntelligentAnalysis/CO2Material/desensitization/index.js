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
import ConsumptionModal from '@/pages/IntelligentAnalysis/CO2Emissions/components/ConsumptionModal';
import { InfoCircleOutlined } from '@ant-design/icons'

const { TextArea } = Input;
const { Option } = Select;
const CONFIG_ID = 'Desulphurization';
const SELECT_LIST = [{ "key": 1, "value": "脱硫剂" }]
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
      currentTypeData: {},
      editTotalData: {},
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
            MonitorTime: moment(values.MonitorTime).format("YYYY-MM-01 00:00"),
            DesulphurizationCode: KEY
          },
          reload: KEY ? true : undefined,
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
        'dbo.T_Bas_CO2Desulphurization.DesulphurizationCode': this.state.KEY,
      },
      callback: (res) => {
        this.setState({
          editData: res,
          isModalVisible: true,
          editTotalData: {
            MonVolume: res.MonVolume,
            ReportVolume: res.ReportVolume,
            BuyVolume: res.BuyVolume,
            TransferVolume: res.TransferVolume,
            Consumption: res.Consumption,
            deviation: res.Deviation,
            total: res.CarbonateConsumption,
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
    const { isModalVisible, editData, FileUuid, FileUuid2, currentTypeData, totalVisible, KEY, editTotalData } = this.state;
    const { tableInfo, autoForm } = this.props;
    const { EntView = [] } = this.props.configIdList;

    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CO2Desulphurization.tCO2');

    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      console.log('values=', values)
      var { Deviation, LowFeverDataType, UnitCarbonContentDataType, CO2OxidationRateDataType } = values;
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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CO2Desulphurization.AttachmentID')
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CO2Desulphurization.DevAttachmentID')
              this.setState({ KEY: key, FileUuid: FileUuid, FileUuid2: FileUuid2 }, () => {
                this.getFormData();
              })
            }}
            footer={() => <div className="">排放量合计：{count}</div>}
          />
        </Card>
        <Modal destroyOnClose width={900} title="添加" visible={isModalVisible} onOk={this.onHandleSubmit} onCancel={this.handleCancel}>
          {this.showDeviation()}
          <Form
            style={{ marginTop: 24 }}
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
              Deviation: editData.Deviation || '-',
              GetType: editData.GetType || '-',
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
                  name="DesulfurizerType"
                  label="脱硫剂类型"
                  rules={[{ required: true, message: '请选择脱硫剂类型!' }]}
                >
                  <Select placeholder="请选择脱硫剂类型">
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
                  name="CarbonateConsumption"
                  label="脱硫剂中碳酸盐消耗量（t）"
                  rules={[{ required: true, message: '请填写脱硫剂中碳酸盐消耗量!' }]}
                >
                  <InputNumber bordered={false} disabled style={{ width: 'calc(100% - 64px)' }} placeholder="消耗量" onChange={this.countEmissions} />
                  {/* <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写脱硫剂中碳酸盐消耗量" onChange={(value) => {
                    let val2 = this.formRef.current.getFieldValue('CarbonateEmission') || 0;
                    let count = value * val2;
                    this.formRef.current.setFieldsValue({ 'tCO2': count });
                  }} /> */}
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
                  name="CarbonateEmission"
                  label="碳酸盐排放因子（tCO₂/t）"
                  rules={[{ required: true, message: '请填写碳酸盐排放因子!' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写碳酸盐排放因子" onChange={(value) => {
                    let val1 = this.formRef.current.getFieldValue('CarbonateConsumption') || 0;
                    let count = value * val1;
                    this.formRef.current.setFieldsValue({ 'tCO2': count });
                  }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label={
                    <span>排放量（tCO₂）
                      <QuestionTooltip content="排放量 = 脱硫剂中碳酸盐消耗量 × 碳酸盐排放因子" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写排放量" />
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
          unit={'t'}
          visible={totalVisible}
          onCancel={() => this.setState({ totalVisible: false })}
          onOk={(data) => {
            console.log('data=', data)
            this.formRef.current.setFieldsValue({ 'CarbonateConsumption': data.total, 'Deviation': data.deviation, GetType: data.GetType })
            this.setState({ totalVisible: false, totalData: data })
            let val2 = this.formRef.current.getFieldValue('CarbonateEmission') || 0;
            let count = data.total * val2;
            this.formRef.current.setFieldsValue({ 'tCO2': count });
          }} />
      </BreadcrumbWrapper>
    );
  }
}

export default index;