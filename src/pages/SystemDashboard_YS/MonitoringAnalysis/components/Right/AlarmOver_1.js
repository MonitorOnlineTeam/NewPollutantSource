import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal } from 'antd';
import styles from '@/pages/SystemDashboard_YS/styles.less';
import HomeCard from '@/pages/SystemDashboard_YS/components/HomeCard';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { bar3DrenderItem } from '@/pages/ctDebuggAfterSaleServiceManage/utils/getBar3D';
import ExceedData from '@/pages/dataSearch/exceedData/index.js';
import { fontSizeFn } from '@/pages/SystemDashboard_YS/CONST.js';
import { Numbers, StatisticNumber } from '@/components/HomeComponents';
import CluesDetails from '@/pages/AbnormalIdentifyModel/CluesList/CluesDetails';

const COLOR = ['#3AE3FD', '#00AEFF', '#FFC75D'];
const xData = ['烟尘', 'SO₂', 'NOx'];
let myChart;
const dvaPropsData = ({ loading, sysDashboard }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  regionInfo: sysDashboard.regionInfo,
  entInfo: sysDashboard.entInfo,
  time: sysDashboard.time,
  loading: loading.effects['sysDashboard/GetOverDataAnalysis'],
});

const Emissions = props => {
  const [echarts, setEcharts] = useState();
  const [counts, setCounts] = useState({
    p01: 0,
    p02: 0,
    p03: 0,
  });
  const [cluesDetailsProps, setCluesDetailsProps] = useState();

  const { dispatch, loading, time, level, regionCode, entCode, regionInfo, entInfo } = props;

  return (
    <HomeCard title="异常数据分析" style={{}} loading={loading}>
      <Row
        type="flex"
        align="middle"
        justify="space-between"
        style={{ width: '100%', height: '100%' }}
      >
        <Col
          span={12}
          align="middle"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCluesDetailsProps({
              EntNmae: '*********限公司',
              PointName: '脱硫烟囱总排口',
              WarningTypeName: '疑似样品气异常',
              ModelWarningGuid: 'e8112b80-8cc3-41e9-afe9-b4d6097aaf58',
              ModelCheckedGuid: '',
            });
          }}
        >
          <StatisticNumber value={'1'} text={'疑似样品气异常'} uiDisplayType={1} />
        </Col>
        <Col
          span={12}
          align="middle"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCluesDetailsProps({
              EntNmae: '*****************限责任公司',
              PointName: '6#脱硫出口',
              WarningTypeName: '疑似设置参数异常',
              ModelWarningGuid: '3f25925e-a2c7-47ca-b32c-65f9d2b3e938',
              ModelCheckedGuid: 'ea58c2f6-d35d-411b-98be-a42a37651f81',
            });
          }}
        >
          <StatisticNumber value={'1'} text={'疑似设置参数异常'} uiDisplayType={1} />
        </Col>
        <Col
          span={12}
          align="middle"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCluesDetailsProps({
              EntNmae: '******陶厂',
              PointName: '脱硫塔排气筒DA001',
              WarningTypeName: '疑似数据标记异常',
              ModelWarningGuid: 'dfa17d45-1a98-424d-95b5-c2a0a18a63fb',
              ModelCheckedGuid: '',
            });
          }}
        >
          <StatisticNumber value={'1'} text={'疑似数据标记异常'} uiDisplayType={1} />
        </Col>
        <Col
          span={12}
          align="middle"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCluesDetailsProps({
              EntNmae: '*********限公司',
              PointName: '2#废气总排口',
              WarningTypeName: '疑似设备异常',
              ModelWarningGuid: '21897849-56ce-4a3c-9d2e-8d5b2ee22979',
              ModelCheckedGuid: '562d5d5e-8638-4ca9-b921-7dfc6fb0e78f',
            });
          }}
        >
          <StatisticNumber value={'1'} text={'疑似设备异常'} uiDisplayType={1} />
        </Col>
      </Row>

      {
        // 模型线索弹窗
        <Modal
          title={`${cluesDetailsProps?.EntNmae} / ${cluesDetailsProps?.PointName} - ${cluesDetailsProps?.WarningTypeName}`}
          wrapClassName="fullScreenModal"
          open={cluesDetailsProps}
          destroyOnClose
          footer={false}
          onCancel={() => {
            setCluesDetailsProps();
          }}
          bodyStyle={{
            height: 'calc(100vh - 40px)',
            overflowY: 'auto',
            backgroundColor: '#f0f2f5',
            padding: 12,
          }}
        >
          {cluesDetailsProps && (
            <CluesDetails
              // showMode={showMode}
              hideBreadcrumb={true}
              // selectedClusInfo={cluesDetailsProps}
              match={{
                params: {
                  id: cluesDetailsProps.ModelWarningGuid,
                },
              }}
              location={{
                query: {
                  checkId: cluesDetailsProps.ModelCheckedGuid,
                },
              }}
            />
          )}
        </Modal>
      }
    </HomeCard>
  );
};

export default connect(dvaPropsData)(Emissions);
