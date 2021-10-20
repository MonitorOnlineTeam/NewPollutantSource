/*
 * @Author: Jiaqi 
 * @Date: 2021-10-12 13:58:42 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2021-10-12 14:02:17
 * @Description: 净购入电力
 */
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
const CONFIG_ID = 'CementDischarge';
const SELECT_LIST = [{ "key": 1, "value": "外购电力" }]
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
            PowerDischargeCode: KEY
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
        'dbo.T_Bas_CementDischarge.PowerDischargeCode': this.state.KEY,
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
    const { tableInfo } = this.props;
    const { EntView = [] } = this.props.configIdList;
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementDischarge.tCO2');
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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementDischarge.AttachmentID')
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
                  name="PowerDischargeType"
                  label="种类"
                  rules={[{ required: true, message: '请选择种类!' }]}
                >
                  <Select placeholder="请选择种类">
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
                  name="ActivityData"
                  label="活动数据（MWh）"
                  rules={[{ required: true, message: '请填写活动数据!' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写活动数据" onChange={(value) => {
                    let val2 = this.formRef.current.getFieldValue('Emission') || 0;
                    let count = value * val2;
                    this.formRef.current.setFieldsValue({ 'tCO2': count.toFixed(2) });
                  }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Emission"
                  label="排放因子（tCO₂/MWh）"
                  rules={[{ required: true, message: '请填写排放因子!' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写排放因子" onChange={(value) => {
                    let val1 = this.formRef.current.getFieldValue('ActivityData') || 0;
                    let count = value * val1;
                    this.formRef.current.setFieldsValue({ 'tCO2': count.toFixed(2) });
                  }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label="排放量（tCO₂）"
                  label={
                    <span>排放量（tCO₂）
                      <QuestionTooltip content="排放量 = 活动数据 × 排放因子" />
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