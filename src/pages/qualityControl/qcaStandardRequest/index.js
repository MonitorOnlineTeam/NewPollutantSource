import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Modal, Card, Form, Row, Col, Input, Select, } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import { connect } from 'dva';
import { checkRules } from '@/utils/validator';

const FormItem = Form.Item;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
@connect()
class QcaStandardRequest extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      configId: "QCATechnologyRequire",
      isModalVisible: false,
      current: {},
    };
  }

  onClickSave = () => {
    this.formRef.current.validateFields().then((values) => {
      console.log('values=', values)
      // return;
      const { current, configId } = this.state;
      let before = current.QCAType_Name === '响应时间核查' ? '≤' : '±'
      this.props.dispatch({
        type: 'qualityControl/_action',
        APIName: 'UpdQCAStandardRequest',
        payload: {
          ID: current.ID,
          Require: before + values.Require,
          Origin: values.Origin,
        },
        callback: (res) => {
          this.setState({ isModalVisible: false })
          this.props.dispatch({
            type: 'autoForm/getAutoFormData',
            payload: {
              configId: configId
            }
          })
        }
      })
    })
  }

  render() {
    const { configId, isModalVisible, current } = this.state;
    console.log('current=', current)
    return (
      <BreadcrumbWrapper>
        <Card>
          <AutoFormTable
            configId={configId}
            getPageConfig
            onEdit={(record, key) => {
              this.setState({
                current: {
                  ID: record['dbo.T_Cod_QCATechnologyRequire.ID'],
                  QCAType_Name: record['dbo.T_Cod_QCATechnologyRequire.QCAType_Name'],
                  PollutantName: record['dbo.T_Cod_Pollutant.PollutantName'],
                  Require: record['dbo.T_Cod_QCATechnologyRequire.Require'].replace("±", "").replace("≤", ""),
                  Origin: record['dbo.T_Cod_QCATechnologyRequire.Origin'],
                },
                isModalVisible: true,
              })
            }}
          />
        </Card>
        <Modal
          title="修改质控标准"
          width={620}
          destroyOnClose
          visible={isModalVisible}
          onOk={this.onClickSave}
          onCancel={() => this.setState({ isModalVisible: false })}
        >
          <Form
            // layout='inline'
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...current
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name="QCAType_Name"
                  label="核查类型"
                  rules={[{ required: true, message: '核查类型不能为空' }]}
                >
                  {/* <p>{current.QCAType_Name}</p> */}
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="PollutantName"
                  label="污染物名称"
                  rules={[{ required: true, message: '污染物名称不能为空' }]}
                >
                  {/* <p>{current.PollutantName}</p> */}
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Require"
                  label="标准"
                  rules={[{ required: true, message: '标准不能为空' }, checkRules.double]}
                >
                  {
                    current.QCAType_Name === '响应时间核查' ?
                      <Input addonBefore="≤" placeholder="请填写标准" /> :
                      <Input addonBefore="±" placeholder="请填写标准" />
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Origin"
                  label="描述"
                  rules={[{ required: true, message: '描述不能为空' }]}
                >
                  <Input placeholder="请填写描述" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default QcaStandardRequest;