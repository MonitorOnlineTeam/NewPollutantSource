/*
 * @Author: outman0611 jia_anbo@163.com
 * @Date: 2024-07-17 08:40:40
 * @LastEditors: outman0611 jia_anbo@163.com
 * @LastEditTime: 2024-08-07 09:17:26
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
    unqualifiedCount: 0
  });

  const { dispatch, time, loading, level, regionCode, entCode } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetSupervisionOverview',
      payload: {
        pLeve:level,
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
    { name: '排口数量', value: nums?.pointCount, iconUrl: '/SystemDashboard/supervision/zl_type1.png' },
    { name: '核查不规范', value: nums?.unqualifiedCount, iconUrl: '/SystemDashboard/supervision/zl_type2.png' },
    { name: '未核查', value: nums?.rectificationCount, iconUrl: '/SystemDashboard/supervision/zl_type3.png' },
    { name: '核查正常', value: nums?.qualifiedCount, iconUrl: '/SystemDashboard/supervision/zl_type4.png' }
  ]
  const valSty = {
    fontSize: 20,
    fontWeight: 500,
    color: '#C3F0FF',
    background: 'linear-gradient(to bottom, #F6FAFC, #6CBAEC)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  }
  const nameSty = {
    fontWeight: 500,
    color: '#C3F0FF'
  }
  const ImgComponents = ({ src }) => <img style={{ width: 53, height: 61 }} src={src} />
  return (
    <HomeCard title="监督核查总览" bodyStyle={{}} loading={loading} style={{ minHeight: 256 }}>
      <div style={{ width: '100%', height: '100%', padding: '16px 0' }}>
        <Row className={`${styles.SupervisionVerificaOverviewCard}`} onClick={onOpenModal}>
          {dataList.map((item, index) => <Col span={12} style={{ padding: '16px 16px 0 16px' }}>
            <Row align='middle' justify={index % 2 == 0 ? 'start' : 'end'}>
              {index % 2 == 0 && <ImgComponents src={item.iconUrl} />}
              <div style={{ minWidth: 70, paddingLeft: index % 2 == 0 && 10 }}>
                <p style={{ ...nameSty }}>{item.name}</p>
                <p style={{ ...valSty }}>{item.value}<span style={{ ...nameSty }}>个</span></p>
              </div>
              {index % 2 != 0 && <ImgComponents src={item.iconUrl} />}
            </Row>
          </Col>)}
          <div style={{ position: 'absolute', left: 'calc(50% - 41px)', top: 'calc(50% - 28px)', textAlign: 'center' }}>
            <div><span style={{ ...valSty, background: 'linear-gradient(to bottom, #F6FAFC, #0FAEFF)', fontSize: 32 }}>{nums?.entCount}</span> 家</div>
            <div style={{ ...nameSty }}>排污单位数量</div>
          </div>
        </Row>
      </div>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
