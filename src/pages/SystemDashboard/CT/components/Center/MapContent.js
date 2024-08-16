import React, { PureComponent } from 'react';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import { connect } from 'dva';
import styles from '@/pages/SystemDashboard/styles.less';
import config from '@/config';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Radio, Space, Spin, Select, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import PageLoading from '@/components/PageLoading';
import {
  EntIcon,
  GasIcon,
  GasOffline,
  GasNormal,
  GasExceed,
  GasAbnormal,
  GasStop,
} from '@/utils/icon';
import { adjustDuplicateCoordinates } from '@/pages/SystemDashboard/CONST.js';

const legendList = [
  {
    name: '安装完成',
    color: 'darkorange',
    value: '4',
  },
  {
    name: '调试完成',
    color: 'skyblue',
    value: '7',
  },
  {
    name: '验收完成',
    color: '#2EEB9D',
    value: '10',
  },
];

let aMap;

@connect(({ loading, sysDashboard }) => ({
  time: sysDashboard.time,
  loading: loading.effects['sysDashboard/GetMapPointList'],
}))
class MapContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: moment(),
      allEntList: [], // 所有企业
      selectedLegend: '', // 选中的图例
      markersList: [],
      currentEntList: [], // 企业列表
      currentPointList: [], // 排口列表

      currentRegionData: [], // 选中的行政区数据
      currentEntData: [], // 选中的企业数据

      entTitleShow: false, // 是否显示企业名称
      pointTitleShow: false, // 是否显示排口名称
      pointInfoWindowVisible: false, // 是否显示排口详情窗口
      pointInfoWindowPosition: {}, // 排口详情窗口位置
      currentPointInfo: {}, // 排口信息
      level: 1,
      mapAllDataList: [],
      CountAnalysis: {
        // 总览：所有行政区数据
        EntCount: 0,
        PointCount: 0,
      },
      hoverEntTitleShow: false,
      hoverTitleShow: false, //监测点hover 气泡卡片
      hoverTitleLngLat: {},
      hoverEntTitle: '',
      hoverPointTitle: '',
    };
    this.mapEvents = {
      created(m) {
        aMap = m;
        if (m) {
          m.setFitView();
          if (config.offlineMapUrl.domain) {
            var Layer = new window.aMap.TileLayer({
              zIndex: 2,
              getTileUrl: function(x, y, z) {
                return config.offlineMapUrl.domain + '/gaode/' + z + '/' + x + '/' + y + '.png';
              },
            });
            Layer.setMap(m);
          }
        }
      },
    };

    // markers事件
    this.markersEvents = {
      created: allMarkers => {
        aMap.setFitView(allMarkers);
      },
      clickable: true,
      mouseover: (MapsOption, marker) => {
        //鼠标移入地图容器内时触发
        const { level, pointInfoWindowVisible } = this.state;
        console.log('marker', marker);
        const position = marker && marker.De && marker.De.extData.position;
        if (position) {
          if (level == 2) {
            this.setState({
              hoverTitleShow: false,
              hoverEntTitleShow: true,
              hoverEntTitle: position.EntName,
              hoverTitleLngLat: { latitude: position.latitude, longitude: position.longitude },
            });
          }
          if ((level == 3 || level == 4) && pointInfoWindowVisible === false) {
            this.setState({
              hoverEntTitleShow: false,
              hoverTitleShow: true,
              hoverEntTitle: position.EntName,
              hoverPointTitle: position.PointName,
              hoverTitleLngLat: { latitude: position.latitude, longitude: position.longitude },
            });
          }
        }
      },
      mouseout: (MapsOption, marker) => {
        //鼠标移出地图容器内时触发
        const { level, pointInfoWindowVisible } = this.state;
        if ((level == 2 || level == 3 || level == 4) && pointInfoWindowVisible === false) {
          const position = marker.De.extData.position;
          this.setState({ hoverTitleShow: false, hoverEntTitleShow: false });
        }
      },
    };
  }

  componentDidMount() {
    window._AMapSecurityConfig = {
      securityJsCode: config.securityJsCode,
    };
    this.loadPageData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.time !== prevProps.time) {
      this.loadPageData();
    }
  }

  // 获取地图数据
  loadPageData = () => {
    const { time } = this.props;
    this.props.dispatch({
      type: 'sysDashboard/GetInstallationDebuggingMap',
      payload: {
        bTime: moment(time[0])
          .startOf('year')
          .format('YYYY-MM-DD HH:mm:ss'),
        eTime: moment(time[1])
          .endOf('year')
          .format('YYYY-MM-DD HH:mm:ss'),
      },
      callback: res => {
        let allEntList = [];
        // 所有企业
        res.rtnList.map(item => {
          item.EntList.map(ent => {
            allEntList.push({
              ...ent,
              latitude: ent.EntLatitude,
              longitude: ent.EntLongitude,
            });
          });
        });
        this.setState(
          {
            allEntList: allEntList,
            CountAnalysis: res.CountAnalysis,
            mapAllDataList: res.rtnList,
          },
          () => {
            this.handleMarkerDatas();
          },
        );
      },
    });
  };

  // 根据级别，返回地图数据
  handleMarkerDatas = () => {
    // aMap.clearMap();
    const {
      level,
      currentEntList,
      currentPointList,
      selectedLegend,
      CountAnalysis,
      currentRegionData,
      currentEntData,
    } = this.state;
    let markersList = [];
    switch (level) {
      case 1:
        // 所有行政区
        markersList = this.state.mapAllDataList.map(item => {
          return {
            position: {
              ...item,
              latitude: item.ProviceLatitude,
              longitude: item.ProviceLongitude,
            },
          };
        });
        this.updateOverviewData(CountAnalysis);
        break;
      case 2:
        // 行政区下企业
        markersList = currentEntList.map(item => {
          return {
            position: {
              ...item,
              latitude: item.EntLatitude,
              longitude: item.EntLongitude,
            },
          };
        });
        this.updateOverviewData(currentRegionData);
        break;
      case 3:
        // 企业下排口
        markersList = currentPointList.map(item => {
          return {
            position: {
              ...item,
              latitude: item.PointLatitude,
              longitude: item.PointLongitude,
            },
          };
        });
        this.updateOverviewData(currentEntData);
        break;
      case 4:
        // 所有排口
        this.state.mapAllDataList.map(item => {
          item.EntList.map(ent => {
            let _mapData = [...ent.PointList];
            if (selectedLegend) {
              _mapData = _mapData.filter(item => item.ServiceId === selectedLegend);
            }
            _mapData.map(point => {
              markersList.push({
                position: {
                  ...point,
                  latitude: point.PointLatitude,
                  longitude: point.PointLongitude,
                },
              });
            });
          });
        });
        break;
    }
    markersList = adjustDuplicateCoordinates(markersList);
    this.setState(
      {
        markersList: markersList,
      },
      () => {
        // const timer = setInterval(() => {
        //   if (aMap) {
        //     aMap.setFitView();
        //     clearInterval(timer);
        //   }
        // }, 0);
      },
    );
  };

  getPointIcon = status => {
    let color = '';

    switch (status) {
      case '4': // 安装
        color = legendList[0].color;
        break;
      case '7': // 调试
        color = legendList[1].color;
        break;
      case '10': // 验收
        color = legendList[2].color;
        break;
    }

    return (
      <div
        style={{
          width: 16,
          height: 16,
          background: color,
          boxShadow: '0px 0px 2px 0px #000000',
          borderRadius: '50%',
        }}
      ></div>
    );
  };

  infoWindowContent = () => {
    const { currentPointInfo } = this.state;
    let imgName = '/gasInfoWindow.png';

    return (
      <div className={styles.infoWindowContent} style={{ width: 340, minHeight: 156 }}>
        <>
          <div className={styles.header}>
            <h2>
              {currentPointInfo.EntName} - {currentPointInfo.PointName}
            </h2>
          </div>
          <div className={styles.desc}>
            <div className={styles['desc-l']}>
              <h3>站点信息</h3>
              <p className="textOverflow" style={{ width: 160 }} title={currentPointInfo.CityName}>
                <span>
                  <i></i>区域：
                </span>
                {currentPointInfo.CityName}
              </p>
              <p>
                <span>
                  <i></i>经度：
                </span>
                {currentPointInfo.PointLongitude}
              </p>
              <p>
                <span>
                  <i></i>纬度：
                </span>
                {currentPointInfo.PointLatitude}
              </p>
            </div>
            <div className={styles['desc-r']}>
              <img src={imgName} alt="" width="100%" height="100%" />
            </div>
          </div>
          {/* <div className={styles.tableList}>
            <h3>设备型号</h3>
            <ul className={styles.title}>
              <li>型号</li>
              <li>完成安装调试日期</li>
            </ul>
            <ul>
              <li>{currentPointInfo.SystemModelName}</li>
              <li>{currentPointInfo.LeaveDate}</li>
            </ul>
          </div> */}
        </>
      </div>
    );
  };

  // 绘制行政区边界
  renderRegionBoundary = regionName => {
    console.log('regionName', regionName);
    // aMap.clearMap();
    AMap.plugin('AMap.DistrictSearch', () => {
      const districtSearch = new AMap.DistrictSearch({
        subdistrict: 0, //获取边界不需要返回下级行政区
        extensions: 'all', //返回行政区边界坐标组等具体信息
        level: 'province', //查询行政级别为 省
      });
      const regName = regionName == '新疆生产建设兵团' ? '新疆维吾尔自治区' : regionName;
      // 搜索所有省/直辖市信息
      districtSearch.search(regName, function(status, result) {
        // 查询成功时，result即为对应的行政区信息
        if (status === 'complete') {
          const bounds = result?.districtList[0]?.boundaries;
          // 创建省份轮廓覆盖物
          const provinceOutline = new AMap.Polygon({
            path: bounds?.[0] ? bounds : [],
            strokeColor: '#faad14', // 初始轮廓颜色
            strokeOpacity: 1,
            strokeWeight: 2,
            fillOpacity: 0,
            // fillColor: '#fa541c',
          });
          // 将省份轮廓覆盖物添加到地图上
          provinceOutline.setMap(aMap);
          // 创建 CanvasLayer 图层
          var canvasLayer = new AMap.CanvasLayer();
        }
      });
    });
  };

  // 更新总览数据
  updateOverviewData = data => {
    this.props.dispatch({
      type: 'sysDashboard/updateState',
      payload: {
        CTCountAnalysis: {
          EntCount: data.EntCount,
          PointCount: data.PointCount,
          GuideInstallationCount: data.GuideInstallationCount,
          DebuggingCount: data.DebuggingCount,
          CheckedCount: data.CheckedCount,
        },
      },
    });
  };

  // 行政区点击
  onClickRegion = extData => {
    this.setState(
      {
        level: 2,
        currentEntList: extData.position.EntList,
        currentRegionData: extData.position,
      },
      () => {
        this.handleMarkerDatas();
        this.renderRegionBoundary(extData.position.ProviceName);
      },
    );
  };

  // 企业点击
  onClickEnt = extData => {
    this.setState(
      {
        level: 3,
        // entTitleShow: false,
        hoverEntTitleShow: false,
        currentPointList: extData.position.PointList,
        currentEntData: extData.position,
      },
      () => {
        this.handleMarkerDatas();
      },
    );
  };

  // 返回按钮点击
  onGoback = () => {
    const { level } = this.state;
    if (level === 2 || level === 4) {
      aMap.clearMap();
      this.setState({ level: 1, pointInfoWindowVisible: false, selectedLegend: '' }, () => {
        this.handleMarkerDatas();
      });
    }
    if (level === 3) {
      this.setState({ level: 2, pointInfoWindowVisible: false }, () => {
        this.handleMarkerDatas();
      });
    }
  };

  // 图例点击
  onLegendClick = value => {
    aMap.clearMap();
    const { selectedLegend } = this.state;
    const { level4MapData } = this.props;

    let selectedLegend_temp = value;
    if (value === selectedLegend) {
      selectedLegend_temp = '';
    }
    this.setState(
      {
        selectedLegend: selectedLegend_temp,
        level: 4,
      },
      () => {
        this.handleMarkerDatas(level4MapData);
      },
    );
  };

  renderMarkers = extData => {
    const { position } = extData;
    const { showType, entTitleShow, pointTitleShow, isMassive, level } = this.state;

    if (level == 1 || level == 2) {
      let title = level == 1 ? position.ProviceName : position.EntName;
      return (
        <div
          style={{
            position: 'relative',
            transform: `translate(-50%, ${'calc(-50% - 14px)'})`,
            padding: '0 10px',
            cursor: 'text',
            width: 220,
            height: 170,
            background: `url(/SystemDashboard/regionTip.png)`,
            backgroundSize: '100% 100%',
          }}
        >
          <div
            style={{
              opacity: 1,
              color: '#52F2FF',
              height: 'calc(100% - 12px)',
            }}
          >
            <div
              className="textOverflow"
              style={{
                width: 'calc(100% - 28px)',
                height: 28,
                lineHeight: '28px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              title={title}
              onClick={() => {
                level == 1 ? this.onClickRegion(extData) : this.onClickEnt(extData);
              }}
            >
              {title}
            </div>
            <RightOutlined
              onClick={() => {
                level == 1 ? this.onClickRegion(extData) : this.onClickEnt(extData);
              }}
              style={{ color: '#4BF3F9', position: 'absolute', top: 6, right: 6, fontSize: 12 }}
            />
            <Row
              style={{
                height: 'calc(100% - 36px)',
                display: 'flex',
                fontWeight: 'bold',
                // padding: '0 10px',
              }}
            >
              <Col
                span={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                <p style={{ color: '#00a3ff', fontSize: 20 }}>
                  {position.PointCount}
                  <span className={styles.overViewUnit}>个</span>
                </p>
                <p style={{ fontSize: 13, color: '#fff' }}>排口数量</p>
              </Col>
              <Col
                span={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                <p style={{ color: '#FF3737', fontSize: 20 }}>
                  {position.GuideInstallationCount}
                  <span className={styles.overViewUnit}>套</span>
                </p>
                <p style={{ fontSize: 13, color: '#fff' }}>安装完成设备</p>
              </Col>
              <Col
                span={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                <p style={{ color: '#2EEB9D', fontSize: 20 }}>
                  {position.DebuggingCount}
                  <span className={styles.overViewUnit}>套</span>
                </p>
                <p style={{ fontSize: 13, color: '#fff' }}>调试完成设备</p>
              </Col>
              <Col
                span={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                <p style={{ color: '#FFCC00', fontSize: 20 }}>
                  {position.CheckedCount}
                  <span className={styles.overViewUnit}>套</span>
                </p>
                <p style={{ fontSize: 13, color: '#fff' }}>验收完成设备</p>
              </Col>
            </Row>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span
              className={styles.circle}
              style={{
                display: 'inline-block',
                marginTop: 16,
                width: 10,
                height: 10,
                background: 'rgba(0, 141, 253, 1)',
                boxShadow: ' 0 0 4px 4px rgba(0, 141, 253, .1)',
                borderRadius: '50%',
              }}
            ></span>
          </div>
        </div>
      );
    } else if (level == 3 || level == 4) {
      //监测点
      return (
        <div style={{ position: 'relative', marginTop: 24 }}>
          <span
            onClick={() => {
              let { position } = extData;
              this.setState({
                entTitleShow: false,
                pointInfoWindowPosition: [position.longitude, position.latitude],
                pointInfoWindowVisible: true,
                currentPointInfo: position,
              });
            }}
          >
            {this.getPointIcon(extData.position.ServiceId)}
          </span>
          {pointTitleShow ? (
            <div className={styles.pointTitlePopSty}>
              <div className={styles.titlePopSty}>
                <div>{extData.position.EntName}</div>
                <div>{extData.position.PointName}</div>
              </div>
            </div>
          ) : null}
        </div>
      );
    }
  };

  operationChange = (text, mapProps) => {
    const map = aMap;
    const {
      regionMarkers,
      selectPointMarkers,
      entTitleShow,
      pointTitleShow,
      markersList,
      mapBtnStatusIndex,
      level,
    } = this.state;
    const { onFullScreenChange } = this.props;
    if (!map) {
      console.log('组件必须作为 Map 的子组件使用');
      return;
    }
    switch (text) {
      case '放大':
        map.zoomIn();
        break;
      case '缩小':
        map.zoomOut();
        break;
      case '展示企业': //行政区
        // this.setState({ backIconGo: true, mapBtnStatusIndex: -1 });
        // this.loadRegionMarkerData(regionMarkers);
        aMap.clearMap();
        this.setState({ level: 1, pointInfoWindowVisible: false, selectedLegend: '' }, () => {
          this.handleMarkerDatas();
        });
        break;
      case '展示监测点':
        aMap.clearMap();
        this.setState({ level: 4 }, () => {
          this.handleMarkerDatas();
        });
        break;
      case '展示/隐藏名称':
        if (level == 2) {
          this.setState({
            entTitleShow: !entTitleShow,
            markersList: [...markersList],
          });
        }
        if (level == 3 || level == 4) {
          this.setState({
            pointTitleShow: !pointTitleShow,
            markersList: [...markersList],
          });
        }
        break;
      case '隐藏名称':
        if (level == 2 && entTitleShow) {
          this.setState({ entTitleShow: false, markersList: [...markersList] });
        }
        if ((level == 3 || level == 4) && pointTitleShow) {
          this.setState({ pointTitleShow: false, markersList: [...markersList] });
        }
        break;
      case '全屏':
        this.setState({ fullScreen: true }, () => {
          onFullScreenChange(true);
          aMap.setFitView();
          aMap.setZoom(5);
        });
        break;
      case '退出全屏':
        this.setState({ fullScreen: false }, () => {
          onFullScreenChange(false);
          aMap.setFitView();
        });
        break;
    }
  };

  RightIconMapComponent = () => {
    const { level, fullScreen } = this.state;
    const operationBtnArr = [
      {
        text: '展示企业',
        url:
          level == 1
            ? '/SystemDashboard/map/toolEntActive.png'
            : '/SystemDashboard/map/toolEnt.png',
      },
      {
        text: '展示监测点',
        url:
          level == 4
            ? '/SystemDashboard/map/toolPointActive.png'
            : '/SystemDashboard/map/toolPoint.png',
      },
      { text: '展示/隐藏名称', url: '/SystemDashboard/map/toolShowText.png' },
      { text: '放大', url: '/SystemDashboard/map/zoomIn.png' },
      { text: '缩小', url: '/SystemDashboard/map/zoomOut.png' },
      {
        text: fullScreen ? '退出全屏' : '全屏',
        url: fullScreen ? '/SystemDashboard/map/contract.png' : '/SystemDashboard/map/expand.png',
      },
    ];
    return (
      <div className={styles.mapOperationBtn}>
        {operationBtnArr.map((item, index) => {
          return (
            <div
              className={styles.btnItem}
              onClick={() => {
                this.operationChange(item.text);
              }}
            >
              <img title={item.text} src={item.url} />
            </div>
          );
        })}
      </div>
    );
  };
  render() {
    const {
      markersList,
      hoverEntTitle,
      hoverPointTitle,
      hoverTitleShow,
      hoverTitleLngLat,
      level,
      selectedLegend,
      pointInfoWindowPosition,
      pointInfoWindowVisible,
      fullScreen,
    } = this.state;
    const { loading } = this.props;
    return (
      <div className={`${styles.mapWrapper} ${fullScreen ? styles.fullScreen : ''}`}>
        <Spin spinning={!!loading}>
          <Map
            resizeEnable={true}
            events={this.mapEvents}
            mapStyle="amap://styles/6daa80e94c53325ff909a31f3d3d8809"
            amapkey={'1440c67033e5ede0f3a068605de5fb5f'}
            // center={mapCenter}
          >
            {this.RightIconMapComponent()}
            <Markers
              markers={markersList}
              render={this.renderMarkers}
              events={this.markersEvents}
              extData={markersList}
              // useCluster
            />
            <InfoWindow //监测点 hover
              visible={hoverTitleShow}
              position={hoverTitleLngLat}
              autoMove
              offset={false ? [10, -5] : [0, -10]}
              className={styles.titleInfoWindow}
            >
              <div style={{ whiteSpace: 'nowrap' }}>企业名称：{hoverEntTitle}</div>
              <div style={{ paddingTop: 3, whiteSpace: 'nowrap' }}>
                监测点名称：{hoverPointTitle}
              </div>
            </InfoWindow>
            <InfoWindow
              className={styles.infoWindowContent}
              position={pointInfoWindowPosition}
              visible={pointInfoWindowVisible}
              offset={false ? [10, -5] : [4, -10]}
              autoMove
              showShadow
              closeWhenClickMap={false}
            >
              {this.infoWindowContent()}
              <span
                onClick={() => {
                  this.setState({ pointInfoWindowVisible: false });
                }}
                style={{ position: 'absolute', cursor: 'pointer', top: 0, right: 8, fontSize: 18 }}
              >
                ×
              </span>
            </InfoWindow>
          </Map>
          {level !== 1 && (
            <div className={styles.goback} onClick={() => this.onGoback()}>
              <img src="/homeMapBack.png" />
              <div>返回</div>
            </div>
          )}
          <div className={styles.legend}>
            {legendList.map(item => {
              return (
                <div
                  className={`${styles.legendItem} ${
                    selectedLegend === item.value ? styles.active : ''
                  }`}
                  style={{
                    color: selectedLegend === item.value ? item.color : '',
                    borderColor: selectedLegend === item.value ? item.color : '',
                  }}
                  onClick={() => this.onLegendClick(item.value)}
                >
                  <i style={{ background: item.color }}></i>
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </Spin>
      </div>
    );
  }
}
export default MapContent;
