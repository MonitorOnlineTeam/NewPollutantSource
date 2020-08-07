import React, { Component } from 'react';
import {
  Form,
  Select,
  Card,
  Row,
  Col,
  Table,
  Spin,
  Tag,
  Cascader,
  Button,
  Input,
  Radio,
  Icon,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import RangePicker_ from '../../components/RangePicker/index';
import styles from './MaintenanceTaskHistoryList.less';
import DepartmentPeople from '../../components/DepartmentPeople/index';
import { EnumTaskReviewStatus, EnumOperationTaskStatus } from '../../utils/enum';
import MonitorContent from '../../components/MonitorContent/index';
import EnterprisePoint from '../../components/EnterprisePoint/index';
import EnterpriseMultiSelect from '../../components/EnterpriseMultiSelect/index';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

let Refs = [];
@connect(({ loading, tasklistNew }) => ({
  loading: loading.effects['tasklistNew/GetMaintenanceTaskHistoryList'],
  MaintenanceTaskHistoryList: tasklistNew.taskList,
  MaintenanceTaskHistoryRecordCount: tasklistNew.Total,
  pageIndex: tasklistNew.pageIndex,
  pageSize: tasklistNew.pageSize,
  OperationsUserId: tasklistNew.OperationsUserId, //任务执行人
  TaskCode: tasklistNew.TaskCode, //任务单号
  beginTime: tasklistNew.beginTime, //任务创建时间-开始时间
  endTime: tasklistNew.endTime, //任务创建时间-结束时间
  taskFinishBeginTime: tasklistNew.beginTime, //任务完成时间-开始时间
  taskFinishEndTime: tasklistNew.endTime, //任务完成时间-结束时间
  TaskContentType: tasklistNew.TaskContentType, //工单类型
  AuditStatus: tasklistNew.AuditStatus, //任务审核状态
  TaskStatus: tasklistNew.TaskStatus, //任务状态
  ItemNum: tasklistNew.ItemNum, //项目编号
}))
/*
页面：运维任务历史记录
*/
@Form.create()
class MaintenanceTaskHistoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      rangeDate: [moment(this.props.beginTime), moment(this.props.endTime)], // 最近一个月
      TaskCode: this.props.TaskCode,
      TaskContentType: this.props.TaskContentType,
      AuditStatus: this.props.AuditStatus,
      TaskStatus: this.props.TaskStatus,
      OperationsUserId: this.props.OperationsUserId,
      ItemNum: this.props.ItemNum,
    };

    this.formLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16 },
    };
  }

  componentDidMount() {
    this.GetData();
  }

  GetData = () => {
    this.props.dispatch({
      type: 'tasklistNew/GetMaintenanceTaskHistoryList',
      payload: {},
    });
  };

  handleSearch = e => {
    const condition = {
      pageIndex: 1,
    };
    this.ChangeModelState(condition);
    this.GetData();
  };

  handleFormReset = () => {
    this.Reset();
    this.FormReset();
  };

  //重置
  Reset = () => {
    const condition = {
      RegionCode: null, //行政区编码
      EnterCode: null, //企业编码
      PointCode: null, //监测点名称
      OperationsUserId: [], //任务执行人
      TaskCode: null, //任务单号
      beginTime: moment()
        .subtract(1, 'month')
        .format('YYYY-MM-DD 00:00:00'), //任务开始时间
      endTime: moment().format('YYYY-MM-DD 23:59:59'), //任务结束时间
      taskFinishBeginTime: null, //任务开始时间
      taskFinishEndTime: null, //任务结束时间
      TaskContentType: [], //工单类型
      AuditStatus: 0, //任务审核状态
      TaskStatus: 0, //任务状态
      ItemNum: null,
    };
    this.ChangeModelState(condition);
  };

  //重置查询
  FormReset = () => {
    this.child.Reset(); //调用监测点组件中的事件
    this.child1.Reset(); //调用人员组件中的事件
    this.child2.Reset(); //调用人员组件中的事件
    this.setState({
      OperationsUserId: [],
      rangeDate: [
        moment(
          moment(new Date())
            .subtract(1, 'month')
            .format('YYYY-MM-DD 00:00:00'),
        ),
        moment(moment(new Date()).format('YYYY-MM-DD 23:59:59')),
      ], // 最近一个月
      rangeFinishDate: [null, null], // 最近一个月
      TaskCode: null,
      TaskContentType: [],
      AuditStatus: 0,
      TaskStatus: 0,
      ItemNum: null,
    });
  };

  //调用组件中的事件
  onRefResetEnterPoint = ref => {
    this.child = ref;
  };

  //调用组件中的事件
  onRefResetPeople = ref => {
    this.child1 = ref;
  };

  //调用组件中的事件
  onRefResetRegion = ref => {
    this.child2 = ref;
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  onPageChange = (page, pageSize) => {
    const condition = {
      pageIndex: page,
      pageSize: pageSize,
    };
    this.ChangeModelState(condition);
    this.GetData();
  };

  onShowSizeChange = (current, size) => {
    const condition = {
      pageIndex: current,
      pageSize: size,
    };
    this.ChangeModelState(condition);
    this.GetData();
  };

  updateSltUserModel = sltUser => {
    const condition = {
      OperationsUserId: sltUser ? [sltUser] : undefined,
    };
    this.ChangeModelState(condition);
  };

  updateSltEnterModel = sltEnter => {
    const condition = {
      EnterCode: sltEnter,
    };
    this.ChangeModelState(condition);
  };

  updateSltPointModel = sltPoint => {
    const condition = {
      PointCode: sltPoint,
    };
    this.ChangeModelState(condition);
  };

  _handleDateChange = (date, dateString) => {
    const condition = {
      beginTime: moment(dateString[0]).format('YYYY-MM-DD 00:00:00'),
      endTime: moment(dateString[1]).format('YYYY-MM-DD 23:59:59'),
    };
    this.ChangeModelState(condition);
    if (dateString[0] !== '') {
      this.setState({
        rangeDate: [
          moment(moment(dateString[0]).format('YYYY-MM-DD 00:00:00')),
          moment(moment(dateString[1]).format('YYYY-MM-DD 23:59:59')),
        ],
      });
    } else {
      this.setState({
        rangeDate: ['', ''],
      });
    }
  };

  _handleFinishDateChange = (date, dateString) => {
    const condition = {
      taskFinishBeginTime: moment(dateString[0]).format('YYYY-MM-DD 00:00:00'),
      taskFinishEndTime: moment(dateString[1]).format('YYYY-MM-DD 23:59:59'),
    };
    this.ChangeModelState(condition);
    if (dateString[0] !== '') {
      this.setState({
        rangeFinishDate: [
          moment(moment(dateString[0]).format('YYYY-MM-DD 00:00:00')),
          moment(moment(dateString[1]).format('YYYY-MM-DD 23:59:59')),
        ],
      });
    } else {
      this.setState({
        rangeFinishDate: [null, null],
      });
    }
  };

  //工单类型
  onContentTypeChange = value => {
    const condition = {
      TaskContentType: value && [value],
    };
    this.ChangeModelState(condition);
    this.setState({
      TaskContentType: value && [value],
    });
  };

  //任务状态
  onTaskStatusChange = e => {
    const condition = {
      TaskStatus: e.target.value,
    };
    this.ChangeModelState(condition);
    this.setState({
      TaskStatus: e.target.value,
    });
  };

  //工单审核状态
  onAuditStatusChange = e => {
    const condition = {
      AuditStatus: e.target.value,
    };
    this.ChangeModelState(condition);
    this.setState({
      AuditStatus: e.target.value,
    });
  };

  //工单号
  onTaskCodeChange = e => {
    const condition = {
      TaskCode: e.target.value,
    };
    this.ChangeModelState(condition);
    this.setState({
      TaskCode: e.target.value,
    });
  };

  onItemNumChange = e => {
    const condition = {
      ItemNum: e.target.value,
    };
    this.ChangeModelState(condition);
    this.setState({
      ItemNum: e.target.value,
    });
  };

  ChangeModelState = condition => {
    this.props.dispatch({
      type: 'tasklistNew/updateState',
      payload: { ...condition },
    });
  };

  //任务状态
  getTaskStatus = value => {
    let StatusName = null;
    if (value == EnumOperationTaskStatus.WaitFor) {
      StatusName = '待执行';
    } else if (value == EnumOperationTaskStatus.Underway) {
      StatusName = '进行中';
    } else if (value == EnumOperationTaskStatus.Completed) {
      StatusName = '已完成';
    } else if (value == EnumOperationTaskStatus.SystemOff) {
      StatusName = '系统关闭';
    }
    return StatusName;
  };

  //审核状态
  getAuditStatus = value => {
    let StatusName = null;
    if (value == EnumTaskReviewStatus.ToBeAudited) {
      StatusName = '待审批';
    } else if (value == EnumTaskReviewStatus.AuditPass) {
      StatusName = '审批通过';
    } else if (value == EnumTaskReviewStatus.AuditNotPass) {
      StatusName = '审批未通过';
    }
    return StatusName;
  };

  //查看任务详情
  seeDetail = record => {
    debugger;
    this.props.dispatch(
      routerRedux.push(`/taskdetail/emergencydetailinfolayout/${record.TaskID}/${record.DGIMN}`),
    );
  };

  /**行政区 */
  getRegionCode = val => {
    let str = '';
    if (val.length > 0) {
      val.forEach((value, index) => {
        str += `${value},`;
      });
    }
    const condition = {
      RegionCode: val,
    };
    this.ChangeModelState(condition);
  };

  //基本查询条件
  renderSimpleForm() {
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="企业点位" style={{ width: '100%' }}>
              <EnterprisePoint
                updateSltEnterModel={this.updateSltEnterModel}
                updateSltPointModel={this.updateSltPointModel}
                onRef={this.onRefResetEnterPoint}
                width="100%"
                minWidth="200px"
              />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="任务单号" style={{ width: '100%' }}>
              <Input
                placeholder="请输入"
                allowClear
                onChange={this.onTaskCodeChange}
                style={{ width: '100%', minWidth: 150 }}
                value={this.state.TaskCode}
              />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="执行人员" style={{ width: '100%' }}>
              <DepartmentPeople
                OperationsUserId={this.state.OperationsUserId}
                onRef={this.onRefResetPeople}
                updateSltUserModel={this.updateSltUserModel}
                width="100%"
                minWidth="200px"
              />
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'left' }}>
            <Button onClick={this.handleSearch} type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              展开 <Icon type="down" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  //高级查询条件
  renderAdvancedForm() {
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="企业点位" style={{ width: '100%' }}>
              <EnterprisePoint
                updateSltEnterModel={this.updateSltEnterModel}
                updateSltPointModel={this.updateSltPointModel}
                onRef={this.onRefResetEnterPoint}
                width="100%"
                minWidth="150px"
              />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="任务单号" style={{ width: '100%' }}>
              <Input
                placeholder="请输入"
                allowClear
                onChange={this.onTaskCodeChange}
                style={{ width: '100%', minWidth: 150 }}
                value={this.state.TaskCode}
              ></Input>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="执行人员" style={{ width: '100%' }}>
              <DepartmentPeople
                OperationsUserId={this.state.OperationsUserId}
                onRef={this.onRefResetPeople}
                updateSltUserModel={this.updateSltUserModel}
                width="100%"
                minWidth="200px"
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="行政区" style={{ width: '100%' }}>
              <EnterpriseMultiSelect
                width="100%"
                minWidth="150px"
                getRegionCode={this.getRegionCode}
                RegionCode=""
                DefaultValue={null}
                changeOnSelect={true}
                onRef={this.onRefResetRegion}
              />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="创建时间" style={{ width: '100%' }}>
              <RangePicker_
                style={{ width: '100%', minWidth: 150 }}
                onChange={this._handleDateChange}
                format="YYYY-MM-DD"
                dateValue={this.state.rangeDate}
              />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="完成时间" style={{ width: '100%' }}>
              <RangePicker_
                style={{ width: '100%', minWidth: 150 }}
                onChange={this._handleFinishDateChange}
                format="YYYY-MM-DD"
                dateValue={this.state.rangeFinishDate}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="任务类型" style={{ width: '100%' }}>
              <Select
                style={{ width: '100%', minWidth: 150 }}
                placeholder="请选择"
                allowClear
                onChange={this.onContentTypeChange}
                value={this.state.TaskContentType}
              >
                <Option value={1}>巡检</Option>
                <Option value={2}>维护/维修</Option>
                <Option value={3}>校准</Option>
                <Option value={4}>手工比对</Option>
                <Option value={5}>配合对比</Option>
                <Option value={6}>配合检查</Option>
              </Select>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="项目编号" style={{ width: '100%' }}>
              <Input
                placeholder="请输入"
                allowClear
                onChange={this.onItemNumChange}
                style={{ width: '100%', minWidth: 150 }}
                value={this.state.ItemNum}
              />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="任务状态" style={{ width: '100%' }}>
              <RadioGroup
                style={{ width: '100%', minWidth: 290 }}
                defaultValue={0}
                onChange={this.onTaskStatusChange}
                value={this.state.TaskStatus}
              >
                <RadioButton value={0}>全部</RadioButton>
                <RadioButton value={EnumOperationTaskStatus.WaitFor}>待执行</RadioButton>
                <RadioButton value={EnumOperationTaskStatus.Underway}>进行中</RadioButton>
                <RadioButton value={EnumOperationTaskStatus.Completed}>已完成</RadioButton>
                <RadioButton value={EnumOperationTaskStatus.SystemOff}>系统关闭</RadioButton>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="审批状态" style={{ width: '100%' }}>
              <RadioGroup
                style={{ width: '100%', minWidth: 330 }}
                defaultValue={0}
                onChange={this.onAuditStatusChange}
                value={this.state.AuditStatus}
              >
                <RadioButton value={0}>全部</RadioButton>
                <RadioButton value={EnumTaskReviewStatus.ToBeAudited}>待审批</RadioButton>
                <RadioButton value={EnumTaskReviewStatus.AuditPass}>审批通过</RadioButton>
                <RadioButton value={EnumTaskReviewStatus.AuditNotPass}>审批未通过</RadioButton>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...this.formLayout} label="" style={{ width: '100%' }}>
              <Button onClick={this.handleSearch} type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </FormItem>
          </Col>
          <Col md={8} sm={24}></Col>
        </Row>
        {/* <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'left', marginBottom: 14 }}>
        
          </div>
          </div> */}
      </Form>
    );
  }
  renderloading = (columns, dataSource) => {
    if (this.props.loading) {
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
    return (
      <Table
        rowKey={(record, index) => `complete${index}`}
        size="middle"
        className={styles.dataTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1990, y: 'calc(100vh - 380px)' }}
        rowClassName={(record, index, indent) => {
          if (index === 0) {
            return;
          }
          if (index % 2 !== 0) {
            return 'light';
          }
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize: this.props.pageSize,
          current: this.props.pageIndex,
          onChange: this.onPageChange,
          onShowSizeChange: this.onShowSizeChange,
          pageSizeOptions: ['10', '20', '30', '40'],
          total: this.props.MaintenanceTaskHistoryRecordCount,
        }}
      />
    );
  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const height = 'calc(100vh - 360px)';
    const dataSource =
      this.props.MaintenanceTaskHistoryList === null ? null : this.props.MaintenanceTaskHistoryList;
    const columns = [
      {
        title: '省/市/县区',
        width: 300,
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        align: 'center',
      },
      {
        title: '企业',
        width: 200,
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'center',
      },
      {
        title: '监测点',
        width: 150,
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
      },
      {
        title: '任务单号',
        width: 200,
        dataIndex: 'TaskCode',
        key: 'TaskCode',
        align: 'center',
      },
      {
        title: '任务类型',
        width: 120,
        dataIndex: 'TaskContentType',
        key: 'TaskContentType',
        align: 'center',
      },
      {
        title: '执行人',
        width: 120,
        dataIndex: 'OperationsName',
        key: 'OperationsName',
        align: 'center',
      },
      {
        title: '完成时间',
        width: 170,
        dataIndex: 'CompleteTime',
        key: 'CompleteTime',
        align: 'center',
      },
      {
        title: '工作时长(小时)',
        width: 120,
        dataIndex: 'WorkTime',
        key: 'WorkTime',
        align: 'center',
      },
      {
        title: '任务状态',
        width: 120,
        dataIndex: 'TaskStatus',
        key: 'TaskStatus',
        align: 'center',
        render: (value, record, index) => {
          return this.getTaskStatus(value);
        },
      },
      {
        title: '审批状态',
        width: 120,
        dataIndex: 'AuditStatus',
        key: 'AuditStatus',
        align: 'center',
        render: (value, record, index) => {
          return this.getAuditStatus(value);
        },
      },
      {
        title: '创建人',
        width: 120,
        dataIndex: 'CreateUserName',
        key: 'CreateUserName',
        align: 'center',
      },
      {
        title: '创建时间',
        width: 170,
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        align: 'center',
      },
      {
        title: '详细',
        dataIndex: 'TaskID',
        width: 80,
        key: 'TaskID',
        align: 'center',

        render: (text, record) => <a onClick={() => this.seeDetail(record)}> 详细</a>,
      },
    ];

    return (
      <MonitorContent
        {...this.props}
        breadCrumbList={[{ Name: '智能运维', Url: '' }, { Name: '运维任务记录', Url: '' }]}
      >
        <div className={styles.cardTitle}>
          <Card bordered={false}>
            <div style={{ marginBottom: 14 }}>{this.renderForm()}</div>
            {this.renderloading(columns, dataSource)}
          </Card>
        </div>
      </MonitorContent>
    );
  }
}
export default MaintenanceTaskHistoryList;
