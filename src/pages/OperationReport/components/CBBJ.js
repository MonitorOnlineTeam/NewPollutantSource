/*
 * @Author: JiaQi 
 * @Date: 2023-05-30 14:26:37 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-30 14:27:33
 * @Description：超标报警核实统计
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Badge, Skeleton } from 'antd';
import styles from '../style.less';
import PieChart from './PieChart';
import ReactEcharts from 'echarts-for-react';

const COLOR = '#FF5488';

const data = {
  rate: 95,
  datas: [
    {
      value: 10,
      name: '报警',
    },
    {
      value: 10,
      name: '已核实',
    },
  ],
};

const dvaPropsData = ({ OperationReport, loading }) => ({
  loading: loading.effects['OperationReport/GetAlarmVerifyRateDetail'],
  loading2: loading.effects['OperationReport/GetAlarmReport'],
  // exportLoading: loading.effects['wordSupervision/exportTaskRecord'],
});

const CBBJ = props => {
  const { dispatch, requestParams, loading, loading2 } = props;
  // 超标报警核实率
  const [CBBJData, setCBBJData] = useState({
    AlarmCount: '-',
    AllRespondedRate: '-',
    ResponedCount: '-',
  });
  // 核实结果
  const [verifyResult, setVerifyResult] = useState({
    TechnologyOver: 0, //工艺超标
    EquipmentException: 0, //监测设备故障
    EquipmentMaintain: 0, //监测设备维护
    TechnologyException: 0, //工艺设备故障
    StartAndEndFurnace: 0, //停炉启炉
    PowerFailure: 0, //停电
    Other: 0, //其他
  });

  useEffect(() => {
    onQueryData();
  }, [requestParams]);

  // 查询数据
  const onQueryData = () => {
    if (JSON.stringify(requestParams) !== '{}') {
      dispatch({
        type: 'OperationReport/GetAlarmVerifyRateDetail',
        payload: requestParams,
        callback: res => {
          if (res.AllRespondedRate !== undefined) {
            setCBBJData(res);
          } else {
            setCBBJData({
              AlarmCount: '-',
              AllRespondedRate: 0,
              ResponedCount: '-',
            });
          }
        },
      });
      dispatch({
        type: 'OperationReport/GetAlarmReport',
        payload: requestParams,
        callback: res => {
          setVerifyResult(res);
        },
      });
    }
  };

  const getOption = () => {
    const chartData = [
      {
        value: verifyResult.TechnologyOver,
        name: '工艺超标',
      },
      {
        value: verifyResult.EquipmentException,
        name: '监测设备故障',
      },
      {
        value: verifyResult.EquipmentMaintain,
        name: '监测设备维护',
      },
      {
        value: verifyResult.TechnologyException,
        name: '工艺设备故障',
      },
      {
        value: verifyResult.StartAndEndFurnace,
        name: '停炉启炉',
      },
      {
        value: verifyResult.PowerFailure,
        name: '停电',
      },
      {
        value: verifyResult.Other,
        name: '其他',
      },
    ];

    let option = {
      color: ['#FF5456', '#FFCC5E', '#21D393', '#FF7D3D', '#41B3FB', '#C2C2C2', '#795FFF'],
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: '{b}:{d}%',
        position: [10, 20],
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        top: 4,
        right: '2%',
        itemGap: 18,
        // icon: 'rect',
        itemWidth: 6,
        itemHeight: 6,
        formatter: name => {
          // console.log(name);
          const item = chartData.find(i => {
            return i.name === name;
          });
          // const p = ((item.value / sum) * 100).toFixed(0);
          return name + ' ' + item.value + '个';
        },
      },
      series: [
        {
          name: '智能质控',
          type: 'pie',
          radius: ['44%', '56%'],
          center: ['30%', '40%'],
          // avoidLabelOverlap: false,
          // hoverAnimation: false,
          // silent: true,
          itemStyle: {
            borderRadius: 20,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            normal: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: 16,
                color: 'rgba(0, 0, 0, 0.2)',
              },
              formatter: function() {
                return `核实结果`;
              },
            },
            // emphasis: {
            //   show: false,
            //   textStyle: {
            //     fontSize: '20',
            //     fontWeight: 'bold',
            //   },
            // },
          },
          data: chartData,
        },
      ],
    };
    return option;
  };

  return (
    <Card size="small" title="超标报警核实统计">
      <Skeleton active loading={loading || loading2} paragraph={{ rows: 5 }}>
        <div className={styles.statisticItemBox}>
          <div className={styles.leftBox}>
            <PieChart color={COLOR} title="超标报警核实率" rate={CBBJData.AllRespondedRate} />
            <Row className={styles.statisticItemValue}>
              <Col span={12}>
                <Badge color={COLOR} text={`报警：${CBBJData.AlarmCount}次`} />
              </Col>
              <Col span={12}>
                <Badge color={COLOR} text={`已核实：${CBBJData.ResponedCount}次`} />
              </Col>
            </Row>
          </div>
          <div className={styles.line}></div>
          <div className={styles.rightBox}>
            <ReactEcharts option={getOption()} style={{ height: 'calc(100%)', width: '100%' }} />
          </div>
        </div>
      </Skeleton>
    </Card>
  );
};

export default connect(dvaPropsData)(CBBJ);
