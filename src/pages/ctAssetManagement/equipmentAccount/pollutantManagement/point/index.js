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
const pointConfigId = 'CTPoint'
const FormItem = Form.Item;
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
      thirdParty:true,
      dragDatas: [],
      sortTitle: '开启排序',
      noPaging: false,
      sortLoading: false,
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
    this.setState({ visible: true, isEdit: false,selectedPointCode:'',thirdParty:true })
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
      callback:(echoData)=>{
        this.setState({ thirdParty:echoData.ReferenceMethodSource == '2' ? false : true   });
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
              TestCompanyName: values.ReferenceMethodSource==2? values.TestCompanyName : undefined,
              TestReportNumber: values.ReferenceMethodSource==2? values.TestReportNumber: undefined,
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
  render() {
    const { searchConfigItems, searchForm, tableInfo, dispatch, pointDataWhere, loadingAddEditConfirm,getFormDataLoading, configInfo, } = this.props;
    const { location: { query: { targetName, targetId } } } = this.props;
    const { isEdit, thirdParty } = this.state;
    const noDelFlag = configInfo && configInfo.DeleteTestUser == 0 ? true : false;
    const { getFieldDecorator } = this.props.form;
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
          width={'80%'}
          confirmLoading={loadingAddEditConfirm || getFormDataLoading }
          destroyOnClose
          className={styles.formModalSty}
          bodyStyle={{ paddingBottom: 0 }}>
          {/* <SdlForm
                      configId={pointConfigId}
                      form={this.props.form}
                      noLoad
                      hideBtns
                      isEdit={this.state.isEdit}
                      keysParams={{ 'dbo.T_Bas_TestCommonPoint.ID': this.state.selectedPointCode }}
                      types='point'
                      isModal
                      isSearchParams
                    />               */}
          <Spin spinning={isEdit? getFormDataLoading : false}>
          <Form>
            <Row>
            <Col span={12}>
            <FormItem label="监测点名称" >
              {getFieldDecorator("PointName", {
                rules: [  {required: true, message: "请输入监测点名称",  } ],
              })(   <Input placeholder='请输入' allowClear/>   )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem label="调试次数" >
              {getFieldDecorator("TestCount", {
                rules: [  {required: true, message: "请输入调试次数",  } ],
              })( <InputNumber placeholder='请输入' allowClear/>)}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem label="测试人员" >
              {getFieldDecorator("TestUser", {
                rules: [  {required: true, message: "请输入测试人员",  } ],
              })(   <Input placeholder='请输入' allowClear/>   )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem label="编制人" >
              {getFieldDecorator("OrganizationUser", {
                initialValue:  Cookie.get('currentUser') && JSON.parse(Cookie.get('currentUser')) && JSON.parse(Cookie.get('currentUser')).UserName,
                rules: [  {required: true, message: "请输入编制人",  } ],
              })(   <Input placeholder='请输入' allowClear/>   )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem label="校验人" >
              {getFieldDecorator("CalibrationUser", {
                rules: [  {required: true, message: "请输入校验人",  } ],
              })(   <Input placeholder='请输入' allowClear/>   )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem label="批准人" >
              {getFieldDecorator("ApprovalUser", {
                rules: [  {required: true, message: "请输入批准人",  } ],
              })(   <Input placeholder='请输入' allowClear/>   )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem  label="安装完成时间">
              {getFieldDecorator("InstallationTime", {
                rules: [{  required: true,   message: "请选择安装完成时间",  }],
              })(
                <DatePicker />
              )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem  label="检测开始日期">
              {getFieldDecorator("BeginTime", {
                rules: [{  required: true,   message: "请选择检测开始日期",  }],
              })(
                <DatePicker />
              )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem  label="检测结束日期">
              {getFieldDecorator("EndTime", {
                rules: [{  required: true,   message: "请选择检测结束日期",  }],
              })(
                <DatePicker />
              )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem  label="校准颗粒物方法">
              {getFieldDecorator("CalibrationCEMS", {
                initialValue: '1',
                rules: [{  required: true,   message: "请选择校准颗粒物方法",  }],
              })(
                <Radio.Group>
                <Radio value={'1'}>一元线性方程法</Radio>
                <Radio value={'2'}>K系数法</Radio>
              </Radio.Group>
              )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem  label="流速CMS调试检测">
              {getFieldDecorator("FlowCEMS", {
                initialValue: '1',
                rules: [{  required: true,   message: "请选择流速CEMS调试检测",  }],
              })(
                <Radio.Group>
                <Radio value={'1'}>不带准确度</Radio>
                <Radio value={'2'}>带准确度</Radio>
              </Radio.Group>
              )}
            </FormItem>
             <span className='red' style={{position:'absolute',top:10,left:360}}>(除监管部门明确要求外，不选择此项)</span>
            </Col>
            <Col span={12}>
            <FormItem  label="检测完成状态">
              {getFieldDecorator("Status", {
                initialValue:'1',
                rules: [{  required: true,   message: "请选择检测完成状态",  }],
              })(
                <Radio.Group>
                <Radio value={'1'}>检测中</Radio>
                <Radio value={'2'}>已完成</Radio>
              </Radio.Group>
              )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem  label="参比方法数据来源">
              {getFieldDecorator("ReferenceMethodSource", {
                initialValue:1,
                rules: [{  required: true,   message: "请选择检测完成状态",  }],
              })(
                <Radio.Group onChange={(e)=>{
                  this.setState({
                    thirdParty : e.target.value==2? false : true
                  })
                }}>
                <Radio value={1}>自测</Radio>
                <Radio value={2}>第三方报告</Radio>
              </Radio.Group>
              )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem label="第三方检测公司的名称" hidden={thirdParty}>
              {getFieldDecorator("TestCompanyName", {
                rules: [  {required: !thirdParty, message: "请输入第三方检测公司的名称",  } ],
              })(   <Input placeholder='请输入' allowClear/>   )}
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem label="报告编号" hidden={thirdParty}>
              {getFieldDecorator("TestReportNumber", {
                rules: [  {required: !thirdParty, message: "请输入报告编号",  } ],
              })(   <Input placeholder='请输入' allowClear/>   )}
            </FormItem>
            </Col>
            </Row>
          </Form>
          </Spin>
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
