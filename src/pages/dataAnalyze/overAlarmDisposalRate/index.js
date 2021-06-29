/*
 * @Description:超标报警处置率-一级
 * @LastEditors: hxf
 * @Date: 2020-10-16 16:16:39
 * @LastEditTime: 2020-11-27 17:31:01
 * @FilePath: /NewPollutantSource/src/pages/dataAnalyze/overAlarmDisposalRate/index.js
 */

import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'; // 外层cpmponent 包含面包屑
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Col, Row, Select, Input, Checkbox, DatePicker, Button, message } from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import { downloadFile } from '@/utils/utils';
import moment from 'moment';
import { router } from 'umi';
import RegionList from '@/components/RegionList'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
import RangePicker_ from '@/components/RangePicker/NewRangePicker';


@connect(({ loading, autoForm, overAlarmDisposalRate }) => ({
  checkedValues: overAlarmDisposalRate.checkedValues,
  dataType: overAlarmDisposalRate.dataType,
  PollutantType: overAlarmDisposalRate.PollutantType,
  RegionCode: overAlarmDisposalRate.RegionCode,
  AttentionCode: overAlarmDisposalRate.AttentionCode,
  beginTime: overAlarmDisposalRate.beginTime,
  endTime: overAlarmDisposalRate.endTime,
  column: overAlarmDisposalRate.column,
  regionList: autoForm.regionList,
  attentionList: overAlarmDisposalRate.attentionList,
  divisorList: overAlarmDisposalRate.divisorList,
  alarmManagementRateDataSource: overAlarmDisposalRate.alarmManagementRateDataSource,
  alarmManagementRateExportLoading: overAlarmDisposalRate.alarmManagementRateExportLoading,
  loading: loading.effects['overAlarmDisposalRate/getAlarmManagementRate'],
}))
@Form.create()
class index extends PureComponent {
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
    const { dispatch, divisorList } = this.props;
    // 获取行政区列表
    // dispatch({
    //   type: 'autoForm/getRegions',
    //   payload: { RegionCode: '', PointMark: '2' },
    // });

    // 获取关注列表
    dispatch({
      type: 'overAlarmDisposalRate/getAttentionDegreeList',
      payload: { RegionCode: '' },
    });

    // 根据企业类型查询监测因子
    if (divisorList.length === 0) {
      this.getPollutantByType(this.getAlarmManagementRate);
    }
  }

  // 根据企业类型查询监测因子
  getPollutantByType = cb => {
    const { dispatch, PollutantType } = this.props;
    dispatch({
      type: 'overAlarmDisposalRate/getPollutantCodeList',
      payload: {
        PollutantType,
      },
      callback: res => {
        dispatch({
          type: 'overAlarmDisposalRate/updateState',
          payload: {
            checkedValues: res.map(item => item.PollutantCode),
          },
        });
        this.setState({ checkedValues: res.map(item => item.PollutantCode) }, () => {
          cb && cb();
        });
      },
    });
  };

  // 获取超标报警处置率-一级
  getAlarmManagementRate = () => {
    const {
      dispatch,
      dataType,
      AttentionCode,
      RegionCode,
      beginTime,
      endTime,
      PollutantType,
      checkedValues,
    } = this.props;
    dispatch({
      type: 'overAlarmDisposalRate/getAlarmManagementRate',
      payload: {
        AttentionCode,
        PollutantType,
        RegionCode: RegionCode? RegionCode:'',
        dataType,
        beginTime: beginTime.format('YYYY-MM-DD 00:00:00'),
        endTime: endTime.format('YYYY-MM-DD 23:59:59'),
        PollutantList: checkedValues,
        PollutantCodeList: checkedValues,
        Rate: 1,
      },
    });
  };

  exportAlarmManagementRate = () => {
    const {
      dispatch,
      dataType,
      AttentionCode,
      RegionCode,
      beginTime,
      endTime,
      PollutantType,
      checkedValues,
    } = this.props;
    dispatch({
      type: 'overAlarmDisposalRate/exportAlarmManagementRate',
      payload: {
        AttentionCode,
        PollutantType,
        RegionCode,
        dataType,
        beginTime: beginTime.format('YYYY-MM-DD 00:00:00'),
        endTime: endTime.format('YYYY-MM-DD 23:59:59'),
        PollutantList: checkedValues,
        PollutantCodeList: checkedValues,
        Rate: 1,
      },
      callback: data => {
        downloadFile(`/upload${data}`);
      },
    });
  };

  onDataTypeChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'overAlarmDisposalRate/updateState',
      payload: {
        dataType: value,
      },
    });
  };

  // 监测因子change
  onCheckboxChange = checkedValues => {
    if (checkedValues.length < 1) {
      message.warning('最少勾选一个监测因子！');
      return;
    }
    this.setState({
      checkedValues,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'overAlarmDisposalRate/updateState',
      payload: {
        checkedValues,
      },
    });
  };

  render() {
    const {
      dispatch,
      checkedValues,
      dataType,
      PollutantType,
      RegionCode,
      AttentionCode,
      beginTime,
      endTime,
      form: { getFieldDecorator },
      regionList,
      attentionList,
      divisorList,
      alarmManagementRateDataSource,
      column: pollutantColumn,
      alarmManagementRateExportLoading,
      loading,
    } = this.props;
    const { formLayout } = this._SELF_;
    const { format, showTime } = this.state;
    let _regionList = regionList.length ? regionList[0].children : [];
    let columns = [];
    let titlePollutant = [];

    pollutantColumn.map((item, key) => {
      titlePollutant.push({
        title: item.PollutantName,
        width: 500,
        children: [
          {
            title: '报警次数',
            dataIndex: `${item.PollutantCode}_alarmCount`,
            key: 'DataType',
            width: 100,
            align: 'center',
          },
          {
            title: '已处置报警次数',
            dataIndex: `${item.PollutantCode}_respondedCount`,
            key: 'DataType',
            width: 150,
            align: 'center',
          },
          {
            title: '待处置报警次数',
            dataIndex: `${item.PollutantCode}_noRespondedCount`,
            key: 'DataType',
            width: 150,
            align: 'center',
          },
          {
            title: '处置率',
            dataIndex: `${item.PollutantCode}_RespondedRate`,
            key: 'DataType',
            width: 100,
            align: 'center',
            render: (text, record) => {
              if (text == '-') {
                return <div>{`${text}`}</div>;
              } else {
                return <div>{`${text}%`}</div>;
              }
            },
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
          align: 'center',
          render: (text, record) => {
            return (
              <a
                onClick={() => {
                  let params = {};
                  params.regionName = record.regionName;
                  params.regionCode = record.regionCode;

                  let values = this.props.form.getFieldsValue();

                  params.beginTime = moment(values.time[0]).format('YYYY-MM-DD');
                  params.endTime = moment(values.time[1]).format('YYYY-MM-DD');

                  params.AttentionCode = values.AttentionCode;
                  params.PollutantList = this.state.checkedValues;
                  params.PollutantType = values.PollutantType;
                  params.dataType = values.dataType;
                  router.push(
                    `/Intelligentanalysis/dataAlarm/baojing/4/overAlarmDisposalRate/RegionOverAlarmDisposalRate?params=${JSON.stringify(
                      params,
                    )}`,
                  );
                }}
              >
                {text}
              </a>
            );
          },
        },
        {
          title: '工艺超标报警企业数',
          dataIndex: 'entCount',
          key: 'entCount',
          align: 'center',
        },
        {
          title: '工艺超标报警监测点数',
          dataIndex: 'pointCount',
          key: 'pointCount',
          width: 150,
          align: 'center',
        },
        ...titlePollutant,
        {
          title: '处置率',
          dataIndex: 'AllRespondedRate',
          key: 'AllRespondedRate',
          align: 'center',
          render: (text, record) => {
            if (text == '-') {
              return <div>{`${text}`}</div>;
            } else {
              return <div>{`${text}%`}</div>;
            }
          },
        },
      ];
    } else {
      columns = [
        {
          title: '行政区',
          dataIndex: 'regionName',
          key: 'regionName',
          align: 'center',
          render: (text, record) => {
            return (
              <a
                onClick={() => {
                  let params = {};
                  params.regionName = record.regionName;
                  params.regionCode = record.regionCode;

                  let values = this.props.form.getFieldsValue();

                  params.beginTime = moment(values.time[0]).format('YYYY-MM-DD');
                  params.endTime = moment(values.time[1]).format('YYYY-MM-DD');

                  params.AttentionCode = values.AttentionCode;
                  params.PollutantList = this.state.checkedValues;
                  params.PollutantType = values.PollutantType;
                  params.dataType = values.dataType;
                  router.push(
                    `/Intelligentanalysis/dataAlarm/baojing/overAlarmDisposalRate/4/RegionOverAlarmDisposalRate?params=${JSON.stringify(
                      params,
                    )}`,
                  );
                }}
              >
                {text}
              </a>
            );
          },
        },
        {
          title: '工艺超标报警企业数',
          dataIndex: 'entCount',
          key: 'entCount',
          align: 'center',
        },
        {
          title: '工艺超标报警监测点数',
          dataIndex: 'pointCount',
          key: 'pointCount',
          width: 150,
          align: 'center',
        },
        ...titlePollutant,
      ];
    }
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="" className='searchForm' style={{ marginBottom: 0 }}>
            <Row gutter={16}>
              <Col md={4}>
                <FormItem {...formLayout} label="数据类型" style={{ width: '100%' }}>
                  {getFieldDecorator('dataType', {
                    initialValue: dataType,
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
              </Col>
              <Col md={7}>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                  label="日期查询"
                  style={{ width: '100%' }}
                >
                  {getFieldDecorator('time', {
                    initialValue: [beginTime, endTime],
                  })(
                    <RangePicker_
                      allowClear={false}
                      // showTime={showTime}
                      format={format}
                      style={{ width: '100%' }}
                      onChange={(dates, dateStrings) => {
                        this.setState({ beginTime: dates[0], endTime: dates[1] }, () => { });
                        dispatch({
                          type: 'overAlarmDisposalRate/updateState',
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
                  
                  {
                  // getFieldDecorator('RegionCode', {
                  //   initialValue: RegionCode,
                  // })(
                    // <Select
                    //   allowClear
                    //   placeholder="请选择行政区"
                    //   onChange={value => {
                    //     this.setState({ RegionCode: value }, () => { });
                    //     dispatch({
                    //       type: 'overAlarmDisposalRate/updateState',
                    //       payload: {
                    //         RegionCode: value,
                    //       },
                    //     });
                    //   }}
                    // >
                    //   {_regionList.map(item => {
                    //     return (
                    //       <Option key={item.key} value={item.value}>
                    //         {item.title}
                    //       </Option>
                    //     );
                    //   })}
                    // </Select>,
              <RegionList changeRegion={value => {
                    this.setState({ RegionCode: value }, () => { });
                    dispatch({
                      type: 'overAlarmDisposalRate/updateState',
                      payload: {
                        RegionCode: value,
                      },
                    });
                  }} RegionCode={RegionCode}/>

                  // )
                }
                </FormItem>
              </Col>
              <Col md={5}>
                <FormItem {...formLayout} label="关注程度" style={{ width: '100%' }}>
                  {getFieldDecorator('AttentionCode', {
                    initialValue: AttentionCode? AttentionCode : undefined,
                  })(
                    <Select
                      allowClear
                      placeholder="请选择关注程度"
                      onChange={value => {
                        this.setState({ AttentionCode: value }, () => { });
                        dispatch({
                          type: 'overAlarmDisposalRate/updateState',
                          payload: {
                            AttentionCode: value? value : '',
                          },
                        });
                      }}
                    >
                      {/* <Option value=""></Option> */}
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
            </Row>
            <Row gutter={24}>
              <Col md={4} >
                <FormItem {...formLayout} label="企业类型" style={{ width: '100%' }}>
                  {getFieldDecorator('PollutantType', {
                    initialValue: PollutantType,
                  })(
                    <Select
                      placeholder="请选择企业类型"
                      onChange={value => {
                        this.setState({ pollutantType: value }, () => {
                          this.getPollutantByType();
                        });
                        dispatch({
                          type: 'overAlarmDisposalRate/updateState',
                          payload: {
                            PollutantType: value,
                          },
                        });
                      }}
                    >
                      <Option value="1">废水</Option>
                      <Option value="2">废气</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={20} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                <div class="ant-form-item-label" style={{ width: 70, marginLeft: 26, marginRight: 8 }}>
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
                  icon={<ExportOutlined />}
                  onClick={this.exportAlarmManagementRate}
                  loading={alarmManagementRateExportLoading}
                >
                  导出
                </Button>
              </Col>
            </Row>
          </Form>
          <Row gutter={16}>
            <div style={{ color: 'red', marginBottom: 8, marginLeft: 28 }}>
              核实结果为工艺超标、工艺设备故障的超标报警 ，由监管人员进行处置
            </div>
          </Row>
          <SdlTable
            scroll={{ xScroll: 'scroll' }}
            dataSource={alarmManagementRateDataSource}
            columns={columns}
            loading={loading}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;
