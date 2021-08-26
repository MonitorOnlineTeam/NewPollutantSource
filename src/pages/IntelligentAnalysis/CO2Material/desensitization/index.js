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
        })
      }
    })
  }

  render() {
    const { isModalVisible, editData, FileUuid } = this.state;
    const { tableInfo, autoForm } = this.props;
    const { Output_Enterprise = [] } = this.props.configIdList;

    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CO2Desulphurization.tCO2');

    console.log("autoForm=", autoForm)

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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CO2Desulphurization.AttachmentID')
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
              ...editData,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.T_Bas_Enterprise.EntCode'],
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
                  <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写脱硫剂中碳酸盐消耗量" onChange={(value) => {
                    let val2 = this.formRef.current.getFieldValue('CarbonateEmission') || 0;
                    let count = value * val2;
                    this.formRef.current.setFieldsValue({ 'tCO2': count });
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
      </BreadcrumbWrapper>
    );
  }
}

export default index;