/**
 * 功能：资源一览 地图
 * 创建人：jab
 * 创建时间：2024.04
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
import styles from "../style.less"
import { uploadPrefix } from '@/config'
import {BtnList,MapPopver } from "@/pages/ctDebuggAfterSaleServiceManage/components/mapTypeBtnPop";

const { Option } = Select;

const namespace = 'resourceOverview'

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
@connect(({ loading, resourceOverview, global }) => ({
  pollType: resourceOverview.pollType,
  subjectFontSize: resourceOverview.subjectFontSize,
  mapStatusData: resourceOverview.mapStatusData,
  infoWindowData: resourceOverview.infoWindowData,
  infoWindowDataLoading: resourceOverview.infoWindowDataLoading,
  entList: resourceOverview.entList,
  smallResolution: resourceOverview.smallResolution,
  mapStatusRegData: resourceOverview.mapStatusRegData,
  mapStatusEntData: resourceOverview.mapStatusEntData,
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
      console.log(amap)
      Map = amap.Map;
      Marker = amap.Marker;
      Polygon = amap.Polygon;
      Markers = amap.Markers;
      InfoWindow = amap.InfoWindow;
    }

  }
  componentDidMount() {
    window._AMapSecurityConfig = {
      securityJsCode: config.securityJsCode,
    }
    this.initData()
  }





  initData = () => {
    // const { pollType } = this.props;
    // pollutantType = pollType[this.props.type]
    // this.getMapPointList(3)
    // this.getMapPointList(2)
    // this.getMapPointList(1)

    // if (document.body.clientWidth <= this.state.minWidth) {
    //   this.props.dispatch({
    //     type: 'resourceOverview/updateState',
    //     payload: { smallResolution: true }
    //   })
    // }
    // 监听
    // window.addEventListener("resize", this.handleResize);
  }

  handleResize = (e) => {
    if (e.target.innerWidth <= this.state.minWidth) {
      this.props.dispatch({
        type: 'resourceOverview/updateState',
        payload: { smallResolution: true }
      })
    } else {
      this.props.dispatch({
        type: 'resourceOverview/updateState',
        payload: { smallResolution: false }
      })
    }
  }
  // 获取infoWindow数据
  getInfoWindowData = () => {
    const { currentClickObj } = this.state;
    this.props.dispatch({
      type: 'resourceOverview/getInfoWindowData',
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
            clearInterval(timer);
          }
        }, 0);
      })
    }



  }

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
    AMap.plugin('AMap.DistrictSearch', () => {
      const districtSearch = new AMap.DistrictSearch({
        subdistrict: 0,   //获取边界不需要返回下级行政区
        extensions: 'all',  //返回行政区边界坐标组等具体信息
        level: 'province'  //查询行政级别为 省
      })
      const regName = extData?.position?.regionName == '新疆生产建设兵团' ? '新疆维吾尔自治区' : extData.position.regionName
      // 搜索所有省/直辖市信息
      districtSearch.search(regName, function (status, result) {
        // 查询成功时，result即为对应的行政区信息
        if (status === 'complete') {
          const bounds = result?.districtList[0]?.boundaries;
          // 创建省份轮廓覆盖物
          const provinceOutline = new AMap.Polygon({
            path: bounds?.[0] ? bounds : [],
            strokeColor: '#faad14', // 初始轮廓颜色
            strokeOpacity: 1,
            strokeWeight: 2,
            fillOpacity: 0,
            // fillColor: '#fa541c',
          });
          // 将省份轮廓覆盖物添加到地图上
          provinceOutline.setMap(aMap);
          // 创建 CanvasLayer 图层  
          // var canvasLayer = new AMap.CanvasLayer();
        }
      })
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
      return <div style={{ position: 'relative', width: 110, height: 110, marginLeft: -55, marginTop: -110, background: 'url("/homeMapBorder.png")', backgroundSize: '100% 100%', cursor: 'default' }}>
        <div title={extData.position && extData.position.regionName} className='textOverflow' style={{ color: "#4BF3F9", position: 'absolute', left: 10, top: 18, fontSize: 12, lineHeight: '12px', width: 'calc(100% - 14px - 10px - 14px)' }}> {extData.position && extData.position.regionName} </div>
        <img src='/location.png' style={{ position: 'absolute', top: '100%', left: 'calc(50% - 10px)', width: 20, height: 20 }} />
        <RightOutlined onClick={() => { this.goEnt(extData) }} style={{ color: "#4BF3F9", position: 'absolute', top: 18, right: 8, fontSize: 14 }} />
        {this.regPopovercontent(extData)}
      </div>
    } else if (showType == 2) {

      const entName = extData.position.entName;
      return <div style={{ position: 'relative', marginTop: 24, }}>
        <EntIcon />
        <div className={alarmStatus == 1 ? styles.abnormalPaulse : alarmStatus == 2 ? styles.overPaulse : ''}></div>
        {entTitleShow && <div className={styles.titlePopSty}>
          {entName}
        </div>}
      </div>
    } else { //监测点
      return <div style={{ position: 'relative', marginTop: 24, }}>
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




  onBack = () => {
    const { showType, regionMarkers, selectEnt, selectEntMarkers, pointStatus, pointReg, } = this.state;

    const { dispatch } = this.props;


    if (showType == 2) {
      this.loadRegionMarkerData(regionMarkers)

      dispatch({ //返回行政区级别监 清除单个行政区下监测点数量 图例
        type: 'resourceOverview/updateState',
        payload: {
          mapStatusRegData: { exceptionCount: 0, normalCount: 0, overCount: 0, stopCount: 0, unLineCount: 0 },
        },
      });
      aMap.clearMap();
    }
  }

  mapContent = (props) => {
    const {showType, markersList, fullScreen,backIconGo } = this.state;

    const operationBtnArr = () => {
      return [
       { text: fullScreen ? '退出全屏' : '全屏', url: fullScreen ? '/currencyResOver/mapqp.png' : '/currencyResOver/mapqp.png' }, 
       { text: '省', url:'/currencyResOver/xzq.png'},
       { text: '展示企业', url:'/currencyResOver/zsbbc.png' },
      
      ]
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
    
    const btnList = [{name:'备机',value:50},{name:'便携式仪器',value:50},{name:'办事处',value:50},{name:'备件库',value:50},]

    return <Map
        // amapkey={config.amapkey}
        amapkey={'1440c67033e5ede0f3a068605de5fb5f'}
        events={this.amapEvents}
        version='1.4.19'
        mapStyle='amap://styles/6daa80e94c53325ff909a31f3d3d8809'
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
        <BtnList data={btnList}/>
        {/* <RightIconMapComponent /> */}
        {showType == 1 || showType == 3 && !backIconGo ? null : <div className={smallResolution ? styles.smallBackSty : styles.backSty} onClick={this.onBack}>  { /**返回 */}
          <img src='/homeMapBack.png' />
          <div>返回</div>
        </div>}
      </Map>
    

  }
  render() {
    const { fullScreen, currentClickObj, mapPointLoading} = this.state;
    const MapContent = this.mapContent
    return (  
      <div style={{width:'100%',height: '100%' }} className={`${fullScreen ? `mapModal` : ''}`}>
        {/* <Spin spinning={!!mapPointLoading}> */}
        <MapContent/>
        {/* </Spin> */}
      </div>
     
    )
  }
}
export default Index;