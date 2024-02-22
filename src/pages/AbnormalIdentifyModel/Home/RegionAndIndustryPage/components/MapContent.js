import React, { PureComponent } from 'react';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import { connect } from 'dva';
import styles from '../../styles.less';
import config from '@/config';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Radio, Space, Spin, Select } from 'antd';
import moment from 'moment';
import { EntIcon } from '@/utils/icon';
import PageLoading from '@/components/PageLoading';

let aMap;

@connect(({ loading, AbnormalIdentifyModelHome }) => ({
  loading: loading.effects['AbnormalIdentifyModelHome/GetMapPointList'],
  // pollutantTypeList: home.pollutantTypeList,
  requestParams: AbnormalIdentifyModelHome.requestParams,
  EntCount: AbnormalIdentifyModelHome.EntCount,
  PointCount: AbnormalIdentifyModelHome.PointCount,
  regionList: AbnormalIdentifyModelHome.regionList,
  mapMarkersList: AbnormalIdentifyModelHome.mapMarkersList,
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
}))
class MapContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      regionToggle: false,
      industryToggle: false,
      industryList: [],
      currentRegionName: '全国',
      mapMarkersList: [],
      filterMarkerList: [],
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
    this.getIndustryList();
    this.loadPageData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.requestParams) !== JSON.stringify(this.props.requestParams)) {
      this.loadPageData();
    }
    if (
      prevProps.requestParams.regionCode !== this.props.requestParams.regionCode &&
      this.props.requestParams.pLeve === 2
    ) {
      this.renderRegionBoundary({
        regionName: this.props.requestParams.regionName,
      });
    }
  }

  loadPageData = () => {
    this.getMapPointList(true);
  };

  // 获取地图数据
  getMapPointList = isFitView => {
    this.props
      .dispatch({
        type: 'AbnormalIdentifyModelHome/GetMapPointList',
        payload: {},
      })
      .then(res => {
        const timer = setInterval(() => {
          if (aMap && isFitView) {
            aMap.setFitView();
            clearInterval(timer);
          }
        }, 0);
        this.setState({
          mapMarkersList: this.props.mapMarkersList,
          filterMarkerList: this.props.mapMarkersList,
        });
      });
  };

  // 获取行业
  getIndustryList = () => {
    this.props.dispatch({
      type: 'autoForm/getConfigIdList',
      payload: {
        configId: 'IndustryType',
      },
      callback: res => {
        this.setState({
          industryList: res.DataSource,
        });
      },
    });
  };

  // 更新请求参数，并重新请求数据
  queryParamsChange = (params, isFitView) => {
    const { requestParams } = this.props;
    this.props
      .dispatch({
        type: 'AbnormalIdentifyModelHome/updateRequestParams',
        payload: {
          requestParams: {
            ...requestParams,
            ...params,
          },
        },
        callback: () => {
        },
      })
      .then(() => {
        // this.getMapPointList(isFitView);
      });
  };

  // 更新企业参数
  updateEntQueryParams = params => {
    this.props.dispatch({
      type: 'AbnormalIdentifyModelHome/updateState',
      payload: {
        entRequestParams: {
          ...this.props.entRequestParams,
          ...params,
        },
      },
    });
  };

  // 展示企业
  renderEntList = data => {
    const { position } = data;
    // { regionCode: data.code, regionName: data.name, industryCode: '', pLeve: 2, },
    console.log('position', position);
    this.queryParamsChange(
      {
        regionCode: position.regionCode,
        regionName: position.regionName,
        industryCode: '',
        pLeve: position.pLeve || 2,
      },
      true,
    );
    this.setState({
      currentRegionName: position.regionName,
      industryToggle: false,
      regionToggle: false,
    });

    // this.renderRegionBoundary(position);
  };

  // 绘制行政区边界
  renderRegionBoundary = position => {
    AMap.plugin('AMap.DistrictSearch', () => {
      const districtSearch = new AMap.DistrictSearch({
        subdistrict: 0, //获取边界不需要返回下级行政区
        extensions: 'all', //返回行政区边界坐标组等具体信息
        level: 'province', //查询行政级别为 省
      });
      const regName =
        position?.regionName == '新疆生产建设兵团' ? '新疆维吾尔自治区' : position.regionName;
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
          // var canvasLayer = new AMap.CanvasLayer();
        }
      });
    });
  };

  // 企业图标点击 - 进入企业页面
  onEntList = data => {
    this.props.dispatch({
      type: 'AbnormalIdentifyModelHome/updateState',
      payload: {
        entHomeIsOpen: true,
        entRequestParams: {
          ...this.props.entRequestParams,
          entCode: data.entCode,
        },
        currentEntName: data.entName,
      },
    });
  };

  regPopovercontent = extData => {
    const { position } = extData;
    return (
      <div
        className={styles.regPopoverSty}
        style={{
          position: 'absolute',
          margin: '0 auto',
          top: 'calc(25px + (65px - 54px)/2)',
          left: 12,
          color: '#fff',
        }}
      >
        <div>企业总数: {position.entCount}</div>
        <div>
          <span style={{ color: '#FF0000' }}>超标</span>点位数 :{' '}
          <span style={{ cursor: 'pointer' }}>{position.overCount}</span>
        </div>
        <div>
          <span style={{ color: '#FFCC00' }}>异常</span>点位数 :{' '}
          <span style={{ cursor: 'pointer' }}>{position.exceptionCount}</span>
        </div>
      </div>
    );
  };

  renderMarkers = extData => {
    const {
      requestParams: { pLeve },
    } = this.props;
    const { showType, entTitleShow, pointTitleShow, isMassive } = this.state;
    const alarmStatus = false;
    if (pLeve == 1) {
      return (
        <div
          style={{
            position: 'relative',
            width: 110,
            height: 110,
            marginLeft: -55,
            marginTop: -110,
            background: 'url("/AbnormalIdentifyModel/regionModal.png")',
            backgroundSize: '100% 100%',
            cursor: 'default',
          }}
        >
          <div
            title={extData.position && extData.position.regionName}
            className="textOverflow"
            style={{
              color: '#4BF3F9',
              position: 'absolute',
              left: 10,
              top: 8,
              fontSize: 12,
              lineHeight: '12px',
              width: 'calc(100% - 14px - 10px - 14px)',
            }}
          >
            {' '}
            {extData.position && extData.position.regionName}{' '}
          </div>
          <img
            src="/location.png"
            style={{
              position: 'absolute',
              top: '100%',
              left: 'calc(50% - 10px)',
              width: 20,
              height: 20,
            }}
          />
          <RightOutlined
            onClick={() => {
              this.renderEntList(extData);
            }}
            style={{ color: '#4BF3F9', position: 'absolute', top: 8, right: 8, fontSize: 14 }}
          />
          {this.regPopovercontent(extData)}
        </div>
      );
    } else if (pLeve == 2) {
      const entName = extData.position.entName;
      return (
        <div
          style={{ position: 'relative', marginTop: 24 }}
          onClick={() => this.onEntList(extData.position)}
        >
          <EntIcon />
          <div
          // className={
          //   alarmStatus == 1 ? styles.abnormalPaulse : alarmStatus == 2 ? styles.overPaulse : ''
          // }
          ></div>
          {<div className={styles.titlePopSty}>{entName}</div>}
        </div>
      );
    } else {
      //监测点
      return (
        <div style={{ position: 'relative', marginTop: 24 }}>
          {this.getIcon(extData.position.Status)}
          <div
            className={
              alarmStatus == 1 ? styles.abnormalPaulse : alarmStatus == 2 ? styles.overPaulse : ''
            }
          ></div>
          {pointTitleShow && isMassive ? (
            <div style={{ padding: '4px 8px', backgroundColor: massPointTitleColor }}>
              {extData.position.ParentName} - {extData.position.PointName}
            </div>
          ) : pointTitleShow ? (
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

  // 污染物Change
  onPollutantChange = value => {
    // let pollutantCode = [...this.props.requestParams.pollutantCode];

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

    // 污染物更新到企业中
    this.updateEntQueryParams({
      pollutantCode: value,
    });
  };

  // 行政区change
  onRegionChange = data => {
    console.log('data', data);
    // this.setState({
    //   currentRegionName: data.name,
    //   currentIndustryName: undefined,
    // });
    this.queryParamsChange(
      { regionCode: data.code, regionName: data.name, industryCode: '', pLeve: 2 },
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
      mapMarkersList,
      filterMarkerList,
    } = this.state;
    const {
      EntCount,
      PointCount,
      regionList,
      requestParams,
      loading,
      requestParams: { pLeve, pollutantCode },
    } = this.props;
    // if (!!loading) {
    //   return <PageLoading />;
    // }

    console.log('mapMarkersList-region', mapMarkersList);
    return (
      <>
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
              markers={filterMarkerList}
              render={this.renderMarkers}
              events={this.markersEvents}
              extData={filterMarkerList}
              // useCluster
            />
            {/* <Markers
            markers={currentMarkersList}
            events={this.markersEvents}
            // className={this.state.special}
            render={this.renderMarkers}
          /> */}
          </Map>
          <div className={styles.mapCountWrapper}>
            <div style={{ marginRight: 20 }}>
              <p className={styles.title}>排污单位（家）</p>
              <p className={styles.count}>{EntCount}</p>
            </div>
            <div>
              <p className={styles.title}>监控点数（个）</p>
              <p className={styles.count}>{PointCount}</p>
            </div>
          </div>
          <div className={styles.mapSearchWrapper}>
            <Space align="start" style={{ flexWrap: 'wrap' }}>
              {pLeve === 1 && (
                <>
                  <div className={styles.searchSelectWrapper}>
                    <div
                      className={styles.select}
                      onClick={() => {
                        this.setState({
                          regionToggle: !regionToggle,
                          industryToggle: false,
                        });
                      }}
                    >
                      {/* {requestParams.regionName !== undefined ? requestParams.regionName : '按区域'} */}
                      {!requestParams.industryCode ? '全国' : '按区域'}
                      <DownOutlined className={styles.icon} />
                    </div>
                    {regionToggle && (
                      <div className={styles.listbox}>
                        <Radio.Group
                          value={requestParams.regionCode}
                          size="small"
                          onChange={e => {
                            let label = e.target['data-label'];
                            let value = e.target.value;
                            this.setState({
                              regionToggle: !regionToggle,
                              currentIndustryName: undefined,
                            });
                            // this.onRegionChange({ name: label, code: value });

                            this.renderEntList({
                              position: {
                                regionCode: value,
                                regionName: label,
                                pLeve: value ? 2 : 1,
                              },
                            });
                          }}
                        >
                          <Space>
                            {regionList.map(item => {
                              return (
                                <Radio.Button
                                  key={item.value}
                                  value={item.value}
                                  data-label={item.label}
                                >
                                  {item.label}
                                </Radio.Button>
                              );
                            })}
                          </Space>
                        </Radio.Group>
                      </div>
                    )}
                  </div>
                  <div className={styles.searchSelectWrapper}>
                    <div
                      className={styles.select}
                      onClick={() => {
                        this.setState({
                          industryToggle: !industryToggle,
                          regionToggle: false,
                        });
                      }}
                    >
                      {currentIndustryName !== undefined ? currentIndustryName : '按行业'}
                      <DownOutlined className={styles.icon} />
                    </div>
                    {industryToggle && (
                      <div className={styles.listbox}>
                        <Radio.Group
                          defaultValue={requestParams.industryCode || undefined}
                          size="small"
                          onChange={e => {
                            this.setState({
                              currentIndustryName: e.target['data-label'],
                              currentRegionName: undefined,
                              industryToggle: !industryToggle,
                            });
                            this.queryParamsChange(
                              {
                                industryCode: e.target.value,
                                regionCode: undefined,
                                regionName: undefined,
                              },
                              true,
                            );
                          }}
                        >
                          <Space>
                            <Radio.Button key={0} value={''} data-label={'全部'}>
                              全部
                            </Radio.Button>
                            {industryList.map(item => {
                              return (
                                <Radio.Button
                                  key={item['dbo.T_Cod_IndustryType.IndustryTypeCode']}
                                  value={item['dbo.T_Cod_IndustryType.IndustryTypeCode']}
                                  data-label={item['dbo.T_Cod_IndustryType.IndustryTypeName']}
                                >
                                  {item['dbo.T_Cod_IndustryType.IndustryTypeName']}
                                </Radio.Button>
                              );
                            })}
                          </Space>
                        </Radio.Group>
                      </div>
                    )}
                  </div>
                </>
              )}
              <Radio.Group
                value={requestParams.dateRange}
                className={styles.myRadio}
                style={{ lineHeight: '24px' }}
                onChange={e => {
                  let value = e.target.value;
                  this.queryParamsChange({
                    dateRange: value,
                    btime: value === 'week' ? moment().add(-6, 'day') : moment().add(-1, value),
                    etime: moment(),
                  });

                  // 时间同时更新到企业中
                  this.updateEntQueryParams({
                    dateRange: value,
                    btime: value === 'week' ? moment().add(-6, 'day') : moment().add(-1, value),
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
              {pLeve === 2 && (
                <div className={styles.searchEntWrapper}>
                  <Select
                    allowClear
                    placeholder="搜索企业"
                    onChange={value => {
                      let filterList = mapMarkersList;
                      if (value) {
                        filterList = mapMarkersList.filter(item => item.position.entCode === value);
                      }
                      this.setState(
                        {
                          filterMarkerList: filterList,
                        },
                        () => {
                          aMap.setFitView();
                        },
                      );
                    }}
                    style={{ width: 180 }}
                    showSearch
                    optionFilterProp="children"
                    popupClassName={styles.popupStyle}
                  >
                    {mapMarkersList.map(item => {
                      return (
                        <Option key={item.position.entCode} value={item.position.entCode}>
                          {item.position.entName}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              )}
            </Space>
          </div>
          {pLeve === 2 && (
            <>
              <div
                className={styles.gobackBox}
                onClick={() => {
                  aMap.clearMap();
                  this.queryParamsChange(
                    {
                      regionCode: '',
                      pLeve: 1,
                    },
                    true,
                  );
                  this.setState({
                    currentRegionName: undefined,
                    regionToggle: false,
                    industryToggle: false,
                  });
                }}
              >
                返回
              </div>
            </>
          )}
        </Spin>
      </>
    );
  }
}
export default MapContent;
