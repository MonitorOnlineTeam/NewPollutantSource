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

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, autoForm, abnormalResRate }) => ({
  regionList: autoForm.regionList,
  attentionList: abnormalResRate.attentionList,
  divisorList: abnormalResRate.divisorList,
  tableDataSource: abnormalResRate.tableDataSource,
  exceptionAlarmListForEntDataSource: abnormalResRate.exceptionAlarmListForEntDataSource,
  searchForm: abnormalResRate.searchForm,
  exceptionTime: abnormalResRate.exceptionTime,
  loading: loading.effects["abnormalResRate/getTableDataSource"],
  exportLoading: loading.effects["abnormalResRate/exportReport"],
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      dataType: Form.createFormField(props.searchForm.dataType),
      // time: Form.createFormField(props.searchForm.time),
      RegionCode: Form.createFormField(props.searchForm.RegionCode),
      AttentionCode: Form.createFormField(props.searchForm.AttentionCode),
      PollutantType: Form.createFormField(props.searchForm.PollutantType),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'abnormalResRate/updateState',
      payload: {
        searchForm: {
          ...props.searchForm,
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
    operationpersonnel:'',
    exceptionTime: this.props.time || this.props.exceptionTime,
    
  }
  _SELF_ = {
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
            queryCondition.RegionName = record.RegionName;
            queryCondition = JSON.stringify(queryCondition)
            this.props.onRegionClick ? this.props.onRegionClick(queryCondition) :
              router.push(`/Intelligentanalysis/dataAlarm/abnormal/details?queryCondition=${queryCondition}`);
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
          },
          {
            title: '已响应报警次数',
            dataIndex: 'LingResponsedCount',
            key: 'LingResponsedCount',
            width: 120,
            align: 'center',
          },
          {
            title: '待响应报警次数',
            dataIndex: 'LingNoResponseCount',
            key: 'LingNoResponseCount',
            width: 120,
            align: 'center',
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
          },
          {
            title: '已响应报警次数',
            dataIndex: 'ChaoResponsedCount',
            key: 'ChaoResponsedCount',
            width: 120,
            align: 'center',
          },
          {
            title: '待响应报警次数',
            dataIndex: 'ChaoNoResponseCount',
            key: 'ChaoNoResponseCount',
            width: 120,
            align: 'center',
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
  }

  componentDidMount() {
    // 获取行政区列表
    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: { RegionCode: '', PointMark: '2', }
    });

    // 获取关注列表
    this.props.dispatch({
      type: 'abnormalResRate/getAttentionDegreeList',
      payload: { RegionCode: '' }
    });

    this.getTableDataSource();
  }


  onExport = () => {
    this.props.dispatch({
      type: "abnormalResRate/exportExceptionAlarmListForEnt",
      payload: {
        ...this.state.secondQueryCondition,
      }
    })
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
    this.props.dispatch({
      type: "abnormalResRate/getTableDataSource",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode,
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
        OperationPersonnel:this.state.operationpersonnel
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
        OperationPersonnel:this.state.operationpersonnel
      }
    })
  }

  // 导出异常数据
  onExport = () => {
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
        RegionCode: values.RegionCode,
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


  render() {
    const { form: { getFieldDecorator, getFieldValue }, regionList, attentionList, detailsLoading, exceptionAlarmListForEntDataSource, tableDataSource, loading, exportLoading } = this.props;
    const { columns, detailsColumns } = this._SELF_;
    const { format, showTime, checkedValues, RegionName, queryCondition, secondQueryCondition, exceptionTime,operationpersonnel } = this.state;
    let _detailsColumns = detailsColumns;
    let _regionList = regionList.length ? regionList[0].children : [];
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
              <Form.Item label="运维状态">
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
              </Form.Item>
              <FormItem label="日期查询">
                <RangePicker_ allowClear={false} onRef={(ref) => {
                  this.rangePicker = ref;
                }} dataType={this.props.form.getFieldValue("dataType")} style={{ width: "100%", marginRight: '10px' }} dateValue={exceptionTime}
                  callback={(dates, dataType) => this.dateChange(dates, dataType)} />
              </FormItem>
              <FormItem label="行政区">
                {getFieldDecorator('RegionCode', {
                })(
                  <Select style={{ width: 180 }} allowClear placeholder="请选择行政区">
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
                  initialValue: '1',
                })(
                  <Select style={{ width: 180 }} placeholder="请选择企业类型" onChange={(value) => {
                    this.setState({ pollutantType: value }, () => {
                    })
                  }}>
                    <Option value="1">废水</Option>
                    <Option value="2">废气</Option>
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
      </BreadcrumbWrapper>
    );
  }
}

export default index;
