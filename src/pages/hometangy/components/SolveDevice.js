import React, { Component } from 'react';
import { connect } from 'dva';
import styles from '../index.less';
import { Row, Col } from 'antd';
import ReactEcharts from 'echarts-for-react';
@connect(({ loading, hometangy }) => ({
  solvedevices: hometangy.solvedevices,
  solvedevicesTotal:hometangy.solvedevicesTotal
}))
class SolveDevice extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getData();
  }
  getOption = () => {
    const { solvedevices,solvedevicesTotal } = this.props;
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
          fontSize: 14
        },
      },
      series: [
        {
          name: '治理设备情况',
          type: 'pie',
          radius: ['80%', '99%'],
          center: ['50%', '70%'],
          startAngle: 180,
          labelLine:{
            show: true
          },
          label: {            
            show: true,
            normal: {
              show: true,
              position: 'center',
              formatter: `{total|${solvedevicesTotal}}\n\r{active|治理设备}`,
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
            }
          },
          data: []
        }
      ]
    };    
    solvedevices.map((currentValue, index, arr) => {
      option.series[0].data.push({ value: currentValue.Count, name: currentValue.Name });
    });
    option.series[0].data.push(
    {
      // make an record to fill the bottom 50%
      value: solvedevicesTotal,
      itemStyle: {
        // stop the chart from rendering this piece
        color: 'none',
        decal: {
          symbol: 'none'
        }
      },
      label: {
        show: false
      }
    });
    return option;
  }

  getData = (entCode) => {
    const { dispatch } = this.props;
    // 治理设备情况
    dispatch({
      type: "hometangy/getSolvedevices",
      payload: {
        entcode: 'd7891158-f43e-43b5-805c-ad11db586f6f',
        type: 2
      }
    });
  }

  render() {
    const { solvedevices } = this.props;
    return (
      <>
        <div className={styles.title}>
          <p>治理情况</p>
        </div>
        <div className={styles.content}>
          <Row style={{ height: '90%', width: '100%' }}>
            <Col span={24} style={{ paddingTop: 10 }}>
              <ReactEcharts
                option={this.getOption()}
                style={{ height: '100%', width: '100%' }}
              />
            </Col>
            {/* <Col span={11} style={{ paddingTop: 20 }}>
              {
                solvedevices.map((currentValue, index, arr) => {
                   return <Row justify="space-between" align='center' className={styles.statusNumber1} style={{height: `${(100/solvedevices.length)}%`, width: '100%' }}>
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

export default SolveDevice;
