import React, { PureComponent } from 'react';
import styles from '../index.less'
import { Popover, Icon } from "antd";
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';


@connect(({ loading, newHome }) => ({
  diffHorizontalData: newHome.diffHorizontalData,
}))
class DiffHorizontal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.dispatch({
      type: "newHome/getDiffHorizontalData"
    })
  }

  barOptions = () => {
    const { diffHorizontalData } = this.props;
    return {
      color: ['#67a2ef'],
      tooltip: {
        trigger: 'axis',
        confine: true,
        // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        //   type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        // }
      },
      grid: {
        top: 30,
        left: '6%',
        right: '6%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: diffHorizontalData.map(item => item.Abbreviation),
          // data: ['阿拉尔艾特水务', '首创水务（一期）', '首创水务（二期）', '藤原水务', '绿环水务', '西山污水厂', '阿拉尔供排水公司'],
          axisTick: {
            alignWithLabel: true
          },
          nameTextStyle: {
            rich: {
              height: 100
            },

          },
          axisLabel: {
            formatter: function (value) {
              // console.log('value=', value)
              // let val = value;
              // if (value === "(") {
              //   val = "︵"
              // }
              // if (value === ")") {
              //   val = "︶"
              // }
              let val = value.split("").join("\n");
              return val
            }
          },
          // axisLabel: {
          //   interval: 0,
          //   rotate: 40
          // },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '（%）',
          position: 'left',
          minInterval: 1,  
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        }
      ],
      series: [
        {
          // name: '直接访问',
          type: 'bar',
          barWidth: '40%',
          // data: [10, 52, 200, 334, 390, 330, 220]
          data: diffHorizontalData.map(item => item.BalanceDifferenceRate),
        }
      ]
    }
  };
  render() {
    const { diffHorizontalData } = this.props;
    return (
      <div className={styles["group-item"]}>
        <div className={styles["item-title"]}>
          水平衡差
          <Popover title={"污水处理厂水平衡差计算公式"} content={
            <div>
              {/* 污水处理厂水平衡差计算公式：<br /> */}
              ((进水口流量 - 回水口流量 - 出水口流量) / 进水口流量) * 100%
            </div>
          }>
            <Icon style={{ marginLeft: 6, fontSize: '15px' }} type="exclamation-circle" />
          </Popover>
        </div>
        {
          diffHorizontalData.length ? <ReactEcharts
            option={this.barOptions()}
            style={{ height: '400px', marginTop: 20 }}
            className="echarts-for-echarts"
            theme="my_theme"
          /> : <div className={styles.noData}>
              <img src="/nodata1.png" style={{ width: 120 }} />
              <p style={{ color: "rgb(166, 166, 167)", fontSize: 16, fontWeight: 500 }}>无企业</p>
            </div>
        }
      </div>
    );
  }
}

export default DiffHorizontal;
