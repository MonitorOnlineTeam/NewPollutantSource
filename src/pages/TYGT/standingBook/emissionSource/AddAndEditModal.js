/*
 * @Author: JiaQi
 * @Date: 2022-11-21 15:59:50
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-17 15:39:20
 * @Description: 排放源添加、编辑页面
 */
import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select, Row, Col, Radio, InputNumber, Spin } from 'antd';
import { connect } from 'dva';

const TextArea = Input.TextArea;

@connect(({ standingBook, autoForm, loading }) => ({
  autoForm: autoForm,
  autoFormDatas: autoForm.tableInfo,
  handleModalVisible: standingBook.handleModalVisible,
  loading_set: loading.effects['standingBook/AddEmission'],
  loading_get: loading.effects['autoForm/getFormData'],
}))
class AddAndEditModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      entCode: props.entCode,
      initialValues: {},
      Pfy_MaterialType: [],
      Pfy_ConveyingMode: [],
      Pfy_ClosedMode: [],
      Pfy_StorageMaterialType: [],
      Pfy_OperationMode: [],
      ProductionPollutant: [],
    };

    this._CONST = {
      CONFIGID: 'UnEmissionAndEnt',
      EDIT_CONFIGID: 'EmissionList',
      EmissionTypeList: [
        {
          key: 1,
          value: '有组织',
        },
        {
          key: 2,
          value: '生产工艺过程',
        },
        {
          key: 3,
          value: '物料封闭存储和运输',
        },
        {
          key: 4,
          value: '物料封闭存储',
        },
        {
          key: 5,
          value: '物料封闭运输',
        },
      ],
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const { id } = this.props;
    // 排放源类型
    this.getSelectDataList('Pfy_EmissionType');
    // 获取物料类型
    this.getSelectDataList('Pfy_MaterialType');
    // 获取运输方式
    this.getSelectDataList('Pfy_ConveyingMode');
    // 封闭方式
    this.getSelectDataList('Pfy_ClosedMode');
    // 存储物料种类
    this.getSelectDataList('Pfy_StorageMaterialType');
    // 堆取物料作业方式
    this.getSelectDataList('Pfy_OperationMode');
    // 生产设施对应的参数
    this.getSelectDataList('ProductionPollutant');

    // 编辑时获取数据
    id && this.getFormData(id);
  }

  // 获取下拉列表autoform配置
  getSelectDataList = id => {
    debugger;
    this.props
      .dispatch({
        type: 'autoForm/getAutoFormData',
        payload: {
          configId: id,
          otherParams: {
            pageIndex: undefined,
            pageSize: undefined,
          },
        },
      })
      .then(() => {
        const { autoFormDatas } = this.props;
        this.setState({
          Pfy_MaterialType: autoFormDatas.Pfy_MaterialType
            ? autoFormDatas.Pfy_MaterialType.dataSource
            : [],
          Pfy_ConveyingMode: autoFormDatas.Pfy_ConveyingMode
            ? autoFormDatas.Pfy_ConveyingMode.dataSource
            : [],
          Pfy_ClosedMode: autoFormDatas.Pfy_ClosedMode
            ? autoFormDatas.Pfy_ClosedMode.dataSource
            : [],
          Pfy_StorageMaterialType: autoFormDatas.Pfy_StorageMaterialType
            ? autoFormDatas.Pfy_StorageMaterialType.dataSource
            : [],
          Pfy_OperationMode: autoFormDatas.Pfy_OperationMode
            ? autoFormDatas.Pfy_OperationMode.dataSource
            : [],
          ProductionPollutant: autoFormDatas.ProductionPollutant
            ? autoFormDatas.ProductionPollutant.dataSource
            : [],
        });
      });
  };

  // 关闭弹窗
  onCancel = () => {
    this.props.dispatch({
      type: 'standingBook/updateState',
      payload: {
        handleModalVisible: false,
      },
    });
  };

  // 提交表单
  onSubmitForm = () => {
    this.formRef.current.validateFields().then(values => {
      console.log('values=', values);
      // return;
      const { id } = this.props;
      id ? this.onUpdata(values) : this.onAdd(values);
    });
  };

  // 新增
  onAdd = values => {
    this.props
      .dispatch({
        type: 'standingBook/AddEmission',
        payload: {
          entCode: this.props.entCode,
          emission: {
            ...values,
            ProdFacilityProps: values.ProdFacilityProps.toString(),
          },
        },
      })
      .then(() => {
        this.loadDataSource();
      });
  };

  // 更新
  onUpdata = values => {
    this.props
      .dispatch({
        type: 'autoForm/saveEdit',
        payload: {
          configId: this._CONST.EDIT_CONFIGID,
          FormData: {
            ID: this.props.id,
            ...values,
            ProdFacilityProps: values.ProdFacilityProps.toString(),
          },
        },
      })
      .then(() => {
        this.onCancel();
        this.loadDataSource();
      });
  };

  // 点击编辑时获取数据
  getFormData = id => {
    this.props.dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: this._CONST.EDIT_CONFIGID,
        'dbo.T_Bas_EmissionList.ID': id,
      },
      callback: res => {
        this.formRef.current.setFieldsValue({
          ...res,
          ProdFacilityProps: res['dbo.T_Bas_EmissionList.ProdFacilityProps']
            ? res['dbo.T_Bas_EmissionList.ProdFacilityProps'].split(',')
            : [],
        });
        this.setState({
          emissionType: res.EmissionType,
        });
      },
    });
  };

  // 加载表格数据
  loadDataSource() {
    const searchParams = [
      {
        Key: 'dbo__T_Cod_UnEmissionAndEnt__EntCode',
        Value: this.props.entCode,
        Where: '$=',
      },
    ];
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: this._CONST.CONFIGID,
        searchParams: searchParams,
      },
    });
  }

  render() {
    const { handleModalVisible, loading_set, loading_get, id } = this.props;
    const {
      emissionType,
      initialValues,
      Pfy_MaterialType,
      Pfy_ConveyingMode,
      Pfy_ClosedMode,
      Pfy_StorageMaterialType,
      Pfy_OperationMode,
      ProductionPollutant,
    } = this.state;
    const { EmissionTypeList } = this._CONST;
    console.log('loading_get', loading_get);
    return (
      <Modal
        title={id ? '编辑' : '添加'}
        visible={handleModalVisible}
        width={'80vw'}
        forceRender
        confirmLoading={loading_set}
        onOk={this.onSubmitForm}
        onCancel={this.onCancel}
      >
        <Spin spinning={!!loading_get}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            ref={this.formRef}
            layout="horizontal"
            // initialValues={editFormData}
            scrollToFirstError
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  label="名称"
                  name="EmissionName"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 19 }}
                  rules={[{ required: true, message: '请填写名称!' }]}
                >
                  <Input placeholder="请填写名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="排放源类型"
                  name="EmissionType"
                  rules={[{ required: true, message: '请选择排放源类型!' }]}
                >
                  <Select
                    placeholder="请选择排放源类型"
                    onChange={v => this.setState({ emissionType: v })}
                  >
                    {EmissionTypeList.map(item => {
                      return (
                        <Option key={item.key} value={item.key}>
                          {item.value}
                        </Option>
                      );
                    })}
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
                  rules={[{ required: true, message: '请选择是否满足要求!' }]}
                >
                  <Radio.Group>
                    <Radio key={1} value={'1'}>
                      是
                    </Radio>
                    <Radio key={0} value={'0'}>
                      否
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="治理设施配置情况" name="GoveConfiguration">
                  <Input placeholder="请输入治理设施配置情况" />
                </Form.Item>
              </Col>
              {emissionType === 2 && (
                <>
                  <Col span={12}>
                    <Form.Item
                      label="是否是生产设施"
                      name="IsProdFacility"
                      // rules={[{ required: true, message: '请选择是否是生产设施!' }]}
                    >
                      <Radio.Group>
                        <Radio key={1} value={true}>
                          是
                        </Radio>
                        <Radio key={0} value={false}>
                          否
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="生产设施对应的参数"
                      name="ProdFacilityProps"
                      // rules={[{ required: true, message: '请选择生产设施对应的参数!' }]}
                    >
                      <Select mode="multiple" placeholder="请选择生产设施对应的参数">
                        {ProductionPollutant.map(item => {
                          return (
                            <Option
                              key={item['dbo.T_Cod_Pollutant.PollutantCode']}
                              value={item['dbo.T_Cod_Pollutant.PollutantCode']}
                            >
                              {item['dbo.T_Cod_Pollutant.PollutantName']}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </>
              )}

              {emissionType === 3 && (
                <>
                  <Col span={12}>
                    <Form.Item
                      label="物料类型"
                      name="MaterialType"
                      rules={[{ required: true, message: '请选择物料类型!' }]}
                    >
                      <Select placeholder="请选择物料类型">
                        {Pfy_MaterialType.map(item => {
                          return (
                            <Option
                              key={item['dbo.T_Cod_Coder.BaseCode']}
                              value={item['dbo.T_Cod_Coder.BaseCode']}
                            >
                              {item['dbo.T_Cod_Coder.BaseCnName']}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="输送方式"
                      name="ConveyingMode"
                      rules={[{ required: true, message: '请选择输送方式!' }]}
                    >
                      <Select placeholder="请选择输送方式">
                        {Pfy_ConveyingMode.map(item => {
                          return (
                            <Option
                              key={item['dbo.T_Cod_Coder.BaseCode']}
                              value={item['dbo.T_Cod_Coder.BaseCode']}
                            >
                              {item['dbo.T_Cod_Coder.BaseCnName']}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="中转存储名称" name="TransferName">
                      <Input placeholder="请输入中转存储名称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="中转存储容积（m³）" name="TransferVol">
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入中转存储容积（m³）"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="最终存储名称" name="FinalStorageName">
                      <Input placeholder="请输入最终存储名称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="最终存储容积（m³）" name="FinalStorageVol">
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入最终存储容积（m³）"
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              {emissionType === 4 && (
                <>
                  <Col span={12}>
                    <Form.Item
                      label="封闭方式"
                      name="ClosedMode"
                      rules={[{ required: true, message: '请选择封闭方式!' }]}
                    >
                      <Select placeholder="请选择封闭方式">
                        {Pfy_ClosedMode.map(item => {
                          return (
                            <Option
                              key={item['dbo.T_Cod_Coder.BaseCode']}
                              value={item['dbo.T_Cod_Coder.BaseCode']}
                            >
                              {item['dbo.T_Cod_Coder.BaseCnName']}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="存储物料种类"
                      name="StorageMaterialType"
                      rules={[{ required: true, message: '请选择存储物料种类!' }]}
                    >
                      <Select placeholder="请选择存储物料种类">
                        {Pfy_StorageMaterialType.map(item => {
                          return (
                            <Option
                              key={item['dbo.T_Cod_Coder.BaseCode']}
                              value={item['dbo.T_Cod_Coder.BaseCode']}
                            >
                              {item['dbo.T_Cod_Coder.BaseCnName']}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="堆取物料作业方式"
                      name="OperationMode"
                      rules={[{ required: true, message: '请选择堆取物料作业方式!' }]}
                    >
                      <Select placeholder="请选择堆取物料作业方式">
                        {Pfy_OperationMode.map(item => {
                          return (
                            <Option
                              key={item['dbo.T_Cod_Coder.BaseCode']}
                              value={item['dbo.T_Cod_Coder.BaseCode']}
                            >
                              {item['dbo.T_Cod_Coder.BaseCnName']}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="出入口数量" name="EntAndExitNum">
                      <InputNumber style={{ width: '100%' }} placeholder="请输入出入口数量" />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={24}>
                <Form.Item
                  label="主要参数"
                  name="MainParameter"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 19 }}
                >
                  <Input placeholder="请填写主要参数" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="备注"
                  name="Remark"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 19 }}
                >
                  <TextArea row={3} placeholder="请填写备注" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default AddAndEditModal;
