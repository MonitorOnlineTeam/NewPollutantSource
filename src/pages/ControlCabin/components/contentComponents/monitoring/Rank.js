import React, { PureComponent } from 'react';
import ReactSeamlessScroll from 'react-seamless-scroll';
import ContentItemWrapper from '../../ContentItemWrapper'
import styles from '../index.less';
import { Tag } from 'antd';

class Rank extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ContentItemWrapper title="污染排名" height={230}>
        <div className={styles.rankContainer}>
          <div className={styles.header}>
            <ul>
              <li>点位</li>
              <li>AQI</li>
              <li>浓度</li>
              <li>空气质量</li>
            </ul>
          </div>
          <div className={styles.rankContent}>
            {/* <ReactSeamlessScroll speed={20} style={{ width: '100%', height: '100%' }}> */}
            <ul>
              <li>XXXXXXX</li>
              <li><Tag color="#42CE17">31</Tag></li>
              <li>6.35</li>
              <li>优</li>
            </ul>
            <ul>
              <li>XXXXXXX</li>
              <li><Tag color="#EEDC32">31</Tag></li>
              <li>6.35</li>
              <li>优</li>
            </ul>
            <ul>
              <li>XXXXXXX</li>
              <li><Tag color="#42CE17">31</Tag></li>
              <li>6.35</li>
              <li>优</li>
            </ul>
            <ul>
              <li>XXXXXXX</li>
              <li><Tag color="#42CE17">31</Tag></li>
              <li>6.35</li>
              <li>优</li>
            </ul>
            {/* </ReactSeamlessScroll> */}
          </div>
        </div>
      </ContentItemWrapper>
    );
  }
}

export default Rank;