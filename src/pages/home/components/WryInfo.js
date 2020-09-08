import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { EntIcon, GasIcon, WaterIcon, LegendIcon, PanelWaterIcon, PanelGasIcon, TreeIcon, PanelIcon, BellIcon, StationIcon, ReachIcon, SiteIcon, DustIcon, VocIcon, QCAIcon, IconConfig } from '@/utils/icon';
import styles from '../Home.less'
import CustomIcon from '@/components/CustomIcon'

class WryInfo extends PureComponent {
  state = {}


  getOption = () => {
    let option = {
      series: [
        {
          name: '内圈小',
          type: 'gauge',
          pointer: {
            show: false
          },
          radius: '70%',
          startAngle: 100,
          endAngle: -20,
          // splitNumber: ,
          axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
              color: [
                [1, '#bfcbd9']
              ],
              width: 6
            }

          },
          splitLine: { //分隔线样式
            show: false,
          },
          axisLabel: { //刻度标签
            show: false,
          },
          axisTick: { //刻度样式
            show: false,
          },
          detail: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            // fontWeight: 'bolder',
            fontSize: 10,
            offsetCenter: [0, '0%']
          },
          data: [{
            value: 100,
            name: ''
          }]
        }, {
          name: '内圈小',
          type: 'gauge',
          title: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'bolder',
            fontSize: 12, // 文字大小
            fontStyle: 'italic',
            color: "#fff",
            offsetCenter: [0, '33%'],
          },
          pointer: {
            show: true,
            length: "80%",
            width: "6%",
          },
          radius: '70%',
          startAngle: 200,
          endAngle: 50,
          splitNumber: 4,
          axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
              color: [
                [1, '#0093ee']
              ],
              width: 6,
              shadowColor: '#0093ee', //默认透明
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 40,
              opacity: 1,
            }

          },
          splitLine: { //分隔线样式
            show: false,
          },
          axisLabel: { //刻度标签
            show: false,
          },
          axisTick: { //刻度样式
            show: false,
          },
          detail: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'bolder',
            fontSize: 16,// 文字大小
            offsetCenter: [0, '60%'],
            color: "#fff"
          },
          data: [{
            value: '100',
            name: '实时联网率'
          }]
        },

      ]
    };

    return option;
  }

  render() {
    return (
      <div className={styles.wryInfo}>
        <ReactEcharts
          option={this.getOption(3)}
          style={{ height: '100%', width: '40%' }}
          theme="my_theme"
        />
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