/*
 * @Author: Jiaqi 
 * @Date: 2020-03-16 17:59:10 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-03-16 18:12:36
 * @Desc: 综合指数报表页面（月报、年报）
 */

import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import moment from 'moment';
import { connect } from 'dva';

import { ExportOutlined } from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Spin, Card, Row, Col, DatePicker, Button } from 'antd';
import YearPicker from '@/components/YearPicker';
import SdlTable from '@/components/SdlTable'
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

@Form.create()
@connect(({ loading, dataAnalyze }) => ({
  compositeIndexDataSource: dataAnalyze.compositeIndexDataSource,
  loading: loading.effects["dataAnalyze/getCompositeIndexDataSource"],
  exportLoading: loading.effects["dataAnalyze/exportCompositeReport"],
}))
class CompositeIndexReport extends Component {
  constructor(props) {
    super(props);

    let beginTime;
    let endTime;
    switch(props.match.params.reportType)
    {
        case "month":
          beginTime=moment().format('YYYY-MM-01 00:00:00');
          endTime=moment(moment().format('YYYY-MM-01 00:00:00')).add(1,'month').add(-1,'second').format('YYYY-MM-DD 23:59:59');
          break;
        case "year":
          beginTime=moment().format('YYYY-01-01 00:00:00');
          endTime=moment(moment().format('YYYY-01-01 00:00:00')).add(1,'year').add(-1,'second').format('YYYY-MM-DD 23:59:59');
          break;
    }
 

    this.state = {
      time: moment(),
      beginTime:beginTime,
      endTime:endTime,
      reportType: props.match.params.reportType,
      format: props.match.params.reportType === "month" ? "YYYY-MM" : "YYYY",
      columns: [
        {
          title: '排口名称',
          width: 200,
          dataIndex: 'DGIMN',
        },
        {
          title: '综合指数',
          width: 220,
          children: [
            {
              title: '数值',
              dataIndex: 'Isum',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: 'IsumYear',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: 'IsumChain',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'O₃',
          width: 220,
          children: [
            {
              title: '数值',
              dataIndex: '01',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '01Year',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '01Chain',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'Co',
          width: 220,
          children: [
            {
              title: '数值',
              dataIndex: '02',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '02Year',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '02Chain',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'SO₂',
          width: 220,
          children: [
            {
              title: '数值',
              dataIndex: '03',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '03Year',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '03Chain',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'NO₂',
          width: 220,
          children: [
            {
              title: '数值',
              dataIndex: '05',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '05Year',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '05Chain',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'PM10',
          width: 220,
          children: [
            {
              title: '数值',
              dataIndex: '07',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '07Year',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '07Chain',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'PM2.5',
          width: 220,
          children: [
            {
              title: '数值',
              dataIndex: '08',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '08Year',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '08Chain',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
      ],
      yearColumns: [
        {
          title: '排口名称',
          width: 300,
          dataIndex: 'DGIMN',
        },
        {
          title: '综合指数',
          children: [
            {
              title: '数值',
              dataIndex: 'Isum',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: 'IsumChain',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'O₃',
          children: [
            {
              title: '数值',
              dataIndex: '01',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '01Chain',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'Co',
          children: [
            {
              title: '数值',
              dataIndex: '02',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '02Chain',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'SO₂',
          children: [
            {
              title: '数值',
              dataIndex: '03',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '03Chain',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'NO₂',
          children: [
            {
              title: '数值',
              dataIndex: '05',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '05Chain',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'PM10',
          children: [
            {
              title: '数值',
              dataIndex: '07',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '07Chain',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'PM2.5',
          children: [
            {
              title: '数值',
              dataIndex: '08',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '环比',
              dataIndex: '08Chain',
              width: 100,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
      ],
    };
    this._SELF_ = {
      formLayout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      },
    }
  }

  componentDidMount() {
    this.getPageData();
  }

  formatColumns = () => {
    let columns = this.state.columns;
    let reportType = this.state.reportType;
    columns = columns.map(item => {
      if (item.children) {
        return item.children.map(itm => {
          return {
            ...itm,
            render: (text, record) => {
              return text !== undefined ? text : '-'
            }
          }
        })
      } else {
        return item
      }
    })
    this.setState({
      columns
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      this.setState({
        reportType: nextProps.match.params.reportType,
        format: "YYYY"
      }, () => {
        this.getPageData()
      })
    }
  }

  getPageData = () => {
    const {beginTime,endTime}=this.state;
    const time = this.props.form.getFieldValue("time") || this.state.time;
    this.props.dispatch({
      type: "dataAnalyze/getCompositeIndexDataSource",
      payload: {
        beginTime:beginTime,
        endTime:endTime,
        Time: moment(time).format("YYYY-MM-DD HH:mm:ss")
      },
      reportType: this.state.reportType
    })
  }

  // 导出
  exportReport = () => {
    const {beginTime,endTime}=this.state;
    const time = this.props.form.getFieldValue("time") || this.state.time;
    this.props.dispatch({
      type: "dataAnalyze/exportCompositeReport",
      payload: {
        beginTime:beginTime,
        endTime:endTime,
        Time: moment(time).format("YYYY-MM-DD HH:mm:ss")
      },
      reportType: this.state.reportType
    })
  }

  dateOnchange=(dates,beginTime,endTime)=>{
    const {form:{setFieldsValue}}=this.props;
    setFieldsValue({"time":dates});
    this.setState({
      beginTime,
      endTime
    })
}

  render() {
    const { form: { getFieldDecorator }, compositeIndexDataSource, loading, exportLoading } = this.props;
    const { formLayout } = this._SELF_;
    const { time, reportType, format, columns, yearColumns } = this.state;
    const columns_ = reportType === "month" ? columns : yearColumns;

    // 格式化日期
    let timeEle=<DatePickerTool picker={reportType} allowClear={false} style={{ width: '100%' }} callback={
      this.dateOnchange
    } />
    // let timeEle = <MonthPicker allowClear={false} style={{ width: '100%' }} />;
    // if (format === 'YYYY') {
    //   timeEle = (
    //     <YearPicker
    //       format={format}
    //       allowClear={false}
    //       style={{ width: '100%' }}
    //       // disabledDate={(currentDate) => currentDate > moment()}
    //       _onPanelChange={v => {
    //         this.props.form.setFieldsValue({ time: v });
    //       }}
    //     />
    //   );
    // }

    return (
      <BreadcrumbWrapper>
        <Spin spinning={loading} delay={500}>
          <Card className="contentContainer">
            <Form  style={{ marginBottom: 20 }}>
              <Row>
                <Col span={7}>
                  <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                    {getFieldDecorator('time', {
                      initialValue: time,
                      rules: [
                        {
                          required: true,
                          message: '请填写统计时间',
                        },
                      ],
                    })(timeEle)}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      style={{ margin: '0 10px' }}
                      loading={loading}
                      onClick={() => {
                        this.getPageData();
                      }}
                    >
                      生成统计
                    </Button>
                    <Button loading={exportLoading} onClick={this.exportReport}>
                      <ExportOutlined />
                      导出
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <SdlTable columns={columns_} dataSource={compositeIndexDataSource} pagination={false} defaultWidth={100} scroll={{ x: "1800px" }} />
            {/* scroll={{ x: 2600, y: 'calc(100vh - 380px)' }}  */}
          </Card>
        </Spin>
      </BreadcrumbWrapper>
    );
  }
}

export default CompositeIndexReport;