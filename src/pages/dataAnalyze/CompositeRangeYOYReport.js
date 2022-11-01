/*
 * @Author: Jiaqi 
 * @Date: 2021-03-18 10:39:57 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2021-03-22 11:50:20
 * @Desc: 综合指数同步范围报表页面
 */

import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import moment from 'moment';
import { connect } from 'dva';
import {
  Spin, Card, Row, Col, DatePicker, Button, message
} from 'antd'
import { Form } from '@ant-design/compatible';
import { ExportOutlined } from '@ant-design/icons';
import YearPicker from '@/components/YearPicker';
import SdlTable from '@/components/SdlTable'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ loading, dataAnalyze }) => ({
  compositeyoyRangeDataSource: dataAnalyze.compositeyoyRangeDataSource,
  loading: loading.effects["dataAnalyze/queryCompositeyoyRangeData"],
  exportLoading: loading.effects["dataAnalyze/exportCompositeyoyRangeData"],
}))
class CompositeRangeYOYReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: [moment().subtract(8, "day"), moment().subtract(1, 'days')],
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
          width: 280,
          children: [
            {
              title: '数值',
              dataIndex: 'Isum',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: 'IsumYear',
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
            },
          ]
        },
        {
          title: 'O₃',
          width: 280,
          children: [
            {
              title: '数值',
              dataIndex: '01',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '01Year',
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
            },
          ]
        },
        {
          title: 'CO',
          width: 280,

          children: [
            {
              title: '数值',
              dataIndex: '02',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '02Year',
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
            },
          ]
        },
        {
          title: 'SO₂',
          width: 280,

          children: [
            {
              title: '数值',
              dataIndex: '03',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '03Year',
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
            },
          ]
        },
        {
          title: 'NO₂',
          width: 280,

          children: [
            {
              title: '数值',
              dataIndex: '05',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '05Year',
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
            },
          ]
        },
        {
          title: 'PM₁₀',
          width: 280,

          children: [
            {
              title: '数值',
              dataIndex: '07',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '07Year',
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
            },
          ]
        },
        {
          title: 'PM₂.₅',
          width: 280,

          children: [
            {
              title: '数值',
              dataIndex: '08',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '同比',
              dataIndex: '08Year',
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
      type: "dataAnalyze/queryCompositeyoyRangeData",
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
      type: "dataAnalyze/exportCompositeyoyRangeData",
      payload: {
        BeginTime: moment(time[0]).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(time[1]).format("YYYY-MM-DD 00:00:00"),
      }
    })
  }

  render() {
    const { compositeyoyRangeDataSource, loading, exportLoading } = this.props;
    const { formLayout } = this._SELF_;
    const { time, columns } = this.state;

    return (
      <BreadcrumbWrapper>
        <Spin spinning={loading} delay={500}>
          <Card className="contentContainer">
            <Form style={{ marginBottom: 20 }}>
              <Row>
                <Col>
                  <FormItem  label="统计时间" style={{ width: '100%' }}>
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
                <Col>
                  <FormItem  label="" style={{ width: '100%' }}>
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
            <SdlTable columns={columns} dataSource={compositeyoyRangeDataSource} pagination={false} defaultWidth={100}  />
            {/* scroll={{ x: 2600,y: 'calc(100vh - 380px)' }} */}
          </Card>
        </Spin>
      </BreadcrumbWrapper>
    );
  }
}

export default CompositeRangeYOYReport;