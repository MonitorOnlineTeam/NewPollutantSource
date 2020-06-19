import React, { Component } from 'react';
import { Card, Table, Row, Col, Radio, Popover, Select, Badge, Icon, Input, Tag, TimePicker, DatePicker, Popconfirm, Button, Checkbox, message } from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SelectPollutantType from '@/components/SelectPollutantType';
import SdlTable from '@/components/SdlTable';
import { getPointStatusImg } from '@/utils/getStatusImg';
import { LegendIcon } from '@/utils/icon';
import { airLevel, AQIPopover, IAQIPopover } from '@/pages/monitoring/overView/tools';
import { router } from 'umi';
import { formatPollutantPopover } from '@/utils/utils';
import styles from '../index.less';
import _ from 'lodash';
import moment from 'moment';
import { getDirLevel } from '@/utils/utils';
import $ from 'jquery'

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const DateTypeList = ["RealTimeData", "MinuteData", "HourData", "DayData"]


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
      columns: [],
      fixed: false,
      currentDataType: 'HourData',
      realTimeDataView: [],
      filteredInfo: null,
      currentHour: moment().hour(),
      time: moment().hour() > 1 ? moment(new Date()).add(-1, 'hour').format("YYYY-MM-DD HH:00:00") : moment(new Date()).format("YYYY-MM-DD HH:00:00"),
      dayTime: moment(new Date()).add(-1, 'day'),
    };
  }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    if (this.props.realtimeColumns !== nextProps.realtimeColumns) {
      // let fixed = (nextProps.realtimeColumns.length * 80 + 60 + 70 + 220 + 160) > $(".sdlTable").width();
      let fixed = false;
      let width = 200;

      let realtimeColumns = nextProps.realtimeColumns.map((item, idx) => {
        return {
          title: item.unit ? <>{item.name}<br />({item.unit})</> : item.title,
          dataIndex: item.field,
          name: item.name,
          // width: item.title.indexOf("(") > -1 ? item.title.length * 10 : item.title.length * 20,
          width: item.width || undefined,
          sorter: item.wrw !== false ? (a, b) => a[item.field] - b[item.field] : false,
          defaultSortOrder: item.field === 'AQI' ? 'descend' : null,
          show: true,
          wrw: item.wrw !== undefined ? item.wrw : true,
          render: (text, record) => {
            if (item.field === 'AQI') {
              return AQIPopover(text, record);
            }
            if (record[item.field + '_Value'] !== undefined) {
              return IAQIPopover(text, record, item.field);
            }
            if (item.title === "空气质量") {
              return text ? <span style={{ color: record['AQI_Color'] }}>{text}</span> : "-"
            }
            // 风向转换
            if (item.name === '风向') {
              let _text = text ? `${getDirLevel(text)}` : '-';
              return formatPollutantPopover(_text, record[`${item.field}_params`]);
            }
            return formatPollutantPopover(text, record[`${item.field}_params`]);
          },
        };
      });

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
        statusFilters = airLevel.map(item => {
          return {
            text: (
              <span>
                <LegendIcon style={{ color: item.color }} />
                {item.text}
              </span>
            ),
            value: item.levelText,
          };
        });
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
      let columns = [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 50,
          align: 'center',
          fixed: fixed,
          show: true,
          render: (value, record, index) => {
            return index + 1;
          },
        },
        {
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          width: 70,
          // width: 120,
          align: 'center',
          fixed: fixed,
          show: true,
          filters: statusFilters,
          filteredValue: filteredInfo.Status || null,
          onFilter: (value, record) => {
            if (record.pollutantTypeCode == 5 || record.pollutantTypeCode == 12) {
              if (value != 0) {
                return record.AirLevel == value;
              } else {
                return !record.AirLevel;
              }
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
          fixed: fixed,
          show: true,
          render: (text, record) => {
            if (this.state.pollutantCode == 5) {
              return (
                <span>
                  {text}{record.outPutFlag==1? <Tag color="#f50">停运</Tag>:""}
                </span>
              );
            }
            return (
              <span>
                {record.abbreviation} - {text}{record.outPutFlag==1? <Tag color="#f50">停运</Tag>:""}
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
          fixed: fixed,
          show: true,
          // sorter: (a, b) => a.MonitorTime - b.MonitorTime,
          // defaultSortOrder: 'descend'
        },
        ...realtimeColumns,
      ];
      this.setState({
        columns: columns,
      });
    }
    if (this.props.realTimeDataView !== nextProps.realTimeDataView) {
      // 排序后在展示
      let realTimeDataView = _.sortBy(nextProps.realTimeDataView, function (item) {
        return -item.AQI;
      });
      this.setState({
        realTimeDataView: realTimeDataView,
      });
    }
  }

  // 获取页面数据
  getPageData = pollutantCode => {
    this.setState(
      {
        pollutantCode: pollutantCode,
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
    let searchTime = undefined;
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
        pointName: pointName,
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
    let options = [];
    let currentTime = moment().hour() > 1 ? moment().format("YYYY-MM-DD") : moment().add(-1, "day").format("YYYY-MM-DD")
    let nextDayTime = moment().hour() > 1 ? moment().add(1, "day").format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")
    for (var i = 1; i < 24; i++) {
      let label = i >= 10 ? `${i}:00:00` : `0${i}:00:00`;
      options.push(<Option value={`${currentTime} ${label}`}>{label}</Option>)
    }
    return options.concat(<Option value={`${nextDayTime} 00:00:00`}>00:00:00</Option>);
  }

  // 根据地址栏参数，判断显示时间类别
  getOptionByDateType = () => {
    const pollutantCode = this.state.pollutantCode;
    if (this.config[pollutantCode]) {
      const dateTypeList = this.config[pollutantCode].split(",")
      //   this.setState({
      //     currentDataType
      //   })
      return <>
        {
          dateTypeList.includes("1") && <Radio.Button key={1} value="RealTimeData">
            实时
        </Radio.Button>
        }
        {(dateTypeList.includes("2") && this.state.pollutantCode != 5 && this.state.pollutantCode != 12) && (
          <Radio.Button key={2} value="MinuteData">
            分钟
          </Radio.Button>
        )}
        {
          dateTypeList.includes("3") && <Radio.Button key={3} value="HourData">
            小时
        </Radio.Button>
        }
        {
          dateTypeList.includes("4") && <Radio.Button key={4} value="DayData">
            日均
        </Radio.Button>
        }
      </>
    } else {
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
  }

  render() {
    const { currentDataType, columns, realTimeDataView, time, dayTime, pollutantCode } = this.state;
    // const { realTimeDataView, dataLoading, columnLoading } = this.props;
    const { dataLoading, columnLoading } = this.props;
    const _columns = columns.filter(item => item.show);
    let scrollXWidth = _columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);
    const wrwList = columns.filter(itm => itm.wrw);


    return (
      <BreadcrumbWrapper title="数据一览">
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
                    const dateTypeList = this.config[e.target.value].split(",")
                    this.setState({
                      currentDataType: DateTypeList[dateTypeList[0] - 1]
                    })
                    dataType = DateTypeList[dateTypeList[0] - 1];
                  } else {
                    if (e.target.value == 5 || e.target.value == 12) {
                      this.setState({
                        currentDataType: 'HourData',
                        filteredInfo: null,
                      });
                      dataType = "HourData";
                    }
                  }

                  // 更新model - dataType 用来接收实时数据
                  this.props.dispatch({
                    type: 'overview/updateState',
                    payload: {
                      dataType
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
                {this.config ?
                  this.getOptionByDateType()
                  :
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
                  </>}
              </Radio.Group>
              {
                wrwList.length ? <Popover
                  content={
                    <Row style={{ maxWidth: 700, minWidth: 300 }}>
                      {
                        wrwList.map((item, index) => {
                          if (item.wrw) {
                            return <Col span={wrwList.length > 4 ? 6 : 24 / wrwList.length}>
                              <Checkbox onChange={(e) => {
                                if (e.target.checked === false && wrwList.length < 2) {
                                  message.warning("最少显示一个污染物");
                                  return;
                                }
                                let newColumns = columns;
                                let num = (pollutantCode == 5 || pollutantCode == 12) ? 7 : 4;
                                newColumns[index + num].show = e.target.checked;
                                this.setState({
                                  columns: newColumns
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
                  <Button style={{ marginLeft: 10 }} type="primary">污染物</Button>
                </Popover> : null
              }
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
                  style={{ width: 150, marginLeft: 20 }}
                  placeholder="请选择时间"
                  defaultValue={time}
                  suffixIcon={<Icon type="clock-circle" />}
                  onChange={(time) => {
                    this.setState(
                      {
                        time: time,
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
                  style={{ width: 150, marginLeft: 20 }}
                  onChange={(date, dateString) => {
                    this.setState({ dayTime: date }, () => {
                      this.getRealTimeDataView();
                    });
                  }}
                />
              )}
              <Input.Search
                allowClear
                style={{ width: 300, marginLeft: 20 }}
                onChange={e => {
                  this.setState({
                    pointName: e.target.value,
                  });
                }}
                onSearch={val => {
                  this.getRealTimeDataView();
                }}
                placeholder="请输入监测点名称"
              />
            </>
          }
          extra={
            <Radio.Group
              value="data"
              buttonStyle="solid"
              onChange={e => {
                e.target.value === 'map' && router.push('/monitoring/mapview?tabName=数据一览 - 地图');
              }}
            >
              <Radio.Button value="data">数据</Radio.Button>
              <Radio.Button value="map">地图</Radio.Button>
            </Radio.Group >
          }
        >
          <SdlTable
            rowClassName={(record, index, indent) => {
              return;
            }}
            defaultWidth={94}
            loading={dataLoading || columnLoading}
            size="middle"
            bordered={true}
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
