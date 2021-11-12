import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, Button, Popover, DatePicker, Radio } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS, maxWait } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'
import Debounce from 'lodash.debounce';

const industry = INDUSTRYS.cement;
const { Option } = Select;
const CONFIG_ID = 'CementProcessDischarge';
const SELECT_LISTWhere = [{ "key": '2', "value": "缺省值" }];
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
  cementDictionaries: CO2Emissions.cementDictionaries,
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
      UnitVisible: false,
      WhetherT: 1,
    };
  }

  componentDidMount() {
  }

  // 根据企业和时间获取种类
  getCO2EnergyType = () => {
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
    this.countEmissions();
  }


  // 种类change，填写缺省值
  onTypesChange = (value) => {
    // 生料烧失量: 33
    // 生料烧失量Unit: "%"
    // 石灰石的含量: 22
    // 石灰石的含量Unit: "%"
    this.setState({
      currentTypeData: value
    })
    const { cementDictionaries } = this.props;
    this.formRef.current.setFieldsValue({
      'Limestone': cementDictionaries.one[value]["石灰石的含量"],
      'Loss': cementDictionaries.one[value]["生料烧失量"],
    });
  }

  // 计算排放量
  countEmissions = () => {
    // 二氧化碳排放总量 = 单位熟料二氧化碳排放量 × 熟料实际生产量
    let values = this.formRef.current.getFieldsValue();
    let { EntCode, MonitorTime, FtCo2 = 0, PtCo2 = 0 } = values;

    if (EntCode && MonitorTime) {
      this.props.dispatch({
        type: 'CO2Emissions/countEmissions',
        payload: {
          EntCode: EntCode,
          Time: MonitorTime.format("YYYY-MM-01 00:00:00"),
          IndustryCode: industry,
          CalType: 'w-4',
          Data: { '单位熟料二氧化碳排放量': FtCo2 || 0, '熟料实际生产量': PtCo2 || 0 }
        },
        callback: (res) => {
          this.formRef.current.setFieldsValue({ 'tCO2': res.toFixed(2) });
        }
      })
    }
  }

  // // 计算单位熟料二氧化碳排放量
  // countSLCO2Emissions = () => {
  //   // 包含：单位熟料二氧化碳排放量 = (氧化钙的质量分数 × 0.785 + 氧化镁的质量分数 × 1.092) × 生料中石灰石的含量 * 1 ÷ (1 - 生料烧失量)
  //   // 不包含：单位熟料二氧化碳排放量 = (氧化钙的质量分数 × 0.785 + 氧化镁的质量分数 × 1.092) × 1.01
  //   let values = this.formRef.current.getFieldsValue();
  //   let { CaO = 0, MgO = 0, Limestone = 0, Loss = 0 } = values;
  //   let WhetherT = this.state.WhetherT;
  //   if (WhetherT === 1) {
  //     // 包含
  //     let value1 = (CaO * 0.785 + MgO * 1.092) * Limestone * 1;
  //     let value2 = 1 - Loss;
  //     let count = value2 ? value1 / value2 : 0;
  //     this.formRef.current.setFieldsValue({ 'FtCo2': count.toFixed(2) });
  //   } else {
  //     // 不包含
  //     let count = (CaO * 0.785 + MgO * 1.092) * Limestone * 1.01;
  //     this.formRef.current.setFieldsValue({ 'FtCo2': count.toFixed(2) });
  //   }
  //   this.countEmissions();
  // }

  countSLCO2Emissions = () => {
    // 包含：单位熟料二氧化碳排放量 = (氧化钙的质量分数 × 0.785 + 氧化镁的质量分数 × 1.092) × 生料中石灰石的含量 * 1 ÷ (1 - 生料烧失量)
    // 不包含：单位熟料二氧化碳排放量 = (氧化钙的质量分数 × 0.785 + 氧化镁的质量分数 × 1.092) × 1.01
    let values = this.formRef.current.getFieldsValue();
    let { EntCode, MonitorTime, CaO = 0, MgO = 0, Limestone = 0, Loss = 0 } = values;

    let Data = {};
    let WhetherT = this.state.WhetherT;
    if (WhetherT === 1) {
      // 包含
      // let value1 = (CaO * 0.785 + MgO * 1.092) * Limestone * 1;
      // let value2 = 1 - Loss;
      // let count = value2 ? value1 / value2 : 0;
      // this.formRef.current.setFieldsValue({ 'FtCo2': count.toFixed(2) });
      Data = { '是否包含': 1, '氧化钙的质量分数': CaO, '氧化镁的质量分数': MgO, '生料中石灰石的含量': Limestone, '生料烧失量': Loss };
    } else {
      // 不包含
      // let count = (CaO * 0.785 + MgO * 1.092) * Limestone * 1.01;
      // this.formRef.current.setFieldsValue({ 'FtCo2': count.toFixed(2) });
      Data = { '是否包含': 0, '氧化钙的质量分数': CaO, '氧化镁的质量分数': MgO, };
    }

    if (EntCode && MonitorTime) {
      this.props.dispatch({
        type: 'CO2Emissions/countEmissions',
        payload: {
          EntCode: EntCode,
          Time: MonitorTime.format("YYYY-MM-01 00:00:00"),
          IndustryCode: industry,
          CalType: 'w-3',
          Data: Data
        },
        callback: (res) => {
          this.formRef.current.setFieldsValue({ 'FtCo2': res.toFixed(2) });
          this.countEmissions();
        }
      })
    }
  }



  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    })
  };

  // 保存
  onHandleSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      const { editData, KEY } = this.state;
      console.log('KEY=', KEY)
      let actionType = KEY ? 'autoForm/saveEdit' : 'autoForm/add';

      this.props.dispatch({
        type: actionType,
        payload: {
          configId: CONFIG_ID,
          FormData: {
            ...values,
            MonitorTime: moment(values.MonitorTime).format("YYYY-MM-01 00:00:00"),
            CementProcessCode: KEY
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
  }

  // 点击编辑获取数据
  getFormData = (FileUuid) => {
    this.props.dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: CONFIG_ID,
        'dbo.T_Bas_CementProcessDischarge.CementProcessCode': this.state.KEY,
      },
      callback: (res) => {
        this.setState({
          editData: res,
          isModalVisible: true,
        })
      }
    })
  }

  getPopoverContent = () => {
    // if (!this.formRef.current) {
    //   return '';
    // }
    const { cementDictionaries } = this.props;
    let WhetherT = this.state.WhetherT;
    if (WhetherT === 1) {
      // 包含
      return <>
        <Form.Item
          name="CaO"
          label="氧化钙(CaO)的质量分数(%)"
        >
          <InputNumber style={{ width: '100%' }}
            onChange={Debounce(() => this.countSLCO2Emissions(), maxWait)}
            placeholder="请填写氧化钙(CaO)的质量分数(%)"
          />
        </Form.Item>
        <Form.Item
          name="MgO"
          label="氧化镁(MgO)的质量分数(%)"
        >
          <InputNumber style={{ width: '100%' }}
            onChange={Debounce(() => this.countSLCO2Emissions(), maxWait)}
            placeholder="请填写氧化镁(MgO)的质量分数(%)"
          />
        </Form.Item>
        {/* <Col span={12}>
          <Form.Item
            name="LimestoneSource"
            label="石灰石的含量来源"
          >
            <Select placeholder="请选择石灰石的含量来源" onChange={value => {
              this.formRef.current.setFieldsValue({
                'Limestone': cementDictionaries.one['GC']["石灰石的含量"],
              });
              this.countSLCO2Emissions();
            }}>
              {
                SELECT_LISTWhere.map(item => {
                  return <Option value={item.key} key={item.key}>{item.value}</Option>
                })
              }
            </Select>
          </Form.Item>
        </Col> */}
        <Form.Item
          name="Limestone"
          label={`石灰石的含量(%)`}
        >
          <InputNumber style={{ width: '100%' }}
            onChange={Debounce(() => this.countSLCO2Emissions(), maxWait)}
            placeholder="请填写石灰石的含量(%)"
          />
        </Form.Item>
        {/* <Col span={12}>
          <Form.Item
            name="LossSource"
            label="生料烧失量来源"
          >
            <Select placeholder="请选择生料烧失量来源" onChange={value => {
              this.formRef.current.setFieldsValue({
                'Loss': cementDictionaries.one['GC']["生料烧失量"],
              });
              this.countSLCO2Emissions();
            }}>
              {
                SELECT_LISTWhere.map(item => {
                  return <Option value={item.key} key={item.key}>{item.value}</Option>
                })
              }
            </Select>
          </Form.Item>
        </Col> */}
        <Form.Item
          name="Loss"
          label={`生料烧失量(%)`}
        >
          <InputNumber style={{ width: '100%' }}
            onChange={Debounce(() => this.countSLCO2Emissions(), maxWait)}
            placeholder="请填写生料烧失量"
          />
        </Form.Item>
      </>
    } else {
      // 不包含
      return <>
        <Form.Item
          name="CaO"
          label="氧化钙(CaO)的质量分数(%)"
        >
          <InputNumber style={{ width: '100%' }}
            onChange={Debounce(() => this.countSLCO2Emissions(), maxWait)}
            placeholder="请填写氧化钙(CaO)的质量分数(%)"
          />
        </Form.Item>
        <Form.Item
          name="MgO"
          label="氧化镁(MgO)的质量分数(%)"
        >
          <InputNumber style={{ width: '100%' }}
            onChange={Debounce(() => this.countSLCO2Emissions(), maxWait)}
            placeholder="请填写氧化镁(MgO)的质量分数(%)"
          />
        </Form.Item>
      </>
    }
  }

  render() {
    const { isModalVisible, editData, FileUuid, WhetherT } = this.state;
    const { tableInfo } = this.props;
    const { EntView = [] } = this.props.configIdList;
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementProcessDischarge.tCO2');

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
              })
            }}
            onEdit={(record, key) => {
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementProcessDischarge.AttachmentID')
              this.setState({ KEY: key, FileUuid: FileUuid }, () => {
                this.getFormData(FileUuid);
              })
            }}
            footer={() => <div className="">排放量合计：{count}</div>}
          />
        </Card>
        <Modal maskClosable={false} destroyOnClose width={1000} title="添加" visible={isModalVisible} onOk={this.onHandleSubmit} onCancel={this.handleCancel}>
          <Form
            {...layout}
            ref={this.formRef}
            initialValues={{
              WhetherT: 1,
              ...editData,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
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
                  name="WhetherT"
                  label="是否包含替代燃料"
                  rules={[{ required: true, message: '请选择是否包含替代燃料!' }]}
                >
                  <Radio.Group onChange={e => this.setState({ WhetherT: e.target.value })}>
                    <Radio value={1}>包含</Radio>
                    <Radio value={0}>不包含</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="FtCo2"
                  label=""
                  label={
                    <span>
                      单位熟料二氧化碳排放量(tCO₂/t)
                      {
                        WhetherT === 1 ? <QuestionTooltip content="单位熟料二氧化碳排放量 = (氧化钙的质量分数 × 0.785 + 氧化镁的质量分数 × 1.092) × 生料中石灰石的含量 * 1 ÷ (1 - 生料烧失量)" /> :
                          <QuestionTooltip content="单位熟料二氧化碳排放量 = (氧化钙的质量分数 × 0.785 + 氧化镁的质量分数 × 1.092) × 1.01" />
                      }
                    </span>
                  }
                  rules={[{ required: true, message: '请填写单位熟料二氧化碳排放量!' }]}
                >
                  <InputNumber style={{ width: 'calc(100% - 88px)' }} placeholder="请填写单位熟料二氧化碳排放量"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
                <Popover
                  title="计算单位熟料二氧化碳排放量"
                  trigger="click"
                  content={() => this.getPopoverContent()}
                >
                  <Button style={{ position: 'absolute', top: 0, right: 0 }} type="primary">计算排放</Button>
                </Popover>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="PtCo2"
                  label="熟料实际生产量(t)"
                  rules={[{ required: true, message: '请填写熟料实际生产量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写熟料实际生产量"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label={
                    <span>
                      二氧化碳排放量(tCO₂)
                      <QuestionTooltip content="二氧化碳排放总量 = 单位熟料二氧化碳排放量 × 熟料实际生产量" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写二氧化碳排放量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写请填写二氧化碳排放量" />
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
