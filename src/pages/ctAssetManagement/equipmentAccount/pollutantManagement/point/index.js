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
import SystemInfo from '../components/SystemInfo'
const pointConfigId = 'CTPoint'
const FormItem = Form.Item;
const { Step } = Steps;
@connect(({ loading, autoForm, ctPollutantManger, global, }) => ({
  loading: loading.effects['autoForm/getPageConfig'] || false,
  autoForm: autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  pointDataWhere: ctPollutantManger.pointDataWhere,
  getFormDataLoading: loading.effects['autoForm/getFormData'],
  configInfo: global.configInfo,
  addOrEditCommonPointLoading: loading.effects['ctPollutantManger/addOrEditCommonPointList'],
  pointIndustryLoading: loading.effects['ctPollutantManger/getPointIndustryList'],
  operationCEMSSystemLoading: loading.effects[`ctPollutantManger/addOrEditCEMSSystem`],
  systemEditingKey:ctPollutantManger.systemEditingKey,
  systemData:ctPollutantManger.systemData,
}))

@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isEdit: false,
      dgimn: '',
      thirdParty: true,
      dragDatas: [],
      sortTitle: '开启排序',
      sortLoading: false,
      current: 0,
      pointSaveFlag: false,
      steps: [
        '监测点信息',
        '系统信息',
        '系统更换记录',
        '仪表信息',
        '仪表更换记录',
      ],
      pointIndustryList: [],
      pointTypeList: [],
    };

  }

  componentDidMount() {
    const { configId } = this.props;
    this.reloadPage(configId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      if (nextProps.location.query.configId !== this.props.location.query.configId) {
        this.reloadPage(nextProps.location.query.configId);
      }
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
      type: 'ctPollutantManger/updateState',
      payload: {
        pointDataWhere: [
          {
            Key: 'dbo__T_Bas_CTCommonPoint__EntID',
            Value: targetId,
            Where: '$=',
          },
        ],
      },
    });
    dispatch({
      type: 'ctPollutantManger/getPointIndustryList',
      payload: {},
      callback: (res) => {
        this.setState({ pointIndustryList: res, })
      }
    })
  }

  addPoint = () => { //添加监测点 弹框
    const { form, } = this.props;
    this.setState({ visible: true, isEdit: false, dgimn: '', pointSaveFlag: false, current: 0 })
    form.resetFields();
  }
  editPoint = (row) => {
    const { dispatch, form, } = this.props;
    const { pointIndustryList } = this.state;
    const dgimn = row['dbo.T_Bas_CTCommonPoint.DGIMN'];
    const industry = row['dbo.T_Bas_CTCommonPoint.Industry']
    const pointTypeData = pointIndustryList.filter(item => item.ChildID === industry)
    this.setState({
      visible: true,
      isEdit: true,
      dgimn: dgimn,
      pointSaveFlag: true,
      pointTypeList: pointTypeData?.length ? pointTypeData[0].clist : [],
      current: 0,
    }, () => {
      form.setFieldsValue({
        id: row['dbo.T_Bas_CTCommonPoint.ID'],
        pointName: row['dbo.T_Bas_CTCommonPoint.PointName'],
        dgimn: dgimn,
        longitude: row['dbo.T_Bas_CTCommonPoint.Longitude'],
        latitude: row['dbo.T_Bas_CTCommonPoint.Latitude'],
        industry: industry,
        pointType: row['dbo.T_Bas_CTCommonPoint.PointType'],
        denitrationProcess: row['dbo.T_Bas_CTCommonPoint.DenitrationProcess'],
        desulfurizationProcess: row['dbo.T_Bas_CTCommonPoint.DesulfurizationProcess'],
        dustRemovalProcess: row['dbo.T_Bas_CTCommonPoint.DustRemovalProcess'],
      })
    });


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
  industryChange = (value) => {
    const { pointIndustryList } = this.state;
    const pointTypeData = pointIndustryList.filter(item => item.ChildID === value)
    this.setState({ pointTypeList: pointTypeData?.length ? pointTypeData[0].clist : [] })
  }

  pointInfo = (current) => {
    const { getFormDataLoading, form, location: { query: { targetId } }, } = this.props;
    const { isEdit, pointIndustryList, pointTypeList, } = this.state;
    const { getFieldDecorator } = this.props.form;
    return <Form style={{ display: current == 0 ? 'block' : 'none' }}>
      <Row>
        <FormItem hidden>
          {getFieldDecorator("id", (<Input />))}
        </FormItem>
        <FormItem hidden>
          {getFieldDecorator("entID", {
            initialValue: targetId,
          })(<Input />)}
        </FormItem>
        <Col span={12}>
          <FormItem label="监测点名称" >
            {getFieldDecorator("pointName", {
              rules: [{ required: true, message: "请输入监测点名称", }],
            })(<Input placeholder='请输入' allowClear />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="监测点编号（MN）" >
            {getFieldDecorator("dgimn", {
              rules: [{ required: true, message: "请输入监测点编号（MN）", }],
            })(<Input placeholder='请输入' allowClear />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="经度" >
            {getFieldDecorator("longitude", {
              rules: [{ required: true, message: "请输入经度", }],
            })(<SdlMap
              longitude={form.getFieldValue('longitude') ? form.getFieldValue('longitude') : null}
              latitude={form.getFieldValue('latitude') ? form.getFieldValue('latitude') : null}
              onOk={map => {
                form.setFieldsValue({ longitude: map.longitude, latitude: map.latitude });
              }}
              handleMarker
              handlePolygon
              zoom={12}
              placeholder='请输入 例如：112.236514'
            />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="纬度" >
            {getFieldDecorator("latitude", {
              rules: [{ required: true, message: "请输入维度", }],
            })(<SdlMap
              longitude={form.getFieldValue('longitude') ? form.getFieldValue('longitude') : null}
              latitude={form.getFieldValue('latitude') ? form.getFieldValue('latitude') : null}
              onOk={map => {
                form.setFieldsValue({ longitude: map.longitude, latitude: map.latitude });
              }}
              handleMarker
              handlePolygon
              zoom={12}
              placeholder='请输入 例如：85.236589'
            />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <Spin spinning={this.props.pointIndustryLoading} size='small' style={{ top: -4 }}>
            <FormItem label="行业">
              {getFieldDecorator("industry", {
                rules: [{ required: true, message: "请选择行业", }],
              })(
                <Select placeholder='请选择' allowClear onChange={(value) => this.industryChange(value)}>
                  {pointIndustryList.map(item => <Option key={item.ChildID} value={item.ChildID}>{item.Name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Spin>
        </Col>
        <Col span={12}>
          <FormItem label="监测点类型" >
            {getFieldDecorator("pointType", {
              rules: [{ required: true, message: "请选择监测点类型", }],
            })(
              <Select placeholder='请选择' allowClear>
                {pointTypeList.map(item => <Option key={item.ChildID} value={item.ChildID}>{item.Name}</Option>)}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="脱销工艺类型">
            {getFieldDecorator("denitrationProcess", {
              rules: [{ required: true, message: "请选择脱销工艺类型", }],
            })(
              <Select placeholder='请选择' allowClear>
                <Option key={'1'} value={'1'}>脱销工艺类型1</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="脱硫工艺类型">
            {getFieldDecorator("desulfurizationProcess", {
              rules: [{ required: true, message: "请选择脱硫工艺类型", }],
            })(
              <Select placeholder='请选择'>
                <Option key={'1'} value={'1'}>脱硫工艺类型1</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="除尘工艺类型">
            {getFieldDecorator("dustRemovalProcess", {
              rules: [{ required: true, message: "请选择除尘工艺类型", }],
            })(
              <Select placeholder='请选择' allowClear>
                <Option key={'1'} value={'1'}>除尘工艺类型1</Option>
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    </Form>

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
  onStepsChange = (value) => {
    const { pointSaveFlag } = this.state
    if (!pointSaveFlag) {
      message.error('请先添加监测点信息')
      return;
    }
    this.setState({
      current: value
    })
  }

  saveNext = () => {
    const { dgimn,current} = this.state;
    switch (current) {
      case 0: //监测点信息
        this.savePoint()
        break;
      case 1: //系统信息
        this.saveSystemInfo(dgimn)
        break;

    }
  }
  savePoint = () => { //监测点信息
    const { dispatch, match, pointDataWhere, form } = this.props;
    const { FormData } = this.state;
    form.validateFields((err, values) => { //监测点
      if (!err) {
        const formData = handleFormData(values);
        dispatch({
          type: 'ctPollutantManger/addOrEditCommonPointList',
          payload: { ...formData, },
          callback: () => {
            dispatch({
              type: 'autoForm/getAutoFormData',
              payload: {
                configId: pointConfigId,
                searchParams: pointDataWhere
              },
            });
            this.setState({ pointSaveFlag: true }, () => {
              this.setState({ current: 1,dgimn:formData.dgimn })
            })
          }
        });

      }

    })
  }
  saveSystemInfo = (dgimn) => { //系统信息
    const { dispatch,systemData,systemEditingKey, } = this.props;
    if (systemEditingKey) {
      message.warning('请先保存未保存的数据')
      return;
    }
    const systemList = systemData.map(item => { // 系统信息
      return {
        id:item.ID,
        systemNameID: item.SystemNameID,
        manufactorID: item.ManufactorID,
        cemsNum: item.CEMSNum,
        dgimn: dgimn,
      }
    })
    const par = {
      dgimn: dgimn,
      systemList: systemList,
    }
    dispatch({
      type: 'ctPollutantManger/addOrEditCEMSSystem',
      payload: { ...par },
      callback:()=>{
        this.setState({ current: 2 })
      }
    });
  }
  loadingStatus = () => {
    const { current } = this.state;
    const { addOrEditCommonPointLoading,operationCEMSSystemLoading, } = this.props;
    switch (current) {
      case 0:
        return addOrEditCommonPointLoading;
      case 1 :
        return operationCEMSSystemLoading;
    }
  }
  render() {
    const { searchConfigItems, searchForm, tableInfo, dispatch, pointDataWhere, addOrEditCommonPointLoading, getFormDataLoading, configInfo, } = this.props;
    const { location: { query: { targetName, targetId } } } = this.props;
    const { isEdit, thirdParty, current, steps, pointSaveFlag, dgimn, } = this.state;
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
              appendHandleRows={row => (
                <Fragment>
                  <Divider type="vertical" />
                  <Tooltip title="编辑">
                    <a
                      onClick={() => {
                        this.editPoint(row)
                      }}
                    >
                      <EditIcon />
                    </a>
                  </Tooltip>

                </Fragment>
              )}
            />
          </Card>
        </div>
        <Modal
          title={isEdit ? '编辑监测点' : '添加监测点'}
          visible={this.state.visible}
          onCancel={() => { this.setState({ visible: false }) }}
          wrapClassName={`spreadOverModal`}
          destroyOnClose
          className={styles.formModalSty}
          footer={
            <div className="steps-action">
              {current <= steps.length - 1 && (
                <Button type="primary" loading={this.loadingStatus()} onClick={() => this.saveNext()}>
                  {current === steps.length - 1 ? '保存' : '保存并下一步'}
                </Button>
              )}
              {pointSaveFlag && current < steps.length - 1 ? (
                <Button onClick={() => this.next()}>
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
          <Steps current={current} size='small' onChange={this.onStepsChange} >
            {steps.map((item) => <Step title={item} />)}
          </Steps>
          <div style={{ paddingTop: 12 }}>
            {this.pointInfo(current)}
            {<SystemInfo current={current} dgimn={dgimn} submits={this.saveSystemInfo} />}
          </div>

        </Modal>
      </BreadcrumbWrapper>
    );
  }
}
