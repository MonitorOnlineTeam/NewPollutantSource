/*
 * @Author: lzp
 * @Date: 2019-09-05 10:57:14
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 14:22:52
 * @Description: 水气工艺流程图
 */
import React, { Component } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import styles from './ProcessFlowChart.less';
class WasteGasChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1,
            translation: { x: 0, y: 0 }
        };
    }

    //系统参数
    getsystemparam=(param,textname,unit)=>{
        return this.props.getsystemparam(param,textname,unit);
    }
   //系统状态
    getsystemstate=(param)=>{
       return this.props.getsystemstate(param);
    }
    //图片点击事件
    positionClick=(param,status,data)=>{
        this.props.positionClick(param,status,data);
    }
    render() {
        const { scale, translation } = this.state;
        return (
            <div>
                <MapInteractionCSS
                        scale={scale}
                        translation={translation}
                        onChange={({ scale, translation }) => this.setState({ scale, translation })}
                        defaultScale={1}
                        defaultTranslation={{ x: 0, y: 0 }}
                        minScale={0.05}
                        maxScale={5}
                        showControls={true}>
                        <div className={styles.imgBg1} >
                        <div onClick={()=>this.positionClick("i33003,i33004,i33001","i12110,i12105")} style={{  position: 'relative', left: '60px', 
                        top: '390px', fontWeight: '700', fontSize: '10px',width:300 }} className={styles.divClick}>{this.getsystemparam('系统采样探头温度','探头温度','°C')}</div>
                        <div style={{  position: 'relative', left: '260px', 
                        top: '380px', fontWeight: '700', fontSize: '10px' ,width:300}}
                        onClick={()=>this.positionClick("i33003,i33004,i33001","i12110,i12105")} className={styles.divClick}>{this.getsystemparam('系统采样管线温度','管线温度','°C')}</div>
                        <div style={{  position: 'relative', left: '225px', 
                        top: '580px', fontWeight: '700', fontSize: '10px',width:300 }} className={styles.divClick}>{this.getsystemparam('钢气瓶压力','钢气瓶压力','Pa')}</div>
                        <div
                         style={{  position: 'relative', left: '585px', 
                        top: '295px', fontWeight: '700', fontSize: '10px',width:300 }} 
                        
                        className={styles.divClick}>{this.getsystemparam('冷凝器温度','冷凝器温度','°C')}</div>
                        <div style={{  position: 'relative', left: '680px', 
                        top: '290px', fontWeight: '700', fontSize: '10px',width:300 }} className={styles.divClick}>{this.getsystemparam('电磁阀累计使用次数','使用次数','次')}</div>
                        <div 
                        className={`${styles.divClick} ${styles.caiyangbeng1}`}>{this.getsystemparam('采样泵累计使用时间','使用次数','次')}</div>
                        <div style={{  position: 'relative', left: '365px', 
                        top: '360px', fontWeight: '700', fontSize: '10px',width:300 }} className={styles.divClick}>{this.getsystemparam('蠕动泵累计使用时间','使用次数','次')}</div>
                        <div style={{  position: 'relative', left: '600px', 
                        top: '200px', fontWeight: '700', fontSize: '10px' ,width:300}} className={styles.divClick}>
                          {this.getsystemstate("制冷器")}
                        </div>
                        <div style={{  position: 'relative', left: '260px', 
                        top: '210px', fontWeight: '700', fontSize: '10px' ,width:300}} className={styles.divClick} 
                         onClick={()=>this.positionClick("i33003,i33004,i33001","i12110,i12105")}>
                          {this.getsystemstate("采样管线")}
                         </div>
                  
                         <div style={{  position: 'relative', left: '80px', 
                        top: '190px', fontWeight: '700', fontSize: '10px' ,width:300}} className={styles.divClick} 
                         onClick={()=>this.positionClick("i33003,i33004,i33001","i12110,i12105")}>
                           {this.getsystemstate("探头吹扫")}
                         </div>

                         <div style={{  position: 'relative', left: '375px', 
                          top: '320px', fontWeight: '700', fontSize: '10px' ,width:300}} className={styles.divClick}>
                          {this.getsystemstate("蠕动泵状态")}
                         </div>
                         <div style={{  position: 'relative', left: '805px', 
                          top: '300px', fontWeight: '700', fontSize: '10px',width:300 }} className={styles.divClick}>
                          {this.getsystemstate("废液桶液位")}
                         </div>

                         <div style={{  position: 'relative', left: '480px', 
                          top: '155px', fontWeight: '700', fontSize: '10px',width:55,height:60 }}
                          onClick={()=>this.positionClick("","i12102","s05")}
                          className={styles.divClick}>
                          {this.getsystemstate("湿度")}
                         </div>

                         <div style={{  position: 'relative', left: '120px', 
                        top: '-85px', fontWeight: '700', fontSize: '10px',width:150,height:50 }} 
                        onClick={()=>this.positionClick("","","s07,s08,b02")} className={styles.divClick}>
                         </div>

                         <div style={{  position: 'relative', left: '120px', 
                        top: '-71px', fontWeight: '700', fontSize: '10px',width:150,height:50 }} 
                        onClick={()=>this.positionClick("","","01")} className={styles.divClick}>
                         </div>

                         <div style={{ position: 'relative', left: '1000px', 
                         top: '-25px', fontWeight: '700', fontSize: '10px',width:150,height:50 }} 
                         onClick={()=>this.positionClick("","","02,03")} className={styles.divClick}> 
                         </div>
                        </div>
                    </MapInteractionCSS>
            </div>
        );
    }
}

export default WasteGasChart;