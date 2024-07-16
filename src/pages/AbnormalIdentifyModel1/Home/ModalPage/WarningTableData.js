import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Tabs, Button, Select, Input, Progress } from 'antd';
import WarningDataAndChart from '@/pages/AbnormalIdentifyModel/AssistDataAnalysis/components/WarningDataAndChart.js';
import CluesList from '@/pages/AbnormalIdentifyModel/CluesList';

const dvaPropsData = ({ loading, AbnormalIdentifyModel, AbnormalIdentifyModelHome }) => ({});

const WarningTableData = props => {
  const { dispatch, open, onCancel, DGIMN, date, quotaType, title, isShowCluesList } = props;

  useEffect(() => {}, []);

  return (
    <Modal
      title={`监测数据 - ${title}`}
      wrapClassName="fullScreenModal"
      open={open}
      destroyOnClose
      // open={false}
      footer={false}
      onCancel={() => {
        onCancel();
        // 重置线索表单
        dispatch({
          type: 'AbnormalIdentifyModel/onReset',
          payload: {
            modelNumber: 'all',
          },
        });
      }}
      bodyStyle={{
        paddingLeft: 0,
      }}
    >
      <Tabs defaultActiveKey="1" tabPosition="left">
        <Tabs.TabPane tab="数据列表" key="1">
          <WarningDataAndChart
            defaultShowType="data"
            quotaType={quotaType}
            DGIMN={DGIMN}
            date={date}
            tableHeight="calc(100vh - 260px)"
            displayType="modal"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="数据图表" key="2">
          <WarningDataAndChart
            defaultShowType="chart"
            DGIMN={DGIMN}
            date={date}
            chartHeight="calc(100vh - 190px)"
            displayType="modal"
          />
        </Tabs.TabPane>
        {isShowCluesList && (
          <Tabs.TabPane tab="线索清单" key="3">
            <CluesList
              showMode={'modal'}
              tableProps={{
                scroll: { y: 'calc(100vh - 320px)' },
              }}
              match={{
                params: {
                  modelNumber: 'all',
                },
              }}
            />
          </Tabs.TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

export default connect(dvaPropsData)(WarningTableData);
