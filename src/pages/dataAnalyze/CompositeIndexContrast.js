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
  compositeContrastDataSource: dataAnalyze.compositeContrastDataSource,
  loading: loading.effects["dataAnalyze/queryCompositeRangeContrastData"],
  exportLoading: loading.effects["dataAnalyze/exportCompositeRangeContrast"],
}))
class CompositeIndexContrast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BeginTime: moment().subtract(16, "day"),
      EndTime: moment().subtract(8, "day"),
      StartTime: moment().subtract(8, "day"),
      OverTime: moment(),
      columns: [
        {
          title: '排口名称',
          width: 200,
          dataIndex: 'DGIMN',
        },
        {
          title: '综合指数',
          width: 200,
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
              title: '数值',
              dataIndex: 'IsumNew',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '对比',
              dataIndex: 'IsumCom',
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
              title: '数值',
              dataIndex: '01New',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '对比',
              dataIndex: '01Com',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'Co',
          width: 200,
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
              title: '数值',
              dataIndex: '02New',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '对比',
              dataIndex: '02Com',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'SO₂',
          width: 200,
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
              title: '数值',
              dataIndex: '03New',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '对比',
              dataIndex: '03Com',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'NO₂',
          width: 200,
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
              title: '数值',
              dataIndex: '05New',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '对比',
              dataIndex: '05Com',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'PM10',
          width: 200,
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
              title: '数值',
              dataIndex: '07New',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '对比',
              dataIndex: '07Com',
              width: 80,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            }
          ]
        },
        {
          title: 'PM2.5',
          width: 200,
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
              title: '数值',
              dataIndex: '08New',
              width: 60,
              render: (text, record) => {
                return text !== undefined ? text : '-'
              }
            },
            {
              title: '对比',
              dataIndex: '08Com',
              width: 80,
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
    this.getPageData()
  }

  componentWillReceiveProps(nextProps) {

  }

  getPageData = () => {
    const { BeginTime, EndTime, StartTime, OverTime } = this.state;
    let diff1 = BeginTime.diff(EndTime, 'day');
    let diff2 = StartTime.diff(OverTime, 'day');
    if (diff1 !== diff2) {
      message.error("对比时间段的相隔天数必须保持一致, 请重新选择时间");
      return;
    }
    this.props.dispatch({
      type: "dataAnalyze/queryCompositeRangeContrastData",
      payload: {
        BeginTime: moment(BeginTime).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(EndTime).format("YYYY-MM-DD 00:00:00"),
        StartTime: moment(StartTime).format("YYYY-MM-DD 00:00:00"),
        OverTime: moment(OverTime).format("YYYY-MM-DD 00:00:00"),
      }
    })
  }

  // 导出
  exportReport = () => {
    const { BeginTime, EndTime, StartTime, OverTime } = this.state;
    let diff1 = BeginTime.diff(EndTime, 'day');
    let diff2 = StartTime.diff(OverTime, 'day');
    if (diff1 !== diff2) {
      message.error("对比时间段的相隔天数必须保持一致, 请重新选择时间");
      return;
    }
    this.props.dispatch({
      type: "dataAnalyze/exportCompositeRangeContrast",
      payload: {
        BeginTime: moment(BeginTime).format("YYYY-MM-DD 00:00:00"),
        EndTime: moment(EndTime).format("YYYY-MM-DD 00:00:00"),
        StartTime: moment(StartTime).format("YYYY-MM-DD 00:00:00"),
        OverTime: moment(OverTime).format("YYYY-MM-DD 00:00:00"),
      }
    })
  }

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment(this.state.EndTime);
  }

  render() {
    const { compositeContrastDataSource, loading, exportLoading } = this.props;
    const { formLayout } = this._SELF_;
    const { columns, BeginTime, EndTime, StartTime, OverTime } = this.state;

    return (
      <BreadcrumbWrapper>
        <Spin spinning={loading} delay={500}>
          <Card className="contentContainer">
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row>
                <Col span={7}>
                  <FormItem {...formLayout} label="开始时间段" style={{ width: '100%' }}>
                    <RangePicker value={[BeginTime, EndTime]} allowClear={false} onChange={(dates, dateString) => {
                      this.setState({
                        BeginTime: dates[0],
                        EndTime: dates[1]
                      })
                    }} />
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem {...formLayout} label="结束时间段" style={{ width: '100%' }}>
                    {/* disabledDate={this.disabledDate}  */}
                    <RangePicker value={[StartTime, OverTime]} allowClear={false} onChange={(dates, dateString) => {
                      this.setState({
                        StartTime: dates[0],
                        OverTime: dates[1]
                      })
                    }} />
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem {...formLayout} label="" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      style={{ margin: '0 10px' }}
                      loading={loading}
                      onClick={this.getPageData}
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
            <SdlTable columns={columns} dataSource={compositeContrastDataSource} pagination={false} defaultWidth={100} />
            {/* scroll={{ x: 2600,y: 'calc(100vh - 380px)' }} */}
          </Card>
        </Spin>
      </BreadcrumbWrapper>
    );
  }
}

export default CompositeIndexContrast;