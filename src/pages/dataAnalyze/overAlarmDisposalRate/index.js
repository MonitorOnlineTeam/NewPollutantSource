/*
 * @Description:超标报警处置率-一级
 * @LastEditors: hxf
 * @Date: 2020-10-16 16:16:39
 * @LastEditTime: 2020-10-21 14:57:08
 * @FilePath: /NewPollutantSource/src/pages/dataAnalyze/overAlarmDisposalRate/index.js
 */

import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'; // 外层cpmponent 包含面包屑
import { Card, Form, Col, Row, Select, Input, Checkbox, DatePicker, Button, message } from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import { router } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, autoForm, overAlarmDisposalRate }) => ({
  column: overAlarmDisposalRate.column,
  regionList: autoForm.regionList,
  attentionList: overAlarmDisposalRate.attentionList,
  divisorList: overAlarmDisposalRate.divisorList,
  exceptionDataSource: overAlarmDisposalRate.exceptionDataSource,
  loading: loading.effects['overAlarmDisposalRate/getAlarmManagementRate'],
}))
@Form.create()
class index extends PureComponent {
  state = {
    showTime: true,
    // format: 'YYYY-MM-DD HH',
    format: 'YYYY-MM-DD',
    pollutantType: '1',
    checkedValues: [],
    columns: [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 150,
      },
      {
        title: '工艺超标报警企业数',
        dataIndex: 'CountEnt',
        key: 'CountEnt',
        width: 150,
      },
      {
        title: '工艺超标报警监测点数',
        dataIndex: 'CountPoint',
        key: 'CountPoint',
        width: 150,
      },
      {
        title: 'pH值',
        children: [
          {
            title: '报警次数',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 100,
          },
          {
            title: '已处置报警次数',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 150,
          },
          {
            title: '待处置报警次数',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 150,
          },
          {
            title: '处置率',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 100,
          },
        ],
      },
      {
        title: 'COD',
        children: [
          {
            title: '报警次数',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 100,
          },
          {
            title: '已处置报警次数',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 150,
          },
          {
            title: '待处置报警次数',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 150,
          },
          {
            title: '处置率',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 100,
          },
        ],
      },
      {
        title: '氨氮',
        children: [
          {
            title: '报警次数',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 100,
          },
          {
            title: '已处置报警次数',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 150,
          },
          {
            title: '待处置报警次数',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 150,
          },
          {
            title: '处置率',
            dataIndex: 'DataType',
            key: 'DataType',
            width: 100,
          },
        ],
      },
    ],
  };

  _SELF_ = {
    formLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    },
  };

  componentDidMount() {
    // 获取行政区列表
    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: { RegionCode: '', PointMark: '2' },
    });

    // 获取关注列表
    this.props.dispatch({
      type: 'overAlarmDisposalRate/getAttentionDegreeList',
      payload: { RegionCode: '' },
    });

    // 根据企业类型查询监测因子
    this.getPollutantByType(this.getAlarmManagementRate);
  }

  // 根据企业类型查询监测因子
  getPollutantByType = cb => {
    this.props.dispatch({
      type: 'overAlarmDisposalRate/getPollutantCodeList',
      payload: {
        PollutantType: this.state.pollutantType,
      },
      callback: res => {
        this.setState(
          { checkedValues: res.map(item => item.PollutantCode), columns: titleList },
          () => {
            cb && cb();
          },
        );
      },
    });
  };

  // 获取超标报警处置率-一级
  getAlarmManagementRate = () => {
    let values = this.props.form.getFieldsValue();
    let beginTime, endTime;
    if (values.time && values.time[0]) {
      beginTime = moment(values.time[0]).format('YYYY-MM-DD 00:00:00');
    }
    if (values.time && values.time[1]) {
      endTime = moment(values.time[1]).format('YYYY-MM-DD 00:00:00');
    }
    console.log('checkedValues = ', this.state.checkedValues);
    this.props.dispatch({
      type: 'overAlarmDisposalRate/getAlarmManagementRate',
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: '',
        // dataType: 'DayData',
        dataType: 'HourData',
        beginTime: beginTime,
        endTime: endTime,
        PollutantList: this.state.checkedValues,
        PollutantCodeList: this.state.checkedValues,
        Rate: 1,
      },
    });

    this.setState({
      queryCondition: {
        AttentionCode: values.AttentionCode,
        PollutantList: this.state.checkedValues,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        dataType: 'DayData',
        beginTime: beginTime,
        endTime: endTime,
      },
    });
  };

  // // 导出异常数据
  // exportExceptionList = () => {
  //   let values = this.props.form.getFieldsValue();
  //   let beginTime, endTime;
  //   if (values.time && values.time[0]) {
  //     beginTime =
  //       values.dataType === 'HourData'
  //         ? moment(values.time[0]).format('YYYY-MM-DD HH:00:00')
  //         : moment(values.time[0]).format('YYYY-MM-DD');
  //   }
  //   if (values.time && values.time[1]) {
  //     endTime =
  //       values.dataType === 'HourData'
  //         ? moment(values.time[1]).format('YYYY-MM-DD HH:59:59')
  //         : moment(values.time[1]).format('YYYY-MM-DD');
  //   }
  //   this.props.dispatch({
  //     type: 'overAlarmDisposalRate/exportExceptionList',
  //     payload: {
  //       AttentionCode: values.AttentionCode,
  //       PollutantList: this.state.checkedValues,
  //       PollutantType: values.PollutantType,
  //       RegionCode: values.RegionCode,
  //       dataType: values.dataType,
  //       beginTime: beginTime,
  //       endTime: endTime,
  //     },
  //   });
  // };

  // onDataTypeChange = value => {
  //   if (value === 'HourData') {
  //     this.props.form.setFieldsValue({ time: [moment().subtract(1, 'days'), moment()] });
  //     this.setState({ format: 'YYYY-MM-DD HH', showTime: true });
  //   } else {
  //     this.props.form.setFieldsValue({ time: [moment().subtract(7, 'days'), moment()] });
  //     this.setState({ format: 'YYYY-MM-DD', showTime: false });
  //   }
  // };

  // 监测因子change
  onCheckboxChange = checkedValues => {
    if (checkedValues.length < 1) {
      message.warning('最少勾选一个监测因子！');
      return;
    }
    this.setState({
      checkedValues,
    });
    let values = this.props.form.getFieldsValue();
    let beginTime, endTime;
    if (values.time && values.time[0]) {
      beginTime = moment(values.time[0]).format('YYYY-MM-DD 00:00:00');
    }
    if (values.time && values.time[1]) {
      endTime = moment(values.time[1]).format('YYYY-MM-DD 00:00:00');
    }

    this.props.dispatch({
      type: 'overAlarmDisposalRate/getAlarmManagementRate',
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: '',
        // dataType: 'DayData',
        dataType: 'HourData',
        beginTime: beginTime,
        endTime: endTime,
        PollutantList: checkedValues,
        PollutantCodeList: checkedValues,
        Rate: 1,
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      regionList,
      attentionList,
      divisorList,
      exceptionDataSource,
      column: pollutantColumn,
      loading,
    } = this.props;
    const { formLayout } = this._SELF_;
    const { format, showTime, checkedValues } = this.state;
    console.log('attentionList=', attentionList);
    console.log('divisorList = ', divisorList);
    console.log('exceptionDataSource = ', exceptionDataSource);
    let _regionList = regionList.length ? regionList[0].children : [];
    let columns = [];
    let titlePollutant = [];

    pollutantColumn.map((item, key) => {
      titlePollutant.push({
        title: item.PollutantName,
        children: [
          {
            title: '报警次数',
            dataIndex: `${item.PollutantCode}_alarmCount`,
            key: 'DataType',
            width: 100,
          },
          {
            title: '已处置报警次数',
            dataIndex: `${item.PollutantCode}_respondedCount`,
            key: 'DataType',
            width: 150,
          },
          {
            title: '待处置报警次数',
            dataIndex: `${item.PollutantCode}_noRespondedCount`,
            key: 'DataType',
            width: 150,
          },
          {
            title: '处置率',
            dataIndex: `${item.PollutantCode}_RespondedRate`,
            key: 'DataType',
            width: 100,
          },
        ],
      });
    });
    if (pollutantColumn.length > 2) {
      columns = [
        {
          title: '行政区',
          dataIndex: 'regionName',
          key: 'regionName',
          fixed: 'left',
        },
        {
          title: '工艺超标报警企业数',
          dataIndex: 'CountEnt',
          key: 'CountEnt',
        },
        {
          title: '工艺超标报警监测点数',
          dataIndex: 'CountPoint',
          key: 'CountPoint',
        },
        ...titlePollutant,
      ];
    } else {
      columns = [
        {
          title: '行政区',
          dataIndex: 'regionName',
          key: 'regionName',
        },
        {
          title: '工艺超标报警企业数',
          dataIndex: 'CountEnt',
          key: 'CountEnt',
        },
        {
          title: '工艺超标报警监测点数',
          dataIndex: 'CountPoint',
          key: 'CountPoint',
        },
        ...titlePollutant,
      ];
    }
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col md={4}>
                <FormItem {...formLayout} label="行政区" style={{ width: '100%' }}>
                  {getFieldDecorator('RegionCode', {
                    // initialValue: 'siteDaily',
                  })(
                    <Select allowClear placeholder="请选择行政区">
                      {_regionList.map(item => {
                        return (
                          <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={5}>
                <FormItem {...formLayout} label="关注程度" style={{ width: '100%' }}>
                  {getFieldDecorator('AttentionCode', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择关注程度">
                      <Option value="">全部</Option>
                      {attentionList.map(item => {
                        return (
                          <Option key={item.AttentionCode} value={item.AttentionCode}>
                            {item.AttentionName}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={4}>
                <FormItem {...formLayout} label="企业类型" style={{ width: '100%' }}>
                  {getFieldDecorator('PollutantType', {
                    initialValue: '1',
                  })(
                    <Select
                      placeholder="请选择企业类型"
                      onChange={value => {
                        this.setState({ pollutantType: value }, () => {
                          this.getPollutantByType(this.getAlarmManagementRate());
                        });
                      }}
                    >
                      <Option value="1">废水</Option>
                      <Option value="2">废气</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              {/* <Col md={4}>
                <FormItem {...formLayout} label="数据类型" style={{ width: '100%' }}>
                  {getFieldDecorator('dataType', {
                    initialValue: 'HourData',
                  })(
                    <Select placeholder="请选择数据类型" onChange={this.onDataTypeChange}>
                      <Option key="0" value="HourData">
                        小时数据
                      </Option>
                      <Option key="1" value="DayData">
                        {' '}
                        日数据
                      </Option>
                    </Select>,
                  )}
                </FormItem>
              </Col> */}
              <Col md={7}>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                  label="日期查询"
                  style={{ width: '100%' }}
                >
                  {getFieldDecorator('time', {
                    initialValue: [moment().subtract(10, 'month'), moment()],
                  })(
                    <RangePicker
                      allowClear={false}
                      // showTime={showTime}
                      format={format}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={24} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                <div class="ant-form-item-label" style={{ width: '5.3%' }}>
                  <label for="RegionCode" class="" title="监测因子">
                    监测因子
                  </label>
                </div>
                <Checkbox.Group
                  style={{ maxWidth: 'calc(100% - 5.3% - 168px)' }}
                  value={checkedValues}
                  onChange={this.onCheckboxChange}
                >
                  {divisorList.map(item => {
                    return (
                      <Checkbox key={item.PollutantCode} value={item.PollutantCode}>
                        {item.PollutantName}
                      </Checkbox>
                    );
                  })}
                </Checkbox.Group>
                <Button
                  loading={loading}
                  type="primary"
                  style={{ marginLeft: 10 }}
                  onClick={this.getAlarmManagementRate}
                >
                  查询
                </Button>
                <Button
                  style={{ margin: '0 5px' }}
                  icon="export"
                  onClick={this.exportExceptionList}
                >
                  导出
                </Button>
              </Col>
            </Row>
          </Form>
          <SdlTable
            scroll={{ xScroll: 'scroll' }}
            dataSource={exceptionDataSource}
            columns={columns}
            loading={loading}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;
