import React, { Component } from 'react';
import {
  Card,
  Divider,
  Badge,
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


@connect(({ loading, overview, global, common }) => ({
  noticeList: global.notices,
  realtimeColumns: overview.realtimeColumns,
  realTimeDataView: overview.realTimeDataView,
  dataLoading: loading.effects['overview/getRealTimeDataView'],
  columnLoading: loading.effects['overview/getRealTimeColumn'],
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.config = this.props.location.query.config ? JSON.parse(this.props.location.query.config) : undefined;
    this.state = {
      offline: 0,
      online: 0,
      columns: [],
      fixed: false,
      currentDataType: 'HourData',
      realTimeDataView: [],
      filteredInfo: null,
      currentHour: moment().hour(),
      time: moment().hour() > 1 ? moment(new Date()).add(-1, 'hour').format('YYYY-MM-DD HH:00:00') : moment(new Date()).format('YYYY-MM-DD HH:00:00'),
      dayTime: moment(new Date()).add(-1, 'day'),
    };
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    if (this.props.realtimeColumns !== nextProps.realtimeColumns) {
      // let fixed = (nextProps.realtimeColumns.length * 80 + 60 + 70 + 220 + 160) > $(".sdlTable").width();
      const fixed = false;
      const width = 200;

      const realtimeColumns = nextProps.realtimeColumns.map((item, idx) => ({
        title: item.unit ? <>{item.name}<br />({item.unit})</> : item.title,
        dataIndex: item.field,
        name: item.name,
        // width: item.title.indexOf("(") > -1 ? item.title.length * 10 : item.title.length * 20,
        width: item.width || undefined,
        sorter: item.wrw !== false ? (a, b) => a[item.field] - b[item.field] : false,
        defaultSortOrder: item.field === 'AQI' ? 'descend' : null,
        show: true,
        align: 'center',
        wrw: item.wrw !== undefined ? item.wrw : true,
        render: (text, record) => {
          if (item.field === 'AQI') {
            return AQIPopover(text, record);
          }
          if (record[`${item.field}_Value`] !== undefined) {
            return IAQIPopover(text, record, item.field);
          }
          if (item.title === '空气质量') {
            return text ? <span style={{ color: record.AQI_Color }}>{text}</span> : '-'
          }
          // 风向转换
          if (item.name === '风向') {
            const _text = text ? `${getDirLevel(text)}` : '-';
            return formatPollutantPopover(_text, record[`${item.field}_params`]);
          }
          return formatPollutantPopover(text, record[`${item.field}_params`]);
        },
      }));

      let statusFilters = [
        {
          text: (
            <span>
              <LegendIcon style={{ color: '#34c066' }} />
              正常
            </span>
          ),
          value: 1,
        },
        {
          text: (
            <span>
              <LegendIcon style={{ color: '#f04d4d' }} />
              超标
            </span>
          ),
          value: 2,
        },
        {
          text: (
            <span>
              <LegendIcon style={{ color: '#999999' }} />
              离线
            </span>
          ),
          value: 0,
        },
        {
          text: (
            <span>
              <LegendIcon style={{ color: '#e94' }} />
              异常
            </span>
          ),
          value: 3,
        },
      ];

      // 大气站状态筛选
      if (this.state.pollutantCode === 5 || this.state.pollutantCode === 12) {
        statusFilters = airLevel.map(item => ({
          text: (
            <span>
              <LegendIcon style={{ color: item.color }} />
              {item.text}
            </span>
          ),
          value: item.levelText,
        }));
        statusFilters.unshift({
          text: (
            <span>
              <LegendIcon style={{ color: '#999999' }} />
              离线
            </span>
          ),
          value: 0,
        });
      }

      let { sortedInfo, filteredInfo, pollutantCode } = this.state;
      filteredInfo = filteredInfo || {};
      const columns = [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 50,
          align: 'center',
          fixed,
          show: true,
          render: (value, record, index) => index + 1,
        },
        {
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          width: 70,
          // width: 120,
          align: 'center',
          fixed,
          show: true,
          filters: statusFilters,
          filteredValue: filteredInfo.Status || null,
          onFilter: (value, record) => {
            if (record.pollutantTypeCode == 5 || record.pollutantTypeCode == 12) {
              if (value != 0) {
                return record.AirLevel == value;
              }
              return !record.AirLevel;
            }
            return record.status == value;
          },
          render: (value, record, index) => {
            if (record.pollutantTypeCode == 5 || record.pollutantTypeCode == 12) {
              const airLevelObj = airLevel.find(itm => itm.levelText == record.AirLevel) || {};
              const color = airLevelObj.color || '#999999';
              return (
                <div className={styles.airStatus}>
                  <span style={{ backgroundColor: color }} />
                </div>
              );
            }
            return getPointStatusImg(record, this.props.noticeList);
          },
        },
        {
          title: '监测点',
          dataIndex: 'pointName',
          // width: 160,
          width: 210,
          // ellipsis: true,
          key: 'pointName',
          fixed,
          show: true,
          render: (text, record) => {
            if (this.state.pollutantCode == 5) {
              return (
                <span>
                  {text}{record.outPutFlag == 1 ? <Tag color="#f50">停运</Tag> : ''}
                </span>
              );
            }
            return (
              <span>
                {record.entName} - {text}{record.outPutFlag == 1 ? <Tag color="#f50">停运</Tag> : ''}
              </span>
            );
          },
        },
        {
          title: '监测时间',
          width: 140,
          // width: 10,
          dataIndex: 'MonitorTime',
          key: 'MonitorTime',
          fixed,
          show: true,
          align: 'center',
          // sorter: (a, b) => a.MonitorTime - b.MonitorTime,
          // defaultSortOrder: 'descend'
        },
        ...realtimeColumns,
      ];
      this.setState({
        columns,
      });
    }
    if (this.props.realTimeDataView !== nextProps.realTimeDataView) {
      // 排序后在展示
      const realTimeDataView = _.sortBy(nextProps.realTimeDataView, item => -item.AQI);
      let online = 0;
      let offline = 0;
      realTimeDataView.map(item => {
        if (item.status === 0) {
          // 离线
          offline += 1;
        } else {
          online += 1;
        }
      })
      this.setState({
        realTimeDataView,
        offline, online
      });
    }
  }

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

  // 获取表头
  getColumns = () => {
    this.props.dispatch({
      type: 'overview/getRealTimeColumn',
      payload: {
        pollutantTypes: this.state.pollutantCode,
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
    const _columns = columns.filter(item => item.show);
    const scrollXWidth = _columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);


    return (
      <BreadcrumbWrapper>
        <Card
          title={
            <>
              <SelectPollutantType
                style={{ float: 'left', marginRight: 20 }}
                showType="radio"
                value={this.state.pollutantCode}
                onChange={e => {
                  this.getPageData(e.target.value);
                  let dataType = this.state.currentDataType;
                  // 如果有config，切换时默认选择第一个
                  if (this.config && this.config[e.target.value]) {
                    const dateTypeList = this.config[e.target.value].split(',')
                    this.setState({
                      currentDataType: DateTypeList[dateTypeList[0] - 1],
                    })
                    dataType = DateTypeList[dateTypeList[0] - 1];
                  } else if (e.target.value == 5 || e.target.value == 12) {
                    this.setState({
                      currentDataType: 'HourData',
                      filteredInfo: null,
                    });
                    dataType = 'HourData';
                  }

                  // 更新model - dataType 用来接收实时数据
                  this.props.dispatch({
                    type: 'overview/updateState',
                    payload: {
                      dataType,
                    },
                  });
                  // this.setState({
                  //   currentDataType: e.target.value
                  // })
                }
                }
                initCallback={defaultPollutantCode => {
                  this.getPageData(defaultPollutantCode);
                }}
              // defaultValue={selectpollutantTypeCode}
              />
              <div style={{ fontWeight: 'normal', fontSize: '14px', lineHeight: '32px', marginLeft: 170 }}>
                <Badge status="success" text="在线：" /> <Badge count={online} style={{ backgroundColor: '#52c41a' }} />
                <Divider type="vertical" />
                <Badge color='#999' text="离线：" /> <Badge count={offline} style={{ backgroundColor: '#999999' }} />
              </div>
            </>
          }
        // extra={

        // }
        >
          <SdlTable
            rowClassName={(record, index, indent) => {

            }}
            defaultWidth={94}
            loading={dataLoading || columnLoading}
            size="middle"
            bordered
            pagination={false}
            dataSource={realTimeDataView}
            columns={_columns}
            // scroll={{ x: scrollXWidth }}
            onChange={this.handleChange}
          />
        </Card >
      </BreadcrumbWrapper >
    );
  }
}

export default index;
