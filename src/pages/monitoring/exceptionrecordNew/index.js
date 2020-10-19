import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Card, Form, Col, Row, Select, Input, Checkbox, DatePicker, Button, message, Icon, Modal } from 'antd';
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import { router } from 'umi'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, autoForm, exceptionrecordNew }) => ({
  regionList: autoForm.regionList,
  attentionList: exceptionrecordNew.attentionList,
  divisorList: exceptionrecordNew.divisorList,
  exceptionAlarmDataSource: exceptionrecordNew.exceptionAlarmDataSource,
  exceptionAlarmListForEntDataSource: exceptionrecordNew.exceptionAlarmListForEntDataSource,
  exceptionrecordForm: exceptionrecordNew.exceptionrecordForm,
  exceptionTime: exceptionrecordNew.exceptionTime,
  loading: loading.effects["exceptionrecordNew/getExceptionAlarmListForRegion"],
  exportLoading: loading.effects["exceptionrecordNew/exportExceptionAlarm"],
  detailsLoading: loading.effects["exceptionrecordNew/getExceptionAlarmListForEnt"],
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      dataType: Form.createFormField(props.exceptionrecordForm.dataType),
      // time: Form.createFormField(props.exceptionrecordForm.time),
      RegionCode: Form.createFormField(props.exceptionrecordForm.RegionCode),
      AttentionCode: Form.createFormField(props.exceptionrecordForm.AttentionCode),
      PollutantType: Form.createFormField(props.exceptionrecordForm.PollutantType),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'exceptionrecordNew/updateState',
      payload: {
        exceptionrecordForm: {
          ...props.exceptionrecordForm,
          ...fields,
        },
      },
    })
  },
})
class index extends PureComponent {
  state = {
    showTime: true,
    format: 'YYYY-MM-DD HH',
    pollutantType: "1",
    checkedValues: [],
    secondQueryCondition: {},
    queryCondition: {},
  }
  _SELF_ = {
    formLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    },
    columns: [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 120,
        render: (text, record) => {
          return <a onClick={() => {
            let queryCondition = this.state.queryCondition;
            queryCondition.RegionCode = record.RegionCode;
            queryCondition = JSON.stringify(queryCondition)
            router.push(`/dataquerymanager/exceptionrecord/details?queryCondition=${queryCondition}`);
          }}>{text}</a>
        }
      },
      {
        title: '数据异常报警企业数',
        dataIndex: 'CountEnt',
        key: 'CountEnt',
        width: 200,
      },
      {
        title: '数据异常报警监测点数',
        dataIndex: 'CountPoint',
        key: 'CountPoint',
        width: 200,
      },
      {
        title: '数据类型',
        dataIndex: 'DataType',
        key: 'DataType',
        width: 200,
      },
      {
        title: '零值报警',
        children: [
          {
            title: '报警次数',
            dataIndex: 'LingAlarmCount',
            key: 'LingAlarmCount',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return <a onClick={() => {
                this.setState({ RegionName: record.RegionName })
                this.onTableClick(record.RegionCode, '1', undefined)
              }}>{text}</a>
            }
          },
          {
            title: '已响应报警次数',
            dataIndex: 'LingResponsedCount',
            key: 'LingResponsedCount',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return <a onClick={() => {
                this.setState({ RegionName: record.RegionName })
                this.onTableClick(record.RegionCode, "1", '1')
              }}>{text}</a>
            }
          },
          {
            title: '待响应报警次数',
            dataIndex: 'LingNoResponseCount',
            key: 'LingNoResponseCount',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return <a onClick={() => {
                this.setState({ RegionName: record.RegionName })

                this.onTableClick(record.RegionCode, "1", '0')
              }}>{text}</a>
            }
          },
        ]
      },
      {
        title: '超量程报警',
        children: [
          {
            title: '报警次数',
            dataIndex: 'ChaoAlarmCount',
            key: 'ChaoAlarmCount',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return <a onClick={() => {
                this.setState({ RegionName: record.RegionName })

                this.onTableClick(record.RegionCode, "2", undefined)
              }}>{text}</a>
            }
          },
          {
            title: '已响应报警次数',
            dataIndex: 'ChaoResponsedCount',
            key: 'ChaoResponsedCount',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return <a onClick={() => {
                this.setState({ RegionName: record.RegionName })

                this.onTableClick(record.RegionCode, "2", '1')
              }}>{text}</a>
            }
          },
          {
            title: '待响应报警次数',
            dataIndex: 'ChaoNoResponseCount',
            key: 'ChaoNoResponseCount',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return <a onClick={() => {
                this.setState({ RegionName: record.RegionName })
                this.onTableClick(record.RegionCode, "2", '0')
              }}>{text}</a>
            }
          },
        ]
      },
    ],
    detailsColumns: [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
      },
      {
        title: '企业名称',
        dataIndex: 'EntName',
        key: 'EntName',
      },
      {
        title: '监测点名称',
        dataIndex: 'PointName',
        key: 'PointName',
      },
      {
        title: '数据类型',
        dataIndex: 'DataType',
        key: 'DataType',
      },
      {
        title: '首次报警时间',
        dataIndex: 'FirstTime',
        key: 'FirstTime',
      },
      {
        title: '报警信息',
        dataIndex: 'AlarmMsg',
        key: 'AlarmMsg',
        width: 300
      },
      {
        title: '响应状态',
        dataIndex: 'ResponseStatusName',
        key: 'ResponseStatusName',
      },
      {
        title: '响应人',
        dataIndex: 'OperationName',
        key: 'OperationName',
        render: (text, record) => {
          if (record.CompleteTime === "0001-01-01 00-00-00") {
            return "-"
          }
          return text ? text : "-"
        }
      },
      {
        title: '响应时间',
        dataIndex: 'CompleteTime',
        key: 'CompleteTime',
        align: 'center',
        render: (text, record) => {
          if (record.CompleteTime === "0001-01-01 00-00-00") {
            return "-"
          }
          return text ? text : "-"
        }
      },
    ],
  }

  componentDidMount() {
    // 获取行政区列表
    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: { RegionCode: '', PointMark: '2', }
    });

    // 获取关注列表
    this.props.dispatch({
      type: 'exceptionrecordNew/getAttentionDegreeList',
      payload: { RegionCode: '' }
    });

    this.getExceptionList();
  }

  onTableClick = (RegionCode, ExceptionType, ResponseStatus) => {
    this.setState({
      secondQueryCondition: {
        ...this.state.queryCondition,
        RegionCode: RegionCode,
        ExceptionType: ExceptionType,
        ResponseStatus: ResponseStatus
      },
      visible: true
    }, () => {
      this.getExceptionAlarmListForEnt();
    })
  }

  // 获取二级数据
  getExceptionAlarmListForEnt = () => {
    this.props.dispatch({
      type: "exceptionrecordNew/getExceptionAlarmListForEnt",
      payload: {
        ...this.state.secondQueryCondition,
      }
    })
  }

  onExport = () => {
    this.props.dispatch({
      type: "exceptionrecordNew/exportExceptionAlarmListForEnt",
      payload: {
        ...this.state.secondQueryCondition,
      }
    })
  }

  // 获取异常数据
  getExceptionList = () => {
    let values = this.props.form.getFieldsValue();
    console.log("values=", values)
    let beginTime, endTime;
    values.time = this.props.exceptionTime;
    if (values.time && values.time[0]) {
      beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    }
    if (values.time && values.time[1]) {
      endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    }
    this.props.dispatch({
      type: "exceptionrecordNew/getExceptionAlarmListForRegion",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
      }
    })
    this.setState({
      queryCondition: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
      }
    })
  }

  // 导出异常数据
  exportExceptionAlarm = () => {
    let values = this.props.form.getFieldsValue();
    let beginTime, endTime;
    values.time = this.props.exceptionTime;
    if (values.time && values.time[0]) {
      beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    }
    if (values.time && values.time[1]) {
      endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    }
    this.props.dispatch({
      type: "exceptionrecordNew/exportExceptionAlarm",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
      }
    })
  }


  onDataTypeChange = (value) => {
    this.rangePicker.onDataTypeChange(value)
    // if (value === "HourData") {
    //   this.props.form.setFieldsValue({ "time": [moment().subtract(1, "days"), moment()] })
    //   this.setState({ format: "YYYY-MM-DD HH", showTime: true })
    // } else {
    //   this.props.form.setFieldsValue({ "time": [moment().subtract(7, "days"), moment()] })
    //   this.setState({ format: "YYYY-MM-DD", showTime: false })
    // }
  }

  // 监测因子change
  onCheckboxChange = (checkedValues) => {
    if (checkedValues.length < 1) {
      message.warning("最少勾选一个监测因子！")
      return;
    }
    this.setState({
      checkedValues: checkedValues
    })
  }

  dateChange = (date, dataType) => {
    this.props.dispatch({
      type: 'exceptionrecordNew/updateState',
      payload: {
        exceptionTime: date,
      },
    })
  }


  render() {
    const { form: { getFieldDecorator, getFieldValue }, exceptionTime, regionList, attentionList, detailsLoading, exceptionAlarmListForEntDataSource, divisorList, exceptionAlarmDataSource, loading, exportLoading } = this.props;
    const { formLayout, columns, detailsColumns } = this._SELF_;
    const { format, showTime, checkedValues, RegionName, queryCondition, secondQueryCondition } = this.state;
    let _detailsColumns = detailsColumns;
    let _regionList = regionList.length ? regionList[0].children : [];
    // let showTypeText = secondQueryCondition.ResponseStatus == "0" ? "待响应报警情况" : (secondQueryCondition.ResponseStatus == "1" ? "已响应报警情况" : "报警响应情况")
    let showTypeText = "";
    if (secondQueryCondition.ResponseStatus == "0") {
      showTypeText = "待响应报警情况"
    } else if (secondQueryCondition.ResponseStatus == "1") {
      showTypeText = "已响应报警情况"
    } else {
      if (secondQueryCondition.ExceptionType == "1") {
        showTypeText = "零值报警情况"
      } else {
        showTypeText = "超量程报警情况"
      }
    }
    let beginTime = queryCondition.dataType === "HourData" ? moment(queryCondition.beginTime).format("YYYY年MM月DD号HH时") : moment(queryCondition.beginTime).format("YYYY年MM月DD号")
    let endTime = queryCondition.dataType === "HourData" ? moment(queryCondition.endTime).format("YYYY年MM月DD号HH时") : moment(queryCondition.endTime).format("YYYY年MM月DD号")
    let modelTitle = `${RegionName}${beginTime} - ${endTime}${showTypeText}`
    if (secondQueryCondition.ResponseStatus == "0") {
      _detailsColumns = _detailsColumns.filter(item => item.dataIndex !== "CompleteTime");
    }

    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row>
              <FormItem label="数据类型">
                {getFieldDecorator('dataType', {
                  initialValue: 'HourData',
                })(
                  <Select
                    style={{ width: 200 }}
                    placeholder="请选择数据类型"
                    allowClear
                    onChange={this.onDataTypeChange}
                  >
                    <Option key='0' value='HourData'>小时数据</Option>
                    <Option key='1' value='DayData'> 日数据</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="日期查询">
                {/* {getFieldDecorator('time', {
                  initialValue: [moment().subtract(1, "days").startOf("day"), moment().endOf("day")]
                })( */}
                {/* <RangePicker style={{ width: 200 }} allowClear={false} showTime={showTime} format={format} style={{ width: '100%' }} /> */}
                <RangePicker_ allowClear={false} onRef={(ref) => {
                  this.rangePicker = ref;
                }} dataType={this.props.form.getFieldValue("dataType")} style={{ width: "100%", marginRight: '10px' }} dateValue={exceptionTime}
                  callback={(dates, dataType) => this.dateChange(dates, dataType)} />
                {/* )} */}
              </FormItem>
              <FormItem label="行政区">
                {getFieldDecorator('RegionCode', {
                  // initialValue: 'siteDaily',
                })(
                  <Select style={{ width: 200 }} allowClear placeholder="请选择行政区">
                    {
                      _regionList.map(item => {
                        return <Option key={item.key} value={item.value}>
                          {item.title}
                        </Option>
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem label="关注程度">
                {getFieldDecorator('AttentionCode', {
                  initialValue: undefined,
                })(
                  <Select allowClear style={{ width: 200 }} placeholder="请选择关注程度">
                    {
                      attentionList.map(item => {
                        return <Option key={item.AttentionCode} value={item.AttentionCode}>
                          {item.AttentionName}
                        </Option>
                      })
                    }
                  </Select>,
                )}
              </FormItem>
              <FormItem label="企业类型">
                {getFieldDecorator('PollutantType', {
                  initialValue: '1',
                })(
                  <Select style={{ width: 200 }} placeholder="请选择企业类型" onChange={(value) => {
                    this.setState({ pollutantType: value }, () => {
                    })
                  }}>
                    <Option value="1">废水</Option>
                    <Option value="2">废气</Option>
                  </Select>
                )}
              </FormItem>

              <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                <Button loading={loading} type="primary" style={{ marginLeft: 10 }} onClick={this.getExceptionList}>
                  查询
                      </Button>
                <Button
                  style={{ margin: '0 5px' }}
                  icon="export"
                  loading={exportLoading}
                  onClick={this.exportExceptionAlarm}
                >
                  导出
                      </Button>
                <span style={{ color: "red", marginLeft: 20 }}>已响应指：运维人员响应报警，并完成响应报警生成的运维工单。</span>
              </div>
            </Row>
          </Form>
          <SdlTable align="center" dataSource={exceptionAlarmDataSource} columns={columns} loading={loading} />
        </Card>
        <Modal
          title={modelTitle}
          visible={this.state.visible}
          footer={false}
          width={"100vw"}
          maskClosable={false}
          onCancel={() => { this.setState({ visible: false }) }}
        >
          <Row style={{ marginBottom: 10 }}>
            <Button type="primary" onClick={this.onExport}>
              导出
            </Button>
          </Row>
          <SdlTable align="center" loading={detailsLoading} dataSource={exceptionAlarmListForEntDataSource} columns={_detailsColumns} />
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default index;
