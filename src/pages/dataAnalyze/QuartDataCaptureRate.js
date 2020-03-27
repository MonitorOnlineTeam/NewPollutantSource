import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Icon,
  Badge
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
const { MonthPicker } = DatePicker;

class QuartDataCaptureRate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <PageHeaderWrapper>
        <div className="contentContainer">
          <Card
            bordered={false}
            extra={
              <span style={{ color: '#b3b3b3' }}>
                时间选择：
              </span>
            }
          >
            <Row>
              <Col span={24}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{
                    width: 20,
                    height: 9,
                    backgroundColor: '#52c41a',
                    display: 'inline-block',
                    borderRadius: '20%',
                    cursor: 'pointer',
                    marginRight: 3
                  }} /> <span style={{ cursor: 'pointer' }}> 排口传输有效率达标</span>
                  <div style={{
                    width: 20,
                    height: 9,
                    backgroundColor: '#f5222d',
                    display: 'inline-block',
                    borderRadius: '20%',
                    cursor: 'pointer',
                    marginLeft: 100,
                    marginRight: 3
                  }} /><span style={{ cursor: 'pointer' }}> 排口传输有效率未达标</span>
                </div>
              </Col>
            </Row>
            <Row>
              
            </Row>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default QuartDataCaptureRate;