/*
 * 个人工时统计
 * @Author: Jiaqi
 * @Date: 2019-04-23 16:53:16
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-04-26 11:11:56
 */

import React, { PureComponent } from 'react';
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
  DatePicker,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import MonitorContent from '../../../components/MonitorContent/index';
import styles from './index.less';
const Search = Input.Search;
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;

@connect(({ loading, statisticsmodel, region }) => ({
  loading: loading.effects['statisticsmodel/getPersonalHoursList'],
  exportLoading: loading.effects['statisticsmodel/exportPersonalHoursReport'],
  personalHoursList: statisticsmodel.personalHoursList,
  dptList: region.dptList,
  personalHoursListParameters: statisticsmodel.personalHoursListParameters,
  userRegionList: region.userRegionList,
}))
@Form.create()
class EquipmentIntactRate extends PureComponent {
  constructor(props) {
    super(props);
    this.formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };
    this.state = {};
    this._SELF_ = {
      columns: [
        {
          title: '姓名',
          dataIndex: 'Name',
          key: 'Name',
          width: 130,
        },
        {
          title: '员工编号',
          dataIndex: 'Number',
          key: 'Number',
          width: 130,
        },
        {
          title: '个人分摊绩效套数',
          dataIndex: 'AllPerformanceMeasures',
          key: 'AllPerformanceMeasures',
          width: 130,
          sorter: (a, b) => a.AllPerformanceMeasures - b.AllPerformanceMeasures,
        },
        {
          title: '总次数',
          dataIndex: 'AllNumber',
          key: 'AllNumber',
          width: 130,
          sorter: (a, b) => a.AllNumber - b.AllNumber,
        },
        {
          title: '总实际工时',
          dataIndex: 'AllTime',
          key: 'AllTime',
          width: 130,
          sorter: (a, b) => a.AllTime - b.AllTime,
        },
        {
          title: '行政区域',
          dataIndex: 'DepartID',
          key: 'DepartID',
          width: 130,
          render: (text, record) => <span>{text}</span>,
        },
      ],
    };

    this.loadPersonalHoursList = this.loadPersonalHoursList.bind(this);
    this.exportReport = this.exportReport.bind(this);
  }

  componentDidMount() {
    this.loadPersonalHoursList();
    if (!this.props.userRegionList.length) {
      this.props.dispatch({
        type: 'region/GetUserRegionList',
      });
    }
  }

  // 获取个人工时列表数据
  loadPersonalHoursList() {
    var that = this;
    const { dispatch } = this.props;
    // 日期
    let cycle = moment().format('DD') > 20 ? 0 : -1;
    let StatisticalCycle = moment().add(cycle, 'month');
    const endTime = `${StatisticalCycle.format('YYYY-MM')}-20 23:59:59`;
    const startTime =
      StatisticalCycle && StatisticalCycle.add(-1, 'month').format('YYYY-MM') + '-21 00:00:00';
    dispatch({
      type: 'statisticsmodel/updateState',
      payload: {
        personalHoursListParameters: {
          ...this.props.personalHoursListParameters,
          ...{
            StartTime: startTime,
            EndTime: endTime,
            Name: '',
            Numbel: '',
            Depart: '',
            Number: '',
          },
        },
      },
    });
    this.getPersonalHoursList();
    dispatch({
      type: 'region/GetDepartmentTree',
      payload: {},
    });
  }
  //日期切换回调
  onChangeDate = (value, mode) => {
    const { dispatch } = this.props;
    const endTime = `${value.format('YYYY-MM')}-20 23:59:59`;
    const startTime = value && value.add(-1, 'month').format('YYYY-MM') + '-21 00:00:00';
    dispatch({
      type: 'statisticsmodel/updateState',
      payload: {
        personalHoursListParameters: {
          ...this.props.personalHoursListParameters,
          ...{
            StartTime: startTime,
            EndTime: endTime,
          },
        },
      },
    });
    this.getPersonalHoursList();
  };

  //获取公工时统计方法
  getPersonalHoursList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticsmodel/getPersonalHoursList',
      payload: {},
    });
  };
  // 导出
  exportReport() {
    const { personalHoursListParameters, dispatch } = this.props;
    const month = moment(personalHoursListParameters.EndTime).format('YYYY-MM');
    dispatch({
      type: 'statisticsmodel/updateState',
      payload: {
        personalHoursListParameters: {
          ...this.props.personalHoursListParameters,
          ...{
            month,
          },
        },
      },
    });
    dispatch({
      type: 'statisticsmodel/exportPersonalHoursReport',
      payload: {},
    });
  }

  //根据名称搜索
  SearchByName = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticsmodel/updateState',
      payload: {
        personalHoursListParameters: {
          ...this.props.personalHoursListParameters,
          ...{
            Name: value,
          },
        },
      },
    });
    this.getPersonalHoursList();
  };

  //根据编号搜索
  SearchByNumber = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticsmodel/updateState',
      payload: {
        personalHoursListParameters: {
          ...this.props.personalHoursListParameters,
          ...{
            Number: value,
          },
        },
      },
    });
    this.getPersonalHoursList();
  };

  //根据部门搜索
  DepartChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticsmodel/updateState',
      payload: {
        personalHoursListParameters: {
          ...this.props.personalHoursListParameters,
          ...{
            Depart: value,
          },
        },
      },
    });
    this.getPersonalHoursList();
  };

  /**
   *用户所属行政区域搜索
   */
  onRegionSearch = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticsmodel/updateState',
      payload: {
        personalHoursListParameters: {
          ...this.props.personalHoursListParameters,
          ...{
            RegionId: value,
          },
        },
      },
    });
    this.getPersonalHoursList();
  };

  render() {
    const { personalHoursList, dptList, personalHoursListParameters } = this.props;
    let defaultDate = null;
    //将存储的日期转化为moment格式
    if (personalHoursListParameters.EndTime) {
      defaultDate = moment(personalHoursListParameters.EndTime, 'YYYY-MM-DD HH:mm:ss');
    }
    // 计算table长度
    let scrollXWidth = this._SELF_.columns
      .map(col => col.width)
      .reduce((prev, curr) => {
        return prev + curr;
      }, 0);
    return (
      <MonitorContent
        {...this.props}
        breadCrumbList={[{ Name: '统计报表', Url: '' }, { Name: '个人工时统计', Url: '' }]}
      >
        <div className={styles.cardTitle}>
          <Card>
            <Row style={{ width: '100%', marginBottom: 30 }}>
              <Col span={24}>
                <Form layout="inline">
                  <Form.Item>
                    <MonthPicker
                      allowClear={false}
                      placeholder="请选择月份"
                      value={defaultDate}
                      onChange={this.onChangeDate}
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Search
                      placeholder="姓名"
                      onSearch={this.SearchByName}
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Search
                      placeholder="员工编号"
                      onSearch={this.SearchByNumber}
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <TreeSelect
                      style={{ width: 220 }}
                      showSearch
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择部门"
                      treeData={dptList}
                      allowClear
                      treeDefaultExpandAll
                      treeNodeFilterProp="title"
                      onChange={this.DepartChange}
                    ></TreeSelect>
                  </Form.Item>
                  <Form.Item>
                    <Select
                      style={{ width: 200 }}
                      showSearch
                      allowClear
                      optionFilterProp="RegionName"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={value => this.onRegionSearch(value)}
                      placeholder="请选择行政区域"
                    >
                      {this.props.userRegionList
                        ? this.props.userRegionList.length !== 0
                          ? this.props.userRegionList.map(user => {
                              return (
                                <Option key={user.RegionId} value={user.RegionId}>
                                  {user.RegionName}
                                </Option>
                              );
                            })
                          : null
                        : null}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      loading={this.props.exportLoading}
                      style={{ marginLeft: 8 }}
                      type="primary"
                      onClick={this.exportReport}
                    >
                      导出
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Table
              rowKey={(record, index) => record.ID || index}
              size="middle"
              loading={this.props.loading}
              className={styles.dataTable}
              columns={this._SELF_.columns}
              dataSource={personalHoursList}
              scroll={{ x: scrollXWidth, y: 'calc(100vh - 335px)' }}
              rowClassName={(record, index, indent) => {
                if (index === 0) {
                  return;
                }
                if (index % 2 !== 0) {
                  return 'light';
                }
              }}
              pagination={false}
            />
          </Card>
        </div>
      </MonitorContent>
    );
  }
}

export default EquipmentIntactRate;
