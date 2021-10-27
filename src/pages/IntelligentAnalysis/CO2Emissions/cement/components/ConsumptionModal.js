import React, { PureComponent } from 'react'
import { Modal, Button, Collapse, Form, InputNumber, Row, Col } from 'antd';
const { Panel } = Collapse;

class ConsumptionModal extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  // 计算发票或结算确认单消耗量
  countSheetConsumption = () => {
    let values = this.formRef.current.getFieldsValue();
    let { BuyVolume = 0, TransferVolume = 0 } = values;
    let count = BuyVolume - TransferVolume;
    this.setState({ Consumption: count })
    this.formRef.current.setFieldsValue({ 'Consumption': count });
  }

  // 计算消耗量
  countConsumption = () => {
    let values = this.formRef.current.getFieldsValue();
    let { MonVolume = 0, ReportVolume = 0, Consumption } = values;
  }

  // 计算偏差
  deviation = () => {

  }

  render() {
    const { onCancel, visible } = this.props;
    // const { Consumption, AnnualConsumption, Deviation } = this.state;
    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      var { Consumption, AnnualConsumption, Deviation } = values;
    }
    return (
      <Modal
        destroyOnClose
        width={1000}
        title="添加"
        visible={visible}
        // onOk={this.onHandleSubmit}
        onCancel={onCancel}
      >
        <Form
          // {...layout}
          ref={this.formRef}
          initialValues={{
          }}
        >
          <Collapse activeKey={['1', '2', '3']}>
            <Panel showArrow={false} header={<p style={{ fontWeight: 500 }}>远程监控</p>} key="1">
              <Form.Item
                name="MonVolume"
                label="远程监控消耗量"
                style={{ marginBottom: 0 }}
                rules={[{ required: true, message: '请输入消耗量!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入消耗量" />
              </Form.Item>
            </Panel>
            <Panel showArrow={false} header="生产报表" key="2">
              <Form.Item
                name="ReportVolume"
                label="生产报表消耗量"
                style={{ marginBottom: 0 }}
                rules={[{ required: true, message: '请输入生产报表消耗量!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入生产报表消耗量" />
              </Form.Item>
            </Panel>
            <Panel showArrow={false} header="发票或结算确认单" key="3">
              <Row gutter={[16]}>
                <Col span={12}>
                  <Form.Item
                    name="BuyVolume"
                    label="购入量"
                    rules={[{ required: true, message: '请输入购入量!' }]}
                  >
                    <InputNumber style={{ width: '100%' }} placeholder="请输入购入量" onChange={this.countSheetConsumption} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="TransferVolume"
                    label="转供量"
                    rules={[{ required: true, message: '请输入转供量!' }]}
                  >
                    <InputNumber style={{ width: '100%' }} placeholder="请输入转供量" onChange={this.countSheetConsumption} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="Consumption"
                label="发票或结算确认单消耗量"
                style={{ marginBottom: 0 }}
                rules={[{ required: true, message: '请输入消耗量!' }]}
              >
                <p>{Consumption}</p>
              </Form.Item>
            </Panel>
          </Collapse>
          <Row>
            <Col span={12}>
              <Form.Item
                name="Deviation"
                label="偏差"
                style={{ marginBottom: 0 }}
              >
                <p>{Deviation}</p>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="AnnualConsumption"
                label="消耗量"
                style={{ marginBottom: 0 }}
              >
                <p>{AnnualConsumption}</p>
              </Form.Item>
            </Col>
          </Row>
        </Form>


      </Modal>
    );
  }
}

export default ConsumptionModal;