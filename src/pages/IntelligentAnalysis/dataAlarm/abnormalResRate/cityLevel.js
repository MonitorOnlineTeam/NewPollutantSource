import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { ExportOutlined,RollbackOutlined } from '@ant-design/icons';
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
// import RegionList from '@/components/RegionList'

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
  loading: loading.effects["abnormalResRate/getExceptionAlarmRateListForCity"],
  exportLoading: loading.effects["abnormalResRate/exportExceptionAlarmRateListForCity"],
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
  // onFieldsChange(props, fields) {
  //   props.dispatch({
  //     type: 'abnormalResRate/updateState',
  //     payload: {
  //       searchForm: {
  //         ...props.searchForm,
  //         ...fields,
  //       },
  //     },
  //   })
  // },
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
        width: 200,
        render: (text, record) => {
          return <a onClick={() => {
            let queryCondition = this.state.queryCondition;
            queryCondition.RegionCode = record.CityCode;
            queryCondition.RegionName = record.RegionName;
            queryCondition = JSON.stringify(queryCondition)
            this.props.onRegionClick ? this.props.onRegionClick(queryCondition) :
              router.push(`/Intelligentanalysis/dataAlarm/abnormal/details?queryCondition=${queryConditions}`);
          }}>{text==='全部合计'? text :`${text}/${record.CityName}` }</a>
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
   let { location:{ query } } = this.props
    // this.props.dispatch({
    //   type: 'autoForm/getRegions',
    //   payload: { RegionCode: query&&query.regionCode, PointMark: '2', }
    // });

    // 获取关注列表
    this.props.dispatch({
      type: 'abnormalResRate/getAttentionDegreeList',
      payload: { RegionCode: query&&query.regionCode }
    });
  
    // console.log('传过来的参数：' , query)
   this.getExceptionAlarmRateListForCity(query&&query.regionCode);
  }


  // onExport = () => {
  //   this.props.dispatch({
  //     type: "abnormalResRate/exportExceptionAlarmRateListForCity",
  //     payload: {
  //       ...this.state.secondQueryCondition,
  //     }
  //   })
  // }

  // 获取异常数据
  getExceptionAlarmRateListForCity = (regionCode) => {
    // let values = this.props.form.getFieldsValue();

    let values = this.props.searchForm;
    let beginTime, endTime;
    values.time = this.state.exceptionTime;
    if (values.time && values.time[0]) {
      beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    }
    if (values.time && values.time[1]) {
      endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    }
    this.props.dispatch({
      type: "abnormalResRate/getExceptionAlarmRateListForCity",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: regionCode ? regionCode:'',
        dataType: values.dataType,
        beginTime: values.beginTime,
        endTime: values.endTime,
        OperationPersonnel:this.state.operationpersonnel,
      }
    })
    this.setState({
      queryCondition: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: regionCode ? regionCode:'',
        dataType: values.dataType,
        beginTime: values.beginTime,
        endTime: values.endTime,
        OperationPersonnel:this.state.operationpersonnel
      }
    })
  }

   // 导出异常数据
  onExport = () => {

    // let values = this.props.searchForm;
    let { location:{query}} = this.props
    let values = this.props.searchForm;
    let beginTime, endTime;
    values.time = this.state.exceptionTime;
    // if (values.time && values.time[0]) {
    //   beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    // }
    // if (values.time && values.time[1]) {
    //   endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    // }
    this.props.dispatch({
      type: "abnormalResRate/exportExceptionAlarmRateListForCity",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantType: values.PollutantType,
        RegionCode: query.regionCode? query.regionCode:'',
        dataType: values.dataType,
        beginTime: values.beginTime,
        endTime: values.endTime,
        OperationPersonnel:this.state.operationpersonnel,
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
              {/* <FormItem label="数据类型">
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
              </FormItem> */}
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


              <div style={{ display: 'inline-block', lineHeight: "40px" }}>
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  loading={exportLoading}
                  onClick={this.onExport}
                >
                  导出
                </Button>
              <Button onClick={() => {
                 this.props.onBack ? this.props.onBack() :
                 history.go(-1);
             }} ><RollbackOutlined />返回</Button>
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
