import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './style.less';

const StatisticNumber = props => {
  const { uiDisplayType, value, text } = props;

  useEffect(() => {}, []);

  return (
    <div className={`${styles.statisticBox} ${styles['statisticBox' + uiDisplayType]}`}>
      <p className={styles.number}>{value}</p>
      {uiDisplayType !== 3 && <img src={`/StandardScreen/number${uiDisplayType}.png`} />}
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default connect()(StatisticNumber);
