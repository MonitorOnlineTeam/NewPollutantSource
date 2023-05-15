import React, { PureComponent } from 'react';
import styles from '@/pages/home_ys/index.less';
import ReactEcharts from 'echarts-for-react';
import QuestionTooltip from '@/components/QuestionTooltip';
import { connect } from 'dva';
import { router } from 'umi';
import { Tooltip } from 'antd';
@connect(({ loading, home }) => ({
  theme: home.theme,
  GHGandEmissionContrastData: home.GHGandEmissionContrastData,
}))
class EmissionYears extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      option: {},
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = EntCode => {
    this.props
      .dispatch({
        type: 'home/getGHGandEmissionContrast',
        payload: {
          EntCode: EntCode,
        },
      })
      .then(() => {
        this.getOption();
      });
  };

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

  getOption = flag => {
    const {
      theme,
      GHGandEmissionContrastData: { disSum, disGHG },
    } = this.props;
    // const echartsLib = this.myChart.echartsLib;
    let option = {
      grid: {
        left: '2%',
        right: '4%',
        top: '14%',
        bottom: '4%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params, ticket, callback) => {
          let param = params[0];
          let format = `${param.name}（t）<br />${param.marker}${param.value}`;
          return format;
        },
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: theme === 'dark' ? '#fff' : '#000',
          },
        },
        axisLabel: {
          color: '#fff',
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          },
        },
        data: ['核算法排放量', '监测法排放量'],
      },
      yAxis: {
        name: '排放量(t)',
        type: 'value',
        axisLine: {
          // show: false,
          lineStyle: {
            color: theme === 'dark' ? '#fff' : '#000',
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: theme === 'dark' ? '#fff' : '#000',
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          },
        },
      },
      series: [
        {
          data: [disGHG.toFixed(2), disSum.toFixed(2)],
          barWidth: '34px',
          type: 'bar',
          label: {
            show: true,
            color: '#66F9EC',
            position: 'top',
          },
          itemStyle: {
            normal: {
              // color: '#0895E0'
              color: '#21c7de',
            },
          },
        },
      ],
    };
    return option;
  };

  onShowModal = (modalType, title) => {
    this.props.dispatch({
      type: 'home/updateState',
      payload: {
        yanshiVisible: true,
        modalType: modalType,
        yanshiModalTitle: title,
      },
    });
  };

  render() {
    const {
      theme,
      GHGandEmissionContrastData: { disSum, disGHG },
    } = this.props;
    return (
      <>
        <div className={styles.title}>
          <p style={{ backgroundPositionX: 180 }}>
            年度排放量对比分析
            {/* <QuestionTooltip style={{ color: '#fff' }} content="本年度三月份之前显示上一年度的总排放量，本年度三月份之后显示本年度的总排放量。" /> */}
          </p>
        </div>
        {/* <Tooltip title="点击查看排放量比对分析图" color={'#2F4F60'}>
          <div className={styles.content} style={{ height: '100%', cursor: 'pointer' }}
            onClick={() => {
              router.push('/Intelligentanalysis/CO2Material/monitorCurveAnalysis')
            }}
          >
            <ReactEcharts
              ref={echart => { this.myChart = echart }}
              option={this.getOption()}
              style={{ height: '100%' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </div>
        </Tooltip> */}
        <Tooltip title="点击查看碳排放量线性相关分析图" color={'#2F4F60'}>
          <div
            className={styles.CO2RateWrapper}
            onClick={() => {
              this.onShowModal('monitorLineAnalysis', '直测与核算碳排放量线性相关分析图');
            }}
          >
            <div className={styles.CO2rateItemContent}>
              <p className={styles.pointName}>
                <i></i>核算法排放量：
              </p>
              <p className={styles.value}>
                2023年度排放：
                <span className={styles.num} style={{ color: '#1BC78B' }}>
                  {disGHG.toFixed(2)}
                </span>
                <span className={styles.unit}>t</span>
              </p>
            </div>
            <div className={styles.line}></div>
            <div className={styles.CO2rateItemContent}>
              <p className={styles.pointName}>
                <i style={{ background: '#efb314' }}></i>监测法排放量：
              </p>
              <p className={styles.value}>
                2023年度排放：
                <span className={styles.num} style={{ color: '#1BC78B' }}>
                  {disSum.toFixed(2)}
                </span>
                <span className={styles.unit}>t</span>
              </p>
            </div>
          </div>
        </Tooltip>
      </>
    );
  }
}
export default EmissionYears;
