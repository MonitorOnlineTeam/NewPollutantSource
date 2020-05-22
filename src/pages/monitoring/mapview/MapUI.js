import React, { PureComponent } from 'react';
import { Button, Card, Checkbox, Row, Col } from 'antd'
import { Map, Marker, Polygon } from '@/components/ReactAmap';
import { connect } from 'dva';


@connect(({ loading, global }) => ({
  configInfo: global.configInfo,
}))
class MapUI extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.loadUI();
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.configInfo !== nextProps.configInfo) {
      this.loadUI();
    }
  }

  loadUI = () => {
    window.AMapUI && window.AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
      this.setState({
        DistrictExplorer: DistrictExplorer
      })
      this.initPage(DistrictExplorer);
    });
  }

  initPage = (DistrictExplorer) => {
    const map = this.props.__map__;
    //创建一个实例
    var districtExplorer = new DistrictExplorer({
      map: map //关联的地图实例
    });

    var adcode = this.props.configInfo.RegionCode; //全国的区划编码
    const that = this;
    districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
      if (error) {
        console.error(error);
        return;
      }
      //绘制载入的区划节点
      that.renderAreaNode(districtExplorer, areaNode);
    });
  }

  renderAreaNode = (districtExplorer, areaNode) => {
    let map = this.props.__map__;
    //清除已有的绘制内容
    districtExplorer.clearFeaturePolygons();
    //just some colors
    var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00"];
    //绘制子级区划
    districtExplorer.renderSubFeatures(areaNode, function (feature, i) {

      var fillColor = colors[i % colors.length];
      var strokeColor = colors[colors.length - 1 - i % colors.length];

      return {
        cursor: 'default',
        bubble: true,
        // strokeColor: strokeColor, //线颜色
        strokeColor: "#5da4e3", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 2, //线宽
        // fillColor: fillColor, //填充色
        fillColor: "#f7f6f0", //填充色
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
      strokeWeight: 3, //线宽
    });

    //更新地图视野以适合区划面
    // map.setFitView(districtExplorer.getAllFeaturePolygons());
  }
  render() {
    return null;
  }
}

export default MapUI;
