import React, { PureComponent } from 'react';
import styles from '@/pages/home/index.less';
import ReactEcharts from 'echarts-for-react';


class EmissionYears extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  getOption = () => {
    let option = {
      grid: {
        left: '2%',
        right: '4%',
        top: '14%',
        bottom: '4%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params, ticket, callback) => {
          let param = params[0]
          let format = `${param.name}（10⁷/t）<br />${param.marker}${param.value}`
          return format
        }
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          color: '#fff',
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          }
        },
        data: ['核算法排放量', '监测法排放量']
      },
      yAxis: {
        name: '排放量(10⁷/t)',
        type: 'value',
        axisLine: {
          // show: false,
          lineStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#fff',
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          }
        },
      },
      series: [{
        data: [326, 200],
        barWidth: '40%',
        type: 'bar',
        label: {
          show: true,
          position: 'inside'
        },
      }]
    };
    return option;
  }

  render() {
    return (
      <>
        <div className={styles.title}>
          <p style={{ backgroundPositionX: 160 }}>年度排放量对比分析</p>
        </div>
        <div className={styles.content} style={{ height: '100%' }}>
          <ReactEcharts
            option={this.getOption()}
            style={{ height: '100%' }}
            className="echarts-for-echarts"
            theme="my_theme"
          />
        </div>
      </>
    );
  }
}

export default EmissionYears;