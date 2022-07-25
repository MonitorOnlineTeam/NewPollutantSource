import React, { PureComponent } from 'react';
import styles from '../index.less';
import { Button } from 'antd'


class ContentItemWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { title, height, flex, children, extra } = this.props;
    return (
      <div className={styles.itemBox} style={height ? { height: height, flex: 'none' } : { flex: flex }}>
        <i className={styles.lb}></i>
        <i className={styles.rb}></i>
        <div className={styles.title}>
          <p>
            {title}
            <img src="/01.png" alt="" />
          </p>
          <div className={styles.more}>
            {extra}
          </div>
        </div>
        <div className={styles.itemBoxContent}>
          {children}
        </div>
      </div>
    );
  }
}


ContentItemWrapper.defaultProps = {
  flex: 1,
}

export default ContentItemWrapper;