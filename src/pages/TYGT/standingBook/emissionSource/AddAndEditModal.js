import React, { PureComponent } from 'react'
import { Modal, Form, Input, Select, Row, Col, Radio } from 'antd'

class AddAndEditModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      entCode: props.entCode,
    };

    this._CONST = {
      EmissionType: [
        {
          "key": "1",
          "value": "有组织"
        },
        {
          "key": "2",
          "value": "生产工艺过程"
        },
        {
          "key": "3",
          "value": "物料封闭存储和运输"
        },
        {
          "key": "4",
          "value": "物料封闭存储"
        },
        {
          "key": "5",
          "value": "物料封闭运输"
        }
      ]
    }
    this.formRef = React.createRef();
  }

  render() {
    const { visible } = this.props;
    const { EmissionType } = this._CONST;
    return <Modal
      title="添加"
      visible={visible}
      width={800}
      // onOk={ }
      onCancel={this.props.onCancel}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        ref={this.formRef}
        layout="horizontal"
        scrollToFirstError
      >
        <Row>
          <Col span={12}>
            <Form.Item
              label="名称"
              name="EmissionName"
              rules={[{ required: true, message: '请输入名称!' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="排放源类型"
              name="EmissionType"
              rules={[{ required: true, message: '请选择排放源类型!' }]}
            >
              <Select placeholder="请选择排放源类型">
                {
                  EmissionType.map(item => {
                    return <Option key={item.key} value={item.key}>{item.value}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="生产设备/车间名称"
              name="WorkShop"
              rules={[{ required: true, message: '请输入生产设备/车间名称!' }]}
            >
              <Input placeholder="请输入生产设备/车间名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="生产工序"
              name="WorkProce"
              rules={[{ required: true, message: '请输入生产工序!' }]}
            >
              <Input placeholder="请输入生产工序" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="规定要求"
              name="Regulations"
              rules={[{ required: true, message: '请输入规定要求!' }]}
            >
              <Input placeholder="请输入规定要求" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="是否满足要求"
              name="IsSatisfy"
              rules={[{ required: true, message: '请选择性别!' }]}
            >
              <Radio.Group>
                <Radio key={1} value={1}>是</Radio>
                <Radio key={0} value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="治理设施配置情况"
              name="GoveConfiguration"
            >
              <Input placeholder="请输入治理设施配置情况" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="物料类型"
              name="MaterialType"
            >
              <Select placeholder="请选择物料类型">
                {
                  EmissionType.map(item => {
                    return <Option key={item.key} value={item.key}>{item.value}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  }
}

export default AddAndEditModal