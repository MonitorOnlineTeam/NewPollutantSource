/**
 * 功  能：运维单位管理
 * 创建人：jab
 * 创建时间：2021.05.08
 */
import React, { Component,Fragment } from 'react';
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
  Divider
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
import {  ToolTwoTone,UserOutlined  } from '@ant-design/icons';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'operationUnit/updateState',
  getData: 'operationUnit/getDefectModel',
};
@connect(({ loading, operationUnit,autoForm,common}) => ({
  priseList: operationUnit.priseList,
  exloading:operationUnit.exloading,
  loading: loading.effects[pageUrl.getData],
  total: operationUnit.total,
  tableDatas: operationUnit.tableDatas,
  queryPar: operationUnit.queryPar,
  regionList: autoForm.regionList,
  attentionList:operationUnit.attentionList,
  atmoStationList:common.atmoStationList,
  operationUnitWhere:operationUnit.operationUnitWhere
}))
@Form.create()
export default class EntTransmissionEfficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible:false,
      operationPersonConfigId:'NewOperationMaintenancePersonnel',
      entName:'',
      entCode:''
    };
    
    this.columns = [];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const {dispatch, match: { params: { configId } }} = this.props;


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
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, queryPar,match: { params: { configId } }, } = this.props;
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

    const {queryPar: {dataType }, } = this.props;
   

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
   onSubmitForms=(form)=>{
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
   operationPerson=(row)=>{
    this.props.dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId:this.state.operationPersonConfigId,
        },
      });
     this.setState({
       visible:true,
       entName:row['dbo.T_Bas_OperationMaintenanceEnterprise.Company'],
       entCode:row['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID']
     })
   }
  render() {
    const {
      Atmosphere,
      exloading,
      queryPar: {  beginTime, endTime,EntCode, RegionCode,AttentionCode,dataType,PollutantType,PageSize,PageIndex,OperationPersonnel },
      match: { params: { configId } },
    } = this.props;

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
                        appendHandleRows={row =><> <Fragment>
                            {/* <Tooltip title="删除">
                            <Popconfirm  title="确定要删除此条信息吗？" onConfirm={() => this.del(row)} okText="是" cancelText="否">
                                <a  style={{paddingLeft:5}} > <DelIcon/> </a>
                            </Popconfirm>
                        </Tooltip> */}
                        <Divider type="vertical" />
                        <Tooltip title="运维人员">
                                <a  onClick={()=>{this.operationPerson(row)}}> <UserOutlined style={{fontSize:18}}/> </a>
                        </Tooltip>
                        </Fragment></>}
                    />
          </>
          <Modal
                    title={`运维人员 - ${this.state.entName}`}
                    visible={this.state.visible} 
                    onCancel={()=>{this.setState({visible:false})}}
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
        </Card>
    );
  }
}
