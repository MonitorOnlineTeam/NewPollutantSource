/*
 * @Author: Jiaqi
 * @Date: 2019-10-10 10:27:00
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-06-02 13:53:19
 * @desc: 首页
 */
import React, { Component } from 'react';
import {
  Spin,
  Radio,
  Button,
} from 'antd';
import ReactEcharts from 'echarts-for-react';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import {
  connect
} from 'dva';
// import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
// import { Map, Polygon, Markers, InfoWindow } from '@/components/ReactAmap';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';
// import { getPointStatusImg } from '@/utils/getStatusImg';
import { onlyOneEnt } from '@/config';
import styles from './index.less';
import { router } from 'umi';
import Link from 'umi/link';


import config from "@/config";
import HomeCommon from './components/HomeCommon';

const RadioButton = Radio.Button;
const { RunningRate, TransmissionEffectiveRate, amapKey } = config;
let _thismap;
let Map, Marker, Polygon, Markers, InfoWindow;


@connect(({ loading, home }) => ({
  allEntAndPointLoading: loading.effects['home/getAllEntAndPoint'],
  alarmAnalysisLoading: loading.effects['home/getAlarmAnalysis'],
  allMonthEmissionsByPollutantLoading: loading.effects['home/getAllMonthEmissionsByPollutant'],
  rateStatisticsByEntLoading: loading.effects['home/getRateStatisticsByEnt'],
  statisticsPointStatusLoading: loading.effects['home/getStatisticsPointStatus'],
  warningInfoLoading: loading.effects['home/getWarningInfo'],
  taskCountLoading: loading.effects['home/getTaskCount'],
  exceptionProcessingLoading: loading.effects['home/getExceptionProcessing'],
  loading: loading.effects['home/getHomePage'],
  pollutantTypeList: home.pollutantTypeList,
  currentEntInfo: home.currentEntInfo,
  currentMarkersList: home.currentMarkersList,
  allEntAndPointList: home.allEntAndPointList,
  mounthOverData: home.mounthOverData,
  homePage: home.homePage
}))
class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: window.screen.width === 1600 ? 50 : 70,
      currentMonth: moment().format('MM') * 1,
      position: [
        0, 0
      ],
      // zoom: window.innerWidth > 1600 ? 13 : 12,
      zoom: 5,
      mapCenter: [105.121964, 33.186871],
      visible: false,
      pointName: null,
      radioDefaultValue: "",
      infoWindowVisible: false,
      showType: "ent",
      entCode: null,
      DGIMN: null,
      pollutantType:'all'

    };
    this.mapEvents = {
      created(m) {
        _thismap = m;
        if (m) {
          m.setFitView();
          if (config.offlineMapUrl.domain) {
            var Layer = new window.AMap.TileLayer({
              zIndex: 2,
              getTileUrl: function (x, y, z) {
                return config.offlineMapUrl.domain + '/gaode/' + z + '/' + x + '/' + y + '.png';
              }
            });
            Layer.setMap(m);
          }
        }

      },
      zoomchange: (value) => {
        if (_thismap.getZoom() <= this.state.zoom) {
          props.dispatch({
            type: "home/updateState",
            payload: {
              // currentEntInfo: {},
              currentMarkersList: this.props.allEntAndPointList
            }
          })
          if (this.state.showType === "point") {
            props.dispatch({
              type: "home/updateState",
              payload: {
                currentEntInfo: {},
              }
            })
            this.setState({
              currentPoint: undefined,
              DGIMN: null
            })
          }
          this.setState({ showType: "ent" })
        } else {
          this.setState({ showType: "point" })
        }
      },
      complete: () => {
        //_thismap.setZoomAndCenter(13, [centerlongitude, centerlatitude]);
      }
    };
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getHomePage',
      payload: {}
    })
    if (config.offlineMapUrl.domain) {
      let amap = require('@/components/ReactAmap');
      // Map, Marker, Polygon, Markers, InfoWindow;
      Map = amap.Map
      Marker = amap.Marker
      Polygon = amap.Polygon
      Markers = amap.Markers
      InfoWindow = amap.InfoWindow
    } else {
      let amap = require('react-amap');
      // Map, Marker, Polygon, Markers, InfoWindow;
      Map = amap.Map
      Marker = amap.Marker
      Polygon = amap.Polygon
      Markers = amap.Markers
      InfoWindow = amap.InfoWindow
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取所有企业及排口信息
    dispatch({
      type: "home/getAllEntAndPoint",
    })
    // 获取污染物类型
    dispatch({
      type: "home/getPollutantTypeList",
      payload: {
        pollutantCodes: "1,2",
      },
    });

   // 获取单个企业及排口信息
    // dispatch({
    //       type: "home/getEntOrPointInfo",
    //       payload: {
    //         EntCode: sessionStorage.getItem('oneEntCode'),
    //       },
    //  })
    
    this.setState({
      did: true,
      entCode: sessionStorage.getItem('oneEntCode')
    })
  }



  componentWillReceiveProps(nextProps) {
    if (this.props.allEntAndPointList !== nextProps.allEntAndPointList) {
      const timer = setInterval(() => {
        if (_thismap) {
          _thismap.setFitView();
          this.setState({
            zoom: _thismap.getZoom()
          })
          clearInterval(timer)
        }
      }, 200);
    }

    if (this.props.currentEntInfo !== nextProps.currentEntInfo) {
      this.setState({
        entCode: nextProps.currentEntInfo.key
      })
      if (nextProps.currentEntInfo.Longitude && nextProps.currentEntInfo.Latitude) {
        this.setState({
          mapCenter: [nextProps.currentEntInfo.Longitude, nextProps.currentEntInfo.Latitude],
        })
        const timer = setInterval(() => {
          if (_thismap) {
            _thismap.setFitView();
            clearInterval(timer)
          }
        }, 200);
      }
    }
    if (this.props.currentMarkersList !== nextProps.currentMarkersList) {
      const currentMarkersList = nextProps.currentMarkersList.map(item => {
        return {
          position: {
            ...item,
            longitude: item.Longitude,
            latitude: item.Latitude,
          }
        }
      })
      this.setState({
        currentMarkersList
      }, () => {
        const timer = setInterval(() => {
          if (_thismap) {
            _thismap.setFitView();
            clearInterval(timer)
          }
        }, 200);
      })
    }
  }

  // 污染物选择
  onRadioChange = (e) => {
    if (this.props.currentEntInfo.children && this.state.showType === "point") {
      const val = e.target.value;
      const filterData = val ? this.props.currentEntInfo.children.filter(item => item.PollutantType == e.target.value) : this.props.currentEntInfo.children;
      this.props.dispatch({
        type: "home/updateState",
        payload: {
          currentMarkersList: filterData
        }
      })
      this.setState({pollutantType:val?val:'all'})

    }
  }

  /**地图 */
  getpolygon = (polygonChange) => {
    let res = [];
    if (this.props.currentEntInfo.CoordinateSet) {
      let arr = eval(this.props.currentEntInfo.CoordinateSet);
      for (let i = 0; i < arr.length; i++) {
        res.push(<Polygon
          key={
            i
          }
          style={
            {
              strokeColor: '#FF33FF',
              strokeOpacity: 0.2,
              strokeWeight: 3,
              fillColor: '#1791fc',
              fillOpacity: 0.1,
            }
          }
          path={
            arr[i]
          }
        />);
      }
    }
    return res;
  }

  //地图点位点击
  markersEvents = {
    click: (MapsOption, marker) => {
      const itemData = marker.getExtData();
      this.markersCilck(itemData);
    }
  };

  // 点位点击事件
  markersCilck = (itemData) => {
    this.setState({
      did: false,
    })
    if (itemData.position.IsEnt === 1) {
      // 企业
      this.props.dispatch({
        type: "home/updateState",
        payload: {
          currentEntInfo: itemData.position,
          currentMarkersList: itemData.position.children,
        }
      })
    } else {
      this.setState({
        currentPoint: itemData.position,
        DGIMN: itemData.position.key
      })
    }
  }

  /**渲染污染物列表 */
  renderPollutantTypelist = () => {
    const { pollutantTypeList } = this.props;
    let res = [];
    if (pollutantTypeList) {
      res.push(<RadioButton key="-1" value="">全部</RadioButton>);
      pollutantTypeList.map((item, key) => {
        let type = "";
        if (item.pollutantTypeCode == 2) { type = "△" }  // 废气
        if (item.pollutantTypeCode == 1) { type = "○" }  // 废水
        if (item.pollutantTypeCode == 10) { type = "☆" }  // 厂界voc
        if (item.pollutantTypeCode == 12) { type = "□" }  // 厂界扬尘
        res.push(<RadioButton key={item.pollutantTypeCode} value={item.pollutantTypeCode}>{item.pollutantTypeName}</RadioButton>)
      })
    }
    return res;
  }
  renderStatueTypelist=(type)=>{

    let res=[];
    const statusData = [0,1,2,3];
    const statusValue = {
       0:'离线',
       1:'正常',
       2:'超标',
       3:'异常'
    }
    if(type==1 || type == 2 ){
      statusData.map((item,index)=>{
      res.push(<RadioButton key={index} value={item}>{this.getPollutantIcon(type,item)}{<span style={{paddingLeft:10}}>{statusValue[item]}</span>}</RadioButton>)
      })
    }
    // else if(type=='all'){
    //   statusData.map((item,index)=>{
    //     res.push(<>
    //     <RadioButton key={index + 1} value={item}>{this.getPollutantIcon(1,item)}</RadioButton>
    //     <RadioButton key={index + 2} value={item}>{this.getPollutantIcon(2,item)}</RadioButton>
    //     </>)
    //   })
    // }


    

    return res;

  }
  /**
   * 渲染点
   */
  renderMarkers = (extData) => {
    return <div
      onMouseEnter={() => {
        if (this.state.infoWindowVisible === false) {
          this.setState({
            hoverMapCenter: extData.position,
            currentTitle: extData.position.title,
            infoWindowHoverVisible: true,
          })
        }
      }}
      onMouseLeave={() => {
        if (this.state.infoWindowVisible === false) {
          this.setState({
            infoWindowHoverVisible: false,
          })
        }
      }}>
      {
        extData.position.IsEnt === 1 ? <EntIcon style={{ fontSize: 26 }} /> : this.getPollutantIcon(extData.position.PollutantType, extData.position.Status)
      }
    </div>
  }

  getPollutantIcon = (pollutantType, status) => {
    let icon = "";
    if (pollutantType == 1) {
      // 废水
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
    }
    if (pollutantType == 2) {
      // 气
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
    }
    return icon;
  }

  onRef1 = (ref) => {
    this.children = ref;
  }
  //左边模块加载
  leftLoading = () => {
    // this.children.
  }

  //右边模块加载
  rightLoading = () => {
    //   this.
  }
  render() {
    const {
      pointName,
      position,
      visible,
      currentMonth,
      currentMarkersList,
      mapCenter,
      did,
      showType,
      currentPoint,
      DGIMN,
      entCode
    } = this.state;
    const {
      currentEntInfo,
      allEntAndPointLoading,
      alarmAnalysisLoading,
      allMonthEmissionsByPollutantLoading,
      rateStatisticsByEntLoading,
      statisticsPointStatusLoading,
      warningInfoLoading,
      taskCountLoading,
      exceptionProcessingLoading,
      mounthOverData,
      homePage
    } = this.props;

    const { pollutantType } = this.state;
    let pointposition = position;
    let pointvisible = visible;
    let polygonChange;
    const ele = document.querySelector(".antd-pro-pages-home-index-excessiveAbnormalWrapper");
    let height = 0;
    if (ele) {
      height = ele.offsetHeight - 30;
    }
    if (homePage == "1") {
      return <Spin
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0)",
          zIndex: 999,
        }}
        size="large"
      />
    }

    const isLeftLoading = allEntAndPointLoading || rateStatisticsByEntLoading || taskCountLoading || exceptionProcessingLoading || alarmAnalysisLoading || warningInfoLoading;
    const isRightLoading = allEntAndPointLoading || allMonthEmissionsByPollutantLoading || statisticsPointStatusLoading;
    const entName = sessionStorage.getItem('oneEntName')

    return (
      <div className={styles.homeWrapper} style={{ width:  "calc(100% + 48px)", height: 'calc(100vh)' }}>
        {
          isLeftLoading && <Spin
            style={{
              position: "absolute",
              width: "410px",
              height: "100%",
              top: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.4)",
              zIndex: 999,
            }}
            size="large"
          />
        }
        {
          isRightLoading && <Spin
            style={{
              position: "absolute",
              width: "410px",
              height: "100%",
              top: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.4)",
              zIndex: 999,
            }}
            size="large"
          />
        }
        {
          allEntAndPointLoading && <Spin
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0)",
              zIndex: 999,
            }}
            size="large"
          />
        }
        {/* <header className={styles.homeHeader}>
          <p><span className='textOverflow' style={{width:'400px'}} title={entName}>{entName}</span></p>
          <a className={styles.backMenu} onClick={() => {
            history.go(-1)
          }}>返回</a> 
        </header> */}
        <Map
          resizeEnable={true}
          events={this.mapEvents}
          mapStyle="amap://styles/normal"
          amapkey={amapKey}
          center={mapCenter}
        >
          <InfoWindow
            position={this.state.hoverMapCenter}
            isCustom
            showShadow
            autoMove
            visible={this.state.infoWindowHoverVisible}
            offset={[4, -35]}
          >{this.state.currentTitle}</InfoWindow>
          <div className={styles.leftWrapper}>
            {/* 运行分析  || 智能质控*/}
            <div style={{ display: `${homePage ? homePage.split(',')[0] : ''}` }} className={styles.effectiveRate}>
              <HomeCommon DGIMN={DGIMN} entCode={entCode} onRef={this.onRef1}
                assembly={homePage ? homePage.split(',')[0] : "OperationAnalysis"} />
            </div>
            {/* 运维统计 */}
            {/* <div style={{ display: `${homePage ? homePage.split(',')[1] : ''}` }} className={styles.operationsWrapper}>
              <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[1] : "OperationStatistics"} />
            </div> */}
              {/* 公司属性 */}
              <div  className={styles.operationsWrapper}>
              <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={"EntAttributes"} />
            </div>
            {/* 超标异常 */}
            <div style={{ display: `${homePage ? homePage.split(',')[2] : ''}` }} className={styles.excessiveAbnormalWrapper}>
              <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[2] : "AlarmMessage"} />
            </div>
          </div>
          <div className={styles.rightWrapper}>
            {/* 智能监控 */}
            <div style={{ display: `${homePage ? homePage.split(',')[3] : ''}` }} className={styles.monitoringContent}>
              <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[3] : "MonitoringStatus"} />
            </div>
            {/* 企业排放量 */}
            <div style={{ display: `${homePage ? homePage.split(',')[4] : ''}` }} className={styles.emissionsContent}>
              <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[4] : "EmissionsAnalysis"} />
            </div>
            {/* 排污税 */}
            {/* <div style={{ display: `${homePage ? homePage.split(',')[5] : ''}` }} className={styles.effluentFeeContent}>
              <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[5] : "EmissionTax"} />
            </div> */}
             {/* 当月超标报警统计 */}
             <div  className={styles.emissionsContent} className={styles.effluentFeeContent}>
              <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={"AlarmTotal"} />
            </div>
          </div>
          <div className={styles.currentInfoWrapper}>
            {
              // currentEntInfo.title && <div>
              //   <span>企业</span> <br />
              //   <span style={{color:'red'}}>{currentEntInfo.title}</span>
              // </div>
            }
            {
              currentPoint && currentPoint.title && <div>
                <span>排口</span> <br />
                <span>{currentPoint.title}</span>
              </div>
            }
          </div>
          {/**中间污染物类型*/}
          {
            currentEntInfo.children && showType === "point" && <div
              style={{
                position: 'absolute',
                top: '2%',
                left: 430,
                zIndex: 100
              }}
            >
              <Radio.Group style={{}} defaultValue={this.state.radioDefaultValue} buttonStyle="solid" size="default" onChange={this.onRadioChange}>
                {this.renderPollutantTypelist()}
              </Radio.Group>
            </div>
          }
        {
           pollutantType&&currentEntInfo.children && showType === "point" && <div
              style={{
                position: 'absolute',
                top: '2%',
                left: 650,
                zIndex: 100
              }}
            >
              <Radio.Group className='statueType' style={{}}  buttonStyle="solid" size="default" disabled> 
                {this.renderStatueTypelist(pollutantType)}
              </Radio.Group>
            </div>
          }
          {
            mounthOverData.length ? <div className={styles.overproofWrapper}>
              <div className={styles.title}>{currentMonth}月超标汇总</div>
              <div className={styles.content}>
                <ul className={styles.colum}>
                  <li>污染物</li>
                  <li>超标次数</li>
                  <li>超标倍数</li>
                </ul>
                {
                  mounthOverData.map(item => {
                    if (item) {
                      return <ul>
                        <li>{item.pollutantName}</li>
                        <li>{item.OverCount}</li>
                        <li>{item.OverMultiple}</li>
                      </ul>
                    }
                  })
                }
              </div>
            </div> : null
          }

           <Markers
            markers={currentMarkersList}
            events={this.markersEvents}
            className={this.state.special}
            render={this.renderMarkers}
          /> 
          {
            this.getpolygon(polygonChange)
          }
          <InfoWindow
            position={pointposition}
            visible={this.state.visible}
            isCustom={true}
            offset={[0, -25]}
          >
            {pointName}
          </InfoWindow>
        </Map>
      </div >
    );
  }
}
export default index;
