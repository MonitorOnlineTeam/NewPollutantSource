/**
 * 功能：首页
 * 创建人：贾安波
 * 创建时间：2021.11.03
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
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
import { Map, MouseTool, Marker, Markers, Polygon, Circle } from '@/components/ReactAmap';
import styles from "../style.less"

const { Option } = Select;

const namespace = 'newestHome'


let _thismap;

const dvaPropsData = ({ loading, newestHome }) => ({
    mapPointLoading: loading.effects[`${namespace}/GetMapPointList`],
    mapPointList: newestHome.mapPointList,
    pollType: newestHome.pollType,
    subjectFontSize: newestHome.subjectFontSize,
    regionMarkers:newestHome.regionMarkers
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => { //更新参数
            dispatch({
                type: `${namespace}/updateState`,
                payload: { ...payload },
            })
        },
        GetMapPointList: (payload) => { //地图监测点
            dispatch({
                type: `${namespace}/GetMapPointList`,
                payload: { ...payload },
            })
        },
    }
}
const Index = (props) => {


    const { pollType, subjectFontSize, mapPointLoading, mapPointList,regionMarkers } = props;

    useEffect(() => {
        initData()
    }, []);

    const pollutantType = pollType[props.type]

    const initData = () => {
        getMapPointList()
    }



    const getMapPointList = () => {
        props.GetMapPointList({
            pointType: pollutantType,
        })
    }

    const [fullScreen, setFullScreen] = useState(false)
    const operationChange = (text, mapProps) => {
        const map = mapProps.__map__;
        if (!map) { console.log('组件必须作为 Map 的子组件使用'); return; }
        switch (text) {
            case '放大':
                map.zoomIn()
                break;
            case '缩小':
                map.zoomOut()
                break;
            case '全屏':
                setFullScreen(true)
                break;
            case '退出全屏':
                setFullScreen(false)
                break;
            case '展示企业':
                setRegPopoverVisible(true)
                break;
            case '隐藏企业':
                setRegPopoverVisible(false)
             break;                
        }

    }

    const typeBtnArr = [{ text: '超标', color: '#FF0000', val: 20 }, { text: '异常', color: '#FFCC00', val: 20 }, { text: '离线', color: '#67666A', val: 990 },
    { text: '正常', color: '#14ECDF', val: 20 }, { text: '停运', color: '#836BFB', val: 20 }]

    const operationBtnArr = () =>{
        return [{ text: fullScreen?'退出全屏':'全屏', url: fullScreen? '/homeMapT.png' :'/homeMapQp.png' }, { text: regPopoverVisible?'隐藏企业':'展示企业', url: '/homeMapQ.png' }, { text: '监测点', url: '/homeMapJc.png' },
        { text: '展示名称', url: '/homeMapZ.png' }, { text: '放大', url: '/homeMapJ.png' },
        { text: '缩小', url: '/homeMapS.png' }]
    }
    const RightIconMapComponent = (props) => {
        { /**右侧图标 */ }
        return (<div className={styles.mapOperationBtn}>
            {operationBtnArr().map((item, index) => {
                return <div style={{ paddingBottom: 10 }} onClick={() => { operationChange(item.text, props) }}><img title={item.text} src={item.url} /></div>
            })}
        </div>);

    }

    const amapEvents  = {
        // zoomchange: (value) => {
        // },
        // complete: () => {
        // }
    };

    const regPopovercontent = (extData) =>{
        return <div>
               <div>企业总数：{extData.position&&extData.position.entCount}</div>
               <div><span style={{color:'#FF0000'}}>超标</span>企业总数：{extData.position&&extData.position.OverCount.length}</div>
               <div><span style={{color:'#FFCC00'}}>异常</span>企业总数：{extData.position&&extData.position.OverCount.length}</div>
               </div>
    }

    const getRegPopupContainer = (triggerNode) =>{
       return  triggerNode.parentNod
    }

    const [regPopoverVisible,setRegPopoverVisible] = useState(false)
    const renderRegionMarkers = (extData) =>{
        return <div style={{position:'relative'}}>   
                <Popover overlayClassName={styles.regPopSty} title={extData.position&&extData.position.regionName} getPopupContainer={trigger => trigger.parentNode} overlayClassName={styles.regPopSty}   visible={regPopoverVisible} placement="top" content={regPopovercontent(extData)} >
                <img src='/location.png' style={{position:'relative',width:30,height:35}}/>
                </Popover>
               </div>
      }
    const MapContent = () => {
        return mapPointLoading ?
            <PageLoading />
            :
            <Map
                amapkey={config.amapKey}
                events={amapEvents}
                mapStyle="amap://styles/darkblue"
                useAMapUI={!config.offlineMapUrl.domain}
                // center={{ longitude: entAbnormalList.longitude, latitude: entAbnormalList.latitude }} //center 地图中心点坐标值
                zoom={11}
            >

                <Markers 
                    markers={regionMarkers}
                    render={renderRegionMarkers}
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

    return (
        <div style={{ height: '100%' }}>

            <MapContent />
            <div className={`${styles.mapModal} ${fullScreen ? styles.mapModalShow : styles.mapModalHide}`}>
                <MapContent />
            </div>
        </div>

    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);