import React, { Component } from 'react';
import {
  Card,
  Select,
  Form,
  Row,
  Input,
  Button,
  Popconfirm,
  Tooltip,
  Divider,
  DatePicker, Icon, Tag, Col, Empty, Modal, Upload, message
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { ShenpiIcon } from '@/utils/icon';
import SdlTable from '@/components/SdlTable'
import ApproveModal from './vehicle/ApproveModal'
import AutoFormTable from "@/pages/AutoFormManager/AutoFormTable"
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const dataSource = [];


// 车辆审批页面
@connect(({ loading, operations }) => ({
  vehicleApproveList: operations.vehicleApproveList,
  vehicleApproveForm: operations.vehicleApproveForm,
  vehicleList: operations.vehicleList,
  approveModalVisible: operations.approveModalVisible,
  loading: loading.effects["operations/getVehicleApproveList"],
  applicantList: operations.applicantList,
}))

class VehicleApprove extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      configId: "VehicleApproval",
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
    const { approveModalVisible } = this.props;
    const { configId } = this._SELF_;
    return (
      <BreadcrumbWrapper>
        <Card style={{ height: 'calc(100vh - 200px)' }}>
          <SearchWrapper
            configId={configId}
          />
          <AutoFormTable
            style={{ marginTop: 10 }}
            configId={configId}
            appendHandleRows={(row, key) => {
              const ApprovalStatus = row["dbo.View_VehicleApplication.ApprovalStatus"];
              const IsReturn = row["dbo.View_VehicleApplication.IsReturn"]
              const ele = null;
              // 待审批时显示审批
              if (ApprovalStatus === 0) {
                ele = <>
                  <Divider type="vertical" />
                  <Tooltip title="审批">
                    <a onClick={() => {
                      this.props.dispatch({
                        type: 'operations/updateState',
                        payload: {
                          approveModalVisible: true,
                          approveModalData: row
                        }
                      })
                    }}><ShenpiIcon /></a>
                  </Tooltip>
                </>
                // 审批通过并且是否归还状态为0
              } else if (ApprovalStatus === 1 && IsReturn == 0) {
                ele = <>
                  <Divider type="vertical" />
                  <Tooltip title="归还">
                    <Popconfirm
                      title="确认是否归还车辆？"
                      onConfirm={() => {
                        this.props.dispatch({
                          type: 'operations/returnVehicle',
                          payload: {
                            ID: key
                          }
                        })
                      }}
                      // onCancel={cancel}
                      okText="确认"
                      cancelText="取消"
                    >
                      <a><Icon type="rollback" /></a>
                    </Popconfirm>
                  </Tooltip>
                </>
              }
              return <>
                {ele}
                <Divider type="vertical" />
                <Tooltip title="车辆轨迹">
                  <a onClick={() => {
                    this.props.dispatch({
                      type: "operations/getVehicleTrajectory",
                      payload: {
                        // ApplicantID: "0eaa322b-268c-49d8-8b1a-a452b5affe1b"
                        ApplicantID: key
                      }
                    })
                  }}><Icon type="car" /></a>
                </Tooltip>
              </>
            }}
          />
        </Card>
        {approveModalVisible && <ApproveModal />}
      </BreadcrumbWrapper>
    );
  }
}

export default VehicleApprove;
