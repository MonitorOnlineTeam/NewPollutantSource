import React, { PureComponent } from 'react';
import LocaMap from './LocaMap'
import { Button } from 'antd'
import ScreenDarkModal from './ScreenDarkModal'
import EntWorkOrderStatistics from '@/pages/IntelligentAnalysis/operationWorkStatis/entWorkOrderStatistics/components/EntWorkOrderStatistics'
import LeftWrapperContent from './LeftWrapperContent'
import RightWrapperContent from './RightWrapperContent'
import styles from './index.less'


class Test extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { visible } = this.state;
    return (
      <div className={styles.homeWrapper} style={{ width: '100%', height: 'calc(100vh)' }}>
        {/* <Button onClick={() => this.setState({ visible: true })}>弹窗</Button> */}
        <LocaMap />
        <LeftWrapperContent />
        <RightWrapperContent />
        <ScreenDarkModal
          title="详情"
          visible={visible}
          width="80vw"
          onCancel={() => this.setState({ visible: false })}
        >
          <EntWorkOrderStatistics />
        </ScreenDarkModal>
      </div>
    );
  }
}

export default Test;
