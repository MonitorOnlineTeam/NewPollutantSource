import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { MapInteractionCSS } from 'react-map-interaction';
import { Image,Tooltip } from 'antd';
import  styles  from "../index.less" 
import PageLoading from '@/components/PageLoading'
import QuestionTooltip from "@/components/QuestionTooltip"
@connect(({ loading, working }) => ({
  visualizaData: working.visualizaData,
  loading: loading.effects["working/getVisualizationChartList"],
  visLoading:working.visLoading
}))
class FlowChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        yan:"",
        pi:"",
        kong:"",
        su:"",
        tan:"",
        guan:"",
        so2b:"",
        nob:"",
        o2b:"",
        leng:"",

        so2ju:"",
        so2x:"",
        so2l1:"",
        so2l2:"",
        so2l:"",
        so2lcj:"",
        so2j:"",

        noju:"",
        nox:"",
        nol1:"",
        nol2:"",
        nol:"",
        nolcj:"",
        nojc:"",

        o2j:"",
        o2x:"",
        o2l1:"",
        o2l2:"",
        o2l:"",
        o2lcj:"",
        o2jc:"",
      };
  }


  so2Morepar = ()=>{
    const { so2ju,so2x,so2l1,so2l2,so2l,so2lcj,so2jc } = this.state
    return <ul>
              <li>截距：{so2ju||""} </li>
              <li>斜率：{so2x||""} </li>
              <li>量程1：{so2l1||""} </li>
              <li>量程2：{so2l2||""} </li>
              <li>零点校准偏差：{so2l||""} </li>
              <li>量程校准偏差：{so2lcj||""} </li>
              <li>零点校准偏差：{so2jc||""} </li>
            </ul>
  }
  noMorepar = ()=>{
    const { noju,nox,nol1,nol2,nol,nolcj,nojc } = this.state
    return <ul>
              <li>截距：{noju||""} </li>
              <li>斜率：{nox||""} </li>
              <li>量程1：{nol1||""} </li>
              <li>量程2：{nol2||""} </li>
              <li>零点校准偏差：{nol||""} </li>
              <li>量程校准偏差：{nolcj||""} </li>
              <li>零点校准偏差：{nojc||""} </li>
            </ul>
  }
  o2Morepar = ()=>{
    const { o2ju,o2x,o2l1,o2l2,o2l,o2lcj,o2jc } = this.state
    return <ul>
              <li>截距：{o2ju||""} </li>
              <li>斜率：{o2x||""} </li>
              <li>量程1：{o2l1||""} </li>
              <li>量程2：{o2l2||""} </li>
              <li>零点校准偏差：{o2l||""} </li>
              <li>量程校准偏差：{o2lcj||""} </li>
              <li>零点校准偏差：{o2jc||""} </li>
            </ul>
  }
  pageContent = (type) => {
    const { gasData, cemsList, CEMSStatus, QCStatus, pollutantValueListInfo, valveStatus, totalFlow, standardValueUtin, CEMSOpen, p1Pressure, p2Pressure, p3Pressure, p4Pressure, realtimeStabilizationTime, standardValue, qualityControlName } = this.props;
    let props = {};
    if (type === "modal") {
      props = {
        defaultScale: 1.3
      }
    }
    const { yan,pi,kong,su,tan,guan,so2b,nob,o2b,leng} = this.state;

    const So2Morepar = this.so2Morepar;
    const NoMorepar = this.noMorepar;
    const O2Morepar = this.o2Morepar;

    return <MapInteractionCSS style={{ position: 'relative' }}  scale={0.96} {...props} >
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
          
              
              <li>截面积{yan}</li>
              <li>皮托管{pi}</li>
              <li>过量空气{kong}</li>
              <li>速度场{su}</li>
            
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
  <span className={`${styles.tantoutem} ${styles.commonSty}`}>{tan}℃</span>
  <span className={`${styles.guanxiantem} ${styles.commonSty}`}>{guan}℃</span>
            <div  className={`${styles.yanchen} ${styles.commonSty}`}>
            <span>烟尘</span>
            <Tooltip placement="top" title={""} trigger='click'>    
            <span  className={`${styles.more}`} style={{marginTop:5}}>
              更多参数
            </span>
            </Tooltip>
            </div>
           </>
           <>
           <div className={`${styles.so2} ${styles.commonSty}`}>
           <span>SO2：{so2b}</span>
           <Tooltip placement="top" title={<So2Morepar/>} trigger='click'>    
           <span  className={`${styles.more}`}>更多参数</span>
           </Tooltip>
           </div>
           <div className={`${styles.no} ${styles.commonSty}`}>
           <span>NO：{nob}</span>
           <Tooltip placement="top" title={<NoMorepar/>} trigger='click'>    
           <span  className={`${styles.more}`}>更多参数</span>
           </Tooltip>
           </div>
           <div className={`${styles.o2} ${styles.commonSty}`}>
           <span>O2：{o2b}</span>
           <Tooltip placement="top" title={<O2Morepar/>} trigger='click'>    
           <span  className={`${styles.more}`}>更多参数</span>
           </Tooltip>
           </div>
           
      <div className={`${styles.leng} ${styles.commonSty}`}> <span>冷凝器：{leng}℃</span> </div>
           </>

           <>
           <span className={`${styles.tong} ${styles.commonSty}`}>通讯状态：在线</span>
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
      },
      callback:(res)=>{
        console.log(res)
        res.map((item,index)=>{
           if(item.Code ==="a01016"){ //烟道截面积
             this.setState({yan:item.Value||"" + item.Unit})
           }
           if(item.Code ==="a01030"){ //皮托管
            this.setState({pi:item.Value})
           }
           if(item.Code ==="a01031"){ //过量空气
            this.setState({kong:item.Value})
           }
           if(item.Code ==="a01032"){ //速度场
            this.setState({su:item.Value})
           }


           if(item.Code ==="i33003"){ //探头温度
            this.setState({tan:item.Value})
           }
           if(item.Code ==="i33001"){ //管线温度
            this.setState({guan:item.Value})
           }


           if(item.PollutantCode === "a21026" ){ //SO2
              if(item.Code ==="i13051"){ // 标气浓度
                this.setState({so2b:item.Value + item.Unit})
              }
              if(item.Code ==="i13007"){ //截距
                this.setState({so2ju:item.Value||"" + item.Unit})
              }
              if(item.Code ==="i13008"){ //斜
                this.setState({so2x:item.Value})
              }
              if(item.Code ==="i13001"){ //量程1
                this.setState({so2l1:item.Value||""  + item.Unit})
              }
              if(item.Code ==="i13050"){ //量程2
                this.setState({so2l2:item.Value||"" + item.Unit})
              }
              if(item.Code ==="i13052"){ //零点校准偏差
                this.setState({so2l:item.Value||"" + item.Unit})
              }
              if(item.Code ==="i13053"){ //量程校准偏差
                this.setState({so2lcj:item.Value})
              }
              if(item.Code ==="i13054"){ //监测信号强度
                this.setState({so2jc:item.Value})
              }
           }
           if(item.PollutantCode === "a21003"){ //NO
            if(item.Code ==="i13051"){ //标气浓度
              this.setState({nob:item.Value||"" + item.Unit})
            }
            if(item.Code ==="i13007"){ //截距
              this.setState({noju:item.Value||"" + item.Unit})
            }
            if(item.Code ==="i13008"){ //斜
              this.setState({nox:item.Value})
            }
            if(item.Code ==="i13001"){ //量程1
              this.setState({nol1:item.Value||""  + item.Unit})
            }
            if(item.Code ==="i13050"){ //量程2
              this.setState({nol2:item.Value||"" + item.Unit})
            }
            if(item.Code ==="i13052"){ //零点校准偏差
              this.setState({nol:item.Value||"" + item.Unit})
            }
            if(item.Code ==="i13053"){ //量程校准偏差
              this.setState({nolcj:item.Value})
            }
            if(item.Code ==="i13054"){ //监测信号强度
              this.setState({nojc:item.Value})
            }
           }

           if(item.PollutantCode === "a19001"){ //O2
            if(item.Code ==="i13051"){ //标气浓度
              this.setState({o2b:item.Value + item.Unit})
            }
            if(item.Code ==="i13007"){ //截距
              this.setState({o2ju:item.Value + item.Unit})
            }
            if(item.Code ==="i13008"){ //斜
              this.setState({o2x:item.Value})
            }
            if(item.Code ==="i13001"){ //量程1
              this.setState({o2l1:item.Value||""  + item.Unit})
            }
            if(item.Code ==="i13050"){ //量程2
              this.setState({o2l2:item.Value||"" + item.Unit})
            }
            if(item.Code ==="i13052"){ //零点校准偏差
              this.setState({o2l:item.Value||"" + item.Unit})
            }
            if(item.Code ==="i13053"){ //量程校准偏差
              this.setState({o2lcj:item.Value})
            }
            if(item.Code ==="i13054"){ //监测信号强度
              this.setState({o2jc:item.Value})
            }
           }



           if(item.Code === "a19001"){ //冷凝器温度
            this.setState({leng:item.Value})
           }     
           
        })
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