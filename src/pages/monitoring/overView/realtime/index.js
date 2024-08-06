import React, { Component } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import {
  Card,
  Table,
  Row,
  Col,
  Radio,
  Popover,
  Select,
  Badge,
  Input,
  Tag,
  TimePicker,
  DatePicker,
  Space,
  Button,
  Checkbox,
  message,
  Spin,
} from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SelectPollutantType from '@/components/SelectPollutantType';
import SdlTable from '@/components/SdlTable';
import { getPointStatusImg } from '@/utils/getStatusImg';
import { LegendIcon } from '@/utils/icon';
import { airLevel, AQIPopover, IAQIPopover } from '@/pages/monitoring/overView/tools';
import { router } from 'umi';
import { formatPollutantPopover, getDirLevel, getDataTruseMsg } from '@/utils/utils';
import _ from 'lodash';
import moment from 'moment';
import $ from 'jquery';
import styles from '../index.less';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { CheckableTag } = Tag;
const DateTypeList = ['RealTimeData', 'MinuteData', 'HourData', 'DayData'];

const statusList = [
  { value: 1, label: '正常', color: '#34c066' },
  { value: 2, label: '超标', color: '#f04d4d' },
  { value: 0, label: '离线', color: '#999999' },
  { value: 3, label: '异常', color: '#e94' },
  // { value: 4, label: '停产', color: '#40474e' },
];

@connect(({ loading, overview, global, common }) => ({
  noticeList: global.notices,
  realtimeColumns: overview.realtimeColumns,
  realTimeDataView: overview.realTimeDataView,
  realTimeTotal: overview.realTimeTotal,
  dataLoading: loading.effects['overview/getRealTimeDataView'],
  columnLoading: loading.effects['overview/getRealTimeColumn'],
}))
class Realtime extends Component {
  constructor(props) {
    super(props);
    this.config = this.props.location.query.config
      ? JSON.parse(this.props.location.query.config)
      : undefined;
    this.state = {
      columns: [],
      selectedStatus: [],
      statusNumList: { 0: 0, 1: 0, 2: 0, 3: 0 },
      pageIndex: 1,
      fixed: false,
      currentDataType: 'HourData',
      realTimeDataView: [],
      filteredInfo: null,
      currentHour: moment().hour(),
      time:
        moment().hour() > 1
          ? moment(new Date())
              .add(-1, 'hour')
              .format('YYYY-MM-DD HH:00:00')
          : moment(new Date()).format('YYYY-MM-DD HH:00:00'),
      dayTime: moment(new Date()).add(-1, 'day'),
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.realtimeColumns !== nextProps.realtimeColumns) {
      this.getTableColumns(nextProps);
    }
    if (this.props.realTimeDataView !== nextProps.realTimeDataView) {
      // 排序后在展示
      const realTimeDataView = _.sortBy(nextProps.realTimeDataView.data, item => -item.AQI);
      this.setState({
        realTimeDataView,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedStatus !== prevState.selectedStatus) {
      this.getTableColumns(this.props);
    }
  }

  // 获取表格
  getTableColumns = nextProps => {
    let fixed =
      nextProps.realtimeColumns.length * 94 + 50 + 70 + 210 + 160 > $('#sdlTable').width();
    // const fixed = false;
    const width = 200;

    const realtimeColumns = nextProps.realtimeColumns.map((item, idx) => ({
      title: item.unit ? (
        <>
          {item.name}
          <br />({item.unit})
        </>
      ) : (
        item.title
      ),
      dataIndex: item.field,
      key: item.field,
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
          return text ? <span style={{ color: record.AQI_Color }}>{text}</span> : '-';
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
    if (
      this.state.pollutantCode === 5 ||
      (this.state.pollutantCode === 12 && configInfo.IsOpenAQI === '1')
    ) {
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

    let { sortedInfo, filteredInfo, pollutantCode, pageIndex, selectedStatus } = this.state;
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
        render: (value, record, index) => {
          console.log('this.state.pageIndex', this.state.pageIndex);
          return (this.state.pageIndex - 1) * 50 + index + 1;
        },
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
        filteredValue: selectedStatus || [],
        // onFilter: (value, record) => {
        //   if (
        //     record.pollutantTypeCode == 5 ||
        //     (record.pollutantTypeCode == 12 && configInfo.IsOpenAQI === '1')
        //   ) {
        //     if (value != 0) {
        //       return record.AirLevel == value;
        //     }
        //     return !record.AirLevel;
        //   }
        //   return record.status == value;
        // },
        render: (value, record, index) => {
          if (
            record.pollutantTypeCode == 5 ||
            (record.pollutantTypeCode == 12 && configInfo.IsOpenAQI === '1')
          ) {
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
          // 单企业不显示企业名称
          let pointName = configInfo.IsSingleEnt == '1' ? text : `${record.abbreviation} - ${text}`;
          if (this.state.pollutantCode == 5) {
            pointName = text;
          }
          let el = (
            <span>
              {pointName}
              {record.outPutFlag == 1 ? <Tag color="#f50">停运</Tag> : ''}
            </span>
          );
          return el;
        },
      },
      {
        title: '监测时间',
        width: 220,
        // width: 10,
        dataIndex: 'MonitorTime',
        key: 'MonitorTime',
        fixed,
        show: true,
        align: 'center',
        render: (text, record) => {
          return (
            <span>
              {getDataTruseMsg(record)}
              {text}
            </span>
          );
        },
        // sorter: (a, b) => a.MonitorTime - b.MonitorTime,
        // defaultSortOrder: 'descend'
      },
      ...realtimeColumns,
    ];
    this.setState({
      columns,
    });
  };

  // 获取页面数据
  getPageData = pollutantCode => {
    this.setState(
      {
        pollutantCode,
        pageIndex: 1,
      },
      () => {
        this.getRealTimeColumn();
        this.getRealTimeDataView();
      },
    );
  };

  // 获取表格数据
  getRealTimeDataView = () => {
    const { pointName, currentDataType, pollutantCode, time, dayTime, selectedStatus } = this.state;
    const { regionCode, entCode } = this.props;
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
        pageIndex: this.state.pageIndex,
        pageSize: 50,
        regionCode,
        entCode,
        pointName,
        dataType: currentDataType,
        pollutantTypes: pollutantCode,
        time: searchTime,
        status: selectedStatus,
        IsAddNums: true, // 是否返回状态数量
      },
      callback: res => {
        this.setState({
          statusNumList: res.statusList,
        });
      },
    });
  };

  // 获取表头
  getRealTimeColumn = () => {
    this.props.dispatch({
      type: 'overview/getRealTimeColumn',
      payload: {
        pollutantTypes: this.state.pollutantCode,
      },
    });
  };

  handleChange = (pagination, filters, sorter) => {
    let { current, pageSize } = pagination;
    if (this.state.selectedStatus.toString() !== filters.Status.toString()) {
      current = 1;
    }

    this.setState(
      {
        pageIndex: current,
        pageSize: pageSize,
        selectedStatus: filters.Status || [],
      },
      () => {
        this.getRealTimeDataView();
      },
    );
  };

  // 当前时间0-1之间：currentTime - 前一天；nextDayTime - 当天；
  // 1-23之间：currentTime - 当天；nextDayTime - 第二天
  getHourTimeOptions = () => {
    const options = [];
    const currentTime =
      moment().hour() > 1
        ? moment().format('YYYY-MM-DD')
        : moment()
            .add(-1, 'day')
            .format('YYYY-MM-DD');
    const nextDayTime =
      moment().hour() > 1
        ? moment()
            .add(1, 'day')
            .format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD');
    for (let i = 1; i < 24; i++) {
      const label = i >= 10 ? `${i}:00:00` : `0${i}:00:00`;
      options.push(<Option value={`${currentTime} ${label}`}>{label}</Option>);
    }
    return options.concat(<Option value={`${nextDayTime} 00:00:00`}>00:00:00</Option>);
  };

  // 根据地址栏参数，判断显示时间类别
  getOptionByDateType = () => {
    const { pollutantCode } = this.state;
    if (this.config[pollutantCode]) {
      const dateTypeList = this.config[pollutantCode].split(',');
      //   this.setState({
      //     currentDataType
      //   })
      return (
        <>
          {dateTypeList.includes('1') && (
            <Radio.Button key={1} value="RealTimeData">
              实时
            </Radio.Button>
          )}
          {dateTypeList.includes('2') &&
            this.state.pollutantCode != 5 &&
            this.state.pollutantCode != 12 && (
              <Radio.Button key={2} value="MinuteData">
                分钟
              </Radio.Button>
            )}
          {dateTypeList.includes('3') && (
            <Radio.Button key={3} value="HourData">
              小时
            </Radio.Button>
          )}
          {dateTypeList.includes('4') && (
            <Radio.Button key={4} value="DayData">
              日均
            </Radio.Button>
          )}
        </>
      );
    }
    return (
      <>
        {/* {(this.state.pollutantCode != 5 && this.state.pollutantCode != 12) && (
          <Radio.Button key={2} value="MinuteData">
            分钟
          </Radio.Button>
        )} */}
        <Radio.Button key={3} value="HourData">
          小时
        </Radio.Button>
        <Radio.Button key={4} value="DayData">
          日均
        </Radio.Button>
      </>
    );
  };

  onTagChange(tag, checked) {
    const { selectedStatus } = this.state;
    const nextSelectedTags = checked
      ? [...selectedStatus, tag]
      : selectedStatus.filter(t => t !== tag);
    debugger;
    console.log('You are interested in: ', nextSelectedTags);
    this.setState({ selectedStatus: nextSelectedTags }, () => {
      this.getRealTimeDataView();
    });
  }

  render() {
    const {
      currentDataType,
      columns,
      realTimeDataView,
      time,
      dayTime,
      pollutantCode,
      selectedStatus,
      statusNumList,
    } = this.state;
    // const { realTimeDataView, dataLoading, columnLoading } = this.props;
    const { dataLoading, columnLoading, hideBreadcrumb } = this.props;
    const _columns = columns.filter(item => item.show);
    const wrwList = columns.filter(itm => itm.wrw);
    return (
      <BreadcrumbWrapper hideBreadcrumb={!!hideBreadcrumb}>
        <Card
          title={
            <Space>
              <SelectPollutantType
                // style={{ float: 'left', marginRight: 20 }}
                showType="radio"
                value={this.state.pollutantCode}
                onChange={e => {
                  this.getPageData(e.target.value);
                  let dataType = this.state.currentDataType;
                  // 如果有config，切换时默认选择第一个
                  if (this.config && this.config[e.target.value]) {
                    const dateTypeList = this.config[e.target.value].split(',');
                    this.setState({
                      currentDataType: DateTypeList[dateTypeList[0] - 1],
                    });
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
                }}
                initCallback={defaultPollutantCode => {
                  this.getPageData(defaultPollutantCode);
                }}
                // defaultValue={selectpollutantTypeCode}
              />
              <Radio.Group
                value={currentDataType}
                onChange={e => {
                  this.props.dispatch({
                    type: 'overview/updateState',
                    payload: {
                      dataType: e.target.value,
                    },
                  });
                  const newColumns = this.state.columns;
                  newColumns[1].filteredValue = null;
                  this.setState(
                    {
                      currentDataType: e.target.value,
                      filteredInfo: null,
                      columns: newColumns,
                      pageIndex: 1,
                    },
                    () => {
                      this.getRealTimeDataView();
                    },
                  );
                }}
              >
                {this.config ? (
                  this.getOptionByDateType()
                ) : (
                  <>
                    {/* {(this.state.pollutantCode != 5 && this.state.pollutantCode != 12) && (
                      <Radio.Button key={2} value="MinuteData">
                        分钟
                      </Radio.Button>
                    )} */}
                    <Radio.Button key={3} value="HourData">
                      小时
                    </Radio.Button>
                    <Radio.Button key={4} value="DayData">
                      日均
                    </Radio.Button>
                    {/*<Radio.Button key={1} value="RealTimeData">*/}
                    {/*实时*/}
                    {/*</Radio.Button>*/}
                  </>
                )}
              </Radio.Group>
              {wrwList.length ? (
                <Popover
                  content={
                    <Row style={{ maxWidth: 700, minWidth: 300 }}>
                      {wrwList.map((item, index) => {
                        if (item.wrw) {
                          return (
                            <Col key={index} span={wrwList.length > 4 ? 6 : 24 / wrwList.length}>
                              <Checkbox
                                onChange={e => {
                                  if (e.target.checked === false && wrwList.length < 2) {
                                    message.warning('最少显示一个污染物');
                                    return;
                                  }
                                  const newColumns = columns;
                                  const num = pollutantCode == 5 || pollutantCode == 12 ? 7 : 4;
                                  newColumns[index + num].show = e.target.checked;
                                  this.setState({
                                    columns: newColumns,
                                  });
                                }}
                                checked={item.show}
                              >
                                {item.name}
                              </Checkbox>
                            </Col>
                          );
                        }
                      })}
                    </Row>
                  }
                  trigger="click"
                  visible={this.state.visible}
                  onVisibleChange={visible => {
                    this.setState({ visible });
                  }}
                >
                  <Button type="primary">污染物</Button>
                </Popover>
              ) : null}
              {currentDataType === 'HourData' && (
                // <TimePicker
                //   onChange={(time, timeString) => {
                //     this.setState(
                //       {
                //         time: time,
                //       },
                //       () => {
                //         this.getRealTimeDataView();
                //       },
                //     );
                //   }}
                //   style={{ width: 150, marginLeft: 20 }}
                //   defaultValue={time}
                //   format="HH:00:00"
                // />
                <Select
                  style={{ width: 150 }}
                  placeholder="请选择时间"
                  defaultValue={time}
                  suffixIcon={<ClockCircleOutlined />}
                  onChange={time => {
                    this.setState(
                      {
                        time,
                        pageIndex: 1,
                      },
                      () => {
                        this.getRealTimeDataView();
                      },
                    );
                  }}
                >
                  {this.getHourTimeOptions()}
                </Select>
              )}
              {currentDataType === 'DayData' && (
                <DatePicker
                  defaultValue={dayTime}
                  style={{ width: 150 }}
                  onChange={(date, dateString) => {
                    this.setState({ dayTime: date, pageIndex: 1 }, () => {
                      this.getRealTimeDataView();
                    });
                  }}
                />
              )}
              <Input.Search
                allowClear
                style={{ width: 300 }}
                onChange={e => {
                  this.setState({
                    pointName: e.target.value,
                    pageIndex: 1,
                  });
                }}
                onSearch={val => {
                  this.getRealTimeDataView();
                }}
                placeholder="请输入监控目标/监测点名称"
              />

              {!hideBreadcrumb && (
                <Radio.Group
                  value="data"
                  buttonStyle="solid"
                  onChange={e => {
                    e.target.value === 'map' &&
                      router.push('/monitoring/mapview?tabName=数据总览 - 地图');
                  }}
                >
                  <Radio.Button value="data">数据</Radio.Button>
                  <Radio.Button value="map">地图</Radio.Button>
                </Radio.Group>
              )}
            </Space>
          }
          extra={
            <Spin spinning={!!dataLoading}>
              {statusList.map(item => {
                return (
                  <CheckableTag
                    style={{
                      backgroundColor: selectedStatus.includes(item.value)
                        ? item.color
                        : 'transparent',
                      padding: '2px 10px',
                      cursor: 'pointer',
                      borderRadius: 0,
                      marginRight: 4,
                      // border: '1px solid rgb(52, 192, 102)',
                      // width: 94,
                    }}
                    key={item.value}
                    checked={selectedStatus.includes(item.value)}
                    onChange={checked => this.onTagChange(item.value, checked)}
                  >
                    <i
                      style={{
                        backgroundColor: item.color,
                        width: 6,
                        height: 6,
                        display: selectedStatus.includes(item.value) ? 'none' : 'inline-block',
                        borderRadius: '50%',
                        margin: '0 6px 2px 0',
                      }}
                    ></i>
                    <span
                      style={{
                        fontSize: 14,
                        color: selectedStatus.includes(item.value) ? '#fff' : item.color,
                        fontWeight: 'bold',
                      }}
                    >
                      {`${item.label} ${statusNumList[item.value]}`}
                    </span>
                  </CheckableTag>
                );
              })}
            </Spin>
          }
        >
          <SdlTable
            rowClassName={(record, index, indent) => {}}
            defaultWidth={94}
            loading={dataLoading || columnLoading}
            size="middle"
            bordered
            pagination={
              this.props.realTimeTotal > 50
                ? {
                    showQuickJumper: true,
                    showSizeChanger: false,
                    pageSize: 50, // this.props.pageSize,
                    current: this.state.pageIndex,
                    total: this.props.realTimeTotal,
                  }
                : false
            }
            dataSource={realTimeDataView}
            columns={_columns}
            onChange={this.handleChange}
          />
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default Realtime;
