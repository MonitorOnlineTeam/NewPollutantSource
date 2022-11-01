import React, { PureComponent } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader';
import { Row, Slider, Drawer, DatePicker, Button, Space, Divider, Spin, message, Radio } from 'antd';
import { CaretRightOutlined, PauseOutlined, LoadingOutlined } from '@ant-design/icons'
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';
import styles from '../index.less'
import $script from 'scriptjs';
import { connect } from 'dva';
import moment from 'moment';
import createThem from './draw.js'
import _ from 'lodash'

const pollutantTypeListGas = [
  { name: '烟尘', value: '01-EmissionsValue' },
  { name: '二氧化硫', value: '02-EmissionsValue' },
  { name: '氮氧化物', value: '03-EmissionsValue' },
]

const pollutantTypeListWater = [
  { name: 'COD', value: '011-EmissionsValue' },
  { name: '氨氮', value: '060-EmissionsValue' },
  { name: '总磷', value: '101-EmissionsValue' },
  { name: '总氮', value: '065-EmissionsValue' },
]
const RadioButton = Radio.Button;

const { RangePicker } = DatePicker;
let _thismap;
let timer = null; // 定时器

@connect(({ loading, krigingMap }) => ({
  mapLoading: loading.effects['krigingMap/getEmissionsData'],
  rankHourData: krigingMap.rankHourData,
  emissionsDataList: krigingMap.emissionsDataList,
  emissionsDataListALL: krigingMap.emissionsDataListALL,
  time: krigingMap.time,
  legendData: krigingMap.legendData,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);

    let beginTime = moment().startOf('months');
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
      selectedPollutantCode: 2,
      selectPollutant: { name: '烟尘', value: '01-EmissionsValue' },
      beginTime: beginTime,
      endTime: endTime,
      timeLineData: [],
    }
    this.map = {};
  }


  componentDidMount() {
    this.mapInit();
    // this.getGasData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.emissionsDataList !== this.props.emissionsDataList) {
      this.handleMarker(this.props.emissionsDataList)
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
      // {
      //   "EntCode": "12624466-645d-4832-b992-9ed083d3ac67",
      //   "EntName": "测试数据1",
      //   "MonitorTime": "2022-04-01 00:00:00",
      //   "Longitude": "114.971797",
      //   "Latitude": "27.495262",
      //   "01-EmissionsValue": "33.47",
      //   "02-EmissionsValue": "105.95",
      //   "03-EmissionsValue": "47.67",
      //   "FlowValue": "6553099.45",
      //   "01-EmissionsValue_color": "#f3dd22",
      //   "01-EmissionsValue_level": 1,
      //   "02-EmissionsValue_color": "#ff0000",
      //   "02-EmissionsValue_level": 3,
      //   "03-EmissionsValue_color": "#00e400",
      //   "03-EmissionsValue_level": 0,
      //   "011-EmissionsValue": "0.65",
      //   "060-EmissionsValue": "0.43",
      //   "101-EmissionsValue": "0.06",
      //   "065-EmissionsValue": "0.36",
      //   "FlowValue": "15960.55",
      //   "011-EmissionsValue_color": "#00e400",
      //   "011-EmissionsValue_level": 2,
      //   "060-EmissionsValue_color": "#ff0000",
      //   "060-EmissionsValue_level": 2,
      //   "101-EmissionsValue_color": "#f3dd22",
      //   "101-EmissionsValue_level": 1,
      //   "065-EmissionsValue_color": "#00e400",
      //   "065-EmissionsValue_level": 0
      // },
      // {
      //   "EntCode": "12624466-645d-4832-b992-9ed083d3ac67",
      //   "EntName": "测试数据2",
      //   "MonitorTime": "2022-04-01 00:00:00",
      //   "Longitude": "115.369221",
      //   "Latitude": "27.076599",
      //   "01-EmissionsValue": "33.47",
      //   "02-EmissionsValue": "105.95",
      //   "03-EmissionsValue": "47.67",
      //   "FlowValue": "6553099.45",
      //   "01-EmissionsValue_color": "#f3dd22",
      //   "01-EmissionsValue_level": 1,
      //   "02-EmissionsValue_color": "#ff0000",
      //   "02-EmissionsValue_level": 3,
      //   "03-EmissionsValue_color": "#00e400",
      //   "03-EmissionsValue_level": 0,
      //   "011-EmissionsValue": "0.65",
      //   "060-EmissionsValue": "0.43",
      //   "101-EmissionsValue": "0.06",
      //   "065-EmissionsValue": "0.36",
      //   "FlowValue": "15960.55",
      //   "011-EmissionsValue_color": "#00e400",
      //   "011-EmissionsValue_level": 1,
      //   "060-EmissionsValue_color": "#ff0000",
      //   "060-EmissionsValue_level": 2,
      //   "101-EmissionsValue_color": "#f3dd22",
      //   "101-EmissionsValue_level": 1,
      //   "065-EmissionsValue_color": "#00e400",
      //   "065-EmissionsValue_level": 0
      // },
    ]
    let key = this.state.selectPollutant.value;
    this.map.remove(this.state.markersList)
    _mapData.map(item => {
      let marker = new this.AMap.Marker({
        content: `<div class="air-map-title">
          <div class='map-title-tag' style='background: ${item[key + '_color']}'>
            <i style='border-top-color: ${item[key + '_color']}'></i>
            ${item[key]}
          </div>
          <div class="content" style="width: ${item.EntName.length * 18}px; left: ${(item.EntName.length * 18 - 60) / 2 * -1}px">
            ${item.EntName}
          </div>
        <div>`,
        position: [item.Longitude, item.Latitude],
        // title: item.AQI,
        map: this.map
      });
      markersList.push(marker)
    })
    this.setState({
      markersList: markersList
    }, () => {
      console.log('_mapData=', _mapData);
      let newMapData = _.sortBy(_mapData, function (o) { return o[key + '_level']; });
      createThem(this.AMap, newMapData, key, this.map, this.gif)
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
      if (AMap) {
        this.getAMap(AMap);
      } else {
        $script('https://webapi.amap.com/maps?callback=___onAPILoaded&v=2.0&key=5e60171b820065e7e9a1d6ea45abaee9&plugin=', (a) => {
          this.getAMap(window.AMap);
        })
      }
    }).catch(e => {
      console.log(e);
    })
  }

  getAMap = (AMap) => {
    this.map = new AMap.Map("mapContainer", { //设置地图容器id
      // viewMode: "3D",         //是否为3D地图模式
      zoom: 11,                //初始化地图级别
      center: [115.135963, 27.229697], //初始化地图中心点位置
      WebGLParams: {
        preserveDrawingBuffer: true
      }
    });
    this.AMap = AMap;
    this.getMapData();
  }


  // 根据时间范围获取地图数据
  getMapData = () => {
    const { beginTime, endTime, selectedPollutantCode } = this.state;
    let diff = endTime.diff(beginTime, 'day') + 1;
    if (diff > 31) {
      message.error('查询时间间隔不能大于30天！')
      return;
    }

    let actionType = selectedPollutantCode === 2 ? 'krigingMap/getGasData' : 'krigingMap/getWaterData';

    this.props.dispatch({
      type: 'krigingMap/getEmissionsData',
      payload: {
        DataType: "ent",
        PollutantType: selectedPollutantCode,
        beginTime: moment(beginTime).format("YYYY-MM-DD 00:00:00"),
        endTime: moment(endTime).format("YYYY-MM-DD 23:59:59"),
        // beginTime: "2022-04-17 00:00:00",
        // endTime: "2022-04-17 23:59:59"
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
    clearInterval(timer);
    const { emissionsDataListALL } = this.props;
    this.setState({
      start: true
    })
    timer = setInterval(() => {
      let count = this.state.count + 1;
      console.log('count=', count)
      console.log('length=', emissionsDataListALL.length)
      if (count === emissionsDataListALL.length - 1) {
        clearInterval(timer);
        this.setState({
          start: false
        })
      } else {
        this.handleMarker([...emissionsDataListALL[count].Data])
      }
      this.setState({
        count: count,
        updateTime: emissionsDataListALL[count].Time
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
      // this.getMapData();
      this.handleMarker(this.props.emissionsDataList)
    })
  }

  renderGif = () => {
    this.setState({
      gifLoading: true
    })
    const { emissionsDataListALL } = this.props;
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
      if (count === emissionsDataListALL.length) {
        clearInterval(timer);
        gif.on('finished', (blob) => {
          debugger
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
        let data = emissionsDataListALL[count].Data;
        // createThem(this.AMap, data, this.map, this.gif)
        this.handleMarker(data)
      }
      console.log('count=', count);
      console.log('length=', emissionsDataListALL.length);
    }, 1000)
  }

  onPollutantTypeClick = (e) => {
    this.setState({
      selectPollutant: e.target.value === 1 ? pollutantTypeListWater[0] : pollutantTypeListGas[0],
      selectedPollutantCode: e.target.value,
    }, () => {
      this.getMapData();
    })
  }

  render() {
    const { mapData, emissionsDataListALL, rankHourData, rankLoading, mapLoading, legendData } = this.props;
    const { start, count, gifLoading, selectPollutant, updateTime, beginTime, endTime, timeLineData, selectedPollutantCode } = this.state;

    let _legendList = legendData[selectPollutant.value] || [];


    console.log('legendData=', legendData);
    console.log('_legendList=', _legendList);
    console.log('timeLineData=', timeLineData);
    console.log('selectPollutant=', selectPollutant);

    let pollutantTypeList = selectedPollutantCode === 2 ? pollutantTypeListGas : pollutantTypeListWater;
    return (
      <div className={styles.pageContaniner} >
        <div id="mapContainer" className={styles.mapWrapper}>
          {
            mapLoading && <div className={styles.gifLoading}>
              <LoadingOutlined />
            </div>
          }
          {
            gifLoading && <div className={styles.gifLoading}>
              <LoadingOutlined />
              <p>生成GIF中，请等待...</p>
            </div>
          }
          <Space className={styles.searchTime}>
            <Radio.Group style={{}} defaultValue={selectedPollutantCode} buttonStyle="solid" size="default" onChange={this.onPollutantTypeClick}>
              <RadioButton key={2} value={2}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <GasOffline style={{ marginRight: 8, fontSize: 17 }} />
                  废气
                </div>
              </RadioButton>
              <RadioButton key={1} value={1}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <WaterOffline style={{ marginRight: 8, fontSize: 17 }} />
                  废水
                </div>
              </RadioButton>
            </Radio.Group>
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
          <div class='airLegend' style={{ position: 'absolute', right: 0, top: 0, zIndex: 1, paddingTop: 0 }}>
            <span style={{ color: '#2196f3', fontSize: 15 }}>单位：kg</span>
            <ul style={{ marginTop: -4 }}>
              {
                _legendList.map((item, index) => <li>
                  <span style={{ display: 'none' }}></span>
                  <span style={{ backgroundColor: item.color }}></span>
                  <span>{_legendList.length === index + 1 ? `>${item.min}` : item.min}</span>
                </li>)
              }
            </ul>
          </div>

          {/* <div className={styles.timeBar} style={{ top: 10 }}>
            数据更新时间: {moment(updateTime).format("YYYY-MM-DD HH:00")}
          </div> */}
          <ul className={styles.pollutantSelectContainer}>
            {
              pollutantTypeList.map(item => {
                return <li onClick={() => this.onChangePollutant(item)} className={selectPollutant.value === item.value ? styles.active : ''}>{item.name}</li>
              })
            }
          </ul>
          {
            emissionsDataListALL.length ? <div className={styles.content}>
              <div className={styles.sliderContainer}>
                <div className={styles.leftIcon}>
                  {
                    !start ? <CaretRightOutlined className={styles.handleIcon} onClick={this.start} /> :
                      <PauseOutlined className={styles.handleIcon} onClick={this.pause} />
                  }
                </div>

                <Slider
                  value={count}
                  max={emissionsDataListALL.length ? emissionsDataListALL.length - 1 : 0}
                  // max={100}
                  // float: left;
                  // width: calc(100% - 60px);
                  // padding: 0;
                  // margin: 0;
                  // margin-top: 6px;
                  style={{ float: 'left', width: '100%', padding: 0, margin: 0, marginTop: 14, height: 4 }}
                  tooltipVisible
                  tipFormatter={(value => {
                    console.log('value=', value);
                    if (emissionsDataListALL.length) {
                      return emissionsDataListALL[value].Time
                    }
                  })}
                  onChange={(value) => {
                    this.setState({
                      count: value,
                    })
                  }}
                  onAfterChange={(value) => {
                    console.log('onAfterChange=', value);
                    let currentData = emissionsDataListALL[value].Data;
                    this.handleMarker(currentData);
                    // this.setState({
                    //   count: value,
                    // })
                  }}
                />
                {/* <div className={styles.timeLine}>
                {
                  timeLineData.map(item => {
                    return <div>{item}</div>
                  })
                }
              </div> */}
              </div>
            </div>
              : ''
          }
        </div>
      </div>
    );
  }
}

export default index;
