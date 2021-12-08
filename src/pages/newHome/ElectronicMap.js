import React, { PureComponent } from 'react';
import { CaretDownOutlined, CaretUpOutlined, EnvironmentOutlined } from '@ant-design/icons';
import {
  Card,
  Drawer,
  Tooltip,
  Button,
  Spin,
  Input,
  message,
  DatePicker,
  Select,
  Divider,
} from 'antd';
// import { Map, Marker, Polygon, Markers, InfoWindow } from 'react-amap';
// import { Map, Marker, Polygon, Markers, InfoWindow } from '@/components/ReactAmap';
import moment from 'moment';
import { getDirLevel } from '@/utils/utils';
import mapStyles from '@/pages/monitoring/mapview/styles.less';

import 'animate.css';
import ReactEcharts from 'echarts-for-react';
import { router } from 'umi';
import Cookie from 'js-cookie';
import { connect } from 'dva';
import MapUI from './component/MapUI';
import config from '@/config';
import styles from './index.less';
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
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
import CustomIcon from '@/components/CustomIcon';
import markersStyles from '@/pages/monitoring/mapview/styles.less';
import Monitoring from './component/Monitoring';
import RunAndAnalysis from './component/RunAndAnalysis';
import AlarmResponse from './component/AlarmResponse';
import Operations from './component/Operations';
import DiffHorizontal from './component/DiffHorizontal';
import OfficeModal from './component/OfficeModal';
import SiteDetailsModal from './component/SiteDetailsModal';
import PageLoading from '@/components/PageLoading';

// const plugins = [
//   'MapType', // 地图模式（卫星）
//   'Scale', //
//   'OverView',
//   'ToolBar',
// ]
const { MonthPicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const iconStyle = {
  color: '#3c99d8',
  fontSize: '28px',
  borderRadius: '50%',
  background: 'rgb(255, 255, 255)',
  boxShadow: 'rgb(255, 255, 255) 0px 0px 3px 2px',
};

const mapIconStyle = {
  fontSize: 24,
  borderRadius: '50%',
  background: '#fff',
  boxShadow: '0px 0px 3px 2px #fff',
};
let Map;
let Marker;
let Polygon;
let Markers;
let InfoWindow;
let aMap = null;

@connect(({ loading, newHome, global }) => ({
  allEntAndPointList: newHome.allEntAndPointList,
  configInfo: global.configInfo,
  infoWindowData: newHome.infoWindowData,
  monitoringDataLoading: loading.effects['newHome/getMonitoringData'],
  runAndAnalysisDataLoading: loading.effects['newHome/getRunAndAnalysisData'],
  alarmResponseDataLoading: loading.effects['newHome/getAlarmResponseData'],
  operationAnalysisLoading: loading.effects['newHome/getOperationAnalysis'],
  taskStatisticsDataLoading: loading.effects['newHome/getTaskStatisticsData'],
  diffHorizontalDataLoading: loading.effects['newHome/getDiffHorizontalData'],
  drillDownLoading: newHome.drillDownLoading,
  getAllEntAndPointLoading: loading.effects['newHome/getAllEntAndPoint'],
  officeVisible: newHome.officeVisible,
  siteDetailsVisible: newHome.siteDetailsVisible,
  monitorRegionDivision: newHome.monitorRegionDivision,
  currentDivision: newHome.currentDivision,
  currentDivisionPosition: newHome.currentDivisionPosition,
  startTime: newHome.startTime,
  endTime: newHome.endTime,
  LEVEL: newHome.LEVEL,
  INIT_LEVEL: newHome.INIT_LEVEL,
  constructionCorpsList: newHome.constructionCorpsList,
  noticeList: global.notices,
  infoWindowDataLoading:newHome.infoWindowDataLoading
}))
class NewHome extends PureComponent {
  constructor(props) {
    super(props);
    // 地图事件
    this.amapEvents = {
      created: mapInstance => {
        console.log(
          '高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：',
        );
        aMap = mapInstance;
        if (config.offlineMapUrl.domain) {
          const Layer = new window.AMap.TileLayer({
            zIndex: 2,
            getTileUrl(x, y, z) {
              // return 'http://mt1.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=' + x + '&y=' + y + '&z=' + z + '&s=Galil';
              return `${config.offlineMapUrl.domain}/gaode/${z}/${x}/${y}.png`;
            },
          });
          Layer.setMap(mapInstance);
          // mapInstance.setCity(650000, function () {
          //   mapInstance.setZoom(6)
          // })
          mapInstance.setFitView();
        }
        // this.setState({ initZoom: aMap.getZoom()})
      },
      zoomchange: value => {
        const zoom = aMap.getZoom();
        console.log('放大级别',zoom)
        if (this.state.displayType === 0) {
          if (zoom >= 9 && this.state.hideEntName) {
            this.setState({ hideEntName: false });
            this.showEntName();
          }
          if (zoom <= 9 && !this.state.hideEntName) {
            this.setState({
              hideEntName: true,
            });
            this.showEntName();
          }
        }
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
      click: (MapsOption, marker) => { },
    };
    // 厂界事件
    this.polygonEvents = {
      click: () => {
        console.log('clicked');
      },
      created: ins => {
        this.setState({
          allPolygon: ins,
        });
      },
      mouseover: () => {
        console.log('mouseover');
      },
      dblclick: () => {
        console.log('dbl clicked');
      },
    };
    // 点弹窗事件
    this.infoWindowEvents = {
      close: () => {
        console.log('close');
        this.setState({
          infoWindowVisible: false,
        });
      },
    };

    // 搜索结果弹窗事件
    this.searchWindowEvent = {
      close: () => {
        console.log('close');
        this.setState({
          searchResult: undefined,
        });
      },
    };
    this.state = {
      leftVisible: true,
      rightVisible: true,
      RegionCode: '',
      displayType: 0, // 显示类型： 0企业，1监测点
      allPollutantTypes: [], // 所有污染物类型
      markersList: [], // 点集合
      infoWindowVisible: false, // 点弹窗
      infoWindowPos: null, // 点弹窗位置
      currentClickObj: {}, // 当前点击对象 - 弹窗
      filterEntAndPointList: [], // 用于筛选的
      selectValue: '1,2', // 筛选
      month: moment().get('month'),
      toggleSelect: false, //
      hideEntName: true,
      initCenter: [85.35803, 42.229502],
      initZoom: 6,
      SparePartsStationCode: "",
      SparePartsStationInfo: {},
      echoRegionCode:[]
    };
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
    // 获取显示级别
    this.props.dispatch({
      type: 'newHome/getLevel',
    });
    // 获取污染物列表
    this.props.dispatch({
      type: 'common/getPollutantTypeList',
      callback: res => {
        this.setState(
          {
            allPollutantTypes: res.map(item => item.pollutantTypeCode),
          },
          () => {
            this.getAllEntAndPoint();
          },
        );
      },
    });
    // // 获取行政区与师的关系
    // this.props.dispatch({
    //   type: 'newHome/getMonitorRegionDivision',
    // });
    // this.getConstructionCorpsList();
  }

  componentWillUnmount() {
    // 重置model
    this.props.dispatch({
      type: 'newHome/updateState',
      payload: {
        startTime: moment().format('YYYY-MM-01 00:00:00'),
        START_TIME: moment().format('YYYY-MM-01 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        END_TIME: moment().format('YYYY-MM-DD 23:59:59'),
        entName: '',
        regionCode: '',
        REGION_CODE: '',
      },
    });
  }

  showEntName = () => {
    let filterEntList = this.props.allEntAndPointList;
     
    const { selectValue } = this.state;

    // 过滤企业筛选
    if (selectValue) {
      filterEntList = this.props.allEntAndPointList.filter(
        item => item.MonitorObjectType == selectValue.split(",")[0] || item.MonitorObjectType == selectValue.split(",")[1]
      );
    }
    // 过滤师筛选
    if (this.state.RegionCode) {
      filterEntList = filterEntList.filter(itm => {
        if (itm.RegionCode) {
          const RegionCode = itm.RegionCode.split(',');
          if (RegionCode.includes(this.state.RegionCode)) {
            return itm;
          }
        }
      });
    }
    this.renderEntMarkers(filterEntList, true);
  };

  // 获取企业和监测点
  getAllEntAndPoint = (type) => {
    this.props.dispatch({
      type: 'newHome/getAllEntAndPoint',
      payload: {
        PollutantTypes: this.state.selectValue.toString(),
        RegionCode: this.state.RegionCode?this.state.RegionCode : '',
      },
      callback:res=>{
         if(type){
          this.onSearch(this.state.searchInputVal)
         }
      }
    });
  };

  // 获取服务站信息
  getOfficeModalData = extData => {
    const officeCode = extData.position.key;
    this.props.dispatch({
      type: 'newHome/getOfficeUserList',
      payload: { officeCode },
    });
    this.props.dispatch({
      type: 'newHome/getOfficeStockList',
      payload: { officeCode },
    });
    this.setState({
      modalTitle: extData.position.title,
      SparePartsStationInfo: extData.position,
    });
  };

  // 获取infoWindow数据
  getInfoWindowData = () => {
    const { currentClickObj } = this.state;
    this.props.dispatch({
      type: 'newHome/getInfoWindowData',
      payload: {
        DGIMNs: currentClickObj.key,
        dataType: 'HourData',
        isLastest: true,
        // type: PollutantType,
        isAirOrSite: true,
        pollutantTypes: currentClickObj.PollutantType,
      },
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.allEntAndPointList !== nextProps.allEntAndPointList) {
      this.renderEntMarkers(nextProps.allEntAndPointList);
      this.setState({ filterEntAndPointList: nextProps.allEntAndPointList });
    }
    if (this.props.currentDivisionPosition !== nextProps.currentDivisionPosition) {
      // this.renderEntMarkers(nextProps)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if(this.state.displayType !== prevState.displayType && this.state.displayType === 1){
    if (this.state.allPolygon !== prevState.allPolygon && this.state.displayType === 1) {
      const polygonList = aMap.getAllOverlays('polygon');
      const markerList = aMap.getAllOverlays('marker');
      aMap.setFitView(this.state.allPolygon);
      // aMap.setFitView([this.state.allMarkers, this.state.allPolygon])
    }
    if (
      this.state.allMarkers !== prevState.allMarkers &&
      !this.state.allPolygon &&
      this.state.displayType === 1
    ) {
      aMap.setFitView(this.state.allMarkers);
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: "newHome/updateState",
      payload: { siteDetailsVisible: false }
    })
  }


  // 渲染所有企业
  renderEntMarkers = (entAndPointList, notFitView) => {
    const entMarkers = entAndPointList.map(item => ({
      position: {
        longitude: item.Longitude,
        latitude: item.Latitude,
        ...item,
      },
      children: item.children,
    }));

    this.setState(
      {
        markersList: entMarkers,
        allPolygon: null,
        displayType: 0,
      },
      () => {
        const timer = setInterval(() => {
          if (aMap) {
            !notFitView && aMap.setFitView();
            clearInterval(timer);
          }
        }, 200);
      },
    );
  };

  // 左右抽屉
  toggle = left => {
    const pageContainer = document.querySelector('.antd-pro-pages-new-home-index-pageContainer');
    const { leftVisible, rightVisible } = this.state;
    if (left) {
      pageContainer.style.marginLeft = leftVisible ? '0' : '340px';
      this.setState({
        leftVisible: !this.state.leftVisible,
      });
    } else {
      pageContainer.style.marginRight = rightVisible ? '0' : '340px';
      this.setState({
        rightVisible: !this.state.rightVisible,
      });
    }
  };

  // 渲染企业及监测点
  renderMarker = extData => {
    const { displayType } = this.state;
    if (extData.position.MonitorObjectType !== '师') {
      // return <div>
      //   <Tooltip title={extData.position.title}>
      //     {
      //       displayType === 0 ?
      //         this.getEntIcon(extData)
      //         :
      //         <div onClick={() => {
      //           this.setState({
      //             currentClickObj: extData.position,
      //             infoWindowVisible: true,
      //             infoWindowPos: [extData.position.Longitude, extData.position.Latitude]
      //           }, () => {
      //             this.getInfoWindowData()
      //           })
      //         }}>{this.getPollutantIcon(extData)}</div>
      //     }
      //   </Tooltip>
      // </div>
      return (
        <div
          onMouseEnter={() => {
            // if (this.state.infoWindowVisible === false && aMap.getZoom() < 10) {
              if (this.state.infoWindowVisible === false && displayType === 0) {
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
          {displayType === 0 ? (
            this.getEntIcon(extData)
          ) : (
              <div
                onClick={() => {
                  this.setState(
                    {
                      currentClickObj: extData.position,
                      infoWindowVisible: true,
                      infoWindowPos: [extData.position.Longitude, extData.position.Latitude],
                    },
                    () => {
                      this.getInfoWindowData();
                    },
                  );
                }}
              >
                {this.getPollutantIcon(extData)}
              </div>
            )}
        </div>
      );
    }
    return <div>{this.getEntIcon(extData)}</div>;
  };

  // 渲染企业
  getEntIcon = extData => {
    const { currentDivisionPosition } = this.props;
    // console.log('currentDivisionPosition=', currentDivisionPosition)
    const style = { fontSize: 24, color: this.getColor(extData.position.Status), ...mapIconStyle };
    switch (extData.position.MonitorObjectType) {

      case '1':
        // 企业
        let isShow = 'none';
        extData.position.children &&
          extData.position.children.map(item => {
            if (this.props.noticeList.find(itm => itm.DGIMN === item.DGIMN)) {
              isShow = 'block';
            }
          });
        return (
          <div
            style={{ color: '#525151', position: 'relative' }}
            onClick={() => {
              // console.log('点击图标')
              // 企业点击显示监测点
              if (extData.children) {
                const pointMarkers = extData.children.map(item => ({
                  position: {
                    longitude: item.Longitude,
                    latitude: item.Latitude,
                    ...item,
                  },
                }));
                this.setState({
                  coordinateSet: extData.position.CoordinateSet,
                  markersList: pointMarkers,
                  infoWindowHoverVisible: false,
                  displayType: 1,
                });
              }
            }}
          >
           <div
              className={mapStyles.pulse1}
              style={{ left: -11, top: aMap.getZoom() >= 10 ? 18 : -12, display: isShow }}
            ></div>
             {aMap.getZoom() > 9 && <div className={styles.pop}>{extData.position.title}</div>} 
            <EntIcon style={{ fontSize: 28 }} />
          </div>
        );
      case '2':
        // 大气站
        const color =
          extData.position.Color && extData.position.Color !== '-'
            ? extData.position.Color
            : '#999';
        return (
          <div style={{ color: '#525151' }}>
            {/* {aMap.getZoom() >= 9 && <div className={styles.pop}>{extData.position.title}</div>} */}
            <CustomIcon
              type="icon-fangwu"
              style={{ ...iconStyle, color }}
              onClick={() => {
                this.setState(
                  {
                    currentClickObj: extData.position,
                    infoWindowVisible: true,
                    infoWindowPos: [extData.position.Longitude, extData.position.Latitude],
                  },
                  () => {
                    this.getInfoWindowData();
                  },
                );
              }}
            />
          </div>
        );
      case '师':
        return (
          <div
            className={
              this.state.clickedDivision
                ? 'animate__animated animate__bounce animate__infinite animate__slow'
                : ''
            }
            style={{ color: '#525151' }}
          >
            <div className={styles.pop}>{extData.position.title}</div>
            <CustomIcon
              key="amache"
              className={
                this.props.currentDivisionPosition.includes(
                  `${extData.position.Longitude},${extData.position.Latitude}`,
                )
                  ? 'animate__animated animate__bounce animate__infinite'
                  : ''
              }
              type="icon-ditu"
              style={{ fontSize: 32 }}
              onClick={() => {
                this.divisionClick(extData.position);
              }}
            />
          </div>
        );
      case '服务站':
        return (
          <>
            {aMap.getZoom() > 9 && <div className={styles.pop}>{extData.position.title}</div>}
            <CustomIcon
              type="icon-cangku"
              style={{ ...style, fontSize: 28 }}
              onClick={() => {
                debugger
                this.setState({
                  SparePartsStationCode: extData.position.SparePartsStationCode
                })
                this.getOfficeModalData(extData);
              }}
            />
          </>
        );
      default:
        return null;
    }
  };

  // 渲染企业下监测点
  getPollutantIcon = extData => {
    const style = { fontSize: 24, color: this.getColor(extData.position.Status), ...mapIconStyle };
    let pollutantElement = '';
    switch (extData.position.PollutantType) {
      case '1':
        pollutantElement = this.getWaterIcon(extData.position.Status);
        break;
      case '2':
        pollutantElement = this.getGasIcon(extData.position.Status);
        break;
      case '10':
        pollutantElement = <VocIcon style={style} />;
        break;
      case '12':
        pollutantElement = <CustomIcon type="icon-yangchen1" style={{ ...style }} />;
        break;
      case '5':
        pollutantElement = (
          <a>
            <CustomIcon type="icon-fangwu" style={style} />
          </a>
        );
        break;
      case '37':
        pollutantElement = <CustomIcon type="icon-dian2" style={{ ...style }} />;
        break;
    }
    if (extData.position.outPutFlag == 1) {
      // 停产
      pollutantElement = <CustomIcon type="icon-tingzhishangbao" style={{ ...style }} />;
    }
    return (
      <div style={{ color: '#525151' }}>
        {/* {true && */}
        {!!this.props.noticeList.find(m => m.DGIMN === extData.position.DGIMN) && (
          <>
            {/* <div className={styles.pulse}></div> */}
            <div className={mapStyles.pulse1} style={{ top: 17 }}></div>
          </>
        )}
        <div className={styles.pop}>{extData.position.title}</div>
        {pollutantElement}
      </div>
    );
  };

  // 绘制厂界
  drawPolygon = () => {
    const { coordinateSet, displayType } = this.state;
    const res = [];
    if (coordinateSet && displayType === 1) {
      const arr = eval(coordinateSet);
      for (let i = 0; i < arr.length; i++) {
        res.push(
          <Polygon
            events={this.polygonEvents}
            // key={item.entCode+i}
            // extData={item}
            style={{
              strokeColor: '#FF33FF',
              // strokeColor: '#0cffda',
              strokeOpacity: 0.2,
              strokeWeight: 3,
              // fillColor: '#595959',
              fillColor: '#908c8c',
              fillOpacity: 0.35,
            }}
            path={arr[i]}
          />,
        );
      }
    }
    return res;
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

  getStatusText = status => {
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

  getWaterIcon = status => {
    let icon = '';
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

  getGasIcon = status => {
    let icon = '';
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
    return icon;
  };

  // 弹窗内容
  infoWindowContent = () => {
    const { currentClickObj } = this.state;
    const { infoWindowData } = this.props;
    let imgName =
      infoWindowData.pollutantTypeCode === 2
        ? '/gasInfoWindow.png'
        : infoWindowData.pollutantTypeCode === 1
          ? '/water.jpg'
          : '/infoWindowImg.png';
    if (infoWindowData.photo) {
      imgName = `/upload/${infoWindowData.photo[0]}`;
    }
    return (
      <div className={styles.infoWindowContent} style={{ width: 340, minHeight: 360 }}>
        {this.props.infoWindowDataLoading ? <PageLoading /> :  

        <>
        <div className={styles.header}>
          <h2>
            {infoWindowData.entName} - {currentClickObj.title}
          </h2>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              this.props.dispatch({
                type: 'newHome/updateState',
                payload: { siteDetailsVisible: true },
              });
            }}
          >
            进入站房
          </Button>
          <p>
            站点状态：
            {currentClickObj.outPutFlag === 1 ? (
              <span style={{ color: '#999999' }}>停运</span>
            ) : (
                <span style={{ color: this.getColor(currentClickObj.Status) }}>
                  {this.getStatusText(currentClickObj.Status)}
                </span>
              )}
          </p>
        </div>
        <div className={styles.desc}>
          <div className={styles['desc-l']}>
            <h3>站点信息</h3>
            <p>区域：{infoWindowData.regionName}</p>
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
              {/* <span>浓度值：{curPointData[curPointData.PrimaryPollutantCode]}</span> */}
            </div>
          )}
          <ul>
            {infoWindowData.list.map(item => {
              let title = `${item.label}：${item.value}`;
              if (item.label === '风向') {
                title = `${item.label}：${getDirLevel(item.value)}`;
              }
              return (
                <Tooltip placement="topLeft" title={title}>
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

  onSearch = value => {
    if (value) {
      const filter = this.state.markersList.filter(item => {
        if (item.position.IsEnt === 1 || item.position.PollutantType == 5) {
          if (
            item.position.title.indexOf(value) > -1 ||
            item.position.EntName.indexOf(value) > -1
          ) {
            return item;
          }
        }
      });
      if (filter.length > 0) {
        this.setState({
          searchResult: filter[0].position,
          // searchInputVal: undefined,
        });

        aMap.setZoomAndCenter(aMap.getZoom() + 5, [
          filter[0].position.Longitude,
          filter[0].position.Latitude,
        ]);
      } else {
        message.error('未找到相关企业或空气站');
      }
    }
  };

  // divisionInfoWindow = () => {
  //   const { currentDivision } = this.props;
  //   if (currentDivision && currentDivision.divisionList) {
  //     return currentDivision.divisionList.map(item => (
  //       <InfoWindow position={[item.longitude, item.latitude]} visible isCustom offset={[4, -36]}>
  //         {item.divisionName}
  //       </InfoWindow>
  //     ));
  //   }
  // };

  // 重新请求页面数据
  reloadPageData = (startTime = this.props.startTime, endTime = this.props.endTime) => {
    this.props.dispatch({
      type: 'newHome/changeDateTime',
      payload: {
        startTime,
        endTime,
      },
    });
  };

  // 师点击
  divisionClick = item => {
    this.setState({
      clickedDivision: item,
      selectValue: '',
    });
    this.props.dispatch({
      type: 'newHome/updateState',
      payload: {
        currentDivisionName: item.title,
      },
    });

    const filterEntList = this.props.allEntAndPointList.filter(itm => {
      if (itm.RegionCode) {
        const RegionCode = itm.RegionCode.split(',');
        if (RegionCode.includes(item.RegionCode)) {
          return itm;
        }
      }
    });
    this.renderEntMarkers(filterEntList);
    this.props.dispatch({
      type: 'newHome/changeRegionCode',
      payload: { regionCode: item.RegionCode },
    });
  };

  render() {
    const {
      toggleSelect,
      selectValue,
      filterEntAndPointList,
      searchInputVal,
      searchResult,
      leftVisible,
      rightVisible,
      infoWindowPos,
      infoWindowVisible,
      RegionCode,
      currentClickObj,
      displayType,
      modalTitle,
      clickedDivision,
      SparePartsStationCode,
      SparePartsStationInfo,
    } = this.state;
    const {
      allEntAndPointList,
      constructionCorpsList,
      INIT_LEVEL,
      getAllEntAndPointLoading,
      drillDownLoading,
      officeVisible,
      siteDetailsVisible,
      monitoringDataLoading,
      runAndAnalysisDataLoading,
      alarmResponseDataLoading,
      operationAnalysisLoading,
      taskStatisticsDataLoading,
      diffHorizontalDataLoading,
    } = this.props;
    const isLeftLoading =
      drillDownLoading ||
      monitoringDataLoading ||
      runAndAnalysisDataLoading ||
      alarmResponseDataLoading;
    const isRightLoading =
      drillDownLoading ||
      operationAnalysisLoading ||
      taskStatisticsDataLoading ||
      diffHorizontalDataLoading;
    // const bigLoading = drillDownLoading || getAllEntAndPointLoading;
    const loading = getAllEntAndPointLoading;
    // const style = { fontSize: 24, color: this.getColor(extData.position.Status), ...mapStyle }
    const mapStaticAttribute = {};
    // 离线地图设置做大缩放级别
    if (config.offlineMapUrl.domain) {
      mapStaticAttribute.zooms = [3, 14];
    }
    return (
      <div className={styles.newHomeWrap} style={{ margin: '-24px -24px 0 -24px' }}>
        {/* <header className={styles.homeHeader}>
          <p><span>SDL</span> 污染源智能分析系统</p>
          <a className={styles.backMenu} onClick={() => {
            router.push(Cookie.get("systemNavigateUrl"))
          }}>系统功能</a>
        </header> */}
        <Spin style={{ zIndex: 9999 }} spinning={loading}>
          <div className={`${styles.pageContainer} ${styles.dzMap}`}>
            {/* <>
              <Drawer
                zIndex={1}
                placement="left"
                closable={false}
                width={340}
                mask={false}
                visible={leftVisible}
                style={{ marginTop: 64 }}
                bodyStyle={{ padding: 0 }}
              >
                <div className={styles.drawerIcon} onClick={() => this.toggle(true)}>
                  <Icon type={leftVisible ? 'caret-left' : 'caret-right'} className={styles.icon} />
                </div>
                <Spin spinning={isLeftLoading}>
                  <div className={styles.content}>
                    <Monitoring RegionCode={RegionCode} />
                    <RunAndAnalysis RegionCode={RegionCode} />
                    <AlarmResponse RegionCode={RegionCode} month={this.state.month} />
                  </div>
                </Spin>
              </Drawer>
              <Drawer
                zIndex={1}
                placement="right"
                closable={false}
                width={340}
                mask={false}
                visible={rightVisible}
                style={{ marginTop: 64 }}
                bodyStyle={{ padding: 0 }}
              >
                <div
                  className={`${styles.drawerIcon} ${styles.rightDrawerIcon}`}
                  onClick={() => this.toggle()}
                >
                  <Icon type={rightVisible ? 'caret-right' : 'caret-left'} className={styles.icon} />
                </div>
                <Spin spinning={isRightLoading}>
                  <div className={styles.content}>
                    <Operations RegionCode={RegionCode} />
                    <DiffHorizontal RegionCode={RegionCode} />
                  </div>
                </Spin>
              </Drawer>
            </> */}
            <div className={styles.mapContent}>
              <div className={styles.mapInnerBox}>
                {displayType === 1 && (
                  <Button
                    type="primary"
                    style={{
                      //  true && <Button type="primary" style={{
                      float: 'right',
                      marginRight: 10,
                    }}
                    onClick={() => {
                      let filterList = allEntAndPointList;
                      if (selectValue) {
                        filterList = filterEntAndPointList.filter(
                          item => item.MonitorObjectType == selectValue.split(",")[0] || item.MonitorObjectType == selectValue.split(",")[1],
                        );
                      }
                      if (clickedDivision) {
                        filterList = filterList.filter(itm => {
                          if (itm.RegionCode) {
                            const RegionCode = itm.RegionCode.split(',');
                            if (RegionCode.includes(clickedDivision.RegionCode)) {
                              return itm;
                            }
                          }
                        });
                      }
                      this.setState({
                        infoWindowVisible: false, // 关闭排口弹窗
                      });
                      this.renderEntMarkers(filterList);

                      // aMap.setFitView();
                      // aMap.setZoom(6);
                      // aMap.setZoom(9);
                    }}
                  >
                    返回企业
                  </Button>
                )}
                {/* {
                  clickedDivision && <Button type="primary" style={{
                    float: 'right',
                    display: displayType === 1 ? 'none' : 'inline',
                  }} onClick={() => {
                    this.setState({ clickedDivision: undefined })
                    this.props.dispatch({
                      type: 'newHome/updateState',
                      payload: {
                        level: INIT_LEVEL,
                        LEVEL: INIT_LEVEL,
                        regionCode: '660000000',
                        currentDivisionName: '',
                      },
                    })
                    setTimeout(() => {
                      this.reloadPageData();
                    }, 0)
                  }}>返回上级</Button>
                } */}
                {/* <MonthPicker
                  defaultValue={moment()}
                  allowClear={false}
                  className={styles.monthPicker}
                  onChange={(date, dateString) => {
                    this.setState({ month: moment(date).get('month') });
                    let endTime = date.endOf('month').format('YYYY-MM-DD HH:mm:ss');
                    if (moment().get('month') === moment(date).get('month')) {
                      endTime = moment().format('YYYY-MM-DD 23:59:59');
                    }
                    this.reloadPageData(date.format('YYYY-MM-01 00:00:00'), endTime);
                  }}
                /> */}
                {displayType === 0 && (
                  <Select
                    className={styles.selectShowType}
                    dropdownClassName={'newHomeWrapDropdown'}
                    value={selectValue}
                    onChange={val => {
                      this.setState({ selectValue: val });
                      
                      if (val&&val!=5) {
                        // let filterList = filterEntAndPointList.filter(
                        //   item => item.MonitorObjectType == val.split(",")[0] || item.MonitorObjectType == val.split(",")[1],
                        // );
                        // if (clickedDivision) {
                        //   filterList = filterList.filter(itm => {
                        //     if (itm.RegionCode) {
                        //       const RegionCode = itm.RegionCode.split(',');
                        //       if (RegionCode.includes(clickedDivision.RegionCode)) {
                        //         return itm;
                        //       }
                        //     }
                        //   });
                        // }
                        // this.renderEntMarkers(filterList);
                        this.setState({ selectValue: val },()=>{
                          this.getAllEntAndPoint();
                        });
                      }else if(val==5){
                        this.setState({ selectValue: val },()=>{
                          this.getAllEntAndPoint();
                        });
                      } else {
                        // let filterList = allEntAndPointList;
                        // if (clickedDivision) {
                        //   filterList = allEntAndPointList.filter(itm => {
                        //     if (itm.RegionCode) {
                        //       const RegionCode = itm.RegionCode.split(',');
                        //       if (RegionCode.includes(clickedDivision.RegionCode)) {
                        //         return itm;
                        //       }
                        //     }
                        //   });
                        // }
                        // this.renderEntMarkers(filterList);
                      }
                    }}
                  >
                    {/* <Option value="">全部</Option> */}
                    {/* <Option value="服务站">服务站</Option> */}
                    <Option value="1,2">企业</Option>
                    {/* <Option value="师">师</Option> */}
                    <Option value="5">空气站</Option>
                  </Select>
                )}
                {displayType === 0 && (
                  <Search
                    value={searchInputVal}
                    allowClear
                    onSearch={value => this.onSearch(value)}
                    onChange={e => {
                      this.setState({ searchInputVal: e.target.value });
                    }}
                    placeholder={selectValue==='1,2'?"请输入企业名称":'请输入空气站名称'}
                    className={styles.searchInput}
                  />
                )}
                {displayType === 0 &&
                //  (
                //   <div className={styles.divisionSelect}>
                //     <div
                //       className={styles.selectDivision}
                //       onClick={() => {
                //         this.setState({ toggleSelect: !this.state.toggleSelect });
                //       }}
                //     >
                //       <EnvironmentOutlined />
                //       <span>当前范围：{clickedDivision ? clickedDivision.title : '全部'}</span>
                //       {toggleSelect ? (
                //         <CaretUpOutlined className={styles.icon} />
                //       ) : (
                //           <CaretDownOutlined className={styles.icon} />
                //         )}
                //     </div>
                //     {toggleSelect && (
                //       <div className={styles.dropDownContent}>
                //         <ul>
                //           <li
                //             className={
                //               !clickedDivision ||
                //                 (clickedDivision && clickedDivision.title === '全部')
                //                 ? styles.current
                //                 : ''
                //             }
                //             onClick={() => {
                //               this.setState({ clickedDivision: undefined });
                //               this.renderEntMarkers(allEntAndPointList);
                //               this.props.dispatch({
                //                 type: 'newHome/updateState',
                //                 payload: {
                //                   level: INIT_LEVEL,
                //                   LEVEL: INIT_LEVEL,
                //                   regionCode: '660000000',
                //                   currentDivisionName: '',
                //                 },
                //               });
                //               setTimeout(() => {
                //                 this.reloadPageData();
                //               }, 0);
                //             }}
                //           >
                //             全部
                //           </li>
                //           {constructionCorpsList.map(item => (
                //             <li
                //               className={
                //                 clickedDivision &&
                //                 clickedDivision.title === item.title &&
                //                 styles.current
                //               }
                //               onClick={() => {
                //                 this.divisionClick(item);
                //               }}
                //             >
                //               {item.title}
                //             </li>
                //           ))}
                //         </ul>
                //       </div>
                //     )}
                //   </div>
                // )
                <div className={styles.divisionSelect}>
                <SdlCascader
                 style={{ width: '100%',textAlign:'left' }}
                 changeOnSelect
                 placeholder="请选择行政区"
                 selectType='2,是'
                 popupClassName='newHomeWrapCascaderPop'
                 value={this.state.echoRegionCode}//仅用于回显
                 onChange={val => {
                   this.setState({RegionCode:val? val[val.length-1] : '',echoRegionCode:val},()=>{
                    this.state.RegionCode? this.getAllEntAndPoint('region') : this.getAllEntAndPoint();

                   })
                            
                    }}
                 />
                 </div>
                }
                {/* { clickedDivision && (
                  <div
                    style={{
                      display: displayType === 1 ? 'none' : 'block',
                    }}
                    className={styles.shibox}
                  >
                    <span>{clickedDivision.title}</span>

                  </div>
                )
                } */}
              </div>
               <div className={styles.legendContent}>
                <div className={styles.legendBox}>
                  <ul>
                    {/* <li>
                      <CustomIcon type="icon-cangku" style={{ ...mapIconStyle, marginRight: 10 }} />
                      <span>服务站</span>
                    </li> */}
                    <li>
                      <EntIcon style={{ marginRight: 10 }} />
                      <span>企业</span>
                    </li>
                    {/* <li>
                      <CustomIcon type="icon-ditu" style={{ fontSize: 28, marginLeft: -3, marginRight: 10 }} />{' '}
                      <span>师</span>
                    </li> */}
                    <li>
                      <WaterOffline style={{ marginRight: 10 }} /> <span>废水</span>
                    </li>
                    <li>
                      <GasOffline style={{ marginRight: 10 }} /> <span>废气</span>
                    </li>
                    <li>
                      <CustomIcon
                        type="icon-fangwu"
                        style={{
                          fontSize: 24,
                          borderRadius: '50%',
                          background: '#fff',
                          boxShadow: '0px 0px 3px 2px #fff',
                          color: '#999',
                          marginRight: 10,
                        }}
                      />
                      空气站
                    </li>
                    <li>
                      <CustomIcon
                        type="icon-tingzhishangbao"
                        style={{
                          fontSize: 24,
                          borderRadius: '50%',
                          background: '#fff',
                          boxShadow: '0px 0px 3px 2px #fff',
                          color: '#999',
                          marginRight: 10,
                        }}
                      />
                      停运
                    </li>
                  </ul>
                </div>
                {displayType === 1 && (
                  <div className={styles.stateBox}>
                    <span style={{ backgroundColor: '#33c166' }}>在线</span>
                    <span style={{ backgroundColor: '#a29d9d' }}>离线</span>
                    <span style={{ backgroundColor: '#fe0100' }}>超标</span>
                    <span style={{ backgroundColor: '#ed9b43' }}>异常</span>
                  </div>
                )}
              </div> 
              <Map
                amapkey="c5cb4ec7ca3ba4618348693dd449002d"
                // plugins={plugins}
                // features={['bg', 'point', 'building']}
                id="mapId"
                events={this.amapEvents}
                zoom={8}
                mapStyle="amap://styles/normal"
                useAMapUI={!config.offlineMapUrl.domain}
                {...mapStaticAttribute}
              >
                {/* {!config.offlineMapUrl.domain && (
                  <MapUI
                    renderEnt={() => {
                      this.renderEntMarkers(this.props);
                    }}
                  />
                )} */}

                {this.drawPolygon()}
                <Markers
                  markers={this.state.markersList}
                  events={this.markersEvents}
                  render={this.renderMarker}
                // content={<span>111</span>}
                />
                {/* hover 提示 */}
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
                <InfoWindow
                  events={this.infoWindowEvents}
                  position={infoWindowPos}
                  visible={infoWindowVisible}
                  offset={[4, -35]}
                  autoMove
                  showShadow
                  closeWhenClickMap={false}
                // isCustom
                // content={this.infoWindowContent()}
                >
                  {this.infoWindowContent()}
                </InfoWindow>
                {searchResult && (
                  <InfoWindow
                    events={this.searchWindowEvent}
                    position={[searchResult.Longitude, searchResult.Latitude]}
                    visible={searchResult}
                    offset={[4, -40]}
                    autoMove
                    showShadow
                    closeWhenClickMap
                    isCustom
                  // content={this.infoWindowContent()}
                  className={styles.electmap}
                  >
                    {/* {searchResult.title} */}
                  </InfoWindow>
                )}
                {/* {
                  this.divisionInfoWindow()
                } */}
                {/* {
                  constructionCorpsList.map(item => {
                    return <InfoWindow
                      position={[item.Longitude, item.Latitude]}
                      visible={true}
                      isCustom={true}
                      offset={[5, -35]}
                    >
                      {item.Name}
                    </InfoWindow>
                  })
                } */}
              </Map>
            </div>
          </div >
        </Spin >
        { officeVisible && <OfficeModal title={modalTitle} SparePartsStationInfo={SparePartsStationInfo} SparePartsStationCode={SparePartsStationCode} />}
        {/* {true && <OfficeModal />} */}
        { siteDetailsVisible && <SiteDetailsModal data={currentClickObj} />}
      </div >
    );
  }
}

export default NewHome;
