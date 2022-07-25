import React, { PureComponent } from 'react'
import styles from '../index.less';
import { Col } from 'antd'

const statusList = [
  { text: "在线", checked: false, color: "#52c41a", value: 1, count: 21, className: "green" },
  { text: "离线", checked: false, color: "#d9d9d9", value: "0", count: 3, className: "default" },
  { text: "超标", checked: false, color: "#f5222d", value: 2, count: 3, className: "red" },
  { text: "异常", checked: false, color: "#fa8c16", value: 3, count: 1, className: "orange" },
  // { text: "备案不符", checked: false, color: "#fa8c16", value: 5, count: 1, className: "volcano" },
  // { text: "检测不合格", checked: false, color: "#faad14", value: 4, count: 1, className: "magenta" },
];

class PointState extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Col span={12} className={styles.centerWrapper}>
        <div className={styles.monitoringContainer}>
          {/* <div className={styles.title}>
                <span style={{ fontSize: 17 }}>实时监控</span>
                <Time style={{ marginLeft: 10 }} />
              </div> */}
          <p className={styles.total}>
            当前监测排口总数量<span>30</span>个
          </p>
          <ul className={styles.number}>
            {
              statusList.map(item => {
                return <li>
                  <i style={{ backgroundColor: item.color }}></i>
                  {item.text}：{item.count}个
                </li>
              })
            }
          </ul>
        </div>
      </Col>
    );
  }
}

export default PointState;