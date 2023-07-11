import React, { Component } from 'react';
import { connect } from 'dva';
import styles from '../index.less';
import Marquee from '@/components/Marquee'
import { Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
@connect(({ loading, hometangy }) => ({
  monitordevices: hometangy.monitordevices,
  monitordevicesTotal:hometangy.monitordevicesTotal
}))
class MonitoringDevice extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getData();
  }  

  getOption = () => {
    const { monitordevices,monitordevicesTotal } = this.props;
    let option = {
      color:['#5B7AD8','#FAC858','#91CC75','#73C0DE'],
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left', 
        textStyle: { //图例文字的样式
          color: '#fff',
          fontSize: 12
        },
      },
      series: [
        {
          name: '监控设备情况',
          type: 'pie',
          radius: ['76%', '97%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: `{total|${monitordevicesTotal}}\n\r{active|排放口}`,
              rich: {
                total: {
                  fontSize: 18,
                  fontFamily: "微软雅黑",
                  color: '#fff'
                },
                active: {
                  fontFamily: "微软雅黑",
                  fontSize: 12,
                  color: '#fff',
                  lineHeight: 22,
                },
              }
            },
            emphasis: {
              show: true,
            }
          },
          data: []
        }
      ]
    };
    monitordevices.map((currentValue, index, arr) => {
      option.series[0].data.push({ value: currentValue.Count, name: currentValue.Name });
    });
    return option;
  }

  getData = (entCode) => {
    const { dispatch } = this.props;
    // 监控设备情况
    dispatch({
      type: "hometangy/getMonitordevices",
      payload: {
        entcode: 'd7891158-f43e-43b5-805c-ad11db586f6f',
        type: 1
      }
    });
  }

  render() {
    const { monitordevices } = this.props;
    return (
      <>
        <div className={styles.title}>
          <p>监控设备情况</p>
        </div>
        <div className={styles.content}>
          <Row style={{ height: '90%', width: '100%' }}>
            <Col span={24} style={{ padding: 10 }}>
              <ReactEcharts
                option={this.getOption()}
                style={{ height: '100%', width: '100%' }}
              />
            </Col>
            {/* <Col span={11} style={{ paddingTop: 20 }}>
              {
                monitordevices.map((currentValue, index, arr) => {
                   return <Row justify="space-between" align='center' className={styles.statusNumber1} style={{height: '25%', width: '100%' }}>
                    <Col span={24}>
                      <i></i>
                      {currentValue.Name} ：{currentValue.Count}
                    </Col>
                  </Row>
                })
              }
            </Col> */}
          </Row>
        </div>
      </>
    );
  }
}

export default MonitoringDevice;
