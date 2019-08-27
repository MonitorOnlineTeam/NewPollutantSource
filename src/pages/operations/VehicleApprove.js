import React, { Component } from 'react';
import {
  Card,
  Select,
  Form,
  Row,
  Input,
  Button,
  Popconfirm,
  DatePicker, Icon, Tag, Col, Empty, Modal, Upload, message
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SdlTable from '@/components/SdlTable'
import ApproveModal from './vehicle/ApproveModal'

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
@Form.create({
  mapPropsToFields(props) {
    return {
      ApplicationCode: Form.createFormField(props.vehicleApproveForm.ApplicationCode),
      VehicleName: Form.createFormField(props.vehicleApproveForm.VehicleName),
      LicensePlateNumber: Form.createFormField(props.vehicleApproveForm.LicensePlateNumber),
      ApplicationTime: Form.createFormField(props.vehicleApproveForm.ApplicationTime),
      ApplicantID: Form.createFormField(props.vehicleApproveForm.ApplicantID),
      ApprovalStatus: Form.createFormField(props.vehicleApproveForm.ApprovalStatus),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'operations/updateState',
      payload: {
        vehicleApproveForm: {
          ...props.vehicleApproveForm,
          ...fields
        }
      }
    })
  },
})
class VehicleApprove extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.SELF = {
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
      columns: [
        {
          title: '申请单编号',
          dataIndex: 'ApplicationCode',
          key: 'ApplicationCode',
        },
        {
          title: '车辆名称',
          dataIndex: 'VehicleName',
          key: 'VehicleName',
        },
        {
          title: '车牌号',
          dataIndex: 'LicensePlateNumber',
          key: 'LicensePlateNumber',
        },
        {
          title: '车辆申请状态',
          dataIndex: 'VihicleStatus',
          key: 'VihicleStatus',
          render: (text, record) => {
            // 0：待借，1：已借出，2、申请中
            switch (text) {
              case 0:
                return '待借'
                break;
              case 1:
                return '已借出'
                break;
              case 2:
                return '申请中'
                break;
              default:
                break;
            }
          }
        },
        {
          title: '申请人',
          dataIndex: 'ApplicantName',
          key: 'ApplicantName',
        },
        {
          title: '申请时间',
          dataIndex: 'ApplicationTime',
          key: 'ApplicationTime',
        },
        {
          title: '申请说明',
          dataIndex: 'ApplicationNote',
          key: 'ApplicationNote',
        },
        {
          title: '审批人',
          dataIndex: 'ApproverName',
          key: 'ApproverName',
        },
        {
          title: '审批时间',
          dataIndex: 'ApprovalTime',
          key: 'ApprovalTime',
        },
        {
          title: '审批状态',
          dataIndex: 'ApprovalStatus',
          key: 'ApprovalStatus',
          render: (text, record) => {
            // 0：待审批，1：同意，2、拒绝，3、已撤销
            // let status = text === 0 ? "待审批"
            switch (text) {
              case 0:
                return "待审批"
                break;
              case 1:
                return "同意"
                break;
              case 2:
                return "拒绝"
                break;
              case 3:
                return "已撤销"
                break;
              default:
                break;
            }
          }
        },
        {
          title: '操作',
          fixed: 'right',
          align: 'center',
          key: 'operation',
          render: (text, record) => {
            if (record.ApprovalStatus === 0) {
              return <a onClick={() => {
                this.props.dispatch({
                  type: 'operations/updateState',
                  payload: {
                    approveModalVisible: true,
                    approveModalData: record
                  }
                })
              }}>审批</a>
            } else if (record.VihicleStatus === 1 && record.ApprovalStatus === 1) {
              return <Popconfirm
                title="确认是否归还车辆？"
                onConfirm={() => {
                  this.props.dispatch({
                    type: 'operations/returnVehicle',
                    payload: {
                      ID: record.VehicleID
                    }
                  })
                }}
                // onCancel={cancel}
                okText="确认"
                cancelText="取消"
              >
                <a>归还</a>
              </Popconfirm>
            } else {
              return "-"
            }
          }
        },
      ],
    }
  }

  componentDidMount() {
    const { vehicleList, dispatch } = this.props;
    // 获取车辆列表
    !vehicleList.length && dispatch({
      type: 'operations/getVehicleList',
      payload: {
        type: ""
      }
    })
    // 获取申请人
    dispatch({
      type: "operations/getApplicant",
    })

    this.loadVehicleApproveList()
  }

  onTableChange = (current) => {
    this.props.dispatch({
      type: 'operations/updateState',
      payload: {
        vehicleApproveForm: {
          ...this.props.vehicleApproveForm,
          current
        }
      }
    })

    setTimeout(() => { this.loadVehicleApproveList() }, 0)
  }

  loadVehicleApproveList = () => {
    // 获取审批列表
    this.props.dispatch({
      type: 'operations/getVehicleApproveList',
    })
  }

  render() {
    const { form: { getFieldDecorator }, vehicleList, applicantList, vehicleApproveList, vehicleApproveForm, approveModalVisible, loading } = this.props;
    const { formLayout, columns } = this.SELF;
    return (
      <PageHeaderWrapper>
        <Card style={{ height: 'calc(100vh - 200px)' }}>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <FormItem {...formLayout} label="申请单编号" style={{ width: '100%' }}>
                  {getFieldDecorator("ApplicationCode", {
                  })(
                    <Input placeholder="请填写申请单编号" />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem {...formLayout} label="车辆名称" style={{ width: '100%' }}>
                  {getFieldDecorator("VehicleName", {
                  })(
                    <Select
                      showSearch
                      allowClear
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="请选择车辆"
                    >
                      {
                        vehicleList.map(item => {
                          return <Option key={item.ID} value={item.ID}>{item.VehicleName}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem {...formLayout} label="车牌号" style={{ width: '100%' }}>
                  {getFieldDecorator("LicensePlateNumber", {
                  })(
                    <Select
                      showSearch
                      allowClear
                      placeholder="请选择车牌号"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {
                        vehicleList.map(item => {
                          return <Option key={item.ID} value={item.LicensePlateNumber}>{item.LicensePlateNumber}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem {...formLayout} label="申请人" style={{ width: '100%' }}>
                  {getFieldDecorator("ApplicantID", {
                  })(
                    <Select
                      showSearch
                      placeholder="请选择申请人"
                      allowClear
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {
                        applicantList.map(item => {
                          return <Option key={item.UserId} value={item.UserId}>{item.UserName}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem {...formLayout} label="申请时间" style={{ width: '100%' }}>
                  {getFieldDecorator("ApplicationTime", {
                  })(
                    <RangePicker />
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem {...formLayout} label="审批状态" style={{ width: '100%' }}>
                  {getFieldDecorator("ApprovalStatus", {
                  })(
                    <Select placeholder="请选择审批状态">
                      <Option key="0">待审批</Option>
                      <Option key="1">同意</Option>
                      <Option key="2">拒绝</Option>
                      <Option key="3">已撤销</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                  <Button type="primary" loading={loading} onClick={() => {
                    this.onTableChange(1)
                  }}>查询</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <SdlTable
            rowKey={(record) => record.ID}
            loading={loading}
            dataSource={vehicleApproveList}
            columns={columns}
            pagination={{
              // showSizeChanger: true,
              showQuickJumper: true,
              pageSize: vehicleApproveForm.pageSize,
              current: vehicleApproveForm.current,
              onChange: this.onTableChange,
              total: vehicleApproveForm.total
            }}
          />
        </Card>
        {console.log('approveModalVisible=', approveModalVisible)}
        {approveModalVisible && <ApproveModal />}
      </PageHeaderWrapper>
    );
  }
}

export default VehicleApprove;