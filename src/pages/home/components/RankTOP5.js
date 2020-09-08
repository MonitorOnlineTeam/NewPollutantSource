import React, { PureComponent } from 'react';
import styles from '../Home.less';
import CustomIcon from '@/components/CustomIcon'

class RankTOP5 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.rankContainer}>
        <ul className={styles.header}>
          <li>
            排行
          </li>
          <li>区域</li>
          <li>综合</li>
          <li>执行率</li>
          <li>合格率</li>
        </ul>
        <ul>
          <li>
            <CustomIcon type="icon-yajun" className={styles.rankIcon} />
          </li>
          <li>汉江区</li>
          <li>90%</li>
          <li>90%</li>
          <li>90%</li>
        </ul>
        <ul>
          <li>
            <CustomIcon type="icon-jijun" className={styles.rankIcon} />
          </li>
          <li>昌平区</li>
          <li>80%</li>
          <li>80%</li>
          <li>80%</li>
        </ul>
        <ul>
          <li>
            <CustomIcon type="icon-guanjun" className={styles.rankIcon} />
          </li>
          <li>朝阳区</li>
          <li>77%</li>
          <li>74%</li>
          <li>80%</li>
        </ul>
        <ul>
          <li>
            <span className={styles.otherRank}>4</span>
          </li>
          <li>和平区</li>
          <li>65%</li>
          <li>60%</li>
          <li>70%</li>
        </ul>
        <ul>
          <li>
            <span className={styles.otherRank}>5</span>
          </li>
          <li>北辰区</li>
          <li>60%</li>
          <li>60%</li>
          <li>60%</li>
        </ul>
      </div>
    );
  }
}

export default RankTOP5;