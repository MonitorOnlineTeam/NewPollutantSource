import React, { Component } from 'react';
import { connect } from 'dva';
import styles  from '@/pages/home/index.less';
import Marquee from '@/components/Marquee'
@connect(({ loading, home }) => ({
    pointData: home.pointData,
  }))
class MonitoringStatus extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         };
    }
    componentDidMount()
    {
         this.getData();
    }
    getData=()=>{
        const{dispatch}=this.props;
        // 监控现状
        dispatch({
            type: "home/getStatisticsPointStatus",
            payload: {
            },
        });
    }
 
    render() {
        const {pointData}=this.props;
        return (
            <>
             <div className={styles.title}>
                <p>监控现状</p>
              </div>
              <div className={styles.content}>
                <div className={styles.line}>
                  <span className={styles.normal}>运行：{pointData.RuningNum}</span>
                  <span className={styles.abnormal}>异常：{pointData.ExceptionNum}</span>
                </div>
                <div className={styles.line}>
                  <span className={styles.overproof}>离线：{pointData.OffLine}</span>
                  <span className={styles.offline}>关停：{pointData.StopNum}</span>
                </div>
                <div className={styles.circular}>
                  <span>{pointData.PointTotal}</span><br />
                  <span>排放口</span>
                </div>
              </div>
             </>
        );
    }
}

export default MonitoringStatus;