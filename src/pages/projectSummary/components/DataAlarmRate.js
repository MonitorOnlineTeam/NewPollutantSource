import React, { PureComponent } from 'react';
import { Row, Col, } from "antd";
import ReactEcharts from 'echarts-for-react';


const titleStyle = {
  fontSize: 18,
  color: '##e5e9f3',
  fontWeight: 'bold'
}

class DataAlarmRate extends PureComponent {
  state = {}

  percentage = (data) => {
    return `${data}%`
  }

  getChartData = (type) => {
    // const { alarmResponseList } = this.props;
    let alarmResponseList = { "operationRate": 88.39, "exceptionRate": 91.8, "missRate": 15.68 };
    let color1 = ["#42dab8", "#7ef1d7"],
      color2 = ["#fdcb31", '#fde290'],
      color3 = ['#5169c5', '#889be2']
    let option = {
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      color: type == 1 ? color1 : type == 2 ? color2 : color3,
      title: {
        text: type == 1 ? this.percentage(alarmResponseList.operationRate) : type == 2 ? this.percentage(alarmResponseList.exceptionRate) : this.percentage(alarmResponseList.missRate),
        // left: "center",
        // top: "40%",
        x: 'center',
        y: 'center',
        textStyle: {
          color: type == 1 ? color1[1] : type == 2 ? color2[1] : color3[1],
          fontSize: 16,
          align: "center",
          fontWeight: 400
        }
      },
      series: [
        {
          name: type == 1 ? '数据超标报警核实率' : type == 2 ? '数据异常报警响应率' : '数据缺失报警响应率',
          type: 'pie',
          radius: ['70%', '83%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
          },
          data: [
            { value: type == 1 ? alarmResponseList.operationRate : type == 2 ? alarmResponseList.exceptionRate : alarmResponseList.missRate, name: '已完成' },
            { value: type == 1 ? (100 - alarmResponseList.operationRate) : type == 2 ? (100 - alarmResponseList.exceptionRate) : (100 - alarmResponseList.missRate), name: '未完成' },
          ]
        }
      ]
    };
    return option;
  }

  render() {
    return (
      <Row type='flex' align='middle' justify='space-between' style={{ height: '100%' }}>
        <Col span={8} align='middle'>
          <ReactEcharts
            option={this.getChartData(1)}
            className="echarts-for-echarts"
            theme="my_theme"
            style={{ width: '100%', height: '130%' }}
          />
          <div>
            <div style={{ ...titleStyle }}>核实率</div>
            <div style={{ ...titleStyle, fontSize: 14 }}>数据超标报警</div>
          </div>
        </Col>
        <Col span={8} align='middle'>
          <ReactEcharts
            option={this.getChartData(2)}
            className="echarts-for-echarts"
            theme="my_theme"
            style={{ width: '100%', height: '130%' }}
          />
          <div>
            <div style={{ ...titleStyle }}>响应率</div>
            <div style={{ ...titleStyle, fontSize: 14 }}>数据异常报警</div>
          </div>
        </Col>
        <Col span={8} align='middle'>
          <ReactEcharts
            option={this.getChartData(3)}
            className="echarts-for-echarts"
            theme="my_theme"
            style={{ width: '100%', height: '130%' }}
          />
          <div>
            <div style={{ ...titleStyle }}>响应率</div>
            <div style={{ ...titleStyle, fontSize: 14 }}>数据缺失报警</div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default DataAlarmRate;