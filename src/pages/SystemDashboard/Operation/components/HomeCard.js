import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import styles from '../styles.less';
import { Spin, Radio } from 'antd';
import moment from 'moment';

const HomeCard = props => {
  const [extraData, setExtraData] = useState([]);

  const {
    title,
    children,
    style,
    bodyStyle,
    headerStyle,
    onClick,
    loading,
    onChange,
    timeTypes,
  } = props;

  useEffect(() => {}, []);

  return (
    <div
      className={styles.homeCard}
      style={{ ...style, cursor: onClick ? 'pointer' : 'default' }}
    >
      <Spin spinning={!!loading} delay={200} style={{ display: 'flex' }}>
        <div className={styles.headerWrapper} style={headerStyle}>
          <div className={styles.title} onClick={() => onClick && onClick()}>
            {title}
          </div>
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
