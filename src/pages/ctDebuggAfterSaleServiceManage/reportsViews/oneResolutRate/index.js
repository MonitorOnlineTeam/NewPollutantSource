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
import YearDatePicker from '@/components/RangePicker/YearDatePicker';
import LargeRegionProductCategoryRate from './components/LargeRegionProductCategoryRate';
import DurationTable from './components/DurationTable';

const dvaPropsData = ({ loading }) => ({});

const Index = props => {
  const [form] = Form.useForm();

  const [date, setDate] = useState(moment());

  const { dispatch } = props;

  useEffect(() => {
    GetDisposableRateList();
  }, [date]);

  // 获取大区质保内服务一次解决率和产品类别质保内一次解决率
  const GetDisposableRateList = () => {
    dispatch({
      type: 'oneResolutRate/GetDisposableRateList',
      payload: {
        analysisDate: date&&date.format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };



  const onDateChange = (date, dateString) => {
    setDate(date);
  };
  return (
    <BreadcrumbWrapper>
      <div className={styles.pageWrapper}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card bodyStyle={{ paddingTop: 8, paddingBottom: 8 }} style={{ marginBottom: 0 }}>
            年份：
            <YearDatePicker value={date} onChange={onDateChange}/>
          </Card>
          <Row gutter={8}>
            <Col span={8}>
              <LargeRegionProductCategoryRate type={1}/>
            </Col>
            <Col span={16}>
              <LargeRegionProductCategoryRate type={2}/>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DurationTable />
            </Col>
          </Row>
        </Space>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Index);
