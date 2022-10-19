import React, { PureComponent, Fragment } from 'react'
import PropTypes, { array } from 'prop-types';
import { GlobalOutlined } from '@ant-design/icons';
import { Input, Modal, Button, message } from 'antd';
import { Map, MouseTool, Marker, Polygon } from 'react-amap';
// import { Map, MouseTool, Marker, Polygon } from '@/components/ReactAmap';
import { connect } from 'dva';
import styles from './MapContent.less';
import config from '@/config'
import { isInsidePolygon } from '@/utils/utils'
import webConfig from '../../../public/webConfig'

// import MapUI from "@/pages/monitoring/mapview/MapUI"


let AMap = null;
let thisMap = null;
const marker = null;

const styleC = {
  width: '200px',
  textAlign: 'center',
  position: 'absolute',
  top: '-27px',
  left: '-85px',
  color: '#000',
}

@connect(({ loading, global }) => ({
  configInfo: global.configInfo,
}))
class SdlMap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      MapVisible: false,
      position: {
        latitude: props.latitude && props.latitude * 1,
        longitude: props.longitude && props.longitude * 1,
      },
      // isChangePos: false,
      isChangePos: !!props.handleMarker,
      address: null,
      polygon: [],
      path: props.path,
      // mapCenter: { longitude: 120, latitude: 35 },
    };

    this.drawPolygon = this.drawPolygon.bind(this)
  }

  componentWillUpdate() {

  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('state=', this.state);
  //   console.log("next=", nextProps);
  //   if ((this.state.latitude !== nextProps.latitude) || (this.state.longitude !== nextProps.longitude)) {
  //     this.setState({
  //       position: {
  //         latitude: nextProps.latitude,
  //         longitude: nextProps.longitude
  //       }
  //     })
  //   }
  // }

  componentDidMount() {
    const self = this;
    this.toolEvents = {
      created: tool => {
        AMap = window.AMap;
        self.tool = tool;
      },
      draw({ obj }) {
        // self.drawWhat(obj);
        if (obj.CLASS_NAME === 'AMap.Polygon') {
          // 绘制厂界
          const markersList = [];
          for (let i = 0; i < obj.getPath().length; i++) {
            const garr = [];
            garr.push(obj.getPath()[i].lng);
            garr.push(obj.getPath()[i].lat);
            markersList.push(garr);
          }
          // const polygon = obj.getPath().map(item => {
          //   return {
          //     longitude: item.lng,
          //     latitude: item.lat
          //   }
          // })
          let polygon = [];
          if (self.state.polygon.length) {
            polygon = self.state.polygon;
            polygon.push([markersList])
            // polygon = [
            //   self.state.polygon,
            //   [markersList]
            // ]
          } else {
            polygon.push([
              markersList,
            ])
          }

          self.setState({
            polygon,
          })
        }

        // return;
        // self.setState({
        //   position: {
        //     longitude: obj.getPosition().lng,
        //     latitude: obj.getPosition().lat
        //   }
        // })
      },
    }

    if (this.props.mode === 'map') {
      if (this.props.longitude && this.props.latitude) {
        this.setState({
          mapCenter: [this.props.longitude, this.props.latitude],
        })
      } else if (this.props.path) {
        this.setState({
          mapCenter: this.props.path[0] && this.props.path[0][0] && this.props.path[0][0][0],
        })
      }
    }
    window._AMapSecurityConfig = {
      securityJsCode: config.securityJsCode,
    }
  }


  onOk() {
    if (this.props.onOk) {
      const { position, address, polygon } = this.state;
      const marker = {
        ...position,
        address,
        polygon,
        zoom: thisMap.getZoom(),
      }
      this.props.onOk(marker)
    }
  }

  // js 转换
  json2string = jsonObj => {
    const type = Object.prototype.toString.call(jsonObj).slice(8, -1); let rs;
    switch (type) {
      case 'Undefined':
      case 'Null':
      case 'Number':
      case 'Boolean':
      case 'Date':
      case 'Function':
      case 'Error':
      case 'RegExp': rs = jsonObj; break;
      case 'String': rs = `"${jsonObj}"`; break;
      case 'Array':
        rs = '';
        for (let i = 0, len = jsonObj.length; i < len; i++) {
          rs += `${this.json2string(jsonObj[i])},`;
        }
        rs = `[${rs.slice(0, -1)}]`;
        break;

      case 'Object':
        rs = [];
        for (const k in jsonObj) {
          rs.push(`"${k.toString()}":${this.json2string(jsonObj[k])}`);
        }
        rs = `{${rs.join(',')}}`;
        break;
    }
    return rs;
  }

  // 关闭弹窗
  onCloseModal(visible) {
    this.setState({
      mapVisible: visible,
      isChangePos: false,
      address: null,
      mapCenter: null,
      searchAddress: null,
      searchPosition: null,
      loadAutocomplete: null,
    })
  }

  // 自定义绘制区域
  drawPolygon() {
    if (this.tool) {
      this.setState({
        polygon: [],
      })
      this.tool.polygon();
      this.setState({
        isChangePos: false,
        path: undefined,
      })
    }
  }

  // 地址搜索
  onSearch = obj => {
    if (window.AMap) {
      window.AMap.service('AMap.Geocoder', () => { // 回调函数
        // 实例化Geocoder
        const geocoder = new window.AMap.Geocoder();
        geocoder.getLocation(obj.target.value, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            const latlng = result.geocodes[0].location;
            // 设置缩放级别和中心点
            const latlngxy = [latlng.lng, latlng.lat];
            this.setState({
              mapCenter: latlngxy,
              searchPosition: {
                latitude: latlng.lat,
                longitude: latlng.lng,
              },
              searchAddress: result.geocodes[0].formattedAddress,
            })
          } else {
            message.error('未查询到相关地址！')
          }
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.path !== nextProps.path) {
      nextProps.path ? this.setState({
        path: nextProps.path,
        polygon: this.props.path,
        mapCenter: nextProps.path[0] && nextProps.path[0][0] && nextProps.path[0][0][0],
      }) : this.setState({
        path: [],
        polygon: [],
      })
    }
    if (this.props.handleMarker !== this.props.handleMarker) {
      this.setState({
        isChangePos: nextProps.handleMarker,
      })
    }
    if ((this.props.latitude !== nextProps.latitude) || (this.props.longitude !== nextProps.longitude)) {
      this.setState({
        position: {
          latitude: nextProps.latitude,
          longitude: nextProps.longitude
        }
      })
    }
  }

  renderMapContent() {
    const markerEvents = {
      created: instance => {
        thisMap.setFitView(instance)
      },
    }
    const events = {
      created: ins => {
        thisMap = ins;
        if (config.offlineMapUrl.domain) {
          const Layer = new window.AMap.TileLayer({
            zIndex: 2,
            getTileUrl(x, y, z) {
              // return 'http://mt1.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=' + x + '&y=' + y + '&z=' + z + '&s=Galil';
              return `${config.offlineMapUrl.domain}/gaode/${z}/${x}/${y}.png`;
            },
          });
          Layer.setMap(ins);
        }
        // if (this.props.handlePolygon) {
        setTimeout(() => {
          ins && ins.setFitView && ins.setFitView()
        }, 1000)

        const timer = setInterval(() => {
          if (window.AMap && window.AMap.plugin) {
            const that = this;
            window.AMap.plugin('AMap.Autocomplete', () => {
              // 实例化Autocomplete
              const autoOptions = {
                // city: "110000",
                city: that.props.configInfo.AdCode == '0' ? '全国' : that.props.configInfo.AdCode,
                input: 'tipInput',
              }

              const autoComplete = new window.AMap.Autocomplete(autoOptions);
              window.AMap.event.addListener(autoComplete, 'select', data => {
                console.log(1111)
                const latlng = data.poi.location;
                // 设置缩放级别和中心点
                const latlngxy = [latlng.lng, latlng.lat];

                that.setState({
                  mapCenter: latlngxy,
                  searchPosition: {
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                  },
                  searchAddress: data.poi.district + data.poi.address + data.poi.name,
                })
              })
            })
            clearInterval(timer)
          }
        }, 200);
      },
      click: e => {
        if (this.state.isChangePos) {

          if (this.props.path) {
            // console.log("this.props.path=", this.props.path)
            let path = JSON.parse(this.props.path)
            if (path.length) {
              // let innerArr = path[0][0];
              // // console.log("innerArr=",)
              // let longitudeArr = innerArr.map(item => item[0]) // 经度
              // let latitudeArr = innerArr.map(item => item[1]) // 纬度
              // let longMax = _.max(longitudeArr);
              // let longMin = _.min(longitudeArr);

              // let latMax = _.max(latitudeArr);
              // let latMin = _.min(latitudeArr);
              // let lngFlag = false;
              // let latFlag = false;

              // if (e.lnglat.lng >= longMin && e.lnglat.lng <= longMax) {
              //   lngFlag = true;
              // } else {
              //   lngFlag = false;
              // }

              // if (e.lnglat.lat >= latMin && e.lnglat.lat <= latMax) {
              //   latFlag = true;
              // } else {
              //   latFlag = false;
              // }

              // if (lngFlag && latFlag) {
              //   const position = {
              //     longitude: e.lnglat.lng,
              //     latitude: e.lnglat.lat,
              //   }
              //   this.setState({
              //     position,
              //   })
              // } else {
              //   message.error("设置点不在厂界范围内！")
              // }
              let _isInsidePolygon = isInsidePolygon(e.lnglat.lng, e.lnglat.lat, path[0][0])
              if (_isInsidePolygon) {
                const position = {
                  longitude: e.lnglat.lng,
                  latitude: e.lnglat.lat,
                }
                this.setState({
                  position,
                })
              } else {
                message.error("设置点不在厂界范围内！")
              }
            }
          } else {
            const position = {
              longitude: e.lnglat.lng,
              latitude: e.lnglat.lat,
            }
            this.setState({
              position,
            })
          }
        }
      },
    }
    // 如果没有传入经纬度的话，定位到用户所在城市的中心
    const props = this.state.mapCenter ? { center: this.state.mapCenter } : { status: 'resizeEnable' }

    let mapStaticAttribute = {};
    // 离线地图设置做大缩放级别
    // if (config.offlineMapUrl.domain) {
    //   mapStaticAttribute.zooms = [3, 14]
    // }

    if (webConfig.theme === 'dark') {
      mapStaticAttribute = { mapStyle: "amap://styles/darkblue" }
    }

    return <Map
      amapkey={config.amapKey}
      // zoom={this.props.zoom}
      // mapStyle="amap://styles/darkblue"
      {...props}
      events={events}
      {...mapStaticAttribute}
    // useAMapUI={() => {
    //   console.log("AMapUI Loaded Done")
    // }}
    >
      {/* {window.AMap && <MapUI />} */}
      {
        // 地图标注点
        this.state.position.longitude && this.state.position.latitude &&
        <Marker
          position={this.state.position}
          event={markerEvents}
        />
      }
      {
        this.state.searchPosition && <Marker events={markerEvents} position={this.state.searchPosition} style={{ position: 'relative' }}>
          <div>
            <img src="/marker.png" alt="" />
            <div style={styleC}>{this.state.searchAddress}</div>
          </div>
        </Marker>
      }
      {/* {
        // 绘制厂界
        this.state.path && <Polygon path={this.state.path} style={{
          strokeColor: "#FF33FF", //线颜色
          strokeOpacity: 0.2, //线透明度
          strokeWeight: 3, //线宽
          fillColor: "#1791fc", //填充色
          fillOpacity: 0.35,//填充透明度
          bubble: true
        }} />
      } */}
      {
        this.getPolygon()
      }
      <MouseTool events={this.toolEvents} />
    </Map>
  }

  // 绘制厂界
  getPolygon = () => {
    const res = [];
    if (this.state.path) {
      const arr = eval(this.state.path) || [];
      for (let i = 0; i < arr.length; i++) {
        res.push(<Polygon
          // key={item.entCode+i}
          // extData={item}
          bubble={true}
          style={{
            strokeColor: '#FF33FF',
            strokeOpacity: 0.2,
            strokeWeight: 3,
            fillColor: '#595959',
            fillOpacity: 0.35,
          }}
          path={arr[i]}
        />);
      }
    }
    thisMap && this.props.handlePolygon && thisMap.setFitView()
    return res;
  }

  render() {
    const { mapVisible } = this.state;
    const { handleMarker, handlePolygon, mode, latitude, longitude } = this.props;
    return (
      <Fragment>
        {
          mode === 'modal' &&
          <Input
            // style={{paddingRight: 40}}
            className="mapInput"
            suffix={<GlobalOutlined
              onClick={() => {
                if (latitude && longitude) {
                  this.setState({
                    position: {
                      latitude,
                      longitude,
                    },
                    mapCenter: [longitude, latitude],
                  })
                }

                const path = this.props.path && JSON.parse(this.props.path);
                // 厂界
                if (handlePolygon && path) {
                  this.setState({
                    mapCenter: path[0] && path[0][0] && path[0][0][0],
                    path,
                  })
                }
                this.setState({
                  mapVisible: true,
                })
              }}
              style={{ color: '#2db7f5', cursor: 'pointer' }} />}
            allowClear
            {...this.props}
            onChange={(e) => { this.props.onChange && this.props.onChange(e) }}
          />
        }
        {
          mode === 'map' &&
          <div className={styles.mapContent} style={{ ...this.props.style }}>
            {this.renderMapContent()}
          </div>
        }

        <Modal
          visible={mapVisible}
          title="编辑位置信息"
          // width="70%"
          wrapClassName='spreadOverModal'
          destroyOnClose// 清除上次数据
          onOk={() => {
            this.onOk();
            this.onCloseModal();
          }}
          onCancel={() => {
            this.onCloseModal();
          }}
        >
          <div className={styles.mapContent} style={{ ...this.props.style }}>
            {this.renderMapContent()}
            <div className={styles.mouseTool}>
              <Button className={styles.ClearButton} onClick={() => {
                if (handlePolygon) {
                  this.setState({
                    address: undefined,
                    polygon: [],
                    path: undefined,
                    position: {
                      latitude: undefined,
                      longitude: undefined,
                    },
                  }, () => {
                    thisMap.clearMap();
                  })
                  setTimeout(() => {
                    this.setState({
                      position: {
                        latitude: this.props.latitude,
                        longitude: this.props.longitude
                      },
                    })
                  }, 0)

                } else {
                  this.setState({
                    position: {
                      latitude: undefined,
                      longitude: undefined,
                    },
                    address: undefined,
                  })
                }
              }}>{
                  handlePolygon ? '清除厂界' : "清除坐标"
                }</Button>

              {handleMarker && <Button style={{ marginLeft: 10 }} onClick={() => {
                this.setState({
                  isChangePos: true,
                })
              }} className={styles.ClearButton}>设置经纬度</Button>}
              {
                handlePolygon &&
                <Button style={{ marginLeft: 10 }} onClick={this.drawPolygon} className={styles.ClearButton}>设置区域</Button>
              }
              {
                !config.offlineMapUrl.domain && <Input
                  placeholder="搜索地址"
                  // defaultValue={this.state.address}
                  value={this.state.address}
                  id="tipInput"
                  onChange={input => {
                    this.setState({
                      address: input.target.value,
                    })
                  }}
                  onPressEnter={value => this.onSearch(value)}
                  style={{ width: 300, marginLeft: 10 }}
                  allowClear
                />
              }
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

SdlMap.propTypes = {
  // latitude: PropTypes.number,
  // longitude: PropTypes.number,
  onOk: PropTypes.func,
  // 是否可以设置经纬度
  handleMarker: PropTypes.bool,
  // 是否可以设置区域厂界
  handlePolygon: PropTypes.bool,
  // 弹窗 、显示
  mode: PropTypes.string,
  // 厂界坐标
  path: PropTypes.object,
}

SdlMap.defaultProps = {
  // handleMarker: true,
  mode: 'modal',
  zoom: 13,
}

export default SdlMap;
