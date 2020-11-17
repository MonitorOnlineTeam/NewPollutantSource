import React, { PureComponent } from 'react'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '@/components/SdlTable'
import { Card, Form, DatePicker, Input, Row, Select, Button, Space, Progress } from "antd"
import moment from 'moment'
import { entList, HGQKTableData } from './mock-data'
import ReactEcharts from 'echarts-for-react';

const { RangePicker } = DatePicker;
const { Option } = Select;

class ZXRate extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      option: {},
      columns: [
        {
          title: '核查类型',
          dataIndex: 'checkType',
        },
        {
          title: '时间',
          dataIndex: 'time',
        },
        {
          title: '行政区',
          dataIndex: 'time',
          render: () => {
            return '北京市昌平区'
          }
        },
        {
          title: '合格数量',
          dataIndex: 'hgNum',
        },
        {
          title: '不合格数量',
          dataIndex: 'bhgNum',
        },
        {
          title: '排口数量',
          dataIndex: 'count',
          render: (text, record) => {
            return `${record.hgNum + record.bhgNum}`
          }
        },
      ]
    };
  }

  componentDidMount() {
    this.getChartOption();
  }


  getChartOption = () => {
    if (this.myChart) {
      let option = {
        color: ["#4cadfd", "#f68700"],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['已完成', '未完成'],
          icon: 'rect',
          itemWidth: 20,//图例的宽度
          itemHeight: 10,//图例的高度
          textStyle: { //图例文字的样式
            // color: '#fff',
          },
        },
        grid: {
          show: false,
          left: 0,
          right: 10,
          bottom: 30,
          top: 40,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              rotate: 0,
              fontSize: 14,
              // color: '#fff'
            },
            data: ['零点核查', '量程核查', '盲样核查', '响应时间核查', '线性核查']
          }
        ],
        yAxis: [
          {
            name: "排口数量（个）",
            type: 'value',
            // axisLine: {
            //   show: false,
            // },
            // axisLabel: {
            //   show: true,
            //   rotate: 0,
            //   fontSize: 12,
            //   // color: '#fff'
            // },
            // axisTick: {
            //   show: false,
            // },
            // splitLine: {
            //   show: true,
            //   lineStyle: {
            //     type: 'dashed',
            //     color: "#113d5e"
            //   }
            // },
          }
        ],
        series: [
          {
            name: '合格',
            type: 'bar',
            stack: 'one',
            data: HGQKTableData.map(item => item.hgNum),
            barMaxWidth: '16%',
            itemStyle: {
              normal: {
                color: new this.myChart.echartsLib.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#4cadfd' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#4cadfd99' // 100% 处的颜色
                }], false),
                // barBorderRadius: [30, 30, 30, 30],
                shadowColor: 'rgba(0,160,221,1)',
                // shadowBlur: 4,
              }
            },
          },
          {
            name: '不合格',
            type: 'bar',
            stack: 'one',
            barMaxWidth: '16%',
            data: HGQKTableData.map(item => item.bhgNum),
            itemStyle: {
              normal: {
                color: new this.myChart.echartsLib.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#f68700' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#f687009c' // 100% 处的颜色
                }], false),
                // barBorderRadius: [30, 30, 30, 30],
                shadowColor: 'rgba(0,160,221,1)',
                // shadowBlur: 4,
              }
            },
          },
        ]
      };
      this.setState({
        option: option
      })
    }
  }

  render() {
    const { columns } = this.state;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Form
            name="global_state"
            layout='inline'
            style={{ marginBottom: 20 }}
            ref={this.formRef}
            initialValues={{
              time: [moment().subtract(29, 'days'), moment()],
            }}
          >
            <Form.Item
              name="time"
              label="开始/结束时间"
            >
              <RangePicker showTime style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
              name="PollutantCode"
              label="行政区"
            >
              <Select style={{ width: 200 }} placeholder="请选择行政区">
                {
                  entList.map(item => {
                    return <Option key={item.EntCode} value={item.EntCode}>{item.EntName}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Space align="baseline">
              <Button type="primary">查询</Button>
              {/* <Button type="primary">导出</Button> */}
            </Space>
          </Form>
          <ReactEcharts
            ref={echart => { this.myChart = echart }}
            option={this.state.option}
            // className="echarts-for-echarts"
            theme="my_theme"
            style={{ height: "50vh", marginTop: 10 }}
          // style={{ width: '100%', height: '130%' }}
          />
          <SdlTable dataSource={HGQKTableData} columns={columns} />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default ZXRate;