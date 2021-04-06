import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Col, Row, Select, Input, Checkbox, DatePicker, Button, message } from 'antd';
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import { router } from 'umi'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, autoForm, abnormalData }) => ({
  regionList: autoForm.regionList,
  attentionList: abnormalData.attentionList,
  divisorList: abnormalData.divisorList,
  exceptionDataSource: abnormalData.exceptionDataSource,
  abnormalDataForm: abnormalData.abnormalDataForm,
  abnormalDataTime: abnormalData.abnormalDataTime,
  loading: loading.effects["abnormalData/getExceptionList"],
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      dataType: Form.createFormField(props.abnormalDataForm.dataType),
      // time: Form.createFormField(props.abnormalDataForm.time),
      RegionCode: Form.createFormField(props.abnormalDataForm.RegionCode),
      AttentionCode: Form.createFormField(props.abnormalDataForm.AttentionCode),
      PollutantList: Form.createFormField(props.abnormalDataForm.PollutantList),
      PollutantType: Form.createFormField(props.abnormalDataForm.PollutantType),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'abnormalData/updateState',
      payload: {
        abnormalDataForm: {
          ...props.abnormalDataForm,
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
    operationpersonnel:'',
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
      },
      {
        title: '数据异常企业数',
        dataIndex: 'CountEnt',
        key: 'CountEnt',
      },
      {
        title: '数据异常监测点数',
        dataIndex: 'CountPoint',
        key: 'CountPoint',
      },
      {
        title: '数据类型',
        dataIndex: 'DataType',
        key: 'DataType',
      },
      {
        title: '零值个数',
        dataIndex: 'ExceptionTypeLingZhi',
        key: 'ExceptionTypeLingZhi',
        render: (text, record) => {
          return <a onClick={() => {
            let queryCondition = this.state.queryCondition;
            queryCondition.RegionCode = record.RegionCode;
            queryCondition.ExceptionType = 1;
            queryCondition.RegionName = record.RegionName;
            queryCondition = JSON.stringify(queryCondition)
            router.push(`/dataSearch/abnormalData/details?queryCondition=${queryCondition}`)
          }}>{text}</a>
        }
      },
      {
        title: '超量程个数',
        dataIndex: 'ExceptionTypeChao',
        key: 'ExceptionTypeChao',
        render: (text, record) => {
          return <a onClick={() => {
            let queryCondition = this.state.queryCondition;
            queryCondition.RegionCode = record.RegionCode;
            queryCondition.ExceptionType = 2;
            queryCondition.RegionName = record.RegionName;
            queryCondition = JSON.stringify(queryCondition)
            router.push(`/dataSearch/abnormalData/details?queryCondition=${queryCondition}`)
          }}>{text}</a>
        }
      },
    ]
  }

  componentDidMount() {
    // 获取行政区列表
    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: { RegionCode: '', PointMark: '2', }
    });

    // 获取关注列表
    this.props.dispatch({
      type: 'abnormalData/getAttentionDegreeList',
      payload: { RegionCode: '' }
    });

    // 根据企业类型查询监测因子
    this.getPollutantByType(false, this.getExceptionList);
  }

  // 根据企业类型查询监测因子
  getPollutantByType = (reload, cb) => {
    this.props.dispatch({
      type: "abnormalData/getPollutantByType",
      payload: {
        type: this.props.form.getFieldValue("PollutantType")
      },
      callback: (res) => {
        this.setState({ checkedValues: res.map(item => item.PollutantCode) }, () => {
          reload && this.props.form.setFieldsValue({ PollutantList: this.state.checkedValues })
          cb && cb()
        })
      }
    })
  }

  // 获取异常数据
  getExceptionList = () => {
    let values = this.props.form.getFieldsValue();
    console.log("values=", values)
    let beginTime, endTime;
    values.time = this.props.abnormalDataTime;
    if (values.time && values.time[0]) {
      beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    }
    if (values.time && values.time[1]) {
      endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    }
    this.props.dispatch({
      type: "abnormalData/getExceptionList",
      payload: {
        AttentionCode: values.AttentionCode,
        PollutantList: values.PollutantList,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode? values.RegionCode : '',
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
        OperationPersonnel:this.state.operationpersonnel
      }
    })
    this.setState({
      queryCondition: {
        AttentionCode: values.AttentionCode,
        PollutantList: values.PollutantList,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode? values.RegionCode : '',
        dataType: values.dataType,
        beginTime: beginTime,
        endTime: endTime,
        OperationPersonnel:this.state.operationpersonnel
      }
    })
  }

  // 导出异常数据
  exportExceptionList = () => {
    let values = this.props.form.getFieldsValue();
    console.log("values=", values)
    let beginTime, endTime;
    values.time = this.props.abnormalDataTime;
    if (values.time && values.time[0]) {
      beginTime = values.dataType === "HourData" ? moment(values.time[0]).format("YYYY-MM-DD HH:00:00") : moment(values.time[0]).format("YYYY-MM-DD")
    }
    if (values.time && values.time[1]) {
      endTime = values.dataType === "HourData" ? moment(values.time[1]).format("YYYY-MM-DD HH:59:59") : moment(values.time[1]).format("YYYY-MM-DD")
    }
    this.props.dispatch({
      type: "abnormalData/exportExceptionList",
      payload: {
        AttentionCode: values.AttentionCode,
        // PollutantList: this.state.checkedValues,
        PollutantList: values.PollutantList,
        PollutantType: values.PollutantType,
        RegionCode: values.RegionCode? values.RegionCode : '',
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

  // 监测因子change
  onCheckboxChange = (checkedValues) => {
    if (checkedValues.length < 1) {
      message.warning("最少勾选一个监测因子！")
      return;
    }
    // this.setState({
    //   checkedValues: checkedValues
    // })
    this.props.dispatch({
      type: 'abnormalData/updateState',
      payload: {
        abnormalDataForm: {
          ...this.props.abnormalDataForm,
          PollutantList: checkedValues
        }
      }
    })
  }

  dateChange = (date, dataType) => {
    this.props.dispatch({
      type: 'abnormalData/updateState',
      payload: {
        abnormalDataTime: date,
      },
    })
  }


  render() {
    const { form: { getFieldDecorator }, regionList, abnormalDataTime, attentionList, divisorList, exceptionDataSource, loading } = this.props;
    const { formLayout, columns } = this._SELF_;
    const { format, showTime, checkedValues } = this.state;
    console.log("attentionList=", attentionList)
    let _regionList = regionList.length ? regionList[0].children : [];
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="" className='searchForm'  style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col md={4}>
                <FormItem {...formLayout} label="数据类型" style={{ width: '100%' }}>
                  {getFieldDecorator('dataType', {
                    initialValue: 'HourData',
                  })(
                    <Select
                      placeholder="请选择数据类型"
                      allowClear
                      onChange={this.onDataTypeChange}
                    >
                      <Option key='0' value='HourData'>小时</Option>
                      <Option key='1' value='DayData'> 日均</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={7}>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="日期查询" style={{ width: '100%' }}>
                  {/* {getFieldDecorator('time', {
                    initialValue: [moment().subtract(1, "days"), moment()],
                  })(
                    <RangePicker allowClear={false} showTime={showTime} format={format} style={{ width: '100%' }} />
                  )} */}
                  <RangePicker_ allowClear={false} onRef={(ref) => {
                    this.rangePicker = ref;
                  }} dataType={this.props.form.getFieldValue("dataType")} style={{ width: "100%", marginRight: '10px' }} dateValue={abnormalDataTime}
                    callback={(dates, dataType) => this.dateChange(dates, dataType)} />
                </FormItem>
              </Col>
              <Col md={4}>
                <FormItem {...formLayout} label="行政区" style={{ width: '100%' }}>
                  {getFieldDecorator('RegionCode', {
                    initialValue: undefined,
                  })(
                   /*  <Select allowClear placeholder="请选择行政区">
                      {
                        _regionList.map(item => {
                          return <Option key={item.key} value={item.value}>
                            {item.title}
                          </Option>
                        })
                      }
                    </Select> */
                <RegionList changeRegion={''} RegionCode={''}/>
                  )}
                </FormItem>
              </Col>
              <Col md={5}>
                <FormItem {...formLayout} label="关注程度" style={{ width: '100%' }}>
                  {getFieldDecorator('AttentionCode', {
                    initialValue: undefined,
                  })(
                    <Select allowClear placeholder="请选择关注程度">
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
              <Col md={4}>
                <FormItem {...formLayout} label="企业类型" style={{ width: '100%' }}>
                  {getFieldDecorator('PollutantType', {
                    initialValue: '1',
                  })(
                    <Select placeholder="请选择企业类型" onChange={(value) => {
                      this.setState({ pollutantType: value }, () => {
                        this.getPollutantByType(true)
                      })
                    }}>
                      <Option value="1">废水</Option>
                      <Option value="2">废气</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>

              <Col md={24} style={{ display: "flex", alignItems: "center" }}>
                {/* <div class="ant-form-item-label" style={{ width: '5.3%' }}>
                  <label for="RegionCode" class="" title="监测因子">监测因子</label>
                </div> */}
                <Form.Item {...formLayout} label="运维状态" style={{ width: '16%',marginRight:10 }}>
                  {
                    <Select
                      allowClear
                      // style={{ width: 200, marginLeft: 30, marginRight: 10 }}
                      placeholder="运维状态"
                      maxTagCount={2}
                      maxTagTextLength={5}
                      maxTagPlaceholder="..."
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
                {getFieldDecorator('PollutantList', {
                  initialValue: checkedValues,
                })(
                  <Checkbox.Group style={{ maxWidth: "calc(100% - 5.3% - 168px)" }} onChange={this.onCheckboxChange}>
                    {
                      divisorList.map(item => {
                        return <Checkbox key={item.PollutantCode} value={item.PollutantCode}>{item.PollutantName}</Checkbox>
                      })
                    }
                  </Checkbox.Group>
                )}
                <Button loading={loading} type="primary" style={{ marginLeft: 10 }} onClick={this.getExceptionList}>
                  查询
                      </Button>
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  onClick={this.exportExceptionList}
                >
                  导出
                      </Button>
              </Col>
            </Row>
          </Form>
          <SdlTable align="center" dataSource={exceptionDataSource} columns={columns} loading={loading} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;
