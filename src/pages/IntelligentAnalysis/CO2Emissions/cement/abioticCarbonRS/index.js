import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Button, Popover, DatePicker, message } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS, maxWait, GET_SELECT_LIST, SUMTYPE } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'
import Debounce from 'lodash.debounce';

const { Option } = Select;
const CONFIG_ID = 'CementAlternativeFuels';
const SELECT_LISTWhere = [{ "key": 1, "value": "计算" }, { "key": 2, "value": "缺省值" }];
const industry = INDUSTRYS.cement;
const SumType = SUMTYPE.cement["替代"]
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
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      searchForm: {},
      isModalVisible: false,
      TYPES: [],
      editData: {},
      KEY: undefined,
      FileUuid: undefined,
      UnitCarbonContentState: 2,
      CO2OxidationRateState: 2,
      RateVisible: false,
      UnitVisible: false,
      currentTypeData: {},
      typeUnit: 't',
      editTotalData: {},
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
      debugger
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
    const { searchForm } = this.state;
    let entCode = searchForm[CONFIG_ID] ? (
      searchForm[CONFIG_ID][`dbo__T_Bas_${CONFIG_ID}__EntCode`] ? searchForm[CONFIG_ID][`dbo__T_Bas_${CONFIG_ID}__EntCode`].value : undefined
    )
      : undefined;
    this.props.dispatch({
      type: 'CO2Emissions/getCO2TableSum',
      payload: {
        SumType: SumType,
        EntCode: entCode
      }
    });
  }

  // 根据企业和时间获取种类
  getCO2EnergyType = (formEidt) => {
    let values = this.formRef.current.getFieldsValue();
    const { EntCode, MonitorTime } = values;
    this.props.dispatch({
      type: 'CO2Emissions/getCO2EnergyType',
      payload: {
        IndustryCode: industry,
        SelectType: 'T',
        EntCode: EntCode,
        Time: moment(MonitorTime).format("YYYY-MM-01 00:00:00"),
      },
    })
    !formEidt && this.countEmissions();
  }

  // 种类change，填写缺省值
  onTypesChange = (value, option) => {
    //     化石碳的质量分数: 100
    // 排放因子: 0.07
    // 生物碳的质量分数: 0

    // LowFeverDataType,EmissionDataType,CarbonContentDataType
    const { Dictionaries } = this.props;
    this.setState({
      currentTypeData: Dictionaries.one[value],
      typeUnit: option['data-unit']
    })
    let values = this.formRef.current.getFieldsValue();
    const { LowFeverDataType, EmissionDataType, CarbonContentDataType } = values;
    if (LowFeverDataType == 2) {
      this.formRef.current.setFieldsValue({
        'LowFever': Dictionaries.one[value]["低位发热量"],
      });
    }
    if (EmissionDataType == 2) {
      this.formRef.current.setFieldsValue({
        'Emission': Dictionaries.one[value]["排放因子"],
      });
    }
    if (CarbonContentDataType == 2) {
      this.formRef.current.setFieldsValue({
        'CarbonContent': Dictionaries.one[value]["化石碳的质量分数"],
      });
    }
    this.countEmissions();
  }

  // 计算排放量
  countEmissions = () => {
    // 排放量 = 用量*低位发热量*排放因子*化石碳的质量分数
    // let values = this.formRef.current.getFieldsValue();
    // let { AnnualConsumption = 0, LowFever = 0, Emission = 0, CarbonContent = 0 } = values;
    // let count = AnnualConsumption * LowFever * Emission * (CarbonContent / 100);
    // this.formRef.current.setFieldsValue({ 'tCO2': count.toFixed(2) });

    let values = this.formRef.current.getFieldsValue();
    let { EntCode, MonitorTime, FossilType, AnnualConsumption = 0, LowFever = 0, Emission = 0, CarbonContent = 0 } = values;
    if (EntCode && MonitorTime) {
      this.props.dispatch({
        type: 'CO2Emissions/countEmissions',
        payload: {
          EntCode: EntCode,
          Time: MonitorTime.format("YYYY-MM-01 00:00:00"),
          IndustryCode: industry,
          Type: FossilType,
          CalType: 'w-6',
          Data: { '用量': AnnualConsumption || 0, '低位发热量': LowFever || 0, '排放因子': Emission || 0, '化石碳的质量分数': CarbonContent || 0 }
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
            AlternativeFuelsCode: KEY
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

  // 点击编辑获取数据
  getFormData = (FileUuid) => {
    this.props.dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: CONFIG_ID,
        'dbo.T_Bas_CementAlternativeFuels.AlternativeFuelsCode': this.state.KEY,
      },
      callback: (res) => {
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

  // 查询成功回调
  searchSuccessCallback = (searchForm) => {
    console.log("searchForm=", searchForm)
    this.setState(
      { searchForm },
      () => {
        this.getCO2TableSum();
      })
  }

  render() {
    const { isModalVisible, editData, FileUuid, FileUuid2, currentTypeData, typeUnit, KEY } = this.state;
    const { tableInfo, Dictionaries, cementTableCO2Sum } = this.props;
    const { EntView = [] } = this.props.configIdList;
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementAlternativeFuels.tCO2');

    const TYPES = Dictionaries.two || [];
    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      var { CarbonContentDataType, EmissionDataType, LowFeverDataType, } = values;
    }
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper configId={CONFIG_ID} successCallback={this.searchSuccessCallback} />
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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementAlternativeFuels.AttachmentID')
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CementAlternativeFuels.DevAttachmentID')
              this.setState({
                KEY: key, FileUuid: FileUuid, FileUuid2: FileUuid2,
                rowTime: record['dbo.T_Bas_CementAlternativeFuels.MonitorTime'],
                rowType: record['dbo.T_Bas_CementAlternativeFuels.FossilType']
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
        <Modal destroyOnClose width={1000} title={KEY ? "编辑" : "添加"} visible={isModalVisible} onOk={this.checkIsAdd} onCancel={this.handleCancel}>
          <Form
            style={{ marginTop: 24 }}
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              LowFeverDataType: editData.LowFeverDataType || 2,
              EmissionDataType: editData.EmissionDataType || 2,
              CarbonContentDataType: editData.CarbonContentDataType || 2,
              GetType: editData.GetType,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
              FossilType: editData['dbo.T_Bas_CementAlternativeFuels.FossilType'] ? editData['dbo.T_Bas_CementAlternativeFuels.FossilType'] + '' : undefined,
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name="EntCode"
                  label="企业"
                  rules={[{ required: true, message: '请选择企业!' }]}
                >
                  <Select placeholder="请选择企业" onChange={this.getCO2EnergyType} >
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
                  label="替代燃料或废弃物种类"
                  rules={[{ required: true, message: '请选择替代燃料或废弃物种类!' }]}
                >
                  <Select placeholder="请选择替代燃料或废弃物种类" onChange={this.onTypesChange}>
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
                  label={<p>用量{typeUnit ? <span>({typeUnit})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写用量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写用量"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
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
                  // labelCol={{ span: 5 }}
                  // wrapperCol={{ span: 7 }}
                  name="DevAttachmentID"
                  label="偏差证明材料"
                >
                  <FileUpload fileUUID={FileUuid2} uploadSuccess={(fileUUID) => {
                    this.formRef.current.setFieldsValue({ DevAttachmentID: fileUUID })
                  }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="LowFeverDataType"
                  label="平均低位发热量数据来源"
                  rules={[{ required: true, message: '请选择平均低位发热量数据来源!' }]}
                >
                  <Select
                    onChange={(value) => this.onSourceChange(value, 1, 'LowFever', '低位发热量')}
                    placeholder="请选择平均低位发热量数据来源"
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
                  name="LowFever"
                  label={<p>平均低位发热量{currentTypeData['低位发热量Unit'] ? <span>({currentTypeData['低位发热量Unit']})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写低位发热量!' }]}
                >
                  <InputNumber
                    disabled={LowFeverDataType ? LowFeverDataType == 2 : true}
                    style={{ width: '100%' }} placeholder="请填写低位发热量"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="EmissionDataType"
                  label="排放因子数据来源"
                  rules={[{ required: true, message: '请选择排放因子数据来源!' }]}
                >
                  <Select
                    onChange={(value) => this.onSourceChange(value, 2, 'Emission', '排放因子')}
                    placeholder="请选择排放因子数据来源">
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
                  label={<p>排放因子{currentTypeData['排放因子Unit'] ? <span>({currentTypeData['排放因子Unit']})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写排放因子!' }]}
                >
                  <InputNumber
                    disabled={EmissionDataType ? EmissionDataType == 2 : true}
                    style={{ width: '100%' }} placeholder="请填写排放因子"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CarbonContentDataType"
                  label="非生物质碳的含量数据来源"
                  rules={[{ required: true, message: '请选择非生物质碳的含量数据来源!' }]}
                >
                  <Select
                    onChange={(value) => this.onSourceChange(value, 3, 'CarbonContent', '化石碳的质量分数')}
                    placeholder="请选择非生物质碳的含量数据来源">
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
                  name="CarbonContent"
                  label={<p>非生物质碳的含量{currentTypeData['化石碳的质量分数Unit'] ? <span>({currentTypeData['化石碳的质量分数Unit']})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写非生物质碳的含量!' }]}
                >
                  <InputNumber
                    disabled={CarbonContentDataType ? CarbonContentDataType == 2 : true}
                    style={{ width: '100%' }} placeholder="请填写非生物质碳的含量"
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
                      <QuestionTooltip content="排放量 = 用量 × 平均低位发热量 × 排放因子 × 非生物质碳的含量 " />
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
