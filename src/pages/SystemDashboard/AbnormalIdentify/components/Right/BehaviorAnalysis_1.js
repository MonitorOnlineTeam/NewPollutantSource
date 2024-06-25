import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Progress } from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '../HomeCard';
import TimelyRate from '@/pages/ctDebuggAfterSaleServiceManage/reportsViews/timelyRate';
import moment from 'moment';
import ToggleRadio from '@/pages/SystemDashboard/components/ToggleRadio.js';

const dvaPropsData = ({ loading, sysDashboard }) => ({
  actionList: sysDashboard.modalActionList,
  loading: loading.effects['sysDashboard/GetMapPointInfo'],
});

const BehaviorAnalysis = props => {
  const [open, setOpen] = useState(false);
  const [dataType, setDataType] = useState('Hours');

  const { dispatch, loading, actionList } = props;

  const color = ['#258CFF', '#1EFEDC', '#FFDE25', '#FF5858'];

  useEffect(() => {}, []);

  const onOpenModal = () => {
    setOpen(true);
  };

  return (
    <HomeCard
      title="异常行为分析"
      style={{ minHeight: 300, flex: 3 }}
      bodyStyle={{ height: 'calc(100% - 40px)' }}
      loading={loading}
    >
      <div className={styles.BehaviorAnalysisWrapper}>
        <ToggleRadio
          style={{ position: 'absolute', right: 6, top: 10, zIndex: 1 }}
          onChange={e => {
            setDataType(e.target.value);
          }}
        />
        {actionList.map((item, index) => {
          return (
            <div className={styles.legendInfo} key={item.key}>
              <p style={{ fontWeight: 'bold', marginBottom: 0, fontSize: 14, marginBottom: 1 }}>
                {item.key}
              </p>
              <div className={styles.content}>
                <Progress
                  style={{ width: '100%' }}
                  strokeWidth={10}
                  percent={item[dataType]}
                  steps={50}
                  showInfo={false}
                  strokeColor={color[index]}
                  trailColor="rgba(52,84,119,.85)"
                />
                <span className={styles.num}>{item[dataType]}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        title={`服务响应及时分析`}
        wrapClassName="fullScreenModal"
        open={open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setOpen(false);
        }}
        bodyStyle={{ padding: 0 }}
      >
        {open && <TimelyRate hideBreadcrumb modalWrapClassName="fullScreenModal" />}
      </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(BehaviorAnalysis);
