import React, { Component, Fragment } from 'react';
import { RollbackOutlined, ToolOutlined, HighlightOutlined, DownOutlined, EllipsisOutlined, FileTextOutlined, UnlockFilled, RotateLeftOutlined } from '@ant-design/icons';
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
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
  message,
  DatePicker,
  InputNumber,
  Tooltip,
  Tabs,
  Checkbox,
} from 'antd';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { router } from 'umi'
import styles from './index.less';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { sdlMessage, handleFormData, getRowCuid } from '@/utils/utils';
import PollutantType from '@/pages/AutoFormManager/PollutantType';
import SdlForm from '@/pages/AutoFormManager/SdlForm';
import AutoFormViewItems from '@/pages/AutoFormManager/AutoFormViewItems';
import config from '@/config';
import SelectPollutantType from '@/components/SelectPollutantType'
import AnalyzerManage from './AnalyzerManage';
import MonitoringStandard from '@/components/MonitoringStandard';
import DeviceManager from './components/deviceManager';
const { TabPane } = Tabs;
const { confirm } = Modal;
let pointConfigId = '';
let pointConfigIdEdit = '';

@connect(({ loading, autoForm, monitorTarget, common, point, global }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  otherloading: loading.effects['monitorTarget/getPollutantTypeList'],
  saveLoadingAdd: loading.effects['point/addPoint'],
  saveLoadingEdit: loading.effects['point/editPoint'],
  addMonitorPointVerificationLoading: loading.effects['point/addMonitorPointVerificationItem'],
  getMonitorPointVerificationItemLoading: loading.effects['point/getMonitorPointVerificationItem'] || false,
  addPointParamInfoLoading: loading.effects['point/addPointParamInfo'],
  getParamInfoListLoading: loading.effects['point/getParamInfoList'] || false,
  getPointCoefficientListLoading: loading.effects[`point/getPointCoefficientByDGIMN`] || false,
  addOrEditPointCoefficientLoading: loading.effects['operaAchiev/addOrEditPointCoefficient'],
  autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  pointDataWhere: monitorTarget.pointDataWhere,
  isEdit: monitorTarget.isEdit,
  defaultPollutantCode: common.defaultPollutantCode,
  configInfo: global.configInfo,
  CorporationCode: point.CorporationCode,
  pointVerificationList: point.pointVerificationList,
  pointRealTimeList: point.pointRealTimeList,
  pointHourItemList: point.pointHourItemList,
  paramCodeList: point.paramCodeList,
  updatePointDGIMNLoading: loading.effects['point/updatePointDGIMN'],
  saveSortLoading: loading.effects['point/pointSort'],

}))
@Form.create()
export default class MonitorPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pollutantType: 2,
      visible: false,
      FormDatas: {},
      selectedPointCode: '',
      isView: false,
      Mvisible: false,
      PointCode: '',
      DGIMN: '',
      FormData: null,
      tabKey: "1",
      MNVisible: false,
      deviceManagerVisible: false,
      itemCode: [],
      realtimePollutantCode: [],
      hourPollutantCode: [],
      pointCoefficientVal: '',//监测点系数
      pointCoefficientFlag: false,
      deviceManagerGasType: 1,
      dragDatas: [],
      sortTitle: '开启排序',
      noPaging: false,
      sortLoading: false,
      loadFlag: false,
    };
  }

  componentDidMount() {
    // 1.监控目标ID
    // 2.污染物类型
    // 3.获取监测点数据
    const { dispatch, match } = this.props;
    console.log('match=', match);
    dispatch({
      type: 'point/getPointList',
      payload: {
        TargetId: match.params.targetId,
        callback: res => {
          this.getPageConfig(this.state.pollutantType);
        },
      },
    });


  }


  getPageConfig = type => {
    this.setState({
      pollutantType: type,
    });
    const { dispatch, match, configInfo } = this.props;
    // 1	废水
    // 2	废气
    // 3	噪声
    // 4	固体废物
    // 5	环境质量
    // 6	水质
    // 8	小型站
    // 9	恶臭
    // 10	voc
    // 11	工况
    // 12	扬尘
    // 18	颗粒物
    // 23	国控
    // 24	省控
    // 25	市控

    try {
      const { SystemPollutantTypeConfigId } = configInfo;
      const configIds = SystemPollutantTypeConfigId.split(',');
      let thisConfigId = null;
      if (configIds.length > 0) {
        thisConfigId = configIds.filter(m => m.split(':')[0] == type);
        if (thisConfigId.length > 0) {
          pointConfigIdEdit = thisConfigId[0].split(':')[1];
          pointConfigId = `${pointConfigIdEdit}New`;
        }
      }
      dispatch({
        type: 'point/getParamCodeList', //设备参数项码表
        payload: { pollutantType: type },
        callback: () => { this.setState({ loadFlag: true, }) }
      });
      dispatch({
        type: 'point/getMonitorPointVerificationList', //获取数据核查信息码表
        payload: { pollutantType: type },
      });
    } catch (e) {
      // sdlMessage('AutoForm配置发生错误，请联系系统管理员', 'warning');
    }

    switch (type) {
      case 1:
        // 废水
        // pointConfigId = 'WaterOutputNew';
        // pointConfigIdEdit = 'WaterOutput';
        break;
      case 2:
        // 废气
        // pointConfigId = 'GasOutputNew';
        // pointConfigIdEdit = 'GasOutput';
        break;
      case 3:
        // 噪声
        break;
      case 4:
        break;
    }
    dispatch({
      type: 'monitorTarget/updateState',
      payload: {
        pollutantType: type,
        pointDataWhere: [
          {
            Key: 'dbo__T_Cod_MonitorPointBase__BaseCode',
            Value: match.params.targetId,
            Where: '$=',
          },
        ],
      },
    });
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: pointConfigId,
      },
    });
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: pointConfigIdEdit,
      },
    });
  };

  /** 设置运维周期 */
  showMaintenancereminder = DGIMN => {
    this.setState({
      Mvisible: true,
      DGIMN,
    })
  }

  handleMCancel = () => {
    this.setState({
      Mvisible: false,
    });
  }

  showModal = PointCode => {
    const { dispatch } = this.props;
    if (PointCode) {
      this.setState({
        visible: true,
        isEdit: true,
        selectedPointCode: PointCode,
        tabKey: "1"
      });
      dispatch({
        type: 'autoForm/getFormData',
        payload: {
          configId: pointConfigIdEdit,
          'dbo.T_Bas_CommonPoint.PointCode': PointCode,
        },
      });
    } else {
      this.setState({
        visible: true,
        isEdit: false,
        selectedPointCode: '',
        FormData: null,
        tabKey: "1"
      });
    }
  };



  onSubmitForm() {
    const { dispatch, match, pointDataWhere, form } = this.props;
    const { FormData } = this.state;
    if (this.state.tabKey == 2) { //污染物信息
      this.modelClose()
    } else if (this.state.tabKey == 3) { //数据核查项
      dispatch({
        type: 'point/addMonitorPointVerificationItem',
        payload: {
          ID: '',
          DGIMN: FormData["dbo.T_Cod_MonitorPointBase.DGIMN"] || FormData["DGIMN"],
          ItemCode: this.state.itemCode ? this.state.itemCode.toString() : '',
          RealtimePollutantCode: this.state.realtimePollutantCode ? this.state.realtimePollutantCode.toString() : '',
          HourPollutantCode: this.state.hourPollutantCode ? this.state.hourPollutantCode.toString() : '',
          PlatformNum: this.state.platformNum,
        },
      });
    } else if (this.state.tabKey == 4) { //设备参数项
      dispatch({
        type: 'point/addPointParamInfo',
        payload: {
          pollutantType: this.state.pollutantType,
          DGIMN: FormData["dbo.T_Cod_MonitorPointBase.DGIMN"] || FormData["DGIMN"],
          pollutantList: this.state.equipmentPol ? this.state.equipmentPol : '',

        },
      })
    } else if (this.state.tabKey == 5) { //监测点系数
      const { pointCoefficientVal } = this.state;
      if (!pointCoefficientVal && pointCoefficientVal !== 0) {
        message.warning('请输入监测点系数')
        return;
      }
      if (pointCoefficientVal <= 0) {
        message.warning('请输入大于0的监测点系数')
        return;
      }
      dispatch({
        type: 'operaAchiev/addOrEditPointCoefficient',
        payload: {
          DGIMN: FormData["dbo.T_Cod_MonitorPointBase.DGIMN"] || FormData["DGIMN"],
          Coefficient: this.state.pointCoefficientVal,
        },
        callback: () => {
          this.setState({ pointCoefficientFlag: true })
        }
      })

    } else {
      form.validateFields((err, values) => {
        if (!err) {
          const FormData = handleFormData(values);
          if (!Object.keys(FormData).length) {
            sdlMessage('数据为空', 'error');
            return false;
          }
          if (this.state.isEdit) {
            FormData.PointCode = this.state.selectedPointCode;
          }
          FormData['DGIMN'] = FormData['DGIMN'] && FormData['DGIMN'].toLowerCase();
          const payload = {
            BaseType: match.params.targetType,
            TargetId: match.params.targetId,
            Point: { ...FormData, },
          };

          dispatch({
            type: !this.state.isEdit ? 'point/addPoint' : 'point/editPoint',
            payload: {
              FormData: { ...payload },
              callback: result => {
                if (result.IsSuccess) {
                  // this.setState({
                  //   visible: false,
                  // });
                  dispatch({
                    type: 'autoForm/getAutoFormData',
                    payload: {
                      configId: pointConfigId,
                      searchParams: pointDataWhere,
                    },
                  });
                }
              },
            },
          });
          this.setState({
            FormData: { ...FormData, },
          })
        }
      });
    }
  }

  delPoint(PointCode, DGIMN) {
    const { dispatch, match, pointDataWhere } = this.props;
    const { pollutantType } = this.state;
    dispatch({
      type: 'point/delPoint',
      payload: {
        configId: pointConfigIdEdit,
        targetId: match.params.targetId,
        targetType: match.params.targetType,
        pollutantType,
        DGIMN,
        PointCode,
        callback: result => {
          if (result.IsSuccess) {
            dispatch({
              type: 'autoForm/getAutoFormData',
              payload: {
                configId: pointConfigId,
                searchParams: pointDataWhere,
              },
            });
          }
        },
      },
    });
  }

  onPollutantChange = e => {
    console.log(e);
    this.getPageConfig(e.target.value);
  }


  showDeleteConfirm = (PointCode, DGIMN) => {
    console.log(PointCode);
    const that = this;
    const { dispatch } = this.props;
    // console.log("row=", row);
    confirm({
      title: '确定要删除该条数据吗？',
      content: '删除后不可恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.delPoint(PointCode, DGIMN);
      },
      onCancel() {
      },
    });
  }

  loadReportList = re => {
    console.log('res=', re)
  }

  cancal = () => {
    this.setState({
      visible: false,
      isEdit: false,
      selectedPointCode: '',
      isView: false,
      itemCode: [],
      realtimePollutantCode: [],
      hourPollutantCode: [],
      platformNum: '',
      FormData: null,
      tabKey: "1"
    });
  }
  handleCancel = e => { //右上角
    // this.setState({
    //   visible: false,
    //   isEdit: false,
    //   selectedPointCode: '',
    //   isView: false,
    //   itemCode:[],
    //   realtimePollutantCode:[],
    //   hourPollutantCode:[],
    //   platformNum:'',
    // });
    this.cancal();
  };

  modelClose = () => {
    // this.setState({
    //   visible: false,
    //   FormData:null,
    //   tabKey:"1"
    // })
    this.cancal();
  }


  /***
   * 站点信息维护tabchange
   */
  onTabPaneChange = (key) => {

    const { selectedPointCode, FormData } = this.state;
    if (key != "1") {

      if (this.state.selectedPointCode || FormData) {
        // this.props.dispatch({
        //   type: 'autoForm/getPageConfig',
        //   payload: {
        //     configId: 'service_StandardLibrary',
        //   },
        //  });
      } else {
        message.error("请先保存站点信息！")
        return;
      }

    }
    this.setState({
      tabKey: key
    });
  }

  getTabInfo = () => {

    const { FormData } = this.state;
    console.log("FormData=", FormData)
    if (FormData)
      return <MonitoringStandard noload DGIMN={FormData["dbo.T_Cod_MonitorPointBase.DGIMN"] || FormData["DGIMN"]}
        pollutantType={FormData["dbo.T_Bas_CommonPoint.PollutantType"] || FormData["PollutantType"]} />
  }
  getDataVerification = () => {

    return <Spin spinning={this.props.getMonitorPointVerificationItemLoading}>
      <div className={styles.dataVerificationSty}>
        <div style={{ color: '#f5222d', paddingBottom: 16, paddingLeft: 112 }}>以下选项根据监测点现场真实情况进行填写，设置的选项作为数据一致性核查电子表单中的检查项字段，有则填写。</div>
        <Form.Item label="核查项" >
          <Checkbox.Group value={this.state.itemCode} options={this.props.pointVerificationList} onChange={this.dataVerificationChange} />
        </Form.Item>
        <Form.Item label="实时数据一致性核查因子" >
          <Checkbox.Group value={this.state.realtimePollutantCode} options={this.props.pointRealTimeList} onChange={this.realtimePollutantChange} />
        </Form.Item>
        {/* <Form.Item label="小时日数据一致性核查因子" >
          <Checkbox.Group value={this.state.hourPollutantCode}  options={this.props.pointHourItemList} onChange={this.hourPollutantChange} />
         </Form.Item> */}
        <Form.Item label="监控平台数量" className='inputSty' >
          <InputNumber style={{ width: '50%', }} value={this.state.platformNum} placeholder='请输入' onChange={this.platformNumChange} />
          <span style={{ color: '#f5222d', paddingLeft: 10 }}>填写现场监测点数据转发到几个监控平台，请填写数量。</span>
        </Form.Item>
        {this.createComponents(this.state.createUserName1,this.state.createTime1,this.state.updUserName1,this.state.updTime1)}
      </div>
    </Spin>
  }

  dataVerificationChange = (val) => { //核查项 多选
    this.setState({ itemCode: val })
  }
  realtimePollutantChange = (val) => {
    this.setState({ realtimePollutantCode: val })
  }
  hourPollutantChange = (val) => {
    this.setState({ hourPollutantCode: val })
  }

  platformNumChange = (value) => {//核查项 平台数量
    this.setState({ platformNum: value })
  }

  pointCoefficientChange = (value) => { //监测点系数
    this.setState({ pointCoefficientVal: value })
  }
  createComponents = (createUserName,createTime,updUserName,updTime) => {
    const {isEdit } = this.state;
    return isEdit&&<Form.Item>
      <Row>
        <Col>创建人：{createUserName}</Col>
        <Col offset={2}>创建时间：{createTime}</Col>
        <Col offset={2}>更新人：{updUserName}</Col>
        <Col offset={2}>更新时间：{updTime}</Col>
      </Row>
    </Form.Item>
  }
  getEquipmentPar = () => { //设备参数项
    return <Spin spinning={this.props.getParamInfoListLoading}>
      <div className={styles.deviceParSty}>
        <div style={{ color: '#f5222d', paddingBottom: 16 }}> 设备参数类别是异常小时数记录电子表单的一个字段，设置后，运维工程师才能在APP上填写。</div>
        <Form.Item label="设备参数类别" >
          <Checkbox.Group value={this.state.equipmentPol} options={this.props.paramCodeList} onChange={this.equipmentParChange} />
        </Form.Item>
        {this.createComponents(this.state.createUserName2,this.state.createTime2,this.state.updUserName2,this.state.updTime2)}
      </div>
    </Spin>
  }
  getPointCoefficient = () => { //监测点系数

    const { pointCoefficientFlag } = this.state;

    return <Spin spinning={this.props.getPointCoefficientListLoading}>
      <div  className={styles.pointCoefficientSty}>
        <Form.Item label='监测点系数' className='inputSty'>
          <InputNumber disabled={pointCoefficientFlag} value={this.state.pointCoefficientVal} style={{ width: 200 }} placeholder='请输入' onChange={this.pointCoefficientChange} />
          {pointCoefficientFlag && <span style={{ paddingLeft: 10 }} className='red'>如需修改系数，请联系管理员</span>}
        </Form.Item>
        {this.createComponents(this.state.createUserName3,this.state.createTime3,this.state.updUserName3,this.state.updTime3)}
      </div>
    </Spin>
  }
  equipmentParChange = (val) => {
    this.setState({ equipmentPol: val })
  }
  dragData = (data) => {
    console.log(data)
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
    const mnList = dragDatas.map(item => item['dbo.T_Bas_CommonPoint.DGIMN'])
    if (mnList && mnList[0]) {
      this.props.dispatch({
        type: `point/pointSort`,
        payload: {
          mnList: mnList,
        },
        callback: (isSuccess) => {
          if (isSuccess) {


            //  if(this.props.tableInfo&&this.props.tableInfo[pointConfigId]){
            //   this.props.dispatch({
            //     type: `autoForm/updateState`,
            //     payload:{
            //        tableInfo:{...this.props.tableInfo,[pointConfigId]:{...this.props.tableInfo[pointConfigId],dataSource:dragDatas}}
            //       },
            //   })  
            // }
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
  editMN = (MN) => {
    this.setState({
      MNVisible: true,
      MNEcho: MN
    })
  }
  deviceManager = (row) => {


    this.setState({
      deviceManagerVisible: true,
      deviceManagerMN: row["dbo.T_Bas_CommonPoint.DGIMN"],
      deviceManagerGasType: row["dbo.T_Bas_CommonPoint.Col4"]
    })
  }
  onSubmitMN = e => {
    const { dispatch, pointDataWhere } = this.props;

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (values.newMN) {
        dispatch({
          type: 'point/updatePointDGIMN',
          payload: {
            oldDGIMN: this.state.MNEcho,
            newDGIMN: values.newMN
          },
          callback: () => {
            this.setState({ MNVisible: false })
            dispatch({
              type: 'autoForm/getAutoFormData',
              payload: {
                configId: pointConfigId,
                searchParams: pointDataWhere,
              },
            });
          }
        })

      } else {

        message.error('新设备编号(MN)不能为空！')
      }
    });

  }
  onMenuClick = ({ key }) => {
    const { row } = this.state;

    if (key == 3) { //设置Cems参数
      this.showMaintenancereminder(row['dbo.T_Bas_CommonPoint.PointCode'])
    }
    if (key == 4) { //修改mn号
      this.editMN(row['dbo.T_Bas_CommonPoint.DGIMN']);
    }
    if (key == 5) { //设备管理
      this.deviceManager(row)
    }
  };

  loadingStatus = () => {
    const { tabKey } = this.state;
    const { saveLoadingAdd, saveLoadingEdit, addMonitorPointVerificationLoading, addPointParamInfoLoading, addOrEditPointCoefficientLoading, } = this.props;
    if (tabKey == 1) {
      return !this.state.isEdit ? saveLoadingAdd : saveLoadingEdit
    }
    if (tabKey == 3) { //数据核查项
      return addMonitorPointVerificationLoading

    }
    if (tabKey == 4) { //设备参数
      return addPointParamInfoLoading

    }
    if (tabKey == 5) { //监测点系数
      return addOrEditPointCoefficientLoading

    }
  }
  render() {
    const {
      searchConfigItems,
      searchForm,
      tableInfo,
      match: {
        params: { targetName, configId, pollutantTypes },
      },
      dispatch,
      pointDataWhere,
      isEdit,
      saveLoadingAdd,
      saveLoadingEdit,
      saveSortLoading,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const searchConditions = searchConfigItems[pointConfigId] || [];
    const columns = tableInfo[pointConfigId] ? tableInfo[pointConfigId].columns : [];
    if (this.props.loading || this.props.otherloading) {
      return (
        <Spin
          style={{
            width: '100%',
            height: 'calc(100vh/2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          size="large"
        />
      );
    }
    const menu = (
      <Menu onClick={this.onMenuClick} >
        <Menu.Item key="3"> <Tooltip title="设置Cems参数"> <a><ToolOutlined style={{ fontSize: 16 }} /></a> </Tooltip></Menu.Item>
        <Menu.Item key="4"> <Tooltip title="修改设备编号(MN)">  <a><HighlightOutlined style={{ fontSize: 16 }} /></a></Tooltip></Menu.Item>
        <Menu.Item key="5"><Tooltip title="设备管理"> <a><FileTextOutlined style={{ fontSize: 16 }} /></a>  </Tooltip></Menu.Item>

      </Menu>
    );
    const { tabKey, pointCoefficientFlag, pollutantType, deviceManagerGasType, sortTitle, } = this.state;
    const pointFlag = tabKey == 5 && pointCoefficientFlag;
    return (
      <BreadcrumbWrapper title="监测点维护">
        <div className={styles.cardTitle}>
          <Card
            title={
              <span>
                {targetName}
                <Button
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    // history.go(-1);
                    router.push({
                      pathname: `/platformconfig/basicInfo/monitortarget/AEnterpriseTest/1/1,2`,
                      query: {thisPage :true},
                  });
                  }}
                  type="link"
                  size="small"
                >
                  <RollbackOutlined />
                  返回上级
                </Button>
              </span>
            }
            // extra={<PollutantType handlePollutantTypeChange={this.getPageConfig} />}
            extra={this.state.loadFlag && <SelectPollutantType
              style={{ marginLeft: 50, float: 'left' }}
              showType="radio"
              onChange={this.onPollutantChange}
              defaultValue={this.state.pollutantType}
              filterPollutantType={pollutantTypes}
            />}
          >

            {
              pointConfigId && <SearchWrapper
                // onSubmitForm={form => this.loadReportList(form)}
                searchParams={pointDataWhere}
                configId={pointConfigIdEdit}
                resultConfigId={pointConfigId}
                otherParams={{ SortFileds: 'Sort', IsAsc: true, }}
              ></SearchWrapper>
            }
            {

              pointConfigId && this.state.loadFlag  && (<AutoFormTable
                dragable={sortTitle === '关闭排序' ? true : false}
                dragData={(data) => { this.dragData(data) }}
                noPaging={this.state.noPaging}
                saveSortLoading={saveSortLoading}
                style={{ marginTop: 10 }}
                // columns={columns}
                configId={pointConfigId}
                rowChange={(key, row) => {
                  this.setState({
                    key,
                    row,
                  });
                }}
                isFixedOpera
                otherParams={{ SortFileds: 'Sort', IsAsc: true, }}
                onAdd={() => {
                  this.showModal();
                  this.setState({
                    pointCoefficientVal: undefined,
                    pointCoefficientFlag: false,
                  })
                  // this.setState({
                  //   cuid: getRowCuid(columns, row)
                  // })
                }}
                searchParams={pointDataWhere}
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


                    <Tooltip title="编辑">
                      <a
                        onClick={() => {
                          this.showModal(row['dbo.T_Bas_CommonPoint.PointCode']);
                          this.setState({
                            cuid: getRowCuid(row, 'dbo.T_Bas_CommonPoint.Photo'),
                            FormData: row
                          })
                          this.props.dispatch({ //数据核查 回显数据
                            type: 'point/getMonitorPointVerificationItem',
                            payload: {
                              DGIMN: row['dbo.T_Bas_CommonPoint.DGIMN'],
                            },
                            callback: (res) => {
                              this.setState({
                                itemCode: res && res.code ? res.code : undefined,
                                realtimePollutantCode: res && res.RealTimeItem ? res.RealTimeItem : undefined,
                                hourPollutantCode: res && res.HourItem ? res.HourItem : undefined,
                                platformNum: res && res.platformNum ? res.platformNum : undefined,
                                createUserName1: res&&res.CreateUserName,
                                createTime1: res&&res.CreateTime,
                                updUserName1: res&&res.UpdUserName,
                                updTime1: res&&res.UpdTime,
                              })
                            }
                          })

                          this.props.dispatch({ //设备参数项 回显数据
                            type: 'point/getParamInfoList',
                            payload: {
                              DGIMN: row['dbo.T_Bas_CommonPoint.DGIMN'],
                              pollutantType: this.state.pollutantType
                            },
                            callback: (codeList,res) => {
                              console.log(codeList,res,22222222222) 
                              this.setState({
                                equipmentPol: codeList && codeList[0] ? codeList : undefined,
                                createUserName2: res&&res[0]&&res[0].CreateUserName,
                                createTime2: res&&res[0]&&res[0].CreateTime,
                                updUserName2: res&&res[0]&&res[0].UpdUserName,
                                updTime2: res&&res[0]&&res[0].UpdTime,
                              })
                            }
                          })

                          this.props.dispatch({ //监测点系数 回显数据
                            type: 'point/getPointCoefficientByDGIMN',
                            payload: {
                              DGIMN: row['dbo.T_Bas_CommonPoint.DGIMN'],
                            },
                            callback: (res) => {
                              this.setState({
                                pointCoefficientVal: res ? res.PointCoefficient : undefined,
                                createUserName3: res&&res.CreateUserName,
                                createTime3: res&&res.CreateTime,
                                updUserName3: res&&res.UpdUserName,
                                updTime3: res&&res.UpdTime,
                              })
                              this.setState({
                                pointCoefficientFlag: res && res.PointCoefficient ? true : false,
                              })
                            }
                          })


                        }}
                      >
                        <EditIcon />
                      </a>
                    </Tooltip>
                    <Divider type="vertical" />
                    <Tooltip title="详情">
                      <a
                        onClick={() => {
                          this.setState({
                            visible: true,
                            isEdit: false,
                            isView: true,
                            selectedPointCode: row['dbo.T_Bas_CommonPoint.PointCode'],
                          });
                        }}
                      >
                        <DetailIcon />
                      </a>
                    </Tooltip>
                    <Divider type="vertical" />
                    <Tooltip title="删除">
                      <a onClick={() => {
                        this.showDeleteConfirm(row['dbo.T_Bas_CommonPoint.PointCode'],
                          row['dbo.T_Bas_CommonPoint.DGIMN']);
                      }}><DelIcon />    </a>
                    </Tooltip>
                    {/* {
                      row['dbo.T_Bas_CommonPoint.PollutantType'] === '2' ? <><Divider type="vertical" />
                        <Tooltip title="设置Cems参数">
                          <a onClick={() => {
                            this.showMaintenancereminder(row['dbo.T_Bas_CommonPoint.PointCode']);
                          }}><ToolOutlined style={{fontSize:16}}/></a>
                        </Tooltip></> : ''
                    } */}
                    <> <Divider type="vertical" />
                      <Tooltip title="修改设备编号(MN)">
                        <a onClick={() => {
                          this.editMN(row['dbo.T_Bas_CommonPoint.DGIMN']);
                        }}><HighlightOutlined style={{ fontSize: 16 }} /></a>
                      </Tooltip></>
                    <Divider type="vertical" />
                    <Tooltip title="设备管理">
                      <a onClick={() => {
                        this.deviceManager(row);
                      }}><FileTextOutlined style={{ fontSize: 16 }} /></a>
                    </Tooltip>

                    {/* {row['dbo.T_Bas_CommonPoint.PollutantType']==2&&<>  <Divider type="vertical" />  <Dropdown trigger={['click']} placement='bottomCenter' overlay={ menu }>
                         <a className="ant-dropdown-link" onClick={e => {e.preventDefault();this.setState({row:row})}}>
                         <Tooltip title="更多">  <EllipsisOutlined /></Tooltip>
                        </a>
                        </Dropdown></>} */}
                  </Fragment>
                )}
              />
              )
            }
          </Card>
          <Modal
            //   title={this.state.isView ? '详情' : this.state.isEdit ? '编辑监测点' : '添加监测点'}
            title={this.state.isView ? '详情' : ''}
            visible={this.state.visible}
            onOk={this.onSubmitForm.bind(this)}
            onCancel={this.handleCancel}
            width={'80%'}
            destroyOnClose
            bodyStyle={{ paddingBottom: 0 }}
            footer={[
              !this.state.isView ? (
                <Button key="back" onClick={this.handleCancel}>
                  取消
            </Button>,

                <>
                  {pointFlag ?
                    <Button key="submit" onClick={this.modelClose}>
                      取消
                  </Button>
                    :
                    <>
                      <Button key="submit" type="primary" loading={this.loadingStatus()} onClick={this.onSubmitForm.bind(this)}>
                        确定
              </Button>
                      <Button key="submit" onClick={this.modelClose}>
                        取消
                     </Button></>

                  }</>) : '',
            ]}
          >{
              !this.state.isView ? (
                <Tabs activeKey={this.state.tabKey} onChange={this.onTabPaneChange}>
                  <TabPane tab={this.state.isView ? '详情' : this.state.isEdit ? '编辑监测点' : '添加监测点'} key="1">
                    <SdlForm
                      corporationCode={this.props.CorporationCode}
                      configId={pointConfigIdEdit}
                      onSubmitForm={this.onSubmitForm.bind(this)}
                      form={this.props.form}
                      noLoad
                      hideBtns
                      uid={this.state.cuid}
                      isEdit={this.state.isEdit}
                      keysParams={{ 'dbo.T_Bas_CommonPoint.PointCode': this.state.selectedPointCode }}
                      types='point'
                      isModal
                    />
                  </TabPane>
                  <TabPane tab="污染物信息" key="2">
                    {this.getTabInfo()}
                  </TabPane>
                  <TabPane tab="数据核查项" key="3">
                    {this.getDataVerification()}
                  </TabPane>
                  <TabPane tab="设备参数项" key="4">
                    {this.getEquipmentPar()}
                  </TabPane>
                  <TabPane tab="监测点系数" key="5">
                    {this.getPointCoefficient()}
                  </TabPane>
                </Tabs>

              ) : (
                  <AutoFormViewItems
                    configId={pointConfigIdEdit}
                    keysParams={{ 'dbo.T_Bas_CommonPoint.PointCode': this.state.selectedPointCode }}
                  />
                )
            }

          </Modal>
          <Modal
            title="设置Cems参数"
            visible={this.state.Mvisible}
            onCancel={this.handleMCancel}
            width="90%"
            destroyOnClose
            footer={false}
          >
            <AnalyzerManage DGIMN={this.state.DGIMN} />
          </Modal>
          <Modal
            title="修改设备编号(MN)"
            visible={this.state.MNVisible}
            onCancel={() => { this.setState({ MNVisible: false }) }}
            onOk={(e) => { this.onSubmitMN(e) }}
            destroyOnClose
            confirmLoading={this.props.saveLoadingMN}
            className={styles.MNmodal}
            confirmLoading={this.props.updatePointDGIMNLoading}
          >
            <Form>
              <Form.Item label="旧设备编号(MN)">
                <Input value={this.state.MNEcho} disabled />
              </Form.Item>
              <Form.Item label="新设备编号(MN)">
                {getFieldDecorator('newMN', {
                  rules: [{ required: this.state.MNVisible, message: '请输入新的设备编号(MN)' }], //设置成动态  以防影响autoform其他表单的提交
                })(
                  <Input placeholder="请输入新的设备编号(MN)" />
                )}
              </Form.Item>
            </Form>
          </Modal>

          <Modal  //设备管理
            title={pollutantType == 1 ? '废水' : deviceManagerGasType == 1 ? '废气-常规CEMS' : '废气-VOCS'}
            visible={this.state.deviceManagerVisible}
            onCancel={() => { this.setState({ deviceManagerVisible: false }) }}
            width="95%"
            destroyOnClose
            footer={false}
            wrapClassName={styles.deviceManagerSty}
          >
            <DeviceManager onCancel={() => { this.setState({ deviceManagerVisible: false }) }} DGIMN={this.state.deviceManagerMN} gasType={deviceManagerGasType} pollutantType={pollutantType} />
          </Modal>
        </div>
        {/* </MonitorContent> */}
      </BreadcrumbWrapper>
    );
  }
}
