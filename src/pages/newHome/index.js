import React, { PureComponent } from 'react';
import { Card, Drawer, Icon, Tooltip, Button, Spin, Input, message, DatePicker } from "antd"
// import { Map, Marker, Polygon } from '@/components/ReactAmap';
import { Map, Marker, Polygon, Markers, InfoWindow } from 'react-amap';
import moment from 'moment';
// import "animate.css";
// import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import MapUI from './component/MapUI'
import styles from './index.less'
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';
import CustomIcon from '@/components/CustomIcon';
import markersStyles from '@/pages/monitoring/mapview/styles.less'
import ReactEcharts from 'echarts-for-react';
import Monitoring from './component/Monitoring'
import RunAndAnalysis from "./component/RunAndAnalysis"
import AlarmResponse from './component/AlarmResponse'
import Operations from "./component/Operations"
import DiffHorizontal from "./component/DiffHorizontal"
import { router } from 'umi'
import Cookie from 'js-cookie';
import { connect } from 'dva';
import OfficeModal from "./component/OfficeModal"
import SiteDetailsModal from "./component/SiteDetailsModal"
// const plugins = [
//   'MapType', // 地图模式（卫星）
//   'Scale', //
//   'OverView',
//   'ToolBar',
// ]
const { MonthPicker } = DatePicker;
const { Search } = Input;
const iconStyle = {
  color: "#3c99d8",
  fontSize: "28px",
  borderRadius: "50%",
  background: "rgb(255, 255, 255)",
  boxShadow: "rgb(255, 255, 255) 0px 0px 3px 2px",
}

const mapIconStyle = {
  fontSize: 24,
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "0px 0px 3px 2px #fff"
}

let aMap = null;

@connect(({ loading, newHome, global }) => ({
  allEntAndPointList: newHome.allEntAndPointList,
  configInfo: global.configInfo,
  infoWindowData: newHome.infoWindowData,
  monitoringDataLoading: loading.effects["newHome/getMonitoringData"],
  runAndAnalysisDataLoading: loading.effects["newHome/getRunAndAnalysisData"],
  alarmResponseDataLoading: loading.effects["newHome/getAlarmResponseData"],
  operationAnalysisLoading: loading.effects["newHome/getOperationAnalysis"],
  taskStatisticsDataLoading: loading.effects["newHome/getTaskStatisticsData"],
  diffHorizontalDataLoading: loading.effects["newHome/getDiffHorizontalData"],
  drillDownLoading: newHome.drillDownLoading,
  getAllEntAndPointLoading: loading.effects["newHome/getAllEntAndPoint"],
  officeVisible: newHome.officeVisible,
  siteDetailsVisible: newHome.siteDetailsVisible,
  monitorRegionDivision: newHome.monitorRegionDivision,
  currentDivision: newHome.currentDivision,
  currentDivisionPosition: newHome.currentDivisionPosition,
  startTime: newHome.startTime,
  endTime: newHome.endTime,
  constructionCorpsList: newHome.constructionCorpsList,
}))
class NewHome extends PureComponent {
  constructor(props) {
    super(props);
    // 地图事件
    this.amapEvents = {
      created: (mapInstance) => {
        console.log('高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
        aMap = mapInstance;
        // console.log(mapInstance.getZoom());
        // this.renderEntMarkers(this.props)
      }
    };
    // markers事件
    this.markersEvents = {
      created: allMarkers => {
        this.setState({
          allMarkers: allMarkers
        });
      },
      clickable: true,
      click: (MapsOption, marker) => {

      },
    }
    // 厂界事件
    this.polygonEvents = {
      click: () => { console.log('clicked') },
      created: (ins) => {
        this.setState({
          allPolygon: ins
        })
      },
      mouseover: () => { console.log('mouseover') },
      dblclick: () => { console.log('dbl clicked') }
    };
    // 点弹窗事件
    this.infoWindowEvents = {
      close: () => {
        console.log('close')
        this.setState({
          infoWindowVisible: false,
        })
      }
    }

    // 搜索结果弹窗事件
    this.searchWindowEvent = {
      close: () => {
        console.log('close')
        this.setState({
          searchResult: undefined,
        })
      }
    }
    this.state = {
      leftVisible: true,
      rightVisible: true,
      RegionCode: "660000000",
      displayType: 0, // 显示类型： 0企业，1监测点
      allPollutantTypes: [], // 所有污染物类型
      markersList: [], // 点集合
      infoWindowVisible: false, // 点弹窗
      infoWindowPos: null, // 点弹窗位置
      currentClickObj: {}, // 当前点击对象 - 弹窗
    };

  }
  componentDidMount() {
    // 获取显示级别
    this.props.dispatch({
      type: "newHome/getLevel"
    })
    // 获取污染物列表
    this.props.dispatch({
      type: "common/getPollutantTypeList",
      callback: res => {
        this.setState({
          allPollutantTypes: res.map(item => item.pollutantTypeCode)
        }, () => {
          this.getAllEntAndPoint();
        })
      }
    })
    // 获取行政区与师的关系
    this.props.dispatch({
      type: "newHome/getMonitorRegionDivision",
    })
    // this.getConstructionCorpsList();
  }
  // 获取企业和监测点
  getAllEntAndPoint = () => {
    this.props.dispatch({
      type: "newHome/getAllEntAndPoint",
      payload: {
        PollutantTypes: this.state.allPollutantTypes.toString(),
        RegionCode: this.state.RegionCode
      }
    })
  }

  // 获取服务站信息
  getOfficeModalData = (extData) => {
    const officeCode = extData.position.key;
    this.props.dispatch({
      type: "newHome/getOfficeUserList",
      payload: { officeCode }
    })
    this.props.dispatch({
      type: "newHome/getOfficeStockList",
      payload: { officeCode }
    })
    this.setState({
      modalTitle: extData.position.title
    })
  }

  // 获取infoWindow数据
  getInfoWindowData = () => {
    const currentClickObj = this.state.currentClickObj;
    this.props.dispatch({
      type: "newHome/getInfoWindowData",
      payload: {
        DGIMNs: currentClickObj.key,
        dataType: "HourData",
        isLastest: true,
        // type: PollutantType,
        isAirOrSite: true,
        pollutantTypes: currentClickObj.PollutantType
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.allEntAndPointList !== nextProps.allEntAndPointList) {
      this.renderEntMarkers(nextProps)
    }
    if (this.props.currentDivisionPosition !== nextProps.currentDivisionPosition) {
      // this.renderEntMarkers(nextProps)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if(this.state.displayType !== prevState.displayType && this.state.displayType === 1){
    if (this.state.allPolygon !== prevState.allPolygon && this.state.displayType === 1) {
      let polygonList = aMap.getAllOverlays("polygon");
      let markerList = aMap.getAllOverlays("marker");
      aMap.setFitView(this.state.allPolygon)
      // aMap.setFitView([this.state.allMarkers, this.state.allPolygon])
    }
    if (this.state.allMarkers !== prevState.allMarkers && !this.state.allPolygon && this.state.displayType === 1) {
      aMap.setFitView(this.state.allMarkers)
    }
  }

  // 渲染所有企业
  renderEntMarkers = (props) => {
    const entMarkers = props.allEntAndPointList.map(item => {
      return {
        position: {
          longitude: item.Longitude,
          latitude: item.Latitude,
          ...item
        },
        children: item.children
      }
    })

    this.setState({
      markersList: entMarkers,
      allPolygon: null,
      displayType: 0
    })
  }

  // 左右抽屉
  toggle = (left) => {
    const pageContainer = document.querySelector(".antd-pro-pages-new-home-index-pageContainer");
    const { leftVisible, rightVisible } = this.state;
    if (left) {
      pageContainer.style.marginLeft = leftVisible ? "0" : "340px";
      this.setState({
        leftVisible: !this.state.leftVisible
      })
    } else {
      pageContainer.style.marginRight = rightVisible ? "0" : "340px";
      this.setState({
        rightVisible: !this.state.rightVisible
      })
    }
  }

  // 渲染企业及监测点
  renderMarker = (extData) => {
    const { displayType } = this.state;
    if (extData.position.MonitorObjectType !== "师") {
      return <div>
        <Tooltip title={extData.position.title}>
          {
            displayType === 0 ?
              this.getEntIcon(extData)
              :
              <div onClick={() => {
                this.setState({
                  currentClickObj: extData.position,
                  infoWindowVisible: true,
                  infoWindowPos: [extData.position.Longitude, extData.position.Latitude]
                }, () => {
                  this.getInfoWindowData()
                })
              }}>{this.getPollutantIcon(extData)}</div>
          }
        </Tooltip>
      </div>
    } else {
      return <div>
        {
          this.getEntIcon(extData)
        }
      </div>
    }
  }

  // 渲染企业
  getEntIcon = (extData) => {
    const { currentDivisionPosition } = this.props;
    // console.log('currentDivisionPosition=', currentDivisionPosition)
    const style = { fontSize: 24, color: this.getColor(extData.position.Status), ...mapIconStyle }
    switch (extData.position.MonitorObjectType) {
      case "1":
        // 企业
        return <EntIcon style={{ fontSize: 28 }} onClick={() => {
          // 企业点击显示监测点
          if (extData.children) {
            const pointMarkers = extData.children.map(item => {
              return {
                position: {
                  longitude: item.Longitude,
                  latitude: item.Latitude,
                  ...item
                },
              }
            })
            this.setState({
              coordinateSet: extData.position.CoordinateSet,
              markersList: pointMarkers,
              displayType: 1
            })
          }
        }} />
      case "2":
        // 大气站
        let color = (extData.position.Color && extData.position.Color !== "-") ? extData.position.Color : "#999";
        return <CustomIcon type="icon-fangwu" style={{ ...iconStyle, color: color }} onClick={() => {
          this.setState({
            currentClickObj: extData.position,
            infoWindowVisible: true,
            infoWindowPos: [extData.position.Longitude, extData.position.Latitude]
          }, () => {
            this.getInfoWindowData()
          })

        }} />
      case "师":
        // #3c99d8
        // return <ReactCSSTransitionGroup
        //   transitionEnter={true}
        //   transitionLeave={true}
        //   transitionEnterTimeout={2500}
        //   transitionLeaveTimeout={1500}
        //   transitionName="animated"
        // >
        return <div style={{ color: "#525151", textAlign: "center" }}>
          <div className={styles.pop}>{extData.position.title}</div>
          <CustomIcon key="amache"
            className={this.props.currentDivisionPosition.includes(`${extData.position.Longitude},${extData.position.Latitude}`) ? "animate__animated animate__bounce animate__infinite" : ""}
            type='icon-ditu' style={{ fontSize: 32 }}
            onClick={() => {
              this.setState({
                clickedDivision: extData.position
              })
              this.props.dispatch({ type: "newHome/changeRegionCode", payload: { regionCode: extData.position.RegionCode } })
            }} />
          {/* </ReactCSSTransitionGroup> */}
        </div>
      case "服务站":
        return <CustomIcon type="icon-cangku" style={{ ...style, fontSize: 28 }} onClick={() => {
          this.getOfficeModalData(extData)
        }} />
      default:
        return null;
    }
  }

  // 渲染企业下监测点
  getPollutantIcon = (extData) => {
    const style = { fontSize: 24, color: this.getColor(extData.position.Status), ...mapIconStyle }
    if (extData.position.outPutFlag == 1) {
      //停产
      return <CustomIcon type='icon-tingzhishangbao' style={{ ...style }} />
    } else {
      switch (extData.position.PollutantType) {
        case "1":
          return this.getWaterIcon(extData.position.Status)
        case "2":
          return this.getGasIcon(extData.position.Status)
        case "10":
          return <VocIcon style={style} />
        case "12":
          return <CustomIcon type='icon-yangchen1' style={{ ...style }} />
        case "5":
          return <a><CustomIcon type='icon-fangwu' style={style} /></a>
        case "37":
          return <CustomIcon type='icon-dian2' style={{ ...style }} />
      }
    }
  }

  // 绘制厂界
  drawPolygon = () => {
    const { coordinateSet, displayType } = this.state;
    const res = [];
    if (coordinateSet && displayType === 1) {
      const arr = eval(coordinateSet);
      for (let i = 0; i < arr.length; i++) {
        res.push(<Polygon
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
        />);
      }
    }
    return res;
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

  getStatusText = status => {
    let statusText = ''
    switch (status) {
      case 0:
        statusText = '离线'
        break;
      case 1:
        statusText = '正常'
        break;
      case 2:
        statusText = '超标'
        break;
      case 3:
        statusText = '异常'
        break;
    }
    return statusText
  }


  getWaterIcon = status => {
    let icon = ''
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
    return icon
  }

  getGasIcon = status => {
    let icon = ''
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
    return icon
  }

  // 弹窗内容
  infoWindowContent = () => {
    const { currentClickObj } = this.state;
    const { infoWindowData } = this.props;
    return <div className={styles.infoWindowContent} style={{ width: 320, minHeight: 360 }}>
      <div className={styles.header}>
        <h2>{infoWindowData.Abbreviation} - {currentClickObj.title}</h2>
        <Button type="primary" size="small" onClick={() => {
          this.props.dispatch({ type: "newHome/updateState", payload: { siteDetailsVisible: true } })
        }}>进入站房</Button>
        <p>
          站点状态：<span style={{ color: this.getColor(currentClickObj.Status) }}>{this.getStatusText(currentClickObj.Status)}</span>
        </p>
      </div>
      <div className={styles.desc}>
        <div className={styles["desc-l"]}>
          <h3>站点信息</h3>
          <p>区域：{infoWindowData.regionName}</p>
          <p>经度：{currentClickObj.Longitude}</p>
          <p>纬度：{currentClickObj.Latitude}</p>
        </div>
        <div className={styles["desc-r"]}>
          <img src="/infoWindowImg.png" alt="" width="100%" />
        </div>
      </div>
      <div className={styles.data}>
        <h3>空气质量数据</h3>
        <ul>
          {
            infoWindowData.list.map(item => {
              return <Tooltip placement="topLeft" title={`${item.label}：${item.value}`}>
                <li title={`${item.label}：${item.value}`}>{item.label}：{item.value}</li>
              </Tooltip>
            })
          }
        </ul>
        <p>发布时间：{infoWindowData.MonitorTime}</p>
      </div>
    </div>
  }

  onSearch = (value) => {
    const filter = this.state.markersList.filter(item => item.position.title.indexOf(value) > -1);
    if (filter.length > 0) {
      this.setState({
        searchResult: filter[0].position,
        searchInputVal: undefined
      })

      aMap.setZoomAndCenter(aMap.getZoom() + 2, [filter[0].position.Longitude, filter[0].position.Latitude])
    } else {
      message.error("未找到相关企业或空气站")
    }
  }

  divisionInfoWindow = () => {
    const { currentDivision } = this.props;
    if (currentDivision && currentDivision.divisionList) {
      debugger
      return currentDivision.divisionList.map(item => {
        return <InfoWindow
          position={[item.longitude, item.latitude]}
          visible={true}
          isCustom={true}
          offset={[4, -36]}
        >
          {item.divisionName}
        </InfoWindow>
      })
    }
  }

  // 重新请求页面数据
  reloadPageData = (startTime = this.props.startTime, endTime = this.props.endTime) => {
    this.props.dispatch({
      type: "newHome/changeDateTime",
      payload: {
        startTime, endTime
      }
    })
  }


  render() {
    const { searchInputVal, searchResult, leftVisible, rightVisible, infoWindowPos, infoWindowVisible, RegionCode, currentClickObj, displayType, modalTitle, clickedDivision } = this.state;
    const { constructionCorpsList, getAllEntAndPointLoading, drillDownLoading, officeVisible, siteDetailsVisible, monitoringDataLoading, runAndAnalysisDataLoading, alarmResponseDataLoading, operationAnalysisLoading, taskStatisticsDataLoading, diffHorizontalDataLoading } = this.props;
    const isLeftLoading = drillDownLoading || monitoringDataLoading || runAndAnalysisDataLoading || alarmResponseDataLoading;
    const isRightLoading = drillDownLoading || operationAnalysisLoading || taskStatisticsDataLoading || diffHorizontalDataLoading;
    const bigLoading = drillDownLoading || getAllEntAndPointLoading;
    // const style = { fontSize: 24, color: this.getColor(extData.position.Status), ...mapStyle }
    return (
      <div className={styles.newHomeWrap}>
        <header className={styles.homeHeader}>
          <p><span>SDL</span> 污染源智能分析系统</p>
          <a className={styles.backMenu} onClick={() => {
            router.push(Cookie.get("systemNavigateUrl"))
          }}>系统功能</a>
        </header>
        <Spin style={{ zIndex: 9999 }} spinning={bigLoading}>
          <div className={styles.pageContainer}>
            <Drawer
              // getContainer={false}
              placement="left"
              closable={false}
              width={340}
              mask={false}
              visible={leftVisible}
              style={{ marginTop: 64 }}
              bodyStyle={{ padding: 0 }}
            >
              <div className={styles.drawerIcon} onClick={() => this.toggle(true)}>
                <Icon type={leftVisible ? "caret-left" : "caret-right"} className={styles.icon} />
              </div>
              <Spin spinning={isLeftLoading}>
                <div className={styles["content"]}>
                  {/* 监控现状 */}
                  <Monitoring RegionCode={RegionCode} />
                  {/* 运行分析 */}
                  <RunAndAnalysis RegionCode={RegionCode} />
                  {/* 报警响应情况 */}
                  <AlarmResponse RegionCode={RegionCode} />
                </div>
              </Spin>
            </Drawer>
            <Drawer
              // getContainer={false}
              placement="right"
              closable={false}
              width={340}
              mask={false}
              visible={rightVisible}
              style={{ marginTop: 64 }}
              bodyStyle={{ padding: 0 }}
            >
              <div className={`${styles.drawerIcon} ${styles.rightDrawerIcon}`} onClick={() => this.toggle()}>
                <Icon type={rightVisible ? "caret-right" : "caret-left"} className={styles.icon} />
              </div>
              <Spin spinning={isRightLoading}>
                <div className={styles["content"]}>
                  {/* 运维分析 */}
                  <Operations RegionCode={RegionCode} />
                  {/* 水平衡差 */}
                  <DiffHorizontal RegionCode={RegionCode} />
                </div>
              </Spin>
            </Drawer>
            <div className={styles.mapContent}>
              <div className={styles.mapInnerBox}>
                {
                  // displayType === 1 && <Button type="primary" style={{
                  displayType === 1 && <Button type="primary" style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 1
                  }} onClick={() => {
                    this.renderEntMarkers(this.props)
                    aMap.setFitView();
                  }}>返回企业</Button>
                }
                {
                  clickedDivision && <Button type="primary" style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 1
                  }} onClick={() => {
                    this.setState({ clickedDivision: undefined })
                    this.reloadPageData();
                  }}>返回上级</Button>
                }
                <MonthPicker defaultValue={moment()} allowClear={false} className={styles.monthPicker} onChange={(date, dateString) => {
                  this.reloadPageData(date.format("YYYY-MM-01 00:00:00"), date.endOf("month").format("YYYY-MM-DD HH:mm:ss"));
                }} />
                {
                  displayType === 0 &&
                  <Search value={searchInputVal} allowClear onSearch={value => this.onSearch(value)} onChange={(e) => {
                    this.setState({ searchInputVal: e.target.value })
                  }} placeholder="输入企业或空气站名称" className={styles.searchInput} />
                }
                {
                  clickedDivision && <div className={styles.shibox}>
                    {/* <span>师局</span><br /> */}
                    <span>{clickedDivision.title}</span>
                  </div>
                }
              </div>
              <div className={styles.legendContent}>
                <div className={styles.legendBox}>
                  <ul>
                    <li><CustomIcon type="icon-cangku" style={{ ...mapIconStyle }} /><span>服务站</span></li>
                    <li><EntIcon /><span>企业</span></li>
                    <li><CustomIcon type='icon-ditu' style={{ fontSize: 28, marginLeft: -3 }} /> <span>师</span></li>
                    <li><WaterOffline /> <span>废水</span></li>
                    <li><GasOffline /> <span>废气</span></li>
                    <li><CustomIcon type="icon-fangwu" style={{ fontSize: 24, borderRadius: "50%", background: "#fff", boxShadow: "0px 0px 3px 2px #fff", color: "#999" }} />空气站</li>
                  </ul>
                </div>
                {
                  displayType === 1 && <div className={styles.stateBox}>
                    <span style={{ backgroundColor: "#33c166" }}>在线</span>
                    <span style={{ backgroundColor: "#a29d9d" }}>离线</span>
                    <span style={{ backgroundColor: "#fe0100" }}>超标</span>
                    <span style={{ backgroundColor: "#ed9b43" }}>异常</span>
                  </div>
                }
              </div>
              <Map
                amapkey="c5cb4ec7ca3ba4618348693dd449002d"
                // plugins={plugins}
                id="mapId"
                events={this.amapEvents}
                // zoom={4}
                mapStyle="amap://styles/fresh"
                useAMapUI={true}
              >
                <MapUI
                  renderEnt={() => {
                    this.renderEntMarkers(this.props);
                  }}
                // featureOnClick={(feature) => {
                //   this.setState({
                //     adCode: feature.properties.adcode
                //   }, () => {
                //     this.getAllEntAndPoint();
                //   })
                // }}
                // featureMouseover={(adcode) => {
                //   console.log('adcode=', adcode)
                //   this.props.dispatch({
                //     type: "newHome/updateDivisionShowCoordinate",
                //     payload: {
                //       adcode
                //     }
                //   })
                // }}
                />
                {this.drawPolygon()}
                <Markers
                  markers={this.state.markersList}
                  events={this.markersEvents}
                  render={this.renderMarker}
                // content={<span>111</span>}
                />
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
                {
                  searchResult && <InfoWindow
                    events={this.searchWindowEvent}
                    position={[searchResult.Longitude, searchResult.Latitude]}
                    visible={searchResult}
                    offset={[4, -35]}
                    autoMove
                    showShadow
                    closeWhenClickMap
                  // isCustom
                  // content={this.infoWindowContent()}
                  >
                    {searchResult.title}
                  </InfoWindow>
                }
                {console.log('divisionInfoWindow=', this.divisionInfoWindow())}
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
          </div>
        </Spin>
        {officeVisible && <OfficeModal title={modalTitle} />}
        {/* {true && <OfficeModal />} */}
        {siteDetailsVisible && <SiteDetailsModal data={currentClickObj} />}
      </div>
    );
  }
}

export default NewHome;