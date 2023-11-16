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
  InputNumber,
  Select,
  DatePicker,
  Input,
  Button,
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
const SumType = SUMTYPE.electricity['脱硫过程'];
const { TextArea } = Input;
const { Option } = Select;
const CONFIG_ID = 'Desulphurization';
const SELECT_LIST = [{ key: 1, value: '脱硫剂' }];
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
  unitInfoList: CO2Emissions.unitInfoList,
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
      currentTypeData: {},
      editTotalData: {},
    };
  }

  componentDidMount() {
    this.getCO2TableSum();
  }

  // 判断是否可添加
  checkIsAdd = () => {
    this.formRef.current.validateFields().then(values => {
      let { EntCode, MonitorTime, DesulfurizerType, CrewCode } = values;
      const { KEY, rowTime, rowType } = this.state;
      let _MonitorTime = MonitorTime.format('YYYY-MM-01 00:00:00');
      // 编辑时判断时间是否更改
      if (KEY && rowTime === _MonitorTime && rowType == DesulfurizerType) {
        this.onHandleSubmit();
        return;
      }
      this.props.dispatch({
        type: 'CO2Emissions/JudgeIsRepeat',
        payload: {
          EntCode: EntCode,
          MonitorTime: _MonitorTime,
          SumType: SumType,
          TypeCode: DesulfurizerType,
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
      ? searchForm[CONFIG_ID].dbo__T_Bas_CO2Desulphurization__EntCode
        ? searchForm[CONFIG_ID].dbo__T_Bas_CO2Desulphurization__EntCode.value
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
        SelectType: 'D',
        Time: moment(MonitorTime).format('YYYY-MM-01 00:00:00'),
      },
    });
    this.getUnitList(EntCode);
    // !formEidt && this.countEmissions();
  };

  // 计算排放量
  countEmissions = () => {
    // 排放量 = 脱硫剂中碳酸盐消耗量 × 碳酸盐排放因子
    let values = this.formRef.current.getFieldsValue();
    let {
      EntCode,
      MonitorTime,
      DesulfurizerType,
      CarbonateConsumption = 0,
      CarbonateEmission = 0,
    } = values;
    if (EntCode && MonitorTime) {
      this.props.dispatch({
        type: 'CO2Emissions/countEmissions',
        payload: {
          EntCode: EntCode,
          Time: MonitorTime.format('YYYY-MM-01 00:00:00'),
          IndustryCode: industry,
          Type: DesulfurizerType,
          CalType: 'p-4',
          Data: {
            脱硫剂中碳酸盐消耗量: CarbonateConsumption || 0,
            碳酸盐排放因子: CarbonateEmission || 0,
          },
        },
        callback: res => {
          console.log('res=', res);
          this.formRef.current.setFieldsValue({ tCO2: res.toFixed(2) });
        },
      });
    }
  };

  // 种类change，填写缺省值
  onTypesChange = (value, option) => {
    console.log('option=', option);
    const { Dictionaries } = this.props;
    this.setState({
      currentTypeData: Dictionaries.one[value],
      typeUnit: option['data-unit'],
    });
    this.formRef.current.setFieldsValue({
      CarbonateEmission: Dictionaries.one[value]['排放因子'],
    });
    this.countEmissions();
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
    });
  };

  // 保存
  onHandleSubmit = () => {
    this.formRef.current.validateFields().then(values => {
      const { totalData, KEY } = this.state;
      console.log('KEY=', KEY);
      let actionType = KEY ? 'autoForm/saveEdit' : 'autoForm/add';

      this.props
        .dispatch({
          type: actionType,
          payload: {
            configId: CONFIG_ID,
            FormData: {
              ...totalData,
              ...values,
              MonitorTime: moment(values.MonitorTime).format('YYYY-MM-01 00:00'),
              DesulphurizationCode: KEY,
            },
            reload: KEY ? true : undefined,
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
        'dbo.T_Bas_CO2Desulphurization.DesulphurizationCode': this.state.KEY,
      },
      callback: res => {
        this.setState(
          {
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

  render() {
    const {
      isModalVisible,
      editData,
      FileUuid,
      FileUuid2,
      currentTypeData,
      totalVisible,
      typeUnit,
      editTotalData,
      KEY,
    } = this.state;
    const { tableInfo, Dictionaries, cementTableCO2Sum, unitInfoList } = this.props;
    const { EntView = [] } = this.props.configIdList;

    const TYPES = Dictionaries.two || [];
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CO2Desulphurization.tCO2');

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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CO2Desulphurization.AttachmentID');
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CO2Desulphurization.DevAttachmentID');
              this.setState(
                {
                  KEY: key,
                  FileUuid: FileUuid,
                  FileUuid2: FileUuid2,
                  rowTime: record['dbo.T_Bas_CO2Desulphurization.MonitorTime'],
                  rowType: record['dbo.T_Bas_CO2Desulphurization.DesulfurizerType'],
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
          width={900}
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
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
              GetType: editData.GetType,
              CrewCode: editData['dbo.T_Bas_CO2Desulphurization.CrewCode'],
              DesulfurizerType: editData['dbo.T_Bas_CO2Desulphurization.DesulfurizerType'],
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
                  name="DesulfurizerType"
                  label="脱硫剂类型"
                  rules={[{ required: true, message: '请选择脱硫剂类型!' }]}
                >
                  <Select placeholder="请选择脱硫剂类型" onChange={this.onTypesChange}>
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
                  name="CarbonateConsumption"
                  label={<p>脱硫剂中碳酸盐消耗量{typeUnit ? <span>({typeUnit})</span> : ''}</p>}
                  rules={[{ required: true, message: '请填写脱硫剂中碳酸盐消耗量!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="消耗量"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  // labelCol={{ span: 5 }}
                  // wrapperCol={{ span: 7 }}
                  name="DevAttachmentID"
                  label="证明材料"
                >
                  <FileUpload
                    fileUUID={FileUuid2}
                    uploadSuccess={fileUUID => {
                      this.formRef.current.setFieldsValue({ DevAttachmentID: fileUUID });
                    }}
                  />
                </Form.Item>
              </Col>
              {/* <Col span={12}>
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
              </Col> */}
              <Col span={12}>
                <Form.Item
                  name="CarbonateEmission"
                  // label={<p>碳酸盐排放因子{currentTypeData['排放因子Unit'] ? <span>({currentTypeData['低位发热量Unit']})</span> : ''}</p>}
                  label="碳酸盐排放因子（tCO₂/t）"
                  rules={[{ required: true, message: '请填写碳酸盐排放因子!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="请填写碳酸盐排放因子"
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
                      <QuestionTooltip content="排放量 = 脱硫剂中碳酸盐消耗量 × 碳酸盐排放因子" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写排放量" />
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
