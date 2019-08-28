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
import ApplicationModal from './vehicle/ApplicationModal'

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
  loading: loading.effects["operations/getVehicleApplicationList"],
}))

@Form.create({
  mapPropsToFields(props) {
    return {
      ApplicationCode: Form.createFormField(props.vehicleApplicationForm.ApplicationCode),
      VehicleName: Form.createFormField(props.vehicleApplicationForm.VehicleName),
      LicensePlateNumber: Form.createFormField(props.vehicleApplicationForm.LicensePlateNumber),
      ApplicationTime: Form.createFormField(props.vehicleApplicationForm.ApplicationTime),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'operations/updateState',
      payload: {
        vehicleApplicationForm: {
          ...props.vehicleApplicationForm,
          ...fields
        }
      }
    })
  },
})

class VehicleApplication extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.SELF = {
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
      //       Applicant: "48f3889c-af8d-401f-ada2-c383031af92d"
      // ApplicantName: "超级管理员"
      // ApplicationCode: "VA_20190809163105123"
      // ApplicationNote: "开会去"
      // ApplicationTime: "2019/1/30 13:54:39"
      // ApprovalStatus: 0
      // ApprovalTime: ""
      // Approver: null
      // ApproverName: ""
      // ID: "222333ee"
      // LicensePlateNumber: "京8888888"
      // VehicleID: "7f5a1782-256b-4b87-916a-af4be8321350"
      // VehicleName: "法拉利"
      // VihicleStatus: 2
      columns: [
        {
          title: '申请单编号',
          dataIndex: 'ApplicationCode',
          key: 'ApplicationCode',
          width: 200
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
          title: '申请说明',
          dataIndex: 'ApplicationNote',
          key: 'ApplicationNote',
          width: 260
        },
        {
          title: '申请时间',
          dataIndex: 'ApplicationTime',
          key: 'ApplicationTime',
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
            if (record.VihicleStatus == 2 && record.ApprovalStatus == 0) {
              return <Popconfirm
                title="确认是否撤销申请？"
                onConfirm={() => {
                  this.props.dispatch({
                    type: "operations/cancelApplication",
                    payload: {
                      ID: record.ID
                    }
                  })
                }}
                // onCancel={cancel}
                okText="确认撤销"
                cancelText="取消"
              >
                <a>撤销申请</a>
              </Popconfirm>
            } else {
              return "-"
            }
          }
        },
      ],
    }
  }

  // 申请 -> Applicant：当前登录人
  // 审核 null

  componentDidMount() {
    this.loadVehicleApplicationList()

    // 获取车辆列表
    this.props.dispatch({
      type: 'operations/getVehicleList',
      payload: {
        type: ""
      }
    })
  }
  // 审核通过状态：1 车辆状态：1 -》 归还
  loadVehicleApplicationList = () => {
    // 获取申请列表
    this.props.dispatch({
      type: 'operations/getVehicleApplicationList',
    })
  }

  onTableChange = (current) => {
    this.props.dispatch({
      type: "operations/updateState",
      payload: {
        vehicleApplicationForm: {
          ...this.props.vehicleApplicationForm,
          current
        }
      }
    })
    setTimeout(() => {
      this.loadVehicleApplicationList()
    }, 0);
  }

  render() {
    const {
      form: { getFieldDecorator },
      vehicleApplicationForm,
      applicationModalVisible,
      vehicleList,
      vehicleApplicationList,
      loading
    } = this.props;
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
                    <Input allowClear placeholder="请输入申请单编号" />
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
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
                          return <Option value={item.ID}>{item.VehicleName}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
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
                <FormItem {...formLayout} label="申请时间" style={{ width: '100%' }}>
                  {getFieldDecorator("ApplicationTime", {
                  })(
                    <RangePicker />
                  )}
                </FormItem>
              </Col>
              <Col md={2} sm={24}>
                <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                  <Button loading={loading} type="primary" onClick={() => {
                    this.onTableChange(1);
                  }}>查询</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Row style={{ marginBottom: 10 }}>
            <Button type="primary" onClick={() => {
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
          </Row>
          <SdlTable
            dataSource={vehicleApplicationList}
            columns={columns}
            loading={loading}
            pagination={{
              // showSizeChanger: true,
              showQuickJumper: true,
              pageSize: vehicleApplicationForm.pageSize,
              current: vehicleApplicationForm.current,
              onChange: this.onTableChange,
              total: vehicleApplicationForm.total
            }}
          />
        </Card>
        {applicationModalVisible && <ApplicationModal />}
      </PageHeaderWrapper>
    );
  }
}

export default VehicleApplication;