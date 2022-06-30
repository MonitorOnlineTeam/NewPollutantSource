import React, { PureComponent } from 'react';
import styles from '@/pages/home/index.less';
import ReactEcharts from 'echarts-for-react';
import QuestionTooltip from "@/components/QuestionTooltip"
import { connect } from 'dva'
@connect(({ loading, home }) => ({
  theme: home.theme,
  GHGandEmissionContrastData: home.GHGandEmissionContrastData,
}))
class EmissionYears extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      option: {}
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData = (EntCode) => {
    this.props.dispatch({
      type: 'home/getGHGandEmissionContrast',
      payload: {
        EntCode: EntCode
      }
    }).then(() => {
      this.getOption();
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.DGIMN !== nextProps.DGIMN || this.props.entCode !== nextProps.entCode) {
      this.getData(nextProps.entCode);
    }
    if (this.props.theme !== nextProps.theme) {
      if (this.myChart) {
        // let echarts_instance = this.myChart.getEchartsInstance();
        // echarts_instance.dispose();
        // echarts_instance.setOption(this.getOption(true))
        this.getOption();
      }
    }
  }

  getOption = (flag) => {
    const { theme, GHGandEmissionContrastData: { disSum, allSumDis } } = this.props;
    // const echartsLib = this.myChart.echartsLib;
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
          let format = `${param.name}（t）<br />${param.marker}${param.value}`
          return format
        }
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: theme === 'dark' ? '#fff' : '#000'
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
        name: '排放量(t)',
        type: 'value',
        axisLine: {
          // show: false,
          lineStyle: {
            color: theme === 'dark' ? '#fff' : '#000'
          }
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: theme === 'dark' ? '#fff' : '#000',
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          }
        },
      },
      series: [{
        data: [allSumDis, disSum],
        barWidth: '34px',
        type: 'bar',
        label: {
          show: true,
          color: '#66F9EC',
          position: 'top'
        },
        itemStyle: {
          normal: {
            // color: '#0895E0'
            color: '#21c7de'
          }
        },
      }]
    };
    return option;
  }
  render() {
    return (
      <>
        <div className={styles.title}>
          <p style={{ backgroundPositionX: 180 }}>
            年度排放量对比分析
            <QuestionTooltip style={{ color: '#fff' }} content="本年度三月份之前显示上一年度的总排放量，本年度三月份之后显示本年度的总排放量。" />
          </p>
        </div>
        <div className={styles.content} style={{ height: '100%' }}>
          <ReactEcharts
            ref={echart => { this.myChart = echart }}
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
