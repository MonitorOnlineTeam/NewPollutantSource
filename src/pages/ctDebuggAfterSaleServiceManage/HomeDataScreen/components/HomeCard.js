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

  useEffect(() => {
    timeTypes && getDateByTimeTypes();
  }, []);

  const getDateByTimeTypes = () => {
    let data = [];
    timeTypes.map(item => {
      switch (item) {
        case '本月':
          data.push({
            name: '本月',
            time: [moment().startOf('months'), moment().endOf('months')],
          });
          break;
        case '上月':
          data.push({
            name: '上月',
            time: [
              moment()
                .subtract(1, 'months')
                .startOf('months'),
              moment()
                .subtract(1, 'months')
                .endOf('months'),
            ],
          });
          break;
        case '本年':
          data.push({
            name: '本年',
            time: [moment().startOf('year'), moment().endOf('year')],
          });
          break;
        case '去年':
          data.push({
            name: '去年',
            time: [
              moment()
                .subtract(1, 'years')
                .startOf('years'),
              moment()
                .subtract(1, 'years')
                .endOf('years'),
            ],
          });
          break;
      }
    });
    setExtraData(data);
    onChange && onChange(data[0].time);
  };

  return (
    <div
      className={styles.boxWrapper}
      style={{ ...style, cursor: onClick ? 'pointer' : 'default' }}
    >
      <Spin spinning={!!loading} delay={200} style={{ display: 'flex' }}>
        {/* <Spin spinning={true} style={{ display: 'flex' }}> */}
        <div className={styles.headerWrapper} style={headerStyle}>
          <div className={styles.title} onClick={() => onClick && onClick()}>
            {title}
          </div>
          {timeTypes && (
            <div className={styles.extra}>
              <Radio.Group
                defaultValue={timeTypes[0]}
                className={styles.myRadio}
                style={{ lineHeight: '24px' }}
                onChange={e => {
                  onChange && onChange(e.target['data-time']);
                }}
              >
                {extraData.map(item => {
                  return (
                    <Radio.Button key={item.name} value={item.name} data-time={item.time}>
                      {item.name}
                    </Radio.Button>
                  );
                })}
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
