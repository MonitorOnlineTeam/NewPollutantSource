/**
 * 功能：首页
 * 创建人：贾安波
 * 创建时间：2021.11.03
 */
import React, { useState, useEffect, Fragment, useRef, useMemo, useLayoutEffect } from 'react';
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
import { Map, MouseTool, Marker, Markers, Polygon, Circle,InfoWindow  } from '@/components/ReactAmap';
import styles from "../style.less"

const { Option } = Select;

const namespace = 'newestHome'


let aMap = null;
let aMapMax = null;
let map;
const dvaPropsData = ({ loading, newestHome }) => ({
    pollType: newestHome.pollType,
    subjectFontSize: newestHome.subjectFontSize,
    mapStatusData:newestHome.mapStatusData
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => { //更新参数
            dispatch({
                type: `${namespace}/updateState`,
                payload: { ...payload },
            })
        },
        GetMapPointList: (payload,callback) => { //地图展示监测点
            dispatch({
                type: `${namespace}/GetMapPointList`,
                payload: { ...payload },
                callback:callback
            })
        },
    }
}
// class NewHome extends PureComponent {
//     constructor(props) {
//         super(props);  

//     }

        
const Index = (props) => {


    const { pollType, subjectFontSize, mapStatusData } = props;
    
    useEffect(() => {
        initData()
    }, []);

    const pollutantType = pollType[props.type]
    
    const initData = () => {
        getMapPointList(3)
        getMapPointList(2)
        getMapPointList(1)


    }
    const [ mapPointLoading,setMapPointLoading] = useState(true)

    const [ showType,setShowType] = useState(1) // 1 行政区下企业总数  2 企业 3 监测点
    const [ regionMarkers,setRegionMarkers] = useState([])
    const [ entMarkers,setEntMarkers] = useState([])
    const [ pointMarkers,setPointMarkers] = useState([])
    const getMapPointList = (type) => {
        props.GetMapPointList({
            pollutantType:pollutantType,
            pointType: type,
        },(data)=>{
            if(type==1){
                setMapPointLoading(false)
                setRegionMarkers(data)
                loadRegionMarkerData(data)
            }else if(type==2){
                setEntMarkers(data)
            }else{
                setPointMarkers(data)
            }
        })
    }
  
   const  loadRegionMarkerData = (data) =>{ //行政区
   
    const timer = setInterval(() => {
        if (aMap) {
          aMap.setFitView();
          clearInterval(timer);
        }
      }, 0);
    }
    const  loadEntMarkerData = (data,notFitView) =>{ //企业
        const timer = setInterval(() => {
            if (aMap) {
              !notFitView && aMap.setFitView();
              clearInterval(timer);
            }
          }, 0);
        }
    const  loadPointMarkerData = (data) =>{ //监测点
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

     }     
    const [fullScreen, setFullScreen] = useState(false)
    const operationChange = (text, mapProps) => {
         map = mapProps.__map__;
         aMap = mapProps.__map__;
        if (!map) { console.log('组件必须作为 Map 的子组件使用'); return; }
        switch (text) {
            case '放大':
                map.zoomIn()
            //    if(map.getZoom()>=10&&showType==1){
            //        setShowType(2)
            //    }
                break;
            case '缩小':
                map.zoomOut()
                // if(map.getZoom()<10&&showType==2){
                //     setShowType(1)
                // }
                break;
            case '全屏':
                setFullScreen(true)
                if(showType==1){
                    loadRegionMarkerData(regionMarkers)
                }else if(showType==2){
                    loadEntMarkerData(entMarkers)
                }else{
                    loadPointMarkerData(pointMarkers)
                }
                break;
            case '退出全屏':
                setFullScreen(false)
                loadRegionMarkerData(regionMarkers)
                break;
            case '展示企业':
                setShowType(1)
                // setRegPopoverVisible(true)
                loadRegionMarkerData(regionMarkers)
                break; 
             case '展示监测点':
                setShowType(3)
                loadPointMarkerData(pointMarkers)
             break;               
        }

    }
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
                return <div style={{ paddingBottom: 10 }} onClick={() => { operationChange(item.text, props) }}><img title={item.text} src={item.url} /></div>
            })}
        </div>);

    }

    // const maxAmapEvents = {
    //     created: mapInstance => {
    //         console.log(
    //           '高德地图 Map 实例2创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：',
    //         );
    //         aMapMax = mapInstance;
    //         if (config.offlineMapUrl.domain) {  //在线地图配置
    //           const Layer = new window.AMap.TileLayer({
    //             zIndex: 2,
    //             getTileUrl(x, y, z) {
    //               return `${config.offlineMapUrl.domain}/gaode/${z}/${x}/${y}.png`;
    //             },
    //           });
    //           Layer.setMap(mapInstance);
    //           mapInstance.setFitView();//自动适应显示你想显示的范围区域
    //         }
    //       },
    //     zoomchange: (value) => {
    //         const zoom = aMapMax.
    // getZoom();
    //         console.log(zoom,1111)
    //     },
    // }
    // const useComponentWillMount = func => {
    //     const willMount = useRef(true);
      
    //     if (willMount.current) {
    //       func();
    //     }
      
    //     willMount.current = false;
    //   };
    //   useComponentWillMount(() => console.log("Runs only once before component mounts"));
    const [aa,setAa] = useState(false)
    const amapEvents = () => {
    
      return{ 
        // created: mapInstance => {
        //     console.log(
        //       '高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：',
        //     );
        //     aMap = mapInstance;
        //     if (config.offlineMapUrl.domain) {  //在线地图配置
        //       const Layer = new window.AMap.TileLayer({
        //         zIndex: 2,
        //         getTileUrl(x, y, z) {
        //           return `${config.offlineMapUrl.domain}/gaode/${z}/${x}/${y}.png`;
        //         },
        //       });
        //       Layer.setMap(mapInstance);
        //       mapInstance.setFitView();//自动适应显示你想显示的范围区域
            
        //     }
        //   },
        zoomchange: (value) => {
            const zoom = aMap.getZoom();
            setAa(!aa)
             console.log(zoom)
            if(zoom>=10&&regPopoverVisible){
                console.log(aMap)
                setShowType(2)
                // loadEntMarkerData(entMarkers,true)
            }
        },
        // complete: () => {
        // }
    }
    };
    const regPopovercontent = (extData) =>{
        return <div>
               <div>企业总数：{extData.position&&extData.position.entCount}</div>
               <div><span style={{color:'#FF0000'}}>超标</span>企业总数：{extData.position&&extData.position.OverCount}</div>
               <div><span style={{color:'#FFCC00'}}>异常</span>企业总数：{extData.position&&extData.position.ExceptionCount}</div>
               </div>
    }

    const getRegPopupContainer = (triggerNode) =>{
       return  triggerNode.parentNod
    }

    const [regPopoverVisible,setRegPopoverVisible] = useState(true)
    // const [zoom,setZoom] = useState(11)

    const renderRegMarkers = (extData) =>{ //行政区下 企业总数标记点
        return <div style={{position:'relative'}}>  
              
                <Popover overlayClassName={styles.regPopSty} title={extData.position&&extData.position.regionName} getPopupContainer={trigger => trigger.parentNode} overlayClassName={styles.regPopSty}   visible={regPopoverVisible} placement="top" content={regPopovercontent(extData)} >
                <img src='/location.png' style={{position:'relative',width:30,height:35}}/>
                </Popover>
               </div>
      }
   const renderEntMarkers = (extData) =>{ //企业下  企业标记点
        return <div style={{position:'relative'}}>   
                <img src='/homeMapEnt.png' style={{position:'relative',width:30,height:30}}/>
               </div>
      }
    const renderPointMarkers = (extData) =>{ // 监测点 标记点
        return <div style={{position:'relative'}}>   
                <img src='/homeWasteWater.png' style={{position:'relative',width:30,height:30}}/>
               </div>
      }
    const MapContent = (props) => {
        return mapPointLoading ?
            <PageLoading />
            :
            <Map
                amapkey={config.amapKey}
                // events={props.type=='min'? amapEvents : maxAmapEvents}
                events={amapEvents()}
                mapStyle="amap://styles/darkblue"
                useAMapUI={!config.offlineMapUrl.domain}
                // center={{ longitude:96.01906121185537, latitude: 35.874643454131984 }} //center 地图中心点坐标值
            >

                <Markers 
                    markers={ showType==1?regionMarkers:showType==2?entMarkers:pointMarkers}
                    render={showType==1?renderRegMarkers:showType==2?renderEntMarkers:renderPointMarkers}
                />
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
    console.log(aa)
    return (
        <div style={{ height: '100%' }}>

            <MapContent/>
              {/* {fullScreen&&<div className={`${styles.mapModal} ${fullScreen ? styles.mapModalShow : styles.mapModalHide}`}>
                <MapContent/>
            </div>} */}
        </div>

    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);