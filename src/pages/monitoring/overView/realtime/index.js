import React, { Component } from 'react';
import { Card, Table, Radio, Popover, Badge, Icon, Input, Tag, TimePicker, DatePicker } from 'antd'
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SelectPollutantType from '@/components/SelectPollutantType'
import SdlTable from '@/components/SdlTable'
import { getPointStatusImg } from '@/utils/getStatusImg';
import { LegendIcon } from '@/utils/icon';
import { airLevel } from '../tools'
import { router } from 'umi'
import { formatPollutantPopover } from '@/utils/utils';
import styles from '../index.less';
import _ from 'lodash'
import moment from 'moment'


@connect(({ loading, overview, global, common }) => ({
  noticeList: global.notices,
  realtimeColumns: overview.realtimeColumns,
  realTimeDataView: overview.realTimeDataView,
  dataLoading: loading.effects["overview/getRealTimeDataView"],
  columnLoading: loading.effects["overview/getRealTimeColumn"],
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      currentDataType: "MinuteData",
      realTimeDataView: [],
      filteredInfo: null,
      time: moment(new Date()).add(-1, 'hour'),
      dayTime: moment(new Date()).add(-1, "day")
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.realtimeColumns !== nextProps.realtimeColumns) {

      let fixed = false;
      let width = 150;
      if (nextProps.realtimeColumns.length > 4) {
        fixed = true;
      } else {
        // 计算宽度
        width = (window.innerWidth - 64 - 48 - 680) / nextProps.realtimeColumns.length
      }
      let realtimeColumns = nextProps.realtimeColumns.map(item => {
        return {
          title: item.title,
          dataIndex: item.field,
          width: width,
          sorter: (a, b) => a[item.field] - b[item.field],
          defaultSortOrder: item.field === "AQI" ? 'descend' : null,
          render: (text, record) => {
            if (item.field === "AQI") {
              const colorObj = airLevel.find(itm => itm.value == record.AirLevel) || {};
              const color = colorObj.color;
              return <Popover content={
                <div>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 'Bold', fontSize: 16 }}>空气质量：<span style={{ color: color }}>{record.AirQuality}</span></span>
                  </div>
                  <li style={{ listStyle: 'none', marginBottom: 10 }}>
                    <Badge color={color} text={`首要污染物：${record.PrimaryPollutant}`} />
                  </li>
                  <li style={{ listStyle: 'none', marginBottom: 10 }}>
                    <Badge color={color} text={`污染级别：${record.AirLevel}级`} />
                  </li>
                </div>
              } trigger="hover">
                <span style={{ color: color }}>{text ? text : "-"}</span>
              </Popover>
            }
            if (record[item.field + "_Value"] !== undefined) {
              // const color = record[item.field + "_LevelColor"];
              const level = record[item.field + "_Level"].replace("级", "");
              const airLevelObj = airLevel.find(itm => itm.value == level) || {};
              const airQuality = airLevelObj.text;
              const color = airLevelObj.color;
              return <Popover content={
                <div>
                <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 'Bold', fontSize: 16 }}>空气质量：<span style={{ color: color }}>{airQuality}</span></span>
                  </div>
                  <li style={{ listStyle: 'none', marginBottom: 10 }}>
                    <Badge color={color} text={`污染级别：${record[item.field + "_Level"]}级`} />
                  </li>
                  <li style={{ listStyle: 'none', marginBottom: 10 }}>
                    <Badge color={color} text={`IAQI：${record[item.field + "_Value"]}`} />
                  </li>
                </div>
              } trigger="hover">
                <span style={{ color: color }}>{text}</span>
              </Popover>
            }
            return formatPollutantPopover(text, record[`${item.field}_params`]);
          }
        }
      })




      let statusFilters = [
        {
          text: <span><LegendIcon style={{ color: "#34c066" }} />正常</span>,
          value: 1,
        },
        {
          text: <span><LegendIcon style={{ color: "#f04d4d" }} />超标</span>,
          value: 2,
        },
        {
          text: <span><LegendIcon style={{ color: "#999999" }} />离线</span>,
          value: 0,
        },
        {
          text: <span><LegendIcon style={{ color: "#e94" }} />异常</span>,
          value: 3,
        },
      ]

      // 大气站状态筛选
      if (this.state.pollutantCode === 5) {
        statusFilters = airLevel.map(item => {
          return {
            text: <span><LegendIcon style={{ color: item.color }} />{item.text}</span>,
            value: item.value,
          }
        })
        statusFilters.unshift({
          text: <span><LegendIcon style={{ color: "#999999" }} />离线</span>,
          value: 0,
        })
      }

      let { sortedInfo, filteredInfo, pollutantCode } = this.state;
      filteredInfo = filteredInfo || {};
      let columns = [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 60,
          align: 'center',
          fixed: fixed,
          render: (value, record, index) => {
            return index + 1
          },
        },
        {
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          width: 120,
          align: 'center',
          fixed: fixed,
          filters: statusFilters,
          filteredValue: filteredInfo.Status || null,
          onFilter: (value, record) => {
            if (record.pollutantTypeCode == 5) {
              if (value != 0) {
                return record.AirLevel == value
              } else {
                return !record.AirLevel
              }
            }
            return record.status == value
          },
          render: (value, record, index) => {
            if (record.pollutantTypeCode == 5) {
              const airLevelObj = airLevel.find(itm => itm.value == record.AirLevel) || {};
              const color = airLevelObj.color || "#999999";
              return <div className={styles.airStatus}>
                <span style={{ backgroundColor: color }}></span>
              </div>
            }
            return getPointStatusImg(record, this.props.noticeList);
          },
        },
        {
          title: '监测点',
          dataIndex: 'pointName',
          width: 300,
          key: 'pointName',
          fixed: fixed,
          render: (text, record) => {
            return <span>{record.abbreviation} - {text}</span>
          }
        },
        {
          title: '监测时间',
          width: 200,
          dataIndex: 'MonitorTime',
          key: 'MonitorTime',
          fixed: fixed,
          // sorter: (a, b) => a.MonitorTime - b.MonitorTime,
          // defaultSortOrder: 'descend'
        },
        ...realtimeColumns
      ];
      this.setState({
        columns: columns
      })
    }
    if (this.props.realTimeDataView !== nextProps.realTimeDataView) {
      // 排序后在展示
      let realTimeDataView = _.sortBy(nextProps.realTimeDataView, function (item) {
        return -item.AQI
      });
      this.setState({
        realTimeDataView: realTimeDataView
      })
    }
  }


  // 获取页面数据
  getPageData = (pollutantCode) => {
    this.setState({
      pollutantCode: pollutantCode
    }, () => {
      this.getColumns()
      this.getRealTimeDataView();
    })
  }

  // 获取表格数据
  getRealTimeDataView = () => {
    const { pointName, currentDataType, pollutantCode, time, dayTime } = this.state;
    let searchTime = undefined;
    // ? moment(this.state.time).format("YYYY-MM-DD HH:00:00") : undefined
    if (currentDataType === "HourData") {
      // 小时
      searchTime = time ? moment(time).format("YYYY-MM-DD HH:00:00") : undefined
    }
    if (currentDataType === "DayData") {
      // 日均
      searchTime = dayTime ? moment(dayTime).format("YYYY-MM-DD 00:00:00") : undefined
    }
    this.props.dispatch({
      type: "overview/getRealTimeDataView",
      payload: {
        pointName: pointName,
        dataType: currentDataType,
        pollutantTypes: pollutantCode,
        time: searchTime,
      }
    })
  }

  // 获取表头
  getColumns = () => {
    this.props.dispatch({
      type: "overview/getRealTimeColumn",
      payload: {
        pollutantTypes: this.state.pollutantCode
      }
    })
  }

  handleChange = (pagination, filters, sorter) => {
    const newColumns = this.state.columns;
    newColumns[1].filteredValue = filters.Status || null;
    this.setState({
      columns: newColumns,
    });
  };



  render() {
    const { currentDataType, columns, realTimeDataView, time, dayTime } = this.state;
    // const { realTimeDataView, dataLoading, columnLoading } = this.props;
    const { dataLoading, columnLoading } = this.props;

    let scrollXWidth = columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);
    return (
      <PageHeaderWrapper title="数据一览">
        <Card
          title={
            <>
              <SelectPollutantType
                style={{ float: 'left', marginRight: 20 }}
                showType="radio"
                onChange={(e) => {
                  this.getPageData(e.target.value)
                  if (e.target.value == 5) {
                    this.setState({
                      currentDataType: "HourData",
                      filteredInfo: null,
                    })
                    this.props.dispatch({
                      type: "overview/updateState",
                      payload: {
                        dataType: "HourData"
                      }
                    })
                  }
                  // this.setState({
                  //   currentDataType: e.target.value
                  // })
                }}
                initCallback={(defaultPollutantCode) => {
                  this.getPageData(defaultPollutantCode)
                }}
              // defaultValue={selectpollutantTypeCode}
              />
              <Radio.Group value={currentDataType} onChange={(e) => {
                this.props.dispatch({
                  type: "overview/updateState",
                  payload: {
                    dataType: e.target.value
                  }
                })
                const newColumns = this.state.columns;
                newColumns[1].filteredValue = null;
                this.setState({
                  currentDataType: e.target.value,
                  filteredInfo: null,
                  columns: newColumns
                }, () => {
                  this.getRealTimeDataView()
                })
              }}>
                {/* <Radio.Button key={1} value="RealTimeData">实时</Radio.Button> */}
                {
                  this.state.pollutantCode != 5 && <Radio.Button key={2} value="MinuteData">分钟</Radio.Button>
                }
                <Radio.Button key={3} value="HourData">小时</Radio.Button>
                <Radio.Button key={4} value="DayData">日均</Radio.Button>
              </Radio.Group>
              {
                currentDataType === "HourData" &&
                <TimePicker
                  onChange={(time, timeString) => {
                    this.setState({
                      time: time
                    }, () => {
                      this.getRealTimeDataView()
                    })
                  }}
                  style={{ width: 150, marginLeft: 20 }}
                  defaultValue={time}
                  format="HH:00:00"
                />
              }
              {
                currentDataType === "DayData" &&
                <DatePicker
                  defaultValue={dayTime}
                  style={{ width: 150, marginLeft: 20 }}
                  onChange={(date, dateString) => {
                    this.setState({ dayTime: date }, () => {
                      this.getRealTimeDataView()
                    })
                  }} />
              }
              <Input.Search
                allowClear
                style={{ width: 300, marginLeft: 20 }}
                onChange={(e) => {
                  this.setState({
                    pointName: e.target.value
                  })
                }}
                onSearch={(val) => {
                  this.getRealTimeDataView()
                }}
                placeholder="请输入监测点名称"
              />
            </>
          }
          extra={
            <Radio.Group defaultValue="data" buttonStyle="solid" onChange={e => {
              e.target.value === 'map' && router.push('/monitoring/mapview')
            }}>
              <Radio.Button value="data">数据</Radio.Button>
              <Radio.Button value="map">地图</Radio.Button>
            </Radio.Group>
          }
        >
          <Table
            style={{
              // marginTop: 20,
              paddingBottom: 10
            }}
            loading={dataLoading || columnLoading}
            size="middle"
            bordered={true}
            pagination={false}
            dataSource={realTimeDataView}
            columns={columns}
            scroll={{ x: scrollXWidth, y: 'calc(100vh - 65px - 100px - 200px)' }}
            onChange={this.handleChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default index;
