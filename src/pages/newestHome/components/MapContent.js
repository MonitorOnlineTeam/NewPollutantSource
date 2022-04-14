/**
 * 功能：首页
 * 创建人：贾安波
 * 创建时间：2021.11.03
 */
import React, { PureComponent, useState, useEffect, Fragment, useRef, useMemo, useLayoutEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, EnvironmentFilled, RightOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import {
  DelIcon, DetailIcon, EditIcon, PointIcon, EntIcon,
  GasIcon,
  GasOffline,
  GasNormal,
  GasExceed,
  GasAbnormal,
  WaterIcon,
  WaterNormal,
  WaterExceed,
  WaterAbnormal,
  WaterOffline,
  WaterStop,
  GasStop,
} from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'
import moment from 'moment'
import config from '@/config';
// import { Map, MouseTool, Marker, Markers, Polygon, Circle,InfoWindow  } from '@/components/ReactAmap';
import styles from "../style.less"
import SiteDetailsModal from './springModal/mapModal/SiteDetailsModal'
import PollutantType from '@/pages/AutoFormManager/PollutantType';
const { Option } = Select;

const namespace = 'newestHome'

let Map;
let Marker;
let Polygon;
let Markers;
let InfoWindow;
let aMap = null;
let massMarks = null;
let labelsLayer = null;
let labelsMarker = null;

let pollutantType = {}

let massPointTitleColor = 'rgb(23, 30, 70)'
@connect(({ loading, newestHome }) => ({
  pollType: newestHome.pollType,
  subjectFontSize: newestHome.subjectFontSize,
  mapStatusData: newestHome.mapStatusData,
  infoWindowData: newestHome.infoWindowData,
  infoWindowDataLoading: newestHome.infoWindowDataLoading,
  entList: newestHome.entList,
}))
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.amapEvents = {
      created: mapInstance => {
        console.log(
          '高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：',
        );
        aMap = mapInstance;
        if (config.offlineMapUrl.domain) {  //在线地图配置
          const Layer = new window.AMap.TileLayer({
            zIndex: 2,
            getTileUrl(x, y, z) {
              return `${config.offlineMapUrl.domain}/gaode/${z}/${x}/${y}.png`;
            },
          });
          Layer.setMap(mapInstance);
          mapInstance.setFitView();//自动适应显示你想显示的范围区域

        }

        console.log(mapInstance)
      },
      zoomchange: (value) => {
        const zoom = aMap.getZoom();
        const { showType } = this.state;
        // if (zoom >= 9 && showType == 1) {
        //   this.setState({ showType: 2, pointTitleShow: false })
        //   const { entMarkers } = this.state;
        //   this.setState({ markersList: [...entMarkers] })
        // }
        // if (zoom < 9 && showType == 2) {
        //   const { regionMarkers } = this.state;
        //   this.setState({ showType: 1, entTitleShow: false, pointTitleShow: false, markersList: [...regionMarkers] })
        // }

      },
    };
    // markers事件
    this.markersEvents = {
      created: allMarkers => {
        console.log('高德地图 Marker 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
        // this.setState({
        //   allMarkers,
        // });
      },
      clickable: true,
      click: (MapsOption, marker) => {
        const { showType, pointMarkers } = this.state;
        if (showType == 3) { //监测点弹窗
          const position = marker.De.extData.position;
          this.setState({
            // hoverTitleShow:false,
            currentClickObj: { ...position, PollutantType: pollutantType },
            pointInfoWindowVisible: true,
            infoWindowPos: [position.Longitude, position.Latitude],
          }, () => {
            this.getInfoWindowData()
          });
        }
        if (showType == 2) { //企业 点击进入监测点
          this.loadPointMarkerData(pointMarkers)
        }
      },
      mouseover: (MapsOption, marker) => { //鼠标移入地图容器内时触发
        const { showType } = this.state;
        if (showType == 2 || showType == 3) {
          const position = marker.De&&marker.De.extData.position;
          this.setState({ pointInfoWindowVisible: false, hoverTitleShow: true, hoverEntTitle: position.entName ? position.entName : position.ParentName, hoverPointTitle: position.PointName ? position.PointName : null, hoverTitleLngLat: { latitude: position.latitude, longitude: position.longitude } })
        }
      },
      mouseout: (MapsOption, marker) => { //鼠标移出地图容器内时触发
        const { showType } = this.state;
        if (showType == 2 || showType == 3) {
          const position = marker.De.extData.position;
          this.setState({ hoverTitleShow: false, hoverEntTitle: '', hoverPointTitle: '', hoverTitleLngLat: { latitude: position.latitude, longitude: position.longitude } })

        }
      }
    };
    this.state = {
      mapPointLoading: true,
      fullScreen: false,
      showType: 1,
      regionMarkers: [],
      entMarkers: [],
      pointMarkers: [],
      allPointMarkers: [],
      entTitleShow: false,
      pointTitleShow: false,
      hoverTitleShow: false,
      hoverTitleLngLat: {},
      hoverEntTitle: '',
      hoverPointTitle: '',
      pointInfoWindowVisible: false,
      currentClickObj: {}, // 当前点击对象 -  监测点弹窗
      infoWindowPos: {},
      selectEnt: undefined,
      pointIconGo: false,
      entLists: [],
      mapBtnStatusIndex: -1,
      isMassive: false,
    }
  }
  componentWillMount() {
    if (config.offlineMapUrl.domain) {
      const amap = require('@/components/ReactAmap');
      Map = amap.Map;
      Marker = amap.Marker;
      Polygon = amap.Polygon;
      Markers = amap.Markers;
      InfoWindow = amap.InfoWindow;
    } else {
      const amap = require('react-amap');
      Map = amap.Map;
      Marker = amap.Marker;
      Polygon = amap.Polygon;
      Markers = amap.Markers;
      InfoWindow = amap.InfoWindow;
    }
  }
  componentDidMount() {
    this.initData()
  }





  initData = () => {
    const { pollType } = this.props;
    pollutantType = pollType[this.props.type]
    this.getMapPointList(3)
    this.getMapPointList(2)
    this.getMapPointList(1)


  }
  // 获取infoWindow数据
  getInfoWindowData = () => {
    const { currentClickObj } = this.state;
    this.props.dispatch({
      type: 'newestHome/getInfoWindowData',
      payload: {
        DGIMNs: currentClickObj.DGIMN,
        dataType: 'HourData',
        isLastest: true,
        // type: PollutantType,
        isAirOrSite: true,
        pollutantTypes: currentClickObj.PollutantType,
      },
    });
  };
  getMapPointList = (type) => {
    const { dispatch } = this.props
    dispatch({
      type: `${namespace}/GetMapPointList`,
      payload: { pollutantType: pollutantType, pointType: type, },
      callback: (data) => {
        if (type == 1) {
          this.setState({ mapPointLoading: false })
          this.setState({ regionMarkers: data });
          this.loadRegionMarkerData(data)
        } else if (type == 2) {
          this.setState({ entMarkers: data })
        } else {
          this.setState({ pointMarkers: data })
          this.setState({ allPointMarkers: data })

        }
      }
    })
  }
  
  clearMass = () =>{ //清除海量点(废气 监测点)和海量标签(废气 监测点标题)
    massMarks&&massMarks.hide(aMap);
    if(labelsMarker&&labelsLayer){
      labelsLayer.remove(labelsMarker)
      aMap.remove(labelsLayer);
    }

  }
  loadRegionMarkerData = (data, flag) => { //行政区
    this.clearMass();
    this.setState({
      showType: 1,
      markersList: data,
      entTitleShow: false, pointTitleShow: false,
    }, () => {
      const timer = setInterval(() => {
        if (aMap && !flag) {
          aMap.setFitView();
          clearInterval(timer);
        }
      }, 0);
    })

  }
  loadEntMarkerData = (data, flag) => { //企业
    this.setState({
      showType: 2,
      pointTitleShow: false,
      markersList: data,
    }, () => {
      const timer = setInterval(() => {
        if (aMap && !flag) {
          aMap.setFitView();
          clearInterval(timer);
        }
      }, 0);
    })

  }
  loadPointMarkerData = (data, flag) => { //监测点 
  
    this.clearMass();

    if (pollutantType == 2 && data.length >= 1000) { //废气 监测点多的情况 海量加载

      const warnData = data[0] && data.filter(item => item.position.alarmStatus) //报警点 常规加载
      this.setState({
        showType: 3,
        markersList: warnData,
        isMassive: true,
      })
      const normalData = data[0] && data.filter(item => !item.position.alarmStatus) //正常点
      this.loadMassivePointMarkerData(normalData)



    } else {
      this.setState({
        showType: 3,
        markersList: [...data]
      }, () => {
        const timer = setInterval(() => {
          if (aMap && !flag) {
            aMap.setFitView();
            // aMap.setZoomAndCenter(aMap.getZoom()+1, [96.01906121185537, 35.874643454131984]);
            clearInterval(timer);
          }
        }, 0);
      })
    }



  }

  // getIcon = (status) => {
  //   let icon = '';
  //   if (pollutantType == 1) {
  //     switch (status) {
  //       case 0: // 离线
  //         icon = <WaterOffline />;
  //         break;
  //       case 1: // 在线
  //         icon = <WaterNormal />;
  //         break;
  //       case 2: // 超标
  //         icon = <WaterExceed />;
  //         break;
  //       case 3: // 异常
  //         icon = <WaterAbnormal />;
  //         break;
  //       case 4: // 停运
  //         icon = <WaterStop />;
  //         break;
  //     }
  //     return icon;
  //   };
  loadMassivePointMarkerData = (data) => { //海量加载 监测点
    let _this = this;
    let pointData = data.map(item => {
      return { lnglat: [item.position.Longitude, item.position.Latitude], ...item, style: item.position.alarmStatus - 1 }
    })
    let imgType = [0, 1, 2, 3, 4];
    let styleObject = imgType.map(item => { //废气
      return {
        url: `/gas${item}.png`,  // 图标地址
        size: new window.AMap.Size(32, 32),      // 图标大小
        anchor: new window.AMap.Pixel(5, 5) // 图标显示位置偏移量，基准点为图标左上角
      }
    })

    massMarks = new window.AMap.MassMarks(pointData, {
      zIndex: 999,  // 海量点图层叠加的顺序
      zooms: [3, 19],  // 在指定地图缩放级别范围内展示海量点图层
      style: styleObject  // 设置样式对象
    });

    massMarks.setMap(aMap);
    const timer = setInterval(() => {
      // aMap.setFitView();
      // aMap.setZoom(aMap.getZoom()-1);
      clearInterval(timer);
    }, 0);
    // 为 massMarks 绑定事件
    massMarks.on('click', (e) => {
      const position = e.data.position;
      _this.setState({
        hoverTitleShow: false,
        currentClickObj: { ...position, PollutantType: pollutantType },
        pointInfoWindowVisible: true,
        infoWindowPos: [position.Longitude, position.Latitude],
      }, () => {
        _this.getInfoWindowData()
      });

    })
    massMarks.on('mouseover', (e) => {
      const position = e.data.position;
      _this.setState({ pointInfoWindowVisible: false, hoverTitleShow: true, hoverEntTitle: position.entName ? position.entName : position.ParentName, hoverPointTitle: position.PointName ? position.PointName : null, hoverTitleLngLat: { latitude: position.latitude, longitude: position.longitude } })

    })
    massMarks.on('mouseout', (e) => {
      const position = e.data.position;
      _this.setState({ hoverTitleShow: false, hoverEntTitle: '', hoverPointTitle: '', hoverTitleLngLat: { latitude: position.latitude, longitude: position.longitude } })
    })
  }

  getIcon = (status) => {
    let icon = '';
    if (pollutantType == 1) {
      switch (status) {
        case 0: // 离线
          icon = <WaterOffline />;
          break;
        case 1: // 在线
          icon = <WaterNormal />;
          break;
        case 2: // 超标
          icon = <WaterExceed />;
          break;
        case 3: // 异常
          icon = <WaterAbnormal />;
          break;
        case 4: // 停运
          icon = <WaterStop />;
          break;
      }
      return icon;
    };

    if (pollutantType == 2) {
      switch (status) {
        case 0: // 离线
          icon = <GasOffline />;
          break;
        case 1: // 在线
          icon = <GasNormal />;
          break;
        case 2: // 超标
          icon = <GasExceed />;
          break;
        case 3: // 异常
          icon = <GasAbnormal />;
          break;
        case 4: // 停运
          icon = <GasStop />;
          break;
      }
    }
    return icon;
  }

  goEnt = (extData) => {
    const { entMarkers } = this.state;
     
    console.log(extData,entMarkers)
    // const data = entMarkers.filter(item.position.=>)
    this.loadEntMarkerData(entMarkers)
  }
  operationChange = (text, mapProps) => {
    const map = mapProps.__map__;
    const { showType, regionMarkers, pointMarkers, entMarkers, entTitleShow, pointTitleShow } = this.state;
    if (!map) { console.log('组件必须作为 Map 的子组件使用'); return; }
    switch (text) {
      case '放大':
        map.zoomIn()
        // if (map.getZoom() >= 9 && showType == 1) {
        //   this.setState({ showType: 2, pointTitleShow: false })
        //   const { entMarkers } = this.state;
        //   this.setState({ markersList: [...entMarkers] })
        // }
        break;
      case '缩小':
        map.zoomOut()
        // if (map.getZoom() < 9 && showType == 2) {
        //   const { regionMarkers } = this.state;
        //   this.setState({ showType: 1, entTitleShow: false, pointTitleShow: false, markersList: [...regionMarkers] })
        // }
        break;
      case '全屏':
        this.setState({ fullScreen: true })
        this.props.fullScreenClick(true)
        break;
      case '退出全屏':
        this.setState({ fullScreen: false })
        this.props.fullScreenClick(false)
        break;
      case '展示企业': //行政区
        this.setState({ pointIconGo: false })
        this.loadRegionMarkerData(regionMarkers)
        // this.setState({showType:1, markersList:[...this.state.regionMarkers]})
        break;
      case '展示监测点':
        this.setState({ pointTitleShow: false, entTitleShow: false, pointIconGo: true })
        this.loadPointMarkerData(pointMarkers)
        break;
      case '展示名称':
        if (showType == 2 && !entTitleShow) {
          this.setState({ entTitleShow: true, markersList: [...entMarkers] })
        }
        if (showType == 3 && !pointTitleShow) {
          if(this.state.isMassive){
            const noramalData = pointMarkers.filter(item =>!item.alarmStatus)
            this.renderPointTitleLabelMarker(noramalData);
            const warinData = pointMarkers.filter(item =>item.alarmStatus)
            this.setState({ pointTitleShow: true, markersList: [...warinData] })
            return;
          }
          this.setState({ pointTitleShow: true, markersList: [...pointMarkers] })
        }
        break;
      case '隐藏名称':
        if (showType == 2 && entTitleShow) {
          this.setState({ entTitleShow: false, markersList: [...entMarkers] })
        }
        if (showType == 3 && pointTitleShow) {
          this.setState({ pointTitleShow: false, markersList: [...pointMarkers] })

          if(this.state.isMassive){
             labelsLayer.remove(labelsMarker)
             aMap.remove(labelsLayer)
             const warinData = pointMarkers.filter(item =>item.alarmStatus)
             this.setState({ pointTitleShow: false, markersList: [...warinData] })
            return;
          }
        }
        break;
    }

  }
  //海量标注 监测点显示名称
  renderPointTitleLabelMarker = (data) => {
    // 创建一个 labelsMarker 实例 
      labelsMarker=[];
  
      data[0]&&data.map(item=>{
      labelsMarker.push(new window.AMap.LabelMarker({
      position: [item.position.longitude,item.position.latitude],
      opacity: 1,
      zIndex: 98,
      text: {
        content: `${item.position.ParentName} - ${item.position.PointName}`,
        direction: 'center',
        offset: [0, 40],
        style: {
          fontSize: 14,
          fillColor: '#fff',
          padding: [4,8],
          backgroundColor: massPointTitleColor,
          borderColor: 'rgba(56,168,212)', //2.0 支持的属性 框架不行 框架好久没更新了 指定2.0 各种兼容问题
          borderWidth: 1,//同上
        }
      }
    })
    )

  })
    // 创建一个 LabelsLayer 实例来承载 LabelMarker，[LabelsLayer 文档](https://lbs.amap.com/api/jsapi-v2/documentation#labelslayer)
     labelsLayer = new window.AMap.LabelsLayer({
      collision: false,
    });

    // 将 labelsMarker 实例添加到 LabelsLayer 上
    labelsLayer.add(labelsMarker);
    // 将 LabelsLayer 添加到地图上
    aMap.add(labelsLayer);
  }
  regPopovercontent = (extData) => {
    return <div>
      <div>企业总数：{extData.position && extData.position.entCount}</div>
      <div><span style={{ color: '#FF0000' }}>超标</span>企业总数：{extData.position && extData.position.overCount ? extData.position.overCount : 0}</div>
      <div><span style={{ color: '#FFCC00' }}>异常</span>企业总数：{extData.position && extData.position.exceptionCount ? extData.position.exceptionCount : 0}</div>
    </div>
  }

  renderMarkers = (extData) => {
    const { showType, entTitleShow, pointTitleShow,isMassive } = this.state;
    const alarmStatus = extData.position.alarmStatus;
    if (showType == 1) {
      return <div style={{ position: 'relative' }}>
        <Popover overlayClassName={styles.regPopSty} title={() => <Row justify='space-between' align='middle'><span> {extData.position && extData.position.regionName} </span>  <RightOutlined onClick={() => { this.goEnt(extData) }} /> </Row>} getPopupContainer={trigger => trigger.parentNode} visible={showType == 1} placement="top" content={this.regPopovercontent(extData)} >
          <img src='/location.png' style={{ position: 'relative', width: 35, height: 35 }} />
        </Popover>
      </div>
    } else if (showType == 2) {

      const entName = extData.position.entName;
      return <div style={{ position: 'relative' }}>

        <EntIcon />
        <div className={alarmStatus == 1 ? styles.abnormalPaulse : alarmStatus == 2 ? styles.overPaulse : ''}></div>
        {entTitleShow && <div className={styles.titlePopSty}>
          {entName}
        </div>}
      </div>
    } else { //监测点
      return <div style={{ position: 'relative' }}>
        {this.getIcon(extData.position.Status)}
        <div className={alarmStatus == 1 ? styles.abnormalPaulse : alarmStatus == 2 ? styles.overPaulse : ''}></div>
        {pointTitleShow&&isMassive?
            <div style={{padding:'4px 8px',backgroundColor:massPointTitleColor}}>{extData.position.ParentName} - {extData.position.PointName}</div>
           :
          pointTitleShow? <div className={styles.pointTitlePopSty}>
          <div className={styles.titlePopSty} >
            <div>{extData.position.ParentName}</div>
            <div>{extData.position.PointName}</div>
          </div>
        </div> : null }
      </div>
    }
  }


  // 监测点弹窗内容
  infoWindowContent = () => {
    const { currentClickObj } = this.state;
    const { infoWindowData } = this.props;
    let imgName =
      pollutantType == 2 ? '/gasInfoWindow.png' : pollutantType == 1 ? '/water.jpg' : '/infoWindowImg.png';
    if (infoWindowData.photo) {
      imgName = `/upload/${infoWindowData.photo[0]}`;
    }

    // 获取筛选状态图标颜色
    const getColor = status => {
      let color = '';
      switch (status) {
        case 0: // 离线
          color = '#67666A';
          break;
        case 1: // 在线
          color = '#5fc15d';
          break;
        case 2: // 超标
          color = '#FF0000';
          break;
        case 3: // 异常
          color = '#FFCC00';
          break;
      }
      return color;
    };

    const getStatusText = status => {
      let statusText = '';
      switch (status) {
        case 0:
          statusText = '离线';
          break;
        case 1:
          statusText = '在线';
          break;
        case 2:
          statusText = '超标';
          break;
        case 3:
          statusText = '异常';
          break;
        case 4:
          statusText = '停运';
          break;
      }
      return statusText;
    };
    return (
      <div className={styles.infoWindowContent} style={{ width: 340, minHeight: 360 }}>
        {this.props.infoWindowDataLoading ? <PageLoading /> :

          <>
            <div className={styles.header}>
              <h2>
                {infoWindowData.entName} - {currentClickObj.PointName}
              </h2>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  this.props.dispatch({
                    type: 'newestHome/updateState',
                    payload: { siteDetailsVisible: true },
                  });
                }}
              >
                进入站房
        </Button>
              <p>
                站点状态：
          {currentClickObj.outPutFlag === 1 ? (
                  <span style={{ color: '#836BFB' }}>停运</span>
                ) : (
                    <span style={{ color: getColor(currentClickObj.Status) }}>
                      {getStatusText(currentClickObj.Status)}
                    </span>
                  )}
              </p>
            </div>
            <div className={styles.desc}>
              <div className={styles['desc-l']}>
                <h3>站点信息</h3>
                <p className='textOverflow' style={{ width: 160 }} title={infoWindowData.regionCityName}>区域：{infoWindowData.regionCityName}</p>
                <p>经度：{currentClickObj.Longitude}</p>
                <p>纬度：{currentClickObj.Latitude}</p>
              </div>
              <div className={styles['desc-r']}>
                <img src={imgName} alt="" width="100%" height="100%" />
              </div>
            </div>
            <div className={styles.data}>
              <h3>
                {infoWindowData.pollutantTypeCode === 2
                  ? '废气数据'
                  : infoWindowData.pollutantTypeCode === 1
                    ? '废水数据'
                    : '空气质量数据'}
              </h3>
              {infoWindowData.pollutantTypeCode === 5 && (
                <div style={{ marginBottom: 10, fontSize: 13 }}>
                  <span>
                    AQI：
              <span
                      style={{
                        background: infoWindowData.AQI_Color,
                        display: 'inline-block',
                        width: 30,
                        textAlign: 'center',
                        height: 20,
                        lineHeight: '20px',
                      }}
                    >
                      {infoWindowData.AQI}
                    </span>
                  </span>
                  <Divider type="vertical" />
                  <span>首要污染物：{infoWindowData.PrimaryPollutant}</span>
                </div>
              )}
              <ul>
                {infoWindowData.list.map(item => {
                  let title = `${item.label}：${item.value}`;
                  if (item.label === '风向') {
                    title = `${item.label}：${getDirLevel(item.value)}`;
                  }
                  return (
                    <Tooltip placement="top" title={title}>
                      <li
                        className={infoWindowData.pollutantTypeCode !== 5 ? styles.point : ''}
                        title={title}
                      >
                        {title}
                      </li>
                    </Tooltip>
                  );
                })}
              </ul>
              <p>监控时间：{infoWindowData.MonitorTime}</p>
            </div>
          </>}
      </div>
    );
  };
  entSearch = (val) => {

    const { entList } = this.props;
    let listEle = document.querySelector(".antd-pro-pages-newest-home-style-searchSty .ant-select-dropdown");
    const emptyEle = document.querySelector('.antd-pro-pages-newest-home-style-searchSty .ant-select-item-empty')
    if (emptyEle) {
      listEle.style.display = 'none';
    }
    this.setState({ entLists: entList }, () => {
      if (val) {
        this.state.entLists.map(item => {
          if (item.entName.match(new RegExp(`\\${val}`, 'g'))) {
            listEle.style.display = 'block';
          }
        })

      } else {
        listEle.style.display = 'none';
      }
    })


  }
  entChange = (val) => {
    let listEle = document.querySelector(".antd-pro-pages-newest-home-style-searchSty .ant-select-dropdown");
    listEle.style.display = 'none';
    this.setState({ selectEnt: val }, () => {
      this.searchEntEle.blur()

    })



  }

  entFocus = () => {
    const { selectEnt } = this.state;
    this.setState({ selectEnt: undefined })

  }
  entBlur = () => {
    const { entMarkers, selectEnt, showType, pointMarkers } = this.state;
    this.setState({ entLists: [] })
    if (selectEnt) {
      if (showType == 3) { //对应的监测点
        pointMarkers.map(item => {
          let position = item.position;
          if (position.ParentName === selectEnt) {
            this.loadPointMarkerData([item])
            aMap.setZoomAndCenter(14, [position.longitude, position.latitude]);
            this.setState({ entLists: [] })
          }
        })
      } else { //对应的企业
        entMarkers.map(item => {
          let position = item.position;
          if (position.entName === selectEnt) {
            this.loadEntMarkerData([item]);
            aMap.setZoomAndCenter(14, [position.longitude, position.latitude]);
            this.setState({ entLists: [] })
          }
        })
      }
    } else {
      showType == 3 ? this.loadPointMarkerData(pointMarkers) : this.loadEntMarkerData(entMarkers);
    }
  }
  onBack = () => {
    const { showType, regionMarkers, selectEnt, entMarkers } = this.state;


    if (showType == 2) {
      this.loadRegionMarkerData(regionMarkers)
    }
    if (showType == 3) {
      this.loadEntMarkerData(entMarkers)
    }

    this.setState({ selectEnt: undefined, mapBtnStatusIndex: -1 })
  }

  mapBtnClick = (index, item) => {
    const { mapBtnStatusIndex, pointMarkers, allPointMarkers } = this.state;
    if (mapBtnStatusIndex !== index) {
      this.setState({ mapBtnStatusIndex: index })
      const selectData = allPointMarkers.filter(pointItem => {
        return item.status == pointItem.position.Status
      })
      this.setState({ pointMarkers: selectData })
      this.loadPointMarkerData(selectData)
    } else {
      this.setState({ mapBtnStatusIndex: -1 })
      this.loadPointMarkerData(pointMarkers)
    }

  }
  mapContent = (props) => {
    const { markersList, mapPointLoading, fullScreen, showType, regionMarkers, entMarkers, pointMarkers, entTitleShow, pointTitleShow, pointIconGo } = this.state;
    const { mapStatusData, subjectFontSize, pollType, entList } = this.props;
    const typeBtnArr = [{ text: '超标', color: '#FF0000', val: mapStatusData.overCount, status: 2 }, { text: '异常', color: '#FFCC00', val: mapStatusData.exceptionCount, status: 3 }, { text: '离线', color: '#67666A', val: mapStatusData.unLineCount, status: 0 },
    { text: '在线', color: '#5fc15d', val: mapStatusData.normalCount, status: 1 }, { text: '停运', color: '#836BFB', val: mapStatusData.stopCount, status: 4 }]

    const operationBtnArr = () => {
      return [{ text: fullScreen ? '退出全屏' : '全屏', url: fullScreen ? '/homeMapT.png' : '/homeMapQp.png' }, { text: '展示企业', url: !pointIconGo ? '/homeMapQA.png' : '/homeMapQ.png' }, { text: '展示监测点', url: pointIconGo ? '/homeMapJcA.png' : '/homeMapJc.png' },
      { text: entTitleShow || pointTitleShow ? '隐藏名称' : '展示名称', url: '/homeMapZ.png' }, { text: '放大', url: '/homeMapJ.png' },
      { text: '缩小', url: '/homeMapS.png' }]
    }
    const RightIconMapComponent = (props) => {

      return (<div className={styles.mapOperationBtn}>
        {operationBtnArr().map((item, index) => {
          return <div style={{ paddingBottom: 10 }} onClick={() => { this.operationChange(item.text, props) }}><img title={item.text} src={item.url} /></div>
        })}
      </div>);

    }
    const iconType = {
      "1": <><WaterIcon /><span className={styles.iconText}>废水</span></>,
      "2": <><GasIcon /><span className={styles.iconText}>废气</span></>
    }

    const { hoverTitleShow, hoverTitleLngLat, hoverEntTitle, hoverPointTitle, pointInfoWindowVisible, infoWindowPos, selectEnt, mapBtnStatusIndex, isMassive, } = this.state;

    // const searchEntInput = useRef(null);

    // function entSearchSelect(val){
    //   let listEle = document.querySelector(".antd-pro-pages-newest-home-style-searchSty .ant-select-dropdown");
    //   listEle.style.display = 'none';
    //   searchEntInput.current.blur()  
    // }
    return mapPointLoading ?
      <PageLoading />
      :
      <Map
        amapkey={config.amapKey}
        events={this.amapEvents}
        mapStyle="amap://styles/darkblue"
        // useAMapUI={!config.offlineMapUrl.domain}
        version='1.4.19'

      >

        <Markers
          markers={markersList}
          render={this.renderMarkers}
          events={this.markersEvents}
          extData={markersList}
        // useCluster
        />
        <InfoWindow
          visible={hoverTitleShow}
          position={hoverTitleLngLat}
          autoMove
          offset={isMassive ? [10, -5] : [4, -35]}
          className={styles.titleInfoWindow}
        >
          <div style={{ whiteSpace: "nowrap" }} >企业名称：{hoverEntTitle}</div>
          {showType == 3 && <div style={{ paddingTop: 3, whiteSpace: "nowrap" }}>监测点名称：{hoverPointTitle}</div>}
        </InfoWindow>
        <InfoWindow

          position={infoWindowPos}
          visible={pointInfoWindowVisible}
          offset={isMassive ? [10, -5] : [4, -35]}
          autoMove
          showShadow
          closeWhenClickMap={false}
        >
          {this.infoWindowContent()}
          <span onClick={() => { this.setState({ pointInfoWindowVisible: false }) }} style={{ position: 'absolute', cursor: 'pointer', top: 0, right: 8, fontSize: 18 }}>×</span>
        </InfoWindow>
        <div className={styles.mapBtn}> { /**按钮 */}
          <Row align='middle'>
            {typeBtnArr.map((item, index) => {
              return <Row onClick={() => { this.mapBtnClick(index, item) }} className={index === mapBtnStatusIndex ? styles.typeBtnActiveSty : styles.typeBtnSty} align='middle' justify='center'>
                <div className={styles.colorBlock} style={{ background: `${item.color}` }}></div>
                <span style={{ fontSize: subjectFontSize }}>{item.text} {item.val}</span>
              </Row>
            })}
          </Row>
        </div>
        <RightIconMapComponent />

        <div className={styles.mapEnt}  > { /**右上角 图标 */}
          <Row className={styles.legendBtnSty} align='middle' justify='center'>
            <EntIcon />
            <span className={styles.iconText}>企业</span>
          </Row>
          <Row className={styles.legendBtnSty} align='middle' justify='center'>
            {iconType[pollutantType]}
          </Row>
        </div>

        {<div className={styles.searchSty} >  { /**搜索 */}
          <Select
            showSearch
            style={{ width: 220 }}
            placeholder="请输入企业名称"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
            }
            getPopupContainer={trigger => trigger.parentNode}
            suffixIcon={<img src='/homeMapsearchIcon.png' />}
            onSearch={this.entSearch}
            onChange={this.entChange}
            onFocus={this.entFocus}
            onBlur={this.entBlur}
            // ref={searchEntInput}
            ref={props.searchEntInputRef}
            value={selectEnt}
            defaultActiveFirstOption={false}
          >
            {this.state.entLists[0] && this.state.entLists.map(item => {
              return <Option value={item.entName}>{item.entName}</Option>
            })}
          </Select>
        </div>}

        {showType != 1 && !pointIconGo && <div className={styles.backSty} onClick={this.onBack}>  { /**返回 */}
          <img src='/homeMapBack.png' />
          <div>返回</div>
        </div>}
      </Map>

  }
  render() {
    const { fullScreen, currentClickObj } = this.state;
    const MapContent = this.mapContent
    return (
      <div style={{ height: '100%' }} className={`${fullScreen ? `${styles.mapModal}` : ''}`}>

        <MapContent searchEntInputRef={el => this.searchEntEle = el} />
        <SiteDetailsModal data={currentClickObj} />
      </div>

    )
  }
}
export default Index;