import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import styles from '@/pages/SystemDashboard_YS/styles.less';
import { Spin, Radio } from 'antd';
import moment from 'moment';

const ToggleRadio = props => {
  const { onChange, timeTypes, style } = props;

  const radioList = props.radioList || [
    { name: '时长', value: 'Hours' },
    { name: '线索', value: 'Count' },
  ];

  useEffect(() => {}, []);

  return (
    <div className={styles.toggleRadio} style={style}>
      <Radio.Group
        defaultValue={radioList[0].value}
        className={styles.myRadio}
        style={{ lineHeight: '24px' }}
        onChange={onChange}
      >
        {radioList.map(item => {
          return (
            <Radio.Button key={item.value} value={item.value}>
              {item.name}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    </div>
  );
};

ToggleRadio.defaultProps = {
  showExtra: true,
};

export default connect()(ToggleRadio);
