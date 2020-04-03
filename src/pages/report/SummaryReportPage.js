import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Icon, Form, Select, Row, Col, DatePicker, Button, Spin } from 'antd'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import moment from 'moment'
import style from './index.less'
import SdlCascader from '../AutoFormManager/SdlCascader'
import SdlTable from '@/components/SdlTable'
import SelectPollutantType from '@/components/SelectPollutantType'
import YearPicker from '@/components/YearPicker'
import { getDirLevel } from '@/utils/utils';
import CascaderMultiple from '@/components/CascaderMultiple'
import  DatePickerTool from '@/components/RangePicker/DatePickerTool';

import  RangePicker_ from '@/components/RangePicker/NewRangePicker';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker

@Form.create()
@connect(({ loading, report, autoForm, global }) => ({
  loading: loading.effects["report/getDailySummaryDataList"],
  exportLoading: loading.effects["report/summaryReportExcel"],
  entAndPointLoading: loading.effects["common/getEnterpriseAndPoint"],
  dailySummaryDataList: report.dailySummaryDataList,
  pollutantList: report.pollutantList,
  pollutantTypeList: report.pollutantTypeList,
  enterpriseList: report.enterpriseList,
  regionList: autoForm.regionList,
  configInfo: global.configInfo,
  entAndPontList: report.entAndPontList,
  summaryForm:report.summaryForm
}))
class DailySummaryPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      currentYear: moment().format("YYYY"),
      defaultRegionCode: [],
      currentDate: moment(),
      beginTime:null,
      endTime:null,
    };
    this.SELF = {
      formLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      defaultSearchForm: {
        PollutantSourceType: 1,
        // Regions: ["110000000", "110100000", "110101000"],
        EntCode: "",
        ReportTime: moment().add(-1,'day')
      },
    }

    this.export = this.export.bind(this);
    this.statisticsReport = this.statisticsReport.bind(this);
  }


  pageBegin=(requestdata,nextProps)=>{
    let beginTime;
    let endTime;
    let reportType=this.props.match.params.reportType;
    if(requestdata)
    reportType=nextProps.match.params.reportType;
    switch(reportType)
    {
        case "daily":
            beginTime=moment().add(-1,'day').format('YYYY-MM-DD 00:00:00');
            endTime=moment().add(-1,'day').format('YYYY-MM-DD 23:59:59');
          break;
        case "monthly":
            beginTime=moment().format('YYYY-MM-01 00:00:00');
            endTime=moment(moment().format('YYYY-MM-01 00:00:00')).add(1,'month').add(-1,'second').format('YYYY-MM-DD 23:59:59');
            break;
          default:
            beginTime=moment().format('YYYY-01-01 00:00:00');
            endTime=moment(moment().format('YYYY-01-01 00:00:00')).add(1,'year').add(-1,'second').format('YYYY-MM-DD 23:59:59');
    }
    const {dispatch}=this.props;
    
    dispatch({
      type:'report/updateState',
      payload:{
        summaryForm:{
          beginTime:beginTime,
          endTime:endTime
        }
      }
    })
    if(requestdata)
    {
      const {form,form:{setFieldsValue}}=this.props;
      if(form.getFieldValue("PollutantSourceType")=="5")
      this.props.form.setFieldsValue({"airReportTime": [moment(beginTime),moment(endTime)]});
      setTimeout(() => {
        // 获取表格数据
      dispatch({
          type: "report/getDailySummaryDataList",
          payload: {
            "DGIMN": form.getFieldValue("PollutantSourceType")=="5"?form.getFieldValue("DGIMN"):null,
            "type": reportType,
            "PollutantSourceType": form.getFieldValue("PollutantSourceType"),
            "Regions": form.getFieldValue("Regions").toString(),
            "ReportTime": form.getFieldValue("ReportTime") && moment(form.getFieldValue("ReportTime")).format("YYYY-MM-DD"),
          }
        })
      }, 0)
    }
   }

  // getAirDefaultTime = (props, callback) => {
  //   const { match: { params: { reportType } } } = props || this.props;
  //   const airReportTime = reportType === 'daily'
  //     ? [moment().add(-1, "day"), moment()]
  //     : reportType === 'monthly'
  //       ? [moment(), moment().add(1, "month")]
  //       : [moment(), moment().add(1, "year")]
  //   this.setState({
  //     airReportTime
  //   })
  //   this.props.form.setFieldsValue({ "airReportTime": airReportTime })
  //   callback && callback(airReportTime)
  //   // return airReportTime;
  // }

  componentDidMount() {
    // // 获取汇总日报数据
    // this.props.dispatch({
    //   type: "report/getDailySummaryDataList",
    //   payload: {
    //     type: "daily",
    //     "PollutantSourceType": "2",
    //     "Regions": "130000000,130200000,130201000",
    //     "ReportTime": "2019-06-29"
    //   }
    // })
    //this.getAirDefaultTime();
    // if (this.props.match.params.reportType === "daily") {
    //   this.props.form.setFieldsValue({ "ReportTime": moment().add(-1, "day") })
    // }
    const { defaultSearchForm } = this.SELF;

    this.pageBegin();

    // 获取污染物 - 查询条件
    this.props.dispatch({
      type: "report/getPollutantTypeList",
      callback: (data) => {
        const defalutVal = data.Datas[0].pollutantTypeCode;
        this.props.dispatch({
          type: 'common/getEnterpriseAndPoint',
          payload: {
            RegionCode: "",
            PointMark: "2"
          },
          callback: (sucRes, defaultValue) => {
            let RegionCode = defaultValue;
            this.setState({
              defaultRegionCode: RegionCode
            })

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
                // 获取污染物类型 = 表头
                this.props.dispatch({
                  type: "report/getPollutantList",
                  payload: {
                    pollutantTypes: defalutVal,
                    callback: () => {
                      // 获取表格数据
                      this.props.dispatch({
                        type: "report/getDailySummaryDataList",
                        payload: {
                          "type": this.props.match.params.reportType,
                          "PollutantSourceType": defalutVal,
                          "Regions": RegionCode.toString(),
                          DGIMN: defalutVal == 5 ? DGIMN : undefined,
                          // "Regions": "130000000,130200000,130201000",
                          "ReportTime": moment().format("YYYY-MM-DD")
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      // const { form, match: { params: { reportType } } } = nextProps;
      // const format = reportType === "daily" ? "YYYY-MM-DD" : (reportType === "monthly" ? "YYYY-MM" : "YYYY");
      // let _payload = {};
      // if (form.getFieldValue("PollutantSourceType") == 5) {
      //   let payloadFormat = "YYYY-MM-DD"
      //   this.getAirDefaultTime(nextProps, (airReportTime) => {
      //     if (reportType === "monthly") {
      //       payloadFormat = "YYYY-MM-01 00:00:00"
      //     }
      //     if (reportType === "annals") {
      //       payloadFormat = "YYYY-01-01 00:00:00"
      //     }
      //     _payload = {
      //       DGIMN: form.getFieldValue("DGIMN"),
      //       ReportTime: moment().format("YYYY-MM-DD"),
      //       BeginTime: moment(airReportTime[0]).format(payloadFormat),
      //       EndTime: moment(airReportTime[1]).format(payloadFormat)
      //     }
      //   })
    
      // }

      // // 获取表格数据
      // this.props.dispatch({
      //   type: "report/getDailySummaryDataList",
      //   payload: {
      //     "type": nextProps.match.params.reportType,
      //     "PollutantSourceType": form.getFieldValue("PollutantSourceType"),
      //     "Regions": form.getFieldValue("Regions").toString(),
      //     "ReportTime": form.getFieldValue("ReportTime") && moment(form.getFieldValue("ReportTime")).format("YYYY-MM-DD"),
      //     ..._payload
      //   }
      // })

      this.pageBegin(true,nextProps);
    }


    if (this.props.dailySummaryDataList !== nextProps.dailySummaryDataList) {
      let AQIColumn = [];
      let pollutantSourceType = nextProps.form.getFieldValue("PollutantSourceType");
      // 汇总报表 - 扬尘和大气站显示AQI
      if (pollutantSourceType == 5 || pollutantSourceType == 12) {
        AQIColumn = [{
          title: 'AQI',
          dataIndex: 'AQI',
        }, {
          title: '空气质量指数类别',
          dataIndex: '空气质量指数类别',
        },
        {
          title: '空气质量指数级别',
          dataIndex: '空气质量指数级别',
        }]
      }

      const _columns = [
        {
          title: "排口名称",
          dataIndex: 'PointName',
        },
        {
          title: '时间',
          dataIndex: 'time',
        },
        ...AQIColumn,
        ...nextProps.pollutantList
      ]
      let columns = _columns.map(item => {
        return {
          ...item,
          render: (text, row, index) => {
            if (text) {
              const _text = text.split("|");
              let val = _text[0];
              const status = _text[1];
              // return status > 0 ? <span style={{ color: "#ee9844" }}>{val}</span> : (status > -1 ? <span style={{ color: "#ef4d4d" }}>{val}</span> : val)
              if (item.dataIndex === "风向") {
                val = getDirLevel(text)
              }
              return status > -1 ? <span style={{ color: "#ef4d4d" }}>{val}</span> : val
            }
            return "-"
          }
        }
      })
      columns.unshift({
        title: '企业名称',
        dataIndex: 'EntName',
      })
      this.setState({
        columns
      })
    }
  }

  statisticsReport() {
    const { form, match } = this.props;
    // const { uid, configId, isEdit, keysParams } = this._SELF_;
    form.validateFields((err, values) => {
      if (!err) {
        // this.setState({
        //   currentYear: values.ReportTime && moment(values.ReportTime).format("YYYY"),
        //   currentDate: values.ReportTime
        // })

        // let _payload = {};
        // if (values.PollutantSourceType == 5) {
        //   let format = "YYYY-MM-DD"
        //   if (match.params.reportType === "monthly") {
        //     format = "YYYY-MM-01 00:00:00"
        //   }
        //   if (match.params.reportType === "annals") {
        //     format = "YYYY-01-01 00:00:00"
        //   }

        //   _payload = {
        //     DGIMN: values.DGIMN,
        //     ReportTime: moment().format("YYYY-MM-DD"),
        //     // BeginTime: this.state.beginTime || moment(values.airReportTime[0]).format(format),
        //     // EndTime:  this.state.endTime || moment(values.airReportTime[1]).format(format)
        //   }
        // }

        this.props.dispatch({
          type:"report/updateState",
          payload:{
            summaryForm:{
               beginTime:this.state.beginTime,
               endTime:this.state.endTime
            }
          }
        })

        // 获取污染物类型 = 表头
        this.props.dispatch({
          type: "report/getPollutantList",
          payload: {
            pollutantTypes: values.PollutantSourceType,
            callback: () => {
              // 获取表格数据
              this.props.dispatch({
                type: "report/getDailySummaryDataList",
                payload: {
                  "DGIMN": values.PollutantSourceType=="5"?values.DGIMN:null,
                  "type": match.params.reportType,
                  "PollutantSourceType": values.PollutantSourceType,
                  "Regions": values.Regions.toString(),
                  "ReportTime": values.ReportTime && moment(values.ReportTime).format("YYYY-MM-DD"),
                //  ..._payload
                }
              })
            }
          }
        })
      }
    })
  }

  export() {
    const { form, match: { params: { reportType } } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let _payload = {};
        if (values.PollutantSourceType == 5) {
          let format = "YYYY-MM-DD"
          if (reportType === "monthly") {
            format = "YYYY-MM-01 00:00:00"
          }
          if (reportType === "annals") {
            format = "YYYY-01-01 00:00:00"
          }

          _payload = {
            DGIMN: values.DGIMN,
            ReportTime: moment().format("YYYY-MM-DD"),
            BeginTime: moment(values.airReportTime[0]).format(format),
            EndTime: moment(values.airReportTime[1]).format(format),
            airReportTime: undefined
          }
        }
        this.props.dispatch({
          type: "report/summaryReportExcel",
          payload: {
            ...values,
            DGIMN: values.PollutantSourceType=="5"?values.DGIMN:null,
            type: reportType === "daily" ? 0 : (reportType === "monthly" ? 1 : 2),
            Regions: values.Regions.toString(),
            ReportTime: values.ReportTime && moment(values.ReportTime).format("YYYY-MM-DD"),
         //   ..._payload
          }
        })
      }
    })
  }

  dateOnchange=(dates,beginTime,endTime)=>{
    this.props.form.setFieldsValue({"ReportTime":dates});
    this.setState({
      beginTime,
      endTime
    })
  }

  rangeOnchange=(dates)=>{
     this.props.form.setFieldsValue({"airReportTime":dates});
     this.setState({
      beginTime:dates[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime:dates[1].format('YYYY-MM-DD HH:mm:ss')
     });
  }


  render() {
    const { loading, dailySummaryDataList, exportLoading, regionList, summaryForm, entAndPointLoading, match: { params: { reportType } }, form: { getFieldDecorator, getFieldValue }, pollutantTypeList, enterpriseList, configInfo, entAndPontList } = this.props;
    const { formLayout, defaultSearchForm, currentDate } = this.SELF;
    const { airReportTime } = this.state;

    const reportText = reportType === "daily" ? "汇总日报" : (reportType === "monthly" ? "汇总月报" : "汇总年报");
    const format = reportType === "daily" ? "YYYY-MM-DD" : (reportType === "monthly" ? "YYYY-MM" : "YYYY");
    const pollutantSourceType = this.props.form.getFieldValue("PollutantSourceType");

    let picker="";
    let dateType="";
    let mode;
    switch(reportType)
    {
      case "monthly":
        picker="month";
        dateType="month";
        mode=['month', 'month'];
        break;
      case "annals":
        picker="year";
        dateType="year";
        mode=['year', 'year'];
        break;
      default:
        picker="day";
        dateType="day";
        mode=[];
        break;
    }
    let airTimeEle=<RangePicker_ allowClear={false} style={{ width: '100%' }} mode={mode} callback={this.rangeOnchange} dataType={dateType} dateValue={[moment(summaryForm.beginTime), moment(summaryForm.endTime)]} />
    let timeEle = <DatePickerTool allowClear={false} picker={picker} style={{ width: '100%' }} callback={this.dateOnchange} />
     
    
    // let airTimeEle = <RangePicker allowClear={false} style={{ width: '100%' }} format={format} />;
    // if (format === 'YYYY-MM') {
    //   airTimeEle = <RangePicker allowClear={false} onPanelChange={(value, mode) => {
    //     this.props.form.setFieldsValue({ "airReportTime": value })
    //   }} style={{ width: '100%' }} mode={['month', 'month']} format="YYYY-MM" />;
    // } else if (format === 'YYYY') {
    //   airTimeEle = (
    //     <RangePicker allowClear={false} onPanelChange={(value, mode) => {
    //       this.props.form.setFieldsValue({ "airReportTime": value })
    //     }} style={{ width: '100%' }} mode={['year', 'year']} format="YYYY" />
    //   );
    // }


    // let timeEle = <DatePicker format={format} allowClear={false} style={{ width: "100%" }} />;
    // if (reportType === "monthly") {
    //   timeEle = <MonthPicker allowClear={false} style={{ width: "100%" }} />
    // } else if (reportType === "annals") {
    //   timeEle = <YearPicker format={format} allowClear={false} style={{ width: "100%" }} _onPanelChange={(v) => {
    //     this.props.form.setFieldsValue({ "ReportTime": v })
    //   }} />
    // }

     


    return (
      <BreadcrumbWrapper>
        <Spin spinning={exportLoading || entAndPointLoading} delay={500}>
          <Card className="contentContainer">
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col xl={5} sm={24} md={12}>
                  <FormItem {...formLayout} label="类型" style={{ width: '100%' }}>
                    {getFieldDecorator("PollutantSourceType", {
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
                          },
                        });
                      }} />
                    )}
                  </FormItem>
                </Col>
                {/* <Col xl={6} sm={24} md={12} style={{ display: configInfo.GroupRegionState === "1" ? "block" : "none" }}> */}
                <Col xl={6} sm={24} md={12} style={{ display: "none" }}>
                  <FormItem {...formLayout} label="行政区" style={{ width: '100%' }}>
                    {getFieldDecorator("Regions", {
                      // initialValue: defaultSearchForm.Regions,
                      initialValue: this.state.defaultRegionCode,
                      rules: [{
                        required: true,
                        message: '请选择行政区',
                      }],
                    })(
                      <SdlCascader
                        changeOnSelect={false}
                        data={regionList}
                        placeholder="请选择行政区"
                      />
                    )}
                  </FormItem>
                </Col>
                {
                  // 大气站显示监控目标
                  <Col xl={6} sm={24} md={12} style={{ display: getFieldValue("PollutantSourceType") == 5 ? "block" : "none" }}>
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
                        <CascaderMultiple options={entAndPontList} {...this.props} />,
                      )}
                    </FormItem>
                  </Col>
                }
                {
                  getFieldValue("PollutantSourceType") == 5 ?
                    <Col xxl={7} xl={7} sm={24} lg={7}>
                      <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                        {getFieldDecorator('airReportTime', {
                          initialValue: [moment( summaryForm.beginTime), moment(summaryForm.endTime)],
                          rules: [
                            {
                              required: true,
                              message: '请填写统计时间',
                            },
                          ],
                        })(airTimeEle)}
                      </FormItem>
                    </Col>
                    : <Col xl={6} sm={24} md={12}>
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
                }
                <Col xl={6} md={12}>
                  <FormItem {...formLayout} label="" style={{ width: '100%' }}>
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
              // defaultWidth={200}
              rowClassName={
                (record, index, indent) => {
                  if (index === 0 || record.time === "0时") {
                    return;
                  } else if (index % 2 !== 0 || record.time === "0时") {
                    return style["light"];
                  }
                }
              }
              bordered
              pagination={true}
            />
          </Card>
        </Spin>
      </BreadcrumbWrapper>
    );
  }
}

export default DailySummaryPage;
