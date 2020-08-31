import React, { PureComponent } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import { Image } from 'antd';
import  styles  from "../index.less" 
class FlowChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
      };
  }

  pageContent = (type) => {
    const { gasData, cemsList, CEMSStatus, QCStatus, pollutantValueListInfo, valveStatus, totalFlow, standardValueUtin, CEMSOpen, p1Pressure, p2Pressure, p3Pressure, p4Pressure, realtimeStabilizationTime, standardValue, qualityControlName } = this.props;
    let props = {};
    if (type === "modal") {
      props = {
        defaultScale: 1.3
      }
    }
    return <MapInteractionCSS style={{ position: 'relative' }} {...props}>
         {/* <img
           width={200}
           src="../../../"
    />  */}

        <img src="/visualization/total.png" />
          <>
           <span className={`${styles.guo} ${styles.commonSty}`}>锅炉</span>
           <span className={`${styles.tuox} ${styles.commonSty}`}>脱销设施</span>
           <span className={`${styles.tuol} ${styles.commonSty}`}>脱硫设施</span>
           <span className={`${styles.chu} ${styles.commonSty}`}>除尘设施</span>
           <span  className={`${styles.yan} ${styles.commonSty}`}>烟筒</span>
           <span  className={`${styles.quyangt} ${styles.commonSty}`}>取样探头</span>
           <span  className={`${styles.quyangt} ${styles.commonSty}`}>取样管线</span>
           <span  className={`${styles.quyangt} ${styles.commonSty}`}>颗粒物CEMS</span>
           <span className={`${styles.quyangt} ${styles.commonSty}`}>CEMS</span>
           <span className={`${styles.quyangt} ${styles.commonSty}`}>数据终端</span>
           <span className={`${styles.quyangt} ${styles.commonSty}`}>质控仪</span>
           </>
          </MapInteractionCSS>
  }


  render() {
    const PageContent = this.pageContent;
    return (
      // <p>工艺流程图</p>
      <PageContent />
    );
  }
}

export default FlowChart;