import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Badge, Skeleton } from 'antd';
import styles from '../style.less';
import PieChart from './PieChart';

const COLOR = '#5169C5';

const dvaPropsData = ({ loading }) => ({
  loading: loading.effects['OperationReport/GetMissReportDataList'],
});

const QSBJ = props => {
  const { dispatch, requestParams, loading } = props;
  // 异常报警响应
  const [QSBJData, setQSBJData] = useState({
    ExceptionAlarmCount: '-', //   缺失报警次数
    ExceptionResponedCount: '-', //     缺失响应次数
    ExceptionRate: '-', //    缺失响应率
  });

  useEffect(() => {
    onQueryData();
  }, [requestParams]);

  // 查询数据
  const onQueryData = () => {
    JSON.stringify(requestParams) !== '{}' &&
      dispatch({
        type: 'OperationReport/GetMissReportDataList',
        payload: requestParams,
        callback: res => {
          setQSBJData(res);
        },
      });
  };

  return (
    <Card size="small" title="缺失报警响应统计">
      <Skeleton active loading={loading} paragraph={{ rows: 5 }}>
        <div className={styles.statisticItemBox}>
          <div className={styles.aloneBox}>
            <PieChart color={COLOR} title="缺失报警响应率" rate={QSBJData.ExceptionRate} />
            <Row className={styles.statisticItemValue}>
              <Col span={12}>
                <Badge color={COLOR} text={`报警：${QSBJData.ExceptionAlarmCount}次`} />
              </Col>
              <Col span={12}>
                <Badge color={COLOR} text={`已响应：${QSBJData.ExceptionResponedCount}次`} />
              </Col>
            </Row>
          </div>
        </div>
      </Skeleton>
    </Card>
  );
};

export default connect(dvaPropsData)(QSBJ);
