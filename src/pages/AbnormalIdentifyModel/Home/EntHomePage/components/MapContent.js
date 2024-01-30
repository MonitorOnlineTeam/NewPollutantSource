import React, { PureComponent } from 'react';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import { connect } from 'dva';
import styles from '../../styles.less';
import config from '@/config';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Radio, Space } from 'antd';
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
  WaterStop,
  GasStop,
} from '@/utils/icon';

let aMap;

@connect(({ loading, AbnormalIdentifyModelHome }) => ({
  loading: loading.effects['AbnormalIdentifyModelHome/GetMapPointList'],
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
  mapMarkersList: AbnormalIdentifyModelHome.entMapMarkersList,
  currentEntName: AbnormalIdentifyModelHome.currentEntName,
}))
class MapContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      regionToggle: false,
      industryToggle: false,
      industryList: [],
      currentRegionName: '全国',
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
  }

  componentDidMount() {
    window._AMapSecurityConfig = {
      securityJsCode: 'c960e3ce0a08f155f22e676a378fc03e',
    };
    this.loadPageData();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (JSON.stringify(prevProps.requestParams) !== JSON.stringify(this.props.requestParams)) {
  //     loadPageData();
  //   }
  // }

  loadPageData = () => {
    this.getMapPointList(true);
  };

  // 获取地图数据
  getMapPointList = isFitView => {
    this.props
      .dispatch({
        type: 'AbnormalIdentifyModelHome/GetEntMapPointList',
        payload: {},
      })
      .then(() => {
        const timer = setInterval(() => {
          if (aMap && isFitView) {
            aMap.setFitView();
            clearInterval(timer);
          }
        }, 0);
      });
  };

  // 更新请求参数，并重新请求数据
  queryParamsChange = (params, isFitView) => {
    const { entRequestParams } = this.props;
    this.props
      .dispatch({
        type: 'AbnormalIdentifyModelHome/updateRequestParams',
        payload: {
          entRequestParams: {
            ...entRequestParams,
            ...params,
          },
        },
      })
      .then(() => {
        this.getMapPointList(false);
      });
  };

  // 渲染地图点 - 排口
  renderMarkers = extData => {
    const {
      entRequestParams: { pLeve },
      currentEntName,
    } = this.props;
    const { showType, entTitleShow, pointTitleShow, isMassive } = this.state;
    const alarmStatus = false;
    //监测点
    return (
      <div style={{ position: 'relative', marginTop: 24 }}>
        <div className={styles.entPopWrapper}>
          <div className="textOverflow">{currentEntName}</div>
          <div className={styles.pointName}>{extData.position.PointName}</div>
        </div>
        {this.getIcon(extData.position.Status)}
      </div>
    );
  };

  getIcon = status => {
    switch (status) {
      case '0': // 离线
        return <GasOffline />;
      case '1': // 在线
        return <GasNormal />;
      case '2': // 超标
        return <GasExceed />;
      case '3': // 异常
        return <GasAbnormal />;
      case '4': // 停运
        return <GasStop />;
    }
  };

  onClosePage = () => {
    this.props.dispatch({
      type: 'AbnormalIdentifyModelHome/updateState',
      payload: {
        entHomeIsOpen: false,
      },
    });
  };

  // 污染物Change
  onPollutantChange = value => {
    let pollutantCode = [...this.props.entRequestParams.pollutantCode];

    if (pollutantCode.includes(value)) {
      // 存在：去掉
      pollutantCode = pollutantCode.filter(item => item !== value);
    } else {
      pollutantCode.push(value);
    }
    this.queryParamsChange(
      {
        pollutantCode: pollutantCode,
      },
      true,
    );
  };

  render() {
    const {
      regionToggle,
      industryToggle,
      industryList,
      currentRegionName,
      currentIndustryName,
    } = this.state;
    const {
      EntCount,
      PointCount,
      regionList,
      mapMarkersList,
      entRequestParams,
      entRequestParams: { pLeve, pollutantCode },
    } = this.props;
    return (
      <>
        <Map
          resizeEnable={true}
          events={this.mapEvents}
          zoom={5}
          mapStyle={'amap://styles/32ae1bcea26191a8dd684f71c172af1f'}
          amapkey={'5e60171b820065e7e9a1d6ea45abaee9'}
          // center={mapCenter}
        >
          <Markers
            markers={mapMarkersList}
            render={this.renderMarkers}
            events={this.markersEvents}
            extData={mapMarkersList}
            // useCluster
          />
          {/* <Markers
            markers={currentMarkersList}
            events={this.markersEvents}
            // className={this.state.special}
            render={this.renderMarkers}
          /> */}
        </Map>
        <div className={styles.mapSearchWrapper}>
          <Space align="start">
            <Radio.Group
              defaultValue="week"
              className={styles.myRadio}
              style={{ lineHeight: '24px' }}
              onChange={e => {
                let value = e.target.value;
                this.queryParamsChange({
                  btime: moment()
                    .add(-1, value)
                    .startOf('day'),
                  etime: moment(),
                });
              }}
            >
              <Radio.Button value="week">近七天</Radio.Button>
              <Radio.Button value="month">近一个月</Radio.Button>
            </Radio.Group>
            <div className={styles.pollutantWrapper}>
              {/* <p>污染物</p> */}
              <ul>
                <li
                  className={`${pollutantCode.includes('01') ? styles.active : ''}`}
                  onClick={e => this.onPollutantChange('01')}
                >
                  <i style={{ background: '#0A93F3' }}></i>颗粒物
                </li>
                <li
                  className={`${pollutantCode.includes('02') ? styles.active : ''}`}
                  onClick={e => this.onPollutantChange('02')}
                >
                  <i style={{ background: '#1BFFC7' }}></i>二氧化硫
                </li>
                <li
                  className={`${pollutantCode.includes('03') ? styles.active : ''}`}
                  onClick={e => this.onPollutantChange('03')}
                >
                  <i style={{ background: '#D388EF' }}></i>氮氧化物
                </li>
              </ul>
            </div>
          </Space>
        </div>

        <div
          className={styles.gobackBox}
          onClick={() => {
            this.onClosePage();
          }}
        >
          返回
        </div>
      </>
    );
  }
}
export default MapContent;
