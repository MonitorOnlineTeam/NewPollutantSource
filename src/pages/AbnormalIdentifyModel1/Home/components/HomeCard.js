import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import styles from '../styles.less';
import { Spin } from 'antd';

const HomeCard = props => {
  const { title, children, style, bodyStyle, headerStyle, extra, loading } = props;

  useEffect(() => {}, []);

  return (
    <div className={styles.boxWrapper} style={style}>
      <Spin spinning={!!loading} style={{ display: 'flex' }}>
        {/* <Spin spinning={true} style={{ display: 'flex' }}> */}
        <div className={styles.headerWrapper} style={headerStyle}>
          <div className={styles.title}>{title}</div>
          {extra && <div className={styles.extra}>{extra}</div>}
        </div>
        <div className={styles.boxContent} style={bodyStyle}>
          {children}
        </div>
      </Spin>
    </div>
  );
};

export default connect()(HomeCard);
