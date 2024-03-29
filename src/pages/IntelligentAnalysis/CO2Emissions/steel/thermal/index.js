/*
 * @Author: Jiaqi 
 * @Date: 2021-10-12 14:03:36 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2021-10-12 14:15:02
 * @Description: 净购入热力
 */

import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { Card, Modal, Form, Row, Col, InputNumber, Input, Select, DatePicker, message } from 'antd'
import FileUpload from '@/components/FileUpload';
import { connect } from 'dva';
import { getRowCuid } from '@/utils/utils';
import _ from 'lodash';
import QuestionTooltip from "@/components/QuestionTooltip"
import moment from 'moment'
import { INDUSTRYS, maxWait } from '@/pages/IntelligentAnalysis/CO2Emissions/CONST'
import Debounce from 'lodash.debounce';

const industry = INDUSTRYS.steel;
const { Option } = Select;
const CONFIG_ID = 'SteelHeatDischarge';
const SELECT_LIST = [{ "key": '1', "value": "外购热力" }]
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
    };
  }

  componentDidMount() {
    this.getCO2TableSum();
  }

  // 判断是否可添加
  checkIsAdd = () => {
    this.formRef.current.validateFields().then((values) => {
      let { EntCode, MonitorTime, HeatDischargeType } = values;
      const { KEY, rowTime, rowType } = this.state;
      let _MonitorTime = MonitorTime.format("YYYY-MM-01 00:00:00");
      // 编辑时判断时间是否更改
      if (KEY && rowTime === _MonitorTime && rowType == HeatDischargeType) {
        this.onHandleSubmit();
        return;
      }
      this.props.dispatch({
        type: 'CO2Emissions/JudgeIsRepeat',
        payload: {
          EntCode: EntCode,
          MonitorTime: _MonitorTime,
          SumType: 's-hd',
          TypeCode: HeatDischargeType
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
    const { searchForm } = this.state;
    let entCode = searchForm[CONFIG_ID] ? (
      searchForm[CONFIG_ID][`dbo__T_Bas_${CONFIG_ID}__EntCode`] ? searchForm[CONFIG_ID][`dbo__T_Bas_${CONFIG_ID}__EntCode`].value : undefined
    )
      : undefined;
    this.props.dispatch({
      type: 'CO2Emissions/getCO2TableSum',
      payload: {
        SumType: 's-hd',
        EntCode: entCode
      }
    });
  }


  // 计算排放量
  countEmissions = () => {
    // 化石燃料燃烧排放量 = 活动数据 × 排放因子
    let values = this.formRef.current.getFieldsValue();
    let { EntCode, MonitorTime, Emission = 0, ActivityData = 0 } = values;
    if (EntCode && MonitorTime) {
      this.props.dispatch({
        type: 'CO2Emissions/countEmissions',
        payload: {
          EntCode: EntCode,
          Time: MonitorTime.format("YYYY-MM-01 00:00:00"),
          IndustryCode: industry,
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
    this.setState({
      isModalVisible: false
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
            MonitorTime: moment(values.MonitorTime).format("YYYY-MM-01 00:00"),
            HeatDischargeCode: KEY
          },
          reload: KEY ? true : undefined,
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
        'dbo.T_Bas_SteelHeatDischarge.HeatDischargeCode': this.state.KEY,
      },
      callback: (res) => {
        this.setState({
          editData: res,
          isModalVisible: true,
        })
      }
    })
  }


  // 查询成功回调
  searchSuccessCallback = (searchForm) => {
    this.setState(
      { searchForm },
      () => {
        this.getCO2TableSum();
      })
  }

  render() {
    const { isModalVisible, editData, FileUuid, KEY } = this.state;
    const { tableInfo, cementTableCO2Sum } = this.props;
    const { EntView = [] } = this.props.configIdList;
    const dataSource = tableInfo[CONFIG_ID] ? tableInfo[CONFIG_ID].dataSource : [];
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
              })
            }}
            onEdit={(record, key) => {
              const FileUuid = getRowCuid(record, 'dbo.T_Bas_SteelHeatDischarge.AttachmentID')
              this.setState({
                KEY: key, FileUuid: FileUuid,
                rowTime: record['dbo.T_Bas_SteelHeatDischarge.MonitorTime'],
                rowType: record['dbo.T_Bas_SteelHeatDischarge.HeatDischargeType'],
              }, () => {
                this.getFormData(FileUuid);
              })
            }}
            onDeleteCallback={() => {
              this.getCO2TableSum();
            }}
            footer={() => <div className="">排放量合计（tCO₂）：{cementTableCO2Sum}</div>}
          />
        </Card>
        <Modal destroyOnClose width={900} title={KEY ? "编辑" : "添加"} visible={isModalVisible} onOk={this.checkIsAdd} onCancel={this.handleCancel}>
          <Form
            {...layout}
            ref={this.formRef}
            initialValues={{
              ...editData,
              MonitorTime: moment(editData.MonitorTime),
              EntCode: editData['dbo.EntView.EntCode'],
            }}
            onValuesChange={(changedValues, allValues) => {
              console.log('changedValues=', changedValues)
              console.log('allValues=', allValues)
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
                  <DatePicker picker="month" style={{ width: '100%' }} onChange={this.countEmissions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="HeatDischargeType"
                  label="种类"
                  rules={[{ required: true, message: '请选择种类!' }]}
                >
                  <Select placeholder="请选择种类">
                    {
                      SELECT_LIST.map(item => {
                        return <Option value={item.key} key={item.key}>{item.value}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ActivityData"
                  label="活动数据（MWh）"
                  rules={[
                    { required: true, message: '请填写活动数据!' },
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写活动数据"
                    // onChange={Debounce(() => this.countEmissions(), maxWait)}
                    onChange={(value) => console.log("value=", value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Emission"
                  label="排放因子（tCO₂/MWh）"
                  rules={[{ required: true, message: '请填写排放因子!' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} placeholder="请填写排放因子"
                    onChange={Debounce(() => this.countEmissions(), maxWait)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="tCO2"
                  label="排放量（tCO₂）"
                  label={
                    <span>排放量（tCO₂）
                      <QuestionTooltip content="排放量 = 活动数据 × 排放因子" />
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