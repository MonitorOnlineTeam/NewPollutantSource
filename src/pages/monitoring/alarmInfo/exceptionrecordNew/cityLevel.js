import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Col,
  Row,
  Select,
  Input,
  Checkbox,
  DatePicker,
  Button,
  message,
  Modal,
} from 'antd';
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import { router } from 'umi'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, autoForm, exceptionrecordNew }) => ({
  regionList: autoForm.regionList,
  attentionList: exceptionrecordNew.attentionList,
  divisorList: exceptionrecordNew.divisorList,
  exceptionAlarmDataSource: exceptionrecordNew.exceptionAlarmDataSource,
  exceptionAlarmListForEntDataSource: exceptionrecordNew.exceptionAlarmListForEntDataSource,
  exceptionrecordForms: exceptionrecordNew.exceptionrecordForms,
  exceptionTime: exceptionrecordNew.exceptionTime,
  loading: loading.effects["exceptionrecordNew/getExceptionAlarmListForCity"],
  exportLoading: loading.effects["exceptionrecordNew/exportExceptionAlarmListForCity"],
  detailsLoading: loading.effects["exceptionrecordNew/getExceptionAlarmListForEnt"],
  exportExceptionAlarmListForEntLoading: loading.effects["exceptionrecordNew/exportExceptionAlarmListForEnt"],
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      // dataType: Form.createFormField(props.exceptionrecordForm.dataType),
      //   time: Form.createFormField(props.exceptionrecordForm.time),
      // RegionCode: Form.createFormField(props.exceptionrecordForm.RegionCode),
      //   RegionCode: Form.createFormField(props.location.query.regionCode),
      // AttentionCode: Form.createFormField(props.exceptionrecordForm.AttentionCode),
      // PollutantType: Form.createFormField(props.exceptionrecordForm.PollutantType),
    };
  },
  onFieldsChange(props, fields) {
    // props.dispatch({
    //   type: 'exceptionrecordNew/updateState',
    //   payload: {
    //     exceptionrecordForm: {
    //       ...props.exceptionrecordForm,
    //       ...fields,
    //     },
    //   },
    // })
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
    exceptionTime: this.props.time || this.props.exceptionTime,
    operationpersonnel: '',
  }
  _SELF_ = {
    formLayout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    },
    columns: [
      // {
      //   title: '行政区',
      //   dataIndex: 'RegionName',
      //   key: 'RegionName',
      //   width: 150,
      //   render: (text, record) => {
      //     return <a onClick={() => {
      //       let queryCondition = this.state.queryCondition;
      //       queryCondition.RegionCode = record.CityCode || this.props.location.query.regionCode;
      //       queryCondition = JSON.stringify(queryCondition)
      //       this.props.onRegionClick ? this.props.onRegionClick(queryCondition) :
      //         router.push(`/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/exceptionrecord/details?queryCondition=${queryCondition}`);
       
      //     }}>{record.CityName ? `${text}/${record.CityName}` : text}</a>
      //   }
      // },
      {
        title: '省',
        dataIndex: 'RegionName',
        key: 'RegionName',
        align: 'center',
        render: (text, record, index) => {
          if (text == '全部合计') {
            return { props: { colSpan: 0 }, };
          }
          return text;
        },
      },
      {
        title: '市',
        dataIndex: 'CityName',
        key: 'CityName',
        align: 'center',
        render: (text, record) => {
          return {
            props: { colSpan: record.RegionName == '全部合计' ? 2 : 1 },
            children: <a onClick={() => {
            let queryCondition = this.state.queryCondition;
            queryCondition.RegionCode = record.CityCode || this.props.location.query.regionCode;
            queryCondition = JSON.stringify(queryCondition)
            this.props.onRegionClick ? this.props.onRegionClick(queryCondition) :
              router.push(`/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/exceptionrecord/details?queryCondition=${queryCondition}`);
          }}>{record.RegionName == '全部合计' ? '全部合计' : text}</a>
        }
      }
      },
      {
        title: '数据异常报警企业数',
        dataIndex: 'CountEnt',
        key: 'CountEnt',
        width: 170,
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
                let RegionCode = record.CityCode || this.props.location.query.regionCode;
                this.onTableClick(RegionCode, '1', undefined)
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
                let RegionCode = record.CityCode || this.props.location.query.regionCode;
                this.onTableClick(RegionCode, "1", '1')
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
                let RegionCode = record.CityCode || this.props.location.query.regionCode;
                this.onTableClick(RegionCode, "1", '0')
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
                let RegionCode = record.CityCode || this.props.location.query.regionCode;
                this.onTableClick(RegionCode, "2", undefined)
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
                let RegionCode = record.CityCode || this.props.location.query.regionCode;
                this.onTableClick(RegionCode, "2", '1')
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
                let RegionCode = record.CityCode || this.props.location.query.regionCode;
                this.onTableClick(RegionCode, "2", '0')
              }}>{text}</a>
            }
          },
        ]
      },
      {
        title: '恒定值报警',
        children: [
          {
            title: '报警次数',
            dataIndex: 'LianAlarmCount',
            key: 'LianAlarmCount',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return <a onClick={() => {
                this.setState({ RegionName: record.RegionName })
                let RegionCode = record.CityCode || this.props.location.query.regionCode;
                this.onTableClick(RegionCode, "3", undefined)
              }}>{text}</a>
            }
          },
          {
            title: '已响应报警次数',
            dataIndex: 'LianResponsedCount',
            key: 'LianResponsedCount',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return <a onClick={() => {
                this.setState({ RegionName: record.RegionName })
                let RegionCode = record.CityCode || this.props.location.query.regionCode;
                this.onTableClick(RegionCode, "3", '1')
              }}>{text}</a>
            }
          },
          {
            title: '待响应报警次数',
            dataIndex: 'LianNoResponseCount',
            key: 'LianNoResponseCount',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return <a onClick={() => {
                this.setState({ RegionName: record.RegionName })
                let RegionCode = record.CityCode || this.props.location.query.regionCode;
                this.onTableClick(RegionCode, "3", '0')
              }}>{text}</a>
            }
          },
        ]
      },
    ],
    detailsColumns: [
      // {
      //   title: '行政区',
      //   dataIndex: 'RegionName',
      //   key: 'RegionName',
      // },
      {
        title: '省',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        align: 'center',
      },
      {
        title: '市',
        dataIndex: 'CityName',
        key: 'CityName',
        align: 'center',
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
        title: '首次异常时间',
        dataIndex: 'FirstTime',
        key: 'FirstTime',
      },
      {
        title: '报警生成时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
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
          if (record.CompleteTime === "0001-01-01 00:00:00") {
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
          if (record.CompleteTime === "0001-01-01 00:00:00") {
            return "-"
          }
          return text ? text : "-"
        }
      },
    ],
  }


  componentDidMount() {
    // 获取行政区列表
    // this.props.dispatch({
    //   type: 'autoForm/getRegions',
    //   payload: { RegionCode: '', PointMark: '2', }
    // });

    // 获取关注列表
    // this.props.dispatch({
    //   type: 'exceptionrecordNew/getAttentionDegreeList',
    //   payload: { RegionCode: '' }
    // });

    this.getExceptionList([moment().subtract(7, "days").startOf("day"), moment().endOf("day")]);
  }

  onTableClick = (RegionCode, ExceptionType, ResponseStatus, operationpersonnel) => {
    this.setState({
      secondQueryCondition: {
        ...this.state.queryCondition,
        RegionCode: RegionCode,
        ExceptionType: ExceptionType,
        ResponseStatus: ResponseStatus,
        OperationPersonnel: this.state.operationpersonnel
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

    // let values = this.props.form.getFieldsValue();
    let values = this.props.exceptionrecordForms;
    console.log("values=", this.props.form)
    let beginTime, endTime;
    values.time = this.state.exceptionTime;
    if (values.time && values.time[0]) {
      beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    }
    if (values.time && values.time[1]) {
      endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    }
    this.props.dispatch({
      type: "exceptionrecordNew/getExceptionAlarmListForCity",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        // RegionCode: values.RegionCode?values.RegionCode:'',
        RegionCode: this.props.location.query.regionCode ? this.props.location.query.regionCode : '',
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
        OperationPersonnel: this.state.operationpersonnel
      }
    })
    this.setState({
      queryCondition: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        // RegionCode: values.RegionCode?values.RegionCode:'',
        RegionCode: this.props.location.query.regionCode ? this.props.location.query.regionCode : '',
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
        OperationPersonnel: this.state.operationpersonnel
      }
    })
  }

  // 导出异常数据
  exportExceptionAlarmListForCity = () => {
    // let values = this.props.form.getFieldsValue();
    let values = this.props.exceptionrecordForms;
    let beginTime, endTime;
    values.time = this.state.exceptionTime;
    if (values.time && values.time[0]) {
      beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    }
    if (values.time && values.time[1]) {
      endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    }
    this.props.dispatch({
      type: "exceptionrecordNew/exportExceptionAlarmListForCity",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        // RegionCode: values.RegionCode?values.RegionCode:'',
        RegionCode: this.props.location.query.regionCode ? this.props.location.query.regionCode : '',
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
        OperationPersonnel: this.state.operationpersonnel
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
    this.setState({
      exceptionTime: date
    })
  }


  render() {
    const { form: { getFieldDecorator, getFieldValue }, regionList, attentionList, detailsLoading, exceptionAlarmListForEntDataSource, divisorList, exceptionAlarmDataSource, loading, exportLoading, exportExceptionAlarmListForEntLoading } = this.props;
    const { formLayout, columns, detailsColumns } = this._SELF_;
    const { format, showTime, checkedValues, RegionName, queryCondition, secondQueryCondition, exceptionTime } = this.state;
    let _detailsColumns = detailsColumns;
    let _regionList = regionList.length ? regionList[0].children : [];
    // let showTypeText = secondQueryCondition.ResponseStatus == "0" ? "待响应报警情况" : (secondQueryCondition.ResponseStatus == "1" ? "已响应报警情况" : "报警响应情况")
    let showTypeText = "";
    if (secondQueryCondition.ResponseStatus == "0") {
      showTypeText = `${secondQueryCondition.ExceptionType == "1" ? "零值" : secondQueryCondition.ExceptionType == "2" ? '超量程' : '恒定值'}待响应报警情况`
    } else if (secondQueryCondition.ResponseStatus == "1") {
      showTypeText = `${secondQueryCondition.ExceptionType == "1" ? "零值" : secondQueryCondition.ExceptionType == "2" ? '超量程' : '恒定值'}已响应报警情况`
    } else {
      if (secondQueryCondition.ExceptionType == "1") {
        showTypeText = "零值报警情况"
      } else if (secondQueryCondition.ExceptionType == "2") {
        showTypeText = "超量程报警情况"
      } else if (secondQueryCondition.ExceptionType == "3") {
        showTypeText = "恒定值报警情况"
      }
    }
    let beginTime = queryCondition.dataType === "HourData" ? moment(queryCondition.beginTime).format("YYYY年MM月DD号HH时") : moment(queryCondition.beginTime).format("YYYY年MM月DD号")
    let endTime = queryCondition.dataType === "HourData" ? moment(queryCondition.endTime).format("YYYY年MM月DD号HH时") : moment(queryCondition.endTime).format("YYYY年MM月DD号")
    let modelTitle = `${RegionName}${beginTime} - ${endTime}${showTypeText}`
    if (secondQueryCondition.ResponseStatus == "0") {
      _detailsColumns = _detailsColumns.filter(item => item.dataIndex !== "CompleteTime");
    }

    return (
      <BreadcrumbWrapper hideBreadcrumb={this.props.hideBreadcrumb}>
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row>
              {/* <FormItem label="数据类型">
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
              </FormItem> */}
              {/* <FormItem label="日期查询">
                <RangePicker_ allowClear={false} onRef={(ref) => {
                  this.rangePicker = ref;
                }} dataType={this.props.form.getFieldValue("dataType")} style={{ width: "100%", marginRight: '10px' }} dateValue={exceptionTime}
                  callback={(dates, dataType) => this.dateChange(dates, dataType)} />
              </FormItem> */}
              {/* <FormItem label="行政区">
                {getFieldDecorator('RegionCode', {
                  // initialValue: 'siteDaily',
                })(
                  // <Select style={{ width: 200 }} allowClear placeholder="请选择行政区">
                  //   {
                  //     _regionList.map(item => {
                  //       return <Option key={item.key} value={item.value}>
                  //         {item.title}
                  //       </Option>
                  //     })
                  //   }
                  // </Select>
                  <RegionList  changeRegion={''} RegionCode={''}/>
                )}
              </FormItem> */}
            </Row>
            <Row>
              {/* <FormItem label="关注程度">
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
              </FormItem> */}
              {/* <FormItem label="企业类型">
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
              </FormItem> */}
              {/* <Form.Item label="运维状态">
                {
                  <Select
                    allowClear
                    style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                    placeholder="运维状态"
                    maxTagCount={2}
                    maxTagTextLength={5}
                    maxTagPlaceholder="..."
                    value={this.state.operationpersonnel?this.state.operationpersonnel:undefined}
                    onChange={(value) => {
                      this.setState({
                          operationpersonnel: value,
                      })
                  }}>
                    <Option value="1">已设置运维人员</Option>
                    <Option value="2">未设置运维人员</Option>
                  </Select>
                }
              </Form.Item> */}
              <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                {/* <Button loading={loading} type="primary" style={{ marginLeft: 10 }} onClick={this.getExceptionList}>
                  查询
                      </Button> */}
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  loading={exportLoading}
                  onClick={this.exportExceptionAlarmListForCity}
                >
                  导出
               </Button>
                <Button onClick={() => {
                  history.go(-1);
                  //   this.props.dispatch(routerRedux.push({pathname:'/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/air'}))
                }}>
                  <RollbackOutlined />返回 </Button>
                {/* <span style={{ color: "red", marginLeft: 20 }}>已响应指：运维人员响应报警，并完成响应报警生成的运维工单。</span> */}
              </div>
            </Row>
          </Form>
          <SdlTable align="center" dataSource={exceptionAlarmDataSource} columns={columns} loading={loading} />
        </Card>
        <Modal
          title={modelTitle}
          visible={this.state.visible}
          footer={false}
          width={"90vw"}
          onCancel={() => { this.setState({ visible: false }) }}
        >
          <Row style={{ marginBottom: 10 }}>
            <Button icon={<ExportOutlined />} loading={exportExceptionAlarmListForEntLoading} onClick={this.onExport}>
              导出
            </Button>
          </Row>
          <SdlTable align="center" loading={detailsLoading} dataSource={exceptionAlarmListForEntDataSource} columns={_detailsColumns} scroll={{ y: 'calc(100vh - 380px)' }} />
        </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default index;
