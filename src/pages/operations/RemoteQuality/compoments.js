/*
 * @Author: lzp
 * @Date: 2019-07-25 16:46:20
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-17 15:32:18
 * @Description: 远程质控
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Select,
  Input,
  Button,
  Drawer,
  Radio,
  Collapse,
  Table,
  Badge,
  Divider,
  Row,
  Tree,
  Empty,
  Col,
  Card,
  Spin,
  message,
  Tag,
} from 'antd';
import { connect } from 'dva';
import { EntIcon, GasIcon, WaterIcon, LegendIcon } from '@/utils/icon';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import styles from './index.less';
import RangePicker_ from '@/components/RangePicker';
import ButtonGroup_ from '@/components/ButtonGroup';
import moment from 'moment';

const dataSource = [
  {
    key: '1',
    a: '2019-09-27 11:23:45',
    b: '自动定时质控',
    c: '零点偏差',
    d: <Tag color="green">合格</Tag>,
  },
  {
    key: '2',
    a: '2019-09-24 08:21:45',
    b: '手工质控',
    c: '量程偏差',
    d: <Tag color="green">合格</Tag>,
  },
  {
    key: '3',
    a: '2019-09-21 16:10:25',
    b: '自动定时质控',
    c: '量程偏差',
    d: <Tag color="orange">不合格(已校准)</Tag>,
  },
  {
    key: '4',
    a: '2019-09-15 14:08:32',
    b: '超标质控',
    c: '零点偏差',
    d: <Tag color="green">合格</Tag>,
  },
  {
    key: '5',
    a: '2019-09-01 09:15:24',
    b: '超标质控',
    c: '准确度',
    d: <Tag color="red">不合格(未校准)</Tag>,
  },
  {
    key: '6',
    a: '2019-08-28 13:49:45',
    b: '自动定时质控',
    c: '准确度',
    d: <Tag color="green">合格</Tag>,
  },
];

const columns = [
  {
    title: '时间',
    dataIndex: 'a',
    key: 'a',
  },
  {
    title: '类别',
    dataIndex: 'b',
    key: 'b',
  },
  {
    title: '结果',
    dataIndex: 'c',
    key: 'c',
  },
  {
    title: '评价',
    dataIndex: 'd',
    key: 'd',
  },
];

@connect(({ recordEchartTable, loading }) => ({}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /** 初始化加载 */
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}

  render() {
    const option = {
      legend: {
        data: ['零点偏差', '量程偏差', '准确度'],
      },
      xAxis: {
        type: 'category',
        data: [
          '2019-08-28 13:49:45',
          '2019-09-01 09:15:24',
          '2019-09-01 09:15:24',
          '2019-09-15 14:08:32',
          '2019-09-21 16:10:25',
          '2019-09-24 08:21:45',
          '2019-09-27 11:23:45',
        ],
        axisPointer: {
          type: 'line',
          value: '2019-09-01 09:15:24',
          snap: true,
          lineStyle: {
            color: '#004E52',
            opacity: 0.5,
            width: 2,
          },
          label: {
            show: true,
            formatter: function(params) {
              return '校准';
            },
            backgroundColor: '#004E52',
            margin: 25,
          },
          handle: {
            show: true,
            color: 'transparent',
          },
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '零点偏差',
          data: [990, 951, 924],
          type: 'line',
          color: '#00E5EE',
        },
        {
          name: '零点偏差',
          data: ['/', '/', 1250, 1052, 1290, 1330, 1320],
          type: 'line',
          color: '#00E5EE',
        },
        {
          name: '量程偏差',
          data: [175, 285, 396],
          type: 'line',
          color: '#90EE90',
        },
        {
          name: '量程偏差',
          data: ['/', '/', 514, 670, 710, 780, 811],
          type: 'line',
          color: '#90EE90',
        },
        ,
        {
          name: '准确度',
          data: [435, 525, 749],
          type: 'line',
          color: '#FFD700',
        },
        {
          name: '准确度',
          data: ['/', '/', 990, 710, 810, 822, 988],
          type: 'line',
          color: '#FFD700',
        },
      ],
    };
    return (
      <div className={styles.cardTitle}>
        <Card
          extra={
            <div>
              <RangePicker_
                style={{ width: 350, textAlign: 'left', marginRight: 10 }}
                dateValue={this.state.rangeDate}
                allowClear={false}
                format={this.state.formats}
                onChange={this._handleDateChange}
              />
              <ButtonGroup_
                style={{ marginRight: 20 }}
                checked="realtime"
                onChange={this._handleDateTypeChange}
              />
              <Button style={{ marginRight: 20 }}>检查</Button>
              <Button style={{ marginRight: 10 }}>校准</Button>
            </div>
          }
        >
          <Card.Grid
            style={{
              width: '100%',
              height: 'calc(100vh - 230px)',
              overflow: 'auto',
              ...this.props.style,
            }}
          >
            {
              <div>
                {' '}
                {
                  <div>
                    {/* <Tag color="#00E5EE" style={{height:15}}>&nbsp;&nbsp;</Tag> <lable>零点偏差</lable>
                                     <Tag color="#90EE90">&nbsp;&nbsp;</Tag> <lable>量程偏差</lable>
                                     <Tag color="#FFD700">&nbsp;&nbsp;</Tag> <lable>准确度</lable> */}
                    <ReactEcharts
                      theme="light"
                      option={option}
                      lazyUpdate
                      notMerge
                      id="rightLine"
                      onEvents={this.onclick}
                      style={{ width: '100%', height: 'calc(100vh - 554px)', minHeight: '200px' }}
                    />

                    {
                      // this.props.exceptionDataLoading ? <Spin
                      //     style={{
                      //         width: '100%',
                      //         height: 'calc(100vh/2)',
                      //         display: 'flex',
                      //         alignItems: 'center',
                      //         justifyContent: 'center'
                      //     }}
                      //     size="large"
                      // /> :
                      //     <div style={{ width: '100%', height: '300px', overflow: "auto" }}>
                      <SdlTable
                        // loading={this.props.exceptionDataLoading}
                        // style={{ width: "400px", height: "500px" }}
                        // scroll={{ y:  160 }}
                        style={{ maxHeight: '200px', marginTop: 20 }}
                        columns={columns}
                        dataSource={dataSource}
                      ></SdlTable>
                      // </div>
                    }
                  </div>
                }
              </div>
            }
          </Card.Grid>
        </Card>
      </div>
    );
  }
}

export default Index;
