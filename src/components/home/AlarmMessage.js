import React, { Component } from 'react';
import { connect } from 'dva';
import styles from '@/pages/home/index.less';
import Marquee from '@/components/Marquee'
import ReactSeamlessScroll from 'react-seamless-scroll';
@connect(({ loading, home }) => ({
  warningInfoList: home.warningInfoList,
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
      type: "home/getWarningInfo",
      payload: {
        entCode: entCode
      }
    })
  }

  render() {
    const { warningInfoList } = this.props;
    return (
      <>
        <div className={styles.title} style={{ marginBottom: 12 }}>
          <p>报警信息</p>
        </div>
        <div className={styles.marqueeContent}>
          <ReactSeamlessScroll speed={20} style={{ width: '100%', height: '100%' }}>
            {
              warningInfoList.length ? warningInfoList.map(item => {
                return <div className={styles["item-div"]}>
                  <a className={styles["item-a"]}>
                    <div>{item.desc}</div>
                  </a>
                </div>
              }) : <div className={styles.notData}>
                <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
                <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
              </div>
            }
          </ReactSeamlessScroll>
        </div>
      </>
    );
  }
}

export default AlarmMessage;