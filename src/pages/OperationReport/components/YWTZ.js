import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Menu, Empty, Badge, Skeleton } from 'antd';
import styles from '../style.less';
import BarChart from './BarChart';

const COLOR = '#21D393';

const menuStyle = {
  lineHeight: '40px',
  position: 'absolute',
  right: 0,
  top: 0,
};

const dvaPropsData = ({ OperationReport, loading }) => ({
  loading: loading.effects['OperationReport/GetOperationRecordAnalyList'],
});

const YWTZ = props => {
  const { dispatch, loading, requestParams } = props;

  const [selectedKeys, setSelectedKeys] = useState(requestParams.pollutantType);
  const [chartData, setChartData] = useState({ xAxisData: [], seriesData: [] });

  useEffect(() => {
    if (!requestParams.pollutantType) {
      setSelectedKeys('1');
    }
    onQueryData();
  }, [requestParams]);

  // 查询数据
  const onQueryData = pollutantType => {
    let _pollutantType = pollutantType || selectedKeys;

    JSON.stringify(requestParams) !== '{}' &&
      dispatch({
        type: 'OperationReport/GetOperationRecordAnalyList',
        payload: {
          ...requestParams,
          pollutantType: _pollutantType.toString(),
        },
        callback: res => {
          setChartData({
            xAxisData: Object.keys(res),
            seriesData: Object.values(res),
          });
        },
      });
  };

  // 污染物类型change
  const onChangePollutantType = e => {
    setSelectedKeys(e.selectedKeys);
    setTimeout(() => {
      onQueryData(e.selectedKeys);
    }, 0);
  };

  // 渲染污染物类型显示
  const renderPollutantMenu = () => {
    if (requestParams.pollutantType == '1') {
      return (
        <Menu.Item style={{ margin: '0 12px' }} key={'1'}>
          废水
        </Menu.Item>
      );
    }

    if (requestParams.pollutantType == '2') {
      return (
        <Menu.Item style={{ margin: '0 12px' }} key={'2'}>
          废气
        </Menu.Item>
      );
    }

    if (!requestParams.pollutantType) {
      return (
        <>
          <Menu.Item style={{ margin: '0 12px' }} key={'1'}>
            废水
          </Menu.Item>
          <Menu.Item style={{ margin: '0 12px' }} key={'2'}>
            废气
          </Menu.Item>
        </>
      );
    }
  };

  return (
    <Card
      size="small"
      title="运维台账填报数量统计"
      bodyStyle={{ height: 230, minWidth: 894 }}
      extra={
        <Menu
          mode="horizontal"
          style={menuStyle}
          selectedKeys={selectedKeys}
          onSelect={onChangePollutantType}
        >
          {renderPollutantMenu()}
        </Menu>
      }
    >
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

export default connect(dvaPropsData)(YWTZ);
