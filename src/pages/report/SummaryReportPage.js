import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Icon, Form, Select, Row, Col, DatePicker, Button, Spin } from 'antd'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import moment from 'moment'
import style from './index.less'
import SdlCascader from '../AutoFormManager/SdlCascader'
import SdlTable from '@/components/SdlTable'
import SelectPollutantType from '@/components/SelectPollutantType'
import YearPicker from '@/components/YearPicker'
import { getDirLevel } from '@/utils/utils';
import CascaderMultiple from '@/components/CascaderMultiple'
import DatePickerTool from '@/components/RangePicker/DatePickerTool';

import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker

@Form.create()
@connect(({ loading, report, autoForm, global }) => ({
  loading: loading.effects['report/getDailySummaryDataList'],
  exportLoading: loading.effects['report/summaryReportExcel'],
  entAndPointLoading: loading.effects['common/getEnterpriseAndPoint'],
  dailySummaryDataList: report.dailySummaryDataList,
  pollutantList: report.pollutantList,
  pollutantTypeList: report.pollutantTypeList,
  enterpriseList: report.enterpriseList,
  regionList: autoForm.regionList,
  configInfo: global.configInfo,
  entAndPontList: report.entAndPontList,
  summaryForm: report.summaryForm,
  Total: report.Total,
}))
class SummaryReportPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      currentYear: moment().format('YYYY'),
      defaultRegionCode: [],
      currentDate: moment(),
      beginTime: moment().add(-1, 'day').format('YYYY-MM-DD 00:00:00'),
      endTime: moment().add(-1, 'day').format('YYYY-MM-DD 23:59:59'),
      pageIndex: 1,
      pageSize: 20,
    };
    this.SELF = {
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
      defaultSearchForm: {
        PollutantSourceType: 1,
        // Regions: ["110000000", "110100000", "110101000"],
        EntCode: '',
        ReportTime: moment().add(-1, 'day'),
        airReportTime: [moment(this.state.beginTime), moment(this.state.endTime)],
      },
    }

    this.export = this.export.bind(this);
    this.statisticsReport = this.statisticsReport.bind(this);
  }

  componentDidMount() {
    const { defaultSearchForm } = this.SELF;
    // 获取污染物 - 查询条件
    this.props.dispatch({
      type: 'report/getPollutantTypeList',
      callback: data => {
        const defalutVal = data.Datas[0].pollutantTypeCode;
        this.props.form.setFieldsValue({ PollutantSourceType: defalutVal })
        this.props.dispatch({
          type: 'common/getEnterpriseAndPoint',
          payload: {
            RegionCode: '',
            PointMark: '2',
          },
          callback: (sucRes, defaultValue) => {
            // let RegionCode = defaultValue;
            // this.setState({
            //   defaultRegionCode: RegionCode
            // })

            // 获取监控目标
            this.props.dispatch({
              type: 'report/getPointReportEntAndPointList',
              payload: {
                PollutantTypes: defalutVal,
                RegionCode: '',
                Name: '',
                Status: [0, 1, 2, 3],
                QCAUse: '',
                RunState: '',
                isFilter: true,
              },
              callback: res => {
                let DGIMN = [];
                // res.forEach(item => {
                //   if(item.children.length) {
                //     DGIMN = [item.children[0].key];
                //     throw new Error("error")
                //   }
                // })
                for (let i = 0; i < res.length; i++) {
                  if (res[i].children.length) {
                    DGIMN = [res[i].children[0].key];
                    break;
                  }
                }
                this.props.form.setFieldsValue({ DGIMN })
                this.statisticsReport()
              },
            })
          },
        })
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dailySummaryDataList !== nextProps.dailySummaryDataList) {
      let AQIColumn = [];
      const pollutantSourceType = nextProps.form.getFieldValue('PollutantSourceType');
      // 汇总报表 - 扬尘和大气站显示AQI
      if (pollutantSourceType == 5 || pollutantSourceType == 12) {
        AQIColumn = [{
          title: 'AQI',
          dataIndex: 'AQI',
          align: 'center',
        }, {
          title: '首要污染物',
          dataIndex: '首要污染物',
          align: 'center',
          width: 120,
        }, {
          title: '指数类别',
          dataIndex: '空气质量指数类别',
          align: 'center',
          width: 80,
        }, {
          title: '指数级别',
          dataIndex: '空气质量指数级别',
          align: 'center',
          width: 80,
        }]
      }

      const _columns = [
        {
          title: '排口名称',
          dataIndex: 'PointName',
          width: 160,
        },
        {
          title: '时间',
          dataIndex: 'time',
          align: 'center',
        },
        ...AQIColumn,
        ...nextProps.pollutantList,
      ]
      const columns = _columns.map(item => ({
          ...item,
          render: (text, row, index) => {
            if (text) {
              const _text = text.split('|');
              let val = _text[0];
              const status = _text[1];
              // return status > 0 ? <span style={{ color: "#ee9844" }}>{val}</span> : (status > -1 ? <span style={{ color: "#ef4d4d" }}>{val}</span> : val)
              if (item.dataIndex === '风向') {
                val = getDirLevel(text)
              }
              if (val) {
                return status > -1 ? <span style={{ color: '#ef4d4d' }}>{val}</span> : val
              }
              return '-';
            }
            return '-'
          },
        }))
      columns.unshift({
        title: '企业名称',
        dataIndex: 'EntName',
      })
      this.setState({
        columns,
      })
    }
  }

  statisticsReport() {
    const { form, match } = this.props;
    // const { uid, configId, isEdit, keysParams } = this._SELF_;
    form.validateFields((err, values) => {
      if (!err) {
        // 获取污染物类型 = 表头
        this.props.dispatch({
          type: 'report/getPollutantList',
          payload: {
            pollutantTypes: values.PollutantSourceType,
            callback: () => {
              // 获取表格数据
              this.props.dispatch({
                type: 'report/getDailySummaryDataList',
                payload: {
                  DGIMN: values.PollutantSourceType == '5' ? values.DGIMN : null,
                  type: match.params.reportType,
                  PollutantSourceType: values.PollutantSourceType,
                  Regions: values.Regions.toString(),
                  ReportTime: values.ReportTime && moment(values.ReportTime).format('YYYY-MM-DD'),
                  BeginTime: this.state.beginTime,
                  EndTime: this.state.endTime,
                  pageIndex: this.state.pageIndex,
                  pageSize: this.state.pageSize,
                  //  ..._payload
                },
                reportType: values.reportType,
              })
            },
          },
        })
      }
    })
  }

  changeReportType = (reportType, type) => {
    const pollutantType = type || this.props.form.getFieldValue('PollutantSourceType')
    const reportTime = this.props.form.getFieldValue('ReportTime');
    let beginTime; let
endTime;

    const time = pollutantType != 5 ? reportTime : moment();
    switch (reportType) {
      case 'daily':
        beginTime = moment(time).format('YYYY-MM-DD 00:00:00');
        endTime = moment(time).format('YYYY-MM-DD 23:59:59');
        break;
      case 'monthly':
        beginTime = moment(time).format('YYYY-MM-01 00:00:00');
        endTime = moment(moment(time).format('YYYY-MM-01 00:00:00')).add(1, 'month').add(-1, 'second').format('YYYY-MM-DD 23:59:59');
        break;
      default:
        beginTime = moment(time).format('YYYY-01-01 00:00:00');
        endTime = moment(moment(time).format('YYYY-01-01 00:00:00')).add(1, 'year').add(-1, 'second').format('YYYY-MM-DD 23:59:59');
    }
    // 大气站重置时间
    if (pollutantType == 5) {
      this.props.form.setFieldsValue({ airReportTime: [moment(beginTime), moment(endTime)] })
    }
    this.setState({
      beginTime,
      endTime,
    }, () => { this.statisticsReport() })
  }

  export() {
    const { form, match: { params: { reportType } } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'report/summaryReportExcel',
          payload: {
            DGIMN: values.PollutantSourceType == '5' ? values.DGIMN : null,
            PollutantSourceType: values.PollutantSourceType,
            Regions: '', // values.Regions.toString(),
            ReportTime: values.ReportTime && moment(values.ReportTime).format('YYYY-MM-DD'),
            BeginTime: this.state.beginTime,
            EndTime: this.state.endTime,
            Type: values.reportType,
          },
        })
      }
    })
  }

  dateOnchange = (dates, beginTime, endTime) => {
    this.props.form.setFieldsValue({ ReportTime: dates });
    this.setState({
      beginTime,
      endTime,
    })
  }

  rangeOnchange = dates => {
    this.props.form.setFieldsValue({ airReportTime: dates });
    this.setState({
      beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  // 分页
  onTableChange = (pageIndex, pageSize) => {
    this.setState({
      pageIndex,
      pageSize,
    })
    // 获取表格数据
    this.statisticsReport()
  };

  render() {
    const { loading, dailySummaryDataList, exportLoading, regionList, summaryForm, entAndPointLoading, form: { getFieldDecorator, getFieldValue }, pollutantTypeList, enterpriseList, configInfo, entAndPontList, Total } = this.props;
    const { formLayout, defaultSearchForm, currentDate } = this.SELF;
    const { pageSize, pageIndex } = this.state
    const reportType = getFieldValue('reportType')
    const reportText = reportType === 'daily' ? '汇总日报' : (reportType === 'monthly' ? '汇总月报' : '汇总年报');
    const format = reportType === 'daily' ? 'YYYY-MM-DD' : (reportType === 'monthly' ? 'YYYY-MM' : 'YYYY');
    const pollutantSourceType = this.props.form.getFieldValue('PollutantSourceType');
    let picker = '';
    let dateType = '';
    let mode;
    debugger
    const IfShowRegionInReport = configInfo.IfShowRegionInReport ? configInfo.IfShowRegionInReport === '1' ? '' : 'none' : 'none';
    console.log(IfShowRegionInReport)
    switch (reportType) {
      case 'monthly':
        picker = 'month';
        dateType = 'month';
        mode = ['month', 'month'];
        break;
      case 'annals':
        picker = 'year';
        dateType = 'year';
        mode = ['year', 'year'];
        break;
      default:
        picker = 'day';
        dateType = 'day';
        mode = [];
        break;
    }
    const airTimeEle = <RangePicker_ allowClear={false} style={{ width: '100%' }} mode={mode} callback={this.rangeOnchange} dataType={dateType} dateValue={[moment(this.state.beginTime), moment(this.state.endTime)]} />
    const timeEle = <DatePickerTool allowClear={false} picker={picker} style={{ width: '100%' }} callback={this.dateOnchange} />

    return (
      <BreadcrumbWrapper>
        <Spin spinning={exportLoading || entAndPointLoading} delay={500}>
          <Card className="contentContainer">
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row>
                <Col md={5} xs={24}>
                  <FormItem {...formLayout} label="报表类型" style={{ width: '100%' }}>
                    {getFieldDecorator('reportType', {
                      initialValue: 'daily',
                    })(
                      <Select onChange={value => {
                        this.changeReportType(value)
                      }}>
                        <Option key="daily">汇总日报</Option>
                        <Option key="monthly">汇总月报</Option>
                        <Option key="annals">汇总年报</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={3}>
                  <FormItem {...formLayout} label="类型" style={{ width: '100%' }}>
                    {getFieldDecorator('PollutantSourceType', {
                      // initialValue: defaultSearchForm.PollutantSourceType,
                      initialValue: pollutantTypeList.length ? pollutantTypeList[0].pollutantTypeCode : undefined,
                      rules: [{
                        required: true,
                        message: '请选择污染物类型',
                      }],
                    })(
                      <SelectPollutantType placeholder="请选择污染物类型" onChange={value => {
                        //   this.getAirDefaultTime()
                        this.props.dispatch({
                          type: 'report/getPointReportEntAndPointList',
                          payload: {
                            PollutantTypes: value,
                            RegionCode: '',
                            Name: '',
                            Status: [0, 1, 2, 3],
                            QCAUse: '',
                            RunState: '',
                            isFilter: true,
                          },
                          callback: res => {
                            let DGIMN = [];
                            for (let i = 0; i < res.length; i++) {
                              if (res[i].children.length) {
                                DGIMN = [res[i].children[0].key];
                                break;
                              }
                            }
                            this.props.form.setFieldsValue({ DGIMN })
                            this.changeReportType(this.props.form.getFieldValue('reportType'), value)
                          },
                        });
                      }} />,
                    )}
                  </FormItem>
                </Col>
                {/* <Col xl={6} sm={24} md={12} style={{ display: configInfo.GroupRegionState === "1" ? "block" : "none" }}> */}
                <Col md={5} sm={24} style={{ display: IfShowRegionInReport }}>
                  <FormItem {...formLayout} label="行政区" style={{ width: '100%' }}>
                    {getFieldDecorator('Regions', {
                      // initialValue: defaultSearchForm.Regions,
                      initialValue: this.state.defaultRegionCode,
                      // rules: [{
                      //   required: true,
                      //   message: '请选择行政区',
                      // }],
                    })(
                      <SdlCascader
                        changeOnSelect={false}
                        data={regionList}
                        placeholder="请选择行政区"
                      />,
                    )}
                  </FormItem>
                </Col>
                {
                  getFieldValue('PollutantSourceType') == 5 &&
                  // 大气站显示监控目标
                  <Col sm={24} md={5}>
                    <FormItem {...formLayout} label="监控目标" style={{ width: '100%' }}>
                      {getFieldDecorator('DGIMN', {
                        initialValue: this.props.form.getFieldValue('DGIMN'),
                        rules: [
                          {
                            required: true,
                            message: '请选择监控目标',
                          },
                        ],
                      })(
                        <CascaderMultiple pollutantTypes={this.props.form.getFieldValue('PollutantSourceType')} {...this.props} />,
                      )}
                    </FormItem>
                  </Col>
                }
                <Col sm={24} md={5} style={{ display: getFieldValue('PollutantSourceType') == 5 ? 'block' : 'none' }}>
                  <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                    {getFieldDecorator('airReportTime', {
                      initialValue: defaultSearchForm.airReportTime,
                      rules: [
                        {
                          required: true,
                          message: '请填写统计时间',
                        },
                      ],
                    })(airTimeEle)}
                  </FormItem>
                </Col>
                <Col sm={24} md={5} style={{ display: getFieldValue('PollutantSourceType') == 5 ? 'none' : 'block' }}>
                  <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                    {getFieldDecorator('ReportTime', {
                      initialValue: defaultSearchForm.ReportTime,
                      rules: [{
                        required: true,
                        message: '请填写统计时间',
                      }],
                    })(
                      timeEle,
                    )}
                  </FormItem>
                </Col>
                <Col md={5} sm={24}>
                  <FormItem label="" style={{ width: '100%', marginLeft: 5 }}>
                    {/* {getFieldDecorator("", {})( */}
                    <Button type="primary" style={{ marginRight: 10 }} onClick={this.statisticsReport}>生成统计</Button>
                    <Button onClick={this.export} loading={exportLoading}><Icon type="export" />导出</Button>
                    {/* )} */}
                  </FormItem>
                </Col>
              </Row>
            </Form>
            {/* <p className={style.title}>{moment(this.state.currentDate).format(format)} {reportText}</p> */}
            <SdlTable
              loading={loading}
              style={{ minHeight: 80 }}
              size="small"
              columns={this.state.columns}
              dataSource={dailySummaryDataList}
              defaultWidth={80}
              rowClassName={
                (record, index, indent) => {
                  if (index === 0 || record.time === '0时') {

                  } else if (index % 2 !== 0 || record.time === '0时') {
                    return style.light;
                  }
                }
              }
              pagination={{
                // showSizeChanger: true,
                showQuickJumper: true,
                pageSize,
                current: pageIndex,
                onChange: this.onTableChange,
                total: Total,
              }}
            // bordered
            // pagination={true}
            />
          </Card>
        </Spin>
      </BreadcrumbWrapper>
    );
  }
}

export default SummaryReportPage;
