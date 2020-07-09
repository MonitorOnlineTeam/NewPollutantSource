/*
 * @Author: dongxiaoyun
 * @Date: 2019-11-22
 * @Last Modified by: dongxiaoyun
 * @Last Modified time: 2019-11-22
 * @desc: 质控报警记录页面
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NavigationTreeQCA from '@/components/NavigationTreeQCA';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, DatePicker, Row, Col, Select, Button, Radio, Popover } from 'antd';
import SdlTable from '@/components/SdlTable';
import { connect } from 'dva';
import { LegendIcon } from '@/utils/icon';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const columns = [
  // {
  //   title: '点名称',
  //   dataIndex: 'PointName',
  //   key: 'PointName',
  // },
  // {
  //   title: '污染物名称',
  //   dataIndex: 'PollutantName',
  //   key: 'PollutantName',
  // },
  {
    title: '报警时间',
    dataIndex: 'AlarmTime',
    key: 'AlarmTime',
    width: 150,
    sorter: (a, b) => Date.parse(a.AlarmTime) - Date.parse(b.AlarmTime),
  },
  {
    title: '报警类型名称',
    dataIndex: 'AlarmTypeName',
    key: 'AlarmTypeName',
  },
  {
    title: '报警描述',
    dataIndex: 'AlarmMsg',
    key: 'AlarmMsg',
    width: 450,
  },
  // {
  //   title: '标准',
  //   dataIndex: 'StandardValue',
  //   key: 'StandardValue',
  //   width: 50,
  //   align: 'right',
  // },
  // {
  //   title: '标准值',
  //   dataIndex: 'AlarmValue',
  //   key: 'AlarmValue',
  //   width: 50,
  //   align: 'right',
  // },
  // {
  //   title: '单位',
  //   dataIndex: 'Unit',
  //   key: 'Unit',
  //   width: 50,
  // },
];

@connect(({ loading, qualityControl }) => ({
  loading: loading.effects['qualityControl/GetQCAAlarmMsgList'],
  paramsQCAAlarmMsgList: qualityControl.paramsQCAAlarmMsgList,
  AlarmTypeList: qualityControl.AlarmTypeList,
  qCAAlarmMsgData: qualityControl.qCAAlarmMsgData,
}))
@Form.create()
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formats: 'YYYY-MM-DD HH:mm:ss',
    };
  }

  componentDidMount() {
    this.getAlarmType();
  }

  GetQCAAlarmMsgList = () => {
    this.props.dispatch({
      type: 'qualityControl/GetQCAAlarmMsgList',
    });
  };

  getAlarmType = () => {
    this.props.dispatch({
      type: 'qualityControl/getAlarmType',
    });
  };

  // 分页
  onTableChange = (pageIndex, pageSize) => {
    this.props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        paramsQCAAlarmMsgList: {
          ...this.props.paramsQCAAlarmMsgList,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      },
    });
    // 获取表格数据
    this.GetQCAAlarmMsgList();
  };

  // 点击左侧树查询
  onSearch = () => {
    const { QCAMN } = this.state;
    // 查询表格数据
    this.props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        paramsQCAAlarmMsgList: {
          ...this.props.paramsQCAAlarmMsgList,
          QCAMN: QCAMN,
        },
      },
    });
    this.GetQCAAlarmMsgList();
  };
  //日期改变事件
  dateChange = (dataMoment, dateString) => {
    if (dateString.length === 2) {
      this.props.dispatch({
        type: 'qualityControl/updateState',
        payload: {
          paramsQCAAlarmMsgList: {
            ...this.props.paramsQCAAlarmMsgList,
            BeginTime: dateString[0],
            EndTime: dateString[1],
          },
        },
      });
    }
  };
  //下拉框改变事件
  selectChange = values => {
    this.props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        paramsQCAAlarmMsgList: {
          ...this.props.paramsQCAAlarmMsgList,
          AlarmType: values,
        },
      },
    });
  };
  // 点击查询
  onClickSearch = () => {
    const { QCAMN } = this.state;
    // 查询表格数据
    this.props.dispatch({
      type: 'qualityControl/updateState',
      payload: {
        paramsQCAAlarmMsgList: {
          ...this.props.paramsQCAAlarmMsgList,
          QCAMN: QCAMN,
        },
      },
    });
    this.GetQCAAlarmMsgList();
  };

  render() {
    const {
      form: { getFieldDecorator },
      qCAAlarmMsgData,
      loading,
      AlarmTypeList,
      paramsQCAAlarmMsgList,
    } = this.props;
    let defaultValue = [
      moment(paramsQCAAlarmMsgList.BeginTime),
      moment(paramsQCAAlarmMsgList.EndTime),
    ];

    return (
      <div id="alarmMessage">
        <NavigationTreeQCA
          domId="#alarmMessage"
          choice={false}
          onItemClick={value => {
            if (value.length > 0 && !value[0].IsEnt && value[0].QCAType == '2') {
              this.setState(
                {
                  QCAMN: value[0].key,
                },
                () => {
                  this.onSearch();
                },
              );
            }
          }}
        />
        <BreadcrumbWrapper>
          <Card
            className="contentContainer"
            title={
              <Form layout="inline">
                <Form.Item>
                  {getFieldDecorator('time', {
                    initialValue: defaultValue,
                  })(
                    <RangePicker
                      allowClear={false}
                      format={this.state.formats}
                      onChange={this.dateChange}
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('AlarmType', {
                    initialValue: paramsQCAAlarmMsgList.AlarmType,
                  })(
                    <Select
                      style={{ width: '250px' }}
                      allowClear
                      placeholder="请选择报警类型"
                      onChange={this.selectChange}
                    >
                      {AlarmTypeList.map(item => (
                        <Option key={item.BaseCode}>{item.BaseCnName}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" style={{ marginLeft: 10 }} onClick={this.onClickSearch}>
                    查询
                  </Button>
                </Form.Item>
              </Form>
            }
          >
            <SdlTable
              dataSource={qCAAlarmMsgData}
              columns={columns}
              loading={loading}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                pageSize: paramsQCAAlarmMsgList.PageSize,
                current: paramsQCAAlarmMsgList.PageIndex,
                onChange: this.onTableChange,
                onShowSizeChange: this.onTableChange,
                total: paramsQCAAlarmMsgList.total,
                pageSizeOptions: ['10', '20', '30', '40', '50'],
              }}
            />
          </Card>
        </BreadcrumbWrapper>
      </div>
    );
  }
}

export default index;
