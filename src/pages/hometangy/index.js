/*
 * @Author: cg
 * @Date: 20123-5-15 15:27:00
 * @Last Modified by: cg
 * @Last Modified time: 20123-5-15 15:27:00
 * @desc: 唐银首页
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
// import LiveVideo from "@/components/Video/YSY/Live"

// import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
// import { Map, Polygon, Markers, InfoWindow } from '@/components/ReactAmap';
import moment from 'moment';
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';
// import { getPointStatusImg } from '@/utils/getStatusImg';
import styles from './index.less';
import { router } from 'umi';
import LiveVideo from '@/components/Video/LiveVideo'
import config from "@/config";
import HomeCommon from './components/HomeCommon';

const RadioButton = Radio.Button;
const { RunningRate, TransmissionEffectiveRate, amapKey } = config;
let _thismap;
let Map, Marker, Polygon, Markers, InfoWindow;


@connect(({ loading, home, global, hometangy }) => ({
  allEntAndPointLoading: loading.effects['hometangy/getAllEntAndPoint'],
  alarmAnalysisLoading: loading.effects['hometangy/getAlarmAnalysis'],
  allMonthEmissionsByPollutantLoading: loading.effects['hometangy/getAllMonthEmissionsByPollutant'],
  rateStatisticsByEntLoading: loading.effects['hometangy/getRateStatisticsByEnt'],
  statisticsPointStatusLoading: loading.effects['hometangy/getStatisticsPointStatus'],
  warningInfoLoading: loading.effects['hometangy/getWarningInfo'],
  taskCountLoading: loading.effects['hometangy/getTaskCount'],
  exceptionProcessingLoading: loading.effects['hometangy/getExceptionProcessing'],
  loading: loading.effects['hometangy/getHomePage'],
  pollutantTypeList: home.pollutantTypeList,
  currentEntInfo: home.currentEntInfo,
  currentMarkersList: hometangy.filterMappoints,
  allEntAndPointList: home.allEntAndPointList,
  mounthOverData: home.mounthOverData,
  homeVideoList: home.homeVideoList,
  homePage: home.homePage,
  theme: home.theme,
  configInfo: global.configInfo,
  mappoints: hometangy.mappoints,
  maplegends: hometangy.maplegends
}))
class index extends Component {
  constructor(props) {
    super(props);
    // document.documentElement.className = props.theme === 'dark' ? 'home-dark-theme' : "home-light-theme";
    this.state = {
      screenWidth: window.screen.width === 1600 ? 50 : 70,
      currentMonth: moment().format('MM') * 1,
      position: [
        0, 0
      ],
      // zoom: window.innerWidth > 1600 ? 13 : 12,
      zoom: 16,
      mapCenter: [118.43, 39.165],
      visible: false,
      pointName: null,
      radioDefaultValue: "a34001,zsa34013",
      infoWindowVisible: false,
      showType: "ent",
      entCode: null,
      DGIMN: null,

    };
    this.mapEvents = {
      created(m) {
        _thismap = m;
        if (m) {
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
      complete: () => {
      }
    };
  }
  componentWillMount() {
    const { dispatch } = this.props;
    if (config.offlineMapUrl.domain) {
      let amap = require('@/components/ReactAmap');
      Map = amap.Map
      Marker = amap.Marker
      Polygon = amap.Polygon
      Markers = amap.Markers
      InfoWindow = amap.InfoWindow
    } else {
      let amap = require('react-amap');
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
      type: "hometangy/getDataForSingleEnt",
      payload: {
        Status: [0, 1, 2, 3],
        PollutantTypes: "2,5,12,1",
        entcode: 'd7891158-f43e-43b5-805c-ad11db586f6f',
        monitorPollutantCodes: 'zsa21026,zsa21002,a34001,zsa34013,zsa21005',   //所有监测因子
      }
    })
    // 获取污染物类型
    dispatch({
      type: "hometangy/getlegends",
      payload: {
      },
    });
    this.setState({
      did: true,
    })

    window._AMapSecurityConfig = {
      securityJsCode: '51afb7a5dace5973705b69371cedcaca',
    }
  }

  componentWillReceiveProps(nextProps) {
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
            clearInterval(timer)
          }
        }, 200);
      })
    }
  }

  // 污染物选择
  onRadioChange = (e) => {
    const val = e.target.value;
    this.props.dispatch({
      type: "hometangy/updateFilterMappoints",
      payload: {
        PollutantCode: val,
        
        Status: [0, 1, 2, 3],
        PollutantTypes: "2,5,12,1",
        entcode: 'd7891158-f43e-43b5-805c-ad11db586f6f'
      }
    })
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
        type: "hometangy/updateState",
        payload: {
          currentEntInfo: itemData.position,
          currentMarkersList: itemData.position.children,
        }
      })
      this.setState({
        showType: 'point'
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
    const { maplegends } = this.props;
    let res = [];
    if (maplegends) {
      // res.push(<RadioButton defaultChecked='true' key="-1" value="-1" style={{ top: -1 }}>全部</RadioButton>);
      res.push(<RadioButton key={maplegends.TSP} value={maplegends.TSP}>TSP</RadioButton>)
      res.push(<RadioButton key={maplegends['SO₂']} value={maplegends['SO₂']}>SO₂</RadioButton>)
      res.push(<RadioButton key={maplegends.NOx} value={maplegends.NOx}>NOx</RadioButton>)
      res.push(<RadioButton key={maplegends.CO} value={maplegends.CO}>CO</RadioButton>)
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
        extData.position.IsEnt === 1 ? <EntIcon style={{ fontSize: 26 }} /> : this.getPollutantIcon(extData.position.PollutantType, extData.position.Status, extData.position.MonitorPollutantInfors)
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

  getPollutantIcon = (pollutantType, status, MonitorPollutantInfors) => {
    const mapStyle = {
      fontSize: 24,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0px 0px 3px 2px #fff',
    }
    const style = { fontSize: 24, color: this.getColor(status), ...mapStyle }
    let icon = "";
    switch (status) {
      case 0:// 离线
        icon = <div className={`${styles.offline} ${styles.mappointicon}`}><span>{MonitorPollutantInfors.length > 0 ? (MonitorPollutantInfors[0].MonitorValue=='-'?'-':Math.round(MonitorPollutantInfors[0].MonitorValue)) : ''}</span></div>
        break;
      case 1:// 正常
        icon = <div className={`${styles.normal} ${styles.mappointicon}`}><span>{MonitorPollutantInfors.length > 0 ? (MonitorPollutantInfors[0].MonitorValue=='-'?'-':Math.round(MonitorPollutantInfors[0].MonitorValue)) : ''}</span></div>
        break;
      case 2:// 超标
        icon = <div className={`${styles.exceed} ${styles.mappointicon}`}><span>{MonitorPollutantInfors.length > 0 ? (MonitorPollutantInfors[0].MonitorValue=='-'?'-':Math.round(MonitorPollutantInfors[0].MonitorValue)) : ''}</span></div>
        break;
      case 3:// 异常
        icon = <div className={`${styles.abnormal} ${styles.mappointicon}`}><span>{MonitorPollutantInfors.length > 0 ?(MonitorPollutantInfors[0].MonitorValue=='-'?'-':Math.round(MonitorPollutantInfors[0].MonitorValue)) : ''}</span></div>
        break;
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

  // 显示企业点
  showEntMarkers = () => {
    this.props.dispatch({
      type: "hometangy/updateState",
      payload: {
        // currentEntInfo: {},
        currentMarkersList: this.props.allEntAndPointList
      }
    })
    if (this.state.showType === "point") {
      this.props.dispatch({
        type: "hometangy/updateState",
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
      homeVideoList,
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
      // <div className={styles['home-dark-theme']}>
      <div className={styles.homeWrapper} style={{ width: '100%', height: 'calc(100vh)' }}>
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
              {/* 环保点位*/}
              <div className={`${styles.emissionsContent} ${styles.box}`} style={{ width: '100%', height: 'calc(100vh)' }}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} onRef={this.onRef1}
                  assembly={"Commonpoints"} />
              </div>
            </div>
          </Col>
          {/* <Col flex='5.5 1' className={styles.centerWrapper}> */}
          <Col flex='1' className={styles.centerWrapper}>
            <div className={`${styles.mapBox}`}>
              <i className={styles.lb}></i>
              <i className={styles.rb}></i>
              {/* <Switch checked={theme === 'dark' ? true : false} style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }} checkedChildren="深色" unCheckedChildren="浅色" onChange={(value, e) => {
                console.log('value=', value)
                this.props.dispatch({
                  type: 'hometangy/updateState',
                  payload: {
                    theme: value ? 'dark' : 'light',
                  }
                })
                // let themeLink = document.getElementById('theme-link');
                // if (value) {
                //   document.documentElement.className = 'home-dark-theme';
                //   // document.documentElement.id = 'innerSystem';
                //   // themeLink.href = '/theme/light.css'; // 切换 antd 组件主题(亮色)
                // } else {
                //   document.documentElement.className = 'home-light-theme';
                //   document.documentElement.id = '';
                //   // themeLink.href = '/theme/dark.css'; // 切换 antd 组件主题(暗色)
                // }
              }} /> */}
              <Radio.Group style={{ position: 'absolute', zIndex: 1, top: 10, left: 10 }} defaultValue={this.state.radioDefaultValue} buttonStyle="solid" size="default" onChange={this.onRadioChange}>
                {this.renderPollutantTypelist()}
              </Radio.Group>
              <Map
                resizeEnable={false}
                viewMode='3D'
                pitch={60}
                events={this.mapEvents}
                zoom={16}
                mapStyle={theme === 'dark' ? "amap://styles/c4242e55d0870351d9b724e422a72eed" : "amap://styles/61a40971c06013b16bdb985232b21664"}
                amapkey={'b6769bb634ff2a8ec327c28b6ce10afd'}
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
                {/* 监控设备情况 */}
                <div className={styles.box}>
                  <i className={styles.lb}></i>
                  <i className={styles.rb}></i>
                  <div className={styles.videoContainer}>
                    <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[3] : "MonitoringDevice"} />
                  </div>
                </div>
              </Col>
              <Col span={12} style={{ height: '100%' }}>
                {/* 治理情况 */}
                <div className={styles.box}>
                  <i className={styles.lb}></i>
                  <i className={styles.rb}></i>
                  <div className={styles.videoContainer}>
                    <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[3] : "SolveDevice"} />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          {/* <Col flex='3 1'> */}
          <Col style={{ width: '27%' }}>
            <div className={styles.rightWrapper}>
              {/* 运维分析 */}
              <div className={`${styles.excessiveAbnormalWrapper} ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} onRef={this.onRef1}
                  assembly={"OperationAnalysis"} />
              </div>
              {/* 监控现状 */}
              <div style={{ display: `${homePage ? homePage.split(',')[4] : ''}` }} className={`${styles.emissionsContent}  ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={homePage ? homePage.split(',')[4] : "EmissionsAnalysis"} />
              </div>
              {/* 报警信息 */}
              <div className={`${styles.excessiveAbnormalWrapper}  ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={"AlarmMessage"} />
              </div>
            </div>
          </Col>
        </Row>

      </div>


      // </div>
    );
  }
}
export default index;
