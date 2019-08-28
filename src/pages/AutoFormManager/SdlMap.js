import React, { PureComponent, Fragment } from 'react'
import PropTypes, { array } from 'prop-types';
import { Input, Modal, Icon, Button, message } from 'antd'
import { Map, MouseTool, Marker, Polygon } from 'react-amap';
import styles from './MapContent.less';

const YOUR_AMAP_KEY = "c5cb4ec7ca3ba4618348693dd449002d";


let AMap = null;
let marker = null;
class SdlMap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      MapVisible: false,
      position: {
        latitude: props.latitude && props.latitude * 1,
        longitude: props.longitude && props.longitude * 1
      },
      isChangePos: false,
      address: null,
      polygon: [],
      path: props.path
      // mapCenter: { longitude: 120, latitude: 35 },
    };
    // const self = this;
    // this.toolEvents = {
    //   created: (tool) => {
    //     console.log("created=",tool)
    //     self.tool = tool;
    //   },
    //   draw({ obj }) {
    //     console.log('draw=',obj.getPosition())
    //     console.log('obj=',arguments)
    //   }
    // }

    this.drawPolygon = this.drawPolygon.bind(this)
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.latitude !== state.latitude || props.longitude !== state.longitude) {
  //     return {
  //       position: {
  //         latitude: props.latitude,
  //         longitude: props.longitude
  //       }
  //     }
  //   }
  //   return null;
  // }

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
      created: (tool) => {
        AMap = window.AMap;
        // console.log("created=", tool)
        self.tool = tool;
      },
      draw({ obj }) {
        // self.drawWhat(obj);
        if (obj.CLASS_NAME === "AMap.Polygon") {
          // 绘制厂界
          let markersList = [];
          for (let i = 0; i < obj.getPath().length; i++) {
            let garr = new Array();
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
              markersList
            ])
          }

          self.setState({
            polygon: polygon
          })
        }

        // console.log('getPosition=', obj.getPosition())
        // return;
        // self.setState({
        //   position: {
        //     longitude: obj.getPosition().lng,
        //     latitude: obj.getPosition().lat
        //   }
        // })
      }
    }

    if (this.props.mode === "map") {
      if (this.props.longitude && this.props.latitude) {
        this.setState({
          mapCenter: [this.props.longitude, this.props.latitude]
        })
      } else if(this.props.path) {
        this.setState({
          mapCenter: this.props.path[0][0][0]
        })
      }
    }
  }


  onOk() {
    if (this.props.onOk) {
      const { position, address, polygon } = this.state;
      const marker = {
        ...position,
        address: address,
        polygon: polygon
      }
      this.props.onOk(marker)
    }
  }

  //js 转换
  json2string = (jsonObj) => {
    let type = Object.prototype.toString.call(jsonObj).slice(8, -1); let rs;
    switch (type) {
      case "Undefined":
      case "Null":
      case "Number":
      case "Boolean":
      case "Date":
      case "Function":
      case "Error":
      case "RegExp": rs = jsonObj; break;
      case "String": rs = `"${jsonObj}"`; break;
      case "Array":
        rs = "";
        for (let i = 0, len = jsonObj.length; i < len; i++) {
          rs += `${this.json2string(jsonObj[i])},`;
        }
        rs = `[${rs.slice(0, -1)}]`;
        break;

      case "Object":
        rs = [];
        for (let k in jsonObj) {
          rs.push(`"${k.toString()}":${this.json2string(jsonObj[k])}`);
        }
        rs = `{${rs.join(",")}}`;
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
    })
  }

  // 自定义绘制区域
  drawPolygon() {
    if (this.tool) {
      this.tool.polygon();
      this.setState({
        isChangePos: false,
        path: undefined
      })
    }
  }

  // 地址搜索
  onSearch = (obj) => {
    if (window.AMap) {
      window.AMap.service('AMap.Geocoder', () => { // 回调函数
        // 实例化Geocoder
        let geocoder = new window.AMap.Geocoder({});
        geocoder.getLocation(obj.target.value, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            let latlng = result.geocodes[0].location;
            // 设置缩放级别和中心点
            let latlngxy = [latlng.lng, latlng.lat];
            // const currentZoom = map.getZoom();
            // map.setZoomAndCenter(currentZoom !== zoomLevel ? currentZoom : zoomLevel, latlngxy);
            //this.props.getMapAddress(latlng);
            this.setState({
              mapCenter: latlngxy,
              // position: {
              //   latitude: latlng.lat,
              //   longitude: latlng.lng
              // }
            })
          } else {
            message.error("未查询到相关地址！")
          }
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.path !== nextProps.path) {
      nextProps.path && this.setState({
        mapCenter: nextProps.path[0][0][0]
      })
    }
  }



  renderMapContent() {
    const events = {
      created: (ins) => { console.log(ins) },
      click: (e) => {
        if (this.state.isChangePos) {
          let position = {
            longitude: e.lnglat.lng,
            latitude: e.lnglat.lat
          }
          this.setState({
            position
          })
          const that = this;
          if (window.AMap) {
            window.AMap.service('AMap.Geocoder', () => { // 回调函数
              // 实例化Geocoder
              let geocoder = new window.AMap.Geocoder({});
              geocoder.getAddress([position.longitude, position.latitude], (status, result) => {
                if (status === 'complete' && result.info === 'OK') {
                  this.setState({
                    address: result.regeocode.formattedAddress
                  });
                  // getMapAddress&&getMapAddress(result.regeocode.formattedAddress);
                }
              });
            });
          }
        }

      }
    }
    console.log('mapCenter=', this.state.mapCenter)
    return <Map
      amapkey={YOUR_AMAP_KEY}
      center={this.state.mapCenter}
      zoom={this.props.zoom}
      events={events}
    >
      {
        // 地图标注点
        this.state.position.longitude && this.state.position.latitude && this.props.handleMarker &&
        <Marker
          position={this.state.position}
        />
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
    if (this.props.path) {
      const arr = eval(this.props.path);
      for (let i = 0; i < arr.length; i++) {
        res.push(<Polygon
          // events={this.polygonEvents}
          // key={item.entCode+i}
          // extData={item}
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
    return res;
  }

  render() {
    const { mapVisible } = this.state;
    const { handleMarker, handlePolygon, mode, latitude, longitude } = this.props;
    return (
      <Fragment>
        {
          mode === "modal" &&
          <Input
            suffix={<Icon
              onClick={() => {
                if (latitude && longitude) {
                  this.setState({
                    position: {
                      latitude: latitude,
                      longitude: longitude
                    },
                    mapCenter: [longitude, latitude]
                  })
                }

                const path = this.props.path && JSON.parse(this.props.path);
                // 厂界
                if (handlePolygon && path) {
                  this.setState({
                    mapCenter: path[0] && path[0][0] && path[0][0][0],
                    path: path
                  })
                }
                this.setState({
                  mapVisible: true,
                })
              }}
              type="global"
              style={{ color: '#2db7f5', cursor: 'pointer' }}
            />}
            allowClear={true}
            {...this.props}
          />
        }
        {
          mode === "map" &&
          <div className={styles.mapContent} style={{ ...this.props.style }}>
            {this.renderMapContent()}
          </div>
        }

        <Modal
          visible={mapVisible}
          title="编辑位置信息"
          width="70%"
          destroyOnClose={true}// 清除上次数据
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
                this.setState({
                  position: {
                    latitude: undefined,
                    longitude: undefined
                  },
                  address: undefined,
                  polygon: [],
                  path: undefined
                })
              }}>清除全部</Button>

              {handleMarker && <Button style={{ marginLeft: 10 }} onClick={() => {
                this.setState({
                  isChangePos: true
                })
              }} className={styles.ClearButton}>设置经纬度</Button>}
              {
                handlePolygon &&
                <Button style={{ marginLeft: 10 }} onClick={this.drawPolygon} className={styles.ClearButton}>设置区域</Button>
              }
              <Input
                placeholder="搜索地址"
                // defaultValue={this.state.address}
                value={this.state.address}
                onChange={input => {
                  this.setState({
                    address: input.target.value
                  })
                }}
                onPressEnter={value => this.onSearch(value)}
                style={{ width: 300, marginLeft: 10 }}
              />
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

SdlMap.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
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
  mode: "modal",
  zoom: 13
}

export default SdlMap;
