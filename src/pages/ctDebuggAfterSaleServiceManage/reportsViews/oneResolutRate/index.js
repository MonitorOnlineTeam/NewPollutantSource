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


  // 定义一个状态来存储窗口的宽度
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 定义一个处理函数，用于更新窗口宽度的状态
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // 在组件挂载时添加事件监听器，以及在组件卸载时移除事件监听器
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // const maxWidth = 1900
  // const minWidth = 1650
  const maxWidth = 2100
  const minWidth = 1950
  return (
    <BreadcrumbWrapper>
      <div className={styles.pageWrapper}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card bodyStyle={{ paddingTop: 8, paddingBottom: 8 }} style={{ marginBottom: 0 }}>
            年份：
            <YearDatePicker value={date} onChange={onDateChange}/>
          </Card>
          <Row gutter={8}>
            <Col span={windowWidth>=maxWidth? 8 : windowWidth>=minWidth? 6 : 24}>
              <LargeRegionProductCategoryRate type={1} windowWidth={windowWidth} minWidth={minWidth}/>
            </Col>
            <Col style={{paddingTop:windowWidth>=minWidth? 0 : 8}} span={windowWidth>=maxWidth? 16 : windowWidth>=minWidth? 18 : 24}>
              <LargeRegionProductCategoryRate type={2} />
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
