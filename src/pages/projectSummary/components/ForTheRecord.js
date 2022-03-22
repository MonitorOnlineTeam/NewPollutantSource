import React, { PureComponent } from 'react';
import styles from '../Home.less';

class ForTheRecord extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.progressContainer}>
        <span className={styles.ybaNumber}>
          30个
        </span>
        <div className={styles.progress}>
          <div className={styles.yba} style={{ width: "60%" }}>
            <span>已备案排口</span>
          </div>
          <div className={styles.wba} style={{ width: "40%" }}>
            <span>未备案排口</span>
          </div>
        </div>
        <span className={styles.wbaNumber}>
          20个
        </span>
      </div>
    );
  }
}

export default ForTheRecord;