import React, { PureComponent } from 'react';
import ContentItemWrapper from '../../ContentItemWrapper'
import styles from '../index.less';
import { Progress } from 'antd';

class Lixing extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ContentItemWrapper title="例行运维">
        <Progress percent={30} />
      </ContentItemWrapper>
    );
  }
}

export default Lixing;