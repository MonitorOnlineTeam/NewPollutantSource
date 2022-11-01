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
  addUpAirDayRank: dataAnalyze.addUpAirDayRank,
  loading: loading.effects["dataAnalyze/getAddUpAirRank"],
  exportLoading: loading.effects["dataAnalyze/exportAddUpAirRank"]
}))
class AddUpAirRankPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      columns: [
        {
          title: '排名',
          dataIndex: 'Num',
          key: 'Num',
          width: 60,
        },
        {
          title: '监测点',
          dataIndex: 'DGIMNA',
          key: 'DGIMNA',
          width: 260,
        },
        {
          title: '综合空气质量指数',
          dataIndex: 'ValueA',
          key: 'ValueA',
        },
        {
          title: '同比变化率（%）',
          dataIndex: 'ValueB',
          key: 'ValueB',
        },
      ]
    };
  }

  componentDidMount() {
    this.getPageData();
  }

  getPageData = () => {
    this.props.dispatch({
      type: "dataAnalyze/getAddUpAirRank",
      payload: {
        beginTime: this.state.time[0].format('YYYY-MM-DD 00:00:00'),
        endTime: this.state.time[1].format('YYYY-MM-DD 23:59:59'),
      }
    })
  }


  exportReport = () => {
    this.props.dispatch({
      type: "dataAnalyze/exportAddUpAirRank",
      payload: {
        beginTime: this.state.time[0].format('YYYY-MM-DD 00:00:00'),
        endTime: this.state.time[1].format('YYYY-MM-DD 23:59:59'),
      }
    })
  }

  render() {
    const { time, columns } = this.state;
    const { loading, addUpAirDayRank, exportLoading } = this.props;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form layout="inline" style={{ marginBottom: 10 }}>
            <Form.Item label="排名日期">
              <RangePicker defaultValue={time} onChange={(dates, str) => {
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
          </Form>
          <SdlTable loading={loading} columns={columns} dataSource={addUpAirDayRank} pagination={false} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default AddUpAirRankPage;