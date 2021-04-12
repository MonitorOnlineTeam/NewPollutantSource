import React, { PureComponent } from 'react';
import {
  Spin,
  Radio,
  Tooltip,
  Input,
  message,
} from 'antd';
import { connect } from 'dva';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import config from "@/config";
import styles from './index.less';
import { EntIcon, GasIcon, GasOffline, GasNormal, GasExceed, GasAbnormal, WaterIcon, WaterNormal, WaterExceed, WaterAbnormal, WaterOffline, VocIcon, DustIcon } from '@/utils/icon';
import moment from 'moment';
import { router } from "umi"
import CustomIcon from '@/components/CustomIcon';
import { airLevel } from '@/pages/monitoring/overView/tools'
import InfoWindowContent from './component/InfoWindowContent'
import PointDetailsModal from './component/PointDetailsModal'

const statusList = [
  { text: "正常", checked: false, color: "#52c41a", value: 1, count: 33, className: "green" },
  { text: "离线", checked: false, color: "#d9d9d9", value: "0", count: 4, className: "default" },
  { text: "超标", checked: false, color: "#f5222d", value: 2, count: 4, className: "red" },
  { text: "异常", checked: false, color: "#fa8c16", value: 3, count: 6, className: "orange" },
];
const { Search } = Input;
const iconStyle = { fontSize: 17 }
const mapIconStyle = {
  fontSize: 17,
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "rgb(255 255 255) 0px 0px 3px 2px"
}
const RadioButton = Radio.Button;
const { RunningRate, TransmissionEffectiveRate, amapKey } = config;
let _thismap;


@connect(({ loading, map }) => ({
  allPoints: map.allPoints,
  curPointData: map.curPointData,
  tableList: map.tableList,
  chartData: map.chartData,
  pointDetailsModalVisible: map.pointDetailsModalVisible,
  pollutantTypeCountList: map.pollutantTypeCountList,
}))
class ThematicMap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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

    this.mapEvents = {
      created(m) {
        _thismap = m;
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
    this.props.dispatch({
      type: "map/getAllPoint",
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
    if (pollutantType == 12) {
      icon = <CustomIcon type="icon-yangchen1" style={{ ...style }} />
    }
    if (pollutantType == 5) {
      icon = <div className={styles.AQIBox} style={{ backgroundColor: this.getColor(status) }}>
        {extData.AQI}
      </div>
    }
    return <Tooltip overlayClassName={styles.tooltip} color={"#fff"} title={<span style={{ color: "#000" }}>{extData.Abbreviation} - {extData.title}</span>}>
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
        Abbreviation: item.Abbreviation,
        EntCode: item.EntCode,
      }
    })
  };

  markersEvents = {
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
      type: 'mapView/updateChartData',
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
      const filter = this.state.pointsList.filter(item => {
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
    }
  };

  getLegendIcon = (type) => {
    switch (type) {
      case 1:
        return <><WaterOffline style={{ marginRight: 8, fontSize: 20, ...iconStyle }} /> <span>废水 <i></i></span></>
      case 2:
        return <><GasOffline style={{ marginRight: 8, fontSize: 20, ...iconStyle }} /> <span>废气</span></>
      case 5:
        return <>
          <CustomIcon type="icon-fangwu" style={{
            color: '#999',
            marginRight: 8,
            fontSize: 20,
            ...mapIconStyle
          }}
          /> 空气站
        </>
      case 10:
        return <>
          <VocIcon style={{
            color: '#999',
            marginRight: 8,
            fontSize: 20,
            ...mapIconStyle
          }} /> VOC
        </>
      case 12:
        return <>
          <CustomIcon
            type="icon-yangchen1"
            style={{
              color: '#999',
              marginRight: 8,
              fontSize: 20,
              ...mapIconStyle
            }}
          /> 扬尘
        </>
    }
  }

  render() {
    const { pollutantTypeCountList, curPointData, tableList, chartData, pointDetailsModalVisible } = this.props;
    const { activePollutant, searchInputVal, infoWindowVisible, infoWindowPos, selectedPointInfo, markersList } = this.state;
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.mapContent}>
          <div className={styles.pollutantTypeWrapper}>
            {/* {pollutantTypeCountList.map(item => {
              return <div key={item.PollutantTypeCode} className={`${styles.typeItem} ${pollutantActives.includes(item.PollutantTypeCode ? 'active' : '')}`} onClick={() => this.onPollutantClick(item)}>
                {item.PollutantTypeName}
              </div>
            })} */}
            <Radio.Group style={{}} defaultValue={this.state.activePollutant} buttonStyle="solid" size="default" onChange={this.onPollutantTypeClick}>
              <RadioButton key="0" value="0">全部</RadioButton>
              {
                pollutantTypeCountList.map(item => {
                  return <RadioButton key={item.PollutantTypeCode} value={item.PollutantTypeCode}>{item.PollutantTypeName}</RadioButton>
                })
              }
            </Radio.Group>
            <Search
              value={searchInputVal}
              allowClear
              onSearch={value => this.onSearch(value)}
              onChange={e => {
                this.setState({ searchInputVal: e.target.value });
              }}
              placeholder="请输入排口名称"
              className={styles.searchInput}
            />
          </div>
          {
            (activePollutant != 5) && <div className={styles.legendContent}>
              <div className={styles.legendBox}>
                <ul>
                  {
                    pollutantTypeCountList.map(item => {
                      return <li>
                        {this.getLegendIcon(item.PollutantTypeCode)}
                      </li>
                    })
                  }
                  {/* <li>
                    <WaterOffline style={{ marginRight: 10, fontSize: 20, ...iconStyle }} /> <span>废水 <i></i></span>
                  </li>
                  <li>
                    <GasOffline style={{ marginRight: 10, fontSize: 20, ...iconStyle }} /> <span>废气</span>
                  </li>
                  <li>
                    <CustomIcon
                      type="icon-fangwu"
                      style={{
                        color: '#999',
                        marginRight: 10,
                        fontSize: 20,
                        ...mapIconStyle
                      }}
                    />
                      空气站
                    </li>
                  <li>
                    <VocIcon style={{
                      color: '#999',
                      marginRight: 10,
                      fontSize: 20,
                      ...mapIconStyle
                    }} />
                  VOC
                </li>
                  <li>
                    <CustomIcon
                      type="icon-yangchen1"
                      style={{
                        color: '#999',
                        marginRight: 10,
                        fontSize: 20,
                        ...mapIconStyle
                      }}
                    />
                      扬尘
                    </li> */}
                </ul>
              </div>
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
          <Map
            resizeEnable={true}
            events={this.mapEvents}
            mapStyle="amap://styles/darkblue"
            amapkey={amapKey}
          >
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
