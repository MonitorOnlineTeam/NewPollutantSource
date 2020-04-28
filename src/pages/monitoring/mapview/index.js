import React, { Component } from 'react'
import { Form, Select, Input, Button, Card, Row, Col, Tag, Modal, Tabs, Statistic, Descriptions, Spin, Empty, Tooltip, Popover, Radio } from 'antd';
// import { Map, Markers, InfoWindow, Polygon } from 'react-amap';
import { Map, Markers, InfoWindow, Polygon } from '@/components/ReactAmap';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import NavigationTree from '@/components/NavigationTree'
import styles from './styles.less'
import { isEqual } from 'lodash';
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';
import DataQuery from '../dataquery/components/DataQuery'
import AlarmRecord from '../alarmrecord/components/AlarmRecord'
import ReactEcharts from 'echarts-for-react';
import RecordEchartTableOver from '@/components/recordEchartTableOver'
import RecordEchartTable from '@/components/recordEchartTable'
import YsyShowVideo from '@/components/ysyvideo/YsyShowVideo'
import CustomIcon from '@/components/CustomIcon';
import { airLevel } from '@/pages/monitoring/overView/tools'
import config from "@/config"

const { TabPane } = Tabs;
const entZoom = 8;
const pointZoom = 13;
let _thismap = null;
const iconStyle = {
  color: "#3c99d8",
  fontSize: "28px",
  borderRadius: "50%",
  background: "rgb(255, 255, 255)",
  boxShadow: "rgb(255, 255, 255) 0px 0px 3px 2px",
}

@Form.create()
@connect(({ loading, mapView, global, user }) => ({
  allEntAndPointList: mapView.allEntAndPointList,
  defaultMapInfo: mapView.defaultMapInfo,
  tableList: mapView.tableList,
  chartData: mapView.chartData,
  monitorTime: mapView.monitorTime,
  loading: loading.effects['mapView/getAllEntAndPoint'],
  pointLoading: loading.effects['mapView/getPointTableData'],
  chartLoading: loading.effects['mapView/getPointChartData'],
  pollutantLoading: loading.effects['mapView/getPollutantList'],
  airChartLoading: loading.effects['mapView/getAirChartData'],
  curPointData: mapView.curPointData,
  noticeList: global.notices,
  menuDescList: user.menuDescList,
}))
class MapView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      createMap: false,
      displayType: 0,
      currentPointInfo: {},
      loading: true,
      tooltipVisible: false,
      // mapCenter: { longitude: 110.520708, latitude: 38.969114 },
      infoWindowVisible: false,
      coordinateSet: [],
      markersList: [],
      currentEntInfo: {},
      chartTitle: null,
      currentKey: 1,
      airVisible: false,
      currentDescItem: {},
      airShowType: undefined,
      multiple: 4,
    }
    // this.markers = randomMarker(10);
    // console.log("markers=", this.markers)
    // this.mapCenter = { longitude: 115, latitude: 40 };
    // 地图事件
    this.mapEvents = {
      created: m => {
        _thismap = m;
        if (config.offlineMapUrl.domain) {
          var Layer = new window.AMap.TileLayer({
            zIndex: 2,
            getTileUrl: function (x, y, z) {
              //return 'http://mt1.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=' + x + '&y=' + y + '&z=' + z + '&s=Galil';
              return config.offlineMapUrl.domain + '/gaode/' + z + '/' + x + '/' + y + '.png';
            }
          });
          Layer.setMap(m);
        }
        this.setState({
          createMap: true,
        }, () => {
          m.setFitView()
        })

      },
      zoomchange: value => {
        const zoom = _thismap.getZoom();
        let stateZoom = this.state.zoom;
        // if (stateZoom <= 14) {
        //   stateZoom = this.state.zoom - 2;
        // }
        if (this.props.allEntAndPointList.length === 1) {
          stateZoom = this.state.zoom - 4;
        }
        // this.state.zoom - ((this.state.zoom / this.state.multiple).toFixed())
        // 地图缩放，显示企业
        if (zoom < stateZoom) {
          // const displayType = this.state.displayType === 1
          if (this.state.displayType === 1) {
            // this.setState({
            // })
            this.setState({
              infoWindowVisible: false,
              // infoWindowVisible: (this.state.coordinateSet.length && this.state.displayType === 1 && this.state.infoWindowVisible) && false,
              coordinateSet: [],
              displayType: 0,
            }, () => {
              this.randomMarker(this.props.allEntAndPointList, false)
            })
          }

        }
      },
      complete: () => {
      },
    };
  }

  componentDidMount() {
    // 获取所有企业及排口信息
    this.props.dispatch({
      type: 'mapView/getAllEntAndPoint',
    })

    // 获取废水污染物
    // this.props.dispatch({
    //   type: 'mapView/getPollutantWaterList',
    //   payload: {
    //     pollutantTypes: 1,
    //   },
    // })
    // // 获取废气污染物
    // this.props.dispatch({
    //   type: 'mapView/getPollutantGasList',
    //   payload: {
    //     pollutantTypes: 2,
    //   },
    // })
  }

  // 渲染坐标点
  renderMarker = extData => {
    // let extData = extData;
    return <div
      onMouseEnter={() => {
        if (this.state.infoWindowVisible === false && !this.state.airVisible) {
          this.setState({
            hoverMapCenter: extData.position,
            currentTitle: extData.position.title,
            infoWindowHoverVisible: true,
          })
        }
      }}
      onMouseLeave={() => {
        if (this.state.infoWindowVisible === false && !this.state.airVisible) {
          this.setState({
            infoWindowHoverVisible: false,
          })
        }
      }}
      onClick={() => {
        if (extData) {
          _thismap.setCenter([extData.position.longitude, extData.position.latitude])
          let newState = {};
          if (this.state.displayType === 1) {
            console.log("this.state.displayType=", this.state.displayType)
            // 点击排口，显示弹窗
            newState = {
              infoWindowVisible: true,
              currentPointInfo: extData.position,
              overAll: true,
              // coordinateSet: extData.position.CoordinateSet,
            }
          } else {
            if (extData.position.MonitorObjectType == 2 || extData.position.MonitorObjectType == 4) {
              // 监测站
              newState = {
                // infoWindowVisible: true,
                airVisible: true,
                currentPointInfo: extData.position,
                overAll: true,
                currentDescItem: {}
              }
            } else {
              // 显示排口，点击的企业
              newState = {
                // coordinateSet: this.state.currentEntInfo.CoordinateSet,
                coordinateSet: extData.position.CoordinateSet,
                overAll: false,
                displayType: 1,
              }
            }

            // this.setState({
            //   ...newState
            // }, () => {
            // _thismap.setZoomAndCenter(pointZoom, [extData.position.longitude, extData.position.latitude])
            //   // _thismap.setCenter([extData.position.longitude, extData.position.latitude])
            //   this.randomMarker(extData.position.children)
            // })
          }
          // 设置平移
          this.setState({
            mapCenter: extData.position,
            // displayType: extData.position.type,
            // infoWindowVisible: true,
            currentKey: extData.position.key,
            infoWindowHoverVisible: false,
            ...newState
            // currentEntInfo: extData.position
          }, () => {
            // this.state.displayType !== 0 &&
            const isAirOrSite = extData.position.MonitorObjectType == 2 || extData.position.MonitorObjectType == 4;
            // const isAirOrSite = extData.position.MonitorObjectType == 2 || extData.position.MonitorObjectType == 4;
            !isAirOrSite && newState.displayType == 1 && this.randomMarker(extData.position.children)
            this.getPointInfo(extData.position.PollutantType, isAirOrSite)
          })
        }
      }}>
      {
        // extData.position && <Popover content={extData.position.title}>
        //   {
        //     this.state.displayType === 0 ?
        //       <EntIcon style={{ fontSize: 40 }} /> :
        //       (extData.position.PollutantType === "2" ?
        //         <GasIcon

        //           style={{ fontSize: 24, color: this.getColor(extData.position.Status) }} /> :
        //         <WaterIcon style={{ fontSize: 24, color: this.getColor(extData.position.Status) }} />)
        //   }
        // </Popover>
        extData.position && <div content={extData.position.title}>
          {
            // this.state.displayType === 0 ?
            //   <EntIcon style={{ fontSize: 40 }} /> :
            //   (extData.position.PollutantType === "2" ?
            //     <GasIcon
            //       style={{ fontSize: 24, color: this.getColor(extData.position.Status) }} /> :
            //     <WaterIcon style={{ fontSize: 24, color: this.getColor(extData.position.Status) }} />)
            this.renderPonit(extData)
          }
        </div>
      }
    </div>
  }
  renderPonit(extData) {
    let pointEl = null;
    if (extData.position) {
      if (this.state.displayType === 0) {
        if (extData.position.MonitorObjectType == 2) {
          let color = (extData.position.Color && extData.position.Color !== "-") ? extData.position.Color : "#999";
          pointEl = <>
            <CustomIcon type="icon-fangwu" style={{ ...iconStyle, color: color }} />
          </>
        } else if (extData.position.MonitorObjectType == 4) {
          let color = (extData.position.Color && extData.position.Color !== "-") ? extData.position.Color : "#999";
          pointEl = <>
            <CustomIcon type="icon-yangchen1" style={{ ...iconStyle, color: color }} />
          </>
        } else {
          // 企业
          let isShow = "none";
          extData.position.children && extData.position.children.map(item => {
            if (!!this.props.noticeList.find(itm => itm.DGIMN === item.DGIMN)) {
              isShow = "block";
            }
          })
          pointEl = <>
            <EntIcon style={{ fontSize: 28 }} />
            <div className={styles.pulse1} style={{ left: "-11px", top: -12, display: isShow }}></div>
          </>
        }
      } else {
        // 排口
        pointEl = <div className={styles.container}>
          {/* {
            extData.position.PollutantType === "2" ?
              <GasIcon
                style={{ fontSize: 20, color: this.getColor(extData.position.Status) }} /> :
              <WaterIcon style={{ fontSize: 20, color: this.getColor(extData.position.Status) }} />
          } */}
          {/* 图标 */}
          {this.getPollutantIcon(extData)}
          {!!this.props.noticeList.find(m => m.DGIMN === extData.position.DGIMN) &&
            <>
              {/* <div className={styles.pulse}></div> */}
              <div className={styles.pulse1}></div>
            </>
          }
        </div>
      }
    }
    return pointEl;
  }

  getPollutantIcon = (extData) => {
    const mapStyle = {
      fontSize: 24,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0px 0px 3px 2px #fff"
    }
    const style = { fontSize: 24, color: this.getColor(extData.position.Status), ...mapStyle }
    switch (extData.position.PollutantType) {
      case "1":
        // return <WaterIcon style={style} />
        return this.getWaterIcon(extData.position.Status)
      case "2":
        return this.getGasIcon(extData.position.Status)
      case "10":
        return <VocIcon style={style} />
      case "12":
        return <CustomIcon type='icon-yangchen1' style={{ ...style }} />
      case "5":
        return <a><CustomIcon type='icon-fangwu' style={style} /></a>
      case "37":
        return <CustomIcon type='icon-dian2' style={{ ...style }} />
    }
  }



  // 渲染点或企业
  randomMarker = (dataList = this.state.currentEntInfo.children, flag = true, did) => {
    // const dataList = type === 0 ? this.props.allEnterpriseList : this.props.ponitList;
    let _dataList = dataList || [];
    const markersList = _dataList.map((itm, idx) => {
      if (itm.Longitude && itm.Latitude) {
        return {
          position: {
            ...itm,
            // type: type,
            longitude: itm.Longitude,
            latitude: itm.Latitude,
          },
          // render: () => {
          //   return <div style={{ width: 40, height: 40, background: "red" }} >{itm.EntName}</div>
          // }
        }
      }
      return {}
    })
    this.setState({
      markersList,
      // displayType: type,
      // infoWindowVisible: false,
    }, () => {
      flag && _thismap.setFitView();
      let zoom = _thismap.getZoom();
      // console.log('didZoom=', zoom)
      // if (zoom > 14) {
      //   zoom = 14;
      // }
      did && this.setState({ zoom: zoom })
    })
  }

  // 点击气泡获取数据
  getPointInfo = (pollutantType, isAirOrSite) => {
    // 获取table数据
    this.props.dispatch({
      type: 'mapView/getPollutantList',
      payload: {
        DGIMNs: this.state.currentKey,
        dataType: 'HourData',
        isLastest: true,
        type: pollutantType,
        isAirOrSite: isAirOrSite,
        pollutantTypes: pollutantType
      },
    })
    // 获取图表数据
    // this.props.dispatch({
    //   type: 'mapView/getPointChartData',
    //   payload: {
    //     DGIMNs: this.state.currentKey,
    //     endTime: moment(new Date()).format('YYYY-MM-DD HH:00:00'),
    //     beginTime: moment(new Date()).add('hour', -23).format('YYYY-MM-DD HH:00:00'),
    //     dataType: "hour",
    //     isAsc: true
    //   }
    // })
  }


  markersEvents = {
    created: allMarkers => {
      console.log('All Markers Instance Are Below');
      console.log(allMarkers);
    },
    clickable: true,
    click: (MapsOption, marker) => {
      const extData = marker.getExtData();
      const index = extData.myIndex;
      // alert(`点击的是第${index}号坐标点`);
      // console.log(extData === _this.markers[index]);
    },
    dragend: (MapsOption, marker) => { /* ... */ },
  }

  // 绘制厂界
  drawPolygon = () => {
    const res = [];
    if (this.state.coordinateSet) {
      const arr = eval(this.state.coordinateSet);
      for (let i = 0; i < arr.length; i++) {
        res.push(<Polygon
          // events={this.polygonEvents}
          // key={item.entCode+i}
          // extData={item}
          style={{
            strokeColor: '#FF33FF',
            // strokeColor: '#0cffda',
            strokeOpacity: 0.2,
            strokeWeight: 3,
            // fillColor: '#595959',
            fillColor: '#908c8c',
            fillOpacity: 0.35,
          }}
          path={arr[i]}
        />);
      }
    }
    return res;
  }

  windowEvents = {
    created: iw => { console.log(iw) },
    // open: () => { console.log('InfoWindow opened') },
    close: () => {
      this.setState({
        infoWindowVisible: false,
        airVisible: false
      })
    },
    // change: () => { console.log('InfoWindow prop changed') },
  }

  componentWillReceiveProps(nextProps) {
    const { defaultMapInfo } = this.props;
    if (defaultMapInfo !== nextProps.defaultMapInfo) {
      const timer = setInterval(() => {
        if (_thismap && nextProps.defaultMapInfo && nextProps.allEntAndPointList.length > 1) {
          // _thismap.setZoomAndCenter(pointZoom, [nextProps.defaultMapInfo.Longitude, nextProps.defaultMapInfo.Latitude])
          // _thismap.setZoomAndCenter(5, [105.121964, 33.186871])
          this.setState({
            // coordinateSet: nextProps.defaultMapInfo.CoordinateSet,
            // currentEntInfo: nextProps.defaultMapInfo,
            loading: false,
            // currentKey: nextProps.defaultMapInfo.key,
          })
          // this.randomMarker(nextProps.defaultMapInfo.children);
          this.randomMarker(nextProps.allEntAndPointList, true, true);
          clearInterval(timer)
        }
      }, 200);
      // setTimeout(() => {
      //   console.log('2222')
      //   _thismap.setZoomAndCenter(pointZoom, [nextProps.defaultMapInfo.Longitude, nextProps.defaultMapInfo.Latitude])
      //   this.setState({
      //     coordinateSet: nextProps.defaultMapInfo.CoordinateSet,
      //     currentEntInfo: nextProps.defaultMapInfo,
      //     loading: false
      //   })
      //   this.randomMarker(nextProps.defaultMapInfo.children);
      // }, 1000)
    }
    if (this.props.allEntAndPointList !== nextProps.allEntAndPointList && nextProps.allEntAndPointList.length === 1) {
      const timer = setInterval(() => {
        if (_thismap) {
          this.setState({
            displayType: 1,
            coordinateSet: nextProps.allEntAndPointList[0].CoordinateSet,
            currentEntInfo: nextProps.allEntAndPointList[0],
            multiple: 8,
          })
          this.randomMarker(nextProps.allEntAndPointList[0].children, true, true);
          clearInterval(timer)
        }
      }, 200);
    }

  }

  // 获取筛选状态图标颜色
  getColor = status => {
    let color = ''
    switch (status) {
      case 0:// 离线
        color = '#999999'
        break;
      case 1:// 正常
        color = '#34c066'
        break;
      case 2:// 超标
        color = '#f04d4d'
        break;
      case 3:// 异常
        color = '#e94'
        break;
    }
    return color
  }

  getWaterIcon = status => {
    let icon = ''
    switch (status) {
      case 0:// 离线
        icon = <WaterOffline />
        break;
      case 1:// 正常
        icon = <WaterNormal />
        break;
      case 2:// 超标
        icon = <WaterExceed />
        break;
      case 3:// 异常
        icon = <WaterAbnormal />
        break;
    }
    return icon
  }


  getGasIcon = status => {
    let icon = ''
    switch (status) {
      case 0:// 离线
        icon = <GasOffline />
        break;
      case 1:// 正常
        icon = <GasNormal />
        break;
      case 2:// 超标
        icon = <GasExceed />
        break;
      case 3:// 异常
        icon = <GasAbnormal />
        break;
    }
    return icon
  }


  render() {
    const { form: { getFieldDecorator }, allEntAndPointList, ponitList, loading, chartData, curPointData, menuDescList } = this.props;
    const { currentEntInfo, currentKey } = this.state;
    const option = {
      title: {
        text: `24小时趋势图`,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.75)',
          fontSize: 15,
          fontWeight: '400',
        },
        x: 'center',
      },
      legend: {
        data: [chartData.legend],
        x: 'left',
      },
      tooltip: {
        trigger: 'axis',
        formatter(params, ticket, callback) {
          let res = `${params[0].axisValue}时<br/>`;
          params.map(item => {
            res += `${item.seriesName}:${item.value}<br />`;
          });
          return res;
        },
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        // name: '时间',
        boundaryGap: false,
        data: chartData.xAxisData,
      },
      yAxis: {
        type: 'value',
        name: this.state.chartTitle ? this.state.chartTitle : (this.props.tableList.length && this.props.tableList[0].title),
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [{
        type: 'line',
        name: chartData.legend,
        data: chartData.seriesData,
        // markLine: {
        //   symbol: 'none', // 去掉警戒线最后面的箭头
        //   data: [{
        //     lineStyle: {
        //       type: 'dash',
        //       color: '#54A8FF',
        //     },
        //     // yAxis: polluntinfo.standardValue
        //   }]
        // },
        itemStyle: {
          normal: {
            color: '#54A8FF',
            lineStyle: {
              color: '#54A8FF',
            },
          },
        },
      },
      ],
    };

    const airOption = {
      // color: ['#3398DB'],
      title: {
        text: this.state.currentDescItem.label ? this.state.currentDescItem.label + ` 24小时${this.state.airShowType}柱状图` : "24小时AQI柱状图",
        textStyle: {
          color: 'rgba(0, 0, 0, 0.75)',
          fontSize: 15,
          fontWeight: '400',
        },
        x: 'center',
        top: 20,
      },
      tooltip: {
        trigger: 'axis',
        formatter(params, ticket, callback) {
          let res = `${params[0].axisValue}时<br/>`;
          params.map(item => {
            res += `${item.seriesName}:${item.value}<br />`;
          });
          return res;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: chartData.xAxisData,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: chartData.legend,
          type: 'bar',
          barWidth: '60%',
          // 10, 52, 200, 334, 390, 330, 220
          data: chartData.seriesData
        }
      ]
    };

    const plugins = [
      'MapType', // 地图模式（卫星）
      'Scale', //
      'OverView',
      'ToolBar',
      // 'ControlBar', // v1.1.0 新增
      // {
      //   name: 'ToolBar',
      //   options: {
      //     visible: true,  // 不设置该属性默认就是 true
      //     onCreated(ins) {
      //       console.log(ins);
      //     },
      //   },
      // }
    ]
    if (loading && this.state.loading) {
      return (<Spin
        style={{
          width: '100%',
          height: 'calc(100vh/2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        size="large"
      />);
    }
    const statisticStyle = {
      fontSize: 14
    }
    let AQIColorObj = airLevel.find(item => item.levelText == curPointData.AirLevel) || {};
    // let AQIColor = AQIColorObj.color;
    let AQIColor = curPointData.AQI_Color;

    const modalHeight = "calc(100vh - 24vh - 55px - 48px - 90px - 48px)";
    return (
      //QCAUse="1"
      <div className={styles.mapWrapper}>
        <NavigationTree choice={false} selKeys={this.state.currentKey} isMap overAll={this.state.overAll} onMapClick={val => {
          if (val[0]) {
            // if (!val[0].isEnt) {
            //   return;
            // }
            const entInfo = allEntAndPointList.filter(item => item.key === val[0].key)
            if (entInfo.length) {
              const position = [entInfo[0].Longitude, entInfo[0].Latitude];
              if (this.state.currentEntInfo == entInfo[0]) {
                if (entInfo[0].PollutantType != 5) {
                  // 点击的是当期企业
                  this.setState({
                    overAll: false,
                    infoWindowVisible: false,
                  })
                }
              } else {
                // 切换企业
                // const position = [entInfo[0].Longitude, entInfo[0].Latitude];
                if (entInfo[0].MonitorObjectType == 2 || entInfo[0].MonitorObjectType == 4) {
                  // if (entInfo[0].PollutantType == 5) {
                  // 排口切换监测点
                  let newState = {};
                  if (this.state.displayType == 1) {
                    newState = {
                      displayType: 0,
                      coordinateSet: []
                    }
                    _thismap.setZoomAndCenter(this.state.zoom, [entInfo[0].Longitude, entInfo[0].Latitude])
                    this.randomMarker(this.props.allEntAndPointList)
                  }
                  // 监测点
                  this.setState({
                    // infoWindowVisible: true,
                    airVisible: true,
                    currentPointInfo: entInfo[0],
                    currentKey: val[0].key,
                    overAll: true,
                    currentDescItem: {},
                    ...newState
                  }, () => {
                    this.getPointInfo(entInfo[0].PollutantType, true)
                  })
                } else {
                  this.setState({
                    displayType: 1,
                    infoWindowVisible: false,
                    overAll: false,
                    coordinateSet: entInfo[0].CoordinateSet,
                  }, () => {
                    // _thismap.setZoomAndCenter(pointZoom, position)
                    this.randomMarker(entInfo[0].children)
                  })
                }
              }
              this.setState({
                currentEntInfo: entInfo[0],
                mapCenter: position,
              })
            } else {
              const entInfo = allEntAndPointList.find(item => {
                if (item.children.filter(itm => itm.key === val[0].key).length) {
                  return item;
                }
              })
              // 点击的排口
              if (entInfo) {
                const pointInfo = entInfo.children.filter(item => item.key === val[0].key)[0];
                const position = [pointInfo.Longitude, pointInfo.Latitude];
                // _thismap.setZoomAndCenter(pointZoom, position)
                this.randomMarker(entInfo.children)
                this.setState({
                  mapCenter: position,
                  infoWindowVisible: true,
                  displayType: 1,
                  currentEntInfo: entInfo,
                  currentPointInfo: pointInfo,
                  currentKey: val[0].key,
                  overAll: true,
                  coordinateSet: entInfo.CoordinateSet || this.props.coordinateSet,
                }, () => {
                  this.getPointInfo(pointInfo.PollutantType)
                })
              }
            }
          }
        }} />
        <div id="contentWrapper" style={{ height: 'calc(100vh - 64px)', marginLeft: '400px', position: 'relative' }}>
          <Map
            amapkey="c5cb4ec7ca3ba4618348693dd449002d"
            plugins={plugins}
            id="mapId"
            // zoom={this.state.zoom}
            mapStyle="amap://styles/fresh"
            // isHotspot={true}
            // features={['bg','point','building']}
            // center={this.state.mapCenter}
            events={this.mapEvents}
          >
            {this.drawPolygon()}
            {/* <Polygon path={[[[[116.491204,39.957416],[116.587335,39.93636],[116.521417,39.891066],[116.495324,39.918457]]]]} /> */}
            <InfoWindow
              position={this.state.hoverMapCenter}
              isCustom
              showShadow
              autoMove
              visible={this.state.infoWindowHoverVisible}
              offset={[4, -35]}
            >{this.state.currentTitle}</InfoWindow>
            <InfoWindow
              position={this.state.mapCenter}
              autoMove
              size={{ width: 430, height: 362 }}
              // style={{ borderRadius: 6, padding: 10 }}
              closeWhenClickMap={true}
              visible={this.state.infoWindowVisible}
              offset={[4, -35]}
              events={this.windowEvents}
            // isCustom
            >
              {
                <div className={styles.pointInfoWindow}>
                  {
                    (this.props.pointLoading || this.props.chartLoading || this.props.pollutantLoading || this.props.airChartLoading) ? <Spin
                      style={{
                        width: '100%',
                        height: '310px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      size="large"
                    /> : <>
                        {
                          ((!this.props.tableList.length && !this.props.chartData.seriesData.length) ?
                            // !this.props.pointLoading && ((!this.props.tableList.length && !this.props.chartData.seriesData.length) ?
                            <Empty style={{ marginTop: 130 }} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" /> :
                            <>
                              <Descriptions
                                title={
                                  // <div>{this.state.currentPointInfo.title} <Tag color="blue">{this.props.curPointData.RunState === 1 ? "自动监测" : "手动监测"}</Tag> <br /> <span style={{ fontWeight: 'normal', fontSize: 13 }}>{this.props.monitorTime ? `监控时间：${this.props.monitorTime}` : ''}</span></div>
                                  <div>{this.state.currentPointInfo.title}<br /> <span style={{ fontWeight: 'normal', fontSize: 13 }}>{this.props.monitorTime ? `监控时间：${this.props.monitorTime}` : ''}</span></div>
                                }
                                size="small"
                                bordered>
                                {
                                  // 只显示前六个
                                  this.props.tableList.filter((itm, index) => index < 6).map(item => <Descriptions.Item label={item.label}><div onClick={() => {
                                    this.setState({
                                      chartTitle: item.title
                                    })
                                    this.props.dispatch({
                                      type: "mapView/updateChartData",
                                      payload: {
                                        key: item.key,
                                        label: item.label
                                      }
                                    })
                                  }} className={styles.content} style={{ color: item.status === "0" ? "#f04d4c" : (item.status === "1" ? "rgb(243, 172, 0)" : "") }}>{item.value}</div></Descriptions.Item>)
                                }
                              </Descriptions>
                              {/* <div style={{ fontSize: 16, textAlign: 'center', padding: '10px 15px 0 15px' }}>{chartData.legend}24小时趋势图</div> */}
                              {
                                // (!this.props.chartLoading && !this.props.chartData.seriesData.length) ?
                                !this.props.chartData.seriesData.length ?
                                  <Empty style={{ marginTop: 108 }} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                                  // <img src="/nodata.png" style={{ width: '150px', margin: '35px 124px', dispatch: 'block' }} />
                                  :
                                  <ReactEcharts
                                    className={styles.echartdiv}
                                    style={{ width: '100%', height: '200px', textAlign: 'center' }}
                                    option={option}
                                    notMerge
                                    lazyUpdate />
                              }
                              {/* <Button style={{ position: "absolute", right: 10, bottom: 10 }} onClick={() => { */}
                              <a className={styles.pointDetails} size="small" onClick={() => {
                                this.setState({
                                  pointVisible: true,
                                  //   DGIMN: "",
                                  // }, () => {
                                  //   setTimeout(() => {
                                  //     this.setState({
                                  //       DGIMN: this.state.currentKey
                                  //     })
                                  //   }, 200);
                                })
                              }}>排口详情</a>
                            </>)
                        }
                      </>
                  }

                </div>
              }
            </InfoWindow>
            <InfoWindow
              position={this.state.mapCenter}
              autoMove
              size={{ width: 480, height: this.state.currentPointInfo.MonitorObjectType == "4" ? 380 : 440 }}
              // size={{ width: 480 }}
              style={{ maxHeight: 524 }}
              closeWhenClickMap={true}
              visible={this.state.airVisible}
              // visible={this.state.airVisible}
              offset={[4, -35]}
              events={this.windowEvents}
            // isCustom
            >
              <div className={styles.pointInfoWindow}>
                <Spin spinning={this.props.pointLoading || this.props.chartLoading || this.props.pollutantLoading}>
                  <Descriptions
                    title={
                      <div className={styles.airDescBox}>
                        {this.state.currentPointInfo.title}
                        <br />
                        <div>
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              this.getPointInfo(this.state.currentPointInfo.PollutantType, true);
                              this.setState({
                                currentDescItem: {}
                              })
                            }}
                          >AQI：<span style={{ background: AQIColor, display: 'inline-block', width: 30, textAlign: 'center', height: 20, lineHeight: "20px" }}>{curPointData.AQI}</span></span>
                          <span>首要污染物：{curPointData.PrimaryPollutant}</span>
                          <span>浓度值：{curPointData[curPointData.PrimaryPollutantCode]}</span>
                        </div>
                        <span>{this.props.monitorTime ? `监控时间：${this.props.monitorTime}` : ''}</span>
                      </div>
                    }
                    size="small"
                    column={4}
                    bordered>
                    {
                      this.props.tableList.map(item =>
                        <Descriptions.Item label={item.label}><div onClick={() => {
                          // 01,02,03,05,07,08
                          let key = item.key + "_IAQI";
                          let airShowType = "IAQI";
                          if (item.key != "01" && item.key != "02" && item.key != "03" && item.key != "05" && item.key != "07" && item.key != "08") {
                            key = item.key;
                            airShowType = "浓度"
                          }
                          this.setState({
                            chartTitle: item.title,
                            currentDescItem: item,
                            airShowType: airShowType
                          })
                          this.props.dispatch({
                            type: "mapView/updateChartData",
                            payload: {
                              key: key,
                              itemKey: item.key,
                              label: item.label,
                              isAirOrSite: true
                            }
                          })
                        }} className={styles.content} style={{ background: item.levelColor }}>{item.value}</div></Descriptions.Item>)
                    }
                  </Descriptions>
                  <ReactEcharts
                    className={styles.echartdiv}
                    style={{ width: '100%', height: '200px', textAlign: 'center', marginTop: -10 }}
                    option={airOption}
                    notMerge
                    lazyUpdate />
                  <a className={styles.pointDetails} style={{ marginTop: -6 }} size="small" onClick={() => {
                    this.setState({
                      pointVisible: true,
                    })
                  }}>排口详情</a>
                </Spin>
              </div>
            </InfoWindow>
            <Markers
              markers={this.state.markersList}
              events={this.markersEvents}
              render={this.renderMarker}
            // content={<span>111</span>}
            />
          </Map>
          <div style={{ position: 'absolute', right: 100, top: 20 }}>
          <Radio.Group value="map" buttonStyle="solid" onChange={e => {
              e.target.value === 'data' && router.push('/monitoring/mapview/realtimeDataView')
            }}>
              <Radio.Button value="data">数据</Radio.Button>
              <Radio.Button value="map">地图</Radio.Button>
            </Radio.Group>
          </div>
          {/* 空气指数图例 */}
          {
            (this.state.currentPointInfo.MonitorObjectType == "2" || this.state.currentPointInfo.MonitorObjectType == "4") && <div className={styles.legend}>
              <ul>
                {
                  airLevel.map(item => {
                    return <li>
                      <span>{item.text}</span>
                      <span style={{ backgroundColor: item.color }}></span>
                      <span>{item.standardValue}</span>
                    </li>
                  })
                }
              </ul>
            </div>
          }
          <Modal
            title={`${this.state.currentPointInfo.title}详情`}
            width="80%"
            footer={null}
            style={{ maxHeight: '80vh' }}
            visible={this.state.pointVisible}
            onOk={() => {
              this.setState({
                pointVisible: false,
              });
            }}
            onCancel={() => {
              this.setState({
                pointVisible: false,
              });
            }}
          >
            <Tabs onChange={(activeKey) => {
              // this.setState({
              //   ["DGIMN" + activeKey]: this.state.currentKey
              // })
              // this.setState({
              //   DGIMN: undefined,
              //   // clickKey: this.state.clickKey.push(activeKey)
              // }, () => {
              //   setTimeout(() => {
              //     this.setState({
              //       DGIMN: this.state.currentKey
              //     })
              //   }, 200);
              // })
            }}>
              {
                menuDescList.includes("历史数据") && <TabPane tab="历史数据" key="1">
                  <DataQuery DGIMN={currentKey} initLoadData chartHeight='calc(100vh - 427px)' style={{ height: modalHeight, overflow: 'auto', height: 'calc(100vh - 350px)' }} tableHeight={"calc(100vh - 34vh - 55px - 48px - 90px - 64px)"} />
                </TabPane>
              }
              {
                menuDescList.includes("视频预览") && <TabPane tab="视频预览" key="2">
                  <YsyShowVideo DGIMN={currentKey} initLoadData style={{ overflowY: "auto", maxHeight: modalHeight }} />
                </TabPane>
              }
              {
                menuDescList.includes("报警记录") && this.state.currentPointInfo.PollutantType != "5" &&
                <TabPane tab="报警记录" key="3">
                  <AlarmRecord DGIMN={currentKey} initLoadData dataHeight='calc(100vh - 450px)' style={{ maxHeight: modalHeight + 52, height: 'calc(100vh - 366px)' }} />
                </TabPane>
              }
              {
                menuDescList.includes("异常数据") && <TabPane tab="异常数据" key="4">
                  <RecordEchartTable DGIMN={currentKey} initLoadData style={{ maxHeight: "70vh" }} maxHeight={150} />
                </TabPane>
              }
              {
                menuDescList.includes("超标数据") && this.state.currentPointInfo.PollutantType != "5" &&
                <TabPane tab="超标数据" key="5">
                  <RecordEchartTableOver DGIMN={currentKey} initLoadData style={{maxHeight: "70vh"  }} maxHeight={150} noticeState={1} />
                </TabPane>
              }
            </Tabs>
          </Modal>
        </div>
      </div>

    );
  }
}

export default MapView
