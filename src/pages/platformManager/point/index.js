import React, { Component, Fragment } from 'react';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Form,
  Spin,
  Select,
  Modal,
  Tag,
  Divider,
  Dropdown,
  Icon,
  Menu,
  Popconfirm,
  message,
  DatePicker,
  InputNumber,
  Tooltip,
} from 'antd';
import styles from './index.less';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import { sdlMessage } from '@/utils/utils';
import PollutantType from '@/components/AutoForm/PollutantType';
import SdlForm from '@/pages/AutoFormManager/SdlForm';
import AutoFormViewItems from '@/pages/AutoFormManager/AutoFormViewItems';
import config from '@/config';
import SelectPollutantType from '@/components/SelectPollutantType'

let pointConfigId = '';
let pointConfigIdEdit = '';

@connect(({ loading, autoForm, monitorTarget, common, point, global }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  otherloading: loading.effects['monitorTarget/getPollutantTypeList'],
  autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  pointDataWhere: monitorTarget.pointDataWhere,
  isEdit: monitorTarget.isEdit,
  defaultPollutantCode: common.defaultPollutantCode,
  configInfo: global.configInfo
}))
@Form.create()
export default class MonitorPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pollutantType: 0,
      visible: false,
      FormDatas: {},
      selectedPointCode: '',
      isView: false,
    };
  }

  componentDidMount() {
    // 1.监控目标ID
    // 2.污染物类型
    // 3.获取监测点数据
    const { dispatch, match } = this.props;
    console.log("match=", match);
    dispatch({
      type: 'point/getPointList',
      payload: {
        callback: res => {
          this.getPageConfig(res);
        }
      }
    });

    // dispatch({
    //   type: 'monitorTarget/getPollutantTypeList',
    //   payload: {
    //     callback: result => {
    //       this.setState({
    //         pollutantType: result,
    //       });
    //       this.getPageConfig(result);
    //     },
    //   },
    // });
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
      let { SystemPollutantTypeConfigId } = configInfo;
      let configIds = SystemPollutantTypeConfigId.split(',');
      let thisConfigId = null;
      if (configIds.length > 0) {
        thisConfigId = configIds.filter(m => m.split(':')[0] == type);
        if (thisConfigId.length > 0) {
          pointConfigIdEdit = thisConfigId[0].split(':')[1];
          pointConfigId = pointConfigIdEdit + "New";
        }
      }

    } catch (e) {
      sdlMessage('AutoForm配置发生错误，请联系系统管理员', 'warning');
    }

    // debugger;
    switch (type) {
      case 1:
        // 废水
        //pointConfigId = 'WaterOutputNew';
        //pointConfigIdEdit = 'WaterOutput';
        break;
      case 2:
        // 废气
        // pointConfigId = 'GasOutputNew';
        //pointConfigIdEdit = 'GasOutput';
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

  editMonitorInfo = () => {
    const { key, row } = this.state;
    // debugger;
    if (!row || row.length === 0 || row.length > 1) {
      sdlMessage('请选择一行进行操作', 'warning');
      return false;
    }
  };

  onMenu = (key, id, name, code) => {
    const {
      match: {
        params: { configId, targetId, targetName },
      },
    } = this.props;
    // match.params
    switch (key) {
      case '1':
        this.props.dispatch(
          routerRedux.push(
            `/platformconfig/monitortarget/${configId}/null/usestandardlibrary/${id}/${name}/${targetId}/${targetName}/${this.state.pollutantType}`,
          ),
        );
        break;
      case '2':
        this.props.dispatch(
          routerRedux.push(
            `/sysmanage/stopmanagement/${id}/${name}/${configId}/${targetId}/${targetName}`,
          ),
        );
        break;
      case '3':
        this.props.dispatch(
          routerRedux.push(
            `${config.VideoServer === 0 ? `/platformconfig/hkcameramanager/${name}/${code}/${id}/${targetId}/${targetName}` : `/platformconfig/ysycameramanager/${name}/${code}/${id}/${targetId}/${targetName}`}`,
          ),
        );
        break;
      case '4':
        this.props.dispatch(routerRedux.push(`/pointdetail/${id}/pointinfo`));
        break;
      default:
        break;
    }
  };

  showModal = PointCode => {
    const { dispatch } = this.props;
    if (PointCode) {
      this.setState({
        visible: true,
        isEdit: true,
        selectedPointCode: PointCode,
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
      });
    }
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      isEdit: false,
      selectedPointCode: '',
      isView: false,
    });
  };

  onSubmitForm() {
    const { dispatch, match, pointDataWhere, form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const FormData = {};
        for (const key in values) {
          if (values[key] && values[key].fileList) {
            FormData[key] = uid;
          } else {
            FormData[key] = values[key] && values[key].toString();
          }
        }
        //FormData.PollutantType = match.params.targetType;
        if (!Object.keys(FormData).length) {
          sdlMessage('数据为空', 'error');
          return false;
        }
        if (this.state.isEdit) {
          FormData.PointCode = this.state.selectedPointCode;
        }
        dispatch({
          type: !this.state.isEdit ? 'monitorTarget/addPoint' : 'monitorTarget/editPoint',
          payload: {
            configId: pointConfigIdEdit,
            targetId: match.params.targetId,
            targetType:match.params.targetType,
            FormData,
            callback: result => {
              if (result.IsSuccess) {
                this.setState({
                  visible: false,
                });
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
    });
  }

  delPoint(PointCode, DGIMN) {
    const { dispatch, match, pointDataWhere } = this.props;
    const { pollutantType } = this.state;
    dispatch({
      type: 'monitorTarget/delPoint',
      payload: {
        configId: pointConfigIdEdit,
        targetId: match.params.targetId,
        targetType:match.params.targetType,
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
    } = this.props;
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
    const menu = (id, name, code) => (
      <Menu
        onClick={e => {
          this.onMenu.bind()(e.key, id, name, code);
        }}
      >
        <Menu.Item key="1">
          <Icon type="bars" />
          监测标准
        </Menu.Item>
        {/* <Menu.Item key="2"><Icon type="tool" />停产管理</Menu.Item> */}
        <Menu.Item key="3">
          <Icon type="youtube" />
          视频管理
        </Menu.Item>
        {/* <Menu.Item key="4"><Icon type="home" />进入排口</Menu.Item> */}
      </Menu>
    );
    return (
      // <MonitorContent
      //   breadCrumbList={[
      //     { Name: '首页', Url: '/' },
      //     { Name: '平台配置', Url: '' },
      //     { Name: '企业管理', Url: '/platformconfig/monitortarget/' + configId },
      //     { Name: '维护点信息', Url: '' },
      //   ]}
      // >
      <PageHeaderWrapper title="监测点维护">
        <div className={styles.cardTitle}>
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
                  <Icon type="rollback" />
                  返回上级
                </Button>
              </span>
            }
            // extra={<PollutantType handlePollutantTypeChange={this.getPageConfig} />}
            extra={<SelectPollutantType
              style={{ marginLeft: 50, float: 'left' }}
              showType="radio"
              onChange={this.onPollutantChange}
              defaultValue={this.state.pollutantType}
              filterPollutantType={pollutantTypes}
            />}
          >

            {
              pointConfigId && <AutoFormTable
                style={{ marginTop: 10 }}
                // columns={columns}
                configId={pointConfigId}
                rowChange={(key, row) => {
                  this.setState({
                    key,
                    row,
                  });
                }}
                onAdd={() => {
                  this.showModal();
                }}
                searchParams={pointDataWhere}
                appendHandleRows={row => (
                  <Fragment>
                    <Tooltip title="编辑">
                      <a
                        onClick={() => {
                          this.showModal(row['dbo.T_Bas_CommonPoint.PointCode']);
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
                      <Popconfirm
                        title="确认要删除吗?"
                        onConfirm={() => {
                          this.delPoint(
                            row['dbo.T_Bas_CommonPoint.PointCode'],
                            row['dbo.T_Bas_CommonPoint.DGIMN'],
                          );
                        }}
                        onCancel={this.cancel}
                        okText="是"
                        cancelText="否"
                      >
                        <a href="#"><DelIcon /></a>
                      </Popconfirm>
                    </Tooltip>
                    <Divider type="vertical" />
                    <Dropdown
                      overlay={menu(
                        row['dbo.T_Bas_CommonPoint.DGIMN'],
                        row['dbo.T_Bas_CommonPoint.PointName'],
                        row['dbo.T_Bas_CommonPoint.PointCode'],
                      )}
                    >
                      <a><Icon type="down" /></a>
                    </Dropdown>
                  </Fragment>
                )}
              />
            }
          </Card>
          <Modal
            title={this.state.isView ? '详情' : this.state.isEdit ? '编辑监测点' : '添加监测点'}
            visible={this.state.visible}
            onOk={this.onSubmitForm.bind(this)}
            onCancel={this.handleCancel}
            width="60%"
            destroyOnClose
          >
            {!this.state.isView ? (
              <SdlForm
                configId={pointConfigIdEdit}
                onSubmitForm={this.onSubmitForm.bind(this)}
                form={this.props.form}
                noLoad
                hideBtns
                isEdit={this.state.isEdit}
                keysParams={{ 'dbo.T_Bas_CommonPoint.PointCode': this.state.selectedPointCode }}
              />
            ) : (
                <AutoFormViewItems
                  configId={pointConfigIdEdit}
                  keysParams={{ 'dbo.T_Bas_CommonPoint.PointCode': this.state.selectedPointCode }}
                />
              )}
          </Modal>
        </div>
        {/* </MonitorContent> */}
      </PageHeaderWrapper>
    );
  }
}
