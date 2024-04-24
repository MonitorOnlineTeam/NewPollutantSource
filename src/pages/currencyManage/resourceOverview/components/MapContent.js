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
import { BtnList, RegPopver, SecondPopver, MapSelect } from "../components/publicComponents/MapPartPendant";
import Base from 'antd/lib/typography/Base';

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

@connect(({ loading, resourceOverview, global }) => ({
  mapLoading: loading.effects[`${namespace}/GetResourceOverviewMap`],
  leftData: resourceOverview.leftData,
  rightData: resourceOverview.rightData,
}))
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.amapEvents = {
      enableHighAccuracy:true,
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
          // mapInstance.setFitView();//自动适应显示你想显示的范围区域

        }
      },
      zoomchange: (value) => {
        const zoom = aMap.getZoom();

      },
    };
    // markers事件
    this.markersEvents = {
      created: allMarkers => {
        console.log('高德地图 Marker 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
      },
      clickable: true,
    };
    this.state = {
      fullScreen: false,
      minWidth: 1690,
      selectType: { name: '备机' },
      markersList: [],
      selectRegionName:'',
      selectStatus:'',
     
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
      securityJsCode: config.securityJsCode,
    }
    this.initData()
  }



  mapFitView = () => {
    const timer = setInterval(() => {
      if (aMap) {
        aMap.setFitView();
        clearInterval(timer);
      }
    }, 0);
  }

  initData = () => {
    const { dispatch } = this.props
    dispatch({
      type: `${namespace}/GetResourceOverviewMap`,
      payload: {},
      callback: (data) => {
        this.setState({ markersList: data }, () => {
          this.mapFitView();
        });
      }
    })
  }







  operationChange = (text, mapProps) => {
    const map = mapProps.__map__;
    if (!map) { console.log('组件必须作为 Map 的子组件使用'); return; }
    const { selectType } = this.state;
    switch (text) {
      case '全屏':
        this.setState({ fullScreen: true })
        this.props.fullScreenClick(true)
        break;
      case '退出全屏':
        this.setState({ fullScreen: false })
        this.props.fullScreenClick(false)
        break;
      case '省':
        this.setState({ selectType: { ...selectType, isEnter: false, showAll: false } })
        break;
      case `展示${'办事处' || '备件库'}`:
        this.setState({ selectType: { ...selectType, isEnter: true, showAll: true } })
        break;
    }

  }







  onBack = () => {
    const { selectType } = this.state
    aMap.clearMap();
    this.setState({ selectType: { ...selectType, isEnter: false, showAll: false } },()=>{
      this.mapFitView();
    })
  }


  btnChange = (name, index) => {
    aMap.clearMap();
    this.setState({ selectType: { name: name, secondFlag: name == '办事处' || name == '备件库' ? true : false } })
    const { selectType } = this.state;
    if(name != selectType.name){
      this.setState({selectStatus:''},()=>{
        this.mapFitView();
      })
    }
  }
 
  selectChange = (value) => {
    const { selectType } = this.state;
    this.setState({selectStatus:value},()=>{
    })
  };

  regionEnter = (regionName) => {
    aMap.clearMap();
    this.setState({ selectType: { ...this.state.selectType, isEnter: true }, selectRegionName: regionName }, () => {})
    AMap.plugin('AMap.DistrictSearch', () => {
      const districtSearch = new AMap.DistrictSearch({
        subdistrict: 0,   //获取边界不需要返回下级行政区
        extensions: 'all',  //返回行政区边界坐标组等具体信息
        level: 'province'  //查询行政级别为 省
      })
      const regName = regionName == '新疆生产建设兵团' ? '新疆维吾尔自治区' : regionName
      // 搜索所有省/直辖市信息
      districtSearch.search(regName, function (status, result) {
        // 查询成功时，result即为对应的行政区信息
        if (status === 'complete') {
          const bounds = result?.districtList[0]?.boundaries;
          // 创建省份轮廓覆盖物
          const provinceOutline = new AMap.Polygon({
            path: bounds?.[0] ? bounds : [],
            strokeColor: '#00A8FF', // 初始轮廓颜色
            strokeOpacity: 1,
            strokeWeight: 2,
            fillOpacity: 0,
          });
          // 将省份轮廓覆盖物添加到地图上
          provinceOutline.setMap(aMap);
        }
      })
    })
    this.mapFitView();
  }


  renderMarkers = (extData) => {
    const { selectType,selectStatus } = this.state;
    if (selectType.isEnter) { //进入二级页面
      const item = extData.position
      const data = selectType.name == '办事处' ? { name: item?.OfficeName, value: `${item?.UserNum || 0}人` } :
        { name: item?.StorehouseName } //备件库
      return <SecondPopver isIcon={selectType.name == '备件库'} data={data} />
    } else {
      const item = extData.position;
      let data = [];
      if(selectType.name == '备机' || selectType.name == '便携式仪器'){
        data = [{ name: '可使用', value: item?.UsedNum, unit: '台' }, { name: '使用中', value: item.UsintNum, unit: '台' }]
        if(selectStatus){
          data = data.filter(item=>item.name == selectStatus)
        }
      }else if(selectType.name == '办事处'){ //办事处
        data = [{ name: '办事处数量', value: item?.OfficeLocationNum, unit: '个'  }, { name: '人数', value: item?.OfficeAndUserNum, unit: '人' }] 
      }else{//备件库
        data =  { name: item?.RegionName, value: `${item?.StorehouseNum}个` }
      }

      return selectType.name == '备件库' ? <SecondPopver onClick={() => this.regionEnter(item?.RegionName)} isEnter data={data} /> : <RegPopver unit={selectType.secondFlag?'': '台'} sum={selectType.secondFlag? '' : Number(data?.[0]?.value || 0) + Number(data?.[1]?.value || 0)} onClick={() => this.regionEnter(item?.RegionName)} isEnter={selectType.secondFlag} regionName={item.RegionName} data={data} />
    }


  }
  mapContent = (props) => {
    const { selectType, markersList, fullScreen, selectRegionName,selectStatus } = this.state;
    const  { leftData,rightData } = this.props;
    const btnList = [{ name: '备机', value: leftData?.StandbyMachineInfo?.StandbyMachineNum }, { name: '便携式仪器', value: rightData?.PortableInstrumentInfo?.PortableInstrumentNum }, { name: '办事处', value:  rightData?.OfficeLocationInfo?.OfficeLocationNum }, { name: '备件库', value: rightData?.StorehouseInfo?.StorehouseNum },]

    const operationBtnArr = () => {

      const fullData = [{ text: fullScreen ? '退出全屏' : '全屏', url: fullScreen ? '/currencyResOver/mapqp.png' : '/currencyResOver/mapqp.png' }]
      return selectType.secondFlag ? [
        ...fullData,
        { text: '省', url: '/currencyResOver/xzq.png' },
        { text: `展示${selectType.name}`, url: '/currencyResOver/zsbbc.png' },

      ] : fullData
    }
    const RightIconMapComponent = (props) => {

      return (<div style={{ position: 'absolute', right: 24, top: 72 }}>
        {operationBtnArr().map((item, index) => {
          return <div style={{ paddingBottom: 10, cursor: 'pointer' }} onClick={() => { this.operationChange(item.text, props) }}><img title={item.text} src={item.url} /></div>
        })}
      </div>);

    }
    let markersData = {};
    if (selectType.isEnter) {  //进入二级
      if (selectType.name == '办事处') {
        const data = []
        markersList?.RegionOfficeLocationList?.map(item => {
          if (item?.position?.RegionName == selectRegionName || selectType.showAll) { //从省进入或者 直接点右侧进入
            item?.position?.childList.map(item => {
              data.push({ position: { ...item, longitude: item.Longitude, latitude: item.Latitude } })
            })
          }
        })
        markersData = data
      } else { //备件库
        const data = []
        markersList?.RegionStorehouseList?.map(item => {
          if (item?.position?.RegionName == selectRegionName || selectType.showAll) {
            item?.position?.childList.map(item => {
              data.push({ position: { ...item, longitude: item.Longitude, latitude: item.Latitude } })
            })
          }
        })
        markersData = data

      }
    } else {
      if( selectType.name == '备机'){
          markersData = markersList?.RegionStandbyMachineList?.map(item => ({
            position: { ...item.position, ...item,position:undefined}
          }))
      }else if(selectType.name == '便携式仪器'){
        markersData = markersList?.RegionPortableInstrumentList?.map(item => ({
          position: { ...item.position,...item,position:undefined}
        }))
      }else if(selectType.name == '办事处'){
        markersData =  markersList.RegionOfficeLocationList 
      }else{ //备件库
        markersData =  markersList.RegionStorehouseList 
      }

    }
    return <Map
      // amapkey={config.amapkey}
      amapkey={'1440c67033e5ede0f3a068605de5fb5f'}
      events={this.amapEvents}
      version='1.4.19'
      mapStyle='amap://styles/6daa80e94c53325ff909a31f3d3d8809'
    >
      <Markers
        markers={markersData}
        render={this.renderMarkers}
        events={this.markersEvents}
        extData={markersData}
      />
      <BtnList data={btnList} onClick={this.btnChange} />
      {!selectType.secondFlag && <MapSelect
        style={{ width: 120, top: 72, left: 24 }}
        onChange={this.selectChange}
        value={selectStatus}
        options={[{ value: '', label: '全部' }, { value: '可使用', label: '可使用' }, { value: '使用中', label: '使用中' }]} />}
      <RightIconMapComponent />
      {selectType.isEnter && <div style={{ cursor: 'pointer', position: 'absolute', top: 72, right: 66 }} onClick={this.onBack}>  { /**返回 */}
        <img src='/currencyResOver/back.png' />
      </div>}
    </Map>


  }
  render() {
    const { fullScreen, currentClickObj } = this.state;
    const { mapLoading } = this.props;
    const MapContent = this.mapContent
    return (
      <div style={{ width: '100%', height: '100%' }} className={`${fullScreen ? `mapModal` : ''}`}>
        <Spin spinning={!!mapLoading}>
          <MapContent />
        </Spin>
      </div>
    )
  }
}
export default Index;