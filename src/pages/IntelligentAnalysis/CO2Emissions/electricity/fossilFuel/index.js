import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import {
  Card,
  Modal,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Button,
  Popover,
  DatePicker,
  message,
} from 'antd';
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from '@/components/QuestionTooltip';
import moment from 'moment';
import {
  INDUSTRYS,
  maxWait,
  GET_SELECT_LIST,
  SUMTYPE,
} from '@/pages/IntelligentAnalysis/CO2Emissions/CONST';
import Debounce from 'lodash.debounce';
import ImportFile from '../../components/ImportFile';

const industry = INDUSTRYS.electricity;
const SumType = SUMTYPE.electricity['化石燃料燃烧'];
const { Option } = Select;
const { TextArea } = Input;
const CONFIG_ID = 'CO2FossilFuel';
const SELECT_LISTWhere = [{ key: 1, value: '计算' }, { key: 2, value: '缺省值' }];
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
  unitInfoList: CO2Emissions.unitInfoList,
  cementTableCO2Sum: CO2Emissions.cementTableCO2Sum,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      searchForm: {},
      isModalVisible: false,
      editData: {},
      KEY: undefined,
      FileUuid: undefined,
      UnitCarbonContentState: 2,
      CO2OxidationRateState: 2,
      RateVisible: false,
      disabled1: true,
      disabled2: true,
      disabled3: true,
      currentTypeData: {},
      typeUnit: '',
      editTotalData: {},
    };
  }

  componentDidMount() {
    this.getCO2TableSum();
  }

  // 判断是否可添加
  checkIsAdd = () => {
    this.formRef.current.validateFields().then(values => {
      let { EntCode, MonitorTime, FossilType, CrewCode } = values;
      const { KEY, rowTime, rowType } = this.state;
      let _MonitorTime = MonitorTime.format('YYYY-MM-01 00:00:00');
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
          TypeCode: FossilType,
          CrewCode: CrewCode,
        },
        callback: res => {
          if (res === true) {
            message.error('相同种类、相同时间添加不能重复，请重新选择种类或时间！');
            return;
          } else {
            this.onHandleSubmit();
          }
        },
      });
    });
  };

  getCO2TableSum = () => {
    const { searchForm } = this.state;
    let entCode = searchForm[CONFIG_ID]
      ? searchForm[CONFIG_ID][`dbo__T_Bas_${CONFIG_ID}__EntCode`]
        ? searchForm[CONFIG_ID][`dbo__T_Bas_${CONFIG_ID}__EntCode`].value
        : undefined
      : undefined;
    this.props.dispatch({
      type: 'CO2Emissions/getCO2TableSum',
      payload: {
        SumType: SumType,
        EntCode: entCode,
      },
    });
  };

  // 获取机组信息
  getUnitList = entCode => {
    this.props.dispatch({
      type: 'CO2Emissions/getUnitList',
      payload: {
        EntCode: entCode,
      },
    });
  };

  // 根据企业和时间获取种类
  getCO2EnergyType = formEidt => {
    let values = this.formRef.current.getFieldsValue();
    const { EntCode, MonitorTime } = values;
    this.props.dispatch({
      type: 'CO2Emissions/getCO2EnergyType',
      payload: {
        IndustryCode: industry,
        EntCode: EntCode,
        Time: moment(MonitorTime).format('YYYY-MM-01 00:00:00'),
      },
    });
    this.getUnitList(EntCode);
    !formEidt && this.countEmissions();
  };

  handleCancel = () => {
    this.props.dispatch({
      type: 'CO2Emissions/updateState',
      payload: {
        Dictionaries: {},
      },
    });
    this.setState({
      isModalVisible: false,
      UnitCarbonContentState: 2,
      CO2OxidationRateState: 2,
    });
  };

  // 种类change，填写缺省值
  onTypesChange = (value, option) => {
    const { Dictionaries } = this.props;
    this.setState({
      currentTypeData: Dictionaries.one[value],
      typeUnit: option['data-unit'],
    });
    let values = this.formRef.current.getFieldsValue();
    const { LowFeverDataType, UnitCarbonContentDataType, CO2OxidationRateDataType } = values;
    if (LowFeverDataType == 2) {
      this.formRef.current.setFieldsValue({
        LowFever: Dictionaries.one[value]['低位发热量'],
      });
    }
    if (UnitCarbonContentDataType == 2) {
      this.formRef.current.setFieldsValue({
        UnitCarbonContent: Dictionaries.one[value]['含碳量'],
      });
    }
    if (CO2OxidationRateDataType == 2) {
      this.formRef.current.setFieldsValue({
        CO2OxidationRate: Dictionaries.one[value]['氧化率'],
      });
    }
    this.countEmissions();
  };

  compute = (payloadParams, callback) => {
    let values = this.formRef.current.getFieldsValue();
    let { EntCode, MonitorTime, FossilType } = values;
    if (EntCode && MonitorTime) {
      this.props.dispatch({
        type: 'CO2Emissions/countEmissions',
        payload: {
          EntCode: EntCode,
          Time: MonitorTime.format('YYYY-MM-01 00:00:00'),
          IndustryCode: industry,
          Type: FossilType,
          ...payloadParams,
        },
        callback: res => {
          console.log('res=', res);
          callback(res);
        },
      });
    }
  };

  // 计算排放量
  countEmissions = () => {
    // 化石燃料燃烧排放量 = 消耗量 × 低位发热量  × (单位热值含碳量  × 碳氧化率 / 100 × 44 ÷ 12)
    let values = this.formRef.current.getFieldsValue();
    let {
      EntCode,
      MonitorTime,
      FossilType,
      AnnualConsumption = 0,
      CO2OxidationRate = 0,
      LowFever = 0,
      UnitCarbonContent = 0,
    } = values;
    this.compute(
      {
        CalType: 'p-1',
        Data: {
          消耗量: AnnualConsumption || 0,
          低位发热量: LowFever || 0,
          含碳量: UnitCarbonContent || 0,
          碳氧化率: CO2OxidationRate || 0,
        },
      },
      res => {
        this.formRef.current.setFieldsValue({ tCO2: res.toFixed(2) });
      },
    );
  };

  // 计算单位热值含碳量
  countHTL = () => {
    // 计算单位热值含碳量 = 低位发热量  × 元素含碳量 / 100
    let values = this.formRef.current.getFieldsValue();
    let { ElementalCarbonContent = 0, LowFever = 0 } = values;
    this.compute(
      {
        CalType: 'p-2',
        Data: { 低位发热量: LowFever || 0, 元素含碳量: ElementalCarbonContent || 0 },
      },
      res => {
        this.formRef.current.setFieldsValue({ UnitCarbonContent: res.toFixed(2) });
        this.countEmissions();
      },
    );
  };

  // 计算碳氧化率
  countTYHL = () => {
    // 碳氧化率(%) = 1 - ((全年炉渣产量 × 炉渣平均含碳量 + 全年飞灰产量 × 飞灰平均含碳量 ÷ 除尘效率) × 10⁶) ÷ (消耗量 × 低位发热量 × 单位热值含碳量)
    let values = this.formRef.current.getFieldsValue();
    let {
      SlagYield = 0,
      SlagAvgCO2 = 0,
      FlyAshYield = 0,
      FlyAshAvgCO2 = 0,
      RemoveDustRate = 0,
      AnnualConsumption = 0,
      LowFever = 0,
      UnitCarbonContent = 0,
    } = values;
    this.compute(
      {
        CalType: 'p-3',
        Data: {
          全年炉渣产量: SlagYield || 0,
          炉渣平均含碳量: SlagAvgCO2 || 0,
          全年飞灰产量: FlyAshYield || 0,
          飞灰平均含碳量: FlyAshAvgCO2 || 0,
          除尘效率: RemoveDustRate || 0,
          消耗量: AnnualConsumption || 0,
          低位发热量: LowFever || 0,
          含碳量: UnitCarbonContent || 0,
        },
      },
      res => {
        this.formRef.current.setFieldsValue({ CO2OxidationRate: res.toFixed(2) });
        this.countEmissions();
      },
    );
    // this.countEmissions();
  };

  onSourceChange = (value, index, name, label, stateKey) => {
    const { Dictionaries } = this.props;
    let values = this.formRef.current.getFieldsValue();
    const { FossilType } = values;
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
    this.setState({ [key]: !this.state[key], [stateKey]: value });
  };

  // 保存
  onHandleSubmit = () => {
    this.formRef.current.validateFields().then(values => {
      const { KEY } = this.state;
      console.log('KEY=', KEY);
      let actionType = KEY ? 'autoForm/saveEdit' : 'autoForm/add';

      this.props
        .dispatch({
          type: actionType,
          payload: {
            configId: CONFIG_ID,
            FormData: {
              ...values,
              MonitorTime: moment(values.MonitorTime).format('YYYY-MM-01 00:00'),
              FossilFuelCode: KEY,
            },
            reload: KEY ? true : false,
          },
        })
        .then(() => {
          this.setState({
            isModalVisible: false,
          });
          this.getTableList();
        });
    });
  };

  getTableList = () => {
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: CONFIG_ID,
      },
    });
    this.getCO2TableSum();
  };

  // 点击编辑获取数据
  getFormData = FileUuid => {
    this.props.dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: CONFIG_ID,
        'dbo.T_Bas_CO2FossilFuel.FossilFuelCode': this.state.KEY,
      },
      callback: res => {
        console.log('res=', res);
        this.setState(
          {
            CO2OxidationRateState: res.CO2OxidationRateDataType,
            UnitCarbonContentState: res.UnitCarbonContentDataType,
            editData: res,
            isModalVisible: true,
          },
          () => {
            this.getCO2EnergyType(true);
          },
        );
      },
    });
  };

  // 重置机组
  resetUnitInfoList = () => {
    this.props.dispatch({
      type: 'CO2Emissions/updateState',
      payload: {
        unitInfoList: [],
      },
    });
  };

  // 查询成功回调
  searchSuccessCallback = searchForm => {
    console.log('searchForm=', searchForm);
    this.setState({ searchForm }, () => {
      this.getCO2TableSum();
    });
  };

  getFloat = function(num, n) {
    n = n ? parseInt(n) : 0;
    if (n <= 0) {
      return Math.round(num);
    }
    num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
    num = Number(num).toFixed(n); //补足位数
    return num;
  };

  render() {
    const {
      isModalVisible,
      editData,
      FileUuid,
      FileUuid2,
      disabled1,
      disabled2,
      disabled3,
      currentTypeData,
      typeUnit,
      totalVisible,
      KEY,
      editTotalData,
    } = this.state;
    const { tableInfo, Dictionaries, cementTableCO2Sum, unitInfoList } = this.props;

    const { EntView = [] } = this.props.configIdList;
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CO2FossilFuel.tCO2');

    const TYPES = Dictionaries.two || [];
    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      console.log('values=', values);
      var { LowFeverDataType, UnitCarbonContentDataType, CO2OxidationRateDataType } = values;
    }
    console.log('editTotalData=', editTotalData);
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper
            configId={CONFIG_ID}
            successCallback={searchForm => this.searchSuccessCallback(searchForm)}
          />
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
              });
              this.resetUnitInfoList();
            }}
            onEdit={(record, key) => {
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CO2FossilFuel.AttachmentID');
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CO2FossilFuel.DevAttachmentID');
              this.setState(
                {
                  KEY: key,
                  FileUuid: FileUuid,
                  FileUuid2: FileUuid2,
                  rowTime: record['dbo.T_Bas_CO2FossilFuel.MonitorTime'],
                  rowType: record['dbo.T_Bas_CO2FossilFuel.FossilType'],
                },
                () => {
                  this.getFormData();
                },
              );
            }}
            onDeleteCallback={() => {
              this.getCO2TableSum();
            }}
            appendHandleButtons={() => {
              return (
                <ImportFile
                  onSuccess={() => {
                    this.getTableList();
                  }}
                  industry={industry}
                />
              );
            }}
            footer={() => <div className="">排放量合计（tCO₂）：{cementTableCO2Sum}</div>}
          />
        </Card>
        <Modal
          destroyOnClose
          width={1000}
          title={KEY ? '编辑' : '添加'}
          visible={isModalVisible}
          onOk={this.checkIsAdd}
          onCancel={this.handleCancel}
        >
          <Form
            style={{ marginTop: 24 }}
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              LowFeverDataType: editData.LowFeverDataType || 2,
              UnitCarbonContentDataType: editData.UnitCarbonContentDataType || 2,
              CO2OxidationRateDataType: editData.CO2OxidationRateDataType || 2,
              MonitorTime: moment(editData.MonitorTime),
              GetType: editData.GetType,
              EntCode: editData['dbo.EntView.EntCode'],
              FossilType: editData['dbo.T_Bas_CO2FossilFuel.FossilType']
                ? editData['dbo.T_Bas_CO2FossilFuel.FossilType'] + ''
                : undefined,
              CrewCode: editData['dbo.T_Bas_CO2FossilFuel.CrewCode'],
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name="EntCode"
                  label="企业"
                  rules={[{ required: true, message: '请选择企业!' }]}
                >
                  <Select
                    placeholder="请选择企业"
                    onChange={this.getCO2EnergyType}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {EntView.map(item => {
                      return (
                        <Option
                          value={item['dbo.EntView.EntCode']}
                          key={item['dbo.EntView.EntCode']}
                        >
                          {item['dbo.EntView.EntName']}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="MonitorTime"
                  label="时间"
                  rules={[{ required: true, message: '请选择时间!' }]}
                >
                  <DatePicker
                    picker="month"
                    style={{ width: '100%' }}
                    onChange={this.getCO2EnergyType}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="FossilType"
                  label="燃料种类"
                  rules={[{ required: true, message: '请选择燃料种类!' }]}
                >
                  <Select placeholder="请选择燃料种类" onChange={this.onTypesChange}>
                    {TYPES.map(item => {
                      return (
                        <Option value={item.code} key={item.code} data-unit={item.typeUnit}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CrewCode"
                  label="机组"
                  rules={[{ required: true, message: '请选择机组!' }]}
                >
                  <Select placeholder="请选择机组">
                    {unitInfoList.map(item => {
                      return (
                        <Option value={item.CrewCode} key={item.CrewCode}>
                          {item.CrewName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="AnnualConsumption"
                  label={<p>消耗量{typeUnit ? <span>({typeUnit})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写消耗量!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="消耗量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="DevAttachmentID" label="证明材料">
                  <FileUpload
                    fileUUID={FileUuid2}
                    uploadSuccess={fileUUID => {
                      this.formRef.current.setFieldsValue({ DevAttachmentID: fileUUID });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="LowFeverDataType" label="低位发热量数据来源">
                  <Select
                    onChange={value =>
                      this.onSourceChange(value, 1, 'LowFever', '低位发热量', 'LowFeverState')
                    }
                    placeholder="请选择低位发热量数据来源"
                  >
                    {SELECT_LISTWhere.map(item => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.value}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="LowFever"
                  label={
                    <p>
                      低位发热量
                      {currentTypeData['低位发热量Unit'] ? (
                        <span>({currentTypeData['低位发热量Unit']})</span>
                      ) : (
                        ''
                      )}
                    </p>
                  }
                  rules={[{ required: true, message: '请填写低位发热量!' }]}
                >
                  <InputNumber
                    disabled={LowFeverDataType ? LowFeverDataType == 2 : true}
                    style={{ width: '100%' }}
                    placeholder="请填写低位发热量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="UnitCarbonContentDataType" label="单位热值含碳量数据来源">
                  <Select
                    placeholder="请选择单位热值含碳量数据来源"
                    onChange={value =>
                      this.onSourceChange(
                        value,
                        2,
                        'UnitCarbonContent',
                        '含碳量',
                        'UnitCarbonContentState',
                      )
                    }
                  >
                    {SELECT_LISTWhere.map(item => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.value}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="UnitCarbonContent"
                  label={
                    <p>
                      单位热值含碳量
                      {currentTypeData['含碳量Unit'] ? (
                        <span>({currentTypeData['含碳量Unit']})</span>
                      ) : (
                        ''
                      )}
                      <QuestionTooltip content="单位热值含碳量 = 低位发热量 × 元素含碳量" />
                    </p>
                  }
                  rules={[{ required: true, message: '请填写单位热值含碳量!' }]}
                >
                  <InputNumber
                    disabled={UnitCarbonContentDataType ? UnitCarbonContentDataType == 2 : true}
                    stringMode
                    style={{
                      width: this.state.UnitCarbonContentState == 2 ? '100%' : 'calc(100% - 64px)',
                    }}
                    placeholder="请填写单位热值含碳量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
                {this.state.UnitCarbonContentState == 2 ? (
                  ''
                ) : (
                  <Popover
                    content={
                      <>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name="ElementalCarbonContent"
                              label="元素含碳量(%)"
                              // rules={[{ required: true, message: '请填写全年炉渣产量!' }]}
                            >
                              <InputNumber
                                style={{ width: '100%' }}
                                placeholder="请填写元素含碳量"
                                onChange={Debounce(() => this.countHTL(), maxWait)}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    }
                    trigger="click"
                    title="单位热值含碳量计算"
                  >
                    <Button style={{ position: 'absolute', top: 0, right: 0 }} type="primary">
                      计算
                    </Button>
                  </Popover>
                )}
              </Col>
              <Col span={12}>
                <Form.Item name="CO2OxidationRateDataType" label="碳氧化率数据来源">
                  <Select
                    placeholder="请选择碳氧化率数据来源"
                    onChange={value =>
                      this.onSourceChange(
                        value,
                        3,
                        'CO2OxidationRate',
                        '氧化率',
                        'CO2OxidationRateState',
                      )
                    }
                  >
                    {SELECT_LISTWhere.map(item => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.value}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CO2OxidationRate"
                  label={
                    <span>
                      碳氧化率(%)
                      <QuestionTooltip content="碳氧化率(%) = 1 - ((全年炉渣产量 × 炉渣平均含碳量 + 全年飞灰产量 × 飞灰平均含碳量 ÷ 除尘效率) × 10⁶) ÷ (消耗量 × 低位发热量 × 单位热值含碳量)" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写碳氧化率!' }]}
                >
                  <InputNumber
                    disabled={CO2OxidationRateDataType ? CO2OxidationRateDataType == 2 : true}
                    style={{
                      width: this.state.CO2OxidationRateState == 2 ? '100%' : 'calc(100% - 64px)',
                    }}
                    placeholder="请填写碳氧化率"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
                {this.state.CO2OxidationRateState == 2 ? (
                  ''
                ) : (
                  <Popover
                    content={
                      <>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name="SlagYield"
                              label="全年炉渣产量(t)"
                              // rules={[{ required: true, message: '请填写全年炉渣产量!' }]}
                            >
                              <InputNumber
                                style={{ width: '60%' }}
                                placeholder="请填写全年炉渣产量"
                                onChange={Debounce(() => this.countTYHL(), maxWait)}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="SlagAvgCO2"
                              label="炉渣平均含碳量(%)"
                              // rules={[{ required: true, message: '请填写炉渣平均含碳量!' }]}
                            >
                              <InputNumber
                                style={{ width: '60%' }}
                                placeholder="请填写炉渣平均含碳量"
                                onChange={Debounce(() => this.countTYHL(), maxWait)}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name="FlyAshYield"
                              label="全年飞灰产量(t)"
                              // rules={[{ required: true, message: '请填写全年飞灰产量!' }]}
                            >
                              <InputNumber
                                style={{ width: '60%' }}
                                placeholder="请填写全年飞灰产量"
                                onChange={Debounce(() => this.countTYHL(), maxWait)}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              name="FlyAshAvgCO2"
                              label="飞灰平均含碳量(%)"
                              // rules={[{ required: true, message: '请填写飞灰平均含碳量!' }]}
                            >
                              <InputNumber
                                style={{ width: '60%' }}
                                placeholder="请填写飞灰平均含碳量"
                                onChange={Debounce(() => this.countTYHL(), maxWait)}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name="RemoveDustRate"
                              label="除尘系统平均除尘效率(%)"
                              // rules={[{ required: true, message: '请填写除尘系统平均除尘效率!' }]}
                            >
                              <InputNumber
                                style={{ width: '60%' }}
                                placeholder="请填写除尘系统平均除尘效率"
                                onChange={Debounce(() => this.countTYHL(), maxWait)}
                              />
                            </Form.Item>
                          </Col>
                          {/* <Col span={16}>
                            <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={this.Ratehide} />
                            </Col> */}
                        </Row>
                      </>
                    }
                    trigger="click"
                    // visible={this.state.RateVisible}
                    // onVisibleChange={this.RatehandleVisibleChange}
                    title="碳氧化率计算"
                  >
                    <Button style={{ position: 'absolute', top: 0, right: 0 }} type="primary">
                      计算
                    </Button>
                  </Popover>
                )}
              </Col>
              <Col span={12}>
                <Form.Item
                  name="GetType"
                  label="获取方式"
                  rules={[{ required: true, message: '请选择获取方式!' }]}
                >
                  <Select placeholder="请选择获取方式">
                    {GET_SELECT_LIST.map(item => {
                      return (
                        <Option value={item.key} key={item.key}>
                          {item.value}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label={
                    <span>
                      排放量（tCO₂）
                      <QuestionTooltip content="化石燃料燃烧排放量 = 消耗量 × 低位发热量  × (单位热值含碳量  × 碳氧化率  × 44 ÷ 12) " />
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
                  <FileUpload
                    fileUUID={FileUuid}
                    uploadSuccess={fileUUID => {
                      this.formRef.current.setFieldsValue({ AttachmentID: fileUUID });
                    }}
                  />
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
