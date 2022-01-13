/*
 * @Author: xpy
 * @Date: 2020-06-28 15:21:22
 * @desc: 任务记录页面
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  CloseCircleOutlined,
  DownOutlined,
  PlusOutlined,
  ProfileOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Button,
  Tooltip,
  Popconfirm,
  Divider,
  Modal,
  Select,
  Input,
  Row,
  Spin,
  Col,
  Tag,
  Badge,
} from 'antd';
import moment from 'moment';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import CascaderMultiple from '@/components/CascaderMultiple'
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import SdlTable from '@/components/SdlTable'
import  TaskRecordDetails  from '@/pages/EmergencyTodoList/EmergencyDetailInfoLayout' 
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ loading, operations, task, global }) => ({
  operationsUserList: operations.operationsUserList,
  loading: loading.effects['operations/addTask'],
  recordType: operations.recordType,
  pointInfoList: operations.pointInfoList,
  targetInfoList: operations.targetInfoList,
  gettasklistqueryparams: task.gettasklistqueryparams,
  datatable: task.datatable,
  LoadingData: loading.effects['task/GetOperationTaskList'],
  clientHeight: global.clientHeight,
  operationCompanyList:operations.operationCompanyList

}))
@Form.create()
class TaskRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ParentType: '企业',
      expand: false,
    //  EntCode:null,
      taskRecordDetailVisible:false,
      TaskID:null,
      DGIMN:null
    };
    this._SELF_ = {
      configId: 'TaskRecord',
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
    }
    this._handleExpand = this._handleExpand.bind(this);
    this._resetForm = this._resetForm.bind(this);
  }

  componentDidMount() {
    // 获取运维人员
    // this.props.dispatch({
    //   type: 'operations/getOperationsUserList',
    //   payload: {
    //     RolesID: '2b345cf3-1440-4898-84c8-93f9a64f8daf',
    //   },
    // })
    this.LoadData();
  }

  /** 时间控件回调 */
  dateCallBack = (dates, type, fieldName) => {
    const { form: { setFieldsValue } } = this.props;
    if (dates[0] && dates[1]) { setFieldsValue({ [fieldName]: dates }); } else {
      setFieldsValue({ [fieldName]: undefined });
    }
  }

  /** 展开或折叠 */
  _handleExpand() {
    this.setState({
      expand: !this.state.expand,
    }, () => {
      // 展开、收起重新计算table高度
      const tableElement = document.getElementsByClassName('ant-table-wrapper');
      if (tableElement.length) {
        const tableOffsetTop = this.getOffsetTop(tableElement[0]) + 110;
        const scrollYHeight = this.props.clientHeight - tableOffsetTop;
        const tableBodyEle = document.getElementById('sdlTable').getElementsByClassName('ant-table-body');
        if (tableBodyEle && tableBodyEle.length) {
          tableBodyEle[0].style.maxHeight = `${scrollYHeight}px`;
        }
      }
    });
  }

  getOffsetTop = obj => {
    let offsetCountTop = obj.offsetTop;
    let parent = obj.offsetParent;
    while (parent !== null) {
      offsetCountTop += parent.offsetTop;
      parent = parent.offsetParent;
    }
    return offsetCountTop;
  }

  /** 重置表单 */
  _resetForm() {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'task/updateState',
      payload: {
        gettasklistqueryparams: {
          pageIndex: 1,
          pageSize: 20,
        },
      },
    });
    setTimeout(() => {
      this.onSubmitForm();
    }, 0);
  }


  /** 查询 */
  onSubmitForm=() => {
    const { dispatch, form, gettasklistqueryparams,DGIMN,isHomeModal } = this.props;
    const baseReportSearchForm = form.getFieldsValue();
    console.log('baseReportSearchForm', baseReportSearchForm);
      dispatch({
        type: 'task/updateState',
        payload: {
          gettasklistqueryparams: {
                    ...gettasklistqueryparams,
                    DGIMN: baseReportSearchForm.DGIMN != undefined ? baseReportSearchForm.DGIMN.join(',') :isHomeModal?DGIMN:'',
                    TaskCode: baseReportSearchForm.TaskCode,
                    ExceptionType: baseReportSearchForm.ExceptionType != undefined ? baseReportSearchForm.ExceptionType : '',
                    TaskFrom: baseReportSearchForm.TaskFrom != undefined ? baseReportSearchForm.TaskFrom : '',
                    TaskStatus: baseReportSearchForm.TaskStatus != undefined ? baseReportSearchForm.TaskStatus : '',
                    OperationsUserId: baseReportSearchForm.OperationsUserId != undefined ? baseReportSearchForm.OperationsUserId : '',
                    TaskType: baseReportSearchForm.TaskType != undefined ? baseReportSearchForm.TaskType : '',
                    CompleteTime: baseReportSearchForm.CompleteTime,
                    CreateTime: baseReportSearchForm.CreateTime,
                    OperationEntID:baseReportSearchForm.OperationEntID,
                    pageIndex: 1,
                },
        },
    })
    dispatch({
      type: 'task/GetOperationTaskList',
      payload: {},
    });
    console.log('gettasklistqueryparams', gettasklistqueryparams);
  }

  /** 加载列表 */
  LoadData = () => {
    const {
        dispatch, gettasklistqueryparams,
        isHomeModal,DGIMN
    } = this.props;
    dispatch({
        type: 'task/updateState',
        payload: {
          gettasklistqueryparams:{
            ...gettasklistqueryparams,
            DGIMN:isHomeModal?DGIMN:''
          },
        },
    })
     dispatch({
       type: 'task/GetOperationTaskList',
     });
     dispatch({
      type: 'operations/getOperationCompanyList',
      payload: {},
    });

}

   /** 分页 */
   onShowSizeChange = (pageIndex, pageSize) => {
    const {
        dispatch, gettasklistqueryparams, form,
    } = this.props;
    const baseReportSearchForm = form.getFieldsValue();
      dispatch({
        type: 'task/updateState',
        payload: {
          gettasklistqueryparams: {
                    ...gettasklistqueryparams,
                    DGIMN: baseReportSearchForm.DGIMN != undefined ? baseReportSearchForm.DGIMN.join(',') : '',
                    TaskCode: baseReportSearchForm.TaskCode,
                    ExceptionType: baseReportSearchForm.ExceptionType != undefined ? baseReportSearchForm.ExceptionType : '',
                    TaskFrom: baseReportSearchForm.TaskFrom != undefined ? baseReportSearchForm.TaskFrom : '',
                    TaskStatus: baseReportSearchForm.TaskStatus != undefined ? baseReportSearchForm.TaskStatus : '',
                    OperationsUserId: baseReportSearchForm.OperationsUserId != undefined ? baseReportSearchForm.OperationsUserId : '',
                    TaskType: baseReportSearchForm.TaskType != undefined ? baseReportSearchForm.TaskType : '',
                    CompleteTime: baseReportSearchForm.CompleteTime,
                    CreateTime: baseReportSearchForm.CreateTime,
                    pageIndex,
                    pageSize,
                },
        },
    })
    dispatch({
      type: 'task/GetOperationTaskList',
      payload: {},
    });
}

onChange = (pageIndex, pageSize) => {
    const {
        dispatch, gettasklistqueryparams, form,
    } = this.props;
    const baseReportSearchForm = form.getFieldsValue();
    dispatch({
      type: 'task/updateState',
      payload: {
        gettasklistqueryparams: {
                  ...gettasklistqueryparams,
                  DGIMN: baseReportSearchForm.DGIMN != undefined ? baseReportSearchForm.DGIMN.join(',') : '',
                  TaskCode: baseReportSearchForm.TaskCode,
                  ExceptionType: baseReportSearchForm.ExceptionType != undefined ? baseReportSearchForm.ExceptionType : '',
                  TaskFrom: baseReportSearchForm.TaskFrom != undefined ? baseReportSearchForm.TaskFrom : '',
                  TaskStatus: baseReportSearchForm.TaskStatus != undefined ? baseReportSearchForm.TaskStatus : '',
                  OperationsUserId: baseReportSearchForm.OperationsUserId != undefined ? baseReportSearchForm.OperationsUserId : '',
                  TaskType: baseReportSearchForm.TaskType != undefined ? baseReportSearchForm.TaskType : '',
                  CompleteTime: baseReportSearchForm.CompleteTime,
                    CreateTime: baseReportSearchForm.CreateTime,
                  pageIndex,
                  pageSize,
              },
      },
  })
  dispatch({
    type: 'task/GetOperationTaskList',
    payload: {},
  });
}

  // 派单
  addTask = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const userCookie = Cookie.get('currentUser');
        const user = JSON.parse(userCookie);
        this.props.dispatch({
          type: 'operations/addTask',
          payload: {
            taskType: 1,
            DGIMNs: values.taskpoint,
            // DGIMNs: "w120100000004",
            createUserId: user.User_ID,
            taskFrom: 3,
            // operationsUserId: values.operationsUserId,
            remark: values.remark,
            RecordType: values.RecordType,
          },
          callback: res => {
            this.setState({
              visible: false,
            })
          },
        })
      }
    });
  }


  // 驳回
  rejectTask = key => {
    this.props.dispatch({
      type: 'operations/rejectTask',
      payload: {
        taskId: key,
      },
    })
  }

  // 监控类型选择
  taskParentTypeChange=val => {
      this.props.dispatch({
        type: 'operations/getTargetInfoList',
        payload: {
          ParentType: val,
        },
      })
      let ParentType = '企业';
      if (val != 1) {
        ParentType = '大气站'
      }
      this.setState({
        ParentType,
      //  EntCode:null

      });

      this.props.form.setFieldsValue({ taskparent: undefined, taskpoint: undefined })
  }

   // 监控标选择
   taskParentChange=val => {
    this.props.dispatch({
      type: 'operations/getPointInfoList',
      payload: {
        EntCode: val,
      },
    })
}

// 站点选择
taskPointChange=val => {
  this.props.dispatch({
    type: 'operations/getTaskType',
    payload: {
      DGIMN: val,
    },
  })
}

// 获取监控标下拉框
getTargetInfoList=() => {
  const { targetInfoList } = this.props;
  const res = [];
  if (targetInfoList) {
    targetInfoList.map(item => {
      res.push(<Option value={item.code}>{item.name}</Option>)
    })
  }
  return res;
}

// 获取站点下拉框
getPointInfoList=() => {
  const { pointInfoList } = this.props;
  const res = [];
  if (pointInfoList) {
    pointInfoList.map(item => {
      res.push(<Option value={item.DGIMN}>{item.PointName}</Option>)
    })
  }
  return res;
}

// 获取任务类型下拉框
getTaskTypeInfo=() => {
  const { recordType } = this.props;
  const res = [];
  if (recordType) {
    recordType.map(item => {
      res.push(<Option value={item.ID}>{item.TypeName}</Option>)
    })
  }
  return res;
}
//运维单位列表
operationCompanyList=()=>{
  const { operationCompanyList } = this.props;
   return operationCompanyList.map(item=>{
   return  <Option key={item.id} value={item.id}>{item.name}</Option>
  })
}
taskRecordDetails=(TaskID,DGIMN)=>{ //首页详情弹框
  this.setState({
    taskRecordDetailVisible:true,
    TaskID:TaskID,
    DGIMN:DGIMN
  })
}
  render() {
    const { form: { getFieldDecorator }, operationsUserList, loading, LoadingData, gettasklistqueryparams,isHomeModal } = this.props;
    const { formLayout } = this._SELF_;
    console.log('gettasklistqueryparams', gettasklistqueryparams);
    const {TaskID,DGIMN} = this.state;
    const columns = [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        align:'center'
      },
      {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      },
      {
        title: '监测点名称',
        dataIndex: 'PointName',
        key: 'PointName',
      },
      {
        title: '运维单位',
        dataIndex: 'operationCompanyName',
        key: 'operationCompanyName',
      },
      {
        title: '任务单号',
        dataIndex: 'TaskCode',
        key: 'TaskCode',
      },
      {
        title: '运维状态',
        dataIndex: 'ExceptionType',
        key: 'ExceptionType',
        render: (text, record) => {
          if (text === '1') {
            return <span>打卡异常</span>;
          }
          if (text === '2') {
            return <span>报警响应异常</span>;
          }
          if (text === '3') {
          return <span>工作超时</span>;
}
        },
      },
      {
        title: '任务来源',
        dataIndex: 'TaskFrom',
        key: 'TaskFrom',
        render: (text, record) => {
          if (text === 1) {
            return <span><Tag color="purple">手动创建</Tag></span>;
          }
          if (text === 2) {
            return <span><Tag color="red">报警响应</Tag></span>;
          }
          if (text === 3) {
            return <span><Tag color="blue">监管派单</Tag></span>;
          }
          if (text === 4) {
          return <span><Tag color="pink">自动派单</Tag></span>;
          }
        },
      },
      {
        title: '任务状态',
        dataIndex: 'TaskStatus',
        key: 'TaskStatus',
        render: (text, record) => {
          if (text === 11) {
            return <span><Badge status="warning" text="待领取" /></span>;
            }
          if (text === 1) {
            return <span><Badge status="default" text="待执行" /></span>;
          }
          if (text === 2) {
            return <span><Badge status="processing" text="进行中" /></span>;
          }
          if (text === 3) {
            return <span><Badge status="success" text="已完成" /></span>;
          }
          if (text === 10) {
          return <span><Badge status="error" text="系统关闭" /></span>;
          }
   
        },
      },
      {
        title: '运维人',
        dataIndex: 'OperationsUserName',
        key: 'OperationsUserName',

      },
      {
        title: '完成时间',
        dataIndex: 'CompleteTime',
        key: 'CompleteTime',

      },
      {
        title: '创建人',
        dataIndex: 'CreateUserName',
        key: 'CreateUserName',

      },
      {
        title: '创建时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',

      },
      {
        title: '任务类型',
        dataIndex: 'RecordName',
        key: 'RecordName',

      },
      {
          title: '操作',
          key: 'action',
          render: (text, record, index) => {
            {
              const time = record.CompleteTime;
              const { DGIMN } = record;
              const TaskID = record.ID;
              const reslist = [];
              reslist.push(
                <Tooltip title="详情">
                <a><ProfileOutlined
                  onClick={() =>isHomeModal?this.taskRecordDetails(TaskID,DGIMN) : this.props.dispatch(routerRedux.push(`/operations/taskRecord/details/${TaskID}/${DGIMN}`))} /></a>
                   </Tooltip>,
              )
              if (time) {
                console.log('timetimetimetimetimetime', moment().diff(time, 'days'));
                // 当前时间 > 完成时间显示驳回
                if (moment().diff(time, 'days') < 7) {
                  reslist.push(
                  <>
                  <Divider type="vertical" />
                  <Tooltip title="驳回">
                    <Popconfirm
                      placement="left"
                      title="确认是否驳回?"
                      onConfirm={() => {
                        this.rejectTask(TaskID);
                      }}
                      okText="是"
                      cancelText="否">
                      <a><CloseCircleOutlined /></a>
                    </Popconfirm>
                  </Tooltip></>)
                }
              }
              return reslist;
           }
          },
      },
  ];
    const style = {};
    if (this.state.expand) {
      style.float = 'right';
    } else {
      style.marginLeft = 20;
    }
    if(isHomeModal){
     columns.splice(0,3)
    }
    // console.log('LoadingData', LoadingData);
    // if (LoadingData) {
    //   return (<Spin
    //     style={{
    //       width: '100%',
    //       height: 'calc(100vh/2)',
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //     }}
    //     size="large"
    //   />);
    // }
    return (
      <BreadcrumbWrapper hideBreadcrumb={this.props.hideBreadcrumb}>
        <Card className="contentContainer">
          <Form layout=""  className='searchForm' style={{ marginBottom: '10' }}>
              <Row>
               {!isHomeModal&&<Col md={8} sm={24}>
                      <FormItem {...formLayout} label="监测点" style={{ width: '100%' }}>
                          {getFieldDecorator('DGIMN', {
                            initialValue: gettasklistqueryparams.DGIMN ? gettasklistqueryparams.DGIMN.split(',') : undefined,
                          })(
                            <CascaderMultiple {...this.props} style={{ width: '100%' }}/>,
                          )}
                      </FormItem>
                  </Col>}
                  <Col md={8} sm={24}>
                      <FormItem {...formLayout} label="创建时间" style={{ width: '100%' }}>
                          {getFieldDecorator('CreateTime', {
                            initialValue: gettasklistqueryparams.CreateTime,
                          })(
                            <RangePicker_
                            dateValue={ gettasklistqueryparams.CreateTime}
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            callback={(dates, type) => this.dateCallBack(dates, type, 'CreateTime')} allowClear showTime="YYYY-MM-DD HH:mm:ss" />,
                          )}
                      </FormItem>
                     
                  </Col>
                  <Col md={8} sm={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
                      <FormItem {...formLayout} label="运维单位" style={{ width: '100%' }}>
                          {getFieldDecorator('OperationEntID', {
                            initialValue: gettasklistqueryparams.OperationEntID ? gettasklistqueryparams.OperationEntID : undefined,
                          })(
                            <Select
                            showSearch
                            placeholder="请选择"
                            allowClear
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                              {this.operationCompanyList()}
                            </Select>,
                          )}
                      </FormItem>
                  </Col> 
                  <Col md={8} sm={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
                      <FormItem {...formLayout} label="运维状态" style={{ width: '100%' }}>
                          {getFieldDecorator('ExceptionType', {
                            initialValue: gettasklistqueryparams.ExceptionType ? gettasklistqueryparams.ExceptionType : undefined,
                          })(
                              <Select
                              placeholder="请选择"
                              allowClear
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              >
                              <Option key="1" value="1">打卡异常</Option>
                              <Option key="2" value="2">报警响应异常</Option>
                              <Option key="3" value="3">工作超时</Option>
                            </Select>,
                          )}
                      </FormItem>
                  </Col> 
                  <Col md={8} sm={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
                      <FormItem {...formLayout} label="任务来源" style={{ width: '100%' }}>
                          {getFieldDecorator('TaskFrom', {
                             initialValue: gettasklistqueryparams.TaskFrom ? gettasklistqueryparams.TaskFrom : undefined,
                          })(
                              <Select
                              style={{ width: '100%' }}
                                  placeholder="请选择"
                                  allowClear
                                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              >
                                  <Option key="1" value="1">手动创建</Option>
                                  <Option key="2" value="2">报警响应</Option>
                                  <Option key="3" value="3">监管派单</Option>
                                  <Option key="4" value="4">自动派单</Option>
                              </Select>,
                          )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
                      <FormItem {...formLayout} label="任务状态" style={{ width: '100%' }}>
                          {getFieldDecorator('TaskStatus', {
                            initialValue: gettasklistqueryparams.TaskStatus ? gettasklistqueryparams.TaskStatus : undefined,
                          })(
                              <Select
                                  placeholder="请选择"
                                  style={{ width: '100%' }}
                                  allowClear
                                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                              >
                                  <Option key="11" value="11">待领取</Option>
                                  <Option key="1" value="1">待执行</Option>
                                  <Option key="2" value="2">进行中</Option>
                                  <Option key="3" value="3">已完成</Option>
                                  <Option key="10" value="10">系统关闭</Option>
                              </Select>,
                          )}
                      </FormItem>
                  </Col>
                  <Col md={8} sm={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
                      <FormItem {...formLayout} label="运维人" style={{ width: '100%' }}>
                          {getFieldDecorator('OperationsUserId', {
                            initialValue: gettasklistqueryparams.OperationsUserId ? gettasklistqueryparams.OperationsUserId : undefined,
                          })(
                              <SearchSelect
                              style={{ width: '100%' }}
                              configId="View_OperationUser"
                              itemName="dbo.View_OperationUser.CreateUserName"
                              itemValue="dbo.View_OperationUser.CreateUserID"
                            />,
                          )}
                      </FormItem>
                  </Col>
                  <Col md={8} sm={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
                      <FormItem {...formLayout} label="完成时间" style={{ width: '100%' }}>
                          {getFieldDecorator('CompleteTime', {
                            initialValue: gettasklistqueryparams.CompleteTime,
                          })(
                            <RangePicker_
                            style={{ width: '100%' }}
                            dateValue={ gettasklistqueryparams.CompleteTime}
                            format="YYYY-MM-DD HH:MM"
                            callback={(dates, type) => this.dateCallBack(dates, type, 'CompleteTime')} allowClear showTime="YYYY-MM-DD HH:MM" />,
                          )}
                      </FormItem>
                  </Col>
                  <Col md={8} sm={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
                      <FormItem {...formLayout} label="任务单号" style={{ width: '100%' }}>
                          {getFieldDecorator('TaskCode', {
                            initialValue: gettasklistqueryparams.TaskCode,
                          })(
                            <Input placeholder="请输入" allowClear />,
                          )}
                      </FormItem>
                  </Col>
                  <Col md={8} sm={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
                      <FormItem {...formLayout} label="任务类型" style={{ width: '100%' }}>
                          {getFieldDecorator('TaskType', {
                            initialValue: gettasklistqueryparams.TaskType ? gettasklistqueryparams.TaskType : undefined,
                          })(
                              <SearchSelect
                              style={{ width: '100%' }}
                              configId="RecordTypes"
                              itemName="dbo.T_Cod_RecordTypes.PollutantTypeName"
                              itemValue="dbo.T_Cod_RecordTypes.ID"
                            />,
                          )}
                      </FormItem>
                  </Col>
                  <div style={{ marginTop: 4, ...style }}>
                    <Button
                          style={{ marginLeft: 8 }}
                          onClick={() => {
                              this.onSubmitForm()
                          }}
                          type="primary"
                      >
                          查询
                          </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this._resetForm}>
                          重置
                          </Button>
                      {
                          this.state.expand ?
                              <a style={{ marginLeft: 8 }} onClick={this._handleExpand}>
                                  收起 <UpOutlined />
                              </a> :
                              <a style={{ marginLeft: 8 }} onClick={this._handleExpand}>
                                  展开 <DownOutlined />
                              </a>
                      }
                  </div>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={16} sm={24} style={{ margin: '10px 0' }}>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => {
                      this.setState({
                        visible: true,
                      })
                    }}>派单</Button>
                  </Col>
              </Row>
          </Form>
          <SdlTable
              loading={LoadingData}
              dataSource={this.props.datatable}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                pageSize: gettasklistqueryparams.pageSize,
                current: gettasklistqueryparams.pageIndex,
                onChange: this.onChange,
                onShowSizeChange: this.onShowSizeChange,
                pageSizeOptions: ['20', '30', '40', '100'],
                total: gettasklistqueryparams.total,
              }}
              columns={columns}
        />
        </Card>
        <Modal
          title="派单"
          visible={this.state.visible}
          width="560px"
          destroyOnClose
          confirmLoading={loading}
          onOk={this.addTask}
          onCancel={() => {
            this.setState({ visible: false })
          }}
        >
          <Form layout="inline">
            <Row>
            <FormItem {...formLayout} label="监控类型" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator('taskParentType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择监控类型!',
                    },
                  ],
                })(
                  <Select placeholder="请选择监控类型" onChange={this.taskParentTypeChange}>
                    <Option value={1}>企业</Option>
                    <Option value={2}>大气站</Option>
                  </Select>,
                )}
              </FormItem>
            </Row>

            <Row>
            <FormItem {...formLayout} label={this.state.ParentType} style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator('taskparent', {
                 //  initialValue: this.state.EntCode,
                  rules: [
                    {
                      required: true,
                      message: `请选择${this.state.ParentType}!`,
                    },
                  ],
                })(
                  <Select placeholder={`请选择${this.state.ParentType}`} onChange={this.taskParentChange}>
                     {this.getTargetInfoList()}
                  </Select>,
                )}
              </FormItem>
            </Row>
            <Row>
            <FormItem {...formLayout} label="监测点" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator('taskpoint', {
                  rules: [
                    {
                      required: true,
                      message: '请选择监测点!',
                    },
                  ],
                })(
                  <Select placeholder="请选择监测点" onChange={this.taskPointChange}>
                     {this.getPointInfoList()}
                  </Select>,
                )}
              </FormItem>
            </Row>

            <Row>
              <FormItem {...formLayout} label="任务类型" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator('RecordType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择任务类型!',
                    },
                  ],
                })(
                  <Select placeholder="请选择任务类型">
                    {this.getTaskTypeInfo()}
                  </Select>,
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem {...formLayout} label="描述" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator('remark', {
                })(
                  <TextArea placeholder="请填写描述" rows={4} />,
                )}
              </FormItem>
            </Row>
          </Form>
        </Modal>
        <Modal
          title="任务详情"
          visible={this.state.taskRecordDetailVisible}
          destroyOnClose
          wrapClassName='spreadOverModal'
          footer={null}
          onCancel={() => {
            this.setState({ taskRecordDetailVisible: false })
          }}
          
        >
          <TaskRecordDetails
           match={{params:{TaskID: TaskID, DGIMN: DGIMN}}}
           isHomeModal
           hideBreadcrumb
          />
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default TaskRecord;
