import React, { PureComponent } from 'react'
import { Modal, Button, Collapse, Form, InputNumber, Row, Col } from 'antd';
const { Panel } = Collapse;
import { InfoCircleOutlined } from '@ant-design/icons';
import _ from 'lodash'
class ConsumptionModal extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      deviation: 0,
      xhl: 0,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        deviation: this.props.data.deviation,
        xhl: this.props.data.xhl,
      })
    }
  }

  // 计算发票或结算确认单消耗量
  countSheetConsumption = () => {
    let values = this.formRef.current.getFieldsValue();
    let { BuyVolume = 0, TransferVolume = 0 } = values;
    let count = BuyVolume - TransferVolume;
    this.setState({ Consumption: count })
    this.formRef.current.setFieldsValue({ 'Consumption': count });
    this.countDeviation()
  }

  // 计算消耗量
  countConsumption = () => {
    const { deviation } = this.state;
    let values = this.formRef.current.getFieldsValue();
    let { MonVolume = 0, ReportVolume = 0, Consumption = 0 } = values;
    let list = [
      { name: '远程监控', value: MonVolume },
      { name: '生产报表', value: ReportVolume },
      { name: '发票或结算确认单', value: Consumption },
    ]
    let xhl = 0;
    let GetType = '';
    if (deviation > 5) {
      // 偏差大于5取消耗量最大值
      let maxObj = _.maxBy(list, 'value');
      console.log('maxObj=', maxObj)
      xhl = maxObj.value
      GetType = maxObj.name;
    } else {
      // 偏差小于5按优先级：1. 远程监控 2. 生产报表 3. 发票或计算确认单
      xhl = MonVolume;
      GetType = '远程监控';
    }
    this.setState({ xhl, GetType })
  }

  // 计算偏差
  countDeviation = () => {
    let values = this.formRef.current.getFieldsValue();
    let { MonVolume = 0, ReportVolume = 0, Consumption = 0 } = values;
    if (ReportVolume && Consumption) {
      let value1 = MonVolume / ReportVolume;
      let value2 = ReportVolume / Consumption;
      let deviation = value1 > value2 ? value1 : value2;
      this.setState({
        deviation: parseInt(deviation)
      }, () => {
        this.countConsumption()
      })
    }
  }

  // 显示偏差值
  showDeviation = () => {
    const { deviation } = this.state;
    if (deviation > 5) {
      return <span style={{ color: 'red', fontWeight: 'bold' }}>{deviation}%，大于5%，确定后需要填写偏差原因并上传偏差证明材料！</span>
    } else {
      return <span style={{ fontWeight: 'bold' }}>{deviation}%</span>
    }
  }

  onHandleSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      const { xhl, deviation, GetType } = this.state;
      let data = { ...values, xhl, deviation, GetType }
      this.props.onOk(data);
    })
  }

  render() {
    const { onCancel, visible, data, unit } = this.props;
    const { xhl } = this.state;
    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      var { Consumption, AnnualConsumption, Deviation } = values;
    }
    return (
      <Modal
        // destroyOnClose
        width={1000}
        title="计算消耗量"
        visible={visible}
        onOk={this.onHandleSubmit}
        onCancel={onCancel}
      >
        <p style={{ position: 'absolute', top: 68 }}>
          <InfoCircleOutlined style={{ marginRight: 10 }} />
          消耗量：<span style={{ fontSize: 15 }}>{xhl}{unit ? `（${unit}）` : ''}</span>，偏差：{this.showDeviation()}
        </p>
        <Form
          // {...layout}
          style={{ marginTop: 24 }}
          ref={this.formRef}
          initialValues={{
            ...data
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
                <InputNumber onChange={this.countDeviation} style={{ width: '100%' }} placeholder="请输入消耗量" />
              </Form.Item>
            </Panel>
            <Panel showArrow={false} header="生产报表" key="2">
              <Form.Item
                name="ReportVolume"
                label="生产报表消耗量"
                style={{ marginBottom: 0 }}
                rules={[{ required: true, message: '请输入生产报表消耗量!' }]}
              >
                <InputNumber onChange={this.countDeviation} style={{ width: '100%' }} placeholder="请输入生产报表消耗量" />
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
        </Form>
      </Modal>
    );
  }
}

export default ConsumptionModal;