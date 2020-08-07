/*
 * 基础数据统计
 * @Author: Jiaqi
 * @Date: 2019-04-23 13:56:49
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-05-23 14:47:02
 */

import React, { Component } from 'react';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Form,
  Icon,
  Modal,
  Tag,
  Divider,
  Popconfirm,
  message,
  Select,
  Radio,
  TimePicker,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import MonitorContent from '../../../components/MonitorContent/index';
import RangePicker_ from '../../../components/RangePicker/index';
import DepartmentPeople from '../../../components/DepartmentPeople/_index';
import BaseReportStatisticsModal from './BaseReportStatisticsModal';
import BaseReportExportModal from './BaseReportExportModal';
import ImportStatistics from './ImportStatistics';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const { MonthPicker, RangePicker } = DatePicker;

@connect(({ loading, statisticsmodel, region }) => ({
  loading: loading.effects['statisticsmodel/queryBaseReportList'],
  statisLoading: loading.effects['statisticsmodel/baseReportStatistical'],
  baseReportData: statisticsmodel.baseReportList,
  baseReportSearchForm: statisticsmodel.baseReportSearchForm,
  equipmentCoffList: statisticsmodel.equipmentCoffList,
  equipmentTypeList: statisticsmodel.equipmentTypeList,
  projectProvince: statisticsmodel.projectProvince,
  enterpriseList: statisticsmodel.enterpriseList,
  dptList: region.dptList,
}))
@Form.create()
class index extends Component {
  constructor(props) {
    super(props);

    this.formLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16 },
    };
    this.formLayoutMiddle = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    this.formLayoutLarge = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    this.state = {
      expand: false,
      visible: false,
      ImportVisible: false,
      hourStart: '',
      hourEnd: '',
      columns: [],
    };

    this._SELF_ = {
      hoursData: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    };
    this.handleExpand = this.handleExpand.bind(this);
    this.loadReportList = this.loadReportList.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onTableChange = this.onTableChange.bind(this);
    this.exportReport = this.exportReport.bind(this);
    this.statisticsSubmit = this.statisticsSubmit.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    let columns = [];
    let update = false;
    if (state.columns !== props.baseReportData.column) {
      update = true;
      columns = props.baseReportData.column.map((column, index) => {
        if (column.Code === 'OperationStartTime' || column.Code === 'OperationEndTime') {
          return {
            title: column.Name,
            dataIndex: column.Code,
            width: 170,
            fixed: props.baseReportData.column.length > 8 && index < 3 ? true : false,
            render: (text, record) => text && text.split(' ')[0],
          };
        }
        if (column.Code === 'QualificationRate') {
          return {
            title: column.Name,
            dataIndex: column.Code,
            width: 170,
            fixed: props.baseReportData.column.length > 8 && index < 3 ? true : false,
            render: (text, record) => (text ? text + '%' : ''),
          };
        }
        return {
          title: column.Name,
          dataIndex: column.Code,
          width: 170,
          fixed: props.baseReportData.column.length > 8 && index < 3 ? true : false,
        };
      });
    }
    return update
      ? {
          ...state,
          columns,
        }
      : null;
  }

  componentDidMount() {
    this.loadReportList();
    const { dispatch } = this.props;
    // 获取省区
    dispatch({
      type: 'statisticsmodel/getProjectProvince',
    });
    // 获取设备分类
    dispatch({
      type: 'statisticsmodel/getEquipmentTypeList',
    });
    // 获取设备类别系数
    dispatch({
      type: 'statisticsmodel/getEquipmentCoffList',
    });
    // 获取设备所在单位名称
    dispatch({
      type: 'statisticsmodel/getEnterpriseList',
    });
    // 获取树列表
    dispatch({
      type: 'region/GetDepartmentTree',
      payload: {},
    });
  }

  // 数据加载
  loadReportList(isSearch) {
    let pageInfo = isSearch
      ? {
          pageIndex: 1,
          pageSize: 10,
        }
      : {};
    this.props.dispatch({
      type: 'statisticsmodel/queryBaseReportList',
      payload: {
        ...this.getFormValue(),
        ...pageInfo,
      },
    });
  }

  /** 关闭上传回调 */
  onback = () => {
    this.setState({
      ImportVisible: false,
    });
    this.loadReportList(true);
  };

  // 处理form表单数据
  getFormValue() {
    let baseReportSearchForm = this.props.form.getFieldsValue();
    return {
      pageIndex: baseReportSearchForm.current || this.props.baseReportSearchForm.current,
      pageSize: baseReportSearchForm.pageSize || this.props.baseReportSearchForm.pageSize,
      ProvinceID: baseReportSearchForm.ProvinceID, // 部门ID
      OperationalProjectNumber: baseReportSearchForm.OperationalProjectNumber, // 项目编号
      EntName: baseReportSearchForm.EntName, // 设备所在单位名称
      PointName: baseReportSearchForm.PointName, // 点位名称
      DGIMN: baseReportSearchForm.baseReportSearchForm, // MN号
      IsNew: baseReportSearchForm.IsNew, // 新签/续签
      EquipmentType: baseReportSearchForm.EquipmentType, //分类
      EquipmentTypeID: baseReportSearchForm.EquipmentTypeID, // 设备类别编号
      StatisticalStartTime:
        baseReportSearchForm.yearTime &&
        `${moment(baseReportSearchForm.yearTime)
          .add(-1, 'month')
          .format('YYYY-MM')}-21 00:00:00`,
      StatisticalEndTime:
        baseReportSearchForm.yearTime &&
        `${moment(baseReportSearchForm.yearTime).format('YYYY-MM')}-20 23:59:59`,
      JourneyHourStart: baseReportSearchForm.hourTime && baseReportSearchForm.hourTime[0], // 距离小时数开始
      JourneyHourEnd: baseReportSearchForm.hourTime && baseReportSearchForm.hourTime[1], // 距离小时数结束
      DivisionManagerID: baseReportSearchForm.DivisionManagerID, // 分区经理
      ProjectLeaderID: baseReportSearchForm.ProjectLeaderID, // 项目负责人
      PointPersonID: baseReportSearchForm.PointPersonID, // 点位负责人
      ActualOperatorsID: baseReportSearchForm.ActualOperatorsID, // 实际运维人
      EquipmentYear: baseReportSearchForm.EquipmentYear, // 设备年限
    };
  }

  // 分页页数change
  onTableChange(current, pageSize) {
    this.saveFormGetData(current, pageSize);
  }

  // 处理表单获取数据
  saveFormGetData(current, pageSize) {
    this.props.dispatch({
      type: 'statisticsmodel/updateState',
      payload: {
        baseReportSearchForm: {
          ...this.props.baseReportSearchForm,
          current,
          pageSize,
        },
      },
    });
    setTimeout(() => {
      this.loadReportList();
    }, 0);
  }

  changeTime = (date, dateString) => {};

  // 导出
  exportReport(checkedList) {
    let baseReportSearchForm = this.props.form.getFieldsValue();
    let type = 'statisticsmodel/exportBaseReport';
    if (this.state.type === 0) {
      // 选择列
      type = 'statisticsmodel/saveFieldForUser';
    }
    this.props.dispatch({
      type,
      payload: {
        checkedList,
        month:
          baseReportSearchForm.yearTime && moment(baseReportSearchForm.yearTime).format('YYYY-MM'),
        formParams: this.getFormValue(),
        callback: () => {
          this.onCancel();
        },
      },
    });
  }

  // 统计
  statisticsSubmit(start, end) {
    this.props.dispatch({
      type: 'statisticsmodel/baseReportStatistical',
      payload: {
        params: {
          begin: start,
          end: end,
        },
        formParams: this.getFormValue(),
        callback: () => {
          this.onCancel();
        },
      },
    });
  }

  // 展开折叠
  handleExpand() {
    this.setState({
      expand: !this.state.expand,
    });
  }

  onCancel() {
    this.setState({
      statisticsVisible: false,
      exportVisible: false,
    });
  }

  // 重置form
  resetForm() {
    this.props.form.resetFields();
    this.saveFormGetData(1, 10);
  }

  render() {
    const {
      dptList,
      baseReportData,
      baseReportSearchForm,
      projectProvince,
      equipmentTypeList,
      equipmentCoffList,
      enterpriseList,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { expand } = this.state;
    // 计算table长度
    let scrollXWidth = this.state.columns
      .map(col => col.width)
      .reduce((prev, curr) => prev + curr, 0);

    // 统计周期
    let cycle = moment().format('DD') > 20 ? 0 : -1;
    let StatisticalCycle = moment().add(cycle, 'month');

    return (
      <MonitorContent
        {...this.props}
        breadCrumbList={[{ Name: '统计报表', Url: '' }, { Name: '基础数据统计', Url: '' }]}
      >
        <div className={styles.cardTitleOne}>
          <Card>
            <Form layout="inline" style={{ marginBottom: '10' }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem {...this.formLayout} label="项目省区" style={{ width: '100%' }}>
                    {getFieldDecorator('ProvinceID', {})(
                      <Select
                        placeholder="请选择省区"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        mode="multiple"
                        allowClear={true}
                      >
                        {projectProvince &&
                          projectProvince.map(item => (
                            <Option key={item.ID} value={item.ID}>
                              {item.Name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...this.formLayoutLarge} label="实际人员" style={{ width: '100%' }}>
                    {getFieldDecorator('ActualOperatorsID', {})(
                      <DepartmentPeople
                        key="ActualOperatorsID"
                        updateSltUserModel={this.saveActualOperatorsID}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...this.formLayoutMiddle} label="分类" style={{ width: '100%' }}>
                    {getFieldDecorator('EquipmentType', {})(
                      <Select
                        placeholder="请选择分类"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        allowClear={true}
                        mode="multiple"
                      >
                        {equipmentTypeList &&
                          equipmentTypeList.map(item => (
                            <Option key={item.ID} value={item.ID}>
                              {item.EquipmentTypeName}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row
                gutter={{ md: 8, lg: 24, xl: 48 }}
                style={{ display: this.state.expand ? 'block' : 'none' }}
              >
                <Col md={8} sm={24}>
                  <FormItem {...this.formLayout} label="统计周期" style={{ width: '100%' }}>
                    {getFieldDecorator('yearTime', {
                      initialValue: StatisticalCycle,
                    })(
                      // <RangePicker_ style={{ width: '100%', minWidth: 150 }} onChange={this.changeTime} format="YYYY-MM-DD HH:mm:ss" dateValue={''} />
                      <MonthPicker
                        allowClear={false}
                        placeholder="请选择统计周期"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...this.formLayoutLarge} label="路途小时" style={{ width: '100%' }}>
                    {getFieldDecorator('hourTime', {})(
                      // <RangePicker_ style={{ width: '100%', minWidth: 150 }} format="YYYY-MM-DD" dateValue={''} format="YYYY-MM-DD HH:mm:ss"/>
                      // <TimePicker format="HH"/>
                      <InputGroup compact={true}>
                        <Select
                          style={{ width: '50%' }}
                          placeholder="开始小时"
                          allowClear={true}
                          onChange={value => {
                            this.setState(
                              {
                                hourStart: value,
                              },
                              () => {
                                this.props.form.setFieldsValue({
                                  hourTime: [value, this.state.hourEnd],
                                });
                              },
                            );
                          }}
                        >
                          {this._SELF_.hoursData.map(item => (
                            <Option
                              disabled={
                                this.state.hourEnd != '' ? item > this.state.hourEnd : false
                              }
                              key={item}
                            >
                              {item}
                            </Option>
                          ))}
                        </Select>
                        <Select
                          style={{ width: '50%' }}
                          placeholder="结束小时"
                          allowClear={true}
                          onChange={value => {
                            this.setState(
                              {
                                hourEnd: value,
                              },
                              () => {
                                this.props.form.setFieldsValue({
                                  hourTime: [this.state.hourStart, value],
                                });
                              },
                            );
                          }}
                        >
                          {this._SELF_.hoursData.map(item => (
                            <Option
                              disabled={
                                this.state.hourStart != '' ? item < this.state.hourStart : false
                              }
                              key={item}
                            >
                              {item}
                            </Option>
                          ))}
                        </Select>
                      </InputGroup>,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...this.formLayoutMiddle} label="新签/续签" style={{ width: '100%' }}>
                    {getFieldDecorator('IsNew', {})(
                      <Select
                        placeholder="请选择"
                        allowClear={true}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option key="1" value="1">
                          新签
                        </Option>
                        <Option key="0" value="0">
                          续签
                        </Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...this.formLayout} label="分区经理" style={{ width: '100%' }}>
                    {getFieldDecorator('DivisionManagerID', {})(
                      <DepartmentPeople dptList={dptList} />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...this.formLayoutLarge} label="项目负责人" style={{ width: '100%' }}>
                    {getFieldDecorator('ProjectLeaderID', {})(
                      <DepartmentPeople dptList={dptList} />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...this.formLayoutMiddle} label="点位负责人" style={{ width: '100%' }}>
                    {getFieldDecorator('PointPersonID', {})(<DepartmentPeople dptList={dptList} />)}
                  </FormItem>
                </Col>

                <Col md={8} sm={24}>
                  <FormItem {...this.formLayout} label="项目编号" style={{ width: '100%' }}>
                    {getFieldDecorator('OperationalProjectNumber', {})(
                      <Input placeholder="项目编号" allowClear={true} />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem
                    {...this.formLayoutLarge}
                    label="设备所在单位"
                    style={{ width: '100%' }}
                  >
                    {getFieldDecorator('EntName', {})(
                      <Input placeholder="设备所在单位名称" allowClear={true} />,
                      //                   <Select
                      //   placeholder="设备所在单位名称"
                      //   mode="multiple"
                      //   filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      //   allowClear={true}
                      //                   >
                      //                       {
                      //                           enterpriseList && enterpriseList.map(item => <Option key={item.ID}>{item.Name}</Option>)
                      //                       }
                      //                   </Select>
                    )}
                  </FormItem>
                </Col>

                <Col md={8} sm={24}>
                  <FormItem {...this.formLayoutMiddle} label="设备类别" style={{ width: '100%' }}>
                    {getFieldDecorator('EquipmentTypeID', {})(
                      <Select
                        placeholder="请选择设备类别"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        allowClear={true}
                        mode="multiple"
                      >
                        {equipmentCoffList &&
                          equipmentCoffList.map(item => (
                            <Option key={item.ID} value={item.ID}>
                              {item.EquipmentCategory}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem {...this.formLayout} label="设备年限" style={{ width: '100%' }}>
                    {getFieldDecorator('EquipmentYear', {})(
                      <Select
                        placeholder="请选择设备年限"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        allowClear={true}
                      >
                        <Option key={0} value={0}>
                          5年以内
                        </Option>
                        <Option key={1} value={1}>
                          5年以上
                        </Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={16} sm={24} style={{ margin: '10px 0' }}>
                  <Button
                    onClick={() => {
                      // this.props.form.setFieldsValue({ current: 1 })
                      this.loadReportList(true);
                    }}
                    type="primary"
                    htmlType="submit"
                  >
                    查询
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      this.setState({
                        statisticsVisible: true,
                      });
                    }}
                  >
                    统计
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      this.setState({
                        exportVisible: true,
                        title: '',
                        type: 1,
                      });
                    }}
                  >
                    导出
                  </Button>

                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      this.setState({
                        ImportVisible: true,
                      });
                    }}
                  >
                    导入
                  </Button>

                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      this.setState({
                        exportVisible: true,
                        type: 0,
                        title: '选择要展示的列',
                      });
                    }}
                  >
                    选择列
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.resetForm}>
                    重置
                  </Button>
                  {this.state.expand ? (
                    <a style={{ marginLeft: 8 }} onClick={this.handleExpand}>
                      收起 <Icon type="up" />
                    </a>
                  ) : (
                    <a style={{ marginLeft: 8 }} onClick={this.handleExpand}>
                      展开 <Icon type="down" />
                    </a>
                  )}
                </Col>
              </Row>
            </Form>
            <Table
              rowKey={(record, index) => record.ID || index}
              size="small"
              loading={this.props.loading}
              className={styles.dataTable}
              columns={this.state.columns}
              dataSource={baseReportData.data}
              // scroll={{ x: scrollXWidth, y: 'calc(100vh - 350px)' }}
              scroll={{
                x: scrollXWidth,
                y: expand ? 'calc(100vh - 550px)' : 'calc(100vh - 390px)',
              }}
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
                pageSize: baseReportSearchForm.pageSize,
                current: baseReportSearchForm.current,
                onChange: this.onTableChange,
                onShowSizeChange: this.onTableChange,
                pageSizeOptions: ['10', '20', '30', '40'],
                total: baseReportSearchForm.total,
              }}
            />
          </Card>
        </div>
        {/* 统计弹窗 */}
        {this.state.statisticsVisible && (
          <BaseReportStatisticsModal
            onOk={this.statisticsSubmit}
            onCancel={this.onCancel}
            visible={this.state.statisticsVisible}
            statisLoading={this.props.statisLoading}
          />
        )}
        {/* 导出弹窗 */}
        {this.state.exportVisible && (
          <BaseReportExportModal
            title={this.state.title}
            type={this.state.type}
            onOk={this.exportReport}
            onCancel={this.onCancel}
            visible={this.state.exportVisible}
          />
        )}

        <Modal
          visible={this.state.ImportVisible}
          title="导入"
          width={768}
          destroyOnClose={true} // 清除上次数据
          footer={false}
          onCancel={() => {
            this.setState({
              ImportVisible: false,
            });
          }}
        >
          {<ImportStatistics onback={this.onback} />}
        </Modal>
      </MonitorContent>
    );
  }
}

export default index;
