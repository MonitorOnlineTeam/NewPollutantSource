/*
 * @Author: Jiaqi 
 * @Date: 2019-10-25 10:18:12 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-10-25 10:23:28
 * @desc: 设备管理（添加、编辑页面）
 */
import React, { PureComponent } from 'react'
import { Table, Card, Tag, Modal, Form, Row, Col, Select, Input, DatePicker, InputNumber, Divider, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva'
import { handleFormData } from '@/utils/utils'
import { router } from 'umi';
import moment from 'moment';
import PageLoading from '@/components/PageLoading';

@Form.create()
@connect(({ loading, equipment }) => ({
  EquipmentModel: equipment.EquipmentModel,
  EquipmentType: equipment.EquipmentType,
  Manufacturer: equipment.Manufacturer,
  Measurement: equipment.Measurement,
  equipmentData: equipment.equipmentData,
  loading: loading.effects["equipment/getEquipmentByID"],
}))
class AddEditEquipmentPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this._SELF_ = {
      type: props.match.params.id === "null" ? "add" : "edit",
      routerParams: props.match.params,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
      }
    }
  }

  componentDidMount() {
    const { type, routerParams } = this._SELF_;
    type === "add" ?
      this.props.dispatch({
        type: "equipment/getEquipmentWhere",
        payload: {
          EquipmentType: "",
          EquipmentModel: "",
          Manufacturer: ""
        }
      }) :
      this.props.dispatch({
        type: "equipment/getEquipmentByID",
        payload: {
          id: routerParams.id
        }
      })
  }

  changeWhere = payload => {
    this.props.dispatch({
      type: "equipment/getEquipmentWhere",
      payload: payload
    })
  }

  // 提交保存
  submitForm = e => {
    e.preventDefault();
    const { type, routerParams } = this._SELF_;
    const { form, onSubmitForm, dispatch, match: { params } } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let formData = handleFormData(values)
        console.log("formData=", formData)
        // return;
        type === "add" ?
          // 添加
          dispatch({
            type: 'autoForm/add',
            payload: {
              configId: "Equipment",
              FormData: {
                ...formData,
                DGIMN: params.DGIMN
              },
              callback: (res) => {
                router.push("/platformconfig/equipmentManage")
              }
            }
          }) :
          // 编辑
          dispatch({
            type: 'autoForm/saveEdit',
            payload: {
              configId: "Equipment",
              FormData: {
                ...formData,
                DGIMN: routerParams.DGIMN,
                ID: routerParams.id
              },
              callback: (res) => {
                router.push("/platformconfig/equipmentManage")
              }
            }
          });
      }
    })
  }

  render() {
    // const { type } = this.state;
    const { form, form: { getFieldDecorator }, EquipmentModel, EquipmentType, Manufacturer, Measurement, equipmentData, loading } = this.props;
    const { type, formItemLayout } = this._SELF_;
    if (loading && type === "edit") {
      return <PageLoading />
    }
    return (
      <PageHeaderWrapper title={type === "add" ? "添加" : "编辑"}>
        <Card>
          <Form {...formItemLayout} onSubmit={this.submitForm}>
            <Row>
              <Col span={12}>
                <Form.Item label="设备类别">
                  {getFieldDecorator('EquipmentType', {
                    rules: [{ required: true, message: '请选择设备类别' }],
                    initialValue: equipmentData.EquipmentType
                  })(
                    <Select placeholder="请选择设备类别" onChange={val => {
                      this.changeWhere({
                        EquipmentType: val,
                      });
                      form.setFieldsValue({ "Manufacturer": undefined, "EquipmentModel": undefined })
                    }}>
                      {
                        EquipmentType.map(item => {
                          return <Option key={item} value={item}>{item}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="设备厂商">
                  {getFieldDecorator('Manufacturer', {
                    rules: [{ required: true, message: "请选择设备厂商" }],
                    initialValue: equipmentData.Manufacturer
                  })(
                    <Select placeholder="请选择设备厂商" onChange={val => {
                      this.changeWhere({
                        EquipmentType: form.getFieldValue('EquipmentType'),
                        Manufacturer: val,
                      });
                      form.setFieldsValue({ "EquipmentModel": undefined })
                    }}>
                      {
                        Manufacturer.map(item => {
                          return <Option key={item} value={item}>{item}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="设备型号">
                  {getFieldDecorator('EquipmentModel', {
                    rules: [{ required: true, message: "请选择设备型号" }],
                    initialValue: equipmentData.EquipmentModel
                  })(
                    <Select placeholder="请选择设备型号" onChange={val => {
                      this.changeWhere({
                        EquipmentType: form.getFieldValue('EquipmentType'),
                        Manufacturer: form.getFieldValue('Manufacturer'),
                        EquipmentModel: val
                      });
                    }}>
                      {
                        EquipmentModel.map(item => {
                          return <Option key={item} value={item}>{item}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="测量参数">
                  {getFieldDecorator('Measurement', {
                    rules: [{ required: true, message: "请填写测量参数" }],
                    initialValue: Measurement
                  })(
                    <Input placeholder="测量参数" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="调试完日期">
                  {getFieldDecorator('OverTime', {
                    rules: [{ required: true, message: "请选择调试完日期" }],
                    initialValue: equipmentData.OverTime ? moment(equipmentData.OverTime) : undefined
                  })(
                    <DatePicker placeholder="调试完日期" style={{ width: '100%' }} showTime />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="出厂日期">
                  {getFieldDecorator('FactoryTime', {
                    rules: [{ required: true, message: "请选择出厂日期" }],
                    initialValue: equipmentData.FactoryTime ? moment(equipmentData.FactoryTime) : undefined
                  })(
                    <DatePicker placeholder="出厂日期" style={{ width: '100%' }} showTime />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="使用年限">
                  {getFieldDecorator('UserYears', {
                    rules: [{ required: true, message: "请填写使用年限" }],
                    initialValue: equipmentData.UserYears
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={value => `${value} 年`}
                      parser={value => value.replace(' 年', '')}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Divider orientation="right">
                <Button type="primary" htmlType="submit">保存</Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    history.go(-1);
                  }}
                >返回</Button>
              </Divider>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AddEditEquipmentPage;