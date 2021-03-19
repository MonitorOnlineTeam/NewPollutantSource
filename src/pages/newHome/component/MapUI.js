import React, { PureComponent } from 'react';
import { Button, Card, Checkbox, Row, Col } from 'antd'
import { Map, Marker, Polygon } from '@/components/ReactAmap';
import $ from "jquery";
import styles from '../index.less'

let currentAreaNode = null;
let $tipMarkerContent = null;
var colors = [
  "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
  "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
  "#651067", "#329262", "#5574a6", "#3b3eac"
];

class MapUI extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.loadUI();
  }

  componentDidMount() {
    //全国
    // this.switch2AreaNode(100000);
  }


  loadUI = () => {
    console.log("window.AMapUI=", window.AMapUI)
    window.AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
      currentAreaNode = null;
      this.setState({
        DistrictExplorer: DistrictExplorer
      })
      this.initPage(DistrictExplorer);
    });
  }

  initPage = (DistrictExplorer) => {
    //创建一个实例
    const map = this.props.__map__;
    var districtExplorer = new DistrictExplorer({
      eventSupport: true,
      map: map //关联的地图实例
    });

    //鼠标hover提示内容
    $tipMarkerContent = $('<div style=" transform:translate(-50%,-110%); white-space:nowrap;color:#555;background-color:rgba(255,254,239,0.8);border: 1px solid #7E7E7E;padding: 2px 6px;font-size: 12px; width: auto;" class="tipMarker top"></div>');
    // $tipMarkerContent = <div className={`${styles.tipMarker} ${styles.top}`}></div>;

    var tipMarker = new window.AMap.Marker({
      content: $tipMarkerContent.get(0),
      // content: $tipMarkerContent,
      offset: new window.AMap.Pixel(0, 0),
      bubble: true
    });


    var adcode = 100000; //全国的区划编码
    this.setState({
      districtExplorer: districtExplorer,
      tipMarker: tipMarker
    }, () => {
    this.switch2AreaNode(650000);
    })
    let that = this;
    //feature被点击
    districtExplorer.on('featureClick', function (e, feature) {

      // var props = feature.properties;
      // console.log("e=", e)
      // console.log("feature=", feature)
      // that.props.featureOnClick(feature)
      // //如果存在子节点
      // // if (props.childrenNum > 0) {
      // that.switch2AreaNode(props.adcode);
      // // }
    });

    //监听feature的hover事件
    districtExplorer.on('featureMouseout featureMouseover', function (e, feature) {
      if (e.type === 'featureMouseover') {
        that.props.featureMouseover && that.props.featureMouseover(feature.properties.adcode)
      }
      // console.log('feature=', feature)
      that.toggleHoverFeature(feature, e.type === 'featureMouseover',
        e.originalEvent ? e.originalEvent.lnglat : null);
    });

    // 外部区域被点击
    // districtExplorer.on('outsideClick', function (e) {
    //   districtExplorer.locatePosition(e.originalEvent.lnglat, function (error, routeFeatures) {
    //     if (routeFeatures && routeFeatures.length > 1) {
    //       //切换到省级区域
    //       that.switch2AreaNode(routeFeatures[1].properties.adcode);
    //     } else {
    //       //切换到全国
    //       that.switch2AreaNode(100000);
    //     }

    //   }, {
    //     levelLimit: 2
    //   });
    // });

    // 监听鼠标在feature上滑动
    // districtExplorer.on('featureMousemove', function (e, feature) {
    //   console.log("e1=", e)
    //   console.log("feature=", feature)
    //   //更新提示位置
    //   tipMarker.setPosition(e.originalEvent.lnglat);
    // });
  }


  //根据Hover状态设置相关样式
  toggleHoverFeature = (feature, isHover, position) => {
    const { districtExplorer, tipMarker } = this.state;
    const map = this.props.__map__;
    tipMarker.setMap(isHover ? map : null);

    if (!feature) {
      return;
    }

    var props = feature.properties;

    // if (isHover) {
    //   //更新提示内容
    //   $tipMarkerContent.html(props.name);
    //   //更新位置
    //   tipMarker.setPosition(position || props.center);
    // }

    // $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').toggleClass('hover', isHover);

    //更新相关多边形的样式
    var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
    for (var i = 0, len = polys.length; i < len; i++) {
      polys[i].setOptions({
        fillOpacity: isHover ? 0.4 : 0.2,
        // fillColor: isHover ? "#f2e232" : "#f7f6f0"
        fillColor: isHover ? "#f7f6f0" : "#f7f6f0"
      });
    }
  }

  loadAreaNode = (adcode, districtExplorer) => {
    let that = this;
    districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
      if (error) {
        console.error(error);
        return;
      }
      //绘制载入的区划节点
      that.renderAreaNode(districtExplorer, areaNode);
    });
  }

  //绘制载入的区划节点
  renderAreaNode = (districtExplorer, areaNode) => {
    let map = this.props.__map__;
    //清除已有的绘制内容
    districtExplorer.clearFeaturePolygons();

    //just some colors

    //绘制子级区划
    districtExplorer.renderSubFeatures(areaNode, function (feature, i) {

      var fillColor = colors[i % colors.length];
      var strokeColor = colors[colors.length - 1 - i % colors.length];

      return {
        cursor: 'default',
        bubble: true,
        // strokeColor: strokeColor, //线颜色
        strokeColor: "#5da4e3", //线颜色
        strokeOpacity: 0.1, //线透明度
        strokeWeight: 0, //线宽
        // fillColor: fillColor, //填充色
        fillColor: "#f4f4f4", //填充色
        fillOpacity: 0.35, //填充透明度
      };
    });

    //绘制父级区划，仅用黑色描边
    districtExplorer.renderParentFeature(areaNode, {
      cursor: 'default',
      bubble: true,
      // strokeColor: 'black', //线颜色
      strokeColor: '#485f9e', //线颜色
      fillColor: null,
      strokeWeight: 0, //线宽
    });

    //更新地图视野以适合区划面
    map.setFitView(districtExplorer.getAllFeaturePolygons());
  }


  //切换区域
  switch2AreaNode = (adcode, callback) => {
    const { districtExplorer } = this.state;
    if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
      return;
    }
    let that = this;
    this.loadAreaNode(adcode, function (error, areaNode) {
      if (error) {
        if (callback) {
          callback(error);
        }
        return;
      }

      currentAreaNode = window.currentAreaNode = areaNode;

      //设置当前使用的定位用节点
      districtExplorer.setAreaNodesForLocating([currentAreaNode]);

      that.refreshAreaNode(areaNode);

      if (callback) {
        callback(null, areaNode);
      }
    });
  }

  //加载区域
  loadAreaNode = (adcode, callback) => {
    const { districtExplorer } = this.state;
    districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
      if (error) {
        if (callback) {
          callback(error);
        }
        console.error(error);
        return;
      }
      // renderAreaPanel(areaNode);
      if (callback) {
        callback(null, areaNode);
      }
    });
  }

  //切换区域后刷新显示内容
  refreshAreaNode = (areaNode) => {
    const { districtExplorer } = this.state;
    districtExplorer.setHoverFeature(null);
    this.renderAreaPolygons(areaNode);
  }

  renderAreaPolygons = (areaNode) => {
    let map = this.props.__map__;
    const { districtExplorer } = this.state;
    //更新地图视野
    map.setBounds(areaNode.getBounds(), null, null, true);

    //清除已有的绘制内容
    districtExplorer.clearFeaturePolygons();

    //绘制子区域
    districtExplorer.renderSubFeatures(areaNode, function (feature, i) {
      var fillColor = colors[i % colors.length];
      var strokeColor = colors[colors.length - 1 - i % colors.length];
      return {
        cursor: 'default',
        bubble: true,
        strokeColor: "#3c500c", //线颜色
        // strokeColor: "#0f509f", //线颜色
        // strokeColor: "#e8cab0", //线颜色
        strokeOpacity: 0.1, //线透明度
        strokeWeight: 0, //线宽
        // fillColor: fillColor, //填充色
        fillColor: "#f7f6f0", //填充色
        // fillColor: "#f4f4f4", //填充色
        fillOpacity: 0.35, //填充透明度 
      };
    });
    //绘制父区域 
    districtExplorer.renderParentFeature(areaNode, {
      cursor: 'default',
      bubble: true,
      strokeColor: '#3c500c', //线颜色
      // strokeColor: '#485f9e', //线颜色
      strokeOpacity: 0.1, //线透明度
      strokeWeight: 0, //线宽
      fillColor: areaNode.getSubFeatures().length ? null : colors[0], //填充色
      // fillColor: areaNode.getSubFeatures().length ? null : "blue", //填充色
      fillOpacity: 0.35, //填充透明度
    });
    map.setFitView(districtExplorer.getAllFeaturePolygons());
  }

  //填充某个节点的子区域列表
  renderAreaPanel = (areaNode) => {
    var props = areaNode.getProps();
    var subFeatures = areaNode.getSubFeatures();
    // //填充子区域
    // for (var i = 0, len = subFeatures.length; i < len; i++) {
    //   renderAreaPanelNode($subBox, areaNode.getPropsOfFeature(subFeatures[i]), colors[i % colors.length]);
    // }
  }


  render() {
    // return <Button type="primary" style={{
    //   position: "absolute",
    //   top: 10,
    //   right: 352
    // }} onClick={() => {
    //   this.props.renderEnt()
    // }}>返回上一级</Button>;

    return null
  }
}

export default MapUI;