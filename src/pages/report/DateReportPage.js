import React, { PureComponent } from 'react';
import { Table, Form, Row, Col, Input, Select, Card, Button, DatePicker, message, Icon, Spin } from 'antd';
import { connect } from "dva";
import moment from 'moment';
// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import style from './index.less'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SdlCascader from '../AutoFormManager/SdlCascader'
import SearchSelect from '../AutoFormManager/SearchSelect'
import SelectPollutantType from '@/components/SelectPollutantType'
import SdlTable from '@/components/SdlTable'
const FormItem = Form.Item;
const { Option } = Select;


@connect(({ loading, report, autoForm }) => ({
  loading: loading.effects["report/getDateReportData"],
  exportLoading: loading.effects["report/reportExport"],
  entLoading: loading.effects["report/getEnterpriseList"],
  entAndPointLoading: loading.effects["common/getEnterpriseAndPoint"],
  pollutantList: report.pollutantList,
  dateReportData: report.dateReportData,
  pollutantTypeList: report.pollutantTypeList,
  enterpriseList: report.enterpriseList,
  dateReportForm: report.dateReportForm,
  regionList: autoForm.regionList,
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      PollutantSourceType: Form.createFormField(props.dateReportForm.PollutantSourceType),
      Regions: Form.createFormField(props.dateReportForm.Regions),
      EntCode: Form.createFormField(props.dateReportForm.EntCode),
      ReportTime: Form.createFormField(props.dateReportForm.ReportTime),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'report/updateState',
      payload: {
        dateReportForm: {
          ...props.dateReportForm,
          ...fields
        }
      }
    })
  },
})

class SiteDailyPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      currentDate: moment().format("YYYY-MM-DD"),
      defaultRegionCode: []
    };
    this.SELF = {
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
      actionType: props.match.params.reportType,
      defaultSearchForm: {
        PollutantSourceType: 1,
        // Regions: ["110000000", "110100000", "110101000"],
        EntCode: "",
        ReportTime: moment()
      },
    }
    this.statisticsReport = this.statisticsReport.bind(this);
    this.export = this.export.bind(this);
  }

  componentDidMount() {
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
            // let RegionCode = [sucRes.Datas[0].value, sucRes.Datas[0].children[0].value, sucRes.Datas[0].children[0].children[0].value];
            let RegionCode = defaultValue;
            this.setState({
              defaultRegionCode: RegionCode
            })
            // 初始化省市区
            this.props.form.setFieldsValue({ Regions: RegionCode })
            // 根据省市区获取企业
            this.props.dispatch({
              type: 'report/getEnterpriseList',
              payload: {
                regionCode: RegionCode,
                pollutantTypeCode: defalutVal,
                callback: (res) => {
                  res.Datas.length && this.setState({
                    currentEntName: res.Datas[0]["dbo.T_Bas_Enterprise.EntName"]
                  })
                  // 获取污染物类型 = 表头
                  this.props.dispatch({
                    type: "report/getPollutantList",
                    payload: {
                      pollutantTypes: defalutVal,
                      callback: () => {
                        if (res.Datas.length) {
                          // 获取表格数据
                          this.props.dispatch({
                            type: "report/getDateReportData",
                            payload: {
                              "type": this.SELF.actionType,
                              // "PollutantSourceType": "2",
                              // "Regions": "130000000,130200000,130201000",
                              // // "EntCode": "51216eae-8f11-4578-ad63-5127f78f6cca",
                              // "EntCode": "51216eae-8f11-4578-ad63-5127f78f6cca",
                              // "ReportTime": "2019-06-29"
                            }
                          })
                        } else {
                          this.props.dispatch({
                            type: "report/updateState",
                            payload: {
                              dateReportData: []
                            }
                          })
                        }
                      }
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
    if (nextProps.location.pathname != this.props.location.pathname && this.props.form.getFieldValue("EntCode")) {
      // 格式化日期
      const format = nextProps.match.params.reportType === "daily" ? "YYYY-MM-DD" : (nextProps.match.params.reportType === "monthly" ? "YYYY-MM" : "YYYY");
      this.setState({
        currentDate: this.props.form.getFieldValue("ReportTime") && moment(this.props.form.getFieldValue("ReportTime")).format(format),
      })
      // 获取表格数据
      this.props.dispatch({
        type: "report/getDateReportData",
        payload: {
          "type": nextProps.match.params.reportType,
          // ...this.props.dateReportForm,
          "PollutantSourceType": this.props.form.getFieldValue("PollutantSourceType"),
          // "Regions": "130000000,130200000,130201000",
          "EntCode": this.props.form.getFieldValue("EntCode"),
          // "ReportTime": moment(this.props.dateReportForm).format("YYYY-MM-DD")
        }
      })
    }
    // if (this.props.pollutantList !== nextProps.pollutantList) {
    if (this.props.dateReportData !== nextProps.dateReportData) {
      const _columns = [
        {
          title: "时间",
          dataIndex: 'time',
        },
        ...nextProps.pollutantList
      ]
      let columns = _columns.map(item => {
        return {
          ...item,
          render: (text, row, index) => {
            if (text) {
              const _text = text.split("|");
              // console.log('_text=', _text)
              const val = _text[0];
              // const status = _text[_text.length-1];
              const status = _text[1];
              // console.log('///=', status)
              // return status > 0 ? <span style={{ color: "#ee9844" }}>{val}</span> : (status > -1 ? <span style={{ color: "#ef4d4d" }}>{val}</span> : val)
              return status > -1 ? <span style={{ color: "#ef4d4d" }}>{val}</span> : val
            }
            return "-"
          }
        }
      })

      columns.unshift({
        title: '点名称',
        // width: 150,
        dataIndex: 'pointName',
        // render: (text, row, index) => {
        //   // if (index === 0) {
        //   //   return {
        //   //     children: <a href="javascript:;">{text}</a>,
        //   //     props: {
        //   //       rowSpan: row.rowSpan,
        //   //     },
        //   //   };
        //   //   // } else if (row.time === "0时") {
        //   // } else if (text !== nextProps.dateReportData[index - 1].pointName) {
        //   //   return {
        //   //     children: <a href="javascript:;">{text}</a>,
        //   //     props: {
        //   //       rowSpan: row.rowSpan,
        //   //     },
        //   //   };
        //   // } else {
        //   //   return {
        //   //     children: <a href="javascript:;">{text}</a>,
        //   //     props: {
        //   //       rowSpan: 0,
        //   //     },
        //   //   };
        //   // }
        //   return text;
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
        //         EntCode: undefined
        // PollutantSourceType: undefined
        // Regions: undefined
        // ReportTime: undefined
        // console.log('value=',values)
        // if(!values.PollutantSourceType){
        //   message.error("请选择污染物类型！");
        //   return;
        // }
        // if(!values.EntCode){
        //   message.error("请选择省市区！");
        //   return;
        // }
        // if(!values.Regions){
        //   message.error("请选择企业！");
        //   return;
        // }
        // if(!values.ReportTime){
        //   message.error("请填写统计时间！");
        //   return;
        // }
        this.setState({
          currentDate: values.ReportTime && moment(values.ReportTime).format("YYYY-MM-DD"),
          currentEntName: this.props.enterpriseList.filter(item => item["ParentCode"] == values.EntCode)[0]["ParentName"]
        })
        // 获取污染物类型 = 表头
        this.props.dispatch({
          type: "report/getPollutantList",
          payload: {
            pollutantTypes: values.PollutantSourceType,
            callback: () => {
              // 获取表格数据
              this.props.dispatch({
                type: "report/getDateReportData",
                payload: {
                  // pageIndex: 1,
                  "type": match.params.reportType,
                  // "PollutantSourceType": values.PollutantSourceType,
                  // // "Regions": values.Regions.toString(),
                  // "EntCode": values.EntCode,
                  // "ReportTime": values.ReportTime && moment(values.ReportTime).format("YYYY-MM-DD")
                }
              })
            }
          }
        })
      }
    })
  }

  // 报表导出
  export() {
    const { form, match: { params: { reportType } } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: "report/reportExport",
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

  // 分页
  onTableChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'report/updateState',
      payload: {
        dateReportForm: {
          ...this.props.dateReportForm,
          current,
        }
      }
    });
    setTimeout(() => {
      // 获取表格数据
      this.props.dispatch({
        type: "report/getDateReportData",
        payload: {
          "type": this.SELF.actionType,
        }
      })
    }, 0);
  }


  render() {
    const { form: { getFieldDecorator }, entAndPointLoading, dateReportForm, exportLoading, match: { params: { reportType } }, dateReportData, pollutantTypeList, regionList, loading, dispatch, enterpriseList, entLoading } = this.props;
    const { formLayout, defaultSearchForm } = this.SELF;
    const { currentEntName, currentDate, defaultRegionCode } = this.state;
    if (exportLoading) {
      return <Spin
        style={{
          width: '100%',
          height: 'calc(100vh/2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        size="large"
      />
    }
    return (
      <PageHeaderWrapper>
        <Card className="contentContainer">
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={3} sm={24}>
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
                    <SelectPollutantType
                      placeholder="请选择污染物类型"
                      onChange={(value) => {
                        this.props.dispatch({
                          type: 'report/getEnterpriseList',
                          payload: {
                            regionCode: this.props.form.getFieldValue("Regions"),
                            pollutantTypeCode: value,
                          }
                        })
                      }} />
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem {...formLayout} label="行政区" style={{ width: '100%' }}>
                  {getFieldDecorator("Regions", {
                    initialValue: defaultRegionCode,
                    rules: [{
                      required: true,
                      message: '请选择行政区',
                    }],
                  })(
                    <SdlCascader
                      changeOnSelect={false}
                      placeholder="请选择行政区"
                      data={regionList}
                      allowClear={false}
                      onChange={(val) => {
                        if (!val.length) {
                          this.props.form.setFieldsValue({
                            EntCode: undefined,
                          });
                        }
                        // 根据省市区获取企业
                        dispatch({
                          type: 'report/getEnterpriseList',
                          payload: {
                            regionCode: val.toString(),
                            pollutantTypeCode: this.props.form.getFieldValue("PollutantSourceType"),
                          }
                        })
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem {...formLayout} label="监控目标" style={{ width: '100%' }}>
                  {getFieldDecorator("EntCode", {
                    initialValue: enterpriseList.length ? enterpriseList[0]["ParentCode"] : undefined,
                    rules: [{
                      required: true,
                      message: '请选择监控目标',
                    }],
                  })(
                    // <SearchSelect configId="AEnterpriseTest" itemValue="dbo.T_Bas_Enterprise.EntCode" itemName="dbo.T_Bas_Enterprise.EntName"/>
                    <Select
                      placeholder="请选择监控目标">
                      {
                        enterpriseList.map(item =>
                          <Option value={item["ParentCode"]}>{item["ParentName"]}</Option>)
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                  {getFieldDecorator("ReportTime", {
                    initialValue: defaultSearchForm.ReportTime,
                    rules: [{
                      required: true,
                      message: '请填写统计时间',
                    }],
                  })(
                    <DatePicker allowClear={false} style={{ width: "100%" }} />
                  )}
                </FormItem>
              </Col>
              <Col md={6}>
                <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                  <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                    this.props.dispatch({
                      type: 'report/updateState',
                      payload: {
                        dateReportForm: {
                          ...this.props.dateReportForm,
                          current: 1,
                        }
                      }
                    });
                    setTimeout(() => { this.statisticsReport() }, 0)
                  }}>生成统计</Button>
                  <Button onClick={this.export} loading={exportLoading}><Icon type="export" />导出</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          {
            currentEntName &&
            <p className={style.title}>{currentEntName}{currentDate}报表</p>
          }
          <SdlTable
            rowKey={(record, index) => index}
            loading={loading}
            // style={{ minHeight: 80 }}
            size="small"
            columns={this.state.columns}
            dataSource={dateReportData}
            // defaultWidth={80}
            scroll={{ y: 'calc(100vh - 65px - 100px - 320px)' }}
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
            pagination={{
              // showSizeChanger: true,
              showQuickJumper: true,
              pageSize: dateReportForm.pageSize,
              current: dateReportForm.current,
              onChange: this.onTableChange,
              total: dateReportForm.total
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SiteDailyPage;
