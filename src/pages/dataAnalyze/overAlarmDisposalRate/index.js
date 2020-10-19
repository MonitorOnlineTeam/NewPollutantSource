import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Card, Form, Col, Row, Select, Input, Checkbox, DatePicker, Button, message } from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import { router } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, autoForm, overAlarmDisposalRate }) => ({
  regionList: autoForm.regionList,
  attentionList: overAlarmDisposalRate.attentionList,
  divisorList: overAlarmDisposalRate.divisorList,
  exceptionDataSource: overAlarmDisposalRate.exceptionDataSource,
  loading: loading.effects['overAlarmDisposalRate/getExceptionList'],
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
    this.getPollutantByType(this.getExceptionList);
  }

  // 根据企业类型查询监测因子
  getPollutantByType = cb => {
    this.props.dispatch({
      type: 'overAlarmDisposalRate/getPollutantByType',
      payload: {
        type: this.state.pollutantType,
      },
      callback: res => {
        let titlePollutant = [];
        res.map((item, key) => {
          titlePollutant.push({
            title: item.PollutantName,
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
          });
        });
        let titleList = [];
        if (titlePollutant.length > 2) {
          titleList = [
            {
              title: '行政区',
              dataIndex: 'RegionName',
              key: 'RegionName',
              width: 150,
              fixed: 'left',
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
            ...titlePollutant,
          ];
        } else {
          titleList = [
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
            ...titlePollutant,
          ];
        }

        this.setState(
          { checkedValues: res.map(item => item.PollutantCode), columns: titleList },
          () => {
            cb && cb();
          },
        );
      },
    });
  };

  // 获取异常数据
  getExceptionList = () => {
    let values = this.props.form.getFieldsValue();
    let beginTime, endTime;
    if (values.time && values.time[0]) {
      beginTime =
        values.dataType === 'HourData'
          ? moment(values.time[0]).format('YYYY-MM-DD HH:00:00')
          : moment(values.time[0]).format('YYYY-MM-DD');
    }
    if (values.time && values.time[1]) {
      endTime =
        values.dataType === 'HourData'
          ? moment(values.time[1]).format('YYYY-MM-DD HH:59:59')
          : moment(values.time[1]).format('YYYY-MM-DD');
    }

    this.props.dispatch({
      type: 'overAlarmDisposalRate/getExceptionList',
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantList: this.state.checkedValues,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
      },
    });

    this.setState({
      queryCondition: {
        AttentionCode: values.AttentionCode,
        PollutantList: this.state.checkedValues,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
      },
    });
  };

  // 导出异常数据
  exportExceptionList = () => {
    let values = this.props.form.getFieldsValue();
    let beginTime, endTime;
    if (values.time && values.time[0]) {
      beginTime =
        values.dataType === 'HourData'
          ? moment(values.time[0]).format('YYYY-MM-DD HH:00:00')
          : moment(values.time[0]).format('YYYY-MM-DD');
    }
    if (values.time && values.time[1]) {
      endTime =
        values.dataType === 'HourData'
          ? moment(values.time[1]).format('YYYY-MM-DD HH:59:59')
          : moment(values.time[1]).format('YYYY-MM-DD');
    }
    this.props.dispatch({
      type: 'overAlarmDisposalRate/exportExceptionList',
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantList: this.state.checkedValues,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
      },
    });
  };

  onDataTypeChange = value => {
    if (value === 'HourData') {
      this.props.form.setFieldsValue({ time: [moment().subtract(1, 'days'), moment()] });
      this.setState({ format: 'YYYY-MM-DD HH', showTime: true });
    } else {
      this.props.form.setFieldsValue({ time: [moment().subtract(7, 'days'), moment()] });
      this.setState({ format: 'YYYY-MM-DD', showTime: false });
    }
  };

  // 监测因子change
  onCheckboxChange = checkedValues => {
    if (checkedValues.length < 1) {
      message.warning('最少勾选三个监测因子！');
      return;
    }
    let titlePollutant = [];

    this.props.divisorList.map((item, key) => {
      let index = checkedValues.findIndex((checkedItem, checkedKey) => {
        if (item.PollutantCode == checkedItem) {
          return true;
        }
      });
      if (index !== -1) {
        titlePollutant.push({
          title: item.PollutantName,
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
        });
      }
    });
    let titleList = [];
    if (checkedValues.length > 2) {
      titleList = [
        {
          title: '行政区',
          dataIndex: 'RegionName',
          key: 'RegionName',
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
      titleList = [
        {
          title: '行政区',
          dataIndex: 'RegionName',
          key: 'RegionName',
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

    this.setState({
      checkedValues,
      columns: titleList,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      regionList,
      attentionList,
      divisorList,
      exceptionDataSource,
      loading,
    } = this.props;
    const { formLayout } = this._SELF_;
    const { format, showTime, checkedValues, columns } = this.state;
    console.log('attentionList=', attentionList);
    console.log('divisorList = ', divisorList);
    console.log('exceptionDataSource = ', exceptionDataSource);
    let _regionList = regionList.length ? regionList[0].children : [];
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
                          this.getPollutantByType();
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
                    initialValue: [moment().subtract(1, 'days'), moment()],
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
                  onClick={this.getExceptionList}
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
          <SdlTable dataSource={exceptionDataSource} columns={columns} loading={loading} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;
