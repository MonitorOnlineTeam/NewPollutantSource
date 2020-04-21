/*
 * @Author: Jiaqi 
 * @Date: 2020-03-16 17:59:10 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-03-31 11:48:51
 * @Desc: 综合指数报表页面（月报、年报）
 */

import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import moment from 'moment';
import { connect } from 'dva';
import {
  Spin, Card, Form, Row, Col, DatePicker, Button, Icon, message
} from 'antd'
import YearPicker from '@/components/YearPicker';
import SdlTable from '@/components/SdlTable'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ loading, dataAnalyze }) => ({
  compositeRangeDataSource: dataAnalyze.compositeRangeDataSource,
  loading: loading.effects["dataAnalyze/queryCompositeRangeData"],
  exportLoading: loading.effects["dataAnalyze/exportRangeCompositeReport"],
}))
class CompositeRangeReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: [moment().subtract(8, "day"), moment()],
      reportType: props.match.params.reportType,
      format: props.match.params.reportType === "month" ? "YYYY-MM" : "YYYY",
      columns: [
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
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: 'IsumYear',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
          ]
        },
        {
          title: 'O₃',
          children: [
            {
              title: '数值',
              dataIndex: '01',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '01Year',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
          ]
        },
        {
          title: 'Co',
          children: [
            {
              title: '数值',
              dataIndex: '02',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '02Year',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
          ]
        },
        {
          title: 'SO₂',
          children: [
            {
              title: '数值',
              dataIndex: '03',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '03Year',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
          ]
        },
        {
          title: 'NO₂',
          children: [
            {
              title: '数值',
              dataIndex: '05',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '05Year',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
          ]
        },
        {
          title: 'PM10',
          children: [
            {
              title: '数值',
              dataIndex: '07',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '07Year',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
          ]
        },
        {
          title: 'PM2.5',
          children: [
            {
              title: '数值',
              dataIndex: '08',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '08Year',
              width: 150,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
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
    this.getPageData()
  }

  componentWillReceiveProps(nextProps) {

  }

  getPageData = () => {
    const time = this.state.time;
    this.props.dispatch({
      type: "dataAnalyze/queryCompositeRangeData",
      payload: {
        BeginTime: moment(time[0]).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(time[1]).format("YYYY-MM-DD 00:00:00"),
      }
    })
  }

  // 导出
  exportReport = () => {
    const time = this.state.time;
    this.props.dispatch({
      type: "dataAnalyze/exportRangeCompositeReport",
      payload: {
        BeginTime: moment(time[0]).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(time[1]).format("YYYY-MM-DD 00:00:00"),
      }
    })
  }

  render() {
    const { compositeRangeDataSource, loading, exportLoading } = this.props;
    const { formLayout } = this._SELF_;
    const { time, columns } = this.state;

    return (
      <BreadcrumbWrapper>
        <Spin spinning={loading} delay={500}>
          <Card className="contentContainer">
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row>
                <Col span={7}>
                  <FormItem {...formLayout} label="统计时间" style={{ width: '100%' }}>
                    <RangePicker value={time} onChange={(dates, dateString) => {
                      console.log("fields11=", moment(dates[0]).format("YYYY-MM-DD HH:mm:ss"))
                      console.log("fields22=", moment(dates[1]).format("YYYY-MM-DD HH:mm:ss"))
                      if (dates[0].year() === dates[1].year()) {
                        this.setState({
                          time: dates
                        })
                      } else {
                        message.error("请选择一年内的时间")
                      }
                    }} />
                  </FormItem>
                </Col>
                <Col span={10}>
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
                      <Icon type="export" />
                      导出
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <SdlTable columns={columns} dataSource={compositeRangeDataSource} pagination={false} defaultWidth={150}  />
            {/* scroll={{ x: 2600,y: 'calc(100vh - 380px)' }} */}
          </Card>
        </Spin>
      </BreadcrumbWrapper>
    );
  }
}

export default CompositeRangeReport;