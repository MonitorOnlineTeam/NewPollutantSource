/*
 * @Author: Jiaqi 
 * @Date: 2019-09-06 15:21:22 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-09-11 11:43:29
 * @desc: 任务记录页面
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Tooltip, Popconfirm, Icon, Divider, Modal, Form, Select, Input, Row, Spin } from 'antd';
import moment from 'moment';
import Cookie from 'js-cookie';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import EnterprisePointCascadeMultiSelect from '@/components/EnterprisePointCascadeMultiSelect'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ loading, operations, autoForm }) => ({
  operationsUserList: operations.operationsUserList,
  loading: loading.effects["operations/addTask"],
  autoFormLoading: loading.effects['autoForm/getPageConfig'],
}))
@Form.create()
class TaskRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
            DGIMNs: values.DGIMNs.toString(),
            // DGIMNs: "w120100000004",
            createUserId: user.User_ID,
            // operationsUserId: values.operationsUserId,
            remark: values.remark,
            taskFrom: values.taskFrom
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
      <PageHeaderWrapper>
        <Card className="contentContainer">
          <SearchWrapper configId={configId} />
          <AutoFormTable
            style={{ marginTop: 10 }}
            configId={configId}
            appendHandleRows={(row, key) => {
              const text = row["dbo.T_Bas_Task.CompleteTime"];
              if (text) {
                // 当前时间 > 完成时间显示驳回
                if (moment().diff(text, 'days') > 7) {
                  return <>
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
                        <a><Icon type="close-circle" /></a>
                      </Popconfirm>
                    </Tooltip>
                  </>
                }
              }
            }}
            appendHandleButtons={(keys, rows) => {
              return <Button icon="plus" type="primary" onClick={() => {
                this.setState({
                  visible: true,
                })
              }}>派单</Button>
            }}
          />
        </Card>
        <Modal
          title="派单"
          visible={this.state.visible}
          width="560px"
          destroyOnClose
          loading={loading}
          onOk={this.addTask}
          onCancel={() => {
            this.setState({ visible: false })
          }}
        >
          <Form layout="inline">
            <Row>
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
                  }} />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem {...formLayout} label="紧急程度" style={{ width: '100%', marginBottom: 10 }}>
                {getFieldDecorator("taskFrom", {
                  rules: [
                    {
                      required: true,
                      message: '请选择紧急程度!',
                    },
                  ]
                })(
                  <Select placeholder="请选择紧急程度">
                    <Option value="1">普通</Option>
                    <Option value="2">紧急</Option>
                    <Option value="3">一般</Option>
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
                  rules: [
                    {
                      required: true,
                      message: '请填写描述',
                    },
                  ]
                })(
                  <TextArea placeholder="请填写描述" rows={4} />
                )}
              </FormItem>
            </Row>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default TaskRecord;