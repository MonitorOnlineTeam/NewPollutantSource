/*
 * @desc: 审批单记录
 * @Author: Jiaqi
 * @Date: 2019-05-13 09:04:05
 * @Last Modified by: dongxiaoyun
 * @Last Modified time: 2020-8-6
 */
import React, { Component, Fragment } from 'react';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Form,
  Icon,
  Tag,
  Divider,
  Popconfirm,
  message,
  Select,
  Radio,
  TimePicker,
  Modal,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MonitorContent from '../../../components/MonitorContent/index';
import DepartmentPeople from '../../../components/DepartmentPeople/index';
import RangePicker_ from '../../../components/RangePicker/index';
import EnterprisePointCascadeMultiSelect from '../../../components/EnterprisePointCascadeMultiSelect/indexNew';

import styles from './index.less';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
const confirm = Modal.confirm;

@connect(({ loading, tasklist }) => ({
  loading: loading.effects['tasklist/loadAllTaskAuditRecordList'],
  allTaskAuditList: tasklist.allTaskAuditList,
  allTaskAuditSearchForm: tasklist.allTaskAuditSearchForm,
  taskTypeList: tasklist.taskTypeList,
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      month: Form.createFormField(props.allTaskAuditSearchForm.month),
      ExamStaus: Form.createFormField(props.allTaskAuditSearchForm.ExamStaus),
      TaskContentType: Form.createFormField(props.allTaskAuditSearchForm.TaskContentType),
      Time: Form.createFormField(props.allTaskAuditSearchForm.Time),
      ExamNumber: Form.createFormField(props.allTaskAuditSearchForm.ExamNumber),
      ImpPerson: Form.createFormField(props.allTaskAuditSearchForm.ImpPerson),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'tasklist/updateState',
      payload: {
        allTaskAuditSearchForm: {
          ...props.allTaskAuditSearchForm,
          ...fields,
        },
      },
    });
  },
})
class Index extends Component {
  constructor(props) {
    super(props);
    this._SELF_ = {
      formLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 16 },
      },
      columns: [
        {
          title: '省/市/县区',
          dataIndex: 'ProvinceAndCity',
          key: 'ProvinceAndCity',
          width: 200,
          align: 'center',
        },
        {
          title: '企业',
          dataIndex: 'EntName',
          key: 'EntName',
          width: 130,
        },
        {
          title: '监测点',
          dataIndex: 'PointName',
          key: 'PointName',
          width: 130,
        },
        {
          title: '审批编号',
          dataIndex: 'ExamNumber',
          key: 'ExamNumber',
          width: 200,
          align: 'center',
        },
        {
          title: '任务类型',
          dataIndex: 'TaskContenType',
          key: 'TaskContenType',
          width: 130,
        },
        {
          title: '申请人',
          dataIndex: 'ImpPerson',
          key: 'ImpPerson',
          width: 130,
        },
        {
          title: '申请时间',
          dataIndex: 'CreateTime',
          key: 'CreateTime',
          width: 200,
        },
        {
          title: '执行日期',
          dataIndex: 'ImpTime',
          key: 'ImpTime',
          width: 200,
          render: (text, record) => {
            return text && moment(text).format('YYYY-MM-DD');
          },
        },
        {
          title: '审批状态',
          dataIndex: 'ExamStaus',
          key: 'ExamStaus',
          width: 130,
        },
        {
          title: '操作',
          width: 200,
          // fixed: 'right',
          align: 'center',
          render: (text, record) => {
            return (
              <div>
                <a
                  onClick={() => {
                    this.props.dispatch(
                      routerRedux.push(
                        `/operations/AllTaskAuditRecord/components/TaskAuditRecordDetail/${record.ID}/${record.TaskID}/no`,
                      ),
                    );
                  }}
                >
                  详情
                </a>
              </div>
            );
          },
        },
      ],
    };

    this.$_search = this.$_search.bind(this);
    this.$_resetForm = this.$_resetForm.bind(this);
    this.$_onTableChange = this.$_onTableChange.bind(this);
    this._updatePointModel = this._updatePointModel.bind(this);
    this._saveImpPerson = this._saveImpPerson.bind(this);
  }

  componentDidMount() {
    // 获取任务类型
    this.props.dispatch({
      type: 'tasklist/getTaskType',
    });

    this.props.form.setFieldsValue({
      Time: [
        moment(
          moment(new Date())
            .subtract(1, 'month')
            .format('YYYY-MM-DD 00:00:00'),
        ),
        moment(moment(new Date()).format('YYYY-MM-DD 23:59:59')),
      ],
    });
    this.$_search();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'tasklist/updateState',
      payload: {
        allTaskAuditSearchForm: {
          ...this.props.allTaskAuditSearchForm,
          ImpPerson: undefined,
          current: 1,
          pageSize: 10,
        },
      },
    });
    // this.reset();
  }

  // 查询
  $_search() {
    this.props.dispatch({
      type: 'tasklist/loadAllTaskAuditRecordList',
    });
  }

  // 处理表单获取数据
  $_onTableChange(current, pageSize) {
    this.props.dispatch({
      type: 'tasklist/updateState',
      payload: {
        allTaskAuditSearchForm: {
          ...this.props.allTaskAuditSearchForm,
          current,
          pageSize,
        },
      },
    });
    setTimeout(() => {
      this.$_search();
    }, 0);
  }

  // 重置form
  $_resetForm() {
    // this.props.form.setFieldsValue({ 'PointCode': undefined, 'ImpPerson': undefined })
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'tasklist/updateState',
      payload: {
        allTaskAuditSearchForm: {
          ...this.props.allTaskAuditSearchForm,
          PointCode: undefined,
          ImpPerson: undefined,
          Time: undefined,
          current: 1,
          pageSize: 10,
        },
      },
    });
    this.reset();
    this.$_search();
  }

  _updatePointModel(value) {
    this.props.form.setFieldsValue({ PointCode: value });
  }

  _saveImpPerson(value) {
    this.props.form.setFieldsValue({ ImpPerson: value });
  }

  //   updateSltEnterModel=(sltEnter)=>{
  //     const condition = {
  //       EnterCode: sltEnter,
  //     };
  //     this.ChangeModelState(condition);
  //    }

  // updateSltPointModel=(sltPoint)=>{
  // const condition = {
  //     PointCode: sltPoint,
  // };
  // this.ChangeModelState(condition);
  // }

  render() {
    const {
      form: { getFieldDecorator },
      allTaskAuditSearchForm,
      taskTypeList,
      allTaskAuditList,
    } = this.props;
    const { formLayout, columns } = this._SELF_;

    // 计算table长度
    let scrollXWidth = this._SELF_.columns
      .map(col => col.width)
      .reduce((prev, curr) => {
        return prev + curr;
      }, 0);

    const pointCode = allTaskAuditSearchForm.PointCode && allTaskAuditSearchForm.PointCode.value;

    return (
      <MonitorContent
        {...this.props}
        breadCrumbList={[{ Name: '智能运维', Url: '' }, { Name: '审批单记录', Url: '' }]}
      >
        <div className={styles.cardTitle}>
          <Card>
            <Form layout="inline" style={{ marginBottom: '10px' }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem {...formLayout} label="监测点" style={{ width: '100%' }}>
                    {getFieldDecorator('PointCode', {})(
                      <EnterprisePointCascadeMultiSelect
                        LablePoint={pointCode}
                        width="100%"
                        minWidth="150px"
                        updatePointModel={this._updatePointModel}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...formLayout} label="审批编号" style={{ width: '100%' }}>
                    {getFieldDecorator('ExamNumber', {})(<Input placeholder="请填写审批编号" />)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...formLayout} label="任务类型" style={{ width: '100%' }}>
                    {getFieldDecorator('TaskContentType', {})(
                      <Select
                        placeholder="请选择任务类型"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        mode="multiple"
                        allowClear
                      >
                        {taskTypeList.map(item => {
                          return <Option key={item.ID}>{item.ContentTypeName}</Option>;
                        })}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...formLayout} label="申请人" style={{ width: '100%' }}>
                    {getFieldDecorator('ImpPerson', {})(
                      <DepartmentPeople
                        key={'DivisionManagerID'}
                        updateSltUserModel={this._saveImpPerson}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...formLayout} label="申请时间" style={{ width: '100%' }}>
                    {getFieldDecorator('Time', {})(
                      <RangePicker_
                        style={{ width: '100%', minWidth: 150 }}
                        onChange={this.changeTime}
                        format="YYYY-MM-DD"
                        dateValue={''}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...formLayout} label="审批状态" style={{ width: '100%' }}>
                    {getFieldDecorator('ExamStaus', {})(
                      <Select placeholder="请选择审批状态" allowClear>
                        <Option key={0}>待审批</Option>
                        <Option key={1}>审批通过</Option>
                        <Option key={2}>审批未通过</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col style={{ marginTop: 10 }} md={8} sm={24}>
                  <Button
                    onClick={() => {
                      this.props.dispatch({
                        type: 'tasklist/updateState',
                        payload: {
                          allTaskAuditSearchForm: {
                            ...this.props.allTaskAuditSearchForm,
                            current: 1,
                            pageSize: 10,
                          },
                        },
                      });
                      this.$_search();
                    }}
                    loading={this.props.loading}
                    type="primary"
                    htmlType="submit"
                  >
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.$_resetForm}>
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>

            <Table
              rowKey={(record, index) => record.ID || index}
              size="middle"
              loading={this.props.loading}
              className={styles.dataTable}
              columns={columns}
              dataSource={allTaskAuditList}
              scroll={{ x: scrollXWidth, y: 'calc(100vh - 430px)' }}
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
                pageSize: allTaskAuditSearchForm.pageSize,
                current: allTaskAuditSearchForm.current,
                onChange: this.$_onTableChange,
                onShowSizeChange: this.$_onTableChange,
                pageSizeOptions: ['10', '20', '30', '40'],
                total: allTaskAuditSearchForm.total,
              }}
            />
          </Card>
        </div>
      </MonitorContent>
    );
  }
}

export default Index;
