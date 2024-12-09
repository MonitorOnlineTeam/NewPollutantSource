import React, { PureComponent } from 'react';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import { connect } from 'dva';
import styles from '../../styles.less';
import config from '@/config';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Radio, Space, Spin, Select, DatePicker, Row } from 'antd';
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

let aMap;

@connect(({ loading, AbnormalIdentifyModelHome }) => ({
  loading: loading.effects['AbnormalIdentifyModelHome/GetMapPointList'],
}))
class MapContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: moment(),
      allEntList: [], // 所有企业
      selectEntList: [], // 企业搜索下拉列表数据
      markersList: [],
      currentEntList: [], // 企业列表
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
        console.log(
          '高德地图 Marker 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：',
        );
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

  // 获取地图数据
  loadPageData = () => {
    const { time } = this.state;
    this.props.dispatch({
      type: 'ctDataScreen/GetDeviceInformationMap',
      payload: {
        bTime: moment(time)
          .startOf('year')
          .format('YYYY-MM-DD HH:mm:ss'),
        eTime: moment(time)
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
            selectEntList: allEntList,
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
    const { level, currentEntList, currentPointList } = this.state;
    let markersList = [];
    switch (level) {
      case 1:
        // 行政区
        markersList = this.state.mapAllDataList.map(item => {
          return {
            position: {
              ...item,
              latitude: item.ProviceLatitude,
              longitude: item.ProviceLongitude,
            },
          };
        });
        break;
      case 2:
        // 企业
        markersList = currentEntList.map(item => {
          return {
            position: {
              ...item,
              latitude: item.EntLatitude,
              longitude: item.EntLongitude,
            },
          };
        });
        break;
      case 3:
        // 排口
        markersList = currentPointList.map(item => {
          return {
            position: {
              ...item,
              latitude: item.PointLatitude,
              longitude: item.PointLongitude,
            },
          };
        });
        break;
      case 4:
        // 所有排口
        this.state.mapAllDataList.map(item => {
          item.EntList.map(ent => {
            ent.PointList.map(point => {
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
    this.setState(
      {
        markersList: markersList,
      },
      () => {
        const timer = setInterval(() => {
          if (aMap) {
            aMap.setFitView();
            clearInterval(timer);
          }
        }, 0);
      },
    );
  };

  getIcon = status => {
    let icon = '';

    switch (status) {
      case 0: // 离线
        icon = <GasOffline />;
        break;
      case 1: // 在线
        icon = <GasNormal />;
        break;
      case 2: // 超标
        icon = <GasExceed />;
        break;
      case 3: // 异常
        icon = <GasAbnormal />;
        break;
      case 4: // 停运
        icon = <GasStop />;
        break;
      default:
        icon = <GasNormal />;
        break;
    }
    return icon;
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

  renderMarkers = extData => {
    const { position } = extData;
    const { showType, entTitleShow, pointTitleShow, isMassive, level } = this.state;

    const alarmStatus = false;
    if (level == 1) {
      return (
        <div
          style={{
            position: 'relative',
            transform: `translate(-50%, ${'calc(-50% - 14px)'})`,
            padding: '8px 10px',
            cursor: 'text',
            width: 166,
            height: 100,
            background: `url(/homeMapBorder.png)`,
            backgroundSize: '100% 100%',
          }}
        >
          <div
            style={{
              opacity: 1,
              color: '#52F2FF',
              height: 'calc(100%)',
            }}
          >
            <div
              className="textOverflow"
              style={{
                width: 'calc(100% - 28px)',
                height: 24,
                lineHeight: '24px',
                // fontWeight: 'bold',
                paddingLeft: 8,
                fontSize: 13,
                paddingTop: 2,
              }}
              title={position.ProviceName}
            >
              {position.ProviceName}
            </div>
            <RightOutlined
              onClick={() => {
                this.setState(
                  {
                    level: 2,
                    currentEntList: extData.position.EntList,
                  },
                  () => {
                    this.handleMarkerDatas();
                    this.renderRegionBoundary(extData.position.ProviceName);
                  },
                );
              }}
              style={{ color: '#4BF3F9', position: 'absolute', top: 15, right: 13, fontSize: 14 }}
            />
            <div
              style={{
                height: 'calc(100% - 24px)',
                fontWeight: 'bold',
                padding: '2px 8px 0',
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: '#fff',
                }}
              >
                <span style={{}}>企业数量: </span>
                <span style={{ color: '#30FDFF', fontSize: 14 }}>{position.EntCount}个</span>
              </div>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: '#fff',
                }}
              >
                <p style={{}}>废气点位数量: </p>
                <p style={{ color: '#31DAA3', fontSize: 14 }}>{position.PointCount}个</p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            {/* <span
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
            ></span> */}
            <img
              src="/location.png"
              style={{
                position: 'absolute',
                top: '100%',
                left: 'calc(50% - .625rem)',
                width: '1.25rem',
                height: '1.25rem',
              }}
            />
          </div>
        </div>
      );
    } else if (level == 2) {
      const entName = extData.position.EntName;
      return (
        <div style={{ position: 'relative', marginTop: 24 }}>
          <EntIcon
            onClick={() => {
              this.setState(
                {
                  level: 3,
                  // entTitleShow: false,
                  hoverEntTitleShow: false,
                  currentPointList: extData.position.PointList,
                },
                () => {
                  this.handleMarkerDatas();
                },
              );
            }}
          />
          {entTitleShow && <div className={styles.titlePopSty}>{entName}</div>}
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
            {this.getIcon(extData.position.Status)}
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
      case '全屏':
        this.setState({ fullScreen: true });
        break;
      case '退出全屏':
        this.setState({ fullScreen: false });
        break;
      case '展示企业': //行政区
        // this.setState({ backIconGo: true, mapBtnStatusIndex: -1 });
        // this.loadRegionMarkerData(regionMarkers);
        aMap.clearMap();
        this.setState({ level: 1, pointInfoWindowVisible: false }, () => {
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
        debugger;
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
    }
  };

  RightIconMapComponent = () => {
    const { fullScreen, level, entTitleShow, pointTitleShow } = this.state;
    const operationBtnArr = [
      {
        text: fullScreen ? '退出全屏' : '全屏',
        url: fullScreen ? '/homeMapT.png' : '/homeMapQp.png',
      },
      { text: '展示企业', url: level == 1 ? '/homeMapQA.png' : '/homeMapQ.png' },
      {
        text: '展示监测点',
        url: level == 4 ? '/homeMapJcA.png' : '/homeMapJc.png',
      },
      { text: '展示/隐藏名称', url: '/homeMapZ.png' },
      { text: '放大', url: '/homeMapJ.png' },
      { text: '缩小', url: '/homeMapS.png' },
    ];
    return (
      <div className={styles.mapOperationBtn}>
        {operationBtnArr.map((item, index) => {
          return (
            <div
              style={{ paddingBottom: 10 }}
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
      selectEntList,
      time,
      markersList,
      CountAnalysis: { EntCount, PointCount },
      hoverEntTitle,
      hoverPointTitle,
      hoverEntTitleShow,
      hoverTitleShow,
      hoverTitleLngLat,
      pointInfoWindowPosition,
      pointInfoWindowVisible,
      level,
      fullScreen,
    } = this.state;
    const { loading } = this.props;
    return (
      <div className={`${styles.mapWrapper} ${fullScreen ? styles.fullScreen : ''}`}>
        <Spin spinning={!!loading}>
          <Map
            resizeEnable={true}
            events={this.mapEvents}
            amapkey={config.amapKey}
            mapStyle={config.mapStyle}
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
            <InfoWindow //企业 hover
              visible={hoverEntTitleShow}
              position={hoverTitleLngLat}
              autoMove
              offset={false ? [10, -5] : [4, -10]}
              className={styles.titleInfoWindow}
            >
              <div style={{ whiteSpace: 'nowrap' }}>企业名称：{hoverEntTitle}</div>
            </InfoWindow>
            <InfoWindow //监测点 hover
              visible={hoverTitleShow}
              position={hoverTitleLngLat}
              autoMove
              offset={false ? [10, -5] : [4, -10]}
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
          <div className={styles.mapSearchWrapper}>
            <Space align="start" wrap>
              <div className={styles.SelectWrapper}>
                <Select
                  allowClear
                  placeholder="输入企业名称"
                  onChange={value => {
                    if (value) {
                      let filterList = selectEntList.filter(item => item.EntId === value);
                      this.setState(
                        {
                          level: 2,
                          currentEntList: filterList,
                        },
                        () => {
                          this.handleMarkerDatas();
                        },
                      );
                    } else {
                      this.setState({ level: 1, pointInfoWindowVisible: false }, () => {
                        this.handleMarkerDatas();
                      });
                    }
                  }}
                  style={{ width: 160 }}
                  showSearch
                  optionFilterProp="children"
                  popupClassName={styles.popupStyle}
                >
                  {selectEntList.map(item => {
                    return (
                      <Option key={item.EntId} value={item.EntId}>
                        {item.EntName}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <DatePicker
                style={{ width: 120 }}
                allowClear={false}
                picker={'year'}
                value={time}
                onChange={date => {
                  aMap.clearMap();
                  this.setState(
                    {
                      time: date,
                      level: 1,
                    },
                    () => {
                      this.loadPageData();
                    },
                  );
                }}
                popupClassName={styles.datePickerPopup}
              />
            </Space>
            <div className={`${styles.mapCountWrapper} ${fullScreen ? styles.fullScreen : ''}`}>
              <div>企业数量{EntCount}</div>
              <div style={{ width: 154, marginLeft: 10 }}>废气点位数量{PointCount}</div>
            </div>
          </div>
          {level !== 1 && (
            <div
              className={styles.goback}
              onClick={() => {
                if (level === 2 || level === 4) {
                  aMap.clearMap();
                  this.setState({ level: 1, pointInfoWindowVisible: false }, () => {
                    this.handleMarkerDatas();
                  });
                }
                if (level === 3) {
                  this.setState({ level: 2, pointInfoWindowVisible: false }, () => {
                    this.handleMarkerDatas();
                  });
                }
              }}
            >
              {/**返回 */}
              <img src="/homeMapBack.png" />
              <div>返回</div>
            </div>
          )}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <EntIcon style={{ fontSize: 23, boxShadow: 'none', marginRight: 8 }} />
              <span>企业</span>
            </div>
            <div className={styles.legendItem} style={{ marginTop: 10 }}>
              <GasIcon
                style={{ fontSize: 23, background: '#fff', borderRadius: '50%', marginRight: 8 }}
              />
              <span>废气</span>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}
export default MapContent;
