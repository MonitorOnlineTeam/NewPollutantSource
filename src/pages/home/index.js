/*
 * @Author: Jiaqi
 * @Date: 2019-10-10 10:27:00
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2021-07-05 10:06:31
 * @desc: 首页
 */
import React, { Component } from 'react';
import {
  Spin,
  Radio,
  Button,
  Modal,
  Row,
  Col,
  Switch,
} from 'antd';
import Cookie from 'js-cookie';
import {
  connect
} from 'dva';
import CustomIcon from '@/components/CustomIcon';
import LiveVideo from "@/components/YSYVideo-React/Live"

// import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
// import { Map, Polygon, Markers, InfoWindow } from '@/components/ReactAmap';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';
// import { getPointStatusImg } from '@/utils/getStatusImg';
import styles from './index.less';
import { router } from 'umi';
import Link from 'umi/link';
import EntWorkOrderStatistics from '@/pages/IntelligentAnalysis/operationWorkStatis/entWorkOrderStatistics/components/EntWorkOrderStatistics'

import config from "@/config";
import HomeCommon from '@/components/home/HomeCommon';

const RadioButton = Radio.Button;
const { RunningRate, TransmissionEffectiveRate, amapKey } = config;
let _thismap;
let Map, Marker, Polygon, Markers, InfoWindow;


@connect(({ loading, home, global }) => ({
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
  homePage: home.homePage,
  theme: home.theme,
  configInfo: global.configInfo,
}))
class index extends Component {
  constructor(props) {
    super(props);
    document.documentElement.className = props.theme === 'dark' ? 'home-dark-theme' : "home-light-theme";
    this.state = {
      screenWidth: window.screen.width === 1600 ? 50 : 70,
      currentMonth: moment().format('MM') * 1,
      position: [
        0, 0
      ],
      // zoom: window.innerWidth > 1600 ? 13 : 12,
      zoom: 6,
      mapCenter: [105.121964, 33.186871],
      visible: false,
      pointName: null,
      radioDefaultValue: "",
      infoWindowVisible: false,
      showType: "ent",
      entCode: null,
      DGIMN: null,

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
    // 获取企业及排口信息
    dispatch({
      type: "home/getAllEntAndPoint",
    })
    // 获取污染物类型
    dispatch({
      type: "home/getPollutantTypeList",
      payload: {
      },
    });

    this.setState({
      did: true,
    })

    window._AMapSecurityConfig = {
      securityJsCode: 'c960e3ce0a08f155f22e676a378fc03e',
    }
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
      res.push(<RadioButton key="-1" value="" style={{ top: -1 }}>全部</RadioButton>);
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

  getPollutantIcon = (pollutantType, status) => {
    const mapStyle = {
      fontSize: 24,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0px 0px 3px 2px #fff',
    }
    const style = { fontSize: 24, color: this.getColor(status), ...mapStyle }
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
    switch (pollutantType) {
      // case '1':
      //   // return <WaterIcon style={style} />
      //   return this.getWaterIcon(extData.position.Status)
      // case '2':
      //   return this.getGasIcon(extData.position.Status)
      case '10':
        return <VocIcon style={style} />
      case '6':
        return <a><CustomIcon type="icon-richangshenghuo-shuizhan" style={{ ...style }} /></a>
      case '9':
        return <a><CustomIcon type="icon-echoujiance" style={{ ...style }} /></a>
      case '12':
        return <CustomIcon type="icon-yangchen1" style={{ ...style }} />
      case '5':
        return <a><CustomIcon type="icon-fangwu" style={style} /></a>
      case '37':
        return <CustomIcon type="icon-dian2" style={{ ...style }} />
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
    console.log('theme=', this.props.theme)
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
      homePage,
      configInfo,
      theme,
    } = this.props;
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
    return (
      <div className={styles.homeWrapper} style={{ width: '100%', height: 'calc(100vh)' }}>
        {/* {
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
        } */}
        {/* {
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
        } */}
        <header className={styles.homeHeader}>
          <p><span>SDL</span> {configInfo.SystemName}</p>
          <a className={styles.backMenu} onClick={() => {
            router.push(Cookie.get("systemNavigateUrl"))
          }}>系统功能</a>
        </header>
        <Row gutter={[8, 8]} style={{ padding: '0 8px' }} className={styles.contentWrapper}>
          {/* <Col flex='3 1'> */}
          <Col style={{ width: '27%' }}>
            <div className={styles.leftWrapper}>
              {/* 运行分析  || 智能质控*/}
              <div style={{ display: `${homePage ? homePage.split(',')[0] : ''}` }} className={`${styles.effectiveRate} ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} onRef={this.onRef1}
                  assembly={homePage ? homePage.split(',')[0] : "OperationAnalysis"} />
              </div>
              {/* 运维统计 */}
              <div style={{ display: `${homePage ? homePage.split(',')[1] : ''}` }} className={`${styles.operationsWrapper}  ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[1] : "OperationStatistics"} />
              </div>
              {/* 超标异常 */}
              <div style={{ display: `${homePage ? homePage.split(',')[2] : ''}` }} className={`${styles.excessiveAbnormalWrapper}  ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[2] : "AlarmMessage"} />
              </div>
            </div>
          </Col>
          {/* <Col flex='5.5 1' className={styles.centerWrapper}> */}
          <Col flex='1' className={styles.centerWrapper}>
            <div className={`${styles.mapBox}`}>
              <i className={styles.lb}></i>
              <i className={styles.rb}></i>
              <Switch checked={theme === 'dark' ? true : false} style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} checkedChildren="深色" unCheckedChildren="浅色" onChange={(value, e) => {
                console.log('value=', value)
                this.props.dispatch({
                  type: 'home/updateState',
                  payload: {
                    theme: value ? 'dark' : 'light',
                  }
                })
                // let themeLink = document.getElementById('theme-link');
                if (value) {
                  document.documentElement.className = 'home-dark-theme';
                  document.documentElement.id = 'innerSystem';
                  // themeLink.href = '/theme/light.css'; // 切换 antd 组件主题(亮色)
                } else {
                  document.documentElement.className = 'home-light-theme';
                  document.documentElement.id = '';
                  // themeLink.href = '/theme/dark.css'; // 切换 antd 组件主题(暗色)
                }
              }} />
              <Map
                resizeEnable={true}
                events={this.mapEvents}
                zoom={5}
                mapStyle={theme === 'dark' ? "amap://styles/32ae1bcea26191a8dd684f71c172af1f" : "amap://styles/normal"}
                amapkey={'5e60171b820065e7e9a1d6ea45abaee9'}
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
            </div>
            <Row gutter={[8, 0]} className={styles.videoBox}>
              <Col span={12} style={{ height: '100%' }}>
                <div className={styles.box}>
                  <i className={styles.lb}></i>
                  <i className={styles.rb}></i>
                  <div className={styles.title} style={{ marginBottom: 12 }}>
                    <p>视频监控</p>
                  </div>
                  <div className={styles.videoContainer}>
                    <LiveVideo channelNo={'E36486991'} HD={1} template="simple" />
                  </div>
                </div>
              </Col>
              <Col span={12} style={{ height: '100%' }}>
                <div className={styles.box}>
                  <i className={styles.lb}></i>
                  <i className={styles.rb}></i>
                  <div className={styles.title} style={{ marginBottom: 12 }}>
                    <p>视频监控</p>
                  </div>
                  <div className={styles.videoContainer}>
                    <div className={styles.notData}>
                      <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
                      <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          {/* <Col flex='3 1'> */}
          <Col style={{ width: '27%' }}>
            <div className={styles.rightWrapper}>
              {/* 智能监控 */}
              <div style={{ display: `${homePage ? homePage.split(',')[3] : ''}` }} className={`${styles.monitoringContent}  ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[3] : "MonitoringStatus"} />
              </div>
              {/* 企业排放量 */}
              <div style={{ display: `${homePage ? homePage.split(',')[4] : ''}` }} className={`${styles.emissionsContent}  ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[4] : "EmissionsAnalysis"} />
              </div>
              {/* 排污税 */}
              <div style={{ display: `${homePage ? homePage.split(',')[5] : ''}` }} className={`${styles.effluentFeeContent}  ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[5] : "EmissionTax"} />
              </div>
            </div>
          </Col>
        </Row>

      </div>
    );
  }
}
export default index;
