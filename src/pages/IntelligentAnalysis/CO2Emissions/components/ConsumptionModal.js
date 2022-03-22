import React, { PureComponent } from 'react'
import { Modal, Input, Collapse, Form, InputNumber, Row, Col } from 'antd';
const { Panel } = Collapse;
import { InfoCircleOutlined } from '@ant-design/icons';
import _ from 'lodash'
class ConsumptionModal extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      deviation: 0,
      total: 0,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        deviation: this.props.data.deviation,
        total: this.props.data.total,
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
    let total = 0;
    let GetType = '';
    if (deviation > 5) {
      // 偏差大于5取：消耗量最大值
      let maxObj = _.maxBy(list, 'value');
      console.log('maxObj=', maxObj)
      total = maxObj.value
      GetType = maxObj.name;
    } else {
      // 偏差小于5按优先级：1. 远程监控 2. 生产报表 3. 发票或计算确认单
      total = MonVolume ? MonVolume : (ReportVolume ? ReportVolume : Consumption);
      GetType = '远程监控';
    }
    this.setState({ total, GetType })
  }

  // 计算偏差
  countDeviation = () => {
    let values = this.formRef.current.getFieldsValue();
    // 1,2,3
    let { MonVolume, Consumption, ReportVolume } = values;
    let value1 = 0;
    let value2 = 0;
    let value3 = 0;
    // 2-3/3
    // Math.abs(Consumption - ReportVolume) / ReportVolume
    // 1-3/3
    // Math.abs(MonVolume - ReportVolume) / ReportVolume
    // 1-2/2
    // Math.abs(MonVolume - Consumption) / Consumption
    if (Consumption !== null && ReportVolume !== null) {
      // 2-3/3  (发票或结算确认单 - 生产报表) / 生产报表
      value1 = ReportVolume ? Math.abs(Consumption - ReportVolume) / ReportVolume : 0;
    }

    if (MonVolume !== null && ReportVolume !== null) {
      // 1-3/3  (远程监控 - 生产报表) / 生产报表
      value2 = ReportVolume ? Math.abs(MonVolume - ReportVolume) / ReportVolume : 0;
    }
    if (MonVolume !== null && Consumption !== null) {
      // 1-2/2  (远程监控 - 发票或结算确认单) / 发票或结算确认单
      value3 = Consumption ? Math.abs(MonVolume - Consumption) / Consumption : 0
    }
    let deviation = _.max([value1, value2, value3]);
    console.log('deviation=', deviation)
    this.setState({
      deviation: parseInt(deviation * 100)
    }, () => {
      this.countConsumption()
    })
    // console.log('maxObj=', maxObj)
    // if (ReportVolume && Consumption) {
    //   // let value1 = MonVolume / ReportVolume;
    //   // let value2 = ReportVolume / Consumption;
    //   // let value3 = MonVolume / Consumption;
    //   // let deviation = value1 > value2 ? value1 : value2;
    //   let value1 = MonVolume / ReportVolume;
    //   let value2 = ReportVolume / Consumption;
    //   let value3 = MonVolume / Consumption;
    //   let deviation = value1 > value2 ? value1 : value2;
    //   this.setState({
    //     deviation: parseInt(deviation)
    //   }, () => {
    //     this.countConsumption()
    //   })
    // }
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
      const { total, deviation, GetType } = this.state;
      let data = { ...values, total, deviation, GetType }
      this.props.onOk(data);
    })
  }

  render() {
    const { onCancel, visible, data, unit } = this.props;
    const { total } = this.state;
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
          消耗量：<span style={{ fontSize: 15 }}>{total}{unit ? `（${unit}）` : ''}</span>，偏差：{this.showDeviation()}
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
              // rules={[{ required: true, message: '请输入消耗量!' }]}
              >
                <InputNumber onChange={this.countDeviation} style={{ width: '100%' }} placeholder="请输入消耗量" />
              </Form.Item>
            </Panel>
            <Panel showArrow={false} header="生产报表" key="2">
              <Form.Item
                name="ReportVolume"
                label="生产报表消耗量"
                style={{ marginBottom: 0 }}
              // rules={[{ required: true, message: '请输入生产报表消耗量!' }]}
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
                  // rules={[{ required: true, message: '请输入购入量!' }]}
                  >
                    <InputNumber style={{ width: '100%' }} placeholder="请输入购入量" onChange={this.countSheetConsumption} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="TransferVolume"
                    label="转供量"
                  // rules={[{ required: true, message: '请输入转供量!' }]}
                  >
                    <InputNumber style={{ width: '100%' }} placeholder="请输入转供量" onChange={this.countSheetConsumption} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="Consumption"
                label="发票或结算确认单消耗量"
                style={{ marginBottom: 0 }}
              // rules={[{ required: true, message: '请输入消耗量!' }]}
              >
                <Input style={{ color: 'rgba(0, 0, 0, 0.85)' }} disabled bordered={false} />
                {/* <p>{Consumption}</p> */}
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Modal>
    );
  }
}

export default ConsumptionModal;