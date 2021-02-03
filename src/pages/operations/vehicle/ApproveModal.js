import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Row, Col, Select, Input, Radio } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;
const FormItem = Form.Item;
// {/* 点击发起申请弹出新页面，页面显示内容项：车辆名称（必填）、申请说明，
//  车辆名称：用带搜索的列表控件，控件内容为待借状态的车辆信息（车辆名称-车牌号），
//  申请说明：内容框就行，
//  保存按钮：带上保存中的提示状态，转圈， */}
@connect(({ loading, operations }) => ({
  approveModalVisible: operations.approveModalVisible,
  approveModalData: operations.approveModalData,
  loading: loading.effects["operations/approve"]
}))
@Form.create()
class ApproveModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  // 提交申请
  onSubmitForm = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values=', values)
        this.props.dispatch({
          type: "operations/approve",
          payload: {
            ID: this.props.approveModalData["dbo.View_VehicleApplication.ID"],
            type: values.type,
            RefuseReason: values.RefuseReason || ""
          }
        })
      }
    });
  }

  closeModal = e => {
    this.props.dispatch({
      type: "operations/updateState",
      payload: {
        approveModalVisible: false
      }
    })
  };

  render() {
    const { form: { getFieldDecorator, getFieldValue }, approveModalVisible, loading } = this.props;
    const formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
    }
    return (
      <Modal
        title="车辆审批"
        loading={loading}
        visible={approveModalVisible}
        onOk={this.onSubmitForm}
        onCancel={this.closeModal}
      >
        <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={24}>
              <FormItem {...formLayout} label="审批状态" style={{ width: '100%' }}>
                {getFieldDecorator("type", {
                  initialValue: 1
                })(
                  <Radio.Group>
                    <Radio value={1}>同意</Radio>
                    <Radio value={2}>拒绝</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10 }}>
            <Col span={24}>
              <FormItem {...formLayout} label="审批备注" style={{ width: '100%' }}>
                {getFieldDecorator("RefuseReason", {
                  rules: [
                    {
                      required: getFieldValue("type") === 2,
                      message: '请填写拒绝原因!',
                    },
                  ],
                })(
                  <TextArea rows={4} />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal >
    );
  }
}

export default ApproveModal;