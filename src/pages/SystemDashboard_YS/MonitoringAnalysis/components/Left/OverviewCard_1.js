import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Tabs } from 'antd';
import styles from '@/pages/SystemDashboard_YS/styles.less';
import HomeCard from '@/pages/SystemDashboard_YS/components/HomeCard';
import moment from 'moment';
import EntAbnormalMapModal from '@/pages/IntelligentAnalysis/abnormalWorkStatistics/components/EntAbnormalMapModal';
import TaskRecordDetails from '@/pages/EmergencyTodoList/EmergencyDetailInfoLayout';

let myChart;
const dvaPropsData = ({ sysDashboard, abnormalWorkStatistics, loading }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  regionInfo: sysDashboard.regionInfo,
  entInfo: sysDashboard.entInfo,
  time: sysDashboard.time,
  entAbnormalNumVisible: abnormalWorkStatistics.entAbnormalNumVisible,
  loading: loading.effects[`sysDashboard/GetOperationEquipmentOverview`],
});

const DeviceInfoCount = props => {
  const [open, setOpen] = useState(false);
  const [nums, setNums] = useState({
    pointCount: 0,
    normalCount: 0,
    exceptionCount: 0,
  });

  const {
    dispatch,
    time,
    loading,
    level,
    regionCode,
    entCode,
    regionInfo,
    entInfo,
    entAbnormalNumVisible,
  } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetOperationEquipmentOverview',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        setNums(res);
      },
    });
  };

  const [abnormalTitle, setAbnormalTitle] = useState('');
  const [taskRecordDetailVisible, setTaskRecordDetailVisible] = useState(false);
  const [taskRecordInfo, setTaskRecordInfo] = useState({
    title: '',
    TaskID: '',
    DGIMN: '',
  });
  const [nonOperationAbnormalVisible, setNonOperationAbnormalVisible] = useState(false);
  const [multipleTaskRecordDetailVisible, setMultipleTaskRecordDetailVisible] = useState(false);
  const [taskRecordInfoList, setTaskRecordInfoList] = useState([]);
  const onOpenModal = type => {
    switch (type) {
      case 1:
        // 打卡异常
        setAbnormalTitle('***股份有限公司 - 固废炉排放口');
        dispatch({
          type: `abnormalWorkStatistics/getPointExceptionSignList`,
          payload: {
            beginTime: '2025-02-04 00:00:00',
            endTime: '2025-02-04 23:59:59',
            DGIMN: 'hb0712wzzy1010',
            taskID: 'b8cb31ec-543b-47d1-bdd5-acf75b48db00',
          },
        }).then(res => {
          dispatch({
            type: `abnormalWorkStatistics/updateState`,
            payload: { entAbnormalNumVisible: true },
          });
        });
        break;
      case 2:
        // 任务单弹出
        setTaskRecordDetailVisible(true);
        break;
      case 3:
        // 非运维时段现场异常闯入
        setNonOperationAbnormalVisible(true);
        break;
      case 4:
        // 多个任务单弹窗
        setMultipleTaskRecordDetailVisible(true);
        break;
    }
  };

  let extraTitle = '',
    modalParams = {};
  if (level != 1 && (regionCode || entCode)) {
    if (level == 2 && regionCode) {
      extraTitle = `（${regionInfo.regionName}）`;
      modalParams.regionCode = regionCode;
    }
    if (level == 3 && entCode) {
      extraTitle = `（${regionInfo.regionName} - ${entInfo.entName}）`;
      modalParams.regionCode = regionCode;
      modalParams.entCode = entCode;
    }
  }

  return (
    <HomeCard
      title="异常运维分析"
      bodyStyle={{ padding: '0 10px' }}
      loading={loading}
      // style={{ minHeight: '24rem' }}
    >
      <div className={`${styles.DeviceInfoCountWrapper}`}>
        <div span={24} className={`${styles.center} ${styles.pointAbnormalOperation}`}>
          <Row className={styles.row} gutter={8}>
            <Col span={12} className={styles.col} onClick={() => onOpenModal(1)}>
              <div className={styles.pointAbnormalOperationItem}>
                <img src="/SystemDashboard/opera/pointNum1.png" />
                <span className={styles.text}>打卡异常</span>
                <div style={{ position: 'absolute', right: '.625rem' }}>
                  <span className={styles.num} style={{ color: '#00A3FF' }}>
                    1
                  </span>
                </div>
              </div>
            </Col>
            <Col
              span={12}
              className={styles.col}
              onClick={() => {
                setTaskRecordInfo({
                  title: '任务时间过短/过长',
                  TaskID: 'a6051759-5a06-4755-b5cd-610b4892a002',
                  DGIMN: '120110voc16001',
                });
                onOpenModal(2);
              }}
            >
              <div className={styles.pointAbnormalOperationItem}>
                <img src="/SystemDashboard/opera/pointNum2.png" />
                <span className={styles.text}>任务时间过短/过长</span>
                <div style={{ position: 'absolute', right: '.625rem' }}>
                  <span className={styles.num} style={{ color: '#00A3FF' }}>
                    1
                  </span>
                </div>
              </div>
            </Col>
            <Col
              span={12}
              className={styles.col}
              onClick={() => {
                setTaskRecordInfoList([
                  {
                    modalTitle: '标气未按期更换',
                    title: '上次标气更换',
                    TaskID: '711ffd28-fd2e-4eb9-b9f4-ffc7682d01d5',
                    DGIMN: '41030002h02050',
                    time: '2024-02-13 08:42:10',
                  },
                  {
                    title: '本次标气更换',
                    TaskID: '065924d8-e1ca-4d24-81e0-53e21e2a9b7d',
                    DGIMN: '41030002h02050',
                    time: '2025-02-07 08:14:24',
                  },
                ]);
                onOpenModal(4);
              }}
            >
              <div className={styles.pointAbnormalOperationItem}>
                <img src="/SystemDashboard/opera/pointNum3.png" />
                <span className={styles.text}>标气未按期更换</span>
                <div style={{ position: 'absolute', right: '.625rem' }}>
                  <span className={styles.num} style={{ color: '#00A3FF' }}>
                    2
                  </span>
                </div>
              </div>
            </Col>
            <Col
              span={12}
              className={styles.col}
              onClick={() => {
                setTaskRecordInfoList([
                  {
                    modalTitle: '频繁校准',
                    title: '上次校准',
                    TaskID: '2a923514-162a-4b26-83d8-13c7afa297b4',
                    DGIMN: '411403yglc0004',
                    time: '2025-01-01 15:16:13',
                  },
                  {
                    title: '本次校准',
                    TaskID: 'f8f996de-572f-4128-9138-612d6b69de94',
                    DGIMN: '411403yglc0004',
                    time: '2025-01-05 14:55:05',
                  },
                ]);
                onOpenModal(4);
              }}
            >
              <div className={styles.pointAbnormalOperationItem}>
                <img src="/SystemDashboard/opera/pointNum3.png" />
                <span className={styles.text}>频繁校准</span>
                <div style={{ position: 'absolute', right: '.625rem' }}>
                  <span className={styles.num} style={{ color: '#00A3FF' }}>
                    2
                  </span>
                </div>
              </div>
            </Col>
            <Col
              span={24}
              className={styles.col}
              onClick={() => {
                setTaskRecordInfo({
                  title: '完成时间和水印时间不符',
                  TaskID: '10abbcc1-e700-47b1-8348-9c0768015f7e',
                  DGIMN: 'noupload20221014155817',
                });
                onOpenModal(2);
              }}
            >
              <div className={styles.pointAbnormalOperationItem}>
                <img src="/SystemDashboard/opera/pointNum3.png" />
                <span className={styles.text}>完成时间与水印不符</span>
                <div style={{ position: 'absolute', right: '.625rem' }}>
                  <span className={styles.num} style={{ color: '#00A3FF' }}>
                    1
                  </span>
                </div>
              </div>
            </Col>
            <Col span={24} className={styles.col}>
              <div className={styles.pointAbnormalOperationItem}>
                <img src="/SystemDashboard/opera/pointNum3.png" />
                <span className={styles.text}>标记故障/校准无故障处理记录</span>
                <div style={{ position: 'absolute', right: '.625rem' }}>
                  <span className={styles.num} style={{ color: '#00A3FF' }}>
                    0
                  </span>
                </div>
              </div>
            </Col>
            <Col span={24} className={styles.col} onClick={() => onOpenModal(3)}>
              <div className={styles.pointAbnormalOperationItem}>
                <img src="/SystemDashboard/opera/pointNum3.png" />
                <span className={styles.text}>非运维时段现场异常闯入</span>
                <div style={{ position: 'absolute', right: '.625rem' }}>
                  <span className={styles.num} style={{ color: '#00A3FF' }}>
                    1
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      {
        // 打卡异常 弹框
        <Modal
          title={`打卡异常 - 详情`}
          visible={!!abnormalTitle}
          destroyOnClose
          wrapClassName="fullScreenModal"
          footer={null}
          mask={false}
          onCancel={() => {
            setAbnormalTitle();
          }}
        >
          <Tabs defaultActiveKey="1" style={{ height: '100%' }}>
            <Tabs.TabPane tab="任务单" key={1}>
              <TaskRecordDetails
                match={{
                  params: {
                    TaskID: '711ffd28-fd2e-4eb9-b9f4-ffc7682d01d5',
                    DGIMN: '41030002h02050',
                  },
                }}
                isHomeModal
                hideBreadcrumb
                // forwardPermis={this.state.forwardPermis}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="打卡位置及时间" key={2} style={{ padding: 0 }}>
              <EntAbnormalMapModal
                abnormalTitle={abnormalTitle}
                displayMode="page"
                // onCancel={() => {
                //   setAbnormalTitle(undefined);
                // }}
              />
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      }
      {
        // 任务单弹窗
        <Modal
          title={`${taskRecordInfo.title} - 任务详情`}
          visible={taskRecordDetailVisible}
          destroyOnClose
          wrapClassName="fullScreenModal"
          footer={null}
          mask={false}
          onCancel={() => {
            setTaskRecordDetailVisible(false);
          }}
        >
          <TaskRecordDetails
            match={{
              params: { TaskID: taskRecordInfo.TaskID, DGIMN: taskRecordInfo.DGIMN },
            }}
            isHomeModal
            hideBreadcrumb
            // forwardPermis={this.state.forwardPermis}
          />
        </Modal>
      }
      {
        // 多个任务单弹窗
        <Modal
          title={`${taskRecordInfoList[0]?.modalTitle} - 任务详情`}
          visible={multipleTaskRecordDetailVisible}
          destroyOnClose
          wrapClassName="fullScreenModal"
          footer={null}
          mask={false}
          onCancel={() => {
            setMultipleTaskRecordDetailVisible(false);
          }}
        >
          <Tabs defaultActiveKey="1" style={{ height: '100%' }} destroyInactiveTabPane={true}>
            {taskRecordInfoList.map(item => {
              return (
                <Tabs.TabPane tab={item.title + ' - ' + item.time} key={item.TaskID}>
                  <TaskRecordDetails
                    match={{
                      params: { TaskID: item.TaskID, DGIMN: item.DGIMN },
                    }}
                    isHomeModal
                    hideBreadcrumb
                    // forwardPermis={this.state.forwardPermis}
                  />
                </Tabs.TabPane>
              );
            })}
          </Tabs>
        </Modal>
      }
      {
        // 非运维时段现场异常闯入
        <Modal
          title={`非运维时段现场异常闯入`}
          visible={nonOperationAbnormalVisible}
          destroyOnClose
          wrapClassName="fullScreenModal"
          footer={null}
          mask={false}
          // bodyStyle={{ padding: '10' }}
          onCancel={() => {
            setNonOperationAbnormalVisible(false);
          }}
        >
          <img src="/yanshi/1.png" style={{ width: '100%', height: 'calc(100vh - 64px - 58px)' }} />
        </Modal>
      }
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
