import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { MapInteractionCSS } from 'react-map-interaction';
import { Image } from 'antd';
import  styles  from "../index.less" 
import PageLoading from '@/components/PageLoading'

@connect(({ loading, working }) => ({
  visualizaData: working.visualizaData,
  loading: loading.effects["working/getVisualizationChartList"],
  visLoading:working.visLoading
}))
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


          <div id='fei'>
          <img src="/visualization/fei/1.gif"   className={`${styles.fei1} ${styles.commonSty}`}/>
          <img src="/visualization/fei/1.gif"   className={`${styles.fei2} ${styles.commonSty}`}/>
          <img src="/visualization/fei/1.gif"   className={`${styles.fei3} ${styles.commonSty}`}/>
          <img src="/visualization/fei/4.gif"   className={`${styles.fei4} ${styles.commonSty}`}/>
          <img src="/visualization/fei/5.gif"   className={`${styles.fei5} ${styles.commonSty}`}/>
          <img src="/visualization/fei/6.gif"   className={`${styles.fei6} ${styles.commonSty}`}/>
          </div>
          <div id='yang'>
          <img src="/visualization/yang/1.gif"   className={`${styles.yang1} ${styles.commonSty}`}/>
          <img src="/visualization/yang/2.gif"   className={`${styles.yang2} ${styles.commonSty}`}/>
          <img src="/visualization/yang/3.gif"   className={`${styles.yang3} ${styles.commonSty}`}/>
          <img src="/visualization/yang/4.gif"   className={`${styles.yang4} ${styles.commonSty}`}/>
          </div>
          <div id='zhi'>
          <img src="/visualization/zhi/1.gif"   className={`${styles.zhi3} ${styles.commonSty}`}/>
          <img src="/visualization/zhi/2.gif"   className={`${styles.zhi2} ${styles.commonSty}`}/>
          <img src="/visualization/zhi/3.gif"   className={`${styles.zhi1} ${styles.commonSty}`}/>
          <img src="/visualization/zhi/4.gif"   className={`${styles.zhi4} ${styles.commonSty}`}/>
          </div>
          <>
            <span  className={`${styles.leng1} ${styles.commonSty}`}>废气流向</span>
            <span  className={`${styles.leng2} ${styles.commonSty}`}>样气流向</span>
            <span  className={`${styles.leng3} ${styles.commonSty}`}>质控气体流向</span>
          </>
          <>
           <span className={`${styles.guo} ${styles.commonSty}`}>锅炉</span>
           <span className={`${styles.tuox} ${styles.commonSty}`}>脱销设施</span>
           <span className={`${styles.tuol} ${styles.commonSty}`}>脱硫设施</span>
           <span className={`${styles.chu} ${styles.commonSty}`}>除尘设施</span>
           <span  className={`${styles.yan} ${styles.commonSty}`}>烟囱</span>
           <span  className={`${styles.quyangt} ${styles.commonSty}`}>取样探头</span>
           <span  className={`${styles.quyangg} ${styles.commonSty}`}>取样管线</span>
           <span  className={`${styles.keli} ${styles.commonSty}`}>颗粒物CEMS</span>
           <span className={`${styles.cems} ${styles.commonSty}`}>CEMS</span>
           <span className={`${styles.shuju} ${styles.commonSty}`}>数据终端</span>
           <span className={`${styles.zhikong} ${styles.commonSty}`}>质控仪</span>
           </>
           <>
            <ul className={`${styles.jiemian} ${styles.commonSty}`}>
              <li>截面积</li>
              <li>皮托管</li>
              <li>过量空气</li>
              <li>速度场</li>
             </ul>
             <ul className={`${styles.wendu} ${styles.commonSty}`}>
              <li>温度：</li>
              <li>温度：</li>
              <li>静压：</li>
              <li>流速：</li>
              <li>流量：</li>
             </ul>
           </>
           <>
            <span className={`${styles.tantoutem} ${styles.commonSty}`}>80℃</span>
            <span className={`${styles.guanxiantem} ${styles.commonSty}`}>80℃</span>
            <div  className={`${styles.yanchen} ${styles.commonSty}`}>
            <span>烟尘</span>
            <span  className={`${styles.more}`} style={{marginTop:5}}>更多参数</span>
            </div>
           </>
           <>
           <div className={`${styles.so2} ${styles.commonSty}`}>
           <span>SO2</span>
           <span  className={`${styles.more}`}>更多参数</span>
           </div>
           <div className={`${styles.no} ${styles.commonSty}`}>
           <span>NO</span>
           <span  className={`${styles.more}`}>更多参数</span>
           </div>
           <div className={`${styles.o2} ${styles.commonSty}`}>
           <span>O2</span>
           <span  className={`${styles.more}`}>更多参数</span>
           </div>
           
          <div className={`${styles.leng} ${styles.commonSty}`}> <span>冷凝器：</span> </div>
           </>

           <>
           <span className={`${styles.tong} ${styles.commonSty}`}>通讯状态</span>
           <div className={`${styles.dai} ${styles.commonSty}`}>
             <span>待机</span>
             <span style={{paddingTop:15}}>质控仪门</span>
             <span  className={`${styles.more}`}>更多参数</span>
            </div>
           </>
          </MapInteractionCSS>
  }
  getVisualizationData=()=>{ //获取可视化
    this.props.dispatch({
      type: "working/getVisualizationChartList",
      payload: {
        DGIMN: this.props.DGIMN,
      }
    })
  
  }
  componentDidMount(){
    this.getVisualizationData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.getVisualizationData();
    }
  }
  render() {
    const PageContent = this.pageContent;
    return (
     <> {  this.props.visLoading?   <PageLoading /> :   <PageContent />  }</>
    );
  }
}

export default FlowChart;