import React, { Component } from 'react';
import { Card, Table, Row, Col, Radio, Popover, Select, Badge, Icon, Input, Tag, TimePicker, DatePicker, Popconfirm, Button, Checkbox, message } from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import SelectPollutantType from '@/components/SelectPollutantType';
import SdlTable from '@/components/SdlTable';
import { getPointStatusImg } from '@/utils/getStatusImg';
import { LegendIcon } from '@/utils/icon';
import { airLevel, AQIPopover, IAQIPopover } from '@/pages/monitoring/overView/tools';
import { router } from 'umi';
import { formatPollutantPopover, getDirLevel } from '@/utils/utils';
import _ from 'lodash';
import moment from 'moment';

import $ from 'jquery'
import styles from '../index.less';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const DateTypeList = ['RealTimeData', 'MinuteData', 'HourData', 'DayData']


@connect(({ loading, overview, global, autoForm }) => ({
  noticeList: global.notices,
  regionList: autoForm.regionList,
  realtimeColumns: overview.realtimeColumns,
  realTimeDataView: overview.realTimeDataView,
  entListByRegion: overview.entListByRegion,
  dataLoading: loading.effects['overview/getRealTimeDataView'],
  columnLoading: loading.effects['overview/getRealTimeColumn'],
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.config = this.props.location.query.config ? JSON.parse(this.props.location.query.config) : undefined;
    this.state = {
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

  componentDidMount() {
    this.getEntByRegion("");
    this.getRegionList();
  }

  // 获取行政区列表
  getRegionList = () => {
    this.props.dispatch({
      type: 'autoForm/getRegions',
      payload: { RegionCode: '', PointMark: '2', }
    });
  }

  getEntByRegion = (RegionCode) => {
    this.props.dispatch({
      type: 'overview/getEntByRegion', payload: { RegionCode },
    })
  }

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

      let { sortedInfo, pollutantCode } = this.state;
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
          title: '行政区',
          width: 170,
          dataIndex: 'regionName',
          key: 'regionName',
          fixed,
          show: true,
          align: 'center',
        },
        {
          title: '企业名称',
          width: 200,
          dataIndex: 'entName',
          key: 'entName',
          fixed,
          show: true,
          align: 'center',
        },
        {
          title: '监测点',
          dataIndex: 'pointName',
          width: 180,
          key: 'pointName',
          fixed,
          show: true,
          align: 'center',
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
                {text}{record.outPutFlag == 1 ? <Tag color="#f50">停运</Tag> : ''}
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
      this.setState({
        realTimeDataView,
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

  // 当前时间0-1之间：currentTime - 前一天；nextDayTime - 当天；
  // 1-23之间：currentTime - 当天；nextDayTime - 第二天
  getHourTimeOptions = () => {
    const options = [];
    const currentTime = moment().hour() > 1 ? moment().format('YYYY-MM-DD') : moment().add(-1, 'day').format('YYYY-MM-DD')
    const nextDayTime = moment().hour() > 1 ? moment().add(1, 'day').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    for (let i = 1; i < 24; i++) {
      const label = i >= 10 ? `${i}:00:00` : `0${i}:00:00`;
      options.push(<Option value={`${currentTime} ${label}`}>{label}</Option>)
    }
    return options.concat(<Option value={`${nextDayTime} 00:00:00`}>00:00:00</Option>);
  }

  // 根据地址栏参数，判断显示时间类别
  getOptionByDateType = () => {
    const { pollutantCode } = this.state;
    if (this.config[pollutantCode]) {
      const dateTypeList = this.config[pollutantCode].split(',')
      //   this.setState({
      //     currentDataType
      //   })
      return <>
        {
          dateTypeList.includes('1') && <Radio.Button key={1} value="RealTimeData">
            实时
        </Radio.Button>
        }
        {(dateTypeList.includes('2') && this.state.pollutantCode != 5 && this.state.pollutantCode != 12) && (
          <Radio.Button key={2} value="MinuteData">
            分钟
          </Radio.Button>
        )}
        {
          dateTypeList.includes('3') && <Radio.Button key={3} value="HourData">
            小时
        </Radio.Button>
        }
        {
          dateTypeList.includes('4') && <Radio.Button key={4} value="DayData">
            日均
        </Radio.Button>
        }
      </>
    }
    return <>
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
  }

  render() {
    const { currentDataType, columns, realTimeDataView, time, dayTime, pollutantCode } = this.state;
    // const { realTimeDataView, dataLoading, columnLoading } = this.props;
    const { dataLoading, columnLoading, entListByRegion, regionList } = this.props;

    let _regionList = regionList.length ? regionList[0].children : [];


    const _columns = columns.filter(item => item.show);
    const scrollXWidth = _columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);
    const wrwList = columns.filter(itm => itm.wrw);


    return (
      <BreadcrumbWrapper>
        <Card
          title={
            <>
              <Row>
                <SelectPollutantType
                  style={{ float: 'left', marginRight: 10 }}
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
                      },
                      () => {
                        this.getRealTimeDataView();
                      },
                    );
                  }}
                >
                  <>
                    <Radio.Button key={1} value="RealTimeData">
                      实时
                    </Radio.Button>
                    {(this.state.pollutantCode != 5 && this.state.pollutantCode != 12) && (
                      <Radio.Button key={2} value="MinuteData">
                        分钟
                      </Radio.Button>
                    )}
                    <Radio.Button key={3} value="HourData">
                      小时
                  </Radio.Button>
                    <Radio.Button key={4} value="DayData">
                      日均
                  </Radio.Button>
                  </>
                </Radio.Group>
                {currentDataType === 'HourData' && (
                  <Select
                    style={{ width: 150, marginLeft: 10 }}
                    placeholder="请选择时间"
                    defaultValue={time}
                    suffixIcon={<Icon type="clock-circle" />}
                    onChange={time => {
                      this.setState(
                        {
                          time,
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
                    style={{ width: 150, marginLeft: 10 }}
                    onChange={(date, dateString) => {
                      this.setState({ dayTime: date }, () => {
                        this.getRealTimeDataView();
                      });
                    }}
                  />
                )}
                {
                  wrwList.length ? <Popover
                    content={
                      <Row style={{ maxWidth: 700, minWidth: 300 }}>
                        {
                          wrwList.map((item, index) => {
                            if (item.wrw) {
                              return <Col span={wrwList.length > 4 ? 6 : 24 / wrwList.length}>
                                <Checkbox onChange={e => {
                                  if (e.target.checked === false && wrwList.length < 2) {
                                    message.warning('最少显示一个污染物');
                                    return;
                                  }
                                  const newColumns = columns;
                                  const num = (pollutantCode == 5 || pollutantCode == 12) ? 7 : 4;
                                  newColumns[index + num].show = e.target.checked;
                                  this.setState({
                                    columns: newColumns,
                                  })
                                }} checked={item.show}>{item.name}</Checkbox>
                              </Col>
                            }
                          })
                        }
                      </Row>
                    }
                    trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={visible => {
                      this.setState({ visible });
                    }}
                  >
                    <Button style={{ marginLeft: 10 }} type="primary">选择污染物</Button>
                  </Popover> : null
                }

              </Row>
              <Row style={{ marginTop: 10 }}>
                <Select style={{ width: 140 }} allowClear placeholder="请选择行政区" onChange={(value) => {
                  this.setState({
                    regionCode: value
                  }, () => {
                    this.getEntByRegion(value)
                  })
                }}>
                  {
                    _regionList.map(item => {
                      return <Option key={item.key} value={item.value}>
                        {item.title}
                      </Option>
                    })
                  }
                </Select>
                <Select style={{ width: 200, marginLeft: 10 }} allowClear placeholder="请选择企业列表1">
                  {
                    entListByRegion.map(item => {
                      return <Option key={item.EntCode} value={item.EntCode}>
                        {item.EntName}
                      </Option>
                    })
                  }
                </Select>
                <Checkbox.Group style={{ width: 180, textAlign: 'center' }}>
                  <Checkbox value="1">正常</Checkbox>
                  <Checkbox value="0">停运</Checkbox>
                </Checkbox.Group>
              </Row>
            </>
          }
          extra={
            <div></div>
          }
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
