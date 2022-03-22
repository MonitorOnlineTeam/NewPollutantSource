import React, { Component } from 'react';
import { connect } from 'dva';
import styles  from '../index.less';
import Marquee from '@/components/Marquee';
import ReactEcharts from 'echarts-for-react';
import { Row, Col  } from 'antd';

@connect(({ loading, home }) => ({
    AllMonthEmissionsByPollutant: home.AllMonthEmissionsByPollutant,
    ycTitle:home.ycTitle,
    erhlTitle:home.erhlTitle,
    dyTitle:home.dyTitle,
  }))

class MonitoringStatus extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          echartTitle : ''
         };
    }
    componentDidMount()
    {
       this.getData(this.props.entCode);
    }

    componentWillReceiveProps(nextProps)
    {
        if (this.props.DGIMN !== nextProps.DGIMN || this.props.entCode !== nextProps.entCode) {
             this.getData(nextProps.entCode,nextProps.DGIMN);
        }
    }
    getData=(entCode,DGIMN)=>{
        const{dispatch}=this.props;
        // 获取排污许可情况
        dispatch({
            type: "home/getAllMonthEmissionsByPollutant",
            payload: {
              EntCode: entCode || undefined,
              DGIMN
            }
          })
    }


      // 排污情况图表
  getlicense = (type) => {
    const {
      ycdate,
      ycdata,
      ycAnalData,
      eyhldate,
      eyhldata,
      eyhlAnalData,
      dyhwdate,
      dyhwdata,
      dyhwAnalData,
    } = this.props.AllMonthEmissionsByPollutant;
    let currentMonth = this.props.currentMonth;
    let color = [];
    let SumDisplacement = 0;//总排量
    let Displacemented = 0;//已排放
    let SurplusDisplacement = 0;//剩余排量
    let xAxisData = [];//月
    let seriesData = [];//排量
    let lineSeriesData = [];//排量 - 折线
    let title = null;
    let i = 1;
    if (type === 1) {//烟尘
      let outed = 0;
      // SurplusDisplacement = (ycAnalData.length !== 0 && ycAnalData.Remainder) ? ycAnalData.Remainder.toFixed(2) : 0;
      SurplusDisplacement = (ycAnalData.length !== 0 && ycAnalData.Remainder) ? ycAnalData.Remainder : 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        title = `<p>余 <span style='color:#ffc604;font-size:30px'>${SurplusDisplacement}</span>(t)</p>`;
      } else {
        title = `<p>超 <span style='color:#ffc604;font-size:30px'>${Math.abs(SurplusDisplacement)}</span>(t)</p>`;

      }
      this.props.dispatch({
        type: 'home/updateState',
        payload: {ycTitle:title},
    })
      ycdata.map((ele) => {

        if (Number.parseInt(currentMonth) < i) {
          // seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
          seriesData.push({ 
            value: outed, itemStyle: { normal: { color: '#ffc604'} } 
          });

        } else {
          seriesData.push(ele == 0 ? { value: ele, itemStyle: { normal: { color: '#ffc604', barBorderColor: '#ffc604', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } } : ele);
        }
        i++;
      });
      xAxisData = ycdate;
      color = ['#ffc604'];
    } else if (type === 2) { //二氧化硫
      let outed = 0;
      // SurplusDisplacement = (eyhlAnalData.length !== 0 && eyhlAnalData.Remainder) ? eyhlAnalData.Remainder.toFixed(2) : 0;
      SurplusDisplacement = (eyhlAnalData.length !== 0 && eyhlAnalData.Remainder) ? eyhlAnalData.Remainder : 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        //  title = `余${SurplusDisplacement}(t)`;
        title = `<p>余 <span style='color:#00dddf;font-size:30px'>${SurplusDisplacement}</span>(t)</p>`;
      } else {
        title = `<p>超 <span style='color:#00dddf;font-size:30px'>${Math.abs(SurplusDisplacement)}</span>(t)</p>`;
      }
      this.props.dispatch({
        type: 'home/updateState',
        payload: {erhlTitle:title},
    })
      eyhldata.map((ele) => {
        if (Number.parseInt(currentMonth) < i) {
          // seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
          seriesData.push({ value: outed, itemStyle: { normal: { color: '#00dddf'} } });
        } else {
          seriesData.push(ele == 0 ? { value: ele, itemStyle: { normal: { color: '#00dddf', barBorderColor: '#00dddf', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } } : ele);
        }
        i++;
      });
      xAxisData = dyhwdate;
      color = ['#00dddf'];

    } else { //氮氧
      // SurplusDisplacement = (dyhwAnalData.length !== 0 && dyhwAnalData.Remainder) ? dyhwAnalData.Remainder.toFixed(2) : 0;
      SurplusDisplacement = (dyhwAnalData.length !== 0 && dyhwAnalData.Remainder) ? dyhwAnalData.Remainder : 0;
      let outed = 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        title = `<p>余 <span style='color:#2072ee;font-size:30px'>${SurplusDisplacement}</span>(t)</p>`;
      } else {
        title = `<p>超 <span style='color:#2072ee;font-size:30px'>${Math.abs(SurplusDisplacement)}</span>(t)</p>`;
      }

      this.props.dispatch({
        type: 'home/updateState',
        payload: {dyTitle:title},
    })
      dyhwdata.map((ele) => {
        if (Number.parseInt(currentMonth) < i) {
          // seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
          seriesData.push( { value: outed, itemStyle: { normal: { color: '#2072ee'} } } );
        } else {
          seriesData.push(ele == 0 ? { value: ele, itemStyle: { normal: { color: '#2072ee', barBorderColor: '#2072ee', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } } : ele);
        }
        i++;
      });
      xAxisData = eyhldate;

      color = ['#2072ee'];
    }


    let option = {
      title:  {
        show:false,
        text: this.props.DGIMN ? '' : title,
        x: 'center',
        textStyle: {
          // fontSize: 16,
          // fontWeight: 'bolder',
          fontSize:24,
          color: color
        },
      },
      color: color,
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        x:100,
        position: ['40%', '10%']
      },
      grid: {
        // left: '-10%',
        // right: '4%',
        // bottom: '-10%',
        // containLabel: true
        y:10,
        y2:20
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value'
        }
      ],
      series: [
        {
          name: '约排放',
          type: 'bar',
          barWidth: '60%',
          data: seriesData,
        },
        // {
        //   name: '约排放',
        //   type: 'line',
        //   symbol: 'none',
        //   smooth:true,
        //   data: seriesData,
        // }
      ]
    };
    return option;
  }
    render() {
        const {AllMonthEmissionsByPollutant,DGIMN,ycTitle, erhlTitle,dyTitle,}=this.props;
        const {
            ycAnalData,
            eyhlAnalData,
            dyhwAnalData,
          } = AllMonthEmissionsByPollutant;

    // 计算排污许可情况
    let ycLink;
    // ycLink = `<span style='color:#ffc604'>${91}%</span>(${1.62}/${1.78})`;
    
    if (ycAnalData && ycAnalData.linkFlag && ycAnalData.length !== 0) {
      ycLink = `<span style='color:#ffc604'>${(Math.abs(ycAnalData.linkFlag.toFixed(2)))}%</span>(${ycAnalData.monthSum.toFixed(2)}/${ycAnalData.flag.toFixed(2)})`;
    }
    let dyhwLink;
    if (dyhwAnalData && dyhwAnalData.linkFlag && dyhwAnalData.length !== 0) {
      dyhwLink = `<span style='color:#2072ee'>${Math.abs(dyhwAnalData.linkFlag.toFixed(2))}%</span>(${dyhwAnalData.monthSum.toFixed(2)}/${dyhwAnalData.flag.toFixed(2)})`;
    }
    let eyhlLink;
    if (eyhlAnalData && dyhwAnalData.linkFlag && eyhlAnalData.length !== 0) {
      eyhlLink = `<span style='color:#00dddf'>${Math.abs(eyhlAnalData.linkFlag.toFixed(2))}%</span>(${eyhlAnalData.monthSum.toFixed(2)}/${eyhlAnalData.flag.toFixed(2)})`;
    }

    if (DGIMN) {
      ycLink = ycAnalData.monthSum;
      dyhwLink = dyhwAnalData.monthSum;
      eyhlLink = eyhlAnalData.monthSum;
    }
        return (
           <>
             {
              !(DGIMN)?  
              <>
                <div className={styles.title} style={{ marginBottom: 10 }}>
                  <p>排放量分析</p>
                </div>
                {/* 氮氧化物排污许可情况 */}
                <div className={`${styles.NOx} ${styles.content}`}>
                  <div className={styles.contentTitle}>
                    <p>氮氧化物排污许可情况</p>
                  </div>
                  <div style={{paddingLeft:23,paddingTop:10}}>
                  <Row align="bottom" dangerouslySetInnerHTML={{ __html:dyTitle }}></Row>
                  </div>
                  <div className={styles.pointcontent}>
                    <div className={styles.echartBox}>
                      <ReactEcharts
                        option={this.getlicense(3)}
                        style={{ height: '100%' }}
                        className="echarts-for-echarts"
                        theme="my_theme"
                      />
                    </div>
                    <div className={styles.desc}>
                      本年度累计排放量占比
                       {/* <br />
                      {dyhwLink} */}
                      <div dangerouslySetInnerHTML={{ __html:dyhwLink }}></div>
                    </div>
                  </div>
                </div>
                {/* 烟尘物排污许可情况 */}
                <div className={`${styles.smoke} ${styles.content}`}>
                  <div className={styles.contentTitle}>
                    <p>烟尘物排污许可情况</p>
                  </div>
                  {/* <div>
                  {ycTitle}
                  </div> */}
                 <div style={{paddingLeft:23,paddingTop:10}}>
                  <Row align="bottom" dangerouslySetInnerHTML={{ __html:ycTitle }}></Row>
                  </div>
                  <div className={styles.pointcontent}>
                    <div className={styles.echartBox}>
                      <ReactEcharts
                        option={this.getlicense(1)}
                        style={{ height: '100%' }}
                        className="echarts-for-echarts"
                        theme="my_theme"
                      />
                    </div>
                    <div className={styles.desc}>
                      {/* <br /> */}
                      {/* {ycLink} */}
                      本年度累计排放量占比
                      <div dangerouslySetInnerHTML={{ __html:ycLink }}></div>
                    </div>
                  </div>

                </div>
                {/* 二氧化硫排污许可情况 */}
                <div className={`${styles.SO2} ${styles.content}`}>
                  <div className={styles.contentTitle}>
                    <p>二氧化硫排污许可情况</p>
                  </div>
                  {/* <div>
                  {erhlTitle}
                  </div> */}
                  <div style={{paddingLeft:23,paddingTop:10}}>
                  <Row align="bottom" dangerouslySetInnerHTML={{ __html:erhlTitle }}></Row>
                  </div>
                  <div className={styles.pointcontent} style={{ paddingBottom: 0 }}>
                    <div className={styles.echartBox}>
                      <ReactEcharts
                        option={this.getlicense(2)}
                        style={{ height: '100%' }}
                        className="echarts-for-echarts"
                        theme="my_theme"
                      />
                    </div>
                    <div className={styles.desc}>
                      本年度累计排放量占比
                      {/* <br /> */}
                      {/* {eyhlLink} */}
                      <div dangerouslySetInnerHTML={{ __html:eyhlLink }}></div>
                    </div>
                  </div>
                </div>
               </>:
               <>
      {/* <div className={`${styles.emissionsContent} ${styles.pointEmissionsContent}`}> */}
      <div className={styles.title} style={{ marginBottom: 10 }}>
        <p>排放量分析</p>
      </div>
      {/* 氮氧化物排污许可情况 */}
      
      <div className={`${styles.NOx} ${styles.content}`}>
        <div className={styles.contentTitle}>
          <p>氮氧化物排污情况</p>
        </div>
   
        <div className={styles.pointcontent}>
          <div className={styles.echartBox} style={{ width: 200 }}>
            <ReactEcharts
              option={this.getlicense(3)}
              style={{ height: '100%' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </div>
          <div className={styles.desc}>
            本年度累计排放量 <br />
            {dyhwLink}
          </div>
        </div>
      
      </div>
      {/* 烟尘物排污许可情况 */}
      <div className={`${styles.smoke} ${styles.content}`}>
        <div className={styles.contentTitle}>
          <p>烟尘物排污情况</p>
        </div>
        <div className={styles.pointcontent}>
          <div className={styles.echartBox}>
            <ReactEcharts
              option={this.getlicense(1)}
              style={{ height: '100%' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </div>
          <div className={styles.desc}>
            本年度累计排放量<br />
            {ycLink}
          </div>
        </div>

      </div>
      {/* 二氧化硫排污许可情况 */}
      <div className={`${styles.SO2} ${styles.content}`}>
        <div className={styles.contentTitle}>
          <p>二氧化硫排污情况</p>
        </div>
        <div className={styles.pointcontent} style={{ paddingBottom: 0 }}>
          <div className={styles.echartBox}>
            <ReactEcharts
              option={this.getlicense(2)}
              style={{ height: '100%' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </div>
          <div className={styles.desc}>
            本年度累计排放量<br />
            {eyhlLink}
          </div>
        </div>
      </div>
    {/* </div> */}
               </>
            }
            </>
        );
    }
}

export default MonitoringStatus;