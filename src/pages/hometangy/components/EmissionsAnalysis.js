import React, { Component } from 'react';
import { connect } from 'dva';
import styles from '../index.less';
import Marquee from '@/components/Marquee';
import ReactEcharts from 'echarts-for-react';
import { Row, Col } from 'antd';
@connect(({ loading, home }) => ({
  pointData: home.pointData,
  home: home,
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

  componentWillReceiveProps(nextProps) {
    if (this.props.entCode !== nextProps.entCode) {
      this.getData(nextProps.entCode);
    }
  }

  getOption = () => {
    const { pointData, theme } = this.props;
    let option = {      
      color:['#5B7AD8','#FAC858','#91CC75','#73C0DE'],
      // tooltip: {
      //   show: true,
      //   trigger: 'item',
      // },
      series: [
        {
          name: '监控现状',
          type: 'pie',
          radius: ['76%', '97%'],
          avoidLabelOverlap: false,
          // hoverAnimation: true,
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

  getData = (entCode) => {
    const { dispatch } = this.props;
    // 监控现状
    dispatch({
      type: "home/getStatisticsPointStatus",
      payload: {
        entCode: entCode
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
        <div className={styles.content} style={{ height: '100%', width: '100%', maxHeight:'100%' }}>
          <Row style={{ height: '80%', width: '100%' }}>
            <Col span={24} style={{ padding: 10 }}>
              <ReactEcharts
                option={this.getOption()}
                style={{ height: '100%', width: '100%' }}
              />
            </Col>
          </Row>          
          <Row style={{ height: '20%', width: '100%' }}>
            <Col span={24} style={{ padding: 10 }}>
              <Row justify="space-between" align="middle" className={styles.statusNumber1}>
                <Col span={12}>
                  <i></i>
                  运行：{pointData.RuningNum}
                </Col>              
                <Col span={12}>
                  <i style={{ borderColor: '#FFE400' }}></i>
                  异常：{pointData.ExceptionNum}
                </Col>
              </Row>
              <Row className={styles.statusNumber1} style={{ marginTop: 10 }}>
                <Col span={12}>
                  <i style={{ borderColor: '#F95D00' }}></i>
                  离线：{pointData.OffLine}
                </Col>              
                <Col span={12}>
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
