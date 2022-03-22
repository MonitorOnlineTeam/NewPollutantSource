import React, { Component } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Upload, Button, Input, DatePicker, Divider, message } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import Debounce from 'lodash.debounce';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS, maxWait, GET_SELECT_LIST } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'

const industry = INDUSTRYS.steel;
const { Option } = Select;
const { TextArea } = Input;
const CONFIG_ID = 'SteelCarbonSoildDis';
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
      currentTypeData: {},
      typeUnit: '',
    };
  }

  componentDidMount() {
    this.getCO2TableSum();
  }

  // 判断是否可添加
  checkIsAdd = () => {
    this.formRef.current.validateFields().then((values) => {
      let { EntCode, MonitorTime, CarbonSoildDisType } = values;
      const { KEY, rowTime, rowType } = this.state;
      let _MonitorTime = MonitorTime.format("YYYY-MM-01 00:00:00");
      // 编辑时判断时间是否更改
      if (KEY && rowTime === _MonitorTime && rowType == CarbonSoildDisType) {
        this.onHandleSubmit();
        return;
      }
      this.props.dispatch({
        type: 'CO2Emissions/JudgeIsRepeat',
        payload: {
          EntCode: EntCode,
          MonitorTime: _MonitorTime,
          SumType: 's-gt',
          TypeCode: CarbonSoildDisType
        },
        callback: (res) => {
          if (res === true) {
            message.error('相同种类、相同时间添加不能重复，请重新选择种类或时间！', 6);
            return;
          } else {
            this.onHandleSubmit();
          }
        }
      });
    })
  }

  getCO2TableSum = () => {
    this.props.dispatch({
      type: 'CO2Emissions/getCO2TableSum',
      payload: {
        SumType: 's-gt',
      }
    });
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
    const { Dictionaries } = this.props;
    this.setState({
      currentTypeData: Dictionaries.one[value],
      typeUnit: option['data-unit']
    })
    let values = this.formRef.current.getFieldsValue();
    const { EmissionDataType } = values;
    if (EmissionDataType == 2) {
      this.formRef.current.setFieldsValue({
        'Emission': Dictionaries.one[value]["排放因子"],
      });
    }
    this.countEmissions();
  }

  // 根据企业和时间获取种类
  getCO2EnergyType = (formEidt) => {
    let values = this.formRef.current.getFieldsValue();
    const { EntCode, MonitorTime } = values;
    this.props.dispatch({
      type: 'CO2Emissions/getCO2EnergyType',
      payload: {
        IndustryCode: industry,
        EntCode: EntCode,
        SelectType: 'G',
        Time: moment(MonitorTime).format("YYYY-MM-01 00:00:00"),
      },
    })
    !formEidt && this.countEmissions();
  }

  // 计算排放量
  countEmissions = () => {
    let values = this.formRef.current.getFieldsValue();
    let { EntCode, MonitorTime, CarbonSoildDisType, ActivityData = 0, Emission = 0 } = values;
    if (EntCode && MonitorTime) {
      this.props.dispatch({
        type: 'CO2Emissions/countEmissions',
        payload: {
          EntCode: EntCode,
          Time: MonitorTime.format("YYYY-MM-01 00:00:00"),
          IndustryCode: industry,
          Type: CarbonSoildDisType,
          CalType: 'w-2',
          Data: { '活动数据': ActivityData || 0, '排放因子': Emission || 0, }
        },
        callback: (res) => {
          console.log('res=', res)
          this.formRef.current.setFieldsValue({ 'tCO2': res.toFixed(2) });
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
            MonitorTime: moment(values.MonitorTime).format("YYYY-MM-01 00:00:00"),
            CarbonSoildDisCode: KEY
          },
          reload: KEY ? true : false,
        }
      }).then(() => {
        this.setState({
          isModalVisible: false,
        })
        this.getTableList();
        this.getCO2TableSum();
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
  }

  // 点击编辑获取数据
  getFormData = (FileUuid) => {
    this.props.dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: CONFIG_ID,
        'dbo.T_Bas_SteelCarbonSoildDis.CarbonSoildDisCode': this.state.KEY,
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

  onSourceChange = (value, index, name, label) => {
    const { Dictionaries } = this.props;
    let values = this.formRef.current.getFieldsValue();
    const { CarbonSoildDisType, } = values
    if (CarbonSoildDisType) {
      if (value == 2) {
        // 缺省
        this.formRef.current.setFieldsValue({
          [name]: Dictionaries.one[CarbonSoildDisType][label],
        });
        this.countEmissions();
      }
    }
    let key = 'disabled' + index;
    this.setState({ [key]: !this.state[key] })
  }

  render() {
    const { isModalVisible, editData, FileUuid, FileUuid2, typeUnit, totalVisible, editTotalData, KEY, importVisible, currentTypeData } = this.state;
    const { tableInfo, Dictionaries, cementTableCO2Sum } = this.props;
    const { EntView = [] } = this.props.configIdList;
    // const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    // let count = _.sumBy(dataSource, 'dbo.T_Bas_CementFossilFuel.tCO2');

    const TYPES = Dictionaries.two || [];
    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      console.log('values=', values)
      var { EmissionDataType } = values;
    }
    console.log('currentTypeData=', currentTypeData)

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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_SteelCarbonSoildDis.AttachmentID')
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_SteelCarbonSoildDis.DevAttachmentID')
              this.setState({
                KEY: key, FileUuid: FileUuid, FileUuid2: FileUuid2,
                rowTime: record['dbo.T_Bas_SteelCarbonSoildDis.MonitorTime'],
                rowType: record['dbo.T_Bas_SteelCarbonSoildDis.CarbonSoildDisType']
              }, () => {
                this.getFormData();
              })
            }}
            onDeleteCallback={() => {
              this.getCO2TableSum();
            }}
            footer={() => <div className="">排放量合计（tCO₂）：{cementTableCO2Sum}</div>}
          />
        </Card>
        <Modal destroyOnClose width={1000} title="添加" visible={isModalVisible} onOk={this.checkIsAdd} onCancel={this.handleCancel}>
          <Form
            {...layout}
            style={{ marginTop: 24 }}
            ref={this.formRef}
            initialValues={{
              ...editData,
              EmissionDataType: editData.EmissionDataType || 2,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
              CarbonSoildDisType: editData['dbo.T_Bas_SteelCarbonSoildDis.CarbonSoildDisType'] ? editData['dbo.T_Bas_SteelCarbonSoildDis.CarbonSoildDisType'] + '' : undefined,
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name="EntCode"
                  label="企业"
                  rules={[{ required: true, message: '请选择企业!' }]}
                >
                  <Select placeholder="请选择企业" onChange={this.getCO2EnergyType}>
                    {
                      EntView.map(item => {
                        return <Option value={item["dbo.EntView.EntCode"]} key={item["dbo.EntView.EntCode"]}>{item["dbo.EntView.EntName"]}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="MonitorTime"
                  label="时间"
                  rules={[{ required: true, message: '请选择时间!' }]}
                >
                  <DatePicker picker="month" style={{ width: '100%' }} onChange={this.getCO2EnergyType} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CarbonSoildDisType"
                  label="燃料种类"
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
                  name="ActivityData"
                  label={<p>固碳产品的产量(t)</p>}
                  rules={[{ required: true, message: '请填写固碳产品的产量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写固碳产品的产量" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="EmissionDataType"
                  label="排放因子数据来源"
                >
                  <Select placeholder="请选择排放因子数据来源" onChange={(value) => this.onSourceChange(value, 1, 'LowFever', '低位发热量')}>
                    {
                      SELECT_LISTWhere.map(item => {
                        return <Option value={item.key} key={item.key}>{item.value}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Emission"
                  label={<p>排放因子(tCO₂/t)</p>}
                  rules={[{ required: true, message: '请填写排放因子!' }]}
                >
                  <InputNumber disabled={EmissionDataType ? EmissionDataType == 2 : true} style={{ width: '100%' }} placeholder="请填写排放因子"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label={
                    <span>
                      排放量（tCO₂）
                      <QuestionTooltip content="排放量 = 固碳产品的产量 × 排放因子" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写排放量" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 7 }}
                  name="AttachmentID"
                  label="验证材料"
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
