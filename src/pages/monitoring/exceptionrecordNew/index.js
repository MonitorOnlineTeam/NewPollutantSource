import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Card, Form, Col, Row, Select, Input, Checkbox, DatePicker, Button, message, Icon, Modal } from 'antd';
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import { router } from 'umi'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, autoForm, exceptionrecordNew }) => ({
  regionList: autoForm.regionList,
  attentionList: exceptionrecordNew.attentionList,
  divisorList: exceptionrecordNew.divisorList,
  exceptionAlarmDataSource: exceptionrecordNew.exceptionAlarmDataSource,
  exceptionAlarmListForEntDataSource: exceptionrecordNew.exceptionAlarmListForEntDataSource,
  loading: loading.effects["exceptionrecordNew/getExceptionAlarmListForRegion"],
  exportLoading: loading.effects["exceptionrecordNew/exportExceptionAlarm"],
  detailsLoading: loading.effects["exceptionrecordNew/getExceptionAlarmListForEnt"],
}))
@Form.create()
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
        title: '运维负责人',
        dataIndex: 'OperationName',
        key: 'OperationName',
      },
      {
        title: '响应时间',
        dataIndex: 'CompleteTime',
        key: 'CompleteTime',
        align: 'center',
        render: (text, record) => {
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
    if (value === "HourData") {
      this.props.form.setFieldsValue({ "time": [moment().subtract(1, "days"), moment()] })
      this.setState({ format: "YYYY-MM-DD HH", showTime: true })
    } else {
      this.props.form.setFieldsValue({ "time": [moment().subtract(7, "days"), moment()] })
      this.setState({ format: "YYYY-MM-DD", showTime: false })
    }
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


  render() {
    const { form: { getFieldDecorator, getFieldValue }, regionList, attentionList, detailsLoading, exceptionAlarmListForEntDataSource, divisorList, exceptionAlarmDataSource, loading, exportLoading } = this.props;
    const { formLayout, columns, detailsColumns } = this._SELF_;
    const { format, showTime, checkedValues, RegionName, queryCondition, secondQueryCondition } = this.state;
    console.log("exceptionAlarmListForEntDataSource=", exceptionAlarmListForEntDataSource)
    let _regionList = regionList.length ? regionList[0].children : [];
    let showTypeText = secondQueryCondition.ResponseStatus == "0" ? "待响应报警情况" : (secondQueryCondition.ResponseStatus == "1" ? "已响应报警情况" : "报警响应情况")
    let beginTime = queryCondition.dataType === "HourData" ? moment(queryCondition.beginTime).format("YYYY年MM月DD号HH时") : moment(queryCondition.beginTime).format("YYYY年MM月DD号")
    let endTime = queryCondition.dataType === "HourData" ? moment(queryCondition.endTime).format("YYYY年MM月DD号HH时") : moment(queryCondition.endTime).format("YYYY年MM月DD号")
    let modelTitle = `${RegionName}${beginTime} - ${endTime}${showTypeText}`
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col md={5}>
                <FormItem {...formLayout} label="行政区" style={{ width: '100%' }}>
                  {getFieldDecorator('RegionCode', {
                    // initialValue: 'siteDaily',
                  })(
                    <Select allowClear placeholder="请选择行政区">
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
              </Col>
              <Col md={5}>
                <FormItem {...formLayout} label="关注程度" style={{ width: '100%' }}>
                  {getFieldDecorator('AttentionCode', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择关注程度">
                      <Option value="">全部</Option>
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
              </Col>
              <Col md={5}>
                <FormItem {...formLayout} label="企业类型" style={{ width: '100%' }}>
                  {getFieldDecorator('PollutantType', {
                    initialValue: '1',
                  })(
                    <Select placeholder="请选择企业类型" onChange={(value) => {
                      this.setState({ pollutantType: value }, () => {
                      })
                    }}>
                      <Option value="1">废水</Option>
                      <Option value="2">废气</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5}>
                <FormItem {...formLayout} label="数据类型" style={{ width: '100%' }}>
                  {getFieldDecorator('dataType', {
                    initialValue: 'HourData',
                  })(
                    <Select
                      placeholder="请选择数据类型"
                      onChange={this.onDataTypeChange}
                    >
                      <Option key='0' value='HourData'>小时数据</Option>
                      <Option key='1' value='DayData'> 日数据</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8}>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="日期查询" style={{ width: '100%' }}>
                  {getFieldDecorator('time', {
                    initialValue: [moment().subtract(1, "days"), moment()],
                  })(
                    <RangePicker allowClear={false} showTime={showTime} format={format} style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col md={16} style={{ marginTop: 5 }}>
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
                <Icon type="question-circle" style={{ marginLeft: 20, marginRight: 6 }} />
                <span style={{ color: "red" }}>已响应指：监测点运维负责人，响应报警并完成响应，生成运维工单</span>
              </Col>
            </Row>
          </Form>
          <SdlTable dataSource={exceptionAlarmDataSource} columns={columns} loading={loading} />
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
          <SdlTable loading={detailsLoading} dataSource={exceptionAlarmListForEntDataSource} columns={detailsColumns} pagination={false} />
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default index;