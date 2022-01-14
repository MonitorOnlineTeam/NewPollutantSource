import React, { Component } from 'react';
import { connect } from 'dva';
import styles from '@/pages/home/index.less';
import Marquee from '@/components/Marquee'
import { Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
@connect(({ loading, home }) => ({
  pointData: home.pointData,
  theme: home.theme,
}))
class MonitoringStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    this.getData();
  }

  getOption = () => {
    const { pointData, theme } = this.props;
    let option = {
      color: ['#1bc78b', '#ffe400', '#f95d00', '#ababac',],
      tooltip: {
        show: true,
        trigger: 'item',
      },
      series: [
        {
          name: '监控现状',
          type: 'pie',
          radius: ['76%', '97%'],
          avoidLabelOverlap: false,
          hoverAnimation: true,
          // silent: true,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '{total|' + pointData.PointTotal + '}' + '\n\r' + '{active|排放口}',
              rich: {
                total: {
                  fontSize: 18,
                  fontFamily: "微软雅黑",
                  color: theme === 'dark' ? '#fff' : '#333'
                },
                active: {
                  fontFamily: "微软雅黑",
                  fontSize: 12,
                  color: theme === 'dark' ? '#e5e9f3' : '#333',
                  lineHeight: 22,
                },
              }
            },
            emphasis: {
              show: true,
            }
          },
          data: [
            { value: pointData.RuningNum, name: '运行' },
            { value: pointData.ExceptionNum, name: '异常' },
            { value: pointData.OffLine, name: '离线' },
            { value: pointData.StopNum, name: '关停' },
          ]
        }
      ]
    };
    return option;
  }

  getData = () => {
    const { dispatch } = this.props;
    // 监控现状
    dispatch({
      type: "home/getStatisticsPointStatus",
      payload: {
      },
    });
  }

  render() {
    const { pointData } = this.props;
    return (
      <>
        <div className={styles.title}>
          <p>监控现状</p>
        </div>
        <div className={styles.content}>
          {/* <div className={styles.line}>
                  <span className={styles.normal}>运行：{pointData.RuningNum}</span>
                  <span className={styles.abnormal}>异常：{pointData.ExceptionNum}</span>
                </div>
                <div className={styles.line}>
                  <span className={styles.overproof}>离线：{pointData.OffLine}</span>
                  <span className={styles.offline}>关停：{pointData.StopNum}</span>
                </div>
                <div className={styles.circular}>
                  <span>{pointData.PointTotal}</span><br />
                  <span>排放口</span>
                </div> */}
          <Row>
            <Col span={8}>
              <ReactEcharts
                option={this.getOption()}
                style={{ height: '94px', width: '100%' }}
              // theme="my_theme"
              />
            </Col>
            <Col span={16} style={{ padding: 10 }}>
              <Row justify="space-between" className={styles.statusNumber1}>
                <Col span={12}>
                  <i></i>
                  运行：{pointData.RuningNum}
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <i style={{ borderColor: '#FFE400' }}></i>
                  异常：{pointData.ExceptionNum}
                </Col>
              </Row>
              <Row justify="space-between" className={styles.statusNumber1} style={{ marginTop: 18 }}>
                <Col span={12}>
                  <i style={{ borderColor: '#F95D00' }}></i>
                  离线：{pointData.OffLine}
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <i style={{ borderColor: '#ABABAC' }}></i>
                  关停：{pointData.StopNum}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default MonitoringStatus;
