import React, { PureComponent } from 'react';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import { connect } from 'dva';
import styles from '@/pages/SystemDashboard/styles.less';
import config from '@/config';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Radio, Space, Spin, Tooltip, Col, Row, Descriptions } from 'antd';
import moment from 'moment';
import CluesListModal from '@/pages/AbnormalIdentifyModel/Home/ModalPage/CluesListModal.js';
import { adjustDuplicateCoordinates } from '@/pages/SystemDashboard/CONST.js';

const legendList = [
  {
    name: '严重异常',
    color: '#FF3737',
    value: '4',
    description: '严重影响数据质量，动机定义明确，影响恶劣的',
  },
  {
    name: '重点异常',
    color: 'darkorange',
    value: '3',
    description: '影响数据质量，无法判断明显动机，非正常运行的',
  },
  {
    name: '一般异常',
    color: 'gold',
    value: '2',
    description: '对数据质量影响较小，但仍需要解决的',
  },
  {
    name: '提示类异常',
    color: 'skyblue',
    value: '1',
    description: '不影响数据质量，属于管理不规范的',
  },
  {
    name: '无异常',
    color: '#2eeb9d',
    value: '',
    description: '模型监测没有任何问题',
  },
];
let aMap;

@connect(({ loading, sysDashboard, AbnormalIdentifyModel }) => ({
  warningForm: AbnormalIdentifyModel.warningForm,
  time: sysDashboard.time,
  level1MapData: sysDashboard.level1MapData,
  level4MapData: sysDashboard.level4MapData,
  levelOtherMapData: sysDashboard.levelOtherMapData,
  loading: loading.effects['sysDashboard/GetMapPointInfo'],
}))
class MapContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      regionCode: '',
      entCode: '',
      allEntList: [], // 所有企业
      selectedLegend: undefined, // 选中的图例
      markersList: [],
      currentPointList: [], // 排口列表
      entTitleShow: false, // 是否显示企业名称
      pointTitleShow: false, // 是否显示排口名称
      pointInfoWindowVisible: false, // 是否显示排口详情窗口
      pointInfoWindowPosition: {}, // 排口详情窗口位置
      currentPointInfo: {}, // 排口信息
      level: 1,
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

      // 模型卡片数据
      level1CardsData: {
        modalCountAnalysis: {
          EntCount: 0,
          PointCount: 0,
          NormalCount: 0,
          ExcepCount: 0,
        },
        modalActionList: [],
        modalLevelList: [],
        modalTypeList: [],
        modalRates: {
          ExcepRate: 0,
          RectRate: 0,
          CheckRate: 0,
        },
      },
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
    const { level, regionCode, entCode } = this.state;
    this.props.dispatch({
      type: 'sysDashboard/GetMapPointInfo',
      payload: {
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        pLeve: level,
        btime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        etime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        let cardsData = {
          modalCountAnalysis: {
            EntCount: res.EntCount,
            PointCount: res.PointCount,
            NormalCount: res.NormalCount,
            ExcepCount: res.ExcepCount,
          },
          modalActionList: res.ActionList,
          modalLevelList: res.LevelList,
          modalTypeList: res.TypeList,
          modalRates: {
            ExcepRate: res.ExcepRate,
            RectRate: res.RectRate,
            CheckRate: res.CheckRate,
          },
        };
        if (level == 1) {
          this.setState({
            level1CardsData: cardsData,
          });
          this.updateCardData(cardsData);
        } else if (level != 4) {
          this.updateCardData(cardsData);
        }

        this.handleMarkerDatas(res.list);
      },
    });
  };

  // 更新页面数据
  updateCardData = data => {
    this.props.dispatch({
      type: 'sysDashboard/updateState',
      payload: { ...data },
    });
  };

  // 根据级别，返回地图数据
  handleMarkerDatas = mapData => {
    // aMap.clearMap();
    // const { level1MapData, level4MapData, levelOtherMapData } = this.props;
    console.log('mapData', mapData);
    const { level, selectedLegend, allMarkers } = this.state;
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
        if (selectedLegend !== undefined) {
          _mapData = _mapData.filter(item => item.Level === selectedLegend);
        }
        markersList = _mapData.map(item => {
          return {
            position: {
              ...item,
              latitude: item.PoinLatitudetName,
              longitude: item.Longitude,
            },
            zIndex: item.Level,
          };
        });
        break;
    }
    markersList = adjustDuplicateCoordinates(markersList, 0.00002);
    this.setState(
      {
        markersList: markersList,
      },
      () => {
        // const timer = setInterval(() => {
        //   if (aMap) {
        //     console.log('allMarkers', allMarkers)
        //     aMap.setFitView(allMarkers);
        //     clearInterval(timer);
        //   }
        // }, 0);
      },
    );
  };

  getPointIcon = data => {
    let status = data.Level;
    let count = 0;
    let color = '';

    switch (status) {
      case '4': // 严重异常
        color = legendList[0].color;
        count = data['严重异常'];
        break;
      case '3': // 重点异常
        color = legendList[1].color;
        count = data['重点异常'];
        break;
      case '2': // 一般异常
        color = legendList[2].color;
        count = data['一般异常'];
        break;
      case '1': // 提示类异常
        color = legendList[3].color;
        count = data['提示类异常'];
        break;
      case '': // 无异常
        color = legendList[4].color;
        break;
    }

    return (
      <div
        style={{
          width: 24,
          height: 24,
          lineHeight: '24px',
          background: color,
          boxShadow: '0px 0px 2px 0px #000000',
          borderRadius: '50%',
          textAlign: 'center',
          color: '#484020',
        }}
      >
        {/* 无异常不显示数量 */}
        {status !== '' ? count : ''}
      </div>
    );
  };

  infoWindowContent = () => {
    const { currentPointInfo } = this.state;
    let imgName = '/gasInfoWindow.png';

    return (
      <div className={styles.infoWindowContent} style={{ width: 340, minHeight: 248 }}>
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
      },
    });
  };

  // 排口点击
  onClickPoint = extData => {
    const { time } = this.props;

    // 进入线索列表，传入时间、场景类型、企业、污染物
    this.updateCluesListFormState({
      date: [],
      date1: time,
      EntCode: extData.position.EntCode,
      DGIMN: extData.position.DGIMN,
      pageSize: 20,
      pageIndex: 1,
    });
  };

  // 更新异常线索清单model状态
  updateCluesListFormState = params => {
    const { warningForm, dispatch } = this.props;
    dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        warningForm: {
          ...warningForm,
          all: {
            ...warningForm['all'],
            rowKey: undefined,
            scrollTop: 0,
            ...params,
          },
        },
      },
    });
    setTimeout(() => {
      this.setState({
        isModalOpen: true,
      });
    }, 0);
  };

  // 返回按钮点击
  onGoback = () => {
    const { level, level1CardsData } = this.state;
    const { level1MapData } = this.props;
    // 企业返回、全部监测点返回
    if (level === 2 || level === 4) {
      aMap.clearMap();
      this.setState({ level: 1, pointInfoWindowVisible: false, selectedLegend: undefined }, () => {
        this.handleMarkerDatas(level1MapData);
        this.updateCardData(level1CardsData);
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
      selectedLegend_temp = undefined;
    }
    this.setState(
      {
        selectedLegend: selectedLegend_temp,
        level: 4,
      },
      () => {
        aMap.clearMap();
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
            transform: `translate(-50%, ${'calc(-50% - 14px)'})`,
            padding: '0 10px',
            cursor: 'text',
            width: 200,
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
              onClick={() => (level === 1 ? this.onClickRegion(extData) : this.onClickEnt(extData))}
            >
              {title}
            </div>
            <RightOutlined
              onClick={() => (level === 1 ? this.onClickRegion(extData) : this.onClickEnt(extData))}
              style={{ color: '#4BF3F9', position: 'absolute', top: 6, right: 6, fontSize: 12 }}
            />
            <Row
              style={{
                height: 'calc(100% - 36px)',
                display: 'flex',
                fontWeight: 'bold',
                padding: '0 10px',
              }}
            >
              <Col
                span={14}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: '#FF3737', fontSize: 20 }}>{position['严重异常']}</p>
                <p style={{ fontSize: 13, color: '#fff' }}>严重异常</p>
              </Col>
              <Col
                span={10}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: 'darkorange', fontSize: 20 }}>{position['重点异常']}</p>
                <p style={{ fontSize: 13, color: '#fff' }}>重点异常</p>
              </Col>
              <Col
                span={14}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: 'gold', fontSize: 20 }}>{position['一般异常']}</p>
                <p style={{ fontSize: 13, color: '#fff' }}>一般异常</p>
              </Col>
              <Col
                span={10}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ color: 'skyblue', fontSize: 20 }}>{position['提示类异常']}</p>
                <p style={{ fontSize: 13, color: '#fff' }}>提示类异常</p>
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
        <div style={{ position: 'relative', marginTop: 24, zIndex: extData.position.Level }}>
          <span
            onClick={() => {
              this.onClickPoint(extData);
            }}
          >
            {this.getPointIcon(extData.position)}
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
        this.setState(
          { level: 1, pointInfoWindowVisible: false, selectedLegend: undefined },
          () => {
            this.handleMarkerDatas(level1MapData);
          },
        );
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
      hoverTitleShow,
      hoverTitleLngLat,
      level,
      selectedLegend,
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
            {/* <InfoWindow //企业 hover
              visible={hoverEntTitleShow}
              position={hoverTitleLngLat}
              autoMove
              offset={false ? [10, -5] : [4, -10]}
              className={styles.titleInfoWindow}
            >
              <div style={{ whiteSpace: 'nowrap' }}>企业名称：{hoverEntTitle}</div>
            </InfoWindow> */}
            <InfoWindow //监测点 hover
              visible={hoverTitleShow}
              position={hoverTitleLngLat}
              autoMove
              offset={false ? [10, -5] : [2, -10]}
              className={styles.titleInfoWindow}
            >
              <div style={{ whiteSpace: 'nowrap' }}>企业名称：{hoverEntTitle}</div>
              <div style={{ paddingTop: 3, whiteSpace: 'nowrap' }}>
                监测点名称：{hoverPointTitle}
              </div>
            </InfoWindow>
            {/* <InfoWindow
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
            </InfoWindow> */}
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
                <Tooltip color="#073783" placement="left" title={item.description}>
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
                </Tooltip>
              );
            })}
          </div>
        </Spin>

        <CluesListModal
          open={this.state.isModalOpen}
          onCancel={() => this.setState({ isModalOpen: false })}
        />
      </div>
    );
  }
}
export default MapContent;
