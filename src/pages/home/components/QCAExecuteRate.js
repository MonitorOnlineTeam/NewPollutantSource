import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import styles from '../Home.less'
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"


class QCAExecuteRate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getOption = () => {
    let fontColor = "#fff";
    let noramlSize = 16;
    let datas = {
      value: 78,
      company: "%",
      ringColor: [{
        offset: 0,
        color: '#02d6fc' // 0% 处的颜色
      }, {
        offset: 1,
        color: '#367bec' // 100% 处的颜色
      }]
    }
    let option = {
      title: {
        text: datas.value + datas.company,
        x: 'center',
        y: 'center',
        textStyle: {
          fontWeight: 'normal',
          color: '#fff',
          fontSize: '16'
        }
      },
      color: ['#282c40'],
      legend: {
        show: false,
        data: []
      },

      series: [{
        name: 'Line 1',
        type: 'pie',
        clockWise: true,
        radius: ['50%', '56%'],
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        },
        hoverAnimation: false,
        data: [{
          value: datas.value,
          name: '',
          itemStyle: {
            normal: {
              color: { // 完成的圆环的颜色
                colorStops: datas.ringColor
              },
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          }
        }, {
          name: '',
          value: 100 - datas.value
        }]
      }]
    };

    return option;
  }

  render() {
    return (
      <>
        <ReactEcharts
          ref={echart => { this.myChart = echart }}
          option={this.getOption()}
          style={{ height: '80%' }}
          theme="my_theme"
        />
        <div className={styles.comparison}>
          <p>
            <span>同比</span>
            <span className={`${styles.value} ${styles.up}`}>
              2.5%
              <ArrowUpOutlined />
            </span>
          </p>
          <p>
            <span>环比</span>
            <span className={`${styles.value} ${styles.down}`}>
              2.5%
              <ArrowDownOutlined />
            </span>
          </p>
        </div>
      </>
    );
  }
}

export default QCAExecuteRate;