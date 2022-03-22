import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '@/components/SdlTable';
import { Card, Row, Select, Col, DatePicker, Button, Input, Alert, Modal, message } from "antd"
import moment from 'moment'
import { connect } from "dva";
import { Form } from '@ant-design/compatible';
import { ExportOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;


@Form.create({})
@connect(({ loading, dataAnalyze }) => ({
  excellentDaysReportData: dataAnalyze.excellentDaysReportData,
  loading: loading.effects["dataAnalyze/getExcellentDaysReport"],
  exportLoading: loading.effects["dataAnalyze/excellentDaysExportReport"]
}))
class ExcellentDaysReport extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      columns: [
        {
          title: '大气站',
          dataIndex: 'DGIMN',
          key: 'DGIMN',
          width: 240,
        },
        {
          title: '时间',
          dataIndex: 'Time',
          key: 'Time',
          width: 230,
        },
        {
          title: '优',
          width: 240,
          children: [
            {
              title: '天数',
              dataIndex: '优',
              key: '优',
              width: 80,
            },
            {
              title: '同期天数',
              dataIndex: '优Chain',
              key: '优Chain',
              width: 80,
            },
            {
              title: '同比天数',
              dataIndex: '优Year',
              key: '优Year',
              width: 80,
            }
          ]
        },
        {
          title: '良',
          width: 240,
          children: [
            {
              title: '天数',
              dataIndex: '良',
              key: '良',
              width: 80,
            },
            {
              title: '同期天数',
              dataIndex: '良Chain',
              key: '良Chain',
              width: 80,
            },
            {
              title: '同比天数',
              dataIndex: '良Year',
              key: '良Year',
              width: 80,
            }
          ]
        },
        {
          title: '轻度污染',
          width: 240,

          children: [
            {
              title: '天数',
              dataIndex: '轻度污染',
              key: '轻度污染',
              width: 80,
            },
            {
              title: '同期天数',
              dataIndex: '轻度污染Chain',
              key: '轻度污染Chain',
              width: 80,
            },
            {
              title: '同比天数',
              dataIndex: '轻度污染Year',
              key: '轻度污染Year',
              width: 80,
            }
          ]
        },
        {
          title: '中度污染',
          width: 240,

          children: [
            {
              title: '天数',
              dataIndex: '中度污染',
              key: '中度污染',
              width: 80,
            },
            {
              title: '同期天数',
              dataIndex: '中度污染Chain',
              key: '中度污染Chain',
              width: 80,
            },
            {
              title: '同比天数',
              dataIndex: '中度污染Year',
              key: '中度污染Year',
              width: 80,
            }
          ]
        },
        {
          title: '重度污染',
          width: 240,

          children: [
            {
              title: '天数',
              dataIndex: '重度污染',
              key: '重度污染',
              width: 80,
            },
            {
              title: '同期天数',
              dataIndex: '重度污染Chain',
              key: '重度污染Chain',
              width: 80,
            },
            {
              title: '同比天数',
              dataIndex: '重度污染Year',
              key: '重度污染Year',
              width: 80,
            }
          ]
        },
        {
          title: '严重污染',
          width: 240,
          children: [
            {
              title: '天数',
              dataIndex: '严重污染',
              key: '严重污染',
              width: 80,
            },
            {
              title: '同期天数',
              dataIndex: '严重污染Chain',
              key: '严重污染Chain',
              width: 80,
            },
            {
              title: '同比天数',
              dataIndex: '严重污染Year',
              key: '严重污染Year',
              width: 80,
            }
          ]
        },
        {
          title: '总天数',
          dataIndex: 'AllDays',
          key: 'AllDays',
          width: 120,
        },
        {
          title: '有效天数',
          dataIndex: 'EffectiveDays',
          key: 'EffectiveDays',
          width: 120,
        },
        {
          title: '优良天数',
          dataIndex: 'ExcellentDays',
          key: 'ExcellentDays',
          width: 120,
        },
        {
          title: '优良率（%）',
          dataIndex: 'ExcellentRate',
          key: 'ExcellentRate',
          width: 120,
        },
      ]
    };
  }

  componentDidMount() {
    this.getPageData();
  }

  getPageData = () => {
    this.props.dispatch({
      type: "dataAnalyze/getExcellentDaysReport",
      payload: {
        BeginTime: this.state.time[0].format('YYYY-MM-DD 00:00:00'),
        EndTime: this.state.time[1].format('YYYY-MM-DD 23:59:59'),
      }
    })
  }

  exportReport = () => {
    this.props.dispatch({
      type: "dataAnalyze/excellentDaysExportReport",
      payload: {
        BeginTime: this.state.time[0].format('YYYY-MM-DD 00:00:00'),
        EndTime: this.state.time[1].format('YYYY-MM-DD 23:59:59'),
      }
    })
  }

  render() {
    const { time, columns } = this.state;
    const { loading, excellentDaysReportData, exportLoading } = this.props;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Form.Item label="统计时间">
              <RangePicker defaultValue={time} onChange={(dates, str) => {
                this.setState({
                  time: dates
                })
              }} />
            </Form.Item>
            <Form.Item>
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
                <ExportOutlined />导出
             </Button>
            </Form.Item>
          </Form>
          <SdlTable loading={loading} columns={columns} dataSource={excellentDaysReportData} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default ExcellentDaysReport;