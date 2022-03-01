/**
 * 功能：首页
 * 创建人：贾安波
 * 创建时间：2021.11.03
 */
import React, { PureComponent, useState, useEffect, Fragment, useRef, useMemo, useLayoutEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, EnvironmentFilled } from '@ant-design/icons';
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


let pollutantType = {}

@connect(({ loading, newestHome }) => ({
  pollType: newestHome.pollType,
  subjectFontSize: newestHome.subjectFontSize,
  mapStatusData: newestHome.mapStatusData,
  infoWindowData: newestHome.infoWindowData,
  infoWindowDataLoading: newestHome.infoWindowDataLoading,
  entList:newestHome.entList,
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
        this.setState({
          allMarkers,
        });
      },
      clickable: true,
      click: (MapsOption, marker) => {
        const { showType } = this.state;
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
      },
      mouseover: (MapsOption, marker) => { //鼠标移入地图容器内时触发
        const { showType } = this.state;
        if (showType == 2 || showType == 3) {
          const position = marker.De.extData.position;
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
      entTitleShow: false,
      pointTitleShow: false,
      hoverTitleShow: false,
      hoverTitleLngLat: {},
      hoverEntTitle: '',
      hoverPointTitle: '',
      pointInfoWindowVisible: false,
      currentClickObj: {}, // 当前点击对象 -  监测点弹窗
      infoWindowPos: {},
      selectEnt:undefined
    }
  }
  componentWillMount() {
    if (config.offlineMapUrl.domain) {
      const amap = require('@/components/ReactAmap');
      // Map, Marker, Polygon, Markers, InfoWindow;
      Map = amap.Map;
      Marker = amap.Marker;
      Polygon = amap.Polygon;
      Markers = amap.Markers;
      InfoWindow = amap.InfoWindow;
    } else {
      const amap = require('react-amap');
      // Map, Marker, Polygon, Markers, InfoWindow;
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
        }
      }
    })
  }

  loadRegionMarkerData = (data) => { //行政区
    this.setState({
      showType: 1,
      markersList: data,
      entTitleShow: false, pointTitleShow: false,selectEnt:undefined
    }, () => {
      const timer = setInterval(() => {
        if (aMap) {
          aMap.setFitView();
          clearInterval(timer);
        }
      }, 0);
    })

  }
  loadEntMarkerData = (data) => { //企业
    this.setState({
      showType: 2,
      pointTitleShow: false,
      markersList: data
    }, () => {
      const timer = setInterval(() => {
        if (aMap) {
          aMap.setFitView();
          clearInterval(timer);
        }
      }, 0);
    })

  }
  loadPointMarkerData = (data) => { //监测点
    this.setState({
      showType: 3,
      markersList: [...data]
    }, () => {
      const timer = setInterval(() => {
        if (aMap) {
          aMap.setFitView();
          aMap.setZoomAndCenter(aMap.getZoom()+1, [96.01906121185537, 35.874643454131984]);
          clearInterval(timer);
        }
      }, 0);
    })

  }
  getIcon = (status) => {
    let icon = '';
    if (pollutantType == 1) {
      switch (status) {
        case 0: // 离线
          icon = <WaterOffline />;
          break;
        case 1: // 正常
          icon = <WaterNormal />;
          break;
        case 2: // 超标
          icon = <WaterExceed />;
          break;
        case 3: // 异常
          icon = <WaterAbnormal />;
          break;
      }
      return icon;
    };

    if (pollutantType == 2) {
      switch (status) {
        case 0: // 离线
          icon = <GasOffline />;
          break;
        case 1: // 正常
          icon = <GasNormal />;
          break;
        case 2: // 超标
          icon = <GasExceed />;
          break;
        case 3: // 异常
          icon = <GasAbnormal />;
          break;
      }
    }
    return icon;
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
      case '展示企业':
        this.loadRegionMarkerData(regionMarkers)
        // this.setState({showType:1, markersList:[...this.state.regionMarkers]})
        break;
      case '展示监测点':
        // if(showType!=3){
        this.setState({ pointTitleShow: false, entTitleShow: false, })
        this.loadPointMarkerData(pointMarkers)
        // }
        break;
      case '展示名称':
        if (showType == 2 && !entTitleShow) {
          this.setState({ entTitleShow: true, markersList: [...entMarkers] })
        }
        if (showType == 3 && !pointTitleShow) {
          this.setState({ pointTitleShow: true, markersList: [...pointMarkers] })
        }
        break;
      case '隐藏名称':
        if (showType == 2 && entTitleShow) {
          this.setState({ entTitleShow: false, markersList: [...entMarkers] })
        }
        if (showType == 3 && pointTitleShow) {
          this.setState({ pointTitleShow: false, markersList: [...pointMarkers] })
        }
        break;
    }

  }
  regPopovercontent = (extData) => {
    return <div>
      <div>企业总数：{extData.position && extData.position.entCount}</div>
      <div><span style={{ color: '#FF0000' }}>超标</span>企业总数：{extData.position && extData.position.OverCount? extData.position.OverCount : 0}</div>
      <div><span style={{ color: '#FFCC00' }}>异常</span>企业总数：{extData.position && extData.position.ExceptionCount? extData.position.ExceptionCount : 0}</div>
    </div>
  }

  renderMarkers = (extData) => {
    const { showType, entTitleShow, pointTitleShow } = this.state;
    const alarmStatus = extData.position.alarmStatus;
    if (showType == 1) {
      return <div style={{ position: 'relative' }}>
        <Popover overlayClassName={styles.regPopSty} title={extData.position && extData.position.regionName} getPopupContainer={trigger => trigger.parentNode} visible={showType == 1} placement="top" content={this.regPopovercontent(extData)} >
          <img src='/location.png' style={{ position: 'relative', width: 35, height: 35 }} />
        </Popover>
      </div>
    } else if (showType == 2) {

      const entName = extData.position.entName;
      return <div style={{ position: 'relative' }}>
        {/* <img src='/homeMapEnt.png' style={{position:'relative',width:30,height:30}}/> */}
        <EntIcon />
        <div className={alarmStatus == 1 ? styles.abnormalPaulse : alarmStatus == 2 ? styles.overPaulse : ''}></div>
        {entTitleShow && <div className={styles.titlePopSty}>
          {entName}
        </div>}
      </div>
    } else {
      return <div style={{ position: 'relative' }}>
        {this.getIcon(extData.position.Status)}
        <div className={alarmStatus == 1 ? styles.abnormalPaulse : alarmStatus == 2 ? styles.overPaulse : ''}></div>
        {pointTitleShow && <div className={styles.pointTitlePopSty}>
          <div className={styles.titlePopSty} >{extData.position.ParentName}</div>
          <div className={styles.titlePopSty} >{extData.position.PointName}</div>
        </div>}
      </div>
    }
  }


  // 监测点弹窗内容
  infoWindowContent = () => {
    const { currentClickObj } = this.state;
    const { infoWindowData } = this.props;
    let imgName =
      pollutantType === 2 ? '/gasInfoWindow.png' : pollutantType === 1 ? '/water.jpg' : '/infoWindowImg.png';
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
        case 1: // 正常
          color = '#14ECDF';
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
          statusText = '正常';
          break;
        case 2:
          statusText = '超标';
          break;
        case 3:
          statusText = '异常';
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
  entSearchClick = (val) =>{
   const { entList } = this.props;
   let listEle = document.querySelector(".antd-pro-pages-newest-home-style-searchSty .ant-select-dropdown");
    const emptyEle = document.querySelector('.antd-pro-pages-newest-home-style-searchSty .ant-select-item-empty')
     if(emptyEle){
      listEle.style.display = 'none';
     }
    if(val){
      entList.map(item=>{
        if(item.entName.match(new RegExp(`\\${val}`, 'g'))){
          listEle.style.display = 'block';
        }
      })
     
    }else{
      listEle.style.display = 'none';
    }

  }
  entSearchChange = (val) =>{
    const { entMarkers } = this.state; 
    let listEle = document.querySelector(".antd-pro-pages-newest-home-style-searchSty .ant-select-dropdown");
    listEle.style.display = 'none';
    this.setState({ selectEnt:val})
    this.searchEntEle.blur() 
      entMarkers.map(item=>{
        let position = item.position;
      if(position.entCode === val){
        this.setState({ showType: 2, pointTitleShow: false,markersList: [...entMarkers] })
        aMap.setZoomAndCenter(14, [ position.longitude,position.latitude]);
      }
    })
     
  }

  onBack = () =>{
    const { showType,regionMarkers,selectEnt,entMarkers } = this.state;
    if(showType == 2){
      //  this.setState({ entTitleShow: false, pointTitleShow: false,selectEnt:undefined })
       this.loadRegionMarkerData(regionMarkers)
      }
    if(showType == 3){
       if(selectEnt){ //从企业跳转到监测点
        this.loadEntMarkerData(entMarkers)
       }else{  //从行政区直接跳转到监测点
        this.loadRegionMarkerData(regionMarkers)
       }
    }
  }
  mapContent = (props) => {
    const { markersList, mapPointLoading, fullScreen, showType, regionMarkers, entMarkers, pointMarkers, entTitleShow, pointTitleShow } = this.state;
    const { mapStatusData, subjectFontSize, pollType,entList } = this.props;
    const typeBtnArr = [{ text: '超标', color: '#FF0000', val: mapStatusData.overCount }, { text: '异常', color: '#FFCC00', val: mapStatusData.exceptionCount }, { text: '离线', color: '#67666A', val: mapStatusData.unLineCount },
    { text: '正常', color: '#14ECDF', val: mapStatusData.stopCount }, { text: '停运', color: '#836BFB', val: mapStatusData.stopCount }]

    const operationBtnArr = () => {
      return [{ text: fullScreen ? '退出全屏' : '全屏', url: fullScreen ? '/homeMapT.png' : '/homeMapQp.png' }, { text: '展示企业', url: '/homeMapQ.png' }, { text: '展示监测点', url: '/homeMapJc.png' },
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
      "1": <><WaterOffline /><span className={styles.iconText}>废水</span></>,
      "2": <><GasOffline /><span className={styles.iconText}>废气</span></>
    }

    const { hoverTitleShow, hoverTitleLngLat, hoverEntTitle, hoverPointTitle, pointInfoWindowVisible, infoWindowPos,selectEnt } = this.state;
   
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
        // events={props.type=='min'? amapEvents : maxAmapEvents}
        events={this.amapEvents}
        mapStyle="amap://styles/darkblue"
        useAMapUI={!config.offlineMapUrl.domain}
      // center={{ longitude:96.01906121185537, latitude: 35.874643454131984 }} //center 地图中心点坐标值
      >

        <Markers
          // markers={ showType==1?regionMarkers:showType==2?entMarkers:pointMarkers}
          markers={markersList}
          render={this.renderMarkers}
          events={this.markersEvents}
        />
        <InfoWindow
          visible={hoverTitleShow}
          position={hoverTitleLngLat}
          autoMove
          offset={[4, -35]}
          className={styles.titleInfoWindow}
        >
          <div style={{ whiteSpace: "nowrap" }} >企业名称：{hoverEntTitle}</div>
          {showType == 3 && <div style={{ paddingTop: 3, whiteSpace: "nowrap" }}>监测点名称：{hoverPointTitle}</div>}
        </InfoWindow>
        <InfoWindow

          position={infoWindowPos}
          visible={pointInfoWindowVisible}
          offset={[4, -35]}
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
              return <Row className={styles.typeBtnSty} align='middle' justify='center'>
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

        {showType != 3 && <div className={styles.searchSty} >  { /**搜索 */}
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
            suffixIcon={ <img src='/homeMapsearchIcon.png' />}
            onSearch={this.entSearchClick}
            onChange={this.entSearchChange}
            // ref={searchEntInput}
            ref={props.searchEntInputRef}
            value={selectEnt}
          >
          {entList[0]&&entList.map(item=>{
              return <Option value={item.entCode}>{item.entName}</Option>
            })}
          </Select>
        </div>}

        {showType != 1 && <div className={styles.backSty} onClick={this.onBack}>  { /**返回 */}
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

        <MapContent  searchEntInputRef={el => this.searchEntEle = el}/>
        <SiteDetailsModal data={currentClickObj} />
      </div>

    )
  }
}
export default Index;