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
import DeviceManager from './DeviceManager'
const pointConfigId = 'TestPoint'
@connect(({ loading, autoForm,commissionTestPoint, }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm: autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  pointDataWhere:commissionTestPoint.pointDataWhere,
  loadingAddConfirm: loading.effects['autoForm/add'],
  loadingEditConfirm: loading.effects['autoForm/saveEdit'],
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible:false,
      isEdit:false,
      deviceManagerVisible: false,
      deviceManagerMN: '',
      deviceManagerGasType: '',
      selectedPointCode:'',
      deviceMangerVisible:false,
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
    const { location: { query: { targetId} }  } = this.props;
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
  addPoint = () =>{ //添加监测点 弹框
    this.setState({visible:true,isEdit:false,})
  }
  editPoint = (row) =>{
    const {dispatch, } = this.props;
    this.setState({visible:true,isEdit:true,})
    const pointCode = row['dbo.T_Bas_TestCommonPoint.ID']
    this.setState({
      visible: true,
      isEdit: true,
      selectedPointCode: pointCode,
    });
  }
  savePointSubmitForm = () =>{  //保存监测点 确认
    const { form,dispatch,pointDataWhere,} = this.props;
    const { location: { query: { targetName, targetId} }  } = this.props;
    const { isEdit,selectedPointCode, } = this.state;
    form.validateFields((err, values) => {
      if (!err) { 
        values.EntID = targetId;
        if(isEdit){ //编辑
          dispatch({
            type:'autoForm/saveEdit',
            payload: {
              configId:pointConfigId,
              FormData: {...values,ID:selectedPointCode},
              searchParams: pointDataWhere,
              callback: result => {
                if (result.IsSuccess) {
                  this.setState({  visible: false, })  }
                  dispatch({
                  type: 'autoForm/getAutoFormData',
                  payload: {
                    configId:pointConfigId,
                    searchParams:  pointDataWhere
                  },
              });
              },
            },
          });
        }else{ //添加
        dispatch({
          type:  'autoForm/add',
          payload: {
            configId:pointConfigId,
            FormData: {...values,},
            searchParams: pointDataWhere,
            callback: result => {
              if (result.IsSuccess) {
                this.setState({ visible: false, }) }
            },
          },
        });
      }
      }
    })
  }
  render() {
    const { searchConfigItems, searchForm, tableInfo, dispatch,pointDataWhere, loadingEditConfirm , loadingAddConfirm ,} = this.props;
    const { location: { query: { targetName, targetId} }  } = this.props;
    const { isEdit } = this.state;
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
            title={isEdit? '编辑监测点' : '添加监测点'}
            visible={this.state.visible}
            onOk={this.savePointSubmitForm.bind(this)}
            onCancel={()=>{this.setState({visible:false})}}
            width={'80%'}
            confirmLoading={isEdit? loadingEditConfirm : loadingAddConfirm}
            destroyOnClose
            bodyStyle={{ paddingBottom: 0 }}>
         <SdlForm
                      configId={pointConfigId}
                      form={this.props.form}
                      noLoad
                      hideBtns
                      isEdit={this.state.isEdit}
                      keysParams={{ 'dbo.T_Bas_TestCommonPoint.ID': this.state.selectedPointCode }}
                      types='point'
                      isModal
                    />              
        </Modal>
        <Modal
            title={'设备管理'}
            visible={this.state.deviceManagerVisible}
            onCancel={()=>{this.setState({deviceManagerVisible:false})}}
            destroyOnClose
            footer={null}
            wrapClassName={`spreadOverModal spreadOverHiddenModal`}
          >  
          <DeviceManager onCancel={() => { this.setState({ deviceManagerVisible: false }) }} DGIMN={this.state.deviceManagerMN}/>         
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}
