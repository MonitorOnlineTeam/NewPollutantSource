
import React from 'react';
import PropTypes, { array } from 'prop-types';
import { Spin,Button,Input } from 'antd';
import axios from 'axios';
import $script from 'scriptjs';
import styles from './MapContent.less';

const googleMapSdk = 'https://maps.googleapis.com/maps/api/js?key=your key';
const gaodeMapSdk = 'https://webapi.amap.com/maps?v=1.4.12&key=5e60171b820065e7e9a1d6ea45abaee9';


let map = null;
let marker = null;
let geocoder = null;
let Longitude = null;
let Latitude = null;
let zoomLevel = 15;
let mouseTool=null;
let newpoint = new Array();
let originalPolygon=new Array();
class MapContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            address:""
        };
    }

    componentWillMount() {
        if (!window.AMap && !(window.google && window.google.maps)) {
            axios.get(googleMapSdk, {timeout: 1000}).then(res => {
                $script([googleMapSdk], (a, b) => {});
            }).catch((error) => {

                $script([gaodeMapSdk], (a, b) => {});
            });
        }
    }

    componentDidMount() {
        let _this = this;
        function listenerStorage() {
            originalPolygon=new Array();
            if (window.AMap) {
                if (window.AMap) {
                    let {longitude, latitude, getMapAddress,polygon,mapCenter,EditMarker,
                        EditPolygon} = _this.props;
                    originalPolygon=polygon;
                    let latlngxy = [];// 默认北京天安门
                    if(!mapCenter&&mapCenter===0) {
                        mapCenter=[116.397428,39.90923];
                    }

                    if(longitude&&latitude) {
                        mapCenter=[longitude,latitude];
                    }

                    map = new window.AMap.Map('allmap', {
                        resizeEnable: true,
                        center: mapCenter,
                        zoom: zoomLevel,
                    });

                    // 高德设置语言    ['en', 'zh_en', 'zh_cn']
                    let mapLang;
                    if (window.localStorage.getItem('i18n') === 'en_US') {
                        mapLang = 'en';
                    } else {
                        mapLang = 'zh_cn';
                    }
                    map.setLang(mapLang);
                    if(longitude&&latitude&&EditMarker) {
                        latlngxy=[longitude,latitude];
                        // 在新中心点添加 marker
                        marker = new window.AMap.Marker({
                            map: map,
                            position: latlngxy
                        });
                    }

                    //加载地图绘制工具
                    map.plugin(['AMap.MouseTool'], () => {
                        mouseTool = new window.AMap.MouseTool(map);
                    });

                    //默认加载的面
                    if (originalPolygon&&EditPolygon) {
                        let arr = eval(originalPolygon);
                        let setZoomXY=[];
                        for (let i = 0; i < arr.length; i++) {
                            if(i===0) {
                                setZoomXY=[arr[i][0][0],arr[i][0][1]];
                            }
                            const polygons = new window.AMap.Polygon({
                                path: arr[i][0],//设置多边形边界路径
                                strokeColor: "#FF33FF", //线颜色
                                strokeOpacity: 0.2, //线透明度
                                strokeWeight: 3, //线宽
                                fillColor: "#1791fc", //填充色
                                fillOpacity: 0.35,//填充透明度
                                bubble: true
                            });
                            polygons.setMap(map);
                        }
                        // if(setZoomXY.length>0) {
                        //     const currentZoom = map.getZoom();
                        //     map.setZoomAndCenter(currentZoom !== zoomLevel ? currentZoom : zoomLevel, setZoomXY);
                        // }

                    }
                }
                _this.setState({
                    status: 1
                });
            } else {
                setTimeout(() => {
                    listenerStorage();
                }, 500);
            }
        }
        listenerStorage();
    }

    //开启绘制面功能
     clickPolygon=()=> {
         const {getMapPolygon}=this.props;
         const _this=this;
         //调用前先清除所有绘图工具的方法
         this.remove();
         mouseTool.polygon(); //用鼠标工具画多边形
         let arr = [];
         AMap.event.addListener(mouseTool, 'draw', (e) => { //添加事件
             let gaodei = new Array();
             for (let i = 0; i < e.obj.getPath().length; i++) {
                 let garr = new Array();
                 garr.push(e.obj.getPath()[i].lng);
                 garr.push(e.obj.getPath()[i].lat);
                 gaodei.push(garr);
             }
             newpoint.push(gaodei);
             _this.getAllPolygon();
         });
     }

    //回调坐标集合
    getAllPolygon=()=>{
        //原本有点坐标集合
        const {getMapPolygon } =this.props;
        let coordinatesetArray = new Array();
        if(originalPolygon) {
            const allRings=eval(originalPolygon);
            coordinatesetArray=allRings;
        }
        //新添加的集合
        if (newpoint && newpoint.length > 0) {
            for (let tep = 0; tep < newpoint.length; tep++) {
                let tempring = new Array();
                tempring.push(newpoint[tep]);
                coordinatesetArray.push(tempring);
            }
        }
        let arr = [];
        for (let key in coordinatesetArray) {
            arr.push(coordinatesetArray[key]);
        }
        const coordinateset = this.json2string(arr);
        getMapPolygon && getMapPolygon(coordinateset);
    }


    //开启编辑点位
     clickMarker=()=> {
         //调用前先清除所有绘图工具的方法
         this.remove();
         map.on('click', this.callBackFn);
     }

    callBackFn = (e)=> {
        const {getMapMarker,getMapAddress}=this.props;
        //保证只有一个点位
        if (marker != null) {
            map.remove(marker);
        }
        const point=[e.lnglat.getLng(), e.lnglat.getLat()];
        marker = new AMap.Marker({
            map: map,
            position: point
        });
        let that=this;
        if (window.AMap) {
            window.AMap.service('AMap.Geocoder', () => { // 回调函数
            // 实例化Geocoder
                geocoder = new window.AMap.Geocoder({});
                geocoder.getAddress(point, (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        that.setState({
                            address:result.regeocode.formattedAddress
                        });
                        getMapAddress&&getMapAddress(result.regeocode.formattedAddress);
                    }
                });
            });
        }
        getMapMarker && getMapMarker(point);

    };

    //重置所有绘图工具
      remove=()=> {
          map.off('click', this.callBackFn);
          mouseTool.close(false);
      };

    //js 转换
    json2string=(jsonObj)=>{
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
            case "String": rs = `"${ jsonObj }"`; break;
            case "Array":
                rs = "";
                for (let i = 0, len = jsonObj.length; i < len; i++) {
                    rs += `${this.json2string(jsonObj[i]) },`;
                }
                rs = `[${ rs.slice(0, -1) }]`;
                break;

            case "Object":
                rs = [];
                for (let k in jsonObj) {
                    rs.push(`"${ k.toString() }":${ this.json2string(jsonObj[k])}`);
                }
                rs = `{${ rs.join(",") }}`;
                break;
        }
        return rs;
    }


      componentWillReceiveProps=(nextProps) => {
          if (window.AMap && nextProps.address && nextProps.address !== this.props.address) {
              window.AMap.service('AMap.Geocoder', () => { // 回调函数
                  // 实例化Geocoder
                  geocoder = new window.AMap.Geocoder({});
                  geocoder.getLocation(nextProps.address, (status, result) => {
                      if (status === 'complete' && result.info === 'OK') {
                          let latlng = result.geocodes[0].location;
                          // 设置缩放级别和中心点
                          let latlngxy = [latlng.lng, latlng.lat];
                          const currentZoom = map.getZoom();
                          map.setZoomAndCenter(currentZoom !== zoomLevel ? currentZoom : zoomLevel, latlngxy);
                      }
                  });
              });
          }
      }

  //清除地图
  clearMap=()=>{
      //清空数据
      const {getMapPolygon,getMapMarker,EditMarker,
          EditPolygon }=this.props;
      newpoint=new Array();
      originalPolygon=new Array();
      EditPolygon&&getMapPolygon && getMapPolygon(null);
      EditMarker&&getMapMarker && getMapMarker(null);
      map.clearMap();
      //   this.setState({address:''});
      this.remove();

  }

  onSearch =(obj)=>{
      if (window.AMap) {
          window.AMap.service('AMap.Geocoder', () => { // 回调函数
              // 实例化Geocoder
              geocoder = new window.AMap.Geocoder({});
              geocoder.getLocation(obj.target.value, (status, result) => {
                  if (status === 'complete' && result.info === 'OK') {
                      let latlng = result.geocodes[0].location;
                      // 设置缩放级别和中心点
                      let latlngxy = [latlng.lng, latlng.lat];
                      const currentZoom = map.getZoom();
                      map.setZoomAndCenter(currentZoom !== zoomLevel ? currentZoom : zoomLevel, latlngxy);
                      //this.props.getMapAddress(latlng);
                  }else{
                      // this.setState({
                      //     address:""
                      // })
                  }
              });
          });
      }

  }

  onChange =(obj)=>{
      this.setState({
          address:obj.target.value
      });
  }

  render() {
      const { mapHeight, EditMarker,
          EditPolygon } = this.props;
      if(EditMarker) {
          if(map&&mouseTool)
              this.clickMarker();
      }
      if(EditPolygon) {
          if(map&&mouseTool)
              this.clickPolygon();
      }
      const allcoo=eval(originalPolygon);
      return (
          <div className={styles.mapContent} style={{height: mapHeight}}>
              <Spin spinning={this.state.status === 0} tip="Loading...">
                  <div id="allmap" style={{height: mapHeight}}>
                      <div className={styles.mouseTool}>
                          <Button onClick={this.clearMap} className={styles.ClearButton}>清除全部</Button>
                          {
                              EditMarker&&<Button style={{marginLeft:10}} onClick={this.clickMarker} className={styles.ClearButton}>设置经纬度</Button>
                          }
                          {
                              EditPolygon&&<Button style={{marginLeft:10}} onClick={this.clickPolygon} className={styles.ClearButton}>设置坐标集合</Button>
                          }
                          {/* <Button style={{marginLeft:10}} onClick={this.clickPolygon} className={styles.ClearButton}>设置坐标集合</Button>
                          <Button style={{marginLeft:10}} onClick={this.clickMarker} className={styles.ClearButton}>设置经纬度</Button> */}
                          <Input
                              placeholder="搜索地址"
                              value={this.state.address}
                              onChange={value => this.onChange(value)}
                              onPressEnter={value => this.onSearch(value)}
                              style={{ width: 300,marginLeft:10 }}
                          />
                      </div>

                  </div>
              </Spin>
          </div>
      );
  }
}

MapContent.defaultProps={
    mapCenter:[116.397428,39.90923],
    zoom:15,
    drawMarker:false,
    markers:[],
    mapHeight:300
};

MapContent.propTypes = {
    // longitude
    longitude: PropTypes.number,
    // latitude
    latitude: PropTypes.number,
    // onClickMarkers
    getMapMarker:PropTypes.func,
    getMapPolygon:PropTypes.func,
    getMapAddress:PropTypes.func,
    drawMarker:PropTypes.bool,
    markers:PropTypes.array

};

export default MapContent;

