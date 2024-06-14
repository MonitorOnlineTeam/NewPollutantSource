/*
 * @Author: JiaQi 
 * @Date: 2023-05-30 14:29:12 
 * @Last Modified by:   JiaQi 
 * @Last Modified time: 2023-05-30 14:29:12 
 * @Description：运维情况统计
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Badge, Skeleton } from 'antd';
import styles from '../style.less';
import ReactEcharts from 'echarts-for-react';

const COLOR = '#21D393';

const dvaPropsData = ({ OperationReport, loading }) => ({
  loading: loading.effects['OperationReport/GetOperationPlanTaskRate'],
});

const YWQK = props => {
  const { dispatch, loading, requestParams } = props;

  // 运维情况统计
  const [YWQKData, setYWQKData] = useState({
    inspectionCompleteCount: '-', // 巡检 - 计划内完成次数
    inspectionCloseCount: '-', // 巡检 - 计划内结束次数
    inspectionRate: '-', // 巡检完成率
    calibrationCompleteCount: '-', // 校准-计划内完成次数
    calibrationCloseCount: '-', // 校准-计划内结束次数
    calibrationRate: '-', // 校准完成率
  });

  useEffect(() => {
    onQueryData();
  }, [requestParams]);

  // 查询数据
  const onQueryData = () => {
    JSON.stringify(requestParams) !== '{}' &&
      dispatch({
        type: 'OperationReport/GetOperationPlanTaskRate',
        payload: requestParams,
        callback: res => {
          setYWQKData(res);
        },
      });
  };

  const getOption = (title, rate) => {
    let _rate = rate === '-' ? 0 : rate;
    let option = {
      color: ['#4C84FF', '#3FDCF3'],
      legend: {
        orient: 'vertical',
        x: 'left',
        data: [],
      },
      angleAxis: {
        max: 100,
        show: false,
      },
      series: [
        {
          name: '智能质控',
          type: 'pie',
          radius: ['44%', '56%'],
          top: -30,
          // silent: true,
          avoidLabelOverlap: false,
          hoverAnimation: false,
          silent: true,
          itemStyle: {
            borderRadius: 20,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            normal: {
              show: true,
              position: 'center',
              padding: [14, 0, 0, 0],
              formatter: function() {
                const label = rate === '-' ? '-' : rate + '%';
                return [`{a|${label}}`, `{b|${title}}`].join('\n');
              },
              rich: {
                a: {
                  fontSize: 16,
                  color: 'rgba(0, 0, 0, 0.5)',
                },
                b: {
                  fontSize: 12,
                  height: 30,
                  color: 'rgba(0, 0, 0, 0.5)',
                },
              },
              // textStyle: {
              //   fontSize: 16,
              //   color: 'rgba(0, 0, 0, 0.5)',
              // },
            },
          },
          data: [
            {
              value: _rate,
              name: '完成',
            },
            {
              value: 100 - _rate,
              name: '未完成',
            },
          ],
        },
      ],
    };
    return option;
  };

  return (
    <Card size="small" title="运维情况统计" bodyStyle={{ height: 230 }}>
      <Skeleton active loading={loading} paragraph={{ rows: 5 }}>
        <div className={styles.statisticItemBox}>
          <div className={styles.aloneBox}>
            <ReactEcharts
              option={getOption('巡检完成率', YWQKData.inspectionRate)}
              style={{ height: 'calc(100% - 40px)', width: '100%' }}
            />
            <Row className={styles['statisticItemValue-workWrap']}>
              <Col span={24}>
                <Badge color={COLOR} text={`计划内结束次数：${YWQKData.inspectionCloseCount}`} />
              </Col>
              <Col span={24}>
                <Badge color={COLOR} text={`计划内完成次数：${YWQKData.inspectionCompleteCount}`} />
              </Col>
            </Row>
          </div>
          <div className={styles.aloneBox}>
            <ReactEcharts
              option={getOption('校准完成率', YWQKData.calibrationRate)}
              style={{ height: 'calc(100% - 40px)', width: '100%' }}
            />
            <Row className={styles['statisticItemValue-workWrap']}>
              <Col span={24}>
                <Badge color={COLOR} text={`计划内结束次数：${YWQKData.calibrationCloseCount}`} />
              </Col>
              <Col span={24}>
                <Badge
                  color={COLOR}
                  text={`计划内完成次数：${YWQKData.calibrationCompleteCount}`}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Skeleton>
    </Card>
  );
};

export default connect(dvaPropsData)(YWQK);
