/*
 * @Author: Jiaqi
 * @Date: 2019-11-14 11:39:35
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-11-28 09:54:49
 * @desc: 结果统计页面
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable'
import { connect } from 'dva'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import moment from 'moment';
import styles from '../index.less';

const columns = [
  {
    title: '排口名称',
    dataIndex: 'PointName',
    key: 'PointName',
  },
  {
    title: '合格数量',
    dataIndex: 'SuccessResult',
    key: 'SuccessResult',
  },
  {
    title: '质控次数',
    dataIndex: 'SumCount',
    key: 'SumCount',
  },
  {
    title: '合格率',
    dataIndex: 'QCResult',
    key: 'QCResult',
    render: (text, record) => {
      return text && (text * 100).toFixed() + "%"
    }
  },
];

@connect(({ loading, qualityControl }) => ({
  entRate: qualityControl.entRate,
  entStaticDataList: qualityControl.entStaticDataList,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEntName: null,
      dateValue: [moment(new Date()).subtract(1, 'months'), moment()],
      entIndex: null,
      currentDate: [moment(new Date()).subtract(1, 'months').format("YYYY-MM-DD HH:mm:ss"), moment().format("YYYY-MM-DD HH:mm:ss")],
    };
  }

  componentDidMount() {
    this.getResultStaticData('did');
  }

  // 获取图表统计数据
  getResultStaticData = (type) => {
    const { currentDate } = this.state;
    this.props.dispatch({
      type: "qualityControl/QCAResultStatic",
      payload: {
        BeginTime: currentDate.length ? currentDate[0] : undefined,
        EndTime: currentDate.length ? currentDate[1] : undefined,
      },
      searchType: type,
      callback: (res) => {
        if (type === "did") {
          if (res.entName.length && res.entCode.length)
            this.onChartClick({ name: res.entName[0], dataIndex: 0 })
        }
      }
    })
  }

  // 企业排行 - 柱状图
  lightOption = () => {
    const { entRate } = this.props;
    return {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: "{a} <br/>{b} : {c}%"
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: entRate.entName,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          // max: 100
        }
      ],
      series: [
        {
          name: '合格率',
          type: 'bar',
          barWidth: '40%',
          label: {
            normal: {
              show: true,
              position: 'inside',
              formatter: "{c}%"
            }
          },
          data: entRate.entResult
        }
      ]
    };
  }

  // 企业合格率总览 - 饼图
  pieOption = () => {
    const { entRate } = this.props;
    return {
      // title: {
      //   text: '某站点用户访问来源',
      //   subtext: '纯属虚构',
      //   x: 'center'
      // },
      color: ["#56f485", "#ff4e4e"],
      // color: ["#54da9a", "#eacb03"],
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}%"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['已合格', '未合格']
      },
      series: [
        {
          name: '合格率',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [
            { value: (entRate.allResult * 100).toFixed(), name: '已合格' },
            { value: (entRate.noAllResult * 100).toFixed(), name: '未合格' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  // 企业点击事件
  onChartClick = (e) => {
    console.log("e=", e)
    this.setState({
      currentEntName: e.name,
      entIndex: e.dataIndex,
    }, () => {
      this.getEntDataList()
    })

  }

  // 获取企业详情
  getEntDataList = () => {
    const { entIndex, currentDate } = this.state;
    if(entIndex)
    {
      this.props.dispatch({
        type: "qualityControl/QCAResultStaticByEntCode",
        payload: {
          EntCode: this.props.entRate.entCode[entIndex],
          BeginTime: currentDate.length ? currentDate[0] : undefined,
          EndTime: currentDate.length ? currentDate[1] : undefined,
        }
      })
    }

  }

  render() {
    const { currentEntName, currentDate, dateValue } = this.state;
    const tableTitle = currentEntName ? `${currentEntName} - 企业详情` : "企业详情";
    return (
      <PageHeaderWrapper>
        <div className="contentContainer" style={{ overflowX: "hidden" }}>
          <Card className={styles.cardShowTitle} style={{ marginBottom: 10 }} title={
            <RangePicker_ dateValue={dateValue}   dataType='day' style={{ width: 400 }} callback={(date) => {
              
                this.setState({
                  currentDate: [date[0]?date[0].format("YYYY-MM-DD HH:mm:ss"):null,date[1]?date[1].format("YYYY-MM-DD HH:mm:ss"):null],
                  dateValue: date,
                }, () => {
                  // 获取结果统计数据
                  this.getResultStaticData();
                  // 刷新table
                  this.getEntDataList();
                })
              
            }} />
          }></Card>
          <Row gutter={16}>
            <Col span={18}>
              <Card title="企业排行">
                <ReactEcharts
                  theme="light"
                  // option={() => { this.lightOption() }}
                  option={this.lightOption()}
                  lazyUpdate
                  notMerge
                  id="rightLine"
                  onEvents={{
                    'click': this.onChartClick,
                  }}
                  style={{ width: '100%', height: 'calc(100vh - 772px)', minHeight: '200px' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card title="合格率总览">
                <ReactEcharts
                  theme="pie"
                  option={this.pieOption()}
                  lazyUpdate
                  notMerge
                  // id="rightLine"
                  // onEvents={this.onclick}
                  style={{ width: '100%', height: 'calc(100vh - 772px)', minHeight: '200px' }}
                />
              </Card>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Card title={tableTitle}>
              <SdlTable dataSource={this.props.entStaticDataList} columns={columns} scroll={{ y: 'calc(100vh - 900px)' }} />
            </Card>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default index;
