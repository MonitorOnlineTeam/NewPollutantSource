import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { ExportOutlined } from '@ant-design/icons';
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
import RegionList from '@/components/RegionList'
import EmergencyDetailInfo from '@/pages/EmergencyTodoList/EmergencyDetailInfo';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, autoForm, abnormalResRate,exceptionrecordNew, }) => ({
  regionList: autoForm.regionList,
  attentionList: abnormalResRate.attentionList,
  divisorList: abnormalResRate.divisorList,
  tableDataSource: abnormalResRate.tableDataSource,
  searchForm: abnormalResRate.searchForm,
  exceptionTime: abnormalResRate.exceptionTime,
  loading: loading.effects["abnormalResRate/getTableDataSource"],
  exportLoading: loading.effects["abnormalResRate/exportReport"],
  exceptionAlarmListForEntDataSource: exceptionrecordNew.exceptionAlarmListForEntDataSource,
  detailsLoading: loading.effects["exceptionrecordNew/getExceptionAlarmListForEnt"],
  exportExceptionAlarmListForEntLoading:loading.effects["exceptionrecordNew/exportExceptionAlarmListForEnt"],

}))
@Form.create( {
  
   onFieldsChange(props, fields) {
    props.dispatch({
      type: 'abnormalResRate/updateState',
      payload: {
        searchForm: {},
      },
    })
  }
})
// @Form.create({
//   mapPropsToFields(props) {
//     return {
//       dataType: Form.createFormField(props.searchForm.dataType),
//       // time: Form.createFormField(props.searchForm.time),
//       RegionCode: Form.createFormField(props.searchForm.RegionCode),
//       AttentionCode: Form.createFormField(props.searchForm.AttentionCode),
//       PollutantType: Form.createFormField(props.searchForm.PollutantType),
//     };
//   },
//   onFieldsChange(props, fields) {
//     props.dispatch({
//       type: 'abnormalResRate/updateState',
//       payload: {
//         searchForm: {
//           ...props.searchForm,
//           ...fields,
//         },
//       },
//     })
//   },
// })
class Index extends PureComponent {
  state = {
    showTime: true,
    format: 'YYYY-MM-DD HH',
    pollutantType: "2",
    checkedValues: [],
    secondQueryCondition: {},
    queryCondition: {},
    operationpersonnel:'',
    exceptionTime: this.props.time || this.props.exceptionTime,
    visible:false,
    RegionName:'',
    TaskID: '',
    DGIMN:'',
    taskDetailVisible:false,
  }
  _SELF_ = {
    columns: [
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        width: 140,
        render: (text, record) => {
          return <a onClick={() => {
            // let queryCondition = this.state.queryCondition;
            // queryCondition.RegionCode = record.RegionCode;
            // queryCondition.RegionName = record.RegionName;
            // queryCondition = JSON.stringify(queryCondition)
            let values = this.props.form.getFieldsValue();
            let beginTime, endTime;
            values.time = this.state.exceptionTime;
            if (values.time && values.time[0]) {
              beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
            }
            if (values.time && values.time[1]) {
              endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
            }
            this.props.dispatch({
              type: "abnormalResRate/updateState",
              payload: {
                searchForm:{
                AttentionCode: values.AttentionCode,
                PollutantType: values.PollutantType,
                RegionCode: values.RegionCode ? values.RegionCode: undefined,
                dataType: values.dataType,
                beginTime: beginTime,
                endTime: endTime,
                OperationPersonnel:this.state.operationpersonnel
              }
            }
            })
            if(this.props.onRegionClick){
              this.props.onRegionClick(record.RegionCode) 
            }else{
              router.push(`/Intelligentanalysis/dataAlarm/abnormal/cityLevel?regionCode=${record.RegionCode? record.RegionCode : ''}`)
            }
              // router.push(`/Intelligentanalysis/dataAlarm/abnormal/details?queryCondition=${queryCondition}`);
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
                let RegionCode = record.RegionCode || this.props.form.getFieldValue("RegionCode");
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
                let RegionCode = record.RegionCode || this.props.form.getFieldValue("RegionCode");
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
                let RegionCode = record.RegionCode || this.props.form.getFieldValue("RegionCode");
                this.onTableClick(RegionCode, "1", '0')
              }}>{text}</a>
            }
          },
          {
            title: '响应率',
            dataIndex: 'LingRate',
            key: 'LingRate',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return record.LingAlarmCount === 0 ? '-' : text
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
                let RegionCode = record.RegionCode || this.props.form.getFieldValue("RegionCode");
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
                let RegionCode = record.RegionCode || this.props.form.getFieldValue("RegionCode");
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
                let RegionCode = record.RegionCode || this.props.form.getFieldValue("RegionCode");
                this.onTableClick(RegionCode, "2", '0')
              }}>{text}</a>
            }
          },
          {
            title: '响应率',
            dataIndex: 'ChaoRate',
            key: 'ChaoRate',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return record.ChaoAlarmCount === 0 ? '-' : text
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
                let RegionCode = record.RegionCode || this.props.form.getFieldValue("RegionCode");
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
                let RegionCode = record.RegionCode || this.props.form.getFieldValue("RegionCode");
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
                let RegionCode = record.RegionCode || this.props.form.getFieldValue("RegionCode");
                this.onTableClick(RegionCode, "3", '0')
              }}>{text}</a>
            }
          },
          {
            title: '响应率',
            dataIndex: 'LianRate',
            key: 'LianRate',
            width: 120,
            align: 'center',
            render: (text, record) => {
              return record.LianAlarmCount === 0 ? '-' : text
            }
          },
        ]
      },
      {
        title: '响应率',
        dataIndex: 'AllRate',
        key: 'AllRate',
        width: 120,
        sorter: (a, b) => a.AllRate.replace("%", "") - b.AllRate.replace("%", ""),
        render: (text, record) => {
          return (record.ChaoAlarmCount + record.LingAlarmCount === 0) ? '-' : text
        }
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
        title: '报警生成时间',
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
      {
        title: '处理详情',
        align: 'center',
        render: (text, record) => {
          if (record.TaskId && record.DGIMN) {
            return <a onClick={() => {
              this.setState({ TaskID: record.TaskId, DGIMN: record.DGIMN }, () => { this.setState({ taskDetailVisible: true }) })
            }}>详情</a>
          }
          return "-"
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
    this.props.dispatch({
      type: 'abnormalResRate/getAttentionDegreeList',
      payload: { RegionCode: '' }
    });

    this.getTableDataSource();
  }




  // 获取异常数据
  getTableDataSource = () => {
    let values = this.props.form.getFieldsValue();
    console.log("values=", values)
    let beginTime, endTime;
    values.time = this.state.exceptionTime;
    if (values.time && values.time[0]) {
      beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    }
    if (values.time && values.time[1]) {
      endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    }
    if(!this.props.searchForm.PollutantType){
      this.props.dispatch({
        type: "abnormalResRate/getTableDataSource",
        payload:  {
          AttentionCode: values.AttentionCode,
          PollutantType: values.PollutantType,
          RegionCode: values.RegionCode ? values.RegionCode:'',
          dataType: values.dataType,
          beginTime: beginTime,
          endTime: endTime,
          // OperationPersonnel:this.state.operationpersonnel
        }
      })
    }else{  //从二级页面返回

      this.props.form.setFieldsValue({
        PollutantType:this.props.searchForm.PollutantType,
        RegionCode: this.props.searchForm.RegionCode? this.props.searchForm.RegionCode : undefined,
        AttentionCode: this.props.searchForm.AttentionCode,
        dataType: this.props.searchForm.dataType,
      })

      this.props.dispatch({
        type: "abnormalResRate/getTableDataSource",
        payload: this.props.searchForm
      }) 
    }

    this.setState({
      queryCondition: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode ? values.RegionCode: undefined,
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
        OperationPersonnel:this.state.operationpersonnel
      }
    })

  }

  // 导出异常数据
  onExport = () => {
    // let values = this.props.form.getFieldsValue();
    let values = this.props.form.getFieldsValue();
    let beginTime, endTime;
    values.time = this.state.exceptionTime;
    if (values.time && values.time[0]) {
      beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    }
    if (values.time && values.time[1]) {
      endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    }
    this.props.dispatch({
      type: "abnormalResRate/exportReport",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode? values.RegionCode: undefined,
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
        OperationPersonnel:this.state.operationpersonnel
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

  dateChange = (date, dataType) => {
    this.props.dispatch({
      type: 'abnormalResRate/updateState',
      payload: {
        exceptionTime: date,
      },
    })
    this.setState({
      exceptionTime: date
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
  onTableClick = (RegionCode, ExceptionType, ResponseStatus,operationpersonnel) => {
    this.setState({
      secondQueryCondition: {
        ...this.state.queryCondition,
        RegionCode: RegionCode,
        ExceptionType: ExceptionType,
        ResponseStatus: ResponseStatus,
        OperationPersonnel:this.state.operationpersonnel
      },
      visible: true,
      pageIndex:1,
    }, () => {
      this.getExceptionAlarmListForEnt();
    })
  }
  onDetailExport = () => {
    this.props.dispatch({
      type: "exceptionrecordNew/exportExceptionAlarmListForEnt",
      payload: {
        ...this.state.secondQueryCondition,
      }
    })
  }
  render() {
    const { form: { getFieldDecorator, getFieldValue }, regionList, attentionList, detailsLoading, exceptionAlarmListForEntDataSource, tableDataSource, loading, exportLoading,exportExceptionAlarmListForEntLoading, } = this.props;
    const { columns, detailsColumns } = this._SELF_;
    const { format, showTime, checkedValues, RegionName, queryCondition, secondQueryCondition, exceptionTime,operationpersonnel,DGIMN,TaskID, } = this.state;
    let _detailsColumns = detailsColumns;
    let _regionList = regionList.length ? regionList[0].children : [];
    let showTypeText = "";
    if (secondQueryCondition.ResponseStatus == "0") {
      showTypeText = `${secondQueryCondition.ExceptionType == "1"? "零值" : secondQueryCondition.ExceptionType == "2" ? '超量程' : '恒定值'}待响应报警情况`
    } else if (secondQueryCondition.ResponseStatus == "1") {
      showTypeText =`${secondQueryCondition.ExceptionType == "1"? "零值" : secondQueryCondition.ExceptionType == "2" ? '超量程' : '恒定值'}已响应报警情况`
    } else {
      if (secondQueryCondition.ExceptionType == "1") {
        showTypeText = "零值报警情况"
      } else if(secondQueryCondition.ExceptionType == "2") {
        showTypeText = "超量程报警情况"
      }else if(secondQueryCondition.ExceptionType == "3"){
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
              <FormItem label="数据类型">
                {getFieldDecorator('dataType', {
                  initialValue: 'HourData',
                })(
                  <Select
                    style={{ width: 180 }}
                    placeholder="请选择数据类型"
                    allowClear
                    onChange={this.onDataTypeChange}
                  >
                    <Option key='0' value='HourData'>小时数据</Option>
                    <Option key='1' value='DayData'> 日数据</Option>
                  </Select>
                )}
              </FormItem>
              {/* <Form.Item label="运维状态">
              {
                  <Select
                    allowClear
                    style={{ width: 180}}
                    placeholder="运维状态"
                    maxTagCount={2}
                    maxTagTextLength={5}
                    maxTagPlaceholder="..."
                    value={operationpersonnel?operationpersonnel:undefined}
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
              <FormItem label="日期查询">
                <RangePicker_ allowClear={false} onRef={(ref) => {
                  this.rangePicker = ref;
                }} dataType={this.props.form.getFieldValue("dataType")} style={{ width: "100%", marginRight: '10px' }}
                   dateValue={!this.props.searchForm.PollutantType? exceptionTime : [moment(this.props.searchForm.beginTime),moment(this.props.searchForm.endTime)]}
                  callback={(dates, dataType) => this.dateChange(dates, dataType)} />
              </FormItem>
              <FormItem label="行政区">
                {getFieldDecorator('RegionCode', {
                })(
                  // <Select style={{ width: 180 }} allowClear placeholder="请选择行政区">
                  //   {
                  //     _regionList.map(item => {
                  //       return <Option key={item.key} value={item.value}>
                  //         {item.title}
                  //       </Option>
                  //     })
                  //   }
                  // </Select>,
                  <RegionList style={{ width: 180 }}/>
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem label="关注程度">
                {getFieldDecorator('AttentionCode', {
                  initialValue: undefined,
                })(
                  <Select allowClear style={{ width: 180 }} placeholder="请选择关注程度">
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
                  initialValue: this.props.defaultPollutantCode || '2',
                })(
                  <Select style={{ width: 231 }} placeholder="请选择企业类型" onChange={(value) => {
                    this.setState({ pollutantType: value }, () => {
                    })
                  }}>
                    <Option value="2">废气</Option>
                    <Option value="1">废水</Option>    
                  </Select>
                )}
              </FormItem>

              <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                <Button loading={loading} type="primary" style={{ marginLeft: 10 }} onClick={this.getTableDataSource}>
                  查询
                      </Button>
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  loading={exportLoading}
                  onClick={this.onExport}
                >
                  导出
                      </Button>
                <span style={{ color: "red", marginLeft: 20 }}>已响应指：运维人员响应报警，并完成响应报警生成的运维工单。</span>
              </div>
            </Row>
          </Form>
          <SdlTable align="center" dataSource={tableDataSource} columns={columns} loading={loading} />
        </Card>
        <Modal
          title={modelTitle}
          visible={this.state.visible}
          footer={false}
          wrapClassName='spreadOverModal'
          onCancel={() => { this.setState({ visible: false }) }}
        >
          <Row style={{ marginBottom: 10 }}>
            <Button  icon={<ExportOutlined />} loading={exportExceptionAlarmListForEntLoading} onClick={this.onDetailExport}>
              导出
            </Button>
          </Row>
          <SdlTable
            align="center" 
            loading={detailsLoading} 
            dataSource={exceptionAlarmListForEntDataSource}
            columns={_detailsColumns} 
            />
        </Modal> 
        <Modal
            visible={this.state.taskDetailVisible}
            footer={false}
            wrapClassName='spreadOverModal'
            destroyOnClose
            onCancel={() => this.setState({ taskDetailVisible: false })}
          >
            <EmergencyDetailInfo DGIMN={DGIMN} TaskID={TaskID} goback={"none"} />
          </Modal>
      </BreadcrumbWrapper>
    );
  }
}

export default Index;
