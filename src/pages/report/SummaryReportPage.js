import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Icon, Form, Select, Row, Col, DatePicker, Button, Spin } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment'
import style from './index.less'
import SdlCascader from '../AutoFormManager/SdlCascader'
import SdlTable from '@/components/SdlTable'
import SelectPollutantType from '@/components/SelectPollutantType'

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker

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
}))
class DailySummaryPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      currentYear: moment().format("YYYY"),
      defaultRegionCode: [],
      currentDate: moment()
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
        ReportTime: moment()
      },
    }

    this.export = this.export.bind(this);
    this.statisticsReport = this.statisticsReport.bind(this);
  }
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
    const { defaultSearchForm } = this.SELF;
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      const { form, match: { params: { reportType } } } = this.props;
      const format = reportType === "daily" ? "YYYY-MM-DD" : (reportType === "monthly" ? "YYYY-MM" : "YYYY");
      // 获取表格数据
      this.props.dispatch({
        type: "report/getDailySummaryDataList",
        payload: {
          "type": nextProps.match.params.reportType,
          "PollutantSourceType": form.getFieldValue("PollutantSourceType"),
          "Regions": form.getFieldValue("Regions").toString(),
          "ReportTime": form.getFieldValue("ReportTime") && moment(form.getFieldValue("ReportTime")).format("YYYY-MM-DD")
        }
      })
    }
    if (this.props.dailySummaryDataList !== nextProps.dailySummaryDataList) {
      const _columns = [
        {
          title: "排口名称",
          dataIndex: 'PointName',
        },
        ...nextProps.pollutantList
      ]
      let columns = _columns.map(item => {
        return {
          ...item,
          render: (text, row, index) => {
            if (text) {
              const _text = text.split("|");
              const val = _text[0];
              const status = _text[1];
              // return status > 0 ? <span style={{ color: "#ee9844" }}>{val}</span> : (status > -1 ? <span style={{ color: "#ef4d4d" }}>{val}</span> : val)
              return status > -1 ? <span style={{ color: "#ef4d4d" }}>{val}</span> : val
            }
            return "-"
          }
        }
      })
      columns.unshift({
        title: '企业名称',
        dataIndex: 'EntName',
        // width: 200,
        // render: (text, row, index) => {
        //   if (index === 0) {
        //     return {
        //       children: <a href="javascript:;">{text}</a>,
        //       props: {
        //         rowSpan: row.rowSpan,
        //       },
        //     };
        //   } else if (text !== nextProps.dailySummaryDataList[index - 1].EntName) {
        //     return {
        //       children: <a href="javascript:;">{text}</a>,
        //       props: {
        //         rowSpan: row.rowSpan,
        //       },
        //     };
        //   } else {
        //     return {
        //       children: <a href="javascript:;">{text}</a>,
        //       props: {
        //         rowSpan: 0,
        //       },
        //     };
        //   }
        // }
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
        this.setState({
          currentYear: values.ReportTime && moment(values.ReportTime).format("YYYY"),
          currentDate: values.ReportTime
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
                  "type": match.params.reportType,
                  "PollutantSourceType": values.PollutantSourceType,
                  "Regions": values.Regions.toString(),
                  "ReportTime": values.ReportTime && moment(values.ReportTime).format("YYYY-MM-DD")
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
        this.props.dispatch({
          type: "report/summaryReportExcel",
          payload: {
            ...values,
            type: reportType === "siteDaily" ? 0 : (reportType === "monthly" ? 1 : 2),
            Regions: values.Regions.toString(),
            ReportTime: values.ReportTime && moment(values.ReportTime).format("YYYY-MM-DD"),
          }
        })
      }
    })
  }

  render() {
    const { loading, dailySummaryDataList, exportLoading, regionList, entAndPointLoading, match: { params: { reportType } }, form: { getFieldDecorator }, pollutantTypeList, enterpriseList, configInfo } = this.props;
    const { formLayout, defaultSearchForm, currentDate } = this.SELF;
    const reportText = reportType === "daily" ? "汇总日报" : (reportType === "monthly" ? "汇总月报" : "汇总年报");
    const format = reportType === "daily" ? "YYYY-MM-DD" : (reportType === "monthly" ? "YYYY-MM" : "YYYY");
    const pollutantSourceType = this.props.form.getFieldValue("PollutantSourceType");
    let timeEle = <DatePicker format={format} allowClear={false} style={{ width: "100%" }} />;
    if (reportType === "monthly") {
      timeEle = <MonthPicker allowClear={false} style={{ width: "100%" }} />
    }
    return (
      <PageHeaderWrapper>
        <Spin spinning={exportLoading || entAndPointLoading} delay={500}>
          <Card className="contentContainer">
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col xl={6} sm={24} md={12}>
                  <FormItem {...formLayout} label="类型" style={{ width: '100%' }}>
                    {getFieldDecorator("PollutantSourceType", {
                      // initialValue: defaultSearchForm.PollutantSourceType,
                      initialValue: pollutantTypeList.length ? pollutantTypeList[0].pollutantTypeCode : undefined,
                      rules: [{
                        required: true,
                        message: '请选择污染物类型',
                      }],
                    })(
                      // <Select placeholder="请选择污染物类型">
                      //   {
                      //     pollutantTypeList.map(item => <Option value={item.pollutantTypeCode}>{item.pollutantTypeName}</Option>)
                      //   }
                      // </Select>
                      <SelectPollutantType placeholder="请选择污染物类型" />
                    )}
                  </FormItem>
                </Col>
                <Col xl={6} sm={24} md={12} style={{ display: configInfo.GroupRegionState === "1" ? "block" : "none" }}>
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
                {/* </Row> */}
                {/* <Row gutter={{ md: 8, lg: 24, x
              l: 48 }}> */}
                <Col xl={6} sm={24} md={12}>
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
            <p className={style.title}>{moment(this.state.currentDate).format(format)} {reportText}</p>
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
      </PageHeaderWrapper>
    );
  }
}

export default DailySummaryPage;
