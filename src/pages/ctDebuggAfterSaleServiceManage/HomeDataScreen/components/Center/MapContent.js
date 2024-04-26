import React, { PureComponent } from 'react';
import { Map, Polygon, Markers, InfoWindow } from 'react-amap';
import { connect } from 'dva';
import styles from '../../styles.less';
import config from '@/config';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Radio, Space, Spin, Select, DatePicker } from 'antd';
import moment from 'moment';
import { EntIcon } from '@/utils/icon';
import PageLoading from '@/components/PageLoading';

let aMap;

@connect(({ loading, AbnormalIdentifyModelHome }) => ({
  loading: loading.effects['AbnormalIdentifyModelHome/GetMapPointList'],
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
      securityJsCode: config.securityJsCode,
    };
  }

  loadPageData = () => {};

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
          var canvasLayer = new AMap.CanvasLayer();
        }
      });
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
            {extData.position && extData.position.regionName}
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

  render() {
    const { mapMarkersList } = this.state;
    const { loading } = this.props;

    return (
      <div className={styles.mapWrapper}>
        <Spin spinning={!!loading}>
          <Map
            resizeEnable={true}
            events={this.mapEvents}
            mapStyle="amap://styles/6daa80e94c53325ff909a31f3d3d8809"
            amapkey={'1440c67033e5ede0f3a068605de5fb5f'}
            // center={mapCenter}
          ></Map>
          <div className={styles.mapSearchWrapper}>
            <Space align="start" style={{ flexWrap: 'wrap' }}>
              <DatePicker
                allowClear={false}
                picker={'year'}
                value={moment()}
                onChange={date => {}}
                popupClassName={styles.datePickerPopup}
              />
              <div className={styles.SelectWrapper}>
                <Select
                  allowClear
                  placeholder="搜索企业"
                  onChange={value => {}}
                  style={{ width: 180 }}
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
            </Space>
          </div>
        </Spin>
      </div>
    );
  }
}
export default MapContent;
