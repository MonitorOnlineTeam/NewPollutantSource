import React, { Component } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Upload, Button, Input, DatePicker, message } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import Debounce from 'lodash.debounce';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS, maxWait, GET_SELECT_LIST, SUMTYPE, SELECT_TYPE } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'
import ConsumptionModal from '@/pages/IntelligentAnalysis/CO2Emissions/components/ConsumptionModal';
import ImportData from '@/pages/IntelligentAnalysis/CO2Emissions/components/ImportData'

const industry = INDUSTRYS.cement;
const SumType = SUMTYPE.cement["化石燃料燃烧"]
const { Option } = Select;
const { TextArea } = Input;
const CONFIG_ID = 'CementFossilFuel';
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
      disabled1: true,
      disabled2: true,
      disabled3: true,
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
      let { EntCode, MonitorTime, FossilType } = values;
      const { KEY, rowTime, rowType } = this.state;
      let _MonitorTime = MonitorTime.format("YYYY-MM-01 00:00:00");
      // 编辑时判断时间是否更改
      if (KEY && rowTime === _MonitorTime && rowType == FossilType) {
        this.onHandleSubmit();
        return;
      }
      this.props.dispatch({
        type: 'CO2Emissions/JudgeIsRepeat',
        payload: {
          EntCode: EntCode,
          MonitorTime: _MonitorTime,
          SumType: SumType,
          TypeCode: FossilType
        },
        callback: (res) => {
          if (res === true) {
            message.error('相同种类、相同时间添加不能重复，请重新选择种类或时间！');
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
        SumType: SumType,
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
    console.log('option=', option)
    const { Dictionaries } = this.props;
    this.setState({
      currentTypeData: Dictionaries.one[value],
      typeUnit: option['data-unit']
    })
    let values = this.formRef.current.getFieldsValue();
    const { LowFeverDataType, UnitCarbonContentDataType, CO2OxidationRateDataType } = values;
    if (LowFeverDataType == 2) {
      this.formRef.current.setFieldsValue({
        'LowFever': Dictionaries.one[value]["低位发热量"],
      });
    }
    if (UnitCarbonContentDataType == 2) {
      this.formRef.current.setFieldsValue({
        'UnitCarbonContent': Dictionaries.one[value]["含碳量"],
      });
    }
    if (CO2OxidationRateDataType == 2) {
      this.formRef.current.setFieldsValue({
        'CO2OxidationRate': Dictionaries.one[value]["氧化率"],
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
        Time: moment(MonitorTime).format("YYYY-MM-01 00:00:00"),
      },
    })
    !formEidt && this.countEmissions();
  }

  // 计算排放量
  countEmissions = () => {
    // 化石燃料燃烧排放量 = 消耗量 × 低位发热量  × (单位热值含碳量  × 碳氧化率 / 100 × 44 ÷ 12)
    let values = this.formRef.current.getFieldsValue();
    let { EntCode, MonitorTime, FossilType, AnnualConsumption = 0, CO2OxidationRate = 0, LowFever = 0, UnitCarbonContent = 0 } = values;
    if (EntCode && MonitorTime) {
      this.props.dispatch({
        type: 'CO2Emissions/countEmissions',
        payload: {
          EntCode: EntCode,
          Time: MonitorTime.format("YYYY-MM-01 00:00:00"),
          IndustryCode: industry,
          Type: FossilType,
          CalType: 'w-1',
          Data: { '消耗量': AnnualConsumption || 0, '低位发热量': LowFever || 0, '含碳量': UnitCarbonContent || 0, '碳氧化率': CO2OxidationRate || 0 }
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
            FossilFuelCode: KEY
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
        'dbo.T_Bas_CementFossilFuel.FossilFuelCode': this.state.KEY,
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
    const { FossilType, } = values
    if (FossilType) {
      if (value == 2) {
        // 缺省
        this.formRef.current.setFieldsValue({
          [name]: Dictionaries.one[FossilType][label],
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
      var { Deviation, LowFeverDataType, UnitCarbonContentDataType, CO2OxidationRateDataType } = values;
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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementFossilFuel.AttachmentID')
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CementFossilFuel.DevAttachmentID')
              this.setState({ KEY: key, FileUuid: FileUuid, FileUuid2: FileUuid2, 
                rowTime: record['dbo.T_Bas_CementFossilFuel.MonitorTime'],
                rowType: record['dbo.T_Bas_CementFossilFuel.FossilType']
              }, () => {
                this.getFormData();
              })
            }}
            onDeleteCallback={() => {
              this.getCO2TableSum();
            }}
            appendHandleButtons={(keys, rows) => {
              return <ImportData onSuccess={() => { this.getTableDataSource() }} />;
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
              LowFeverDataType: editData.LowFeverDataType || 2,
              UnitCarbonContentDataType: editData.UnitCarbonContentDataType || 2,
              CO2OxidationRateDataType: editData.CO2OxidationRateDataType || 2,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
              FossilType: editData['dbo.T_Bas_CementFossilFuel.FossilType'] ? editData['dbo.T_Bas_CementFossilFuel.FossilType'] + '' : undefined,
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
                  name="FossilType"
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
                  name="AnnualConsumption"
                  label={<p>消耗量{typeUnit ? <span>({typeUnit})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写消耗量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写消耗量" onChange={Debounce(() => this.countEmissions(), maxWait)} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="GetType"
                  label="获取方式"
                  rules={[{ required: true, message: '请选择获取方式!' }]}
                >
                  <Select placeholder="请选择获取方式">
                    {
                      GET_SELECT_LIST.map(item => {
                        return <Option value={item.key} key={item.key}>{item.value}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="DevAttachmentID"
                  label="证明材料"
                >
                  <FileUpload fileUUID={FileUuid2} uploadSuccess={(fileUUID) => {
                    this.formRef.current.setFieldsValue({ DevAttachmentID: fileUUID })
                  }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="LowFeverDataType"
                  label="低位发热量数据来源"
                >
                  <Select placeholder="请选择低位发热量数据来源" onChange={(value) => this.onSourceChange(value, 1, 'LowFever', '低位发热量')}>
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
                  name="LowFever"
                  label={<p>低位发热量{currentTypeData['低位发热量Unit'] ? <span>({currentTypeData['低位发热量Unit']})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写低位发热量!' }]}
                >
                  <InputNumber disabled={LowFeverDataType ? LowFeverDataType == 2 : true} style={{ width: '100%' }} placeholder="请填写低位发热量"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="UnitCarbonContentDataType"
                  label="单位热值含碳量数据来源"
                >
                  <Select placeholder="请选择单位热值含碳量数据来源"
                    onChange={(value) => this.onSourceChange(value, 2, 'UnitCarbonContent', '含碳量')}
                  >
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
                  name="UnitCarbonContent"
                  label={<p>单位热值含碳量{currentTypeData['含碳量Unit'] ? <span>({currentTypeData['含碳量Unit']})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写单位热值含碳量!' }]}
                >
                  <InputNumber disabled={UnitCarbonContentDataType ? UnitCarbonContentDataType == 2 : true} style={{ width: '100%' }} placeholder="请填写单位热值含碳量"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CO2OxidationRateDataType"
                  label="碳氧化率数据来源"
                >
                  <Select placeholder="请选择碳氧化率数据来源"
                    onChange={(value) => this.onSourceChange(value, 3, 'CO2OxidationRate', '氧化率')}
                  >
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
                  name="CO2OxidationRate"
                  label="碳氧化率(%)"
                  rules={[{ required: true, message: '请填写碳氧化率!' }]}
                >
                  <InputNumber disabled={CO2OxidationRateDataType ? CO2OxidationRateDataType == 2 : true} style={{ width: '100%' }} placeholder="请填写碳氧化率"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label={
                    <span>
                      排放量（tCO₂）
                      <QuestionTooltip content="排放量 = 消耗量 × 低位发热量 × (单位热值含碳量 × 碳氧化率 × 44 ÷ 12) " />
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
        <ConsumptionModal
          data={KEY ? editTotalData : {}}
          unit={typeUnit}
          visible={totalVisible}
          onCancel={() => this.setState({ totalVisible: false })}
          onOk={(data) => {
            console.log('data=', data)
            this.formRef.current.setFieldsValue({ 'AnnualConsumption': data.total, 'Deviation': data.deviation, GetType: data.GetType })
            this.setState({ totalVisible: false, totalData: data })
            this.countEmissions();
          }} />
      </BreadcrumbWrapper>
    );
  }
}

export default index;
