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
import styles from '@/pages/AutoFormManager/index.less';
import MonitorContent from '@/components/MonitorContent/index';
import { routerRedux } from 'dva/router';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { RollbackOutlined, ToolOutlined, HighlightOutlined, DownOutlined, EllipsisOutlined, FileTextOutlined, UnlockFilled } from '@ant-design/icons';
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
let pointConfigId = 'WaterOutputNew'
@connect(({ loading, autoForm,commissionTestPoint, }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm: autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  pointDataWhere:commissionTestPoint.pointDataWhere,
}))

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceManagerVisible: false,
      deviceManagerMN: '',
      deviceManagerGasType: '',
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
            Key: 'dbo__T_Cod_MonitorPointBase__BaseCode',
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
      deviceManagerMN: row["dbo.T_Bas_CommonPoint.DGIMN"],
      deviceManagerGasType: row["dbo.T_Bas_CommonPoint.Col4"]
    })
  }
  render() {
    const { searchConfigItems, searchForm, tableInfo, dispatch,pointDataWhere, } = this.props;
    const { location: { query: { targetName, targetId} }  } = this.props;
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
            isCenter
            {...this.props}
            searchParams={pointDataWhere}
            onAdd={() => { //添加
              this.showModal();
            }}
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
                          })
                        }
                      })

                      this.props.dispatch({ //设备参数 回显数据
                        type: 'point/getParamInfoList',
                        payload: {
                          DGIMN: row['dbo.T_Bas_CommonPoint.DGIMN'],
                          pollutantType: this.state.pollutantType
                        },
                        callback: (res) => {
                          this.setState({
                            equipmentPol: res && res.code ? res.code : undefined,
                          })
                        }
                      })

                      this.props.dispatch({ //监测点系数 回显数据
                        type: 'operaAchiev/getPointCoefficientList',
                        payload: {
                          DGIMN: row['dbo.T_Bas_CommonPoint.DGIMN'],
                        },
                        callback: (data) => {
                          this.setState({
                            pointCoefficientVal: data[0] ? data[0].Coefficient : undefined,
                          })
                          this.setState({
                            pointCoefficientFlag: data[0] && data[0].Coefficient ? true : false,
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
      </BreadcrumbWrapper>
    );
  }
}
