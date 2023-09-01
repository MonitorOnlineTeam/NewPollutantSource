import React, { Component, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Spin,
  Select,
  Modal,
  Tag,
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
  message,
  DatePicker,
  InputNumber,
  Tooltip,
  Radio,
  Steps,
} from 'antd';
import styles from "../style.less"
import MonitorContent from '@/components/MonitorContent/index';
import { routerRedux } from 'dva/router';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { RollbackOutlined, ToolOutlined, HighlightOutlined, DownOutlined, EllipsisOutlined, FileTextOutlined, UnlockFilled } from '@ant-design/icons';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import SdlForm from '@/pages/AutoFormManager/SdlForm';
import { handleFormData } from '@/utils/utils';
import Cookie from 'js-cookie';
import moment from 'moment'
import DeviceManager from './DeviceManager'
import SdlMap from '@/pages/AutoFormManager/SdlMap'
const pointConfigId = 'CTPoint'
const FormItem = Form.Item;
const { Step } = Steps;
@connect(({ loading, autoForm, commissionTestPoint, global, }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm: autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  pointDataWhere: commissionTestPoint.pointDataWhere,
  loadingAddEditConfirm: loading.effects['commissionTestPoint/addOrUpdateTestPoint'],
  getFormDataLoading: loading.effects['autoForm/getFormData'],
  configInfo: global.configInfo,
}))

@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      isEdit: false,
      deviceManagerVisible: false,
      deviceManagerMN: '',
      deviceManagerGasType: '',
      selectedPointCode: '',
      deviceMangerVisible: false,
      thirdParty: true,
      dragDatas: [],
      sortTitle: '开启排序',
      noPaging: false,
      sortLoading: false,
      current: 0,
      pointSaveFlag:false,
      steps: [
        '监测点信息',
        '系统信息',
        '系统更换记录',
        '仪表信息',
        '仪表更换记录',
      ]
    };

  }

  componentDidMount() {
    const { configId } = this.props;
    this.reloadPage(configId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      if (nextProps.location.query.configId !== this.props.location.query.configId)
        this.reloadPage(nextProps.location.query.configId);
    }
  }

  reloadPage = (configId) => {
    const { dispatch } = this.props;
    const { location: { query: { targetId } } } = this.props;
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: pointConfigId,
      }
    })
    dispatch({
      type: 'commissionTestPoint/updateState',
      payload: {
        pointDataWhere: [
          {
            Key: 'dbo__T_Bas_TestCommonPoint__EntID',
            Value: targetId,
            Where: '$=',
          },
        ],
      },
    });
  }
  deviceManager = (row) => {
    this.setState({
      deviceManagerVisible: true,
      deviceManagerMN: row["dbo.T_Bas_TestCommonPoint.ID"],
    })
  }
  addPoint = () => { //添加监测点 弹框
    const { form, } = this.props;
    this.setState({ visible: true, isEdit: false, selectedPointCode: '', thirdParty: true })
    form.resetFields();
  }
  editPoint = (row) => {
    const { dispatch, form, } = this.props;
    this.setState({ visible: true, isEdit: true, })
    const pointCode = row['dbo.T_Bas_TestCommonPoint.ID']
    this.setState({
      visible: true,
      isEdit: true,
      selectedPointCode: pointCode,
    });
    dispatch({
      type: 'autoForm/getFormData',
      payload: {
        configId: 'TestPoint',
        'dbo.T_Bas_TestCommonPoint.ID': pointCode,
      },
      callback: (echoData) => {
        this.setState({ thirdParty: echoData.ReferenceMethodSource == '2' ? false : true });
        form.setFieldsValue({
          ...echoData,
          InstallationTime: echoData.InstallationTime && moment(echoData.InstallationTime),
          BeginTime: echoData.BeginTime && moment(echoData.BeginTime),
          EndTime: echoData.EndTime && moment(echoData.EndTime),
        })
      }
    })

  }
  updateSort = () => { //更新排序
    const { sortTitle } = this.state;
    if (sortTitle === '开启排序') {

      this.setState({ noPaging: true, sortLoading: true, })
      this.getAutoFormDataNoPage(() => {
        this.setState({ sortTitle: '关闭排序', sortLoading: false, })
      })


    } else {
      this.setState({ sortTitle: '开启排序', noPaging: false, })
    }

  }
  saveSort = () => { //保存排序
    const { dragDatas } = this.state;
    const mnList = dragDatas.map(item => item['dbo.T_Bas_CommonPoint.DGIMN'])
    if (mnList && mnList[0]) {
      this.props.dispatch({
        type: `point/pointSort`,
        payload: {
          mnList: mnList,
        },
        callback: (isSuccess) => {
          if (isSuccess) {
            this.props.dispatch({
              type: `autoForm/getAutoFormData`,
              payload: {
                configId: pointConfigId,
                searchParams: this.props.pointDataWhere,
                otherParams: {
                  SortFileds: 'Sort',
                  IsAsc: true,
                }
              },
              callback: () => {
                this.setState({ sortTitle: '开启排序', noPaging: false, })
              }
            })
          } else {
            this.getAutoFormDataNoPage();
          }
        }
      })
    } else {
      message.warning('请先排序')
    }

  }
  savePointSubmitForm = () => {  //保存监测点 确认
    const { form, dispatch, pointDataWhere, } = this.props;
    const { location: { query: { targetName, targetId } } } = this.props;
    const { isEdit, selectedPointCode, } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        values.EntID = targetId;
        dispatch({
          type: 'commissionTestPoint/addOrUpdateTestPoint',
          payload: {
            ...values, InstallationTime: values.InstallationTime && values.InstallationTime.format('YYYY-MM-DD HH:mm:ss'), BeginTime: values.BeginTime && values.BeginTime.format('YYYY-MM-DD HH:mm:ss'), EndTime: values.EndTime && values.EndTime.format('YYYY-MM-DD HH:mm:ss'), ID: selectedPointCode,
            TestCompanyName: values.ReferenceMethodSource == 2 ? values.TestCompanyName : undefined,
            TestReportNumber: values.ReferenceMethodSource == 2 ? values.TestReportNumber : undefined,
          },
          callback: () => {
            this.setState({ visible: false, })
            dispatch({
              type: 'autoForm/getAutoFormData',
              payload: {
                configId: pointConfigId,
                searchParams: pointDataWhere
              },
            });
          },
        });
      }
    })
  }


  pointInfo = () => {
    const { getFormDataLoading, } = this.props;
    const { isEdit, } = this.state;
    const { getFieldDecorator } = this.props.form;
    return <Spin spinning={isEdit ? getFormDataLoading : false}>
      <Form>
        <Row>
          <Col span={12}>
            <FormItem label="监测点名称" >
              {getFieldDecorator("PointName", {
                rules: [{ required: true, message: "请输入监测点名称", }],
              })(<Input placeholder='请输入' allowClear />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="监测点编号（MN）" >
              {getFieldDecorator("TestCount", {
                rules: [{ required: true, message: "请输入监测点编号（MN）", }],
              })(<InputNumber placeholder='请输入' allowClear />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="经度" >
              {getFieldDecorator("TestUser", {
                rules: [{ required: true, message: "请输入经度", }],
              })(<SdlMap
                // longitude={SparePartsStationInfo ? SparePartsStationInfo.Longitude : null}
                // latitude={SparePartsStationInfo ? SparePartsStationInfo.Latitude : null}
                handleMarker
                handlePolygon
                zoom={12}
                placeholder='请输入 例如：112.236514'
              />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="维度" >
              {getFieldDecorator("TestUser1", {
                rules: [{ required: true, message: "请输入维度", }],
              })(<SdlMap
              // longitude={SparePartsStationInfo ? SparePartsStationInfo.Longitude : null}
              // latitude={SparePartsStationInfo ? SparePartsStationInfo.Latitude : null}
              handleMarker
              handlePolygon
              zoom={12}
              placeholder='请输入 例如：85.236589'
            />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="行业">
              {getFieldDecorator("CalibrationCEMS", {
                rules: [{ required: true, message: "请选择行业", }],
              })(
                <Select placeholder='请选择' allowClear> 
                  <Option key={'1'} value={'1'}>一元线性方程法</Option>
                  <Option key={'2'} value={'2'}>K系数法</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="监测点类型" >
              {getFieldDecorator("CalibrationCEMS", {
                rules: [{ required: true, message: "请选择监测点类型", }],
              })(
                <Select placeholder='请选择' allowClear>
                  <Option key={'1'} value={'1'}>一元线性方程法</Option>
                  <Option key={'2'} value={'2'}>K系数法</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="脱销工艺类型">
              {getFieldDecorator("CalibrationCEMS", {
                rules: [{ required: true, message: "请选择脱销工艺类型", }],
              })(
                <Select placeholder='请选择' allowClear>
                  <Option key={'1'} value={'1'}>一元线性方程法</Option>
                  <Option key={'2'} value={'2'}>K系数法</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="脱硫工艺类型">
              {getFieldDecorator("CalibrationCEMS", {
                rules: [{ required: true, message: "请选择脱硫工艺类型", }],
              })(
                <Select placeholder='请选择'>
                  <Option key={'1'} value={'1'}>一元线性方程法</Option>
                  <Option key={'2'} value={'2'}>K系数法</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="除尘工艺类型">
              {getFieldDecorator("CalibrationCEMS", {
                rules: [{ required: true, message: "请选择除尘工艺类型", }],
              })(
                <Select placeholder='请选择' allowClear>
                  <Option key={'1'} value={'1'}>一元线性方程法</Option>
                  <Option key={'2'} value={'2'}>K系数法</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Spin>
  }

  next = () => {
    this.setState({
      current: this.state.current + 1
    })
  };
  prev = () => {
    this.setState({
      current: this.state.current - 1
    })
  };
  onStepsChange = (value) =>{
    const { pointSaveFlag } = this.state
    if(!pointSaveFlag){
     message.error('请先添加监测点信息')
     return;
    }
    this.setState({
      current: value
    })
  }
  render() {
    const { searchConfigItems, searchForm, tableInfo, dispatch, pointDataWhere, loadingAddEditConfirm, getFormDataLoading, configInfo, } = this.props;
    const { location: { query: { targetName, targetId } } } = this.props;
    const { isEdit, thirdParty, current, steps, pointSaveFlag,} = this.state;
    const noDelFlag = configInfo && configInfo.DeleteTestUser == 0 ? true : false;
    const { getFieldDecorator } = this.props.form


    if (this.props.loading) {
      return (<Spin
        style={{
          width: '100%',
          height: 'calc(100vh/2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        size="large"
      />);
    }
    return (
      <BreadcrumbWrapper title="监测点维护">
        <div className={styles.pointSty}>
          <Card
            title={
              <span>
                {targetName}
                <Button
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    history.go(-1);
                  }}
                  type="link"
                  size="small"
                >
                  <RollbackOutlined />
                  返回上级
                </Button>
              </span>
            }>
            <SearchWrapper
              searchParams={pointDataWhere}
              onSubmitForm={form => this.loadReportList(form)}
              configId={pointConfigId}
              isCoustom
              selectType='3,是'
            ></SearchWrapper>
            <AutoFormTable
              style={{ marginTop: 10 }}
              configId={pointConfigId}
              resizable
              isCenter
              isFixedOpera
              {...this.props}
              type='company'
              searchParams={pointDataWhere}
              onAdd={() => { //添加
                this.addPoint();
              }}
              noDel={noDelFlag}
              appendHandleRows={row => (
                <Fragment>
                  {!noDelFlag && <Divider type="vertical" />}
                  <Tooltip title="编辑">
                    <a
                      onClick={() => {
                        this.editPoint(row)
                      }}
                    >
                      <EditIcon />
                    </a>
                  </Tooltip>


                  <Divider type="vertical" />
                  <Tooltip title="设备管理">
                    <a onClick={() => {
                      this.deviceManager(row);
                    }}><FileTextOutlined style={{ fontSize: 16 }} /></a>
                  </Tooltip>

                </Fragment>
              )}
            />
          </Card>
        </div>
        <Modal
          title={isEdit ? '编辑监测点' : '添加监测点'}
          visible={this.state.visible}
          onOk={this.savePointSubmitForm.bind(this)}
          onCancel={() => { this.setState({ visible: false }) }}
          wrapClassName={`spreadOverModal`}
          confirmLoading={loadingAddEditConfirm || getFormDataLoading}
          destroyOnClose
          className={styles.formModalSty}
          footer={
            <div className="steps-action">
            {current <= steps.length - 1 && (
              <Button type="primary" onClick={() => this.next()}>
                 {current === steps.length - 1 ? '保存' : '保存并下一步'}
              </Button>
            )}
            {pointSaveFlag &&current < steps.length - 1 ? (
              <Button  onClick={() => this.next()}>
                跳过
              </Button>
            ) : null}
            {current > 0 && (
              <Button
                onClick={() => this.prev()}
              >
                上一步
              </Button>
            )}
          </div>
        }
          >
          <Steps current={current} size='small'  onChange={this.onStepsChange} >
           {steps.map((item) => <Step title={item}   />)}
          </Steps>
          <div style={{paddingTop:12}}>
            {current==0&&this.pointInfo()}
          </div>
       
        </Modal>
        <Modal
          title={'设备管理'}
          visible={this.state.deviceManagerVisible}
          onCancel={() => { this.setState({ deviceManagerVisible: false }) }}
          destroyOnClose
          footer={null}
          wrapClassName={`spreadOverModal spreadOverHiddenModal`}
        >
          <DeviceManager onCancel={() => { this.setState({ deviceManagerVisible: false }) }} DGIMN={this.state.deviceManagerMN} />
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}
