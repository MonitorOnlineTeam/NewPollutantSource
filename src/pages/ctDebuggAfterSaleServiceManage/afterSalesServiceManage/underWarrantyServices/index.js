/*
 * @Author: JiaQi
 * @Date: 2024-04-09 10:10:36
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-04-12 10:57:40
 * @Description:  质保内服务
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Radio,
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
import RegionalCountCard1 from './components/RegionalCountCard1';
import RegionalProportionCard2 from './components/RegionalProportionCard2';
import ProductCountCard3 from './components/ProductCountCard3';
import ProductProportionCard4 from './components/ProductProportionCard4';
import TableCard from './components/TableCard';

const dvaPropsData = ({ loading }) => ({});

const UnderWarrantyServices = props => {
  const [form] = Form.useForm();

  const [date, setDate] = useState(moment());
  const [type, setType] = useState(1);

  const { dispatch } = props;

  useEffect(() => {
    GetWarrantyServiceAnalysis();
  }, [date, type]);

  // 获取页面数据
  const GetWarrantyServiceAnalysis = () => {
    dispatch({
      type: 'ctAfterSalesServiceManagement/GetWarrantyServiceAnalysis',
      payload: {
        analysisDate: date.format('YYYY-MM-DD HH:mm:ss'),
        type: type,
      },
    });
  };

  const disabledDate = current => {
    return current && current > moment().endOf('day');
  };

  const onDateChange = (date, dateString) => {
    setDate(date);
  };

  const onTypeChange = e => {
    setType(e.target.value);
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.pageWrapper}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card
            size="small"
            bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
            style={{ marginBottom: 0 }}
          >
            <Space>
              <span>
                年份：
                <DatePicker
                  onChange={onDateChange}
                  value={date}
                  picker="year"
                  disabledDate={disabledDate}
                  allowClear={false}
                />
              </span>
              <Radio.Group onChange={onTypeChange} defaultValue={1}>
                <Radio.Button value={1}>按产品类型</Radio.Button>
                <Radio.Button value={2}>按服务原因</Radio.Button>
              </Radio.Group>
            </Space>
          </Card>
          <Row gutter={8}>
            <Col span={10}>
              <RegionalCountCard1 title={type === 1 ? '大区服务次数，时长' : '大区次数，时长'} />
            </Col>
            <Col span={14}>
              <RegionalProportionCard2 title={type === 1 ? '大区服务占比' : '大区占比'} />
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={17}>
              <ProductCountCard3
                title={type === 1 ? '产品类别服务次数、时长' : '服务原因次数、时长'}
              />
            </Col>
            <Col span={7}>
              <ProductProportionCard4 title={type === 1 ? '产品类别占比' : '服务原因占比'} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <TableCard date={date} type={type}/>
            </Col>
          </Row>
        </Space>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(UnderWarrantyServices);
