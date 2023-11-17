/*
 * @Author: JiaQi 
 * @Date: 2023-05-30 14:28:55 
 * @Last Modified by:   JiaQi 
 * @Last Modified time: 2023-05-30 14:28:55 
 * @Description：运维派单次数统计
 */
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
  loading: loading.effects['OperationReport/GetOperationTaskList'],
});

const YWPD = props => {
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
        type: 'OperationReport/GetOperationTaskList',
        payload: {
          ...requestParams,
          pollutantType: _pollutantType.toString(),
        },
        callback: res => {
          if (selectedKeys == '1') {
            // 废气
            setChartData({
              xAxisData: [
                '巡检',
                '校准',
                '维修',
                '维护',
                '标准物质更换',
                '备品备件更换',
                '易耗品更换',
                '校验测试',
                '配合检查',
                '配合比对',
              ],
              seriesData: [
                res.inspectionCount,
                res.calibrationCount,
                res.repairCount,
                res.maintainReportCount,
                res.standCount,
                res.sparesCount,
                res.consumablesCount,
                res.calibrationTestCount,
                res.cooperationInspectionCount,
                res.coordinationComparisonCount,
              ],
            });
          } else {
            // 废水
            setChartData({
              xAxisData: [
                '巡检',
                '校准',
                '维修',
                '维护',
                '试剂更换',
                '备品备件更换',
                '易耗品更换',
                '校验测试',
                '配合检查',
                '配合比对',
              ],
              seriesData: [
                res.inspectionCount,
                res.calibrationCount,
                res.repairCount,
                res.maintainReportCount,
                res.reagentCount,
                res.sparesCount,
                res.consumablesCount,
                res.calibrationTestCount,
                res.cooperationInspectionCount,
                res.coordinationComparisonCount,
              ],
            });
          }
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
      title="运维派单次数统计"
      bodyStyle={{ height: 230, minWidth: 1074 }}
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

export default connect(dvaPropsData)(YWPD);
