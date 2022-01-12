import React, { Component } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, message, Button, Input, DatePicker, Divider } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import Debounce from 'lodash.debounce';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS, maxWait, GET_SELECT_LIST } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'

const { Option } = Select;
const { TextArea } = Input;
const CONFIG_ID = 'Uncertain';
const SELECT_LISTWhere = [{ "key": 1, "value": "计算" }, { "key": 2, "value": "缺省值" }];
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

@connect(({ loading, autoForm, CO2Emissions }) => ({
  loading: loading.effects['autoForm/getAutoFormData'],
  getConfigLoading: loading.effects['autoForm/getPageConfig'],
  fileList: autoForm.fileList,
  tableInfo: autoForm.tableInfo,
  configIdList: autoForm.configIdList,
  Dictionaries: CO2Emissions.Dictionaries,
  cementTableCO2Sum: CO2Emissions.cementTableCO2Sum,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isModalVisible: false,
      TYPES: [],
      editData: {},
      KEY: undefined,
      FileUuid: undefined,
      FileUuid2: undefined,
      UnitCarbonContentState: 2,
      totalData: {},
      editTotalData: {},
      RateVisible: false,
      UnitVisible: false,
      typeUnit: '',
    };
  }

  componentDidMount() {
    this.getCO2TableSum();
  }

  // 判断是否可添加
  checkIsAdd = () => {
    this.formRef.current.validateFields().then((values) => {
      const { KEY } = this.state;
      let { IndustryCode, Year, FossilType } = values;
      this.props.dispatch({
        type: 'CO2Emissions/calUnceratianData',
        payload: {
          ID: KEY,
          TypeCode: FossilType,
          IndustryCode: IndustryCode,
          Year: Year.format("YYYY-01-01 00:00:00"),
          CalType: 'CalIsRepeat',
        },
        callback: (res) => {
          if (res === true) {
            message.error('相同种类、相同时间添加不能重复，请重新选择种类或时间！', 6);
            return;
          } else {
            this.onHandleSubmit();
          }
        }
      })
    })
  }

  getCO2TableSum = () => {
    this.props.dispatch({
      type: 'CO2Emissions/calUnceratianData',
      payload: {
        CalType: 'SumUncertain',
      },
      callback: (res) => {
        this.setState({
          SumUncertain: res
        })
      }
    })
  }

  getTableDataSource = () => {
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: CONFIG_ID,
      }
    });
  }

  // 种类change，填写缺省值
  onTypesChange = (value, option) => {
    let values = this.formRef.current.getFieldsValue();
    const { FossilType, IndustryCode, Year } = values;
    this.props.dispatch({
      type: 'CO2Emissions/getUnceratianData',
      payload: {
        TypeCode: FossilType,
        Year: moment(Year).format("YYYY-01-01 00:00:00"),
        IndustryCode: IndustryCode,
      },
      callback: (res) => {
        this.formRef.current.setFieldsValue({
          'CO2OxidationRate': res.CO2OxidationRate,
          'Emission': res.Emission,
          'LowFever': res.LowFever,
          'UnitCarbonContent': res.UnitCarbonContent,
          'tCO2': res.tCO2,
        });
      }
    })
  }

  // 根据企业和时间获取种类
  getCO2EnergyType = (formEidt) => {
    let values = this.formRef.current.getFieldsValue();
    const { IndustryCode, Year } = values;
    this.props.dispatch({
      type: 'CO2Emissions/getCO2EnergyType',
      payload: {
        EntCode: 'Uncertain',
        Time: moment(Year).format("YYYY-01-01 00:00:00"),
        IndustryCode: IndustryCode,
      },
    })
    // !formEidt && this.countEmissions();
    !formEidt && this.formRef.current.setFieldsValue({ 'FossilType': undefined })
  }

  // 计算排放量
  countEmissions = () => {
    // 化石燃料燃烧排放量 = 消耗量 × 低位发热量  × (单位热值含碳量  × 碳氧化率 / 100 × 44 ÷ 12)
    let values = this.formRef.current.getFieldsValue();
    let { IndustryCode, Year, FossilType, tCO2 = 0, ActivityData = 0, AppAccuracy = 0, LowFever = 0, Emission = 0 } = values;
    if (IndustryCode && Year) {
      this.props.dispatch({
        type: 'CO2Emissions/calUnceratianData',
        payload: {
          TypeCode: FossilType,
          IndustryCode: IndustryCode,
          Year: Year.format("YYYY-01-01 00:00:00"),
          CalType: 'tCO2Uncertain',
          Data: {
            'CO₂排放量': tCO2 || 0, '活动水平不确定性': ActivityData || 0,
            '排放因子不确定性': Emission || 0, '计量器具精度': AppAccuracy || 0,
            '低位热值不确定性': LowFever || 0
          }
        },
        callback: (res) => {
          console.log('res=', res)
          this.formRef.current.setFieldsValue({ 'ActivityData': res.ActivityData, 'tCO2Uncertain': res.tCO2Uncertain });
        }
      })
    }
  }

  handleCancel = () => {
    this.props.dispatch({
      type: 'CO2Emissions/updateState',
      payload: {
        Dictionaries: {}
      }
    })
    this.setState({
      isModalVisible: false,
      // UnitCarbonContentState: 2,
      // CO2OxidationRateState: 2,
    })
  };

  // 保存
  onHandleSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      const { KEY } = this.state;
      console.log('KEY=', KEY)
      let actionType = KEY ? 'autoForm/saveEdit' : 'autoForm/add';

      this.props.dispatch({
        type: actionType,
        payload: {
          configId: CONFIG_ID,
          FormData: {
            ...values,
            Year: moment(values.Year).format("YYYY-01-01 00:00:00"),
            ID: KEY
          },
          reload: KEY ? true : false,
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
    this.getCO2TableSum();
  }

  // 点击编辑获取数据
  getFormData = (FileUuid) => {
    this.props.dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: CONFIG_ID,
        'dbo.T_Cod_Uncertain.ID': this.state.KEY,
      },
      callback: (res) => {
        // Deviation, GetType
        this.setState({
          // CO2OxidationRateState: res.CO2OxidationRateDataType,
          // UnitCarbonContentState: res.UnitCarbonContentDataType,
          editData: res,
          isModalVisible: true,
        }, () => {
          this.getCO2EnergyType(true)
        })
      }
    })
  }

  render() {
    const { isModalVisible, editData, FileUuid, FileUuid2, typeUnit, totalVisible, editTotalData, KEY, importVisible, SumUncertain } = this.state;
    const { tableInfo, Dictionaries, cementTableCO2Sum } = this.props;
    const TYPES = Dictionaries.two || [];

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
                FileUuid2: undefined,
              })
            }}
            onEdit={(record, key) => {
              const FileUuid = getRowCuid(record, 'dbo.T_Cod_Uncertain.AttachmentID')
              this.setState({
                KEY: key, FileUuid: FileUuid
              }, () => {
                this.getFormData();
              })
            }}
            onDeleteCallback={() => {
              this.getCO2TableSum();
            }}
            footer={() => <div className="">综合不确定性：{SumUncertain}</div>}
          />
        </Card>
        <Modal destroyOnClose width={1000} title={KEY ? "编辑" : "添加"} visible={isModalVisible} onOk={this.checkIsAdd} onCancel={this.handleCancel}>
          <Form
            {...layout}
            style={{ marginTop: 24 }}
            ref={this.formRef}
            initialValues={{
              ...editData,
              Year: moment(editData.Year),
              EntCode: editData['dbo.EntView.EntCode'],
              FossilType: editData['dbo.T_Cod_Uncertain.FossilType'] ? editData['dbo.T_Cod_Uncertain.FossilType'] + '' : undefined,
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name="IndustryCode"
                  label="行业"
                  rules={[{ required: true, message: '请选择企业!' }]}
                >
                  <Select placeholder="请选择企业" onChange={this.getCO2EnergyType}>
                    <Option value={'1'} key={1}>热电</Option>
                    <Option value={'2'} key={2}>水泥</Option>
                    <Option value={'3'} key={3}>钢铁</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Year"
                  label="时间"
                  rules={[{ required: true, message: '请选择时间!' }]}
                >
                  <DatePicker picker="year" style={{ width: '100%' }} onChange={this.getCO2EnergyType} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="FossilType"
                  label="能源品种"
                  rules={[{ required: true, message: '请选择燃料种类!' }]}
                >
                  <Select placeholder="请选择燃料种类" onChange={this.onTypesChange}>
                    {
                      TYPES.map(item => {
                        return <Option value={item.code} key={item.code} data-unit={item.typeUnit}>{item.name}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="AppAccuracy"
                  label='计量器具精度(%)'
                  rules={[{ required: true, message: '请填写计量器具精度!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写计量器具精度" onChange={Debounce(() => this.countEmissions(), maxWait)} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label='CO₂排放量'
                  rules={[{ required: true, message: '请填写CO₂排放量!' }]}
                >
                  <InputNumber bordered={false} disabled style={{ width: '100%' }} placeholder="请填写CO₂排放量" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="LowFever"
                  label='低位热值不确定性(%)'
                  rules={[{ required: true, message: '请填写低位热值不确定性!' }]}
                >
                  <InputNumber bordered={false} disabled style={{ width: '100%' }} placeholder="请填写低位热值不确定性" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ActivityData"
                  label='活动水平不确定性(%)'
                  rules={[{ required: true, message: '请填写活动水平不确定性!' }]}
                >
                  <InputNumber style={{ width: '100%' }} disabled placeholder="请填写活动水平不确定性" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="UnitCarbonContent"
                  label="单位热值含碳量不确定性(%)"
                  rules={[{ required: true, message: '请填写单位热值含碳量不确定性!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写单位热值含碳量不确定性" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CO2OxidationRate"
                  label="燃料碳氧化率不确定性(%)"
                  rules={[{ required: true, message: '请填写燃料碳氧化率不确定性!' }]}
                >
                  <InputNumber style={{ width: '100%' }} disabled placeholder="请填写燃料碳氧化率不确定性" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Emission"
                  label="排放因子不确定性(%)"
                  rules={[{ required: true, message: '请填写排放因子不确定性!' }]}
                >
                  <InputNumber style={{ width: '100%' }} disabled placeholder="请填写排放因子不确定性" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2Uncertain"
                  label="排放量不确定性(%)"
                  rules={[{ required: true, message: '请填写排放量不确定性!' }]}
                >
                  <InputNumber style={{ width: '100%' }} disabled placeholder="请填写排放量不确定性" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 7 }}
                  name="AttachmentID"
                  label="计量器具检测报告或设备照片"
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
