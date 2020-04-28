import React, { Component } from 'react';
import { connect } from 'dva';
import styles  from '@/pages/home/index.less';
import Marquee from '@/components/Marquee';
import ReactEcharts from 'echarts-for-react';
@connect(({ loading, home }) => ({
    AllMonthEmissionsByPollutant: home.AllMonthEmissionsByPollutant,
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
    let title = null;
    let i = 1;
    if (type === 1) {
      let outed = 0;
      // SurplusDisplacement = (ycAnalData.length !== 0 && ycAnalData.Remainder) ? ycAnalData.Remainder.toFixed(2) : 0;
      SurplusDisplacement = (ycAnalData.length !== 0 && ycAnalData.Remainder) ? ycAnalData.Remainder : 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        title = `余${SurplusDisplacement}(t)`;
      } else {
        title = `超${Math.abs(SurplusDisplacement)}(t)`;
      }
      ycdata.map((ele) => {

        if (Number.parseInt(currentMonth) < i) {
          // seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
          seriesData.push({ value: outed, itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
        } else {
          seriesData.push(ele == 0 ? { value: ele, itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } } : ele);
        }
        i++;
      });
      xAxisData = ycdate;
      color = ['#0edaad'];
    } else if (type === 2) {
      let outed = 0;
      // SurplusDisplacement = (eyhlAnalData.length !== 0 && eyhlAnalData.Remainder) ? eyhlAnalData.Remainder.toFixed(2) : 0;
      SurplusDisplacement = (eyhlAnalData.length !== 0 && eyhlAnalData.Remainder) ? eyhlAnalData.Remainder : 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        //  title = `余${SurplusDisplacement}(t)`;
        title = `余${SurplusDisplacement}(t)`;
      } else {
        title = `超${Math.abs(SurplusDisplacement)}(t)`;
      }
      eyhldata.map((ele) => {
        if (Number.parseInt(currentMonth) < i) {
          // seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
          seriesData.push({ value: outed, itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
        } else {
          seriesData.push(ele == 0 ? { value: ele, itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } } : ele);
        }
        i++;
      });
      xAxisData = dyhwdate;
      color = ['#03b3ff'];

    } else {
      // SurplusDisplacement = (dyhwAnalData.length !== 0 && dyhwAnalData.Remainder) ? dyhwAnalData.Remainder.toFixed(2) : 0;
      SurplusDisplacement = (dyhwAnalData.length !== 0 && dyhwAnalData.Remainder) ? dyhwAnalData.Remainder : 0;
      let outed = 0;
      if (SurplusDisplacement > 0) {
        outed = SurplusDisplacement / (12 - Number.parseInt(currentMonth));
        title = `余${SurplusDisplacement}(t)`;
      } else {
        title = `超${Math.abs(SurplusDisplacement)}(t)`;
      }
      dyhwdata.map((ele) => {
        if (Number.parseInt(currentMonth) < i) {
          // seriesData.push({ value: outed.toFixed(2), itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
          seriesData.push({ value: outed, itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } });
        } else {
          seriesData.push(ele == 0 ? { value: ele, itemStyle: { normal: { color: '#051732', barBorderColor: 'tomato', barBorderWidth: 1, barBorderRadius: 0, borderType: "dotted" } } } : ele);
        }
        i++;
      });
      xAxisData = eyhldate;

      color = ['#40ccdd'];
    }
    let option = {
      title: {
        text: this.props.DGIMN ? '' : title,
        x: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bolder',
          color: color
        }
      },
      color: color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '-10%',
        right: '4%',
        bottom: '-10%',
        containLabel: true
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
        }
      ]
    };
    return option;
  }
 
    render() {
        const {AllMonthEmissionsByPollutant,DGIMN}=this.props;
        const {
            ycAnalData,
            eyhlAnalData,
            dyhwAnalData,
          } = AllMonthEmissionsByPollutant;
    // 计算排污许可情况
    let ycLink;
    if (ycAnalData && ycAnalData.linkFlag && ycAnalData.length !== 0) {
      ycLink = `${Math.abs(ycAnalData.linkFlag.toFixed(2))}%(${ycAnalData.monthSum.toFixed(2)}/${ycAnalData.flag.toFixed(2)})`;
    }
    let dyhwLink;
    if (dyhwAnalData && dyhwAnalData.linkFlag && dyhwAnalData.length !== 0) {
      dyhwLink = `${Math.abs(dyhwAnalData.linkFlag.toFixed(2))}%(${dyhwAnalData.monthSum.toFixed(2)}/${dyhwAnalData.flag.toFixed(2)})`;
    }
    let eyhlLink;
    if (eyhlAnalData && dyhwAnalData.linkFlag && eyhlAnalData.length !== 0) {
      eyhlLink = `${Math.abs(eyhlAnalData.linkFlag.toFixed(2))}%(${eyhlAnalData.monthSum.toFixed(2)}/${eyhlAnalData.flag.toFixed(2)})`;
    }

    if (DGIMN) {
      ycLink = ycAnalData.monthSum;
      dyhwLink = dyhwAnalData.monthSum;
      eyhlLink = eyhlAnalData.monthSum;
    }
    debugger;
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
                      本年度累计排放量占比 <br />
                      {dyhwLink}
                    </div>
                  </div>
                </div>
                {/* 烟尘物排污许可情况 */}
                <div className={`${styles.smoke} ${styles.content}`}>
                  <div className={styles.contentTitle}>
                    <p>烟尘物排污许可情况</p>
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
                      本年度累计排放量占比<br />
                      {ycLink}
                    </div>
                  </div>

                </div>
                {/* 二氧化硫排污许可情况 */}
                <div className={`${styles.SO2} ${styles.content}`}>
                  <div className={styles.contentTitle}>
                    <p>二氧化硫排污许可情况</p>
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
                      本年度累计排放量占比<br />
                      {eyhlLink}
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