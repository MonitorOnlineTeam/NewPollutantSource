import React, { PureComponent } from 'react';
import styles from '@/pages/home_ys/index.less';
import ReactEcharts from 'echarts-for-react';
import QuestionTooltip from '@/components/QuestionTooltip';
import { connect } from 'dva';
import { router } from 'umi';
import { Tooltip } from 'antd';
import moment from 'moment';
@connect(({ loading, home_ys }) => ({
  theme: home_ys.theme,
  comparisonOfMonData: home_ys.comparisonOfMonData,
}))
class ComparisonOfMonChart extends PureComponent {
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
    this.props.dispatch({
      type: 'home_ys/getComparisonOfMonData',
      payload: {
        // EntCode: '6c4234c6-9978-4d1c-b342-0d40e2ec2678',
        // EntCode: '7526121f-1229-44dd-9de1-429bf6654664', // 华能
        EntCode: 'c679c8f9-fa71-486b-9c20-0d6d2955b2d9', // 华能
        BeginTime: '2023-01-01',
        EndTime: moment().format('YYYY-MM-DD'),
        type: 'echarts',
      },
    });
  };

  getOption = () => {
    const { comparisonOfMonData, theme } = this.props;
    console.log('comparisonOfMonData', comparisonOfMonData);
    return {
      color: ['#52c41a', '#1677ff'],
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow',
        },
        formatter: function(params, ticket, callback) {
          let format = `${params[0].axisValue}: `;
          params.map((item, index) => {
            let value = item.value;
            format += `<br />${item.marker}${item.seriesName}: ${value} kg`;
          });
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
          color: theme === 'dark' ? '#fff' : '#000',
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          },
        },
        data: comparisonOfMonData.lineTime && comparisonOfMonData.lineTime,
      },
      yAxis: {
        name: 'kg',
        splitLine: {
          show: false, // X轴线 颜色类型的修改
        },
        axisLine: {
          lineStyle: {
            color: theme === 'dark' ? '#fff' : '#000',
          },
        },
        axisLabel: {
          color: theme === 'dark' ? '#fff' : '#000',
          textStyle: {
            fontSize: 14,
            // fontWeight: 'bold'
          },
        },
        type: 'value',
      },
      legend: {
        data: ['监测量', '核算量'],
        textStyle: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
        padding: [20, 0, 0, 0],
      },
      grid: {
        left: '0px',
        right: '30px',
        bottom: '10px',
        top: '50px',
        containLabel: true,
      },
      series: [
        {
          name: '监测量',
          data: comparisonOfMonData.lineDis && comparisonOfMonData.lineDis,
          type: 'line',
          // smooth: true
        },
        {
          name: '核算量',
          data: comparisonOfMonData.lineAcc && comparisonOfMonData.lineAcc,
          type: 'line',
          // smooth: true
        },
      ],
    };
  };

  onShowModal = (modalType, title) => {
    this.props.dispatch({
      type: 'home_ys/updateState',
      payload: {
        yanshiVisible: true,
        modalType: modalType,
        yanshiModalTitle: title,
      },
    });
  };

  render() {
    return (
      <>
        <div className={styles.title}>
          <p style={{ backgroundPositionX: 180 }}>
            排放量对比分析图
            {/* <QuestionTooltip style={{ color: '#fff' }} content="本年度三月份之前显示上一年度的总排放量，本年度三月份之后显示本年度的总排放量。" /> */}
          </p>
        </div>
        <Tooltip title="点击查看直测与核算碳排放量比对分析图" color={'#2F4F60'}>
          <div
            style={{ height: 'calc(100% - 20px)', cursor: 'pointer' }}
            onClick={() => {
              this.onShowModal('monitorCurveAnalysis', '直测与核算碳排放量比对分析图');
            }}
          >
            <ReactEcharts
              option={this.getOption()}
              lazyUpdate
              notMerge
              style={{ width: '100%', height: '100%', cursor: 'pointer' }}
            />
          </div>
        </Tooltip>
      </>
    );
  }
}
export default ComparisonOfMonChart;
