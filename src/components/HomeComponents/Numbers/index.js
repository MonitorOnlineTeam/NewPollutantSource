import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Space } from 'antd';
import styles from '../StatisticNumber/style.less';

const Numbers = props => {
  const { count } = props;

  useEffect(() => {}, []);

  return (
    <Space size={6} className={`${styles.numberBox}`}>
      {Array.from(String(count), Number).map(item => {
        return (
          <div className={styles.numberItem}>
            <div className={styles.number}>{item}</div>
          </div>
        );
      })}
    </Space>
  );
};

export default connect()(Numbers);
