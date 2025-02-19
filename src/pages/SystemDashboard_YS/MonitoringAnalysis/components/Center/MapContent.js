import React, { PureComponent } from 'react';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import { connect } from 'dva';
import styles from '@/pages/SystemDashboard_YS/styles.less';
import config from '@/config';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Radio, Space, Spin, Select, Col, Row } from 'antd';
import { adjustDuplicateCoordinates } from '@/pages/SystemDashboard_YS/CONST.js';
import SiteDetailsModal from '@/pages/newestHome/components/springModal/mapModal/SiteDetailsModal';

const legendList = [
  {
    name: '在线',
    color: '#2EEB9D',
    value: '1',
  },
  {
    name: '离线',
    color: '#C9C9C9',
    value: '0',
  },
  {
    name: '停产',
    color: '#836bfb',
    value: '4',
  },
  {
    name: '超标',
    color: '#FF3737',
    value: '2',
  },
  {
    name: '异常',
    color: '#FFCC00',
    value: '3',
  },
];
let aMap;

@connect(({ loading, sysDashboard }) => ({
  time: sysDashboard.time,
  level1MapData: sysDashboard.level1MapData,
  level4MapData: sysDashboard.level4MapData,
  levelOtherMapData: sysDashboard.levelOtherMapData,
  loading: loading.effects['sysDashboard/GetMapPointList'],
}))
class MapContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      regionCode: '',
      entCode: '',
      allEntList: [], // 所有企业
      selectedLegend: '', // 选中的图例
      markersList: [],
      currentPointList: [], // 排口列表
      entTitleShow: false, // 是否显示企业名称
      pointTitleShow: false, // 是否显示排口名称
      pointInfoWindowVisible: false, // 是否显示排口详情窗口
      pointInfoWindowPosition: {}, // 排口详情窗口位置
      currentPointInfo: {}, // 排口信息
      level: 4,
      mapAllDataList: [],
      CountAnalysis: {
        EntCount: 0,
        PointCount: 0,
      },
      // hoverEntTitleShow: false,
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
            // this.setState({
            //   hoverTitleShow: false,
            //   hoverEntTitleShow: true,
            //   hoverEntTitle: position.ParentName,
            //   hoverTitleLngLat: { latitude: position.latitude, longitude: position.longitude },
            // });
          }
          if ((level == 3 || level == 4) && pointInfoWindowVisible === false) {
            this.setState({
              hoverEntTitleShow: false,
              hoverTitleShow: true,
              hoverEntTitle: position.ParentName,
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
    // if (this.props.time !== prevProps.time) {
    //   this.loadPageData();
    // }
  }

  // 获取地图数据
  loadPageData = () => {
    const { time } = this.props;
    const { level, regionCode, entCode } = this.state;
    this.props.dispatch({
      type: 'sysDashboard/GetMapPointList',
      payload: {
        pointType: level === 4 ? 3 : level,
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        // beginTime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        // endTime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        this.handleMarkerDatas(res.list);
        if (level == 1) {
          this.setState({
            level1OverviewData: res.sum,
          });
          this.updateCardData(res.sum);
        } else if (level != 4) {
          this.updateCardData(res.sum);
        }
      },
    });
  };

  // 更新总览数据
  updateCardData = data => {
    this.props.dispatch({
      type: 'sysDashboard/updateState',
      payload: {
        MonitoringCountAnalysis: data,
      },
    });
  };

  // 根据级别，返回地图数据
  handleMarkerDatas = mapData => {
    // aMap.clearMap();
    // const { level1MapData, level4MapData, levelOtherMapData } = this.props;
    const { level, selectedLegend, currentPointList } = this.state;
    let markersList = [];
    switch (level) {
      case 1: // 行政区
      case 2: // 企业
        markersList = mapData.map(item => {
          return {
            position: {
              ...item,
            },
          };
        });
        break;
      case 3: // 排口
      case 4: // 所有排口
        // 根据选中图例显示排口
        let _mapData = [...mapData];
        if (selectedLegend) {
          _mapData = _mapData.filter(item => item.Status == selectedLegend);
        }
        markersList = _mapData.map(item => {
          if (item.Latitude && item.Longitude) {
            return {
              position: {
                ...item,
                latitude: item.Latitude,
                longitude: item.Longitude,
              },
            };
          } else {
            console.log('item', item);
          }
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
    let color = legendList.find(item => item.value == status).color;

    // switch (status) {
    //   case '0': // 离线
    //     color = legendList[1].color;
    //     break;
    //   case '1': // 在线
    //     color = legendList[0].color;
    //     break;
    //   case '2': // 超标
    //     color = legendList[1].color;
    //     break;
    //   case '4': // 停运
    //     color = legendList[2].color;
    //     break;
    // }

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
      <div className={styles.infoWindowContent} style={{ width: '21.25rem', minHeight: '15.5rem' }}>
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
          <div className={styles.tableList}>
            <h3>设备型号</h3>
            <ul className={styles.title}>
              <li>型号</li>
              <li>完成安装调试日期</li>
            </ul>
            <ul>
              <li>{currentPointInfo.SystemModelName}</li>
              <li>{currentPointInfo.LeaveDate}</li>
            </ul>
          </div>
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

  // 行政区点击
  onClickRegion = extData => {
    this.setState(
      {
        level: 2,
        regionCode: extData.position.regionCode,
      },
      () => {
        this.loadPageData();
        this.renderRegionBoundary(extData.position.regionName);
      },
    );
    this.props.dispatch({
      type: 'sysDashboard/updateState',
      payload: {
        level: 2,
        regionCode: extData.position.regionCode,
        regionInfo: extData.position,
      },
    });
  };

  // 企业点击
  onClickEnt = extData => {
    this.setState(
      {
        level: 3,
        entCode: extData.position.entCode,
      },
      () => {
        this.loadPageData();
      },
    );
    this.props.dispatch({
      type: 'sysDashboard/updateState',
      payload: {
        level: 3,
        entCode: extData.position.entCode,
        entInfo: extData.position,
      },
    });
  };

  // 返回按钮点击
  onGoback = () => {
    const { level, level1OverviewData } = this.state;
    const { level1MapData } = this.props;
    // 企业返回、全部监测点返回
    if (level === 2 || level === 4) {
      aMap.clearMap();
      this.setState({ level: 1, pointInfoWindowVisible: false, selectedLegend: '' }, () => {
        this.handleMarkerDatas(level1MapData);
        this.updateCardData(level1OverviewData);
      });

      this.props.dispatch({
        type: 'sysDashboard/updateState',
        payload: {
          level: 1,
        },
      });
    }

    // 企业下监测点返回企业
    if (level === 3) {
      this.setState({ level: 2, pointInfoWindowVisible: false }, () => {
        this.loadPageData();
      });
      this.props.dispatch({
        type: 'sysDashboard/updateState',
        payload: {
          level: 2,
        },
      });
    }
  };

  // 图例点击
  onLegendClick = value => {
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
        if (level4MapData.length) {
          this.handleMarkerDatas(level4MapData);
        } else {
          this.loadPageData();
        }
      },
    );
  };

  // 渲染地图点 窗体
  renderMarkers = extData => {
    const { position } = extData;
    const { showType, entTitleShow, pointTitleShow, isMassive, level } = this.state;

    if (level == 1 || level == 2) {
      let title = level == 1 ? position.regionName : position.entName;
      return (
        <div
          style={{
            position: 'relative',
            transform: `translate(-50%, ${'calc(-50% - .875rem)'})`,
            padding: '0 10px',
            cursor: 'text',
            width: '16.25rem',
            height: '10.625rem',
            background: `url(/SystemDashboard/regionTip.png)`,
            backgroundSize: '100% 100%',
            fontSize: '.875rem',
          }}
        >
          <div
            style={{
              opacity: 1,
              color: '#52F2FF',
              height: 'calc(100% - .75rem)',
            }}
          >
            <div
              className="textOverflow"
              style={{
                width: 'calc(100% - 1.75rem)',
                height: '1.75rem',
                lineHeight: '1.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              title={title}
              onClick={() => (level == 1 ? this.onClickRegion(extData) : this.onClickEnt(extData))}
            >
              {title}
            </div>
            <RightOutlined
              onClick={() => (level == 1 ? this.onClickRegion(extData) : this.onClickEnt(extData))}
              style={{
                color: '#4BF3F9',
                position: 'absolute',
                top: '.375rem',
                right: '.375rem',
                fontSize: '.75rem',
              }}
            />
            <Row
              style={{
                height: 'calc(100% - 2.25rem)',
                display: 'flex',
                fontWeight: 'bold',
                padding: '0 .625rem',
              }}
            >
              <Col
                span={8}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: '#00a3ff', fontSize: '1.25rem' }}>
                  {position.pointCount}
                  <span className={styles.overViewUnit}>个</span>
                </p>
                <p style={{ fontSize: '.8125rem', color: '#fff' }}>排口数量</p>
              </Col>
              <Col
                span={8}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: '#2EEB9D', fontSize: '1.25rem' }}>
                  {position.normalCount}
                  <span className={styles.overViewUnit}>个</span>
                </p>
                <p style={{ fontSize: '.8125rem', color: '#fff' }}>在线排口</p>
              </Col>
              <Col
                span={8}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: '#C9C9C9', fontSize: '1.25rem' }}>
                  {position.unLineCount}
                  <span className={styles.overViewUnit}>个</span>
                </p>
                <p style={{ fontSize: '.8125rem', color: '#fff' }}>离线排口</p>
              </Col>
              <Col
                span={8}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: '#FF3737', fontSize: '1.25rem' }}>
                  {position.overCount}
                  <span className={styles.overViewUnit}>个</span>
                </p>
                <p style={{ fontSize: '.8125rem', color: '#fff' }}>超标排口</p>
              </Col>
              <Col
                span={8}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: '#FFCC00', fontSize: '1.25rem' }}>
                  {position.exceptionCount}
                  <span className={styles.overViewUnit}>个</span>
                </p>
                <p style={{ fontSize: '.8125rem', color: '#fff' }}>异常排口</p>
              </Col>
              <Col
                span={8}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: '#836bfb', fontSize: '1.25rem' }}>
                  {position.stopCount}
                  <span className={styles.overViewUnit}>个</span>
                </p>
                <p style={{ fontSize: '.8125rem', color: '#fff' }}>停产排口</p>
              </Col>
            </Row>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span
              className={styles.circle}
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                width: '.625rem',
                height: '.625rem',
                background: 'rgba(0, 141, 253, 1)',
                boxShadow: ' 0 0 .25rem .25rem rgba(0, 141, 253, .1)',
                borderRadius: '50%',
              }}
            ></span>
          </div>
        </div>
      );
    } else if (level == 3 || level == 4) {
      //监测点
      return (
        <div style={{ position: 'relative', marginTop: '1.5rem' }}>
          <span
            onClick={() => {
              let { position } = extData;
              this.setState({
                // entTitleShow: false,
                // pointInfoWindowPosition: [position.longitude, position.latitude],
                // pointInfoWindowVisible: true,
                currentPointInfo: position,
              });

              this.props.dispatch({
                type: 'newestHome/updateState',
                payload: { siteDetailsVisible: true },
              });
            }}
          >
            {this.getPointIcon(extData.position.Status)}
          </span>
          {pointTitleShow ? (
            <div className={styles.pointTitlePopSty}>
              <div className={styles.titlePopSty}>
                <div>{extData.position.ParentName}</div>
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
    const { level1MapData, level4MapData, onFullScreenChange } = this.props;
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
          if (level1MapData.length) {
            this.handleMarkerDatas(level1MapData);
          } else {
            this.loadPageData();
          }
        });
        break;
      case '展示监测点':
        aMap.clearMap();
        this.setState(
          {
            level: 4,
          },
          () => {
            if (level4MapData.length) {
              this.handleMarkerDatas(level4MapData);
            } else {
              this.loadPageData();
            }
          },
        );
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
      fullScreen,
      hoverTitleShow,
      hoverTitleLngLat,
      pointInfoWindowPosition,
      pointInfoWindowVisible,
      level,
      selectedLegend,
      currentPointInfo,
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
          </Map>
          {level !== 1 && level !== 4 && (
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

        <SiteDetailsModal
          wrapClassName="fullScreenModal"
          data={{ ...currentPointInfo, PollutantType: 2 }}
          tabList={['监控数据', '', '', '', '视频预览', '超标数据', '异常数据', '', '']}
        />
      </div>
    );
  }
}
export default MapContent;
