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
  airDayRank: dataAnalyze.airDayRank,
  loading: loading.effects["dataAnalyze/getAirDayRank"],
  exportLoading: loading.effects["dataAnalyze/exportAirDayRank"]
}))
class AirQualityDayRank extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: moment().add(-1, "day"),
      columns: [
        {
          title: '排名',
          dataIndex: 'Num',
          key: 'Num',
          width: 60,
        },
        {
          title: '监测点',
          dataIndex: 'DGIMN',
          key: 'DGIMN',
          width: 260,
        },
        {
          title: '空气质量指数',
          dataIndex: 'AQI',
          key: 'AQI',
        },
        {
          title: '首要污染物',
          dataIndex: 'PrimaryPollutant',
          key: 'PrimaryPollutant',
          render: (text, record) => {
            return text ? text : '-';
          }
        },
        {
          title: '级别',
          dataIndex: 'AirLevel',
          key: 'AirLevel',
        },
      ]
    };
  }

  componentDidMount() {
    this.getPageData();
  }

  getPageData = () => {
    this.props.dispatch({
      type: "dataAnalyze/getAirDayRank",
      payload: {
        beginTime: this.state.time.format('YYYY-MM-DD 00:00:00'),
        endTime: this.state.time.format('YYYY-MM-DD 23:59:59'),
      }
    })
  }


  exportReport = () => {
    this.props.dispatch({
      type: "dataAnalyze/exportAirDayRank",
      payload: {
        beginTime: this.state.time.format('YYYY-MM-DD 00:00:00'),
        endTime: this.state.time.format('YYYY-MM-DD 23:59:59'),
      }
    })
  }

  render() {
    const { time, columns } = this.state;
    const { loading, airDayRank, exportLoading } = this.props;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 10 }}>
            <Form.Item label="排名日期">
              <DatePicker defaultValue={time} onChange={(dates, str) => {
                this.setState({
                  time: dates
                })
              }} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
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
            <Form.Item label="发布日期">
              <p>{moment().format('YYYY-MM-DD')}</p>
            </Form.Item>
          </Form>
          <SdlTable loading={loading} columns={columns} dataSource={airDayRank} pagination={false} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default AirQualityDayRank;