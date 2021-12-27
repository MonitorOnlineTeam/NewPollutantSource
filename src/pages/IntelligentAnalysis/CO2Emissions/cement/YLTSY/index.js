import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Select, DatePicker, Input, Button, message } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS, maxWait, GET_SELECT_LIST, SUMTYPE } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'
import Debounce from 'lodash.debounce';

const industry = INDUSTRYS.cement;
const SumType = SUMTYPE.cement["碳酸盐分解"]
const { Option } = Select;
const CONFIG_ID = 'CementCarbonate';
const layout = {
  labelCol: { span: 14 },
  wrapperCol: { span: 10 },
};

@connect(({ loading, autoForm, CO2Emissions }) => ({
  loading: loading.effects['autoForm/getAutoFormData'],
  getConfigLoading: loading.effects['autoForm/getPageConfig'],
  fileList: autoForm.fileList,
  tableInfo: autoForm.tableInfo,
  configIdList: autoForm.configIdList,
  cementTableCO2Sum: CO2Emissions.cementTableCO2Sum,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isModalVisible: false,
      editData: {},
      KEY: undefined,
      FileUuid: undefined,
    };
  }

  componentDidMount() {
    this.getCO2TableSum();
  }

  // 判断是否可添加
  checkIsAdd = () => {
    this.formRef.current.validateFields().then((values) => {
      let { EntCode, MonitorTime, FossilType } = values;
      const { KEY, rowTime } = this.state;
      let _MonitorTime = MonitorTime.format("YYYY-MM-01 00:00:00");
      debugger
      // 编辑时判断时间是否更改
      if (KEY && rowTime === _MonitorTime) {
        this.onHandleSubmit();
        return;
      }
      this.props.dispatch({
        type: 'CO2Emissions/JudgeIsRepeat',
        payload: {
          EntCode: EntCode,
          MonitorTime: _MonitorTime,
          SumType: SumType,
          // TypeCode: FossilType
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

  // countEmissions = Debounce(() => this.countEmissions(), maxWait)

  // 计算排放量
  countEmissions = Debounce(() => {
    //   (水泥熟料产量 + 窑炉排气筒(窑头)粉尘重量 + 窑炉旁路防风粉尘的重量) * 
    //  (
    //     (熟料中氧化钙的含量 - 生料中不是以碳酸盐形式存在的氧化钙的含量) × 44 ÷ 56
    //        + 
    //     (熟料中氧化镁的含量 - 生料中不是以碳酸盐形式存在的氧化镁的含量) * 44 ÷ 40
    //  )
    let values = this.formRef.current.getFieldsValue();
    let {
      EntCode, MonitorTime, FossilType,
      AnnualConsumption = 0,
      ExhaustWeight = 0,
      FreshWeight = 0,
      CalciumContent = 0,
      MagnesiumContent = 0,
      NoCalciumContent = 0,
      NoMagnesiumContent = 0,
    } = values;
    if (EntCode && MonitorTime) {
      this.props.dispatch({
        type: 'CO2Emissions/countEmissions',
        payload: {
          EntCode: EntCode,
          Time: MonitorTime.format("YYYY-MM-01 00:00:00"),
          IndustryCode: industry,
          Type: FossilType,
          CalType: 'w-7',
          Data: {
            '水泥熟料产量': AnnualConsumption || 0, '窑炉排气筒(窑头)粉尘重量': ExhaustWeight || 0, '窑炉旁路防风粉尘的重量': FreshWeight || 0,
            '熟料中氧化钙的含量': CalciumContent || 0, '生料中不是以碳酸盐形式存在的氧化钙的含量': NoCalciumContent || 0,
            '熟料中氧化镁的含量': MagnesiumContent || 0, '生料中不是以碳酸盐形式存在的氧化镁的含量': NoMagnesiumContent || 0
          }
        },
        callback: (res) => {
          this.formRef.current.setFieldsValue({ 'tCO2': res.toFixed(2) });
        }
      })
    }
  }, maxWait)

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    })
  };

  // 保存
  onHandleSubmit = () => {
    this.formRef.current.validateFields().then((values) => {
      const { KEY } = this.state;
      let actionType = KEY ? 'autoForm/saveEdit' : 'autoForm/add';

      this.props.dispatch({
        type: actionType,
        payload: {
          configId: CONFIG_ID,
          FormData: {
            ...values,
            MonitorTime: moment(values.MonitorTime).format("YYYY-MM-01 00:00:00"),
            CarbonateCode: KEY
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
        'dbo.T_Bas_CementCarbonate.CarbonateCode': this.state.KEY,
      },
      callback: (res) => {
        this.setState({
          // CO2OxidationRateState: res.CO2OxidationRateDataType,
          // UnitCarbonContentState: res.UnitCarbonContentDataType,
          editData: res,
          isModalVisible: true,
        })
      }
    })
  }

  render() {
    const { isModalVisible, editData, FileUuid, FileUuid2, } = this.state;
    const { tableInfo, cementTableCO2Sum } = this.props;
    const { EntView = [] } = this.props.configIdList;
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
    let count = _.sumBy(dataSource, 'dbo.T_Bas_CementCarbonate.tCO2');

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
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_CementCarbonate.AttachmentID')
              const FileUuid2 = getRowCuid(record, 'dbo.T_Bas_CementCarbonate.DevAttachmentID')
              this.setState({
                KEY: key, FileUuid: FileUuid, FileUuid2: FileUuid2,
                rowTime: record['dbo.T_Bas_CementCarbonate.MonitorTime'],
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
        <Modal destroyOnClose width={1400} title="添加" visible={isModalVisible} onOk={this.checkIsAdd} onCancel={this.handleCancel}>
          <Form
            style={{ marginTop: 24 }}
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              GetType: editData.GetType,
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
                  <Select placeholder="请选择企业">
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
                  name="Loss"
                  label="生料烧失量(%)"
                  rules={[{ required: true, message: '请填写生料烧失量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写生料烧失量!"
                  // onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="AnnualConsumption"
                  label="水泥熟料产量(t)"
                  rules={[{ required: true, message: '请填写水泥熟料产量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写水泥熟料产量" onChange={this.countEmissions} />
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
                  name="ExhaustWeight"
                  label="窑炉排气筒(窑头)粉尘重量(t)"
                  rules={[{ required: true, message: '请填写窑炉排气筒粉尘重量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写窑炉排气筒粉尘重量" onChange={this.countEmissions} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="FreshWeight"
                  label="窑炉旁路防风粉尘的重量(t)"
                  rules={[{ required: true, message: '请填写窑炉旁路防风粉尘的重量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写窑炉旁路防风粉尘的重量" onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="CalciumContent"
                  label="熟料中氧化钙的含量(%)"
                  rules={[{ required: true, message: '请填写熟料中氧化钙的含量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写熟料中氧化钙的含量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="MagnesiumContent"
                  label="熟料中氧化镁的含量(%)"
                  rules={[{ required: true, message: '请填写熟料中氧化镁的含量!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写熟料中氧化镁的含量"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="NoCalciumContent"
                  label="生料中不是以碳酸盐形式存在的氧化钙(CaO)的含量(%)"
                  rules={[{ required: true, message: '请填写生料中不是以碳酸盐形式存在的氧化钙(CaO)的含量(%)!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写生料中不是以碳酸盐形式存在的氧化钙(CaO)的含量(%)!"
                    onChange={this.countEmissions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="NoMagnesiumContent"
                  label="生料中不是以碳酸盐形式存在的氧化镁(MgO)的含量(%)"
                  rules={[{ required: true, message: '请填写生料中不是以碳酸盐形式存在的氧化镁(MgO)的含量(%)!' }]}
                >
                  <InputNumber stringMode style={{ width: '100%' }} placeholder="请填写生料中不是以碳酸盐形式存在的氧化镁(MgO)的含量(%)!"
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
                      <QuestionTooltip content="排放量 = (水泥熟料产量 + 窑炉排气筒(窑头)粉尘重量 + 窑炉旁路防风粉尘的种类) * ((熟料中氧化钙的含量 - 生料中不是以碳酸盐形式存在的氧化钙的含量) × 44 ÷ 56 + (熟料中氧化镁的含量 - 生料中不是以碳酸盐形式存在的氧化镁的含量) * 44 ÷ 40)" />
                    </span>
                  }
                  rules={[{ required: true, message: '请填写排放量!' }]}
                >
                  <InputNumber style={{ width: '100%' }} placeholder="请填写排放量" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 5 }}
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
