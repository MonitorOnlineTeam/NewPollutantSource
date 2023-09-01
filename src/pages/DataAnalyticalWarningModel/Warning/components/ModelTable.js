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
          let isError = item.PollutantCode === 'Error';
          let isRed = false;
          // 疑似零值微小波动（除了”波动范围“其他显示红色）
          if (WarningTypeCode === '0fa091a3-7a19-4c9e-91bd-c5a4bf2e9827') {
            if (item.PollutantName.indexOf('波动范围') === -1) {
              isRed = true;
            }
          }
          if (isError) {
            return {
              children: <b style={{ color: '#FF3333', fontSize: 16 }}>{text}</b>,
              props: { rowSpan: index === 0 ? tableData.Data.length : 0 },
            };
          } else if (isRed) {
            return {
              children: <b style={{ color: '#FF3333', fontSize: 16 }}>{text}</b>,
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
        if (
          // 污染物排放量不显示公式图片
          tableData.Column.length === 5 ||
          // 疑似单位或计算公式错误
          tableData.Column.length === 1
        ) {
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
