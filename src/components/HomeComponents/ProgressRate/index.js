import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Progress } from 'antd';
import styles from './style.less';

const ProgressRate = props => {
  const { text, percent } = props;

  const twoColors = {
    '0%': '#2C8CFC',
    '100%': '#2DCFE8',
  };

  useEffect(() => {}, []);

  return (
    <div className={styles.ProgressRateWrapper}>
      <div className={styles.label}>{text}</div>
      <div className={styles.progress}>
        <Progress percent={percent} strokeColor={twoColors} trailColor="#2F3648" showInfo={false} />
        <div className={styles.value}>{percent}%</div>
      </div>
    </div>
  );
};

export default connect()(ProgressRate);
