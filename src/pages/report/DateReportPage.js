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
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SdlCascader from '../AutoFormManager/SdlCascader';
import SearchSelect from '../AutoFormManager/SearchSelect';
import SelectPollutantType from '@/components/SelectPollutantType';
import SdlTable from '@/components/SdlTable';
import YearPicker from '@/components/YearPicker';
import { getDirLevel } from '@/utils/utils';
import CascaderMultiple from '@/components/CascaderMultiple'

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;


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
@Form.create({
  mapPropsToFields(props) {
    return {
      PollutantSourceType: Form.createFormField(props.dateReportForm.PollutantSourceType),
      // Regions: Form.createFormField(props.dateReportForm.Regions),
      DGIMN: Form.createFormField(props.dateReportForm.DGIMN),
      ReportTime: Form.createFormField(props.dateReportForm.ReportTime),
      airReportTime: Form.createFormField(props.dateReportForm.airReportTime),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'report/updateState',
      payload: {
        dateReportForm: {
          ...props.dateReportForm,
          ...fields,
        },
      },
    });
  },
})
class SiteDailyPage extends PureComponent {
  constructor(props) {
    super(props);
    const format =
      props.match.params.reportType === 'siteDaily'
        ? 'YYYY-MM-DD'
        : props.match.params.reportType === 'monthly'
          ? 'YYYY-MM'
          : 'YYYY';
    this.state = {
      format,
      columns: [],
      currentDate: moment().format(format),
      defaultRegionCode: [],
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
        EntCode: '',
        ReportTime: moment(),
      },
    };
    this.statisticsReport = this.statisticsReport.bind(this);
    this.export = this.export.bind(this);
  }

  getAirDefaultTime = (props) => {
    const { match: { params: { reportType } } } = props || this.props;
    const airReportTime = reportType === 'siteDaily'
      ? [moment().add(-1, "day"), moment()]
      : reportType === 'monthly'
        ? [moment().add(-1, "month"), moment()]
        : [moment().add(-1, "year"), moment()]
    this.setState({
      airReportTime
    })

    // console.log("airReportTime1=", moment(airReportTime[0]).format("YYYY-MM-DD HH:mm:ss"))
    // console.log("airReportTime2=", moment(airReportTime[1]).format("YYYY-MM-DD HH:mm:ss"))

    this.props.form.setFieldsValue({ "airReportTime": airReportTime })
    // return airReportTime;
  }

  componentDidMount() {
    this.getAirDefaultTime();
    if (this.props.match.params.reportType === 'siteDaily') {
      this.props.form.setFieldsValue({ ReportTime: moment().add(-1, 'day') })
    }
    const { defaultSearchForm } = this.SELF;
    // 获取污染物 - 查询条件
    this.props.dispatch({
      type: 'report/getPollutantTypeList',
      callback: data => {
        const defalutVal = data.Datas[0].pollutantTypeCode;
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
            console.log("DGIMN=", DGIMN)
            this.props.form.setFieldsValue({ DGIMN })

            // 获取污染物类型 = 表头
            this.props.dispatch({
              type: 'report/getPollutantList',
              payload: {
                pollutantTypes: defalutVal,
                callback: () => {
                  // if (res.Datas.length) {
                  // 获取表格数据
                  this.props.dispatch({
                    type: 'report/getDateReportData',
                    payload: {
                      type: this.SELF.actionType,
                      // DGIMN,
                      // PollutantSourceType: defalutVal
                    },
                  });
                  // } else {
                  //   this.props.dispatch({
                  //     type: 'report/updateState',
                  //     payload: {
                  //       dateReportData: [],
                  //     },
                  //   });
                  // }
                },
              },
            });
          },
        })
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.location.pathname != this.props.location.pathname &&
      this.props.form.getFieldValue('DGIMN')
    ) {
      this.getAirDefaultTime(nextProps)
      // 格式化日期
      const format =
        nextProps.match.params.reportType === 'siteDaily'
          ? 'YYYY-MM-DD'
          : nextProps.match.params.reportType === 'monthly'
            ? 'YYYY-MM'
            : 'YYYY';
      this.setState({
        format,
        currentDate:
          this.props.form.getFieldValue('ReportTime') &&
          moment(this.props.form.getFieldValue('ReportTime')).format(format),
      });
      this.props.dispatch({
        type: 'report/updateState',
        payload: {
          dateReportForm: {
            ...this.props.dateReportForm,
            airReportTime: { value: this.props.form.getFieldValue("airReportTime") },
            current: 1,
          },
        },
      })
      setTimeout(() => {
        // 获取表格数据
        this.props.dispatch({
          type: 'report/getDateReportData',
          payload: {
            type: nextProps.match.params.reportType,
            // ...this.props.dateReportForm,
            PollutantSourceType: this.props.form.getFieldValue('PollutantSourceType'),
            // "Regions": "130000000,130200000,130201000",
            DGIMN: this.props.form.getFieldValue('DGIMN'),
            // airReportTime: {
            //   value: this.props.form.getFieldValue("airReportTime")
            // }
            // "ReportTime": moment(this.props.dateReportForm).format("YYYY-MM-DD")
          },
        });
      }, 0)
    }
    // if (this.props.pollutantList !== nextProps.pollutantList) {
    if (this.props.dateReportData !== nextProps.dateReportData) {
      let AQIColumn = [];
      // 站点日报 - 扬尘和大气站显示AQI
      const pollutantSourceType = nextProps.form.getFieldValue('PollutantSourceType');
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
          title: '时间',
          dataIndex: 'time',
        },
        ...AQIColumn,
        ...nextProps.pollutantList,
      ];
      const columns = _columns.map(item => ({
        ...item,
        render: (text, row, index) => {
          if (text) {
            const _text = text.split('|');
            // console.log('_text=', _text)
            let val = _text[0];
            // const status = _text[_text.length-1];
            const status = _text[1];
            if (item.dataIndex === '风向') {
              val = getDirLevel(text)
            }
            // console.log('///=', status)
            // return status > 0 ? <span style={{ color: "#ee9844" }}>{val}</span> : (status > -1 ? <span style={{ color: "#ef4d4d" }}>{val}</span> : val)
            return status > -1 ? <span style={{ color: '#ef4d4d' }}>{val}</span> : val;
          }
          return '-';
        },
      }));

      columns.unshift({
        title: '点名称',
        dataIndex: 'pointName',
      });
      this.setState({
        columns,
      });
    }
  }

  statisticsReport() {
    const { form, match } = this.props;
    const { format } = this.state;
    // const { uid, configId, isEdit, keysParams } = this._SELF_;
    // const format = match.params.reportType === "daily" ? "YYYY-MM-DD" : (match.params.reportType === "monthly" ? "YYYY-MM" : "YYYY");

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          // currentDate: values.ReportTime && moment(values.ReportTime).format(format),
          // currentEntName: this.props.enterpriseList.filter(
          //   item => item['ParentCode'] == values.EntCode,
          // )[0]['ParentName'],
        });
        if (moment(values.PollutantSourceType[1]).diff(moment(values.PollutantSourceType[0]), "days") > 31) {
          message.error("只能查询一个月以内的数据");
          return;
        }
        // console.log("airReportTime-form1=", moment(values.airReportTime[0]).format("YYYY-MM-DD HH:mm:ss"))
        // console.log("airReportTime-form2=", moment(values.airReportTime[1]).format("YYYY-MM-DD HH:mm:ss"))
        // return;
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
                  // pageIndex: 1,
                  type: match.params.reportType,
                  // "PollutantSourceType": values.PollutantSourceType,
                  // // "Regions": values.Regions.toString(),
                  // "EntCode": values.EntCode,
                  // "ReportTime": values.ReportTime && moment(values.ReportTime).format("YYYY-MM-DD")
                },
              });
            },
          },
        });
      }
    });
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
        let _props = {};
        let format = "YYYY-MM-DD";
        if (values.PollutantSourceType == 5) {
          // let days = moment(dateReportForm.airReportTime.value[1]).daysInMonth();
          if (reportType === "monthly") {
            format = "YYYY-MM-01 00:00:00"
          }
          if (reportType === "annals") {
            format = "YYYY-01-01 00:00:00"
          }
        }
        if (values.PollutantSourceType && values.PollutantSourceType == 5) {
          _props = {
            BeginTime: values.airReportTime && values.airReportTime[0] && moment(values.airReportTime[0]).format(format),
            EndTime: values.airReportTime && values.airReportTime[1] && moment(values.airReportTime[1]).format(format),
            ReportTime: moment().format("YYYY-MM-DD"),
          }
        }

        this.props.dispatch({
          type: 'report/reportExport',
          payload: {
            ...values,
            type: reportType === 'siteDaily' ? 0 : reportType === 'monthly' ? 1 : 2,
            // Regions: values.Regions.toString(),
            ReportTime: values.ReportTime && moment(values.ReportTime).format('YYYY-MM-DD'),
            airReportTime: undefined,
            ..._props
          },
        });
      }
    });
  }

  // 分页
  onTableChange = (current, pageSize) => {
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
      this.props.dispatch({
        type: 'report/getDateReportData',
        payload: {
          type: this.props.match.params.reportType,
        },
      });
    }, 0);
  };

  componentWillUnmount() {
    this.props.dispatch({
      type: 'report/updateState',
      payload: {
        dateReportForm: {
          PollutantSourceType: 1,
          current: 1,
          pageSize: 34,
          total: 0,
          DGIMN: [],
          ReportTime: moment(),
        },
      },
    });
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      entAndPointLoading,
      dateReportForm,
      exportLoading,
      match: {
        params: { reportType },
      },
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
    const { currentEntName, currentDate, defaultRegionCode, format, airReportTime } = this.state;
    // if (airReportTime && airReportTime.length) {
    //   console.log("airReportTime-state=", moment(airReportTime[0]).format("YYYY-MM-DD HH:mm:ss"))
    //   console.log("airReportTime-state=", moment(airReportTime[1]).format("YYYY-MM-DD HH:mm:ss"))
    // }
    let airTimeEle = <RangePicker allowClear={false} onChange={(date) => {
      console.log("form1=", moment(getFieldValue("airReportTime")[0]).format("YYYY-MM-DD HH:mm:ss"))
      console.log("form2=", moment(getFieldValue("airReportTime")[1]).format("YYYY-MM-DD HH:mm:ss"))
      if (date[1].diff(date[0], "days") > 31) {
        message.error("只能查询一个月以内的数据");
        // setFieldsValue({"airReportTime": getFieldValue("airReportTime")})
        // return;
      } else {
        // setFieldsValue({"airReportTime": date})
      }
    }} style={{ width: '100%' }} format={format} />;
    if (format === 'YYYY-MM') {
      airTimeEle = <RangePicker allowClear={false} onPanelChange={(value, mode) => {
        this.props.form.setFieldsValue({ "airReportTime": value })
      }} style={{ width: '100%' }} mode={['month', 'month']} format="YYYY-MM" />;
    } else if (format === 'YYYY') {
      airTimeEle = (
        <RangePicker allowClear={false} onPanelChange={(value, mode) => {
          this.props.form.setFieldsValue({ "airReportTime": value })
        }} style={{ width: '100%' }} mode={['year', 'year']} format="YYYY" />
      );
    }

    let timeEle = <DatePicker allowClear={false} style={{ width: '100%' }} format={format} />;
    if (format === 'YYYY-MM') {
      timeEle = <MonthPicker allowClear={false} style={{ width: '100%' }} />;
    } else if (format === 'YYYY') {
      timeEle = (
        <YearPicker
          format={format}
          allowClear={false}
          style={{ width: '100%' }}
          _onPanelChange={v => {
            this.props.form.setFieldsValue({ ReportTime: v });
          }}
        />
      );
    }

    let pageSize = dateReportForm.pageSize;
    if (getFieldValue("PollutantSourceType") == 5) {
      if (reportType === "siteDaily") {
        pageSize = 24
      } else if (reportType === "monthly") {
        pageSize = 31
      } else {
        pageSize = 12
      }
    };
    return (
      <PageHeaderWrapper>
        <Spin spinning={exportLoading || entAndPointLoading} delay={500}>
          <Card className="contentContainer">
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row>
                <Col xxl={4} xl={4} sm={24} lg={7}>
                  <FormItem {...formLayout} label="类型" style={{ width: '100%' }}>
                    {getFieldDecorator('PollutantSourceType', {
                      // initialValue: defaultSearchForm.PollutantSourceType,
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
                      // <Select placeholder="请选择污染物类型">
                      //   {
                      //     pollutantTypeList.map(item => <Option value={item.pollutantTypeCode}>{item.pollutantTypeName}</Option>)
                      //   }
                      // </Select>
                      <SelectPollutantType
                        placeholder="请选择污染物类型"
                        onChange={value => {
                          this.getAirDefaultTime()
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
                        }}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col xxl={7} xl={7} sm={24} lg={9}>
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
                      // <SearchSelect configId="AEnterpriseTest" itemValue="dbo.T_Bas_Enterprise.EntCode" itemName="dbo.T_Bas_Enterprise.EntName"/>
                      <CascaderMultiple options={entAndPontList} {...this.props} />,
                    )}
                  </FormItem>
                </Col>
                {
                  // 大气站时显示时间范围
                  getFieldValue("PollutantSourceType") == 5 ? <Col xxl={7} xl={7} sm={24} lg={7}>
                    <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                      {getFieldDecorator('airReportTime', {
                        initialValue: airReportTime,
                        rules: [
                          {
                            required: true,
                            message: '请填写统计时间',
                          },
                        ],
                      })(airTimeEle)}
                    </FormItem>
                  </Col> :
                    <Col xxl={7} xl={7} sm={24} lg={7}>
                      <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                        {getFieldDecorator('ReportTime', {
                          initialValue: defaultSearchForm.ReportTime,
                          rules: [
                            {
                              required: true,
                              message: '请填写统计时间',
                            },
                          ],
                        })(timeEle)}
                      </FormItem>
                    </Col>
                }
                <Col xxl={6} xl={6} lg={8}>
                  <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      style={{ margin: '0 10px' }}
                      loading={loading}
                      onClick={() => {
                        this.props.dispatch({
                          type: 'report/updateState',
                          payload: {
                            dateReportForm: {
                              ...this.props.dateReportForm,
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
            {/* {currentEntName && (
              <p className={style.title}>
                {currentEntName}
                {currentDate}报表
              </p>
            )} */}
            <SdlTable
              rowKey={(record, index) => index}
              loading={loading}
              // style={{ minHeight: 80 }}
              size="small"
              columns={this.state.columns}
              dataSource={dateReportData}
              // defaultWidth={80}
              scroll={{ y: 'calc(100vh - 65px - 100px - 320px)' }}
              rowClassName={(record, index, indent) => {
                if (index === 0 || record.time === '0时') {

                } else if (index % 2 !== 0 || record.time === '0时') {
                  return style.light;
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
      </PageHeaderWrapper>
    );
  }
}

export default SiteDailyPage;
