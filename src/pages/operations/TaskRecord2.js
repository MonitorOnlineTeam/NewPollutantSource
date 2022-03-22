/*
 * @Author: Jiaqi 
 * @Date: 2019-09-06 15:21:22 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2021-01-12 16:59:16
 * @desc: 任务记录页面
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { CloseCircleOutlined, PlusOutlined, ProfileOutlined } from '@ant-design/icons';
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
} from 'antd';
import moment from 'moment';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ loading, operations, autoForm }) => ({
  operationsUserList: operations.operationsUserList,
  loading: loading.effects["operations/addTask"],
  autoFormLoading: loading.effects['autoForm/getPageConfig'],
  recordType:operations.recordType,
  pointInfoList:operations.pointInfoList,
  targetInfoList:operations.targetInfoList

}))
@Form.create()
class TaskRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ParentType:'企业',
    //  EntCode:null,
    };
    this._SELF_ = {
      configId: "TaskRecord",
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 17 },
      },
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: this._SELF_.configId
      }
    });

    // 获取运维人员
    this.props.dispatch({
      type: 'operations/getOperationsUserList',
      payload: {
        RolesID: "eec719c2-7c94-4132-be32-39fe57e738c9"
      }
    })
  
  }

  // 派单
  addTask = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const userCookie = Cookie.get('currentUser');
        const user = JSON.parse(userCookie);
        this.props.dispatch({
          type: "operations/addTask",
          payload: {
            taskType: 1,
            DGIMNs: values.taskpoint,
            // DGIMNs: "w120100000004",
            createUserId: user.User_ID,
            taskFrom: 3,
            // operationsUserId: values.operationsUserId,
            remark: values.remark,
            RecordType: values.RecordType
          },
          callback: (res) => {
            this.setState({
              visible: false
            })
          }
        })
      }
    });

  }
   



  // 驳回
  rejectTask = (key) => {
    this.props.dispatch({
      type: "operations/rejectTask",
      payload: {
        taskId: key
      }
    })
  }

  // 监控类型选择
  taskParentTypeChange=(val)=>{
      this.props.dispatch({
        type:"operations/getTargetInfoList",
        payload:{
          ParentType:val
        }
      })
      let ParentType="企业";
      if(val!=1)
      {
        ParentType="大气站"
      }
      this.setState({
        ParentType,
      //  EntCode:null

      });

      this.props.form.setFieldsValue({ "taskparent": undefined,"taskpoint":undefined })
  }

   // 监控标选择
   taskParentChange=(val)=>{
    this.props.dispatch({
      type:"operations/getPointInfoList",
      payload:{
        EntCode:val
      }
    })


}

// 站点选择
taskPointChange=(val)=>{
  this.props.dispatch({
    type:"operations/getTaskType",
    payload:{
      DGIMN:val
    }
  })
 
}

//获取监控标下拉框
getTargetInfoList=()=>{
  const {targetInfoList}=this.props;
  let res=[];
  if(targetInfoList)
  {
    targetInfoList.map(item=>{
      res.push(<Option value={item.code}>{item.name}</Option>)
    })
  }
  return res;
}

//获取站点下拉框
getPointInfoList=()=>{
  const {pointInfoList}=this.props;
  let res=[];
  if(pointInfoList)
  {
    pointInfoList.map(item=>{
      res.push(<Option value={item.DGIMN}>{item.PointName}</Option>)
    })
  }
  return res;
}

//获取任务类型下拉框
getTaskTypeInfo=()=>{
  const {recordType}=this.props;
  let res=[];
  if(recordType)
  {
    recordType.map(item=>{
      res.push(<Option value={item.ID}>{item.TypeName}</Option>)
    })
  }
  return res;

}



  render() {
    const { form: { getFieldDecorator }, operationsUserList, loading, autoFormLoading } = this.props;
    const { configId, formLayout } = this._SELF_;
    if (autoFormLoading) {
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
      <BreadcrumbWrapper>
        <Card className="contentContainer">
          <SearchWrapper configId={configId} />
          <AutoFormTable
            style={{ marginTop: 10 }}
            configId={configId}
            appendHandleRows={(row, key) => {
              const text = row["dbo.T_Bas_Task.CompleteTime"];
              const DGIMN=row["dbo.T_Bas_Task.DGIMN"];
              const TaskID=row["dbo.T_Bas_Task.ID"];
              let reslist=[];
              reslist.push(
                <Tooltip title="详情">
                <a><ProfileOutlined
                  onClick={()=>this.props.dispatch(routerRedux.push
                    (`/operations/taskRecord/details/${TaskID}/${DGIMN}`))} /></a>
                   </Tooltip>
              )
              if (text) {
                // 当前时间 > 完成时间显示驳回
                if (moment().diff(text, 'days') > 7) {
                  reslist.push(
                  <>
                  <Divider type="vertical" />
                  <Tooltip title="驳回">
                    <Popconfirm
                      placement="left"
                      title="确认是否驳回?"
                      onConfirm={() => {
                        this.rejectTask(key);
                      }}
                      okText="是"
                      cancelText="否">
                      <a><CloseCircleOutlined /></a>
                    </Popconfirm>
                  </Tooltip></>)
                }
              }
              return reslist;
            }}
            appendHandleButtons={(keys, rows) => {
              return (
                <Button icon={<PlusOutlined />} type="primary" onClick={() => {
                  this.setState({
                    visible: true,
                  })

                  
                }}>派单</Button>
              );
            }}
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
            {/* <Row>
              <FormItem {...formLayout} label="监测点" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator("DGIMNs", {
                  rules: [
                    {
                      required: true,
                      message: '请选择监测点!',
                    },
                  ]
                })(
                  <EnterprisePointCascadeMultiSelect rtnValType={"DGIMN"} placeholder="请选择监测点" onChange={(val) => {
                    debugger;
                    this.props.dispatch({
                      type: 'operations/getTaskTypeInfo',
                      payload:{}
                    })
                  }} />
                )}
              </FormItem>
            </Row> */}

            <Row>
            <FormItem {...formLayout} label="监控类型" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator("taskParentType", {
                  rules: [
                    {
                      required: true,
                      message: '请选择监控类型!',
                    },
                  ]
                })(
                  <Select placeholder="请选择监控类型" onChange={this.taskParentTypeChange}>
                    <Option value={1}>企业</Option>
                    <Option value={2}>大气站</Option>
                  </Select>
                )}
              </FormItem>
            </Row>

            <Row>
            <FormItem {...formLayout} label={this.state.ParentType} style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator("taskparent", {
                 //  initialValue: this.state.EntCode,
                  rules: [
                    {
                      required: true,
                      message: `请选择${this.state.ParentType}!`,
                    },
                  ]
                })(
                  <Select placeholder={`请选择${this.state.ParentType}`} onChange={this.taskParentChange}>
                     {this.getTargetInfoList()}
                  </Select>
                )}
              </FormItem>
            </Row>
            <Row>
            <FormItem {...formLayout} label="监测点" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator("taskpoint", {
                  rules: [
                    {
                      required: true,
                      message: `请选择监测点!`,
                    },
                  ]
                })(
                  <Select placeholder={`请选择监测点`} onChange={this.taskPointChange}>
                     {this.getPointInfoList()}
                  </Select>
                )}
              </FormItem>
            </Row>

            <Row>
              <FormItem {...formLayout} label="任务类型" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator("RecordType", {
                  rules: [
                    {
                      required: true,
                      message: '请选择任务类型!',
                    },
                  ]
                })(
                  <Select placeholder="请选择任务类型">
                    {this.getTaskTypeInfo()}
                  </Select>
                )}
              </FormItem>
            </Row>
            {/* <Row>
              <FormItem {...formLayout} label="运维人" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator("operationsUserId", {
                  rules: [
                    {
                      required: true,
                      message: '请选择运维人!',
                    },
                  ]
                })(
                  <Select placeholder="请选择运维人">
                    {
                      operationsUserList.map((operation) => {
                        return <Option value={operation.UserID}>{operation.UserName}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Row> */}
            <Row>
              <FormItem {...formLayout} label="描述" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator("remark", {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请填写描述',
                  //   },
                  // ]
                })(
                  <TextArea placeholder="请填写描述" rows={4} />
                )}
              </FormItem>
            </Row>
          </Form>
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default TaskRecord;