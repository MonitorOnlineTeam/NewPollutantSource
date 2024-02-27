import React, { PureComponent } from 'react';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import { connect } from 'dva';
import styles from '../../styles.less';
import config from '@/config';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Radio, Space, Spin } from 'antd';
import moment from 'moment';
import { GasIcon, GasOffline, GasExceed, GasAbnormal } from '@/utils/icon';
import { router } from 'umi';

let aMap;

@connect(({ loading, AbnormalIdentifyModelHome }) => ({
  loading: loading.effects['AbnormalIdentifyModelHome/GetEntMapPointList'],
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

        // setPointStatsList([
        //   { text: '超标', color: '#FF0000', val: statusData.overCount, status: 2 },
        //   { text: '异常', color: '#FFCC00', val: statusData.exceptionCount, status: 3 },
        //   { text: '离线', color: '#67666A', val: statusData.unLineCount, status: 0 },
        //   { text: '正常', color: '#5fc15d', val: statusData.normalCount, status: 1 },
        //   { text: '停运', color: '#836BFB', val: statusData.stopCount, status: 4 },
        // ]);
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
          <div className={`${styles.pointName} textOverflow`}>{extData.position.PointName}</div>
        </div>
        <div onClick={() => this.onPointClickGoAnalysisPage(extData.position)}>
          {this.getIcon(extData.position.Status)}
        </div>
        {/* {this.getIcon('3')} */}
      </div>
    );
  };

  getIcon = status => {
    return <GasIcon />;
    switch (status) {
      case '3': // 离线
        return <GasOffline />;
      case '4': // 在线
        return <GasIcon />;
      case '2': // 超标
        return <GasExceed />;
      case '1': // 异常
        return <GasAbnormal />;
      // case '3': // 停运
      //   return <GasStop />;
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
    // let pollutantCode = [...this.props.entRequestParams.pollutantCode];

    // if (pollutantCode.includes(value)) {
    //   // 存在：去掉
    //   pollutantCode = pollutantCode.filter(item => item !== value);
    // } else {
    //   pollutantCode.push(value);
    // }
    this.queryParamsChange(
      {
        pollutantCode: value,
      },
      true,
    );
  };

  // 点击排口，更新导航树model，进入统计分析
  onPointClickGoAnalysisPage = data => {
    localStorage.setItem('overallselkeys', data.DGIMN); // 排口key
    localStorage.setItem('overallexpkeys', data.EntCode); // 企业key
    localStorage.setItem(
      'pointInfo',
      JSON.stringify({
        // 排口及企业名称
        entName: data.EntName,
        pointName: data.PointName,
      }),
    );
    this.props.dispatch({
      type: 'navigationtree/updateState',
      payload: {
        overallselkeys: [data.DGIMN],
        overallexpkeys: [data.EntCode],
        pointInfo: {
          entName: data.EntName,
          pointName: data.PointName,
        },
      },
    });
    setTimeout(() => {
      router.push('/AbnormalIdentifyModel/HistoryDataAnalysis/PointStatisticalAnalysis');
    }, 0);
  };

  render() {
    const {} = this.state;
    const {
      mapMarkersList,
      loading,
      entRequestParams: { pLeve, pollutantCode, dateRange },
    } = this.props;

    return (
      <Spin spinning={!!loading}>
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
              value={dateRange}
              className={styles.myRadio}
              style={{ lineHeight: '24px' }}
              onChange={e => {
                let value = e.target.value;
                this.queryParamsChange({
                  dateRange: value,
                  btime:
                    value === 'week'
                      ? moment()
                          .add(-6, 'day')
                          .startOf('day')
                      : moment()
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
                  className={`${pollutantCode === '01,02,03' ? styles.active : ''}`}
                  style={{ padding: '0 20px' }}
                  onClick={e => this.onPollutantChange('01,02,03')}
                >
                  全部
                </li>
                <li
                  className={`${pollutantCode === '01' ? styles.active : ''}`}
                  onClick={e => this.onPollutantChange('01')}
                >
                  <i style={{ background: '#0A93F3' }}></i>颗粒物
                </li>
                <li
                  className={`${pollutantCode === '02' ? styles.active : ''}`}
                  onClick={e => this.onPollutantChange('02')}
                >
                  <i style={{ background: '#1BFFC7' }}></i>二氧化硫
                </li>
                <li
                  className={`${pollutantCode === '03' ? styles.active : ''}`}
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
      </Spin>
    );
  }
}
export default MapContent;
