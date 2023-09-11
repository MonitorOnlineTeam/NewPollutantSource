/**
 * 功能：首页
 * 创建人：jab
 * 创建时间：2021.11.03
 */
import React, { PureComponent, useState, useEffect, Fragment, useRef, useMemo, useLayoutEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, EnvironmentFilled, RightOutlined, CodeSandboxCircleFilled } from '@ant-design/icons';
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

let pollutantType = '';

let massPointTitleColor = 'rgb(23, 30, 70)'
@connect(({ loading, newestHome, global }) => ({
  pollType: newestHome.pollType,
  subjectFontSize: newestHome.subjectFontSize,
  mapStatusData: newestHome.mapStatusData,
  infoWindowData: newestHome.infoWindowData,
  infoWindowDataLoading: newestHome.infoWindowDataLoading,
  entList: newestHome.entList,
  smallResolution: newestHome.smallResolution,
  mapStatusRegData: newestHome.mapStatusRegData,
  mapStatusEntData: newestHome.mapStatusEntData,
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
        // aMap.setFeatures(['bg', 'point', 'building'])
        // AMap.plugin('AMap.DistrictSearch', () => {
        //   const districtSearch = new AMap.DistrictSearch({
        //     subdistrict: 0,   //获取边界不需要返回下级行政区
        //     extensions: 'all',  //返回行政区边界坐标组等具体信息
        //     level: 'province'  //查询行政级别为 省
        //   })
        //   // 搜索所有省/直辖市信息
        //   districtSearch.search('中国', function (status, result) {
        //     // 查询成功时，result即为对应的行政区信息
        //     if (status === 'complete') {
        //       const bounds = result.districtList[0].boundaries;
        //       const polygons = [];
        //       if (bounds) {
        //           for (let i = 0, l = bounds.length; i < l; i++) {
        //               //生成行政区划polygon
        //               const polygon = new AMap.Polygon({
        //                   path: bounds[i],
        //                   fillOpacity: 0,
        //                   strokeOpacity: 1,
        //                   strokeWeight: 5,
        //                   strokeColor: '#3b4fa5'
        //               });
        //               polygons.push(polygon);
        //           }
        //       }
        //       aMap.add(polygons);
        //       setTimeout(()=>{
        //         aMap.setFeatures(['bg', 'road', 'building', 'point']); // 多个种类要素显示
        //       },3000)
            // } 
          // })
        // })
      },
      zoomchange: (value) => {
        const zoom = aMap.getZoom();
        const { showType } = this.state;

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
        const { showType, selectPointMarkers, } = this.state;
        const { dispatch } = this.props

        const position = marker.De.extData.position;
        if (showType == 3) { //监测点弹窗
          this.setState({
            currentClickObj: { ...position, PollutantType: pollutantType },
            pointInfoWindowVisible: true,
            infoWindowPos: [position.Longitude, position.Latitude],
          }, () => {
            this.getInfoWindowData()
          });
        }
        if (showType == 2) { //企业 点击进入监测点
          const data = this.state.allPointMarkers.filter(item => item.position.ParentCode == position.entCode);
          this.setState({ selectPointMarkers: data, selectEnt: undefined, entGoPointFlag: true })
          this.loadPointMarkerData(data)

          dispatch({ //获取监测点数量  图例展示
            type: `${namespace}/GetMapPointList`,
            payload: { pollutantType: pollutantType, pointType: 3, entCode: position.entCode },
            callback: (data) => {
              this.setState({ selectPointMarkers: data })
            }
          })
        }
      },
      mouseover: (MapsOption, marker) => { //鼠标移入地图容器内时触发
        const { showType } = this.state;
        const position = marker.De && marker.De.extData.position;
        if (position) {
          if (showType == 2) {
            this.setState({ pointInfoWindowVisible: false, hoverTitleShow: false, hoverEntTitleShow: true, hoverEntTitle: position.entName ? position.entName : position.ParentName, hoverTitleLngLat: { latitude: position.latitude, longitude: position.longitude } })
          }
          if (showType == 3) {
            this.setState({ pointInfoWindowVisible: false, hoverEntTitleShow: false, hoverTitleShow: true, hoverEntTitle: position.entName ? position.entName : position.ParentName, hoverPointTitle: position.PointName ? position.PointName : null, hoverTitleLngLat: { latitude: position.latitude, longitude: position.longitude } })
          }
        }

      },
      mouseout: (MapsOption, marker) => { //鼠标移出地图容器内时触发
        const { showType } = this.state;
        if (showType == 2 || showType == 3) {
          const position = marker.De.extData.position;
          this.setState({ hoverTitleShow: false, hoverEntTitleShow: false })
        }
      }
    };
    this.state = {
      mapPointLoading: true,
      fullScreen: false,
      showType: 1,
      regionMarkers: [],
      selectEntMarkers: [],
      allEntMarkers: [],
      selectPointMarkers: [],
      allPointMarkers: [],
      entTitleShow: false,
      hoverEntTitleShow: false,
      pointTitleShow: false,
      hoverTitleShow: false,//监测点hover 气泡卡片
      hoverTitleLngLat: {},
      hoverEntTitle: '',
      hoverPointTitle: '',
      pointInfoWindowVisible: false,
      currentClickObj: {}, // 当前点击对象 -  监测点弹窗
      infoWindowPos: {},
      selectEnt: undefined,
      backIconGo: false,
      entLists: [],
      mapBtnStatusIndex: -1,
      isMassive: false,
      pointStatus: null,
      pointReg: null,
      selectAllPointMarkers: [], //进入首页面直接选择监测点图例
      entGoPointFlag: false,
      selectEntAllPointMarkers: [],//企业进入监测点的所有监测点
      minWidth: 1690,
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
    window._AMapSecurityConfig = {
      securityJsCode: 'a74ee5d040647b0512c842cff7d76517',
    }
    this.initData()
  }





  initData = () => {
    const { pollType } = this.props;
    pollutantType = pollType[this.props.type]
    this.getMapPointList(3)
    this.getMapPointList(2)
    this.getMapPointList(1)

    if (document.body.clientWidth <= this.state.minWidth) {
      this.props.dispatch({
        type: 'newestHome/updateState',
        payload: { smallResolution: true }
      })
    }
    // 监听
    window.addEventListener("resize", this.handleResize);
  }

  handleResize = (e) => {
    if (e.target.innerWidth <= this.state.minWidth) {
      this.props.dispatch({
        type: 'newestHome/updateState',
        payload: { smallResolution: true }
      })
    } else {
      this.props.dispatch({
        type: 'newestHome/updateState',
        payload: { smallResolution: false }
      })
    }
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
          this.setState({ selectEntMarkers: data, allEntMarkers: data, })
        } else {
          this.setState({ selectPointMarkers: data })
          this.setState({ allPointMarkers: data })

        }
      }
    })
  }

  clearMass = () => { //清除海量点(废气 监测点)和海量标签(废气 监测点标题)

    this.setState({ isMassive: false })
    massMarks && massMarks.hide(aMap);
    if (labelsMarker && labelsLayer) {
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
      hoverEntTitleShow: false,
      hoverTitleShow: false,

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
    this.clearMass();
    this.setState({
      showType: 2,
      pointTitleShow: false,
      markersList: data,
      pointStatus: null,
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
    this.setState({
      showType: 3,
      hoverEntTitleShow: false,
      entTitleShow: false,
    })
    if (data.length >= 1000) { // 监测点多的情况 海量加载

      const warnData = data[0] && data.filter(item => item.position.alarmStatus) //报警点 常规加载

      this.setState({
        markersList: warnData,
        isMassive: true,
      })
      const normalData = data[0] && data.filter(item => !item.position.alarmStatus) //正常点

      this.loadMassivePointMarkerData(normalData)



    } else {
      this.setState({
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
      return { lnglat: [item.position.Longitude, item.position.Latitude], ...item, style: item.position.Status }
    })
    let imgType = [0, 1, 2, 3, 4];
    let styleObject = imgType.map(item => { //废气 废水
      return {
        url: pollutantType == 2 ? `/gas${item}.png` : `/water${item}.png`,  // 图标地址
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
      aMap.setFitView();
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
    const { showType } = this.state;
    massMarks.on('mouseover', (e) => {
      const position = e.data.position;
      if (position) {
        _this.setState({ pointInfoWindowVisible: false, hoverEntTitleShow: false, hoverTitleShow: true, hoverEntTitle: position.entName ? position.entName : position.ParentName, hoverPointTitle: position.PointName ? position.PointName : null, hoverTitleLngLat: { latitude: position.latitude, longitude: position.longitude } })
      }

    })
    massMarks.on('mouseout', (e) => {
      _this.setState({ hoverTitleShow: false, hoverEntTitleShow: false })
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
    const { allEntMarkers } = this.state;
    const data = allEntMarkers.filter(item => item.position.regionCode && item.position.regionCode.split(',')[0] == extData.position.regionCode);
    this.setState({ selectEntMarkers: data, backIconGo: true, pointReg: extData.position.regionCode, entGoPointFlag: false })
    this.loadEntMarkerData(data)
    const { dispatch } = this.props
    dispatch({
      type: `${namespace}/GetMapPointList`,
      payload: { pollutantType: pollutantType, pointType: 3, regionCode: extData.position.regionCode },
      callback: (data) => {
        this.setState({ selectEntAllPointMarkers: data })
      }
    })
  }
  operationChange = (text, mapProps) => {
    const map = mapProps.__map__;
    const { showType, regionMarkers, selectPointMarkers, entTitleShow, pointTitleShow, markersList, mapBtnStatusIndex, } = this.state;
    if (!map) { console.log('组件必须作为 Map 的子组件使用'); return; }
    switch (text) {
      case '放大':
        map.zoomIn()
        break;
      case '缩小':
        map.zoomOut()
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
        this.setState({ backIconGo: true, mapBtnStatusIndex: -1, })
        this.loadRegionMarkerData(regionMarkers)
        // this.setState({showType:1, markersList:[...this.state.regionMarkers]})
        break;
      case '展示监测点':
        const { pointType, selectAllPointMarkers, backIconGo, } = this.state;

        this.setState({ pointTitleShow: false, entTitleShow: false, backIconGo: false, })

        this.loadPointMarkerData(mapBtnStatusIndex == -1 ? this.state.allPointMarkers : selectAllPointMarkers)

        break;
      case '展示名称':
        if (showType == 2 && !entTitleShow) {
          this.setState({ entTitleShow: true, markersList: [...markersList] })
        }
        if (showType == 3 && !pointTitleShow) {

          if (this.state.isMassive) {
            const noramalData = selectPointMarkers.filter(item => !item.alarmStatus)
            this.renderPointTitleLabelMarker(noramalData);
            const warinData = selectPointMarkers.filter(item => item.alarmStatus)
            this.setState({ pointTitleShow: true, markersList: [...warinData] })
            return;
          }
          this.setState({ pointTitleShow: true, markersList: [...markersList] })
        }
        break;
      case '隐藏名称':
        if (showType == 2 && entTitleShow) {
          this.setState({ entTitleShow: false, markersList: [...markersList] })
        }
        if (showType == 3 && pointTitleShow) {

          this.setState({ pointTitleShow: false, markersList: [...markersList] })

          if (this.state.isMassive) {
            labelsLayer.remove(labelsMarker)
            aMap.remove(labelsLayer)
            const warinData = markersList.filter(item => item.alarmStatus)
            this.setState({ pointTitleShow: false, markersList: [...warinData] })
            return;
          }
        }
        break;
    }

  }
  pointNum = (type, extData) => {
    const data = this.state.allPointMarkers.filter(item => item.position.regionCode && item.position.regionCode.split(',')[0] == extData.position.regionCode);

    this.setState({ pointStatus: type, pointReg: extData.position.regionCode })
    if (type == 2) { //超标点位数
      if (data) {
        const abnormalData = data[0] && data.filter(item => item.position.alarmStatus == type)
        abnormalData && abnormalData[0] && this.loadPointMarkerData(abnormalData)
      }

    }
    if (type == 1) { //异常点位数
      const overData = data[0] && data.filter(item => item.position.alarmStatus == type)
      overData && overData[0] && this.loadPointMarkerData(overData)
    }
  }
  //海量标注 监测点显示名称
  renderPointTitleLabelMarker = (data) => {
    // 创建一个 labelsMarker 实例 
    labelsMarker = [];

    data[0] && data.map(item => {
      labelsMarker.push(new window.AMap.LabelMarker({
        position: [item.position.longitude, item.position.latitude],
        opacity: 1,
        zIndex: 98,
        text: {
          content: `${item.position.ParentName} - ${item.position.PointName}`,
          direction: 'center',
          offset: [0, 40],
          style: {
            fontSize: 14,
            fillColor: '#fff',
            padding: [4, 8],
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
    return <div className={styles.regPopoverSty} style={{ position: 'absolute', margin: '0 auto', top: 'calc(35px + (65px - 54px)/2)', left: 12 }}>
      <div>企业总数 : {extData.position && extData.position.entCount}</div>
      <div><span style={{ color: '#FF0000' }}>超标</span>点位数 : <span style={{ cursor: 'pointer' }} onClick={() => { this.pointNum(2, extData) }}>{extData.position && extData.position.overCount ? extData.position.overCount : 0}</span></div>
      <div><span style={{ color: '#FFCC00' }}>异常</span>点位数 : <span style={{ cursor: 'pointer' }} onClick={() => { this.pointNum(1, extData) }}>{extData.position && extData.position.exceptionCount ? extData.position.exceptionCount : 0}</span></div>
    </div>
  }

  renderMarkers = (extData) => {
    const { showType, entTitleShow, pointTitleShow, isMassive } = this.state;
    const alarmStatus = extData.position.alarmStatus;
    if (showType == 1) {
      return <div style={{ position: 'relative', width: 110, height: 110,marginLeft:-55,marginTop:-110, background: 'url("/homeMapBorder.png")', backgroundSize: '100% 100%', cursor: 'default' }}>
        <div title={extData.position && extData.position.regionName} className='textOverflow' style={{ color: "#4BF3F9", position: 'absolute', left: 10, top: 18, fontSize: 12, lineHeight: '12px', width: 'calc(100% - 14px - 10px - 14px)' }}> {extData.position && extData.position.regionName} </div>
        <img src='/location.png' style={{ position: 'absolute', top: '100%', left: 'calc(50% - 10px)', width: 20, height: 20 }} />
        <RightOutlined onClick={() => { this.goEnt(extData) }} style={{ color: "#4BF3F9", position: 'absolute', top: 18, right: 8, fontSize: 14 }} />
        {this.regPopovercontent(extData)}
      </div>
    } else if (showType == 2) {

      const entName = extData.position.entName;
      return <div style={{ position: 'relative',marginTop:24,  }}>
        <EntIcon />
        <div className={alarmStatus == 1 ? styles.abnormalPaulse : alarmStatus == 2 ? styles.overPaulse : ''}></div>
        {entTitleShow && <div className={styles.titlePopSty}>
          {entName}
        </div>}
      </div>
    } else { //监测点
      return <div style={{ position: 'relative',marginTop:24,}}>
        {this.getIcon(extData.position.Status)}
        <div className={alarmStatus == 1 ? styles.abnormalPaulse : alarmStatus == 2 ? styles.overPaulse : ''}></div>
        {pointTitleShow && isMassive ?
          <div style={{ padding: '4px 8px', backgroundColor: massPointTitleColor }}>{extData.position.ParentName} - {extData.position.PointName}</div>
          :
          pointTitleShow ? <div className={styles.pointTitlePopSty}>
            <div className={styles.titlePopSty} >
              <div>{extData.position.ParentName}</div>
              <div>{extData.position.PointName}</div>
            </div>
          </div> : null}
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
  entBlur = () => { //失去焦点
    const { selectEntMarkers, selectEnt, showType, selectPointMarkers, markersList, allEntMarkers, } = this.state;
    this.setState({ entLists: [] })
    if (selectEnt) {
      if (showType == 3) { //对应的监测点 搜索企业下的监测点
        let pointData = [];
        selectPointMarkers.map(item => {
          let position = item.position;
          if (position.ParentName === selectEnt) {
            pointData.push(item)
          }
        })
        if (pointData && pointData[0]) {
          this.loadPointMarkerData(pointData)
          aMap.setZoom(10);
          this.setState({ entLists: [] })
        }
      } else { //对应的企业  搜索行政区下的企业

        let entList = showType == 1 ? allEntMarkers : markersList;
        let entData = [];
        entList.map(item => {
          let position = item.position;
          if (position.entName === selectEnt) {
            entData.push(item)
          }
        })

        if (entData && entData[0]) {
          this.loadEntMarkerData(entData);
          aMap.setZoom(14);
          this.setState({ entLists: [], selectEntMarkers: entData, backIconGo: true, pointReg: entData[0].position.regionCode && entData[0].position.regionCode.split(',')[0] })

          const { dispatch } = this.props
          dispatch({
            type: `${namespace}/GetMapPointList`,
            payload: { pollutantType: pollutantType, pointType: 3, entCode: entData[0].position.entCode, selectEnt: true },
            callback: (data) => {
              this.setState({ selectPointMarkers: data })
            }
          })
        }


      }
    } else {
      // showType == 3 ? this.loadPointMarkerData(selectPointMarkers) : this.loadEntMarkerData(selectEntMarkers);
    }
  }
  onBack = () => {
    const { showType, regionMarkers, selectEnt, selectEntMarkers, pointStatus, pointReg, } = this.state;

    const { dispatch } = this.props;


    if (showType == 2) {
      this.loadRegionMarkerData(regionMarkers)

      dispatch({ //返回行政区级别监 清除单个行政区下监测点数量 图例
        type: 'newestHome/updateState',
        payload: {
          mapStatusRegData: { exceptionCount: 0, normalCount: 0, overCount: 0, stopCount: 0, unLineCount: 0 },
        },
      });
    }
    if (showType == 3) {
      const data = selectEntMarkers.filter(item => item.position.regionCode && item.position.regionCode.split(',')[0] == pointReg);

      if (pointStatus) { // 异常  or  超标
        const abnormalOverEntData = data[0] && data.filter(item => item.position.alarmStatus == pointStatus)
        this.loadEntMarkerData(abnormalOverEntData)
        return;
      } else {
        this.loadEntMarkerData(data);

        dispatch({ //返回企业级别监 清除单个企业下监测点数量  图例
          type: 'newestHome/updateState',
          payload: {
            mapStatusEntData: { exceptionCount: 0, normalCount: 0, overCount: 0, stopCount: 0, unLineCount: 0 },
          },
        });
      }
    }

    this.setState({ selectEnt: undefined, mapBtnStatusIndex: -1, pointInfoWindowVisible: false, hoverTitleShow: false, entGoPointFlag: false, })
  }

  mapBtnClick = (index, item) => {
    const { mapBtnStatusIndex, showType, selectPointMarkers, backIconGo, } = this.state;

    // showType==1 || showType==3 && !backIconGo   刚进入页面或者进入页面直接点击监测点图例 

    const flag = showType == 1 || showType == 3 && !backIconGo ? true : false
    this.setState({ selectEnt: undefined, backIconGo: flag ? false : true, })

    const selectPointData = flag ? this.state.allPointMarkers : showType == 2 || showType == 3 && backIconGo && !this.state.entGoPointFlag ? this.state.selectEntAllPointMarkers : selectPointMarkers;

    if (mapBtnStatusIndex !== index) {
      this.setState({ mapBtnStatusIndex: index })


      const selectData = selectPointData.filter(pointItem => {
        return item.status == pointItem.position.Status
      })

      flag && this.setState({ selectAllPointMarkers: selectData, })
      this.loadPointMarkerData(selectData)
    } else { //取消
      this.setState({ mapBtnStatusIndex: -1, })
      this.loadPointMarkerData(selectPointData)
    }

  }
  mapContent = (props) => {
    const { markersList, mapPointLoading, fullScreen, showType, regionMarkers, selectPointMarkers, entTitleShow, pointTitleShow, backIconGo, mapBtnStatusIndex, } = this.state;
    const { mapStatusData, subjectFontSize, pollType, entList, mapStatusRegData, mapStatusEntData } = this.props;


    /**
     * showType==1 || showType==3 && !backIconGo   刚进入页面或者进入页面直接点击监测点图例 
     * entGoPointFlag true为从企业进入监测点
     * 
     */
    const statusData = showType == 1 || showType == 3 && !backIconGo ? mapStatusData : showType == 2 || showType == 3 && backIconGo && !this.state.entGoPointFlag ? mapStatusRegData : mapStatusEntData;

    const typeBtnArr = [{ text: '超标', color: '#FF0000', val: statusData.overCount, status: 2 }, { text: '异常', color: '#FFCC00', val: statusData.exceptionCount, status: 3 }, { text: '离线', color: '#67666A', val: statusData.unLineCount, status: 0 },
    { text: '在线', color: '#5fc15d', val: statusData.normalCount, status: 1 }, { text: '停运', color: '#836BFB', val: statusData.stopCount, status: 4 }]

    const operationBtnArr = () => {
      return [{ text: fullScreen ? '退出全屏' : '全屏', url: fullScreen ? '/homeMapT.png' : '/homeMapQp.png' }, { text: '展示企业', url: showType == 1 ? '/homeMapQA.png' : '/homeMapQ.png' }, { text: '展示监测点', url: showType == 3 && !backIconGo ? '/homeMapJcA.png' : '/homeMapJc.png' },
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
      "2": <><GasIcon /><span className={styles.iconText}>废气</span></>,
      "1": <><WaterIcon /><span className={styles.iconText}>废水</span></>,
    }

    const { hoverTitleShow, hoverEntTitleShow, hoverTitleLngLat, hoverEntTitle, hoverPointTitle, pointInfoWindowVisible, infoWindowPos, selectEnt, isMassive, } = this.state;
    const { smallResolution } = this.props;
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
        amapkey={'a6202668a4412c04000baaf7625752bf'}
        events={this.amapEvents}
        version='1.4.19'
        mapStyle='amap://styles/a0e33cc065bb7d9cb66b1fe3d9810781 '
      // amapkey={config.amapKey}
      // mapStyle="amap://styles/darkblue"
      // useAMapUI={!config.offlineMapUrl.domain}

      >

        <Markers
          markers={markersList}
          render={this.renderMarkers}
          events={this.markersEvents}
          extData={markersList}
        // useCluster
        />
        <InfoWindow //企业 hover
          visible={hoverEntTitleShow}
          position={hoverTitleLngLat}
          autoMove
          offset={isMassive ? [10, -5] : [4, -10]}
          className={styles.titleInfoWindow}
        >
          <div style={{ whiteSpace: "nowrap" }} >企业名称：{hoverEntTitle}</div>
        </InfoWindow>
        <InfoWindow //监测点 hover
          visible={hoverTitleShow}
          position={hoverTitleLngLat}
          autoMove
          offset={isMassive ? [10, -5] : [4, -10]}
          className={styles.titleInfoWindow}
        >
          <div style={{ whiteSpace: "nowrap" }} >企业名称：{hoverEntTitle}</div>
          <div style={{ paddingTop: 3, whiteSpace: "nowrap" }}>监测点名称：{hoverPointTitle}</div>
        </InfoWindow>
        <InfoWindow

          position={infoWindowPos}
          visible={pointInfoWindowVisible}
          offset={isMassive ? [10, -5] : [4, -10]}
          autoMove
          showShadow
          closeWhenClickMap={false}
        >
          {this.infoWindowContent()}
          <span onClick={() => { this.setState({ pointInfoWindowVisible: false }) }} style={{ position: 'absolute', cursor: 'pointer', top: 0, right: 8, fontSize: 18 }}>×</span>
        </InfoWindow>

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
        <div className={smallResolution ? styles.smallMapBtn : styles.mapBtn}> { /**按钮 */}
          <Row align='middle'>
            {typeBtnArr.map((item, index) => {
              return <Row onClick={() => { this.mapBtnClick(index, item) }} style={{ padding: smallResolution ? '7px 10px' : '' }} className={index === mapBtnStatusIndex ? styles.typeBtnActiveSty : styles.typeBtnSty} align='middle' justify='center'>
                <div className={smallResolution ? styles.smallColorBlock : styles.colorBlock} style={{ background: `${item.color}` }}></div>
                <span style={{ fontSize: subjectFontSize }}>{item.text} {item.val}</span>
              </Row>
            })}
          </Row>
        </div>
        {<div className={styles.searchSty} >  { /**搜索 */}
          <Select
            showSearch
            style={{ width: smallResolution ? 110 : 220 }}
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

        {showType == 1 || showType == 3 && !backIconGo ? null : <div className={smallResolution ? styles.smallBackSty : styles.backSty} onClick={this.onBack}>  { /**返回 */}
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