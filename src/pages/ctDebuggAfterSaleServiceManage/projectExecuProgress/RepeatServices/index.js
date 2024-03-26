import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Row,
  Col,
  message,
  Divider,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from './index.less';
import moment from 'moment';
import RepeatCount from './components/RepeatCount';
import RepeatProportion from './components/RepeatProportion';
import ReasonsCount from './components/ReasonsCount';
import ReasonsProportion from './components/ReasonsProportion';
import DurationTable from './components/DurationTable';

const dvaPropsData = ({ loading }) => ({});

const RepeatServices = props => {
  const [form] = Form.useForm();

  const [date, setDate] = useState(moment());

  const { dispatch } = props;

  useEffect(() => {
    GetTimeoutServiceAnalysis();
  }, [date]);

  // 获取超时服务统计
  const GetTimeoutServiceAnalysis = () => {
    dispatch({
      type: 'repeatServices/GetRepeatServiceAnalysis',
      payload: {
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  const disabledDate = current => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  const onDateChange = (date, dateString) => {
    setDate(date);
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.pageWrapper}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card bodyStyle={{ paddingTop: 18, paddingBottom: 18 }} style={{ marginBottom: 0 }}>
            年份：
            <DatePicker
              onChange={onDateChange}
              value={date}
              picker="year"
              disabledDate={disabledDate}
              allowClear={false}
            />
          </Card>
          <Row gutter={8}>
            <Col span={14}>
              <RepeatCount />
            </Col>
            <Col span={10}>
              <RepeatProportion />
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={14}>
              <ReasonsCount />
            </Col>
            <Col span={10}>
              <ReasonsProportion />
              {/* <Card title="超时原因时长占比" size="small"></Card> */}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DurationTable date={date} />
            </Col>
          </Row>
        </Space>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(RepeatServices);
