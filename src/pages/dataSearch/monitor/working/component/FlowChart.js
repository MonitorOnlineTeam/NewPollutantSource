import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { MapInteractionCSS } from 'react-map-interaction';
import { Image,Tooltip } from 'antd';
import  styles  from "../index.less" 
import PageLoading from '@/components/PageLoading'
import QuestionTooltip from "@/components/QuestionTooltip"

import { green,red,blue,yellow,grey,gold } from '@ant-design/colors';
@connect(({ loading, working }) => ({
  visualizaData: working.visualizaData,
  loading: loading.effects["working/getVisualizationChartList"],
  visLoading:working.visLoading
}))
class FlowChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        yan:"-",
        pi:"-",
        kong:"-",
        su:"-",
        tan:"-",
        guan:"-",
        so2b:"-",
        nob:"-",
        o2b:"-",
        leng:"-",
        isStop:"-",
        yanw:"-",
        yanj:"-",
        yans:"-",
        yanls:"-",
        yanll:"-",
        ycnd:'-',

        so2ju:"-",
        so2x:"-",
        so2l1:"-",
        so2l2:"-",
        so2l:"-",
        so2lcj:"-",
        so2jc:'-',


        noju:"-",
        nox:"-",
        nol1:"-",
        nol2:"-",
        nol:"-",
        nolcj:"-",
        nojc:"-",

        no2ju:"-",
        no2x:"-",
        no2l1:"-",
        no2l2:"-",
        no2l:"-",
        no2lcj:"-",
        no2jc:"-",


        o2ju:"-",
        o2x:"-",
        o2l1:"-",
        o2l2:"-",
        o2l:"-",
        o2lcj:"-",
        o2jc:"-",

        kelix:"-",
        kelil1:"-",
        kelil2:"-",
        kelij:"-",

        zhikongmenState:"-",
        tongxunState:"-",

        zhiyso2:"-",
        zhiynox:"-",
        zhiyo2:"-",
        zhiyn2:"-",


        noxb:"-",
        isNo:false,
        isNo2:false,
        isSo2:false,
        isKe:false,
        isO2:false,

      };
  }


  so2Morepar = ()=>{
    const { so2ju,so2x,so2l1,so2l2,so2l,so2lcj,so2jc,isSo2 } = this.state
    return <>
               {isSo2?<ul>
              {so2ju!=='-' ? <li>截距：{so2ju} </li> : null}
              {so2x!=='-' ?  <li>斜率：{so2x} </li>: null}
              {so2l1!=='-' ? <li>量程1：{so2l1} </li>: null}
              {so2l2!=='-' ? <li>量程2：{so2l2} </li>: null}
              {so2l!=='-' ? <li>零点校准偏差：{so2l} </li>: null}
              {so2lcj!=='-' ?  <li>量程校准偏差：{so2lcj} </li>: null}
              {so2jc!=='-' ?  <li>检测器信号强度：{so2jc} </li>: null}
            </ul>:
             <span>暂无数据</span>
             }
            </>
  }
  noxMorepar = ()=>{
    const { noju,nox,nol1,nol2,nol,nolcj,nojc } = this.state;
    const { no2ju,no2x,no2l1,no2l2,no2l,no2lcj,no2jc,isNo,isNo2 } = this.state
    return <div>
            {
              isNo||isNo2?
            <>
          {isNo?<ul>
              <li>NO</li>
              {noju!=='-' ?   <li>截距：{noju} </li>: null}
              {nox!=='-' ?   <li>斜率：{nox} </li> : null}
              {nol1!=='-' ? <li>量程1：{nol1} </li> : null}
              {nol2!=='-' ?  <li>量程2：{nol2} </li> : null}
              {nol!=='-' ?  <li>零点校准偏差：{nol} </li> : null}
              {nolcj!=='-' ?  <li>量程校准偏差：{nolcj} </li> : null}
              {nojc!=='-' ?  <li>检测器信号强度：{nojc} </li>  : null}
            </ul> :<></>}
            {isNo2? <ul>
             <li>NO2</li>
             {no2ju!=='-' ?  <li>截距：{no2ju} </li>: null}
               {no2x!=='-' ?  <li>斜率：{no2x} </li>: null}
               {no2l1!=='-' ?  <li>量程1：{no2l1} </li>: null}
               {no2l2!=='-' ?  <li>量程2：{no2l2} </li>: null}
               {nojc!=='-' ?  <li>零点校准偏差：{no2l} </li>: null}
               {no2l !=='-'?  <li>量程校准偏差：{no2lcj} </li>: null}
               {no2jc!=='-' ?  <li>检测器信号强度：{no2jc} </li>: null}
            </ul>:<></>}
            </>
            :
            <span>暂无数据</span>
  }
            </div>
  }
  o2Morepar = ()=>{
    const { o2ju,o2x,o2l1,o2l2,o2l,o2lcj,o2jc,isO2} = this.state
    return <>
          {isO2?<ul>
            { o2ju!=='-'? <li>截距：{o2ju} </li> : null}
            { o2x!=='-'?  <li>斜率：{o2x} </li> : null}
            { o2l1!=='-'?  <li>量程1：{o2l1} </li> : null}
            { o2l2!=='-'?   <li>量程2：{o2l2} </li> : null}
            { o2l!=='-'?  <li>零点校准偏差：{o2l} </li> : null}
            { o2lcj!=='-'?  <li>量程校准偏差：{o2lcj} </li> : null}
            { o2jc!=='-'?  <li>检测器信号强度：{o2jc} </li> : null}
            </ul>:
             <span>暂无数据</span>
             }
            </>
  }

  keMorepar = ()=>{
    const { kelix,kelil1,kelil2,kelij,isKe } = this.state
    return <>
            {isKe?<ul>
              { kelix!=='-'?   <li>颗粒物稀释比（抽取）：{kelix} </li>: null}
            { kelil1!=='-'?   <li>颗粒物量程1：{kelil1} </li>: null}
            { kelil2!=='-'?   <li>颗粒物量程2：{kelil2} </li>: null}
            { kelij!=='-'?   <li>颗粒物检测器信号强度：{kelij} </li>: null}
            </ul>:
             <span>暂无数据</span>
             }
            </>
  }


  zhiyMorepar = ()=>{
    const {   zhiyso2, zhiynox,zhiyo2, zhiyn2 } = this.state
    return <>
         {zhiyso2!='-'|| zhiynox!='-' ||  zhiyo2!='-' ||  zhiyn2!='-' ? <ul>
         { zhiyso2!=='-'?    <li>SO2标气余量：{zhiyso2} </li>: null}
         { zhiynox!=='-'?    <li>NOx标气余量：{zhiynox} </li>: null}
           { zhiyo2!=='-'?    <li>O2标气余量：{zhiyo2} </li>: null}
           { zhiyn2!=='-'?    <li>N2标气余量：{zhiyn2} </li>: null}
            </ul>
            :
            <span>暂无数据</span>
            }
           </>
  }

  pageContent = (type) => {
    const { gasData, cemsList, CEMSStatus, QCStatus, pollutantValueListInfo, valveStatus, totalFlow, standardValueUtin, CEMSOpen, p1Pressure, p2Pressure, p3Pressure, p4Pressure, realtimeStabilizationTime, standardValue, qualityControlName } = this.props;
   
    const { yanw,  yanj, yans, yanls,yanll } = this.state;

    let props = {};
    if (type === "modal") {
      props = {
        defaultScale: 1.3
      }
    }
    const { yan,pi,kong,su,tan,guan,so2b,nob,o2b,leng,zhikongmenState,zhikongState,tongxunState,isStop,noxb,ycnd} = this.state;

    const So2Morepar = this.so2Morepar;
    const NoxMorepar = this.noxMorepar;
    const O2Morepar = this.o2Morepar;
    const KeMorepar = this.keMorepar;
    const ZhiyMorepar = this.zhiyMorepar;

    const ZHIKONG_STATUS = {
//       空闲（待机）（0），运行（1），
// 维护（2），故障（3），断电（5），离线（6）
// 空闲（绿色），运行（蓝色），维护（黄色），故障（红色），断电（红色），离线（灰色）
      0: <span  style={{color:green.primary}}>空闲</span>,
      1: <span  style={{color:blue.primary}} >运行</span>,
      2: <span style={{color:gold[5]}} >维护</span>,
      3: <span style={{color:red.primary}} >故障</span>,
      5: <span style={{color:red.primary}}>断电</span>,
      6: <span style={{color:grey.primary}} >离线</span>,
      "-":<span style={{color:grey.primary}} >离线</span>,
    };
    return <MapInteractionCSS style={{ position: 'relative' }}  scale={0.98} {...props} >
         {/* <img
           width={200}
           src="../../../"
    />  */}
         
        <img src="/visualization/total.png" />
  
          {isStop !=1 && isStop !=2 && isStop !=3? //锅炉状态  非1 2 3  是不正常
          <div id='fei'>
          <img src="/visualization/fei/1.gif"   className={`${styles.fei1} ${styles.commonSty}`}/>
          <img src="/visualization/fei/1.gif"   className={`${styles.fei2} ${styles.commonSty}`}/>
          <img src="/visualization/fei/1.gif"   className={`${styles.fei3} ${styles.commonSty}`}/>
          <img src="/visualization/fei/4.gif"   className={`${styles.fei4} ${styles.commonSty}`}/>
          <img src="/visualization/fei/5.gif"   className={`${styles.fei5} ${styles.commonSty}`}/>
          <img src="/visualization/fei/6.gif"   className={`${styles.fei6} ${styles.commonSty}`}/>
          </div>
          :
          <></>
           }
          {
            
            // zhikongState != 1? //运行状态下  关闭样气流向
          <div id='yang'>
          <img src="/visualization/yang/1.gif"   className={`${styles.yang1} ${styles.commonSty}`}/>
          <img src="/visualization/yang/2.gif"   className={`${styles.yang2} ${styles.commonSty}`}/>
          <img src="/visualization/yang/3.gif"   className={`${styles.yang3} ${styles.commonSty}`}/>
          <img src="/visualization/yang/4.gif"   className={`${styles.yang4} ${styles.commonSty}`}/>
          </div>
          // :
          // <></>
           }
           {
          zhikongState ==1?//运行状态下  开启质控气体流向
          <div id='zhi'>
          <img src="/visualization/zhi/1.gif"   className={`${styles.zhi3} ${styles.commonSty}`}/>
          <img src="/visualization/zhi/2.gif"   className={`${styles.zhi2} ${styles.commonSty}`}/>
          <img src="/visualization/zhi/3.gif"   className={`${styles.zhi1} ${styles.commonSty}`}/>
          <img src="/visualization/zhi/4.gif"   className={`${styles.zhi4} ${styles.commonSty}`}/>
          </div>
          :
          <></>
          }
          <>


            <span  className={`${styles.leng1} ${styles.commonSty}`}>废气流向</span>
            <span  className={`${styles.leng2} ${styles.commonSty}`}>样气流向</span>
            <span  className={`${styles.leng3} ${styles.commonSty}`}>质控气体流向</span>

     
          </>
          <>
          {isStop !=1 && isStop !=2 && isStop !=3?  <span style={{color:green.primary}} className={`${styles.guo} ${styles.commonSty}`}>锅炉</span> 
          : 
          <span style={{color:gold[5],left:75}} className={`${styles.guo} ${styles.commonSty}`}>锅炉{isStop ==3? "(停运)" :isStop ==1? "(停产)":isStop ==2?"(停炉)":''}</span>
          }
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
          
              
            {yan!=='-' ?  <li><span>截面积：</span><span>{yan}</span></li> :null }
            {pi!=='-' ? <li><span>皮托管：</span><span>{pi}</span></li> :null }
             {kong!=='-' ?  <li><span>过量空气：</span><span>{kong}</span></li>:null }
              {su!=='-' ?   <li><span>速度场：</span><span>{su}</span></li>:null }
            
             </ul>
             <ul className={`${styles.wendu} ${styles.commonSty}`}>
             {yanw!=='-' ? <li><span>温度：</span>{yanw}</li>:null }
             {yans!=='-' ?  <li><span>湿度：</span>{yans}</li>:null }
             {yanj!=='-' ?  <li><span>静压：</span>{yanj}</li>:null }
             {yanls!=='-' ?  <li><span>流速：</span>{yanls}</li>:null }
             {yanll!=='-' ?  <li><span>流量：</span>{yanll}</li>:null }
             </ul>
           </>
           <>
  <span className={`${styles.tantoutem} ${styles.commonSty}`}>{ tan!=='-' ? tan : ""}</span>
  <span className={`${styles.guanxiantem} ${styles.commonSty}`}>{guan!=='-' ? guan : ""}</span>
            <div  className={`${styles.yanchen} ${styles.commonSty}`}>
            {ycnd!=='-' ?  <span>颗粒物：{ycnd}</span> : null } 
            <Tooltip placement="top" title={<KeMorepar/>} trigger='click'>    
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
           <span>NOx：{noxb}</span>
           <Tooltip placement="top" title={<NoxMorepar/>} trigger='click'>    
           <span  className={`${styles.more}`}>更多参数</span>
           </Tooltip>
           </div>
           <div className={`${styles.o2} ${styles.commonSty}`}>
           <span>O2：{o2b}</span>
           <Tooltip placement="top" title={<O2Morepar/>} trigger='click'>    
           <span  className={`${styles.more}`}>更多参数</span>
           </Tooltip>
           </div>
           
      <div className={`${styles.leng} ${styles.commonSty}`}> 
        {leng!=='-' ? <span>冷凝器：{leng}</span> :null }
      
      </div>
           </>

           <>
           <span  style={{background:tongxunState == 1? green.primary : ""}} className={`${styles.tong} ${styles.commonSty}`}>通讯状态：
             {/* {TONGXUN_STATUS[zhikongState]} */}
             { tongxunState == 1? <span>在线</span> :   <span>离线</span>}
            </span>
           <div className={`${styles.dai} ${styles.commonSty}`}>
              {ZHIKONG_STATUS[zhikongState]}  
             <span style={{paddingTop:15}}>质控仪门：{ zhikongmenState == 0? <span style={{color:grey.primary}}>关</span> :   <span style={{color:red.primary}}>开</span>}</span>
             <Tooltip placement="top" title={<ZhiyMorepar/>} trigger='click'>    
             <span  className={`${styles.more}`}>更多参数</span>
             </Tooltip>
            </div>
           </>
          </MapInteractionCSS>
  }
  getVisualizationData=(dgimn)=>{ //获取可视化
    this.props.dispatch({
      type: "working/getVisualizationChartList",
      payload: {
        DGIMN: dgimn,
      },
      callback:(res)=>{
      
        res.map((item,index)=>{


          if(item.Code ==="stop"){ //锅炉状态
            this.setState({isStop:item.Value})
           }
       
          if(item.PollutantCode === "cems"){




             if(item.Code ==="a01016"){ //烟道截面积  
               this.setState({yan:`${item.Value==null?"-":item.Value}${item.Unit}`})
             }
             if(item.Code ==="a01030"){ //皮托管
              this.setState({pi:`${item.Value==null?"-":item.Value}`})
             }
             if(item.Code ==="a01031"){ //过量空气
              this.setState({kong:`${item.Value==null?"-":item.Value}`})
             }
             if(item.Code ==="a01032"){ //速度场
              this.setState({su:`${item.Value==null?"-":item.Value}`})
             }


             if(item.Code ==="i33003"){ //探头温度
              this.setState({tan:`${item.Value==null?"-":item.Value}${item.Unit}`})
             }
             if(item.Code ==="i33001"){ //管线温度
              this.setState({guan:`${item.Value==null?"-":item.Value}${item.Unit}`})
             }
             if(item.Code === "i33002"){ //冷凝器温度
              this.setState({leng:`${item.Value==null?"-":item.Value}${item.Unit}`})
             } 


            if(item.Code ==="i32011"){ //质控仪门状态
               this.setState({zhikongmenState:item.Value})
            }
             if(item.Code === "i32002"){ //质控仪状态
              this.setState({zhikongState:item.Value})
             } 



             
          if(item.Code ==="i33060"){ //质控仪标气余量  S02
            this.setState({zhiyso2:`${item.Value==null?"-":item.Value}${item.Unit}`}) 
          }
          if(item.Code ==="i33061"){ //质控仪标气余量  NOx标气余量
            this.setState({zhiynox:`${item.Value==null?"-":item.Value}${item.Unit}`}) 
          }
          if(item.Code ==="i33062"){ //质控仪标气余量  O2标气余量
            this.setState({zhiyo2:`${item.Value==null?"-":item.Value}${item.Unit}`}) 
          }
          if(item.Code ==="i33063"){ //质控仪标气余量  N2标气余量
            this.setState({zhiyn2:`${item.Value==null?"-":item.Value}${item.Unit}`}) 
          }






         }



         if(item.PollutantCode === "a01012"){ //烟气温度
          this.setState({yanw:`${item.Value==null ||item.Value=='-' ?"-":Number(item.Value).toFixed(2)}${item.Unit}`})
         }
         if(item.PollutantCode === "a01014"){ //烟气湿度
          this.setState({yans:`${item.Value==null||item.Value=='-'?"-":Number(item.Value).toFixed(2)}${item.Unit}`})
         }
         if(item.PollutantCode === "a00000"){ //烟气流量
          this.setState({yanll:`${item.Value==null||item.Value=='-'?"-":Number(item.Value).toFixed(2)}${item.Unit}`})
         }
         if(item.PollutantCode === "a01011"){ //烟气流速
          this.setState({yanls:`${item.Value==null||item.Value=='-'?"-":Number(item.Value).toFixed(2)}${item.Unit}`})
         }
         if(item.PollutantCode === "a01013"){ //烟气静压
          this.setState({yanj:`${item.Value==null||item.Value=='-'?"-":Number(item.Value).toFixed(2)}${item.Unit}`})
         }

  

           if(item.PollutantCode === "a21026" ){ //SO2

            if(item.DynamicType !=="3"){
              this.setState({isSo2:true})
             }
             
              if(item.DynamicType ==="3"){ // 标气浓度
                this.setState({so2b:`${item.Value==null?"-":item.Value}${item.Unit}`})
              }
              if(item.Code ==="i13007"){ //截距
                this.setState({so2ju:`${item.Value==null?"-":item.Value}${item.Unit}`})
              }
              if(item.Code ==="i13008"){ //斜
                this.setState({so2x:`${item.Value==null?"-":item.Value}`})
              }
              if(item.Code ==="i13001"){ //量程1
                this.setState({so2l1:`${item.Value==null?"-":item.Value}${item.Unit}`})
              }
              if(item.Code ==="i13050"){ //量程2
                this.setState({so2l2:`${item.Value==null?"-":item.Value}${item.Unit}`})
              }
              if(item.Code ==="i13052"){ //零点校准偏差
                this.setState({so2l:`${item.Value==null?"-":item.Value}${item.Unit}`})
              }
              if(item.Code ==="i13053"){ //量程校准偏差
                this.setState({so2lcj:`${item.Value==null?"-":item.Value}`})
              }
              if(item.Code ==="i13054"){ //监测信号强度
                this.setState({so2jc:`${item.Value==null?"-":item.Value}`})
              }
           }


           if(item.PollutantCode === "a21002"){ //NOx
              
             if(item.DynamicType ==="3"){ //标气浓度
              this.setState({noxb: `${item.Value==null?"-":item.Value}${item.Unit}`})
            }
           }



           if(item.PollutantCode === "a21003"){ //NO
          
            if(item.Code !=="i13051"){
              this.setState({isNo:true})
             }

            if(item.DynamicType ==="3"){ //标气浓度
              this.setState({nob: `${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13007"){ //截距
              this.setState({noju:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13008"){ //斜
              this.setState({nox: `${item.Value==null?"-":item.Value}`})
            }
            if(item.Code ==="i13001"){ //量程1
              this.setState({nol1:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13050"){ //量程2
              this.setState({nol2:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13052"){ //零点校准偏差
              this.setState({nol:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13053"){ //量程校准偏差
              this.setState({nolcj:`${item.Value==null?"-":item.Value}`})
            }
            if(item.Code ==="i13054"){ //监测信号强度
              this.setState({nojc:`${item.Value==null?"-":item.Value}`})
            }
           }



           if(item.PollutantCode === "a21004"){ //NO2
           

            if(item.Code !=="i13051"){
              this.setState({isNo2:true})
             }


            if(item.DynamicType ==="3"){ //标气浓度
              this.setState({no2b: `${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13007"){ //截距
              this.setState({no2ju:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13008"){ //斜
              this.setState({no2x: `${item.Value==null?"-":item.Value}`})
            }
            if(item.Code ==="i13001"){ //量程1
              this.setState({no2l1:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13050"){ //量程2
              this.setState({no2l2:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13052"){ //零点校准偏差
              this.setState({no2l:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13053"){ //量程校准偏差
              this.setState({no2lcj:`${item.Value==null?"-":item.Value}`})
            }
            if(item.Code ==="i13054"){ //监测信号强度
              this.setState({no2jc:`${item.Value==null?"-":item.Value}`})
            }
           }



  
           


           if(item.PollutantCode === "a19001"){ //O2

            if(item.DynamicType !=="3"){
              this.setState({isO2:true})
             }

            if(item.DynamicType ==="3"){ //标气浓度
              this.setState({o2b:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13007"){ //截距
              this.setState({o2ju:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13008"){ //斜
              this.setState({o2x:`${item.Value==null?"-":item.Value}`})
            }
            if(item.Code ==="i13001"){ //量程1
              this.setState({o2l1:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13050"){ //量程2
              this.setState({o2l2:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13052"){ //零点校准偏差
              this.setState({o2l:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13053"){ //量程校准偏差
              this.setState({o2lcj:`${item.Value==null?"-":item.Value}`})
            }
            if(item.Code ==="i13054"){ //监测信号强度
              this.setState({o2jc:`${item.Value==null?"-":item.Value}`})
            }
           }




    

           if(item.PollutantCode === "a34013"){ //颗粒物分析仪

             if(item.DynamicType !=="3"){
              this.setState({isKe:true})
             }

             if(item.DynamicType ==="3"){ //标气浓度
              this.setState({ycnd: `${item.Value==null?"-":item.Value}${item.Unit}`})
            }
           
            if(item.Code ==="i13055"){ //稀释比
              this.setState({kelix:`${item.Value==null?"-":item.Value}${item.Unit==null?"%":item.Unit}`})
            }
            if(item.Code ==="i13001"){ //量程1
              this.setState({kelil1:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13050"){ //量程2
              this.setState({kelil2:`${item.Value==null?"-":item.Value}${item.Unit}`})
            }
            if(item.Code ==="i13054"){ //颗粒物检测器信号强度
              this.setState({kelij:`${item.Value==null?"-":item.Value}`})
            }

           }



           if(item.Code === "status"){ //通讯状态
            this.setState({tongxunState:item.Value})
           } 


           




        })
      }
    })
  
  }
  componentDidMount(){
    this.getVisualizationData(this.props.DGIMN);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.DGIMN !== prevProps.DGIMN) {
      this.getVisualizationData(this.props.DGIMN);
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