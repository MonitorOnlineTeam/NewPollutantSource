import React, { PureComponent } from 'react';
import styles from '../index.less';
import { Col } from 'antd'

class LeftWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { children, position } = this.props;
    return (
      <Col span={6} className={position === 'left' ? styles.leftWrapper : styles.rightWrapper}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {children}
          {/* <div className={styles.itemBox} style={{ height: '190px', flex: 'none' }}>
            <i className={styles.lb}></i>
            <i className={styles.rb}></i>
            <div className={styles.title}>
              <p>
                运行分析
                <img src="/01.png" alt="" />
              </p>
            </div>
          </div> */}

          {/* <div className={styles.itemBox}>
            <i className={styles.lb}></i>
            <i className={styles.rb}></i>
            <div className={styles.title}>
              <p>
                报警情况
                <img src="/01.png" alt="" />
              </p>
            </div>
          </div>

          <div className={styles.itemBox}>
            <i className={styles.lb}></i>
            <i className={styles.rb}></i>
            <div className={styles.title}>
              <p>
                空气质量日历
                <img src="/01.png" alt="" />
              </p>
            </div>
          </div> */}
        </div>
      </Col>
    );
  }
}

export default LeftWrapper;