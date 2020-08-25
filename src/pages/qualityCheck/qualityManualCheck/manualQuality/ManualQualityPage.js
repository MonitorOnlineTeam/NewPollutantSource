/*
 * @Author: Jiaqi 
 * @Date: 2020-08-24 11:02:20 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-08-24 15:17:04
 * @Description: 手动质控 - 页面
 */
import React, { PureComponent } from 'react';
import { Card, Row, Col, Badge, Divider, Tag } from "antd";
import styles from "../index.less"
import { connect } from "dva"

@connect(({ qcManualCheck, loading }) => ({
  bottleDataList: qcManualCheck.bottleDataList,
}))
class ManualQualityPage extends PureComponent {
  state = {}

  componentDidMount() {
    this.getBottleDataList()
  }


  // 获取气瓶信息
  getBottleDataList = () => {
    this.props.dispatch({
      type: "qcManualCheck/getBottleDataList",
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
  }

  render() {
    const { bottleDataList } = this.props;
    return (
      <Card>
        <Row>
          <span style={{ color: "#000" }}>质控仪状态：</span>
          <Badge status="success" text="在线" style={{ color: "#52c41a" }} />
          <Divider />
        </Row>
        <div className={styles.pollutantsContainer}>
          {
            bottleDataList.map(item => {
              return <div className={styles.pollutantContent}>
                <div className={styles.pollutantInfo}>
                  <p className={styles.pollutantName}>{item.PollutantName}</p>
                  <p style={{ color: "rgb(24, 144, 255)", lineHeight: "44px" }}>标气余量：{item.Volume} {item.Unit}</p>
                </div>
                <div className={styles.button}> 零点核查 </div>
                <div className={styles.button}> 量程核查 </div>
                <div className={styles.button}> 线性核查 </div>
                <div className={styles.button}> 盲样核查 </div>
                <div className={styles.button}> 响应时间核查 </div>
              </div>
            })
          }
        </div>
        <Divider dashed />
        <div className={styles.qcLogContainer}>
          <div className={styles.logItem}>
            <p className={styles.date}>2020-08-24 15:11:15</p>
            <span className={styles.text}>
              刘志鹏向【京能集团 - 脱硫入口】，发送零点核查命令。
            </span>
          </div>
          <div className={styles.logItem}>
            <p className={styles.date}>2020-08-24 15:11:15</p>
            <span className={styles.text}>
              刘志鹏向【京能集团 - 脱硫入口】，发送零点核查命令。 <Tag color="#87d068">查看质控过程</Tag>
            </span>
          </div>
          <div className={styles.logItem}>
            <p className={styles.date}>2020-08-24 15:11:15</p>
            <span className={styles.text}>
              刘志鹏向【京能集团 - 脱硫入口】，发送零点核查命令。
            </span>
          </div>
        </div>
      </Card>
    );
  }
}

export default ManualQualityPage;