import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Divider, Space } from 'antd';
import SdlTable from '@/components/SdlTable';
import styles from '../../styles.less';

const dvaPropsData = ({ loading, wordSupervision }) => ({});

const ModelTable = props => {
  const { tableData, WarningTypeCode } = props;

  useEffect(() => {}, []);

  const getColumns = () => {
    let columns = tableData.Column.map(item => {
      return {
        title: item.PollutantName,
        dataIndex: item.PollutantCode,
        key: item.PollutantCode,
        render: (text, record, index) => {
          if (item.PollutantCode === 'Error') {
            return {
              children: <b style={{ color: '#FF3333', fontSize: 16 }}>{text}</b>,
              props: { rowSpan: index === 0 ? tableData.Data.length : 0 },
            };
          } else {
            return text;
          }
        },
      };
    });

    return [
      {
        title: '时间',
        dataIndex: 'Time',
        key: 'Time',
      },
      ...columns,
    ];
  };

  const getFormula = () => {
    if (WarningTypeCode === 'a59cce2a-8558-4c42-8a45-4d8402e4b29d') {
      // 疑似计算公式错误
      console.log('tableData.Column.length', tableData.Column.length);
      if (tableData.Column.length === 6) {
        return (
          <div className={styles.formulaBox}>
            <p className={styles.title}>折算值计算公式</p>
            <img src="/dataModal/1.png" />
          </div>
        );
      } else {
        if (tableData.Column.length === 5) {
          // 污染物排放量不显示公式图片
          return '';
        }
        return (
          <>
            <div className={styles.formulaBox}>
              <p className={styles.title}>烟气流量计算公式</p>
              <img src="/dataModal/2.png" />
            </div>
            {/* <Divider type='vertical' /> */}
            <div className={styles.formulaBox}>
              <p className={styles.title}>湿烟气流量计算公式</p>
              <img src="/dataModal/3.png" />
            </div>
          </>
        );
      }
    }
  };

  return (
    <>
      <SdlTable
        align="center"
        columns={getColumns()}
        dataSource={tableData.Data}
        pagination={false}
      />
      <div className={styles.formulaImageWrapper}>
        <Space size={20}>{getFormula()}</Space>
      </div>
    </>
  );
};

export default connect(dvaPropsData)(ModelTable);
