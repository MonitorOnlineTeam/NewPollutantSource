import React, { PureComponent } from 'react'
import styles from '../index.less'

class Button extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.button} {...this.props}>
        {this.props.children}
      </div>
    );
  }
}

export default Button;