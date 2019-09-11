import React, { Component } from 'react';
import {
  Card,
  Select,
  Form,
  Row,
  Input,
  Button,
  Popconfirm,
  DatePicker, Icon, Tag, Col, Empty, Modal, Upload, message, Spin,
  Tooltip,
  Divider
} from 'antd';
import Cookie from 'js-cookie';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SdlTable from '@/components/SdlTable'
import ApplicationModal from './vehicle/ApplicationModal'
import AutoFormTable from "@/pages/AutoFormManager/AutoFormTable"
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const dataSource = [];



// 车辆申请页面
@connect(({ loading, operations }) => ({
  // vehicleApplication: operations.vehicleApplication,
  vehicleApplicationList: operations.vehicleApplicationList,
  applicationModalVisible: operations.applicationModalVisible,
  vehicleList: operations.vehicleList,
  vehicleApplicationForm: operations.vehicleApplicationForm,
  loading: loading.effects['autoForm/getPageConfig'],
}))

class VehicleApplication extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      configId: "VehicleApplication",
      Applicant: Cookie.get("currentUser") && JSON.parse(Cookie.get("currentUser")).UserId,
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: this._SELF_.configId,
      }
    });
  }

  render() {
    const {
      applicationModalVisible,
      vehicleList,
      vehicleApplicationList,
      loading
    } = this.props;
    const { configId, Applicant } = this._SELF_;
    if (loading) {
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
      <PageHeaderWrapper>
        <Card style={{ height: 'calc(100vh - 200px)' }}>
          <SearchWrapper
            configId={configId}
            searchParams={[{
              Key: "Applicant",
              Value: Applicant,
              Where: "$="
            }]}
          />
          <AutoFormTable
            configId={configId}
            searchParams={[{
              Key: "Applicant",
              Value: Applicant,
              Where: "$="
            }]}
            appendHandleRows={(row, key) => {
              if (row["dbo.View_VehicleApplication.ApprovalStatus"] == 0) {
                return <>
                  <Divider type="vertical" />
                  <Tooltip title="撤销申请">
                    <Popconfirm
                      title="确认是否撤销申请？"
                      onConfirm={() => {
                        this.props.dispatch({
                          type: "operations/cancelApplication",
                          payload: {
                            ID: key
                          }
                        })
                      }}
                      // onCancel={cancel}
                      okText="确认撤销"
                      cancelText="取消"
                    >
                      <a><Icon type="reload" /></a>
                    </Popconfirm>
                  </Tooltip>
                </>
              } else {
                // return "-"
              }
            }}
            appendHandleButtons={(keys, rows) => {
              return <Button type="primary" onClick={() => {
                this.props.dispatch({
                  type: "operations/updateState",
                  payload: {
                    applicationModalVisible: true
                  }
                })
                // 获取车辆列表
                this.props.dispatch({
                  type: 'operations/getVehicleList',
                  payload: {
                    type: "0"
                  }
                })
              }}>发起申请</Button>
            }}
          />
        </Card>
        {applicationModalVisible && <ApplicationModal />}
      </PageHeaderWrapper>
    );
  }
}

export default VehicleApplication;