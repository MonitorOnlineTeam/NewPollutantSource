import React, { PureComponent } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader';
import { Map, Polygon, Markers, InfoWindow, MouseTool } from 'react-amap';
import { Row, Slider, Drawer, DatePicker, Button, Space, Divider, Spin, message } from 'antd';
import { CaretRightOutlined, PauseOutlined, LoadingOutlined } from '@ant-design/icons'
import styles from './index.less'
import $script from 'scriptjs';
import { airLevel } from '@/pages/monitoring/overView/tools'
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import moment from 'moment';
import createThem from './draw.js'
import SdlTable from '@/components/SdlTable'
import _ from 'lodash'


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

@connect(({ loading, krigingMap, }) => ({
  rankLoading: loading.effects['krigingMap/GetAirRankHour'],
  mapLoading: loading.effects['krigingMap/getMapData'],
  rankHourData: krigingMap.rankHourData,
  mapData: krigingMap.mapData,
  time: krigingMap.time,
  dateTimeAllData: krigingMap.dateTimeAllData,
}))
class index extends PureComponent {
  constructor(props) {
    window.AMap = undefined;
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
    this.AMap = {};
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
      this.setState({
        updateTime: this.props.time
      })
    }
  }


  handleMarker = (mapData) => {
    let markersList = [];
    let _mapData = [...mapData,
      // let _mapData = [
      // 114.895079,27.5516
      // {
      //   AQI: 82,
      //   AQI_Color: "#00e400",
      //   Num: 2,
      //   AQI_Level: 0,
      //   Latitude: 27.246794,
      //   Longitude: 115.137833,
      //   PointName: "西口空气站",
      //   PrimaryPollutant: ""
      // },
      // {
      //   AQI: 82,
      //   AQI_Color: "#00e400",
      //   Num: 2,
      //   AQI_Level: 1,
      //   Latitude: 27.046794,
      //   Longitude: 115.237833,
      //   // Latitude: 0,
      //   // Longitude: 0,
      //   PointName: "测试空气站1",
      //   PrimaryPollutant: ""
      // },
      // // {
      // //   AQI: 82,
      // //   AQI_Color: "#00e400",
      // //   Num: 2,
      // //   AQI_Level: 2,
      // //   Latitude: 0,
      // //   Longitude: 0,
      // //   PointName: "测试空气站2",
      // //   PrimaryPollutant: ""
      // // },
      // {
      //   AQI: 82,
      //   AQI_Color: "#00e400",
      //   Num: 2,
      //   AQI_Level: 2,
      //   Latitude: 27.146794,
      //   Longitude: 115.337833,
      //   // Latitude: 0,
      //   // Longitude: 0,
      //   PointName: "测试空气站2",
      //   PrimaryPollutant: ""
      // },
      // {
      //   AQI: 80,
      //   AQI_Level: 2,
      //   AQI_Color: "#f3dd22",
      //   Latitude: 27.076599,
      //   Longitude: 115.369221,
      //   PointName: "测试空气站2",
      //   PrimaryPollutant: ""
      // },
      // {
      //   AQI: 30,
      //   AQI_Color: "#00e400",
      //   AQI_Level: 1,
      //   Latitude: 27.495262,
      //   Longitude: 114.971797,
      //   PointName: "测试空气站",
      //   PrimaryPollutant: ""
      // },
    ]
    console.log('_mapData=', _mapData)
    this.state.markersList.length ? this.map.remove(this.state.markersList) : ''
    _mapData.map(item => {
      let marker = new this.AMap.Marker({
        content: `<div class="air-map-title">
          <div class='map-title-tag' style='background: ${item.AQI_Color}'>
            <i style='border-top-color: ${item.AQI_Color}'></i>
            ${item.AQI}
          </div>
          <div class="content" style="width: ${item.PointName.length * 19}px; left: ${(item.PointName.length * 18 - 60) / 2 * -1}px">
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
      let newMapData = _.sortBy(_mapData, function (o) { return o.AQI_Level; });
      createThem(this.AMap, newMapData, this.map, this.gif)
    })
  }

  // 114.971797,27.495262
  // 115.135963,27.229697
  // 115.369221,27.076599
  mapInit = () => {
    AMapLoader.load({
      key: "5e60171b820065e7e9a1d6ea45abaee9",                     // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0",              // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [''],               // 需要使用的的插件列表，如比例尺'AMap.thematicMapScale'等
    }).then((AMap_) => {
      if (AMap_) {
        this.getAMap(AMap_);
      } else {
        $script('https://webapi.amap.com/maps?callback=___onAPILoaded&v=2.0&key=5e60171b820065e7e9a1d6ea45abaee9&plugin=', (a) => {
          this.getAMap(window.AMap);
        })
      }
    }).catch(e => {
      console.log(e);
    })


  }


  getAMap = (AMap_) => {
    this.map = new AMap_.Map("mapContainer", { //设置地图容器id
      // viewMode: "3D",         //是否为3D地图模式
      zoom: 11,                //初始化地图级别
      center: [115.135963, 27.229697], //初始化地图中心点位置
      WebGLParams: {
        preserveDrawingBuffer: true
      }
    });
    this.AMap = AMap_;
    this.getMapData();
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

  // // 开始播放
  // start = () => {
  //   const { dateTimeAllData } = this.props;
  //   this.setState({
  //     start: true
  //   })
  //   timer = setInterval(() => {
  //     let count = this.state.count + 1;
  //     if (count === dateTimeAllData.length) {
  //       clearInterval(timer);
  //       this.setState({
  //         start: false
  //       })
  //     } else {
  //       this.handleMarker([...dateTimeAllData[count].Value])
  //     }
  //     this.setState({
  //       count: count,
  //       updateTime: dateTimeAllData[count].Time
  //     })
  //   }, 1000)
  // }

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
        bottom: '10%',
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

  renderGif = () => {
    this.setState({
      gifLoading: true
    })
    const { dateTimeAllData } = this.props;
    let gif = new window.GIF({
      workers: 2,
      quality: 10,
      width: 1000,
      height: 1000,
      workerScript: '/gif/gif.worker.js',
    })
    this.gif = gif;
    let count = 0;
    timer = setInterval(() => {
      count += 1;
      if (count === dateTimeAllData.length) {
        clearInterval(timer);
        gif.on('finished', (blob) => {
          //下载动作
          var el = document.createElement('a');
          el.href = URL.createObjectURL(blob);
          el.download = '克里金插值GIF图'; //设置下载文件名称
          document.body.appendChild(el);
          var evt = document.createEvent("MouseEvents");
          evt.initEvent("click", false, false);
          el.dispatchEvent(evt);
          document.body.removeChild(el);
          this.handleMarker(this.props.mapData);
          this.setState({
            gifLoading: false
          })
        });
        gif.render();
      } else {
        let data = dateTimeAllData[count].Value;
        // createThem(this.AMap, data, this.map, this.gif)
        this.handleMarker(data)
      }
      console.log('count=', count);
      console.log('length=', dateTimeAllData.length);
    }, 1000)
  }

  render() {
    const { mapData, dateTimeAllData, rankHourData, rankLoading, mapLoading } = this.props;
    const { start, count, gifLoading, selectPollutant, updateTime, beginTime, endTime, timeLineData } = this.state;
    return (
      <div className={styles.pageContaniner} >
        <div className={styles.rankWrapper}>
          <Drawer width={400} closable={false} mask={false} placement="left" visible={true} style={{ marginTop: 64 }}>
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

        <div id="mapContainer" className={styles.mapWrapper}>
          {
            mapLoading && <div className={styles.gifLoading}>
              <LoadingOutlined />
              {/* <p>生成GIF中，请等待...</p> */}
            </div>
          }
          {
            gifLoading && <div className={styles.gifLoading}>
              <LoadingOutlined />
              <p>生成GIF中，请等待...</p>
            </div>
          }
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
            <Button onClick={() => this.renderGif()}>下载GIF</Button>
          </Space>
          {/* <div class='airLegend' style={{ position: 'absolute', right: 6, top: 6, zIndex: 1 }}>
            <ul>
              {
                airLevel.map(item => <li>
                  <span>{item.text}</span>
                  <span style={{ backgroundColor: item.color }}></span>
                  <span>{item.standardValue}</span>
                </li>)
              }
            </ul>
          </div> */}
          <div className={styles.timeBar} style={{ top: 10 }}>
            数据更新时间: {moment(updateTime).format("YYYY-MM-DD HH:00")}
          </div>
          <ul className={styles.pollutantSelectContainer}>
            {
              pollutantTypeList.map(item => {
                return <li onClick={() => this.onChangePollutant(item)} className={selectPollutant.value === item.value ? styles.active : ''}>{item.name}</li>
              })
            }
          </ul>
          {dateTimeAllData.length ?
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
                  max={dateTimeAllData.length}
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
            : ""}
        </div>
      </div>
    );
  }
}

export default index;
