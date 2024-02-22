import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tooltip, Row, Col, Modal } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { router } from 'umi';
import styles from '../styles.less';
import RanAnalysis from './components/RunAnalysis';
import RunState from './components/RunState';
import ClueStatistics from './components/ClueStatistics';
import Ranking from './components/Ranking';
import Emissions from './components/Emissions';
import MapContent from './components/MapContent';
import { CloseOutlined } from '@ant-design/icons';
import EntHomePage from '../EntHomePage/EntHomePage';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  entHomeIsOpen: AbnormalIdentifyModelHome.entHomeIsOpen,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const RegionAndIndustryPage = props => {
  const { dispatch, entHomeIsOpen } = props;
  // const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = () => {};

  return (
    <div className={styles.ScreenWrapper}>
      <header className={styles.header}>异常数据智能精准识别系统</header>
      <Tooltip title="返回菜单">
        <RollbackOutlined
          style={{
            position: 'absolute',
            zIndex: 1,
            border: '2px solid rgb(49 97 141)',
            fontSize: 16,
            padding: 4,
            cursor: 'pointer',
            fontWeight: 'bold',
            right: 22,
            top: 34,
            color: 'rgb(101, 217, 255)',
          }}
          onClick={() => {
            router.push('/AbnormalIdentifyModel/HistoryDataAnalysis/PointStatisticalAnalysis');
          }}
        />
      </Tooltip>
      <main>
        <Row
          gutter={[8, 8]}
          style={{ marginLeft: 0, width: '100%' }}
          className={styles.contentWrapper}
        >
          <Col style={{ width: '27%', minWidth: 400 }} className={styles.leftWrapper}>
            {/* 运行分析 */}
            <div>
              <RanAnalysis />
            </div>
            <div className={styles.clueStatistics}>
              <ClueStatistics />
            </div>
          </Col>
          {/* <Col
            style={{ width: '46%', minWidth: 'calc(100% - 832px)' }}
            // flex={1}
            className={styles.centerWrapper}
          > */}
          <Col style={{ maxWidth: '46%' }} flex={'auto'} className={styles.centerWrapper}>
            <div className={styles.mapWrapper}>
              <i className={styles.lt}></i>
              <i className={styles.rt}></i>
              <MapContent />
            </div>
            <div className={styles.emissionsWrapper}>
              <Emissions />
            </div>
          </Col>
          <Col style={{ width: '27%', minWidth: 400 }} className={styles.rightWrapper}>
            <div className={styles.ranStateWrapper}>
              <RunState />
            </div>
            <div className={styles.RunkingWrapper}>
              <div className={styles.Runking}>
                <Ranking title="疑似人为干预排名" type={1} modelBaseType={1} />
              </div>
              <div className={styles.Runking}>
                <Ranking title="疑似设备故障排名" type={2} modelBaseType={2} />
              </div>
            </div>
          </Col>
        </Row>
      </main>
      {entHomeIsOpen && (
        <Modal
          centered
          open={entHomeIsOpen}
          footer={null}
          closeIcon={<CloseOutlined style={{ fontSize: 0 }} />}
          wrapClassName="fullScreenModal"
          keyboard={false}
          destroyOnClose
          bodyStyle={{ maxHeight: '100vw', height: '100vh', overflowY: 'auto', padding: 0 }}
          // onCancel={onCancel}
        >
          <EntHomePage />
        </Modal>
      )}
    </div>
  );
};

export default connect(dvaPropsData)(RegionAndIndustryPage);
