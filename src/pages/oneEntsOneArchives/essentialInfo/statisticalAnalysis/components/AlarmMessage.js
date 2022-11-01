import React, { Component } from 'react';
import { connect } from 'dva';
import styles from '../index.less';
import Marquee from '@/components/Marquees'
@connect(({ loading, oneEntAndPoint }) => ({
  warningInfoList: oneEntAndPoint.warningInfoList,
}))
class AlarmMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.getData();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.entCode !== nextProps.entCode) {
      this.getData(nextProps.entCode);
    }
  }
  getData = (entCode) => {
    const { dispatch } = this.props;
    // 获取报警信息
    dispatch({
      type: "oneEntAndPoint/getWarningInfo",
      payload: {
        entCode: entCode || this.props.entCode,
      }
    })
  }



  render() {
    const { warningInfoList } = this.props;
    return (
      <>
        <div className={styles.title} style={{ margin: '12px 10px' }}>
          <p>报警信息</p>
        </div>
        {/* <div className={styles.excessiveAbnormalContent}> */}
        <div className={styles.marqueeContent}>
          {
            warningInfoList.length ? (
              <Marquee
                data={warningInfoList}
                speed={30}
                gap={700}
                height={"100%"}
                width={400}
              />
            ) : <div className={styles.notData}>
              <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
              <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
            </div>
          }
        </div>
      </>
    );
  }
}

export default AlarmMessage;
