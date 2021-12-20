/**
 * 功能：首页
 * 创建人：贾安波
 * 创建时间：2021.11.03
 */
import React, { PureComponent,useState, useEffect, Fragment, useRef, useMemo, useLayoutEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined,EnvironmentFilled  } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'
import moment from 'moment'
import config from '@/config';
// import { Map, MouseTool, Marker, Markers, Polygon, Circle,InfoWindow  } from '@/components/ReactAmap';
import styles from "../style.less"

const { Option } = Select;

const namespace = 'newestHome'

let Map;
let Marker;
let Polygon;
let Markers;
let InfoWindow;
let aMap = null;


let pollutantType={}
@connect(({ loading, newestHome }) => ({
    pollType: newestHome.pollType,
    subjectFontSize: newestHome.subjectFontSize,
    mapStatusData:newestHome.mapStatusData
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
                  if(zoom>=9&&showType==1){          
                      this.setState({showType:2})
                      const { entMarkers } = this.state;
                      this.setState({markersList: [...entMarkers]})
                  }
                  if(zoom>=11&&showType==2){
                    const { entMarkers,entTitleShow } = this.state;
                    if(!entTitleShow){
                      this.setState({entTitleShow:true,markersList:[...entMarkers]})
                    }
                  }
                  if(zoom<9&&showType==2){
                    const { regionMarkers } = this.state;
                    this.setState({showType:1})
                    this.setState({markersList:[...regionMarkers]})
                  }

                  if(zoom<11&&showType==2){
                    const { entMarkers,entTitleShow } = this.state;
                    if(entTitleShow){
                      this.setState({entTitleShow:false,markersList:[...entMarkers]})
                    }
 
                  }
              },
              // complete: () => {
              //}
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
        console.log(MapsOption, marker)
       },
    };
          this.state={
            mapPointLoading:true,
            fullScreen:false,
            showType:1,
            regionMarkers:[],
            entMarkers:[],
            pointMarkers:[],
            entTitleShow:false
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
   
     getMapPointList = (type) => {
         const {dispatch} = this.props
         dispatch({
            type: `${namespace}/GetMapPointList`,
            payload: {pollutantType:pollutantType, pointType: type,},  
            callback:(data)=>{
                if(type==1){
                    this.setState({mapPointLoading:false})
                    this.setState({regionMarkers:data});
                    this.loadRegionMarkerData(data)
                }else if(type==2){
                    this.setState({entMarkers:data})
                }else{
                    this.setState({pointMarkers:data})
                }
            }  
        })
    }
  
    loadRegionMarkerData = (data) =>{ //行政区
    this.setState({
      showType:1,
      markersList:data
    },()=>{
      const timer = setInterval(() => {
        if (aMap) {
          aMap.setFitView();
          clearInterval(timer);
        }
      }, 0);
    })

    }
    loadPointMarkerData = (data) =>{ //监测点
      this.setState({
        showType:3,
        markersList:[...data]
      },()=>{
                const timer = setInterval(() => {
                    if (aMap) {
                      aMap.setFitView();
                      aMap.setZoomAndCenter(aMap.getZoom(), [
                            96.01906121185537,
                            35.874643454131984
                          ]);
                      aMap.setZoom(aMap.getZoom() + 1)
                      clearInterval(timer);
                    }
                  }, 0);
                })

     }     

    operationChange = (text, mapProps) => {
         const map = mapProps.__map__;
         const { showType,regionMarkers,pointMarkers } = this.state;
        if (!map) { console.log('组件必须作为 Map 的子组件使用'); return; }
        switch (text) {
            case '放大':
                map.zoomIn()
                if(map.getZoom()>=9&&showType==1){          
                  this.setState({showType:2})
                  const { entMarkers } = this.state;
                  this.setState({markersList: [...entMarkers]})
              }
              if(map.getZoom()>=11&&showType==2){
                const { entMarkers,entTitleShow } = this.state;
                if(!entTitleShow){
                  this.setState({entTitleShow:true,markersList:[...entMarkers]})
                }
              }
                break;
            case '缩小':
                map.zoomOut()
                if(map.getZoom()<9&&showType==2){
                  const { regionMarkers } = this.state;
                  this.setState({showType:1})
                  this.setState({markersList:[...regionMarkers]})
                }

                if(map.getZoom()<11&&showType==2){
                  const { entMarkers,entTitleShow } = this.state;
                  if(entTitleShow){
                    this.setState({entTitleShow:false,markersList:[...entMarkers]})
                  }

                }
                break;
            case '全屏':
                this.setState({ fullScreen:true  })
                this.props.fullScreenClick(true)
                break;
            case '退出全屏':
                this.setState({ fullScreen:false  })
                this.props.fullScreenClick(false)
                break;
            case '展示企业':
                this.loadRegionMarkerData(regionMarkers)
                // this.setState({showType:1, markersList:[...this.state.regionMarkers]})
                break; 
             case '展示监测点':
                this.loadPointMarkerData(pointMarkers)
             break;               
        }

    }
    regPopovercontent = (extData) =>{
        return <div>
             <div>企业总数：{extData.position&&extData.position.entCount}</div>
             <div><span style={{color:'#FF0000'}}>超标</span>企业总数：{extData.position&&extData.position.OverCount}</div>
            <div><span style={{color:'#FFCC00'}}>异常</span>企业总数：{extData.position&&extData.position.ExceptionCount}</div>
           </div>
   }
     renderRegMarkers = (extData) =>{ //行政区下 企业总数标记点
        const { showType } = this.state;
        return <div style={{position:'relative'}}>    
                <Popover overlayClassName={styles.regPopSty} title={extData.position&&extData.position.regionName} getPopupContainer={trigger => trigger.parentNode} overlayClassName={styles.regPopSty}   visible={showType==1} placement="top" content={this.regPopovercontent(extData)} >
                <img src='/location.png' style={{position:'relative',width:30,height:35}}/>
                </Popover>
               </div>
      }
    renderEntMarkers = (extData) =>{ //企业下  企业标记点
        return <div style={{position:'relative'}}> 
                <img src='/homeMapEnt.png' style={{position:'relative',width:30,height:30}}/>
               </div>
      }
   renderPointMarkers = (extData) =>{ // 监测点 标记点
        return <div style={{position:'relative'}}>   
                <img src='/homeWasteWater.png' style={{position:'relative',width:30,height:30}}/>
               </div>
      }
   renderEntTitleMarkers = (extData) =>{ //企业名称  标记点  显示
    console.log(extData)
    return <div className={styles.entTitlePopSty}> 
              {extData.position.entName}
             </div>
      }

      renderMarkers = (extData) =>{
        const {showType } = this.state;
          if(showType==1){
            return <div style={{position:'relative'}}>    
            <Popover overlayClassName={styles.regPopSty} title={extData.position&&extData.position.regionName} getPopupContainer={trigger => trigger.parentNode} overlayClassName={styles.regPopSty}   visible={showType==1} placement="top" content={this.regPopovercontent(extData)} >
            <img src='/location.png' style={{position:'relative',width:30,height:35}}/>
            </Popover>
           </div>
          }else if(showType==2){
            return <div style={{position:'relative'}}> 
            <img src='/homeMapEnt.png' style={{position:'relative',width:30,height:30}}/>
            {this.state.entTitleShow&&<div  className={styles.entTitlePopSty}> 
                       {extData.position.entName}
                      </div>}
           </div>
          }else{
            return <div style={{position:'relative'}}>   
            <img src='/homeWasteWater.png' style={{position:'relative',width:30,height:30}}/>
            </div>
          }
      }
   mapContent = (props) => {
    const { markersList,mapPointLoading,fullScreen,showType,regionMarkers,entMarkers,pointMarkers,entTitleShow} = this.state;
    const {mapStatusData,subjectFontSize} = this.props;
        const typeBtnArr = [{ text: '超标', color: '#FF0000', val: mapStatusData.overCount }, { text: '异常', color: '#FFCC00', val: mapStatusData.exceptionCount  }, { text: '离线', color: '#67666A', val: mapStatusData.unLineCount },
    { text: '正常', color: '#14ECDF', val: mapStatusData.stopCount }, { text: '停运', color: '#836BFB', val: mapStatusData.stopCount }]

    const operationBtnArr = () =>{
        return [{ text: fullScreen?'退出全屏':'全屏', url: fullScreen? '/homeMapT.png' :'/homeMapQp.png' }, { text: '展示企业', url: '/homeMapQ.png' }, { text: '展示监测点', url: '/homeMapJc.png' },
        { text: '展示名称', url: '/homeMapZ.png' }, { text: '放大', url: '/homeMapJ.png' },
        { text: '缩小', url: '/homeMapS.png' }]
    }
    const RightIconMapComponent = (props) => {
     
        return (<div className={styles.mapOperationBtn}> 
            {operationBtnArr().map((item, index) => {
                return <div style={{ paddingBottom: 10 }} onClick={() => { this.operationChange(item.text, props) }}><img title={item.text} src={item.url} /></div>
            })}
        </div>);

    }
  
       console.log(entTitleShow)
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
                    // render={showType==1?this.renderRegMarkers:showType==2?this.renderEntMarkers:this.renderPointMarkers}
                    events={this.markersEvents}
               />
                {/* {entTitleShow?<Markers 
                    markers={ entMarkers}
                    render={this.renderEntTitleMarkers}
               /> : null} */}
                <div className={styles.mapBtn}> { /**按钮 */}
                    <Row align='middle'>
                        {typeBtnArr.map((item, index) => {
                            return <Row  className={styles.typeBtnSty} align='middle' justify='center'>
                                <div className={styles.colorBlock} style={{ background: `${item.color}` }}></div>
                                <span style={{ fontSize: subjectFontSize }}>{item.text} {item.val}</span>
                            </Row>
                        })}
                    </Row>
                </div>
                <RightIconMapComponent />

                <div className={styles.mapEnt} style={{ marginBottom: fullScreen ? 64 : 0 }}> { /**左下家 图标 */}
                    <div><img src='/homeMapEnt.png' /> <span>企业</span></div>
                    <div style={{ paddingTop: 9 }}><img src='/homeWasteWater.png' /> <span>废水</span></div>
                </div>
            </Map>

    }
    render() {
       const { fullScreen } = this.state;

       const MapContent = this.mapContent
    return (
        <div style={{ height: '100%' }} className={`${fullScreen ? `${styles.mapModal}`: ''}`}>

               <MapContent /> 
        </div>

    )
        }
    }
export default Index;