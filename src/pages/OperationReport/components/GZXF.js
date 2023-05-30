import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Badge, Skeleton } from 'antd';
import styles from '../style.less';
import PieChart from './PieChart';

const COLOR = '#21D393';

const dvaPropsData = ({ OperationReport, loading }) => ({
  GZXFData: OperationReport.GZXFData,
  loading: loading.effects['OperationReport/GetOpertionExceptionList'],
});

// rate: 0, // 故障修复率
// faultAllNum: 0, // 故障总数
// faultNum: 0, // 故障修复数

const GZXF = props => {
  const {
    GZXFData: { rate, faultAllNum, faultNum },
    loading,
  } = props;

  useEffect(() => {}, []);

  return (
    <Card size="small" title="故障修复率" bodyStyle={{ height: 230 }}>
      <Skeleton active loading={loading} paragraph={{ rows: 5 }}>
        <div className={styles.statisticItemBox}>
          <div className={styles.aloneBox}>
            <PieChart color={COLOR} rate={rate} />
            <Row className={styles['statisticItemValue-workWrap']}>
              <Col span={24}>
                <Badge color={COLOR} text={`故障总数（维修工单数）：${faultAllNum}次`} />
              </Col>
              <Col span={24}>
                <Badge color={COLOR} text={`故障修复数（完成工单数）：${faultNum}次`} />
              </Col>
            </Row>
          </div>
        </div>
      </Skeleton>
    </Card>
  );
};

export default connect(dvaPropsData)(GZXF);
