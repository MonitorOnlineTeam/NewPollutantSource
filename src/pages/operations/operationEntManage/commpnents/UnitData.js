/**
 * 功  能：运维单位管理
 * 创建人：jab
 * 创建时间：2021.05.08
 */
import React, { Component, Fragment } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Badge,
  Modal,
  Input,
  Button,
  Select,
  Tooltip,
  Popconfirm,
  Divider,
  TreeSelect,
  Spin,
  Empty,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import styles from '../operationUnit/style.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { DelIcon } from '@/utils/icon'
import { ToolTwoTone, UserOutlined, DatabaseOutlined, CloseCircleOutlined } from '@ant-design/icons';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';
import SelectPollutantType from '@/components/SelectPollutantType';
import TreeTransfer from '@/components/TreeTransfer';
import { permissionButton } from '@/utils/utils';

const { SHOW_PARENT } = TreeSelect;
const pageUrl = {
  updateState: 'operationUnit/updateState',
  getData: 'operationUnit/getDefectModel',
};
@connect(({ loading, operationUnit, autoForm, common }) => ({
  priseList: operationUnit.priseList,
  exloading: operationUnit.exloading,
  loading: loading.effects[pageUrl.getData],
  total: operationUnit.total,
  tableDatas: operationUnit.tableDatas,
  queryPar: operationUnit.queryPar,
  regionList: autoForm.regionList,
  attentionList: operationUnit.attentionList,
  atmoStationList: common.atmoStationList,
  operationUnitWhere: operationUnit.operationUnitWhere,
  regionInfoTree: autoForm.regionList,
  entAndPointList: common.entAndPointList,
  getEntPointLoading: loading.effects['common/getEntAndPointList'],
  checkPointLoading: loading.effects['operationUnit/GetOperationCompanyPointList'],
  addSetOperationCompanyPointLoading: loading.effects['operationUnit/AddSetOperationCompanyPoint'],
  logOffCompanyLoading: loading.effects['operationUnit/LogOffCompany'],


}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      operationPersonConfigId: 'NewOperationMaintenancePersonnel',
      entName: '',
      entCode: '',
      pointPermissionVisible: false,
      compoanyID: undefined,
      pointPermissionTitle: '',
      regionCode: undefined,
      pollutantType: 2,
      entPointName:'',
      pointPermissionCheckedKeys: [],
      settingPointPermission: false,
      cancelOperaUtil: false,
    };

    this.columns = [];
  }

  componentDidMount() {
    const buttonList = permissionButton(this.props.location?.pathname);
    buttonList.map(item => {
      switch (item) {
        case 'settingPointPermission':
          this.setState({ settingPointPermission: true });
          break;
        case 'cancelOperaUtil':
          this.setState({ cancelOperaUtil: true });
          break;
      }
    });
    this.initData();

  }
  initData = () => {
    const { dispatch, match: { params: { configId } } } = this.props;

    this.getEntAndPointList()
    // dispatch({
    //   type: 'autoForm/getPageConfig',
    //   payload: {
    //     configId,
    //   },
    // });
    // dispatch({
    //   type: 'autoForm/getPageConfig',
    //   payload: {
    //     configId:this.state.operationPersonConfigId,
    //   },
    // });



  };
  // 获取企业和排口
  getEntAndPointList = () => {
    this.props.dispatch({
      type: "common/getEntAndPointList",
      payload: { Status: [], RunState: 1, RegionCode: this.state.regionCode?.toString(), PollutantTypes: this.state.pollutantType, Name: this.state.entPointName, }
    });
  }

  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, queryPar, match: { params: { configId } }, } = this.props;
    dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: configId,
        // searchParams: operationUnitWhere,
      },
    });
  };







  //查询事件
  queryClick = () => {

    const { queryPar: { dataType }, } = this.props;


    this.getTableData();
  };



  //  del=(row)=>{
  //   const {dispatch,match: { params: { configId } },} = this.props;
  //   dispatch({
  //     type: 'operationUnit/deleteOperationMaintenanceEnterpriseID',
  //     payload: {
  //       ID:row['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID']
  //     },
  //     callback: result => {
  //       if (result.IsSuccess) {
  //          this.getTableData();
  //       }
  //   },
  //   });
  //  }
  onSubmitForms = (form) => {
    //   dispatch({
    //     type: 'operationUnit/updateState',
    //     payload: {
    //         operationUnitWhere: [
    //             {
    //                 Key: 'dbo__T_Bas_OperationMaintenanceEnterprise__State',
    //                 Value: '',
    //                 Where: '$=',
    //             },
    //         ],
    //     },
    // });
  }
  operationPerson = (row) => {
    this.props.dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: this.state.operationPersonConfigId,
      },
    });
    this.setState({
      visible: true,
      entName: row['dbo.T_Bas_OperationMaintenanceEnterprise.Company'],
      entCode: row['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID']
    })
  }
  cancelOperaUnit = (id) => { //注销运维单位
    return new Promise((resolve) => {
      this.props.dispatch({
        type: 'operationUnit/LogOffCompany',
        payload: {
          compoanyID: id,
        },
        callback:()=>{
          resolve(null)
        }
      });
    });
  }
  
  getOperationCompanyPointList = ({compoanyID,pollutantType,regionCode}) =>{ //获取已设置的点位权限
    this.props.dispatch({
      type: 'operationUnit/GetOperationCompanyPointList',
      payload: {
        compoanyID: compoanyID || this.state.compoanyID,
        PollutantType: pollutantType || this.state.pollutantType,
        RegionCode: regionCode || this.state.regionCode?.toString(),
      },
      callback:(data)=>{
        this.setState({pointPermissionCheckedKeys:data || []})
      }
    });
  }
  /** 设置点位访问权限切换行政区 */
  regionChange = value => {
    this.setState({
      regionCode: value,
    }, () => {
      this.getEntAndPointList()
    });
    this.getOperationCompanyPointList({RegionCode: value?.toString()})
  };
  /** 设置点位访问权限切换污染物 */
  pollutantChange = e => {
    this.setState({ pollutantType: e.target.value }, () => {
      this.getEntAndPointList()
    });
    this.getOperationCompanyPointList({PollutantType: e.target.value})
  };

  pointAccessClick = () => {
    this.getEntAndPointList()
    this.getOperationCompanyPointList({})
  };

  pointPermissionOK = (state, callback) => {
    this.props.dispatch({
      type: 'operationUnit/AddSetOperationCompanyPoint',
      payload: {
        mnList: this.state.pointPermissionCheckedKeys,
        compoanyID: this.state.compoanyID,
        RegionCode: this.state.regionCode?.toString(),
        state: state,
      },
      callback: res => {
        callback()
      },
    });
  };



  render() {
    const {
      Atmosphere,
      exloading,
      queryPar: { beginTime, endTime, EntCode, RegionCode, AttentionCode, dataType, PollutantType, PageSize, PageIndex, OperationPersonnel },
      match: { params: { configId } },
    } = this.props;
    const tProps = {
      treeData: this.props.regionInfoTree,
      value: this.state.regionCode,
      onChange: this.regionChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '行政区',
      treeDefaultExpandedKeys: ['0'],
      style: {
        width: 200,
        marginLeft: 16,
      },
      dropdownStyle: {
        maxHeight: '700px',
        overflowY: 'auto',
      },
      showSearch: true,
      filterOption: (input, option) => {
        if (option && option.props && option.props.title) {
          return option.props.title === input || option.props.title.indexOf(input) !== -1
        } else {
          return true
        }
      }
    };
    return (
      <Card
        bordered={false}
        title={
          <SearchWrapper
            onSubmitForm={form => this.onSubmitForms(form)}
            configId={configId}
          ></SearchWrapper>
        }
      >
        <>

          <AutoFormTable
            getPageConfig
            onRef={this.onRef1}
            style={{ marginTop: 10 }}
            configId={configId}
            parentcode="platformconfig/operationEntManage"
            appendHandleRows={row => <> <Fragment>
              {/* <Tooltip title="删除">
                            <Popconfirm  title="确定要删除此条信息吗？" onConfirm={() => this.del(row)} okText="是" cancelText="否">
                                <a  style={{paddingLeft:5}} > <DelIcon/> </a>
                            </Popconfirm>
                        </Tooltip> */}
              <Divider type="vertical" />
              <Tooltip title="运维人员">
                <a onClick={() => { this.operationPerson(row) }}> <UserOutlined style={{ fontSize: 18 }} /> </a>
              </Tooltip>
              {this.state.settingPointPermission && <><Divider type="vertical" />
                <Tooltip title="设置点位访问权限">
                  <a
                    onClick={() => {
                      this.setState(
                        {
                          pointPermissionVisible: true,
                          pointPermissionTitle: row['dbo.T_Bas_OperationMaintenanceEnterprise.Company'],
                          compoanyID: row['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID'],
                        },()=>{
                          this.getOperationCompanyPointList({compoanyID: row['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID']})
                        }
                      );
                    }}
                  >
                    <DatabaseOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip></>}
              {this.state.cancelOperaUtil && <><Divider type="vertical" />
                <Tooltip title="注销运维单位">
                  <Popconfirm  placement="left" title="确定要注销运维单位吗？" onConfirm={() => this.cancelOperaUnit(row['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID'])} okText="是" cancelText="否">
                    <a href="#" > <CloseCircleOutlined style={{ fontSize: 16 }} /> </a>
                  </Popconfirm>
                </Tooltip></>}

            </Fragment></>}
          />
        </>
        <Modal
          title={`运维人员 - ${this.state.entName}`}
          visible={this.state.visible}
          onCancel={() => { this.setState({ visible: false }) }}
          footer={null}
          width={'50%'}
        >
          <AutoFormTable
            configId={this.state.operationPersonConfigId}
            searchParams={
              [
                {
                  Key: 'dbo__T_Bas_OperationMaintenancePersonnel__EnterpriseID',
                  Value: this.state.entCode,//match.params.Pointcode,
                  Where: '$=',
                }
              ]}
          />
        </Modal>
        <Modal
          title={`设置点位访问权限 - ${this.state.pointPermissionTitle}`}
          visible={this.state.pointPermissionVisible}
          destroyOnClose
          onCancel={() => { this.setState({ pointPermissionVisible: false }) }}
          width={1100}
          footer={null}
          bodyStyle={{
            overflowY: 'auto',
            maxHeight: this.props.clientHeight - 240,
          }}
        >
          {

            <div>
              <Row style={{ background: '#fff', paddingBottom: 10, zIndex: 1 }}>

                <SelectPollutantType
                  showType="radio"
                  mode="multiple"
                  value={this.state.pollutantType}
                  onChange={this.pollutantChange}
                  onlyShowEnt
                />
                <TreeSelect
                  {...tProps}
                  treeCheckable={false}
                  allowClear
                  placeholder='请选择行政区'
                />
                <Input.Group compact style={{ width: 290, marginLeft: 16, display: 'inline-block' }}>
                  <Input style={{ width: 200 }} allowClear placeholder='请输入企业名称' onBlur={(e) => this.setState({ entPointName: e.target.value })} />
                  <Button type="primary" loading={this.props.checkPointLoading || this.props.getEntPointLoading || !!this.props.addSetOperationCompanyPointLoading } onClick={this.pointAccessClick}>查询</Button>
                </Input.Group>
              </Row>
              {this.props.checkPointLoading || this.props.getEntPointLoading ? (
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
              ) : this.props.entAndPointList?.length > 0 ? (
                <Spin spinning={!!this.props.addSetOperationCompanyPointLoading}>
                  <TreeTransfer
                    key="key"
                    treeData={this.props.entAndPointList}
                    checkedKeys={this.state.pointPermissionCheckedKeys}
                    targetKeysChange={(key, type, callback) => {
                      this.setState({ pointPermissionCheckedKeys: key }, () => {
                      this.pointPermissionOK(type == 1 ? 1 : 2, callback)
                      })
                  
                  } 
                    
                  }/>
                </Spin>
              ) : (
                    <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
            </div>
          }
        </Modal>
      </Card>
    );
  }
}
