/*
 * @Author: outman0611 jia_anbo@163.com
 * @Date: 2024-07-17 08:40:40
 * @LastEditors: outman0611 jia_anbo@163.com
 * @LastEditTime: 2024-08-09 11:48:57
 * @FilePath: \merged_master\src\pages\SystemDashboard\SupervisionVerifica\components\Left\Overview.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import moment from 'moment';
import OperatingInfo from '@/pages/newestHome/components/springModal/operatingInfo';
import { Item } from 'gg-editor';
import QuestionTooltip from '@/components/QuestionTooltip';

let myChart;
const dvaPropsData = ({ sysDashboard, loading }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  loading: loading.effects[`sysDashboard/GetSupervisionOverview`],
});

const DeviceInfoCount = props => {
  const [open, setOpen] = useState(false);
  const [nums, setNums] = useState({
    entCount: 0,
    pointCount: 0,
    qualifiedCount: 0,
    rectificationCount: 0,
    unqualifiedCount: 0,
  });

  const { dispatch, time, loading, level, regionCode, entCode } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetSupervisionOverview',
      payload: {
        pLeve: level,
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        // btime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        // etime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        setNums(res);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };
  const dataList = [
    {
      name: '排口数量',
      value: nums?.pointCount,
      iconUrl: '/SystemDashboard/supervision/zl_type1.png',
    },
    {
      name: '核查不规范',
      value: nums?.unqualifiedCount,
      iconUrl: '/SystemDashboard/supervision/zl_type2.png',
    },
    {
      name: '未核查',
      value: nums?.rectificationCount,
      iconUrl: '/SystemDashboard/supervision/zl_type3.png',
    },
    {
      name: '核查正常',
      value: nums?.qualifiedCount,
      iconUrl: '/SystemDashboard/supervision/zl_type4.png',
    },
  ];
  const valSty = {
    fontSize: '1.25rem',
    fontWeight: 500,
    color: '#C3F0FF',
    background: 'linear-gradient(to bottom, #F6FAFC, #6CBAEC)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  };
  const nameSty = {
    fontWeight: 500,
    color: '#C3F0FF',
    fontSize: '.875rem',
  };
  const ImgComponents = ({ src }) => (
    <img style={{ width: '3.3125rem', height: '3.8125rem' }} src={src} />
  );
  return (
    <HomeCard title="监督核查总览" bodyStyle={{}} loading={loading} style={{ minHeight: '16rem' }}>
      <div style={{ width: '100%', height: '100%', padding: '1rem 0' }}>
        <Row className={`${styles.SupervisionVerificaOverviewCard}`} onClick={onOpenModal}>
          {dataList.map((item, index) => (
            <Col span={12} style={{ padding: '1rem 1rem 0 1rem' }}>
              <Row align="middle" justify={index % 2 == 0 ? 'start' : 'end'}>
                {index % 2 == 0 && <ImgComponents src={item.iconUrl} />}
                <div style={{ minWidth: '70', paddingLeft: index % 2 == 0 && '.625rem' }}>
                  <p style={{ ...nameSty }}>
                    {item.name}
                    {item.name === '核查不规范' && (
                      <QuestionTooltip
                        color="#004279"
                        placement="right"
                        overlayInnerStyle={{ width: 500 }}
                        style={{ color: '#c3f0ff' }}
                        content={
                          <p style={{ fontWeight: 'bold' }}>
                            核查不规范包含：核查不规范未开始整改、整改中和整改完成的排口数量。
                          </p>
                        }
                      />
                    )}
                  </p>
                  <p style={{ ...valSty }}>
                    {item.value}
                    <span style={{ ...nameSty }}>个</span>
                  </p>
                </div>
                {index % 2 != 0 && <ImgComponents src={item.iconUrl} />}
              </Row>
            </Col>
          ))}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              // left: 'calc(50% - 2.5625rem)',
              // top: 'calc(50% - 1.75rem)',
              textAlign: 'center',
            }}
          >
            <div>
              <span
                style={{
                  ...valSty,
                  background: 'linear-gradient(to bottom, #F6FAFC, #0FAEFF)',
                  fontSize: '2rem',
                }}
              >
                {nums?.entCount}
              </span>
              <span style={{fontSize: '.875rem'}}> 家</span>
            </div>
            <div style={{ ...nameSty }}>排污单位数量</div>
          </div>
        </Row>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
