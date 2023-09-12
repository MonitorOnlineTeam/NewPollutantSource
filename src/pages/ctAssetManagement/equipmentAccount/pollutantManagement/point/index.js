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
import SdlMap from '@/pages/AutoFormManager/SdlMap'
import SystemInfo from '../components/SystemInfo'
import SystemReplaceRecord from '../components/SystemReplaceRecord'
import InstrumentInfo from '../components/InstrumentInfo'
import InstrumentReplaceRecord from '../components/InstrumentReplaceRecord'

const pointConfigId = 'CTPoint'
const FormItem = Form.Item;
const { Step } = Steps;
@connect(({ loading, autoForm, ctPollutantManger, global,common, }) => ({
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
  addOrEditCEMSSystemLoading: loading.effects[`ctPollutantManger/addOrEditCEMSSystem`],
  systemEditingKey: ctPollutantManger.systemEditingKey,
  systemData: ctPollutantManger.systemData,
  addOrEditCEMSSystemChangeLoading: loading.effects[`ctPollutantManger/addOrEditCEMSSystemChange`],
  systemChangeEditingKey: ctPollutantManger.systemChangeEditingKey,
  systemChangeData: ctPollutantManger.systemChangeData,
  addOrEditEquipmentLoading: loading.effects[`ctPollutantManger/addOrEditEquipment`],
  deviceEditingKey: ctPollutantManger.deviceEditingKey,
  deviceData: ctPollutantManger.deviceData,
  addOrEditEquipmentChangeLoading: loading.effects[`ctPollutantManger/addOrEditEquipmentChange`],
  deviceChangeEditingKey: ctPollutantManger.deviceChangeEditingKey,
  deviceChangeData: ctPollutantManger.deviceChangeData,
  saveSortLoading: loading.effects[`ctPollutantManger/pointSort`],
  projectModelList: common.ctProjectList,
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
      loadFlag: false,
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
        this.setState({ pointIndustryList: res,loadFlag:true, })
      }
    })
  }

  addPoint = () => { //添加监测点 弹框
    const { form, } = this.props;
    this.setState({ visible: true, isEdit: false, dgimn: '', pointId: '', pointSaveFlag: false, current: 0 })
    form.resetFields();
  }
  editPoint = (row) => {
    const { dispatch, form, } = this.props;
    const { pointIndustryList } = this.state;
    const dgimn = row['dbo.T_Bas_CTCommonPoint.ID'];
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
        dgimn: row['dbo.T_Bas_CTCommonPoint.DGIMN'],
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
  dragData = (data) => {
    this.setState({
      dragDatas: data
    })
  }
  getAutoFormDataNoPage = (callback) => {
    this.props.dispatch({
      type: `autoForm/getAutoFormData`,
      payload: {
        configId: pointConfigId,
        searchParams: this.props.pointDataWhere,
        otherParams: {
          SortFileds: 'Sort',
          IsAsc: true,
          pageIndex: 1,
          pageSize: 100000,
        }
      },
      callback: () => {
        callback && callback()
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
    const pointIdList = dragDatas.map(item => item['dbo.T_Bas_CTCommonPoint.ID'])
    if (pointIdList && pointIdList[0]) {
      this.props.dispatch({
        type: `ctPollutantManger/pointSort`,
        payload: {
          ListPointId: pointIdList,
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
              // rules: [{ required: false, message: "请输入监测点编号（MN）", }],
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
    const { dgimn, current, } = this.state;
    switch (current) {
      case 0: //监测点信息
        this.savePoint()
        break;
      case 1: //系统信息
        this.saveSystemInfo(dgimn)
        break;
      case 2: //系统更换记录
        this.saveSystemChangeInfo(dgimn)
        break;
      case 3: //仪表信息
        this.saveInstrumentInfo(dgimn)
        break;
      case 4: //仪表更换记录
        this.saveInstrumentChangeInfo(dgimn)
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
          callback: (res) => {
            this.setState({ pointSaveFlag: true }, () => {
              this.setState({ current: 1, dgimn: res.Datas })
            })
            dispatch({
              type: 'autoForm/getAutoFormData',
              payload: {
                configId: pointConfigId,
                searchParams: pointDataWhere
              },
            });
          }
        });

      }

    })
  }
  saveSystemInfo = (dgimn) => { //系统信息
    const { dispatch, systemData, systemEditingKey, } = this.props;
    if (systemEditingKey) {
      message.warning('请先保存未保存的数据')
      return;
    }
    const systemList = systemData.map(item => { // 系统信息
      return {
        id: item.ID?.length == 25 ? '' : item.ID,
        dgimn: dgimn,
        systemNameID: item.SystemNameID,
        manufactorID: item.ManufactorID,
        cemsNum: item.CEMSNum,
      }
    })
    const par = {
      dgimn: dgimn,
      systemList: systemList,
    }
    dispatch({
      type: 'ctPollutantManger/addOrEditCEMSSystem',
      payload: { ...par },
      callback: () => {
        this.setState({ current: 2 })
      }
    });
  }
  saveSystemChangeInfo = (dgimn) => { //系统更换记录
    const { dispatch, systemChangeData, systemChangeEditingKey, } = this.props;
    if (systemChangeEditingKey) {
      message.warning('请先保存未保存的数据')
      return;
    }

    const systemChangeList = systemChangeData.map(item => { // 系统信息
      return {
        id: item.ID?.length == 25 ? '' : item.ID,
        dgimn: dgimn,
        projectId: item.ProjectID,
        aSystemNameID: item.ASystemNameID,
        aManufactorID: item.AManufactorID,
        acemsNum: item.ACEMSNum,
        bSystemNameID: item.BSystemNameID,
        bManufactorID: item.BManufactorID,
        bcemsNum: item.BCEMSNum,
      }
    })
    const par = {
      dgimn: dgimn,
      systemChangeList: systemChangeList,
    }
    dispatch({
      type: 'ctPollutantManger/addOrEditCEMSSystemChange',
      payload: { ...par },
      callback: () => {
        this.setState({ current: 3 })
        dispatch({
          type: 'ctPollutantManger/getCEMSSystemList',
          payload: { dgimn: dgimn },
          callback: (data) => {
            dispatch({
              type: 'ctPollutantManger/updateState',
              payload: { systemChangeData: data.systemModelChangeList?.length ? data.systemModelChangeList : [] },
            });
          }
        });
      }
    });
  }
  saveInstrumentInfo = (dgimn) => { //仪表信息
    const { dispatch, deviceData, deviceEditingKey, } = this.props;
    if (deviceEditingKey) {
      message.warning('请先保存未保存的数据')
      return;
    }
    const deviceList = deviceData.map(item => { // 系统信息
      return {
        id: item.ID?.length == 25 ? '' : item.ID,
        pointId: dgimn,
        pollutantCode: item.PollutantCode,
        manufactorID: item.ManufactorID,
        factoryNumber: item.FactoryNumber,
      }
    })
    const par = {
      dgimn: dgimn,
      equipmentList: deviceList,
    }
    dispatch({
      type: 'ctPollutantManger/addOrEditEquipment',
      payload: { ...par },
      callback: () => {
        this.setState({ current: 4 })
        dispatch({
          type: 'ctPollutantManger/getCEMSSystemList',
          payload: { dgimn: dgimn },
          callback: (data) => {
            dispatch({
              type: 'ctPollutantManger/updateState',
              payload: { deviceData: data.eqModelList?.length ? data.eqModelList : [] },
            });
          }
        });
      }
    });
  }
  saveInstrumentChangeInfo = (dgimn) => {
    const { dispatch, deviceChangeData, deviceChangeEditingKey, } = this.props;
    if (deviceChangeEditingKey) {
      message.warning('请先保存未保存的数据')
      return;
    }
    const deviceChangeList = deviceChangeData.map(item => { // 系统信息
      return {
        id: item.ID?.length == 25 ? '' : item.ID,
        pointId: dgimn,
        projectId: item.ProjectID,
        aPollutantCode: item.PollutantCode,
        aManufactorID: item.AManufactorID,
        aFactoryNumber: item.AFactoryNumber,
        bPollutantCode: item.PollutantCode,
        bManufactorID: item.BManufactorID,
        bFactoryNumber: item.BFactoryNumber,
      }
    })
    const par = {
      dgimn: dgimn,
      equipmentChangeList: deviceChangeList,
    }
    console.log(deviceChangeList)
    dispatch({
      type: 'ctPollutantManger/addOrEditEquipmentChange',
      payload: { ...par },
      callback: () => {
        dispatch({
          type: 'ctPollutantManger/getCEMSSystemList',
          payload: { dgimn: dgimn },
          callback: (data) => {
            dispatch({
              type: 'ctPollutantManger/updateState',
              payload: { deviceChangeData: data.eqModelChangeList?.length ? data.eqModelChangeList : [] },
            });
          }
        });
      }
    });
  }
  loadingStatus = () => {
    const { current } = this.state;
    const { addOrEditCommonPointLoading, addOrEditCEMSSystemLoading, addOrEditCEMSSystemChangeLoading, addOrEditEquipmentLoading, addOrEditEquipmentChangeLoading, } = this.props;
    switch (current) {
      case 0:
        return addOrEditCommonPointLoading;
      case 1:
        return addOrEditCEMSSystemLoading;
      case 2:
        return addOrEditCEMSSystemChangeLoading;
      case 3:
        return addOrEditEquipmentLoading;
      case 4:
        return addOrEditEquipmentChangeLoading;
    }
  }
  render() {
    const { searchConfigItems, searchForm, tableInfo, dispatch, pointDataWhere, addOrEditCommonPointLoading, getFormDataLoading, configInfo, saveSortLoading, } = this.props;
    const { location: { query: { targetName, targetId } } } = this.props;
    const { isEdit, thirdParty, current, steps, pointSaveFlag, dgimn, sortTitle,loadFlag, } = this.state;
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
              otherParams={{ SortFileds: 'Sort', IsAsc: true, }}
            ></SearchWrapper>
            {loadFlag&&<AutoFormTable
              dragable={sortTitle === '关闭排序' ? true : false}
              dragData={(data) => { this.dragData(data) }}
              noPaging={this.state.noPaging}
              saveSortLoading={saveSortLoading}
              style={{ marginTop: 10 }}
              configId={pointConfigId}
              resizable
              isCenter
              isFixedOpera
              otherParams={{ SortFileds: 'Sort', IsAsc: true, }}
              {...this.props}
              type='company'
              searchParams={pointDataWhere}
              onAdd={() => { //添加
                this.addPoint();
              }}
              appendHandleButtons={(selectedRowKeys, selectedRows) => (
                <Fragment>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.updateSort()
                    }}
                    style={{ marginRight: 8 }}
                    loading={this.state.sortLoading}
                    disabled={tableInfo[pointConfigId] && tableInfo[pointConfigId].dataSource && tableInfo[pointConfigId].dataSource.length >= 2 ? false : true}
                  >
                    {sortTitle}
                  </Button>
                  {sortTitle === '关闭排序' ?
                    <Button
                      onClick={() => {
                        this.saveSort()
                      }}
                      style={{ marginRight: 8 }}
                      loading={saveSortLoading}
                    >
                      保存排序
                </Button> : null}
                </Fragment>
              )}
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
            />}
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
            {<SystemInfo current={current} dgimn={dgimn} />}
            {<SystemReplaceRecord current={current} dgimn={dgimn} />}
            {<InstrumentInfo current={current} dgimn={dgimn} />}
            {<InstrumentReplaceRecord current={current} dgimn={dgimn} />}

          </div>

        </Modal>
      </BreadcrumbWrapper>
    );
  }
}
