import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import styles from '../styles.less';
import { Spin, Radio } from 'antd';

const HomeCard = props => {
  const { title, children, style, bodyStyle, headerStyle, showExtra, loading } = props;

  useEffect(() => {}, []);

  return (
    <div className={styles.boxWrapper} style={style}>
      <Spin spinning={!!loading} style={{ display: 'flex' }}>
        {/* <Spin spinning={true} style={{ display: 'flex' }}> */}
        <div className={styles.headerWrapper} style={headerStyle}>
          <div className={styles.title}>{title}</div>
          {showExtra && (
            <div className={styles.extra}>
              <Radio.Group defaultValue={'month'} className={styles.myRadio} style={{ lineHeight: '24px' }}>
                <Radio.Button value="month">本月</Radio.Button>
                <Radio.Button value="year">本年</Radio.Button>
              </Radio.Group>
            </div>
          )}
        </div>
        <div className={styles.boxContent} style={bodyStyle}>
          {children}
        </div>
      </Spin>
    </div>
  );
};

HomeCard.defaultProps = {
  showExtra: true,
};

export default connect()(HomeCard);
