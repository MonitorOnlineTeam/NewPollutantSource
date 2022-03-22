/*
 * @Author: Jiaqi 
 * @Date: 2020-05-26 10:30:38 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-02 15:35:49
 * @Description: 大屏 - 监控现状组件
 */
import React, { Component } from 'react'
import styles from '../index.less'
import { connect } from 'dva';

@connect(({ loading, newHome }) => ({
  monitoringData: newHome.monitoringData,
}))
class Monitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: "newHome/getMonitoringData",
    })
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.RegionCode !== nextProps.RegionCode) {
      
  //   }
  // }


  render() {
    const { monitoringData } = this.props;
    return (
      <div className={styles["group-item"]}>
        <div className={styles["item-title"]}>
          监控现状
            </div>
        <div className={styles["item-content"]}>
          <div className={styles.monitoring}>
            <ul>
              <li></li>
              <li>在线</li>
              <li>离线</li>
              <li>异常</li>
              <li>超标</li>
            </ul>
            {
              monitoringData.map(item => {
                return <ul>
                  <li>{item.pollutantName}</li>
                  <li className={styles.num}>{item.normalCount}</li>
                  <li className={styles.num}>{item.unLineCount}</li>
                  <li className={styles.num}>{item.exceptionCount}</li>
                  <li className={styles.num}>{item.overcCount}</li>
                </ul>
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Monitoring;