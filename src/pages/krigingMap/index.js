import React, { PureComponent } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader';
import { Map, Polygon, Markers, InfoWindow, MouseTool } from 'react-amap';
import { Row, Slider, Drawer, DatePicker, Button, Space, Divider, Spin, message } from 'antd';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons'
import styles from './index.less'
import { airLevel } from '@/pages/monitoring/overView/tools'
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import moment from 'moment';
import createThem from './draw.js'
import SdlTable from '@/components/SdlTable'

const amapKey = '5e60171b820065e7e9a1d6ea45abaee9';
const pollutantTypeList = [
  { name: 'AQI', value: 'AQI' },
  { name: 'PM₂.₅', value: 'a34004' },
  { name: 'PM₁₀', value: 'a34002' },
  { name: 'SO₂', value: 'a21026' },
  { name: 'NO₂', value: 'a21004' },
  { name: 'CO', value: 'a21005' },
  { name: 'O₃', value: 'a05024' },
]
const { RangePicker } = DatePicker;
let _thismap;
let timer = null; // 定时器
const columns = [
  {
    title: '排名',
    dataIndex: 'index',
    key: 'index',
    width: 40,
    render: (text, record, index) => {
      return index + 1;
    }
  },
  {
    title: '站点',
    dataIndex: 'PointName',
    key: 'PointName',
  },
  {
    title: 'AQI',
    dataIndex: 'AQI',
    key: 'AQI',
    width: 40,
    render: (text, record, index) => {
      return <span style={{ color: record.AQI_Color }}>{text}</span>
    }
  },
  {
    title: '首污',
    dataIndex: 'PrimaryPollutant',
    key: 'PrimaryPollutant',
    width: 60,
    render: (text, record, index) => {
      return record.PrimaryPollutant || '-'
    }
  },
];

@connect(({ loading, krigingMap }) => ({
  rankLoading: loading.effects['krigingMap/GetAirRankHour'],
  mapLoading: loading.effects['krigingMap/getMapData'],
  rankHourData: krigingMap.rankHourData,
  mapData: krigingMap.mapData,
  time: krigingMap.time,
  dateTimeAllData: krigingMap.dateTimeAllData,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);

    let beginTime = moment().subtract(6, 'days');
    let endTime = moment();
    let diff = endTime.diff(beginTime, 'day') + 1;
    let timeLineData = [];
    for (let i = 0; i < diff; i++) {
      let time = moment(beginTime).add(i, 'day').format("YYYY-MM-DD")
      timeLineData.push(time)
    }

    this.state = {
      markersList: [],
      count: 0,
      start: false,
      selectPollutant: { name: 'AQI', value: 'AQI' },
      beginTime: beginTime,
      endTime: endTime,
      timeLineData: [],
    }
    this.map = {};
  }


  componentDidMount() {
    this.mapInit();
    this.getRankHourData();
    // this.getMapData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.mapData !== this.props.mapData) {
      this.handleMarker(this.props.mapData)
    }
    if (prevProps.time !== this.props.time) {
      debugger
      this.setState({
        updateTime: this.props.time
      })
    }
  }


  handleMarker = (mapData) => {
    let markersList = [];
    let _mapData = [...mapData, {
      AQI: 136,
      AQI_Color: "#00e400",
      Latitude: 27.076599,
      Longitude: 115.369221,
      PointName: "北口空气站",
      PrimaryPollutant: ""
    }]
    this.map.remove(this.state.markersList)
    _mapData.map(item => {
      let marker = new this.AMap.Marker({
        content: `<div class="air-map-title">
          <div class='map-title-tag' style='background: ${item.AQI_Color}'>
            <i style='border-top-color: ${item.AQI_Color}'></i>
            ${item.AQI}
          </div>
          <div class="content" style="width: ${item.PointName.length * 18}px, left: ${(item.PointName.length * 18 - 60) / 2 * -1}px">
            ${item.PointName}
          </div>
        <div>`,
        position: [item.Longitude, item.Latitude],
        title: item.AQI,
        map: this.map
      });
      markersList.push(marker)
    })
    this.setState({
      markersList: markersList
    }, () => {
      console.log('_mapData=', _mapData);
      createThem(this.AMap, _mapData, this.map, 'AQI')
    })
  }

  // 114.971797,27.495262
  // 115.135963,27.229697
  // 115.369221,27.076599
  mapInit = () => {
    AMapLoader.load({
      key: "5e60171b820065e7e9a1d6ea45abaee9",                     // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0",              // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [''],               // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap) => {
      this.map = new AMap.Map("mapContainer", { //设置地图容器id
        // viewMode: "3D",         //是否为3D地图模式
        zoom: 11,                //初始化地图级别
        center: [115.135963, 27.229697], //初始化地图中心点位置
      });
      this.AMap = AMap;
      this.getMapData();
    }).catch(e => {
      console.log(e);
    })
  }

  // 获取小时排名
  getRankHourData = () => {
    this.props.dispatch({
      type: "krigingMap/GetAirRankHour",
      payload: {
        Type: 'new',
        Params: this.state.selectPollutant.value,
        beginTime: moment().subtract(1, 'hours').format("YYYY-MM-DD HH:00:00"),
        endTime: moment().format("YYYY-MM-DD HH:59:59"),
      }
    })
  }

  // 根据时间范围获取地图数据
  getMapData = () => {
    const { beginTime, endTime } = this.state;
    let diff = endTime.diff(beginTime, 'day') + 1;
    if (diff > 7) {
      message.error('查询时间间隔不能大于7天！')
      return;
    }
    this.props.dispatch({
      type: "krigingMap/getMapData",
      payload: {
        Type: 'map',
        Params: this.state.selectPollutant.value,
        beginTime: moment(beginTime).format("YYYY-MM-DD 00:00:00"),
        endTime: moment(endTime).format("YYYY-MM-DD 23:59:59"),
      },
      callback: () => {
        let diff = endTime.diff(beginTime, 'day') + 1;
        let timeLineData = [];
        for (let i = 0; i < diff; i++) {
          let time = moment(beginTime).add(i, 'day').format("YYYY-MM-DD")
          timeLineData.push(time)
        }
        this.setState({
          timeLineData: timeLineData
        })
      }
    })
  }


  renderMarkers = (extData) => {
    return <div className={styles.AQIBox} style={{ backgroundColor: extData.AQI_Color !== '-' ? extData.AQI_Color : '#999999' }}>
      {extData.AQI}
    </div>

  }

  // 开始播放
  start = () => {
    const { dateTimeAllData } = this.props;
    this.setState({
      start: true
    })
    timer = setInterval(() => {
      let count = this.state.count + 1;
      if (count === dateTimeAllData.length) {
        clearInterval(timer);
        this.setState({
          start: false
        })
      } else {
        this.handleMarker([...dateTimeAllData[count].Value])
      }
      this.setState({
        count: count,
        updateTime: dateTimeAllData[count].Time
      })
    }, 1000)
  }

  // 暂停
  pause = () => {
    clearInterval(timer);
    this.setState({ start: false })
  }

  // 选择污染物 - 重新获取数据
  onChangePollutant = (item) => {
    this.setState({ selectPollutant: item, count: 0, start: false }, () => {
      clearInterval(timer);
      this.getRankHourData();
      this.getMapData();
    })
  }

  getOption = () => {
    const { rankHourData } = this.props;
    let PointNameList = [], AQIList = [], colors = [];
    rankHourData.map(item => {
      PointNameList.push(item.PointName);
      AQIList.push(item.AQI);
      colors.push(item.AQI_Color)
    })
    return {
      // title: {
      //   text: 'AQI排名',
      //   x: 'center',
      //   textStyle: {
      //     fontSize: 16,
      //     fontWeight: 'bolder',
      //     // color: '#fff'
      //   }
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '0%',
        right: '6%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          },
        }
      ],
      yAxis: [
        {
          type: 'category',
          // axisTick: {
          //   show: false
          // },
          data: PointNameList
        }
      ],
      series: [
        {
          name: 'AQI',
          type: 'bar',
          label: {
            show: true,
            position: 'right'
          },
          barWidth: 14,
          itemStyle: {
            // color: '#ff7e00',
            color: (params) => {
              return colors[params.dataIndex]
              // console.log("params22=", params)
              // if (params.data[1] > 100) {
              // return params.data[2]
              // }
              // return item.colorList[params.seriesIndex]

            }
          },
          data: AQIList
        },
        // {
        //     name: '收入',
        //     type: 'bar',
        //     // stack: '总量',
        //     label: {
        //         show: true,
        //         position: 'right'
        //     },
        //     data: [320, 302, 341, 374, 390, 450, 420]
        // },
        // {
        //     name: '支出',
        //     type: 'bar',
        //     // stack: '总量',
        //     label: {
        //         show: true,
        //         position: 'right'
        //     },
        //     data: [120, 132, 101, 134, 190, 230, 210]
        // }
      ]
    };
  }

  render() {
    const { mapData, dateTimeAllData, rankHourData, rankLoading, mapLoading } = this.props;
    const { start, count, markersList, selectPollutant, updateTime, beginTime, endTime, timeLineData } = this.state;
    console.log('timeLineData=', timeLineData);
    return (
      <div className={styles.pageContaniner}>
        <div className={styles.rankWrapper}>
          <Drawer width={400} closable={false} mask={false} placement="left" visible={true}>
            <Spin spinning={rankLoading}>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{selectPollutant.name}小时排名</div>
              <Divider orientation="left" plain>数据更新时间：{moment().subtract(1, 'hours').format("YYYY-MM-DD HH:00")}</Divider>
              <SdlTable
                size="small"
                dataSource={rankHourData}
                columns={columns}
                pagination={false}
                rowClassName={(record, index, indent) => { return; }}
              />
              {
                rankHourData.length ?
                  <ReactEcharts
                    option={this.getOption()}
                    style={{ height: '600px' }}
                    className="echarts-for-echarts"
                    theme="my_theme"
                  /> : ''
              }
            </Spin>
          </Drawer>
        </div>

        <div id="mapContainer" className={styles.mapWrapper} style={{ height: '100vh' }}>
          {/* <Spin spinning={true} wrapperClassName={styles.mapSpin} style={{ height: '100vh', position: 'relative' }}> */}
          <InfoWindow
            position={[115.135963, 27.229697]}
            visible={true}
            isCustom
          >
            <h3>Window 1</h3>
          </InfoWindow>
          <Space className={styles.searchTime}>
            <RangePicker defaultValue={[beginTime, endTime]} style={{ width: 300 }}
              disabledDate={(current) => {
                // Can not select days before today and today
                return current && current > moment().endOf('day');
              }}
              onChange={(dates) => {
                this.setState({
                  beginTime: dates[0],
                  endTime: dates[1],
                })
              }} />
            <Button type="primary" onClick={() => {
              let diff = endTime.diff(beginTime, 'day') + 1;
              let timeLineData = [];
              for (let i = 0; i < diff; i++) {
                let time = moment(beginTime).add(i, 'day').format("YYYY-MM-DD")
                timeLineData.push(time)
              }
              this.setState({
                start: false,
                count: 0,
                // timeLineData: timeLineData,
              }, () => {
                clearInterval(timer);
              })
              this.getMapData();
            }}>查询</Button>
          </Space>
          <div class='airLegend' style={{ position: 'absolute', right: 6, top: 6, zIndex: 1 }}>
            <ul>
              {
                airLevel.map(item => <li>
                  <span>{item.text}</span>
                  <span style={{ backgroundColor: item.color }}></span>
                  <span>{item.standardValue}</span>
                </li>)
              }
            </ul>
          </div>
          <div className={styles.timeBar}>
            数据更新时间: {moment(updateTime).format("YYYY-MM-DD HH:00")}
          </div>
          <ul className={styles.pollutantSelectContainer}>
            {
              pollutantTypeList.map(item => {
                return <li onClick={() => this.onChangePollutant(item)} className={selectPollutant.value === item.value ? styles.active : ''}>{item.name}</li>
              })
            }
          </ul>
          <div className={styles.sliderContainer}>
            <div className={styles.leftIcon}>
              {
                !start ? <CaretRightOutlined className={styles.handleIcon} onClick={this.start} /> :
                  <PauseOutlined className={styles.handleIcon} onClick={this.pause} />
              }
            </div>
            <div className={styles.content}>
              <Slider
                value={count}
                max={dateTimeAllData.lenth}
                // max={100}
                // float: left;
                // width: calc(100% - 60px);
                // padding: 0;
                // margin: 0;
                // margin-top: 6px;
                style={{ float: 'left', width: '100%', padding: 0, margin: 0, marginTop: 4, height: 4 }}
                tooltipVisible
                tipFormatter={(value => {
                  console.log('value=', value);
                  if (dateTimeAllData.length) {
                    return dateTimeAllData[value].Time
                  }
                })}
                onChange={(value) => {
                  this.setState({
                    count: value,
                  })
                }}
                onAfterChange={(value) => {
                  console.log('onAfterChange=', value);
                  let currentData = dateTimeAllData[value].Value;
                  this.handleMarker(currentData);
                  // this.setState({
                  //   count: value,
                  // })
                }}
              />
              <div className={styles.timeLine}>
                {
                  timeLineData.map(item => {
                    return <div>{item}</div>
                  })
                }
              </div>
            </div>
          </div>
          {/* </Spin> */}
        </div>
      </div>
    );
  }
}

export default index;