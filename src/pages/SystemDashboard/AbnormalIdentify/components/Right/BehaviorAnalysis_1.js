import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Progress } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard.js';
import ToggleRadio from '@/pages/SystemDashboard/components/ToggleRadio.js';
import AbnormalDataAnalysis from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis';

const dvaPropsData = ({ loading, sysDashboard }) => ({
  time: sysDashboard.time,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  actionList: sysDashboard.modalActionList,
  loading: loading.effects['sysDashboard/GetMapPointInfo'],
});

const BehaviorAnalysis = props => {
  const [open, setOpen] = useState(false);
  const [dataType, setDataType] = useState('Hours');

  const { dispatch, loading, actionList, entCode, regionCode, time } = props;

  const color = ['#258CFF', '#1EFEDC', '#FFDE25', '#FF5858'];

  useEffect(() => {}, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard
      title="异常成因分析"
      style={{ flex: 3 }}
      bodyStyle={{ height: 'calc(100% - 2.5rem)' }}
      loading={loading}
      onExtraClick={onOpenModal}
    >
      <div className={styles.BehaviorAnalysisWrapper}>
        <ToggleRadio
          style={{ position: 'absolute', right: '.375rem', top: '.625rem', zIndex: 1 }}
          onChange={e => {
            setDataType(e.target.value);
          }}
        />
        {actionList.map((item, index) => {
          return (
            <div className={styles.legendInfo} key={item.key} onClick={onOpenModal}>
              <p style={{ fontWeight: 'bold', marginBottom: 0, fontSize: '.875rem', marginBottom: 1 }}>
                {item.key}
              </p>
              <div className={styles.content}>
                <Progress
                  style={{ width: '100%' }}
                  strokeWidth={10}
                  percent={item[dataType + 'Per']}
                  steps={50}
                  showInfo={false}
                  strokeColor={color[index]}
                  trailColor="rgba(52,84,119,.85)"
                />
                <span className={styles.num}>{item[dataType + 'Per']}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        title={'异常数据成因分析'}
        wrapClassName="fullScreenModal"
        destroyOnClose
        open={open}
        footer={false}
        onCancel={() => setOpen(false)}
        bodyStyle={{ padding: 0 }}
      >
        {open && (
          <AbnormalDataAnalysis
            time={time}
            location={{
              pathname: '/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis/action',
            }}
            regionCode={regionCode}
            entCode={entCode}
            rtnType={dataType === 'Hours' ? 'hours' : 'nums'}
            wrapClassName={'fullScreenModal'}
          />
        )}
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(BehaviorAnalysis);
