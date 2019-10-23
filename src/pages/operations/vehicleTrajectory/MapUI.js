/*
 * @Author: Jiaqi
 * @Date: 2019-10-22 17:12:24
 * @Last Modified by:   Jiaqi
 * @Last Modified time: 2019-10-22 17:12:24
 * @desc: 车辆轨迹地图ui
 */
import React, { Component } from 'react';
import { Table, Card, Tag, Row, DatePicker, Radio, Button, Icon } from 'antd';
import { Map, Marker, Polygon } from 'react-amap';
import { connect } from 'dva'


@connect(({ loading, operations }) => ({
  longlatList: operations.longlatList,
  speedList: operations.speedList,
  recordingTimeList: operations.recordingTimeList,
}))
class MapUI extends Component {
  constructor() {
    super();
    this.loadUI();
    this.state = {
      pauseDisabled: true,
      resumeDisabled: true,
      reloadDisabled: true
    }
    this._SELF_ = {
      navg: undefined,
    }
  }

  loadUI = () => {
    window.AMapUI.loadUI(['misc/PathSimplifier'], (PathSimplifier) => {
      if (!PathSimplifier.supportCanvas) {
        alert('当前环境不支持 Canvas！');
        return;
      }
      this.setState({
        PathSimplifier: PathSimplifier
      })
      //启动页面
      this.initPage(PathSimplifier);
    });
  }

  initPage(PathSimplifier) {
    //创建组件实例
    const map = this.props.__map__;
    var pathSimplifierIns = new PathSimplifier({
      zIndex: 100,
      map: map, //所属的地图实例
      getPath: function (pathData, pathIndex) {
        //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
        return pathData.path;
      },
      getHoverTitle: function (pathData, pathIndex, pointIndex) {
        //返回鼠标悬停时显示的信息
        if (pointIndex >= 0) {
          //鼠标悬停在某个轨迹节点上
          return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
        }
        //鼠标悬停在节点之间的连线上
        return pathData.name + '，点数量' + pathData.path.length;
      },
      renderOptions: {
        //轨迹线的样式
        pathLineStyle: {
          strokeStyle: '#05d825',
          lineWidth: 6,
          dirArrowStyle: true
        }
      }
    });

    pathSimplifierIns.setData([{
      name: '轨迹0',
      path: this.props.longlatList
    }]);

    this.setState({
      pathSimplifierIns: pathSimplifierIns
    })
  }

  navigatorChange = (e) => {
    let { navg } = this._SELF_;
    let map = this.props.__map__;
    const that = this;
    const { speedList, recordingTimeList } = this.props;
    const { pathSimplifierIns, PathSimplifier } = this.state;
    // let navg = undefined;
    const val = e.target.value;
    switch (val) {
      case "start":
      case "reload":
        let speed = 100;
        if (navg) {
          navg.marker.setContent("<div></div>");
          navg.destroy();
        }
        navg = pathSimplifierIns.createPathNavigator(0, //关联第1条轨迹
          {
            loop: false, //循环播放
            speed: speed,
            pathNavigatorStyle: {
              // autoRotate: false,
              width: 16,
              height: 30,
              //使用图片
              content: PathSimplifier.Render.Canvas.getImageContent('/car.png', onload, onerror),
              // strokeStyle: null,
              // fillStyle: null,
              // //经过路径的样式
              // pathLinePassedStyle: {
              //   lineWidth: 6,
              //   strokeStyle: 'black',
              //   dirArrowStyle: {
              //     stepSpace: 15,
              //     strokeStyle: 'red'
              //   }
              // }
            }
          });

        navg.start();
        navg.marker = new window.AMap.Marker({
          offset: new window.AMap.Pixel(12, -10),
          map: map,
        });
        navg.on('move', function () {
          navg.marker.setPosition(navg.getPosition());
          navg.setSpeed(speedList[navg.getCursor().idx])
          navg.marker.setContent(
            `<div class='markerContent'>
              速度：${speedList[navg.getCursor().idx]}km/h <br />
              里程：** <br />
              信号：${recordingTimeList[navg.getCursor().idx]} <br />
              运行：**
            </div>`
          )
        });
        this._SELF_.navg = navg;
        this.setState({
          pauseDisabled: false,
          resumeDisabled: true,
          reloadDisabled: false,
        })
        break;
      case "pause":
        this._SELF_.navg.pause();
        this.setState({
          resumeDisabled: false
        })
        break;
      case "resume":
        this._SELF_.navg.resume();
        break;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.longlatList !== nextProps.longlatList) {
      // const { pathSimplifierIns } = this.state;
      // pathSimplifierIns && pathSimplifierIns.setData([{
      //   name: '轨迹0',
      //   path: nextProps.longlatList
      // }]);
    }
  }

  render() {
    const { pauseDisabled, resumeDisabled, reloadDisabled } = this.state;
    return <div>
      <div style={{ position: "absolute", top: '20px', left: '150px' }}>
        <Radio.Group defaultValue="a" buttonStyle="solid" defaultValue={undefined} onChange={(e) => {
          this.navigatorChange(e);
        }}>
          <Radio.Button value="start">开始巡航</Radio.Button>
          <Radio.Button value="pause" disabled={pauseDisabled}>暂停</Radio.Button>
          <Radio.Button value="resume" disabled={resumeDisabled}>恢复</Radio.Button>
          <Radio.Button value="reload" disabled={reloadDisabled}>重新播放</Radio.Button>
        </Radio.Group>
      </div>
      <Button style={{ position: "absolute", top: '20px', left: '20px' }} onClick={() => {
        history.go(-1)
      }}>
        <Icon type="left" />
        返回
      </Button>
    </div>
  }
}

export default MapUI;
