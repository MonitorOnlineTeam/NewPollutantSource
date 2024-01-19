/*
 * @Author: Jiaqi
 * @Date: 2019-10-10 10:27:00
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-11-08 16:44:58
 * @desc: 首页
 */
import React, { Component } from 'react';
import { Spin, Radio, Button, Modal, Row, Col, Switch } from 'antd';
import Cookie from 'js-cookie';
import { connect } from 'dva';
import CustomIcon from '@/components/CustomIcon';
// import LiveVideo from "@/components/Video/YSY/Live"

// import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
// import { Map, Polygon, Markers, InfoWindow } from '@/components/ReactAmap';
import moment from 'moment';
import {
  EntIcon,
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
  VocIcon,
  DustIcon,
} from '@/utils/icon';
// import { getPointStatusImg } from '@/utils/getStatusImg';
import styles from './index.less';
import { router } from 'umi';
import LiveVideo from '@/components/Video/LiveVideo';
import config from '@/config';
import HomeCommon from '@/components/home_ys/HomeCommon';
import CO2Rate from './yanshi/CO2Rate';
import ModalContent from './yanshi/ModalContent';
import YSYLiveVideo from '@/components/Video/YSY/Live'

const RadioButton = Radio.Button;
const { RunningRate, TransmissionEffectiveRate, amapKey } = config;
let _thismap;
let Map, Marker, Polygon, Markers, InfoWindow;

@connect(({ loading, home_ys, global }) => ({
  loading: loading.effects['home_ys/getHomePage'],
  pollutantTypeList: home_ys.pollutantTypeList,
  currentEntInfo: home_ys.currentEntInfo,
  currentMarkersList: home_ys.currentMarkersList,
  allEntAndPointList: home_ys.allEntAndPointList,
  mounthOverData: home_ys.mounthOverData,
  homeVideoList: home_ys.homeVideoList,
  homePage: home_ys.homePage,
  theme: home_ys.theme,
  yanshiVisible: home_ys.yanshiVisible,
  yanshiModalTitle: home_ys.yanshiModalTitle,
  configInfo: global.configInfo,
}))
class index extends Component {
  constructor(props) {
    super(props);
    document.documentElement.className =
      props.theme === 'dark' ? 'home-dark-theme' : 'home-light-theme';
    this.state = {
      screenWidth: window.screen.width === 1600 ? 50 : 70,
      currentMonth: moment().format('MM') * 1,
      position: [0, 0],
      // zoom: window.innerWidth > 1600 ? 13 : 12,
      zoom: 6,
      mapCenter: [105.121964, 33.186871],
      visible: false,
      pointName: null,
      radioDefaultValue: '',
      infoWindowVisible: false,
      showType: 'ent',
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
              getTileUrl: function(x, y, z) {
                return config.offlineMapUrl.domain + '/gaode/' + z + '/' + x + '/' + y + '.png';
              },
            });
            Layer.setMap(m);
          }
        }
      },
      complete: () => {
      },
    };
  }
  componentWillMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'home/getHomePage',
    //   payload: {}
    // })
    if (config.offlineMapUrl.domain) {
      let amap = require('@/components/ReactAmap');
      // Map, Marker, Polygon, Markers, InfoWindow;
      Map = amap.Map;
      Marker = amap.Marker;
      Polygon = amap.Polygon;
      Markers = amap.Markers;
      InfoWindow = amap.InfoWindow;
    } else {
      let amap = require('react-amap');
      // Map, Marker, Polygon, Markers, InfoWindow;
      Map = amap.Map;
      Marker = amap.Marker;
      Polygon = amap.Polygon;
      Markers = amap.Markers;
      InfoWindow = amap.InfoWindow;
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取企业及排口信息
    dispatch({
      type: 'home_ys/getAllEntAndPoint',
    });
    // 获取污染物类型
    dispatch({
      type: 'home_ys/getPollutantTypeList',
      payload: {},
    });
    this.getHomePageVideo();
    this.setState({
      did: true,
    });

    window._AMapSecurityConfig = {
      securityJsCode: 'c960e3ce0a08f155f22e676a378fc03e',
    };
  }

  // 获取首页视频列表
  getHomePageVideo = () => {
    this.props.dispatch({ type: 'home_ys/getHomePageVideo' });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.allEntAndPointList !== nextProps.allEntAndPointList) {
      if (nextProps.allEntAndPointList.length === 1) {
        this.markersCilck({
          position: nextProps.allEntAndPointList[0],
        });
      } else {
        const timer = setInterval(() => {
          if (_thismap) {
            _thismap.setFitView();
            this.setState({
              zoom: _thismap.getZoom(),
            });
            clearInterval(timer);
          }
        }, 200);
      }
    }

    if (this.props.currentEntInfo !== nextProps.currentEntInfo) {
      this.setState({
        entCode: nextProps.currentEntInfo.key,
      });
      if (nextProps.currentEntInfo.Longitude && nextProps.currentEntInfo.Latitude) {
        this.setState({
          mapCenter: [nextProps.currentEntInfo.Longitude, nextProps.currentEntInfo.Latitude],
        });
        const timer = setInterval(() => {
          if (_thismap) {
            _thismap.setFitView();
            clearInterval(timer);
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
          },
        };
      });
      this.setState(
        {
          currentMarkersList,
        },
        () => {
          const timer = setInterval(() => {
            if (_thismap) {
              _thismap.setFitView();
              clearInterval(timer);
            }
          }, 200);
        },
      );
    }
  }

  // 污染物选择
  onRadioChange = e => {
    if (this.props.currentEntInfo.children && this.state.showType === 'point') {
      const val = e.target.value;
      const filterData = val
        ? this.props.currentEntInfo.children.filter(item => item.PollutantType == e.target.value)
        : this.props.currentEntInfo.children;
      this.props.dispatch({
        type: 'home_ys/updateState',
        payload: {
          currentMarkersList: filterData,
        },
      });
    }
  };

  /**地图 */
  getpolygon = polygonChange => {
    let res = [];
    if (this.props.currentEntInfo.CoordinateSet) {
      let arr = eval(this.props.currentEntInfo.CoordinateSet);
      for (let i = 0; i < arr.length; i++) {
        res.push(
          <Polygon
            key={i}
            style={{
              strokeColor: '#FF33FF',
              strokeOpacity: 0.2,
              strokeWeight: 3,
              fillColor: '#1791fc',
              fillOpacity: 0.1,
            }}
            path={arr[i]}
          />,
        );
      }
    }
    return res;
  };

  //地图点位点击
  markersEvents = {
    click: (MapsOption, marker) => {
      const itemData = marker.getExtData();
      console.log('itemData', itemData);
      this.markersCilck(itemData);
    },
  };

  // 点位点击事件
  markersCilck = itemData => {
    this.setState({
      did: false,
    });
    if (itemData.position.IsEnt === 1) {
      // 企业
      this.props.dispatch({
        type: 'home_ys/updateState',
        payload: {
          currentEntInfo: itemData.position,
          currentMarkersList: itemData.position.children,
        },
      });
      this.setState({
        showType: 'point',
      });
    } else {
      this.setState({
        currentPoint: itemData.position,
        // DGIMN: itemData.position.key
      });
      // 跳转工艺流程图
      if (itemData.position.key === '62030231rdep11') {
        this.onShowModal('realtimedata1', '北热1号分析小屋 - 系统流程');
      } else {
        this.onShowModal('realtimedata2', '北热2号分析小屋 - 系统流程');
      }
    }
  };

  /**渲染污染物列表 */
  renderPollutantTypelist = () => {
    const { pollutantTypeList } = this.props;
    let res = [];
    if (pollutantTypeList) {
      res.push(
        <RadioButton key="-1" value="" style={{ top: -1 }}>
          全部
        </RadioButton>,
      );
      pollutantTypeList.map((item, key) => {
        let type = '';
        if (item.pollutantTypeCode == 2) {
          type = '△';
        } // 废气
        if (item.pollutantTypeCode == 1) {
          type = '○';
        } // 废水
        if (item.pollutantTypeCode == 10) {
          type = '☆';
        } // 厂界voc
        if (item.pollutantTypeCode == 12) {
          type = '□';
        } // 厂界扬尘
        res.push(
          <RadioButton key={item.pollutantTypeCode} value={item.pollutantTypeCode}>
            {item.pollutantTypeName}
          </RadioButton>,
        );
      });
    }
    return res;
  };

  /**
   * 渲染点
   */
  renderMarkers = extData => {
    return (
      <div
        onMouseEnter={() => {
          if (this.state.infoWindowVisible === false) {
            this.setState({
              hoverMapCenter: extData.position,
              currentTitle: extData.position.title,
              infoWindowHoverVisible: true,
            });
          }
        }}
        onMouseLeave={() => {
          if (this.state.infoWindowVisible === false) {
            this.setState({
              infoWindowHoverVisible: false,
            });
          }
        }}
      >
        {extData.position.IsEnt === 1 ? (
          <EntIcon style={{ fontSize: 26 }} />
        ) : (
          this.getPollutantIcon(extData.position.PollutantType, extData.position.Status)
        )}
      </div>
    );
  };

  // 获取筛选状态图标颜色
  getColor = status => {
    let color = '';
    switch (status) {
      case 0: // 离线
        color = '#999999';
        break;
      case 1: // 正常
        color = '#34c066';
        break;
      case 2: // 超标
        color = '#f04d4d';
        break;
      case 3: // 异常
        color = '#e94';
        break;
    }
    return color;
  };

  getPollutantIcon = (pollutantType, status) => {
    const mapStyle = {
      fontSize: 24,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0px 0px 3px 2px #fff',
    };
    const style = { fontSize: 24, color: this.getColor(status), ...mapStyle };
    let icon = '';
    if (pollutantType == 1) {
      // 废水
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
    }
    if (pollutantType == 2) {
      // 气
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
    switch (pollutantType) {
      // case '1':
      //   // return <WaterIcon style={style} />
      //   return this.getWaterIcon(extData.position.Status)
      // case '2':
      //   return this.getGasIcon(extData.position.Status)
      case '10':
        return <VocIcon style={style} />;
      case '6':
        return (
          <a>
            <CustomIcon type="icon-richangshenghuo-shuizhan" style={{ ...style }} />
          </a>
        );
      case '9':
        return (
          <a>
            <CustomIcon type="icon-echoujiance" style={{ ...style }} />
          </a>
        );
      case '12':
        return <CustomIcon type="icon-yangchen1" style={{ ...style }} />;
      case '5':
        return (
          <a>
            <CustomIcon type="icon-fangwu" style={style} />
          </a>
        );
      case '37':
        return <CustomIcon type="icon-dian2" style={{ ...style }} />;
    }
    return icon;
  };

  onRef1 = ref => {
    this.children = ref;
  };
  //左边模块加载
  leftLoading = () => {
    // this.children.
  };

  //右边模块加载
  rightLoading = () => {
    //   this.
  };

  // 显示企业点
  showEntMarkers = () => {
    this.props.dispatch({
      type: 'home_ys/updateState',
      payload: {
        // currentEntInfo: {},
        currentMarkersList: this.props.allEntAndPointList,
      },
    });
    if (this.state.showType === 'point') {
      this.props.dispatch({
        type: 'home_ys/updateState',
        payload: {
          currentEntInfo: {},
        },
      });
      this.setState({
        currentPoint: undefined,
        DGIMN: null,
      });
    }
    this.setState({ showType: 'ent' });
  };

  onShowModal = (modalType, title) => {
    this.props.dispatch({
      type: 'home_ys/updateState',
      payload: {
        yanshiVisible: true,
        modalType: modalType,
        yanshiModalTitle: title,
      },
    });
  };

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
      entCode,
    } = this.state;
    const {
      currentEntInfo,
      mounthOverData,
      homePage,
      configInfo,
      theme,
      homeVideoList,
      yanshiModalTitle,
    } = this.props;
    let pointposition = position;
    let pointvisible = visible;
    let polygonChange;
    const ele = document.querySelector('.antd-pro-pages-home-index-excessiveAbnormalWrapper');
    let height = 0;
    if (ele) {
      height = ele.offsetHeight - 30;
    }

    return (
      <div className={styles.homeWrapper} style={{ width: '100%', height: 'calc(100vh)' }}>
        <header className={styles.homeHeader}>
          <p>
            <span>SDL</span> {configInfo.SystemName}
          </p>
          <a
            className={styles.backMenu}
            onClick={() => {
              router.push(Cookie.get('systemNavigateUrl'));
            }}
          >
            系统功能
          </a>
        </header>
        <Row gutter={[8, 8]} style={{ padding: '0 8px' }} className={styles.contentWrapper}>
          {/* <Col flex='3 1'> */}
          <Col style={{ width: '27%' }}>
            <div className={styles.leftWrapper}>
              {/* 运行分析  || 智能质控*/}
              <div className={`${styles.effectiveRate} ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon
                  DGIMN={DGIMN}
                  entCode={entCode}
                  onRef={this.onRef1}
                  assembly={'OperationAnalysis'}
                />
              </div>
              {/* 运维统计 */}
              <div className={`${styles.operationsWrapper}  ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={'OperationStatistics'} />
              </div>
              {/* 超标异常 */}
              <div className={`${styles.excessiveAbnormalWrapper}  ${styles.box}`}>
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon DGIMN={DGIMN} entCode={entCode} assembly={'QCAPassRate'} />
              </div>
            </div>
          </Col>
          {/* <Col flex='5.5 1' className={styles.centerWrapper}> */}
          <Col flex="1" className={styles.centerWrapper}>
            <div className={`${styles.mapBox}`}>
              <i className={styles.lb}></i>
              <i className={styles.rb}></i>
              <Switch
                checked={theme === 'dark' ? true : false}
                style={{ position: 'absolute', zIndex: 1, top: 10, right: 10 }}
                checkedChildren="深色"
                unCheckedChildren="浅色"
                onChange={(value, e) => {
                  console.log('value=', value);
                  this.props.dispatch({
                    type: 'home_ys/updateState',
                    payload: {
                      theme: value ? 'dark' : 'light',
                    },
                  });
                  // let themeLink = document.getElementById('theme-link');
                  if (value) {
                    document.documentElement.className = 'home-dark-theme';
                    // document.documentElement.id = 'innerSystem';
                    // themeLink.href = '/theme/light.css'; // 切换 antd 组件主题(亮色)
                  } else {
                    document.documentElement.className = 'home-light-theme';
                    document.documentElement.id = '';
                    // themeLink.href = '/theme/dark.css'; // 切换 antd 组件主题(暗色)
                  }
                }}
              />
              {showType === 'point' && (
                <Button
                  type="primary"
                  size="small"
                  style={{ position: 'absolute', zIndex: 1, left: 10, top: 10 }}
                  onClick={this.showEntMarkers}
                >
                  返回企业
                </Button>
              )}
              <Map
                resizeEnable={true}
                events={this.mapEvents}
                zoom={5}
                mapStyle={
                  theme === 'dark'
                    ? 'amap://styles/32ae1bcea26191a8dd684f71c172af1f'
                    : 'amap://styles/61a40971c06013b16bdb985232b21664'
                }
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
                >
                  {this.state.currentTitle}
                </InfoWindow>
                <Markers
                  markers={currentMarkersList}
                  events={this.markersEvents}
                  className={this.state.special}
                  render={this.renderMarkers}
                />
                {this.getpolygon(polygonChange)}
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
                    {/* {homeVideoList[0] ? (
                      <LiveVideo videoInfo={homeVideoList[0]} id="video1" />
                    ) : (
                      <div className="notData">
                        <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
                        <p style={{ color: '#d5d9e2', fontSize: 16, fontWeight: 500 }}>暂无数据</p>
                      </div>
                    )} */}

                    {/* <LiveVideo deviceSerial={'E36486991'} channelNo={1} template="simple" /> */}

                    <YSYLiveVideo
                      id={'video1'}
                      appKey={'35ca29dba6714724be8fd7331548cc37'}
                      appSecret={'699b15a37df6ba5f6115c4e5b23bde55'}
                      deviceSerial={'AB2482688'}
                      channelNo={'1'}
                      // template="simple"
                    />
                  </div>
                </div>
              </Col>
              <Col span={12} style={{ height: '100%' }}>
                <div className={styles.box}>
                  <i className={styles.lb}></i>
                  <i className={styles.rb}></i>
                  <div className={styles.title} style={{ marginBottom: 12 }}>
                    <p>CO₂排放速率</p>
                  </div>
                  <div className={styles.videoContainer}>
                    <CO2Rate />
                    {/* {
                      homeVideoList[0] ? <LiveVideo videoInfo={homeVideoList[1]} id="video2" /> : <div className='notData'>
                        <img src="/nodata1.png" style={{ width: '120px', dispatch: 'block' }} />
                        <p style={{ color: "#d5d9e2", fontSize: 16, fontWeight: 500 }}>暂无数据</p>
                      </div>
                    } */}
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          {/* <Col flex='3 1'> */}
          <Col style={{ width: '27%' }}>
            <div className={styles.rightWrapper}>
              {/* 智能监控 */}
              <div
                style={{ display: `${homePage ? homePage.split(',')[3] : ''}` }}
                className={`${styles.monitoringContent}  ${styles.box}`}
              >
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon
                  DGIMN={DGIMN}
                  entCode={entCode}
                  assembly={homePage ? homePage.split(',')[3] : 'MonitoringStatus'}
                />
              </div>
              {/* 企业排放量 */}
              <div
                style={{ display: `${homePage ? homePage.split(',')[4] : ''}` }}
                className={`${styles.emissionsContent}  ${styles.box}`}
              >
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon
                  DGIMN={DGIMN}
                  entCode={entCode}
                  assembly={homePage ? homePage.split(',')[5] : 'EmissionTax'}
                />
              </div>
              <div
                style={{ display: `${homePage ? homePage.split(',')[4] : ''}` }}
                className={`${styles.emissionsContent}  ${styles.box}`}
              >
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon
                  DGIMN={DGIMN}
                  entCode={entCode}
                  assembly={homePage ? homePage.split(',')[5] : 'CO2LinearAnalysisChart'}
                />
              </div>
              {/* 排污税 */}
              <div
                style={{ display: `${homePage ? homePage.split(',')[5] : ''}` }}
                className={`${styles.effluentFeeContent}  ${styles.box}`}
              >
                <i className={styles.lb}></i>
                <i className={styles.rb}></i>
                <HomeCommon
                  DGIMN={DGIMN}
                  entCode={entCode}
                  assembly={homePage ? homePage.split(',')[4] : 'EmissionsAnalysis'}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Modal
          title={yanshiModalTitle}
          width={'100vw'}
          visible={this.props.yanshiVisible}
          bodyStyle={{ height: 'calc(100vh - 55px)', padding: '10px 0' }}
          footer={false}
          mask={false}
          className={styles.fullScreenModal}
          // wrapClassName={styles.myModal}
          onCancel={() => {
            this.props.dispatch({
              type: 'home_ys/updateState',
              payload: {
                yanshiVisible: false,
              },
            });
          }}
        >
          <ModalContent />
        </Modal>
      </div>
    );
  }
}
export default index;