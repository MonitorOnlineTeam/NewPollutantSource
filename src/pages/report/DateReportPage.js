import React, { PureComponent } from 'react';
import {
  Table,
  Form,
  Row,
  Col,
  Input,
  Select,
  Card,
  Button,
  DatePicker,
  message,
  Icon,
  Spin,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import style from './index.less';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlCascader from '../AutoFormManager/SdlCascader';
import SearchSelect from '../AutoFormManager/SearchSelect';
import SelectPollutantType from '@/components/SelectPollutantType';
import SdlTable from '@/components/SdlTable';
import YearPicker from '@/components/YearPicker';
import { getDirLevel } from '@/utils/utils';
import CascaderMultiple from "@/components/CascaderMultiple"
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;

@connect(({ loading, report, autoForm, global }) => ({
  loading: loading.effects['report/getDateReportData'],
  exportLoading: loading.effects['report/reportExport'],
  entLoading: loading.effects['report/getEnterpriseList'],
  entAndPointLoading: loading.effects['report/getPointReportEntAndPointList'],
  pollutantList: report.pollutantList,
  dateReportData: report.dateReportData,
  pollutantTypeList: report.pollutantTypeList,
  enterpriseList: report.enterpriseList,
  dateReportForm: report.dateReportForm,
  regionList: autoForm.regionList,
  configInfo: global.configInfo,
  entAndPontList: report.entAndPontList,
}))
@Form.create()
class DateReportPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      currentDate: moment().add(-1, 'day'),
      defaultRegionCode: [],
      beginTime: moment().add(-1, 'day').format('YYYY-MM-DD 01:00:00'),
      endTime: moment().format('YYYY-MM-DD 00:00:00')
    };
    this.SELF = {
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
      defaultSearchForm: {
        PollutantSourceType: 1,
        EntCode: '',
        ReportTime: moment().add(-1, 'day'),
        airReportTime: [moment().add(-1, 'day'), moment()]
      },
    };
    this.statisticsReport = this.statisticsReport.bind(this);
    this.export = this.export.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.reportType === "siteDaily") {
      this.props.form.setFieldsValue({ "ReportTime": moment().add(-1, "day") })
    }
    const { defaultSearchForm } = this.SELF;
    // 获取污染物 - 查询条件
    this.props.dispatch({
      type: 'report/getPollutantTypeList',
      callback: data => {
        const defalutVal = data.Datas[0].pollutantTypeCode;
        this.props.dispatch({
          type: "report/getPointReportEntAndPointList",
          payload: {
            "PollutantTypes": defalutVal,
            "RegionCode": "",
            "Name": "",
            "Status": [0, 1, 2, 3],
            "QCAUse": "",
            "RunState": "",
            "isFilter": true
          },
          callback: res => {
            let DGIMN = [];
            for (let i = 0; i < res.length; i++) {
              if (res[i].children.length) {
                DGIMN = [res[i].children[0].key];
                break;
              }
            }
            // console.log("DGIMN=",DGIMN)
            this.props.form.setFieldsValue({ "DGIMN": DGIMN })
            this.props.dispatch({
              type: 'report/updateState',
              payload: {
                dateReportForm: {
                  ...this.props.dateReportForm,
                  current:1,
                },
              },
            });
            this.statisticsReport()
          }
        })

      }
    });
  }

  statisticsReport() {
    const { form, match, dateReportForm } = this.props;
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
                type: 'report/getDateReportData',
                payload: {
                  PollutantSourceType: values.PollutantSourceType,
                  DGIMN: values.DGIMN,
                  BeginTime: this.state.beginTime,
                  EndTime: this.state.endTime,
                },
                reportType: values.reportType
              });
            },
          },
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dateReportData !== nextProps.dateReportData) {
      let AQIColumn = [];
      // 站点日报 - 扬尘和大气站显示AQI
      let pollutantSourceType = nextProps.form.getFieldValue("PollutantSourceType");
      if (pollutantSourceType == 5 || pollutantSourceType == 12) {
        AQIColumn = [{
          title: 'AQI',
          dataIndex: 'AQI',
        }, {
          title: '首要污染物',
          dataIndex: '首要污染物',
          width: 120,
        }, {
          title: '指数类别',
          dataIndex: '空气质量指数类别',
          width: 80,
        }, {
          title: '指数级别',
          dataIndex: '空气质量指数级别',
          width: 80,
        }]
      }
      const _columns = [
        {
          title: '时间',
          dataIndex: 'time',
        },
        ...AQIColumn,
        ...nextProps.pollutantList,
      ];
      let columns = _columns.map(item => {
        return {
          ...item,
          render: (text, row, index) => {
            if (text) {
              const _text = text.split('|');
              let val = _text[0];
              const status = _text[1];
              if (item.dataIndex === "风向") {
                val = getDirLevel(text)
              }
              if (val) {
                return status > -1 ? <span style={{ color: '#ef4d4d' }}>{val}</span> : val;
              }
              return '-';
            }
            return '-';
          },
        };
      });

      columns.unshift({
        title: '点名称',
        width: 150,
        dataIndex: 'pointName',
      });
      columns.unshift({
        title: '企业名称',
        width: 150,
        dataIndex: 'entName',
      });
      
      this.setState({
        columns,
      });
    }
  }

  changeReportType = (reportType) => {
    const pollutantType = this.props.form.getFieldValue("PollutantSourceType")
    let reportTime = this.props.form.getFieldValue("ReportTime");
    let beginTime, endTime;

    let time = pollutantType != 5 ? reportTime : moment();
    switch (reportType) {
      case "siteDaily":
        beginTime = moment(time).format('YYYY-MM-DD 01:00:00');
        endTime = moment(time).add(1, "day").format('YYYY-MM-DD 00:00:00');
        break;
      case "monthly":
        beginTime = moment(time).format('YYYY-MM-01 00:00:00');
        endTime = moment(moment(time).format('YYYY-MM-01 00:00:00')).add(1, 'month').add(-1, 'second').format('YYYY-MM-DD 23:59:59');
        break;
      default:
        beginTime = moment(time).format('YYYY-01-01 00:00:00');
        endTime = moment(moment(time).format('YYYY-01-01 00:00:00')).add(1, 'year').add(-1, 'second').format('YYYY-MM-DD 23:59:59');
    }
    // 大气站重置时间
    if (pollutantType == 5) {
      this.props.form.setFieldsValue({ "airReportTime": [moment(beginTime), moment(endTime)] })
    }
    this.setState({
      beginTime: beginTime,
      endTime: endTime
    }, () => { this.statisticsReport() })
  }

  // 报表导出
  export() {
    const {
      form,
      match: {
        params: { reportType },
      },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'report/reportExport',
          payload: {
            ReportTime: values.ReportTime && moment(values.ReportTime).format('YYYY-MM-DD'),
            PollutantSourceType: values.PollutantSourceType,
            DGIMN: values.DGIMN,
            BeginTime: this.state.beginTime,
            EndTime: this.state.endTime,
            Type: values.reportType
          },
        });
      }
    });
  }

  // 分页
  onTableChange = (current, pageSize) => {
    const getFieldValue = this.props.form.getFieldValue;
    this.props.dispatch({
      type: 'report/updateState',
      payload: {
        dateReportForm: {
          ...this.props.dateReportForm,
          current,
        },
      },
    });
    setTimeout(() => {
      // 获取表格数据
      this.statisticsReport()
    }, 0);
  };

  dateOnchange = (dates, beginTime, endTime) => {
    this.props.form.setFieldsValue({ "ReportTime": dates });
    this.setState({
      beginTime,
      endTime
    })
  }

  rangeOnchange = (dates) => {
    this.props.form.setFieldsValue({ "airReportTime": dates });
    this.setState({
      beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: dates[1].format('YYYY-MM-DD HH:mm:ss')
    });
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      entAndPointLoading,
      dateReportForm,
      exportLoading,
      dateReportData,
      pollutantTypeList,
      regionList,
      loading,
      dispatch,
      enterpriseList,
      entLoading,
      configInfo,
      entAndPontList,
    } = this.props;
    const { formLayout, defaultSearchForm } = this.SELF;
    const { currentEntName, currentDate, defaultRegionCode } = this.state;

    const pollutantSourceType = this.props.form.getFieldValue("PollutantSourceType");
    let dateType = "";
    let mode;
    const reportType = getFieldValue("reportType")
    switch (reportType) {
      case "monthly":
        dateType = "month";
        mode = ['month', 'month'];
        break;
      case "annals":
        dateType = "year";
        mode = ['year', 'year'];
        break;
      default:
        dateType = "daySelecthour";
        mode = [];
        break;
    }
    let timeEle = <DatePickerTool allowClear={false} picker={reportType} style={{ width: '100%' }} callback={this.dateOnchange} dataType={dateType} />;
    let airTimeEle = <RangePicker_ allowClear={false} style={{ width: '100%' }} mode={mode} callback={this.rangeOnchange} dataType={dateType} dateValue={[moment(this.state.beginTime), moment(this.state.endTime)]} />


    // 处理分页
    let pageSize = dateReportForm.pageSize;
    // if (getFieldValue("PollutantSourceType") == 5) {
    if (reportType === "siteDaily") {
      pageSize = 24
    } else if (reportType === "monthly") {
      pageSize = 31
    } else {
      pageSize = 12
    }
    // };
    return (
      <BreadcrumbWrapper>
        <Spin spinning={exportLoading || entAndPointLoading} delay={500}>
          <Card className="contentContainer">
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row>
                <Col xxl={4} md={6} xs={24}>
                  <FormItem {...formLayout} label="报表类型" style={{ width: '100%' }}>
                    {getFieldDecorator('reportType', {
                      initialValue: "siteDaily",
                      rules: [
                        {
                          required: true,
                          message: '请选择报表类型',
                        },
                      ],
                    })(
                      <Select onChange={(value) => {
                        this.props.dispatch({
                          type: 'report/updateState',
                          payload: {
                            dateReportForm: {
                              ...this.props.dateReportForm,
                              current: 1,
                            },
                          },
                        });
                        this.changeReportType(value)
                      }}>
                        <Option key="siteDaily">站点日报</Option>
                        <Option key="monthly">站点月报</Option>
                        <Option key="annals">站点年报</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xxl={4} md={4} xs={24}>
                  <FormItem {...formLayout} label="类型" style={{ width: '100%' }}>
                    {getFieldDecorator('PollutantSourceType', {
                      initialValue: pollutantTypeList.length
                        ? pollutantTypeList[0].pollutantTypeCode
                        : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择污染物类型',
                        },
                      ],
                    })(
                      <SelectPollutantType
                        placeholder="请选择污染物类型"
                        onChange={value => {
                          this.props.dispatch({
                            type: 'report/updateState',
                            payload: {
                              dateReportForm: {
                                ...this.props.dateReportForm,
                                current: 1,
                              },
                            },
                          });
                          this.props.dispatch({
                            type: "report/getPointReportEntAndPointList",
                            payload: {
                              "PollutantTypes": value,
                              "RegionCode": "",
                              "Name": "",
                              "Status": [0, 1, 2, 3],
                              "QCAUse": "",
                              "RunState": "",
                              "isFilter": true
                            },
                            callback: res => {
                              let DGIMN = [];
                              for (let i = 0; i < res.length; i++) {
                                if (res[i].children.length) {
                                  DGIMN = [res[i].children[0].key];
                                  break;
                                }
                              }
                              this.props.form.setFieldsValue({ "DGIMN": DGIMN })
                              this.changeReportType(this.props.form.getFieldValue("reportType"))
                            }
                          });
                        }}
                      />,
                    )}
                  </FormItem>
                </Col>
                {
                  getFieldValue("PollutantSourceType") &&
                  <Col xxl={7} md={8} xs={24}>
                    <FormItem
                      {...formLayout}
                      label="监控目标"
                      style={{ width: '100%' }}
                    >
                      {getFieldDecorator('DGIMN', {
                        initialValue: this.props.form.getFieldValue("DGIMN"),
                        rules: [
                          {
                            required: true,
                            message: '请选择监控目标',
                          },
                        ],
                      })(
                        <CascaderMultiple pollutantTypes={getFieldValue("PollutantSourceType")}  {...this.props} />
                      )}
                    </FormItem>
                  </Col>
                }
                <Col xxl={5} md={6} xs={24} style={{ display: getFieldValue("PollutantSourceType") == 5 ? "block" : "none" }}>
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
                <Col xxl={5} md={6} xs={24} style={{ display: getFieldValue("PollutantSourceType") == 5 ? "none" : "block" }}>
                  <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                    {getFieldDecorator("ReportTime", {
                      initialValue: defaultSearchForm.ReportTime,
                      rules: [{
                        required: true,
                        message: '请填写统计时间',
                      }],
                    })(
                      timeEle
                    )}
                  </FormItem>
                </Col>
                <Col xxl={4} md={10} xs={24}>
                  <FormItem label="" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      style={{ margin: '0 10px' }}
                      loading={loading}
                      onClick={() => {
                        const { dateReportForm, dispatch } = this.props;
                        const { beginTime, endTime } = this.state;
                        dispatch({
                          type: 'report/updateState',
                          payload: {
                            dateReportForm: {
                              ...dateReportForm,
                              beginTime,
                              endTime,
                              current: 1,
                            },
                          },
                        });
                        setTimeout(() => {
                          this.statisticsReport();
                        }, 0);
                      }}
                    >
                      生成统计
                    </Button>
                    <Button onClick={this.export} loading={exportLoading}>
                      <Icon type="export" />
                      导出
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <SdlTable
              rowKey={(record, index) => index}
              loading={loading}
              // style={{ minHeight: 80 }}
              size="small"
              columns={this.state.columns}
              dataSource={dateReportData}
              defaultWidth={80}
              // scroll={{ y: 'calc(100vh - 65px - 100px - 320px)' }}
              rowClassName={(record, index, indent) => {
                if (index === 0 || record.time === '0时') {
                  return;
                } else if (index % 2 !== 0 || record.time === '0时') {
                  return style['light'];
                }
              }}
              bordered
              pagination={{
                // showSizeChanger: true,
                showQuickJumper: true,
                pageSize: pageSize,
                current: dateReportForm.current,
                onChange: this.onTableChange,
                total: dateReportForm.total,
              }}
            />
          </Card>
        </Spin>
      </BreadcrumbWrapper>
    );
  }
}

export default DateReportPage;
