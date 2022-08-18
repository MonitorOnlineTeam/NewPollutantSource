import React, { PureComponent } from 'react';
import {
  Spin,
  Radio,
  Tooltip,
  Input,
  message,
} from 'antd';
import { connect } from 'dva';
import { Map, Polygon, Markers, InfoWindow, MouseTool } from 'react-amap';
import config from "@/config";
import styles from './index_sc.less';
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';
import CustomIcon from '@/components/CustomIcon';
import { airLevel } from '@/pages/monitoring/overView/tools'
import InfoWindowContent from './component/InfoWindowContent'
import PointDetailsModal from './component/PointDetailsModal'
import { AppstoreOutlined } from '@ant-design/icons'
import mapStyle from './map.less'
import Cookie from 'js-cookie';
import { checkMapReload } from '@/utils/utils'
import PageLoading from '@/components/PageLoading'

const loadingStyle = {
  position: 'absolute',
  top: -90,
  width: '100vw',
  zIndex: 9999,
  background: '#fff',
  height: "100vh",
  left: -24
}

const statusList = [
  { text: "正常", checked: false, color: "#52c41a", value: 1, count: 33, className: "green" },
  { text: "离线", checked: false, color: "#d9d9d9", value: "0", count: 4, className: "default" },
  { text: "超标", checked: false, color: "#f5222d", value: 2, count: 4, className: "red" },
  { text: "异常", checked: false, color: "#fa8c16", value: 3, count: 6, className: "orange" },
];
const { Search } = Input;
const iconStyle = { fontSize: 22 }
const mapIconStyle = {
  fontSize: 22,
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "rgb(255 255 255) 0px 0px 3px 2px"
}
const RadioButton = Radio.Button;
const { RunningRate, TransmissionEffectiveRate, amapKey } = config;
let _thismap;
let ruler;

@connect(({ loading, map, user }) => ({
  allPoints: map.allPoints,
  curPointData: map.curPointData,
  tableList: map.tableList,
  chartData: map.chartData,
  pointDetailsModalVisible: map.pointDetailsModalVisible,
  pollutantTypeCountList: map.pollutantTypeCountList,
  unfoldMenuList: user.unfoldMenuList,
}))
class ThematicMap extends PureComponent {
  constructor(props) {
    let isReload = Cookie.get('isMapReload') == 1 && checkMapReload(props.unfoldMenuList);
    if (isReload) {
      window.location.reload();
      Cookie.set('isMapReload', 0)
    }
    super(props);
    this.state = {
      isReload: isReload,
      scriptLoading: true,
      pointsList: [],
      activePollutant: '0',
      searchInputVal: undefined,
      infoWindowVisible: false,
      infoWindowPos: undefined,
      selectedPointInfo: {
        position: {}
      },
      markersList: [],
    };

    this._SELF_ = {
      // overlays: [],
    }

    // 点弹窗事件
    this.infoWindowEvents = {
      close: () => {
        console.log('close');
        this.setState({
          infoWindowVisible: false,
        });
      },
    };
    this.toolEvents = {
      created: (tool) => {
        this.tool = tool;
      },
      // draw: ({ obj }) => {
      //   this._SELF_.overlays.push(obj);
      // }
    }

    this.mapEvents = {
      created(m) {
        _thismap = m;
        window.AMap.plugin(["AMap.RangingTool"], function () {
          ruler = new window.AMap.RangingTool(m);
        });
        setTimeout(() => {
          m.setFitView();
        }, 1000)
      },
      complete: () => {
        //_thismap.setZoomAndCenter(13, [centerlongitude, centerlatitude]);
      }
    };
  }

  componentDidMount() {
    this.getPointList();
  }

  getPointList = () => {
    this.props.dispatch({
      type: "map/getAllPoint",
      payload: {
        pollutantCode: this.props.match.params.pollutantCode
      },
      callback: (result) => {
        this.setState({
          pointsList: result.filter(item => item.PointLatitude && item.PointLongitude)
        })
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.pointsList !== this.state.pointsList) {
      this.setState({
        markersList: this.randomMarker()
      })
    }
    if (prevProps.match.params.pollutantCode !== this.props.match.params.pollutantCode) {
      if (_thismap) { _thismap.clearMap() }
      this.setState({
        pointsList: [],
        activePollutant: this.props.match.params.pollutantCode,
        searchInputVal: undefined,
        infoWindowVisible: false,
        infoWindowPos: undefined,
        selectedPointInfo: {
          position: {}
        },
        markersList: [],
        currentTool: undefined,
      }, () => {
        this.getPointList();
      });
    }
  }

  componentWillUnmount() {
    _thismap = undefined;
    ruler = undefined;
    Cookie.set('isMapReload', 1)
  }

  getPollutantIcon = (extData) => {
    let icon = "";
    let pollutantType = extData.type;
    let status = extData.status;
    if (pollutantType == 1) {
      // 废水
      switch (status) {
        case 0:// 离线
          icon = <WaterOffline style={iconStyle} />
          break;
        case 1:// 正常
          icon = <WaterNormal style={iconStyle} />
          break;
        case 2:// 超标
          icon = <WaterExceed style={iconStyle} />
          break;
        case 3:// 异常
          icon = <WaterAbnormal style={iconStyle} />
          break;
      }
    }
    if (pollutantType == 2) {
      // 气
      switch (status) {
        case 0:// 离线
          icon = <GasOffline style={iconStyle} />
          break;
        case 1:// 正常
          icon = <GasNormal style={iconStyle} />
          break;
        case 2:// 超标
          icon = <GasExceed style={iconStyle} />
          break;
        case 3:// 异常
          icon = <GasAbnormal style={iconStyle} />
          break;
      }
    }
    const style = { color: this.getColor(status), ...mapIconStyle }
    if (pollutantType == 10) {
      icon = <VocIcon style={style} />
    }
    if (pollutantType == 9) {
      icon = <CustomIcon type="icon-echoujiance" style={{ ...style }} />
    }
    if (pollutantType == 12) {
      icon = <CustomIcon type="icon-yangchen1" style={{ ...style }} />
    }
    if (pollutantType == 5) {
      icon = <div className={styles.AQIBox} style={{ backgroundColor: extData.Color !== '-' ? extData.Color : '#999999' }}>
        {extData.AQI}
      </div>
    }
    if (pollutantType == 6) {
      icon = <CustomIcon type="icon-richangshenghuo-shuizhan" style={{ ...style }} />
    }
    return <Tooltip overlayClassName={styles.tooltip} color={"#fff"} title={<span style={{ color: "#000" }}>{extData.title !== '排口0' ? extData.Abbreviation + ' - ' + extData.title : extData.Abbreviation}</span>}>
      <div onClick={() => this.onMapItemClick(extData)}>
        {icon}
      </div>
    </Tooltip>;
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

  renderMarkers = (extData) => {
    return <div>
      {this.getPollutantIcon(extData || {})}
    </div>
  }

  randomMarker = (len) => {
    return this.state.pointsList.map(item => {
      return {
        position: {
          longitude: item.PointLongitude,
          latitude: item.PointLatitude,
        },
        DGIMN: item.DGIMN,
        title: item.PointName,
        status: item.Status,
        type: item.PollutantType,
        AQI: item.AQI,
        Abbreviation: item.Abbreviation || item.EntName,
        EntCode: item.EntCode,
        Color: item.Color,
        Level: item.Level,
        BaseType: item.BaseType,
      }
    })
  };

  markersEvents = {
    created: allMarkers => {
      // m.setFitView();
      const timer = setInterval(() => {
        if (_thismap) {
          _thismap.setFitView();
          clearInterval(timer)
        }
      }, 200);
    },
    click: (MapsOption, marker) => {
      const itemData = marker.getExtData();
      console.log('itemData=', itemData)
    }
  };

  // 地图上监测点 - 点击事件
  onMapItemClick = (extData) => {
    console.log('extData=', extData)
    this.setState({
      selectedPointInfo: extData,
      infoWindowVisible: true,
      infoWindowPos: [extData.position.longitude, extData.position.latitude],
    }, () => {
      this.getInfoWindowData();
    })
  }

  // 污染物筛选
  onPollutantTypeClick = (e) => {
    this.setState({
      activePollutant: e.target.value,
      searchInputVal: undefined,
      infoWindowVisible: false,
    }, () => {
      let isShowAllPoint = e.target.value === '0' ? true : false;
      this.filterPoints(isShowAllPoint);
    })
  }

  // 监测点筛选
  filterPoints = (all) => {
    const { activePollutant, pointsList } = this.state;
    const { allPoints } = this.props;
    if (all) {
      this.setState({
        pointsList: allPoints
      })
      return;
    }
    let newPoints = allPoints.filter(item => item.PollutantType == activePollutant);
    console.log('newPoints=', newPoints)
    this.setState({
      pointsList: newPoints
    })
  }

  //
  getInfoWindowData = () => {
    let selectedPointInfo = this.state.selectedPointInfo;
    // 获取table数据
    this.props.dispatch({
      type: 'map/getPollutantList',
      payload: {
        DGIMNs: selectedPointInfo.DGIMN,
        dataType: 'HourData',
        isLastest: true,
        type: selectedPointInfo.type,
        isAirOrSite: selectedPointInfo.type == 5,
        pollutantTypes: selectedPointInfo.type,
      },
    })
  }

  onUpdateChart = (params) => {
    this.props.dispatch({
      type: 'map/updateChartData',
      payload: {
        ...params
      }
    })
  }

  onShowPointDetails = () => {
    this.props.dispatch({
      type: 'map/updateState',
      payload: {
        pointDetailsModalVisible: true
      }
    })
  }

  onSearch = value => {
    if (value) {
      let pointData = this.state.activePollutant === '0' ? this.props.allPoints : this.state.pointsList;
      const filter = pointData.filter(item => {
        if (item.PointName.indexOf(value) > -1 || item.EntName.indexOf(value) > -1) {
          return item;
        }
      });
      if (filter.length > 0) {
        this.setState({
          pointsList: filter,
        });

        // _thismap.setZoomAndCenter(_thismap.getZoom() + 5, [
        //   filter[0].position.Longitude,
        //   filter[0].position.Latitude,
        // ]);
      } else {
        message.error('未找到相关监测点');
      }
    } else {
      let pointsList = this.props.allPoints;
      if (this.state.activePollutant !== '0') {
        pointsList = this.props.allPoints.filter(item => item.PollutantType == this.state.activePollutant);
      }
      console.log('pointsList=', pointsList)
      this.setState({
        pointsList: pointsList,
        infoWindowVisible: false,
      });
    }
  };

  getLegendIcon = (type) => {
    switch (type) {
      case 1:
        return <><WaterOffline style={{ marginRight: 8, ...iconStyle, fontSize: 17 }} /></>
      case 2:
        return <><GasOffline style={{ marginRight: 8, ...iconStyle, fontSize: 17 }} /></>
      case 5:
        return <>
          <CustomIcon type="icon-fangwu" style={{
            color: '#999',
            marginRight: 8,
            ...mapIconStyle,
            fontSize: 17,
          }}
          />
        </>
      case 6:
        return <>
          <CustomIcon
            type="icon-richangshenghuo-shuizhan"
            style={{
              color: '#999',
              marginRight: 8,
              ...mapIconStyle,
              fontSize: 17,
            }}
          />
        </>
      case 9:
        return <>
          <CustomIcon
            type="icon-echoujiance"
            style={{
              color: '#999',
              marginRight: 8,
              ...mapIconStyle,
              fontSize: 17,
            }}
          />
        </>
      case 10:
        return <>
          <VocIcon style={{
            color: '#999',
            marginRight: 8,
            ...mapIconStyle,
            fontSize: 17,
          }} />
        </>
      case 12:
        return <>
          <CustomIcon
            type="icon-yangchen1"
            style={{
              color: '#999',
              marginRight: 8,
              ...mapIconStyle,
              fontSize: 17,
            }}
          />
        </>
    }
  }

  onToolsClick = () => {
    // let ruler1 = new window.AMap.RangingTool(_thismap);
    this.setState({
      currentTool: 'ruler'
    })
    ruler.turnOn()
  }

  render() {
    const { pollutantTypeCountList, curPointData, tableList, chartData, pointDetailsModalVisible } = this.props;
    const { activePollutant, searchInputVal, infoWindowVisible, infoWindowPos, selectedPointInfo, markersList, currentTool, loadStatus } = this.state;
    console.log('activePollutant=', activePollutant)
    let sysConfigInfo = JSON.parse(localStorage.getItem('sysConfigInfo'));
    let flag = this.props.match.params.pollutantCode;

    if (this.state.isReload) {
      return <PageLoading style={{ ...loadingStyle }} />;
    }

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.mapContent}>
          <div className={styles.pollutantTypeWrapper}>
            {/* {pollutantTypeCountList.map(item => {
              return <div key={item.PollutantTypeCode} className={`${styles.typeItem} ${pollutantActives.includes(item.PollutantTypeCode ? 'active' : '')}`} onClick={() => this.onPollutantClick(item)}>
                {item.PollutantTypeName}
              </div>
            })} */}
            {
              !flag && <Radio.Group style={{}} defaultValue={this.state.activePollutant} buttonStyle="solid" size="default" onChange={this.onPollutantTypeClick}>
                <RadioButton key="0" value="0">
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <AppstoreOutlined style={{ fontSize: 17, marginRight: 8 }} />
                    全部
                  </div>
                </RadioButton>
                {
                  pollutantTypeCountList.map(item => {
                    return <RadioButton key={item.PollutantTypeCode} value={item.PollutantTypeCode}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        {this.getLegendIcon(item.PollutantTypeCode)}
                        {item.PollutantTypeName}
                      </div>
                    </RadioButton>
                  })
                }
              </Radio.Group>
            }
            <Search
              value={searchInputVal}
              allowClear
              onSearch={value => this.onSearch(value)}
              onChange={e => {
                this.setState({ searchInputVal: e.target.value });
              }}
              placeholder="请输入点位名称"
              className={styles.searchInput}
            />
          </div>
          {
            (activePollutant != 5) && <div className={styles.legendContent}>
              <div className={styles.stateBox}>
                <span style={{ backgroundColor: '#33c166' }}>在线</span>
                <span style={{ backgroundColor: '#a29d9d' }}>离线</span>
                <span style={{ backgroundColor: '#fe0100' }}>超标</span>
                <span style={{ backgroundColor: '#ed9b43' }}>异常</span>
              </div>
            </div>
          }
          {
            (activePollutant == 5 || activePollutant == 0) && <div className={styles.airLegend}>
              <ul>
                {
                  airLevel.map(item => <li>
                    <span>{item.text}</span>
                    <span style={{ backgroundColor: item.color }}></span>
                    <span>{item.standardValue}</span>
                  </li>)
                }
              </ul>
            </div>
          }
          <div className={`${mapStyle.mapTools} ${mapStyle.blank}`}>
            <ul>
              <li className={currentTool === 'ruler' ? styles.active : ''} onClick={() => {
                if (currentTool === 'ruler') {
                  this.setState({
                    currentTool: ''
                  })
                  ruler.turnOff()
                } else {
                  this.tool.close();
                  this.setState({
                    currentTool: 'ruler'
                  })
                  ruler.turnOn()
                }
              }}>
                <Tooltip color="blue" placement="left" title='测距'>
                  <CustomIcon type="icon-biaohui1" />
                </Tooltip>
              </li>
              <li className={currentTool === 'biaohui' ? styles.active : ''} onClick={() => {
                if (currentTool === 'biaohui') {
                  this.tool.close();
                  this.setState({
                    currentTool: ''
                  })
                } else {
                  ruler.turnOff()
                  this.tool.polygon();
                  this.setState({
                    currentTool: 'biaohui'
                  })
                }
              }}>
                <Tooltip color="blue" placement="left" title='标绘'>
                  <CustomIcon type="icon-biaohui" />
                </Tooltip>
              </li>
              <li onClick={() => {
                // ruler = undefined;
                // ruler = new window.AMap.RangingTool(_thismap);
                this.tool.close(true)
                ruler.turnOff()
                this.setState({
                  currentTool: ''
                })
              }}>
                <Tooltip color="blue" placement="left" title='清除'>
                  <CustomIcon type="icon-qingchu" />
                </Tooltip>
              </li>
            </ul>
          </div>
          {
            currentTool === 'biaohui' && <div className={styles.drawSelectContent}>
              <Radio.Group defaultValue='polygon' onChange={(e) => {
                this.tool[e.target.value]();
              }}>
                <Radio value={'polygon'}>多边形</Radio>
                <Radio value={'rectangle'}>矩形</Radio>
                <Radio value={'circle'}>圆形</Radio>
              </Radio.Group>
            </div>
          }
          <Map
            resizeEnable={true}
            features={['bg', 'building', 'point', 'road']}
            events={this.mapEvents}
            zoom={sysConfigInfo.ZoomLevel}
            center={[sysConfigInfo.CenterLongitude, sysConfigInfo.CenterLatitude]}
            // mapStyle="amap://styles/macaron"
            // center={webConfig.mapCenter}
            // mapStyle="amap://styles/darkblue"
            amapkey={amapKey}
          >
            <MouseTool events={this.toolEvents} />
            <Markers
              markers={markersList}
              events={this.markersEvents}
              // className={this.state.special}
              render={this.renderMarkers}
            />
            <InfoWindow
              events={this.infoWindowEvents}
              position={infoWindowPos}
              visible={infoWindowVisible}
              offset={[4, -35]}
              autoMove
              showShadow
              closeWhenClickMap={false}
            >
              {infoWindowVisible && <InfoWindowContent
                chartData={chartData}
                tableList={tableList}
                selectedPointInfo={selectedPointInfo}
                curPointData={curPointData}
                onUpdateChart={(params) => this.onUpdateChart(params)}
                onResultData={() => this.getInfoWindowData()}
                onShowPointDetails={() => this.onShowPointDetails()}
              />}
            </InfoWindow>
          </Map>
          {pointDetailsModalVisible && <PointDetailsModal pointInfo={selectedPointInfo} />}
        </div>
      </div>
    );
  }
}
export default ThematicMap;
