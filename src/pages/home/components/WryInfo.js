import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { EntIcon, GasIcon, WaterIcon, LegendIcon, PanelWaterIcon, PanelGasIcon, TreeIcon, PanelIcon, BellIcon, StationIcon, ReachIcon, SiteIcon, DustIcon, VocIcon, QCAIcon, IconConfig } from '@/utils/icon';
import styles from '../Home.less'
import CustomIcon from '@/components/CustomIcon'

class WryInfo extends PureComponent {
  state = {
    option: {}
  }


  componentDidMount() {
    this.getOption();
  }

  getOption = () => {
    if (this.myChart) {
      var value = 100;
      var color = new this.myChart.echartsLib.graphic.LinearGradient(
        0, 0, 1, 0, [{
          offset: 0,
          color: "#41D7F3",
        },
        {
          offset: 1,
          color: "#3D9FFF",
        }
      ]
      );
      let option = {
        series: [{
          name: '信用分',
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          radius: '70%',
          splitLine: { //分隔线样式
            show: false,
          },
          axisLabel: { //刻度标签
            show: false,
          },
          axisTick: { //刻度样式
            show: false,
          },
          axisLine: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            show: false
          },
          itemStyle: {
            color: color,
            shadowColor: 'rgba(0,138,255,0.45)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          pointer: {
            show: true,
            length: "80%",
            width: "6%",
            color: "#0093ee"
          },
          data: [{
            value: value,
            name: '年售电量情况'
          }]

        },
        {
          name: "已到人数",
          type: 'gauge',
          radius: '70%',
          startAngle: 180.5,
          endAngle: -0.5,
          min: 0,
          max: 100,
          title: {
            show: false
          },
          detail: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 6,
              color: [
                [
                  value / 100, color
                ],
                [
                  1, 'rgba(225,225,225,0.4)'
                ]
              ]
            }
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false
          },
          pointer: {
            show: false,
          },
          itemStyle: {
            normal: {
              color: '#54F200',
            }
          },
          data: [{
            value: value,
            name: '年售电量情况'
          }]
        }
        ]
      }
      this.setState({
        option: option
      })
    }
  }

  render() {
    const style = {
      position: 'absolute',
      bottom: "16%",
      width: '100%',
      textAlign: 'center',
      fontWeight: 500
    }
    return (
      <div className={styles.wryInfo}>
        <div style={{ height: "94%", width: "40%", position: "relative" }}>
          <ReactEcharts
            ref={echart => { this.myChart = echart }}
            option={this.state.option}
            style={{ height: '100%', width: '100%' }}
            theme="my_theme"
          />
          <div style={{ ...style }}>
            <span>实时联网率</span><br />
            <span style={{fontSize: 20, marginRight: 4}}>100</span>%
          </div>
        </div>
        <div className={styles.numberContainer}>
          <div>
            <EntIcon className={styles.icon} />
            监测污染源数量<span>50</span>个
          </div>
          <div>
            <WaterIcon className={styles.icon} />
            废水排放口<span>30</span>个
          </div>
          <div>
            <GasIcon className={styles.icon} />
            废气排放口<span>20</span>个
          </div>
        </div>
      </div>
    );
  }
}

export default WryInfo;