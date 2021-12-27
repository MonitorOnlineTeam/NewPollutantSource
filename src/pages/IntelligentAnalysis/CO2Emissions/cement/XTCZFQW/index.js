import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Button, Popover, DatePicker, Input, message } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS, maxWait, SUMTYPE } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'
import Debounce from 'lodash.debounce';

const industry = INDUSTRYS.cement;
const SumType = SUMTYPE.cement["协同处置废弃物"]
const { Option } = Select;
const { TextArea } = Input;
const CONFIG_ID = 'CementCollaborativeDischarge';
const SELECT_LISTWhere = [{ "key": '1', "value": "计算" }, { "key": '2', "value": "缺省值" }];
const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
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
      isModalVisible: false,
      TYPES: [],
      editData: {},
      KEY: undefined,
      FileUuid: undefined,
      currentTypeData: {},
    };
  }

  componentDidMount() {
    this.getCO2TableSum();
  }

  // 判断是否可添加
  checkIsAdd = () => {
    this.formRef.current.validateFields().then((values) => {
      let { EntCode, MonitorTime, CollaborativeType } = values;
      const { KEY, rowTime, rowType } = this.state;
      let _MonitorTime = MonitorTime.format("YYYY-MM-01 00:00:00");
      debugger
      // 编辑时判断时间是否更改
      if (KEY && rowTime === _MonitorTime && rowType == CollaborativeType) {
        this.onHandleSubmit();
        return;
      }
      this.props.dispatch({
        type: 'CO2Emissions/JudgeIsRepeat',
        payload: {
          EntCode: EntCode,
          MonitorTime: _MonitorTime,
          SumType: SumType,
          TypeCode: CollaborativeType
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
  // 根据企业和时间获取种类
  getCO2EnergyType = (formEidt) => {
    let values = this.formRef.current.getFieldsValue();
    const { EntCode, MonitorTime } = values;
    this.props.dispatch({
      type: 'CO2Emissions/getCO2EnergyType',
      payload: {
        IndustryCode: industry,
        EntCode: EntCode,
        SelectType: 'T',
        Time: moment(MonitorTime).format("YYYY-MM-01 00:00:00"),
      },
    })
    !formEidt && this.countEmissions();
  }


  // 种类change，填写缺省值
  onTypesChange = (value, option) => {
    const { Dictionaries } = this.props;
    this.setState({
      currentTypeData: Dictionaries.one[value],
      typeUnit: option['data-unit']
    })
    let values = this.formRef.current.getFieldsValue();
    const { CPropSource, PropSource, RateSource } = values;
    if (CPropSource == 2) {
      this.formRef.current.setFieldsValue({
        'CProp': Dictionaries.one[value]["化石碳的质量分数"] + Dictionaries.one[value]["生物碳的质量分数"],
      });
    }
    if (PropSource == 2) {
      this.formRef.current.setFieldsValue({
        'Prop': Dictionaries.one[value]["化石碳的质量分数"],
      });
    }
    if (RateSource == 2) {
      this.formRef.current.setFieldsValue({
        'Rate': Dictionaries.one[value]["废弃物焚烧炉的燃烧效率"],
      });
    }

    this.countEmissions();
  }

  // 计算排放量
  countEmissions = () => {
    // 二氧化碳排放量 = 废弃物的处置量 × 废弃物碳含量的比例  × 废弃物中矿物碳在碳总量中的比例  × 废弃物焚烧炉的燃烧效率  × 44 ÷ 12
    let values = this.formRef.current.getFieldsValue();
    let { EntCode, MonitorTime, FossilType, Disposal = 0, CProp = 0, Prop = 0, Rate = 0 } = values;
    // let count = Disposal * (CProp / 100) * (Prop / 100) * (Rate / 100) * 44 / 12;

    if (EntCode && MonitorTime) {
      this.props.dispatch({
        type: 'CO2Emissions/countEmissions',
        payload: {
          EntCode: EntCode,
          Time: MonitorTime.format("YYYY-MM-01 00:00:00"),
          IndustryCode: industry,
          Type: FossilType,
          CalType: 'w-5',
          Data: { '废弃物的处置量': Disposal || 0, '废弃物碳含量的比例': CProp || 0, '废弃物中矿物碳在碳总量中的比例': Prop || 0, '废弃物焚烧炉的燃烧效率': Rate || 0 }
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
            CollaborativeCode: KEY
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
        'dbo.T_Bas_CementCollaborativeDischarge.CollaborativeCode': this.state.KEY,
      },
      callback: (res) => {
        this.setState({
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
    this.setState({ [key]: !this.state[key], })
  }

  render() {
    const { isModalVisible, editData, FileUuid, FileUuid2, currentTypeData, } = this.state;
    const { tableInfo, Dictionaries, cementTableCO2Sum } = this.props;
    const { EntView = [] } = this.props.configIdList;
    console.log('props=', this.props)
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementCollaborativeDischarge.tCO2');

    const TYPES = Dictionaries.two || [];
    if (this.formRef.current) {
      let values = this.formRef.current.getFieldsValue();
      console.log('values=', values)
      var { CPropSource, PropSource, RateSource } = values;
    }
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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementCollaborativeDischarge.AttachmentID')
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CementCollaborativeDischarge.DevAttachmentID')
              this.setState({
                KEY: key, FileUuid: FileUuid, FileUuid2: FileUuid2,
                rowTime: record['dbo.T_Bas_CementCollaborativeDischarge.MonitorTime'],
                rowType: record['dbo.T_Bas_CementCollaborativeDischarge.CollaborativeType']
              }, () => {
                this.getFormData();
              })
            }}
            onDeleteCallback={() => {
              this.getCO2TableSum();
            }}
            footer={() => <div className="">排放量合计：{cementTableCO2Sum}</div>}
          />
        </Card>
        <Modal destroyOnClose width={1100} title="添加" visible={isModalVisible} onOk={this.checkIsAdd} onCancel={this.handleCancel}>
          <Form
            style={{ marginTop: 24 }}
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              CPropSource: editData.CPropSource || '2',
              PropSource: editData.PropSource || '2',
              RateSource: editData.RateSource || '2',
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
              CollaborativeType: editData['dbo.T_Bas_CementCollaborativeDischarge.CollaborativeType'] ? editData['dbo.T_Bas_CementCollaborativeDischarge.CollaborativeType'] + '' : undefined,
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
                  <DatePicker picker="month" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CollaborativeType"
                  label="种类"
                  rules={[{ required: true, message: '请选择种类!' }]}
                >
                  <Select placeholder="请选择种类" onChange={this.onTypesChange}>
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
                  name="Disposal"
                  label="废弃物的处置量(t)"
                  rules={[{ required: true, message: '请填写废弃物的处置量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} style={{ width: '100%' }} placeholder="请填写废弃物的处置量"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
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
                  name="CPropSource"
                  label="废弃物碳含量的比例数据来源"
                >
                  <Select
                    onChange={(value) => this.onSourceChange(value, 1, 'CProp', '化石碳的质量分数')}
                    placeholder="请选择废弃物碳含量的比例数据来源">
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
                  name="CProp"
                  label={`废弃物碳含量的比例(${currentTypeData['化石碳的质量分数Unit'] || '%'})`}
                  rules={[{ required: true, message: '请填写废弃物碳含量的比例!' }]}
                >
                  <InputNumber
                    disabled={CPropSource ? CPropSource == 2 : true}
                    min={0} max={100} style={{ width: '100%' }} placeholder="请填写废弃物碳含量的比例"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="PropSource"
                  label="废弃物中矿物碳在碳总量中的比例来源"
                >
                  <Select
                    onChange={(value) => this.onSourceChange(value, 2, 'Prop', '化石碳的质量分数')}
                    placeholder="请选择废弃物中矿物碳在碳总量中的比例来源">
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
                  name="Prop"
                  label={`废弃物中矿物碳在碳总量中的比例(${currentTypeData['化石碳的质量分数Unit'] || '%'})`}
                  rules={[{ required: true, message: '请填写废弃物中矿物碳在碳总量中的比例!' }]}
                >
                  <InputNumber
                    disabled={PropSource ? PropSource == 2 : true}
                    min={0} max={100} style={{ width: '100%' }} placeholder="请填写废弃物中矿物碳在碳总量中的比例"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="RateSource"
                  label="废弃物焚烧炉的燃烧效率来源"
                >
                  <Select
                    onChange={(value) => this.onSourceChange(value, 3, 'Rate', '废弃物焚烧炉的燃烧效率')}
                    placeholder="请选择废弃物焚烧炉的燃烧效率来源">
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
                  name="Rate"
                  label={`废弃物焚烧炉的燃烧效率(${currentTypeData['废弃物焚烧炉的燃烧效率Unit'] || '%'})`}
                  rules={[{ required: true, message: '请填写废弃物焚烧炉的燃烧效率!' }]}
                >
                  <InputNumber
                    disabled={RateSource ? RateSource == 2 : true}
                    min={0} max={100} style={{ width: '100%' }} placeholder="请填写废弃物焚烧炉的燃烧效率"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label={
                    <span>
                      二氧化碳排放量（t）
                      <QuestionTooltip content="二氧化碳排放量 = 废弃物的处置量 × 废弃物碳含量的比例 × 废弃物中矿物碳在碳总量中的比例 × 废弃物焚烧炉的燃烧效率 × 44 ÷ 12" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写排放量" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 6 }}
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
