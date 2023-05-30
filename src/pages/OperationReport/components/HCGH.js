import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Menu, Empty, Badge, Skeleton } from 'antd';
import styles from '../style.less';
import BarChart from './BarChart';

const dvaPropsData = ({ OperationReport, loading }) => ({
  loading: loading.effects['OperationReport/GetConsumablesList'],
});

const HCGH = props => {
  const { dispatch, loading, requestParams } = props;
  const [chartData, setChartData] = useState({ xAxisData: [], seriesData: [] });

  useEffect(() => {
    onQueryData();
  }, [requestParams]);

  // 查询数据
  const onQueryData = () => {
    JSON.stringify(requestParams) !== '{}' &&
      dispatch({
        type: 'OperationReport/GetConsumablesList',
        payload: requestParams,
        callback: res => {
          setChartData({
            xAxisData: ['备品备件更换数量', '易耗品更换数量', '标气更换数量', '试剂更换数量'],
            seriesData: [
              res.sparePartReplaceRecordCount,
              res.consumablesReplaceCount,
              res.standardGasRepalceCoun,
              res.standardLiquidRepalceCount,
            ],
          });
        },
      });
  };

  return (
    <Card size="small" title="耗材更换统计" bodyStyle={{ height: 230 }}>
      <Skeleton active loading={loading} paragraph={{ rows: 5 }}>
        {!chartData.seriesData.length ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: '40px 0' }} />
        ) : (
          <div className={styles.statisticItemBox}>
            <BarChart chartData={chartData} />
          </div>
        )}
      </Skeleton>
    </Card>
  );
};

export default connect(dvaPropsData)(HCGH);
