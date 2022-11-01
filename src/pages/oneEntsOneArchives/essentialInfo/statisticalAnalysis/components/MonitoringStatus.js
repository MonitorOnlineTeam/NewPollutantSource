import React, { Component } from 'react';
import { connect } from 'dva';
import styles  from '../index.less';
import Marquee from '@/components/Marquee'
@connect(({ loading, oneEntAndPoint }) => ({
    pointData: oneEntAndPoint.pointData,
  }))
class MonitoringStatus extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         };
    }
    componentDidMount()  {
         const { entCode } = this.props;
         this.getData(entCode);
    }
    getData=(entCode)=>{
        const{dispatch}=this.props;
        // 监控现状
        dispatch({
            type: "oneEntAndPoint/getStatisticsPoint",
            payload: {
              entCode:entCode
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