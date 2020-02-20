/*
 * @Author: Jiaqi 
 * @Date: 2020-02-18 15:16:30 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-02-20 18:10:30
 * @desc
 */
import React, { PureComponent } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
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
  Cascader,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import style from './index.less';
import SdlTable from '@/components/SdlTable';
import YearPicker from '@/components/YearPicker';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

@Form.create()
@connect(({ loading, report }) => ({
  smokeReportFrom: report.smokeReportFrom,
  entAndPointList: report.entAndPointList,
  defaultEntAndPoint: report.defaultEntAndPoint,
  smokeReportData: report.smokeReportData,
  loading: loading.effects["report/getSmokeReportData"],
  exportLoading: loading.effects["report/exportSmokeReport"],
  pointName: report.pointName
}))
class SmokeReportPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: {
        day: [],
      },
    };
    this._SELF_ = {
      pollutantType: 2,
      reportType: props.match.params.reportType,
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
    };

    // let timeEle = <DatePicker allowClear={false} style={{ width: '100%' }} format={format} />;
    // if (format === 'YYYY-MM') {
    //   timeEle = <MonthPicker allowClear={false} style={{ width: '100%' }} />;
    // } else if (format === 'YYYY') {
    //   timeEle = (
    //     <YearPicker
    //       format={format}
    //       allowClear={false}
    //       style={{ width: '100%' }}
    //       _onPanelChange={v => {
    //         this.props.form.setFieldsValue({ ReportTime: v });
    //       }}
    //     />
    //   );
    // }

    switch (this._SELF_.reportType) {
      case "day":
        this.title = "烟气排放连续监测小时平均日报表";
        this.format = "YYYY-MM-DD";
        this.timeEle = <DatePicker allowClear={false} style={{ width: '100%' }} />
        this.tableFooter = "烟气日排放总量单位：×10⁴m³/d"
        break;
      case "month":
        this.title = "烟气排放连续监测日平均月报表";
        this.format = "YYYY-MM"
        this.timeEle = <MonthPicker allowClear={false} style={{ width: '100%' }} />
        this.tableFooter = "烟气月排放总量单位：×10⁴m³/月"
        break;
      case "quarter":
        this.title = "烟气排放连续监测月平均季报表";
        this.format = "YYYY-MM"
        this.timeEle = <DatePicker allowClear={false} style={{ width: '100%' }} />
        this.tableFooter = "烟气季排放总量单位：×10⁴m³/季度"
        break;
      case "year":
        this.title = "烟气排放连续监测月平均年报表";
        this.format = "YYYY-MM"
        this.timeEle = <YearPicker
          allowClear={false}
          style={{ width: '100%' }}
          _onPanelChange={v => {
            this.props.form.setFieldsValue({ time: v });
          }}
        />
        this.tableFooter = "烟气年排放总量单位：×10⁴m³/a"
        break;
    }
  }

  componentDidMount() {
    this.getEntAndPoint();
  }

  // 获取企业及排口
  getEntAndPoint = (payload) => {
    this.props.dispatch({
      type: "report/getEntAndPoint",
      payload: {
        "PollutantTypes": this._SELF_.pollutantType,
        "RegionCode": "",
        "Name": "",
        "Status": [0, 1, 2, 3],
        "QCAUse": "",
        "RunState": "",
        "isFilter": true,
        reportType: this._SELF_.reportType,
        ...payload
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      this.getSmokeReportData({
        dataType: nextProps.match.params.reportType
      });
    }
    if (this.props.smokeReportData !== nextProps.smokeReportData) {
      const dataLength = nextProps.smokeReportData.length - 1;
      let dayColumns = [
        {
          title: '时间',
          dataIndex: 'Time',
          width: 200,
        },
        {
          title: '颗粒物',
          // width: 400,
          children: [
            {
              title: '实测浓度(mg/m³)',
              dataIndex: '01',
              width: 150,
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === dataLength) {
                  obj.props.colSpan = 2;
                  obj.children = <div style={{ textAlign: 'center' }}>-</div>;
                  // return "-";
                  // }else{
                }
                return obj;
              }
            },
            {
              title: '折算浓度(mg/m³)',
              dataIndex: 'zs01',
              width: 150,
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === dataLength) {
                  obj.props.colSpan = 0;
                }
                return obj;
              }
            },
            {
              title: '排放量(kg/h)',
              dataIndex: '01sum',
              width: 150,
            },
          ]
        },
        {
          title: 'SO₂',
          // width: 400,
          children: [
            {
              title: '实测浓度(mg/m³)',
              dataIndex: '02',
              width: 150,
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === dataLength) {
                  obj.props.colSpan = 2;
                  obj.children = <div style={{ textAlign: 'center' }}>-</div>;
                }
                return obj;
              }
            },
            {
              title: '折算浓度(mg/m³)',
              dataIndex: 'zs02',
              width: 150,
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === dataLength) {
                  obj.props.colSpan = 0;
                }
                return obj;
              }
            },
            {
              title: '排放量(kg/h)',
              dataIndex: '02sum',
              width: 150,
            },
          ]
        },
        {
          title: 'NOx',
          // width: 400,
          children: [
            {
              title: '实测浓度(mg/m³)',
              dataIndex: '03',
              width: 150,
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === dataLength) {
                  obj.props.colSpan = 2;
                  obj.children = <div style={{ textAlign: 'center' }}>-</div>;
                }
                return obj;
              }
            },
            {
              title: '折算浓度(mg/m³)',
              dataIndex: 'zs03',
              width: 150,
              render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === dataLength) {
                  obj.props.colSpan = 0;
                }
                return obj;
              }
            },
            {
              title: '排放量(kg/h)',
              dataIndex: '03sum',
              width: 150,
            },
          ]
        },
        {
          title: '标干流量(m³/h)',
          dataIndex: 'b02',
          width: 150,
        },
        {
          title: '干基O₂(%)',
          dataIndex: 's01',
          width: 150,
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index === dataLength) {
              obj.props.colSpan = 5;
              obj.children = <div style={{ textAlign: 'center' }}>-</div>;
            }
            return obj;
          }
        },
        {
          title: '烟温(°C)',
          dataIndex: 's03',
          width: 150,
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index === dataLength) {
              obj.props.colSpan = 0;
            }
            return obj;
          }
        },
        {
          title: '含湿量(%)',
          dataIndex: 's05',
          width: 150,
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index === dataLength) {
              obj.props.colSpan = 0;
            }
            return obj;
          }
        },
        {
          title: '负荷(%)',
          dataIndex: 'fuhe',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index === dataLength) {
              obj.props.colSpan = 0;
            }
            return obj;
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index === dataLength) {
              obj.props.colSpan = 0;
            }
            return obj;
          }
        },
      ];
      let quarterColumns = [
        {
          title: '时间',
          dataIndex: 'Time',
          // width: 200,
        },
        {
          title: '颗粒物排放量(t/月)',
          dataIndex: '01',
          // width: 200,
        },
        {
          title: 'SO₂排放量(t/月)',
          dataIndex: '02',
          // width: 200,
        },
        {
          title: 'NOx排放量(t/月)',
          dataIndex: '03',
          // width: 200,
        },
        {
          title: '标干流量(×10⁴m³/月)',
          dataIndex: 'b02',
          // width: 200,
        },
        {
          title: '干基O₂(%)',
          dataIndex: 's01',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index === dataLength) {
              obj.props.colSpan = 5;
              obj.children = <div style={{ textAlign: 'center' }}>-</div>;
            }
            return obj;
          }
          // width: 200,
        },
        {
          title: '温度(°C)',
          dataIndex: 's03',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index === dataLength) {
              obj.props.colSpan = 0;
            }
            return obj;
          }
          // width: 200,
        },
        {
          title: '湿度(°C)',
          dataIndex: 's05',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index === dataLength) {
              obj.props.colSpan = 0;
            }
            return obj;
          }
          // width: 200,
        },
        {
          title: '负荷(%)',
          dataIndex: 'fuhe',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index === dataLength) {
              obj.props.colSpan = 0;
            }
            return obj;
          }
          // width: 200,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            };
            if (index === dataLength) {
              obj.props.colSpan = 0;
            }
            return obj;
          }
          // width: 200,
        },
      ]
      this.setState({
        columns: {
          day: dayColumns,
          quarter: quarterColumns
        },
        pointName: nextProps.pointName
      })
    }
  }


  // 导出报表
  exportReport = () => {
    this.props.dispatch({
      type: "report/exportSmokeReport",
      payload: {
        DGIMN: this.props.form.getFieldValue("DGIMN").slice(-1).toString(),
        time: moment(this.props.form.getFieldValue("time")).format("YYYY-MM-DD HH:mm:ss"),
        dataType: this.props.match.params.reportType,
        pointName: this.state.pointName
      }
    })
  }

  // 
  getSmokeReportData = (payload = {}) => {
    this.props.dispatch({
      type: "report/getSmokeReportData",
      payload: {
        DGIMN: this.props.form.getFieldValue("DGIMN").slice(-1).toString(),
        time: moment(this.props.form.getFieldValue("time")).format("YYYY-MM-DD HH:mm:ss"),
        dataType: this.props.match.params.reportType,
        ...payload
      }
    })
  }

  // 搜索
  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  render() {
    const { formLayout, reportType } = this._SELF_;
    const { form: { getFieldDecorator }, smokeReportFrom, entAndPointList, defaultEntAndPoint, smokeReportData, loading, exportLoading } = this.props;
    const { dataSource, columns } = this.state;
    const _columns = (reportType === "day" || reportType === "month") ? columns.day : columns.quarter

    // console.log("columns-", _columns)
    return (
      <PageHeaderWrapper title={this.title}>
        <Spin spinning={loading} delay={500}>
          <Card className="contentContainer">
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row>
                <Col xxl={5} xl={7} sm={24} lg={9}>
                  <FormItem {...formLayout} label="监控目标" style={{ width: '100%' }}>
                    {getFieldDecorator('DGIMN', {
                      initialValue: defaultEntAndPoint,
                      rules: [
                        {
                          required: true,
                          message: '请选择监控目标',
                        },
                      ],
                    })(
                      <Cascader
                        fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                        options={entAndPointList}
                        showSearch={this.filter}
                        placeholder="请选择监控目标"
                        onChange={(value, selectedOptions) => {
                          console.log("selectedOptions=", selectedOptions)
                          this.setState({
                            pointName: selectedOptions.slice(-1).title
                          })
                        }}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col xxl={5} xl={7} sm={24} lg={9}>
                  <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                    {getFieldDecorator('time', {
                      initialValue: moment(),
                      rules: [
                        {
                          required: true,
                          message: '请填写统计时间',
                        },
                      ],
                    })(
                      // <DatePicker />
                      this.timeEle
                    )}
                  </FormItem>
                </Col>
                <Col xxl={6} xl={6} lg={8}>
                  <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      style={{ margin: '0 10px' }}
                      onClick={() => { this.getSmokeReportData() }}
                    // loading={loading}
                    >
                      生成统计
                    </Button>
                    <Button onClick={this.exportReport} loading={exportLoading}>
                      <Icon type="export" />
                      导出
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <SdlTable
              rowKey={(record, index) => index}
              // loading={loading}
              size="small"
              columns={_columns}
              dataSource={smokeReportData}
              pagination={false}
              // rowClassName={""}
              // defaultWidth={80}
              scroll={{ y: 'calc(100vh - 440px)', x: 'calc(2400px)' }}
              bordered
              footer={() => this.tableFooter}
            />
          </Card>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default SmokeReportPage;