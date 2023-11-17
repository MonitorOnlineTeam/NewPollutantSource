/*
 * @Description:运维工单统计-空气站
 * @LastEditors: hxf
 * @Date: 2020-10-26 10:52:49
 * @LastEditTime: 2020-11-10 17:51:19
 * @FilePath: /NewPollutantSource/src/pages/IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/index.js
 */
import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'; // 外层cpmponent 包含面包屑
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Col, Row, Select, Input, Checkbox, DatePicker, Button, message } from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import { downloadFile } from '@/utils/utils';
import moment from 'moment';
import { router } from 'umi';

import { checkParent } from './utils';
import RegionList from '@/components/RegionList'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ airWorkOrderStatistics, autoForm, loading }) => ({
  RegionCode: airWorkOrderStatistics.RegionCode,
  beginTime: airWorkOrderStatistics.beginTime,
  endTime: airWorkOrderStatistics.endTime,
  regionList: autoForm.regionList,
  taskStaticTitle: airWorkOrderStatistics.taskStaticTitle,
  taskStatic: airWorkOrderStatistics.taskStatic,
  loading: loading.effects['airWorkOrderStatistics/getTaskStatic'],
}))
@Form.create()
export default class index extends PureComponent {
  state = {
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
    checkedValues: [],
  };

  _SELF_ = {
    formLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    },
  };

  componentDidMount() {
    const { dispatch, divisorList, beginTime, endTime, RegionCode } = this.props;
    // 获取行政区列表
    // dispatch({
    //   type: 'autoForm/getRegions',
    //   payload: { RegionCode: '', PointMark: '2' },
    // });
    dispatch({
      type: 'airWorkOrderStatistics/getTaskStaticTitle',
      payload: { PollutantTypeCode: 5 },
    });
    dispatch({
      type: 'airWorkOrderStatistics/getTaskStatic',
      payload: {
        PollutantTypeCode: '5',
        AttentionCode: '',
        RegionCode: typeof RegionCode == 'undefined' ? '' : RegionCode,
        EntCode: '',
        BeginTime: beginTime.format('YYYY-MM-DD 00:00:00'),
        EndTime: endTime.format('YYYY-MM-DD 23:59:59'),
        // BeginTime: '2020-01-01 00:00:00',
        // EndTime: '2020-09-30 23:59:59',
      },
    });
  }

  getTaskStatic = () => {
    const { dispatch, divisorList, beginTime, endTime } = this.props;
    let { RegionCode } = this.props;
    if (typeof RegionCode === 'undefined') {
      RegionCode = '';
    }
    dispatch({
      type: 'airWorkOrderStatistics/getTaskStatic',
      payload: {
        PollutantTypeCode: '5',
        AttentionCode: '',
        RegionCode,
        EntCode: '',
        BeginTime: beginTime.format('YYYY-MM-DD 00:00:00'),
        EndTime: endTime.format('YYYY-MM-DD 23:59:59'),
        // BeginTime: '2020-01-01 00:00:00',
        // EndTime: '2020-09-30 23:59:59',
      },
    });
  };

  createColum = item => {
    // if (item.TypeName == '行政区') {
    const { beginTime, endTime } = this.props;
    if (item.ID == '00_RegionName') {
      return {
        title: item.TypeName,
        dataIndex: item.ID,
        key: item.ID,
        width: 150,
        align: 'center',
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                let params = {};
                params.regionName = record['00_RegionName'];
                params.regionCode = record['00_RegionCode'];
                params.beginTime = beginTime.format('YYYY-MM-DD');
                params.endTime = endTime.format('YYYY-MM-DD');
                router.push(
                  `/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation/cityLevel?params=${JSON.stringify(
                    params,
                  )}`,
                );
              }}
            >
              {text}
            </a>
          );
        },
      };
      // } else if (item.TypeName == '运维空气监测点数') {
    } else if (item.ID == '00_Opspoints') {
      return {
        title: item.TypeName,
        dataIndex: item.ID,
        key: item.ID,
        width: 150,
        align: 'center',
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                let params = {};
                params.regionName = record['00_RegionName'];
                params.regionCode = record['00_RegionCode'];
                params.beginTime = beginTime.format('YYYY-MM-DD');
                params.endTime = endTime.format('YYYY-MM-DD');
                router.push(
                  `/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation/StationAirQualityMonitoringStation?params=${JSON.stringify(
                    params,
                  )}`,
                );
              }}
            >
              {text}
            </a>
          );
        },
      };
    }

    return {
      title: item.TypeName,
      dataIndex: item.ID,
      key: item.ID,
      width: 150,
      align: 'center',
    };
  };

  render() {
    const {
      taskStaticTitle, // 运维工单统计 表头
      taskStatic, // 运维工单统计 数据
      dispatch,
      RegionCode,
      beginTime,
      endTime,
      form: { getFieldDecorator },
      regionList = [],
      alarmManagementRateExportLoading,
      loading = false,
    } = this.props;
    const { formLayout } = this._SELF_;
    const { format, showTime } = this.state;
    let _regionList = regionList.length ? regionList[0].children : [];
    let columns = [];
    let titlePollutant = [];
    let itemIndex = -1;
    taskStaticTitle.map((item, key) => {
      itemIndex = -1;
      if (item.ID === '00_Opspoints' || item.ID === '00_Points') {
        item.parent = '监测点';
      }
      itemIndex = checkParent(item, columns);
      if (itemIndex === -2) {
        columns.push(this.createColum(item));
      } else if (itemIndex === -1) {
        columns.push({
          title: item.parent,
          children: [this.createColum(item)],
        });
      } else {
        columns[itemIndex].children.push(this.createColum(item));
      }
    });
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="" style={{ marginBottom: 20 }}>
            <Row gutter={24}>
              <Col md={7}>
                <FormItem
                  {...formLayout}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  label="日期查询"
                  style={{ width: '100%' }}
                >
                  {getFieldDecorator('time', {
                    initialValue: [beginTime, endTime],
                  })(
                    <RangePicker
                      allowClear={false}
                      // showTime={showTime}
                      format={format}
                      style={{ width: '100%' }}
                      onChange={(dates, dateStrings) => {
                        this.setState({ beginTime: dates[0], endTime: dates[1] }, () => { });
                        dispatch({
                          type: 'airWorkOrderStatistics/updateState',
                          payload: {
                            beginTime: dates[0],
                            endTime: dates[1],
                          },
                        });
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={4}>
                <FormItem {...formLayout} label="行政区" style={{ width: '100%' }}>
                  {/* {getFieldDecorator('RegionCode', {
                    initialValue: RegionCode,
                  })(
                    <Select
                      allowClear
                      placeholder="请选择行政区"
                      onChange={value => {
                        this.setState({ RegionCode: value }, () => { });
                        dispatch({
                          type: 'airWorkOrderStatistics/updateState',
                          payload: {
                            RegionCode: value,
                          },
                        });
                      }}
                    >
                      {_regionList.map(item => {
                        return (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        );
                      })}
                    </Select>)} */}
                        <RegionList  changeRegion={value => {
                                        this.setState({ RegionCode: value }, () => { });
                                            dispatch({
                                                type: 'airWorkOrderStatistics/updateState',
                                                 payload: {
                                                      RegionCode: value,
                                                      },
                                                      });
                       }} RegionCode={this.props.RegionCode ? this.props.RegionCode : undefined}/>                   
                  
                </FormItem>
              </Col>
              <Col md={9} style={{ marginTop: 3 }}>
                <Button
                  loading={loading}
                  type="primary"
                  style={{ marginLeft: 10 }}
                  onClick={this.getTaskStatic}
                >
                  查询
                </Button>
                {/* <Button
                  style={{ marginLeft: 10 }}
                  icon="export"
                  onClick={this.exportAlarmManagementRate}
                  loading={alarmManagementRateExportLoading}
                >
                  导出
                </Button> */}
              </Col>
            </Row>
          </Form>
          <SdlTable
            scroll={{ xScroll: 'scroll' }}
            dataSource={taskStatic}
            columns={columns}
            loading={loading}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
