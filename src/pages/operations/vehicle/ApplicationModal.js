import React, { PureComponent } from 'react';
import { Form, Modal, Row, Col, Select, Input } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;
const FormItem = Form.Item;
// {/* 点击发起申请弹出新页面，页面显示内容项：车辆名称（必填）、申请说明，
//  车辆名称：用带搜索的列表控件，控件内容为待借状态的车辆信息（车辆名称-车牌号），
//  申请说明：内容框就行，
//  保存按钮：带上保存中的提示状态，转圈， */}
@connect(({ loading, operations }) => ({
  applicationModalVisible: operations.applicationModalVisible,
  applyVehicleList: operations.applyVehicleList,
  loading: loading.effects["operations/addVehicleApplication"]
}))
@Form.create()
class ApplicationModal extends PureComponent {
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
        console.log('values=',values)
        this.props.dispatch({
          type: "operations/addVehicleApplication",
          payload: {
            ...values
          }
        })
      }
    });
  }

  closeModal = e => {
    this.props.dispatch({
      type: "operations/updateState",
      payload: {
        applicationModalVisible: false
      }
    })
  };

  render() {
    // console.log('applyVehicleList=',this.props.applyVehicleList)
    const { form: { getFieldDecorator }, applyVehicleList, loading } = this.props;
    const formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
    }
    return (
      <Modal
        title="车辆申请"
        visible={this.props.applicationModalVisible}
        loading={loading}
        onOk={this.onSubmitForm}
        onCancel={this.closeModal}
      >
        <Form layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={24}>
              <FormItem {...formLayout} label="车辆名称" style={{ width: '100%' }}>
                {getFieldDecorator("VehicleID", {
                  rules: [
                    {
                      required: true,
                      message: '请选择车辆!',
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择车辆"
                  >
                    {
                      applyVehicleList.map(item => {
                        return <Option value={item.ID}>{item.VehicleName} - {item.LicensePlateNumber}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop: 10}}>
            <Col span={24}>
              <FormItem {...formLayout} label="申请说明" style={{ width: '100%' }}>
                {getFieldDecorator("ApplicationNote", {
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

export default ApplicationModal;