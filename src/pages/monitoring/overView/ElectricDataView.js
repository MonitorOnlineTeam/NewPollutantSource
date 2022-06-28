import React, { Component } from 'react';
import {
  Card,
  Divider,
  Badge,
  Radio,
  Tag,
} from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import SelectPollutantType from '@/components/SelectPollutantType';
import SdlTable from '@/components/SdlTable';
import { getPointStatusImg } from '@/utils/getStatusImg';
import { LegendIcon } from '@/utils/icon';
import { airLevel, AQIPopover, IAQIPopover } from '@/pages/monitoring/overView/tools';
import { formatPollutantPopover, getDirLevel } from '@/utils/utils';
import _ from 'lodash';
import moment from 'moment';

import styles from './index.less';

const DateTypeList = ['RealTimeData', 'MinuteData', 'HourData', 'DayData']

const dataSource = [
  {
    region: '北京市',
    entName: 'xxx电力企业',
    pointName: 3,
    industry: '金属制品',
    stopStatus: 1,
    facilityStatus: 1,
    SummaryNum: 0,
    runningNum: 1,
    stopNum: 1,
    lossNum: 1
  },
  {
    region: '北京市',
    entName: 'xxx电力企业1',
    pointName: 11,
    industry: '专用设备制造业',
    stopStatus: 1,
    facilityStatus: 1,
    SummaryNum: 1,
    runningNum: 10,
    stopNum: 0,
    lossNum: 1
  },
  {
    region: '北京市',
    entName: 'xxx电力企业2',
    pointName: 4,
    industry: '金属制品',
    stopStatus: 0,
    facilityStatus: 0,
    SummaryNum: 0,
    runningNum: 0,
    stopNum: 4,
    lossNum: 0
  },
  {
    region: '北京市',
    entName: 'xxx电力企业3',
    pointName: 15,
    industry: '通用设备制造业',
    stopStatus: 0,
    facilityStatus: 0,
    SummaryNum: 0,
    runningNum: 10,
    stopNum: 1,
    lossNum: 4
  },
  {
    region: '北京市',
    entName: 'xxx电力企业4',
    pointName: 3,
    industry: '金属制品',
    stopStatus: 1,
    facilityStatus: 1,
    SummaryNum: 0,
    runningNum: 1,
    stopNum: 1,
    lossNum: 1
  },
  {
    region: '北京市',
    entName: 'xxx电力企业5',
    pointName: 3,
    industry: '通用设备制造业',
    stopStatus: 0,
    facilityStatus: 0,
    SummaryNum: 0,
    runningNum: 1,
    stopNum: 1,
    lossNum: 1
  },
]

@connect(({ loading, overview, global, common }) => ({
  noticeList: global.notices,
  realtimeColumns: overview.realtimeColumns,
  realTimeDataView: overview.realTimeDataView,
  dataLoading: loading.effects['overview/getRealTimeDataView'],
  columnLoading: loading.effects['overview/getRealTimeColumn'],
}))

class ElectricDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 50,
          align: 'center',
          render: (value, record, index) => index + 1,
        },
        {
          title: '行政区域',
          dataIndex: 'region',
          key: 'region',
          width: 180,
          // width: 120,
          align: 'center',
        },
        {
          title: '企业',
          dataIndex: 'entName',
          width: 210,
          key: 'entName',
        },

        {
          title: '行业',
          width: 140,
          dataIndex: 'industry',
          key: 'industry',
          align: 'center',
        },
        {
          title: '停限产',
          width: 140,
          dataIndex: 'stopStatus',
          key: 'stopStatus',
          align: 'center',
          render: (value, record, index) => {
            return value === 1 ? <Badge status="success" text="无计划" /> : <Badge status="default" text="失联" />
          }
        },
        {
          title: '治污设施',
          width: 140,
          dataIndex: 'facilityStatus',
          key: 'facilityStatus',
          align: 'center',
          render: (value, record, index) => {
            return value === 1 ? <Badge status="success" text="正常" /> : <Badge status="default" text="失联" />
          }
        },
        {
          title: '电能点位数量',
          dataIndex: 'pointName',
          width: 210,
          key: 'pointName',
        },
        // {
        //   title: '总表',
        //   dataIndex: 'SummaryNum',
        //   key: 'SummaryNum',
        //   width: 210,
        // },
        {
          title: '点位状态',
          width: 210,
          children: [
            {
              title: '运行',
              dataIndex: 'runningNum',
              key: 'runningNum',
              align: 'center',
              render: (value, record, index) => {
                return <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{value}</span>
                return <Badge status="success" text={value} />
              }
            },
            {
              title: '停机',
              dataIndex: 'stopNum',
              key: 'stopNum',
              align: 'center',
              render: (value, record, index) => {
                return <span style={{ color: '#faad14', fontWeight: 'bold' }}>{value}</span>
                return <Badge status="success" text={value} />
              }
            },
            {
              title: '离线',
              dataIndex: 'lossNum',
              key: 'lossNum',
              align: 'center',
              render: (value, record, index) => {
                return <span style={{ color: '#999999', fontWeight: 'bold' }}>{value}</span>
                return <Badge status="success" text={value} />
              }
            }
          ]
        },
      ]
    };
  }

  componentDidMount() { }

  // 获取页面数据
  getPageData = pollutantCode => {
    this.setState(
      {
        pollutantCode,
      },
      () => {
        this.getColumns();
        this.getRealTimeDataView();
      },
    );
  };

  // 获取表格数据
  getRealTimeDataView = () => {
    const { pointName, currentDataType, pollutantCode, time, dayTime } = this.state;
    let searchTime;
    // ? moment(this.state.time).format("YYYY-MM-DD HH:00:00") : undefined
    if (currentDataType === 'HourData') {
      // 小时
      searchTime = time ? moment(time).format('YYYY-MM-DD HH:00:00') : undefined;
    }
    if (currentDataType === 'DayData') {
      // 日均
      searchTime = dayTime ? moment(dayTime).format('YYYY-MM-DD 00:00:00') : undefined;
    }
    this.props.dispatch({
      type: 'overview/getRealTimeDataView',
      payload: {
        pointName,
        dataType: currentDataType,
        pollutantTypes: pollutantCode,
        time: searchTime,
      },
    });
  };

  handleChange = (pagination, filters, sorter) => {
    const newColumns = this.state.columns;
    if (newColumns.length) {
      newColumns[1].filteredValue = filters.Status || null;
      this.setState({
        columns: newColumns,
      });
    }
  };

  render() {
    const { currentDataType, columns, realTimeDataView, offline, online, pollutantCode } = this.state;
    // const { realTimeDataView, dataLoading, columnLoading } = this.props;
    const { dataLoading, columnLoading } = this.props;
    return (
      <BreadcrumbWrapper title="实时监控">
        <Card
          title={
            <>
              <div style={{ fontWeight: 'normal', fontSize: '14px', lineHeight: '32px' }}>
                <Badge status="success" text="当前在线企业：" /> <Badge count={3} style={{ backgroundColor: '#52c41a' }} />
                <Divider type="vertical" />
                <Badge color='#999' text="当前失联企业：" /> <Badge count={3} style={{ backgroundColor: '#999999' }} />
                <Divider type="vertical" />
                <Badge status="success" text="当前在线设备：" /> <Badge count={31} style={{ backgroundColor: '#52c41a' }} />
                <Divider type="vertical" />
                <Badge color='#999' text="当前离线设备：" /> <Badge count={6} style={{ backgroundColor: '#999999' }} />
                <Divider type="vertical" />
                <Badge status='warning' text="当前停机设备：" /> <Badge count={8} style={{ backgroundColor: '#faad14' }} />
                <Divider type="vertical" />
                <Badge status="success" text="当前在线率：" /> <Badge count={'68%'} style={{ backgroundColor: '#52c41a' }} />
              </div>
            </>
          }
          extra={
            <Radio.Group defaultValue="data">
              <Radio.Button value="data">数据</Radio.Button>
              <Radio.Button value="map">地图</Radio.Button>
            </Radio.Group>
          }
        >
          <SdlTable
            rowClassName={(record, index, indent) => {
            }}
            defaultWidth={94}
            loading={dataLoading || columnLoading}
            bordered
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            // scroll={{ x: scrollXWidth }}
            onChange={this.handleChange}
          />
        </Card >
      </BreadcrumbWrapper >
    );
  }
}

export default ElectricDataView;
